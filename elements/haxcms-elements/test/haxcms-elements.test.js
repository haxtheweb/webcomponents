// local development and mobx
import { fixture, expect, html } from "@open-wc/testing";
import "@haxtheweb/haxcms-elements/lib/core/haxcms-site-builder.js";
import { store } from "../lib/core/haxcms-site-store.js";
describe("haxcms-elements test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<haxcms-site-builder
        id="site"
        file="${new URL("../demo/site.json", import.meta.url).href}"
      ></haxcms-site-builder>`,
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("haxcms-elements inline block render safety", () => {
  let originalManifest;
  let originalThemeElement;
  let originalActiveItemContent;

  beforeEach(() => {
    originalManifest = store.manifest;
    originalThemeElement = store.themeElement;
    originalActiveItemContent = store.activeItemContent;
  });

  afterEach(() => {
    store.manifest = originalManifest;
    store.themeElement = originalThemeElement;
    store.activeItemContent = originalActiveItemContent;
  });
  it("preserves inline custom elements in site content even when they are editor-restricted", async () => {
    store.manifest = {
      metadata: {
        platform: {
          allowedBlocks: ["p"],
        },
      },
      items: [],
    };

    expect(store.platformAllows("moar-sarcasm")).to.equal(false);
    expect(store.platformAllows("lrn-math")).to.equal(false);

    const Builder = globalThis.customElements.get("haxcms-site-builder");
    const builder = new Builder();
    store.themeElement = globalThis.document.createElement("div");
    await builder._activeItemContentChanged(
      "<p><moar-sarcasm>Totally serious.</moar-sarcasm> <lrn-math>x^2</lrn-math></p>",
      {
        id: "item-1",
        title: "Inline test",
        parent: null,
        slug: "inline-test",
        order: 1,
        metadata: {},
      },
    );
    expect(store.activeItemContent).to.include("<moar-sarcasm>");
    expect(store.activeItemContent).to.include("<lrn-math>");
  });
});

describe("haxcms-elements allowed blocks semantics", () => {
  let originalManifest;

  beforeEach(() => {
    originalManifest = store.manifest;
  });

  afterEach(() => {
    store.manifest = originalManifest;
  });

  it("treats null as no optional blocks and [] as undefined allow-list", async () => {
    store.manifest = {
      metadata: {
        platform: {
          allowedBlocks: null,
        },
      },
      items: [],
    };

    expect(store.platformConfig.allowedBlocks).to.equal(null);
    expect(store.platformConfig.allowedBlocksDefined).to.equal(true);
    expect(store.platformAllows("video-player")).to.equal(false);

    store.manifest = {
      metadata: {
        platform: {
          allowedBlocks: [],
        },
      },
      items: [],
    };

    expect(store.platformConfig.allowedBlocksDefined).to.equal(false);
    expect(store.platformConfig.allowedBlocks.size).to.equal(0);
    expect(store.platformAllows("video-player")).to.equal(true);
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("haxcms-elements passes accessibility test", async () => {
    const el = await fixture(html` <haxcms-elements></haxcms-elements> `);
    await expect(el).to.be.accessible();
  });
  it("haxcms-elements passes accessibility negation", async () => {
    const el = await fixture(
      html`<haxcms-elements
        aria-labelledby="haxcms-elements"
      ></haxcms-elements>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("haxcms-elements can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<haxcms-elements .foo=${'bar'}></haxcms-elements>`);
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
      const el = await fixture(html`<haxcms-elements ></haxcms-elements>`);
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
      const el = await fixture(html`<haxcms-elements></haxcms-elements>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<haxcms-elements></haxcms-elements>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
