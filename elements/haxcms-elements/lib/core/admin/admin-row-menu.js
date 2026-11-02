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

/** left-aligned rows as in outline-designer's page menu; danger reads red */
export const AdminRowMenuStyles = [
  css`
    simple-context-menu.admin-row-menu {
      text-align: left;
      --simple-context-menu-background: var(--hax-ui-surface);
      --simple-context-menu-background-dark: var(--hax-ui-surface);
      --simple-context-menu-border-color: var(--hax-ui-line-strong);
      --simple-context-menu-border-color-dark: var(--hax-ui-line-strong);
      --simple-context-menu-shadow: var(--hax-ui-shadow-popover);
    }
    simple-context-menu.admin-row-menu::part(content) {
      text-align: left;
      align-items: flex-start;
    }
    simple-context-menu.admin-row-menu simple-toolbar-button {
      --simple-toolbar-button-justify: flex-start;
    }
    simple-context-menu.admin-row-menu simple-toolbar-button.danger {
      --simple-toolbar-button-color: var(--hax-ui-danger);
      --simple-toolbar-button-hover-color: var(--hax-ui-danger);
    }
    .admin-row-menu-sep {
      margin: var(--hax-ui-gap) 0;
      border: 0;
      border-top: 1px solid var(--hax-ui-line);
    }
  `,
];
