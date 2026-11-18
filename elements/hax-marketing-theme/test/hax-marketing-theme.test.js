import { html, fixture, expect } from "@open-wc/testing";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import {
  forceThemeReveal,
  lockLightColorScheme,
} from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeA11yTestHelpers.js";
import "../hax-marketing-theme.js";

const tick = (ms) => new Promise((r) => setTimeout(r, ms || 60));

const item = (id, title, order, metadata = {}) => ({
  id,
  title,
  slug: id,
  order,
  parent: null,
  indent: 0,
  location: `pages/${id}/index.html`,
  metadata: { published: true, ...metadata },
});

const manifest = () => ({
  title: "HAX the web",
  metadata: {
    site: {},
    theme: {
      element: "hax-marketing-theme",
      path: "@haxtheweb/hax-marketing-theme/hax-marketing-theme.js",
      name: "HAX marketing",
      variables: {},
    },
  },
  items: [
    item("start", "I want a website that", 0),
    item("compare", "Compare", 1),
    item("hidden", "Hidden page", 2, { hideInMenu: true }),
    item("trust", "Trust", 3),
  ],
});

describe("hax-marketing-theme", function () {
  this.timeout(10000);
  let element;
  let restoreColorScheme;
  let saved;

  before(() => {
    restoreColorScheme = lockLightColorScheme();
    saved = { manifest: store.manifest, activeId: store.activeId };
  });

  after(() => {
    restoreColorScheme();
    store.manifest = saved.manifest;
    store.activeId = saved.activeId;
  });

  const show = async (activeId) => {
    store.manifest = manifest();
    store.activeId = activeId;
    element = await fixture(html`<hax-marketing-theme></hax-marketing-theme>`);
    await tick();
    await element.updateComplete;
    await forceThemeReveal(element);
    return element.shadowRoot;
  };

  it("keeps the content contract HAX needs and a skip link", async () => {
    const root = await show("start");
    expect(root.querySelector("a.skip-link")).to.exist;
    expect(root.querySelector("#contentcontainer #slot slot")).to.exist;
  });

  it("lists the shown top-level pages and marks the current one", async () => {
    const root = await show("compare");
    const links = [...root.querySelectorAll("nav a")].map((a) =>
      a.textContent.trim(),
    );
    expect(links).to.deep.equal(["I want a website that", "Compare", "Trust"]);
    expect(
      root.querySelector('nav a[aria-current="page"]').textContent.trim(),
    ).to.equal("Compare");
  });

  it("draws palette 3 when the site has not picked one", async () => {
    await show("start");
    expect(element.getAttribute("data-palette")).to.equal("3");
  });

  it("takes a design system the site picks", () => {
    expect(customElements.get("hax-marketing-theme").acceptsDesignSystems).to.be
      .true;
  });

  it("carries the style switcher in its chrome", async () => {
    const root = await show("start");
    expect(root.querySelector(".switcher hax-style-switcher")).to.exist;
  });

  it("passes the a11y audit", async () => {
    await show("start");
    // the skip link's target is inside the shadow root, which axe cannot
    // resolve from a shadowDom audit (same as writing-theme)
    await expect(element).shadowDom.to.be.accessible({
      ignoredRules: ["skip-link"],
    });
  });
});
