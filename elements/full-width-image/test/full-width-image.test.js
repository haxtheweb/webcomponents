import { fixture, expect, html } from "@open-wc/testing";

import "../full-width-image.js";

describe("full-width-image test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <full-width-image title="test-title"></full-width-image>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("full-width-image behavior", () => {
  it("wires the source into the background and reflects attributes", async () => {
    const el = await fixture(
      html`<full-width-image
        source="photo.png"
        caption="A caption"
      ></full-width-image>`,
    );
    await el.updateComplete;
    expect(el.source).to.equal("photo.png");
    expect(el.getAttribute("source")).to.equal("photo.png");
    expect(el.caption).to.equal("A caption");
    expect(el.getAttribute("caption")).to.equal("A caption");
    const image = el.shadowRoot.querySelector("#image");
    expect(image.style.backgroundImage).to.include("photo.png");
    expect(
      el.shadowRoot.querySelector(".caption").textContent.trim(),
    ).to.equal("A caption");
    // changing the source rewires the background
    el.source = "other.png";
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("#image").style.backgroundImage).to
      .include("other.png");
  });

  it("dismisses and restores the caption via the toggle button", async () => {
    const el = await fixture(
      html`<full-width-image
        source="photo.png"
        caption="A caption"
      ></full-width-image>`,
    );
    await el.updateComplete;
    const wrapper = el.shadowRoot.querySelector("#captionWrapper");
    const toggle = el.shadowRoot.querySelector("#captionToggle");
    // the caption overlay is visible and hoverable by default
    expect(wrapper.hasAttribute("hidden")).to.be.false;
    expect(toggle.hasAttribute("toggled")).to.be.false;
    // clicking the toggle dismisses the caption instead of hover hiding it
    toggle.click();
    await el.updateComplete;
    expect(el.captionHidden).to.be.true;
    expect(el.hasAttribute("caption-hidden")).to.be.true;
    expect(wrapper.hasAttribute("hidden")).to.be.true;
    expect(toggle.hasAttribute("toggled")).to.be.true;
    // clicking again restores the caption
    toggle.click();
    await el.updateComplete;
    expect(el.captionHidden).to.be.false;
    expect(wrapper.hasAttribute("hidden")).to.be.false;
    expect(toggle.hasAttribute("toggled")).to.be.false;
    // hovering the wrapper no longer hides the caption (WCAG 1.4.13)
    wrapper.dispatchEvent(new MouseEvent("mouseenter"));
    await el.updateComplete;
    expect(wrapper.hasAttribute("hidden")).to.be.false;
  });

  it("haxHooks maps mediaSourceUpdated", async () => {
    const el = await fixture(
      html`<full-width-image source="photo.png"></full-width-image>`,
    );
    expect(el.haxHooks()).to.deep.equal({
      mediaSourceUpdated: "haxmediaSourceUpdated",
    });
  });

  it("haxmediaSourceUpdated ignores bad input", async () => {
    const el = await fixture(
      html`<full-width-image source="photo.png"></full-width-image>`,
    );
    expect(el.haxmediaSourceUpdated(null, null)).to.equal(undefined);
    expect(el.haxmediaSourceUpdated("x.png", null)).to.equal(undefined);
    expect(el.haxmediaSourceUpdated("x.png", {})).to.equal(undefined);
  });

  it("haxmediaSourceUpdated cache-busts the background on match", async () => {
    const el = await fixture(
      html`<full-width-image source="photo.png"></full-width-image>`,
    );
    await el.updateComplete;
    const image = el.shadowRoot.querySelector("#image");
    const store = {
      _mediaSrcMatches: (src, path) => src === path,
    };
    el.haxmediaSourceUpdated("photo.png", store);
    expect(image.style.backgroundImage).to.include("?t=");
    // non-matching paths leave the background untouched
    const busted = image.style.backgroundImage;
    el.haxmediaSourceUpdated("other.png", store);
    expect(image.style.backgroundImage).to.equal(busted);
  });

  it("haxProperties points at the external schema file", () => {
    const Ctor = globalThis.customElements.get("full-width-image");
    expect(Ctor.haxProperties).to.be.a("string");
    expect(
      Ctor.haxProperties.endsWith("lib/full-width-image.haxProperties.json"),
    ).to.be.true;
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("full-width-image passes accessibility test", async () => {
    const el = await fixture(html` <full-width-image></full-width-image> `);
    await expect(el).to.be.accessible();
  });
  it("full-width-image passes accessibility negation", async () => {
    const el = await fixture(
      html`<full-width-image
        aria-labelledby="full-width-image"
      ></full-width-image>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("full-width-image can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<full-width-image .foo=${'bar'}></full-width-image>`);
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
      const el = await fixture(html`<full-width-image ></full-width-image>`);
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
      const el = await fixture(html`<full-width-image></full-width-image>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<full-width-image></full-width-image>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
