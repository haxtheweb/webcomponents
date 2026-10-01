import { fixture, expect, html } from "@open-wc/testing";

import "../lib/a11y-media-button.js";
import "../lib/a11y-media-play-button.js";
import "../lib/a11y-media-transcript-cue.js";

describe("a11y-media-button", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(
      html`<a11y-media-button
        icon="av:play-arrow"
        label="Play"
      ></a11y-media-button>`,
    );
    await el.updateComplete;
  });

  it("reflects constructor defaults", () => {
    expect(el.accentColor).to.equal("red");
    expect(el.dark).to.equal(false);
    expect(el.controls).to.equal("video");
    expect(el.disabled).to.equal(false);
    expect(el.toggle).to.equal(false);
    expect(el.tooltipPosition).to.equal("bottom");
  });

  it("reflects properties as attributes", async () => {
    el.action = "play";
    el.controls = "transcript";
    el.icon = "av:pause";
    el.label = "Pause";
    el.disabled = true;
    el.toggle = true;
    el.tooltipPosition = "top";
    await el.updateComplete;
    expect(el.getAttribute("action")).to.equal("play");
    expect(el.getAttribute("controls")).to.equal("transcript");
    // lit boolean reflection sets the attribute to an empty string
    expect(el.hasAttribute("toggle")).to.be.true;
    expect(el.disabled).to.equal(true);
    const button = el.shadowRoot.querySelector("#button");
    expect(button.disabled).to.equal(true);
    expect(button.getAttribute("aria-pressed")).to.equal("true");
    expect(button.getAttribute("aria-label")).to.equal("Pause");
  });

  it("exposes aria-describedby from the description property", async () => {
    const button = el.shadowRoot.querySelector("#button");
    expect(button.hasAttribute("aria-describedby")).to.be.false;
    el.description = "play-button-hint";
    await el.updateComplete;
    expect(button.getAttribute("aria-describedby")).to.equal(
      "play-button-hint",
    );
  });

  it("renders a tooltip only when labelled", async () => {
    expect(el.shadowRoot.querySelector("simple-tooltip")).to.exist;
    el.label = "";
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("simple-tooltip")).to.not.exist;
  });

  it("fires button-click with itself as the detail", async () => {
    const fired = [];
    el.addEventListener("button-click", (e) => fired.push(e.detail));
    el.shadowRoot
      .querySelector("#button")
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await el.updateComplete;
    expect(fired.length).to.equal(1);
    expect(fired[0] === el).to.be.true;
  });

  it("passes the a11y audit", async () => {
    await expect(el).shadowDom.to.be.accessible();
  });
});

describe("a11y-media-play-button", () => {
  it("renders the plain play arrow without a youtube id", async () => {
    const el = await fixture(
      html`<a11y-media-play-button label="Play"></a11y-media-play-button>`,
    );
    await el.updateComplete;
    expect(el.constructor.tag).to.equal("a11y-media-play-button");
    expect(el.youtubeId).to.equal(null);
    const svg = el.shadowRoot.querySelector("#svg");
    expect(svg).to.exist;
    expect(el.shadowRoot.querySelector("#arrow")).to.exist;
    expect(el.shadowRoot.querySelector("#text").textContent.trim()).to.equal(
      "Play",
    );
  });

  it("renders the youtube logo with a youtube id", async () => {
    const el = await fixture(
      html`<a11y-media-play-button
        youtube-id="abc123"
        label="Play"
      ></a11y-media-play-button>`,
    );
    await el.updateComplete;
    expect(el.youtubeId).to.equal("abc123");
    const svg = el.shadowRoot.querySelector("#svg");
    expect(svg).to.exist;
    expect(el.shadowRoot.querySelector("#arrow")).to.not.exist;
    expect(el.shadowRoot.querySelector("path")).to.exist;
  });

  it("hides the button from assistive tech when disabled", async () => {
    const el = await fixture(
      html`<a11y-media-play-button
        disabled
        label="Play"
      ></a11y-media-play-button>`,
    );
    await el.updateComplete;
    const button = el.shadowRoot.querySelector("#button");
    expect(button.getAttribute("aria-hidden")).to.equal("true");
    expect(button.disabled).to.equal(true);
  });

  it("inherits the button-click event", async () => {
    const el = await fixture(
      html`<a11y-media-play-button label="Play"></a11y-media-play-button>`,
    );
    await el.updateComplete;
    const fired = [];
    el.addEventListener("button-click", (e) => fired.push(e.detail));
    el.shadowRoot
      .querySelector("#button")
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(fired.length).to.equal(1);
  });
});

describe("a11y-media-transcript-cue", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(
      html`<a11y-media-transcript-cue
        >Hello from the cue</a11y-media-transcript-cue
      >`,
    );
    await el.updateComplete;
  });

  it("reflects constructor defaults", () => {
    expect(el.active).to.equal(false);
    expect(el.disabled).to.equal(false);
    expect(el.hideTimestamps).to.equal(false);
    expect(el.start).to.equal("");
    expect(el.end).to.equal("");
  });

  it("renders the cue timestamp and slotted text", async () => {
    el.start = "00:01";
    el.end = "00:05";
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("#time").textContent.trim()).to.equal(
      "00:01 - 00:05",
    );
    // slotted content lives in light DOM, surfaced through the #text slot
    expect(el.shadowRoot.querySelector("#text slot")).to.exist;
    expect(el.textContent.trim()).to.equal("Hello from the cue");
  });

  it("hides the timestamp column with hide-timestamps", async () => {
    el.hideTimestamps = true;
    await el.updateComplete;
    expect(el.hasAttribute("hide-timestamps")).to.be.true;
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute("disabled")).to.be.true;
  });

  it("fires active-changed when the cue becomes active", async () => {
    const events = [];
    el.addEventListener("active-changed", (e) => events.push(e.detail));
    el.active = true;
    await el.updateComplete;
    expect(events.length).to.equal(1);
    expect(events[0].value).to.equal(true);
    expect(events[0].oldValue).to.equal(false);
    expect(events[0].element === el).to.be.true;
    // staying active does not re-fire
    el.start = "00:02";
    await el.updateComplete;
    expect(events.length).to.equal(1);
  });

  it("passes the a11y audit", async () => {
    el.start = "00:01";
    el.end = "00:05";
    await el.updateComplete;
    await expect(el).shadowDom.to.be.accessible();
  });
});
