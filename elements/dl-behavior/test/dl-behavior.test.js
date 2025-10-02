import { fixture, expect, html } from "@open-wc/testing";
import { LitElement } from "lit";
import { MtzFileDownloadBehaviors } from "../dl-behavior.js";

// Create a test element that uses the mixin
class TestDownloadElement extends MtzFileDownloadBehaviors(LitElement) {
  static get tag() {
    return "test-download-element";
  }

  render() {
    return html`<div>Test element with download behavior</div>`;
  }
}
customElements.define(TestDownloadElement.tag, TestDownloadElement);

describe("MtzFileDownloadBehaviors mixin test", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(
      html`<test-download-element></test-download-element>`,
    );
    await element.updateComplete;
  });

  // Basic functionality tests
  it("instantiates element with download behavior mixin", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("test-download-element");
  });

  it("has fileTypes property with correct MIME types", async () => {
    expect(element.fileTypes).to.exist;
    expect(element.fileTypes.CSV).to.equal("text/csv");
    expect(element.fileTypes.JSON).to.equal("text/json");
    expect(element.fileTypes.PDF).to.equal("application/pdf");
    expect(element.fileTypes.TXT).to.equal("text/plain");
    expect(element.fileTypes.HTML).to.equal("text/html");
  });

  // Download behavior tests
  it("has downloadFromData method", async () => {
    expect(element.downloadFromData).to.be.a("function");
  });

  it("has downloadFromURI method", async () => {
    expect(element.downloadFromURI).to.be.a("function");
  });

  // File type validation tests
  it("supports all expected file types", async () => {
    const expectedTypes = ["CSV", "JSON", "PDF", "TXT", "HTML"];
    expectedTypes.forEach((type) => {
      expect(element.fileTypes).to.have.property(type);
      expect(element.fileTypes[type]).to.be.a("string");
      expect(element.fileTypes[type]).to.include("/");
    });
  });

  // Mock download functionality tests
  it("downloadFromURI opens window with correct parameters", async () => {
    // Mock globalThis.open
    const originalOpen = globalThis.open;
    let openCalled = false;
    let openUrl = "";
    let openTarget = "";

    globalThis.open = (url, target) => {
      openCalled = true;
      openUrl = url;
      openTarget = target;
      return { focus: () => {} }; // Mock window object
    };

    const result = element.downloadFromURI(
      "https://example.com/file.pdf",
      true,
    );

    expect(result).to.be.true;
    expect(openCalled).to.be.true;
    expect(openUrl).to.equal("https://example.com/file.pdf");
    expect(openTarget).to.equal("_blank");

    // Test with newTab = false
    element.downloadFromURI("https://example.com/file.pdf", false);
    expect(openTarget).to.equal("_self");

    // Restore original function
    globalThis.open = originalOpen;
  });

  it("downloadFromData creates blob with correct MIME type", async () => {
    // Mock Blob constructor
    const originalBlob = globalThis.Blob;
    let blobData = null;
    let blobOptions = null;

    globalThis.Blob = function (data, options) {
      blobData = data;
      blobOptions = options;
      return {
        size: data[0].length,
        type: options.type,
      };
    };

    // Mock URL.createObjectURL
    const originalCreateObjectURL = globalThis.URL?.createObjectURL;
    globalThis.URL = globalThis.URL || {};
    globalThis.URL.createObjectURL = () => "blob:mock-url";

    // Mock document.createElement and related methods
    const originalCreateElement = globalThis.document.createElement;
    const mockLink = {
      href: "",
      download: "",
      target: "",
      click: () => {},
      parentNode: null,
    };

    globalThis.document.createElement = (tagName) => {
      if (tagName === "a") {
        return mockLink;
      }
      return originalCreateElement.call(globalThis.document, tagName);
    };

    // Mock appendChild and removeChild
    element.appendChild = () => {};
    element.removeChild = () => {};

    element.downloadFromData("test,data,csv", "CSV", "testfile");

    expect(blobOptions.type).to.equal("text/csv");
    expect(blobData[0]).to.include("test,data,csv");
    expect(mockLink.download).to.equal("testfile.csv");

    // Restore original functions
    globalThis.Blob = originalBlob;
    if (originalCreateObjectURL) {
      globalThis.URL.createObjectURL = originalCreateObjectURL;
    }
    globalThis.document.createElement = originalCreateElement;
  });

  // Edge cases and error handling
  it("handles different file types correctly", async () => {
    const testCases = [
      { type: "json", expected: "text/json" },
      { type: "PDF", expected: "application/pdf" },
      { type: "txt", expected: "text/plain" },
      { type: "Html", expected: "text/html" },
    ];

    testCases.forEach((testCase) => {
      const mimeType = element.fileTypes[testCase.type.toUpperCase()];
      expect(mimeType).to.equal(testCase.expected);
    });
  });

  it("handles empty data gracefully", async () => {
    // Setup mocks
    const originalBlob = globalThis.Blob;
    let blobCreated = false;

    globalThis.Blob = function (data, options) {
      blobCreated = true;
      return { size: 0, type: options.type };
    };

    globalThis.URL = globalThis.URL || {};
    globalThis.URL.createObjectURL = () => "blob:mock-url";

    const originalCreateElement = globalThis.document.createElement;
    globalThis.document.createElement = () => ({
      href: "",
      download: "",
      target: "",
      click: () => {},
      parentNode: null,
    });

    element.appendChild = () => {};
    element.removeChild = () => {};

    element.downloadFromData("", "TXT", "empty");
    expect(blobCreated).to.be.true;

    // Restore
    globalThis.Blob = originalBlob;
    globalThis.document.createElement = originalCreateElement;
  });

  it("handles special characters in filenames", async () => {
    // Setup mocks
    globalThis.Blob = function () {
      return { size: 0, type: "text/plain" };
    };
    globalThis.URL = globalThis.URL || {};
    globalThis.URL.createObjectURL = () => "blob:mock-url";

    const mockLink = {
      href: "",
      download: "",
      target: "",
      click: () => {},
    };

    globalThis.document.createElement = () => mockLink;
    element.appendChild = () => {};
    element.removeChild = () => {};

    element.downloadFromData("test data", "TXT", "file with spaces & symbols");
    expect(mockLink.download).to.equal("file with spaces & symbols.txt");
  });

  it("uses default filename when name not provided", async () => {
    // Setup mocks
    globalThis.Blob = function () {
      return { size: 0, type: "text/plain" };
    };
    globalThis.URL = globalThis.URL || {};
    globalThis.URL.createObjectURL = () => "blob:mock-url";

    const mockLink = {
      href: "",
      download: "",
      target: "",
      click: () => {},
    };

    globalThis.document.createElement = () => mockLink;
    element.appendChild = () => {};
    element.removeChild = () => {};

    element.downloadFromData("test data", "TXT");
    expect(mockLink.download).to.equal("download.txt");
  });

  // IE/Legacy browser support tests
  it("handles IE msSaveOrOpenBlob when available", async () => {
    // Mock navigator.msSaveOrOpenBlob
    const originalNavigator = globalThis.navigator;
    let msSaveOrOpenBlobCalled = false;
    let savedBlob = null;
    let savedFilename = "";

    globalThis.navigator = {
      msSaveOrOpenBlob: (blob, filename) => {
        msSaveOrOpenBlobCalled = true;
        savedBlob = blob;
        savedFilename = filename;
      },
    };

    globalThis.Blob = function (data, options) {
      return { data, options, size: data[0].length };
    };

    element.downloadFromData("test data", "TXT", "test");

    expect(msSaveOrOpenBlobCalled).to.be.true;
    expect(savedFilename).to.equal("test.txt");
    expect(savedBlob).to.exist;

    // Restore
    globalThis.navigator = originalNavigator;
  });

  // Accessibility tests
  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("maintains accessibility with download functionality", async () => {
    // Even with download capabilities, the element should remain accessible
    expect(element.downloadFromData).to.be.a("function");
    expect(element.downloadFromURI).to.be.a("function");

    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("dl-behavior passes accessibility test", async () => {
    const el = await fixture(html` <dl-behavior></dl-behavior> `);
    await expect(el).to.be.accessible();
  });
  it("dl-behavior passes accessibility negation", async () => {
    const el = await fixture(
      html`<dl-behavior aria-labelledby="dl-behavior"></dl-behavior>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("dl-behavior can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<dl-behavior .foo=${'bar'}></dl-behavior>`);
    expect(el.foo).to.equal('bar');
  })
})
*/

/*
// Test if element is mobile responsive
describe('Test Mobile Responsiveness', () => {
    before(async () => {z   
      await setViewport({width: 375, height: 750});
    })
    it('sizes down to 360px', async () => {
      const el = await fixture(html`<dl-behavior ></dl-behavior>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('360px');
    })
}) */

/*
// Test if element sizes up for desktop behavior
describe('Test Desktop Responsiveness', () => {
    before(async () => {
      await setViewport({width: 1000, height: 1000});
    })
    it('sizes up to 410px', async () => {
      const el = await fixture(html`<dl-behavior></dl-behavior>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<dl-behavior></dl-behavior>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
