import { fixture, expect, html } from "@open-wc/testing";
import "../outline-designer.js";

// a large outline stays responsive: which rows are visible is worked out
// in one pass (it used to walk every page's ancestors with a search of the
// whole list, once per row, on every render: hover and focus each cost a
// full quadratic render), and a move's view transition only names the rows
// on screen (naming every row made the browser capture and animate
// hundreds of rows nobody could see).

// a site shaped like a real one: units, lessons, sub-pages
function bigOutline(units = 12, lessons = 8, subs = 2) {
  const items = [];
  let n = 0;
  for (let u = 0; u < units; u++) {
    const uid = "u" + u;
    items.push(page(uid, null, 0, u));
    for (let l = 0; l < lessons; l++) {
      const lid = uid + "l" + l;
      items.push(page(lid, uid, 1, l));
      for (let s = 0; s < subs; s++) {
        items.push(page(lid + "s" + s, lid, 2, s));
      }
    }
  }
  function page(id, parent, indent, order) {
    n++;
    return {
      id,
      title: "Page " + n,
      slug: "page-" + n,
      location: "pages/" + id + "/index.html",
      order,
      parent,
      indent,
      contents: "<p>x</p>",
      metadata: {},
    };
  }
  return items;
}

// the old way: every page's ancestors, each looked up in the whole list
function naiveVisible(items, hideDelete) {
  const collapsedAbove = (item) => {
    let parent = items.find((i) => i.id == item.parent);
    let list = "";
    while (parent) {
      if (parent.collapsed && parent.id) list += "x";
      parent = items.find((i) => i.id == parent.parent);
    }
    return list;
  };
  return items
    .filter((i) => collapsedAbove(i) === "" && !(hideDelete && i.delete))
    .map((i) => i.id);
}

async function settle(el) {
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 30));
  await el.updateComplete;
}

describe("outline-designer on a large outline", () => {
  it("finds the same visible rows as walking every page's ancestors", async () => {
    const el = await fixture(html`<outline-designer></outline-designer>`);
    let seed = 7;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let run = 0; run < 25; run++) {
      const items = bigOutline(4, 4, 2);
      items.forEach((i) => {
        if (random() < 0.25) i.collapsed = true;
        if (random() < 0.15) i.delete = true;
      });
      el.items = items;
      el.hideDelete = random() < 0.5;
      expect(el._visibleItems().map((i) => i.id)).to.deep.equal(
        naiveVisible(items, el.hideDelete),
      );
    }
  });

  it("keeps getItemParentsCollapsed's answer", async () => {
    const el = await fixture(html`<outline-designer></outline-designer>`);
    const items = bigOutline(2, 2, 2);
    items[0].collapsed = true;
    items[1].collapsed = true;
    el.items = items;
    // u0 > u0l0 > u0l0s0: both ancestors are folded, nearest first
    expect(el.getItemParentsCollapsed(items[2])).to.equal(
      "collapsed-by-u0l0 collapsed-by-u0 ",
    );
    expect(el.getItemParentsCollapsed(items[0])).to.equal("");
  });

  it("renders without walking the outline once per row", async () => {
    const el = await fixture(
      html`<outline-designer .items="${bigOutline()}"></outline-designer>`,
    );
    await settle(el);
    let visibleCalls = 0;
    let parentWalks = 0;
    const visible = el._visibleItems;
    const walk = el.getItemParentsCollapsed;
    el._visibleItems = function () {
      visibleCalls++;
      return visible.call(this);
    };
    el.getItemParentsCollapsed = function (item) {
      parentWalks++;
      return walk.call(this, item);
    };
    try {
      el.requestUpdate();
      await el.updateComplete;
    } finally {
      delete el._visibleItems;
      delete el.getItemParentsCollapsed;
    }
    // 300 rows, worked out a couple of times per render, not once a row
    expect(el.items.length).to.be.at.least(300);
    expect(visibleCalls).to.be.at.most(3);
    expect(parentWalks).to.equal(0);
  });

  it("names only the rows on screen for a move's view transition", async () => {
    const wrap = await fixture(html`
      <div style="height: 500px; display: flex; flex-direction: column">
        <outline-designer
          style="flex: 1 1 auto; min-height: 0; overflow: auto"
          motion-profile="keyboard"
          reduced-motion="full"
          .items="${bigOutline()}"
        ></outline-designer>
      </div>
    `);
    const el = wrap.querySelector("outline-designer");
    await settle(el);
    const tree = el.shadowRoot.querySelector(".tree-wrap");
    if (typeof tree.startViewTransition !== "function") {
      // nothing to name in a browser without scoped view transitions
      return;
    }
    el.scrollTop = 1500;
    await new Promise((r) => requestAnimationFrame(r));
    const rows = [...el.shadowRoot.querySelectorAll("li.item")];
    const box = el.getBoundingClientRect();
    const target = rows.find((li) => {
      const r = li.getBoundingClientRect();
      return r.top > box.top + 150 && r.bottom < box.bottom - 150;
    });
    const index = el.items.findIndex(
      (i) => i.id === target.getAttribute("data-item-id"),
    );
    // let the tall tree use a view transition, to see what it names
    el._vtMaxHeight = () => 1000000;
    let named = -1;
    const start = tree.startViewTransition;
    tree.startViewTransition = function (cb) {
      named = [...el.shadowRoot.querySelectorAll("[style]")].filter((n) =>
        /view-transition-name/.test(n.getAttribute("style")),
      ).length;
      return start.call(this, cb);
    };
    try {
      await el._moveByKeyboard(index, "down");
    } finally {
      delete tree.startViewTransition;
    }
    expect(named).to.be.greaterThan(0);
    // the outline has 300 rows, about 15 fit in 500px
    expect(named).to.be.below(rows.length / 3);
    // and the list of named rows is let go once the move is shown
    await settle(el);
    expect(el._vtKeys).to.equal(null);
  });

  it("slides a tall tree's rows instead of snapshotting the whole tree", async () => {
    const el = await fixture(
      html`<outline-designer
        motion-profile="keyboard"
        reduced-motion="full"
        .items="${bigOutline()}"
      ></outline-designer>`,
    );
    await settle(el);
    const tree = el.shadowRoot.querySelector(".tree-wrap");
    expect(tree.offsetHeight).to.be.greaterThan(el._vtMaxHeight());
    let started = false;
    const start = tree.startViewTransition;
    tree.startViewTransition = function (cb) {
      started = true;
      return start ? start.call(this, cb) : cb();
    };
    const id = el.items[5].id;
    try {
      await el._moveByKeyboard(5, "down");
    } finally {
      delete tree.startViewTransition;
    }
    expect(started).to.equal(false);
    // the move still happened
    expect(el.items.findIndex((i) => i.id === id)).to.not.equal(5);
  });

  it("makes a page's Add buttons only once its row is near the view", async () => {
    const gizmos = ["a", "b", "c", "d", "e", "f", "g"].map((t) => ({
      tag: "p",
      icon: "editor:format-paragraph",
      title: "Thing " + t,
    }));
    const items = bigOutline(5, 6, 1).slice(0, 60);
    items.forEach((i) => {
      i.showContent = true;
    });
    const wrap = await fixture(html`
      <div style="height: 500px; display: flex; flex-direction: column">
        <outline-designer
          style="flex: 1 1 auto; min-height: 0; overflow: auto"
          .items="${items}"
        ></outline-designer>
      </div>
    `);
    const el = wrap.querySelector("outline-designer");
    await settle(el);
    // open every page's content structure (the first sync rebuilds items,
    // and the HAX store sets the blocks on load)
    el.haxGizmos = gizmos;
    el.items.forEach((i) => {
      i.showContent = true;
    });
    el.requestUpdate();
    await settle(el);
    await new Promise((r) => setTimeout(r, 100));
    await settle(el);
    const rows = () => [
      ...el.shadowRoot.querySelectorAll("li.content-adding-operations"),
    ];
    const buttons = () =>
      el.shadowRoot.querySelectorAll("li.content-adding-operations .operation")
        .length;
    expect(rows().length).to.equal(60);
    // only the rows near the top have buttons
    expect(buttons()).to.be.greaterThan(0);
    expect(buttons()).to.be.below((60 * gizmos.length) / 2);
    // a waiting row holds the height of a finished one
    const done = rows().find((r) => !r.hasAttribute("data-ops-pending"));
    const waiting = rows().find((r) => r.hasAttribute("data-ops-pending"));
    expect(Math.round(waiting.getBoundingClientRect().height)).to.equal(
      Math.round(done.getBoundingClientRect().height),
    );
    // scrolling to the end makes the last rows' buttons
    el.scrollTop = el.scrollHeight;
    await new Promise((r) => setTimeout(r, 150));
    await settle(el);
    const last = rows()[rows().length - 1];
    expect(last.hasAttribute("data-ops-pending")).to.equal(false);
    expect(last.querySelectorAll(".operation").length).to.equal(gizmos.length);
    // and they still add content to their page
    const id = last.getAttribute("data-item-for-content-id");
    const before = el.items.find((i) => i.id === id).contents;
    last.querySelector(".operation").click();
    await settle(el);
    expect(el.items.find((i) => i.id === id).contents).to.not.equal(before);
  });

  it("makes every Add button at once for a few open pages", async () => {
    const gizmos = [{ tag: "p", icon: "editor:format-paragraph", title: "P" }];
    const items = bigOutline(1, 4, 0);
    items.forEach((i) => {
      i.showContent = true;
    });
    const el = await fixture(
      html`<outline-designer .items="${items}"></outline-designer>`,
    );
    await settle(el);
    el.haxGizmos = gizmos;
    el.items.forEach((i) => {
      i.showContent = true;
    });
    el.requestUpdate();
    await settle(el);
    expect(
      el.shadowRoot.querySelectorAll("li.content-adding-operations").length,
    ).to.equal(5);
    expect(
      el.shadowRoot.querySelectorAll(
        "li.content-adding-operations[data-ops-pending]",
      ).length,
    ).to.equal(0);
  });
});
