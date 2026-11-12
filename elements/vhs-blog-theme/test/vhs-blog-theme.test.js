import { html, fixture, expect } from "@open-wc/testing";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import "../vhs-blog-theme.js";

const tick = (ms) => new Promise((r) => setTimeout(r, ms || 60));

const ITEMS = [
  {
    id: "a",
    title: "Reclaim the web",
    slug: "reclaim-the-web",
    order: 0,
    parent: null,
    metadata: { readtime: "6" },
  },
  {
    id: "b",
    title: "Pure Joy",
    slug: "pure-joy",
    order: 1,
    parent: null,
    metadata: { readtime: "3" },
  },
  {
    id: "c",
    title: "Fossy24",
    slug: "fossy24",
    order: 2,
    parent: null,
    metadata: {},
  },
  {
    id: "d",
    title: "FOSSY Day 1",
    slug: "fossy-day-1",
    order: 0,
    parent: "c",
    metadata: { readtime: "4" },
  },
  {
    id: "e",
    title: "FOSSY Day 2",
    slug: "fossy-day-2",
    order: 1,
    parent: "c",
    metadata: { readtime: "5" },
  },
  {
    id: "f",
    title: "Hidden thing",
    slug: "hidden",
    order: 3,
    parent: null,
    metadata: { hideInMenu: true },
  },
];

describe("VhsBlogTheme", () => {
  let element;
  let savedManifest;
  let savedActiveId;

  before(() => {
    savedManifest = store.manifest;
    savedActiveId = store.activeId;
    store.manifest = { title: "btopro", items: ITEMS };
  });

  after(() => {
    store.manifest = savedManifest;
    store.activeId = savedActiveId;
  });

  beforeEach(async () => {
    element = await fixture(html`<vhs-blog-theme></vhs-blog-theme>`);
    await tick();
    element._noticeLocation({ route: { name: "home" } });
    await element.updateComplete;
    // wait out the base theme's one-time fade in before measuring colours
    await tick(800);
  });

  it("basic will it blend", () => {
    expect(element).to.exist;
    expect(element.t.skipToContent).to.equal("Skip to content");
  });

  it("passes the a11y audit on the shelf", async () => {
    // axe resolves skip-link targets with document.getElementById, which
    // cannot see into the shadow root (see chamfer-theme tests)
    await expect(element).shadowDom.to.be.accessible({
      ignoredRules: ["skip-link"],
    });
  });

  it("stacks loose posts into aisles and children into a box set", () => {
    const stacks = element._stacks();
    expect(stacks.length).to.equal(2);
    expect(stacks[0].box).to.equal(false);
    expect(stacks[0].items.map((i) => i.id)).to.deep.equal(["a", "b"]);
    expect(stacks[1].box).to.equal(true);
    expect(stacks[1].items.map((i) => i.id)).to.deep.equal(["c", "d", "e"]);
  });

  it("makes every case a keyboard reachable link named by its title", () => {
    const links = element.shadowRoot.querySelectorAll(".stack a.case-link");
    expect(links.length).to.equal(5);
    links.forEach((a) => {
      expect(a.getAttribute("href")).to.not.equal("");
      expect(a.tabIndex).to.equal(0);
      const name = a.querySelector(".sr-only").textContent;
      expect(name.length).to.be.above(0);
      expect(
        a.querySelector("vhs-blog-spine").getAttribute("aria-hidden"),
      ).to.equal("true");
    });
    expect(links[0].querySelector(".sr-only").textContent).to.equal(
      "Reclaim the web, 6 min read",
    );
  });

  it("holds the focused case on the back cover panel", async () => {
    const links = element.shadowRoot.querySelectorAll(".stack a.case-link");
    links[1].focus();
    await element.updateComplete;
    expect(element.held).to.equal("b");
    expect(
      element.shadowRoot.querySelector("#held-title").textContent,
    ).to.equal("Pure Joy");
    expect(links[1].classList.contains("held")).to.equal(true);
  });

  it("is dark by design", () => {
    const scheme = globalThis.getComputedStyle(element).colorScheme;
    expect(scheme).to.contain("dark");
    expect(scheme).to.not.contain("light");
  });

  it("renders the post with the TV, cover, content and pager", async () => {
    store.activeId = "a";
    element._noticeLocation({ route: { name: "reclaim-the-web" } });
    await tick();
    await element.updateComplete;
    const root = element.shadowRoot;
    expect(element.isHome).to.equal(false);
    expect(
      root.querySelector("vhs-blog-tv").getAttribute("crawl-title"),
    ).to.equal("Reclaim the web");
    expect(
      root.querySelector("article#contentcontainer #slot slot") === null,
    ).to.equal(false);
    expect(root.querySelector("vhs-blog-cover") === null).to.equal(false);
    expect(root.querySelector(".pager .next a").getAttribute("href")).to.equal(
      "pure-joy",
    );
    expect(root.querySelector(".pager .prev") === null).to.equal(true);
    await expect(element).shadowDom.to.be.accessible({
      ignoredRules: ["skip-link"],
    });
  });

  it("skip intro stills the TV and moves focus to the content", async () => {
    store.activeId = "a";
    element._noticeLocation({ route: { name: "reclaim-the-web" } });
    await tick();
    await element.updateComplete;
    element._skipIntro();
    const tv = element.shadowRoot.querySelector("vhs-blog-tv");
    expect(tv.still).to.equal(true);
    expect(element.shadowRoot.activeElement.id).to.equal("contentcontainer");
    element._replay();
    expect(tv.still).to.equal(false);
  });
});
