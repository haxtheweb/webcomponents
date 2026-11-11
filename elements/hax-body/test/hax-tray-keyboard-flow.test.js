/**
 * Keyboard flow: hax-tray's own menu bar and the buttons inside its panels
 * (Source actions, the Structure outline, the Add block grid). Every
 * hax-toolbar-item / hax-tray-button the editor shows must be reachable
 * with the keyboard: either an ordinary Tab stop, or the one Tab stop of a
 * toolbar (hax-toolbar, simple-button-grid) that moves between its buttons
 * with the arrow keys. Real key presses only; see
 * scripts/test-setup/keyboard-flow.js for the per-stop invariants.
 */
import { fixture, expect, html } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import { HAXStore } from "../lib/hax-store.js";
import "../lib/hax-tray.js";
import "../hax-body.js";
import {
  press,
  settle,
  waitFor,
  deepActiveElement,
  expectGoodFocusStop,
  positiveTabindexIn,
  hiddenReason,
  describeEl,
} from "../../../scripts/test-setup/keyboard-flow.js";

const HAX_BUTTONS = new Set([
  "HAX-TOOLBAR-ITEM",
  "HAX-TRAY-BUTTON",
  "HAX-CONTEXT-ITEM",
  "HAX-CONTEXT-ITEM-TEXTOP",
]);

// every hax-toolbar-item family button inside `host` (composed tree)
function haxButtonsIn(host) {
  const out = [];
  const walk = (node) => {
    const kids = node.children ? Array.from(node.children) : [];
    for (const kid of kids) {
      if (HAX_BUTTONS.has(kid.tagName)) out.push(kid);
      if (kid.shadowRoot) walk(kid.shadowRoot);
      walk(kid);
    }
  };
  if (host.shadowRoot) walk(host.shadowRoot);
  walk(host);
  return out;
}

const innerButton = (host) =>
  host.shadowRoot && host.shadowRoot.querySelector("#button");

// the shadow host whose inner #button holds focus
const focusedHost = () => {
  const el = deepActiveElement();
  const root = el && el.getRootNode();
  return root && root.host && HAX_BUTTONS.has(root.host.tagName)
    ? root.host
    : null;
};

const label = (el) => {
  if (!el || !el.getAttribute) return "";
  const host = el.getRootNode().host;
  return (
    el.getAttribute("aria-label") ||
    el.getAttribute("label") ||
    (host && host.getAttribute && host.getAttribute("label")) ||
    (el.textContent || "").trim()
  );
};

const GIZMOS = [
  { title: "Alpha block", tag: "p", icon: "icons:add", tags: ["Text"] },
  { title: "Beta block", tag: "h2", icon: "icons:add", tags: ["Text"] },
  {
    title: "Gamma block",
    tag: "blockquote",
    icon: "icons:add",
    tags: ["Text"],
  },
].map((g) => ({ handles: [], meta: {}, ...g }));

describe("keyboard flow: hax-tray menu bar and panel buttons", function () {
  this.timeout(30000);
  let wrapper;
  let tray;
  let body;
  let before;
  let after;
  let savedGizmos;

  beforeEach(async () => {
    // a desktop-sized window: the tray's menu bar is a full-height column
    await setViewport({ width: 1280, height: 1000 });
    savedGizmos = HAXStore.gizmoList;
    HAXStore.gizmoList = GIZMOS;
    wrapper = await fixture(
      html`<div>
        <button id="before">before</button>
        <hax-tray></hax-tray>
        <hax-body
          ><h2>Heading one</h2>
          <p>First paragraph</p>
          <p>Second paragraph</p></hax-body
        >
        <button id="after">after</button>
      </div>`,
    );
    tray = wrapper.querySelector("hax-tray");
    body = wrapper.querySelector("hax-body");
    before = wrapper.querySelector("#before");
    after = wrapper.querySelector("#after");
    await waitFor(() => HAXStore.haxTray === tray, 3000);
    HAXStore.editMode = true;
    await waitFor(() => tray.editMode, 2000);
    await settle(200);
    startBeforeTray();
  });

  afterEach(async () => {
    HAXStore.editMode = false;
    HAXStore.gizmoList = savedGizmos;
    await settle(50);
  });

  // start a Tab walk from the button before the tray. hax-body takes Tab
  // for itself (indent) while a text block holds the selection, so drop
  // the selection first: this flow is about the tray, not the editing area
  function startBeforeTray() {
    const sel = globalThis.getSelection();
    if (sel) sel.removeAllRanges();
    before.focus();
  }

  async function openPanel(detail) {
    tray.trayDetail = detail;
    tray.collapsed = false;
    await tray.updateComplete;
    await settle(400);
  }

  // Tab from where focus is now until `wanted` matches the stop's label
  async function tabTo(wanted, max = 40) {
    for (let i = 0; i < max; i++) {
      await press("Tab");
      const el = expectGoodFocusStop(expect, `Tab toward ${wanted} (${i + 1})`);
      if (wanted.test(label(el))) return el;
      if (el === after) break;
    }
    throw new Error(`no focusable control labelled ${wanted} in the tray`);
  }

  // Tab until focus is on an inner button of one of `hosts`
  async function tabToOneOf(hosts, max = 40) {
    startBeforeTray();
    for (let i = 0; i < max; i++) {
      await press("Tab");
      expectGoodFocusStop(expect, `Tab toward the panel (${i + 1})`);
      const host = focusedHost();
      if (host && hosts.includes(host)) return host;
      if (deepActiveElement() === after) break;
    }
    throw new Error(
      `Tab never reached any of ${hosts.map(describeEl).join(", ")}`,
    );
  }

  function visibleButtons(container) {
    return haxButtonsIn(container).filter((b) => !hiddenReason(b));
  }

  /**
   * Each visible button is an ordinary tab stop (inner tabindex 0) unless a
   * toolbar manages it; a managing toolbar shows exactly one tab stop among
   * the buttons it manages (roving tabindex).
   */
  function unreachable(container) {
    const problems = [];
    const groups = new Map();
    visibleButtons(container).forEach((b) => {
      const btn = innerButton(b);
      if (!btn) return;
      const toolbar = b.__managingToolbar;
      if (toolbar) {
        if (!groups.has(toolbar)) groups.set(toolbar, []);
        groups.get(toolbar).push(b);
      } else if (btn.tabIndex < 0) {
        problems.push(
          `${describeEl(b)} has inner tabindex ${btn.tabIndex} and no toolbar manages it`,
        );
      }
    });
    groups.forEach((buttons, toolbar) => {
      const stops = buttons.filter(
        (b) => !b.disabled && innerButton(b).tabIndex >= 0,
      );
      if (stops.length !== 1) {
        problems.push(
          `${describeEl(toolbar)} has ${stops.length} tab stops among ${buttons.length} buttons (expected 1)`,
        );
      }
    });
    return problems;
  }

  for (const detail of ["content-add", "content-map", "view-source"]) {
    it(`every hax button shown with the ${detail} panel open is keyboard reachable`, async () => {
      await openPanel(detail);
      const shown = visibleButtons(tray);
      expect(shown.length, "the tray renders hax buttons").to.be.greaterThan(5);
      expect(unreachable(tray)).to.deep.equal([]);
      expect(positiveTabindexIn(tray)).to.deep.equal([]);
    });
  }

  it("Tab reaches the tray menu bar buttons; Enter and Space open panels", async () => {
    for (const wanted of [/^save$/i, /^cancel$/i, /^blocks$/i, /^media$/i]) {
      startBeforeTray();
      const el = await tabTo(wanted);
      expect(el.getAttribute("tabindex"), describeEl(el)).to.equal("0");
    }
    startBeforeTray();
    await tabTo(/^structure$/i);
    await press("Enter", 300);
    await waitFor(() => tray.trayDetail === "content-map", 2000);
    expect(tray.trayDetail, "Enter on Structure").to.equal("content-map");
    startBeforeTray();
    await tabTo(/^source$/i);
    await press(" ", 300);
    await waitFor(() => tray.trayDetail === "view-source", 2000);
    expect(tray.trayDetail, "Space on Source").to.equal("view-source");
  });

  it("Structure: Tab reaches each block in the page outline and Enter selects it", async () => {
    await openPanel("content-map");
    const map = tray.shadowRoot.querySelector("hax-map");
    await waitFor(() => visibleButtons(map).length >= 3, 3000);
    const items = visibleButtons(map);
    const first = await tabToOneOf(items);
    expect(first, "the first outline item is the first stop").to.equal(
      items[0],
    );
    // each outline item is its own Tab stop, in page order (the item's
    // other controls may sit between them)
    for (let i = 1; i < items.length; i++) {
      let guard = 0;
      do {
        await press("Tab");
        expectGoodFocusStop(expect, `toward outline item ${i}`);
      } while (focusedHost() !== items[i] && guard++ < 6);
      expect(
        focusedHost() === items[i],
        `Tab reaches ${describeEl(items[i])}, was ${describeEl(deepActiveElement())}`,
      ).to.equal(true);
    }
    // Enter on the focused outline item jumps to (selects) its block
    const index = parseInt(
      items[items.length - 1].getAttribute("data-index"),
      10,
    );
    const visited = [];
    map.goToItem = (i) => visited.push(i);
    try {
      await press("Enter", 200);
    } finally {
      delete map.goToItem;
    }
    expect(visited, "Enter goes to that block").to.deep.equal([index]);
  });

  for (const key of ["Enter", " "]) {
    it(`Source: the actions are one Tab stop, arrow keys move, ${key === " " ? "Space" : key} activates`, async () => {
      await openPanel("view-source");
      const source = tray.shadowRoot.querySelector("hax-view-source");
      const toolbar = source.shadowRoot.querySelector("hax-toolbar");
      const actions = visibleButtons(toolbar);
      expect(actions.length).to.be.greaterThan(2);
      const clicks = [];
      actions.forEach((b) =>
        b.addEventListener("click", () => clicks.push(b), { capture: true }),
      );
      const first = await tabToOneOf(actions);
      expect(first, "Tab lands on the first action").to.equal(actions[0]);
      // ArrowRight walks every action in order, ArrowLeft walks back
      for (let i = 1; i < actions.length; i++) {
        await press("ArrowRight");
        expectGoodFocusStop(expect, `ArrowRight ${i}`);
        expect(
          focusedHost() === actions[i],
          `ArrowRight reaches ${describeEl(actions[i])}`,
        ).to.equal(true);
      }
      for (let i = actions.length - 2; i >= 0; i--) {
        await press("ArrowLeft");
        expect(
          focusedHost() === actions[i],
          `ArrowLeft reaches ${describeEl(actions[i])}`,
        ).to.equal(true);
      }
      // Tab from inside the toolbar leaves it instead of visiting the others
      await press("Tab");
      const host = focusedHost();
      expect(
        !host || !actions.includes(host),
        `Tab left the toolbar, was on ${describeEl(deepActiveElement())}`,
      ).to.equal(true);
      // back into the toolbar: Clean formatting re-imports the source and
      // closes the panel
      await tabToOneOf(actions);
      expect(focusedHost() === actions[0], "the toolbar remembers").to.equal(
        true,
      );
      await press("ArrowRight");
      const clean = actions[1];
      expect(focusedHost() === clean).to.equal(true);
      await press(key, 150);
      expect(
        clicks.includes(clean),
        `${key === " " ? "Space" : key} activates ${describeEl(clean)}`,
      ).to.equal(true);
    });
  }

  it("Add block: the grid is one Tab stop, arrow keys move, Enter and Space insert", async () => {
    await openPanel("content-add");
    const browser = tray.shadowRoot.querySelector("hax-gizmo-browser");
    await waitFor(() => visibleButtons(browser).length >= 3, 3000);
    const grid = browser.shadowRoot.querySelector("simple-button-grid");
    const blocks = visibleButtons(grid);
    const inserted = [];
    const catcher = (e) => {
      if (e.detail && e.detail.eventName === "insert-tag") {
        inserted.push(e.detail.value);
        e.stopPropagation();
      }
    };
    globalThis.addEventListener("hax-tray-button-click", catcher, true);
    try {
      const first = await tabToOneOf(blocks);
      expect(first).to.equal(blocks[0]);
      await press("Enter", 100);
      expect(inserted, "Enter inserts the block").to.deep.equal([
        blocks[0].eventData,
      ]);
      await press("ArrowRight");
      expect(focusedHost() === blocks[1], "ArrowRight moves").to.equal(true);
      expectGoodFocusStop(expect, "second block");
      await press(" ", 100);
      expect(inserted[1], "Space inserts the block").to.equal(
        blocks[1].eventData,
      );
      await press("Tab");
      const host = focusedHost();
      expect(
        !host || !blocks.includes(host),
        `Tab left the grid, was on ${describeEl(deepActiveElement())}`,
      ).to.equal(true);
    } finally {
      globalThis.removeEventListener("hax-tray-button-click", catcher, true);
    }
  });
});
