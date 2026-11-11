/**
 * Keyboard flow: outline-designer page operations with real key presses
 * (move up/down, indent/outdent, delete and restore, the row actions menu),
 * without a mouse. Assertions read the resulting outline state only; nothing
 * here saves. See scripts/test-setup/keyboard-flow.js for the per-stop
 * invariants.
 */
import { fixture, expect, html } from "@open-wc/testing";
import "../outline-designer.js";
import {
  press,
  settle,
  waitFor,
  deepActiveElement,
  composedContains,
  expectGoodFocusStop,
  positiveTabindexIn,
  describeEl,
} from "../../../scripts/test-setup/keyboard-flow.js";

function makeItems() {
  const page = (id, title, order, parent = null, indent = 0) => ({
    id,
    title,
    slug: id,
    location: `pages/${id}/index.html`,
    order,
    parent,
    indent,
    contents: "<p>x</p>",
    metadata: { locked: false },
  });
  return [
    page("a", "Alpha", 0),
    page("a1", "Alpha child", 0, "a", 1),
    page("b", "Bravo", 1),
    page("c", "Charlie", 2),
  ];
}

// the outline as "id>parent" in display order
const shape = (el) =>
  el.items
    .filter((i) => !i.delete)
    .map((i) => `${i.id}>${i.parent || ""}`)
    .join(" ");

describe("keyboard flow: outline-designer page operations", () => {
  let wrapper;
  let el;

  const focusedRowId = () => {
    const active = deepActiveElement();
    return active && active.getAttribute
      ? active.getAttribute("data-item-id")
      : null;
  };

  const settleOutline = async () => {
    await el.updateComplete;
    await settle(120);
    await el.updateComplete;
  };

  async function goToRow(id) {
    let guard = 0;
    while (focusedRowId() !== id && guard++ < 10) {
      await press("ArrowDown");
    }
    expect(focusedRowId()).to.equal(id);
  }

  beforeEach(async () => {
    wrapper = await fixture(
      html`<div>
        <button id="before">before</button>
        <outline-designer reduced-motion="reduce"></outline-designer>
      </div>`,
    );
    el = wrapper.querySelector("outline-designer");
    el.items = makeItems();
    await settleOutline();
    wrapper.querySelector("#before").focus();
    // Tab from the preceding control until a tree row has focus
    let guard = 0;
    while (!focusedRowId() && guard++ < 15) {
      await press("Tab");
      expectGoodFocusStop(expect, `tab into outline ${guard}`);
    }
    expect(focusedRowId(), "a tree row is reachable by Tab").to.equal("a");
  });

  it("arrow keys walk the rows, every row shows a focus ring, no positive tabindex", async () => {
    const seen = [focusedRowId()];
    for (let i = 0; i < 3; i++) {
      await press("ArrowDown");
      expectGoodFocusStop(expect, `ArrowDown ${i + 1}`);
      seen.push(focusedRowId());
    }
    expect(seen).to.deep.equal(["a", "a1", "b", "c"]);
    await press("Home");
    expect(focusedRowId()).to.equal("a");
    await press("End");
    expect(focusedRowId()).to.equal("c");
    // a roving tabindex: exactly one row in the tab order
    const tabbable = el.shadowRoot.querySelectorAll(
      'li[data-item-id][tabindex="0"]',
    );
    expect(tabbable.length).to.equal(1);
    expect(positiveTabindexIn(el)).to.deep.equal([]);
  });

  it("Alt+ArrowUp / Alt+ArrowDown move a page and keep focus on it", async () => {
    await goToRow("c");
    await press("Alt+ArrowUp");
    await settleOutline();
    expect(shape(el)).to.equal("a> a1>a c> b>");
    expect(focusedRowId(), "focus follows the moved page").to.equal("c");
    expectGoodFocusStop(expect, "after move up");
    await press("Alt+ArrowDown");
    await settleOutline();
    expect(shape(el)).to.equal("a> a1>a b> c>");
    expect(focusedRowId()).to.equal("c");
  });

  it("Alt+ArrowRight indents under the previous page, Alt+ArrowLeft outdents", async () => {
    await goToRow("b");
    await press("Alt+ArrowRight");
    await settleOutline();
    const b = el.items.find((i) => i.id === "b");
    expect(b.parent, "indented under Alpha").to.equal("a");
    expect(focusedRowId()).to.equal("b");
    expectGoodFocusStop(expect, "after indent");
    await press("Alt+ArrowLeft");
    await settleOutline();
    expect(el.items.find((i) => i.id === "b").parent).to.equal(null);
    expect(focusedRowId()).to.equal("b");
  });

  it("Delete marks a page (and its sub-pages) for deletion; Delete again restores", async () => {
    // focus is on Alpha, which has a child
    await press("Delete");
    await settleOutline();
    const marked = el.items.filter((i) => i.delete).map((i) => i.id);
    expect(marked).to.include("a");
    expect(marked).to.include("a1");
    // the change is staged, not applied: the row is still in the outline
    expect(el.items.find((i) => i.id === "a")).to.exist;
    // focus is still on a visible row
    expectGoodFocusStop(expect, "after delete");
    await waitFor(() => focusedRowId() === "a", 1000);
    expect(focusedRowId(), "focus stays on the marked page").to.equal("a");
    await press("Delete");
    await settleOutline();
    expect(el.items.filter((i) => i.delete).length).to.equal(0);
  });

  it("Shift+F10 opens the row actions menu, arrows + Enter run an action, focus returns to the row", async () => {
    await goToRow("c");
    await press("Shift+F10", 100);
    const row = el.shadowRoot.querySelector('li[data-item-id="c"]');
    const menu = row.querySelector(".actions-menu");
    await waitFor(() => menu.open);
    expect(menu.open, "menu opened from the keyboard").to.equal(true);
    const inMenu = deepActiveElement();
    expect(
      composedContains(menu, inMenu),
      `focus moved into the menu, was ${describeEl(inMenu)}`,
    ).to.equal(true);
    expectGoodFocusStop(expect, "menu item");
    // first item is "Move up"
    await press("Home");
    expectGoodFocusStop(expect, "menu Home");
    await press("Enter", 100);
    await settleOutline();
    expect(shape(el)).to.equal("a> a1>a c> b>");
    await waitFor(() => focusedRowId() === "c", 1000);
    expect(focusedRowId(), "focus back on the moved row").to.equal("c");
  });

  it("Escape closes the row actions menu and focus returns to the row", async () => {
    await goToRow("b");
    await press("Shift+F10", 100);
    const menu = el.shadowRoot.querySelector(
      'li[data-item-id="b"] .actions-menu',
    );
    await waitFor(() => menu.open);
    await press("Escape", 100);
    expect(menu.open).to.equal(false);
    await waitFor(() => focusedRowId() === "b", 1000);
    expect(focusedRowId()).to.equal("b");
    expectGoodFocusStop(expect, "after menu Escape");
  });
});
