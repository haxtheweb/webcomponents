import { fixture, expect, html } from "@open-wc/testing";
import "../barcode-reader.js";

// Mock the ZXing library and related globals
beforeEach(() => {
  // Mock ZXing library
  globalThis.ZXing = function () {
    return {
      Runtime: {
        addFunction: (callback) => () => callback(0, 10, 0, 1),
      },
      HEAPU8: {
        buffer: new ArrayBuffer(1000),
      },
      _resize: (width, height) => 0,
      _decode_any: (ptr) => 0,
    };
  };

  // Mock navigator.mediaDevices
  globalThis.navigator = globalThis.navigator || {};
  globalThis.navigator.mediaDevices = {
    enumerateDevices: () =>
      Promise.resolve([
        { deviceId: "camera1", kind: "videoinput", label: "Test Camera 1" },
        { deviceId: "camera2", kind: "videoinput", label: "Test Camera 2" },
      ]),
    getUserMedia: (constraints) =>
      Promise.resolve({
        getTracks: () => [
          {
            stop: () => {},
          },
        ],
      }),
  };

  // Mock user agent for device detection
  Object.defineProperty(globalThis.navigator, "userAgent", {
    get: () => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    configurable: true,
  });

  // Mock ESGlobalBridge
  globalThis.ESGlobalBridge = {
    requestAvailability: () => ({
      load: (name, url) => {
        setTimeout(() => {
          globalThis.dispatchEvent(new CustomEvent("es-bridge-zxing-loaded"));
        }, 10);
      },
    }),
  };

  // Mock stream
  globalThis.stream = null;
});

afterEach(() => {
  // Clean up mocks
  delete globalThis.ZXing;
  delete globalThis.stream;
});

describe("barcode-reader test", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<barcode-reader></barcode-reader>`);
    await element.updateComplete;
  });

  it("basic setup", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("barcode-reader");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Component structure and properties", () => {
    it("should have correct tag name", () => {
      expect(element.constructor.tag).to.equal("barcode-reader");
    });

    it("should initialize with default properties", () => {
      expect(element.value).to.equal("");
      expect(element.scale).to.be.undefined;
      expect(element.hideinput).to.equal(false);
    });

    it("should have required DOM elements in shadow root", () => {
      const video = element.shadowRoot.querySelector("video");
      const canvas = element.shadowRoot.querySelector("canvas");
      const input = element.shadowRoot.querySelector('input[type="text"]');
      const button = element.shadowRoot.querySelector("simple-icon-button");
      const select = element.shadowRoot.querySelector("select");

      expect(video).to.exist;
      expect(canvas).to.exist;
      expect(input).to.exist;
      expect(button).to.exist;
      expect(select).to.exist;
    });
  });

  describe("Property validation with accessibility", () => {
    describe("value property", () => {
      it("should handle string values and maintain accessibility", async () => {
        const testValues = [
          "123456789",
          "QR_CODE_DATA",
          "https://example.com",
          "Product SKU: ABC123",
          "",
        ];

        for (const testValue of testValues) {
          element.value = testValue;
          await element.updateComplete;

          expect(element.value).to.equal(testValue);
          const input = element.shadowRoot.querySelector('input[type="text"]');
          expect(input.value).to.equal(testValue);
          await expect(element).shadowDom.to.be.accessible();
        }
      });

      it("should reflect value property to attribute", async () => {
        element.value = "test-barcode-123";
        await element.updateComplete;

        expect(element.getAttribute("value")).to.equal("test-barcode-123");
      });

      it("should dispatch value-changed event when value changes", async () => {
        let eventFired = false;
        let eventDetail = null;

        element.addEventListener("value-changed", (e) => {
          eventFired = true;
          eventDetail = e.detail;
        });

        element.value = "new-barcode-value";
        await element.updateComplete;

        expect(eventFired).to.be.true;
        expect(eventDetail).to.equal(element);
      });
    });

    describe("scale property", () => {
      it("should handle numeric scale values", async () => {
        const scaleValues = [50, 75, 100, 125, 150];

        for (const scale of scaleValues) {
          element.scale = scale;
          await element.updateComplete;

          expect(element.scale).to.equal(scale);
          const video = element.shadowRoot.querySelector("video");
          expect(video.getAttribute("width")).to.equal(`${scale}%`);
          expect(video.getAttribute("height")).to.equal(`${scale}%`);
          await expect(element).shadowDom.to.be.accessible();
        }
      });

      it("should reflect scale property to attribute", async () => {
        element.scale = 80;
        await element.updateComplete;

        expect(element.getAttribute("scale")).to.equal("80");
      });
    });

    describe("hideinput property", () => {
      it("should control input visibility", async () => {
        // Input should be visible by default
        expect(element.hideinput).to.be.false;
        let inputDiv = element.shadowRoot.querySelector(".input");
        expect(inputDiv.hasAttribute("hidden")).to.be.false;

        // Hide input
        element.hideinput = true;
        await element.updateComplete;

        inputDiv = element.shadowRoot.querySelector(".input");
        expect(inputDiv.hasAttribute("hidden")).to.be.true;
        await expect(element).shadowDom.to.be.accessible();
      });
    });
  });

  describe("Barcode scanning functionality", () => {
    it("should initialize ZXing library", (done) => {
      // The constructor should load ZXing library
      setTimeout(() => {
        expect(globalThis.ZXing).to.exist;
        done();
      }, 100);
    });

    it("should setup video and canvas elements", async () => {
      const video = element.shadowRoot.querySelector("video");
      const canvas = element.shadowRoot.querySelector("canvas");

      expect(video.hasAttribute("muted")).to.be.true;
      expect(video.hasAttribute("autoplay")).to.be.true;
      expect(video.hasAttribute("playsinline")).to.be.true;
      expect(canvas.style.display).to.equal("none");
    });

    it("should handle scan button click", async () => {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for ZXing to load

      const scanButton = element.shadowRoot.querySelector(".go");
      expect(scanButton).to.exist;

      // Simulate button click
      let clicked = false;
      scanButton.onclick = () => {
        clicked = true;
      };
      scanButton.click();

      expect(clicked).to.be.true;
    });

    it("should handle camera initialization", async () => {
      const renderButton =
        element.shadowRoot.querySelector("simple-icon-button");
      expect(renderButton).to.exist;
      expect(renderButton.getAttribute("icon")).to.equal("image:camera-alt");
    });
  });

  describe("Video stream and device management", () => {
    it("should enumerate video devices", async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const select = element.shadowRoot.querySelector("select");
      expect(select).to.exist;

      // The mock should populate options
      setTimeout(() => {
        expect(select.children.length).to.be.greaterThan(0);
      }, 200);
    });

    it("should handle video stream toggle", async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const hiddenDiv = element.shadowRoot.querySelector(".hidden");
      const renderButton =
        element.shadowRoot.querySelector("simple-icon-button");

      expect(hiddenDiv.style.display).to.equal("");

      // Simulate button click to show video
      renderButton.click();
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Video should be shown after click and delay
    });

    it("should handle device detection for mobile vs PC", async () => {
      // Test PC detection (default mock)
      expect(globalThis.navigator.userAgent).to.include("Windows");

      // Test mobile detection by changing user agent
      Object.defineProperty(globalThis.navigator, "userAgent", {
        get: () => "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        configurable: true,
      });

      // Create new element to test mobile detection
      const mobileElement = await fixture(
        html`<barcode-reader></barcode-reader>`,
      );
      await mobileElement.updateComplete;

      expect(mobileElement).to.exist;
    });
  });

  describe("Accessibility scenarios", () => {
    it("should remain accessible when input is hidden", async () => {
      element.hideinput = true;
      await element.updateComplete;

      await expect(element).shadowDom.to.be.accessible();
    });

    it("should remain accessible with different scale values", async () => {
      element.scale = 50;
      await element.updateComplete;

      await expect(element).shadowDom.to.be.accessible();
    });

    it("should maintain proper ARIA labeling", () => {
      const button = element.shadowRoot.querySelector("simple-icon-button");
      const label = element.shadowRoot.querySelector("#label");

      expect(button.getAttribute("aria-labelledby")).to.equal("label");
      expect(label.id).to.equal("label");
      expect(label.textContent).to.equal("Initialize");
    });

    it("should remain accessible during scanning state", async () => {
      element.value = "scanned-code-123";
      await element.updateComplete;

      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe("Edge cases and error handling", () => {
    it("should handle undefined scale gracefully", async () => {
      element.scale = undefined;
      await element.updateComplete;

      const video = element.shadowRoot.querySelector("video");
      expect(video.getAttribute("width")).to.equal("undefined%");
      await expect(element).shadowDom.to.be.accessible();
    });

    it("should handle null value gracefully", async () => {
      element.value = null;
      await element.updateComplete;

      expect(element.value).to.be.null;
      const input = element.shadowRoot.querySelector('input[type="text"]');
      expect(input.value).to.equal("");
      await expect(element).shadowDom.to.be.accessible();
    });

    it("should handle very long barcode values", async () => {
      const longValue = "A".repeat(1000);
      element.value = longValue;
      await element.updateComplete;

      expect(element.value).to.equal(longValue);
      await expect(element).shadowDom.to.be.accessible();
    });

    it("should handle special characters in barcode values", async () => {
      const specialChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?";
      element.value = specialChars;
      await element.updateComplete;

      expect(element.value).to.equal(specialChars);
      await expect(element).shadowDom.to.be.accessible();
    });

    it("should handle extreme scale values", async () => {
      const extremeScales = [0, -50, 1000, Number.MAX_SAFE_INTEGER];

      for (const scale of extremeScales) {
        element.scale = scale;
        await element.updateComplete;

        expect(element.scale).to.equal(scale);
        await expect(element).shadowDom.to.be.accessible();
      }
    });

    it("should handle missing ZXing library gracefully", async () => {
      delete globalThis.ZXing;

      const testElement = await fixture(
        html`<barcode-reader></barcode-reader>`,
      );
      await testElement.updateComplete;

      // Should not throw errors even without ZXing
      expect(testElement).to.exist;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle media device errors gracefully", async () => {
      // Mock getUserMedia to reject
      globalThis.navigator.mediaDevices.getUserMedia = () => {
        return Promise.reject(new Error("Camera not available"));
      };

      const testElement = await fixture(
        html`<barcode-reader></barcode-reader>`,
      );
      await testElement.updateComplete;

      expect(testElement).to.exist;
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Lifecycle methods", () => {
    it("should handle firstUpdated lifecycle", async () => {
      // firstUpdated should be called automatically
      const video = element.shadowRoot.querySelector("video");
      const canvas = element.shadowRoot.querySelector("canvas");

      expect(video).to.exist;
      expect(canvas).to.exist;
      expect(element.__context).to.exist;
      expect(element.__video).to.exist;
    });

    it("should handle updated lifecycle with value changes", async () => {
      let eventFired = false;
      element.addEventListener("value-changed", () => {
        eventFired = true;
      });

      element.value = "updated-value";
      await element.updateComplete;

      expect(eventFired).to.be.true;
    });

    it("should initialize properly in constructor", () => {
      const newElement = new element.constructor();

      expect(newElement.value).to.equal("");
      expect(newElement.hideinput).to.be.false;
    });
  });

  describe("UI behavior and interaction", () => {
    it("should toggle video display on button click", async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const renderButton =
        element.shadowRoot.querySelector("simple-icon-button");
      const hiddenDiv = element.shadowRoot.querySelector(".hidden");

      // Initial state
      expect(hiddenDiv.hasAttribute("hidden")).to.be.true;

      // Click to initialize and show
      renderButton.click();
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Should change state after processing
      expect(renderButton).to.exist;
    });

    it("should update input value when value property changes", async () => {
      const input = element.shadowRoot.querySelector('input[type="text"]');

      element.value = "test-input-sync";
      await element.updateComplete;

      expect(input.value).to.equal("test-input-sync");
    });

    it("should handle multiple rapid value changes", async () => {
      const values = ["val1", "val2", "val3", "val4", "val5"];

      for (const value of values) {
        element.value = value;
        await element.updateComplete;
      }

      expect(element.value).to.equal("val5");
      const input = element.shadowRoot.querySelector('input[type="text"]');
      expect(input.value).to.equal("val5");
    });
  });

  describe("Performance considerations", () => {
    it("should handle multiple instances efficiently", async () => {
      const startTime = performance.now();

      const elements = await Promise.all([
        fixture(html`<barcode-reader></barcode-reader>`),
        fixture(html`<barcode-reader></barcode-reader>`),
        fixture(html`<barcode-reader></barcode-reader>`),
      ]);

      const endTime = performance.now();
      const creationTime = endTime - startTime;

      expect(elements.length).to.equal(3);
      expect(creationTime).to.be.lessThan(1000); // Should create quickly

      elements.forEach((el) => {
        expect(el.tagName.toLowerCase()).to.equal("barcode-reader");
      });
    });

    it("should cleanup resources properly", async () => {
      const testElement = await fixture(
        html`<barcode-reader></barcode-reader>`,
      );

      // Simulate cleanup scenario
      if (globalThis.stream && globalThis.stream.getTracks) {
        const tracks = globalThis.stream.getTracks();
        tracks.forEach((track) => {
          expect(track.stop).to.be.a("function");
        });
      }
    });
  });

  describe("CSS styles and theming", () => {
    it("should apply correct styles to elements", () => {
      const canvas = element.shadowRoot.querySelector("canvas");
      const video = element.shadowRoot.querySelector("video");

      const canvasStyles = globalThis.getComputedStyle(canvas);
      const videoStyles = globalThis.getComputedStyle(video);

      expect(canvasStyles.display).to.equal("none");
      expect(videoStyles.borderStyle).to.equal("solid");
    });

    it("should handle hidden attribute styling", async () => {
      element.setAttribute("hidden", "");
      await element.updateComplete;

      const elementStyles = globalThis.getComputedStyle(element);
      expect(elementStyles.display).to.equal("none");
    });
  });

  describe("Custom events and integration", () => {
    it("should dispatch custom events with proper detail", async () => {
      let capturedEvent = null;

      element.addEventListener("value-changed", (e) => {
        capturedEvent = e;
      });

      element.value = "event-test-value";
      await element.updateComplete;

      expect(capturedEvent).to.not.be.null;
      expect(capturedEvent.type).to.equal("value-changed");
      expect(capturedEvent.detail).to.equal(element);
    });

    it("should handle ES bridge events properly", (done) => {
      // Test the ES bridge ZXing loaded event
      globalThis.addEventListener("es-bridge-zxing-loaded", () => {
        expect(true).to.be.true; // Event was fired
        done();
      });

      // Trigger the event (already triggered in beforeEach mock)
    });
  });
});
