import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import "../lib/retro-vcr.js";
import "../lib/retro-console.js";
import "../lib/retro-controller.js";
import "../lib/programs/retro-tv-melee.js";
import "../lib/programs/retro-tv-static.js";
import { retroKitKey } from "../lib/retro-kit.js";

describe("retro-controller", () => {
  it("fires the button pressed and lights it", async () => {
    const el = await fixture(html`<retro-controller></retro-controller>`);
    const a = el.shadowRoot.querySelector('[aria-label="A"]');
    setTimeout(() => a.click());
    const e = await oneEvent(el, "retro-controller-press");
    expect(e.detail.button).to.equal("a");
    await el.updateComplete;
    expect(a.classList.contains("lit")).to.equal(true);
  });

  it("lights a button a host presses for a key it heard", async () => {
    const el = await fixture(html`<retro-controller></retro-controller>`);
    el.light("l");
    await el.updateComplete;
    expect(
      el.shadowRoot.querySelector(".dpad .l").classList.contains("lit"),
    ).to.equal(true);
  });

  it("maps arrows, A and B, and nothing with a modifier", () => {
    expect(retroKitKey({ key: "ArrowUp" })).to.equal("u");
    expect(retroKitKey({ key: "b" })).to.equal("b");
    expect(retroKitKey({ key: "a", ctrlKey: true })).to.equal("");
    expect(retroKitKey({ key: "Enter" })).to.equal("");
  });

  it("shows HAX and takes a colorway", async () => {
    const el = await fixture(
      html`<retro-controller colorway="goggle"></retro-controller>`,
    );
    expect(el.shadowRoot.querySelector(".brand").textContent).to.equal("HAX");
    const body = getComputedStyle(el.shadowRoot.querySelector(".ctl"));
    expect(body.backgroundColor).to.equal("rgb(47, 211, 224)");
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<retro-controller a-label="A: grab a block"></retro-controller>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});

describe("retro-console", () => {
  it("power toggles and lights the lamp; reset fires", async () => {
    const el = await fixture(html`<retro-console></retro-console>`);
    const [pwr, reset] = el.shadowRoot.querySelectorAll("button");
    setTimeout(() => pwr.click());
    const e = await oneEvent(el, "retro-console-power");
    expect(e.detail.power).to.equal(true);
    await el.updateComplete;
    expect(el.hasAttribute("power")).to.equal(true);
    expect(pwr.getAttribute("aria-pressed")).to.equal("true");
    setTimeout(() => reset.click());
    await oneEvent(el, "retro-console-reset");
  });

  it("labels the cartridge HAX Melee with four fighters", async () => {
    const el = await fixture(html`<retro-console></retro-console>`);
    expect(el.shadowRoot.querySelector(".ttl").textContent.trim()).to.equal(
      "HAX Melee",
    );
    expect(el.shadowRoot.querySelectorAll("rpg-character").length).to.equal(4);
    await expect(el).shadowDom.to.be.accessible();
  });
});

describe("retro-vcr", () => {
  it("fires its keys and shows the phase on the display", async () => {
    const el = await fixture(
      html`<retro-vcr rew-hint="previous channel"></retro-vcr>`,
    );
    const keys = el.shadowRoot.querySelectorAll("button");
    expect(keys.length).to.equal(4);
    expect(keys[1].getAttribute("aria-label")).to.equal(
      "Rew, previous channel",
    );
    setTimeout(() => keys[3].click());
    const e = await oneEvent(el, "retro-vcr-key");
    expect(e.detail.key).to.equal("ff");
    el.phase = "playing";
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".vfd").textContent.trim()).to.equal(
      "▶ PLAY",
    );
    expect(keys[2].classList.contains("down")).to.equal(true);
    await expect(el).shadowDom.to.be.accessible();
  });
});

describe("retro-tv-melee", () => {
  it("grabs, takes back, publishes and resets", async () => {
    const el = await fixture(html`<retro-tv-melee></retro-tv-melee>`);
    el.press("a");
    await el.updateComplete;
    expect(el.score).to.equal(1);
    expect(el.screenLabel).to.contain("Your page: paragraph.");
    el.press("b");
    expect(el.score).to.equal(0);
    el.press("start");
    expect(el.screenLabel).to.contain("grab a block first");
    el.reset();
    expect(el.screenLabel).to.contain("Rivals have 0, 0, 0 blocks.");
    el.press("a");
    expect(el.score).to.equal(1);
    el.press("start");
    expect(el.score).to.equal(0);
    expect(el.screenLabel).to.contain("page 1 published!");
  });

  it("rivals take a turn only when you press", async () => {
    const el = await fixture(html`<retro-tv-melee></retro-tv-melee>`);
    const before = el._g.rivals.map((r) => r.x).join();
    await new Promise((r) => setTimeout(r, 300));
    expect(el._g.rivals.map((r) => r.x).join()).to.equal(before);
    el.press("r");
    expect(el._g.rivals.map((r) => r.x).join()).to.not.equal(before);
  });
});

describe("retro-tv-static", () => {
  it("loads its cast once it goes on air", async () => {
    const el = await fixture(html`<retro-tv-static></retro-tv-static>`);
    expect(el.shadowRoot.querySelectorAll("rpg-character").length).to.equal(0);
    el.onAir = true;
    await el.updateComplete;
    await el.updateComplete;
    expect(
      el.shadowRoot.querySelectorAll("rpg-character").length,
    ).to.be.greaterThan(0);
    expect(el.screenLabel).to.equal(
      "Static, with rpg-characters tumbling through it",
    );
  });
});
