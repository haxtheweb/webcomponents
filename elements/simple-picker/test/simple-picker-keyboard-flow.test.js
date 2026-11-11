/**
 * Keyboard flow: Tab and Shift+Tab leave a simple-picker whether its list is
 * open or not (the open list used to swallow Tab, trapping focus on an
 * option), and the arrow keys move between options while the list is open.
 * Escape closes an open list without choosing the highlighted option, puts
 * focus back on the picker and is used up there (a dialog around the picker
 * stays open); with the list closed it bubbles as before.
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

  it("Escape closes an open list, keeps the value and refocuses the picker", async () => {
    const { el, listbox, before } = await setup(
      html`<simple-picker
        label="Color"
        .options="${options}"
        value="red"
      ></simple-picker>`,
    );
    let changes = 0;
    el.addEventListener("value-changed", () => changes++);
    before.focus();
    await press("Tab");
    await openList(el);
    await press("ArrowDown");
    let active = deepActiveElement();
    expect(active.id, describeEl(active)).to.equal("option-1-0");
    await press("Escape");
    expect(el.expanded, "list closed").to.equal(false);
    expect(el.value, "highlighted option not chosen").to.equal("red");
    expect(changes, "no value-changed").to.equal(0);
    expectFocusOn(expect, listbox, "Escape from an option");
    // the list reopens on the selected option, not the one left highlighted:
    // the next option down from Red is Green again
    await openList(el);
    expect(
      el.shadowRoot
        .querySelector("#listbox")
        .getAttribute("aria-activedescendant"),
    ).to.equal("option-0-0");
    await press("ArrowDown");
    active = deepActiveElement();
    expect(active.id, describeEl(active)).to.equal("option-1-0");
  });

  it("Escape is used up only while the list is open", async () => {
    const { el, listbox, before } = await setup(
      html`<simple-picker
        label="Color"
        .options="${options}"
        value="green"
      ></simple-picker>`,
    );
    // stands in for a dialog or tray that closes on Escape
    const escapes = [];
    const wrap = el.parentNode;
    wrap.addEventListener("keydown", (e) => {
      if (e.key === "Escape") escapes.push(e);
    });
    before.focus();
    await press("Tab");
    await openList(el);
    await press("ArrowUp");
    await press("Escape");
    expect(el.expanded, "list closed").to.equal(false);
    expect(el.value).to.equal("green");
    expect(escapes.length, "open list keeps Escape").to.equal(0);
    expectFocusOn(expect, listbox, "Escape from an option");
    await press("Escape");
    expect(escapes.length, "closed picker lets Escape bubble").to.equal(1);
    expect(escapes[0].defaultPrevented, "not prevented when closed").to.equal(
      false,
    );
  });

  it("Escape closes an open simple-emoji-picker without choosing", async () => {
    const { el, before } = await setup(
      html`<simple-emoji-picker label="Emoji"></simple-emoji-picker>`,
    );
    before.focus();
    await press("Tab");
    const value = el.value;
    await openList(el);
    await press("ArrowDown");
    await press("ArrowDown");
    await press("Escape");
    expect(el.expanded, "list closed").to.equal(false);
    expect(el.value, "value unchanged").to.equal(value);
    const active = deepActiveElement();
    expect(active.id, describeEl(active)).to.equal("listbox");
    expect(active.getRootNode().host, "focus stays in the picker").to.equal(el);
  });
});
