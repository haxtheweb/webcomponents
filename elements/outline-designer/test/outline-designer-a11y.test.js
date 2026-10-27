import { fixture, expect, html } from "@open-wc/testing";
import "../outline-designer.js";

// accessibility of the outline: axe audits with a real outline in each
// state people reach (folded, selected, deleted, locked, menu open, mid
// drag), tree semantics that stay correct after changes, the roving tab
// stop, what is announced and what is hidden from assistive technology.
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
    page("g1", "Grandchild", "c1", 0, 2),
    page("c2", "Child Two", "p1", 1, 1),
    page("p2", "Page Two", null, 1, 0),
    page("p3", "Locked Page", null, 2, 0, { metadata: { locked: true } }),
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
const rows = (element) => [
  ...element.shadowRoot.querySelectorAll("li.item[data-item-id]"),
];
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
const activeId = (element) => {
  const active = element.shadowRoot.activeElement;
  return active ? active.getAttribute("data-item-id") : null;
};

describe("outline-designer accessibility", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(
      html`<outline-designer reduced-motion="reduce"></outline-designer>`,
    );
    element.items = makeItems();
    await settle(element);
  });

  describe("axe audits", () => {
    it("passes with a full outline", async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it("passes with a folded parent, a selection and a locked page", async () => {
      element.items.find((i) => i.id === "c1").collapsed = true;
      element.selectedPages = ["p2"];
      element.requestUpdate();
      await settle(element);
      await expect(element).shadowDom.to.be.accessible();
    });

    it("passes with pages marked for deletion, shown and hidden", async () => {
      element.itemOp(
        element.items.findIndex((i) => i.id === "p1"),
        "delete",
      );
      await settle(element);
      await expect(element).shadowDom.to.be.accessible();
      element.hideDelete = true;
      await settle(element);
      await expect(element).shadowDom.to.be.accessible();
    });

    it("passes with new, duplicated and current pages", async () => {
      element.addNewItem(element.items.findIndex((i) => i.id === "p2"));
      element.itemOp(
        element.items.findIndex((i) => i.id === "c2"),
        "duplicate",
      );
      element.activeId = "p2";
      await settle(element);
      expect(element.items.some((i) => i.new)).to.equal(true);
      await expect(element).shadowDom.to.be.accessible();
    });

    it("passes with a page's content structure open", async () => {
      element.items.find((i) => i.id === "c1").showContent = true;
      element.items.find((i) => i.id === "p2").showContent = true;
      element.requestUpdate();
      await settle(element);
      expect(
        element.shadowRoot.querySelectorAll("li.content-child").length > 0,
      ).to.equal(true);
      await expect(element).shadowDom.to.be.accessible(); // and with blocks offered to add
      element.haxGizmos = [
        { tag: "video-player", icon: "av:av", title: "Video" },
      ];
      element.requestUpdate();
      await settle(element);
      expect(
        element.shadowRoot.querySelector("li.content-adding-operations") ===
          null,
      ).to.equal(false);
      await expect(element).shadowDom.to.be.accessible();
    });

    it("passes in every density", async () => {
      for (const density of ["compact", "roomy"]) {
        element.setDensity(density);
        await settle(element);
        await expect(element).shadowDom.to.be.accessible();
      }
    });

    it("passes while renaming a page", async () => {
      element.editTitle({
        target: pageLi(element, "p2").querySelector(".label.shown"),
      });
      await settle(element);
      await expect(element).shadowDom.to.be.accessible();
    });

    it("passes while a page is being dragged", async () => {
      const label = pageLi(element, "p2").querySelector(".label.shown");
      const r = label.getBoundingClientRect();
      const point = { x: r.left + 20, y: r.top + r.height / 2 };
      const pointer = (target, type, p) =>
        target.dispatchEvent(
          new PointerEvent(type, {
            bubbles: true,
            composed: true,
            cancelable: true,
            clientX: p.x,
            clientY: p.y,
            pointerId: 31,
            pointerType: "mouse",
            isPrimary: true,
            button: 0,
            buttons: type === "pointerup" ? 0 : 1,
          }),
        );
      const list = element.shadowRoot.querySelector("#list");
      pointer(label, "pointerdown", point);
      pointer(list, "pointermove", { x: point.x, y: point.y - 20 });
      await settle(element);
      expect(element._drag === null).to.equal(false);
      await expect(element).shadowDom.to.be.accessible();
      pointer(list, "pointercancel", point);
      await settle(element);
    });
  });

  describe("tree semantics", () => {
    it("is a labelled, multi-select tree with described keys", () => {
      const tree = element.shadowRoot.querySelector("#list");
      expect(tree.getAttribute("role")).to.equal("tree");
      expect(tree.getAttribute("aria-multiselectable")).to.equal("true");
      expect(tree.getAttribute("aria-label").length > 0).to.equal(true);
      const hints = element.shadowRoot.querySelector(
        `#${tree.getAttribute("aria-describedby")}`,
      );
      expect(hints === null).to.equal(false);
      expect(hints.textContent).to.contain("F10");
    });

    it("gives every row its level, size and position", () => {
      const expected = {
        p1: [1, 3, 1],
        c1: [2, 2, 1],
        g1: [3, 1, 1],
        c2: [2, 2, 2],
        p2: [1, 3, 2],
        p3: [1, 3, 3],
      };
      rows(element).forEach((li) => {
        const [level, size, pos] = expected[li.getAttribute("data-item-id")];
        expect(li.getAttribute("role")).to.equal("treeitem");
        expect(li.getAttribute("aria-level")).to.equal(String(level));
        expect(li.getAttribute("aria-setsize")).to.equal(String(size));
        expect(li.getAttribute("aria-posinset")).to.equal(String(pos));
      });
    });

    it("keeps level, size and position right after moves", async () => {
      // into Page One as its last child
      keydown(pageLi(element, "p2"), "ArrowRight", { altKey: true });
      await settle(element);
      const p2 = pageLi(element, "p2");
      expect(p2.getAttribute("aria-level")).to.equal("2");
      expect(p2.getAttribute("aria-setsize")).to.equal("3");
      expect(p2.getAttribute("aria-posinset")).to.equal("3");
      expect(pageLi(element, "p3").getAttribute("aria-setsize")).to.equal("2");
      expect(pageLi(element, "p3").getAttribute("aria-posinset")).to.equal("2");
      // and to the top of its new group
      keydown(pageLi(element, "p2"), "ArrowUp", { altKey: true });
      await settle(element);
      keydown(pageLi(element, "p2"), "ArrowUp", { altKey: true });
      await settle(element);
      expect(pageLi(element, "p2").getAttribute("aria-posinset")).to.equal("1");
      expect(pageLi(element, "c1").getAttribute("aria-posinset")).to.equal("2");
    });

    it("counts only the rows that are shown when deleted pages are hidden", async () => {
      element.itemOp(
        element.items.findIndex((i) => i.id === "p2"),
        "delete",
      );
      element.hideDelete = true;
      await settle(element);
      expect(pageLi(element, "p1").getAttribute("aria-setsize")).to.equal("2");
      expect(pageLi(element, "p3").getAttribute("aria-setsize")).to.equal("2");
      expect(pageLi(element, "p3").getAttribute("aria-posinset")).to.equal("2");
    });

    it("says whether a parent is open, and nothing for leaves", async () => {
      expect(pageLi(element, "p1").getAttribute("aria-expanded")).to.equal(
        "true",
      );
      expect(pageLi(element, "p2").hasAttribute("aria-expanded")).to.equal(
        false,
      );
      pageLi(element, "p1").focus();
      keydown(pageLi(element, "p1"), "ArrowLeft");
      await settle(element);
      expect(pageLi(element, "p1").getAttribute("aria-expanded")).to.equal(
        "false",
      );
      // folded children are not left in the tree
      expect(pageLi(element, "c1") === null || pageLi(element, "c1").hidden).to
        .be.true;
    });

    it("reflects selection on every selected row", async () => {
      pageLi(element, "p2").focus();
      keydown(pageLi(element, "p2"), " ");
      await settle(element);
      keydown(pageLi(element, "p2"), "ArrowDown", { shiftKey: true });
      await settle(element);
      expect(pageLi(element, "p2").getAttribute("aria-selected")).to.equal(
        "true",
      );
      expect(pageLi(element, "p3").getAttribute("aria-selected")).to.equal(
        "true",
      );
      expect(pageLi(element, "p1").getAttribute("aria-selected")).to.equal(
        "false",
      );
    });

    it("puts each row's state in its name", async () => {
      element.itemOp(
        element.items.findIndex((i) => i.id === "p2"),
        "delete",
      );
      element.items.find((i) => i.id === "c1").collapsed = true;
      element.activeId = "p1";
      element.requestUpdate();
      await settle(element);
      expect(pageLi(element, "p3").getAttribute("aria-label")).to.contain(
        "Locked Page, locked",
      );
      const p2 = pageLi(element, "p2").getAttribute("aria-label");
      expect(p2.startsWith("Page Two, ")).to.equal(true);
      expect(p2.toLowerCase()).to.contain("delet");
      expect(pageLi(element, "c1").getAttribute("aria-label")).to.contain(
        "1 hidden sub-pages",
      );
      expect(pageLi(element, "p1").getAttribute("aria-label")).to.contain(
        "Current page",
      );
    });
  });

  describe("keyboard and focus", () => {
    it("has exactly one tab stop in the tree, and it follows focus", async () => {
      const stops = () =>
        rows(element).filter((li) => li.getAttribute("tabindex") === "0");
      expect(stops().length).to.equal(1);
      pageLi(element, "p1").focus();
      keydown(pageLi(element, "p1"), "End");
      await settle(element);
      expect(activeId(element)).to.equal("p3");
      expect(
        stops().map((li) => li.getAttribute("data-item-id")),
      ).to.deep.equal(["p3"]);
    });

    it("keeps row buttons out of the tab order and the reading order", () => {
      rows(element).forEach((li) => {
        li.querySelectorAll("button").forEach((b) => {
          if (b.closest(".nudge")) return;
          expect(b.getAttribute("tabindex")).to.equal("-1");
          expect(b.getAttribute("aria-hidden")).to.equal("true");
        });
      });
    });

    it("walks the tree with arrows, Home and End", async () => {
      pageLi(element, "p1").focus();
      const steps = [
        ["ArrowDown", "c1"],
        ["ArrowRight", "g1"],
        ["ArrowLeft", "c1"],
        // Left on an open page folds it; Left again goes to its parent
        ["ArrowLeft", "c1"],
        ["ArrowLeft", "p1"],
        ["End", "p3"],
        ["Home", "p1"],
      ];
      for (const [key, id] of steps) {
        keydown(element.shadowRoot.activeElement, key);
        await settle(element, 20);
        expect(activeId(element), key).to.equal(id);
      }
    });

    it("jumps to a page by typing the start of its title", async () => {
      pageLi(element, "p1").focus();
      keydown(pageLi(element, "p1"), "l");
      await settle(element, 20);
      expect(activeId(element)).to.equal("p3");
    });

    it("keeps focus on a page as it moves and when the menu closes", async () => {
      pageLi(element, "p2").focus();
      keydown(pageLi(element, "p2"), "ArrowUp", { altKey: true });
      await settle(element);
      expect(activeId(element)).to.equal("p2");
      keydown(pageLi(element, "p2"), "F10", { shiftKey: true });
      await settle(element);
      const menu = pageLi(element, "p2").querySelector(".actions-menu");
      expect(menu.open).to.equal(true);
      menu.close();
      await settle(element);
      expect(activeId(element)).to.equal("p2");
    });

    it("gives the new page focus and a name to type", async () => {
      pageLi(element, "p2").focus();
      keydown(pageLi(element, "p2"), "Enter", { ctrlKey: true });
      await settle(element, 120);
      const added = element.items.find((i) => i.new);
      const edit = pageLi(element, added.id).querySelector(".label-edit");
      expect(edit.getAttribute("contenteditable")).to.equal("true");
      expect(element.shadowRoot.activeElement === edit).to.equal(true);
    });
  });

  describe("announcements", () => {
    const live = () =>
      element.shadowRoot.querySelector('div[aria-live="polite"]');

    it("has one polite, atomic live region", () => {
      const regions = element.shadowRoot.querySelectorAll("[aria-live]");
      expect(regions.length).to.equal(1);
      expect(live().getAttribute("aria-atomic")).to.equal("true");
    });

    it("announces changes but not plain arrow navigation", async () => {
      pageLi(element, "p1").focus();
      element.liveRegionText = "";
      keydown(pageLi(element, "p1"), "ArrowDown");
      await settle(element, 20);
      expect(element.liveRegionText).to.equal("");
      keydown(element.shadowRoot.activeElement, "ArrowDown", { altKey: true });
      await settle(element);
      expect(element.liveRegionText).to.equal("Moved Child One down");
      expect(live().textContent.trim()).to.equal("Moved Child One down");
    });

    it("says why a locked page cannot change", async () => {
      pageLi(element, "p3").focus();
      keydown(pageLi(element, "p3"), "ArrowUp", { altKey: true });
      await settle(element);
      expect(element.liveRegionText).to.equal(
        "Locked Page is locked. Unlock it to change it.",
      );
    });

    it("announces deletion, restore and selection", async () => {
      pageLi(element, "p2").focus();
      keydown(pageLi(element, "p2"), "Delete");
      await settle(element);
      expect(element.liveRegionText.length > 0).to.equal(true);
      const deleted = element.liveRegionText;
      keydown(pageLi(element, "p2"), "Delete");
      await settle(element);
      expect(element.liveRegionText).to.not.equal(deleted);
      expect(element.liveRegionText).to.contain("Page Two");
      keydown(pageLi(element, "p2"), " ");
      await settle(element);
      expect(element.liveRegionText).to.equal("1 selected");
    });
  });

  describe("hidden from assistive technology", () => {
    it("hides decoration and drag visuals", () => {
      rows(element).forEach((li) => {
        const cols = li.querySelector(".cols");
        if (cols) expect(cols.getAttribute("aria-hidden")).to.equal("true");
        expect(li.querySelector(".grip").getAttribute("aria-hidden")).to.equal(
          "true",
        );
      });
      // the status line's text repeats the live region; its Undo button
      // stays reachable
      [".drag-ghost", ".status-text", ".dropline"].forEach((selector) => {
        expect(
          element.shadowRoot
            .querySelector(selector)
            .getAttribute("aria-hidden"),
          selector,
        ).to.equal("true");
      });
    });

    it("keeps add rows out of the tree's items", () => {
      element.shadowRoot.querySelectorAll("li.add-row").forEach((li) => {
        expect(li.getAttribute("role")).to.equal("none");
        expect(li.getAttribute("aria-hidden")).to.equal("true");
      });
    });
  });
});
