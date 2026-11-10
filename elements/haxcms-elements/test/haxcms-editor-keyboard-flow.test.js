/**
 * Keyboard flow: the HAXcms editor top bar and the hax-tray panels it drives
 * (View source, Page outline, Add block, Configure block), plus the contract
 * of the keyboard shortcut registry. Real key presses only; see
 * scripts/test-setup/keyboard-flow.js for the per-stop invariants.
 */
import { fixture, expect, html } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import "@haxtheweb/hax-body/lib/hax-tray.js";
import "../lib/core/haxcms-site-editor-ui.js";
import { HAXCMSKeyboardShortcutsInstance } from "../lib/core/utils/HAXCMSKeyboardShortcuts.js";
import { KeyboardShortcutManagerInstance } from "@haxtheweb/utils/utils.js";
import { SuperDaemonInstance } from "@haxtheweb/super-daemon/super-daemon.js";
import {
  press,
  settle,
  waitFor,
  deepActiveElement,
  composedContains,
  expectGoodFocusStop,
  positiveTabindexIn,
  describeEl,
} from "../../../scripts/test-setup/keyboard-flow.js";

// combos Chromium keeps for itself (new window/tab, close, quit, downloads,
// devtools); a page can never receive them, so a HAX shortcut there is dead
const BROWSER_RESERVED = new Set([
  "Ctrl+Shift+N",
  "Ctrl+Shift+T",
  "Ctrl+Shift+W",
  "Ctrl+Shift+Q",
  "Ctrl+Shift+J",
  "Ctrl+Shift+I",
]);
// shortcuts shown in the top bar that belong to the editing surface rather
// than the registry (redo lives on hax-body's undo stack)
const EDITOR_SURFACE_KEYS = new Set(["Z"]);

// KNOWN BUG: app-hax-user-menu-toggle.js styles its button with
// `outline: var(--ddd-border-sm, 2px solid) var(--ddd-theme-default-skyBlue)`.
// --ddd-border-sm is already a full border shorthand (2px solid <color>), so
// the outline value has two colors, is invalid at computed-value time and the
// focus ring falls back to none. The flows step over that one stop; the
// it.skip test below asserts the fixed behavior.
const KNOWN_BUGS = [
  {
    match: (el) =>
      el.getRootNode().host &&
      el.getRootNode().host.tagName === "APP-HAX-USER-MENU-TOGGLE",
    reason: "user menu toggle has no visible focus ring",
  },
];

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

function bindingKey(d) {
  const parts = [];
  if (d.ctrl) parts.push("Ctrl");
  if (d.alt) parts.push("Alt");
  if (d.shift) parts.push("Shift");
  if (d.meta) parts.push("Meta");
  parts.push(String(d.key).toUpperCase());
  return parts.join("+");
}

describe("keyboard flow: HAXcms editor top bar + hax-tray panels", function () {
  this.timeout(20000);
  let wrapper;
  let ui;
  let tray;
  let before;
  let after;
  let registered;
  let savedRegister;
  let savedJwt;
  let registrySnapshot;

  beforeEach(async () => {
    registrySnapshot = {
      byId: new Map(KeyboardShortcutManagerInstance._byId),
      byBinding: new Map(KeyboardShortcutManagerInstance._byBinding),
      byTrigger: new Map(KeyboardShortcutManagerInstance._byTrigger),
    };
    // record every registration so displaced (colliding) combos are seen
    registered = [];
    savedRegister = KeyboardShortcutManagerInstance.register;
    KeyboardShortcutManagerInstance.register = function (options) {
      registered.push({ ...options });
      return savedRegister.call(this, options);
    };
    savedJwt = store.jwt;
    store.jwt = "keyboard-flow-test";
    wrapper = await fixture(
      html`<div>
        <button id="before">before</button>
        <haxcms-site-editor-ui></haxcms-site-editor-ui>
        <hax-tray hide-toolbar></hax-tray>
        <button id="after">after</button>
      </div>`,
    );
    ui = wrapper.querySelector("haxcms-site-editor-ui");
    tray = wrapper.querySelector("hax-tray");
    before = wrapper.querySelector("#before");
    after = wrapper.querySelector("#after");
    // haxcms-editor-builder reveals the bar once it has painted
    ui.painting = false;
    await ui.updateComplete;
    await waitFor(() => HAXStore.haxTray === tray, 3000);
    store.editMode = true;
    await waitFor(() => ui.editMode, 2000);
    await settle(200);
    before.focus();
  });

  afterEach(async () => {
    KeyboardShortcutManagerInstance.register = savedRegister;
    store.editMode = false;
    await settle(50);
    store.jwt = savedJwt;
    HAXCMSKeyboardShortcutsInstance.disable();
    KeyboardShortcutManagerInstance._byId = registrySnapshot.byId;
    KeyboardShortcutManagerInstance._byBinding = registrySnapshot.byBinding;
    KeyboardShortcutManagerInstance._byTrigger = registrySnapshot.byTrigger;
  });

  async function tabTo(wanted, max = 25) {
    for (let i = 0; i < max; i++) {
      await press("Tab");
      const el = expectGoodFocusStop(
        expect,
        `Tab toward ${wanted} (${i + 1})`,
        {
          knownBugs: KNOWN_BUGS,
        },
      );
      if (wanted.test(label(el))) return el;
      if (el === after) break;
    }
    throw new Error(`no focusable control labelled ${wanted} in the top bar`);
  }

  it("shortcut registry: every binding has an action and a description, and no two collide", () => {
    const bindings = registered.filter(
      (d) => (d.type || "binding") === "binding",
    );
    expect(bindings.length, "editor registers its shortcuts").to.be.greaterThan(
      5,
    );
    const owners = new Map();
    bindings.forEach((d) => {
      const combo = bindingKey(d);
      const id = d.id || combo;
      expect(typeof d.callback, `${combo} has a callback`).to.equal("function");
      expect(typeof d.condition, `${combo} has a condition`).to.equal(
        "function",
      );
      expect(d.description, `${combo} has a description`).to.be.a("string");
      expect(d.description.length).to.be.greaterThan(0);
      const prior = owners.get(combo);
      expect(
        !prior || prior === id,
        `${combo} is registered by both "${prior}" and "${id}"`,
      ).to.equal(true);
      owners.set(combo, id);
      expect(
        BROWSER_RESERVED.has(combo),
        `${combo} is reserved by the browser`,
      ).to.equal(false);
      // Merlin toggles on any keydown holding its two modifiers
      const merlin = {
        Alt: !!d.alt && !d.ctrl && !d.meta,
        Meta: !!d.meta && !d.ctrl && !d.alt,
        Ctrl: !!d.ctrl && !d.alt && !d.meta,
      };
      expect(
        !!d.shift && merlin[SuperDaemonInstance.key1] === true,
        `${combo} collides with Merlin's ${SuperDaemonInstance.key1}+Shift`,
      ).to.equal(false);
    });
  });

  it("every Ctrl+Shift shortcut shown in the top bar is a registered binding", () => {
    const shown = new Set();
    const walk = (root) => {
      root.querySelectorAll("*").forEach((el) => {
        ["label", "shortcut", "aria-label"].forEach((attr) => {
          const v = el.getAttribute(attr) || "";
          const m = v.match(/Ctrl⇧(\S)/);
          if (m) shown.add(m[1].toUpperCase());
        });
        if (el.shadowRoot) walk(el.shadowRoot);
      });
    };
    walk(ui.shadowRoot);
    expect(shown.size, "the bar documents its shortcuts").to.be.greaterThan(3);
    shown.forEach((key) => {
      if (EDITOR_SURFACE_KEYS.has(key)) return;
      const d = KeyboardShortcutManagerInstance.getByBinding(
        key,
        true,
        true,
        false,
        false,
      );
      expect(
        d,
        `Ctrl⇧${key} is shown in the bar but not registered`,
      ).to.not.equal(null);
    });
  });

  it("Tab reaches the edit-mode top bar controls with a visible ring each", async () => {
    expect(positiveTabindexIn(ui)).to.deep.equal([]);
    expect(positiveTabindexIn(tray)).to.deep.equal([]);
    for (const wanted of [/^source/i, /^structure/i, /^blocks/i, /^cancel/i]) {
      const el = await tabTo(wanted);
      expect(el.getAttribute("tabindex")).to.not.equal("-1");
    }
  });

  // the page outline lists the blocks of the page being edited; with no
  // hax-body content in this fixture it is empty, so reaching the panel
  // region itself is the check there
  for (const [name, wanted, detail, needsControl] of [
    ["Source", /^source/i, "view-source", true],
    ["Structure (page outline)", /^structure/i, "content-map", false],
    ["Blocks (add block)", /^blocks/i, "content-add", true],
  ]) {
    it(`Enter on ${name} opens the ${detail} panel and its controls are reachable by Tab`, async () => {
      await tabTo(wanted);
      await press("Enter", 200);
      await waitFor(() => !tray.collapsed && tray.trayDetail === detail, 2000);
      expect(tray.trayDetail).to.equal(detail);
      expect(tray.collapsed, "panel is open").to.equal(false);
      // keep tabbing: focus must reach a visible control inside the tray
      let reached = null;
      for (let i = 0; i < 25 && !reached; i++) {
        await press("Tab");
        const el = expectGoodFocusStop(expect, `${detail} Tab ${i + 1}`, {
          knownBugs: KNOWN_BUGS,
        });
        if (
          composedContains(tray, el) &&
          (!needsControl || el.id !== "tray-detail")
        ) {
          reached = el;
        }
        if (el === after) break;
      }
      expect(reached, `a control inside the ${detail} panel is reachable`).to
        .exist;
    });
  }

  it("Ctrl+Shift+2 / 3 / 4 open Source, Structure and Blocks; pressing again toggles", async () => {
    for (const [digit, detail] of [
      ["2", "view-source"],
      ["3", "content-map"],
      ["4", "content-add"],
    ]) {
      await press(`Control+Shift+Digit${digit}`, 150);
      expect(tray.trayDetail, `Ctrl+Shift+${digit}`).to.equal(detail);
      expect(tray.collapsed, `Ctrl+Shift+${digit} opens`).to.equal(false);
    }
    await press("Control+Shift+Digit4", 150);
    expect(tray.collapsed, "Ctrl+Shift+4 again closes Blocks").to.equal(true);
  });

  it("Configure is unavailable without a selected block and Ctrl+Shift+5 does not open an empty panel", async () => {
    const configure = ui.shadowRoot.querySelector("#content-edit");
    expect(configure.disabled).to.equal(true);
    await press("Control+Shift+Digit4", 150);
    await press("Control+Shift+Digit5", 150);
    expect(tray.trayDetail, "no configure panel without a block").to.not.equal(
      "content-edit",
    );
  });

  it("Ctrl+Shift+/ cancels editing", async () => {
    await press("Control+Shift+Slash", 300);
    // cancel either leaves edit mode or asks to confirm in the app dialog
    const modal = globalThis.SimpleModal
      ? globalThis.SimpleModal.requestAvailability()
      : null;
    expect(
      !ui.editMode || (modal && modal.opened),
      "Ctrl+Shift+/ leaves edit mode or asks to confirm",
    ).to.equal(true);
    if (modal && modal.opened) {
      modal.close();
      await settle(50);
    }
  });

  it.skip("KNOWN BUG: the user menu toggle shows a focus ring", async () => {
    before.focus();
    for (let i = 0; i < 6; i++) {
      await press("Tab");
      const el = deepActiveElement();
      if (KNOWN_BUGS[0].match(el)) {
        expectGoodFocusStop(expect, "user menu toggle");
        return;
      }
    }
    throw new Error("user menu toggle not reached");
  });

  // a collapsed tray is width 0 and invisible; its panel is inert so
  // nothing in it (such as "Filter Blocks") stays in the tab order
  it("a collapsed tray keeps its controls out of the tab order", async () => {
    tray.trayDetail = "content-add";
    tray.collapsed = true;
    await tray.updateComplete;
    await settle(100);
    before.focus();
    for (let i = 0; i < 25; i++) {
      await press("Tab");
      const el = deepActiveElement();
      if (el === after) return;
      expect(
        composedContains(tray, el),
        `collapsed tray still exposes ${describeEl(el)}`,
      ).to.equal(false);
    }
  });
});
