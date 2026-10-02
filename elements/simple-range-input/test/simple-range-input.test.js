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
