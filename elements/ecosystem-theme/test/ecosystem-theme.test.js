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
        footerNote: "Built from PRAW.",
        welcome: {
          title: "Everything in HAX is connected",
          text: "One web.",
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
    store.manifest = MANIFEST;
    store.activeId = "home";
    element = await fixture(html`<ecosystem-theme></ecosystem-theme>`);
    await tick();
    await element.updateComplete;
    await forceThemeReveal(element);
  });

  it("keeps the content contract HAX edits through", () => {
    const r = element.shadowRoot;
    expect(r.querySelector("a.skip-link[href='#webview']")).to.exist;
    expect(r.querySelector("#contentcontainer > #slot > slot")).to.exist;
  });

  it("shows every page with the web, the site's menu in the web's menu", () => {
    const r = element.shadowRoot;
    const web = r.querySelector(".webview ecosystem-web#webview");
    expect(web.getAttribute("web")).to.equal("main");
    expect(web.hasAttribute("site-nav")).to.be.true;
    expect(web.querySelector('nav[slot="menu"] site-menu')).to.exist;
    // a page of a web is the web's details: its own text is not shown twice
    expect(r.querySelector(".content").hidden).to.be.true;
  });

  it("routes a tile page to its web with the tile selected", async () => {
    store.activeId = "goal";
    await tick();
    await element.updateComplete;
    const web = element.shadowRoot.querySelector(".webview ecosystem-web");
    expect(web.getAttribute("web")).to.equal("sdgs");
    expect(web.getAttribute("node")).to.equal("sdg_4");
  });

  it("shows a page outside the webs under the whole web, with a breadcrumb from the outline", async () => {
    store.activeId = "tours";
    await tick();
    await element.updateComplete;
    const r = element.shadowRoot;
    const web = r.querySelector(".webview ecosystem-web");
    expect(web.getAttribute("web")).to.equal("main");
    expect(web.getAttribute("node")).to.equal("");
    expect(r.querySelector(".content").hidden).to.be.false;
    expect(r.querySelector(".content site-active-title")).to.exist;
    const crumbs = [...r.querySelectorAll(".viewbar .trail li")].map((li) =>
      li.textContent.trim(),
    );
    expect(crumbs).to.deep.equal(["Ecosystem web", "Tours"]);
    expect(
      r.querySelector('.viewbar .trail [aria-current="page"]').textContent,
    ).to.equal("Tours");
  });

  it("holds only the breadcrumb under the network bar", () => {
    const r = element.shadowRoot;
    [
      ".places-btn",
      ".views",
      ".copylink",
      "nav.outline",
      "figure.where",
      "site-breadcrumb",
    ].forEach((sel) => expect(r.querySelector(sel), sel).to.equal(null));
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

  it("welcomes you on the home page", async () => {
    const r = element.shadowRoot;
    const w = r.querySelector("section.welcome");
    expect(w.querySelector("h1").textContent).to.equal(
      "Everything in HAX is connected",
    );
    expect(w.querySelector(".go")).to.equal(null);
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
      "Developer mode: goggles",
    ]);
    expect(options[0].path).to.equal("hax.cloud: webs");
    expect(options[1].path).to.equal("hax.cloud: Ecosystem web");
    expect(options[1].value).to.deep.equal({
      target: element,
      method: "goTo",
      args: ["un-sdgs/4-quality-education"],
    });
    // the goggles are a developer command: only in Merlin's > list
    const g = options[3];
    expect(g.context).to.deep.equal([">"]);
    expect(g.path).to.equal(">developer/goggles");
    expect(g.value.method).to.equal("goggles");
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
