import { fixture, expect, html } from "@open-wc/testing";
import "../lib/simple-colors-picker.js";

describe("simple-colors-picker", () => {
  it("keeps accent names as values, with None as null first", async () => {
    const el = await fixture(
      html`<simple-colors-picker value="deep-purple"></simple-colors-picker>`,
    );
    const values = el.options.map((row) => row[0].value);
    expect(values[0]).to.equal(null);
    expect(values).to.include("deep-purple");
    expect(values).to.include("red");
    expect(el.value).to.equal("deep-purple");
  });

  it("labels options as words and gives each a swatch of its color", async () => {
    const el = await fixture(
      html`<simple-colors-picker></simple-colors-picker>`,
    );
    const deep = el.options.find((row) => row[0].value === "deep-purple")[0];
    expect(deep.alt).to.equal("Deep purple");
    expect(deep.style).to.contain(
      "--simple-colors-picker-swatch: var(--simple-colors-default-theme-deep-purple-7)",
    );
    expect(el.options[0][0].alt).to.equal("None");
  });

  it("draws the swatch before the chosen name in the closed control", async () => {
    const el = await fixture(
      html`<simple-colors-picker value="red"></simple-colors-picker>`,
    );
    await el.updateComplete;
    const sample = el.shadowRoot.querySelector("#sample simple-picker-option");
    expect(sample.label).to.equal("Red");
    const before = globalThis.getComputedStyle(sample, "::before");
    expect(before.width).to.equal("18px");
    expect(before.backgroundColor).to.not.equal("rgba(0, 0, 0, 0)");
  });

  it("is a 40px HAX UI field", async () => {
    const el = await fixture(
      html`<simple-colors-picker></simple-colors-picker>`,
    );
    await el.updateComplete;
    const box = el.shadowRoot.querySelector("#sample").getBoundingClientRect();
    expect(Math.round(box.height)).to.equal(40);
  });

  it("leaves shades mode as a grid of color circles without names", async () => {
    const el = await fixture(
      html`<simple-colors-picker shades></simple-colors-picker>`,
    );
    await el.updateComplete;
    expect(el.hideOptionLabels).to.equal(true);
    expect(el.options[0][0].value).to.contain("--simple-colors-");
  });

  // page-break's Accent color showed a literal "false" in HAX settings:
  // a value that matches no color, set after first render, left no option
  // selected. It should fall back to None.
  [
    ["undefined", undefined],
    ["false", false],
    ['"false"', "false"],
    ["an unknown name", "not-a-color"],
  ].forEach(([name, val]) => {
    it(`falls back to None when the value changes to ${name}`, async () => {
      const el = await fixture(
        html`<simple-colors-picker value="red"></simple-colors-picker>`,
      );
      el.value = val;
      await el.updateComplete;
      await el.updateComplete;
      const label = el.shadowRoot
        .querySelector("#sample simple-picker-option")
        .shadowRoot.querySelector("#label")
        .textContent.trim();
      expect(el.value).to.equal(null);
      expect(label).to.equal("None");
    });
  });

  it("falls back to None when dark mode and a bad value land together", async () => {
    const el = await fixture(
      html`<simple-colors-picker></simple-colors-picker>`,
    );
    el.dark = true;
    el.value = false;
    await el.updateComplete;
    await el.updateComplete;
    expect(el.value).to.equal(null);
    expect(el.__selectedOption.alt).to.equal("None");
  });

  // In the HAX editor the option list was rebuilt during the picker's
  // update, after simple-picker had read that update's changes, so the
  // dropdown kept a stale (or empty) list. A rebuild must reach the dropdown.
  it("rebuilds the dropdown list when the options are rebuilt", async () => {
    const el = await fixture(
      html`<simple-colors-picker></simple-colors-picker>`,
    );
    el.shades = true;
    await el.updateComplete;
    await el.updateComplete;
    expect(el.__options.length).to.equal(el.options.length);
    expect(el.__options[0][0].value).to.contain("--simple-colors-");
  });
});
