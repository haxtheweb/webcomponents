import { fixture, expect, html } from "@open-wc/testing";
import "../outline-designer.js";

// Data integrity of the outline. getData() items go to the HAXcms backend
// as they are (haxcms-nodejs / haxcms-php saveOutline), which:
// - saves every item it is sent, in array order, so a new page's parent
//   has to come before it (new ids are mapped as they are created)
// - trusts indent, and parseInt()s order
// - sorts siblings by order, breaking ties by manifest position, where new
//   pages are appended; a tie can put a page somewhere else after saving
// - deletes items flagged delete === true, then moves pages whose parent
//   is gone to the top level
// The outline dialog counts new / modified / delete flags to warn about
// unsaved changes, so an unflagged change can be lost without warning.
//
// checkOutline() asserts all of that after every operation: hand-written
// single operations with exact expected results, longer sequences and
// round trips, and seeded random runs that mix every operation, undo,
// folding, hidden deletes and drags.

const FLAG_KEYS = [
  "new",
  "modified",
  "delete",
  "duplicate",
  "collapsed",
  "showContent",
];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const settle = async (element, ms = 0) => {
  await element.updateComplete;
  await wait(ms);
  await element.updateComplete;
};

// a small seeded random number generator so failures can be replayed
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function page(id, title, parent, order, indent, extra = {}) {
  return {
    id,
    title,
    slug: `slug-${id}`,
    location: `pages/${id}/index.html`,
    description: `About ${title}`,
    order,
    parent,
    indent,
    contents: `<p>Contents of ${id}</p>`,
    metadata: { locked: false, published: true, created: 1, updated: 2 },
    ...extra,
  };
}

// a fixed outline for the hand-written cases
//   A (A1, A2 (A2a, A2b), A3), B, C (C1), D [locked], E
function fixedItems() {
  return [
    page("A", "A", null, 0, 0),
    page("A1", "A1", "A", 0, 1),
    page("A2", "A2", "A", 1, 1),
    page("A2a", "A2a", "A2", 0, 2),
    page("A2b", "A2b", "A2", 1, 2),
    page("A3", "A3", "A", 2, 1),
    page("B", "B", null, 1, 0),
    page("C", "C", null, 2, 0),
    page("C1", "C1", "C", 0, 1),
    page("D", "D", null, 3, 0, {
      metadata: { locked: true, published: true, created: 1, updated: 2 },
    }),
    page("E", "E", null, 4, 0),
  ];
}

// a random outline: 8-28 pages up to 4 levels deep, some locked
function randomItems(random) {
  const items = [];
  const count = 8 + Math.floor(random() * 20);
  const kids = {};
  for (let n = 0; n < count; n++) {
    const id = `p${n}`;
    // pick a parent among earlier pages that are not too deep
    const candidates = items.filter((i) => i.indent < 3);
    const parent =
      n === 0 || random() < 0.35
        ? null
        : candidates[Math.floor(random() * candidates.length)];
    const parentId = parent ? parent.id : null;
    const order = kids[parentId] || 0;
    kids[parentId] = order + 1;
    items.push(
      page(id, `Page ${n}`, parentId, order, parent ? parent.indent + 1 : 0, {
        metadata: {
          locked: random() < 0.08,
          published: true,
          created: 1,
          updated: 2,
        },
      }),
    );
  }
  // tree order, as the backend sends it
  const out = [];
  const walk = (parentId) =>
    items
      .filter((i) => i.parent === parentId)
      .sort((a, b) => a.order - b.order)
      .forEach((i) => {
        out.push(i);
        walk(i.id);
      });
  walk(null);
  return out;
}

/**
 * Every rule saved data has to follow. Returns a list of problems (empty
 * when the outline is sound) so a random run can report the operations
 * that led to the first one.
 */
function outlineProblems(items, original) {
  const problems = [];
  const byId = new Map();
  items.forEach((item) => {
    if (byId.has(item.id)) problems.push(`duplicate id ${item.id}`);
    byId.set(item.id, item);
  });
  // nothing lost, nothing invented besides new pages
  original.forEach((o) => {
    if (!byId.has(o.id)) problems.push(`page ${o.id} was lost`);
  });
  const originalById = new Map(original.map((o) => [o.id, o]));
  items.forEach((item) => {
    if (!originalById.has(item.id) && item.new !== true) {
      problems.push(`${item.id} is not original and not flagged new`);
    }
  });
  // only known keys go to the backend
  const allowed = new Set([
    ...original.flatMap((o) => Object.keys(o)),
    ...FLAG_KEYS,
  ]);
  items.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (!allowed.has(key) && !(item.new && key in newItemShape)) {
        problems.push(`${item.id} carries unexpected key "${key}"`);
      }
    });
  });
  // parents exist, are not the page itself, and there are no cycles
  const parentOf = (item) =>
    item.parent === null || item.parent === undefined || item.parent === ""
      ? null
      : item.parent;
  items.forEach((item) => {
    const p = parentOf(item);
    if (p !== null && !byId.has(p)) {
      problems.push(`${item.id} has missing parent ${p}`);
    }
    if (p === item.id) problems.push(`${item.id} is its own parent`);
    const seen = new Set([item.id]);
    let up = p;
    while (up !== null && byId.has(up)) {
      if (seen.has(up)) {
        problems.push(`${item.id} is in a parent cycle`);
        break;
      }
      seen.add(up);
      up = parentOf(byId.get(up));
    }
  });
  if (problems.length) return problems;
  // indent is the depth (the backend trusts it)
  const depth = (item) => {
    let d = 0;
    let up = parentOf(item);
    while (up !== null) {
      d++;
      up = parentOf(byId.get(up));
    }
    return d;
  };
  items.forEach((item) => {
    if (Number(item.indent) !== depth(item)) {
      problems.push(
        `${item.id} indent ${item.indent} but depth ${depth(item)}`,
      );
    }
  });
  // tree order: each page's parent is the nearest earlier page one level up
  // (parents before children, subtrees contiguous)
  const stack = [];
  items.forEach((item, index) => {
    const d = depth(item);
    stack.length = d;
    const expectedParent = d === 0 ? null : stack[d - 1];
    if (expectedParent === undefined || parentOf(item) !== expectedParent) {
      problems.push(
        `${item.id} at ${index} is out of tree order (parent ${parentOf(item)})`,
      );
    }
    stack[d] = item.id;
  });
  // siblings: whole-number orders that strictly increase in array order,
  // so the backend's sort gives back exactly the order shown
  const groups = new Map();
  items.forEach((item) => {
    const p = parentOf(item);
    if (!groups.has(p)) groups.set(p, []);
    groups.get(p).push(item);
  });
  groups.forEach((list, p) => {
    list.forEach((item, i) => {
      const order = Number(item.order);
      if (!Number.isFinite(order) || Math.floor(order) !== order) {
        problems.push(`${item.id} order ${item.order} is not a whole number`);
      }
      if (i > 0 && !(order > Number(list[i - 1].order))) {
        problems.push(
          `siblings under ${p}: ${list[i - 1].id} (${list[i - 1].order}) then ${item.id} (${item.order}) would not keep their order once saved`,
        );
      }
    });
  });
  // deleting a page deletes everything under it (the backend would move
  // kept children of a deleted page to the top level)
  items.forEach((item) => {
    if (item.delete !== undefined && typeof item.delete !== "boolean") {
      problems.push(`${item.id} delete is ${JSON.stringify(item.delete)}`);
    }
    const p = parentOf(item);
    if (p !== null && byId.get(p).delete === true && item.delete !== true) {
      problems.push(`${item.id} is kept but its parent ${p} is deleted`);
    }
  });
  // every change to an existing page is flagged, and nothing else changed
  items.forEach((item) => {
    const o = originalById.get(item.id);
    if (!o) return;
    // indent alone follows from the parent (pages under a moved page);
    // the backend saves every item, and the moved page itself is flagged
    const moved =
      parentOf(item) !== parentOf(o) ||
      Number(item.order) !== Number(o.order) ||
      item.title !== o.title;
    if (moved && !item.modified && !item.delete) {
      problems.push(`${item.id} changed but is not flagged modified`);
    }
    ["contents", "slug", "location", "description"].forEach((key) => {
      if (item[key] !== o[key]) problems.push(`${item.id} ${key} changed`);
    });
    const { locked: _l1, ...meta } = item.metadata || {};
    const { locked: _l2, ...metaWas } = o.metadata || {};
    if (JSON.stringify(meta) !== JSON.stringify(metaWas)) {
      problems.push(`${item.id} metadata changed`);
    }
  });
  // new pages: valid contents, and duplicates point at a real page
  items.forEach((item) => {
    if (item.new !== true) return;
    if (typeof item.contents !== "string" || item.contents === "") {
      problems.push(`new ${item.id} has no contents`);
    }
    if (item.duplicate !== undefined && !byId.has(item.duplicate)) {
      problems.push(`new ${item.id} duplicates missing ${item.duplicate}`);
    }
  });
  return problems;
}
// keys a JSONOutlineSchemaItem is created with
const newItemShape = {
  id: 1,
  indent: 1,
  location: 1,
  slug: 1,
  order: 1,
  parent: 1,
  title: 1,
  description: 1,
  metadata: 1,
  contents: 1,
};

async function saved(element) {
  const data = await element.getData();
  // what goes over the wire
  return JSON.parse(JSON.stringify(data.items));
}

async function expectSound(element, original, context = "") {
  const items = await saved(element);
  const problems = outlineProblems(items, original);
  expect(problems, `${context}\n${problems.join("\n")}`).to.deep.equal([]);
  return items;
}

// the outline as people see it: "title@depth" in order, deleted marked
const shape = (items) =>
  items.map((i) => `${i.title}@${i.indent}${i.delete ? "x" : ""}`).join(" ");

const index = (element, id) => element.items.findIndex((i) => i.id === id);

describe("outline-designer data integrity", () => {
  let element;
  let original;

  beforeEach(async () => {
    element = await fixture(
      html`<outline-designer reduced-motion="reduce"></outline-designer>`,
    );
    element.items = fixedItems();
    original = JSON.parse(JSON.stringify(fixedItems()));
    await settle(element, 20);
  });

  it("starts from a sound outline", async () => {
    const items = await expectSound(element, original);
    expect(shape(items)).to.equal(
      "A@0 A1@1 A2@1 A2a@2 A2b@2 A3@1 B@0 C@0 C1@1 D@0 E@0",
    );
  });

  describe("single operations", () => {
    const run = async (op) => {
      await op();
      await settle(element);
      return expectSound(element, original, op.toString());
    };

    it("moves a page with its sub-pages past a sibling that has some", async () => {
      let items = await run(() => element.itemOp(index(element, "A3"), "up"));
      expect(shape(items)).to.equal(
        "A@0 A1@1 A3@1 A2@1 A2a@2 A2b@2 B@0 C@0 C1@1 D@0 E@0",
      );
      // A2 goes back above A3, then above A1
      items = await run(() => element.itemOp(index(element, "A2"), "up"));
      expect(shape(items)).to.equal(
        "A@0 A1@1 A2@1 A2a@2 A2b@2 A3@1 B@0 C@0 C1@1 D@0 E@0",
      );
      items = await run(() => element.itemOp(index(element, "A2"), "up"));
      expect(shape(items)).to.equal(
        "A@0 A2@1 A2a@2 A2b@2 A1@1 A3@1 B@0 C@0 C1@1 D@0 E@0",
      );
      items = await run(() => element.itemOp(index(element, "C"), "down"));
      // down past the locked page is allowed; only D itself is fixed
      expect(shape(items).endsWith("B@0 D@0 C@0 C1@1 E@0")).to.equal(true);
    });

    it("changes nothing at the ends of a group", async () => {
      const before = JSON.stringify(await saved(element));
      await run(() => element.itemOp(index(element, "A"), "up"));
      await run(() => element.itemOp(index(element, "A1"), "up"));
      await run(() => element.itemOp(index(element, "A3"), "down"));
      await run(() => element.itemOp(index(element, "E"), "down"));
      await run(() => element.itemOp(index(element, "A"), "out"));
      await run(() => element.itemOp(index(element, "A1"), "in"));
      expect(JSON.stringify(await saved(element))).to.equal(before);
    });

    it("never changes a locked page", async () => {
      const before = JSON.stringify(await saved(element));
      for (const action of ["up", "down", "in", "out", "delete", "duplicate"]) {
        await run(() => element.itemOp(index(element, "D"), action));
      }
      expect(JSON.stringify(await saved(element))).to.equal(before);
    });

    it("indents into the page above as its last child, with its sub-pages", async () => {
      const items = await run(() => element.itemOp(index(element, "C"), "in"));
      expect(shape(items)).to.equal(
        "A@0 A1@1 A2@1 A2a@2 A2b@2 A3@1 B@0 C@1 C1@2 D@0 E@0",
      );
      const c = items.find((i) => i.id === "C");
      expect(c.parent).to.equal("B");
      expect(c.order).to.equal(0);
      // past a sibling with children it goes last among them
      const more = await run(() => element.itemOp(index(element, "A3"), "in"));
      const a3 = more.find((i) => i.id === "A3");
      expect(a3.parent).to.equal("A2");
      expect(a3.order).to.equal(2);
      expect(shape(more).startsWith("A@0 A1@1 A2@1 A2a@2 A2b@2 A3@2 B@0")).to.be
        .true;
    });

    it("outdents to right after its parent, with its sub-pages", async () => {
      const items = await run(() =>
        element.itemOp(index(element, "A2"), "out"),
      );
      expect(shape(items)).to.equal(
        "A@0 A1@1 A3@1 A2@0 A2a@1 A2b@1 B@0 C@0 C1@1 D@0 E@0",
      );
      const top = items.filter((i) => i.parent === null).map((i) => i.id);
      expect(top).to.deep.equal(["A", "A2", "B", "C", "D", "E"]);
      expect(
        items.filter((i) => i.parent === null).map((i) => i.order),
      ).to.deep.equal([0, 1, 2, 3, 4, 5]);
    });

    it("adds a page right after a page that has sub-pages", async () => {
      const items = await run(() =>
        element.itemOp(index(element, "A2"), "add"),
      );
      const added = items.find((i) => i.new);
      expect(added.parent).to.equal("A");
      expect(shape(items)).to.contain("A2b@2 New item@1 A3@1");
      // the pages after it move down one to make room, and say so
      const a3 = items.find((i) => i.id === "A3");
      expect(added.order).to.equal(2);
      expect(a3.order).to.equal(3);
      expect(a3.modified).to.equal(true);
    });

    it("adds a page after the last page and at the very top", async () => {
      let items = await run(() => element.itemOp(index(element, "E"), "add"));
      expect(items[items.length - 1].new).to.equal(true);
      items = await run(() => element.addItemToTop());
      expect(items[0].new).to.equal(true);
      expect(items[0].parent).to.equal(null);
    });

    it("adds a sub-page last under its parent", async () => {
      const items = await run(() => element.addChildItem(index(element, "A2")));
      const added = items.find((i) => i.new);
      expect(added.parent).to.equal("A2");
      expect(added.order).to.equal(2);
      expect(shape(items)).to.contain("A2b@2 New item@2 A3@1");
    });

    it("duplicates a page with its sub-pages right after it", async () => {
      const items = await run(() =>
        element.itemOp(index(element, "A2"), "duplicate"),
      );
      const copies = items.filter((i) => i.new);
      expect(copies.length).to.equal(3);
      expect(copies.map((c) => c.duplicate)).to.deep.equal([
        "A2",
        "A2a",
        "A2b",
      ]);
      // the copied children belong to the copy, in the same order
      expect(copies[1].parent).to.equal(copies[0].id);
      expect(copies[2].parent).to.equal(copies[0].id);
      expect(copies.map((c) => c.contents)).to.deep.equal([
        "<p>Contents of A2</p>",
        "<p>Contents of A2a</p>",
        "<p>Contents of A2b</p>",
      ]);
      expect(shape(items)).to.contain("A2b@2 Copy of A2@1");
    });

    it("deletes a page with everything under it, and restores it", async () => {
      let items = await run(() =>
        element.itemOp(index(element, "A2"), "delete"),
      );
      expect(items.filter((i) => i.delete).map((i) => i.id)).to.deep.equal([
        "A2",
        "A2a",
        "A2b",
      ]);
      items = await run(() => element.itemOp(index(element, "A2"), "delete"));
      expect(items.some((i) => i.delete)).to.equal(false);
    });

    it("restoring a page inside a deleted page restores the pages above it", async () => {
      await run(() => element.itemOp(index(element, "A"), "delete"));
      const items = await run(() =>
        element.itemOp(index(element, "A2a"), "delete"),
      );
      const kept = items.filter((i) => !i.delete).map((i) => i.id);
      expect(kept.includes("A2a")).to.equal(true);
      expect(kept.includes("A2")).to.equal(true);
      expect(kept.includes("A")).to.equal(true);
    });

    it("puts nothing new inside a page marked for deletion", async () => {
      await run(() => element.itemOp(index(element, "A2"), "delete"));
      const before = JSON.stringify(await saved(element));
      // add after, duplicate, add a sub-page, indent into it
      await run(() => element.itemOp(index(element, "A2a"), "add"));
      await run(() => element.itemOp(index(element, "A2a"), "duplicate"));
      await run(() => element.addChildItem(index(element, "A2")));
      await run(() => element.itemOp(index(element, "A3"), "in"));
      expect(JSON.stringify(await saved(element))).to.equal(before);
      expect(element.liveRegionText).to.equal(
        "A2 will be deleted on save. Restore it first.",
      );
      // beside it is fine
      const items = await run(() =>
        element.itemOp(index(element, "A2"), "add"),
      );
      expect(items.filter((i) => i.new).length).to.equal(1);
      expect(items.find((i) => i.new).parent).to.equal("A");
    });

    it("deletes a selection that holds a page and its own sub-page", async () => {
      element.selectedPages = ["A2", "A2a", "C"];
      const items = await run(() => element.deleteSelected());
      expect(items.filter((i) => i.delete).map((i) => i.id)).to.deep.equal([
        "A2",
        "A2a",
        "A2b",
        "C",
        "C1",
      ]);
    });
  });

  describe("drag and drop", () => {
    const list = () => element.shadowRoot.querySelector("#list");
    const li = (id) =>
      element.shadowRoot.querySelector(`li[data-item-id="${id}"]`);
    const at = (el, fy, dx = 0) => {
      el.scrollIntoView({ block: "center" });
      const r = el.getBoundingClientRect();
      return { x: r.left + 60 + dx, y: r.top + r.height * fy };
    };
    const pointer = (target, type, p) =>
      target.dispatchEvent(
        new PointerEvent(type, {
          bubbles: true,
          composed: true,
          cancelable: true,
          clientX: p.x,
          clientY: p.y,
          pointerId: 41,
          pointerType: "mouse",
          isPrimary: true,
          button: 0,
          buttons: type === "pointerup" ? 0 : 1,
        }),
      );
    // drag a page's title onto part of another row (fy: 0.1 before,
    // 0.5 inside, 0.9 after), optionally sideways
    const drop = async (id, targetId, fy, dx = 0) => {
      const from = at(li(id).querySelector(".label.shown"), 0.5);
      pointer(li(id).querySelector(".label.shown"), "pointerdown", from);
      pointer(list(), "pointermove", { x: from.x, y: from.y + 8 });
      const to = at(li(targetId), fy, dx);
      pointer(list(), "pointermove", { x: from.x + dx, y: to.y });
      await element.updateComplete;
      pointer(list(), "pointerup", { x: from.x + dx, y: to.y });
      await settle(element, 10);
      return expectSound(element, original, `drop ${id} on ${targetId}`);
    };

    it("drops before, after and inside, carrying sub-pages", async () => {
      // before C, at the level the pointer is at: inside B
      let items = await drop("A2", "C", 0.1);
      expect(shape(items)).to.equal(
        "A@0 A1@1 A3@1 B@0 A2@1 A2a@2 A2b@2 C@0 C1@1 D@0 E@0",
      );
      expect(items.find((i) => i.id === "A2").parent).to.equal("B");
      items = await drop("E", "A1", 0.9);
      expect(shape(items)).to.contain("A1@1 E@1 A3@1");
      items = await drop("B", "C1", 0.5);
      expect(items.find((i) => i.id === "B").parent).to.equal("C1");
      expect(items.find((i) => i.id === "B").indent).to.equal(2);
    });

    it("drops into a page that has no children yet", async () => {
      const items = await drop("E", "B", 0.5);
      const e = items.find((i) => i.id === "E");
      expect(e.parent).to.equal("B");
      expect(e.order).to.equal(0);
    });

    it("will not drop a page inside a page marked for deletion", async () => {
      element.itemOp(index(element, "C"), "delete");
      await settle(element);
      const before = JSON.stringify(await saved(element));
      await drop("E", "C1", 0.5);
      expect(JSON.stringify(await saved(element))).to.equal(before);
      expect(element.liveRegionText).to.equal(
        "C1 will be deleted on save. Restore it first.",
      );
    });

    it("drops back where it started without changing anything", async () => {
      const before = JSON.stringify(await saved(element));
      await drop("A2", "A2", 0.5);
      expect(JSON.stringify(await saved(element))).to.equal(before);
    });
  });

  describe("sequences and round trips", () => {
    const sound = (context) => expectSound(element, original, context);

    it("up then down, in then out, and delete twice put everything back", async () => {
      const before = shape(await saved(element));
      const pairs = [
        ["A2", "up", "down"],
        ["B", "down", "up"],
        ["A3", "in", "out"],
        ["C", "in", "out"],
        ["A2", "delete", "delete"],
      ];
      for (const [id, there, back] of pairs) {
        element.itemOp(index(element, id), there);
        await settle(element);
        await sound(`${id} ${there}`);
        element.itemOp(index(element, id), back);
        await settle(element);
        const items = await sound(`${id} ${back}`);
        expect(shape(items), `${id} ${there}/${back}`).to.equal(before);
      }
    });

    it("keeps a big mixed edit sound at every step", async () => {
      const steps = [
        () => element.itemOp(index(element, "E"), "up"),
        () => element.itemOp(index(element, "B"), "add"),
        () => element.itemOp(index(element, "A2"), "duplicate"),
        () => element.itemOp(index(element, "C"), "in"),
        () => element.addChildItem(index(element, "C1")),
        () => element.itemOp(index(element, "A1"), "down"),
        () => element.itemOp(index(element, "A2a"), "out"),
        () => element.addItemToTop(),
        () => element.itemOp(index(element, "A"), "delete"),
        () => element.itemOp(index(element, "A2b"), "delete"),
        () => element.itemOp(index(element, "B"), "lock"),
        () => element.itemOp(index(element, "B"), "up"),
        () => element.itemOp(index(element, "E"), "add"),
        () => {
          element.selectedPages = [element.items[1].id, element.items[3].id];
          element.deleteSelected();
        },
      ];
      for (const [n, step] of steps.entries()) {
        await step();
        await settle(element);
        await sound(`step ${n + 1}: ${step.toString()}`);
      }
    });

    it("undoes a chain of changes one at a time back to the start", async () => {
      const snapshots = [JSON.stringify(await saved(element))];
      const changes = [
        () => element._moveByKeyboard(index(element, "C"), "up"),
        () => element._addAfterAndEdit(index(element, "A2")),
        () => element._duplicate(index(element, "C")),
        () => element._toggleDelete(index(element, "A")),
        () => element.addChildItem(index(element, "E")),
        () => element._moveByKeyboard(index(element, "E"), "in"),
      ];
      // undo offers the last change only, so undo each right after it
      for (const change of changes) {
        await change();
        await settle(element, 10);
        await sound(change.toString());
        element.undo();
        await settle(element, 10);
        expect(
          JSON.stringify(await saved(element)),
          change.toString(),
        ).to.equal(snapshots[snapshots.length - 1]);
        await change();
        await settle(element, 10);
        snapshots.push(JSON.stringify(await saved(element)));
      }
      await sound("after the chain");
    });
  });

  describe("seeded random edits", () => {
    const OPS = [
      "up",
      "down",
      "in",
      "out",
      "delete",
      "duplicate",
      "add",
      "addChild",
      "addTop",
      "lock",
      "deleteSelected",
      "fold",
      "hideDeleted",
      "undo",
      "drag",
      "drag",
      "drag",
    ];

    // drag a random visible page onto a random part of a random row,
    // sometimes sideways to change level, through real pointer events
    async function randomDrag(random) {
      const rows = [
        ...element.shadowRoot.querySelectorAll("li.item[data-item-id]"),
      ].filter((li) => !li.hidden && li.offsetParent !== null);
      if (rows.length < 2) return;
      const source = rows[Math.floor(random() * rows.length)];
      const target = rows[Math.floor(random() * rows.length)];
      const label = source.querySelector(".label.shown");
      const list = element.shadowRoot.querySelector("#list");
      const send = (el, type, x, y) =>
        el.dispatchEvent(
          new PointerEvent(type, {
            bubbles: true,
            composed: true,
            cancelable: true,
            clientX: x,
            clientY: y,
            pointerId: 51,
            pointerType: "mouse",
            isPrimary: true,
            button: 0,
            buttons: type === "pointerup" ? 0 : 1,
          }),
        );
      label.scrollIntoView({ block: "center" });
      const from = label.getBoundingClientRect();
      const x = from.left + 20;
      send(label, "pointerdown", x, from.top + from.height / 2);
      send(list, "pointermove", x, from.top + from.height / 2 + 8);
      if (!element._drag) {
        send(list, "pointerup", x, from.top);
        return;
      }
      target.scrollIntoView({ block: "center" });
      const to = target.getBoundingClientRect();
      const y = to.top + to.height * (0.05 + random() * 0.9);
      const dx = Math.round((random() - 0.5) * 120);
      send(list, "pointermove", x + dx, y);
      await element.updateComplete;
      send(list, "pointerup", x + dx, y);
      await settle(element, 10);
    }

    // every operation a person can reach, through the same paths the UI uses
    async function apply(op, random) {
      const items = element.items;
      const pick = () => Math.floor(random() * items.length);
      const i = pick();
      switch (op) {
        case "up":
        case "down":
        case "in":
        case "out":
          return element._moveByKeyboard(i, op);
        case "delete":
          return element._toggleDelete(i);
        case "duplicate":
          return element._duplicate(i);
        case "add":
          return element._addAfterAndEdit(i);
        case "addChild":
          return element.addChildItem(i);
        case "addTop":
          return element._addTop();
        case "lock":
          return element._toggleLock(i);
        case "deleteSelected":
          element.selectedPages = [items[pick()].id, items[pick()].id];
          return element._deleteSelectedShown();
        case "fold":
          if (element.hasChildren(items[i].id)) {
            items[i].collapsed = !items[i].collapsed;
            element.requestUpdate();
          }
          return null;
        case "hideDeleted":
          element.hideDelete = !element.hideDelete;
          return null;
        case "undo":
          return element.undo();
        case "drag":
          return randomDrag(random);
        default:
          return null;
      }
    }

    // stop naming a page that was just added, as Escape would
    const stopEditing = async () => {
      const editing = element.shadowRoot.querySelector(
        '.label-edit[contenteditable="true"]',
      );
      if (editing) {
        editing.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "Escape",
            bubbles: true,
            composed: true,
          }),
        );
        await settle(element);
      }
    };

    const SEEDS = 16;
    const STEPS = 30;
    for (let seed = 1; seed <= SEEDS; seed++) {
      it(`stays sound through ${STEPS} random edits (seed ${seed})`, async () => {
        const random = rng(seed * 7919);
        const start = randomItems(random);
        element.items = JSON.parse(JSON.stringify(start));
        await settle(element, 10);
        const base = JSON.parse(JSON.stringify(start));
        const log = [];
        let problems = outlineProblems(await saved(element), base);
        expect(
          problems,
          `seed ${seed} start\n${problems.join("\n")}`,
        ).to.deep.equal([]);
        for (let step = 0; step < STEPS; step++) {
          const op = OPS[Math.floor(random() * OPS.length)];
          const before = JSON.stringify(await saved(element));
          const offered = element._undo ? element._undo.items : null;
          await apply(op, random);
          await settle(element);
          await stopEditing();
          const after = await saved(element);
          log.push(`${op}: ${shape(after)}`);
          problems = outlineProblems(after, base);
          expect(
            problems,
            `seed ${seed}, step ${step + 1} (${op})\n${problems.join("\n")}\n\n${log.join("\n")}`,
          ).to.deep.equal([]);
          // undo gives back exactly what the change started from
          if (op === "undo" && offered) {
            expect(
              JSON.stringify(after),
              `seed ${seed}, step ${step + 1}: undo`,
            ).to.equal(JSON.stringify(JSON.parse(JSON.stringify(offered))));
          }
          if (op !== "undo" && op !== "fold" && op !== "hideDeleted") {
            // a change that did nothing leaves the data exactly as it was
            if (!element._undo || element._undo.items === offered) {
              expect(
                JSON.stringify(after),
                `seed ${seed}, step ${step + 1} (${op}) changed data without offering undo`,
              ).to.equal(before);
            }
          }
        }
      });
    }
  });
});
