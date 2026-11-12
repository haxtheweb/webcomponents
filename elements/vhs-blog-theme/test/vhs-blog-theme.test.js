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

  it("fills the tape tower first, then aisles and box sets", () => {
    const shelf = element._shelf();
    expect(shelf.tower.map((i) => i.id)).to.deep.equal(["a", "b"]);
    expect(shelf.aisles.length).to.equal(1);
    expect(shelf.aisles[0].box).to.equal(true);
    expect(shelf.aisles[0].items.map((i) => i.id)).to.deep.equal([
      "c",
      "d",
      "e",
    ]);
  });

  it("makes every tape a keyboard reachable link named by its title", () => {
    const tapes = element.shadowRoot.querySelectorAll(".tower a.tape");
    expect(tapes.length).to.equal(2);
    tapes.forEach((a) => {
      expect(a.getAttribute("href")).to.not.equal("");
      expect(a.tabIndex).to.equal(0);
      expect(a.querySelector(".vt").getAttribute("aria-hidden")).to.equal(
        "true",
      );
    });
    expect(tapes[0].querySelector(".sr-only").textContent).to.equal(
      "Reclaim the web, 6 min read",
    );
  });

  it("sits the VCR on the console with the TV off at the shelf", () => {
    const root = element.shadowRoot;
    const vcr = root.querySelector("vhs-blog-console vhs-blog-vcr");
    expect(vcr.getAttribute("slot")).to.equal("vcr");
    expect(vcr.phase).to.equal("idle");
    expect(vcr.disabled).to.equal("eject prev skip");
    expect(root.querySelector("vhs-blog-tv").hasAttribute("off")).to.equal(
      true,
    );
  });

  it("drops a tape into the VCR before routing", async () => {
    element._loadTape(ITEMS[1]);
    await element.updateComplete;
    const vcr = element.shadowRoot.querySelector("vhs-blog-vcr");
    expect(element.phase).to.equal("open");
    expect(vcr.tapeTitle).to.equal("Pure Joy");
    expect(vcr.disabled).to.equal("eject prev play skip next");
    expect(
      element.shadowRoot.querySelector(".tower a.tape.out").textContent,
    ).to.contain("Pure Joy");
    element._clearTimers();
    element.phase = "idle";
    element.loadingTitle = "";
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
    expect(root.querySelector("vhs-blog-tv").hasAttribute("off")).to.equal(
      false,
    );
    expect(root.querySelector("vhs-blog-vcr").disabled).to.equal("prev");
    await expect(element).shadowDom.to.be.accessible({
      ignoredRules: ["skip-link"],
    });
  });

  it("keeps HAX wired to the live content area after the shelf swap", async () => {
    const before = element.contentContainer;
    store.activeId = "a";
    element._noticeLocation({ route: { name: "reclaim-the-web" } });
    await tick();
    await element.updateComplete;
    const live = element.shadowRoot.querySelector("#contentcontainer");
    expect(live.tagName).to.equal("ARTICLE");
    expect(element.contentContainer).to.equal(live);
    expect(element.contentContainer).to.not.equal(before);
    expect(live.isConnected).to.equal(true);
  });

  it("edits on the post layout even at the site root", async () => {
    element.editMode = true;
    await element.updateComplete;
    await tick();
    const live = element.shadowRoot.querySelector("#contentcontainer");
    expect(live.tagName).to.equal("ARTICLE");
    expect(element.contentContainer).to.equal(live);
    element.editMode = false;
    await element.updateComplete;
  });

  it("skip intro stills the TV and moves focus to the content", async () => {
    store.activeId = "a";
    element._noticeLocation({ route: { name: "reclaim-the-web" } });
    await tick();
    await element.updateComplete;
    element.shadowRoot
      .querySelector("vhs-blog-vcr")
      .shadowRoot.querySelectorAll("button")[3]
      .click();
    const tv = element.shadowRoot.querySelector("vhs-blog-tv");
    expect(tv.still).to.equal(true);
    expect(element.shadowRoot.activeElement.id).to.equal("contentcontainer");
    element._replay();
    expect(tv.still).to.equal(false);
  });
});
