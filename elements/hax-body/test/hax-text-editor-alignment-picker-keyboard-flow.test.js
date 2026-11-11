/**
 * Keyboard flow: the text toolbar's alignment picker (and every picker built
 * on RichTextEditorPickerBehaviors / simple-picker). Tab and Shift+Tab leave
 * the picker the same as any other toolbar button, whether its list is open
 * or not; the arrow keys move between toolbar items while the list is closed
 * and between options while it is open; the picker shows a visible sky blue
 * focus ring. Real key presses only; see scripts/test-setup/keyboard-flow.js.
 * Follow-up to https://github.com/haxtheweb/issues/issues/3307
 */
import { fixture, expect, html } from "@open-wc/testing";
import "../lib/hax-text-editor-toolbar.js";
import {
  press,
  settle,
  waitFor,
  deepActiveElement,
  describeEl,
  expectFocusOn,
  expectGoodFocusStop,
} from "../../../scripts/test-setup/keyboard-flow.js";

// --ddd-theme-default-skyBlue
const SKY_BLUE = "rgb(0, 156, 222)";

const listboxOf = (picker) =>
  picker.shadowRoot
    .querySelector("simple-picker")
    .shadowRoot.querySelector("#listbox");

// Space opens the list; wait until its options are laid out (simple-picker
// renders them through lit-virtualizer) before arrowing into them
async function openList(picker) {
  await press("Space");
  const root = picker.picker.shadowRoot;
  await waitFor(() => {
    const option = root.querySelector("#option-1-0");
    return option && option.getBoundingClientRect().height > 0;
  });
}

describe("hax-text-editor-alignment-picker keyboard flow", () => {
  let wrap, toolbar, picker, listbox, before, after;

  beforeEach(async () => {
    wrap = await fixture(html`
      <div>
        <button id="before">before</button>
        <hax-text-editor-toolbar
          always-expanded
          show="always"
        ></hax-text-editor-toolbar>
        <button id="after">after</button>
      </div>
    `);
    toolbar = wrap.querySelector("hax-text-editor-toolbar");
    await toolbar.updateComplete;
    await settle(200);
    // the buttons are enabled by a text selection in the editor; enable
    // them directly so the toolbar's arrow keys have somewhere to go
    toolbar.__buttons.forEach((button) => (button.disabled = false));
    picker = toolbar.querySelector("hax-text-editor-alignment-picker");
    expect(picker, "toolbar renders the alignment picker").to.exist;
    toolbar.setCurrentItem(picker);
    await picker.updateComplete;
    await settle(50);
    listbox = listboxOf(picker);
    before = wrap.querySelector("#before");
    after = wrap.querySelector("#after");
  });

  it("is one Tab stop with a visible sky blue focus ring", async () => {
    before.focus();
    await press("Tab");
    expectFocusOn(expect, listbox, "Tab from the button before the toolbar");
    expectGoodFocusStop(expect, "alignment picker");
    const cs = globalThis.getComputedStyle(listbox);
    expect(cs.outlineStyle, "outline style").to.equal("solid");
    expect(parseFloat(cs.outlineWidth), "outline width").to.be.at.least(2);
    expect(cs.outlineColor, "outline color").to.equal(SKY_BLUE);
    // the other pickers in the toolbar are not Tab stops (roving tabindex)
    const heading = toolbar.querySelector("hax-text-editor-heading-picker");
    expect(listboxOf(heading).tabIndex, "heading picker listbox").to.equal(-1);
    await press("Tab");
    expectFocusOn(expect, after, "Tab leaves the picker");
  });

  it("Shift+Tab leaves the picker", async () => {
    after.focus();
    await press("Shift+Tab");
    expectFocusOn(expect, listbox, "Shift+Tab from the button after");
    await press("Shift+Tab");
    expectFocusOn(expect, before, "Shift+Tab leaves the picker");
  });

  it("arrow keys move between toolbar items while the list is closed", async () => {
    before.focus();
    await press("Tab");
    expectFocusOn(expect, listbox, "picker");
    await press("ArrowLeft");
    const left = deepActiveElement();
    expect(
      left !== listbox && toolbar.currentItem !== picker,
      `ArrowLeft moved to the previous item, now on ${describeEl(left)}`,
    ).to.equal(true);
    await press("ArrowRight");
    expectFocusOn(expect, listbox, "ArrowRight back to the picker");
    expect(picker.picker.expanded).to.equal(false);
  });

  it("arrow keys move between options while the list is open", async () => {
    before.focus();
    await press("Tab");
    await openList(picker);
    expect(picker.picker.expanded, "Space opens the list").to.equal(true);
    await press("ArrowDown");
    let active = deepActiveElement();
    expect(active.getAttribute("role"), describeEl(active)).to.equal("option");
    expect(active.id).to.equal("option-1-0");
    expect(toolbar.currentItem, "the toolbar did not move").to.equal(picker);
    await press("ArrowUp");
    active = deepActiveElement();
    expect(active.id, describeEl(active)).to.equal("option-0-0");
    expect(picker.picker.expanded).to.equal(true);
  });

  it("Tab and Shift+Tab leave the picker with the list open, closing it", async () => {
    before.focus();
    await press("Tab");
    await openList(picker);
    await press("ArrowDown");
    expect(picker.picker.expanded).to.equal(true);
    await press("Tab");
    expectFocusOn(expect, after, "Tab from an open list");
    expect(picker.picker.expanded, "list closed").to.equal(false);
    expect(picker.value, "Tab does not pick the focused option").to.equal("");

    await press("Shift+Tab");
    expectFocusOn(expect, listbox, "back on the picker");
    await openList(picker);
    await press("ArrowDown");
    expect(picker.picker.expanded).to.equal(true);
    await press("Shift+Tab");
    expectFocusOn(expect, before, "Shift+Tab from an open list");
    expect(picker.picker.expanded, "list closed").to.equal(false);
  });
});
