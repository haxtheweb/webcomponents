import { fixture, expect, html } from "@open-wc/testing";
import "../simple-range-input.js";
describe("Image comparison", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <simple-range-input
        accent-color="blue"
        label="Range input"
        style="--simple-range-input-track-height:15px"
      ></simple-range-input>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("simple-range-input behavior", () => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function readyFixture() {
    const el = await fixture(html`<simple-range-input></simple-range-input>`);
    // firstUpdated flips __ready on a timeout before updates notify
    await sleep(10);
    return el;
  }

  it("registers the DDD design system and keeps accent-color theming", async () => {
    // haxtheweb/issues#3107: extends DDD so DDDSuper registers the design
    // system on first construction, globally injecting the --ddd-*
    // variables the terminal track / thumb fallbacks now lean on, while
    // the inherited SimpleColorsSuper machinery keeps accent-color /
    // dark / contrast theming (and its palette vars) fully alive
    const el = await fixture(html`<simple-range-input></simple-range-input>`);
    await el.updateComplete;
    expect(el.accentColor).to.equal("grey");
    expect(el.dark).to.equal(false);
    const root = globalThis.getComputedStyle(
      globalThis.document.documentElement,
    );
    expect(
      root.getPropertyValue("--ddd-theme-default-coalyGray").trim(),
    ).to.not.equal("");
    expect(
      root.getPropertyValue("--ddd-theme-default-white").trim(),
    ).to.not.equal("");
    // the SimpleColors accent palette still resolves on the host
    const host = globalThis.getComputedStyle(el);
    expect(
      host.getPropertyValue("--simple-colors-default-theme-accent-2").trim(),
    ).to.not.equal("");
  });

  it("has expected defaults and renders slider attributes", async () => {
    const el = await fixture(html`<simple-range-input></simple-range-input>`);
    expect(el.dragging).to.equal(false);
    expect(el.label).to.equal("Range input");
    expect(el.min).to.equal(0);
    expect(el.max).to.equal(100);
    expect(el.step).to.equal(1);
    expect(el.value).to.equal(0);
    expect(el.immediateValue).to.equal(0);
    expect(el.disabled).to.equal(false);
    const input = el.shadowRoot.querySelector("input");
    expect(input.getAttribute("type")).to.equal("range");
    expect(input.getAttribute("min")).to.equal("0");
    expect(input.getAttribute("max")).to.equal("100");
    expect(input.getAttribute("step")).to.equal("1");
    expect(input.getAttribute("aria-labelledby")).to.equal("label");
    expect(el.shadowRoot.querySelector("#label").textContent).to.equal(
      "Range input",
    );
  });

  it("reflects min, max, step, disabled and dragging", async () => {
    const el = await readyFixture();
    el.min = 5;
    el.max = 55;
    el.step = 5;
    el.disabled = true;
    await el.updateComplete;
    const input = el.shadowRoot.querySelector("input");
    expect(input.getAttribute("min")).to.equal("5");
    expect(input.getAttribute("max")).to.equal("55");
    expect(input.getAttribute("step")).to.equal("5");
    expect(input.hasAttribute("disabled")).to.equal(true);
    expect(el.hasAttribute("disabled")).to.equal(true);
    el.disabled = false;
    el.dragging = true;
    await el.updateComplete;
    expect(input.hasAttribute("disabled")).to.equal(false);
    expect(el.hasAttribute("dragging")).to.equal(true);
  });

  it("updates immediateValue from input events and commits when idle", async () => {
    const el = await readyFixture();
    const input = el.shadowRoot.querySelector("input");
    input.value = "42";
    input.dispatchEvent(new InputEvent("input"));
    await el.updateComplete;
    await el.updateComplete;
    // FIXED (haxtheweb/issues#3102 #46): _inputChanged converts
    // e.target.value via parseFloat so the Number-typed properties hold
    // numbers instead of the raw event strings
    expect(el.immediateValue).to.equal(42);
    expect(el.value).to.equal(42);
  });

  it("updates value from changed events", async () => {
    const el = await readyFixture();
    const input = el.shadowRoot.querySelector("input");
    input.value = "37";
    input.dispatchEvent(new CustomEvent("changed"));
    await el.updateComplete;
    // FIXED (haxtheweb/issues#3102 #46): _valueChanged converts the raw
    // string from e.target.value as well
    expect(el.value).to.equal(37);
  });

  it("marks dragging on mousedown and commits on mouseup", async () => {
    const el = await readyFixture();
    let immediateEvent = null;
    el.addEventListener("immediate-value-changed", (e) => {
      immediateEvent = e.detail.value;
    });
    el.dispatchEvent(new MouseEvent("mousedown"));
    expect(el.dragging).to.equal(true);
    el.immediateValue = 50;
    await el.updateComplete;
    // while dragging the immediate value notifies but does not commit
    expect(immediateEvent).to.equal(50);
    expect(el.value).to.equal(0);
    el.dispatchEvent(new MouseEvent("mouseup"));
    await el.updateComplete;
    expect(el.dragging).to.equal(false);
    expect(el.value).to.equal(50);
  });

  it("treats value keys as drags and commits after the keydown", async () => {
    const el = await readyFixture();
    el.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    );
    expect(el.dragging).to.equal(true);
    el.immediateValue = 60;
    await el.updateComplete;
    // the keydown schedules a commit on the next tick
    await sleep(10);
    expect(el.value).to.equal(60);
    el.dispatchEvent(
      new KeyboardEvent("keyup", { key: "ArrowRight", bubbles: true }),
    );
    await el.updateComplete;
    expect(el.dragging).to.equal(false);
    expect(el.value).to.equal(60);
  });

  it("ignores keys that do not change the value", async () => {
    const el = await readyFixture();
    el.immediateValue = 70;
    await el.updateComplete;
    expect(el.value).to.equal(70);
    el.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Tab", bubbles: true }),
    );
    expect(el.dragging).to.equal(false);
    await sleep(10);
    expect(el.value).to.equal(70);
    el.dispatchEvent(new KeyboardEvent("keyup", { key: "Tab", bubbles: true }));
    await el.updateComplete;
    expect(el.dragging).to.equal(false);
    expect(el.value).to.equal(70);
  });

  it("notifies value changes and immediate values while dragging", async () => {
    const el = await readyFixture();
    let valueEvent = null;
    let immediateEvent = null;
    el.addEventListener("value-changed", (e) => {
      valueEvent = e.detail.value;
    });
    el.addEventListener("immediate-value-changed", (e) => {
      immediateEvent = e.detail.value;
    });
    el.value = 25;
    await el.updateComplete;
    expect(valueEvent).to.equal(25);
    el.dragging = true;
    el.immediateValue = 30;
    await el.updateComplete;
    expect(immediateEvent).to.equal(30);
    expect(el.value).to.equal(25);
  });
});

describe("simple-range-input keyboard focus ring", () => {
  it("draws a visible outline when reached with Tab", async () => {
    const { sendKeys } = await import("@web/test-runner-commands");
    const wrap = await fixture(
      html`<div>
        <button id="before">before</button>
        <simple-range-input
          label="Volume"
          min="0"
          max="10"
        ></simple-range-input>
      </div>`,
    );
    const range = wrap.querySelector("simple-range-input");
    await range.updateComplete;
    wrap.querySelector("#before").focus();
    await sendKeys({ press: "Tab" });
    const input = range.shadowRoot.querySelector("input");
    expect(range.shadowRoot.activeElement).to.equal(input);
    const cs = getComputedStyle(input);
    expect(cs.outlineStyle).to.not.equal("none");
    expect(parseFloat(cs.outlineWidth)).to.be.above(0);
  });
});

describe("simple-range-input pin lift", () => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const liftNow = (el) =>
    parseFloat(el.style.getPropertyValue("--simple-range-input-lift-now")) || 0;

  it("is off by default and draws no lift", async () => {
    const el = await fixture(html`<simple-range-input></simple-range-input>`);
    expect(el.lift).to.equal(false);
    expect(el.shadowRoot.querySelector("#lift")).to.equal(null);
  });

  it("draws the track as a hidden decoration under the native input", async () => {
    const el = await fixture(
      html`<simple-range-input
        lift
        label="Seek"
        min="0"
        max="100"
        value="50"
        style="width: 300px; --ddd-range-lift-duration: 0ms"
      ></simple-range-input>`,
    );
    await sleep(20);
    const svg = el.shadowRoot.querySelector("#lift");
    expect(svg).to.not.equal(null);
    expect(svg.getAttribute("aria-hidden")).to.equal("true");
    expect(el.hasAttribute("lift")).to.equal(true);
    // the native input stays the control
    const input = el.shadowRoot.querySelector("input");
    expect(input.getAttribute("type")).to.equal("range");
    expect(
      el.shadowRoot.querySelector("#lift-fill").getAttribute("d"),
    ).to.match(/^M/);
    expect(
      el.shadowRoot.querySelector("#lift-track").getAttribute("d"),
    ).to.match(/^M/);
    // flat at rest, with the space for the bump reserved
    expect(liftNow(el)).to.equal(0);
    expect(
      parseFloat(globalThis.getComputedStyle(el).paddingTop),
    ).to.be.greaterThan(0);
    await expect(el).shadowDom.to.be.accessible();
  });

  it("rises while grabbed and settles when let go", async () => {
    const el = await fixture(
      html`<simple-range-input
        lift
        min="0"
        max="100"
        value="25"
        style="width: 300px; --ddd-range-lift-duration: 0ms; --simple-range-input-lift-height: 12px"
      ></simple-range-input>`,
    );
    await sleep(20);
    el.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    expect(liftNow(el)).to.equal(12);
    globalThis.dispatchEvent(new PointerEvent("pointerup"));
    expect(liftNow(el)).to.equal(0);
  });

  it("rises for value keys after a click focus", async () => {
    const el = await fixture(
      html`<simple-range-input
        lift
        style="width: 300px; --ddd-range-lift-duration: 0ms; --simple-range-input-lift-height: 10px"
      ></simple-range-input>`,
    );
    await sleep(20);
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    expect(liftNow(el)).to.equal(10);
    el.dispatchEvent(new FocusEvent("focusout"));
    expect(liftNow(el)).to.equal(0);
  });

  it("keeps part of the bump at rest when the rest token asks", async () => {
    const el = await fixture(
      html`<simple-range-input
        lift
        style="width: 300px; --ddd-range-lift-duration: 0ms; --simple-range-input-lift-height: 20px; --simple-range-input-lift-rest: 0.5"
      ></simple-range-input>`,
    );
    await sleep(20);
    expect(liftNow(el)).to.equal(10);
  });
});
