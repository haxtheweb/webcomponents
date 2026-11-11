import { fixture, expect, html } from "@open-wc/testing";
import "../outline-designer.js";

// the selector column: the hidden selection (Space, Shift+arrows,
// Ctrl/Shift+click) is now a visible checkbox per page on the same
// selectedPages, with a select-all for the shown pages; selecting never
// touches the outline data.
function makeItems() {
  const page = (id, title, parent, indent, order, locked = false) => ({
    id,
    title,
    slug: id,
    location: `pages/${id}/index.html`,
    order,
    parent,
    indent,
    contents: `<p>${title}</p>`,
    metadata: { locked },
  });
  return [
    page("p1", "Page One", null, 0, 0),
    page("c1", "Child One", "p1", 1, 0),
    page("c2", "Child Two", "p1", 1, 1),
    page("p2", "Page Two", null, 0, 1),
    page("p3", "Locked Page", null, 0, 2, true),
  ];
}

const settle = async (element) => {
  await element.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 60));
  await element.updateComplete;
};
const row = (el, id) => el.shadowRoot.querySelector(`li[data-item-id="${id}"]`);
const box = (el, id) => row(el, id).querySelector(".select input");
const clickBox = (el, id, opts = {}) =>
  box(el, id).dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      composed: true,
      cancelable: true,
      ...opts,
    }),
  );
const selectAll = (el) => el.shadowRoot.querySelector(".select-all input");

describe("outline-designer selector column", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(
      html`<outline-designer reduced-motion="reduce"></outline-designer>`,
    );
    el.items = makeItems();
    await settle(el);
  });

  it("draws a checkbox on every page row, unchecked to start", () => {
    const boxes = el.shadowRoot.querySelectorAll(
      "li[data-item-id] .select input",
    );
    expect(boxes.length).to.equal(5);
    boxes.forEach((b) => expect(b.checked).to.equal(false));
    expect(box(el, "c1").getAttribute("title")).to.equal("Select Child One");
  });

  it("a click toggles the page in selectedPages and on the row", async () => {
    const before = JSON.stringify(el.items);
    clickBox(el, "c1");
    await settle(el);
    expect(el.selectedPages).to.deep.equal(["c1"]);
    expect(box(el, "c1").checked).to.equal(true);
    expect(row(el, "c1").getAttribute("aria-selected")).to.equal("true");
    expect(row(el, "c1").classList.contains("selected-page")).to.equal(true);
    clickBox(el, "c1");
    await settle(el);
    expect(el.selectedPages).to.deep.equal([]);
    expect(box(el, "c1").checked).to.equal(false);
    // selecting is not an edit
    expect(JSON.stringify(el.items)).to.equal(before);
  });

  it("Shift+click selects the shown pages from the last one clicked", async () => {
    clickBox(el, "c1");
    await settle(el);
    clickBox(el, "p2", { shiftKey: true });
    await settle(el);
    expect(el.selectedPages).to.deep.equal(["c1", "c2", "p2"]);
    ["c1", "c2", "p2"].forEach((id) =>
      expect(box(el, id).checked).to.equal(true),
    );
    expect(box(el, "p1").checked).to.equal(false);
  });

  it("Space on a row still toggles, now visibly", async () => {
    row(el, "p2").focus();
    row(el, "p2").dispatchEvent(
      new KeyboardEvent("keydown", {
        key: " ",
        bubbles: true,
        cancelable: true,
      }),
    );
    await settle(el);
    expect(el.selectedPages).to.deep.equal(["p2"]);
    expect(box(el, "p2").checked).to.equal(true);
  });

  it("select all checks the shown pages, folded ones stay out", async () => {
    el.collapseAll();
    await settle(el);
    const all = selectAll(el);
    expect(all.getAttribute("aria-label")).to.equal("Select all shown pages");
    all.click();
    await settle(el);
    expect(el.selectedPages).to.deep.equal(["p1", "p2", "p3"]);
    expect(selectAll(el).checked).to.equal(true);
    expect(selectAll(el).indeterminate).to.equal(false);
    selectAll(el).click();
    await settle(el);
    expect(el.selectedPages).to.deep.equal([]);
    clickBox(el, "p2");
    await settle(el);
    expect(selectAll(el).checked).to.equal(false);
    expect(selectAll(el).indeterminate).to.equal(true);
  });

  it("the checkbox does not start a drag or open the page", async () => {
    const b = box(el, "p2");
    const r = b.getBoundingClientRect();
    b.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        composed: true,
        pointerType: "mouse",
        button: 0,
        clientX: r.x + 2,
        clientY: r.y + 2,
      }),
    );
    expect(el._press).to.not.be.ok;
  });

  it("keeps Delete selected in its toolbar unless the host draws it", async () => {
    clickBox(el, "p2");
    await settle(el);
    const label = () =>
      [...el.shadowRoot.querySelectorAll(".more simple-toolbar-button")].map(
        (b) => b.label,
      );
    expect(label()).to.include("Delete Selected (1)");
    el.hostActions = true;
    await settle(el);
    expect(label()).to.not.include("Delete Selected (1)");
  });

  it("indent columns keep their place beside the selector column", async () => {
    const p1 = row(el, "p1").getBoundingClientRect();
    const toggle = row(el, "p1")
      .querySelector(".toggle")
      .getBoundingClientRect();
    const sel = row(el, "p1").querySelector(".select").getBoundingClientRect();
    // the checkbox sits in the row's left padding, before the toggle
    expect(sel.right).to.be.at.most(toggle.left + 0.5);
    expect(sel.left).to.be.at.least(p1.left);
    const pad = parseFloat(getComputedStyle(row(el, "p1")).paddingLeft);
    expect(Math.round(toggle.left - p1.left)).to.equal(Math.round(pad));
  });
});

// the page menu takes simple-context-menu's own design: no local item
// padding or delete rule, Delete is its danger item after a separator
describe("outline-designer page menu design", () => {
  it("marks Delete as the danger item after a separator", async () => {
    const el = await fixture(
      html`<outline-designer reduced-motion="reduce"></outline-designer>`,
    );
    el.items = makeItems();
    await settle(el);
    const menu = await el._menuReady(row(el, "p2"));
    const del = menu.querySelector('simple-toolbar-button[value="delete"]');
    expect(del.classList.contains("danger")).to.equal(true);
    expect(del.previousElementSibling.tagName).to.equal("HR");
    // the outline adds no item padding of its own
    const lock = menu.querySelector('simple-toolbar-button[value="lock"]');
    expect(getComputedStyle(lock).paddingRight).to.not.equal("16px");
    const sheet = el.constructor.styles.map((s) => s.cssText || "").join("\n");
    expect(sheet).to.not.contain("actions-menu simple-toolbar-button");
    expect(sheet).to.not.contain("::part(button)");
  });
});
