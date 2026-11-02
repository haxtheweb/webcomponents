/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css, nothing } from "lit";
import "@haxtheweb/simple-fields/lib/simple-context-menu.js";
import "@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js";

/**
 * The row actions menu the admin lists share with outline-designer: a
 * right click (or a long press) on a row, Shift+F10 or the context menu key
 * opens a simple-context-menu of what can be done to that row. Each list
 * renders one menu and fills it from the row it opened for; every item runs
 * the same code as the control it mirrors (the row button or the action
 * bar), so the menu is another way in, never another behavior.
 *
 * A list that uses it:
 * - renders `renderAdminRowMenu(title, items)` once, with
 *   `items` from the row in `this._rowMenuFor`
 * - calls `openAdminRowMenu(menu, e, anchor)` from its contextmenu and
 *   keydown handlers, after setting `this._rowMenuFor`
 * - spreads `AdminRowMenuStyles`
 *
 * An item is `{ id, label, icon, disabled, danger, run }`; a `separator`
 * item draws a rule between groups.
 */

/**
 * The ⋯ at the end of a row: the item menu for touch and for anyone who
 * does not know to right click. Opens under itself.
 * @param {string} label read out, e.g. "Actions for Welcome"
 * @param {Function} onOpen called with the click event
 */
export function renderRowMoreButton(label, onOpen) {
  return html`<button
    type="button"
    class="hax-ui-icon-btn row-more"
    aria-haspopup="menu"
    aria-label="${label}"
    title="${label}"
    @click="${(e) => {
      e.stopPropagation();
      onOpen(e);
    }}"
  >
    <simple-icon-lite
      icon="hax:admin-more"
      aria-hidden="true"
    ></simple-icon-lite>
  </button>`;
}

/**
 * The keyboard model every admin list shares (Content, Files, Structure):
 * - Up and Down move to the same control in the row above or below
 * - Shift+Up and Shift+Down also check the row moved to
 * - Space on a row control (not a checkbox, which has its own) toggles
 *   the row's checkbox
 * - Ctrl or Cmd+A checks every row; Escape clears the selection
 * Returns true when it handled the key, so the caller can stop there.
 * @param {KeyboardEvent} e
 * @param {object} list
 * @param {Function} list.rows the row elements, in order
 * @param {Function} list.isChecked (row) whether a row is checked
 * @param {Function} list.setChecked (row, checked) checks or unchecks it
 * @param {Function} list.selectAll checks every row
 * @param {Function} list.clear clears the selection; returns true if
 *   there was one to clear
 */
export function handleAdminListKey(e, list) {
  if (!e || !list || e.defaultPrevented) {
    return false;
  }
  const path = e.composedPath ? e.composedPath() : [e.target];
  const target = path[0];
  const tag = target && target.tagName ? target.tagName.toLowerCase() : "";
  const typing =
    tag === "textarea" ||
    tag === "select" ||
    (tag === "input" && target.type !== "checkbox") ||
    (target && target.isContentEditable);
  if (typing) {
    return false;
  }
  const rows = list.rows();
  const row = rows.find((r) => path.includes(r));
  const mod = e.ctrlKey || e.metaKey;
  if (mod && (e.key === "a" || e.key === "A")) {
    e.preventDefault();
    list.selectAll();
    return true;
  }
  if (e.key === "Escape") {
    if (list.clear()) {
      e.preventDefault();
      e.stopPropagation();
      return true;
    }
    return false;
  }
  if (!row) {
    return false;
  }
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    const next = rows[rows.indexOf(row) + (e.key === "ArrowDown" ? 1 : -1)];
    if (!next) {
      return false;
    }
    e.preventDefault();
    // the same control in the next row: its checkbox, name, or first
    const controls = (r) => [
      ...r.querySelectorAll("input, button, a[href], [tabindex='0']"),
    ];
    const at = controls(row).indexOf(target);
    const there = controls(next);
    const focusTo = there[at > -1 ? at : 0] || there[0];
    if (e.shiftKey) {
      if (!list.isChecked(row)) {
        list.setChecked(row, true);
      }
      list.setChecked(next, true);
    }
    if (focusTo) {
      focusTo.focus();
    }
    return true;
  }
  if (e.key === " " && tag !== "input") {
    e.preventDefault();
    list.setChecked(row, !list.isChecked(row));
    return true;
  }
  return false;
}

/**
 * Shift+click on a checkbox checks or unchecks every row between it and
 * the last one clicked, as file managers do. Keep one per list.
 */
export function createRangeSelector() {
  let last = -1;
  return {
    /**
     * @param {number} index the clicked row
     * @param {boolean} checked its new state
     * @param {boolean} shift whether Shift was held
     * @param {Function} apply (index, checked) for each row in the range
     */
    click(index, checked, shift, apply) {
      if (shift && last > -1 && last !== index) {
        const from = Math.min(last, index);
        const to = Math.max(last, index);
        for (let i = from; i <= to; i++) {
          apply(i, checked);
        }
      } else {
        apply(index, checked);
      }
      last = index;
    },
    reset() {
      last = -1;
    },
  };
}

/** the keys that open a context menu from the keyboard */
export function isAdminRowMenuKey(e) {
  return !!e && ((e.shiftKey && e.key === "F10") || e.key === "ContextMenu");
}

/**
 * Open the menu for a row. A pointer opens it where it was pressed; the
 * keyboard (and a contextmenu event the keyboard raised, which has no
 * pointer position) opens it under the row's focused control.
 * @param {Element} menu the simple-context-menu
 * @param {Event} e the contextmenu or keydown event
 * @param {Element} anchor the element to open under from the keyboard
 */
export function openAdminRowMenu(menu, e, anchor) {
  if (!menu) {
    return;
  }
  if (menu.open) {
    menu.close();
  }
  const fromPointer =
    e && e.type === "contextmenu" && (e.clientX !== 0 || e.clientY !== 0);
  if (fromPointer) {
    menu.positionStrategy = "fixed";
    menu.x = e.clientX;
    menu.y = e.clientY;
    menu.openMenu(null);
  } else {
    menu.positionStrategy = "anchor";
    menu.openMenu(anchor || null);
  }
}

/**
 * The menu, filled from the row it is open for.
 * @param {string} title read out as the menu's name
 * @param {Array} items the row's actions
 * @param {Function} onClosed called when the menu closes
 */
export function renderAdminRowMenu(title, items, onClosed) {
  return html`<simple-context-menu
    class="admin-row-menu"
    title="${title}"
    @simple-context-menu-closed="${onClosed || nothing}"
  >
    ${(items || []).map((item) =>
      item.separator
        ? html`<hr class="admin-row-menu-sep" />`
        : html`<simple-toolbar-button
            class="${item.danger ? "danger" : ""}"
            data-action="${item.id}"
            ?disabled="${!!item.disabled}"
            icon="${item.icon || ""}"
            label="${item.label}"
            show-text-label
            @click="${(e) => {
              e.stopPropagation();
              if (item.disabled) {
                return;
              }
              const menu = e.target.closest("simple-context-menu");
              if (menu) {
                menu.close();
              }
              item.run();
            }}"
          ></simple-toolbar-button>`,
    )}
  </simple-context-menu>`;
}

/**
 * simple-context-menu draws the HAX UI menu itself (rows, icons, danger,
 * separators, focus); the admin lists only keep it from inheriting a
 * centred table cell's text alignment
 */
export const AdminRowMenuStyles = [
  css`
    simple-context-menu.admin-row-menu {
      text-align: left;
    }
  `,
];
