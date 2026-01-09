import { fixture, expect, html } from "@open-wc/testing";
import "../audio-player.js";

describe("audio-player test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <audio-player
        source="https://archive.org/download/tvtunes_4710/Jonny%20Quest.mp3"
        media-title="Test Audio"
        accent-color="blue"
      ></audio-player>
    `);
    await element.updateComplete;
  });

  it("basic setup", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("audio-player");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Component structure and inheritance", () => {
    it("should have correct tag name", () => {
      expect(element.constructor.tag).to.equal("audio-player");
    });

    it("should extend VideoPlayer", () => {
      expect(element.constructor.name).to.equal("AudioPlayer");
      expect(element).to.be.instanceOf(
        globalThis.customElements.get("video-player") || Object,
      );
    });

    it("should always return audioOnly as true", () => {
      expect(element.audioOnly).to.equal(true);

      // Test that it's always true regardless of attempts to change it
      element.audioOnly = false;
      expect(element.audioOnly).to.equal(true);
    });
  });

  describe("Property validation with accessibility", () => {
    let testElement;

    beforeEach(async () => {
      testElement = await fixture(html` <audio-player></audio-player> `);
      await testElement.updateComplete;
    });

    describe("Inherited properties from VideoPlayer", () => {
      it("should handle source property", async () => {
        testElement.source = "https://example.com/audio.mp3";
        await testElement.updateComplete;
        expect(testElement.source).to.equal("https://example.com/audio.mp3");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle mediaTitle property", async () => {
        testElement.mediaTitle = "Custom Audio Title";
        await testElement.updateComplete;
        expect(testElement.mediaTitle).to.equal("Custom Audio Title");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle accentColor property", async () => {
        testElement.accentColor = "red";
        await testElement.updateComplete;
        expect(testElement.accentColor).to.equal("red");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle track property for captions", async () => {
        testElement.track = "https://example.com/captions.vtt";
        await testElement.updateComplete;
        expect(testElement.track).to.equal("https://example.com/captions.vtt");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle thumbnailSrc property", async () => {
        testElement.thumbnailSrc = "https://example.com/thumbnail.jpg";
        await testElement.updateComplete;
        expect(testElement.thumbnailSrc).to.equal(
          "https://example.com/thumbnail.jpg",
        );
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle boolean properties", async () => {
        const booleanProps = [
          "learningMode",
          "hideYoutubeLink",
          "linkable",
          "allowBackgroundPlay",
          "darkTranscript",
          "disableInteractive",
          "hideTimestamps",
          "hideTranscript",
        ];

        for (const prop of booleanProps) {
          if (
            testElement.hasOwnProperty(prop) ||
            prop in testElement.constructor.properties
          ) {
            testElement[prop] = true;
            await testElement.updateComplete;
            expect(testElement[prop]).to.equal(true);
            await expect(testElement).shadowDom.to.be.accessible();

            testElement[prop] = false;
            await testElement.updateComplete;
            expect(testElement[prop]).to.equal(false);
            await expect(testElement).shadowDom.to.be.accessible();
          }
        }
      });

      it("should handle crossorigin property", async () => {
        const crossOriginValues = ["", "anonymous", "use-credentials"];

        for (const value of crossOriginValues) {
          testElement.crossorigin = value;
          await testElement.updateComplete;
          expect(testElement.crossorigin).to.equal(value);
          await expect(testElement).shadowDom.to.be.accessible();
        }
      });

      it("should handle lang property", async () => {
        testElement.lang = "en-US";
        await testElement.updateComplete;
        expect(testElement.lang).to.equal("en-US");
        await expect(testElement).shadowDom.to.be.accessible();
      });
    });
  });

  describe("Audio-specific functionality", () => {
    it("should initialize as audio-only player", async () => {
      const testElement = await fixture(html`
        <audio-player source="https://example.com/audio.mp3"></audio-player>
      `);
      await testElement.updateComplete;

      expect(testElement.audioOnly).to.be.true;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle audio sources correctly", async () => {
      const testElement = await fixture(html`
        <audio-player
          source="https://archive.org/download/tvtunes_4710/Jonny%20Quest.mp3"
          media-title="Audio Test"
        ></audio-player>
      `);
      await testElement.updateComplete;

      expect(testElement.source).to.include(".mp3");
      expect(testElement.mediaTitle).to.equal("Audio Test");
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should support different audio formats", async () => {
      const audioFormats = [
        "https://example.com/audio.mp3",
        "https://example.com/audio.wav",
        "https://example.com/audio.ogg",
        "https://example.com/audio.m4a",
      ];

      for (const format of audioFormats) {
        const testElement = await fixture(html`
          <audio-player source="${format}"></audio-player>
        `);
        await testElement.updateComplete;

        expect(testElement.source).to.equal(format);
        expect(testElement.audioOnly).to.be.true;
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });
  });

  describe("Accessibility scenarios with audio content", () => {
    it("should remain accessible with captions/transcript", async () => {
      const testElement = await fixture(html`
        <audio-player
          source="https://example.com/audio.mp3"
          track="https://example.com/captions.vtt"
          media-title="Accessible Audio"
        ></audio-player>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with learning mode enabled", async () => {
      const testElement = await fixture(html`
        <audio-player
          source="https://example.com/audio.mp3"
          learning-mode
          media-title="Learning Audio"
        ></audio-player>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with transcript options", async () => {
      const testElement = await fixture(html`
        <audio-player
          source="https://example.com/audio.mp3"
          dark-transcript
          hide-timestamps
          media-title="Transcript Audio"
        ></audio-player>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with interactive features disabled", async () => {
      const testElement = await fixture(html`
        <audio-player
          source="https://example.com/audio.mp3"
          disable-interactive
          hide-transcript
          media-title="Non-interactive Audio"
        ></audio-player>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("HAX Properties and Integration", () => {
    it("should have haxProperties defined", () => {
      expect(element.constructor.haxProperties).to.exist;
      expect(element.constructor.haxProperties.gizmo).to.exist;
      expect(element.constructor.haxProperties.settings).to.exist;
      expect(element.constructor.haxProperties.demoSchema).to.exist;
    });

    it("should have proper HAX gizmo configuration for audio", () => {
      const haxProps = element.constructor.haxProperties;
      expect(haxProps.gizmo.title).to.equal("Audio");
      expect(haxProps.gizmo.description).to.contain("accessible");
      expect(haxProps.gizmo.icon).to.equal("av:music-video");
      expect(haxProps.gizmo.color).to.equal("green");
      expect(haxProps.gizmo.tags).to.include("Media");
      expect(haxProps.gizmo.tags).to.include("mp3");
    });

    it("should handle audio file types correctly", () => {
      const haxProps = element.constructor.haxProperties;
      const handles = haxProps.gizmo.handles;

      const audioHandle = handles.find((handle) => handle.type === "audio");
      expect(audioHandle).to.exist;
      expect(audioHandle.type_exclusive).to.be.true;
      expect(audioHandle.source).to.equal("source");
    });

    it("should have proper HAX settings configuration", () => {
      const haxProps = element.constructor.haxProperties;
      const configItems = haxProps.settings.configure;

      // Verify source property configuration
      const sourceProp = configItems.find((item) => item.property === "source");
      expect(sourceProp).to.exist;
      expect(sourceProp.inputMethod).to.equal("haxupload");
      expect(sourceProp.noCamera).to.be.true;
      expect(sourceProp.validationType).to.equal("url");

      // Verify mediaTitle property
      const titleProp = configItems.find(
        (item) => item.property === "mediaTitle",
      );
      expect(titleProp).to.exist;
      expect(titleProp.inputMethod).to.equal("textfield");

      // Verify accentColor property
      const colorProp = configItems.find(
        (item) => item.property === "accentColor",
      );
      expect(colorProp).to.exist;
      expect(colorProp.inputMethod).to.equal("colorpicker");

      // Verify track property for captions
      const trackProp = configItems.find((item) => item.property === "track");
      expect(trackProp).to.exist;
      expect(trackProp.noVoiceRecord).to.be.true;
    });

    it("should maintain accessibility with HAX demo schema", async () => {
      const demoSchema = element.constructor.haxProperties.demoSchema[0];
      const haxTestElement = await fixture(html`
        <audio-player
          source="${demoSchema.properties.source}"
          media-title="${demoSchema.properties.mediaTitle}"
          crossorigin="${demoSchema.properties.crossorigin}"
        >
        </audio-player>
      `);
      await haxTestElement.updateComplete;
      await expect(haxTestElement).shadowDom.to.be.accessible();
    });
  });

  describe("Edge cases and error handling", () => {
    it("should remain accessible with missing source", async () => {
      const testElement = await fixture(html`
        <audio-player media-title="No Source Audio"></audio-player>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should remain accessible with invalid source URL", async () => {
      const testElement = await fixture(html`
        <audio-player
          source="invalid-url"
          media-title="Invalid Source"
        ></audio-player>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle missing media title gracefully", async () => {
      const testElement = await fixture(html`
        <audio-player source="https://example.com/audio.mp3"></audio-player>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle malformed caption files", async () => {
      const testElement = await fixture(html`
        <audio-player
          source="https://example.com/audio.mp3"
          track="invalid-caption-url"
          media-title="Malformed Captions"
        ></audio-player>
      `);
      await testElement.updateComplete;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle unusual property values", async () => {
      const testElement = await fixture(html`<audio-player></audio-player>`);

      const edgeCaseValues = [
        "   \t\n   ", // whitespace
        "🎵 audio with emoji 🎶", // emoji
        "Very long audio title that might cause layout issues or other display problems",
        "Multi\nline\ntitle", // multiline
        "Title with 'quotes' and \"double quotes\" and special chars: !@#$%^&*()",
      ];

      for (const value of edgeCaseValues) {
        testElement.mediaTitle = value;
        testElement.source = value;
        await testElement.updateComplete;

        expect(testElement.mediaTitle).to.equal(value);
        expect(testElement.source).to.equal(value);
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });
  });

  describe("Audio playback and controls", () => {
    it("should maintain audioOnly property throughout lifecycle", async () => {
      const testElement = await fixture(html`
        <audio-player source="https://example.com/audio.mp3"></audio-player>
      `);

      // Test during initialization
      expect(testElement.audioOnly).to.be.true;

      // Test after update
      testElement.source = "https://example.com/another-audio.mp3";
      await testElement.updateComplete;
      expect(testElement.audioOnly).to.be.true;

      // Test after property changes
      testElement.mediaTitle = "New Title";
      testElement.accentColor = "purple";
      await testElement.updateComplete;
      expect(testElement.audioOnly).to.be.true;
    });

    it("should handle background playback settings", async () => {
      const testElement = await fixture(html`
        <audio-player
          source="https://example.com/audio.mp3"
          allow-background-play
        ></audio-player>
      `);
      await testElement.updateComplete;

      expect(testElement.allowBackgroundPlay).to.be.true;
      expect(testElement.audioOnly).to.be.true;
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should support learning mode restrictions", async () => {
      const testElement = await fixture(html`
        <audio-player
          source="https://example.com/audio.mp3"
          learning-mode
          media-title="Learning Audio"
        ></audio-player>
      `);
      await testElement.updateComplete;

      expect(testElement.learningMode).to.be.true;
      expect(testElement.audioOnly).to.be.true;
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Constructor and inheritance behavior", () => {
    it("should call super() in constructor", () => {
      const testElement = new element.constructor();
      expect(testElement).to.be.instanceOf(element.constructor);
    });

    it("should maintain audioOnly getter behavior", () => {
      const testElement = new element.constructor();

      // Test getter behavior
      expect(testElement.audioOnly).to.be.true;

      // Attempt to override (should still return true)
      Object.defineProperty(testElement, "audioOnly", {
        value: false,
        writable: true,
      });

      // Getter should still return true
      expect(testElement.audioOnly).to.be.true;
    });
  });

  describe("Customization and theming", () => {
    it("should support custom accent colors", async () => {
      const colors = [
        "red",
        "blue",
        "green",
        "#FF5733",
        "rgb(255, 87, 51)",
        "hsl(9, 100%, 60%)",
      ];

      for (const color of colors) {
        const testElement = await fixture(html`
          <audio-player
            source="https://example.com/audio.mp3"
            accent-color="${color}"
            media-title="Colored Audio"
          ></audio-player>
        `);
        await testElement.updateComplete;

        expect(testElement.accentColor).to.equal(color);
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });

    it("should support transcript customization", async () => {
      const testElement = await fixture(html`
        <audio-player
          source="https://example.com/audio.mp3"
          track="https://example.com/transcript.vtt"
          dark-transcript
          hide-timestamps
          disable-interactive
          media-title="Custom Transcript"
        ></audio-player>
      `);
      await testElement.updateComplete;

      expect(testElement.darkTranscript).to.be.true;
      expect(testElement.hideTimestamps).to.be.true;
      expect(testElement.disableInteractive).to.be.true;
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });
});
