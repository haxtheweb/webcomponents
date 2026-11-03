/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminScheme,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminStyles.js";

// how the last menu was asked for: a key (Shift+F10, the menu key, Enter
// on a trigger) shows the focus ring from the start, a pointer does not
let lastInput = "pointer";
if (globalThis.document && !globalThis.__simpleContextMenuInput) {
  globalThis.__simpleContextMenuInput = true;
  globalThis.document.addEventListener(
    "keydown",
    () => {
      lastInput = "key";
    },
    true,
  );
  globalThis.document.addEventListener(
    "pointerdown",
    () => {
      lastInput = "pointer";
    },
    true,
  );
}

/**
 * `simple-context-menu`
 * `Reusable context menu dialog with keyboard navigation and accessibility`
 *
 * The HAX UI menu: a surface panel of 32px rows, each an icon and a label,
 * with an optional small header, separators (an `hr` in the slot), danger
 * items (`class="danger"`) and an optional right-aligned shortcut. Items are
 * usually simple-toolbar-button; give one the key chip Merlin rows use with
 * `shortcut-label` and `key-shortcuts`, written by `contextMenuShortcut()`
 * so every menu spells keys the same way:
 *
 *   const s = contextMenuShortcut({ key: "ArrowUp", alt: true });
 *   <simple-toolbar-button shortcut-label="${s.label}"
 *     key-shortcuts="${s.aria}" ...>
 *
 * (A plain button or link can use `data-shortcut="…"` for a text hint.)
 * The menu styles items, so consumers need no overrides of their own. It brings the --hax-ui-* tokens with it, so it
 * looks the same inside and outside the admin.
 *
 * Opening it focuses the first item; Up, Down, Home, End and Tab move,
 * Enter and Space run, Escape closes.
 *
 * @demo demo/index.html
 * @element simple-context-menu
 */
const SHORTCUT_KEY_LABELS = {
  ArrowUp: "\u2191",
  ArrowDown: "\u2193",
  ArrowLeft: "\u2190",
  ArrowRight: "\u2192",
  Enter: "\u21b5",
  Delete: "Del",
  Backspace: "\u232b",
  Escape: "Esc",
  " ": "Space",
};

/**
 * One way to write a shortcut for every item menu, matching Merlin's labels
 * (KeyboardShortcutManager.generateLabel: "Ctrl", "Alt", "Meta", then
 * "\u21e7" for Shift, then the key, no separators, e.g. "Ctrl\u21e7S"),
 * with arrows and Enter as their symbols. Returns the visible label and
 * the aria-keyshortcuts value.
 * @param {object} descriptor { key, ctrl, alt, meta, shift }
 * @returns {{label: string, aria: string}}
 */
export function contextMenuShortcut(descriptor) {
  if (!descriptor || !descriptor.key) {
    return { label: "", aria: "" };
  }
  const key = String(descriptor.key);
  const label = [];
  const aria = [];
  if (descriptor.ctrl) {
    label.push("Ctrl");
    aria.push("Control");
  }
  if (descriptor.alt) {
    label.push("Alt");
    aria.push("Alt");
  }
  if (descriptor.meta) {
    label.push("Meta");
    aria.push("Meta");
  }
  if (descriptor.shift) {
    label.push("\u21e7");
    aria.push("Shift");
  }
  label.push(
    SHORTCUT_KEY_LABELS[key] || (key.length === 1 ? key.toUpperCase() : key),
  );
  aria.push(key === " " ? "Space" : key.length === 1 ? key.toUpperCase() : key);
  return { label: label.join(""), aria: aria.join("+") };
}

class SimpleContextMenu extends DDD {
  static get tag() {
    return "simple-context-menu";
  }

  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminTokens,
      ...HaxUiAdminScheme,
      css`
        :host {
          display: inline-block;
        }

        dialog {
          position: fixed;
          box-sizing: border-box;
          min-width: var(--simple-context-menu-min-width, 200px);
          max-width: calc(100vw - var(--ddd-spacing-4, 16px));
          max-height: calc(100vh - var(--ddd-spacing-4, 16px));
          overflow: auto;
          padding: var(--ddd-spacing-1, 4px);
          margin: 0;
          right: auto;
          bottom: auto;
          z-index: var(--simple-context-menu-z-index, 1000);
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          line-height: 1.3;
          text-align: left;
          color: var(--hax-ui-text);
          background-color: var(
            --simple-context-menu-background,
            var(--hax-ui-surface)
          );
          border: 1px solid
            var(--simple-context-menu-border-color, var(--hax-ui-line-strong));
          border-radius: var(--hax-ui-radius-lg);
          box-shadow: var(
            --simple-context-menu-shadow,
            var(--hax-ui-shadow-popover)
          );
        }
        dialog::backdrop {
          background: transparent;
        }
        .menu {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        /* a small label, as the admin's group titles */
        .menu-header {
          padding: var(--hax-ui-gap) var(--hax-ui-gap-md) var(--hax-ui-gap);
          font-size: 11px;
          font-weight: var(--ddd-font-weight-bold, 700);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(
            --simple-context-menu-header-color,
            var(--hax-ui-text-muted)
          );
        }

        /* every item: a 32px row, 16px icon, label from the left */
        ::slotted(:not(hr)) {
          display: flex;
          align-items: center;
          box-sizing: border-box;
          width: 100%;
          margin: 0;
          border-radius: var(--hax-ui-radius);
          cursor: pointer;
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
          text-align: left;
          --simple-toolbar-button-height: var(--hax-ui-row-height);
          --simple-toolbar-button-width: var(--hax-ui-icon);
          --simple-toolbar-button-min-width: 100%;
          --simple-toolbar-button-flex: 1 1 auto;
          --simple-toolbar-button-justify: flex-start;
          --simple-toolbar-button-padding: 0 var(--hax-ui-gap-md);
          --simple-toolbar-button-label-padding: var(--hax-ui-gap-md);
          --simple-toolbar-button-label-white-space: nowrap;
          --simple-toolbar-border-radius: var(--hax-ui-radius);
          --simple-toolbar-button-border-width: 0;
          --simple-toolbar-button-border-color: transparent;
          --simple-toolbar-button-bg: transparent;
          --simple-toolbar-button-color: var(--hax-ui-text);
          --simple-toolbar-button-opacity: 1;
          --simple-toolbar-button-hover-color: var(--hax-ui-text);
          --simple-toolbar-button-hover-bg: var(--hax-ui-hover);
          --simple-toolbar-button-hover-border-color: transparent;
          --simple-toolbar-button-hover-opacity: 1;
          --simple-toolbar-button-disabled-color: var(--hax-ui-text-muted);
          --simple-toolbar-button-disabled-bg: transparent;
          --simple-toolbar-button-disabled-border-color: transparent;
          --simple-toolbar-button-disabled-opacity: 0.7;
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
          --simple-icon-color: currentColor;
        }
        /* a plain button or link slotted in gets the same row */
        ::slotted(button),
        ::slotted(a) {
          min-height: var(--hax-ui-row-height);
          gap: var(--hax-ui-gap-md);
          padding: 0 var(--hax-ui-gap-md);
          border: 0;
          background: transparent;
          text-decoration: none;
        }
        ::slotted(button:hover),
        ::slotted(a:hover) {
          background-color: var(--hax-ui-hover);
        }
        /* the focus ring shows for keyboard use */
        :host([keyboard]) ::slotted(:not(hr):focus-within),
        :host([keyboard]) ::slotted(:not(hr):focus) {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: calc(-1 * var(--hax-ui-focus-width));
        }
        ::slotted([disabled]) {
          cursor: default;
          color: var(--hax-ui-text-muted);
          pointer-events: none;
        }
        ::slotted(.danger) {
          color: var(--hax-ui-danger);
          --simple-toolbar-button-color: var(--hax-ui-danger);
          --simple-toolbar-button-hover-color: var(--hax-ui-danger);
          --simple-toolbar-button-hover-bg: var(--hax-ui-danger-soft);
        }
        ::slotted(.danger[disabled]) {
          color: var(--hax-ui-text-muted);
          --simple-toolbar-button-disabled-color: var(--hax-ui-text-muted);
        }
        /* a plain item's optional text hint at the right of the row */
        ::slotted([data-shortcut])::after {
          content: attr(data-shortcut);
          flex: none;
          margin-left: auto;
          padding: 0 var(--hax-ui-gap-md);
          font-family: var(--ddd-font-mono, monospace);
          font-size: 11px;
          color: var(--hax-ui-text-muted);
          pointer-events: none;
        }
        ::slotted(hr) {
          align-self: stretch;
          height: 0;
          margin: var(--ddd-spacing-1, 4px) 0;
          border: 0;
          border-top: 1px solid var(--hax-ui-line);
        }
        ::slotted([hidden]) {
          display: none;
        }
      `,
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Title displayed in menu header
       */
      title: {
        type: String,
      },
      /**
       * Whether the menu is open
       */
      open: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Position strategy: 'anchor' (relative to trigger), 'fixed' (custom positioning)
       */
      positionStrategy: {
        type: String,
        attribute: "position-strategy",
      },
      /**
       * X coordinate for fixed positioning
       */
      x: {
        type: Number,
      },
      /**
       * Y coordinate for fixed positioning
       */
      y: {
        type: Number,
      },
      /**
       * Offset from anchor element (in pixels)
       */
      offset: {
        type: Number,
      },
      /**
       * Set while the menu is used from the keyboard; shows the focus ring
       */
      keyboard: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  constructor() {
    super();
    this.title = "";
    this.open = false;
    this.positionStrategy = "anchor";
    this.x = 0;
    this.y = 0;
    this.offset = 4;
    this.keyboard = false;
    this._anchorElement = null;
  }

  render() {
    return html`
      <dialog
        id="menu"
        @click=${this._handleBackdropClick}
        @keydown=${this._handleKeydown}
        @focusout=${this._handleFocusOut}
        @pointermove=${this._onPointer}
      >
        ${this.title ? this._header() : ""}
        <div class="menu" role="menu" aria-label="${this.title || "Menu"}">
          <slot @slotchange=${this._onSlotChange}></slot>
        </div>
      </dialog>
    `;
  }

  /** the visible label; the menu itself is named from title */
  _header() {
    const t = this.title;
    return html`<div class="menu-header" aria-hidden="true">${t}</div>`;
  }

  /**
   * Items are menuitems and rules are separators, as simple-toolbar's own
   * menus mark them; an item that sets its own role keeps it
   */
  _onSlotChange(e) {
    const slot = e && e.target ? e.target : null;
    if (!slot || !slot.assignedElements) {
      return;
    }
    slot.assignedElements({ flatten: true }).forEach((node) => {
      if (node.hasAttribute("role") && !node.hasAttribute("data-menu-role")) {
        return;
      }
      node.setAttribute("data-menu-role", "");
      node.setAttribute(
        "role",
        node.tagName === "HR" ? "separator" : "menuitem",
      );
    });
  }

  _onPointer() {
    if (this.keyboard) {
      this.keyboard = false;
    }
  }

  /**
   * Toggle menu visibility
   * @param {Element} anchorElement - Element to position menu relative to
   */
  toggle(anchorElement = null) {
    if (this.open) {
      this.close();
    } else {
      this.openMenu(anchorElement);
    }
  }

  /**
   * Open the menu
   * @param {Element} anchorElement - Element to position menu relative to
   */
  openMenu(anchorElement = null) {
    const dialog = this.shadowRoot.querySelector("#menu");
    if (!dialog) return;

    this._anchorElement = anchorElement;
    this.keyboard = lastInput === "key";
    dialog.showModal();
    this.open = true;

    // Position the dialog
    this._positionDialog(dialog, anchorElement);

    // Focus first focusable item
    setTimeout(() => {
      const firstItem = this._getFocusableItems()[0];
      if (firstItem) firstItem.focus();
    }, 0);

    this.dispatchEvent(
      new CustomEvent("simple-context-menu-opened", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Close the menu
   */
  close() {
    const dialog = this.shadowRoot.querySelector("#menu");
    if (dialog && dialog.open) {
      dialog.close();
      this.open = false;
      this.dispatchEvent(
        new CustomEvent("simple-context-menu-closed", {
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  /**
   * Position the dialog based on strategy
   */
  _positionDialog(dialog, anchorElement) {
    // Override browser default dialog positioning that may interfere
    dialog.style.margin = "0";
    dialog.style.right = "auto";
    dialog.style.bottom = "auto";

    // the intended corner is worked out from numbers, not read back from
    // the dialog: with prefers-reduced-motion DDD gives every transition a
    // near-zero duration, so top and left are still mid-transition (at 0)
    // when read here and the menu would be pinned to the corner
    const dialogRect = dialog.getBoundingClientRect();
    let top = dialogRect.top;
    let left = dialogRect.left;
    if (this.positionStrategy === "fixed") {
      top = this.y;
      left = this.x;
    } else if (this.positionStrategy === "anchor" && anchorElement) {
      const rect = anchorElement.getBoundingClientRect();
      top = rect.bottom + this.offset;
      left = rect.left;
    }

    // Ensure dialog stays within viewport
    const viewportWidth = globalThis.innerWidth;
    const viewportHeight = globalThis.innerHeight;

    // Prevent overflow on the right — flip to right-align for anchor strategy
    if (left + dialogRect.width > viewportWidth) {
      if (this.positionStrategy === "anchor" && anchorElement) {
        const rect = anchorElement.getBoundingClientRect();
        left = rect.right - dialogRect.width;
      } else {
        left = Math.max(0, viewportWidth - dialogRect.width);
      }
    }

    // Prevent overflow on the left
    if (left < 0) {
      left = 0;
    }

    // Prevent overflow on the bottom — flip above anchor for anchor strategy
    if (top + dialogRect.height > viewportHeight) {
      if (this.positionStrategy === "anchor" && anchorElement) {
        const rect = anchorElement.getBoundingClientRect();
        top = rect.top - dialogRect.height - this.offset;
      } else {
        top = Math.max(0, viewportHeight - dialogRect.height);
      }
    }

    // Prevent overflow on the top
    if (top < 0) {
      top = 0;
    }

    dialog.style.top = `${top}px`;
    dialog.style.left = `${left}px`;
  }

  /**
   * Get all focusable items in the menu
   */
  _isFocusableMenuNode(node) {
    if (!node || node.hasAttribute("disabled")) {
      return false;
    }
    if (node.getAttribute("aria-disabled") === "true") {
      return false;
    }
    if (
      ["BUTTON", "A", "INPUT", "SELECT", "TEXTAREA", "SUMMARY"].includes(
        node.tagName,
      )
    ) {
      return true;
    }
    if (node.tabIndex >= 0) {
      return true;
    }
    if (node.hasAttribute("tabindex")) {
      const tabIndexAttr = parseInt(node.getAttribute("tabindex"));
      if (!Number.isNaN(tabIndexAttr) && tabIndexAttr >= 0) {
        return true;
      }
    }
    if (node.focusableElement && !node.focusableElement.disabled) {
      return true;
    }
    if (node.shadowRoot) {
      const nestedFocusable = node.shadowRoot.querySelector(
        "button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex]:not([tabindex='-1'])",
      );
      if (nestedFocusable) {
        return true;
      }
    }
    return false;
  }
  _getFocusableItems() {
    const slot = this.shadowRoot.querySelector("slot");
    if (!slot) {
      return [];
    }
    const nodes = slot.assignedElements({ flatten: true });
    return nodes.filter((node) => this._isFocusableMenuNode(node));
  }

  _pathContainsItem(path, item) {
    if (!Array.isArray(path) || !item) {
      return false;
    }
    for (let i = 0; i < path.length; i++) {
      const node = path[i];
      if (node === item) {
        return true;
      }
      if (item.focusableElement && node === item.focusableElement) {
        return true;
      }
      if (
        item.shadowRoot &&
        node &&
        node.nodeType &&
        item.shadowRoot.contains(node)
      ) {
        return true;
      }
    }
    return false;
  }

  _itemMatchesFocus(item, activeElement, path) {
    if (!item) {
      return false;
    }
    if (this._pathContainsItem(path, item)) {
      return true;
    }
    if (!activeElement) {
      return false;
    }
    if (activeElement === item) {
      return true;
    }
    if (item.focusableElement && activeElement === item.focusableElement) {
      return true;
    }
    if (item.shadowRoot && item.shadowRoot.activeElement) {
      return true;
    }
    return false;
  }

  _getFocusedItemIndex(menuItems, e) {
    if (!Array.isArray(menuItems) || menuItems.length === 0) {
      return -1;
    }
    const path = e && e.composedPath ? e.composedPath() : [];
    const activeElement = globalThis.document.activeElement;
    for (let i = 0; i < menuItems.length; i++) {
      if (this._itemMatchesFocus(menuItems[i], activeElement, path)) {
        return i;
      }
    }
    return -1;
  }

  _focusItem(menuItems, index) {
    if (!Array.isArray(menuItems) || menuItems.length === 0) {
      return;
    }
    let nextIndex = index;
    while (nextIndex < 0) {
      nextIndex += menuItems.length;
    }
    nextIndex = nextIndex % menuItems.length;
    const item = menuItems[nextIndex];
    if (item && typeof item.focus === "function") {
      item.focus();
    }
  }

  _activateMenuItem(item) {
    if (!item) {
      return;
    }
    if (
      item.focusableElement &&
      !item.focusableElement.disabled &&
      typeof item.focusableElement.click === "function"
    ) {
      item.focusableElement.click();
      return;
    }
    if (item.shadowRoot) {
      const innerControl = item.shadowRoot.querySelector(
        "button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled])",
      );
      if (innerControl && typeof innerControl.click === "function") {
        innerControl.click();
        return;
      }
    }
    if (typeof item.click === "function") {
      item.click();
    }
  }

  /**
   * Handle keyboard navigation
   */
  _handleKeydown(e) {
    const menuItems = this._getFocusableItems();
    if (menuItems.length === 0) return;
    const currentIndex = this._getFocusedItemIndex(menuItems, e);
    if (!this.keyboard && e.key !== "Escape") {
      this.keyboard = true;
    }

    switch (e.key) {
      case "Home":
        e.preventDefault();
        this._focusItem(menuItems, 0);
        break;
      case "End":
        e.preventDefault();
        this._focusItem(menuItems, menuItems.length - 1);
        break;
      case "ArrowDown":
        e.preventDefault();
        this._focusItem(menuItems, currentIndex === -1 ? 0 : currentIndex + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        this._focusItem(
          menuItems,
          currentIndex === -1 ? menuItems.length - 1 : currentIndex - 1,
        );
        break;
      case "Tab":
        e.preventDefault();
        this._focusItem(
          menuItems,
          currentIndex === -1
            ? e.shiftKey
              ? menuItems.length - 1
              : 0
            : currentIndex + (e.shiftKey ? -1 : 1),
        );
        break;
      case "Escape":
        e.preventDefault();
        this.close();
        break;
      case "Enter":
      case " ": {
        e.preventDefault();
        let itemToActivate = currentIndex >= 0 ? menuItems[currentIndex] : null;
        if (!itemToActivate) {
          const path = e && e.composedPath ? e.composedPath() : [];
          for (let i = 0; i < path.length; i++) {
            const node = path[i];
            if (
              node &&
              node !== this &&
              typeof node.click === "function" &&
              node.nodeName !== "DIALOG"
            ) {
              itemToActivate = node;
              break;
            }
          }
        }
        if (itemToActivate) {
          this._activateMenuItem(itemToActivate);
        }
        break;
      }
    }
  }

  _handleFocusOut() {
    setTimeout(() => {
      if (!this.open) {
        return;
      }
      const activeElement = globalThis.document.activeElement;
      if (!activeElement) {
        this.close();
        return;
      }
      const menuItems = this._getFocusableItems();
      const activeInMenu = menuItems.some((item) =>
        this._itemMatchesFocus(item, activeElement, []),
      );
      if (!activeInMenu) {
        this.close();
      }
    }, 0);
  }

  /**
   * Handle backdrop click to close
   */
  _handleBackdropClick(e) {
    const dialog = e.target;
    if (e.target.nodeName === "DIALOG") {
      const rect = dialog.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        this.close();
      }
    }
  }
}

globalThis.customElements.define(SimpleContextMenu.tag, SimpleContextMenu);
export { SimpleContextMenu };
