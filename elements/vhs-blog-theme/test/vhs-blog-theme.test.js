import { html, fixture, expect } from "@open-wc/testing";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { DesignSystemManager } from "@haxtheweb/d-d-d/lib/DesignSystemManager.js";
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
    const vcr = root.querySelector("vhs-blog-console retro-vcr");
    expect(vcr.getAttribute("slot")).to.equal("vcr");
    expect(vcr.phase).to.equal("idle");
    expect(vcr.disabled).to.equal("eject rew skip");
    expect(root.querySelector("vhs-blog-tv").hasAttribute("off")).to.equal(
      true,
    );
  });

  it("drops a tape into the VCR before routing", async () => {
    element._loadTape(ITEMS[1]);
    await element.updateComplete;
    const vcr = element.shadowRoot.querySelector("retro-vcr");
    expect(element.phase).to.equal("open");
    expect(vcr.tapeLabel).to.equal("Pure Joy");
    expect(vcr.disabled).to.equal("eject rew play skip ff");
    expect(
      element.shadowRoot.querySelector(".tower a.tape.out").textContent,
    ).to.contain("Pure Joy");
    element._clearTimers();
    element.phase = "idle";
    element.loadingTitle = "";
  });

  it("styles authored DDD blocks with Keepcase through the bridge", () => {
    expect(DesignSystemManager.active).to.equal("keepcase");
    const cs = globalThis.getComputedStyle(globalThis.document.documentElement);
    expect(
      cs.getPropertyValue("--ddd-theme-default-beaverBlue").trim(),
    ).to.equal("#3a0ca3");
    expect(cs.getPropertyValue("--ddd-focus-ring").trim()).to.equal(
      "3px solid #ffd60a",
    );
  });

  it("names the VCR rewind and fast forward keys for what they do", () => {
    const keys = element.shadowRoot
      .querySelector("retro-vcr")
      .shadowRoot.querySelectorAll("button");
    expect(keys[1].getAttribute("aria-label")).to.equal("Rew, previous post");
    expect(keys[4].getAttribute("aria-label")).to.equal("FF, next post");
  });

  it("flips the TV to channel 4, 2 and back, with a pause for the static", async () => {
    const root = element.shadowRoot;
    const tv = root.querySelector("vhs-blog-tv");
    tv.shadowRoot.querySelector("button.screen").click();
    await element.updateComplete;
    await tv.updateComplete;
    expect(element.channel).to.equal(4);
    expect(
      tv.shadowRoot.querySelector("button.screen .sr-only").textContent.trim(),
    ).to.equal("Channel 4: static. Change channel");
    const fuzz = tv.shadowRoot.querySelector("retro-tv-static");
    await fuzz.updateComplete;
    expect(fuzz.shadowRoot.querySelectorAll("rpg-character").length).to.equal(
      2,
    );
    const pause = root.querySelector(".hint button[aria-pressed]");
    expect(pause.textContent.trim()).to.equal("Pause static");
    pause.click();
    await element.updateComplete;
    expect(tv.held).to.equal(true);
    expect(pause.getAttribute("aria-pressed")).to.equal("true");
    const cabinet = root.querySelector("vhs-blog-console");
    // the shared dial: numbers on the ring, the knob is the button
    cabinet.shadowRoot.querySelector("button.knob").click();
    await element.updateComplete;
    expect(element.channel).to.equal(2);
    expect(root.querySelector("retro-console").power).to.equal(true);
    cabinet.shadowRoot.querySelector("button.knob").click();
    await element.updateComplete;
    expect(element.channel).to.equal(3);
    expect(root.querySelector(".hint button[aria-pressed]")).to.equal(null);
  });

  it("plays HAX Melee from the controller and turns the set off and on", async () => {
    const root = element.shadowRoot;
    const pad = root.querySelector("retro-controller");
    expect(pad.getAttribute("slot")).to.equal("game");
    pad.press("a");
    await element.updateComplete;
    expect(element.channel).to.equal(2);
    const tv = root.querySelector("vhs-blog-tv");
    await tv.updateComplete;
    const melee = tv.shadowRoot.querySelector("retro-tv-melee");
    pad.press("a");
    expect(melee.score + melee._g.rivals[0].x).to.be.greaterThan(0);
    const cabinet = root.querySelector("vhs-blog-console");
    cabinet.shadowRoot.querySelector("button.pwr").click();
    await element.updateComplete;
    expect(element.tvPower).to.equal(false);
    expect(tv.hasAttribute("off")).to.equal(true);
    cabinet.shadowRoot.querySelector("button.pwr").click();
    await element.updateComplete;
    tv.tune(3);
    await element.updateComplete;
  });

  it("unboxes a tape: sleeve and cassette fly, then the deck takes over", async () => {
    element._unboxTape(
      ITEMS[1],
      { left: 700, top: 100, width: 50, height: 222, right: 750, bottom: 322 },
      { left: 20, top: 40, width: 400, height: 300, right: 420, bottom: 340 },
    );
    await element.updateComplete;
    const fly = element.shadowRoot.querySelector(".fly");
    expect(fly.getAttribute("aria-hidden")).to.equal("true");
    expect(
      fly.querySelector(".sleeve vhs-blog-cover").getAttribute("case-title"),
    ).to.equal("Pure Joy");
    expect(element.phase).to.equal("unbox");
    expect(
      element.shadowRoot.querySelector(".hint [role=status]").textContent,
    ).to.equal("Loading Pure Joy…");
    element._clearTimers();
    await element.updateComplete;
    expect(element.shadowRoot.querySelector(".fly")).to.equal(null);
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
    expect(root.querySelector("retro-vcr").disabled).to.equal("rew");
    await expect(element).shadowDom.to.be.accessible({
      ignoredRules: ["skip-link"],
    });
  });

  it("rewinds and fast forwards between posts", async () => {
    store.activeId = "b";
    element._noticeLocation({ route: { name: "pure-joy" } });
    await tick();
    await element.updateComplete;
    element._vcrKey({ detail: { key: "ff" } });
    await element.updateComplete;
    const vcr = element.shadowRoot.querySelector("retro-vcr");
    const tv = element.shadowRoot.querySelector("vhs-blog-tv");
    await vcr.updateComplete;
    expect(element.phase).to.equal("ff");
    expect(tv.seek).to.equal("ff");
    expect(vcr.shadowRoot.querySelector(".vfd").textContent.trim()).to.equal(
      "FF ▶▶",
    );
    element._clearTimers();
    element._vcrKey({ detail: { key: "rew" } });
    await element.updateComplete;
    expect(element.phase).to.equal("rew");
    element._clearTimers();
    element.phase = "playing";
  });

  it("turns the box art over to a readable back with a QR to the post", async () => {
    store.activeId = "a";
    element._noticeLocation({ route: { name: "reclaim-the-web" } });
    await tick();
    await element.updateComplete;
    const root = element.shadowRoot;
    const hit = root.querySelector(".fliphit");
    expect(root.querySelector(".face-back").inert).to.equal(true);
    hit.click();
    await element.updateComplete;
    expect(element.flipped).to.equal(true);
    expect(hit.getAttribute("aria-pressed")).to.equal("true");
    expect(root.querySelector(".face-front").inert).to.equal(true);
    expect(root.querySelector(".face-back").inert).to.equal(false);
    const back = root.querySelector("vhs-blog-back");
    await back.updateComplete;
    const qr = back.shadowRoot.querySelector("qr-code");
    expect(qr.getAttribute("data")).to.contain("reclaim-the-web");
    expect(qr.getAttribute("alt")).to.equal(
      "QR code that opens Reclaim the web",
    );
    expect(root.querySelector(".flipnote").textContent.trim()).to.equal(
      "Back of the box · select it to turn it over",
    );
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
      .querySelector("retro-vcr")
      .shadowRoot.querySelectorAll("button")[3]
      .click();
    const tv = element.shadowRoot.querySelector("vhs-blog-tv");
    expect(tv.still).to.equal(true);
    expect(element.shadowRoot.activeElement.id).to.equal("contentcontainer");
    element._replay();
    expect(tv.still).to.equal(false);
  });
});
