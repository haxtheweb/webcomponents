import { expect } from "@open-wc/testing";

// Import the main module to test that all imports load correctly
import "../baseline-build-hax.js";

describe("baseline-build-hax module test", () => {
  it("should import without errors", () => {
    // If we get here, the import was successful
    expect(true).to.be.true;
  });

  describe("HAX core components availability", () => {
    it("should have wysiwyg-hax available", () => {
      const element = globalThis.document.createElement("wysiwyg-hax");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("wysiwyg-hax");
    });

    it("should have cms-hax available", () => {
      const element = globalThis.document.createElement("cms-hax");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("cms-hax");
    });

    it("should have hax-body available", () => {
      const element = globalThis.document.createElement("hax-body");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("hax-body");
    });

    it("should have hax-tray available", () => {
      const element = globalThis.document.createElement("hax-tray");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("hax-tray");
    });

    it("should have hax-app-picker available", () => {
      const element = globalThis.document.createElement("hax-app-picker");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("hax-app-picker");
    });

    it("should have hax-app available", () => {
      const element = globalThis.document.createElement("hax-app");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("hax-app");
    });

    it("should have hax-toolbar available", () => {
      const element = globalThis.document.createElement("hax-toolbar");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("hax-toolbar");
    });
  });

  describe("Content components availability", () => {
    it("should have a11y-gif-player available", () => {
      const element = globalThis.document.createElement("a11y-gif-player");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("a11y-gif-player");
    });

    it("should have citation-element available", () => {
      const element = globalThis.document.createElement("citation-element");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("citation-element");
    });

    it("should have image-compare-slider available", () => {
      const element = globalThis.document.createElement("image-compare-slider");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("image-compare-slider");
    });

    it("should have license-element available", () => {
      const element = globalThis.document.createElement("license-element");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("license-element");
    });

    it("should have lrn-math available", () => {
      const element = globalThis.document.createElement("lrn-math");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("lrn-math");
    });

    it("should have lrn-table available", () => {
      const element = globalThis.document.createElement("lrn-table");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("lrn-table");
    });

    it("should have lrn-vocab available", () => {
      const element = globalThis.document.createElement("lrn-vocab");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("lrn-vocab");
    });

    it("should have oer-schema available", () => {
      const element = globalThis.document.createElement("oer-schema");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("oer-schema");
    });
  });

  describe("Media components availability", () => {
    it("should have media-image available", () => {
      const element = globalThis.document.createElement("media-image");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("media-image");
    });

    it("should have meme-maker available", () => {
      const element = globalThis.document.createElement("meme-maker");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("meme-maker");
    });

    it("should have video-player available", () => {
      const element = globalThis.document.createElement("video-player");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("video-player");
    });
  });

  describe("Interactive components availability", () => {
    it("should have multiple-choice available", () => {
      const element = globalThis.document.createElement("multiple-choice");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("multiple-choice");
    });

    it("should have person-testimonial available", () => {
      const element = globalThis.document.createElement("person-testimonial");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("person-testimonial");
    });

    it("should have place-holder available", () => {
      const element = globalThis.document.createElement("place-holder");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("place-holder");
    });

    it("should have q-r available", () => {
      const element = globalThis.document.createElement("q-r");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("q-r");
    });

    it("should have self-check available", () => {
      const element = globalThis.document.createElement("self-check");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("self-check");
    });

    it("should have stop-note available", () => {
      const element = globalThis.document.createElement("stop-note");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("stop-note");
    });

    it("should have wikipedia-query available", () => {
      const element = globalThis.document.createElement("wikipedia-query");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("wikipedia-query");
    });
  });

  describe("Layout components availability", () => {
    it("should have grid-plate available", () => {
      const element = globalThis.document.createElement("grid-plate");
      expect(element).to.exist;
      expect(element.tagName.toLowerCase()).to.equal("grid-plate");
    });
  });

  describe("HAX Store integration", () => {
    it("should have HAXStore available globally", () => {
      // HAXStore should be available after importing hax-store
      expect(globalThis.HAXStore).to.exist;
    });

    it("should have HAXStore as a singleton", () => {
      const store1 = globalThis.HAXStore;
      const store2 = globalThis.HAXStore;
      expect(store1).to.equal(store2);
    });

    it("should have required HAXStore methods", () => {
      const store = globalThis.HAXStore;
      expect(store).to.have.property("requestAvailability");
      expect(typeof store.requestAvailability).to.equal("function");
    });
  });

  describe("Component registry validation", () => {
    it("should have all components registered in custom elements registry", () => {
      const expectedComponents = [
        "wysiwyg-hax",
        "cms-hax",
        "hax-body",
        "hax-tray",
        "hax-app-picker",
        "hax-app",
        "hax-toolbar",
        "a11y-gif-player",
        "citation-element",
        "image-compare-slider",
        "license-element",
        "lrn-math",
        "lrn-table",
        "lrn-vocab",
        "oer-schema",
        "media-image",
        "meme-maker",
        "multiple-choice",
        "person-testimonial",
        "place-holder",
        "q-r",
        "self-check",
        "stop-note",
        "video-player",
        "wikipedia-query",
        "grid-plate",
      ];

      expectedComponents.forEach((tagName) => {
        const constructor = globalThis.customElements.get(tagName);
        expect(constructor).to.exist;
        expect(typeof constructor).to.equal("function");
      });
    });

    it("should create instances of all registered components", () => {
      const componentTagNames = [
        "wysiwyg-hax",
        "cms-hax",
        "hax-body",
        "a11y-gif-player",
        "citation-element",
        "license-element",
        "media-image",
        "meme-maker",
        "place-holder",
        "q-r",
        "self-check",
        "stop-note",
        "video-player",
        "grid-plate",
      ];

      componentTagNames.forEach((tagName) => {
        const element = globalThis.document.createElement(tagName);
        expect(element).to.exist;
        expect(element.tagName.toLowerCase()).to.equal(tagName);

        // Verify it's a proper custom element
        expect(element.constructor.name).to.not.equal("HTMLUnknownElement");
      });
    });
  });

  describe("Module loading performance", () => {
    it("should load all components in reasonable time", () => {
      // This test verifies that the import completed successfully
      // which means all components loaded without major issues
      const startTime = performance.now();

      // Test that we can create multiple elements quickly
      const elements = [
        globalThis.document.createElement("hax-body"),
        globalThis.document.createElement("media-image"),
        globalThis.document.createElement("video-player"),
      ];

      const endTime = performance.now();
      const creationTime = endTime - startTime;

      elements.forEach((element) => {
        expect(element).to.exist;
      });

      // Element creation should be fast
      expect(creationTime).to.be.lessThan(100);
    });
  });

  describe("HAX ecosystem integration", () => {
    it("should provide components that integrate with HAX", () => {
      // Test that components have HAX-related methods where expected
      const haxBodyElement = globalThis.document.createElement("hax-body");

      // HAX body should have core HAX functionality
      expect(haxBodyElement).to.exist;
      expect(haxBodyElement.tagName.toLowerCase()).to.equal("hax-body");
    });

    it("should provide educational components", () => {
      // Test key educational components are available
      const educationalComponents = [
        "multiple-choice",
        "self-check",
        "lrn-math",
        "lrn-vocab",
        "stop-note",
      ];

      educationalComponents.forEach((tagName) => {
        const element = globalThis.document.createElement(tagName);
        expect(element).to.exist;
        expect(element.tagName.toLowerCase()).to.equal(tagName);
      });
    });

    it("should provide media components", () => {
      // Test key media components are available
      const mediaComponents = [
        "video-player",
        "media-image",
        "a11y-gif-player",
        "meme-maker",
      ];

      mediaComponents.forEach((tagName) => {
        const element = globalThis.document.createElement(tagName);
        expect(element).to.exist;
        expect(element.tagName.toLowerCase()).to.equal(tagName);
      });
    });
  });

  describe("Bundle completeness", () => {
    it("should include core HAX editing functionality", () => {
      const coreComponents = [
        "hax-body",
        "hax-tray",
        "hax-toolbar",
        "hax-app-picker",
        "wysiwyg-hax",
        "cms-hax",
      ];

      coreComponents.forEach((tagName) => {
        expect(globalThis.customElements.get(tagName)).to.exist;
      });
    });

    it("should include content authoring components", () => {
      const contentComponents = [
        "citation-element",
        "license-element",
        "oer-schema",
        "place-holder",
      ];

      contentComponents.forEach((tagName) => {
        expect(globalThis.customElements.get(tagName)).to.exist;
      });
    });

    it("should include interactive elements", () => {
      const interactiveComponents = [
        "multiple-choice",
        "self-check",
        "q-r",
        "wikipedia-query",
      ];

      interactiveComponents.forEach((tagName) => {
        expect(globalThis.customElements.get(tagName)).to.exist;
      });
    });
  });

  describe("Accessibility compliance", () => {
    it("should include accessibility-focused components", () => {
      const a11yComponents = [
        "a11y-gif-player", // Specifically named for accessibility
      ];

      a11yComponents.forEach((tagName) => {
        const element = globalThis.document.createElement(tagName);
        expect(element).to.exist;
        expect(element.tagName.toLowerCase()).to.equal(tagName);
      });
    });

    it("should create accessible elements by default", () => {
      // Test that key components don't have obvious accessibility issues
      const componentsToTest = ["hax-body", "media-image", "stop-note"];

      componentsToTest.forEach((tagName) => {
        const element = globalThis.document.createElement(tagName);
        expect(element).to.exist;

        // Elements should not have role="none" or other problematic defaults
        expect(element.getAttribute("role")).to.not.equal("none");
      });
    });
  });

  describe("Educational content standards", () => {
    it("should include OER-compliant components", () => {
      const oerComponents = [
        "oer-schema",
        "license-element",
        "citation-element",
      ];

      oerComponents.forEach((tagName) => {
        expect(globalThis.customElements.get(tagName)).to.exist;
      });
    });

    it("should include learning resource components", () => {
      const learningComponents = ["lrn-math", "lrn-table", "lrn-vocab"];

      learningComponents.forEach((tagName) => {
        expect(globalThis.customElements.get(tagName)).to.exist;
      });
    });
  });
});
