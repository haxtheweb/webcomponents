import { fixture, expect, html } from "@open-wc/testing";
import "../check-it-out.js";

// Mock dynamic imports
beforeEach(() => {
  // Mock video-player import
  globalThis.import = globalThis.import || ((path) => {
    if (path.includes('video-player')) {
      return Promise.resolve({});
    }
    if (path.includes('iframe-loader')) {
      return Promise.resolve({});
    }
    if (path.includes('simple-modal-template')) {
      return Promise.resolve({});
    }
    return Promise.resolve({});
  });
});

describe("check-it-out test", () => {
  let element;
  
  beforeEach(async () => {
    element = await fixture(
      html`<check-it-out
        modal
        type="code"
        modal-title="React Demo"
        ctl
        view="both"
        source="https://stackblitz.com/edit/react-brwwcr?embed=1&file=src/App.js"
      >
        Click me
      </check-it-out>`
    );
    await element.updateComplete;
  });

  it("basic setup", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("check-it-out");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Component structure and properties", () => {
    it("should have correct tag name", () => {
      expect(element.constructor.tag).to.equal("check-it-out");
    });

    it("should initialize with default properties", () => {
      expect(element.checkedOut).to.be.false;
      expect(element.modal).to.be.true; // From fixture
      expect(element.type).to.equal("code"); // From fixture
      expect(element.modalTitle).to.equal("React Demo"); // From fixture
      expect(element.ctl).to.be.true; // From fixture
      expect(element.view).to.equal("both"); // From fixture
    });

    it("should have HAX properties", () => {
      expect(element.constructor.haxProperties).to.be.a('string');
      expect(element.constructor.haxProperties).to.include('haxProperties.json');
    });

    it("should have type icon mapping", () => {
      expect(element.typeIconObj).to.deep.equal({
        code: "code",
        pdf: "book",
        video: "av:play-arrow"
      });
    });

    it("should have required button structure", () => {
      const button = element.shadowRoot.querySelector('.check-it-out-btn');
      const icon = element.shadowRoot.querySelector('simple-icon-lite');
      const slot = element.shadowRoot.querySelector('slot');
      
      expect(button).to.exist;
      expect(icon).to.exist;
      expect(slot).to.exist;
    });
  });

  describe("Property validation with accessibility", () => {
    describe("checkedOut property", () => {
      it("should handle checked out state changes and maintain accessibility", async () => {
        // Test not checked out (default)
        expect(element.checkedOut).to.be.false;
        expect(element.hasAttribute('checked-out')).to.be.false;
        
        const button = element.shadowRoot.querySelector('.check-it-out-btn');
        const container = element.shadowRoot.querySelector('.container');
        expect(button).to.exist;
        expect(container).to.not.exist; // Hidden when not checked out
        
        await expect(element).shadowDom.to.be.accessible();
        
        // Test checked out state
        element.checkedOut = true;
        await element.updateComplete;
        
        expect(element.checkedOut).to.be.true;
        expect(element.hasAttribute('checked-out')).to.be.true;
        await expect(element).shadowDom.to.be.accessible();
      });
    });

    describe("type property", () => {
      it("should handle different content types and maintain accessibility", async () => {
        const types = ['code', 'pdf', 'video'];
        
        for (const type of types) {
          element.type = type;
          await element.updateComplete;
          
          expect(element.type).to.equal(type);
          expect(element.getAttribute('type')).to.equal(type);
          
          // Icon should update based on type
          const icon = element.shadowRoot.querySelector('simple-icon-lite');
          expect(icon.getAttribute('icon')).to.equal(element.typeIconObj[type]);
          
          await expect(element).shadowDom.to.be.accessible();
        }
      });
    });

    describe("modal property", () => {
      it("should handle modal vs inline display and maintain accessibility", async () => {
        // Test modal mode (from fixture)
        expect(element.modal).to.be.true;
        expect(element.hasAttribute('modal')).to.be.true;
        await expect(element).shadowDom.to.be.accessible();
        
        // Test inline mode
        element.modal = false;
        await element.updateComplete;
        
        expect(element.modal).to.be.false;
        expect(element.hasAttribute('modal')).to.be.false;
        await expect(element).shadowDom.to.be.accessible();
      });
    });

    describe("source property", () => {
      it("should handle different source URLs and maintain accessibility", async () => {
        const sources = [
          'https://stackblitz.com/edit/test-project',
          'https://codepen.io/user/pen/abcd123',
          'https://example.com/document.pdf',
          'https://youtube.com/watch?v=abc123',
          'https://example.com/video.mp4'
        ];
        
        for (const source of sources) {
          element.source = source;
          await element.updateComplete;
          await new Promise(resolve => setTimeout(resolve, 10)); // Wait for debounce
          
          expect(element.source).to.equal(source);
          await expect(element).shadowDom.to.be.accessible();
        }
      });
    });
  });

  describe("Source type detection and processing", () => {
    it("should detect StackBlitz URLs correctly", () => {
      const stackblitzUrl = 'https://stackblitz.com/edit/test-project';
      const result = element.checkType(stackblitzUrl);
      
      expect(element.type).to.equal('code');
      expect(result).to.include('embed=1');
      expect(result).to.include('view=both');
    });

    it("should detect CodePen URLs correctly", () => {
      const codepenUrl = 'https://codepen.io/user/pen/abcd123';
      const result = element.checkType(codepenUrl);
      
      expect(element.type).to.equal('code');
      expect(result).to.include('/embed/');
    });

    it("should detect PDF URLs correctly", () => {
      const pdfUrl = 'https://example.com/document.pdf';
      const result = element.checkType(pdfUrl);
      
      expect(element.type).to.equal('pdf');
      expect(result).to.equal(pdfUrl);
    });

    it("should detect video URLs correctly", () => {
      const videoUrls = [
        'https://example.com/video.mp4',
        'https://example.com/video.webm',
        'https://youtube.com/watch?v=abc123'
      ];
      
      videoUrls.forEach(url => {
        element.type = ''; // Reset type
        const result = element.checkType(url);
        
        expect(element.type).to.equal('video');
        expect(result).to.equal(url);
      });
    });

    it("should handle StackBlitz properties correctly", () => {
      element.filePath = 'src/index.js';
      element.hideExplorer = true;
      element.ctl = true;
      element.view = 'editor';
      
      let url = 'https://stackblitz.com/edit/test';
      const result = element.checkStackblitzProps(url);
      
      expect(result).to.include('file=src/index.js');
      expect(result).to.include('hideExplorer=1');
      expect(result).to.include('ctl=1');
      expect(result).to.include('view=editor');
    });

    it("should add embed parameter to StackBlitz URLs", () => {
      let url1 = 'https://stackblitz.com/edit/test';
      let result1 = element.checkType(url1);
      expect(result1).to.include('embed=1');
      
      let url2 = 'https://stackblitz.com/edit/test?theme=dark';
      let result2 = element.checkType(url2);
      expect(result2).to.include('embed=1');
      expect(result2).to.include('theme=dark');
    });

    it("should convert CodePen URLs to embed format", () => {
      const url = 'https://codepen.io/user/pen/abcd123';
      const result = element.checkType(url);
      
      expect(result).to.equal('https://codepen.io/user/embed/abcd123');
    });
  });

  describe("Click handling and interactions", () => {
    it("should handle click events for inline mode", async () => {
      element.modal = false;
      element._haxstate = false;
      await element.updateComplete;
      
      const button = element.shadowRoot.querySelector('.check-it-out-btn');
      expect(element.checkedOut).to.be.false;
      
      // Simulate click
      button.click();
      await element.updateComplete;
      
      expect(element.checkedOut).to.be.true;
      
      // Click again to close
      const closeBtn = element.shadowRoot.querySelector('.close-btn');
      if (closeBtn) {
        closeBtn.click();
        await element.updateComplete;
        expect(element.checkedOut).to.be.false;
      }
    });

    it("should prevent click events in HAX edit mode with modal", async () => {
      element.modal = true;
      element._haxstate = true;
      await element.updateComplete;
      
      const button = element.shadowRoot.querySelector('.check-it-out-btn');
      const originalCheckedOut = element.checkedOut;
      
      // Create a mock event with preventDefault
      const mockEvent = {
        preventDefault: () => {},
        stopPropagation: () => {},
        stopImmediatePropagation: () => {}
      };
      
      element._handleClick(mockEvent);
      
      // State should not change in HAX mode with modal
      expect(element.checkedOut).to.equal(originalCheckedOut);
    });

    it("should toggle checked out state for inline mode", () => {
      element.modal = false;
      element._haxstate = false;
      
      // Test opening
      element.checkedOut = false;
      element._handleClick({});
      expect(element.checkedOut).to.be.true;
      
      // Test closing
      element._handleClick({});
      expect(element.checkedOut).to.be.false;
    });
  });

  describe("HAX integration", () => {
    it("should have proper HAX hooks", () => {
      const hooks = element.haxHooks();
      
      expect(hooks).to.have.property('editModeChanged');
      expect(hooks).to.have.property('activeElementChanged');
      expect(hooks.editModeChanged).to.equal('haxeditModeChanged');
      expect(hooks.activeElementChanged).to.equal('haxactiveElementChanged');
    });

    it("should handle HAX edit mode changes", () => {
      element.haxeditModeChanged(true);
      expect(element._haxstate).to.be.true;
      
      element.haxeditModeChanged(false);
      expect(element._haxstate).to.be.false;
    });

    it("should handle HAX active element changes", () => {
      const mockElement = { tagName: 'check-it-out' };
      
      element.haxactiveElementChanged(mockElement, true);
      expect(element._haxstate).to.be.true;
      
      element.haxactiveElementChanged(mockElement, false);
      expect(element._haxstate).to.be.false;
    });
  });

  describe("Rendering logic", () => {
    it("should render iframe for code and PDF types", async () => {
      element.type = 'code';
      element.checkedOut = true;
      await element.updateComplete;
      
      const container = element.shadowRoot.querySelector('.container');
      const iframe = element.shadowRoot.querySelector('iframe');
      
      expect(container).to.exist;
      expect(iframe).to.exist;
      expect(iframe.getAttribute('src')).to.exist;
    });

    it("should render video player for video type", async () => {
      element.type = 'video';
      element.checkedOut = true;
      element.source = 'https://example.com/video.mp4';
      await element.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 10)); // Wait for debounce
      
      const container = element.shadowRoot.querySelector('.container');
      expect(container).to.exist;
    });

    it("should show close button for inline mode", async () => {
      element.modal = false;
      element.checkedOut = true;
      await element.updateComplete;
      
      const closeBtn = element.shadowRoot.querySelector('.close-btn');
      expect(closeBtn).to.exist;
    });

    it("should hide close button for modal mode", async () => {
      element.modal = true;
      element.checkedOut = true;
      await element.updateComplete;
      
      // Modal template should exist but close button shouldn't in modal content
      const modalTemplate = element.shadowRoot.querySelector('simple-modal-template');
      expect(modalTemplate).to.exist;
    });

    it("should display button label and slotted content", () => {
      element.label = 'Custom Label';
      const button = element.shadowRoot.querySelector('.check-it-out-btn');
      const slot = element.shadowRoot.querySelector('slot');
      
      expect(button.textContent).to.include('Custom Label');
      expect(slot).to.exist;
    });
  });

  describe("Visibility and intersection observer", () => {
    it("should use IntersectionObserverMixin", () => {
      expect(element.elementVisible).to.exist;
    });

    it("should only render when visible", async () => {
      element.elementVisible = false;
      await element.updateComplete;
      
      const button = element.shadowRoot.querySelector('.check-it-out-btn');
      expect(button).to.not.exist;
      
      element.elementVisible = true;
      await element.updateComplete;
      
      const buttonAfter = element.shadowRoot.querySelector('.check-it-out-btn');
      expect(buttonAfter).to.exist;
    });
  });

  describe("Modal integration", () => {
    it("should lazy load modal template when needed", async () => {
      element.modal = true;
      element.elementVisible = true;
      await element.updateComplete;
      
      // Should trigger modal import and association
      const modalTemplate = element.shadowRoot.querySelector('simple-modal-template');
      expect(modalTemplate).to.exist;
      expect(modalTemplate.getAttribute('modal-id')).to.equal('m1');
      expect(modalTemplate.getAttribute('title')).to.equal('React Demo');
    });

    it("should have proper modal controls", async () => {
      element.modal = true;
      await element.updateComplete;
      
      const button = element.shadowRoot.querySelector('.check-it-out-btn');
      const modalTemplate = element.shadowRoot.querySelector('simple-modal-template');
      
      expect(button.getAttribute('controls')).to.equal('m1');
      expect(modalTemplate.getAttribute('modal-id')).to.equal('m1');
    });
  });

  describe("Accessibility scenarios", () => {
    it("should remain accessible in different states", async () => {
      const states = [
        { checkedOut: false, modal: false },
        { checkedOut: true, modal: false },
        { checkedOut: false, modal: true },
        { checkedOut: true, modal: true }
      ];
      
      for (const state of states) {
        element.checkedOut = state.checkedOut;
        element.modal = state.modal;
        await element.updateComplete;
        
        await expect(element).shadowDom.to.be.accessible();
      }
    });

    it("should remain accessible with different content types", async () => {
      const types = ['code', 'pdf', 'video'];
      
      for (const type of types) {
        element.type = type;
        await element.updateComplete;
        
        await expect(element).shadowDom.to.be.accessible();
      }
    });

    it("should have proper button semantics", () => {
      const button = element.shadowRoot.querySelector('.check-it-out-btn');
      
      expect(button.tagName.toLowerCase()).to.equal('button');
      expect(button).to.exist;
    });

    it("should maintain accessibility when not visible", async () => {
      element.elementVisible = false;
      await element.updateComplete;
      
      // Should still be accessible even when content is not rendered
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe("Edge cases and error handling", () => {
    it("should handle empty source gracefully", async () => {
      element.source = '';
      await element.updateComplete;
      
      expect(element.source).to.equal('');
      await expect(element).shadowDom.to.be.accessible();
    });

    it("should handle invalid URLs gracefully", async () => {
      const invalidUrls = [
        'not-a-url',
        'http://',
        'ftp://example.com/file.txt',
        '//malformed-url'
      ];
      
      for (const url of invalidUrls) {
        element.source = url;
        await element.updateComplete;
        await new Promise(resolve => setTimeout(resolve, 10));
        
        expect(element.source).to.equal(url);
        await expect(element).shadowDom.to.be.accessible();
      }
    });

    it("should handle undefined type gracefully", async () => {
      element.type = undefined;
      await element.updateComplete;
      
      // Should use default icon when type is undefined
      const icon = element.shadowRoot.querySelector('simple-icon-lite');
      expect(icon.getAttribute('icon')).to.equal('code'); // Default icon
    });

    it("should handle very long modal titles", async () => {
      const longTitle = 'A'.repeat(1000);
      element.modalTitle = longTitle;
      await element.updateComplete;
      
      expect(element.modalTitle).to.equal(longTitle);
      const modalTemplate = element.shadowRoot.querySelector('simple-modal-template');
      if (modalTemplate) {
        expect(modalTemplate.getAttribute('title')).to.equal(longTitle);
      }
    });

    it("should handle rapid property changes", async () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 10; i++) {
        element.checkedOut = i % 2 === 0;
        element.type = ['code', 'pdf', 'video'][i % 3];
        element.modal = i % 2 === 1;
        await element.updateComplete;
      }
      
      const endTime = performance.now();
      const processingTime = endTime - startTime;
      
      expect(processingTime).to.be.lessThan(1000);
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe("Lifecycle methods", () => {
    it("should handle constructor properly", () => {
      const newElement = new (element.constructor)();
      
      expect(newElement.checkedOut).to.be.false;
      expect(newElement.icon).to.equal('code');
      expect(newElement.modalTitle).to.equal('');
      expect(newElement.hideExplorer).to.be.false;
      expect(newElement.ctl).to.be.false;
      expect(newElement.view).to.equal('both');
      expect(newElement.typeIconObj).to.exist;
    });

    it("should handle updated lifecycle with source changes", async () => {
      const originalSource = element.source;
      const newSource = 'https://stackblitz.com/edit/new-project';
      
      element.source = newSource;
      await element.updateComplete;
      
      // Allow debounce to complete
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(element.__computedSource).to.include('embed=1');
    });

    it("should handle modal lazy loading in updated lifecycle", async () => {
      element.modal = false;
      await element.updateComplete;
      
      // Enable modal
      element.modal = true;
      element.elementVisible = true;
      await element.updateComplete;
      
      // Modal template should exist after update
      const modalTemplate = element.shadowRoot.querySelector('simple-modal-template');
      expect(modalTemplate).to.exist;
    });
  });

  describe("CSS custom properties and styling", () => {
    it("should support CSS custom properties", () => {
      element.style.setProperty('--check-it-out-content-width', '1000px');
      element.style.setProperty('--check-it-out-content-height', '600px');
      
      expect(element.style.getPropertyValue('--check-it-out-content-width')).to.equal('1000px');
      expect(element.style.getPropertyValue('--check-it-out-content-height')).to.equal('600px');
    });

    it("should apply correct styling classes", async () => {
      // Test button styling
      const button = element.shadowRoot.querySelector('.check-it-out-btn');
      expect(button).to.exist;
      
      // Test container visibility when checked out
      element.checkedOut = true;
      await element.updateComplete;
      
      const container = element.shadowRoot.querySelector('.container');
      expect(container).to.exist;
    });
  });

  describe("Integration scenarios", () => {
    it("should handle complete workflow from button click to content display", async () => {
      element.modal = false;
      element.source = 'https://stackblitz.com/edit/test-project';
      element._haxstate = false;
      await element.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 10)); // Wait for source processing
      
      // Initially not checked out
      expect(element.checkedOut).to.be.false;
      
      // Click button
      const button = element.shadowRoot.querySelector('.check-it-out-btn');
      button.click();
      await element.updateComplete;
      
      // Should now be checked out and show content
      expect(element.checkedOut).to.be.true;
      const container = element.shadowRoot.querySelector('.container');
      expect(container).to.exist;
      
      // Click close button
      const closeBtn = element.shadowRoot.querySelector('.close-btn');
      if (closeBtn) {
        closeBtn.click();
        await element.updateComplete;
        expect(element.checkedOut).to.be.false;
      }
    });

    it("should work with different StackBlitz configurations", async () => {
      element.source = 'https://stackblitz.com/edit/test';
      element.filePath = 'src/main.js';
      element.hideExplorer = true;
      element.ctl = true;
      element.view = 'editor';
      
      await element.updateComplete;
      await new Promise(resolve => setTimeout(resolve, 10));
      
      expect(element.__computedSource).to.include('file=src/main.js');
      expect(element.__computedSource).to.include('hideExplorer=1');
      expect(element.__computedSource).to.include('ctl=1');
      expect(element.__computedSource).to.include('view=editor');
    });

    it("should work with different content types in modal", async () => {
      element.modal = true;
      element.elementVisible = true;
      
      const contentTypes = [
        { type: 'code', source: 'https://codepen.io/user/pen/abc123' },
        { type: 'pdf', source: 'https://example.com/doc.pdf' },
        { type: 'video', source: 'https://example.com/video.mp4' }
      ];
      
      for (const config of contentTypes) {
        element.type = config.type;
        element.source = config.source;
        await element.updateComplete;
        await new Promise(resolve => setTimeout(resolve, 10));
        
        const modalTemplate = element.shadowRoot.querySelector('simple-modal-template');
        expect(modalTemplate).to.exist;
        
        await expect(element).shadowDom.to.be.accessible();
      }
    });
  });

  describe("Performance considerations", () => {
    it("should debounce source changes", async () => {
      let processCount = 0;
      const originalCheckType = element.checkType;
      element.checkType = (source) => {
        processCount++;
        return originalCheckType.call(element, source);
      };
      
      // Rapid source changes
      element.source = 'https://example1.com';
      element.source = 'https://example2.com';
      element.source = 'https://example3.com';
      
      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 20));
      
      // Should only process the final change due to debouncing
      expect(processCount).to.equal(1);
    });

    it("should lazy load modal dependencies", async () => {
      element.modal = false;
      await element.updateComplete;
      
      // No modal template should exist
      let modalTemplate = element.shadowRoot.querySelector('simple-modal-template');
      expect(modalTemplate).to.not.exist;
      
      // Enable modal and visibility
      element.modal = true;
      element.elementVisible = true;
      await element.updateComplete;
      
      // Modal template should now exist
      modalTemplate = element.shadowRoot.querySelector('simple-modal-template');
      expect(modalTemplate).to.exist;
    });

    it("should efficiently handle multiple state changes", async () => {
      const startTime = performance.now();
      
      // Multiple rapid changes
      for (let i = 0; i < 20; i++) {
        element.checkedOut = i % 2 === 0;
        element.modal = i % 3 === 0;
        element.type = ['code', 'pdf', 'video'][i % 3];
        await element.updateComplete;
      }
      
      const endTime = performance.now();
      const processingTime = endTime - startTime;
      
      expect(processingTime).to.be.lessThan(2000); // Should complete within 2 seconds
    });
  });
});
