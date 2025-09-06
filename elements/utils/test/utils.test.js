import { fixture, expect } from "@open-wc/testing";
import { 
  badJSEventAttributes,
  removeBadJSEventAttributes,
  copyToClipboard,
  b64toBlob,
  CSVtoArray,
  cleanVideoSource,
  lightChildrenToShadowRootSelector,
  normalizeEventPath,
  localStorageGet,
  mimeTypeToName,
  localStorageSet,
  localStorageDelete,
  utf2Html,
  htmlEntities,
  isElementInViewport,
  getRange,
  internalGetShadowSelection,
  ReplaceWithPolyfill
} from "../utils.js";

describe("Utils test", () => {

  // Security and sanitization function tests
  describe("Security Functions", () => {
    it("exports badJSEventAttributes array with dangerous event handlers", async () => {
      expect(badJSEventAttributes).to.be.an('array');
      expect(badJSEventAttributes.length).to.be.greaterThan(50);
      expect(badJSEventAttributes).to.include('onclick');
      expect(badJSEventAttributes).to.include('onload');
      expect(badJSEventAttributes).to.include('onerror');
      expect(badJSEventAttributes).to.include('onmouseover');
    });

    it("removeBadJSEventAttributes removes dangerous event handlers from element", async () => {
      const div = document.createElement('div');
      div.setAttribute('onclick', 'alert("xss")');
      div.setAttribute('onload', 'maliciousCode()');
      div.setAttribute('onerror', 'steal()');
      div.setAttribute('data-safe', 'keep-this');
      
      const cleaned = removeBadJSEventAttributes(div);
      
      expect(cleaned.hasAttribute('onclick')).to.be.false;
      expect(cleaned.hasAttribute('onload')).to.be.false;
      expect(cleaned.hasAttribute('onerror')).to.be.false;
      expect(cleaned.hasAttribute('data-safe')).to.be.true;
    });

    it("removeBadJSEventAttributes removes dangerous handlers from nested elements", async () => {
      const div = document.createElement('div');
      const span = document.createElement('span');
      span.setAttribute('onclick', 'alert("nested xss")');
      div.appendChild(span);
      
      removeBadJSEventAttributes(div);
      
      const nestedSpan = div.querySelector('span');
      expect(nestedSpan.hasAttribute('onclick')).to.be.false;
    });

    it("removeBadJSEventAttributes handles null/undefined elements gracefully", async () => {
      expect(() => removeBadJSEventAttributes(null)).to.not.throw;
      expect(() => removeBadJSEventAttributes(undefined)).to.not.throw;
      expect(removeBadJSEventAttributes(null)).to.be.null;
    });

    it("removeBadJSEventAttributes handles elements without attributes", async () => {
      const div = document.createElement('div');
      
      const result = removeBadJSEventAttributes(div);
      
      expect(result).to.equal(div);
      expect(() => removeBadJSEventAttributes(div)).to.not.throw;
    });
  });

  // Data conversion and processing function tests
  describe("Data Conversion Functions", () => {
    it("b64toBlob converts base64 to Blob correctly", async () => {
      const base64Data = "SGVsbG8gV29ybGQ="; // "Hello World" in base64
      const contentType = "text/plain";
      
      const blob = b64toBlob(base64Data, contentType);
      
      expect(blob).to.be.instanceOf(Blob);
      expect(blob.type).to.equal(contentType);
      expect(blob.size).to.be.greaterThan(0);
      
      // Verify content
      const text = await blob.text();
      expect(text).to.equal("Hello World");
    });

    it("b64toBlob handles empty base64 data", async () => {
      const blob = b64toBlob("", "text/plain");
      
      expect(blob).to.be.instanceOf(Blob);
      expect(blob.size).to.equal(0);
    });

    it("b64toBlob uses default parameters", async () => {
      const base64Data = "SGVsbG8="; // "Hello"
      
      const blob = b64toBlob(base64Data);
      
      expect(blob).to.be.instanceOf(Blob);
      expect(blob.type).to.equal("");
    });

    it("b64toBlob handles custom slice size", async () => {
      const base64Data = "SGVsbG8gV29ybGQgVGVzdA=="; // "Hello World Test"
      
      const blob = b64toBlob(base64Data, "text/plain", 4);
      
      expect(blob).to.be.instanceOf(Blob);
      expect(blob.type).to.equal("text/plain");
    });

    it("CSVtoArray parses simple CSV correctly", async () => {
      const csv = "name,age,city\nJohn,30,New York\nJane,25,Boston";
      
      const result = CSVtoArray(csv);
      
      expect(result).to.be.an('array');
      expect(result).to.have.length(3);
      expect(result[0]).to.deep.equal(["name", "age", "city"]);
      expect(result[1]).to.deep.equal(["John", "30", "New York"]);
      expect(result[2]).to.deep.equal(["Jane", "25", "Boston"]);
    });

    it("CSVtoArray handles CSV with quoted values", async () => {
      const csv = 'name,description\n"John Doe","A person with, comma"\n"Jane Smith","Another ""quoted"" person"';
      
      const result = CSVtoArray(csv);
      
      expect(result[1][0]).to.equal("John Doe");
      expect(result[1][1]).to.equal("A person with, comma");
      expect(result[2][1]).to.equal('Another "quoted" person');
    });

    it("CSVtoArray handles empty CSV", async () => {
      const result = CSVtoArray("");
      
      expect(result).to.be.an('array');
      expect(result).to.have.length(1);
      expect(result[0]).to.deep.equal([""]);
    });

    it("CSVtoArray handles CSV with carriage returns", async () => {
      const csv = "a,b\r\nc,d\r\n";
      
      const result = CSVtoArray(csv);
      
      expect(result).to.have.length(3);
      expect(result[0]).to.deep.equal(["a", "b"]);
      expect(result[1]).to.deep.equal(["c", "d"]);
    });

    it("utf2Html converts UTF-8 characters to HTML entities", async () => {
      const input = "café & naïve";
      
      const result = utf2Html(input);
      
      expect(result).to.include("caf&#233;");
      expect(result).to.include("&amp;");
      expect(result).to.include("na&#239;ve");
    });

    it("htmlEntities converts HTML special characters", async () => {
      const input = '<script>alert("xss")</script> & "quotes"';
      
      const result = htmlEntities(input);
      
      expect(result).to.include("&lt;script&gt;");
      expect(result).to.include("&lt;/script&gt;");
      expect(result).to.include("&amp;");
      expect(result).to.include("&quot;quotes&quot;");
    });

    it("htmlEntities handles empty strings", async () => {
      expect(htmlEntities("")).to.equal("");
      expect(htmlEntities(null)).to.equal("");
      expect(htmlEntities(undefined)).to.equal("");
    });
  });

  // Video source cleaning tests
  describe("Video Source Cleaning", () => {
    it("cleanVideoSource handles YouTube URLs", async () => {
      const youtubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      
      const result = cleanVideoSource(youtubeUrl);
      
      expect(result).to.include("youtube");
      expect(result).to.include("dQw4w9WgXcQ");
    });

    it("cleanVideoSource handles Vimeo URLs", async () => {
      const vimeoUrl = "https://vimeo.com/123456789";
      
      const result = cleanVideoSource(vimeoUrl);
      
      expect(result).to.include("vimeo");
    });

    it("cleanVideoSource removes query parameters", async () => {
      const urlWithParams = "https://example.com/video.mp4?autoplay=1&mute=1";
      
      const result = cleanVideoSource(urlWithParams);
      
      expect(result).to.not.include("autoplay");
      expect(result).to.not.include("mute");
    });

    it("cleanVideoSource handles URLs without query parameters", async () => {
      const cleanUrl = "https://example.com/video.mp4";
      
      const result = cleanVideoSource(cleanUrl);
      
      expect(result).to.equal(cleanUrl);
    });
  });

  // Clipboard functionality tests (mocked for testing environment)
  describe("Clipboard Functions", () => {
    let originalNavigator;
    let originalDispatchEvent;

    beforeEach(() => {
      originalNavigator = globalThis.navigator;
      originalDispatchEvent = globalThis.dispatchEvent;
    });

    afterEach(() => {
      globalThis.navigator = originalNavigator;
      globalThis.dispatchEvent = originalDispatchEvent;
    });

    it("copyToClipboard copies text and shows toast on success", async () => {
      const mockClipboard = {
        writeText: async (text) => Promise.resolve()
      };
      globalThis.navigator = { clipboard: mockClipboard };

      let toastEvent = null;
      globalThis.dispatchEvent = (event) => {
        if (event.type === 'simple-toast-show') {
          toastEvent = event;
        }
      };

      const testValue = "Test clipboard text";
      await copyToClipboard(testValue);

      expect(toastEvent).to.not.be.null;
      expect(toastEvent.detail.text).to.include(testValue);
      expect(toastEvent.detail.duration).to.equal(5000);
    });

    it("copyToClipboard handles clipboard API failures", async () => {
      const mockClipboard = {
        writeText: async (text) => Promise.reject(new Error("Permission denied"))
      };
      globalThis.navigator = { clipboard: mockClipboard };

      let toastEvent = null;
      globalThis.dispatchEvent = (event) => {
        if (event.type === 'simple-toast-show') {
          toastEvent = event;
        }
      };

      await copyToClipboard("test");

      expect(toastEvent).to.not.be.null;
      expect(toastEvent.detail.text).to.include("Failed to authorize");
    });

    it("copyToClipboard uses custom message", async () => {
      const mockClipboard = {
        writeText: async (text) => Promise.resolve()
      };
      globalThis.navigator = { clipboard: mockClipboard };

      let toastEvent = null;
      globalThis.dispatchEvent = (event) => {
        if (event.type === 'simple-toast-show') {
          toastEvent = event;
        }
      };

      const customMessage = "Custom copy message";
      await copyToClipboard("test", customMessage);

      expect(toastEvent.detail.text).to.equal(customMessage);
    });

    it("copyToClipboard uses HAXCMSToast when available", async () => {
      const mockClipboard = {
        writeText: async (text) => Promise.resolve()
      };
      globalThis.navigator = { clipboard: mockClipboard };
      globalThis.HAXCMSToast = true;

      let toastEvent = null;
      globalThis.dispatchEvent = (event) => {
        toastEvent = event;
      };

      await copyToClipboard("test");

      expect(toastEvent.type).to.equal("haxcms-toast-show");

      delete globalThis.HAXCMSToast;
    });
  });

  // Local storage utilities tests
  describe("LocalStorage Functions", () => {
    beforeEach(() => {
      // Clear localStorage before each test
      globalThis.localStorage.clear();
    });

    it("localStorageSet stores value correctly", async () => {
      const key = "testKey";
      const value = { data: "test", number: 42 };
      
      localStorageSet(key, value);
      
      const stored = JSON.parse(globalThis.localStorage.getItem(key));
      expect(stored).to.deep.equal(value);
    });

    it("localStorageGet retrieves stored value", async () => {
      const key = "testKey";
      const value = { data: "test" };
      globalThis.localStorage.setItem(key, JSON.stringify(value));
      
      const retrieved = localStorageGet(key);
      
      expect(retrieved).to.deep.equal(value);
    });

    it("localStorageGet returns default value when key doesn't exist", async () => {
      const defaultValue = "default";
      
      const result = localStorageGet("nonexistentKey", defaultValue);
      
      expect(result).to.equal(defaultValue);
    });

    it("localStorageGet handles JSON parse errors", async () => {
      const key = "corruptedKey";
      globalThis.localStorage.setItem(key, "invalid json {");
      
      const result = localStorageGet(key, "default");
      
      expect(result).to.equal("default");
    });

    it("localStorageDelete removes stored value", async () => {
      const key = "testKey";
      globalThis.localStorage.setItem(key, "test value");
      
      localStorageDelete(key);
      
      expect(globalThis.localStorage.getItem(key)).to.be.null;
    });
  });

  // MIME type utilities tests
  describe("MIME Type Functions", () => {
    it("mimeTypeToName converts common MIME types", async () => {
      expect(mimeTypeToName("image/jpeg")).to.equal("JPEG Image");
      expect(mimeTypeToName("image/png")).to.equal("PNG Image");
      expect(mimeTypeToName("text/plain")).to.equal("Text Document");
      expect(mimeTypeToName("application/pdf")).to.equal("PDF Document");
    });

    it("mimeTypeToName handles unknown MIME types", async () => {
      const result = mimeTypeToName("application/unknown-type");
      expect(result).to.include("unknown-type");
    });

    it("mimeTypeToName handles empty/null input", async () => {
      expect(mimeTypeToName("")).to.equal("Unknown");
      expect(mimeTypeToName(null)).to.equal("Unknown");
      expect(mimeTypeToName(undefined)).to.equal("Unknown");
    });
  });

  // DOM utility tests
  describe("DOM Utilities", () => {
    it("lightChildrenToShadowRootSelector finds elements in light DOM", async () => {
      const container = document.createElement('div');
      const child = document.createElement('p');
      child.className = 'test-class';
      child.textContent = 'Test content';
      container.appendChild(child);
      
      const result = lightChildrenToShadowRootSelector(container, '.test-class');
      
      expect(result).to.exist;
      expect(result.textContent).to.equal('Test content');
    });

    it("lightChildrenToShadowRootSelector returns null when no match", async () => {
      const container = document.createElement('div');
      
      const result = lightChildrenToShadowRootSelector(container, '.nonexistent');
      
      expect(result).to.be.null;
    });

    it("normalizeEventPath handles events with path", async () => {
      const event = {
        path: [document.createElement('div'), document.body]
      };
      
      const result = normalizeEventPath(event);
      
      expect(result).to.equal(event.path);
    });

    it("normalizeEventPath handles events with composedPath", async () => {
      const path = [document.createElement('div'), document.body];
      const event = {
        composedPath: () => path
      };
      
      const result = normalizeEventPath(event);
      
      expect(result).to.equal(path);
    });

    it("normalizeEventPath handles events without path info", async () => {
      const target = document.createElement('div');
      const event = { target };
      
      const result = normalizeEventPath(event);
      
      expect(result).to.deep.equal([target]);
    });
  });

  // Viewport detection tests
  describe("Viewport Functions", () => {
    it("isElementInViewport detects elements in viewport", async () => {
      const element = document.createElement('div');
      // Mock getBoundingClientRect
      element.getBoundingClientRect = () => ({
        top: 100,
        left: 100,
        bottom: 200,
        right: 200
      });
      
      // Mock window dimensions
      Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
      Object.defineProperty(window, 'innerWidth', { value: 1200, configurable: true });
      
      const result = isElementInViewport(element);
      
      expect(result).to.be.true;
    });

    it("isElementInViewport detects elements outside viewport", async () => {
      const element = document.createElement('div');
      element.getBoundingClientRect = () => ({
        top: -100,
        left: -100,
        bottom: -50,
        right: -50
      });
      
      const result = isElementInViewport(element);
      
      expect(result).to.be.false;
    });

    it("isElementInViewport handles threshold parameter", async () => {
      const element = document.createElement('div');
      element.getBoundingClientRect = () => ({
        top: 10,
        left: 10,
        bottom: 50,
        right: 50
      });
      
      const result = isElementInViewport(element, 0.5);
      
      expect(result).to.be.a('boolean');
    });
  });

  // Selection and range utilities tests
  describe("Selection Utilities", () => {
    it("getRange gets current selection range", async () => {
      // Create a simple text node for testing
      const textNode = document.createTextNode("Test selection text");
      document.body.appendChild(textNode);
      
      // Create a range
      const range = document.createRange();
      range.selectNode(textNode);
      
      // Mock selection
      const mockSelection = {
        rangeCount: 1,
        getRangeAt: (index) => range
      };
      
      const result = getRange({ getSelection: () => mockSelection });
      
      expect(result).to.equal(range);
      
      // Cleanup
      document.body.removeChild(textNode);
    });

    it("getRange handles no selection", async () => {
      const mockSelection = {
        rangeCount: 0
      };
      
      const result = getRange({ getSelection: () => mockSelection });
      
      expect(result).to.be.false;
    });

    it("internalGetShadowSelection finds selection in shadow DOM", async () => {
      const mockRoot = {
        getSelection: () => ({
          rangeCount: 1,
          getRangeAt: (index) => document.createRange()
        })
      };
      
      const result = internalGetShadowSelection(mockRoot);
      
      expect(result).to.exist;
    });
  });

  // Polyfill tests
  describe("Polyfills", () => {
    it("ReplaceWithPolyfill adds replaceWith method when missing", async () => {
      // Create a mock element without replaceWith
      const mockElement = {
        parentNode: {
          insertBefore: (newNode, refNode) => {},
          removeChild: (node) => {}
        }
      };
      
      // Apply polyfill
      ReplaceWithPolyfill();
      
      // Check that Element.prototype.replaceWith exists
      expect(Element.prototype.replaceWith).to.be.a('function');
    });

    it("ReplaceWithPolyfill doesn't override existing replaceWith", async () => {
      const originalReplaceWith = Element.prototype.replaceWith;
      
      ReplaceWithPolyfill();
      
      expect(Element.prototype.replaceWith).to.equal(originalReplaceWith);
    });
  });

  // Error handling and edge cases
  describe("Error Handling", () => {
    it("handles null/undefined inputs gracefully across functions", async () => {
      expect(() => CSVtoArray(null)).to.not.throw;
      expect(() => htmlEntities(null)).to.not.throw;
      expect(() => utf2Html(undefined)).to.not.throw;
      expect(() => cleanVideoSource("")).to.not.throw;
    });

    it("handles malformed data gracefully", async () => {
      expect(() => CSVtoArray("malformed,csv\ndata")).to.not.throw;
      expect(() => b64toBlob("not-base64")).to.throw;
      expect(() => localStorageGet("key", null)).to.not.throw;
    });

    it("provides sensible defaults", async () => {
      expect(localStorageGet("nonexistent")).to.equal("");
      expect(mimeTypeToName("")).to.equal("Unknown");
      expect(htmlEntities(null)).to.equal("");
    });
  });

  // Integration and performance tests
  describe("Integration Tests", () => {
    it("combines multiple utilities correctly", async () => {
      // Test a workflow that uses multiple utilities
      const csvData = "name,age\nJohn,30\nJane,25";
      const parsedData = CSVtoArray(csvData);
      
      // Store in localStorage
      localStorageSet("csvData", parsedData);
      
      // Retrieve and verify
      const retrieved = localStorageGet("csvData");
      expect(retrieved).to.deep.equal(parsedData);
      
      // Clean up
      localStorageDelete("csvData");
      expect(localStorageGet("csvData")).to.equal("");
    });

    it("handles large datasets efficiently", async () => {
      // Test with larger CSV
      let largeCsv = "id,name,description\n";
      for (let i = 0; i < 100; i++) {
        largeCsv += `${i},"Name ${i}","Description for item ${i}"\n`;
      }
      
      const start = performance.now();
      const result = CSVtoArray(largeCsv);
      const end = performance.now();
      
      expect(result).to.have.length(101); // Header + 100 rows
      expect(end - start).to.be.lessThan(1000); // Should complete within 1 second
    });

    it("maintains data integrity through conversions", async () => {
      const originalData = "Hello, World! This is a test with special chars: <>&\"'";
      
      // HTML entities conversion
      const htmlEncoded = htmlEntities(originalData);
      expect(htmlEncoded).to.not.equal(originalData);
      expect(htmlEncoded).to.include("&lt;");
      expect(htmlEncoded).to.include("&gt;");
      expect(htmlEncoded).to.include("&amp;");
      expect(htmlEncoded).to.include("&quot;");
    });

    it("handles security scenarios correctly", async () => {
      const maliciousElement = document.createElement('div');
      maliciousElement.innerHTML = '<img src="x" onerror="alert(\'xss\')" onclick="steal()">';
      
      const cleaned = removeBadJSEventAttributes(maliciousElement);
      
      expect(cleaned.innerHTML).to.not.include('onerror=');
      expect(cleaned.innerHTML).to.not.include('onclick=');
      expect(cleaned.querySelector('img')).to.exist; // Image should still be there
      expect(cleaned.querySelector('img').hasAttribute('onerror')).to.be.false;
    });
  });

  // Performance and memory tests
  describe("Performance Tests", () => {
    it("handles repeated localStorage operations efficiently", async () => {
      const start = performance.now();
      
      for (let i = 0; i < 100; i++) {
        localStorageSet(`key${i}`, { value: i, data: `test${i}` });
      }
      
      for (let i = 0; i < 100; i++) {
        const value = localStorageGet(`key${i}`);
        expect(value.value).to.equal(i);
      }
      
      for (let i = 0; i < 100; i++) {
        localStorageDelete(`key${i}`);
      }
      
      const end = performance.now();
      expect(end - start).to.be.lessThan(1000); // Should complete within 1 second
    });

    it("handles large base64 conversions", async () => {
      // Create a larger base64 string
      const largeText = "Large test content ".repeat(1000);
      const base64Data = btoa(largeText);
      
      const start = performance.now();
      const blob = b64toBlob(base64Data, "text/plain");
      const end = performance.now();
      
      expect(blob.size).to.be.greaterThan(10000);
      expect(end - start).to.be.lessThan(1000);
    });
  });
});
