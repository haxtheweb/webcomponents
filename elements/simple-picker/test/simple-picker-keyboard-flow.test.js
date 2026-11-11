/**
 * Keyboard flow: Tab and Shift+Tab leave a simple-picker whether its list is
 * open or not (the open list used to swallow Tab, trapping focus on an
 * option), and the arrow keys move between options while the list is open.
 * Every picker built on SimplePickerBehaviors (simple-icon-picker,
 * simple-emoji-picker, simple-symbol-picker, simple-colors-picker, the rich
 * text editor pickers) gets this from the base. Real key presses only.
 * Follow-up to https://github.com/haxtheweb/issues/issues/3307
 */
import { fixture, expect, html } from "@open-wc/testing";
import "../simple-picker.js";
import "../lib/simple-emoji-picker.js";
import {
  press,
  waitFor,
  deepActiveElement,
  describeEl,
  expectFocusOn,
} from "../../../scripts/test-setup/keyboard-flow.js";

const options = [
  [{ alt: "Red", value: "red" }],
  [{ alt: "Green", value: "green" }],
  [{ alt: "Blue", value: "blue" }],
];

// Space opens the list; wait until its options are laid out (the list
// renders them through lit-virtualizer) before arrowing into them
async function openList(el) {
  await press("Space");
  await waitFor(() => {
    const option = el.shadowRoot.querySelector("#option-1-0, #option-0-1");
    return option && option.getBoundingClientRect().height > 0;
  });
}

async function setup(picker) {
  const wrap = await fixture(html`
    <div>
      <button id="before">before</button>
      ${picker}
      <button id="after">after</button>
    </div>
  `);
  const el = wrap.children[1];
  await el.updateComplete;
  return {
    el,
    listbox: el.shadowRoot.querySelector("#listbox"),
    before: wrap.querySelector("#before"),
    after: wrap.querySelector("#after"),
  };
}

describe("simple-picker keyboard flow", () => {
  it("Tab and Shift+Tab pass through a closed picker", async () => {
    const { listbox, before, after } = await setup(
      html`<simple-picker label="Color" .options="${options}"></simple-picker>`,
    );
    before.focus();
    await press("Tab");
    expectFocusOn(expect, listbox, "Tab into the picker");
    await press("Tab");
    expectFocusOn(expect, after, "Tab out of the picker");
    await press("Shift+Tab");
    expectFocusOn(expect, listbox, "Shift+Tab into the picker");
    await press("Shift+Tab");
    expectFocusOn(expect, before, "Shift+Tab out of the picker");
  });

  // a picker with no value and no null option used to have no active option,
  // so every key in it threw before reaching the Tab or arrow handling
  it("arrow keys move between options in the open list", async () => {
    const { el, before } = await setup(
      html`<simple-picker label="Color" .options="${options}"></simple-picker>`,
    );
    before.focus();
    await press("Tab");
    await openList(el);
    expect(el.expanded, "Space opens the list").to.equal(true);
    await press("ArrowDown");
    let active = deepActiveElement();
    expect(active.id, describeEl(active)).to.equal("option-1-0");
    await press("ArrowDown");
    active = deepActiveElement();
    expect(active.id, describeEl(active)).to.equal("option-2-0");
    await press("ArrowUp");
    active = deepActiveElement();
    expect(active.id, describeEl(active)).to.equal("option-1-0");
  });

  it("Tab leaves an open list and closes it", async () => {
    const { el, before, after } = await setup(
      html`<simple-picker
        label="Color"
        .options="${options}"
        value="red"
      ></simple-picker>`,
    );
    before.focus();
    await press("Tab");
    await openList(el);
    await press("ArrowDown");
    expect(el.expanded).to.equal(true);
    await press("Tab");
    expectFocusOn(expect, after, "Tab from an option");
    expect(el.expanded, "list closed").to.equal(false);
  });

  it("Shift+Tab leaves an open list and closes it", async () => {
    const { el, before } = await setup(
      html`<simple-picker
        label="Color"
        .options="${options}"
        value="red"
      ></simple-picker>`,
    );
    before.focus();
    await press("Tab");
    await openList(el);
    await press("ArrowDown");
    expect(el.expanded).to.equal(true);
    await press("Shift+Tab");
    expectFocusOn(expect, before, "Shift+Tab from an option");
    expect(el.expanded, "list closed").to.equal(false);
  });

  it("Shift+Tab leaves an open simple-emoji-picker", async () => {
    const { el, before } = await setup(
      html`<simple-emoji-picker label="Emoji"></simple-emoji-picker>`,
    );
    before.focus();
    await press("Tab");
    await openList(el);
    await press("ArrowDown");
    expect(el.expanded).to.equal(true);
    await press("Shift+Tab");
    expectFocusOn(expect, before, "Shift+Tab from an emoji option");
    expect(el.expanded, "list closed").to.equal(false);
  });
});
