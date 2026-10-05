import { expect } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import { KeyboardShortcutManagerInstance } from "@haxtheweb/utils/utils.js";
import {
  HAXCMSKeyboardShortcuts,
  HAXCMSKeyboardShortcutsInstance,
} from "../lib/core/utils/HAXCMSKeyboardShortcuts.js";

// The facade delegates storage to the shared KeyboardShortcutManager
// registry singleton; snapshot the registry maps and restore them so
// nothing leaks into other suites that also use the registry.
function snapshotRegistry() {
  return {
    byId: new Map(KeyboardShortcutManagerInstance._byId),
    byBinding: new Map(KeyboardShortcutManagerInstance._byBinding),
    byTrigger: new Map(KeyboardShortcutManagerInstance._byTrigger),
  };
}

function restoreRegistry(snapshot) {
  KeyboardShortcutManagerInstance._byId = snapshot.byId;
  KeyboardShortcutManagerInstance._byBinding = snapshot.byBinding;
  KeyboardShortcutManagerInstance._byTrigger = snapshot.byTrigger;
}

function keyEvent(overrides) {
  return Object.assign(
    {
      key: "s",
      code: "KeyS",
      ctrlKey: true,
      shiftKey: true,
      altKey: false,
      metaKey: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
    },
    overrides,
  );
}

describe("HAXCMSKeyboardShortcuts", () => {
  let registrySnapshot;
  let savedAdminMode;
  let savedSimpleModal;
  let manager;

  beforeEach(() => {
    registrySnapshot = snapshotRegistry();
    savedAdminMode = store.adminMode;
    savedSimpleModal = globalThis.SimpleModal;
    store.adminMode = false;
    manager = new HAXCMSKeyboardShortcuts();
  });

  afterEach(() => {
    manager.disable();
    restoreRegistry(registrySnapshot);
    store.adminMode = savedAdminMode;
    if (savedSimpleModal === undefined) {
      delete globalThis.SimpleModal;
    } else {
      globalThis.SimpleModal = savedSimpleModal;
    }
  });

  describe("singleton availability", () => {
    it("requestAvailability returns a shared instance", () => {
      const instance =
        globalThis.HAXCMSKeyboardShortcutsManager.requestAvailability();
      expect(instance).to.equal(HAXCMSKeyboardShortcutsInstance);
      expect(instance).to.be.instanceOf(HAXCMSKeyboardShortcuts);
    });
  });

  describe("register / unregister delegation", () => {
    it("register stores the descriptor and returns it normalized", () => {
      const descriptor = manager.register({
        key: "S",
        ctrl: true,
        shift: true,
        callback: () => {},
        condition: () => true,
        description: "Save",
        context: "edit",
      });
      expect(descriptor.id).to.equal("Ctrl+Shift+S");
      expect(descriptor.type).to.equal("binding");
      expect(KeyboardShortcutManagerInstance.getById("Ctrl+Shift+S")).to.exist;
    });

    it("register returns null for a null options bag", () => {
      expect(manager.register(null)).to.equal(null);
    });

    it("unregister removes a combo via legacy signature", () => {
      manager.register({
        key: "E",
        ctrl: true,
        callback: () => {},
        condition: () => true,
      });
      expect(manager.getShortcut("E", true)).to.exist;
      manager.unregister("E", true, false, false, false);
      expect(manager.getShortcut("E", true)).to.equal(null);
    });
  });

  describe("_generateKey", () => {
    it("builds the combo in Ctrl, Alt, Shift, Meta order", () => {
      expect(manager._generateKey("s", true, true, true, true)).to.equal(
        "Ctrl+Alt+Shift+Meta+S",
      );
      expect(manager._generateKey("s", false, false, false, false)).to.equal(
        "S",
      );
      expect(manager._generateKey("p", true, false, false, false)).to.equal(
        "Ctrl+P",
      );
    });
  });

  describe("_normalizeKey", () => {
    it("normalizes digit codes so Shift+1 reads as 1", () => {
      expect(manager._normalizeKey({ code: "Digit1", key: "!" })).to.equal("1");
      expect(manager._normalizeKey({ code: "Digit9", key: "(" })).to.equal("9");
    });

    it("normalizes numpad codes", () => {
      expect(manager._normalizeKey({ code: "Numpad3", key: "3" })).to.equal(
        "3",
      );
    });

    it("maps symbol codes to their base key", () => {
      expect(manager._normalizeKey({ code: "BracketLeft", key: "{" })).to.equal(
        "[",
      );
      expect(manager._normalizeKey({ code: "Slash", key: "?" })).to.equal("/");
      expect(manager._normalizeKey({ code: "Semicolon", key: ":" })).to.equal(
        ";",
      );
    });

    it("falls back to e.key for everything else", () => {
      expect(manager._normalizeKey({ code: "KeyS", key: "S" })).to.equal("S");
    });
  });

  describe("_handleKeydown execution guards", () => {
    it("does nothing when disabled", () => {
      let called = false;
      manager.register({
        key: "S",
        ctrl: true,
        shift: true,
        callback: () => {
          called = true;
        },
        condition: () => true,
      });
      manager.enabled = false;
      manager._handleKeydown(keyEvent({}));
      expect(called).to.equal(false);
    });

    it("does nothing in admin mode", () => {
      let called = false;
      manager.register({
        key: "S",
        ctrl: true,
        shift: true,
        callback: () => {
          called = true;
        },
        condition: () => true,
      });
      store.adminMode = true;
      manager._handleKeydown(keyEvent({}));
      expect(called).to.equal(false);
    });

    it("does nothing while a SimpleModal is open", () => {
      let called = false;
      manager.register({
        key: "S",
        ctrl: true,
        shift: true,
        callback: () => {
          called = true;
        },
        condition: () => true,
      });
      globalThis.SimpleModal = { instance: { opened: true } };
      manager._handleKeydown(keyEvent({}));
      expect(called).to.equal(false);
      // closed modal allows execution
      globalThis.SimpleModal = { instance: { opened: false } };
      manager._handleKeydown(keyEvent({}));
      expect(called).to.equal(true);
    });

    it("does nothing when no shortcut matches the combo", () => {
      const e = keyEvent({ key: "Z", code: "KeyZ" });
      expect(() => manager._handleKeydown(e)).to.not.throw();
      expect(e.defaultPrevented).to.not.equal(true);
    });

    it("fires the callback and prevents default when condition passes", () => {
      let called = false;
      manager.register({
        key: "S",
        ctrl: true,
        shift: true,
        callback: () => {
          called = true;
        },
        condition: () => true,
      });
      const e = keyEvent({});
      manager._handleKeydown(e);
      expect(called).to.equal(true);
      expect(e.defaultPrevented).to.equal(true);
    });

    it("does not fire when condition fails", () => {
      let called = false;
      manager.register({
        key: "S",
        ctrl: true,
        shift: true,
        callback: () => {
          called = true;
        },
        condition: () => false,
      });
      manager._handleKeydown(keyEvent({}));
      expect(called).to.equal(false);
    });

    it("ignores the shortcut when focus is in a plain input field", () => {
      let called = false;
      manager.register({
        key: "S",
        ctrl: true,
        shift: true,
        callback: () => {
          called = true;
        },
        condition: () => true,
      });
      const input = globalThis.document.createElement("input");
      globalThis.document.body.appendChild(input);
      input.focus();
      try {
        manager._handleKeydown(keyEvent({}));
        expect(called).to.equal(false);
      } finally {
        input.remove();
      }
    });

    it("fires when focus is in an input but the shortcut allows it", () => {
      let called = false;
      manager.register({
        key: "S",
        ctrl: true,
        shift: true,
        allowInInput: true,
        callback: () => {
          called = true;
        },
        condition: () => true,
      });
      const input = globalThis.document.createElement("input");
      globalThis.document.body.appendChild(input);
      input.focus();
      try {
        manager._handleKeydown(keyEvent({}));
        expect(called).to.equal(true);
      } finally {
        input.remove();
      }
    });
  });

  describe("enable / disable", () => {
    it("enable wires the document keydown listener", () => {
      let called = false;
      manager.register({
        key: "S",
        ctrl: true,
        shift: true,
        callback: () => {
          called = true;
        },
        condition: () => true,
      });
      manager.enable();
      const e = new globalThis.KeyboardEvent("keydown", {
        key: "S",
        code: "KeyS",
        ctrlKey: true,
        shiftKey: true,
      });
      globalThis.document.dispatchEvent(e);
      expect(called).to.equal(true);
      expect(manager.enabled).to.equal(true);
    });

    it("disable removes the listener and flips enabled off", () => {
      let called = false;
      manager.register({
        key: "S",
        ctrl: true,
        shift: true,
        callback: () => {
          called = true;
        },
        condition: () => true,
      });
      manager.enable();
      manager.disable();
      const e = new globalThis.KeyboardEvent("keydown", {
        key: "S",
        code: "KeyS",
        ctrlKey: true,
        shiftKey: true,
      });
      globalThis.document.dispatchEvent(e);
      expect(called).to.equal(false);
      expect(manager.enabled).to.equal(false);
    });
  });

  describe("query and label helpers", () => {
    it("getShortcuts returns binding-type descriptors", () => {
      manager.register({
        key: "S",
        ctrl: true,
        callback: () => {},
        condition: () => true,
        context: "edit",
      });
      manager.register({
        type: "markdown",
        trigger: "###",
        tag: "h3",
        context: "edit",
      });
      const shortcuts = manager.getShortcuts();
      expect(shortcuts.length).to.equal(1);
      expect(shortcuts[0].key).to.equal("S");
      expect(shortcuts[0].type).to.equal("binding");
    });

    it("getShortcutsByContext matches context plus global", () => {
      manager.register({
        key: "S",
        ctrl: true,
        callback: () => {},
        condition: () => true,
        context: "edit",
      });
      manager.register({
        key: "E",
        ctrl: true,
        callback: () => {},
        condition: () => true,
        context: "global",
      });
      manager.register({
        key: "V",
        ctrl: true,
        callback: () => {},
        condition: () => true,
        context: "view",
      });
      const edit = manager.getShortcutsByContext("edit");
      expect(edit.map((s) => s.key).sort()).to.deep.equal(["E", "S"]);
      const view = manager.getShortcutsByContext("view");
      expect(view.map((s) => s.key).sort()).to.deep.equal(["E", "V"]);
    });

    it("generateLabel formats modifier combos", () => {
      expect(
        HAXCMSKeyboardShortcuts.generateLabel({
          key: "s",
          ctrl: true,
          shift: true,
        }),
      ).to.equal("Ctrl⇧S");
      expect(
        HAXCMSKeyboardShortcuts.generateLabel({ key: "p", ctrl: true }),
      ).to.equal("CtrlP");
      expect(HAXCMSKeyboardShortcuts.generateLabel({ key: "a" })).to.equal("A");
    });

    it("getShortcut resolves a binding combo", () => {
      manager.register({
        key: "S",
        ctrl: true,
        shift: true,
        callback: () => {},
        condition: () => true,
      });
      expect(manager.getShortcut("S", true, true, false, false)).to.exist;
      expect(manager.getShortcut("S", true, false, false, false)).to.equal(
        null,
      );
    });

    it("getShortcutLabel returns the label for a registered combo", () => {
      manager.register({
        key: "S",
        ctrl: true,
        shift: true,
        callback: () => {},
        condition: () => true,
      });
      expect(manager.getShortcutLabel("S", true, true)).to.equal("Ctrl⇧S");
      expect(manager.getShortcutLabel("Z", true)).to.equal(null);
    });

    it("getShortcutsForDisplay maps label/description/context/key", () => {
      manager.register({
        key: "S",
        ctrl: true,
        shift: true,
        callback: () => {},
        condition: () => true,
        description: "Save the page",
        context: "edit",
      });
      const display = manager.getShortcutsForDisplay();
      expect(display).to.deep.equal([
        {
          label: "Ctrl⇧S",
          description: "Save the page",
          context: "edit",
          key: "S",
        },
      ]);
    });
  });
});
