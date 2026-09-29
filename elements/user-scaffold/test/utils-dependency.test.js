import { fixture, expect, html } from "@open-wc/testing";
import "../user-scaffold.js";
// Direct imports of utils lib files to get istanbul to instrument them
import {
  badURLProtocols,
  hasUnsafeURLProtocol,
  sanitizeURLValue,
  sanitizeEmbeddableURL,
} from "@haxtheweb/utils/lib/url.js";
import { isWebKit, isSafari } from "@haxtheweb/utils/lib/browser.js";
import { generateResourceID } from "@haxtheweb/utils/lib/ids.js";
import { copyToClipboard } from "@haxtheweb/utils/lib/clipboard.js";
import { normalizeEventPath } from "@haxtheweb/utils/lib/events.js";
import { wipeSlot } from "@haxtheweb/utils/lib/slot.js";
// Direct import of utils.js to cover localStorage and other functions
import {
  localStorageGet,
  localStorageSet,
  localStorageDelete,
  b64toBlob,
  CSVtoArray,
  htmlEntities,
  utf2Html,
  mimeTypeToName,
  safeNavigateHref,
  isURLAttribute,
  sanitizeHTMLString,
  cleanVideoSource,
} from "@haxtheweb/utils/utils.js";

describe("utils lib coverage for user-scaffold dependencies", () => {
  describe("url.js", () => {
    it("badURLProtocols contains javascript, vbscript, data", () => {
      expect(badURLProtocols).to.contain("javascript:");
      expect(badURLProtocols).to.contain("vbscript:");
      expect(badURLProtocols).to.contain("data:");
    });

    it("hasUnsafeURLProtocol detects javascript protocol", () => {
      expect(hasUnsafeURLProtocol("javascript:alert(1)")).to.be.true;
    });

    it("hasUnsafeURLProtocol detects vbscript protocol", () => {
      expect(hasUnsafeURLProtocol("vbscript:msgbox(1)")).to.be.true;
    });

    it("hasUnsafeURLProtocol returns false for http", () => {
      expect(hasUnsafeURLProtocol("http://example.com")).to.be.false;
    });

    it("hasUnsafeURLProtocol returns false for non-string", () => {
      expect(hasUnsafeURLProtocol(123)).to.be.false;
    });

    it("hasUnsafeURLProtocol returns false for empty string", () => {
      expect(hasUnsafeURLProtocol("")).to.be.false;
    });

    it("sanitizeURLValue returns fallback for null", () => {
      expect(sanitizeURLValue(null, "fallback")).to.equal("fallback");
    });

    it("sanitizeURLValue returns fallback for undefined", () => {
      expect(sanitizeURLValue(undefined, "fallback")).to.equal("fallback");
    });

    it("sanitizeURLValue returns fallback for non-string", () => {
      expect(sanitizeURLValue(123, "fallback")).to.equal("fallback");
    });

    it("sanitizeURLValue returns fallback for empty string", () => {
      expect(sanitizeURLValue("   ", "fallback")).to.equal("fallback");
    });

    it("sanitizeURLValue returns fallback for unsafe protocol", () => {
      expect(sanitizeURLValue("javascript:alert(1)", "fallback")).to.equal(
        "fallback",
      );
    });

    it("sanitizeURLValue returns trimmed value for safe URL", () => {
      expect(sanitizeURLValue("  http://example.com  ")).to.equal(
        "http://example.com",
      );
    });

    it("sanitizeEmbeddableURL returns fallback for empty", () => {
      expect(sanitizeEmbeddableURL("", "fallback")).to.equal("fallback");
    });

    it("sanitizeEmbeddableURL returns fallback for non-http protocol", () => {
      expect(sanitizeEmbeddableURL("ftp://example.com", "fallback")).to.equal(
        "fallback",
      );
    });

    it("sanitizeEmbeddableURL returns value for http URL", () => {
      expect(sanitizeEmbeddableURL("http://example.com")).to.equal(
        "http://example.com",
      );
    });

    it("sanitizeEmbeddableURL returns value for https URL", () => {
      expect(sanitizeEmbeddableURL("https://example.com")).to.equal(
        "https://example.com",
      );
    });

    it("sanitizeEmbeddableURL returns fallback for invalid URL", () => {
      // Use a value that causes new URL() to throw
      expect(sanitizeEmbeddableURL("http://[invalid", "fallback")).to.equal(
        "fallback",
      );
    });
  });

  describe("browser.js", () => {
    it("isWebKit returns a boolean", () => {
      expect(typeof isWebKit()).to.equal("boolean");
    });

    it("isSafari returns a boolean", () => {
      expect(typeof isSafari()).to.equal("boolean");
    });
  });

  describe("ids.js", () => {
    it("generateResourceID returns a string starting with default base", () => {
      const id = generateResourceID();
      expect(id).to.be.a("string");
      expect(id[0]).to.equal("#");
    });

    it("generateResourceID returns a string with custom base", () => {
      const id = generateResourceID("id-");
      expect(id).to.be.a("string");
      expect(id.startsWith("id-")).to.be.true;
    });

    it("generateResourceID generates unique IDs", () => {
      const id1 = generateResourceID();
      const id2 = generateResourceID();
      expect(id1).to.not.equal(id2);
    });
  });

  describe("clipboard.js", () => {
    let originalClipboard;
    let originalDescriptor;

    beforeEach(() => {
      originalDescriptor = Object.getOwnPropertyDescriptor(
        globalThis.navigator,
        "clipboard",
      );
      originalClipboard = globalThis.navigator.clipboard;
      try {
        Object.defineProperty(globalThis.navigator, "clipboard", {
          value: { writeText: () => Promise.resolve() },
          configurable: true,
          writable: true,
        });
      } catch (e) {
        // clipboard is not configurable, skip mock
      }
    });

    afterEach(() => {
      try {
        if (originalDescriptor) {
          Object.defineProperty(
            globalThis.navigator,
            "clipboard",
            originalDescriptor,
          );
        }
      } catch (e) {
        // ignore restore failure
      }
    });

    it("copyToClipboard dispatches a toast event", async () => {
      let toastEvent = null;
      const handler = (e) => {
        toastEvent = e;
      };
      globalThis.addEventListener("simple-toast-show", handler);
      await copyToClipboard("test value");
      expect(toastEvent).to.exist;
      // If clipboard mock succeeded, message contains the value
      // If not, message is the error fallback (both are valid paths)
      expect(toastEvent.detail.text).to.be.a("string");
      globalThis.removeEventListener("simple-toast-show", handler);
    });

    it("copyToClipboard uses custom message when provided", async () => {
      let toastEvent = null;
      const handler = (e) => {
        toastEvent = e;
      };
      globalThis.addEventListener("simple-toast-show", handler);
      await copyToClipboard("test", "Custom message");
      expect(toastEvent).to.exist;
      // Custom message is used even if clipboard fails
      expect(toastEvent.detail.text).to.equal("Custom message");
      globalThis.removeEventListener("simple-toast-show", handler);
    });
  });

  describe("events.js", () => {
    it("normalizeEventPath uses composedPath when available", () => {
      const fakeEvent = {
        composedPath: () => [1, 2, 3],
      };
      expect(normalizeEventPath(fakeEvent)).to.deep.equal([1, 2, 3]);
    });

    it("normalizeEventPath uses path when composedPath is missing", () => {
      const fakeEvent = {
        path: ["a", "b"],
      };
      expect(normalizeEventPath(fakeEvent)).to.deep.equal(["a", "b"]);
    });

    it("normalizeEventPath uses originalTarget as fallback", () => {
      const target = globalThis.document.createElement("div");
      const fakeEvent = {
        originalTarget: target,
      };
      expect(normalizeEventPath(fakeEvent)).to.deep.equal([target]);
    });

    it("normalizeEventPath uses target as last resort", () => {
      const target = globalThis.document.createElement("div");
      const fakeEvent = {
        target: target,
      };
      expect(normalizeEventPath(fakeEvent)).to.deep.equal([target]);
    });
  });

  describe("slot.js", () => {
    it("wipeSlot removes all children with wildcard", () => {
      const el = globalThis.document.createElement("div");
      el.appendChild(globalThis.document.createElement("p"));
      el.appendChild(globalThis.document.createElement("span"));
      wipeSlot(el, "*");
      expect(el.childNodes.length).to.equal(0);
    });

    it("wipeSlot removes only matching slot children", () => {
      const el = globalThis.document.createElement("div");
      const p1 = globalThis.document.createElement("p");
      p1.slot = "col-1";
      const p2 = globalThis.document.createElement("p");
      p2.slot = "col-2";
      el.appendChild(p1);
      el.appendChild(p2);
      wipeSlot(el, "col-1");
      expect(el.childNodes.length).to.equal(1);
      expect(el.childNodes[0].slot).to.equal("col-2");
    });
  });

  describe("utils.js localStorage functions", () => {
    it("localStorageSet and localStorageGet round-trip", () => {
      localStorageSet("test-ls-key", { value: 42 });
      const result = localStorageGet("test-ls-key");
      expect(result.value).to.equal(42);
      localStorageDelete("test-ls-key");
    });

    it("localStorageGet returns defaultValue for missing key", () => {
      const result = localStorageGet("nonexistent-key-xyz", "default");
      expect(result).to.equal("default");
    });
  });

  describe("utils.js misc functions", () => {
    it("b64toBlob converts base64 to blob", () => {
      const b64 = btoa("hello world");
      const blob = b64toBlob(b64, "text/plain");
      expect(blob).to.exist;
      expect(blob.type).to.equal("text/plain");
    });

    it("CSVtoArray parses simple CSV", () => {
      const result = CSVtoArray("a,b,c");
      expect(result).to.exist;
      expect(result[0][0]).to.equal("a");
      expect(result[0][1]).to.equal("b");
      expect(result[0][2]).to.equal("c");
    });

    it("CSVtoArray parses multi-line CSV", () => {
      const result = CSVtoArray("a,b\nc,d");
      expect(result.length).to.equal(2);
      expect(result[0][0]).to.equal("a");
      expect(result[1][0]).to.equal("c");
    });

    it("htmlEntities encodes special characters", () => {
      expect(htmlEntities("<div>")).to.contain("&#");
    });

    it("htmlEntities returns empty for non-string", () => {
      expect(htmlEntities(null)).to.equal("");
      expect(htmlEntities(undefined)).to.equal("");
    });

    it("utf2Html converts unicode characters", () => {
      const result = utf2Html("café");
      expect(result).to.be.a("string");
    });

    it("mimeTypeToName returns file for invalid input", () => {
      expect(mimeTypeToName(null)).to.equal("file");
      expect(mimeTypeToName("")).to.equal("file");
      expect(mimeTypeToName(123)).to.equal("file");
    });

    it("mimeTypeToName maps common mimetypes", () => {
      expect(mimeTypeToName("image/png")).to.equal(".png");
      expect(mimeTypeToName("image/jpeg")).to.equal(".jpeg");
      expect(mimeTypeToName("text/plain")).to.equal("text");
      expect(mimeTypeToName("application/pdf")).to.equal(".pdf");
      expect(mimeTypeToName("video/mp4")).to.equal(".mp4");
      expect(mimeTypeToName("image/svg+xml")).to.equal(".svg");
      expect(mimeTypeToName("text/markdown")).to.equal(".md");
    });

    it("mimeTypeToName returns file for unknown", () => {
      expect(mimeTypeToName("application/unknown")).to.equal("file");
    });

    it("safeNavigateHref returns / for invalid URL", () => {
      expect(safeNavigateHref("javascript:alert(1)")).to.equal("/");
    });

    it("safeNavigateHref returns href for valid http", () => {
      const result = safeNavigateHref("https://example.com");
      expect(result).to.contain("example.com");
    });

    it("isURLAttribute detects href", () => {
      expect(isURLAttribute("href")).to.be.true;
    });

    it("isURLAttribute detects src", () => {
      expect(isURLAttribute("src")).to.be.true;
    });

    it("isURLAttribute returns false for non-URL attribute", () => {
      expect(isURLAttribute("class")).to.be.false;
    });

    it("sanitizeHTMLString returns sanitized string", () => {
      const result = sanitizeHTMLString("<p>hello</p>");
      expect(result).to.contain("hello");
    });

    it("sanitizeHTMLString handles empty input", () => {
      const result = sanitizeHTMLString("");
      expect(result).to.equal("");
    });

    it("cleanVideoSource normalizes youtube watch URL", () => {
      const result = cleanVideoSource("https://youtube.com/watch?v=abc123");
      expect(result).to.contain("youtube.com/embed/");
    });

    it("cleanVideoSource normalizes youtu.be URL", () => {
      const result = cleanVideoSource("https://youtu.be/abc123");
      expect(result).to.contain("youtube.com/embed/");
    });

    it("cleanVideoSource returns empty for empty input", () => {
      expect(cleanVideoSource("")).to.equal("");
    });
  });
});
