import { fixture, expect, html } from "@open-wc/testing";
import "../outline-designer.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";

// behavioral coverage for outline-designer content operations (heading
// promote/demote/move/delete, page breaks, heading renames, content
// prepend), the drag-and-drop lifecycle with drop zones, the preview
// popover, the storeTools import wiring (getSiteItems / getData) and the
// updated() branches (fidelity, activePreview).
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
      contents: '<h2 id="first">Heading one</h2><p id="second">Para one</p>',
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
      contents: "<h3>Child heading</h3><p>Child para</p>",
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

const contentLi = (element, itemId, nodeIndex) =>
  element.shadowRoot.querySelector(
    `li[data-content-parent-id="${itemId}"][data-node-index="${nodeIndex}"]`,
  );

const fakeEventFrom = (target) => ({
  target,
  preventDefault() {},
  stopPropagation() {},
  stopImmediatePropagation() {},
});

describe("outline-designer content operations", () => {
  let element;
  let savedHaxSchemaFromTag;

  before(() => {
    // give every content node a schema so renderNodeAsItem resolves icons
    savedHaxSchemaFromTag = HAXStore.haxSchemaFromTag;
    HAXStore.haxSchemaFromTag = () => ({
      gizmo: { icon: "icons:code", title: "Text block" },
    });
  });

  after(() => {
    delete HAXStore.haxSchemaFromTag;
    HAXStore.haxSchemaFromTag = savedHaxSchemaFromTag;
  });

  beforeEach(async () => {
    // data and focus tests run without motion so each step lands at once
    element = await fixture(
      html`<outline-designer reduced-motion="reduce"></outline-designer>`,
    );
    element.items = makeItems();
    await settle(element);
    // reveal contents of p1 for the content node tests (direct item
    // mutations are not reactive on their own, so force the update)
    element.items.find((i) => i.id === "p1").showContent = true;
    await element.requestUpdate();
    await new Promise((resolve) => setTimeout(resolve, 20));
  });

  it("renders content nodes as children with heading semantics", async () => {
    const heading = contentLi(element, "p1", 0);
    const para = contentLi(element, "p1", 1);
    expect(heading === null).to.equal(false);
    expect(heading.classList.contains("content-heading")).to.equal(true);
    expect(heading.querySelector(".label.shown").textContent.trim()).to.equal(
      "Heading one",
    );
    expect(para.classList.contains("content-non-heading")).to.equal(true);
    expect(para.querySelector(".label.shown").textContent.trim()).to.equal(
      "Text block",
    );
    // heading operations are hidden (not removed) on non-heading nodes
    expect(
      para.querySelector('[title="Increase heading"]').hasAttribute("hidden"),
    ).to.equal(true);
    expect(
      heading
        .querySelector('[title="Increase heading"]')
        .hasAttribute("hidden"),
    ).to.equal(false);
    // no blocks to offer: no (empty) operations row
    expect(
      element.shadowRoot.querySelector('[data-item-for-content-id="p1"]'),
    ).to.equal(null);
    // with blocks to offer, the row renders for the page
    element.haxGizmos = [
      { tag: "gizmo", icon: "icons:code", title: "Text block" },
    ];
    element.requestUpdate();
    await settle(element);
    expect(
      element.shadowRoot.querySelector('[data-item-for-content-id="p1"]') ===
        null,
    ).to.equal(false);
  });

  it("moves content nodes up and down", async () => {
    const page = element.items.find((i) => i.id === "p1");
    const para = contentLi(element, "p1", 1);
    element.modifyContentAction(fakeEventFrom(para), page, "up");
    await settle(element);
    const p1 = element.items.find((i) => i.id === "p1");
    expect(p1.contents.startsWith('<p id="second">')).to.equal(true);
    expect(p1.contents.endsWith("</h2>")).to.equal(true);
    // and back down (the para is now the first node)
    const movedPara = contentLi(element, "p1", 0);
    element.modifyContentAction(fakeEventFrom(movedPara), page, "down");
    await settle(element);
    const p1After = element.items.find((i) => i.id === "p1");
    expect(p1After.contents.startsWith("<h2")).to.equal(true);
    // moving the first node up and last node down are no-ops
    const first = contentLi(element, "p1", 0);
    element.modifyContentAction(fakeEventFrom(first), page, "up");
    const last = contentLi(element, "p1", 1);
    element.modifyContentAction(fakeEventFrom(last), page, "down");
    await settle(element);
    expect(element.items.find((i) => i.id === "p1").contents).to.equal(
      '<h2 id="first">Heading one</h2><p id="second">Para one</p>',
    );
  });

  it("promotes and demotes headings between levels", async () => {
    const page = element.items.find((i) => i.id === "p1");
    const heading = contentLi(element, "p1", 0);
    element.modifyContentAction(fakeEventFrom(heading), page, "in");
    await settle(element);
    // the level change rebuilds the heading element while carrying the
    // existing attributes (like the id) onto the rebuilt heading
    expect(element.items.find((i) => i.id === "p1").contents).to.include(
      '<h1 id="first">Heading one</h1>',
    );
    // back out to h2 and further out to h3
    const h1 = contentLi(element, "p1", 0);
    element.modifyContentAction(fakeEventFrom(h1), page, "out");
    await settle(element);
    const h2 = contentLi(element, "p1", 0);
    element.modifyContentAction(fakeEventFrom(h2), page, "out");
    await settle(element);
    expect(element.items.find((i) => i.id === "p1").contents).to.include(
      '<h3 id="first">Heading one</h3>',
    );
  });

  it("blocks heading promotion at h1 and demotion at h6", async () => {
    const page = element.items.find((i) => i.id === "p1");
    page.contents = "<h1>Top</h1><h6>Bottom</h6>";
    await element.requestUpdate();
    await new Promise((resolve) => setTimeout(resolve, 20));
    const h1 = contentLi(element, "p1", 0);
    element.modifyContentAction(fakeEventFrom(h1), page, "in");
    await settle(element);
    const h6 = contentLi(element, "p1", 1);
    element.modifyContentAction(fakeEventFrom(h6), page, "out");
    await settle(element);
    const after = element.items.find((i) => i.id === "p1");
    expect(after.contents).to.include("<h1>Top</h1>");
    expect(after.contents).to.include("<h6>Bottom</h6>");
  });

  it("deletes a content node", async () => {
    const page = element.items.find((i) => i.id === "p1");
    const para = contentLi(element, "p1", 1);
    element.modifyContentAction(fakeEventFrom(para), page, "delete");
    // set synchronously by the delete branch before the sync timers run
    expect(element.getAttribute("stop-animation")).to.equal("true");
    await settle(element);
    expect(element.items.find((i) => i.id === "p1").contents).to.not.include(
      "Para one",
    );
  });

  it("splits a page at a heading into a new page", async () => {
    const p1 = element.items.find((i) => i.id === "p1");
    p1.contents =
      "<h2>First section</h2><p>Old content</p><h2>Second</h2><p>New content</p>";
    await element.requestUpdate();
    await new Promise((resolve) => setTimeout(resolve, 20));
    const secondHeading = contentLi(element, "p1", 2);
    const before = element.items.length;
    element.pageBreakHere(fakeEventFrom(secondHeading), p1);
    await settle(element);
    expect(element.items.length).to.equal(before + 1);
    // the original page keeps everything above the split
    expect(element.items.find((i) => i.id === "p1").contents).to.not.include(
      "New content",
    );
    expect(element.items.find((i) => i.id === "p1").modified).to.equal(true);
    // the new page starts at the split heading
    const newPage = element.items.find(
      (i) => i.new === true && i.title === "Second",
    );
    expect(newPage === undefined).to.equal(false);
    expect(newPage.parent).to.equal(null);
    expect(newPage.metadata.locked).to.equal(false);
  });

  it("renames a heading from its inline label", async () => {
    const heading = contentLi(element, "p1", 0);
    const label = heading.querySelector(".label.shown");
    element.editTitle({ target: label });
    const labelEdit = heading.querySelector(".label-edit");
    // write via textContent (uncommitted innerText edits are discarded
    // when the contenteditable attribute is removed)
    labelEdit.textContent = "Renamed heading";
    element.monitorHeading({ key: "Enter", target: labelEdit });
    await settle(element);
    expect(element.items.find((i) => i.id === "p1").contents).to.include(
      "Renamed heading",
    );
    expect(element.items.find((i) => i.id === "p1").contents).to.not.include(
      "Heading one",
    );
  });

  it("renames a heading through the merged keydown Enter path", async () => {
    const heading = contentLi(element, "p1", 0);
    const label = heading.querySelector(".label.shown");
    element.editTitle({ target: label });
    const labelEdit = heading.querySelector(".label-edit");
    // write via textContent (uncommitted innerText edits are discarded
    // when the contenteditable attribute is removed)
    labelEdit.textContent = "Renamed heading";
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
    expect(element.items.find((i) => i.id === "p1").contents).to.include(
      "Renamed heading",
    );
    expect(element.items.find((i) => i.id === "p1").contents).to.not.include(
      "Heading one",
    );
  });

  it("previews a content node in the popover and resets it", async () => {
    const para = contentLi(element, "p1", 1);
    element.setActivePreview(fakeEventFrom(para));
    const popover = element.shadowRoot.querySelector("simple-popover");
    expect(popover.hasAttribute("hidden")).to.equal(false);
    expect(element.activePreview === para).to.equal(true);
    expect(element.activePreviewIndex).to.equal(1);
    expect(popover.target === para).to.equal(true);
    await settle(element);
    // the preview renders the node markup into the popover
    expect(popover.querySelector("p") === null).to.equal(false);
    expect(
      element.activePreview.classList.contains("active-preview-item"),
    ).to.equal(true);
    // reset hides it again
    element.resetPopOver();
    expect(popover.hasAttribute("hidden")).to.equal(true);
    expect(element.activePreview).to.equal(null);
    expect(element.activePreviewIndex).to.equal(-1);
  });

  it("returns nothing for empty or unindexed preview targets", () => {
    const ghost = globalThis.document.createElement("div");
    ghost.setAttribute("data-content-parent-id", "does-not-exist");
    expect(element.renderActiveContentItem(null, 0) === undefined).to.equal(
      true,
    );
    expect(element.renderActiveContentItem(ghost, -1) === undefined).to.equal(
      true,
    );
  });

  it("skips a stale preview target without crashing", () => {
    // a preview node whose parent item is gone (bulk delete now resets
    // the preview state, but the popover render must also tolerate a
    // stale target) skips the popover content instead of throwing a
    // TypeError out of render()
    const ghost = globalThis.document.createElement("div");
    ghost.setAttribute("data-content-parent-id", "does-not-exist");
    expect(element.renderActiveContentItem(ghost, 0) === undefined).to.equal(
      true,
    );
  });

  it("prepends a gizmo demo schema onto the page contents", async () => {
    HAXStore.haxSchemaFromTag = () => ({
      gizmo: { icon: "av:av", title: "Video", tag: "video-player" },
      demoSchema: [
        {
          tag: "p",
          content: "Prepended block",
        },
      ],
    });
    // the operation buttons render from the gizmo list
    element.haxGizmos = [
      { icon: "av:av", title: "Video", tag: "video-player" },
    ];
    await element.requestUpdate();
    await new Promise((resolve) => setTimeout(resolve, 20));
    const opRow = element.shadowRoot.querySelector(
      '[data-item-for-content-id="p1"]',
    );
    const opButton = opRow.querySelector(".operation");
    expect(opButton === null).to.equal(false);
    opButton.value = "video-player";
    element.prependNodeToContent(fakeEventFrom(opButton));
    await settle(element);
    const p1 = element.items.find((i) => i.id === "p1");
    expect(p1.contents.startsWith("<p>Prepended block</p>")).to.equal(true);
    expect(p1.contents).to.include("Heading one");
  });

  it("prepends a fallback element for gizmos without demoSchema", async () => {
    // schemas without demoSchema[0] fall back to creating the clicked
    // gizmo tag instead of crashing on an undefined variable
    HAXStore.haxSchemaFromTag = () => ({
      gizmo: { icon: "av:av", title: "Video", tag: "video-player" },
    });
    // the operation buttons render from the gizmo list
    element.haxGizmos = [
      { icon: "av:av", title: "Video", tag: "video-player" },
    ];
    await element.requestUpdate();
    await new Promise((resolve) => setTimeout(resolve, 20));
    const opRow = element.shadowRoot.querySelector(
      '[data-item-for-content-id="p1"]',
    );
    const opButton = opRow.querySelector(".operation");
    opButton.value = "video-player";
    element.prependNodeToContent(fakeEventFrom(opButton));
    await settle(element);
    const p1 = element.items.find((i) => i.id === "p1");
    expect(p1.contents.startsWith("<video-player></video-player>")).to.equal(
      true,
    );
    expect(p1.contents).to.include("Heading one");
  });

  it("skips content actions on locked pages", async () => {
    const lockedItem = element.items.find((i) => i.id === "p3");
    lockedItem.showContent = true;
    await element.requestUpdate();
    await new Promise((resolve) => setTimeout(resolve, 20));
    const lockedNode = contentLi(element, "p3", 0);
    element.modifyContentAction(fakeEventFrom(lockedNode), lockedItem, "up");
    await settle(element);
    expect(lockedItem.contents).to.equal("<p>Locked</p>");
    element.pageBreakHere(fakeEventFrom(lockedNode), lockedItem);
    await settle(element);
    expect(element.items.length).to.equal(4);
  });
});

describe("outline-designer drag lifecycle", () => {
  let element;
  let savedHaxSchemaFromTag;

  before(() => {
    savedHaxSchemaFromTag = HAXStore.haxSchemaFromTag;
    HAXStore.haxSchemaFromTag = () => ({
      gizmo: { icon: "icons:code", title: "Text block" },
    });
  });

  after(() => {
    delete HAXStore.haxSchemaFromTag;
    HAXStore.haxSchemaFromTag = savedHaxSchemaFromTag;
  });

  // the content fixture plus a second child, so placement has siblings
  const dragItems = () => {
    const items = makeItems();
    items.splice(2, 0, {
      id: "c2",
      title: "Child Two",
      slug: "child-two",
      location: "pages/child-two/index.html",
      order: 1,
      parent: "p1",
      indent: 1,
      contents: "",
      metadata: { locked: false },
    });
    return items;
  };

  beforeEach(async () => {
    element = await fixture(
      html`<outline-designer reduced-motion="reduce"></outline-designer>`,
    );
    element.items = dragItems();
    await settle(element);
  });

  const list = () => element.shadowRoot.querySelector("#list");
  // a point inside a row: fy is the height fraction, dx shifts sideways
  const at = (li, fy = 0.5, dx = 0) => {
    const r = li.getBoundingClientRect();
    return { x: r.left + r.width / 2 + dx, y: r.top + r.height * fy };
  };
  const pointer = (target, type, point, opts = {}) =>
    target.dispatchEvent(
      new PointerEvent(type, {
        bubbles: true,
        composed: true,
        cancelable: true,
        clientX: point.x,
        clientY: point.y,
        pointerId: opts.pointerId || 7,
        pointerType: opts.pointerType || "mouse",
        isPrimary: true,
        button: 0,
        buttons: type === "pointerup" ? 0 : 1,
      }),
    );
  // press on a row's title, move past the threshold, then move to point
  const startDrag = (id, opts = {}) => {
    const li = pageLi(element, id);
    const from = at(li.querySelector(".label.shown"));
    pointer(li.querySelector(".label.shown"), "pointerdown", from, opts);
    pointer(list(), "pointermove", { x: from.x, y: from.y + 8 }, opts);
    return from;
  };
  // straight up or down from where the drag started, over a row
  const over = (li, fy, from) => ({ x: from.x, y: at(li, fy).y });
  const moveTo = (point, opts) => pointer(list(), "pointermove", point, opts);
  const release = (point, opts) => pointer(list(), "pointerup", point, opts);

  it("counts descendants for drag previews", () => {
    expect(element._countAllDescendants("p1")).to.equal(2);
    expect(element._countAllDescendants("p2")).to.equal(0);
  });

  it("resolves drop targets from a point", () => {
    const p2 = pageLi(element, "p2");
    const rect = p2.getBoundingClientRect();
    const found = element._targetFromPoint(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
    );
    expect(found === null).to.equal(false);
    expect(found.getAttribute("data-item-id")).to.equal("p2");
    // off-canvas points resolve to nothing
    expect(element._targetFromPoint(-10, -10)).to.equal(null);
  });

  it("drags a page after another with the mouse", async () => {
    const from = startDrag("p2");
    await element.updateComplete;
    // the page and the ghost show the drag
    expect(element.hasAttribute("data-dragging")).to.equal(true);
    expect(pageLi(element, "p2").hasAttribute("data-dragging")).to.equal(true);
    expect(
      element.shadowRoot.querySelector(".drag-ghost").hasAttribute("hidden"),
    ).to.equal(false);
    // bottom 30% of p3 places it after p3, at the top level
    const point = over(pageLi(element, "p3"), 0.9, from);
    moveTo(point);
    await element.updateComplete;
    expect(element._dropTarget.zone).to.equal("after");
    expect(element._dropTarget.depth).to.equal(0);
    const line = element.shadowRoot.querySelector(".dropline");
    expect(line.hasAttribute("hidden")).to.equal(false);
    expect(element.liveRegionText).to.include("Drop below Locked Page");
    release(point);
    await settle(element);
    const top = element.items.filter((i) => i.parent === null);
    expect(top.map((i) => i.id)).to.deep.equal(["p1", "p3", "p2"]);
    // whole-number orders, and both pages that changed are flagged
    expect(top.map((i) => i.order)).to.deep.equal([0, 1, 2]);
    expect(element.items.find((i) => i.id === "p2").modified).to.equal(true);
    expect(element.items.find((i) => i.id === "p3").modified).to.equal(true);
    expect(element.items.find((i) => i.id === "p1").modified).to.equal(
      undefined,
    );
    // drag state is gone
    expect(element.hasAttribute("data-dragging")).to.equal(false);
    expect(element._drag).to.equal(null);
    expect(line.hasAttribute("hidden")).to.equal(true);
  });

  it("nests a page when dropped on the middle of a row", async () => {
    const from = startDrag("p2");
    const point = over(pageLi(element, "p1"), 0.5, from);
    moveTo(point);
    await element.updateComplete;
    expect(element._dropTarget.zone).to.equal("child");
    expect(
      pageLi(element, "p1").classList.contains("drop-target-child"),
    ).to.equal(true);
    release(point);
    await settle(element);
    const p2 = element.items.find((i) => i.id === "p2");
    expect(p2.parent).to.equal("p1");
    expect(p2.indent).to.equal(1);
    // last child, after c1 and c2
    expect(p2.order).to.equal(2);
    // the top level closed the gap p2 left
    expect(element.items.find((i) => i.id === "p3").order).to.equal(1);
  });

  it("changes a page's level by dragging it sideways", async () => {
    const indent = 20;
    const from = startDrag("c2");
    // two indent steps to the left, still over its own row
    const point = { x: from.x - indent * 2, y: from.y };
    moveTo(point);
    await element.updateComplete;
    expect(element._dropTarget.zone).to.equal("self");
    expect(element._dropTarget.depth).to.equal(0);
    expect(element._dropTarget.text).to.include("top level");
    release(point);
    await settle(element);
    const c2 = element.items.find((i) => i.id === "c2");
    expect(c2.parent).to.equal(null);
    expect(c2.indent).to.equal(0);
    expect(
      element.items.filter((i) => i.parent === null).map((i) => i.id),
    ).to.deep.equal(["p1", "c2", "p2", "p3"]);
  });

  it("never lands a page where it would steal another page's parent", async () => {
    // p3 is locked, so carry p2 instead
    const from = startDrag("p2");
    // just above c2, pulled far left: c2 stays c1's sibling, so the
    // landing level cannot be shallower than c2's
    const point = {
      x: list().getBoundingClientRect().left + 2,
      y: at(pageLi(element, "c2"), 0.1).y,
    };
    moveTo(point);
    await element.updateComplete;
    expect(element._dropTarget.zone).to.equal("before");
    expect(element._dropTarget.depth).to.equal(1);
    expect(element._dropTarget.parentId).to.equal("p1");
    release(point);
    await settle(element);
    expect(element.items.find((i) => i.id === "c2").parent).to.equal("p1");
    const p2 = element.items.find((i) => i.id === "p2");
    expect(p2.parent).to.equal("p1");
    expect(p2.order).to.equal(1);
    expect(element.items.find((i) => i.id === "c2").order).to.equal(2);
  });

  it("highlights the group the page will join", async () => {
    const from = startDrag("p2");
    // straight down below c2 it stays at its own (top) level
    moveTo(over(pageLi(element, "c2"), 0.9, from));
    await element.updateComplete;
    expect(element._dropTarget.group).to.equal("root|0");
    // one indent step to the right joins p1's children, after c2
    moveTo({ x: from.x + 20, y: at(pageLi(element, "c2"), 0.9).y });
    await element.updateComplete;
    expect(element._dropTarget.group).to.equal("p1|1");
    expect(
      pageLi(element, "c1").querySelector(".ln.tick").classList.contains("hl"),
    ).to.equal(true);
    release({ x: from.x + 20, y: at(pageLi(element, "c2"), 0.9).y });
    await settle(element);
  });

  it("moves a page with its sub-pages", async () => {
    const from = startDrag("p1");
    const point = over(pageLi(element, "p3"), 0.9, from);
    moveTo(point);
    await element.updateComplete;
    // the whole subtree fades while it is carried
    expect(pageLi(element, "c1").hasAttribute("data-dragging")).to.equal(true);
    release(point);
    await settle(element);
    expect(element.items.map((i) => i.id)).to.deep.equal([
      "p2",
      "p3",
      "p1",
      "c1",
      "c2",
    ]);
    expect(element.items.find((i) => i.id === "c1").parent).to.equal("p1");
  });

  it("does nothing when released outside or cancelled", async () => {
    const before = JSON.stringify(element.items);
    startDrag("p2");
    moveTo({ x: -500, y: -500 });
    await element.updateComplete;
    expect(element._dropTarget).to.equal(null);
    release({ x: -500, y: -500 });
    await settle(element);
    expect(JSON.stringify(element.items)).to.equal(before);
    const again = startDrag("p2");
    moveTo(over(pageLi(element, "p1"), 0.1, again));
    pointer(list(), "pointercancel", { x: 0, y: 0 });
    await settle(element);
    expect(element._drag).to.equal(null);
    expect(JSON.stringify(element.items)).to.equal(before);
    expect(element.liveRegionText).to.equal("Move cancelled");
  });

  it("does not drag locked pages or start from buttons", async () => {
    startDrag("p3");
    expect(element._drag).to.equal(null);
    const button = pageLi(element, "p2").querySelector(".actions-menu-button");
    const point = at(button);
    pointer(button, "pointerdown", point);
    moveTo({ x: point.x, y: point.y + 30 });
    expect(element._drag).to.equal(null);
    release(point);
  });

  it("swallows the click that ends a drag", async () => {
    const from = startDrag("p2");
    const point = over(pageLi(element, "p3"), 0.9, from);
    moveTo(point);
    release(point);
    expect(element._suppressClick).to.equal(true);
    await settle(element);
    expect(element._suppressClick).to.equal(false);
  });

  it("picks a row up with a held finger on touch", async () => {
    const opts = { pointerType: "touch", pointerId: 11 };
    const li = pageLi(element, "p2");
    const from = at(li.querySelector(".label.shown"));
    pointer(li.querySelector(".label.shown"), "pointerdown", from, opts);
    await element.updateComplete;
    expect(pageLi(element, "p2").classList.contains("pressing")).to.equal(true);
    await new Promise((resolve) => setTimeout(resolve, 420));
    expect(element._drag === null).to.equal(false);
    expect(element._drag.touch).to.equal(true);
    const point = over(pageLi(element, "p1"), 0.1, from);
    moveTo(point, opts);
    release(point, opts);
    await settle(element);
    expect(element.items.filter((i) => i.parent === null)[0].id).to.equal("p2");
  });

  it("keeps a touch drag going through the phone's long-press gesture", async () => {
    const opts = { pointerType: "touch", pointerId: 13 };
    const label = pageLi(element, "p2").querySelector(".label.shown");
    const from = at(label);
    const touchAt = (type, point) => {
      const touch = new Touch({
        identifier: 13,
        target: label,
        clientX: point.x,
        clientY: point.y,
      });
      const ended = type === "touchend" || type === "touchcancel";
      label.dispatchEvent(
        new TouchEvent(type, {
          bubbles: true,
          composed: true,
          cancelable: true,
          touches: ended ? [] : [touch],
          changedTouches: [touch],
        }),
      );
    };
    touchAt("touchstart", from);
    pointer(label, "pointerdown", from, opts);
    await new Promise((resolve) => setTimeout(resolve, 420));
    expect(element._drag.touch).to.equal(true);
    // the phone's long press: a contextmenu event and a cancelled pointer
    const menuEvent = new MouseEvent("contextmenu", {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    label.dispatchEvent(menuEvent);
    expect(menuEvent.defaultPrevented).to.equal(true);
    pointer(list(), "pointercancel", from, opts);
    expect(element._drag === null).to.equal(false);
    // the finger keeps moving the row and lifting it drops it
    const point = over(pageLi(element, "p1"), 0.1, from);
    touchAt("touchmove", point);
    await element.updateComplete;
    touchAt("touchend", point);
    await settle(element);
    expect(element._drag).to.equal(null);
    expect(element.items.filter((i) => i.parent === null)[0].id).to.equal("p2");
    // no actions menu opened along the way, even just after lifting
    const late = new MouseEvent("contextmenu", {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    pageLi(element, "p2").dispatchEvent(late);
    expect(late.defaultPrevented).to.equal(true);
    expect(
      [...element.shadowRoot.querySelectorAll(".actions-menu")].some(
        (m) => m.open,
      ),
    ).to.equal(false);
  });

  it("treats an early touch move as scrolling", async () => {
    const opts = { pointerType: "touch", pointerId: 12 };
    const li = pageLi(element, "p2");
    const from = at(li.querySelector(".label.shown"));
    pointer(li.querySelector(".label.shown"), "pointerdown", from, opts);
    moveTo({ x: from.x, y: from.y + 30 }, opts);
    expect(element._press).to.equal(null);
    await new Promise((resolve) => setTimeout(resolve, 420));
    expect(element._drag).to.equal(null);
  });

  it("folds an open parent when the mouse holds still", async () => {
    const li = pageLi(element, "p1");
    const from = at(li.querySelector(".label.shown"));
    pointer(li.querySelector(".label.shown"), "pointerdown", from);
    await new Promise((resolve) => setTimeout(resolve, 760));
    expect(element.items.find((i) => i.id === "p1").collapsed).to.equal(true);
    release(from);
    await settle(element);
    expect(pageLi(element, "c1") === null).to.equal(true);
    // a collapsed parent shows how many pages it holds
    expect(
      pageLi(element, "p1").querySelector(".hax-ui-pill").textContent.trim(),
    ).to.equal("2");
  });
});

describe("outline-designer store tools", () => {
  let element;
  let savedGetManifestItems;
  let savedFindItemAsObject;

  before(() => {
    savedGetManifestItems = store.getManifestItems;
    savedFindItemAsObject = store.findItemAsObject;
  });

  after(() => {
    delete store.getManifestItems;
    delete store.findItemAsObject;
    store.getManifestItems = savedGetManifestItems;
    store.findItemAsObject = savedFindItemAsObject;
  });

  beforeEach(async () => {
    // data and focus tests run without motion so each step lands at once
    element = await fixture(
      html`<outline-designer reduced-motion="reduce"></outline-designer>`,
    );
    element.items = makeItems();
    await settle(element);
  });

  it("returns only the placeholder target before the app is ready", () => {
    element.appReady = false;
    expect(element.getSiteItems()).to.deep.equal([
      { text: "Select target", value: null },
    ]);
  });

  it("builds a depth-prefixed target list from the site manifest", () => {
    element.appReady = true;
    store.getManifestItems = () => makeItems();
    const items = element.getSiteItems();
    expect(items.length).to.equal(5);
    expect(items[1].text).to.equal("- Page One");
    expect(items[2].text).to.equal("--- Child One");
    expect(items[3].value).to.equal("p2");
  });

  it("returns the current items from getData without store tools", async () => {
    const data = await element.getData();
    expect(data.items.length).to.equal(4);
    expect(data.items.map((i) => i.id)).to.include("p1");
  });

  it("renders the import controls and re-parents imports on getData", async () => {
    element.appReady = true;
    store.getManifestItems = () => makeItems();
    store.findItemAsObject = async () => ({
      id: "p1",
      parent: null,
      order: 5,
    });
    element.activeId = "p1";
    element.storeTools = true;
    await settle(element);
    // the import controls render with the site tree
    expect(
      element.shadowRoot.querySelector("#targetselector") === null,
    ).to.equal(false);
    expect(element.shadowRoot.querySelector("#itemselector") === null).to.equal(
      false,
    );
    // import as children of the target page
    element.shadowRoot.querySelector("#itemselector").value = "p1";
    element.shadowRoot.querySelector("#targetselector").value = "children";
    const childrenData = await element.getData();
    expect(childrenData.items.find((i) => i.id === "p1").parent).to.equal("p1");
    // the children branch re-parents the shared item objects themselves,
    // so restore top-level parents before exercising the other branches
    ["p1", "p2", "p3"].forEach((id) => {
      element.items.find((i) => i.id === id).parent = null;
    });
    // import below the target page
    element.shadowRoot.querySelector("#targetselector").value = "below";
    const belowData = await element.getData();
    // each import captures its own position before the await, so the
    // imports land at sequential sibling orders below the target page
    expect(belowData.items.find((i) => i.id === "p1").order).to.equal(6);
    expect(belowData.items.find((i) => i.id === "p2").order).to.equal(7);
    expect(belowData.items.find((i) => i.id === "p3").order).to.equal(8);
    // import above the target page
    element.shadowRoot.querySelector("#targetselector").value = "above";
    const aboveData = await element.getData();
    // the above branch mirrors the same sequential positions (first
    // import closest to the target page)
    expect(aboveData.items.find((i) => i.id === "p1").order).to.equal(4);
    expect(aboveData.items.find((i) => i.id === "p2").order).to.equal(3);
    expect(aboveData.items.find((i) => i.id === "p3").order).to.equal(2);
  });
});

describe("outline-designer updated branches", () => {
  let element;

  beforeEach(async () => {
    // data and focus tests run without motion so each step lands at once
    element = await fixture(
      html`<outline-designer reduced-motion="reduce"></outline-designer>`,
    );
    element.items = makeItems();
    await settle(element);
  });

  it("handles all fidelity settings", async () => {
    element.fidelity = "low";
    await element.updateComplete;
    expect(element.fidelity).to.equal("low");
    element.fidelity = "medium";
    await element.updateComplete;
    expect(element.fidelity).to.equal("medium");
    element.fidelity = "high";
    await element.updateComplete;
    expect(element.fidelity).to.equal("high");
  });

  it("moves the active-preview highlight between nodes", async () => {
    const first = pageLi(element, "p1");
    const second = pageLi(element, "p2");
    element.activePreview = first;
    await element.updateComplete;
    expect(first.classList.contains("active-preview-item")).to.equal(true);
    element.activePreview = second;
    await element.updateComplete;
    expect(first.classList.contains("active-preview-item")).to.equal(false);
    expect(second.classList.contains("active-preview-item")).to.equal(true);
  });

  it("toggles the actions menu open and closed", async () => {
    const li = pageLi(element, "p1");
    const menuButton = li.querySelector(".actions-menu-button");
    element._toggleActionsMenu(fakeEventFrom(menuButton), 0);
    const menu = li.querySelector(".actions-menu");
    expect(menu.open).to.equal(true);
    // an action through the menu closes it again
    const menuAction = li.querySelector(
      'simple-toolbar-button[value="edit-title"]',
    );
    element._handleMenuAction(fakeEventFrom(menuAction), 0, "edit-title");
    expect(menu.open).to.equal(false);
    // the edit title action armed the inline title editor
    expect(
      li.querySelector(".label-edit").getAttribute("contenteditable"),
    ).to.equal("true");
    // a plain operation routes through itemOp
    const upAction = li.querySelector('simple-toolbar-button[value="up"]');
    const before = element.items.findIndex((i) => i.id === "p1");
    element._handleMenuAction(fakeEventFrom(upAction), before, "up");
    await settle(element);
    expect(element.items.findIndex((i) => i.id === "p1")).to.equal(0);
    // edit-title on a locked item does nothing
    const lockedLi = pageLi(element, "p3");
    const lockedButton = lockedLi.querySelector(".actions-menu-button");
    element._toggleActionsMenu(fakeEventFrom(lockedButton), 3);
    const lockedLabel = lockedLi.querySelector(".label-edit");
    element._handleMenuAction(fakeEventFrom(lockedButton), 3, "edit-title");
    expect(lockedLabel.getAttribute("contenteditable") === null).to.equal(true);
  });
});
