import { fixture, expect, html, oneEvent } from "@open-wc/testing";

import "../lib/hax-map.js";
import { HaxMap } from "../lib/hax-map.js";
import { HAXStore } from "../lib/hax-store.js";

describe("hax-map", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<hax-map></hax-map>`);
    await el.updateComplete;
  });

  it("instantiates", () => {
    expect(el.tagName.toLowerCase()).to.equal("hax-map");
    expect(el.elementList).to.deep.equal([]);
    expect(el.dark).to.equal(false);
  });

  it("has static tag", () => {
    expect(HaxMap.tag).to.equal("hax-map");
  });

  describe("page outline", () => {
    let body;
    let originalBody;
    const page = `
      <page-break title="Home"></page-break>
      <p id="intro">Intro</p>
      <h2 id="a">Why</h2>
      <p id="a1">Waves</p>
      <ul id="list"><li>Crest</li><li>Trough</li></ul>
      <h2 id="b">Try</h2>
      <p id="b1">Drop</p>`;
    beforeEach(async () => {
      originalBody = HAXStore.activeHaxBody;
      body = globalThis.document.createElement("div");
      body.innerHTML = page;
      body.haxDeleteNode = (n) => n.remove();
      globalThis.document.body.appendChild(body);
      HAXStore.activeHaxBody = body;
      el.updateHAXMap();
      await el.updateComplete;
    });
    afterEach(() => {
      HAXStore.activeHaxBody = originalBody;
      body.remove();
    });
    const rowFor = (id) =>
      el.shadowRoot.querySelector(
        `li[data-index="${el.elementList.findIndex((r) => r.node.id === id)}"]`,
      );

    it("draws a tree row per block, list items included", () => {
      const tree = el.shadowRoot.querySelector('ul[role="tree"]');
      expect(tree.getAttribute("aria-multiselectable")).to.equal("true");
      expect(tree.querySelectorAll('li[role="treeitem"]').length).to.equal(9);
      expect(rowFor("a1").getAttribute("aria-level")).to.equal("2");
    });

    it("gives every block and list item but the page break a checkbox", () => {
      const boxes = el.shadowRoot.querySelectorAll("li input[type=checkbox]");
      // intro, a, a1, list, its two items, b, b1 (the page break has none)
      expect(boxes.length).to.equal(8);
      // a row that can't be selected leaves aria-selected off (an empty
      // value is not a valid state)
      const rows = Array.from(
        el.shadowRoot.querySelectorAll('li[role="treeitem"]'),
      );
      const unselectable = rows.filter(
        (r) => !r.querySelector("input[type=checkbox]"),
      );
      expect(unselectable.length).to.equal(1);
      expect(unselectable[0].hasAttribute("aria-selected")).to.equal(false);
      rows
        .filter((r) => r.querySelector("input[type=checkbox]"))
        .forEach((r) =>
          expect(["true", "false"]).to.include(r.getAttribute("aria-selected")),
        );
      // the count is of blocks
      expect(el.shadowRoot.querySelector(".count").textContent).to.contain(
        "6 blocks",
      );
    });

    it("checking rows swaps the toolbar for bulk actions", async () => {
      rowFor("a1").querySelector("input").click();
      rowFor("b1").querySelector("input").click();
      await el.updateComplete;
      expect(el.shadowRoot.querySelector(".toolbar.bulk")).to.exist;
      expect(el.shadowRoot.querySelector(".count").textContent).to.contain(
        "2 selected",
      );
      expect(rowFor("a1").getAttribute("aria-selected")).to.equal("true");
      expect(
        el.shadowRoot.querySelectorAll(".toolbar .bar-btn").length,
      ).to.equal(4);
    });

    it("Select all checks every block, then clears", async () => {
      const all = el.shadowRoot.querySelector(".toolbar input");
      all.click();
      await el.updateComplete;
      expect(el._selectedNodes().length).to.equal(6);
      el.shadowRoot.querySelector(".toolbar input").click();
      await el.updateComplete;
      expect(el._selectedNodes().length).to.equal(0);
    });

    it("Shift+click checks a range", async () => {
      rowFor("intro").querySelector("input").click();
      rowFor("b")
        .querySelector("input")
        .dispatchEvent(
          new MouseEvent("click", { bubbles: true, shiftKey: true }),
        );
      await el.updateComplete;
      expect(el._selectedNodes().map((n) => n.id)).to.deep.equal([
        "intro",
        "a",
        "a1",
        "list",
        "b",
      ]);
    });

    it("locks and unlocks the checked blocks", async () => {
      rowFor("a1").querySelector("input").click();
      rowFor("b1").querySelector("input").click();
      el.lockSelected();
      expect(body.querySelectorAll("[data-hax-lock]").length).to.equal(2);
      el.unlockSelected();
      expect(body.querySelectorAll("[data-hax-lock]").length).to.equal(0);
    });

    it("deletes the checked blocks but skips locked ones, and says so", async () => {
      body.querySelector("#b1").setAttribute("data-hax-lock", "");
      el.updateHAXMap();
      await el.updateComplete;
      rowFor("a1").querySelector("input").click();
      rowFor("b1").querySelector("input").click();
      await el.updateComplete;
      expect(el.shadowRoot.querySelector(".status").textContent).to.contain(
        "1 locked",
      );
      el.deleteSelected();
      expect(body.querySelector("#a1")).to.be.null;
      expect(body.querySelector("#b1")).to.exist;
      expect(el.status).to.equal("Deleted 1 block");
    });

    it("Alt+Up moves a heading with its section", async () => {
      expect(el.moveByKeyboard(body.querySelector("#b"), -1)).to.be.true;
      expect([...body.children].map((n) => n.id)).to.deep.equal([
        "",
        "intro",
        "b",
        "b1",
        "a",
        "a1",
        "list",
      ]);
      expect(el.status).to.contain("Moved");
    });

    it("dragging a row moves the block where the drop line shows", async () => {
      const from = rowFor("b1");
      const to = rowFor("a");
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      const x = a.left + 60;
      from.dispatchEvent(
        new PointerEvent("pointerdown", {
          bubbles: true,
          composed: true,
          button: 0,
          pointerType: "mouse",
          pointerId: 1,
          clientX: x,
          clientY: a.top + a.height / 2,
        }),
      );
      globalThis.dispatchEvent(
        new PointerEvent("pointermove", {
          pointerType: "mouse",
          pointerId: 1,
          clientX: x,
          clientY: b.top + 4,
        }),
      );
      await el.updateComplete;
      expect(el.shadowRoot.querySelector(".dropline")).to.exist;
      expect(el.shadowRoot.querySelector(".drag-ghost")).to.exist;
      expect(el.status).to.contain("above");
      globalThis.dispatchEvent(
        new PointerEvent("pointerup", {
          pointerType: "mouse",
          pointerId: 1,
          clientX: x,
          clientY: b.top + 4,
        }),
      );
      expect(body.querySelector("#b1").nextElementSibling.id).to.equal("a");
    });

    it("Escape cancels a drag", async () => {
      const from = rowFor("b1");
      const to = rowFor("a");
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      from.dispatchEvent(
        new PointerEvent("pointerdown", {
          bubbles: true,
          composed: true,
          button: 0,
          pointerType: "mouse",
          pointerId: 1,
          clientX: a.left + 60,
          clientY: a.top + 8,
        }),
      );
      globalThis.dispatchEvent(
        new PointerEvent("pointermove", {
          pointerType: "mouse",
          pointerId: 1,
          clientX: a.left + 60,
          clientY: b.top + 4,
        }),
      );
      globalThis.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      globalThis.dispatchEvent(
        new PointerEvent("pointerup", {
          pointerType: "mouse",
          pointerId: 1,
          clientX: a.left + 60,
          clientY: b.top + 4,
        }),
      );
      await el.updateComplete;
      expect(body.querySelector("#b1").previousElementSibling.id).to.equal("b");
      expect(el.shadowRoot.querySelector(".drag-ghost")).to.be.null;
    });

    // what the outline hands the page (hax-body's outlineMarks)
    const stubMarks = () => {
      const marks = {
        last: null,
        animated: null,
        set(m) {
          this.last = m;
        },
        clear() {
          this.last = null;
        },
        animate(nodes, change, options) {
          this.animated = options;
          return change();
        },
      };
      body.outlineMarks = marks;
      return marks;
    };
    const key = async (id, init) => {
      const index = el.elementList.findIndex(
        (r) => r.node.id === id && r.kind !== "column",
      );
      el.focusIndex = index;
      await el.updateComplete;
      rowFor(id).dispatchEvent(
        new KeyboardEvent("keydown", {
          bubbles: true,
          composed: true,
          ...init,
        }),
      );
      await el.updateComplete;
    };
    const itemRow = (n) =>
      el.shadowRoot.querySelector(
        `li[data-index="${
          el.elementList.findIndex((r) => r.kind === "item") + n
        }"]`,
      );

    it("list items can be checked and deleted on their own", async () => {
      const row = itemRow(0);
      expect(row.querySelector("input")).to.exist;
      expect(row.querySelector(".row-btn.danger")).to.exist;
      // list items have no lock of their own
      expect(row.querySelectorAll(".row-btn").length).to.equal(1);
      row.querySelector(".row-btn.danger").click();
      expect(body.querySelectorAll("#list li").length).to.equal(1);
      expect(el.status).to.equal("Deleted 1 item");
    });

    it("deleting a list's last item deletes the empty list", async () => {
      body.querySelector("#list").innerHTML = "<li>Only</li>";
      el.updateHAXMap();
      await el.updateComplete;
      itemRow(0).querySelector(".row-btn.danger").click();
      expect(body.querySelector("#list")).to.be.null;
    });

    it("hovering a heading lights up its section in the outline", async () => {
      rowFor("a").dispatchEvent(
        new PointerEvent("pointerover", { bubbles: true, composed: true }),
      );
      await el.updateComplete;
      const lit = [...el.shadowRoot.querySelectorAll("li.in-tree")].map(
        (li) => el.elementList[parseInt(li.getAttribute("data-index"), 10)],
      );
      // a1, the list and its two items; not the heading itself, not "b"
      expect(lit.length).to.equal(4);
      expect(lit.map((r) => r.node.id).slice(0, 2)).to.deep.equal([
        "a1",
        "list",
      ]);
      // the guide under the heading is a line down its branch
      expect(rowFor("a1").querySelector(".guide.hl")).to.exist;
      expect(rowFor("b1").querySelector(".guide.hl")).to.be.null;
      el.shadowRoot
        .querySelector('ul[role="tree"]')
        .dispatchEvent(new PointerEvent("pointerleave"));
      await el.updateComplete;
      expect(el.shadowRoot.querySelectorAll("li.in-tree").length).to.equal(0);
    });

    it("shows checked rows and the lit branch on the page", async () => {
      const marks = stubMarks();
      rowFor("a1").querySelector("input").click();
      rowFor("a").dispatchEvent(
        new PointerEvent("pointerover", { bubbles: true, composed: true }),
      );
      await el.updateComplete;
      expect(marks.last.selected.map((n) => n.id)).to.deep.equal(["a1"]);
      expect(marks.last.tree.map((n) => n.id)).to.deep.equal([
        "a",
        "a1",
        "list",
      ]);
      expect(marks.last.moving).to.deep.equal([]);
      el.hidden = true;
      await el.updateComplete;
      expect(marks.last).to.be.null;
    });

    it("a drag shows on the page what it carries and where it lands", async () => {
      const marks = stubMarks();
      const from = rowFor("a");
      const to = rowFor("b1");
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      from.dispatchEvent(
        new PointerEvent("pointerdown", {
          bubbles: true,
          composed: true,
          button: 0,
          pointerType: "mouse",
          pointerId: 1,
          clientX: a.left + 60,
          clientY: a.top + 8,
        }),
      );
      globalThis.dispatchEvent(
        new PointerEvent("pointermove", {
          pointerType: "mouse",
          pointerId: 1,
          clientX: a.left + 60,
          clientY: b.bottom - 4,
        }),
      );
      await el.updateComplete;
      expect(marks.last.moving.map((n) => n.id)).to.deep.equal([
        "a",
        "a1",
        "list",
      ]);
      expect(marks.last.drop.parent).to.equal(body);
      expect(marks.last.drop.before).to.be.null;
      // the heading's section is lit in the outline as it moves
      expect(rowFor("a1").classList.contains("dragging")).to.be.true;
      expect(rowFor("a1").querySelector(".guide.hl")).to.exist;
      globalThis.dispatchEvent(
        new PointerEvent("pointerup", {
          pointerType: "mouse",
          pointerId: 1,
          clientX: a.left + 60,
          clientY: b.bottom - 4,
        }),
      );
      // moved blocks light up as they land
      expect(marks.animated.flash.map((n) => n.id)).to.deep.equal([
        "a",
        "a1",
        "list",
      ]);
      expect([...body.children].map((n) => n.id).slice(-3)).to.deep.equal([
        "a",
        "a1",
        "list",
      ]);
    });

    it("moved rows flash, then settle", async () => {
      stubMarks();
      el.moveByKeyboard(body.querySelector("#b1"), -1);
      await new Promise((r) => setTimeout(r, 10));
      await el.updateComplete;
      expect(rowFor("b1").classList.contains("flash")).to.be.true;
      await new Promise((r) => setTimeout(r, 800));
      await el.updateComplete;
      expect(rowFor("b1").classList.contains("flash")).to.be.false;
    });

    it("dragging a list item drops it among the items of a list", async () => {
      const from = itemRow(1);
      const to = itemRow(0);
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      from.dispatchEvent(
        new PointerEvent("pointerdown", {
          bubbles: true,
          composed: true,
          button: 0,
          pointerType: "mouse",
          pointerId: 1,
          clientX: a.left + 60,
          clientY: a.top + 8,
        }),
      );
      globalThis.dispatchEvent(
        new PointerEvent("pointermove", {
          pointerType: "mouse",
          pointerId: 1,
          clientX: a.left + 60,
          clientY: b.top + 4,
        }),
      );
      await el.updateComplete;
      expect(el.status).to.contain("above");
      globalThis.dispatchEvent(
        new PointerEvent("pointerup", {
          pointerType: "mouse",
          pointerId: 1,
          clientX: a.left + 60,
          clientY: b.top + 4,
        }),
      );
      expect(body.querySelector("#list").textContent).to.equal("TroughCrest");
    });

    it("a list item dragged among blocks says why it cannot land", async () => {
      const from = itemRow(0);
      const to = rowFor("b1");
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      from.dispatchEvent(
        new PointerEvent("pointerdown", {
          bubbles: true,
          composed: true,
          button: 0,
          pointerType: "mouse",
          pointerId: 1,
          clientX: a.left + 60,
          clientY: a.top + 8,
        }),
      );
      globalThis.dispatchEvent(
        new PointerEvent("pointermove", {
          pointerType: "mouse",
          pointerId: 1,
          clientX: a.left + 60,
          clientY: b.top + 4,
        }),
      );
      await el.updateComplete;
      expect(el.status).to.equal("List items move only within lists");
      expect(el.shadowRoot.querySelector(".drag-ghost.no-drop")).to.exist;
      globalThis.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    describe("keyboard", () => {
      it("Delete deletes the focused block", async () => {
        await key("b1", { key: "Delete" });
        expect(body.querySelector("#b1")).to.be.null;
      });

      it("Delete deletes the checked blocks when the focused row is checked", async () => {
        await key("a1", { key: " " });
        await key("intro", { key: " " });
        await key("intro", { key: "Backspace" });
        expect(body.querySelector("#a1")).to.be.null;
        expect(body.querySelector("#intro")).to.be.null;
        expect(el.status).to.equal("Deleted 2 blocks");
      });

      it("Shift+Down checks a range from the anchor", async () => {
        await key("intro", { key: " " });
        await key("intro", { key: "ArrowDown", shiftKey: true });
        await key("a", { key: "ArrowDown", shiftKey: true });
        expect(el._selectedNodes().map((n) => n.id)).to.deep.equal([
          "intro",
          "a",
          "a1",
        ]);
        // back up shrinks it
        await key("a1", { key: "ArrowUp", shiftKey: true });
        expect(el._selectedNodes().map((n) => n.id)).to.deep.equal([
          "intro",
          "a",
        ]);
      });

      it("Ctrl+A checks every block, Escape clears", async () => {
        await key("intro", { key: "a", ctrlKey: true });
        expect(el._selectedNodes().length).to.equal(6);
        await key("intro", { key: "Escape" });
        expect(el._selectedNodes().length).to.equal(0);
      });

      it("L locks the focused block, or unlocks it", async () => {
        await key("b1", { key: "l" });
        expect(body.querySelector("#b1").hasAttribute("data-hax-lock")).to.be
          .true;
        await key("b1", { key: "L" });
        expect(body.querySelector("#b1").hasAttribute("data-hax-lock")).to.be
          .false;
      });

      it("Alt+Down moves the checked blocks together", async () => {
        await key("intro", { key: " " });
        await key("a1", { key: " " });
        await key("a1", { key: "ArrowDown", altKey: true });
        expect([...body.children].map((n) => n.id)).to.deep.equal([
          "",
          "a",
          "list",
          "intro",
          "a1",
          "b",
          "b1",
        ]);
      });

      it("Alt+Up on a list item reorders the list", async () => {
        const second = el.elementList.filter((r) => r.kind === "item")[1];
        second.node.id = "trough";
        el.updateHAXMap();
        await el.updateComplete;
        await key("trough", { key: "ArrowUp", altKey: true });
        expect(body.querySelector("#list").firstElementChild.id).to.equal(
          "trough",
        );
      });

      it("says when a block cannot move that way", async () => {
        await key("intro", { key: "ArrowUp", altKey: true });
        expect(el.status).to.equal("Intro cannot move that way");
      });

      it("the keyboard shortcuts show on request", async () => {
        const keys = el.shadowRoot.querySelector("#keys");
        expect(keys.hidden).to.be.true;
        el.shadowRoot.querySelector(".keys-btn").click();
        await el.updateComplete;
        expect(keys.hidden).to.be.false;
        expect(keys.querySelectorAll("kbd").length).to.be.greaterThan(10);
      });
    });
  });

  describe("isLocked", () => {
    it("returns true when node has data-hax-lock attribute", () => {
      const node = globalThis.document.createElement("p");
      node.setAttribute("data-hax-lock", "data-hax-lock");
      el.elementList = [{ node, tag: "p" }];
      expect(el.isLocked(0)).to.equal(true);
    });

    it("returns false when node does not have data-hax-lock", () => {
      const node = globalThis.document.createElement("p");
      el.elementList = [{ node, tag: "p" }];
      expect(el.isLocked(0)).to.equal(false);
    });

    it("returns true when parent node has data-hax-lock", () => {
      const parent = globalThis.document.createElement("div");
      parent.setAttribute("data-hax-lock", "data-hax-lock");
      const node = globalThis.document.createElement("p");
      parent.appendChild(node);
      el.elementList = [{ node, tag: "p" }];
      expect(el.isLocked(0)).to.equal(true);
    });

    it("returns undefined for invalid index", () => {
      expect(el.isLocked(false)).to.be.undefined;
    });
  });

  describe("editItem", () => {
    it("dispatches hax-context-item-selected for valid index", async () => {
      const node = globalThis.document.createElement("p");
      el.elementList = [{ node, tag: "p" }];
      const listener = oneEvent(el, "hax-context-item-selected");
      el.editItem(0);
      const e = await listener;
      expect(e.detail.target).to.equal(node);
      expect(e.detail.eventName).to.equal("content-edit");
      expect(e.detail.value).to.equal(true);
    });

    it("does not dispatch for invalid index", () => {
      let dispatched = false;
      el.addEventListener(
        "hax-context-item-selected",
        () => (dispatched = true),
      );
      el.editItem(false);
      expect(dispatched).to.equal(false);
    });
  });

  describe("goToItem", () => {
    it("sets HAXStore.activeNode for valid index", () => {
      const node = globalThis.document.createElement("p");
      globalThis.document.body.appendChild(node);
      el.elementList = [{ node, tag: "p" }];
      el.goToItem(0);
      expect(HAXStore.activeNode).to.equal(node);
      expect(node.classList.contains("blinkfocus")).to.equal(true);
      node.remove();
    });

    it("does nothing for invalid index", () => {
      const originalActive = HAXStore.activeNode;
      el.goToItem(false);
      expect(HAXStore.activeNode).to.equal(originalActive);
    });
  });

  describe("itemOp lock", () => {
    it("locks an unlocked node", async () => {
      const node = globalThis.document.createElement("p");
      globalThis.document.body.appendChild(node);
      el.elementList = [{ node, tag: "p" }];
      const listener = oneEvent(el, "hax-toggle-active-node-lock");
      el.itemOp(0, "lock");
      const e = await listener;
      expect(e.detail.lock).to.equal(true);
      expect(node.hasAttribute("data-hax-lock")).to.equal(true);
      node.remove();
    });

    it("unlocks a locked node", async () => {
      const node = globalThis.document.createElement("p");
      node.setAttribute("data-hax-lock", "data-hax-lock");
      globalThis.document.body.appendChild(node);
      el.elementList = [{ node, tag: "p" }];
      const listener = oneEvent(el, "hax-toggle-active-node-lock");
      el.itemOp(0, "lock");
      const e = await listener;
      expect(e.detail.lock).to.equal(false);
      expect(node.hasAttribute("data-hax-lock")).to.equal(false);
      node.remove();
    });
  });

  describe("itemOp delete", () => {
    it("calls haxDeleteNode on activeHaxBody", () => {
      let deleteCalled = false;
      let deletedNode = null;
      const node = globalThis.document.createElement("p");
      globalThis.document.body.appendChild(node);
      const originalBody = HAXStore.activeHaxBody;
      HAXStore.activeHaxBody = {
        haxDeleteNode: (n) => {
          deleteCalled = true;
          deletedNode = n;
        },
      };
      el.elementList = [{ node, tag: "p" }];
      el.itemOp(0, "delete");
      expect(deleteCalled).to.equal(true);
      expect(deletedNode).to.equal(node);
      HAXStore.activeHaxBody = originalBody;
      node.remove();
    });
  });

  describe("_scheduleMapRefresh", () => {
    it("does nothing when hidden", () => {
      el.hidden = true;
      expect(() => el._scheduleMapRefresh(0)).to.not.throw();
    });
  });
});
