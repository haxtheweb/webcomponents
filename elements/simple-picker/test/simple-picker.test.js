import { fixture, expect, html, oneEvent } from "@open-wc/testing";

import "../simple-picker.js";
import "../lib/simple-picker-option.js";
import "../lib/simple-emoji-picker.js";
import { SimplePicker, SimplePickerBehaviors } from "../simple-picker.js";
import { SimplePickerOption } from "../lib/simple-picker-option.js";

// Basic functionality and accessibility
describe("simple-picker basic functionality", () => {
  it("instantiates with the correct tag", async () => {
    const el = await fixture(html`<simple-picker></simple-picker>`);
    expect(el).to.exist;
    expect(el.tagName).to.equal("SIMPLE-PICKER");
    expect(el.constructor.tag).to.equal("simple-picker");
  });

  it("passes the a11y audit (shadow DOM)", async () => {
    const el = await fixture(
      html`<simple-picker label="Pick a color"></simple-picker>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit with options and a value", async () => {
    const options = [
      [
        { alt: "Red", value: "red" },
        { alt: "Blue", value: "blue" },
      ],
    ];
    const el = await fixture(
      html`<simple-picker label="Pick a color" .options=${options} .value=${"blue"}></simple-picker>`,
    );
    await el.updateComplete;
    await expect(el).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit when disabled", async () => {
    const el = await fixture(
      html`<simple-picker label="Pick a color" disabled></simple-picker>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});

// Property and state behavior
describe("simple-picker property behavior", () => {
  it("reflects the disabled attribute", async () => {
    const el = await fixture(
      html`<simple-picker disabled></simple-picker>`,
    );
    expect(el.hasAttribute("disabled")).to.be.true;
  });

  it("has correct default property values", async () => {
    const el = await fixture(html`<simple-picker></simple-picker>`);
    expect(el.allowNull).to.equal(false);
    expect(el.alignRight).to.equal(false);
    expect(el.blockLabel).to.equal(false);
    expect(el.disabled).to.equal(false);
    expect(el.expanded).to.equal(false);
    expect(el.hideOptionLabels).to.equal(false);
    expect(el.hideSample).to.equal(false);
    expect(el.titleAsHtml).to.equal(false);
    expect(el.value).to.be.null;
    expect(el.options).to.deep.equal([]);
    expect(el.__activeDesc).to.equal("option-0-0");
  });

  it("hideNull is driven by allowNull and hideNullOption", async () => {
    const el = await fixture(html`<simple-picker></simple-picker>`);
    // allowNull defaults off, so nulls are hidden
    expect(el.hideNull).to.be.true;

    el.allowNull = true;
    await el.updateComplete;
    expect(el.hideNull).to.be.false;

    el.hideNullOption = true;
    await el.updateComplete;
    expect(el.hideNull).to.be.true;
  });

  it("sets __selectedOption based on value", async () => {
    const options = [
      [
        { alt: "Red", value: "red" },
        { alt: "Blue", value: "blue" },
      ],
    ];
    const el = await fixture(
      html`<simple-picker .options=${options} .value=${"blue"}></simple-picker>`,
    );
    await el.updateComplete;
    expect(el.__selectedOption).to.exist;
    expect(el.__selectedOption.value).to.equal("blue");
  });

  it("_getOption retrieves the option at a given id", async () => {
    const options = [
      [
        { alt: "Red", value: "red" },
        { alt: "Blue", value: "blue" },
      ],
    ];
    const el = await fixture(
      html`<simple-picker .options=${options}></simple-picker>`,
    );
    await el.updateComplete;
    const opt = el._getOption(el.__options, "option-0-1");
    expect(opt).to.exist;
    expect(opt.value).to.equal("blue");
  });

  it("dispatches value-changed when value updates", async () => {
    const options = [
      [
        { alt: "Red", value: "red" },
        { alt: "Blue", value: "blue" },
      ],
    ];
    const el = await fixture(
      html`<simple-picker .options=${options}></simple-picker>`,
    );
    await el.updateComplete;

    const listener = oneEvent(el, "value-changed");
    el.value = "blue";
    const { detail } = await listener;
    expect(detail).to.exist;
    expect(detail.value).to.equal("blue");
  });
});

// Listbox toggle behavior
describe("simple-picker listbox toggle", () => {
  it("toggles expanded state via _toggleListbox", async () => {
    const options = [[{ alt: "Red", value: "red" }]];
    const el = await fixture(
      html`<simple-picker .options=${options}></simple-picker>`,
    );
    await el.updateComplete;

    el._toggleListbox(true);
    expect(el.expanded).to.be.true;

    el._toggleListbox(false);
    expect(el.expanded).to.be.false;
  });

  it("ignores toggles when disabled", async () => {
    const el = await fixture(
      html`<simple-picker disabled></simple-picker>`,
    );
    el._toggleListbox(true);
    expect(el.expanded).to.not.be.true;
  });
});

// SimplePickerBehaviors mixin
describe("SimplePickerBehaviors mixin", () => {
  it("can extend a registered custom element", () => {
    class TestPicker extends SimplePickerBehaviors(HTMLElement) {}
    customElements.define("test-simple-picker-behaviors", TestPicker);
    const el = new TestPicker();
    expect(el).to.exist;
    expect(typeof el._toggleListbox).to.equal("function");
    expect(typeof el._setSelectedOption).to.equal("function");
  });
});

// simple-picker-option
describe("simple-picker-option", () => {
  it("instantiates with the correct tag", async () => {
    const el = await fixture(
      html`<simple-picker-option></simple-picker-option>`,
    );
    expect(el.tagName).to.equal("SIMPLE-PICKER-OPTION");
    expect(el.constructor.tag).to.equal("simple-picker-option");
  });

  it("passes the a11y audit (shadow DOM)", async () => {
    const el = await fixture(
      html`<simple-picker-option label="Red"></simple-picker-option>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });

  it("fires option-focus on focus", async () => {
    const el = await fixture(
      html`<simple-picker-option label="Red"></simple-picker-option>`,
    );
    // the listener is attached asynchronously in the constructor
    await new Promise((r) => setTimeout(r, 0));
    const listener = oneEvent(el, "option-focus");
    el.dispatchEvent(new FocusEvent("focus"));
    const { detail } = await listener;
    expect(detail).to.equal(el);
  });
});

// simple-emoji-picker (kept from the original suite)
describe("simple-emoji-picker", () => {
  it("passes the a11y audit (shadow DOM)", async () => {
    const el = await fixture(
      html`<simple-emoji-picker></simple-emoji-picker>`,
    );
    await expect(el).shadowDom.to.be.accessible();
  });
});
