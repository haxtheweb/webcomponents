import { fixture, expect, html } from "@open-wc/testing";

import "../parallax-image.js";

describe("parallax-image test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <parallax-image title="test-title"></parallax-image>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("parallax-image behavior", () => {
  it("reflects imageBg and sets the background css variable", async () => {
    const el = await fixture(
      html`<parallax-image image-bg="photo.png"></parallax-image>`,
    );
    await el.updateComplete;
    expect(el.imageBg).to.equal("photo.png");
    expect(el.getAttribute("image-bg")).to.equal("photo.png");
    expect(el.style.getPropertyValue("--parallax-image-background").trim()).to
      .equal("url(photo.png)");
    el.imageBg = "other.png";
    await el.updateComplete;
    expect(el.style.getPropertyValue("--parallax-image-background").trim()).to
      .equal("url(other.png)");
  });

  it("renders the parallax structure with describedBy passthrough", async () => {
    const el = await fixture(
      html`<parallax-image described-by="desc-1"
        ><h2 slot="parallax_heading">Title</h2></parallax-image
      >`,
    );
    await el.updateComplete;
    expect(
      el.shadowRoot.querySelector(".parallax_container").getAttribute(
        "aria-describedby",
      ),
    ).to.equal("desc-1");
    expect(el.shadowRoot.querySelector("#bgParallax")).to.exist;
    expect(el.shadowRoot.querySelector("#titleParallax")).to.exist;
    expect(
      el.shadowRoot.querySelector('slot[name="parallax_heading"]'),
    ).to.exist;
  });

  it("scrollBy moves the background and title relative to scrollY", async () => {
    const el = await fixture(html`<parallax-image></parallax-image>`);
    await el.updateComplete;
    const bg = el.shadowRoot.querySelector("#bgParallax");
    const title = el.shadowRoot.querySelector("#titleParallax");
    el.scrollBy();
    expect(bg.style.backgroundPosition).to.contain("0px");
    // stub scrollY to a nonzero value and restore it afterwards
    const desc = Object.getOwnPropertyDescriptor(globalThis, "scrollY");
    Object.defineProperty(globalThis, "scrollY", {
      value: 250,
      configurable: true,
      writable: true,
    });
    try {
      el.scrollBy();
      expect(bg.style.backgroundPosition).to.contain("-50px");
      expect(title.style.transform.toLowerCase()).to.contain("-70px");
    } finally {
      if (desc) {
        Object.defineProperty(globalThis, "scrollY", desc);
      } else {
        delete globalThis.scrollY;
      }
    }
  });

  it("listens for window scroll after connect and stops on disconnect", async () => {
    const el = await fixture(html`<parallax-image></parallax-image>`);
    await el.updateComplete;
    // the scroll listener is wired in a setTimeout after connect
    await new Promise((resolve) => setTimeout(resolve, 10));
    const bg = el.shadowRoot.querySelector("#bgParallax");
    const desc = Object.getOwnPropertyDescriptor(globalThis, "scrollY");
    Object.defineProperty(globalThis, "scrollY", {
      value: 100,
      configurable: true,
      writable: true,
    });
    try {
      globalThis.dispatchEvent(new Event("scroll"));
      expect(bg.style.backgroundPosition).to.contain("-20px");
      // disconnecting aborts the window listener
      el.remove();
      globalThis.dispatchEvent(new Event("scroll"));
      expect(bg.style.backgroundPosition).to.contain("-20px");
    } finally {
      if (desc) {
        Object.defineProperty(globalThis, "scrollY", desc);
      } else {
        delete globalThis.scrollY;
      }
    }
  });

  it("haxmediaSourceUpdated cache-busts the background when the path matches", async () => {
    const el = await fixture(
      html`<parallax-image image-bg="a.png"></parallax-image>`,
    );
    await el.updateComplete;
    const store = {
      _mediaSrcMatches: (src, path) => src === path,
    };
    el.haxmediaSourceUpdated("a.png", store);
    const busted = el.style
      .getPropertyValue("--parallax-image-background")
      .trim();
    expect(busted.startsWith("url(a.png?t=")).to.be.true;
    // non-matching paths leave the background untouched
    el.haxmediaSourceUpdated("b.png", store);
    expect(
      el.style.getPropertyValue("--parallax-image-background").trim(),
    ).to.equal(busted);
  });

  it("haxmediaSourceUpdated ignores bad input", () => {
    const el = globalThis.document.createElement("parallax-image");
    expect(el.haxmediaSourceUpdated(null, null)).to.equal(undefined);
    expect(el.haxmediaSourceUpdated("x.png", null)).to.equal(undefined);
    expect(el.haxmediaSourceUpdated("x.png", {})).to.equal(undefined);
  });

  it("haxHooks maps mediaSourceUpdated", () => {
    const el = globalThis.document.createElement("parallax-image");
    expect(el.haxHooks()).to.deep.equal({
      mediaSourceUpdated: "haxmediaSourceUpdated",
    });
  });

  it("haxProperties exposes the gizmo and settings", () => {
    const Ctor = globalThis.customElements.get("parallax-image");
    const props = Ctor.haxProperties;
    expect(props.gizmo.title).to.equal("Parallax image");
    expect(props.gizmo.handles[0].type).to.equal("image");
    expect(props.settings.configure[0].property).to.equal("imageBg");
    expect(props.settings.configure[1].slot).to.equal("parallax_heading");
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("parallax-image passes accessibility test", async () => {
    const el = await fixture(html` <parallax-image></parallax-image> `);
    await expect(el).to.be.accessible();
  });
  it("parallax-image passes accessibility negation", async () => {
    const el = await fixture(
      html`<parallax-image aria-labelledby="parallax-image"></parallax-image>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("parallax-image can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<parallax-image .foo=${'bar'}></parallax-image>`);
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
      const el = await fixture(html`<parallax-image ></parallax-image>`);
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
      const el = await fixture(html`<parallax-image></parallax-image>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<parallax-image></parallax-image>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
