import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../map-menu.js";
import { buildMenuTree } from "../lib/map-menu-tree.js";

// lazy-children (opt-in, used by site-menu): a submenu's children render the
// first time it opens, or when they contain the selected item. Off by
// default, so other map-menu users see no change.

// the original algorithm, kept here as the reference for buildMenuTree
function legacyTree(data) {
  const items = [];
  data.forEach((element) => {
    if (!element.parent) {
      items.push(element);
    }
  });
  const setChildren = (item) => {
    item.children = data.filter((d) => item.id === d.parent);
    item.children.forEach((child) => setChildren(child));
  };
  items.forEach((item) => setChildren(item));
  return items;
}
const clone = (v) => JSON.parse(JSON.stringify(v));
const shape = (items) =>
  items.map((i) => ({
    id: i.id,
    title: i.title,
    children: i.children ? shape(i.children) : null,
  }));

// modules -> lessons -> pages, ids like m1, m1-l2, m1-l2-p3
function outline(modules = 3, lessons = 2, pages = 3, extra = {}) {
  const items = [];
  let order = 0;
  for (let m = 1; m <= modules; m++) {
    items.push({
      id: `m${m}`,
      title: `Module ${m}`,
      slug: `m${m}`,
      parent: null,
      order: order++,
      metadata: {},
    });
    for (let l = 1; l <= lessons; l++) {
      items.push({
        id: `m${m}-l${l}`,
        title: `Lesson ${m}.${l}`,
        slug: `m${m}-l${l}`,
        parent: `m${m}`,
        order: order++,
        metadata: {},
      });
      for (let p = 1; p <= pages; p++) {
        items.push({
          id: `m${m}-l${l}-p${p}`,
          title: `Page ${m}.${l}.${p}`,
          slug: `m${m}-l${l}-p${p}`,
          parent: `m${m}-l${l}`,
          order: order++,
          metadata: {},
        });
      }
    }
  }
  return { items, ...extra };
}

const deepQueryAll = (root, sel) =>
  Array.from(root.shadowRoot.querySelectorAll(sel));
const settle = async (el) => {
  await el.updateComplete;
  for (let i = 0; i < 4; i++) {
    await aTimeout(0);
  }
};

describe("buildMenuTree", () => {
  it("matches the original tree for ordinary outlines", () => {
    const data = outline(4, 3, 3).items;
    expect(shape(buildMenuTree(clone(data)))).to.deep.equal(
      shape(legacyTree(clone(data))),
    );
  });

  it("matches for unordered data, empty-string / undefined parents and orphans", () => {
    const data = [
      { id: "c", parent: "a", title: "C" },
      { id: "a", parent: "", title: "A" },
      { id: "orphan", parent: "missing", title: "Orphan" },
      { id: "b", title: "B" },
      { id: "d", parent: "a", title: "D" },
      { id: "e", parent: "c", title: "E" },
    ];
    const a = clone(data);
    const b = clone(data);
    expect(shape(buildMenuTree(a))).to.deep.equal(shape(legacyTree(b)));
    // unreachable items are left untouched, as before
    expect(a.find((i) => i.id === "orphan").children).to.equal(undefined);
    expect(b.find((i) => i.id === "orphan").children).to.equal(undefined);
  });

  it("gives every item its own children array, like filter() did", () => {
    const data = [
      { id: "a", parent: null },
      { id: "a", parent: null },
      { id: "x", parent: "a" },
    ];
    const roots = buildMenuTree(data);
    expect(roots[0].children).to.not.equal(roots[1].children);
    expect(roots[0].children.map((c) => c.id)).to.deep.equal(["x"]);
  });

  it("survives an item that is its own ancestor (the original overflowed the stack)", () => {
    const data = [
      { id: undefined, parent: undefined, title: "no id" },
      { id: "k", parent: undefined },
    ];
    expect(() => buildMenuTree(data)).to.not.throw();
  });

  it("returns [] for non-arrays", () => {
    expect(buildMenuTree(null)).to.deep.equal([]);
    expect(buildMenuTree({})).to.deep.equal([]);
  });
});

describe("map-menu lazy-children", () => {
  it("is off by default: every item renders up front", async () => {
    const el = await fixture(
      html`<map-menu .manifest="${outline(3, 2, 3)}"></map-menu>`,
    );
    await settle(el);
    expect(el.lazyChildren).to.equal(false);
    // 3 modules -> submenus, 6 lessons -> submenus, 18 pages -> items
    expect(deepQueryAll(el, "map-menu-submenu").length).to.equal(9);
    expect(deepQueryAll(el, "map-menu-item").length).to.equal(18);
  });

  it("builds the same nested items as without it", async () => {
    const plain = await fixture(
      html`<map-menu .manifest="${outline(3, 2, 2)}"></map-menu>`,
    );
    const lazy = await fixture(
      html`<map-menu lazy-children .manifest="${outline(3, 2, 2)}"></map-menu>`,
    );
    expect(shape(lazy.items)).to.deep.equal(shape(plain.items));
  });

  it("renders only the top level until a submenu opens", async () => {
    const el = await fixture(
      html`<map-menu lazy-children .manifest="${outline(3, 2, 3)}"></map-menu>`,
    );
    await settle(el);
    // top level only: 3 module submenus, nothing inside them
    expect(deepQueryAll(el, "map-menu-submenu").length).to.equal(3);
    expect(deepQueryAll(el, "map-menu-item").length).to.equal(0);
    const m2 = deepQueryAll(el, "map-menu-submenu").find((s) => s.id === "m2");
    m2.opened = true;
    await settle(el);
    // m2's two lessons appear (collapsed, so their pages are not built yet)
    const ids = deepQueryAll(el, "map-menu-submenu").map((s) => s.id);
    expect(ids).to.include.members(["m1", "m2", "m3", "m2-l1", "m2-l2"]);
    expect(ids).to.not.include("m1-l1");
    expect(deepQueryAll(el, "map-menu-item").length).to.equal(0);
  });

  it("always renders the path to the selected item, which then opens itself", async () => {
    const el = await fixture(
      html`<map-menu
        lazy-children
        selected="m3-l2-p2"
        .manifest="${outline(3, 2, 3)}"
      ></map-menu>`,
    );
    await settle(el);
    const active = deepQueryAll(el, "map-menu-item").find(
      (i) => i.id === "m3-l2-p2",
    );
    expect(active).to.exist;
    // its ancestors opened as before (active-item from the item)
    const m3 = deepQueryAll(el, "map-menu-submenu").find((s) => s.id === "m3");
    const l2 = deepQueryAll(el, "map-menu-submenu").find(
      (s) => s.id === "m3-l2",
    );
    expect(m3.opened).to.equal(true);
    expect(l2.opened).to.equal(true);
    // other branches stay unbuilt
    expect(
      deepQueryAll(el, "map-menu-submenu").some((s) => s.id === "m1-l1"),
    ).to.equal(false);
  });

  it("builds a branch when navigation selects something inside it", async () => {
    const el = await fixture(
      html`<map-menu
        lazy-children
        selected="m1"
        .manifest="${outline(3, 2, 3)}"
      ></map-menu>`,
    );
    await settle(el);
    expect(
      deepQueryAll(el, "map-menu-item").some((i) => i.id === "m2-l1-p3"),
    ).to.equal(false);
    el.selected = "m2-l1-p3";
    await settle(el);
    expect(
      deepQueryAll(el, "map-menu-item").some((i) => i.id === "m2-l1-p3"),
    ).to.equal(true);
  });

  it("keeps a branch built after it closes again", async () => {
    const el = await fixture(
      html`<map-menu lazy-children .manifest="${outline(2, 2, 1)}"></map-menu>`,
    );
    await settle(el);
    const m1 = deepQueryAll(el, "map-menu-submenu").find((s) => s.id === "m1");
    m1.opened = true;
    await settle(el);
    m1.opened = false;
    await settle(el);
    expect(
      deepQueryAll(el, "map-menu-submenu").some((s) => s.id === "m1-l1"),
    ).to.equal(true);
  });

  it("renders far fewer elements for a large outline", async () => {
    const big = outline(20, 4, 5); // 500 items
    const plain = await fixture(
      html`<map-menu .manifest="${clone(big)}"></map-menu>`,
    );
    const lazy = await fixture(
      html`<map-menu lazy-children .manifest="${clone(big)}"></map-menu>`,
    );
    await settle(plain);
    await settle(lazy);
    const count = (el) =>
      deepQueryAll(el, "map-menu-item").length +
      deepQueryAll(el, "map-menu-submenu").length;
    expect(count(plain)).to.equal(500);
    expect(count(lazy)).to.equal(20);
  });
});
