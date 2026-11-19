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
      element.shadowRoot.querySelector(".viewbar .copylink code").textContent,
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
    // one row in both views: the breadcrumb, the views and the link
    expect(r.querySelector(".viewbar site-breadcrumb")).to.exist;
    expect(r.querySelector(".viewbar .copylink")).to.exist;
    expect(r.querySelector("main site-breadcrumb")).to.equal(null);
    const views = [...r.querySelectorAll(".views button")];
    expect(views.map((b) => b.getAttribute("aria-label"))).to.deep.equal([
      "Network view",
      "Content view",
    ]);
    expect(views[1].getAttribute("aria-pressed")).to.equal("true");
  });

  it("opens pages outside the webs in the Site view", async () => {
    store.activeId = "tours";
    await tick();
    await element.updateComplete;
    expect(element.view).to.equal("site");
    expect(element.shadowRoot.querySelector("ecosystem-web")).to.equal(null);
  });

  it("puts the site's places in a menu on its name, with no links the network bar has", () => {
    const r = element.shadowRoot;
    const places = [...r.querySelectorAll(".places-menu a")].map((a) =>
      a.textContent.trim(),
    );
    expect(places).to.deep.equal(["Explore", "Tours"]);
    expect(
      r.querySelector('.places-menu a[aria-current="page"]').textContent.trim(),
    ).to.equal("Explore");
    expect(r.querySelector("header.top")).to.equal(null);
    expect(r.querySelector(".linkbar")).to.equal(null);
    expect(r.querySelector(".pill")).to.equal(null);
  });

  it("opens and closes the places menu, Escape giving focus back", async () => {
    const btn = element.shadowRoot.querySelector(".places-btn");
    expect(btn.getAttribute("aria-expanded")).to.equal("false");
    btn.click();
    await element.updateComplete;
    expect(btn.getAttribute("aria-expanded")).to.equal("true");
    expect(element.hasAttribute("places-open")).to.be.true;
    btn.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await element.updateComplete;
    expect(element.placesOpen).to.be.false;
    btn.click();
    await element.updateComplete;
    globalThis.document.body.click();
    await element.updateComplete;
    expect(element.placesOpen).to.be.false;
  });

  it("folds the outline on narrow screens and closes it when a page is chosen", async () => {
    element._setView("site");
    await element.updateComplete;
    const btn = element.shadowRoot.querySelector("nav.outline .ol-toggle");
    expect(btn.getAttribute("aria-controls")).to.equal("outline-menu");
    expect(btn.getAttribute("aria-expanded")).to.equal("false");
    btn.click();
    await element.updateComplete;
    expect(btn.getAttribute("aria-expanded")).to.equal("true");
    expect(element.hasAttribute("outline-open")).to.be.true;
    store.activeId = "tours";
    await tick();
    await element.updateComplete;
    expect(element.outlineOpen).to.be.false;
    expect(element.hasAttribute("outline-open")).to.be.false;
  });

  it("leaves the Future Traveler's corner to the network bar above it", () => {
    expect(element.shadowRoot.querySelector(".viewbar .haxLogo")).to.not.exist;
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
      "Ask Future",
    );
    store.activeId = "goal";
    await tick();
    await element.updateComplete;
    expect(r.querySelector("section.welcome")).to.equal(null);
  });

  describe("embed view", () => {
    let embedded;
    beforeEach(async () => {
      // one theme per page: the site-view fixture above gives way to the embed
      element.remove();
      store.activeId = "goal";
      embedded = await fixture(html`<ecosystem-theme embed></ecosystem-theme>`);
      await tick();
      await embedded.updateComplete;
      await forceThemeReveal(embedded);
    });

    it("drops the site chrome and keeps the web, the content and a way back", () => {
      const r = embedded.shadowRoot;
      [
        "hax-network-bar",
        ".viewbar",
        "nav.outline",
        "footer",
        "section.welcome",
      ].forEach((sel) => expect(r.querySelector(sel), sel).to.equal(null));
      expect(r.querySelector(".embedbar h1").textContent).to.equal(
        "4. Quality Education",
      );
      const back = r.querySelector(".embedbar a.btn");
      expect(back.getAttribute("href")).to.equal(
        "https://hax.cloud/un-sdgs/4-quality-education",
      );
      expect(back.getAttribute("target")).to.equal("_blank");
      const web = r.querySelector(".webview ecosystem-web");
      expect(web.getAttribute("node")).to.equal("sdg_4");
      expect(r.querySelector("#contentcontainer > #slot > slot")).to.exist;
    });

    it("shows the web even when the viewer chose the Site view on the site", async () => {
      globalThis.localStorage.setItem("hax-cloud-view", "site");
      const el = await fixture(html`<ecosystem-theme embed></ecosystem-theme>`);
      await tick();
      await el.updateComplete;
      expect(el.view).to.equal("web");
      globalThis.localStorage.removeItem("hax-cloud-view");
    });

    it("shows a page outside the webs as its content alone", async () => {
      store.activeId = "tours";
      await tick();
      await embedded.updateComplete;
      const r = embedded.shadowRoot;
      expect(r.querySelector("ecosystem-web")).to.equal(null);
      expect(r.querySelector("site-menu")).to.equal(null);
      expect(r.querySelector(".embedbar h1").textContent).to.equal("Tours");
    });

    it("keeps the embed view when the web moves to another page", () => {
      const pushed = [];
      const push = globalThis.history.pushState;
      const assign = globalThis.HAXCMS;
      globalThis.HAXCMS = {
        requestAvailability: () => ({ storePieces: { siteRouter: {} } }),
      };
      globalThis.history.pushState = (a, b, url) => pushed.push(String(url));
      try {
        embedded._onWebChanged({ detail: { path: "/ecosystem" } });
      } finally {
        globalThis.history.pushState = push;
        globalThis.HAXCMS = assign;
      }
      expect(pushed.length).to.equal(1);
      expect(new URL(pushed[0]).search).to.equal("?embed");
      expect(new URL(pushed[0]).pathname.endsWith("/ecosystem")).to.be.true;
    });

    it("is accessible", async () => {
      // skip-link: see "passes the a11y audit" below
      await expect(embedded).shadowDom.to.be.accessible({
        ignoredRules: ["skip-link"],
      });
    });
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
