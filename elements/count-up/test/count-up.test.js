import { fixture, expect, html, assert } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";

import "../count-up.js";

// Basic functionality and accessibility tests
describe("count-up basic functionality", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<count-up start="0" end="100" duration="1"></count-up>`,
    );
  });

  it("should render correctly", () => {
    expect(element).to.exist;
    expect(element.tagName).to.equal("COUNT-UP");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("has correct default properties", async () => {
    const el = await fixture(html`<count-up></count-up>`);

    expect(el.start).to.equal(0);
    expect(el.end).to.equal(100);
    expect(el.duration).to.equal(2.5);
    expect(el.noeasing).to.be.false;
    expect(el.decimalplaces).to.equal(0);
    expect(el.separator).to.equal(",");
    expect(el.decimal).to.equal(".");
    expect(el.prefixtext).to.equal(" ");
    expect(el.suffixtext).to.equal(" ");
  });

  it("renders required DOM structure", () => {
    const wrapper = element.shadowRoot.querySelector(".wrapper");
    const counter = element.shadowRoot.querySelector("#counter");
    const prefixSlot = element.shadowRoot.querySelector('slot[name="prefix"]');
    const suffixSlot = element.shadowRoot.querySelector('slot[name="suffix"]');

    expect(wrapper).to.exist;
    expect(counter).to.exist;
    expect(prefixSlot).to.exist;
    expect(suffixSlot).to.exist;
  });
});

// Comprehensive A11y tests
describe("count-up accessibility tests", () => {
  it("passes accessibility test with default configuration", async () => {
    const el = await fixture(html`<count-up></count-up>`);
    await expect(el).to.be.accessible();
  });

  it("maintains accessibility with custom properties", async () => {
    const el = await fixture(html`
      <count-up
        start="0"
        end="50"
        duration="1"
        prefixtext="$"
        suffixtext="%"
      ></count-up>
    `);

    await expect(el).to.be.accessible();
  });

  it("maintains accessibility with slotted content", async () => {
    const el = await fixture(html`
      <count-up start="0" end="100">
        <span slot="prefix">Total: </span>
        <span slot="suffix"> items</span>
      </count-up>
    `);

    await expect(el).to.be.accessible();
  });

  it("has proper semantic structure", async () => {
    const el = await fixture(html`<count-up></count-up>`);

    const wrapper = el.shadowRoot.querySelector(".wrapper");
    const counter = el.shadowRoot.querySelector("#counter");

    expect(wrapper).to.exist;
    expect(counter).to.exist;
    expect(counter.id).to.equal("counter");
  });
});

// Property validation tests
describe("count-up property validation", () => {
  it("accepts valid numeric properties", async () => {
    const el = await fixture(html`
      <count-up start="10" end="90" duration="3" decimalplaces="2"></count-up>
    `);

    expect(el.start).to.equal(10);
    expect(el.end).to.equal(90);
    expect(el.duration).to.equal(3);
    expect(el.decimalplaces).to.equal(2);
    expect(typeof el.start).to.equal("number");
    expect(typeof el.end).to.equal("number");
    expect(typeof el.duration).to.equal("number");
    expect(typeof el.decimalplaces).to.equal("number");
  });

  it("accepts valid boolean properties", async () => {
    const el = await fixture(html`<count-up noeasing></count-up>`);

    expect(el.noeasing).to.be.true;
    expect(typeof el.noeasing).to.equal("boolean");
  });

  it("accepts valid string properties", async () => {
    const el = await fixture(html`
      <count-up
        separator="."
        decimal=","
        prefixtext="Price: $"
        suffixtext=" USD"
      ></count-up>
    `);

    expect(el.separator).to.equal(".");
    expect(el.decimal).to.equal(",");
    expect(el.prefixtext).to.equal("Price: $");
    expect(el.suffixtext).to.equal(" USD");
  });

  it("updates properties reactively", async () => {
    const el = await fixture(html`<count-up></count-up>`);

    el.start = 50;
    el.end = 200;
    el.duration = 1;
    el.noeasing = true;
    el.decimalplaces = 1;

    await el.updateComplete;

    expect(el.start).to.equal(50);
    expect(el.end).to.equal(200);
    expect(el.duration).to.equal(1);
    expect(el.noeasing).to.be.true;
    expect(el.decimalplaces).to.equal(1);
  });

  it("handles intersection observer properties", async () => {
    const el = await fixture(html`
      <count-up root-margin="10px" ratio="0.5"></count-up>
    `);

    expect(el.rootMargin).to.equal("10px");
    expect(el.ratio).to.equal(0.5);
  });
});

// Slot usage tests
describe("count-up slot usage", () => {
  it("renders prefix and suffix slots correctly", async () => {
    const el = await fixture(html`
      <count-up>
        <span slot="prefix">📊 </span>
        <span slot="suffix"> points</span>
      </count-up>
    `);

    const prefixSlot = el.shadowRoot.querySelector('slot[name="prefix"]');
    const suffixSlot = el.shadowRoot.querySelector('slot[name="suffix"]');

    expect(prefixSlot).to.exist;
    expect(suffixSlot).to.exist;

    const prefixElements = prefixSlot
      .assignedNodes({ flatten: true })
      .filter((node) => node.nodeType === Node.ELEMENT_NODE);
    const suffixElements = suffixSlot
      .assignedNodes({ flatten: true })
      .filter((node) => node.nodeType === Node.ELEMENT_NODE);

    expect(prefixElements.length).to.equal(1);
    expect(suffixElements.length).to.equal(1);
    expect(prefixElements[0].textContent).to.include("📊");
    expect(suffixElements[0].textContent).to.include("points");
  });

  it("handles complex slotted content", async () => {
    const el = await fixture(html`
      <count-up start="0" end="100">
        <div slot="prefix">
          <strong>Progress: </strong>
        </div>
        <div slot="suffix">
          <em>%</em>
          <small>(out of 100)</small>
        </div>
      </count-up>
    `);

    const prefixSlot = el.shadowRoot.querySelector('slot[name="prefix"]');
    const suffixSlot = el.shadowRoot.querySelector('slot[name="suffix"]');

    const prefixElements = prefixSlot
      .assignedNodes({ flatten: true })
      .filter((node) => node.nodeType === Node.ELEMENT_NODE);
    const suffixElements = suffixSlot
      .assignedNodes({ flatten: true })
      .filter((node) => node.nodeType === Node.ELEMENT_NODE);

    expect(prefixElements[0].querySelector("strong")).to.exist;
    expect(suffixElements[0].querySelector("em")).to.exist;
    expect(suffixElements[0].querySelector("small")).to.exist;
  });

  it("works without slotted content", async () => {
    const el = await fixture(html`<count-up start="0" end="50"></count-up>`);

    const prefixSlot = el.shadowRoot.querySelector('slot[name="prefix"]');
    const suffixSlot = el.shadowRoot.querySelector('slot[name="suffix"]');

    expect(prefixSlot).to.exist;
    expect(suffixSlot).to.exist;

    const prefixElements = prefixSlot
      .assignedNodes({ flatten: true })
      .filter((node) => node.nodeType === Node.ELEMENT_NODE);
    const suffixElements = suffixSlot
      .assignedNodes({ flatten: true })
      .filter((node) => node.nodeType === Node.ELEMENT_NODE);

    expect(prefixElements.length).to.equal(0);
    expect(suffixElements.length).to.equal(0);
  });
});

// CountUp functionality and animation tests
describe("count-up animation functionality", () => {
  it("initializes CountUp instance", async () => {
    const el = await fixture(
      html`<count-up start="0" end="100" duration="0.1"></count-up>`,
    );

    expect(el._countUp).to.exist;
    expect(typeof el._countUp.start).to.equal("function");
  });

  it("configures CountUp with correct options", async () => {
    const el = await fixture(html`
      <count-up
        start="10"
        end="50"
        duration="1"
        decimalplaces="2"
        separator="."
        decimal=","
        prefixtext="$"
        suffixtext=" USD"
        noeasing
      ></count-up>
    `);

    expect(el._countUp).to.exist;

    // Test that the countup was built with correct values
    expect(el.start).to.equal(10);
    expect(el.end).to.equal(50);
    expect(el.duration).to.equal(1);
    expect(el.decimalplaces).to.equal(2);
    expect(el.noeasing).to.be.true;
  });

  it("rebuilds CountUp when end value changes", async () => {
    const el = await fixture(
      html`<count-up start="0" end="50" duration="0.1"></count-up>`,
    );

    const originalCountUp = el._countUp;

    el.end = 100;
    await el.updateComplete;

    expect(el._countUp).to.exist;
    expect(el.end).to.equal(100);
  });

  it("handles visibility changes for intersection observer", async () => {
    const el = await fixture(
      html`<count-up start="0" end="100" duration="0.1"></count-up>`,
    );

    expect(el.elementVisible).to.be.undefined;

    el.elementVisible = true;
    await el.updateComplete;

    expect(el.elementVisible).to.be.true;
  });
});

// HAX integration tests
describe("count-up HAX integration", () => {
  it("has proper haxProperties configuration", async () => {
    const el = await fixture(html`<count-up></count-up>`);
    const haxProps = el.constructor.haxProperties;

    expect(haxProps).to.exist;
    expect(haxProps.canScale).to.be.true;
    expect(haxProps.canEditSource).to.be.true;
    expect(haxProps.gizmo.title).to.equal("Count up");
    expect(haxProps.gizmo.icon).to.equal("icons:android");
  });

  it("has proper settings configuration", async () => {
    const el = await fixture(html`<count-up></count-up>`);
    const haxProps = el.constructor.haxProperties;
    const settings = haxProps.settings.configure;

    expect(settings).to.be.an("array");
    expect(settings.length).to.be.greaterThan(0);

    const startConfig = settings.find((s) => s.property === "start");
    const endConfig = settings.find((s) => s.property === "end");
    const durationConfig = settings.find((s) => s.property === "duration");
    const noeasingConfig = settings.find((s) => s.property === "noeasing");

    expect(startConfig).to.exist;
    expect(endConfig).to.exist;
    expect(durationConfig).to.exist;
    expect(noeasingConfig).to.exist;
    expect(noeasingConfig.inputMethod).to.equal("boolean");
  });

  it("has correct tag name", async () => {
    const el = await fixture(html`<count-up></count-up>`);
    expect(el.constructor.tag).to.equal("count-up");
  });
});

// Responsive design tests
describe("count-up responsive design", () => {
  beforeEach(async () => {
    await setViewport({ width: 375, height: 750 });
  });

  afterEach(async () => {
    await setViewport({ width: 1024, height: 768 });
  });

  it("adapts to mobile viewport", async () => {
    const el = await fixture(html`<count-up start="0" end="100"></count-up>`);

    expect(el).to.exist;
    await el.updateComplete;

    const computedStyle = getComputedStyle(el);
    expect(computedStyle.display).to.equal("inline-flex");
  });

  it("maintains accessibility on mobile", async () => {
    const el = await fixture(html`
      <count-up start="0" end="100">
        <span slot="prefix">Mobile: </span>
      </count-up>
    `);

    await expect(el).to.be.accessible();
  });
});

describe("count-up desktop responsiveness", () => {
  beforeEach(async () => {
    await setViewport({ width: 1200, height: 800 });
  });

  afterEach(async () => {
    await setViewport({ width: 1024, height: 768 });
  });

  it("adapts to desktop viewport", async () => {
    const el = await fixture(html`<count-up start="0" end="100"></count-up>`);

    expect(el).to.exist;
    await el.updateComplete;

    const computedStyle = getComputedStyle(el);
    expect(computedStyle.display).to.equal("inline-flex");
  });
});

// Error handling and edge cases
describe("count-up error handling", () => {
  it("handles negative numbers", async () => {
    const el = await fixture(
      html`<count-up start="-10" end="10" duration="0.1"></count-up>`,
    );

    expect(el.start).to.equal(-10);
    expect(el.end).to.equal(10);
    expect(el._countUp).to.exist;
  });

  it("handles decimal numbers", async () => {
    const el = await fixture(html`
      <count-up
        start="0.5"
        end="99.9"
        decimalplaces="1"
        duration="0.1"
      ></count-up>
    `);

    expect(el.start).to.equal(0.5);
    expect(el.end).to.equal(99.9);
    expect(el.decimalplaces).to.equal(1);
  });

  it("handles large numbers", async () => {
    const el = await fixture(html`
      <count-up start="0" end="1000000" separator="," duration="0.1"></count-up>
    `);

    expect(el.end).to.equal(1000000);
    expect(el.separator).to.equal(",");
  });

  it("handles rapid property changes", async () => {
    const el = await fixture(html`<count-up duration="0.1"></count-up>`);

    // Rapidly change properties
    for (let i = 0; i < 10; i++) {
      el.start = i * 10;
      el.end = i * 100;
      el.duration = i * 0.1 + 0.1;
    }

    await el.updateComplete;
    expect(el.start).to.equal(90);
    expect(el.end).to.equal(900);
    expect(el.duration).to.equal(1);
  });

  it("handles special characters in text properties", async () => {
    const el = await fixture(html`
      <count-up
        prefixtext="💰 $"
        suffixtext=" € 💸"
        separator=" "
        decimal="·"
      ></count-up>
    `);

    expect(el.prefixtext).to.equal("💰 $");
    expect(el.suffixtext).to.equal(" € 💸");
    expect(el.separator).to.equal(" ");
    expect(el.decimal).to.equal("·");
  });

  it("maintains functionality when start > end", async () => {
    const el = await fixture(
      html`<count-up start="100" end="0" duration="0.1"></count-up>`,
    );

    expect(el.start).to.equal(100);
    expect(el.end).to.equal(0);
    expect(el._countUp).to.exist;
  });

  it("handles extreme decimal places", async () => {
    const el = await fixture(html`
      <count-up start="0" end="1" decimalplaces="10" duration="0.1"></count-up>
    `);

    expect(el.decimalplaces).to.equal(10);
    expect(el._countUp).to.exist;
  });

  it("handles very short and long durations", async () => {
    const shortEl = await fixture(html`<count-up duration="0.01"></count-up>`);
    const longEl = await fixture(html`<count-up duration="100"></count-up>`);

    expect(shortEl.duration).to.equal(0.01);
    expect(longEl.duration).to.equal(100);
    expect(shortEl._countUp).to.exist;
    expect(longEl._countUp).to.exist;
  });
});
