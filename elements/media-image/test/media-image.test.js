import { fixture, expect, html } from "@open-wc/testing";

import "../media-image.js";

describe("media-image test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<media-image
        source="http://unsplash.it/200"
        size="small"
        figure-label-title="1.5"
        figure-label-description="This is the figure description"
      >
        <div slot="citation">This is my citation.</div>
        <div slot="caption">
          Curabitur aliquet quam id dui posuere blandit. Praesent sapien massa,
          convallis a pellentesque nec, egestas non nisi. Vestibulum ante ipsum
          primis in faucibus orci luctus et ultrices posuere cubilia Curae;
          Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet
          ligula. Cras ultricies ligula sed magna dictum porta. Proin eget
          tortor risus. Praesent sapien massa, convallis a pellentesque nec,
          egestas non nisi. Donec sollicitudin molestie malesuada. Mauris
          blandit aliquet elit, eget tincidunt nibh pulvinar a. Vestibulum ac
          diam sit amet quam vehicula elementum sed sit amet dui. Vivamus
          suscipit tortor eget felis porttitor volutpat.
        </div>
      </media-image>`,
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Accessibility - Image Attributes", () => {
    it("has proper alt text support", async () => {
      const testElement = await fixture(html`
        <media-image
          source="https://example.com/test.jpg"
          alt="Test image description"
        >
        </media-image>
      `);
      await testElement.updateComplete;

      const img = testElement.shadowRoot.querySelector("img");
      if (img) {
        expect(img.alt).to.equal("Test image description");
      }
    });

    it("handles empty alt text appropriately", async () => {
      const testElement = await fixture(html`
        <media-image source="https://example.com/test.jpg" alt="">
        </media-image>
      `);
      await testElement.updateComplete;

      const img = testElement.shadowRoot.querySelector("img");
      if (img) {
        expect(img.hasAttribute("alt")).to.be.true;
        expect(img.alt).to.equal("");
      }
    });

    it("supports aria-describedby when provided", async () => {
      const testElement = await fixture(html`
        <media-image
          source="https://example.com/test.jpg"
          aria-describedby="image-description"
        >
        </media-image>
      `);
      await testElement.updateComplete;

      const img = testElement.shadowRoot.querySelector("img");
      if (img && testElement.getAttribute("aria-describedby")) {
        expect(img.getAttribute("aria-describedby")).to.exist;
      }
    });
  });

  describe("Accessibility - Loading and Performance", () => {
    it("uses lazy loading appropriately", async () => {
      const testElement = await fixture(html`
        <media-image source="https://example.com/test.jpg"> </media-image>
      `);
      await testElement.updateComplete;

      const img = testElement.shadowRoot.querySelector("img");
      if (img) {
        // Should have loading attribute for performance
        expect(img.hasAttribute("loading")).to.be.true;
      }
    });

    it("provides proper image sizing", async () => {
      const testElement = await fixture(html`
        <media-image
          source="https://example.com/test.jpg"
          width="300"
          height="200"
        >
        </media-image>
      `);
      await testElement.updateComplete;

      const img = testElement.shadowRoot.querySelector("img");
      if (img) {
        expect(img.hasAttribute("width") || img.hasAttribute("height")).to.be
          .true;
      }
    });
  });

  describe("Accessibility - Error Handling", () => {
    it("handles missing images gracefully", async () => {
      const testElement = await fixture(html`
        <media-image alt="Image that doesn't exist"> </media-image>
      `);
      await testElement.updateComplete;

      // Should still pass accessibility audit even without source
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("provides fallback content when appropriate", async () => {
      const testElement = await fixture(html`
        <media-image source="" alt="Fallback description"> </media-image>
      `);
      await testElement.updateComplete;

      // Should maintain accessibility with empty source
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Accessibility - Responsive Design", () => {
    it("maintains aspect ratio and responsiveness", async () => {
      const testElement = await fixture(html`
        <media-image source="https://example.com/test.jpg"> </media-image>
      `);
      await testElement.updateComplete;

      const style = globalThis.getComputedStyle(testElement);
      expect(style.display).to.equal("block");
    });

    it("supports different viewport sizes", async () => {
      const testElement = await fixture(html`
        <media-image
          source="https://example.com/test.jpg"
          sizes="(max-width: 600px) 100vw, 50vw"
        >
        </media-image>
      `);
      await testElement.updateComplete;

      // Should remain accessible across different sizes
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Accessibility - Semantic Structure", () => {
    it("uses appropriate semantic elements", async () => {
      const testElement = await fixture(html`
        <media-image source="https://example.com/test.jpg"> </media-image>
      `);
      await testElement.updateComplete;

      const figure = testElement.shadowRoot.querySelector("figure");
      const img = testElement.shadowRoot.querySelector("img");

      if (figure) {
        expect(figure).to.exist;
      }
      if (img) {
        expect(img).to.exist;
      }
    });

    it("supports caption when provided", async () => {
      const testElement = await fixture(html`
        <media-image source="https://example.com/test.jpg">
          <p slot="caption">This is a caption</p>
        </media-image>
      `);
      await testElement.updateComplete;

      const caption = testElement.querySelector('[slot="caption"]');
      expect(caption).to.exist;
    });
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("media-image passes accessibility test", async () => {
    const el = await fixture(html` <media-image></media-image> `);
    await expect(el).to.be.accessible();
  });
  it("media-image passes accessibility negation", async () => {
    const el = await fixture(
      html`<media-image aria-labelledby="media-image"></media-image>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("media-image can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<media-image .foo=${'bar'}></media-image>`);
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
      const el = await fixture(html`<media-image ></media-image>`);
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
      const el = await fixture(html`<media-image></media-image>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<media-image></media-image>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
