import { fixture, expect, html } from "@open-wc/testing";

import "../a11y-media-player.js";

describe("a11y-media-player test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<a11y-media-player
        accent-color="red"
        youtube-id="BKorP55Aqvg"
      ></a11y-media-player>`,
    );
  });

  it("basic setup", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("a11y-media-player");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Property validation with accessibility", () => {
    let testElement;

    beforeEach(async () => {
      testElement = await fixture(html`
        <a11y-media-player>
          <video>
            <source src="test-video.mp4" type="video/mp4">
            <track kind="subtitles" src="test-captions.vtt" srclang="en" label="English">
          </video>
        </a11y-media-player>
      `);
      await testElement.updateComplete;
    });

    describe("Boolean properties", () => {
      it("should handle audioOnly property", async () => {
        expect(testElement.audioOnly).to.equal(false);
        
        testElement.audioOnly = true;
        await testElement.updateComplete;
        expect(testElement.audioOnly).to.equal(true);
        expect(testElement.hasAttribute("audio-only")).to.be.true;
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle autoplay property", async () => {
        expect(testElement.autoplay).to.equal(false);
        
        testElement.autoplay = true;
        await testElement.updateComplete;
        expect(testElement.autoplay).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle cc property", async () => {
        expect(testElement.cc).to.equal(false);
        
        testElement.cc = true;
        await testElement.updateComplete;
        expect(testElement.cc).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle muted property", async () => {
        expect(testElement.muted).to.equal(false);
        
        testElement.muted = true;
        await testElement.updateComplete;
        expect(testElement.muted).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle loop property", async () => {
        expect(testElement.loop).to.equal(false);
        
        testElement.loop = true;
        await testElement.updateComplete;
        expect(testElement.loop).to.equal(true);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle hideTranscript property", async () => {
        expect(testElement.hideTranscript).to.equal(false);
        
        testElement.hideTranscript = true;
        await testElement.updateComplete;
        expect(testElement.hideTranscript).to.equal(true);
        expect(testElement.hasAttribute("hide-transcript")).to.be.true;
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle standAlone property", async () => {
        expect(testElement.standAlone).to.equal(false);
        
        testElement.standAlone = true;
        await testElement.updateComplete;
        expect(testElement.standAlone).to.equal(true);
        expect(testElement.hasAttribute("stand-alone")).to.be.true;
        await expect(testElement).shadowDom.to.be.accessible();
      });
    });

    describe("String properties", () => {
      it("should handle mediaTitle property", async () => {
        expect(testElement.mediaTitle).to.equal("");
        
        testElement.mediaTitle = "Test Media Title";
        await testElement.updateComplete;
        expect(testElement.mediaTitle).to.equal("Test Media Title");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle lang property", async () => {
        expect(testElement.lang).to.equal("en");
        
        testElement.lang = "es";
        await testElement.updateComplete;
        expect(testElement.lang).to.equal("es");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle mediaLang property", async () => {
        expect(testElement.mediaLang).to.equal("en");
        
        testElement.mediaLang = "fr";
        await testElement.updateComplete;
        expect(testElement.mediaLang).to.equal("fr");
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle preload property", async () => {
        expect(testElement.preload).to.equal("metadata");
        
        testElement.preload = "auto";
        await testElement.updateComplete;
        expect(testElement.preload).to.equal("auto");
        expect(testElement.hasAttribute("preload")).to.be.true;
        await expect(testElement).shadowDom.to.be.accessible();
      });
    });

    describe("Number properties", () => {
      it("should handle volume property", async () => {
        expect(testElement.volume).to.equal(70);
        
        testElement.volume = 50;
        await testElement.updateComplete;
        expect(testElement.volume).to.equal(50);
        await expect(testElement).shadowDom.to.be.accessible();
      });

      it("should handle playbackRate property", async () => {
        expect(testElement.playbackRate).to.equal(1);
        
        testElement.playbackRate = 1.5;
        await testElement.updateComplete;
        expect(testElement.playbackRate).to.equal(1.5);
        await expect(testElement).shadowDom.to.be.accessible();
      });
    });
  });

  describe("Slot functionality", () => {
    it("should handle default slot with media elements", async () => {
      const testElement = await fixture(html`
        <a11y-media-player>
          <video controls>
            <source src="test-video.mp4" type="video/mp4">
          </video>
        </a11y-media-player>
      `);
      await testElement.updateComplete;
      
      const slot = testElement.shadowRoot.querySelector('slot');
      expect(slot).to.exist;
      const assignedNodes = slot.assignedNodes({ flatten: true });
      expect(assignedNodes.length).to.be.greaterThan(0);
      
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("YouTube functionality", () => {
    it("should handle YouTube ID property", async () => {
      const youtubeElement = await fixture(html`
        <a11y-media-player youtube-id="dQw4w9WgXcQ"></a11y-media-player>
      `);
      await youtubeElement.updateComplete;
      
      expect(youtubeElement.youtubeId).to.equal("dQw4w9WgXcQ");
      expect(youtubeElement.hasAttribute("youtube-id")).to.be.true;
      expect(youtubeElement.isYoutube).to.be.true;
      
      await expect(youtubeElement).shadowDom.to.be.accessible();
    });

    it("should generate correct poster URL for YouTube", async () => {
      const youtubeElement = await fixture(html`
        <a11y-media-player youtube-id="dQw4w9WgXcQ"></a11y-media-player>
      `);
      await youtubeElement.updateComplete;
      
      expect(youtubeElement.poster).to.include('img.youtube.com');
      expect(youtubeElement.poster).to.include('dQw4w9WgXcQ');
    });
  });

  describe("Media controls and interactions", () => {
    it("should handle play/pause functionality", async () => {
      const testElement = await fixture(html`
        <a11y-media-player>
          <video>
            <source src="test-video.mp4" type="video/mp4">
          </video>
        </a11y-media-player>
      `);
      await testElement.updateComplete;
      
      // Initial state should be paused
      expect(testElement.__playing).to.equal(false);
      
      // Test play button exists
      const playButton = testElement.shadowRoot.querySelector('a11y-media-play-button');
      expect(playButton).to.exist;
      
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle volume controls", async () => {
      const testElement = await fixture(html`
        <a11y-media-player volume="80">
          <video>
            <source src="test-video.mp4" type="video/mp4">
          </video>
        </a11y-media-player>
      `);
      await testElement.updateComplete;
      
      expect(testElement.volume).to.equal(80);
      
      const volumeSlider = testElement.shadowRoot.querySelector('#volume');
      expect(volumeSlider).to.exist;
      
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle fullscreen functionality", async () => {
      const testElement = await fixture(html`
        <a11y-media-player>
          <video>
            <source src="test-video.mp4" type="video/mp4">
          </video>
        </a11y-media-player>
      `);
      await testElement.updateComplete;
      
      expect(testElement.fullscreenButton).to.be.true; // Should have fullscreen capability
      
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Responsive behavior", () => {
    it("should handle responsive size changes", async () => {
      const testElement = await fixture(html`
        <a11y-media-player responsive-size="sm">
          <video>
            <source src="test-video.mp4" type="video/mp4">
          </video>
        </a11y-media-player>
      `);
      await testElement.updateComplete;
      
      expect(testElement.responsiveSize).to.equal("sm");
      expect(testElement.hasAttribute("responsive-size")).to.be.true;
      
      testElement.responsiveSize = "xs";
      await testElement.updateComplete;
      expect(testElement.responsiveSize).to.equal("xs");
      
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle width and height constraints", async () => {
      const testElement = await fixture(html`
        <a11y-media-player width="400" height="300">
          <video>
            <source src="test-video.mp4" type="video/mp4">
          </video>
        </a11y-media-player>
      `);
      await testElement.updateComplete;
      
      expect(testElement.width).to.equal("400");
      expect(testElement.height).to.equal("300");
      
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Accessibility features", () => {
    it("should handle audio-only mode accessibility", async () => {
      const audioElement = await fixture(html`
        <a11y-media-player audio-only>
          <audio>
            <source src="test-audio.mp3" type="audio/mp3">
          </audio>
        </a11y-media-player>
      `);
      await audioElement.updateComplete;
      
      expect(audioElement.audioOnly).to.be.true;
      expect(audioElement.audioNoThumb).to.be.true; // No thumbnail provided
      
      await expect(audioElement).shadowDom.to.be.accessible();
    });

    it("should handle captions and transcript", async () => {
      const testElement = await fixture(html`
        <a11y-media-player cc>
          <video>
            <source src="test-video.mp4" type="video/mp4">
            <track kind="subtitles" src="test-captions.vtt" srclang="en" label="English">
          </video>
        </a11y-media-player>
      `);
      await testElement.updateComplete;
      
      expect(testElement.cc).to.be.true;
      
      // Check for transcript section
      const transcriptSection = testElement.shadowRoot.querySelector('#transcript-section');
      expect(transcriptSection).to.exist;
      
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle learning mode restrictions", async () => {
      const testElement = await fixture(html`
        <a11y-media-player learning-mode>
          <video>
            <source src="test-video.mp4" type="video/mp4">
          </video>
        </a11y-media-player>
      `);
      await testElement.updateComplete;
      
      expect(testElement.learningMode).to.be.true;
      expect(testElement.disableSeek).to.be.true; // Should disable seeking in learning mode
      expect(testElement.hideTranscript).to.be.true; // Should hide transcript in learning mode
      
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Settings and controls", () => {
    it("should handle settings menu functionality", async () => {
      const testElement = await fixture(html`
        <a11y-media-player>
          <video>
            <source src="test-video.mp4" type="video/mp4">
          </video>
        </a11y-media-player>
      `);
      await testElement.updateComplete;
      
      const settingsButton = testElement.shadowRoot.querySelector('#settings-button');
      expect(settingsButton).to.exist;
      
      const settingsMenu = testElement.shadowRoot.querySelector('#settings');
      expect(settingsMenu).to.exist;
      
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle sticky mode", async () => {
      const testElement = await fixture(html`
        <a11y-media-player sticky sticky-corner="top-right">
          <video>
            <source src="test-video.mp4" type="video/mp4">
          </video>
        </a11y-media-player>
      `);
      await testElement.updateComplete;
      
      expect(testElement.sticky).to.be.true;
      expect(testElement.stickyCorner).to.equal("top-right");
      
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Edge cases and error handling", () => {
    it("should handle missing media gracefully", async () => {
      const testElement = await fixture(html`
        <a11y-media-player></a11y-media-player>
      `);
      await testElement.updateComplete;
      
      expect(testElement.media).to.be.null;
      expect(testElement.duration).to.equal(0);
      
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("should handle unusual property values", async () => {
      const testElement = await fixture(html`
        <a11y-media-player></a11y-media-player>
      `);
      
      const unusualValues = [
        "   \t\n   ", // whitespace
        "🎬 media player 🎬", // emoji
        "Very long media title that might cause display issues or layout problems",
        "Multi\nline\ntitle", // multiline
        "Title with 'quotes' and \"double quotes\" and special chars: !@#$%^&*()"
      ];
      
      for (const value of unusualValues) {
        testElement.mediaTitle = value;
        testElement.mediaLang = value;
        await testElement.updateComplete;
        
        expect(testElement.mediaTitle).to.equal(value);
        expect(testElement.mediaLang).to.equal(value);
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });

    it("should handle extreme volume values", async () => {
      const testElement = await fixture(html`
        <a11y-media-player></a11y-media-player>
      `);
      
      const extremeValues = [0, 50, 100, -10, 150];
      
      for (const value of extremeValues) {
        testElement.volume = value;
        await testElement.updateComplete;
        
        expect(testElement.volume).to.equal(value);
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });

    it("should handle extreme playback rates", async () => {
      const testElement = await fixture(html`
        <a11y-media-player></a11y-media-player>
      `);
      
      const rateValues = [0.25, 0.5, 1, 1.5, 2, 2.5];
      
      for (const rate of rateValues) {
        testElement.playbackRate = rate;
        await testElement.updateComplete;
        
        expect(testElement.playbackRate).to.equal(rate);
        await expect(testElement).shadowDom.to.be.accessible();
      }
    });
  });

  describe("Computed properties", () => {
    it("should compute aspect ratio correctly", async () => {
      const testElement = await fixture(html`
        <a11y-media-player></a11y-media-player>
      `);
      await testElement.updateComplete;
      
      expect(testElement.aspect).to.equal(16/9); // Default aspect ratio
    });

    it("should compute media caption correctly", async () => {
      const testElement = await fixture(html`
        <a11y-media-player media-title="Test Video"></a11y-media-player>
      `);
      await testElement.updateComplete;
      
      expect(testElement.mediaCaption).to.equal("Test Video");
      
      testElement.audioOnly = true;
      await testElement.updateComplete;
      expect(testElement.mediaCaption).to.include("Audio");
    });

    it("should compute print caption correctly", async () => {
      const testElement = await fixture(html`
        <a11y-media-player media-title="Test Video"></a11y-media-player>
      `);
      await testElement.updateComplete;
      
      expect(testElement.printCaption).to.include("Test Video");
      expect(testElement.printCaption).to.include("Video");
    });

    it("should compute flex layout correctly", async () => {
      const testElement = await fixture(html`
        <a11y-media-player></a11y-media-player>
      `);
      await testElement.updateComplete;
      
      // Without captions, should not be in flex layout
      expect(testElement.flexLayout).to.be.false;
    });
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("a11y-media-player passes accessibility test", async () => {
    const el = await fixture(html` <a11y-media-player></a11y-media-player> `);
    await expect(el).to.be.accessible();
  });
  it("a11y-media-player passes accessibility negation", async () => {
    const el = await fixture(
      html`<a11y-media-player
        aria-labelledby="a11y-media-player"
      ></a11y-media-player>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("a11y-media-player can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<a11y-media-player .foo=${'bar'}></a11y-media-player>`);
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
      const el = await fixture(html`<a11y-media-player ></a11y-media-player>`);
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
      const el = await fixture(html`<a11y-media-player></a11y-media-player>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<a11y-media-player></a11y-media-player>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
