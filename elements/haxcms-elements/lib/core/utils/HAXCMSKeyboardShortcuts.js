/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { store } from "../haxcms-site-store.js";
import {
  KeyboardShortcutManager,
  KeyboardShortcutManagerInstance,
} from "@haxtheweb/utils/utils.js";

/**
 * HAXCMSKeyboardShortcuts
 * Centralized keyboard shortcut management for HAXcms
 * Coordinates with Super Daemon shortcuts to avoid conflicts
 *
 * Super Daemon uses: Alt+Shift (Linux/Windows) or Meta+Shift (macOS)
 * HAXcms uses: Ctrl+Shift+[Key] for content operations
 */
class HAXCMSKeyboardShortcuts {
  constructor() {
    // Storage is delegated to the shared KeyboardShortcutManager registry
    // (see @haxtheweb/utils/lib/keyboardShortcuts.js). This facade retains
    // only the CMS-specific keydown execution engine (modifier / admin-mode /
    // modal guards + callback dispatch) and the backward-compatible
    // query/label API used by haxcms-site-editor-ui and the About dialog.
    this.enabled = true;
    this._boundHandler = this._handleKeydown.bind(this);
  }

  /**
   * Register a keyboard shortcut
   * @param {Object} options - Shortcut configuration
   * @param {String} options.key - Key to press (e.g., 'S', 'E')
   * @param {Boolean} options.ctrl - Require Ctrl key
   * @param {Boolean} options.shift - Require Shift key
   * @param {Boolean} options.alt - Require Alt key
   * @param {Boolean} options.meta - Require Meta key
   * @param {Function} options.callback - Function to call when shortcut is triggered
   * @param {Function} options.condition - Optional function that returns true if shortcut should be active
   * @param {String} options.description - Human-readable description
   * @param {String} options.context - Context where shortcut is active (e.g., 'edit', 'view', 'global')
   * @param {Boolean} options.allowInInput - Allow shortcut while focused in non-editor input fields
   */
  register(options) {
    // Delegate storage to the shared registry. Defaults (type 'binding',
    // id derived from combo) preserve the legacy call shape used by
    // _registerKeyboardShortcuts(); CMS execution fields (callback,
    // condition, allowInInput) ride along on the descriptor and are read
    // back by _handleKeydown via getByBinding.
    return KeyboardShortcutManagerInstance.register(options);
  }

  /**
   * Unregister a keyboard shortcut
   */
  unregister(key, ctrl = false, shift = false, alt = false, meta = false) {
    // Forward to the shared registry, which accepts both the legacy
    // (key, ctrl, shift, alt, meta) signature and an id string.
    KeyboardShortcutManagerInstance.unregister(key, ctrl, shift, alt, meta);
  }

  /**
   * Generate a unique key for the shortcut map
   */
  _generateKey(key, ctrl, shift, alt, meta) {
    const parts = [];
    if (ctrl) parts.push("Ctrl");
    if (alt) parts.push("Alt");
    if (shift) parts.push("Shift");
    if (meta) parts.push("Meta");
    parts.push(key.toUpperCase());
    return parts.join("+");
  }

  /**
   * Normalize key to handle special cases like numbers with shift
   * @param {KeyboardEvent} e - The keyboard event
   * @returns {String} - Normalized key string
   */
  _normalizeKey(e) {
    // For digit keys, use e.code to get consistent 'Digit1', 'Digit2', etc.
    // This handles Shift+1 = '!' becoming just '1'
    if (e.code && e.code.startsWith("Digit")) {
      return e.code.replace("Digit", "");
    }
    // For numpad, also normalize
    if (e.code && e.code.startsWith("Numpad")) {
      return e.code.replace("Numpad", "");
    }
    // Map e.code to base keys for symbols that change with Shift
    // This handles cases like: [ becomes {, / becomes ?, etc.
    const codeToKeyMap = {
      BracketLeft: "[",
      BracketRight: "]",
      Slash: "/",
      Backslash: "\\",
      Semicolon: ";",
      Quote: "'",
      Comma: ",",
      Period: ".",
      Minus: "-",
      Equal: "=",
      Backquote: "`",
    };
    if (e.code && codeToKeyMap[e.code]) {
      return codeToKeyMap[e.code];
    }
    // Otherwise use e.key
    return e.key;
  }

  /**
   * Handle keydown events
   */
  _handleKeydown(e) {
    if (!this.enabled) return;
    if (store.adminMode) return;
    // Block shortcuts while any modal/dialog is open to avoid triggering
    // actions behind a confirmation or admin dialog.
    if (
      globalThis.SimpleModal &&
      globalThis.SimpleModal.instance &&
      globalThis.SimpleModal.instance.opened
    ) {
      return;
    }

    // Normalize the key (handles Shift+number keys)
    const normalizedKey = this._normalizeKey(e);

    // Resolve the binding via the shared registry.
    const shortcut = KeyboardShortcutManagerInstance.getByBinding(
      normalizedKey,
      e.ctrlKey,
      e.shiftKey,
      e.altKey,
      e.metaKey,
    );
    if (!shortcut) return;

    // Don't intercept if user is typing in an input field (unless in HAX editor
    // or this shortcut explicitly allows usage from inputs)
    const activeElement = globalThis.document.activeElement;
    const isInput =
      activeElement &&
      (activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.isContentEditable);

    // Allow shortcuts in HAX editor even when in content editable areas
    const inHaxEditor = activeElement && activeElement.closest("hax-body");

    if (isInput && !inHaxEditor && !shortcut.allowInInput) return;

    if (shortcut.condition()) {
      e.preventDefault();
      shortcut.callback(e);
    }
  }

  /**
   * Start listening for keyboard shortcuts
   */
  enable() {
    this.enabled = true;
    globalThis.document.addEventListener("keydown", this._boundHandler);
  }

  /**
   * Stop listening for keyboard shortcuts
   */
  disable() {
    this.enabled = false;
    globalThis.document.removeEventListener("keydown", this._boundHandler);
  }

  /**
   * Get all registered shortcuts
   */
  getShortcuts() {
    // Legacy shape: an array of descriptor objects where `key` is the
    // physical key (the legacy { key, ...shortcut } spread overrode the
    // combo string with shortcut.key). Only binding shortcuts lived here
    // historically, so we scope to type 'binding' to preserve that split
    // (markdown shortcuts remain sourced from HAXStore.keyboardShortcuts).
    return KeyboardShortcutManagerInstance.getByType("binding").map(
      (shortcut) => ({ ...shortcut }),
    );
  }

  /**
   * Get shortcuts for a specific context
   */
  getShortcutsByContext(context) {
    return this.getShortcuts().filter(
      (s) => s.context === context || s.context === "global",
    );
  }

  /**
   * Generate a human-readable label for a keyboard shortcut
   * @param {Object} options - Shortcut configuration
   * @param {String} options.key - Key to press
   * @param {Boolean} options.ctrl - Ctrl key required
   * @param {Boolean} options.shift - Shift key required
   * @param {Boolean} options.alt - Alt key required
   * @param {Boolean} options.meta - Meta key required
   * @returns {String} - Formatted label (e.g., "Ctrl⇧P")
   */
  static generateLabel(options) {
    // Delegate to the shared registry so label formatting is defined once.
    return KeyboardShortcutManager.generateLabel(options);
  }

  /**
   * Get a shortcut by its key combination
   * @param {String} key - Key to press
   * @param {Boolean} ctrl - Ctrl key required
   * @param {Boolean} shift - Shift key required
   * @param {Boolean} alt - Alt key required
   * @param {Boolean} meta - Meta key required
   * @returns {Object|null} - Shortcut object or null if not found
   */
  getShortcut(key, ctrl = false, shift = false, alt = false, meta = false) {
    // Legacy returned { key: combo, ...shortcut } which (due to spread
    // order) netted key = physical key. The registry descriptor already
    // carries key = physical, so we return it directly.
    return KeyboardShortcutManagerInstance.getByBinding(
      key,
      ctrl,
      shift,
      alt,
      meta,
    );
  }

  /**
   * Get the label for a specific shortcut
   * @param {String} key - Key to press
   * @param {Boolean} ctrl - Ctrl key required
   * @param {Boolean} shift - Shift key required
   * @param {Boolean} alt - Alt key required
   * @param {Boolean} meta - Meta key required
   * @returns {String|null} - Formatted label or null if not found
   */
  getShortcutLabel(
    key,
    ctrl = false,
    shift = false,
    alt = false,
    meta = false,
  ) {
    const shortcut = this.getShortcut(key, ctrl, shift, alt, meta);
    if (shortcut) {
      return HAXCMSKeyboardShortcuts.generateLabel({
        key: shortcut.key,
        ctrl: shortcut.ctrl,
        shift: shortcut.shift,
        alt: shortcut.alt,
        meta: shortcut.meta,
      });
    }
    return null;
  }

  /**
   * Get all shortcuts formatted for display (e.g., in Merlin)
   * @returns {Array} Array of shortcut objects with formatted labels
   */
  getShortcutsForDisplay() {
    return this.getShortcuts().map((shortcut) => ({
      label: HAXCMSKeyboardShortcuts.generateLabel({
        key: shortcut.key,
        ctrl: shortcut.ctrl,
        shift: shortcut.shift,
        alt: shortcut.alt,
        meta: shortcut.meta,
      }),
      description: shortcut.description,
      context: shortcut.context,
      key: shortcut.key,
    }));
  }
}

// Create singleton instance
globalThis.HAXCMSKeyboardShortcutsManager =
  globalThis.HAXCMSKeyboardShortcutsManager || {};
globalThis.HAXCMSKeyboardShortcutsManager.requestAvailability = () => {
  if (!globalThis.HAXCMSKeyboardShortcutsManager.instance) {
    globalThis.HAXCMSKeyboardShortcutsManager.instance =
      new HAXCMSKeyboardShortcuts();
  }
  return globalThis.HAXCMSKeyboardShortcutsManager.instance;
};

export const HAXCMSKeyboardShortcutsInstance =
  globalThis.HAXCMSKeyboardShortcutsManager.requestAvailability();
// Expose the class too so callers can use the static generateLabel helper
// (matches the usage documented in KEYBOARD_SHORTCUTS.md).
export { HAXCMSKeyboardShortcuts };
