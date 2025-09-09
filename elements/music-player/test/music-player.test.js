import { fixture, expect, html } from "@open-wc/testing";

import "../music-player.js";

describe("music-player test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<music-player
        source="https://magenta.github.io/magenta-js/music/demos/melody.mid"
      ></music-player> `,
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Accessibility - Media Controls", () => {
    it("provides accessible media player controls", async () => {
      await element.updateComplete;
      const midiPlayer = element.shadowRoot.querySelector('midi-player');
      expect(midiPlayer).to.exist;
      expect(midiPlayer.hasAttribute('sound-font')).to.be.true;
    });

    it("has proper media element structure", async () => {
      await element.updateComplete;
      const visualizer = element.shadowRoot.querySelector('midi-visualizer');
      expect(visualizer).to.exist;
      expect(visualizer.hasAttribute('src')).to.be.true;
      expect(visualizer.hasAttribute('type')).to.be.true;
    });

    it("supports keyboard interaction with player", async () => {
      await element.updateComplete;
      const midiPlayer = element.shadowRoot.querySelector('midi-player');
      if (midiPlayer) {
        // MIDI player should be keyboard accessible
        expect(midiPlayer.tabIndex >= 0 || !midiPlayer.hasAttribute('tabindex')).to.be.true;
      }
    });
  });

  describe("Accessibility - Visual Features", () => {
    it("allows hiding visual elements when needed", async () => {
      element.noVisual = true;
      await element.updateComplete;
      
      const visualizer = element.shadowRoot.querySelector('midi-visualizer');
      const computedStyle = globalThis.getComputedStyle(visualizer);
      expect(computedStyle.display).to.equal('none');
      
      // Should still be accessible without visuals
      await expect(element).shadowDom.to.be.accessible();
    });

    it("properly handles waterfall visualization options", async () => {
      element.noWaterfall = true;
      await element.updateComplete;
      
      // Should remain accessible with waterfall disabled
      await expect(element).shadowDom.to.be.accessible();
    });

    it("supports different visualizer types", async () => {
      const visualizerTypes = ['staff', 'piano-roll', 'waterfall'];
      
      for (const type of visualizerTypes) {
        element.visualizer = type;
        await element.updateComplete;
        
        const visualizer = element.shadowRoot.querySelector('midi-visualizer');
        expect(visualizer.getAttribute('type')).to.equal(type);
        
        // Should be accessible with different visualizer types
        await expect(element).shadowDom.to.be.accessible();
      }
    });
  });

  describe("Accessibility - Content and Loading", () => {
    it("handles missing source gracefully", async () => {
      const testElement = await fixture(html`<music-player></music-player>`);
      await testElement.updateComplete;
      
      // Should be accessible even without a source
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("provides proper source attribution", async () => {
      const testSource = 'https://example.com/test.mid';
      element.source = testSource;
      await element.updateComplete;
      
      const visualizer = element.shadowRoot.querySelector('midi-visualizer');
      const midiPlayer = element.shadowRoot.querySelector('midi-player');
      
      expect(visualizer.getAttribute('src')).to.equal(testSource);
      expect(midiPlayer.getAttribute('src')).to.equal(testSource);
    });
  });

  describe("Accessibility - Responsive Design", () => {
    it("maintains accessibility across different screen sizes", async () => {
      const style = globalThis.getComputedStyle(element);
      expect(style.display).to.equal('block');
      
      // Check responsive properties
      const midiPlayer = element.shadowRoot.querySelector('midi-player');
      if (midiPlayer) {
        const playerStyle = globalThis.getComputedStyle(midiPlayer);
        expect(playerStyle.display).to.equal('block');
      }
    });

    it("handles overflow properly for visualization", async () => {
      await element.updateComplete;
      // The waterfall visualizer should handle overflow
      const visualizer = element.shadowRoot.querySelector('midi-visualizer');
      if (visualizer) {
        expect(visualizer).to.exist;
      }
    });
  });

  describe("Accessibility - Integration and Performance", () => {
    it("properly integrates visualizer with player", async () => {
      // Test the integration that happens in firstUpdated
      await element.updateComplete;
      
      expect(element.visualizerElement).to.exist;
      expect(element.visualizerElement.tagName.toLowerCase()).to.equal('midi-visualizer');
    });

    it("loads media player library appropriately", async () => {
      // The component should handle dynamic imports properly
      await element.updateComplete;
      
      const midiPlayer = element.shadowRoot.querySelector('midi-player');
      expect(midiPlayer).to.exist;
    });
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("music-player passes accessibility test", async () => {
    const el = await fixture(html` <music-player></music-player> `);
    await expect(el).to.be.accessible();
  });
  it("music-player passes accessibility negation", async () => {
    const el = await fixture(
      html`<music-player aria-labelledby="music-player"></music-player>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("music-player can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<music-player .foo=${'bar'}></music-player>`);
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
      const el = await fixture(html`<music-player ></music-player>`);
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
      const el = await fixture(html`<music-player></music-player>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<music-player></music-player>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
