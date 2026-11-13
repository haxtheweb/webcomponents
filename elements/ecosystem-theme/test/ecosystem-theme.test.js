import { html, fixture, expect } from "@open-wc/testing";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import {
  forceThemeReveal,
  lockLightColorScheme,
} from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeA11yTestHelpers.js";
import "../ecosystem-theme.js";

const tick = (ms) => new Promise((r) => setTimeout(r, ms || 60));

const MANIFEST = {
  title: "hax.cloud",
  metadata: {
    site: { name: "hax-cloud", domain: "https://hax.cloud" },
    theme: {
      element: "ecosystem-theme",
      variables: {
        ecosystemSrc: "about:blank",
        nav: [
          { label: "Explore", slug: "ecosystem" },
          { label: "Tours", slug: "tours" },
        ],
        links: [
          { kind: "docs", label: "Docs", href: "https://haxtheweb.org" },
          {
            kind: "demo",
            label: "Try the live demo",
            href: "https://webcomponents.hax.cloud",
          },
          { kind: "portfolio", label: "Bad", href: "javascript:alert(1)" },
        ],
        footerNote: "Built from PRAW.",
        welcome: {
          title: "Everything in HAX is connected",
          text: "One web.",
          tour: "tours",
          tourLabel: "Take the tour",
        },
      },
    },
  },
  items: [
    {
      id: "home",
      title: "Ecosystem web",
      slug: "ecosystem",
      parent: null,
      metadata: { ecosystem: { web: "main" } },
    },
    {
      id: "goal",
      title: "4. Quality Education",
      slug: "un-sdgs/4-quality-education",
      parent: "home",
      metadata: { ecosystem: { web: "sdgs", node: "sdg_4" } },
    },
    {
      id: "tours",
      title: "Tours",
      slug: "tours",
      parent: null,
      metadata: {},
    },
  ],
};

describe("ecosystem-theme", function () {
  this.timeout(10000);
  let element;
  let restoreColorScheme;
  let savedManifest;
  let savedActiveId;

  before(() => {
    restoreColorScheme = lockLightColorScheme();
    savedManifest = store.manifest;
    savedActiveId = store.activeId;
  });
  after(() => {
    restoreColorScheme();
    store.manifest = savedManifest;
    store.activeId = savedActiveId;
  });

  beforeEach(async () => {
    try {
      globalThis.localStorage.removeItem("hax-cloud-view");
    } catch {
      // storage may be unavailable; the theme copes without it
    }
    store.manifest = MANIFEST;
    store.activeId = "home";
    element = await fixture(html`<ecosystem-theme></ecosystem-theme>`);
    await tick();
    await element.updateComplete;
    await forceThemeReveal(element);
  });

  it("keeps the content contract HAX edits through", () => {
    const r = element.shadowRoot;
    expect(r.querySelector("a.skip-link[href='#contentcontainer']")).to.exist;
    expect(r.querySelector("#contentcontainer > #slot > slot")).to.exist;
  });

  it("opens a page of a web in the Web view, routed to that web", () => {
    expect(element.view).to.equal("web");
    const web = element.shadowRoot.querySelector(".webview ecosystem-web");
    expect(web.getAttribute("web")).to.equal("main");
    expect(
      element.shadowRoot.querySelector(".linkbar code").textContent,
    ).to.equal("hax.cloud/ecosystem");
  });

  it("routes a tile page to its web with the tile selected", async () => {
    store.activeId = "goal";
    await tick();
    await element.updateComplete;
    const web = element.shadowRoot.querySelector(".webview ecosystem-web");
    expect(web.getAttribute("web")).to.equal("sdgs");
    expect(web.getAttribute("node")).to.equal("sdg_4");
  });

  it("shows the Site view with the outline and a figure of the web", async () => {
    store.activeId = "goal";
    await tick();
    element._setView("site");
    await element.updateComplete;
    const r = element.shadowRoot;
    expect(element.view).to.equal("site");
    expect(r.querySelector("nav.outline site-menu")).to.exist;
    expect(r.querySelector("nav.outline .ol-head").textContent).to.equal(
      "Ecosystem web",
    );
    const fig = r.querySelector("figure.where ecosystem-web");
    expect(fig.hasAttribute("compact")).to.be.true;
    expect(fig.getAttribute("node")).to.equal("sdg_4");
    expect(r.querySelector(".linkbar")).to.equal(null);
  });

  it("opens pages outside the webs in the Site view", async () => {
    store.activeId = "tours";
    await tick();
    await element.updateComplete;
    expect(element.view).to.equal("site");
    expect(element.shadowRoot.querySelector("ecosystem-web")).to.equal(null);
  });

  it("builds the header from the theme variables and drops unsafe links", () => {
    const r = element.shadowRoot;
    const nav = [...r.querySelectorAll("nav.main a")].map((a) =>
      a.textContent.trim(),
    );
    expect(nav).to.deep.equal(["Explore", "Tours", "Docs ↗"]);
    expect(
      r.querySelector('nav.main a[aria-current="page"]').textContent.trim(),
    ).to.equal("Explore");
    expect(r.querySelector(".pill.demo")).to.exist;
    expect(r.querySelector(".pill.portfolio")).to.equal(null);
  });

  it("toggles the header menu on narrow screens", async () => {
    const btn = element.shadowRoot.querySelector(".menu-btn");
    expect(btn.getAttribute("aria-expanded")).to.equal("false");
    btn.click();
    await element.updateComplete;
    expect(btn.getAttribute("aria-expanded")).to.equal("true");
    expect(element.hasAttribute("menu-open")).to.be.true;
  });

  it("leaves the Future Traveler's corner to the network bar above it", () => {
    expect(element.shadowRoot.querySelector("header.top .haxLogo")).to.not
      .exist;
    const bar = element.shadowRoot.querySelector("hax-network-bar");
    expect(
      bar.shadowRoot
        .querySelector(".traveler simple-icon-lite")
        .getAttribute("icon"),
    ).to.equal("hax:future-traveler");
  });

  it("welcomes you on the home page, with a tour and Merlin", async () => {
    const r = element.shadowRoot;
    const w = r.querySelector("section.welcome");
    expect(w.querySelector("h1").textContent).to.equal(
      "Everything in HAX is connected",
    );
    expect(w.querySelector("a.btn").getAttribute("href")).to.equal("tours");
    expect(w.querySelector("button.btn").textContent.trim()).to.equal(
      "Ask Merlin",
    );
    store.activeId = "goal";
    await tick();
    await element.updateComplete;
    expect(r.querySelector("section.welcome")).to.equal(null);
  });

  it("gives Merlin every page of the site to jump to", () => {
    const options = [];
    element._onMerlin({
      detail: { merlin: { defineOption: (o) => options.push(o) } },
    });
    expect(options.map((o) => o.title)).to.deep.equal([
      "Ecosystem web",
      "4. Quality Education",
      "Tours",
    ]);
    expect(options[0].path).to.equal("hax.cloud: webs");
    expect(options[1].path).to.equal("hax.cloud: Ecosystem web");
    expect(options[1].value).to.deep.equal({
      target: element,
      method: "goTo",
      args: ["un-sdgs/4-quality-education"],
    });
  });

  it("passes the a11y audit", async () => {
    // the skip-link target (#contentcontainer) lives in the shadow DOM beside
    // the link; axe-core resolves skip-link targets with
    // document.getElementById, so it cannot see one in a shadow root
    await expect(element).shadowDom.to.be.accessible({
      ignoredRules: ["skip-link"],
    });
  });
});
