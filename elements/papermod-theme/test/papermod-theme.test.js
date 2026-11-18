globalThis.process = globalThis.process || {
  env: {
    NODE_ENV: "development",
  },
};
import { fixture, expect, html } from "@open-wc/testing";
import { unsafeStatic, html as staticHtml } from "lit/static-html.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import "../papermod-theme.js";
import "../lib/minima-theme.js";
import "../lib/astropaper-theme.js";
import "../lib/astro-cactus-theme.js";
import "../lib/coder-theme.js";
import "../lib/terminal-theme.js";
import "../lib/al-folio-theme.js";
import "../lib/astrowind-theme.js";
import "../lib/hyde-theme.js";
import "../lib/chirpy-theme.js";
import "../lib/minimal-mistakes-theme.js";
import "../lib/astrofy-theme.js";

const COLUMN = [
  "papermod-theme",
  "minima-theme",
  "astropaper-theme",
  "astro-cactus-theme",
  "coder-theme",
  "terminal-theme",
  "al-folio-theme",
  "astrowind-theme",
];
const SIDEBAR = [
  "hyde-theme",
  "chirpy-theme",
  "minimal-mistakes-theme",
  "astrofy-theme",
];

async function make(tag) {
  const t = unsafeStatic(tag);
  const element = await fixture(staticHtml`<${t}></${t}>`);
  await element.updateComplete;
  return element;
}

[...COLUMN, ...SIDEBAR].forEach((tag) => {
  describe(tag, () => {
    let element;
    beforeEach(async () => {
      element = await make(tag);
    });

    it("is defined with its tag", () => {
      expect(globalThis.customElements.get(tag)).to.exist;
      expect(element.constructor.tag).to.equal(tag);
    });

    it("keeps the HAX content contract and a skip link", () => {
      const root = element.shadowRoot;
      expect(root.querySelector("a.skip-link[href='#contentcontainer']")).to
        .exist;
      expect(root.querySelector("#contentcontainer > #slot > slot")).to.exist;
      expect(root.querySelector("homage-page-list")).to.exist;
    });

    it("passes the a11y audit", async () => {
      // with no site loaded the site title is empty, and axe can't follow a
      // skip link into the shadow root; both are covered in a loaded site
      await expect(element).shadowDom.to.be.accessible({
        ignoredRules: ["skip-link", "empty-heading"],
      });
    });
  });
});

describe("single column layout", () => {
  it("puts the top level pages in the header", async () => {
    const element = await make("papermod-theme");
    expect(element.shadowRoot.querySelector("header nav site-top-menu")).to
      .exist;
  });

  it("hides the dark mode switch in a theme that is dark by design", async () => {
    const terminal = await make("terminal-theme");
    expect(terminal.shadowRoot.querySelector("[part='dark-mode-btn']")).to.not
      .exist;
    const papermod = await make("papermod-theme");
    expect(papermod.shadowRoot.querySelector("[part='dark-mode-btn']")).to
      .exist;
  });
});

describe("sidebar layout", () => {
  it("puts the site menu in the sidebar", async () => {
    const element = await make("hyde-theme");
    expect(element.shadowRoot.querySelector("aside nav site-menu")).to.exist;
  });

  it("folds and opens the menu from its button", async () => {
    const element = await make("hyde-theme");
    const toggle = element.shadowRoot.querySelector(".menu-toggle");
    const before = element.menuOpen;
    toggle.click();
    await element.updateComplete;
    expect(element.menuOpen).to.equal(!before);
    expect(toggle.getAttribute("aria-expanded")).to.equal(
      element.menuOpen ? "true" : "false",
    );
  });

  it("adds a top bar only where the theme asks for one", async () => {
    const mm = await make("minimal-mistakes-theme");
    expect(mm.shadowRoot.querySelector("header.masthead site-top-menu")).to
      .exist;
    const hyde = await make("hyde-theme");
    expect(hyde.shadowRoot.querySelector("header.masthead")).to.not.exist;
  });
});

describe("homage-page-list", () => {
  afterEach(() => {
    store.manifest = null;
    store.activeId = null;
  });

  it("stays hidden with no pages under the active page", async () => {
    const list = await fixture(html`<homage-page-list></homage-page-list>`);
    await list.updateComplete;
    expect(list.empty).to.be.true;
    expect(list.shadowRoot.querySelectorAll("li").length).to.equal(0);
  });

  it("lists the published pages under the active page in outline order", async () => {
    const page = (id, parent, order, extra = {}) => ({
      id,
      parent,
      order,
      indent: parent ? 1 : 0,
      title: id,
      slug: id,
      location: `pages/${id}/index.html`,
      description: `About ${id}`,
      metadata: { created: 1736889000, published: true, ...extra },
    });
    store.manifest = {
      id: "test",
      title: "Test",
      metadata: { site: {}, theme: {} },
      items: [
        page("posts", null, 0),
        page("second", "posts", 1),
        page("first", "posts", 0),
        page("draft", "posts", 2, { published: false }),
        page("about", null, 1),
      ],
    };
    store.activeId = "posts";
    const list = await fixture(html`<homage-page-list></homage-page-list>`);
    await list.updateComplete;
    const links = [...list.shadowRoot.querySelectorAll("li a")];
    expect(links.map((a) => a.textContent)).to.deep.equal(["first", "second"]);
    expect(links[0].getAttribute("href")).to.equal("first");
    expect(
      list.shadowRoot.querySelector("time").getAttribute("datetime"),
    ).to.equal("2025-01-14");
    expect(list.empty).to.be.false;
  });
});
