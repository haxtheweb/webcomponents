import { html, fixture, expect } from '@open-wc/testing';
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import "../chamfer-theme.js";

describe("ChamferTheme test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <chamfer-theme></chamfer-theme>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    // skip-link target (#contentcontainer) lives in the shadow DOM alongside
    // the link. axe-core resolves skip-link targets via document.getElementById
    // which cannot pierce shadow boundaries, so the rule always fails for
    // shadow-DOM skip-links even though the target exists and is focusable
    // (tabindex="-1"). This is an axe-core limitation, not a markup defect.
    await expect(element).shadowDom.to.be.accessible({
      ignoredRules: ["skip-link"],
    });
  });
});

// Round 8 coverage (#3079): the only uncovered statements were the
// themeData.variables autorun and the banner image branch; drive them
// through the store singleton (save/restore pattern per
// hax-body/test/hax-store.test.js).
describe("ChamferTheme behavior", () => {
  let element;
  let savedManifest;
  let savedActiveId;
  const tick = (ms) => new Promise((r) => setTimeout(r, ms || 60));

  before(() => {
    savedManifest = store.manifest;
    savedActiveId = store.activeId;
    // truthy manifest with an items array keeps the rendered site-region
    // elements from throwing on regionData (see haxor-slevin tests)
    store.manifest = { items: [] };
  });

  after(() => {
    store.manifest = savedManifest;
    store.activeId = savedActiveId;
  });

  afterEach(() => {
    store.manifest = { items: [] };
    store.activeId = savedActiveId;
  });

  beforeEach(async () => {
    element = await fixture(html` <chamfer-theme></chamfer-theme> `);
    await element.updateComplete;
  });

  it("seeds defaults and wires the scroll target", () => {
    // with a manifest that has no metadata.theme, the store's themeData
    // getter falls back to a minimal theme object whose variables carry
    // the default banner image, so the banner defaults come through
    expect(element.image).to.equal("assets/banner.jpg");
    expect(element.imageAlt).to.equal("");
    expect(element.imageLink).to.equal("");
    expect(element.t.skipToContent).to.equal("Skip to content");
    expect(element.HAXCMSThemeSettings.autoScroll).to.equal(true);
    expect(
      element.HAXCMSThemeSettings.scrollTarget ===
        element.shadowRoot.querySelector("#contentcontainer"),
    ).to.equal(true);
  });

  it("renders the chamfer structure", () => {
    const root = element.shadowRoot;
    expect(root.querySelector("a.skip-link").getAttribute("href")).to.equal(
      "#contentcontainer",
    );
    expect(root.querySelector("a.skip-link").textContent).to.equal(
      "Skip to content",
    );
    expect(root.querySelector("div.chamfer-wrapper") === null).to.equal(false);
    expect(root.querySelector("div.banner[part='banner']") === null).to.equal(
      false,
    );
    expect(root.querySelector("div.banner site-region[name='banner']") === null).to.equal(
      false,
    );
    expect(root.querySelector("div.banner slot[name='banner']") === null).to.equal(
      false,
    );
    const bodyArea = root.querySelector("div.body-area[part='body-area']");
    expect(bodyArea === null).to.equal(false);
    expect(
      root.querySelector("div.site-menu-col[part='site-menu']") === null,
    ).to.equal(false);
    expect(
      root.querySelector("div.below-menu-region site-region[name='belowMenu']") ===
        null,
    ).to.equal(false);
    expect(
      root.querySelector("div.below-menu-region slot[name='below-menu']") === null,
    ).to.equal(false);
    expect(
      root.querySelector("main article#contentcontainer[tabindex='-1']") === null,
    ).to.equal(false);
    expect(
      root.querySelector("article site-breadcrumb[part='page-breadcrumb']") ===
        null,
    ).to.equal(false);
    expect(
      root.querySelector("article site-active-title[part='page-title']") === null,
    ).to.equal(false);
    expect(root.querySelector("article #slot slot") === null).to.equal(false);
    expect(
      root.querySelector("footer[part='footer'] site-region[name='footerPrimary']") ===
        null,
    ).to.equal(false);
    expect(root.querySelector("footer slot[name='footer']") === null).to.equal(
      false,
    );
    expect(root.querySelector("scroll-button") === null).to.equal(false);
  });

  it("renders the banner image from the manifest theme variables", async () => {
    store.manifest = {
      metadata: {
        theme: {
          variables: {
            image: "banner.jpg",
            imageAlt: "Site banner",
            imageLink: "/home",
          },
        },
      },
      items: [],
    };
    await tick();
    await element.updateComplete;
    expect(element.image).to.equal("banner.jpg");
    expect(element.imageAlt).to.equal("Site banner");
    expect(element.imageLink).to.equal("/home");
    const link = element.shadowRoot.querySelector(
      "div.banner slot[name='banner'] a[href='/home']",
    );
    expect(link === null).to.equal(false);
    const img = link.querySelector("img");
    expect(img.getAttribute("src")).to.equal("banner.jpg");
    expect(img.getAttribute("alt")).to.equal("Site banner");
    expect(img.getAttribute("loading")).to.equal("lazy");
    expect(img.getAttribute("decoding")).to.equal("async");
    expect(img.getAttribute("fetchpriority")).to.equal("low");
    // removing the theme metadata falls back to the default banner
    // variables supplied by the store's themeData getter
    store.manifest = { items: [] };
    await tick();
    await element.updateComplete;
    expect(element.image).to.equal("assets/banner.jpg");
    expect(element.imageAlt).to.equal("");
    expect(element.imageLink).to.equal("");
    const fallbackImg = element.shadowRoot.querySelector(
      "div.banner slot[name='banner'] a img",
    );
    expect(fallbackImg === null).to.equal(false);
    expect(fallbackImg.getAttribute("src")).to.equal("assets/banner.jpg");
  });
});
