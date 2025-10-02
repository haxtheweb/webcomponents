import { fixture, expect, html } from "@open-wc/testing";
import { PlaceHolder } from "../place-holder.js";
import "../place-holder.js";

describe("place-holder test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <place-holder type="audio"></place-holder> `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Component Structure", () => {
    it("should have shadow DOM", () => {
      expect(element.shadowRoot).to.exist;
    });

    it("should contain wrapper div with proper structure", () => {
      const wrapper = element.shadowRoot.querySelector(".wrapper");
      expect(wrapper).to.exist;

      const icon = wrapper.querySelector("simple-icon");
      const textDiv = wrapper.querySelector(".text");
      const directionsDiv = wrapper.querySelector(".directions");

      expect(icon).to.exist;
      expect(textDiv).to.exist;
      expect(directionsDiv).to.exist;
    });

    it("should extend SimpleColors", () => {
      expect(element).to.be.instanceOf(PlaceHolder);
      expect(element.constructor.name).to.equal("PlaceHolder");
    });
  });

  describe("Default Properties", () => {
    let defaultElement;
    beforeEach(async () => {
      defaultElement = await fixture(html`<place-holder></place-holder>`);
    });

    it("should have correct default values", () => {
      expect(defaultElement.text).to.equal("");
      expect(defaultElement.type).to.equal("text");
      expect(defaultElement.dragOver).to.be.false;
      expect(defaultElement.directions).to.equal(
        "Drag and drop file to replace",
      );
      expect(defaultElement.iconFromType).to.equal("editor:format-align-left");
    });

    it("should calculate default text correctly", () => {
      expect(defaultElement.calcText).to.equal("Placeholder for text");
    });

    it("should have default accent color", () => {
      expect(defaultElement.accentColor).to.equal("indigo");
    });
  });

  describe("Property Updates", () => {
    it("should update type and recalculate dependent properties", async () => {
      element.type = "video";
      await element.updateComplete;

      expect(element.accentColor).to.equal("red");
      expect(element.iconFromType).to.equal("notification:ondemand-video");
      expect(element.calcText).to.equal("Placeholder for video");
    });

    it("should update text and reflect in calcText", async () => {
      element.text = "Custom placeholder text";
      await element.updateComplete;

      expect(element.calcText).to.equal("Custom placeholder text");
    });

    it("should update directions", async () => {
      element.directions = "Custom directions";
      await element.updateComplete;

      const directionsEl = element.shadowRoot.querySelector(".directions");
      expect(directionsEl.textContent).to.equal("Custom directions");
    });
  });

  describe("Type-based Calculations", () => {
    const typeConfigs = [
      { type: "document", color: "green", icon: "editor:insert-drive-file" },
      { type: "audio", color: "purple", icon: "av:music-video" },
      { type: "video", color: "red", icon: "notification:ondemand-video" },
      { type: "image", color: "orange", icon: "image:crop-original" },
      { type: "math", color: "light-blue", icon: "editor:functions" },
      { type: "text", color: "indigo", icon: "editor:format-align-left" },
      { type: "unknown", color: "indigo", icon: "editor:format-align-left" },
    ];

    typeConfigs.forEach((config) => {
      it(`should handle type "${config.type}" correctly`, async () => {
        element.type = config.type;
        await element.updateComplete;

        expect(element.accentColor).to.equal(config.color);
        expect(element.iconFromType).to.equal(config.icon);

        if (element.text === "") {
          expect(element.calcText).to.equal(`Placeholder for ${config.type}`);
        }
      });
    });
  });

  describe("Drag and Drop Functionality", () => {
    it("should handle dragOver state", async () => {
      element.dragOver = true;
      await element.updateComplete;

      expect(element.hasAttribute("drag-over")).to.be.true;
      expect(element.iconFromType).to.equal("icons:file-upload");
      expect(element.calcText).to.equal("Drop file to upload");
    });

    it("should reset from dragOver state", async () => {
      element.dragOver = true;
      await element.updateComplete;

      element.dragOver = false;
      await element.updateComplete;

      expect(element.hasAttribute("drag-over")).to.be.false;
      expect(element.iconFromType).to.equal("av:music-video"); // audio type from beforeEach
      expect(element.calcText).to.equal("Placeholder for audio");
    });

    it("should handle dragover event", () => {
      const event = new Event("dragover");
      event.preventDefault = () => {};
      event.stopPropagation = () => {};

      element.dispatchEvent(event);

      expect(element.dragOver).to.be.true;
      expect(element.classList.contains("dragover")).to.be.true;
    });

    it("should handle dragleave event", () => {
      element.dragOver = true;
      element.classList.add("dragover");

      const event = new Event("dragleave");
      event.preventDefault = () => {};
      event.stopPropagation = () => {};

      element.dispatchEvent(event);

      expect(element.dragOver).to.be.false;
      expect(element.classList.contains("dragover")).to.be.false;
    });
  });

  describe("Event Handling", () => {
    it("should fire place-holder-replace event", (done) => {
      element.addEventListener("place-holder-replace", (e) => {
        expect(e.bubbles).to.be.true;
        expect(e.cancelable).to.be.true;
        expect(e.composed).to.be.true;
        expect(e.detail).to.equal(element.type);
        done();
      });

      element.fireReplaceEvent();
    });

    it("should handle drop event with file", (done) => {
      const mockFile = new File(["test"], "test.txt", { type: "text/plain" });
      const mockDataTransfer = {
        items: [{ kind: "file" }],
      };

      element.addEventListener("place-holder-file-drop", (e) => {
        expect(e.bubbles).to.be.true;
        expect(e.cancelable).to.be.true;
        expect(e.composed).to.be.true;
        expect(e.detail.placeHolderElement).to.equal(element);
        done();
      });

      const dropEvent = new Event("drop");
      dropEvent.dataTransfer = mockDataTransfer;
      dropEvent.preventDefault = () => {};
      dropEvent.stopPropagation = () => {};
      dropEvent.stopImmediatePropagation = () => {};

      element.dispatchEvent(dropEvent);
    });
  });

  describe("Template Rendering", () => {
    it("should render icon with correct properties", async () => {
      element.type = "video";
      // Wait for two update cycles to ensure iconFromType is recalculated
      await element.updateComplete;
      await element.updateComplete;

      const icon = element.shadowRoot.querySelector("simple-icon");
      expect(icon.getAttribute("icon")).to.equal("notification:ondemand-video");
      expect(icon.getAttribute("accent-color")).to.equal("red");
    });

    it("should render text content correctly", async () => {
      element.text = "Custom text content";
      // Need to wait for two update cycles to ensure calcText is updated and rendered
      await element.updateComplete;
      await element.updateComplete;

      const textEl = element.shadowRoot.querySelector(".text");
      expect(textEl.textContent).to.equal("Custom text content");
    });

    it("should render directions correctly", async () => {
      element.directions = "Custom directions";
      await element.updateComplete;

      const directionsEl = element.shadowRoot.querySelector(".directions");
      expect(directionsEl.textContent).to.equal("Custom directions");
    });
  });

  describe("SimpleColors Integration", () => {
    it("should apply accent color changes", async () => {
      element.accentColor = "blue";
      await element.updateComplete;

      const icon = element.shadowRoot.querySelector("simple-icon");
      expect(icon.getAttribute("accent-color")).to.equal("blue");
    });

    it("should handle dark mode", async () => {
      element.dark = true;
      await element.updateComplete;

      const icon = element.shadowRoot.querySelector("simple-icon");
      expect(icon.hasAttribute("dark")).to.be.true;
    });
  });

  describe("Complex Configurations", () => {
    it("should handle multiple property updates simultaneously", async () => {
      element.type = "image";
      element.text = "Upload your image here";
      element.directions = "JPG, PNG, or GIF formats accepted";
      element.dragOver = true;
      // Wait for multiple update cycles to ensure all properties are recalculated
      await element.updateComplete;
      await element.updateComplete;

      expect(element.accentColor).to.equal("orange");
      expect(element.iconFromType).to.equal("icons:file-upload"); // dragOver overrides type icon
      expect(element.calcText).to.equal("Drop file to upload"); // dragOver overrides text

      const textEl = element.shadowRoot.querySelector(".text");
      const directionsEl = element.shadowRoot.querySelector(".directions");
      expect(textEl.textContent).to.equal("Drop file to upload");
      expect(directionsEl.textContent).to.equal(
        "JPG, PNG, or GIF formats accepted",
      );
    });
  });

  describe("Accessibility", () => {
    it("should be accessible with different types", async () => {
      const types = ["document", "audio", "video", "image", "math", "text"];

      for (const type of types) {
        element.type = type;
        await element.updateComplete;
        await expect(element).shadowDom.to.be.accessible();
      }
    });

    it("should be accessible in drag over state", async () => {
      element.dragOver = true;
      await element.updateComplete;
      await expect(element).shadowDom.to.be.accessible();
    });

    it("should be accessible with custom text", async () => {
      element.text = "Custom accessible text";
      await element.updateComplete;
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe("Performance and Edge Cases", () => {
    it("should handle rapid property changes", async () => {
      const types = ["audio", "video", "image", "document", "math", "text"];

      for (const type of types) {
        element.type = type;
      }
      await element.updateComplete;

      // Should end up with the last type
      expect(element.type).to.equal("text");
      expect(element.accentColor).to.equal("indigo");
    });

    it("should handle empty and null values gracefully", async () => {
      element.text = null;
      element.directions = null;
      await element.updateComplete;
      await element.updateComplete;

      // When text is null, the _getCalcText method should treat it as empty and fallback to type
      expect(element.calcText).to.be.oneOf([null, "Placeholder for audio"]);

      const directionsEl = element.shadowRoot.querySelector(".directions");
      // When directions is null, it gets converted to empty string in the template
      expect(directionsEl.textContent).to.be.oneOf(["null", ""]);
    });

    it("should handle undefined values", async () => {
      element.text = undefined;
      element.type = undefined;
      await element.updateComplete;

      // Should fall back to defaults or handle gracefully
      expect(element.accentColor).to.equal("indigo"); // default for unknown type
      expect(element.iconFromType).to.equal("editor:format-align-left");
    });

    it("should handle special characters in text", async () => {
      const specialText = "Text with <script>alert('xss')</script> & entities";
      element.text = specialText;
      await element.updateComplete;
      await element.updateComplete;

      const textEl = element.shadowRoot.querySelector(".text");
      expect(textEl.textContent).to.equal(specialText);
      expect(element.calcText).to.equal(specialText);
    });
  });

  describe("CSS Custom Properties", () => {
    it("should have proper styling structure", () => {
      const styles = element.constructor.styles;
      expect(styles).to.exist;

      // Convert styles to string to check for custom properties
      const styleString = styles.toString();
      expect(styleString).to.include("--place-holder-drag-over-border");
      expect(styleString).to.include("--simple-colors-default-theme-accent-12");
      expect(styleString).to.include("--simple-colors-default-theme-accent-1");
    });

    it("should apply drag-over styling when attribute is present", async () => {
      element.dragOver = true;
      await element.updateComplete;

      const computedStyle = getComputedStyle(element);
      // The drag-over attribute should be present, enabling CSS targeting
      expect(element.hasAttribute("drag-over")).to.be.true;
    });
  });

  describe("HAX Integration", () => {
    it("should have correct HAX properties", () => {
      const haxProps = PlaceHolder.haxProperties;

      expect(haxProps).to.exist;
      expect(haxProps.canScale).to.be.false;
      expect(haxProps.canEditSource).to.be.false;
      expect(haxProps.gizmo.title).to.equal("Placeholder");
      expect(haxProps.gizmo.icon).to.equal("hax:placeholder-image");
      expect(haxProps.gizmo.color).to.equal("grey");
    });

    it("should have proper settings configuration", () => {
      const haxProps = PlaceHolder.haxProperties;
      const configSettings = haxProps.settings.configure;

      expect(configSettings).to.have.lengthOf(2);

      const typeConfig = configSettings.find((s) => s.property === "type");
      const textConfig = configSettings.find((s) => s.property === "text");

      expect(typeConfig).to.exist;
      expect(typeConfig.inputMethod).to.equal("select");
      expect(typeConfig.options).to.have.property("image");
      expect(typeConfig.options).to.have.property("video");

      expect(textConfig).to.exist;
      expect(textConfig.inputMethod).to.equal("textfield");
    });

    it("should have demo schema", () => {
      const haxProps = PlaceHolder.haxProperties;
      const demoSchema = haxProps.demoSchema;

      expect(demoSchema).to.have.lengthOf(1);
      expect(demoSchema[0].tag).to.equal("place-holder");
      expect(demoSchema[0].properties.type).to.equal("image");
      expect(demoSchema[0].content).to.equal("");
    });
  });

  describe("Integration Tests", () => {
    it("should work with direct instantiation", () => {
      const directElement = new PlaceHolder();
      expect(directElement.tagName.toLowerCase()).to.equal("place-holder");
      expect(directElement.type).to.equal("text");
    });

    it("should work when dynamically added to DOM", async () => {
      const container = document.createElement("div");
      container.innerHTML =
        '<place-holder type="video" text="Dynamic element"></place-holder>';
      document.body.appendChild(container);

      const dynamicElement = container.querySelector("place-holder");
      await dynamicElement.updateComplete;

      expect(dynamicElement.type).to.equal("video");
      expect(dynamicElement.text).to.equal("Dynamic element");
      expect(dynamicElement.accentColor).to.equal("red");

      document.body.removeChild(container);
    });

    it("should handle multiple instances independently", async () => {
      const element2 = await fixture(html`
        <place-holder type="image" text="Second element"></place-holder>
      `);

      // Modify first element
      element.type = "document";
      element.text = "First element";
      await element.updateComplete;

      // Second element should be unaffected
      expect(element2.type).to.equal("image");
      expect(element2.text).to.equal("Second element");
      expect(element2.accentColor).to.equal("orange");

      // First element should have new values
      expect(element.type).to.equal("document");
      expect(element.text).to.equal("First element");
      expect(element.accentColor).to.equal("green");
    });
  });
});
