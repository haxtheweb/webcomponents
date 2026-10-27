import { fixture, expect, html } from "@open-wc/testing";
import "../outline-designer.js";

// behavioral coverage for outline-designer page operations: item ops
// (up/down/in/out/lock/delete/add/duplicate/goto), density, selection,
// keyboard tree navigation, Alt+arrow moves from the row and the aria
// live region. The JSON Outline Schema sync reorders items after every
// mutation (setTimeout 0 + requestUpdate), so each step settles first.
function makeItems() {
  return [
    {
      id: "p1",
      title: "Page One",
      slug: "page-one",
      location: "pages/page-one/index.html",
      order: 0,
      parent: null,
      indent: 0,
      contents: "<h2>Heading one</h2><p>Para one</p>",
      metadata: { locked: false, published: true },
    },
    {
      id: "c1",
      title: "Child One",
      slug: "child-one",
      location: "pages/child-one/index.html",
      order: 0,
      parent: "p1",
      indent: 1,
      contents: "<h2>Child heading</h2><p>Child para</p>",
      metadata: { locked: false },
    },
    {
      id: "c2",
      title: "Child Two",
      slug: "child-two",
      location: "pages/child-two/index.html",
      order: 1,
      parent: "p1",
      indent: 1,
      contents: "",
      metadata: { locked: false },
    },
    {
      id: "p2",
      title: "Page Two",
      slug: "page-two",
      location: "pages/page-two/index.html",
      order: 1,
      parent: null,
      indent: 0,
      contents: "<p>Two</p>",
      metadata: { locked: false },
    },
    {
      id: "p3",
      title: "Locked Page",
      slug: "locked",
      location: "pages/locked/index.html",
      order: 2,
      parent: null,
      indent: 0,
      contents: "<p>Locked</p>",
      metadata: { locked: true },
    },
  ];
}

const settle = async (element) => {
  await element.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 60));
  await element.updateComplete;
};

const pageLi = (element, id) =>
  element.shadowRoot.querySelector(`li[data-item-id="${id}"]`);

const keydown = (target, key, opts = {}) =>
  target.dispatchEvent(
    new KeyboardEvent("keydown", {
      key,
      bubbles: true,
      cancelable: true,
      ...opts,
    }),
  );

// shadowRoot.getSelection() only exists in Chromium; Firefox and WebKit use the
// document selection
const selectionFor = (root) =>
  root.getSelection ? root.getSelection() : globalThis.getSelection();

describe("outline-designer item operations", () => {
  let element;

  beforeEach(async () => {
    // data and focus tests run without motion so each step lands at once
    element = await fixture(
      html`<outline-designer reduced-motion="reduce"></outline-designer>`,
    );
    element.items = makeItems();
    await settle(element);
  });

  it("renders the page tree with tree semantics and parent data", () => {
    const lis = element.shadowRoot.querySelectorAll("li[data-item-id]");
    expect(lis.length).to.equal(5);
    expect(
      element.shadowRoot.querySelector("ul#list").getAttribute("role"),
    ).to.equal("tree");
    expect(pageLi(element, "p1").getAttribute("aria-level")).to.equal("1");
    expect(pageLi(element, "c1").getAttribute("aria-level")).to.equal("2");
    expect(pageLi(element, "c1").getAttribute("data-parents")).to.equal("p1 ");
    expect(pageLi(element, "p1").getAttribute("data-parents")).to.equal("");
    // first visible item is in the tab order
    expect(pageLi(element, "p1").getAttribute("tabindex")).to.equal("0");
    expect(pageLi(element, "p2").getAttribute("tabindex")).to.equal("-1");
    // children flag drives aria-expanded on parents
    expect(pageLi(element, "p1").getAttribute("aria-expanded")).to.equal(
      "true",
    );
    expect(pageLi(element, "p1").hasAttribute("data-has-children")).to.equal(
      true,
    );
    // childless items omit the attribute instead of rendering a literal
    expect(pageLi(element, "p2").hasAttribute("aria-expanded")).to.equal(false);
  });

  it("reports children, collapse and lock state", () => {
    expect(element.hasChildren("p1")).to.equal(true);
    expect(element.hasChildren("p2")).to.equal(false);
    expect(element.isCollapsed("p1")).to.equal(false);
    expect(element.isLocked(0)).to.equal(false);
    expect(element.isLocked(4)).to.equal(true);
    expect(element.isLocked(false)).to.equal(false);
    expect(
      element.getItemParents(element.items.find((i) => i.id === "c1")),
    ).to.equal("p1 ");
    expect(
      element.hasContents(element.items.find((i) => i.id === "c2")),
    ).to.equal(false);
  });

  it("collapses and expands a branch from the collapse button", async () => {
    pageLi(element, "p1").querySelector(".collapse-btn").click();
    await settle(element);
    // collapsed children are not rendered and the parent reports collapsed
    expect(pageLi(element, "c1") === null).to.equal(true);
    expect(pageLi(element, "p1").getAttribute("aria-expanded")).to.equal(
      "false",
    );
    expect(element.isCollapsed("p1")).to.equal(true);
    pageLi(element, "p1").querySelector(".collapse-btn").click();
    await settle(element);
    expect(pageLi(element, "c1") === null).to.equal(false);
  });

  it("collapses all and expands all from the control bar", async () => {
    element.collapseAll();
    await settle(element);
    // only top level items remain rendered
    expect(
      element.shadowRoot.querySelectorAll("li[data-item-id]").length,
    ).to.equal(3);
    expect(element.items.find((i) => i.id === "p1").collapsed).to.equal(true);
    element.expandAll();
    await settle(element);
    expect(
      element.shadowRoot.querySelectorAll("li[data-item-id]").length,
    ).to.equal(5);
    expect(element.items.find((i) => i.id === "p1").collapsed).to.equal(false);
  });

  it("reveals page contents from the content toggle", async () => {
    pageLi(element, "p1").querySelector(".content-toggle-btn").click();
    await settle(element);
    const contentChildren = element.shadowRoot.querySelectorAll(
      '[data-content-parent-id="p1"]',
    );
    // the two content nodes of the page, right under it: with no blocks
    // to offer there is no (empty) content-adding row before them
    expect(contentChildren.length).to.equal(2);
    expect(
      element.shadowRoot.querySelector('[data-item-for-content-id="p1"]'),
    ).to.equal(null);
    const pageRow = pageLi(element, "p1");
    expect(pageRow.classList.contains("content-open")).to.equal(true);
    expect(pageRow.nextElementSibling).to.equal(contentChildren[0]);
    // the last one ends the line that joins them to the page
    expect(contentChildren[1].classList.contains("last")).to.equal(true);
    expect(contentChildren[0].classList.contains("last")).to.equal(false);
    // rows have a fixed height, so their tree lines draw
    expect(
      contentChildren[0].querySelector(".cols").getBoundingClientRect().height >
        0,
    ).to.equal(true);
    // toggling again hides the content
    pageLi(element, "p1").querySelector(".content-toggle-btn").click();
    await settle(element);
    expect(
      element.shadowRoot.querySelector('[data-content-parent-id="p1"]') ===
        null,
    ).to.equal(true);
  });

  it("monitorTitle commits the typed title on Enter renames", async () => {
    const label = pageLi(element, "p1").querySelector(".label.shown");
    element.editTitle({ target: label });
    const labelEdit = pageLi(element, "p1").querySelector(".label-edit");
    expect(labelEdit.getAttribute("contenteditable")).to.equal("true");
    expect(labelEdit.classList.contains("shown")).to.equal(true);
    // type a new title through the browser editing pipeline (a real user
    // typing lands in the same uncommitted edit state)
    const range = globalThis.document.createRange();
    range.selectNodeContents(labelEdit);
    const selection = selectionFor(element.shadowRoot);
    selection.removeAllRanges();
    selection.addRange(range);
    globalThis.document.execCommand("insertText", false, "Renamed Page");
    expect(labelEdit.textContent).to.equal("Renamed Page");
    element.monitorTitle({ key: "Enter", target: labelEdit });
    await settle(element);
    // monitorTitle reads the inner text BEFORE removing the
    // contenteditable attribute; Chromium rolls the focused editing host
    // back to its pre-edit text once the attribute comes off the element,
    // so reading after the removal committed the ORIGINAL title instead
    expect(element.items.find((i) => i.id === "p1").title).to.equal(
      "Renamed Page",
    );
    expect(element.items.find((i) => i.id === "p1").modified).to.equal(true);
    // the visible label reflects the committed rename
    expect(
      pageLi(element, "p1").querySelector(".label.shown").textContent.trim(),
    ).to.equal("Renamed Page");
    // the editing host itself still rolls back to the pre-edit text once
    // the attribute is removed, but the title was captured first
    expect(labelEdit.textContent).to.equal("Page One");
    expect(labelEdit.hasAttribute("contenteditable")).to.equal(false);
  });

  it("commits the typed title through the merged keydown Enter path", async () => {
    const label = pageLi(element, "p1").querySelector(".label.shown");
    element.editTitle({ target: label });
    const labelEdit = pageLi(element, "p1").querySelector(".label-edit");
    // type a new title through the browser editing pipeline (a real user
    // typing lands in the same uncommitted edit state)
    const range = globalThis.document.createRange();
    range.selectNodeContents(labelEdit);
    const selection = selectionFor(element.shadowRoot);
    selection.removeAllRanges();
    selection.addRange(range);
    globalThis.document.execCommand("insertText", false, "Renamed Page");
    expect(labelEdit.textContent).to.equal("Renamed Page");
    // a real keydown Enter now commits through the merged path in
    // monitorEsc (lit allows one binding per event name)
    const event = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true,
    });
    labelEdit.dispatchEvent(event);
    expect(event.defaultPrevented).to.equal(true);
    await settle(element);
    expect(element.items.find((i) => i.id === "p1").title).to.equal(
      "Renamed Page",
    );
    expect(element.items.find((i) => i.id === "p1").modified).to.equal(true);
    expect(labelEdit.hasAttribute("contenteditable")).to.equal(false);
  });

  it("restores the original title when editing is cancelled", async () => {
    const label = pageLi(element, "p1").querySelector(".label.shown");
    element.editTitle({ target: label });
    const labelEdit = pageLi(element, "p1").querySelector(".label-edit");
    labelEdit.textContent = "Throwaway";
    element.monitorEsc({ key: "Escape", target: labelEdit });
    expect(labelEdit.textContent).to.equal("Page One");
    expect(labelEdit.hasAttribute("contenteditable")).to.equal(false);
    expect(
      pageLi(element, "p1").querySelector(".label").classList.contains("shown"),
    ).to.equal(true);
  });

  it("blurs out of title editing without committing", () => {
    const label = pageLi(element, "p1").querySelector(".label.shown");
    element.editTitle({ target: label });
    const labelEdit = pageLi(element, "p1").querySelector(".label-edit");
    labelEdit.textContent = "Nope";
    element.blurTitle({ target: labelEdit });
    expect(labelEdit.textContent).to.equal("Page One");
    // a blocked blur (Enter armed) restores nothing until the block clears
    const label2 = pageLi(element, "p2").querySelector(".label.shown");
    element.editTitle({ target: label2 });
    const labelEdit2 = pageLi(element, "p2").querySelector(".label-edit");
    labelEdit2.textContent = "Blocked";
    element._blurBlock = true;
    element.blurTitle({ target: labelEdit2 });
    expect(labelEdit2.textContent).to.equal("Blocked");
  });

  it("activates title editing from the Enter key on the label", async () => {
    const label = pageLi(element, "p2").querySelector(".label.shown");
    element.handleLabelKeydown({
      key: "Enter",
      target: label,
      preventDefault() {},
      stopPropagation() {},
    });
    expect(
      pageLi(element, "p2")
        .querySelector(".label-edit")
        .getAttribute("contenteditable"),
    ).to.equal("true");
  });

  it("moves items up and down within their sibling group", async () => {
    // after the JOS sync the flat order is p1, c1, c2, p2, p3
    const p2Index = element.items.findIndex((i) => i.id === "p2");
    element.itemOp(p2Index, "up");
    await settle(element);
    // p2 jumped above p1 in the top level after re-ordering
    expect(element.items.findIndex((i) => i.id === "p2")).to.equal(0);
    expect(element.items.find((i) => i.id === "p2").modified).to.equal(true);
    // and back down
    element.itemOp(0, "down");
    await settle(element);
    expect(element.items.findIndex((i) => i.id === "p2")).to.equal(3);
  });

  it("indents and outdents items relative to their neighbors", async () => {
    // indent makes the item the last child of the sibling above it (p1),
    // not of whatever row precedes it in the flat outline (c2)
    const p2Index = element.items.findIndex((i) => i.id === "p2");
    expect(element.items[p2Index - 1].id).to.equal("c2");
    element.itemOp(p2Index, "in");
    await settle(element);
    const p2 = element.items.find((i) => i.id === "p2");
    expect(p2.parent).to.equal("p1");
    expect(p2.indent).to.equal(1);
    // after c1 (0) and c2 (1)
    expect(p2.order).to.equal(2);
    expect(p2.modified).to.equal(true);
    // the first child has no sibling above it, so indent does nothing
    const c1Index = element.items.findIndex((i) => i.id === "c1");
    element.itemOp(c1Index, "in");
    await settle(element);
    expect(element.items.find((i) => i.id === "c1").parent).to.equal("p1");
    // outdent lands it right after its old parent and renumbers that
    // level, so it never shares an order with p3
    element.itemOp(
      element.items.findIndex((i) => i.id === "p2"),
      "out",
    );
    await settle(element);
    const p2Top = element.items.find((i) => i.id === "p2");
    expect(p2Top.parent).to.equal(null);
    expect(p2Top.indent).to.equal(0);
    const top = element.items.filter((i) => i.parent === null);
    expect(top.map((i) => i.id)).to.deep.equal(["p1", "p2", "p3"]);
    expect(top.map((i) => i.order)).to.deep.equal([0, 1, 2]);
    // outdent on a top level item is a no-op (parent already null)
    element.itemOp(
      element.items.findIndex((i) => i.id === "p1"),
      "out",
    );
    expect(element.items.find((i) => i.id === "p1").parent).to.equal(null);
  });

  it("locks and unlocks an item plus its descendants", async () => {
    const p1Index = element.items.findIndex((i) => i.id === "p1");
    element.itemOp(p1Index, "lock");
    await settle(element);
    expect(element.items.find((i) => i.id === "p1").metadata.locked).to.equal(
      true,
    );
    expect(element.items.find((i) => i.id === "c1").metadata.locked).to.equal(
      true,
    );
    expect(element.items.find((i) => i.id === "c2").metadata.locked).to.equal(
      true,
    );
    // p1 controls now render disabled
    expect(
      pageLi(element, "c1").querySelector(".label").hasAttribute("disabled"),
    ).to.equal(true);
    // locking again runs the unlock branch (recursive unlock)
    element.itemOp(p1Index, "lock");
    await settle(element);
    expect(element.items.find((i) => i.id === "c2").metadata.locked).to.equal(
      false,
    );
  });

  it("marks items for deletion recursively and hides them on demand", async () => {
    const p1Index = element.items.findIndex((i) => i.id === "p1");
    element.itemOp(p1Index, "delete");
    await settle(element);
    expect(element.items.find((i) => i.id === "p1").delete).to.equal(true);
    expect(element.items.find((i) => i.id === "c1").delete).to.equal(true);
    expect(element.items.find((i) => i.id === "c2").delete).to.equal(true);
    expect(element.hasDeletedItems()).to.equal(true);
    // the control bar surfaces the hide/show deleted toggle
    const deleteToggle = [
      ...element.shadowRoot.querySelectorAll("simple-toolbar-button"),
    ].find((b) => (b.label || "").includes("Deleted"));
    expect(deleteToggle === undefined).to.equal(false);
    element.toggleDelete();
    await settle(element);
    expect(element.hideDelete).to.equal(true);
    // hidden deleted pages are not drawn at all
    expect(pageLi(element, "p1") === null).to.equal(true);
    expect(pageLi(element, "c1") === null).to.equal(true);
    expect(pageLi(element, "p2") === null).to.equal(false);
    // delete again undeletes everything
    element.itemOp(p1Index, "delete");
    await settle(element);
    expect(element.items.find((i) => i.id === "c1").delete).to.equal(false);
  });

  it("locks block deletion attempts on locked items", async () => {
    const p3Index = element.items.findIndex((i) => i.id === "p3");
    element.itemOp(p3Index, "delete");
    await settle(element);
    expect(element.items.find((i) => i.id === "p3").delete).to.equal(undefined);
  });

  it("adds a new page below an item", async () => {
    const before = element.items.length;
    const p2Index = element.items.findIndex((i) => i.id === "p2");
    element.itemOp(p2Index, "add");
    await settle(element);
    expect(element.items.length).to.equal(before + 1);
    const added = element.items.find((i) => i.new === true);
    expect(added === undefined).to.equal(false);
    expect(added.contents).to.equal("<p></p>");
    expect(added.metadata.locked).to.equal(false);
    expect(added.parent).to.equal(null);
  });

  it("duplicates an item including its whole subtree", async () => {
    const before = element.items.length;
    const p1Index = element.items.findIndex((i) => i.id === "p1");
    element.itemOp(p1Index, "duplicate");
    await settle(element);
    expect(element.items.length).to.equal(before + 3);
    const titles = element.items.filter((i) => i.duplicate).map((i) => i.title);
    expect(titles).to.deep.equal([
      "Copy of Page One",
      "Copy of Child One",
      "Copy of Child Two",
    ]);
    // duplicated children point at the new duplicate parent
    const dupParent = element.items.find((i) => i.duplicate === "p1");
    expect(element.items.find((i) => i.duplicate === "c1").parent).to.equal(
      dupParent.id,
    );
  });

  it("adds a new page to the top of the outline", async () => {
    element.addItemToTop();
    expect(element.getAttribute("stop-animation")).to.equal("true");
    await settle(element);
    const first = element.items[0];
    expect(first.new).to.equal(true);
    expect(first.parent).to.equal(null);
    expect(element.items.length).to.equal(6);
  });

  it("adds a first page to an empty outline", async () => {
    element.items = [];
    await settle(element);
    element.addNewItem(0);
    expect(element.items.length).to.equal(1);
    expect(element.items[0].new).to.equal(true);
    // JSONOutlineSchemaItem supplies the default title for a fresh page
    expect(element.items[0].title).to.equal("New item");
  });

  it("requests navigation on goto without leaving the page when canceled", async () => {
    const seen = [];
    const onRequest = (e) => {
      seen.push(e.detail.href);
      e.preventDefault();
    };
    element.addEventListener("outline-designer-request-navigate", onRequest);
    const p2Index = element.items.findIndex((i) => i.id === "p2");
    element.itemOp(p2Index, "goto");
    await settle(element);
    expect(seen).to.deep.equal(["page-two"]);
    element.removeEventListener("outline-designer-request-navigate", onRequest);
  });

  it("changes row density instead of zooming", async () => {
    const rowHeight = () =>
      pageLi(element, "p1").getBoundingClientRect().height;
    const defaultHeight = rowHeight();
    element.setDensity("compact");
    await settle(element);
    expect(element.getAttribute("density")).to.equal("compact");
    expect(rowHeight() < defaultHeight).to.equal(true);
    // rows reflow; nothing is scaled
    expect(getComputedStyle(pageLi(element, "p1")).transform).to.equal("none");
    element.setDensity("roomy");
    await settle(element);
    expect(rowHeight() > defaultHeight).to.equal(true);
    // unknown values are ignored
    element.setDensity("huge");
    expect(element.density).to.equal("roomy");
    // the control bar shows which density is on
    const pressed = element.shadowRoot.querySelector(
      '.density button[aria-pressed="true"]',
    );
    expect(pressed.textContent.trim()).to.equal("Roomy");
    element.setDensity("default");
    await settle(element);
  });

  it("selects pages with ctrl click and range with shift click", async () => {
    element.setActiveItemForActions({ target: pageLi(element, "c1") });
    expect(element.activeItemForActions).to.equal("c1");
    // ctrl-click toggles selection
    element.handleItemClick({
      ctrlKey: true,
      target: pageLi(element, "c1"),
    });
    expect(element.selectedPages).to.deep.equal(["c1"]);
    expect(element.activePage).to.equal("c1");
    // shift click selects the visible range between the two
    element.handleItemClick({
      shiftKey: true,
      target: pageLi(element, "p3"),
    });
    expect(element.selectedPages).to.deep.equal(["c1", "c2", "p2", "p3"]);
    // plain click on a label sets the active page
    element.handleItemClick({
      target: pageLi(element, "p2").querySelector(".label.shown"),
    });
    await element.updateComplete;
    expect(element.activePage).to.equal("p2");
    expect(pageLi(element, "p2").classList.contains("active-page")).to.equal(
      true,
    );
    // plain click on a control button does not move the active page
    element.handleItemClick({
      target: pageLi(element, "p1").querySelector(".actions-menu-button"),
    });
    expect(element.activePage).to.equal("p2");
    // toggle selection back off
    element.handleItemClick({
      ctrlKey: true,
      target: pageLi(element, "c1"),
    });
    expect(element.selectedPages.includes("c1")).to.equal(false);
  });

  it("deletes the selected pages in bulk", async () => {
    // open a content preview so the bulk delete has popover state to clear
    pageLi(element, "p1").querySelector(".content-toggle-btn").click();
    await settle(element);
    const previewNode = element.shadowRoot.querySelector(
      '[data-content-parent-id="p1"][data-node-index="1"]',
    );
    element.setActivePreview({
      target: previewNode,
      preventDefault() {},
      stopPropagation() {},
      stopImmediatePropagation() {},
    });
    expect(element.activePreview === previewNode).to.equal(true);
    element.handleItemClick({
      ctrlKey: true,
      target: pageLi(element, "p1"),
    });
    element.deleteSelected();
    await settle(element);
    // the preview state cannot survive the bulk delete
    expect(element.activePreview).to.equal(null);
    expect(element.activePreviewIndex).to.equal(-1);
    expect(
      element.shadowRoot.querySelector("simple-popover").hasAttribute("hidden"),
    ).to.equal(true);
    expect(element.items.find((i) => i.id === "p1").delete).to.equal(true);
    expect(element.items.find((i) => i.id === "c2").delete).to.equal(true);
    // selection is consumed by the bulk delete
    expect(element.selectedPages).to.deep.equal([]);
    // locked pages are skipped by bulk delete
    element.handleItemClick({
      ctrlKey: true,
      target: pageLi(element, "p3"),
    });
    element.deleteSelected();
    await settle(element);
    expect(element.items.find((i) => i.id === "p3").delete).to.equal(undefined);
  });

  it("navigates the tree by keyboard", async () => {
    const p1 = pageLi(element, "p1");
    const c1 = pageLi(element, "c1");
    // keys are ignored when the event does not originate on the item
    // itself (before any announcement muddies the live region check)
    keydown(c1.querySelector(".label.shown"), "ArrowDown");
    expect(element.liveRegionText).to.equal("");
    // ArrowDown moves focus to the next item; the focused tree item is
    // read by the screen reader, so navigation is not announced as well
    keydown(p1, "ArrowDown");
    expect(element.shadowRoot.activeElement === c1).to.equal(true);
    expect(element.liveRegionText).to.equal("");
    // one row is in the tab order at a time
    await element.updateComplete;
    expect(c1.getAttribute("tabindex")).to.equal("0");
    expect(p1.getAttribute("tabindex")).to.equal("-1");
    // ArrowUp moves back
    keydown(c1, "ArrowUp");
    expect(element.shadowRoot.activeElement === p1).to.equal(true);
    // ArrowRight focuses the first child when expanded
    keydown(p1, "ArrowRight");
    expect(element.shadowRoot.activeElement === c1).to.equal(true);
    // ArrowLeft from a child focuses the parent
    keydown(c1, "ArrowLeft");
    expect(element.shadowRoot.activeElement === p1).to.equal(true);
    // Home / End move to the extremes
    keydown(c1, "Home");
    expect(element.shadowRoot.activeElement === p1).to.equal(true);
    keydown(p1, "End");
    expect(element.shadowRoot.activeElement === pageLi(element, "p3")).to.equal(
      true,
    );
    // Space selects the row, and again deselects it
    keydown(p1, " ");
    expect(element.selectedPages).to.deep.equal(["p1"]);
    keydown(p1, " ");
    expect(element.selectedPages).to.deep.equal([]);
    // typing a letter jumps to the next title starting with it
    keydown(p1, "l");
    expect(element.shadowRoot.activeElement === pageLi(element, "p3")).to.equal(
      true,
    );
    // Enter starts renaming the focused row
    keydown(p1, "Enter");
    expect(
      p1.querySelector(".label-edit").getAttribute("contenteditable"),
    ).to.equal("true");
    keydown(p1.querySelector(".label-edit"), "Escape");
    // Enter on a locked row does not rename it
    keydown(pageLi(element, "p3"), "Enter");
    expect(
      pageLi(element, "p3")
        .querySelector(".label-edit")
        .hasAttribute("contenteditable"),
    ).to.equal(false);
    // ArrowLeft collapses an expanded parent, ArrowRight re-expands it
    keydown(p1, "ArrowLeft");
    await settle(element);
    expect(element.isCollapsed("p1")).to.equal(true);
    keydown(p1, "ArrowRight");
    await settle(element);
    expect(element.isCollapsed("p1")).to.equal(false);
  });

  it("focus traversal skips unrendered rows while deleted items are hidden", async () => {
    // collapse p1 (c1 / c2 leave the DOM) and hide the deleted p2
    pageLi(element, "p1").querySelector(".collapse-btn").click();
    await settle(element);
    element.itemOp(
      element.items.findIndex((i) => i.id === "p2"),
      "delete",
    );
    await settle(element);
    element.toggleDelete();
    await settle(element);
    // rendered rows are p1 and p3 only
    expect(pageLi(element, "c1") === null).to.equal(true);
    expect(pageLi(element, "p2") === null).to.equal(true);
    // next / previous focus moves only target rendered rows
    element.focusItem("p1");
    element.focusNextItem(element.items.findIndex((i) => i.id === "p1"));
    expect(element.shadowRoot.activeElement === pageLi(element, "p3")).to.equal(
      true,
    );
    element.focusPreviousItem(element.items.findIndex((i) => i.id === "p3"));
    expect(element.shadowRoot.activeElement === pageLi(element, "p1")).to.equal(
      true,
    );
  });

  it("deletes and duplicates from the tree keyboard shortcuts", async () => {
    const p1 = pageLi(element, "p1");
    // Delete on the focused row marks it (and its sub-pages) for deletion
    keydown(p1, "Delete");
    await settle(element);
    expect(element.items.find((i) => i.id === "p1").delete).to.equal(true);
    expect(element.items.find((i) => i.id === "c1").delete).to.equal(true);
    // and again restores it
    keydown(pageLi(element, "p1"), "Delete");
    await settle(element);
    expect(element.items.find((i) => i.id === "p1").delete).to.equal(false);
    expect(element.liveRegionText).to.equal("Restored Page One");
    // locked rows are not deleted
    keydown(pageLi(element, "p3"), "Delete");
    await settle(element);
    expect(element.items.find((i) => i.id === "p3").delete).to.equal(undefined);
    // ctrl+d duplicates the active item
    const before = element.items.length;
    const p2 = pageLi(element, "p2");
    element.setActiveItemForActions({ target: p2 });
    keydown(p2, "d", { ctrlKey: true });
    await settle(element);
    expect(element.items.length).to.equal(before + 1);
    expect(
      element.items.filter((i) => i.title === "Copy of Page Two").length,
    ).to.equal(1);
  });

  it("moves a page with Alt+arrows straight from its row", async () => {
    const order = () => element.items.map((i) => i.id);
    // Alt+Up moves p2 above p1 (with nothing else to switch on first)
    keydown(pageLi(element, "p2"), "ArrowUp", { altKey: true });
    await settle(element);
    expect(order()).to.deep.equal(["p2", "p1", "c1", "c2", "p3"]);
    expect(element.liveRegionText).to.equal("Moved Page Two up");
    // focus stays on the moved row
    expect(element.shadowRoot.activeElement === pageLi(element, "p2")).to.equal(
      true,
    );
    // Alt+Up again: already first in its group
    keydown(pageLi(element, "p2"), "ArrowUp", { altKey: true });
    await settle(element);
    expect(element.liveRegionText).to.equal(
      "Page Two is already first in its group.",
    );
    // Alt+Down moves it back below p1 (and p1's sub-pages)
    keydown(pageLi(element, "p2"), "ArrowDown", { altKey: true });
    await settle(element);
    expect(order()).to.deep.equal(["p1", "c1", "c2", "p2", "p3"]);
    // Alt+Right indents (Right goes deeper), Alt+Left outdents
    keydown(pageLi(element, "p2"), "ArrowRight", { altKey: true });
    await settle(element);
    expect(element.items.find((i) => i.id === "p2").parent).to.equal("p1");
    expect(element.liveRegionText).to.equal("Page Two is now inside Page One");
    keydown(pageLi(element, "p2"), "ArrowLeft", { altKey: true });
    await settle(element);
    expect(element.items.find((i) => i.id === "p2").parent).to.equal(null);
    // locked pages do not move
    keydown(pageLi(element, "p3"), "ArrowUp", { altKey: true });
    await settle(element);
    expect(order().indexOf("p3")).to.equal(4);
    expect(element.liveRegionText).to.equal(
      "Locked Page is locked. Unlock it to change it.",
    );
  });

  it("adds pages from the keyboard and starts naming them", async () => {
    const before = element.items.length;
    keydown(pageLi(element, "p2"), "Enter", { ctrlKey: true });
    await settle(element);
    expect(element.items.length).to.equal(before + 1);
    const added = element.items.find((i) => i.new);
    expect(added.parent).to.equal(null);
    // the new row is in title editing
    expect(
      pageLi(element, added.id)
        .querySelector(".label-edit")
        .getAttribute("contenteditable"),
    ).to.equal("true");
    // Ctrl+Shift+Enter adds a sub-page at the end of the row's children
    keydown(pageLi(element, "p1"), "Enter", { ctrlKey: true, shiftKey: true });
    await settle(element);
    const child = element.items.find((i) => i.new && i.parent === "p1");
    expect(child === undefined).to.equal(false);
    expect(child.indent).to.equal(1);
    expect(child.order).to.equal(2);
    expect(child.contents).to.equal("<p></p>");
    expect(child.metadata.locked).to.equal(false);
  });

  it("adds a page at the end of a level from its add row", async () => {
    const addRow = element.shadowRoot.querySelector(
      'li.add-row[data-add-parent="p1"]',
    );
    expect(addRow === null).to.equal(false);
    expect(addRow.getAttribute("aria-hidden")).to.equal("true");
    addRow.click();
    await settle(element);
    const added = element.items.find((i) => i.new);
    expect(added.parent).to.equal("p1");
    // the locked page closes no level with an add row of its own
    expect(
      element.shadowRoot.querySelector('li.add-row[data-add-parent="p3"]'),
    ).to.equal(null);
    // hide-add-rows removes them
    element.hideAddRows = true;
    await settle(element);
    expect(element.shadowRoot.querySelector("li.add-row")).to.equal(null);
  });

  it("opens the actions menu from Shift+F10 and returns focus", async () => {
    const p2 = pageLi(element, "p2");
    keydown(p2, "F10", { shiftKey: true });
    await settle(element);
    const menu = p2.querySelector(".actions-menu");
    expect(menu.open).to.equal(true);
    menu.close();
    await settle(element);
    expect(element.shadowRoot.activeElement === pageLi(element, "p2")).to.equal(
      true,
    );
  });

  it("draws connector lines for each level", () => {
    // c1 sits one level in: one column with a top half, a tick and,
    // because c2 follows at its level, a bottom half
    const c1 = pageLi(element, "c1");
    expect(c1.querySelectorAll(".cols .col").length).to.equal(1);
    expect(c1.querySelector(".ln.bot") === null).to.equal(false);
    // parents get a chevron, leaves a dot
    expect(
      pageLi(element, "p1").querySelector(".collapse-btn") === null,
    ).to.equal(false);
    expect(pageLi(element, "p2").querySelector(".leaf") === null).to.equal(
      false,
    );
  });

  it("announces state and actions through the live region", async () => {
    element.announceNavigation("Moving along");
    await element.updateComplete;
    expect(element.liveRegionText).to.equal("Moving along");
    expect(
      element.shadowRoot
        .querySelector('div[aria-live="polite"]')
        .textContent.trim(),
    ).to.equal("Moving along");
    element.announceStateChange("Expanded");
    expect(element.liveRegionText).to.equal("Expanded");
    element.announceAction("Duplicated");
    expect(element.liveRegionText).to.equal("Duplicated");
  });

  it("scrolls a moved item into view when needed", async () => {
    // delay 0 keeps the test fast; the item is in view so no scroll happens
    element.scrollIntoViewIfNeeded("p2", 0);
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(element.items.find((i) => i.id === "p2") === undefined).to.equal(
      false,
    );
  });
});
