import { fixture, expect, html } from "@open-wc/testing";
import "../outline-designer.js";

// the page actions menu, driven the way people use it (open the menu,
// press an item), and touch input: hold to pick up, the grip, a second
// finger, cancelled touches and the phone's long press. Every operation
// is checked against the data getData() would save.
function makeItems() {
  const page = (id, title, parent, order, indent, extra = {}) => ({
    id,
    title,
    slug: id,
    location: `pages/${id}/index.html`,
    order,
    parent,
    indent,
    contents: "<h2>Heading</h2><p>Text</p>",
    metadata: { locked: false },
    ...extra,
  });
  return [
    page("p1", "Page One", null, 0, 0),
    page("c1", "Child One", "p1", 0, 1),
    page("c2", "Child Two", "p1", 1, 1),
    page("p2", "Page Two", null, 1, 0),
    page("p3", "Locked Page", null, 2, 0, { metadata: { locked: true } }),
    page("p4", "Page Four", null, 3, 0, { contents: "" }),
  ];
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const settle = async (element, ms = 60) => {
  await element.updateComplete;
  await wait(ms);
  await element.updateComplete;
};
const pageLi = (element, id) =>
  element.shadowRoot.querySelector(`li[data-item-id="${id}"]`);
const ids = (element) => element.items.map((i) => i.id);
const item = (element, id) => element.items.find((i) => i.id === id);
const keydown = (target, key, opts = {}) =>
  target.dispatchEvent(
    new KeyboardEvent("keydown", {
      key,
      bubbles: true,
      composed: true,
      cancelable: true,
      ...opts,
    }),
  );

describe("outline-designer page actions menu", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(
      html`<outline-designer reduced-motion="reduce"></outline-designer>`,
    );
    element.items = makeItems();
    await settle(element);
  });

  const menuOf = (id) => pageLi(element, id).querySelector(".actions-menu");
  const menuItem = (id, value) =>
    pageLi(element, id).querySelector(
      `.actions-menu simple-toolbar-button[value="${value}"]`,
    );
  // open the row's menu with its ⋯ button, then press an item
  const choose = async (id, value) => {
    pageLi(element, id).querySelector(".actions-menu-button").click();
    await element.updateComplete;
    expect(menuOf(id).open).to.equal(true);
    // simple-toolbar-button overrides click(); press its real button
    menuItem(id, value).shadowRoot.querySelector("button").click();
    await settle(element);
  };

  it("lists every action with a visible label", () => {
    const values = [
      ...pageLi(element, "p2").querySelectorAll(
        ".actions-menu simple-toolbar-button",
      ),
    ].map((b) => b.getAttribute("value"));
    expect(values).to.deep.equal([
      "up",
      "down",
      "in",
      "out",
      "edit-title",
      "add",
      "add-child",
      "content",
      "duplicate",
      "goto",
      "lock",
      "delete",
    ]);
    pageLi(element, "p2")
      .querySelectorAll(".actions-menu simple-toolbar-button")
      .forEach((b) => {
        expect(b.getAttribute("label").length > 0).to.equal(true);
        expect(b.hasAttribute("show-text-label")).to.equal(true);
      });
  });

  it("moves a page up and down from the menu and closes it", async () => {
    await choose("p2", "up");
    expect(menuOf("p2").open).to.equal(false);
    expect(ids(element).indexOf("p2")).to.equal(0);
    expect(element.liveRegionText).to.equal("Moved Page Two up");
    await choose("p2", "down");
    expect(ids(element)).to.deep.equal(["p1", "c1", "c2", "p2", "p3", "p4"]);
    expect(element.liveRegionText).to.equal("Moved Page Two down");
  });

  it("indents into the page above and outdents back from the menu", async () => {
    await choose("p2", "in");
    expect(item(element, "p2").parent).to.equal("p1");
    expect(item(element, "p2").indent).to.equal(1);
    // the last child of the page above, after its existing children
    expect(item(element, "p2").order).to.equal(2);
    expect(element.liveRegionText).to.equal("Page Two is now inside Page One");
    await choose("p2", "out");
    expect(item(element, "p2").parent).to.equal(null);
    expect(item(element, "p2").indent).to.equal(0);
    expect(element.liveRegionText).to.equal("Page Two moved out a level");
  });

  it("says why a move from the menu is not possible", async () => {
    await choose("p1", "up");
    expect(element.liveRegionText).to.equal(
      "Page One is already first in its group.",
    );
    await choose("p1", "out");
    expect(element.liveRegionText).to.equal(
      "Page One is already at the top level.",
    );
    await choose("c1", "in");
    expect(element.liveRegionText).to.equal(
      "There is no page above Child One at its level to put it inside.",
    );
    expect(ids(element)).to.deep.equal(["p1", "c1", "c2", "p2", "p3", "p4"]);
  });

  it("adds a page after this one and a sub-page inside it", async () => {
    await choose("p2", "add");
    const added = element.items.find((i) => i.new);
    expect(added.parent).to.equal(null);
    expect(ids(element).indexOf(added.id)).to.equal(
      ids(element).indexOf("p2") + 1,
    );
    // a sub-page goes last under its parent and opens a folded parent
    item(element, "p1").collapsed = true;
    element.requestUpdate();
    await settle(element);
    await choose("p1", "add-child");
    const child = element.items.find((i) => i.new && i.parent === "p1");
    expect(child.indent).to.equal(1);
    expect(child.order).to.equal(2);
    expect(item(element, "p1").collapsed).to.equal(false);
    expect(ids(element).indexOf(child.id)).to.equal(
      ids(element).indexOf("c2") + 1,
    );
  });

  it("starts naming from the menu, but never on a locked page", async () => {
    await choose("p2", "edit-title");
    expect(
      pageLi(element, "p2")
        .querySelector(".label-edit")
        .getAttribute("contenteditable"),
    ).to.equal("true");
    keydown(pageLi(element, "p2").querySelector(".label-edit"), "Escape");
    await settle(element);
    expect(menuItem("p3", "edit-title").hasAttribute("disabled")).to.equal(
      true,
    );
  });

  it("duplicates a page with its sub-pages", async () => {
    await choose("p1", "duplicate");
    const copies = element.items.filter(
      (i) => !["p1", "c1", "c2", "p2", "p3", "p4"].includes(i.id),
    );
    expect(copies.length).to.equal(3);
    expect(copies.every((c) => c.new || c.duplicate)).to.equal(true);
    // the copied parent's children point at the copy, not the original
    const copyParent = copies.find((c) => c.parent === null);
    expect(copies.filter((c) => c.parent === copyParent.id).length).to.equal(2);
  });

  it("marks a page and its sub-pages for deletion and restores them", async () => {
    await choose("p1", "delete");
    expect(["p1", "c1", "c2"].every((id) => item(element, id).delete)).to.equal(
      true,
    );
    // the menu now offers Restore
    expect(menuItem("p1", "delete").getAttribute("label")).to.equal("Restore");
    expect(menuItem("p1", "delete").getAttribute("icon")).to.equal(
      "icons:restore",
    );
    const data = await element.getData();
    expect(data.items.filter((i) => i.delete).length).to.equal(3);
    await choose("p1", "delete");
    expect(element.items.some((i) => i.delete)).to.equal(false);
  });

  it("locks a page and disables everything but unlock and go to", async () => {
    await choose("p2", "lock");
    expect(item(element, "p2").metadata.locked).to.equal(true);
    expect(menuItem("p2", "lock").getAttribute("label")).to.equal("Unlock");
    [
      "up",
      "down",
      "in",
      "out",
      "edit-title",
      "add",
      "add-child",
      "content",
      "duplicate",
      "delete",
    ].forEach((value) => {
      expect(menuItem("p2", value).hasAttribute("disabled")).to.equal(true);
    });
    expect(menuItem("p2", "goto").hasAttribute("disabled")).to.equal(false);
    expect(menuItem("p2", "lock").hasAttribute("disabled")).to.equal(false);
    await choose("p2", "lock");
    expect(item(element, "p2").metadata.locked).to.equal(false);
  });

  it("asks to go to a page", async () => {
    let asked = null;
    element.addEventListener("outline-designer-request-navigate", (e) => {
      asked = e.detail;
      e.preventDefault();
    });
    await choose("p2", "goto");
    expect(asked === null).to.equal(false);
  });

  it("offers content structure only for pages with content", async () => {
    expect(menuItem("p2", "content") === null).to.equal(false);
    expect(menuItem("p4", "content")).to.equal(null);
    element.hideContentOps = true;
    await settle(element);
    expect(menuItem("p2", "content")).to.equal(null);
  });

  it("returns focus to the row when the menu closes", async () => {
    pageLi(element, "p2").focus();
    keydown(pageLi(element, "p2"), "F10", { shiftKey: true });
    await settle(element);
    expect(menuOf("p2").open).to.equal(true);
    menuOf("p2").close();
    await settle(element);
    expect(element.shadowRoot.activeElement === pageLi(element, "p2")).to.equal(
      true,
    );
    // the context menu key does the same
    keydown(pageLi(element, "p2"), "ContextMenu");
    await settle(element);
    expect(menuOf("p2").open).to.equal(true);
    menuOf("p2").close();
  });

  it("only flags what a menu operation changed", async () => {
    await choose("p2", "up");
    const data = await element.getData();
    const flagged = data.items.filter((i) => i.modified).map((i) => i.id);
    // p2 and the page it traded places with
    expect(flagged.includes("p2")).to.equal(true);
    expect(flagged.includes("c1")).to.equal(false);
    expect(flagged.includes("p3")).to.equal(false);
    expect(data.items.some((i) => i.new || i.delete)).to.equal(false);
  });
});

describe("outline-designer touch", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(
      html`<outline-designer reduced-motion="reduce"></outline-designer>`,
    );
    element.items = makeItems();
    await settle(element);
  });

  const list = () => element.shadowRoot.querySelector("#list");
  const at = (el, fy = 0.5) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + Math.min(40, r.width / 2), y: r.top + r.height * fy };
  };
  const pointer = (target, type, point, pointerId = 21) =>
    target.dispatchEvent(
      new PointerEvent(type, {
        bubbles: true,
        composed: true,
        cancelable: true,
        clientX: point.x,
        clientY: point.y,
        pointerId,
        pointerType: "touch",
        isPrimary: pointerId === 21,
        button: 0,
        buttons: type === "pointerup" ? 0 : 1,
      }),
    );
  const touch = (target, type, point, id = 21) => {
    const t = new Touch({
      identifier: id,
      target,
      clientX: point.x,
      clientY: point.y,
    });
    const ended = type === "touchend" || type === "touchcancel";
    target.dispatchEvent(
      new TouchEvent(type, {
        bubbles: true,
        composed: true,
        cancelable: true,
        touches: ended ? [] : [t],
        changedTouches: [t],
      }),
    );
  };
  const label = (id) => pageLi(element, id).querySelector(".label.shown");
  // a finger down on a title, as a phone sends it
  const fingerDown = (id) => {
    const from = at(label(id));
    touch(label(id), "touchstart", from);
    pointer(label(id), "pointerdown", from);
    return from;
  };
  const fingerUp = (id, point) => {
    pointer(list(), "pointerup", point);
    touch(label(id), "touchend", point);
  };

  it("shows the hold filling, then picks the row up", async () => {
    fingerDown("p2");
    await element.updateComplete;
    const li = pageLi(element, "p2");
    expect(li.classList.contains("pressing")).to.equal(true);
    expect(li.style.getPropertyValue("--outline-designer-press-ms")).to.equal(
      "350ms",
    );
    await wait(420);
    await element.updateComplete;
    expect(element._drag.touch).to.equal(true);
    expect(pageLi(element, "p2").classList.contains("pressing")).to.equal(
      false,
    );
    // the carried title floats above the finger, where it stays visible
    const ghost = element.shadowRoot.querySelector(".drag-ghost");
    expect(ghost.hidden).to.equal(false);
    expect(ghost.textContent.trim()).to.equal("Page Two");
    expect(ghost.getAttribute("style")).to.contain(`${element._drag.y - 48}px`);
    fingerUp("p2", at(label("p2")));
    await settle(element);
  });

  it("lifting the finger before the hold finishes is just a tap", async () => {
    const from = fingerDown("p2");
    await wait(150);
    fingerUp("p2", from);
    await wait(300);
    await element.updateComplete;
    expect(element._drag).to.equal(null);
    expect(element._press).to.equal(null);
    expect(pageLi(element, "p2").classList.contains("pressing")).to.equal(
      false,
    );
  });

  it("picks a row up straight away from its grip", async () => {
    const grip = pageLi(element, "p2").querySelector(".grip");
    const from = at(grip);
    pointer(grip, "pointerdown", from);
    // no hold: moving the grip past the threshold starts the drag
    pointer(list(), "pointermove", { x: from.x, y: from.y - 10 });
    expect(element._drag === null).to.equal(false);
    const target = at(label("p1"), 0.1);
    pointer(list(), "pointermove", { x: from.x, y: target.y });
    pointer(list(), "pointerup", { x: from.x, y: target.y });
    await settle(element);
    expect(ids(element)[0]).to.equal("p2");
  });

  it("never picks up a locked page", async () => {
    fingerDown("p3");
    await wait(420);
    expect(element._drag).to.equal(null);
    fingerUp("p3", at(label("p3")));
  });

  it("puts the row back when held and released in place", async () => {
    const before = JSON.stringify(element.items);
    const from = fingerDown("p2");
    await wait(420);
    expect(element._drag === null).to.equal(false);
    fingerUp("p2", from);
    await settle(element);
    expect(element._drag).to.equal(null);
    expect(JSON.stringify(element.items)).to.equal(before);
  });

  it("ignores a second finger while carrying a row", async () => {
    const from = fingerDown("p2");
    await wait(420);
    // a second finger lands and moves somewhere else
    const other = at(label("p4"));
    pointer(label("p4"), "pointerdown", other, 22);
    pointer(list(), "pointermove", { x: other.x, y: other.y + 40 }, 22);
    pointer(list(), "pointerup", other, 22);
    expect(element._drag === null).to.equal(false);
    expect(element._drag.id).to.equal("p2");
    // the first finger still drops it
    const target = at(label("p1"), 0.1);
    pointer(list(), "pointermove", { x: from.x, y: target.y });
    fingerUp("p2", { x: from.x, y: target.y });
    await settle(element);
    expect(ids(element)[0]).to.equal("p2");
  });

  it("cancels without changes when the phone cancels the touch", async () => {
    const before = JSON.stringify(element.items);
    const from = fingerDown("p2");
    await wait(420);
    pointer(list(), "pointermove", { x: from.x, y: at(label("p1"), 0.1).y });
    touch(label("p2"), "touchcancel", from);
    await settle(element);
    expect(element._drag).to.equal(null);
    expect(JSON.stringify(element.items)).to.equal(before);
    expect(element.liveRegionText).to.equal("Move cancelled");
  });

  it("keeps the page from scrolling while a row is carried", async () => {
    const from = fingerDown("p2");
    await wait(420);
    const t = new Touch({
      identifier: 21,
      target: label("p2"),
      clientX: from.x,
      clientY: from.y + 20,
    });
    const move = new TouchEvent("touchmove", {
      bubbles: true,
      composed: true,
      cancelable: true,
      touches: [t],
      changedTouches: [t],
    });
    label("p2").dispatchEvent(move);
    expect(move.defaultPrevented).to.equal(true);
    fingerUp("p2", from);
    await settle(element);
    // and lets it scroll again afterwards
    const t2 = new Touch({
      identifier: 23,
      target: label("p2"),
      clientX: from.x,
      clientY: from.y,
    });
    const scroll = new TouchEvent("touchmove", {
      bubbles: true,
      composed: true,
      cancelable: true,
      touches: [t2],
      changedTouches: [t2],
    });
    label("p2").dispatchEvent(scroll);
    expect(scroll.defaultPrevented).to.equal(false);
  });

  it("blocks text selection while a row is held", async () => {
    fingerDown("p2");
    const select = new Event("selectstart", {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    label("p2").dispatchEvent(select);
    expect(select.defaultPrevented).to.equal(true);
    fingerUp("p2", at(label("p2")));
    await settle(element);
  });

  it("opens the menu on right click, but not from a touch hold", async () => {
    const menuOf = (id) => pageLi(element, id).querySelector(".actions-menu");
    // a mouse right click opens the actions menu
    const right = new MouseEvent("contextmenu", {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    label("p4").dispatchEvent(right);
    await element.updateComplete;
    expect(menuOf("p4").open).to.equal(true);
    menuOf("p4").close();
    await settle(element);
    // the same event from a phone's long press is swallowed
    const from = fingerDown("p4");
    const hold = new MouseEvent("contextmenu", {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    label("p4").dispatchEvent(hold);
    expect(hold.defaultPrevented).to.equal(true);
    fingerUp("p4", from);
    await element.updateComplete;
    expect(menuOf("p4").open).to.equal(false);
  });

  it("says what is being carried and where it landed", async () => {
    const from = fingerDown("p1");
    await wait(420);
    expect(element.liveRegionText).to.equal("Moving Page One with 2 sub-pages");
    const target = at(label("p4"), 0.9);
    pointer(list(), "pointermove", { x: from.x, y: target.y });
    await element.updateComplete;
    expect(element._statusText.length > 0).to.equal(true);
    fingerUp("p1", { x: from.x, y: target.y });
    await settle(element);
    expect(ids(element).slice(-3)).to.deep.equal(["p1", "c1", "c2"]);
    expect(item(element, "c1").parent).to.equal("p1");
  });
});
