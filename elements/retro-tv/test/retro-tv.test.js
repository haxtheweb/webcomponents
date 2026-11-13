import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import "../retro-tv.js";
import "../lib/programs/retro-tv-title-sequence.js";
import "../lib/programs/retro-tv-hax-tv.js";
import "../lib/programs/retro-tv-credits.js";
import "../lib/programs/retro-tv-home-computer.js";
import "../lib/programs/retro-tv-handheld.js";
import "../lib/programs/retro-tv-pc.js";
import "../lib/programs/retro-tv-disc.js";

const settle = async (el) => {
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
};

describe("retro-tv", () => {
  let element;
  beforeEach(async () => {
    try {
      globalThis.localStorage.removeItem("retro-tv-test");
    } catch {
      // storage may be unavailable
    }
    element = await fixture(html`
      <retro-tv channel="4" controls>
        <retro-tv-title-sequence
          channel="3"
          crawl-title="Rewind"
        ></retro-tv-title-sequence>
        <retro-tv-hax-tv channel="4"></retro-tv-hax-tv>
        <retro-tv-credits channel="5" tape="001"></retro-tv-credits>
        <retro-tv-home-computer channel="7"></retro-tv-home-computer>
        <retro-tv-handheld channel="8"></retro-tv-handheld>
        <retro-tv-pc channel="9"></retro-tv-pc>
        <retro-tv-disc channel="10"></retro-tv-disc>
      </retro-tv>
    `);
    await settle(element);
  });

  it("is defined", () => {
    expect(customElements.get("retro-tv")).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("lists programs in channel order", () => {
    const channels = element.programs.map((p) => p.channel);
    expect(channels).to.deep.equal([3, 4, 5, 7, 8, 9, 10]);
  });

  it("puts only the program on this channel on air", () => {
    const on = element.querySelectorAll("[on-air]");
    expect(on.length).to.equal(1);
    expect(on[0].tagName.toLowerCase()).to.equal("retro-tv-hax-tv");
    expect(on[0].getAttribute("slot")).to.equal("on-air");
  });

  it("names the screen after the program on air", () => {
    const screen = element.shadowRoot.querySelector(".screen");
    expect(screen.getAttribute("role")).to.equal("img");
    expect(screen.getAttribute("aria-label")).to.equal(
      "Future Travelers bouncing around the screen",
    );
  });

  it("tunes and fires retro-tv-channel-changed", async () => {
    setTimeout(() => element.tune(8));
    const ev = await oneEvent(element, "retro-tv-channel-changed");
    expect(ev.detail.channel).to.equal(8);
    await settle(element);
    expect(element.querySelector("retro-tv-handheld").onAir).to.be.true;
    expect(element.querySelector("retro-tv-hax-tv").onAir).to.be.false;
  });

  it("next and previous wrap around the programs", async () => {
    element.tune(10);
    await settle(element);
    element.next();
    await settle(element);
    expect(element.channel).to.equal(3);
    element.previous();
    await settle(element);
    expect(element.channel).to.equal(10);
  });

  it("shows static when no program has the channel", async () => {
    element.tune(2);
    await settle(element);
    expect(element.program).to.be.null;
    expect(element.shadowRoot.querySelector(".screen.empty")).to.exist;
    expect(element.querySelectorAll("[on-air]").length).to.equal(0);
  });

  it("uses the channel label or CH and the number", async () => {
    const osd = element.shadowRoot.querySelector(".osd.ch");
    expect(osd.textContent.trim()).to.equal("CH 04");
    element.channelLabel = "CH 03";
    await settle(element);
    expect(osd.textContent.trim()).to.equal("CH 03");
  });

  it("knobs are buttons that change channel and power", async () => {
    const knobs = element.shadowRoot.querySelectorAll("button.knob");
    expect(knobs.length).to.equal(2);
    knobs[0].click();
    await settle(element);
    expect(element.channel).to.equal(5);
    setTimeout(() => knobs[1].click());
    const ev = await oneEvent(element, "retro-tv-power-changed");
    expect(ev.detail.power).to.be.false;
    await settle(element);
    expect(element.querySelectorAll("[on-air]").length).to.equal(0);
    expect(
      element.shadowRoot.querySelector(".screen").getAttribute("aria-label"),
    ).to.equal("TV is off");
    expect(knobs[1].getAttribute("aria-pressed")).to.equal("true");
  });

  it("knobs are decoration without controls", async () => {
    const el = await fixture(html`
      <retro-tv channel="3">
        <div channel="3" label="A plain program"></div>
      </retro-tv>
    `);
    await settle(el);
    expect(el.shadowRoot.querySelectorAll("button.knob").length).to.equal(0);
    expect(
      el.shadowRoot.querySelector(".side").getAttribute("aria-hidden"),
    ).to.equal("true");
    expect(
      el.shadowRoot.querySelector(".screen").getAttribute("aria-label"),
    ).to.equal("A plain program");
  });

  it("passes still to every program", async () => {
    element.still = true;
    await settle(element);
    element.programs.forEach((p) => {
      expect(p.hasAttribute("still")).to.be.true;
    });
    element.still = false;
    await settle(element);
    expect(element.programs[0].hasAttribute("still")).to.be.false;
  });

  it("remembers power when remember-power is set", async () => {
    const el = await fixture(html`
      <retro-tv channel="4" remember-power="retro-tv-test">
        <retro-tv-hax-tv channel="4"></retro-tv-hax-tv>
      </retro-tv>
    `);
    await settle(el);
    el.togglePower();
    await settle(el);
    expect(globalThis.localStorage.getItem("retro-tv-test")).to.equal("off");
    const again = await fixture(html`
      <retro-tv channel="4" remember-power="retro-tv-test">
        <retro-tv-hax-tv channel="4"></retro-tv-hax-tv>
      </retro-tv>
    `);
    await settle(again);
    expect(again.power).to.be.false;
  });

  it("replay restarts the program on air", async () => {
    const p = element.program;
    const run = p._run;
    element.replay();
    expect(p._run).to.equal(run + 1);
  });

  it("programs name themselves", () => {
    const names = element.programs.map((p) => p.programName);
    expect(names).to.deep.equal([
      "Rewind",
      "HAX TV: Future Travelers on the loose",
      "Credits",
      "Home computer, 1982",
      "Handheld, 1989",
      "PC, 1991",
      "Disc console, 1995",
    ]);
  });

  it("credits roll the default lines and the tape label", async () => {
    element.tune(5);
    await settle(element);
    const credits = element.querySelector("retro-tv-credits");
    await credits.updateComplete;
    const text = credits.shadowRoot.textContent;
    expect(text).to.contain("Future Traveler");
    expect(credits.shadowRoot.querySelector(".label").textContent).to.contain(
      "001",
    );
    credits.lines = [{ role: "Made by", name: "Our team" }];
    await credits.updateComplete;
    expect(credits.shadowRoot.textContent).to.contain("Our team");
  });

  it("the PC shows progress while loading", async () => {
    element.tune(9);
    await settle(element);
    const pc = element.querySelector("retro-tv-pc");
    pc.message = "Checking requirements...";
    pc.loading = true;
    await pc.updateComplete;
    const text = pc.shadowRoot.querySelector("pre").textContent;
    expect(text).to.contain("Checking requirements...");
    expect(text).to.contain("%");
  });

  it("the home computer loads the named program", async () => {
    element.tune(7);
    await settle(element);
    const hc = element.querySelector("retro-tv-home-computer");
    hc.still = true;
    hc.what = "language";
    hc.loading = true;
    await hc.updateComplete;
    hc.restart();
    await hc.updateComplete;
    expect(hc.shadowRoot.querySelector("pre").textContent).to.contain(
      'LOAD "LANGUAGE"',
    );
  });
});
