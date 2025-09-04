import { fixture, expect, html } from "@open-wc/testing";
import "../beaker-broker.js";

// Mock DatArchive for testing
beforeEach(() => {
  // Mock DatArchive API
  globalThis.DatArchive = class MockDatArchive {
    constructor(url) {
      this.url = url;
      this.mockFiles = {
        'test.txt': 'Hello World',
        'index.html': '<html><body>Test</body></html>',
        'image.png': new ArrayBuffer(100), // Mock binary data
        'image.jpg': new ArrayBuffer(100)
      };
    }

    async writeFile(path, data) {
      this.mockFiles[path] = data;
      return Promise.resolve();
    }

    async readFile(path, encoding = 'utf8') {
      if (this.mockFiles[path] === undefined) {
        throw new Error(`File not found: ${path}`);
      }
      
      if (encoding === 'binary') {
        return Promise.resolve(this.mockFiles[path]);
      }
      
      return Promise.resolve(this.mockFiles[path]);
    }
  };

  // Mock location.host
  Object.defineProperty(globalThis.location, 'host', {
    get: () => 'example.com',
    configurable: true
  });

  // Mock URL.createObjectURL
  globalThis.URL = globalThis.URL || {};
  globalThis.URL.createObjectURL = (blob) => {
    return 'blob:mock-url-' + Math.random();
  };

  // Mock Blob
  globalThis.Blob = globalThis.Blob || class MockBlob {
    constructor(parts, options) {
      this.parts = parts;
      this.type = options ? options.type : '';
    }
  };
});

aftereEach(() => {
  // Clean up mocks
  delete globalThis.DatArchive;
});

describe("beaker-broker test", () => {
  let element;
  
  beforeEach(async () => {
    element = await fixture(html`<beaker-broker></beaker-broker>`);
    await element.updateComplete;
  });

  it("basic setup", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("beaker-broker");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Component structure and properties", () => {
    it("should have correct tag name", () => {
      expect(element.constructor.tag).to.equal("beaker-broker");
    });

    it("should initialize with default properties", () => {
      expect(element.datUrl).to.equal('example.com'); // From mocked location.host
      expect(element.archive).to.be.undefined; // Should be set after datUrl changes
    });

    it("should have slot for content", () => {
      const slot = element.shadowRoot.querySelector('slot');
      expect(slot).to.exist;
    });

    it("should have proper haxProperties", () => {
      expect(element.constructor.haxProperties).to.deep.equal({});
    });
  });

  describe("Property validation with accessibility", () => {
    describe("datUrl property", () => {
      it("should handle string URL values and maintain accessibility", async () => {
        const testUrls = [
          'dat://abc123.com',
          'example.com',
          'test-site.dat',
          'localhost:8080'
        ];
        
        for (const url of testUrls) {
          element.datUrl = url;
          await element.updateComplete;
          
          expect(element.datUrl).to.equal(url);
          expect(element.getAttribute('dat-url')).to.equal(url);
          await expect(element).shadowDom.to.be.accessible();
        }
      });

      it("should dispatch dat-url-changed event when datUrl changes", async () => {
        let eventFired = false;
        let eventDetail = null;
        
        element.addEventListener('dat-url-changed', (e) => {
          eventFired = true;
          eventDetail = e.detail;
        });
        
        element.datUrl = 'new-dat-url.com';
        await element.updateComplete;
        
        expect(eventFired).to.be.true;
        expect(eventDetail.value).to.equal('new-dat-url.com');
      });
    });

    describe("archive property", () => {
      it("should handle DatArchive objects and maintain accessibility", async () => {
        const mockArchive = new globalThis.DatArchive('test-url');
        element.archive = mockArchive;
        await element.updateComplete;
        
        expect(element.archive).to.equal(mockArchive);
        expect(element.archive.url).to.equal('test-url');
        await expect(element).shadowDom.to.be.accessible();
      });

      it("should dispatch archive-changed event when archive changes", async () => {
        let eventFired = false;
        let eventDetail = null;
        
        element.addEventListener('archive-changed', (e) => {
          eventFired = true;
          eventDetail = e.detail;
        });
        
        const mockArchive = new globalThis.DatArchive('test-url');
        element.archive = mockArchive;
        await element.updateComplete;
        
        expect(eventFired).to.be.true;
        expect(eventDetail.value).to.equal(mockArchive);
      });
    });
  });

  describe("Beaker Browser / DatArchive functionality", () => {
    it("should detect DatArchive availability", () => {
      // DatArchive should be available due to mock
      expect(globalThis.DatArchive).to.exist;
      expect(typeof globalThis.DatArchive).to.equal('function');
    });

    it("should create archive when datUrl changes", async () => {
      element.datUrl = 'test-dat-url.com';
      await element.updateComplete;
      
      expect(element.archive).to.exist;
      expect(element.archive.url).to.equal('test-dat-url.com');
    });

    it("should handle missing DatArchive gracefully", async () => {
      // Temporarily remove DatArchive
      const originalDatArchive = globalThis.DatArchive;
      delete globalThis.DatArchive;
      
      // Create new element without DatArchive
      const testElement = await fixture(html`<beaker-broker dat-url="test.com"></beaker-broker>`);
      await testElement.updateComplete;
      
      // Should not create archive
      expect(testElement.archive).to.be.undefined;
      
      // Restore DatArchive
      globalThis.DatArchive = originalDatArchive;
    });

    it("should warn when DatArchive is not available", async () => {
      // Mock console.warn to capture warnings
      let warningMessage = null;
      const originalWarn = globalThis.console.warn;
      globalThis.console.warn = (message) => {
        warningMessage = message;
      };
      
      // Remove DatArchive temporarily
      const originalDatArchive = globalThis.DatArchive;
      delete globalThis.DatArchive;
      
      // Create element and trigger firstUpdated
      const testElement = await fixture(html`<beaker-broker></beaker-broker>`);
      await testElement.updateComplete;
      
      expect(warningMessage).to.include('Beaker is not available');
      
      // Restore
      globalThis.DatArchive = originalDatArchive;
      globalThis.console.warn = originalWarn;
    });
  });

  describe("File operations", () => {
    beforeEach(async () => {
      // Ensure archive is set up
      element.datUrl = 'test-site.com';
      await element.updateComplete;
    });

    describe("write method", () => {
      it("should write files to archive", async () => {
        await element.write('test-file.txt', 'test content');
        
        // Verify file was written to mock archive
        expect(element.archive.mockFiles['test-file.txt']).to.equal('test content');
      });

      it("should handle various file types", async () => {
        const testFiles = [
          { path: 'text.txt', data: 'Plain text content' },
          { path: 'data.json', data: JSON.stringify({ key: 'value' }) },
          { path: 'markup.html', data: '<p>HTML content</p>' },
          { path: 'style.css', data: 'body { color: red; }' }
        ];

        for (const file of testFiles) {
          await element.write(file.path, file.data);
          expect(element.archive.mockFiles[file.path]).to.equal(file.data);
        }
      });

      it("should overwrite existing files", async () => {
        await element.write('overwrite-test.txt', 'original content');
        expect(element.archive.mockFiles['overwrite-test.txt']).to.equal('original content');
        
        await element.write('overwrite-test.txt', 'updated content');
        expect(element.archive.mockFiles['overwrite-test.txt']).to.equal('updated content');
      });
    });

    describe("read method", () => {
      it("should read text files by default", async () => {
        const content = await element.read('test.txt');
        expect(content).to.equal('Hello World');
      });

      it("should read HTML files", async () => {
        const content = await element.read('index.html');
        expect(content).to.equal('<html><body>Test</body></html>');
      });

      it("should handle PNG images", async () => {
        const imageUrl = await element.read('image.png', 'png');
        expect(imageUrl).to.include('blob:mock-url-');
      });

      it("should handle JPEG images", async () => {
        const imageUrl = await element.read('image.jpg', 'jpeg');
        expect(imageUrl).to.include('blob:mock-url-');
      });

      it("should handle JPG images", async () => {
        const imageUrl = await element.read('image.jpg', 'jpg');
        expect(imageUrl).to.include('blob:mock-url-');
      });

      it("should handle base64 encoding", async () => {
        // Set up base64 test data
        element.archive.mockFiles['base64-test.png'] = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
        
        const base64Data = await element.read('base64-test.png', 'base64');
        expect(base64Data).to.include('data:image/png;base64,');
      });

      it("should handle custom encoding types", async () => {
        element.archive.mockFiles['custom-file.txt'] = 'Custom content';
        
        const content = await element.read('custom-file.txt', 'utf8');
        expect(content).to.equal('Custom content');
      });

      it("should throw error for non-existent files", async () => {
        try {
          await element.read('non-existent.txt');
          expect.fail('Should have thrown an error');
        } catch (error) {
          expect(error.message).to.include('File not found');
        }
      });
    });
  });

  describe("Accessibility scenarios", () => {
    it("should remain accessible with different datUrl values", async () => {
      element.datUrl = 'dat://accessible-test.com';
      await element.updateComplete;
      
      await expect(element).shadowDom.to.be.accessible();
    });

    it("should remain accessible when archive is set", async () => {
      const mockArchive = new globalThis.DatArchive('accessibility-test');
      element.archive = mockArchive;
      await element.updateComplete;
      
      await expect(element).shadowDom.to.be.accessible();
    });

    it("should support slotted content accessibly", async () => {
      const elementWithContent = await fixture(
        html`<beaker-broker><p>Slotted content</p></beaker-broker>`
      );
      await elementWithContent.updateComplete;
      
      await expect(elementWithContent).shadowDom.to.be.accessible();
    });
  });

  describe("Edge cases and error handling", () => {
    it("should handle undefined datUrl gracefully", async () => {
      element.datUrl = undefined;
      await element.updateComplete;
      
      expect(element.datUrl).to.be.undefined;
      expect(element.archive).to.be.undefined;
      await expect(element).shadowDom.to.be.accessible();
    });

    it("should handle null datUrl gracefully", async () => {
      element.datUrl = null;
      await element.updateComplete;
      
      expect(element.datUrl).to.be.null;
      expect(element.archive).to.be.undefined;
      await expect(element).shadowDom.to.be.accessible();
    });

    it("should handle empty string datUrl", async () => {
      element.datUrl = '';
      await element.updateComplete;
      
      expect(element.datUrl).to.equal('');
      expect(element.archive).to.be.undefined;
    });

    it("should handle malformed URLs", async () => {
      const malformedUrls = [
        'not-a-url',
        '///invalid',
        'spaces in url.com',
        '!@#$%^&*()'
      ];

      for (const url of malformedUrls) {
        element.datUrl = url;
        await element.updateComplete;
        
        // Should still create archive in mock environment
        expect(element.archive).to.exist;
        expect(element.archive.url).to.equal(url);
        await expect(element).shadowDom.to.be.accessible();
      }
    });

    it("should handle archive creation errors gracefully", async () => {
      // Mock DatArchive to throw error
      const originalDatArchive = globalThis.DatArchive;
      globalThis.DatArchive = class ThrowingDatArchive {
        constructor() {
          throw new Error('Archive creation failed');
        }
      };

      // Should not throw error
      try {
        element.datUrl = 'error-test.com';
        await element.updateComplete;
        
        expect(element.archive).to.be.undefined;
      } catch (error) {
        expect.fail('Should handle archive creation errors gracefully');
      }

      // Restore original
      globalThis.DatArchive = originalDatArchive;
    });

    it("should handle write operations without archive", async () => {
      element.archive = undefined;
      
      try {
        await element.write('test.txt', 'content');
        expect.fail('Should throw error when no archive');
      } catch (error) {
        expect(error).to.exist;
      }
    });

    it("should handle read operations without archive", async () => {
      element.archive = undefined;
      
      try {
        await element.read('test.txt');
        expect.fail('Should throw error when no archive');
      } catch (error) {
        expect(error).to.exist;
      }
    });
  });

  describe("Lifecycle methods", () => {
    it("should handle constructor properly", () => {
      const newElement = new (element.constructor)();
      expect(newElement.datUrl).to.equal('example.com'); // From mocked location.host
    });

    it("should handle firstUpdated lifecycle", async () => {
      const testElement = await fixture(html`<beaker-broker></beaker-broker>`);
      await testElement.updateComplete;
      
      // firstUpdated should have been called
      expect(testElement).to.exist;
      expect(testElement.datUrl).to.equal('example.com');
    });

    it("should handle updated lifecycle with property changes", async () => {
      let archiveEventFired = false;
      let urlEventFired = false;
      
      element.addEventListener('archive-changed', () => {
        archiveEventFired = true;
      });
      
      element.addEventListener('dat-url-changed', () => {
        urlEventFired = true;
      });
      
      element.datUrl = 'lifecycle-test.com';
      await element.updateComplete;
      
      expect(urlEventFired).to.be.true;
      expect(archiveEventFired).to.be.true; // Archive should be created from datUrl
    });
  });

  describe("Integration and real-world scenarios", () => {
    it("should handle typical file management workflow", async () => {
      // Set up archive
      element.datUrl = 'workflow-test.com';
      await element.updateComplete;
      
      // Write several files
      await element.write('config.json', JSON.stringify({ version: '1.0' }));
      await element.write('index.html', '<html><head><title>Test</title></head><body></body></html>');
      await element.write('style.css', 'body { margin: 0; }');
      
      // Read files back
      const config = await element.read('config.json');
      const html = await element.read('index.html');
      const css = await element.read('style.css');
      
      expect(JSON.parse(config).version).to.equal('1.0');
      expect(html).to.include('<title>Test</title>');
      expect(css).to.include('margin: 0');
    });

    it("should handle multiple archive instances", async () => {
      // Create multiple broker instances
      const broker1 = await fixture(html`<beaker-broker dat-url="site1.com"></beaker-broker>`);
      const broker2 = await fixture(html`<beaker-broker dat-url="site2.com"></beaker-broker>`);
      
      await broker1.updateComplete;
      await broker2.updateComplete;
      
      // Each should have its own archive
      expect(broker1.archive.url).to.equal('site1.com');
      expect(broker2.archive.url).to.equal('site2.com');
      expect(broker1.archive).to.not.equal(broker2.archive);
    });

    it("should handle concurrent operations", async () => {
      element.datUrl = 'concurrent-test.com';
      await element.updateComplete;
      
      // Perform concurrent writes
      const writes = Promise.all([
        element.write('file1.txt', 'Content 1'),
        element.write('file2.txt', 'Content 2'),
        element.write('file3.txt', 'Content 3')
      ]);
      
      await writes;
      
      // Verify all files were written
      const content1 = await element.read('file1.txt');
      const content2 = await element.read('file2.txt');
      const content3 = await element.read('file3.txt');
      
      expect(content1).to.equal('Content 1');
      expect(content2).to.equal('Content 2');
      expect(content3).to.equal('Content 3');
    });
  });

  describe("Performance considerations", () => {
    it("should handle multiple property changes efficiently", async () => {
      const startTime = performance.now();
      
      // Rapid property changes
      for (let i = 0; i < 10; i++) {
        element.datUrl = `test-${i}.com`;
        await element.updateComplete;
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      expect(element.datUrl).to.equal('test-9.com');
      expect(totalTime).to.be.lessThan(1000); // Should complete quickly
    });

    it("should cleanup resources properly", async () => {
      element.datUrl = 'cleanup-test.com';
      await element.updateComplete;
      
      const originalArchive = element.archive;
      expect(originalArchive).to.exist;
      
      // Change to new URL should create new archive
      element.datUrl = 'new-cleanup-test.com';
      await element.updateComplete;
      
      expect(element.archive).to.not.equal(originalArchive);
      expect(element.archive.url).to.equal('new-cleanup-test.com');
    });
  });
});
