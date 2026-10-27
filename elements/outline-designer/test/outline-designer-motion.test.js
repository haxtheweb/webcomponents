import { fixture, expect, html } from "@open-wc/testing";
import "../outline-designer.js";

// showing what changed: menu, keyboard, touch and drop changes go through
// _withMotion, which animates them (a scoped view transition where the
// browser has one), highlights where the page landed, lights up the group
// it joined and offers undo. These run with full motion on.
function makeItems() {
  const page = (id, title, parent, order, indent) => ({
    id,
    title,
    slug: id,
    location: `pages/${id}/index.html`,
    order,
    parent,
    indent,
    contents: "<p></p>",
    metadata: { locked: false },
  });
  return [
    page("p1", "Page One", null, 0, 0),
    page("c1", "Child One", "p1", 0, 1),
    page("c2", "Child Two", "p1", 1, 1),
    page("p2", "Page Two", null, 1, 0),
    page("p3", "Page Three", null, 2, 0),
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
const snapshot = (element) =>
  JSON.stringify(element.items.map((i) => ({ ...i })));

describe("outline-designer showing what changed", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(
      html`<outline-designer reduced-motion="full"></outline-designer>`,
    );
    element.items = makeItems();
    await settle(element);
  });

  it("slides a keyboard move, highlights its group and offers undo", async () => {
    const before = snapshot(element);
    keydown(pageLi(element, "p2"), "ArrowDown", { altKey: true });
    // the transition names the rows while it runs
    await settle(element, 20);
    if (typeof HTMLElement.prototype.startViewTransition === "function") {
      expect(element._vtActive).to.equal(true);
      expect(pageLi(element, "p2").style.viewTransitionName).to.equal(
        "od-r-p2",
      );
    }
    await settle(element, 600);
    expect(element._vtActive).to.equal(false);
    expect(element.items.map((i) => i.id)).to.deep.equal([
      "p1",
      "c1",
      "c2",
      "p3",
      "p2",
    ]);
    // keyboard: the group it is in lights up, focus stays on it
    expect(element._modality()).to.equal("keyboard");
    expect(element._flashGroup).to.equal("root|0");
    expect(element.shadowRoot.activeElement === pageLi(element, "p2")).to.equal(
      true,
    );
    // the status line carries the change and an Undo button
    expect(element._undo.message).to.equal("Moved Page Two down");
    const undo = element.shadowRoot.querySelector(".undo-btn");
    expect(undo === null).to.equal(false);
    // Ctrl+Z puts every item back exactly as it was
    keydown(pageLi(element, "p2"), "z", { ctrlKey: true });
    await settle(element, 600);
    expect(snapshot(element)).to.equal(before);
    expect(element._undo).to.equal(null);
  });

  it("keeps mouse feedback light", async () => {
    element.motionProfile = "mouse";
    await element.updateComplete;
    expect(element.getAttribute("data-modality")).to.equal("mouse");
    await element._moveByKeyboard(
      element.items.findIndex((i) => i.id === "p2"),
      "up",
      { fromMenu: true },
    );
    await settle(element);
    expect(element.items.findIndex((i) => i.id === "p2")).to.equal(0);
    // no group flash and no move buttons for the mouse; undo still offered
    expect(element._flashGroup).to.equal(null);
    expect(element._nudgeId).to.equal(null);
    expect(element._undo.message).to.equal("Moved Page Two up");
  });

  it("leaves move buttons on the row after a touch menu move", async () => {
    element.motionProfile = "touch";
    await element.updateComplete;
    await element._moveByKeyboard(
      element.items.findIndex((i) => i.id === "p2"),
      "up",
      { fromMenu: true },
    );
    await settle(element);
    expect(element._nudgeId).to.equal("p2");
    const li = pageLi(element, "p2");
    expect(li.classList.contains("nudging")).to.equal(true);
    const buttons = li.querySelectorAll(".nudge .nudge-btn");
    expect(buttons.length).to.equal(5);
    // up is unavailable at the top; down moves it back
    expect(buttons[0].disabled).to.equal(true);
    buttons[1].click();
    await settle(element, 700);
    expect(element.items.findIndex((i) => i.id === "p2")).to.equal(3);
    expect(element._nudgeId).to.equal("p2");
    // Done puts them away
    pageLi(element, "p2").querySelector(".nudge .done").click();
    await settle(element);
    expect(element._nudgeId).to.equal(null);
  });

  it("grows a new page in and starts naming it", async () => {
    element.motionProfile = "keyboard";
    await element._addAfterAndEdit(
      element.items.findIndex((i) => i.id === "p3"),
    );
    await settle(element);
    const added = element.items.find((i) => i.new);
    expect(added === undefined).to.equal(false);
    expect(
      pageLi(element, added.id)
        .querySelector(".label-edit")
        .getAttribute("contenteditable"),
    ).to.equal("true");
    expect(element._undo.message).to.equal("Added a page");
    // undo takes the new page away again
    element.undo();
    await settle(element, 600);
    expect(element.items.some((i) => i.new)).to.equal(false);
  });

  it("flips an added page in and tells what flipped", async () => {
    element.motionProfile = "touch";
    const before = new Map(element._visibleItems().map((i) => [i.id, false]));
    // adding changes the rows, so it animates them directly (Chromium
    // aborts a scoped view transition when rows come or go)
    await element._addTop();
    const fresh = element.items.find((i) => i.new);
    const flipping = pageLi(element, fresh.id)
      .getAnimations()
      .some((a) => a.effect.getKeyframes()[0].transform.includes("rotateX"));
    expect(flipping).to.equal(true);
    await settle(element);
    const added = element.items.find((i) => i.new);
    expect(element._whatFlipped(before).appeared).to.deep.equal([added.id]);
    expect(element.items.indexOf(added)).to.equal(0);
    expect(element._undo.message).to.equal("Added a page");
    // rules are gone once it has played
    if (element._flipSheet) {
      expect(element._flipSheet.cssRules.length).to.equal(0);
    }
    expect(element._vtPlain.size).to.equal(0);
  });

  it("turns a deleted page and its sub-pages over in place", async () => {
    element.motionProfile = "keyboard";
    const before = new Map(element._visibleItems().map((i) => [i.id, false]));
    await element._toggleDelete(element.items.findIndex((i) => i.id === "p1"));
    await settle(element);
    expect(element._whatFlipped(before).flipped).to.deep.equal([
      "p1",
      "c1",
      "c2",
    ]);
    expect(element._undo.message).to.equal("Page One will be deleted on save");
    // undo turns them back
    element.undo();
    await settle(element, 900);
    expect(element.items.some((i) => i.delete)).to.equal(false);
  });

  it("flips hidden deletes away, moves focus on and can undo", async () => {
    element.motionProfile = "keyboard";
    element.hideDelete = true;
    await settle(element);
    await element._toggleDelete(element.items.findIndex((i) => i.id === "p1"));
    await settle(element);
    const gone = pageLi(element, "p1");
    expect(gone === null || gone.hidden).to.equal(true);
    // the row that took its place has focus
    expect(element.shadowRoot.activeElement === pageLi(element, "p2")).to.equal(
      true,
    );
    expect(element._undo.message).to.equal("Page One will be deleted on save");
    element.undo();
    await settle(element, 900);
    expect(pageLi(element, "p1").hidden).to.equal(false);
    expect(element.items.some((i) => i.delete)).to.equal(false);
  });

  it("deletes the selection from the toolbar with one undo", async () => {
    element.motionProfile = "mouse";
    element.selectedPages = ["p2", "p3"];
    await element._deleteSelectedShown();
    await settle(element);
    expect(
      element.items.filter((i) => i.delete).map((i) => i.id),
    ).to.deep.equal(["p2", "p3"]);
    expect(element._undo.message).to.equal("2 pages will be deleted on save");
    element.undo();
    await settle(element, 700);
    expect(element.items.some((i) => i.delete)).to.equal(false);
  });

  it("does not move anything with reduced motion", async () => {
    element.reducedMotion = "reduce";
    let named = false;
    const watch = setInterval(() => {
      named = named || element._vtActive;
    }, 5);
    await element._moveByKeyboard(
      element.items.findIndex((i) => i.id === "p2"),
      "up",
    );
    clearInterval(watch);
    expect(named).to.equal(false);
    expect(element.items.findIndex((i) => i.id === "p2")).to.equal(0);
    // still says what happened and offers undo
    expect(element._undo.message).to.equal("Moved Page Two up");
  });

  it("does nothing visible when a move is not possible", async () => {
    element.motionProfile = "keyboard";
    await element._moveByKeyboard(
      element.items.findIndex((i) => i.id === "p1"),
      "up",
    );
    await settle(element);
    expect(element._undo).to.equal(null);
    expect(element.liveRegionText).to.equal(
      "Page One is already first in its group.",
    );
  });
});

// the menu, touch move buttons and undo with motion on: what they do to
// the data, what they announce and how they read to assistive technology
describe("outline-designer showing what changed: menu, touch and access", () => {
  let element;
  // everything announced; the live region clears itself a second later,
  // so reading it at one moment is timing-dependent
  let said;

  beforeEach(async () => {
    element = await fixture(
      html`<outline-designer reduced-motion="full"></outline-designer>`,
    );
    element.items = makeItems();
    said = [];
    const announce = element.announceAction.bind(element);
    element.announceAction = (text) => {
      said.push(text);
      return announce(text);
    };
    await settle(element);
  });

  const menuItem = (id, value) =>
    pageLi(element, id).querySelector(
      `.actions-menu simple-toolbar-button[value="${value}"]`,
    );
  // open the row's menu and press an item's real button
  const choose = async (id, value, ms = 900) => {
    pageLi(element, id).querySelector(".actions-menu-button").click();
    await element.updateComplete;
    menuItem(id, value).shadowRoot.querySelector("button").click();
    await settle(element, ms);
  };
  const undoButton = () => element.shadowRoot.querySelector(".undo-btn");

  it("adds from the menu: flips in, starts naming, can be undone", async () => {
    element.motionProfile = "touch";
    const before = snapshot(element);
    await choose("p2", "add");
    const added = element.items.find((i) => i.new);
    expect(added.parent).to.equal(null);
    expect(element.items.indexOf(added)).to.equal(
      element.items.findIndex((i) => i.id === "p2") + 1,
    );
    expect(
      pageLi(element, added.id)
        .querySelector(".label-edit")
        .getAttribute("contenteditable"),
    ).to.equal("true");
    expect(element._undo.message).to.equal("Added a page");
    keydown(pageLi(element, added.id).querySelector(".label-edit"), "Escape");
    await settle(element);
    undoButton().click();
    await settle(element, 900);
    expect(snapshot(element)).to.equal(before);
  });

  it("adds a sub-page from the menu and can undo it", async () => {
    element.motionProfile = "keyboard";
    await choose("p2", "add-child");
    const child = element.items.find((i) => i.new);
    expect(child.parent).to.equal("p2");
    expect(element._undo.message).to.equal("Added a sub-page under Page Two");
  });

  it("duplicates from the menu and highlights every copy", async () => {
    element.motionProfile = "keyboard";
    let landed = null;
    const show = element._showLanded.bind(element);
    element._showLanded = (list, ...rest) => {
      landed = list;
      return show(list, ...rest);
    };
    await choose("p1", "duplicate");
    expect(landed.length).to.equal(3);
    expect(element._undo.message).to.equal("Item duplicated");
    element.undo();
    await settle(element, 900);
    expect(element.items.length).to.equal(5);
  });

  it("deletes and locks from the menu with undo for each", async () => {
    element.motionProfile = "mouse";
    await choose("p2", "delete");
    expect(element.items.find((i) => i.id === "p2").delete).to.equal(true);
    expect(element._undo.message).to.equal("Page Two will be deleted on save");
    element.undo();
    await settle(element, 700);
    expect(element.items.find((i) => i.id === "p2").delete).to.equal(undefined);
    await choose("p2", "lock");
    expect(element.items.find((i) => i.id === "p2").metadata.locked).to.equal(
      true,
    );
    expect(element._undo.message).to.equal("Locked Page Two");
    element.undo();
    await settle(element, 700);
    expect(element.items.find((i) => i.id === "p2").metadata.locked).to.equal(
      false,
    );
  });

  it("labels the touch move buttons and keeps them usable", async () => {
    element.motionProfile = "touch";
    await choose("c2", "up");
    expect(element._nudgeId).to.equal("c2");
    const group = pageLi(element, "c2").querySelector(".nudge");
    expect(group.getAttribute("role")).to.equal("group");
    expect(group.getAttribute("aria-label")).to.equal("Move Child Two");
    const buttons = [...group.querySelectorAll("button")];
    expect(buttons.map((b) => b.getAttribute("aria-label"))).to.deep.equal([
      "Move up",
      "Move down",
      "Outdent",
      "Indent",
      "Done moving",
    ]);
    buttons.forEach((b) => {
      expect(b.getAttribute("title")).to.equal(b.getAttribute("aria-label"));
      // reachable, unlike the row's hover buttons
      expect(b.getAttribute("tabindex")).to.equal(null);
    });
    // first in its group now: up and indent are unavailable, out is not
    expect(buttons[0].disabled).to.equal(true);
    expect(buttons[3].disabled).to.equal(true);
    expect(buttons[2].disabled).to.equal(false);
    // outdent from the buttons, then Done returns focus to the row
    buttons[2].click();
    await settle(element, 900);
    expect(said[said.length - 1]).to.equal("Child Two moved out a level");
    expect(element.items.find((i) => i.id === "c2").parent).to.equal(null);
    pageLi(element, "c2").querySelector(".nudge .done").click();
    await settle(element);
    expect(element._nudgeId).to.equal(null);
    expect(element.shadowRoot.activeElement === pageLi(element, "c2")).to.equal(
      true,
    );
  });

  it("passes axe with move buttons and an undo offer showing", async () => {
    element.motionProfile = "touch";
    await choose("p2", "up");
    expect(element._nudgeId).to.equal("p2");
    expect(undoButton() === null).to.equal(false);
    await expect(element).shadowDom.to.be.accessible();
  });

  it("names the undo button after the change and announces the undo", async () => {
    element.motionProfile = "keyboard";
    await choose("p2", "up");
    const button = undoButton();
    expect(button.textContent.trim()).to.equal("Undo");
    // the visible word starts the name, then what it undoes
    expect(button.getAttribute("aria-label")).to.equal(
      "Undo: Moved Page Two up",
    );
    button.click();
    await settle(element, 700);
    expect(said[said.length - 1]).to.equal("Undid: Moved Page Two up");
    expect(undoButton()).to.equal(null);
  });

  it("still announces and offers undo with reduced motion", async () => {
    element.reducedMotion = "reduce";
    await choose("p2", "add", 120);
    expect(said[said.length - 1]).to.equal("Added a page");
    expect(element._undo.message).to.equal("Added a page");
    const added = element.items.find((i) => i.new);
    const moving = pageLi(element, added.id)
      .getAnimations()
      .filter((a) => {
        const frames = a.effect.getKeyframes();
        return frames.some((f) => f.transform && f.transform !== "none");
      });
    expect(moving.length).to.equal(0);
  });
});
