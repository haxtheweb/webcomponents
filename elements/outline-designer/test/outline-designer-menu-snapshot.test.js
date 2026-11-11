import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import { writeFile } from "@web/test-runner-commands";
import "../outline-designer.js";

// Regression guard for the per-row page actions menu. Every row's menu
// markup (light DOM plus each button's rendered shadow DOM) and the result
// of pressing every menu item on a set of rows are compared against
// fixtures captured from master before the menu template was refactored.
// If the fixture file is missing the test fails (and, when run with the
// filePlugin from @web/test-runner-commands, writes it), so a deleted
// fixture can never pass silently.
const FIXTURE = "fixtures/outline-designer-menu.snapshot.json";

// covers every state the menu reads (lock, delete, contents present or
// empty, hideContentOps) plus the row states around it (nesting, first and
// last siblings, collapsed parent, unpublished, new, modified, current)
function makeItems() {
  return [
    {
      id: "p1",
      title: "Top First",
      slug: "top-first",
      location: "pages/top-first/index.html",
      order: 0,
      parent: null,
      indent: 0,
      contents: "<h2>Heading</h2><p>Para</p>",
      metadata: { locked: false, published: true },
    },
    {
      id: "c1",
      title: "Child First",
      slug: "child-first",
      location: "pages/child-first/index.html",
      order: 0,
      parent: "p1",
      indent: 1,
      contents: "<p>Child</p>",
      metadata: { locked: false, published: false },
    },
    {
      id: "g1",
      title: "Grandchild Only",
      slug: "grandchild-only",
      location: "pages/grandchild-only/index.html",
      order: 0,
      parent: "c1",
      indent: 2,
      contents: "",
      metadata: { locked: false },
    },
    {
      id: "c2",
      title: "Child Locked",
      slug: "child-locked",
      location: "pages/child-locked/index.html",
      order: 1,
      parent: "p1",
      indent: 1,
      contents: "<p>Locked child</p>",
      metadata: { locked: true },
    },
    {
      id: "c3",
      title: "Child Last Empty",
      slug: "child-last-empty",
      location: "pages/child-last-empty/index.html",
      order: 2,
      parent: "p1",
      indent: 1,
      contents: "",
      metadata: { locked: false },
    },
    {
      id: "p2",
      title: "Top Collapsed",
      slug: "top-collapsed",
      location: "pages/top-collapsed/index.html",
      order: 1,
      parent: null,
      indent: 0,
      collapsed: true,
      contents: "<p>Two</p>",
      metadata: { locked: false },
    },
    {
      id: "c4",
      title: "Hidden Child",
      slug: "hidden-child",
      location: "pages/hidden-child/index.html",
      order: 0,
      parent: "p2",
      indent: 1,
      contents: "<p>Hidden</p>",
      metadata: { locked: false },
    },
    {
      id: "p3",
      title: "Top Deleted",
      slug: "top-deleted",
      location: "pages/top-deleted/index.html",
      order: 2,
      parent: null,
      indent: 0,
      delete: true,
      contents: "<p>Gone</p>",
      metadata: { locked: false },
    },
    {
      id: "p4",
      title: "Top Locked Deleted",
      slug: "top-locked-deleted",
      location: "pages/top-locked-deleted/index.html",
      order: 3,
      parent: null,
      indent: 0,
      delete: true,
      contents: "",
      metadata: { locked: true },
    },
    {
      id: "p5",
      title: "Top New Modified",
      slug: "top-new-modified",
      location: "pages/top-new-modified/index.html",
      order: 4,
      parent: null,
      indent: 0,
      new: true,
      modified: true,
      metadata: { locked: false },
    },
    {
      id: "p6",
      title: "Top Last Locked",
      slug: "top-last-locked",
      location: "pages/top-last-locked/index.html",
      order: 5,
      parent: null,
      indent: 0,
      contents: "<p>Last</p>",
      metadata: { locked: true, published: false },
    },
  ];
}

const settle = async (element) => {
  await element.updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 60));
  await element.updateComplete;
};

// stable markup: comments dropped, attributes sorted, whitespace collapsed
function serialize(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent.replace(/\s+/g, " ").trim();
    return text ? text : "";
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }
  if (node.tagName === "STYLE") {
    return "<style></style>";
  }
  const attrs = [...node.attributes]
    .map((a) => `${a.name}="${a.value}"`)
    .sort()
    .join(" ");
  let inner = [...node.childNodes].map(serialize).join("");
  // simple-icon-lite draws from its icon attribute with a random filter
  // id, so its own shadow is left out; the attribute is compared instead
  if (node.shadowRoot && node.tagName !== "SIMPLE-ICON-LITE") {
    inner =
      `#shadow(${[...node.shadowRoot.childNodes].map(serialize).join("")})` +
      inner;
  }
  const tag = node.tagName.toLowerCase();
  return `<${tag}${attrs ? " " + attrs : ""}>${inner}</${tag}>`;
}

// each row's menu as it is once opened (entries are rendered on open)
async function menuSnapshot(element) {
  const out = {};
  for (const li of element.shadowRoot.querySelectorAll("li[data-item-id]")) {
    const menu = await element._menuReady(li);
    const attrs = [...menu.attributes]
      .map((a) => `${a.name}="${a.value}"`)
      .sort()
      .join(" ");
    out[li.getAttribute("data-item-id")] = {
      menu: attrs,
      items: [...menu.children].map(serialize),
    };
  }
  return out;
}

// item data after an action, with ids minted by add/duplicate normalized
function idNormalizer() {
  const known = new Set(makeItems().map((i) => i.id));
  const minted = {};
  return (id) => {
    if (id === null || id === undefined || id === "" || known.has(id)) {
      return id;
    }
    if (!(id in minted)) minted[id] = `new-${Object.keys(minted).length}`;
    return minted[id];
  };
}

function dataSnapshot(element, norm) {
  return element.items.map((i) => ({
    id: norm(i.id),
    title: i.title,
    parent: norm(i.parent),
    order: i.order,
    indent: i.indent,
    delete: !!i.delete,
    new: !!i.new,
    modified: !!i.modified,
    collapsed: !!i.collapsed,
    showContent: !!i.showContent,
    locked: !!(i.metadata && i.metadata.locked),
    published: i.metadata ? i.metadata.published : undefined,
  }));
}

const ACTIONS = [
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
];
const ACTION_ROWS = ["p1", "c1", "c2", "c3", "p3", "p6"];

async function build(hideContentOps = false) {
  const element = await fixture(
    html`<outline-designer reduced-motion="reduce"></outline-designer>`,
  );
  element.hideContentOps = hideContentOps;
  element.activeId = "c1";
  element.items = makeItems();
  await settle(element);
  return element;
}

async function captureActions() {
  const results = {};
  for (const id of ACTION_ROWS) {
    for (const action of ACTIONS) {
      const element = await build();
      const events = [];
      const dispatch = element.dispatchEvent.bind(element);
      element.dispatchEvent = (ev) => {
        const detail = ev.detail || {};
        // how many renders an action takes depends on timing, not on
        // what it does, so only the other events are compared
        if (ev.type === "outline-designer-rendered") {
          return dispatch(ev);
        }
        events.push(
          ev.type + (detail.href !== undefined ? `:${detail.href}` : ""),
        );
        // keep the test page from navigating on goto
        if (ev.type === "outline-designer-request-navigate") {
          ev.preventDefault();
          return false;
        }
        return dispatch(ev);
      };
      const li = element.shadowRoot.querySelector(`li[data-item-id="${id}"]`);
      li.querySelector(".actions-menu-button").click();
      await waitUntil(
        () => li.querySelector(".actions-menu").open,
        "menu opens",
      );
      const btn = li.querySelector(
        `.actions-menu simple-toolbar-button[value="${action}"]`,
      );
      if (btn) {
        // simple-toolbar-button overrides click(); press its real button
        btn.shadowRoot.querySelector("button").click();
      }
      await settle(element);
      await settle(element);
      const norm = idNormalizer();
      const data = dataSnapshot(element, norm);
      const editing = element.shadowRoot.querySelector(
        '[contenteditable="true"]',
      );
      const active = element.shadowRoot.activeElement;
      results[`${id}:${action}`] = {
        present: !!btn,
        events,
        menuOpen: li.querySelector(".actions-menu").open === true,
        editing: editing
          ? norm(editing.closest("li").getAttribute("data-item-id"))
          : null,
        active: active
          ? `${active.tagName.toLowerCase()}.${active.className}@${
              active.closest("li[data-item-id]")
                ? norm(
                    active
                      .closest("li[data-item-id]")
                      .getAttribute("data-item-id"),
                  )
                : ""
            }`
          : null,
        data,
      };
      element.dispatchEvent = dispatch;
      // one outline per action: a menu left open (a disabled entry was
      // pressed) is modal and would make the next outline inert
      element.shadowRoot.querySelectorAll(".actions-menu").forEach((m) => {
        if (m.open) m.close();
      });
      element.remove();
    }
  }
  return results;
}

describe("outline-designer page actions menu snapshot", function () {
  this.timeout(120000);
  let fixtureData;

  before(async () => {
    const res = await fetch(new URL(FIXTURE, import.meta.url));
    fixtureData = res.ok ? await res.json() : null;
  });

  it("matches the master fixtures for menu markup and menu actions", async () => {
    // round-trip through JSON so undefined fields compare like the fixture
    const current = JSON.parse(
      JSON.stringify({
        menus: await menuSnapshot(await build(false)),
        menusHideContentOps: await menuSnapshot(await build(true)),
        actions: await captureActions(),
      }),
    );
    if (!fixtureData) {
      await writeFile({
        path: FIXTURE,
        content: JSON.stringify(current, null, 2) + "\n",
      });
      expect.fail(`${FIXTURE} was missing; it has been written, re-run`);
    }
    // sanity: the fixture covers the states it claims to
    expect(Object.keys(current.menus).length).to.be.greaterThan(8);
    for (const id of Object.keys(fixtureData.menus)) {
      expect(current.menus[id], `menu ${id}`).to.deep.equal(
        fixtureData.menus[id],
      );
      expect(
        current.menusHideContentOps[id],
        `menu ${id} hideContentOps`,
      ).to.deep.equal(fixtureData.menusHideContentOps[id]);
    }
    expect(Object.keys(current.menus)).to.deep.equal(
      Object.keys(fixtureData.menus),
    );
    for (const key of Object.keys(fixtureData.actions)) {
      expect(current.actions[key], `action ${key}`).to.deep.equal(
        fixtureData.actions[key],
      );
    }
    expect(Object.keys(current.actions)).to.deep.equal(
      Object.keys(fixtureData.actions),
    );
  });
});
