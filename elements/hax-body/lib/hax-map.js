import { html, css, nothing } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import {
  HaxTrayDetailHeadings,
  HaxUiAdminPrimitives,
} from "@haxtheweb/hax-body/lib/hax-ui-styles.js";
import {
  buildRows,
  isItem,
  isLocked,
  isPageBreak,
  sectionOf,
  nodesToMove,
  dropProblem,
  moveNodes,
  keyboardTarget,
} from "@haxtheweb/hax-body/lib/hax-map-tree.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { autorun, toJS } from "mobx";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";

// how far the pointer travels before a press becomes a drag
const DRAG_START = 4;
// how close to the top or bottom of the scrolling panel a drag scrolls it
const SCROLL_EDGE = 40;
// how long a row that just moved stays lit
const FLASH_MS = 700;
// how long rows take to slide to their new place
const SLIDE_MS = 260;

/**
 * `hax-map`
 * @element hax-map
 * The editor tray's page outline (Structure): every block on the page as a
 * tree row, as outline-designer draws pages. Check rows to lock, unlock or
 * delete them together; drag rows (or press Alt+arrows) to move blocks, a
 * heading with its section, into and out of layouts that take them; list
 * items are checked, deleted and reordered on their own. What the outline
 * does shows on the page too (hax-body's outlineMarks): checked blocks get
 * a blue scrim, the hovered row's branch lights up, a drag shows what it
 * carries and where it lands, and moves slide into place. The rules live
 * in hax-map-tree.js.
 */
class HaxMap extends I18NMixin(SimpleColors) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      super.styles,
      ...HaxTrayDetailHeadings,
      ...HaxUiAdminPrimitives,
      css`
        :host {
          display: block;
          font-size: var(--hax-ui-admin-font-size, 14px);
          color: var(--hax-ui-text, var(--hax-ui-color));
          --hax-map-select-width: calc(
            var(--hax-ui-target, 24px) + var(--hax-ui-gap, 4px)
          );
        }
        /* Select all and the count, or the bulk actions for checked rows;
           stays under the tray title bar */
        .toolbar {
          position: sticky;
          top: var(--hax-ui-titlebar-height, 48px);
          z-index: 2;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md, 8px);
          height: var(--ddd-spacing-10, 40px);
          padding: 0 var(--hax-ui-gap-md, 8px) 0 0;
          border-bottom: 1px solid var(--hax-ui-line);
          background-color: var(--hax-ui-surface);
        }
        .toolbar.bulk {
          background-color: var(--hax-ui-selected);
        }
        .selcol {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          width: var(--hax-map-select-width);
          margin-left: var(--hax-ui-gap-md, 8px);
        }
        input[type="checkbox"] {
          width: var(--hax-ui-icon, 16px);
          height: var(--hax-ui-icon, 16px);
          margin: 0;
          accent-color: var(--hax-ui-accent-strong);
          cursor: pointer;
        }
        input[type="checkbox"]:focus-visible {
          outline: var(--hax-ui-focus-width, 2px) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .count {
          flex: 1 1 auto;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: var(--hax-ui-text-muted);
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
        }
        .bulk .count {
          color: var(--hax-ui-text);
          font-size: var(--hax-ui-admin-font-size, 14px);
          font-weight: 700;
        }
        .bar-btn {
          flex: 0 0 auto;
          box-sizing: border-box;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: var(--hax-ui-row-height, 32px);
          height: var(--hax-ui-row-height, 32px);
          margin: 0;
          padding: 0;
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius, 4px);
          background-color: var(--hax-ui-surface);
          color: var(--hax-ui-text);
          cursor: pointer;
          --simple-icon-width: var(--hax-ui-icon, 16px);
          --simple-icon-height: var(--hax-ui-icon, 16px);
        }
        .bar-btn:hover {
          background-color: var(--hax-ui-hover);
        }
        .bar-btn.danger {
          color: var(--hax-ui-danger);
          border-color: var(--hax-ui-danger);
        }
        .bar-btn.ghost {
          border-color: transparent;
          background-color: transparent;
        }
        .bar-btn:focus-visible,
        .row-btn:focus-visible {
          outline: var(--hax-ui-focus-width, 2px) solid var(--hax-ui-focus);
          outline-offset: 1px;
        }
        .status {
          display: flex;
          align-items: center;
          box-sizing: border-box;
          min-height: var(--hax-ui-row-height, 32px);
          padding: var(--hax-ui-gap, 4px) var(--hax-ui-gap-lg, 12px);
          border-bottom: 1px solid var(--hax-ui-line);
          background-color: var(--hax-ui-accent-soft);
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
          line-height: 1.3;
        }
        .status:empty {
          display: none;
        }
        .keys {
          display: flex;
          flex-wrap: wrap;
          gap: var(--hax-ui-gap, 4px) var(--hax-ui-gap-lg, 12px);
          padding: var(--hax-ui-gap-md, 8px) var(--hax-ui-gap-lg, 12px);
          border-bottom: 1px solid var(--hax-ui-line);
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
          color: var(--hax-ui-text-muted);
        }
        .keys[hidden] {
          display: none;
        }
        .bar-btn[aria-pressed="true"] {
          background-color: var(--hax-ui-selected);
          border-color: var(--hax-ui-accent-strong);
        }
        /* phone: no keyboard expected (as outline-designer) */
        @media (max-width: 599px), (pointer: coarse) and (max-height: 599px) {
          .keys-btn,
          .keys {
            display: none;
          }
        }
        .tree-wrap {
          position: relative;
        }
        ul {
          list-style: none;
          margin: 0;
          padding: var(--hax-ui-gap, 4px) 0;
        }
        /* rows as outline-designer draws them: the select column in the
           left padding, indent guides, type icon, bold type, muted excerpt,
           then the row's actions on hover or focus */
        li {
          position: relative;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md, 8px);
          height: var(--hax-ui-row-height, 32px);
          margin: 0;
          padding: 0 var(--hax-ui-gap-md, 8px) 0
            calc(var(--hax-ui-gap-md, 8px) + var(--hax-map-select-width));
          white-space: nowrap;
          cursor: pointer;
          user-select: none;
        }
        li:hover,
        li:focus-within {
          background-color: var(--hax-ui-hover);
        }
        li:focus-visible {
          outline: var(--hax-ui-focus-width, 2px) solid var(--hax-ui-focus);
          outline-offset: calc(-1 * var(--hax-ui-focus-width, 2px));
        }
        li[aria-selected="true"] {
          background-color: var(--hax-ui-selected);
        }
        /* the block selected in the page */
        li.active {
          box-shadow: inset var(--ddd-border-size-md, 3px) 0 0
            var(--hax-ui-accent-strong);
        }
        li.dragging {
          color: var(--hax-ui-text-muted);
        }
        li.dragging .sel,
        li.dragging .guide,
        li.dragging .type {
          opacity: var(--ddd-opacity-40, 0.4);
        }
        li.drop-into {
          box-shadow: inset 0 0 0 var(--hax-ui-drop-width, 2px)
            var(--hax-ui-drop);
        }
        /* the hovered (or focused) row's branch: its rows tint and the
           guide under it turns into a line, as outline-designer draws a
           branch; a drag keeps it lit for what it carries */
        li.in-tree:not([aria-selected="true"]) {
          background-color: var(--hax-ui-accent-soft);
        }
        .guide.hl {
          border-left: var(--hax-ui-drop-width, 2px) solid var(--hax-ui-drop);
        }
        li.flash {
          animation: hax-map-flash ${FLASH_MS}ms ease-out;
        }
        @keyframes hax-map-flash {
          from {
            background-color: var(--hax-ui-selected);
            box-shadow: inset 0 0 0 var(--hax-ui-drop-width, 2px)
              var(--hax-ui-drop);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          li.flash {
            animation-duration: 1ms;
          }
        }
        .sel {
          position: absolute;
          top: 0;
          bottom: 0;
          left: var(--hax-ui-gap-md, 8px);
          display: flex;
          align-items: center;
          width: var(--hax-map-select-width);
        }
        .guide {
          flex: 0 0 auto;
          align-self: stretch;
          width: var(--hax-ui-gap-md, 8px);
          margin-right: var(--hax-ui-gap, 4px);
          border-left: 1px solid var(--hax-ui-line-strong);
        }
        li simple-icon-lite {
          flex: 0 0 auto;
          --simple-icon-width: var(--hax-ui-icon, 16px);
          --simple-icon-height: var(--hax-ui-icon, 16px);
        }
        .type,
        .grip,
        .lockmark {
          color: var(--hax-ui-text-muted);
        }
        .lockmark {
          --simple-icon-width: calc(var(--hax-ui-icon, 16px) - 2px);
          --simple-icon-height: calc(var(--hax-ui-icon, 16px) - 2px);
        }
        /* a mouse drags the whole row; touch drags by the grip so the
           panel still scrolls */
        .grip {
          display: none;
          touch-action: none;
          cursor: grab;
        }
        @media (hover: none) and (pointer: coarse) {
          .grip {
            display: inline-block;
          }
        }
        .kind {
          flex: 0 0 auto;
          font-weight: 700;
          text-transform: capitalize;
        }
        li.column .kind {
          color: var(--hax-ui-text-muted);
        }
        .ex {
          flex: 1 1 auto;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--hax-ui-text-muted);
        }
        .acts {
          display: none;
          flex: 0 0 auto;
          gap: 2px;
        }
        li:hover .acts,
        li:focus-within .acts {
          display: inline-flex;
        }
        .row-btn {
          box-sizing: border-box;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: var(--hax-ui-target, 24px);
          height: var(--hax-ui-target, 24px);
          margin: 0;
          padding: 0;
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius, 4px);
          background-color: var(--hax-ui-surface);
          color: var(--hax-ui-text);
          cursor: pointer;
        }
        .row-btn simple-icon-lite {
          --simple-icon-width: calc(var(--hax-ui-icon, 16px) - 2px);
          --simple-icon-height: calc(var(--hax-ui-icon, 16px) - 2px);
        }
        .row-btn:hover {
          background-color: var(--hax-ui-hover);
        }
        .row-btn.danger {
          color: var(--hax-ui-danger);
          border-color: var(--hax-ui-danger);
        }
        .row-btn[disabled] {
          opacity: var(--ddd-opacity-40, 0.4);
          cursor: not-allowed;
        }
        .dropline {
          position: absolute;
          right: var(--hax-ui-gap-md, 8px);
          height: var(--hax-ui-drop-width, 2px);
          margin-top: calc(var(--hax-ui-drop-width, 2px) / -2);
          border-radius: var(--hax-ui-radius, 4px);
          background-color: var(--hax-ui-drop);
          pointer-events: none;
        }
        .dropline::before {
          content: "";
          position: absolute;
          left: -5px;
          top: -4px;
          box-sizing: border-box;
          width: 10px;
          height: 10px;
          border: var(--hax-ui-drop-width, 2px) solid var(--hax-ui-drop);
          border-radius: var(--hax-ui-radius-pill, 999px);
          background-color: var(--hax-ui-surface);
        }
        .drag-ghost {
          position: fixed;
          z-index: 10000;
          display: inline-flex;
          align-items: center;
          gap: var(--hax-ui-gap-md, 8px);
          max-width: 75%;
          padding: var(--hax-ui-gap, 4px) var(--hax-ui-gap-md, 8px);
          border: 1px solid var(--hax-ui-drop);
          border-radius: var(--hax-ui-radius, 4px);
          background-color: var(--hax-ui-surface);
          box-shadow: var(--hax-ui-shadow-popover);
          color: var(--hax-ui-text);
          font-weight: 500;
          white-space: nowrap;
          pointer-events: none;
        }
        .drag-ghost.no-drop {
          border-color: var(--hax-ui-danger);
        }
        .drag-ghost simple-icon-lite {
          --simple-icon-width: var(--hax-ui-icon, 16px);
          --simple-icon-height: var(--hax-ui-icon, 16px);
          color: var(--hax-ui-text-muted);
        }
        .drag-ghost .t {
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .drag-ghost .n {
          font-weight: 400;
          color: var(--hax-ui-text-muted);
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          margin: -1px;
          padding: 0;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
          border: 0;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.elementList = [];
    this.dark = false;
    this.status = "";
    this.focusIndex = 0;
    this.__selected = new Set();
    this.__anchor = null;
    this.__drag = null;
    this.__dropTarget = null;
    this.__focusNode = null;
    // the row whose branch is lit: under the pointer, else the focused row
    this.__hoverIndex = -1;
    this.__treeFocused = false;
    this.__flashNodes = new Set();
    this.__rowTops = null;
    this.showKeys = false;
    this.__mapMutationObserver = null;
    this.__mapMutationObserverTarget = null;
    this.__mapRefreshDebounce = null;
    this._onDragMove = this._onDragMove.bind(this);
    this._onDragEnd = this._onDragEnd.bind(this);
    this._onDragKey = this._onDragKey.bind(this);
    this.t = {
      pageOutline: "Page outline",
      selectAll: "Select all",
      select: "Select",
      blockCount: "{count} blocks",
      blockCountOne: "1 block",
      selectedCount: "{count} selected",
      lockSelected: "Lock selected",
      unlockSelected: "Unlock selected",
      deleteSelected: "Delete selected",
      clearSelection: "Clear selection",
      lockedSkipsOne: "1 locked: Delete skips it",
      lockedSkips: "{count} locked: Delete skips them",
      lockUnlock: "Lock / Unlock",
      delete: "Delete",
      dragToReorder: "Drag to reorder",
      column: "Column",
      andOne: "{name} and 1 block",
      andMore: "{name} and {count} blocks",
      moveAbove: "Move {what} above {target}",
      moveBelow: "Move {what} below {target}",
      moveInto: "Move {what} into {target}",
      moveToEnd: "Move {what} to the end of the page",
      moved: "Moved {what}",
      deleted: "Deleted {count} blocks",
      deletedOne: "Deleted 1 block",
      noDropLocked: "{target} is locked",
      noDropSlot: "{target} does not take {what}",
      noDropSelf: "A block cannot go inside itself",
      noDropPage: "Page details stays first",
      noDropItem: "List items move only within lists",
      noDropBlock: "{target} takes only list items",
      deletedItem: "Deleted 1 item",
      deletedItems: "Deleted {count} items",
      cannotMove: "{what} cannot move that way",
      keyboardShortcuts: "Keyboard shortcuts",
      keyFocus: "Move between rows",
      keySelect: "Check or uncheck",
      keyRange: "Check a range",
      keySelectAll: "Check all blocks",
      keyMove: "Move up or down",
      keyInOut: "Move into the layout above, or out of a layout",
      keyDelete: "Delete",
      keyLock: "Lock or unlock",
      keyGo: "Go to it on the page",
      keyClear: "Clear checks",
    };
    this.registerLocalization({
      context: this,
      namespace: "hax",
    });
    autorun(() => {
      const _mobx_val_0 = toJS(HAXStore.activeNode);
      Promise.resolve().then(() => {
        if (HAXStore.editMode) {
          this.activeNode = _mobx_val_0;
          this.requestUpdate();
        }
      });
    });
    autorun(() => {
      const _mobx_val_0 = toJS(HAXStore.globalPreferences);
      Promise.resolve().then(() => {
        const globalPreferences = _mobx_val_0;
        const haxUiTheme = (globalPreferences || {}).haxUiTheme || "hax";
        this.dark = haxUiTheme === "haxdark";
      });
    });
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.hidden) {
      this._connectBodyObserver();
      this._scheduleMapRefresh(0);
    }
  }
  disconnectedCallback() {
    this._disconnectBodyObserver();
    this._endDrag();
    this._clearMarks();
    clearTimeout(this.__mapRefreshDebounce);
    clearTimeout(this.__flashTimer);
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("hidden")) {
      if (this.hidden) {
        this._disconnectBodyObserver();
        this._endDrag();
        this._clearMarks();
      } else {
        this._connectBodyObserver();
        this._scheduleMapRefresh(0);
      }
    }
    if (!this.hidden) {
      this._slideRows();
      this._syncMarks();
    }
  }
  _marksLayer() {
    const body = this._body;
    return body && body.outlineMarks ? body.outlineMarks : null;
  }
  _clearMarks() {
    const marks = this._marksLayer();
    if (marks) {
      marks.clear();
    }
  }
  /**
   * Shows on the page what the outline is doing: checked blocks, the lit
   * branch, a drag and where it would land.
   */
  _syncMarks() {
    const marks = this._marksLayer();
    if (!marks) {
      return;
    }
    const drag = this.__drag && this.__drag.started ? this.__drag : null;
    const target = this.__dropTarget;
    const tree = drag ? null : this._treeInfo();
    marks.set({
      selected: this._selectedNodes(),
      tree: tree ? tree.nodes : [],
      moving: drag ? drag.nodes : [],
      drop:
        drag && target && target.dest && !target.problem
          ? { ...target.dest, into: target.intoIndex > -1 }
          : null,
    });
  }
  /**
   * The lit branch: the row under the pointer (or, with the tree focused,
   * the focused row) and the blocks that move with it, a heading's section
   * included. While dragging, what the drag carries.
   */
  _treeInfo() {
    const drag = this.__drag && this.__drag.started ? this.__drag : null;
    if (drag) {
      const first = this.elementList.find((r) => r.node === drag.nodes[0]);
      return {
        index: first ? this.elementList.indexOf(first) : -1,
        depth: first ? first.depth : 0,
        nodes: drag.nodes,
      };
    }
    const index =
      this.__hoverIndex > -1
        ? this.__hoverIndex
        : this.__treeFocused
          ? this.focusIndex
          : -1;
    const row = this.elementList[index];
    if (!row || !row.node || row.kind === "page" || row.kind === "child") {
      return null;
    }
    const nodes =
      row.kind === "block" ? sectionOf(row.node, this._body) : [row.node];
    return { index, depth: row.depth, nodes };
  }
  // where each row is drawn now, by what it shows
  _rowKey(row) {
    return `${row.kind}|${row.slot || ""}`;
  }
  _rowTops() {
    const tops = new Map();
    if (!this.shadowRoot) {
      return tops;
    }
    this.shadowRoot.querySelectorAll("li[data-index]").forEach((li) => {
      const row = this.elementList[parseInt(li.getAttribute("data-index"), 10)];
      if (row && row.node) {
        if (!tops.has(row.node)) {
          tops.set(row.node, new Map());
        }
        tops
          .get(row.node)
          .set(this._rowKey(row), li.getBoundingClientRect().top);
      }
    });
    return tops;
  }
  // rows slide from where they were before the last change (FLIP)
  _slideRows() {
    const tops = this.__rowTops;
    if (!tops || !this.__rowsRebuilt || !this.shadowRoot) {
      return;
    }
    this.__rowTops = null;
    this.__rowsRebuilt = false;
    if (
      globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    this.shadowRoot.querySelectorAll("li[data-index]").forEach((li) => {
      const row = this.elementList[parseInt(li.getAttribute("data-index"), 10)];
      const was = row && tops.get(row.node);
      const top = was ? was.get(this._rowKey(row)) : undefined;
      if (top === undefined || typeof li.animate !== "function") {
        return;
      }
      const dy = top - li.getBoundingClientRect().top;
      if (dy) {
        li.animate(
          [{ transform: `translateY(${dy}px)` }, { transform: "none" }],
          { duration: SLIDE_MS, easing: "cubic-bezier(0.2, 0, 0, 1)" },
        );
      }
    });
  }
  /**
   * Runs change() (which moves or deletes blocks) so that what changed is
   * easy to follow: on the page the blocks slide to their new place, moved
   * ones (flash) light up and deleted ones (gone) leave a fading hatch; in
   * the outline the rows slide and moved rows light up.
   */
  _change(change, { flash = [], gone = [] } = {}) {
    this.__rowTops = this._rowTops();
    this.__flashNodes = new Set(flash);
    clearTimeout(this.__flashTimer);
    this.__flashTimer = setTimeout(() => {
      this.__flashNodes = new Set();
      this.requestUpdate();
    }, FLASH_MS);
    const nodes = [];
    this.elementList.forEach((row) => {
      if (row.node && row.kind !== "column" && !nodes.includes(row.node)) {
        nodes.push(row.node);
      }
    });
    const marks = this._marksLayer();
    return marks ? marks.animate(nodes, change, { flash, gone }) : change();
  }
  _scheduleMapRefresh(delay = 75) {
    if (this.hidden) {
      return;
    }
    clearTimeout(this.__mapRefreshDebounce);
    this.__mapRefreshDebounce = setTimeout(() => {
      this.updateHAXMap();
    }, delay);
  }
  _disconnectBodyObserver() {
    if (this.__mapMutationObserver) {
      this.__mapMutationObserver.disconnect();
    }
    this.__mapMutationObserver = null;
    this.__mapMutationObserverTarget = null;
  }
  _connectBodyObserver() {
    const activeBody = HAXStore.activeHaxBody;
    if (!this.isConnected || this.hidden || !activeBody) {
      this._disconnectBodyObserver();
      return;
    }
    if (
      this.__mapMutationObserver &&
      this.__mapMutationObserverTarget === activeBody
    ) {
      return;
    }
    this._disconnectBodyObserver();
    this.__mapMutationObserverTarget = activeBody;
    this.__mapMutationObserver = new MutationObserver((mutations) => {
      if (this.hidden) {
        return;
      }
      let shouldRefresh = false;
      for (const mutation of mutations) {
        if (
          mutation.type === "childList" ||
          mutation.type === "characterData"
        ) {
          shouldRefresh = true;
          break;
        }
        if (
          mutation.type === "attributes" &&
          mutation.attributeName &&
          ["slot", "data-hax-lock", "class", "id", "layout"].includes(
            mutation.attributeName,
          )
        ) {
          shouldRefresh = true;
          break;
        }
      }
      // a drag keeps the rows it started with until it ends
      if (shouldRefresh && !this.__drag) {
        this._scheduleMapRefresh(40);
      }
    });
    this.__mapMutationObserver.observe(activeBody, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["slot", "data-hax-lock", "class", "id", "layout"],
    });
  }
  _schemaFor(tag) {
    return HAXStore.haxSchemaFromTag(tag) || {};
  }
  _nameFor(tag) {
    const def = this._schemaFor(tag);
    if (def && def.gizmo && def.gizmo.title) {
      return { name: def.gizmo.title, icon: def.gizmo.icon };
    }
    return tag && tag.includes("-")
      ? { name: "Widget", icon: "hax:templates" }
      : { name: "HTML block", icon: "hax:paragraph" };
  }
  /**
   * Rebuilds the rows from the active hax-body.
   */
  updateHAXMap(_e) {
    this._connectBodyObserver();
    const body = HAXStore.activeHaxBody;
    if (!body || !body.children) {
      this.elementList = [];
      return;
    }
    const rows = buildRows(body, (tag) => this._schemaFor(tag));
    this.elementList = rows.map((row) => {
      if (row.kind === "column") {
        const index = row.node
          ? (row.slotInfo && row.slotInfo.title) || row.slot
          : "";
        return {
          ...row,
          icon: "icons:view-column",
          name: /^\d+$/.test(index) ? `${this.t.column} ${index}` : index,
          excerpt: "",
        };
      }
      const { name, icon } = this._nameFor(row.tag);
      return { ...row, icon, name, excerpt: this.excerptFor(row.node) };
    });
    // checked rows that left the page are no longer checked
    [...this.__selected].forEach((node) => {
      if (!body.contains(node)) {
        this.__selected.delete(node);
      }
    });
    if (this.__focusNode) {
      const index = this.elementList.findIndex(
        (row) => row.node === this.__focusNode && row.kind !== "column",
      );
      if (index > -1) {
        this.focusIndex = index;
        this.updateComplete.then(() => this._focusRow(index));
      }
      this.__focusNode = null;
    }
    if (this.focusIndex >= this.elementList.length) {
      this.focusIndex = Math.max(0, this.elementList.length - 1);
    }
    this.__hoverIndex = -1;
    if (this.__rowTops) {
      this.__rowsRebuilt = true;
    }
    this.requestUpdate();
  }
  get _body() {
    return HAXStore.activeHaxBody;
  }
  // what Select all checks and the count counts: blocks, not list items
  _selectableRows() {
    return this.elementList.filter(
      (row) => row.selectable && row.kind === "block",
    );
  }
  _selectedNodes() {
    return this.elementList
      .filter((row) => row.selectable && this.__selected.has(row.node))
      .map((row) => row.node);
  }
  _format(template, values) {
    return Object.keys(values).reduce(
      (out, key) => out.split(`{${key}}`).join(values[key]),
      template || "",
    );
  }
  render() {
    if (this.hidden) {
      return html``;
    }
    const selectable = this._selectableRows();
    const selected = this._selectedNodes();
    const all =
      selectable.length > 0 &&
      selectable.every((row) => this.__selected.has(row.node));
    const some = selected.length > 0 && !all;
    const tree = this._treeInfo();
    const mod =
      globalThis.navigator &&
      /Mac|iPhone|iPad/.test(globalThis.navigator.platform || "")
        ? "⌘"
        : "Ctrl";
    const lockedCount = selected.filter((node) =>
      isLocked(node, this._body),
    ).length;
    let status = this.status;
    if (!status && selected.length > 0 && lockedCount > 0) {
      status =
        lockedCount === 1
          ? this.t.lockedSkipsOne
          : this._format(this.t.lockedSkips, { count: lockedCount });
    }
    return html`
      <div class="toolbar ${selected.length > 0 ? "bulk" : ""}">
        <span class="selcol">
          <input
            type="checkbox"
            aria-label="${this.t.selectAll}"
            title="${this.t.selectAll}"
            .checked="${all}"
            .indeterminate="${some}"
            ?disabled="${selectable.length === 0}"
            @change="${this._toggleAll}"
          />
        </span>
        ${
          selected.length > 0
            ? html`<span class="count"
                  >${this._format(this.t.selectedCount, {
                    count: selected.length,
                  })}</span
                >
                <button
                  type="button"
                  class="bar-btn"
                  aria-label="${this.t.lockSelected}"
                  title="${this.t.lockSelected}"
                  @click="${this.lockSelected}"
                >
                  <simple-icon-lite icon="hax:admin-lock"></simple-icon-lite>
                </button>
                <button
                  type="button"
                  class="bar-btn"
                  aria-label="${this.t.unlockSelected}"
                  title="${this.t.unlockSelected}"
                  @click="${this.unlockSelected}"
                >
                  <simple-icon-lite icon="hax:admin-unlock"></simple-icon-lite>
                </button>
                <button
                  type="button"
                  class="bar-btn danger"
                  aria-label="${this.t.deleteSelected}"
                  title="${this.t.deleteSelected}"
                  @click="${this.deleteSelected}"
                >
                  <simple-icon-lite icon="hax:admin-delete"></simple-icon-lite>
                </button>
                <button
                  type="button"
                  class="bar-btn ghost"
                  aria-label="${this.t.clearSelection}"
                  title="${this.t.clearSelection}"
                  @click="${this.clearSelection}"
                >
                  <simple-icon-lite icon="hax:admin-close"></simple-icon-lite>
                </button>`
            : html`<span class="count"
                  >${
                    selectable.length === 1
                      ? this.t.blockCountOne
                      : this._format(this.t.blockCount, {
                          count: selectable.length,
                        })
                  }</span
                >
                <button
                  type="button"
                  class="bar-btn ghost keys-btn"
                  aria-label="${this.t.keyboardShortcuts}"
                  title="${this.t.keyboardShortcuts}"
                  aria-pressed="${this.showKeys ? "true" : "false"}"
                  aria-controls="keys"
                  @click="${this._toggleKeys}"
                >
                  <simple-icon-lite icon="hardware:keyboard"></simple-icon-lite>
                </button>`
        }
      </div>
      <div class="status" role="status">${status}</div>
      <div class="keys" id="keys" ?hidden="${!this.showKeys}">
        <span class="hax-ui-sr-only">${this.t.keyboardShortcuts}:</span>
        <span
          ><kbd class="hax-ui-kbd">↑</kbd
          ><kbd class="hax-ui-kbd">↓</kbd> ${this.t.keyFocus}</span
        >
        <span><kbd class="hax-ui-kbd">Space</kbd> ${this.t.keySelect}</span>
        <span
          ><kbd class="hax-ui-kbd">Shift</kbd>+<kbd class="hax-ui-kbd">↑</kbd
          ><kbd class="hax-ui-kbd">↓</kbd> ${this.t.keyRange}</span
        >
        <span
          ><kbd class="hax-ui-kbd">${mod}</kbd>+<kbd class="hax-ui-kbd">A</kbd>
          ${this.t.keySelectAll}</span
        >
        <span
          ><kbd class="hax-ui-kbd">Alt</kbd>+<kbd class="hax-ui-kbd">↑</kbd
          ><kbd class="hax-ui-kbd">↓</kbd> ${this.t.keyMove}</span
        >
        <span
          ><kbd class="hax-ui-kbd">Alt</kbd>+<kbd class="hax-ui-kbd">→</kbd
          ><kbd class="hax-ui-kbd">←</kbd> ${this.t.keyInOut}</span
        >
        <span><kbd class="hax-ui-kbd">Del</kbd> ${this.t.keyDelete}</span>
        <span><kbd class="hax-ui-kbd">L</kbd> ${this.t.keyLock}</span>
        <span><kbd class="hax-ui-kbd">Enter</kbd> ${this.t.keyGo}</span>
        <span><kbd class="hax-ui-kbd">Esc</kbd> ${this.t.keyClear}</span>
      </div>
      <div class="tree-wrap">
        <ul
          role="tree"
          aria-label="${this.t.pageOutline}"
          aria-multiselectable="true"
          aria-describedby="keys"
          @keydown="${this._onTreeKey}"
          @pointerdown="${this._onPointerDown}"
          @pointerover="${this._onPointerOver}"
          @pointerleave="${this._onPointerLeave}"
          @focusin="${this._onTreeFocus}"
          @focusout="${this._onTreeBlur}"
        >
          ${this.elementList.map((row, index) =>
            this._rowTemplate(row, index, tree),
          )}
        </ul>
        ${
          this.__dropTarget && this.__dropTarget.line
            ? html`<div
                class="dropline"
                style="top: ${this.__dropTarget.line.top}px; left: ${
                  this.__dropTarget.line.left
                }px"
              ></div>`
            : ``
        }
      </div>
      ${
        this.__drag && this.__drag.started
          ? html`<div
              class="drag-ghost ${
                this.__dropTarget && this.__dropTarget.problem ? "no-drop" : ""
              }"
              style="left: ${this.__drag.x + 12}px; top: ${this.__drag.y + 8}px"
            >
              <simple-icon-lite icon="${this.__drag.icon}"></simple-icon-lite>
              <span class="t">${this.__drag.label}</span>
              ${
                this.__drag.more
                  ? html`<span class="n">+${this.__drag.more}</span>`
                  : ``
              }
            </div>`
          : ``
      }
    `;
  }
  _rowTemplate(row, index, tree) {
    const checked = row.selectable && this.__selected.has(row.node);
    const locked = row.kind !== "column" && isLocked(row.node, this._body);
    const ownLock =
      row.node &&
      row.node.getAttribute &&
      row.node.getAttribute("data-hax-lock") != null;
    const dragging =
      this.__drag &&
      this.__drag.started &&
      this.__drag.nodes.some((n) => n === row.node || n.contains(row.node));
    // in the lit branch: one of its blocks, or inside one
    // (a drag lights the dragged row too; hover leaves the hovered row be)
    const inTree =
      !!tree &&
      (index !== tree.index || dragging) &&
      tree.nodes.some((n) => n === row.node || n.contains(row.node));
    const classes = [
      row.kind,
      row.node === this.activeNode && row.kind !== "column" ? "active" : "",
      dragging ? "dragging" : "",
      inTree ? "in-tree" : "",
      this.__flashNodes.has(row.node) && row.kind !== "column" ? "flash" : "",
      this.__dropTarget && this.__dropTarget.intoIndex === index
        ? "drop-into"
        : "",
    ].join(" ");
    return html`<li
      role="treeitem"
      class="${classes}"
      aria-level="${row.depth + 1}"
      aria-selected="${row.selectable ? (checked ? "true" : "false") : nothing}"
      tabindex="${index === this.focusIndex ? "0" : "-1"}"
      data-index="${index}"
      @click="${(e) => this._onRowClick(e, index)}"
      @dblclick="${(_e) => this.editItem(index)}"
      @focus="${(_e) => (this.focusIndex = index)}"
    >
      <span class="sel">
        ${
          row.selectable
            ? html`<input
                type="checkbox"
                tabindex="-1"
                aria-label="${this.t.select} ${row.name}"
                .checked="${checked}"
                @click="${(e) => this._onCheck(e, index)}"
              />`
            : ``
        }
      </span>
      ${Array.from({ length: row.depth }).map(
        (_v, level) =>
          html`<span
            class="guide ${inTree && level === tree.depth ? "hl" : ""}"
            aria-hidden="true"
          ></span>`,
      )}
      ${
        row.movable
          ? html`<simple-icon-lite
              class="grip"
              icon="icons:reorder"
              title="${this.t.dragToReorder}"
            ></simple-icon-lite>`
          : ``
      }
      <simple-icon-lite
        class="type"
        icon="${row.icon}"
        aria-hidden="true"
      ></simple-icon-lite>
      <span class="kind">${row.name}</span>
      <span class="ex">${row.excerpt || ""}</span>
      ${
        locked
          ? html`<simple-icon-lite
              class="lockmark"
              icon="hax:admin-lock"
              aria-hidden="true"
            ></simple-icon-lite>`
          : ``
      }
      ${
        row.kind === "item"
          ? html`<span class="acts">
              <button
                type="button"
                class="row-btn danger"
                tabindex="-1"
                aria-label="${this.t.delete}"
                title="${this.t.delete}"
                ?disabled="${locked}"
                @click="${(e) => this._rowOp(e, index, "delete")}"
              >
                <simple-icon-lite icon="hax:admin-delete"></simple-icon-lite>
              </button>
            </span>`
          : ``
      }
      ${
        row.kind === "block"
          ? html`<span class="acts">
              <button
                type="button"
                class="row-btn"
                tabindex="-1"
                aria-label="${this.t.lockUnlock}"
                title="${this.t.lockUnlock}"
                ?disabled="${locked && !ownLock}"
                @click="${(e) => this._rowOp(e, index, "lock")}"
              >
                <simple-icon-lite
                  icon="${ownLock ? "hax:admin-lock" : "hax:admin-unlock"}"
                ></simple-icon-lite>
              </button>
              <button
                type="button"
                class="row-btn danger"
                tabindex="-1"
                aria-label="${this.t.delete}"
                title="${this.t.delete}"
                ?disabled="${locked}"
                @click="${(e) => this._rowOp(e, index, "delete")}"
              >
                <simple-icon-lite icon="hax:admin-delete"></simple-icon-lite>
              </button>
            </span>`
          : ``
      }
    </li>`;
  }
  _rowOp(e, index, action) {
    e.stopPropagation();
    this.itemOp(index, action);
  }
  _toggleKeys() {
    this.showKeys = !this.showKeys;
  }
  // the branch under the pointer lights up, in the outline and the page
  _onPointerOver(e) {
    if (this.__drag && this.__drag.started) {
      return;
    }
    const li = e.composedPath().find((el) => el.tagName === "LI");
    const index = li ? parseInt(li.getAttribute("data-index"), 10) : -1;
    if (index !== this.__hoverIndex) {
      this.__hoverIndex = index;
      this.requestUpdate();
    }
  }
  _onPointerLeave() {
    if (this.__hoverIndex !== -1) {
      this.__hoverIndex = -1;
      this.requestUpdate();
    }
  }
  _onTreeFocus() {
    if (!this.__treeFocused) {
      this.__treeFocused = true;
      this.requestUpdate();
    }
  }
  _onTreeBlur(e) {
    const ul = e.currentTarget;
    if (!e.relatedTarget || !ul.contains(e.relatedTarget)) {
      this.__treeFocused = false;
      this.requestUpdate();
    }
  }
  _onRowClick(e, index) {
    if (this.__suppressClick) {
      this.__suppressClick = false;
      return;
    }
    if (e.shiftKey && this.elementList[index].selectable) {
      this._toggleRange(index);
      return;
    }
    this.focusIndex = index;
    if (this.elementList[index].kind !== "column") {
      this.goToItem(index);
    }
  }
  _onCheck(e, index) {
    e.stopPropagation();
    if (e.shiftKey) {
      e.preventDefault();
      this._toggleRange(index);
      return;
    }
    this._toggleRow(index);
  }
  _toggleRow(index) {
    const row = this.elementList[index];
    if (!row || !row.selectable) {
      return;
    }
    if (this.__selected.has(row.node)) {
      this.__selected.delete(row.node);
    } else {
      this.__selected.add(row.node);
    }
    this.__anchor = row.node;
    this.status = "";
    this.requestUpdate();
  }
  // Shift+click: the rows from the last one checked take its state
  _toggleRange(index) {
    const anchorIndex = this.elementList.findIndex(
      (row) => row.node === this.__anchor && row.selectable,
    );
    if (anchorIndex === -1) {
      this._toggleRow(index);
      return;
    }
    const on = this.__selected.has(this.__anchor);
    const level = this._rangeLevel(anchorIndex);
    const [from, to] =
      anchorIndex < index ? [anchorIndex, index] : [index, anchorIndex];
    for (let i = from; i <= to; i++) {
      const row = this.elementList[i];
      if (level(row)) {
        if (on) {
          this.__selected.add(row.node);
        } else {
          this.__selected.delete(row.node);
        }
      }
    }
    this.status = "";
    this.requestUpdate();
  }
  // a range checks rows at its anchor's level: blocks, or list items
  _rangeLevel(anchorIndex) {
    const anchor = this.elementList[anchorIndex];
    const items = !!anchor && anchor.kind === "item";
    return (row) => row.selectable && (row.kind === "item") === items;
  }
  _toggleAll(e) {
    const rows = this._selectableRows();
    if (e.target.checked) {
      rows.forEach((row) => this.__selected.add(row.node));
    } else {
      this.__selected.clear();
    }
    this.status = "";
    this.requestUpdate();
  }
  clearSelection() {
    this.__selected.clear();
    this.status = "";
    this.requestUpdate();
  }
  _setLock(node, lock) {
    if (lock) {
      node.setAttribute("data-hax-lock", "data-hax-lock");
    } else {
      node.removeAttribute("data-hax-lock");
    }
    this.dispatchEvent(
      new CustomEvent("hax-toggle-active-node-lock", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          lock: lock,
          node: node,
        },
      }),
    );
  }
  lockSelected() {
    this._selectedNodes().forEach((node) => {
      if (node.getAttribute("data-hax-lock") == null) {
        this._setLock(node, true);
      }
    });
    this.status = "";
    this._scheduleMapRefresh(0);
  }
  unlockSelected() {
    this._selectedNodes().forEach((node) => {
      if (node.getAttribute("data-hax-lock") != null) {
        this._setLock(node, false);
      }
    });
    this.status = "";
    this._scheduleMapRefresh(0);
  }
  /**
   * Deletes the checked blocks that are not locked, in one step that a
   * single Undo restores.
   */
  deleteSelected() {
    this._delete(this._selectedNodes());
  }
  /**
   * Deletes blocks and list items that are not locked, in one step that a
   * single Undo restores; a block inside another deleted block goes with
   * it. Focus moves to the row after them.
   */
  _delete(picked) {
    const body = this._body;
    let nodes = picked.filter((node) => !isLocked(node, body));
    nodes = nodes.filter(
      (node) => !nodes.some((other) => other !== node && other.contains(node)),
    );
    if (nodes.length === 0) {
      return;
    }
    const gone = (row) =>
      nodes.some((n) => n === row.node || n.contains(row.node));
    const at = this.elementList.findIndex(gone);
    const next =
      this.elementList
        .slice(at)
        .find((row) => !gone(row) && row.kind !== "column") ||
      this.elementList
        .slice(0, at)
        .reverse()
        .find((row) => !gone(row) && row.kind !== "column");
    this.__focusNode = next ? next.node : null;
    const items = nodes.every((node) => isItem(node));
    this._change(() => nodes.forEach((node) => this._deleteNode(node)), {
      gone: nodes,
    });
    if (items) {
      this.status =
        nodes.length === 1
          ? this.t.deletedItem
          : this._format(this.t.deletedItems, { count: nodes.length });
    } else {
      this.status =
        nodes.length === 1
          ? this.t.deletedOne
          : this._format(this.t.deleted, { count: nodes.length });
    }
    this._scheduleMapRefresh(0);
  }
  _deleteNode(node) {
    const body = this._body;
    this.__selected.delete(node);
    let gone = node;
    if (isItem(node)) {
      const list = node.parentElement;
      node.remove();
      // a list with no items left goes too
      if (!list || [...list.children].some((child) => isItem(child))) {
        return;
      }
      this.__selected.delete(list);
      gone = list;
      if (list.parentElement && list.parentElement.tagName === "LI") {
        list.remove();
        return;
      }
    }
    if (body && typeof body.haxDeleteNode === "function") {
      body.haxDeleteNode(gone);
    } else {
      gone.remove();
    }
  }
  editItem(index) {
    const row = this.elementList[index];
    if (row && row.node && row.kind !== "column") {
      this.dispatchEvent(
        new CustomEvent("hax-context-item-selected", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            target: row.node,
            eventName: "content-edit",
            value: true,
          },
        }),
      );
    }
  }
  isLocked(index) {
    const row = this.elementList[index];
    if (!row || !row.node) {
      return undefined;
    }
    return isLocked(row.node, this._body);
  }
  /**
   * One row's action: "lock" toggles the block's own lock, "delete" removes
   * it, "up" and "down" move it as Alt+Up and Alt+Down do.
   */
  itemOp(index, action) {
    const row = this.elementList[index];
    if (!row || !row.node || row.kind === "column" || !action) {
      return;
    }
    const node = row.node;
    const ownLock = node.getAttribute("data-hax-lock") != null;
    if (action === "lock") {
      // a block inside a locked block unlocks with that block; list items
      // lock with their list
      if (row.kind !== "item" && (ownLock || !isLocked(node, this._body))) {
        this._setLock(node, !ownLock);
      }
    } else if (!isLocked(node, this._body)) {
      if (action === "delete") {
        this._delete([node]);
      } else if (action === "up" || action === "down") {
        this.moveByKeyboard(node, action === "up" ? -1 : 1);
      }
    }
    this._scheduleMapRefresh(50);
  }
  /**
   * Alt+arrows: moves a block (a heading with its section), a list item, or
   * several checked ones together. direction: -1 (up), 1 (down), "in"
   * (into the layout above), "out" (out of its layout). See keyboardTarget.
   */
  moveByKeyboard(node, direction) {
    const body = this._body;
    const picked = Array.isArray(node) ? node : [node];
    const schemaFor = (tag) => this._schemaFor(tag);
    const nodes = nodesToMove(picked, body);
    if (nodes.length === 0) {
      return false;
    }
    const target = keyboardTarget(picked, direction, body, schemaFor);
    const what = this._whatLabel(nodes);
    if (!target || dropProblem(nodes, target, body, schemaFor)) {
      this.status = this._format(this.t.cannotMove, { what });
      return false;
    }
    const moved = this._change(
      () => moveNodes(nodes, target, body, schemaFor),
      {
        flash: nodes,
      },
    );
    if (moved) {
      this.__focusNode = picked[0];
      this.status = this._format(this.t.moved, { what });
      this._scheduleMapRefresh(0);
    }
    return moved;
  }
  // what a keyboard action works on: the checked rows when the focused
  // row is one of them, otherwise the focused row
  _keyboardGroup(row) {
    if (row && this.__selected.has(row.node)) {
      return this._selectedNodes();
    }
    return row && row.node ? [row.node] : [];
  }
  // Shift+Up / Shift+Down: the checks become the rows from the anchor to
  // the newly focused row
  _extendSelection(index, direction) {
    const next = Math.min(
      this.elementList.length - 1,
      Math.max(0, index + direction),
    );
    const row = this.elementList[index];
    if (!this.__anchor || !this.__selected.has(this.__anchor)) {
      this.__anchor = row && row.selectable ? row.node : null;
    }
    const anchorIndex = this.elementList.findIndex(
      (r) => r.node === this.__anchor && r.selectable,
    );
    this.__selected.clear();
    if (anchorIndex > -1) {
      const level = this._rangeLevel(anchorIndex);
      const [from, to] =
        anchorIndex < next ? [anchorIndex, next] : [next, anchorIndex];
      for (let i = from; i <= to; i++) {
        if (level(this.elementList[i])) {
          this.__selected.add(this.elementList[i].node);
        }
      }
    } else if (this.elementList[next].selectable) {
      this.__selected.add(this.elementList[next].node);
      this.__anchor = this.elementList[next].node;
    }
    this.status = "";
    this.focusIndex = next;
    this.requestUpdate();
    this.updateComplete.then(() => this._focusRow(next));
  }
  // L: locks the checked blocks (or the focused one), or unlocks them when
  // they are all locked
  _toggleLockKey(row) {
    const nodes = this._keyboardGroup(row).filter(
      (node) => !isItem(node) && !isPageBreak(node),
    );
    if (nodes.length === 0) {
      return;
    }
    const allLocked = nodes.every(
      (node) => node.getAttribute("data-hax-lock") != null,
    );
    nodes.forEach((node) => {
      const own = node.getAttribute("data-hax-lock") != null;
      if (allLocked ? own : !own && !isLocked(node, this._body)) {
        this._setLock(node, !allLocked);
      }
    });
    this._scheduleMapRefresh(0);
  }
  /**
   * A short plain-text excerpt of a block, so rows of the same type (three
   * Headings) can be told apart. Text only, read from the page; a page
   * break shows its title.
   */
  excerptFor(node) {
    if (!node || !node.getAttribute) {
      return "";
    }
    let text =
      node.tagName === "PAGE-BREAK"
        ? node.getAttribute("title") || ""
        : node.innerText || node.textContent || "";
    text = text.replace(/\s+/g, " ").trim();
    return text.length > 80 ? `${text.substring(0, 80)}…` : text;
  }
  // a block's name in messages: its text, short, or its type
  _shortName(node) {
    const text = this.excerptFor(node);
    if (text) {
      return text.length > 32 ? `${text.substring(0, 32)}…` : text;
    }
    return this._nameFor(node.tagName.toLowerCase()).name;
  }
  _whatLabel(nodes) {
    const name = this._shortName(nodes[0]);
    if (nodes.length === 1) {
      return name;
    }
    return nodes.length === 2
      ? this._format(this.t.andOne, { name })
      : this._format(this.t.andMore, { name, count: nodes.length - 1 });
  }
  goToItem(index) {
    const row = this.elementList[index];
    if (row && row.node && row.kind !== "column") {
      const activeChild = row.node;
      HAXStore.activeNode = activeChild;
      activeChild.classList.add("blinkfocus");
      if (typeof activeChild.scrollIntoViewIfNeeded === "function") {
        activeChild.scrollIntoViewIfNeeded(false);
      } else {
        activeChild.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "center",
        });
      }
      setTimeout(() => {
        activeChild.classList.remove("blinkfocus");
      }, 500);
    }
  }
  _rowElement(index) {
    return this.shadowRoot
      ? this.shadowRoot.querySelector(`li[data-index="${index}"]`)
      : null;
  }
  _focusRow(index) {
    const li = this._rowElement(index);
    if (li) {
      li.focus();
    }
  }
  _onTreeKey(e) {
    const index = this.focusIndex;
    const row = this.elementList[index];
    if (!row) {
      return;
    }
    const mod = e.ctrlKey || e.metaKey;
    const moves = {
      ArrowUp: -1,
      ArrowDown: 1,
      ArrowRight: "in",
      ArrowLeft: "out",
    };
    let handled = true;
    if (e.altKey && !mod && moves[e.key] !== undefined) {
      const group = this._keyboardGroup(row);
      if (group.length > 1 || row.movable) {
        this.moveByKeyboard(group, moves[e.key]);
      }
    } else if (mod && !e.altKey && (e.key === "a" || e.key === "A")) {
      this._selectableRows().forEach((r) => this.__selected.add(r.node));
      this.status = "";
      this.requestUpdate();
    } else if (mod || e.altKey) {
      handled = false;
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      const direction = e.key === "ArrowDown" ? 1 : -1;
      if (e.shiftKey) {
        this._extendSelection(index, direction);
      } else {
        const next = Math.min(
          this.elementList.length - 1,
          Math.max(0, index + direction),
        );
        this.focusIndex = next;
        this.requestUpdate();
        this.updateComplete.then(() => this._focusRow(next));
      }
    } else if (e.key === "Home" || e.key === "End") {
      const next = e.key === "Home" ? 0 : this.elementList.length - 1;
      this.focusIndex = next;
      this.requestUpdate();
      this.updateComplete.then(() => this._focusRow(next));
    } else if (e.key === " ") {
      if (e.shiftKey) {
        this._toggleRange(index);
      } else {
        this._toggleRow(index);
      }
    } else if (e.key === "Enter") {
      this.goToItem(index);
    } else if (e.key === "Delete" || e.key === "Backspace") {
      const group = this._keyboardGroup(row);
      if (row.kind === "block" || row.kind === "item" || group.length > 1) {
        this._delete(group);
      }
    } else if (e.key === "l" || e.key === "L") {
      this._toggleLockKey(row);
    } else if (e.key === "Escape" && this.__selected.size > 0) {
      this.clearSelection();
    } else {
      handled = false;
    }
    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
  /*
   * Drag and drop, as outline-designer does it: a mouse press on a row
   * (not its checkbox or buttons) that travels a few pixels becomes a drag;
   * touch starts from the grip. The rows being carried dim, a ghost
   * follows the pointer, and a drop line (or a ring for "into") shows
   * where they land. Escape cancels.
   */
  _onPointerDown(e) {
    if (e.button !== 0 || this.__drag) {
      return;
    }
    const path = e.composedPath();
    const li = path.find((el) => el.tagName === "LI");
    if (
      !li ||
      path.some((el) => el.tagName === "INPUT" || el.tagName === "BUTTON")
    ) {
      return;
    }
    const onGrip = path.some(
      (el) => el.classList && el.classList.contains("grip"),
    );
    if (e.pointerType !== "mouse" && !onGrip) {
      return;
    }
    const index = parseInt(li.getAttribute("data-index"), 10);
    const row = this.elementList[index];
    if (!row || !row.movable) {
      return;
    }
    this.__drag = {
      index,
      startX: e.clientX,
      startY: e.clientY,
      x: e.clientX,
      y: e.clientY,
      started: false,
      pointerId: e.pointerId,
    };
    if (onGrip) {
      e.preventDefault();
    }
    globalThis.addEventListener("pointermove", this._onDragMove);
    globalThis.addEventListener("pointerup", this._onDragEnd);
    globalThis.addEventListener("pointercancel", this._onDragEnd);
    globalThis.addEventListener("keydown", this._onDragKey, true);
  }
  _startDrag() {
    const drag = this.__drag;
    const row = this.elementList[drag.index];
    const body = this._body;
    // a checked row drags every checked block with it
    const picked = this.__selected.has(row.node)
      ? this._selectedNodes()
      : [row.node];
    const nodes = nodesToMove(picked, body);
    if (nodes.length === 0) {
      this._endDrag();
      return false;
    }
    const first = this.elementList.find((r) => r.node === nodes[0]);
    drag.nodes = nodes;
    drag.started = true;
    drag.icon = first ? first.icon : row.icon;
    drag.label = this._shortName(nodes[0]);
    drag.more = nodes.length - 1;
    drag.what = this._whatLabel(nodes);
    drag.items = nodes.every((node) => isItem(node));
    this.__hoverIndex = -1;
    this.__scroller = this._findScroller();
    this._autoScroll();
    return true;
  }
  _onDragMove(e) {
    const drag = this.__drag;
    if (
      !drag ||
      (drag.pointerId !== undefined && e.pointerId !== drag.pointerId)
    ) {
      return;
    }
    drag.x = e.clientX;
    drag.y = e.clientY;
    if (!drag.started) {
      if (
        Math.abs(e.clientX - drag.startX) < DRAG_START &&
        Math.abs(e.clientY - drag.startY) < DRAG_START
      ) {
        return;
      }
      if (!this._startDrag()) {
        return;
      }
    }
    e.preventDefault();
    this._updateDropTarget();
    this.requestUpdate();
  }
  _onDragEnd(e) {
    const drag = this.__drag;
    if (!drag) {
      return;
    }
    if (drag.started) {
      // the click that follows a drag is not a row click
      this.__suppressClick = true;
      setTimeout(() => {
        this.__suppressClick = false;
      }, 0);
      const target = this.__dropTarget;
      if (e.type === "pointerup" && target && target.dest && !target.problem) {
        const moved = this._change(
          () =>
            moveNodes(drag.nodes, target.dest, this._body, (tag) =>
              this._schemaFor(tag),
            ),
          { flash: drag.nodes },
        );
        if (moved) {
          this.__focusNode = drag.nodes[0];
          this.status = this._format(this.t.moved, { what: drag.what });
        }
      } else {
        this.status = "";
      }
    }
    this._endDrag();
    this._scheduleMapRefresh(0);
  }
  _onDragKey(e) {
    if (e.key === "Escape" && this.__drag) {
      e.preventDefault();
      e.stopPropagation();
      this.status = "";
      this._endDrag();
    }
  }
  _endDrag() {
    globalThis.removeEventListener("pointermove", this._onDragMove);
    globalThis.removeEventListener("pointerup", this._onDragEnd);
    globalThis.removeEventListener("pointercancel", this._onDragEnd);
    globalThis.removeEventListener("keydown", this._onDragKey, true);
    cancelAnimationFrame(this.__scrollFrame);
    this.__drag = null;
    this.__dropTarget = null;
    this.requestUpdate();
  }
  // the panel that scrolls the outline (the tray), crossing shadow roots
  _findScroller() {
    let el = this;
    while (el) {
      el =
        el.assignedSlot ||
        el.parentElement ||
        (el.getRootNode && el.getRootNode().host);
      if (!el || el === globalThis.document.documentElement) {
        break;
      }
      const style = globalThis.getComputedStyle(el);
      if (
        /(auto|scroll)/.test(style.overflowY) &&
        el.scrollHeight > el.clientHeight
      ) {
        return el;
      }
    }
    return null;
  }
  // near the top or bottom edge of the panel, a drag scrolls it
  _autoScroll() {
    const step = () => {
      const drag = this.__drag;
      if (!drag || !drag.started) {
        return;
      }
      const scroller = this.__scroller;
      if (scroller) {
        const rect = scroller.getBoundingClientRect();
        let delta = 0;
        if (drag.y < rect.top + SCROLL_EDGE) {
          delta = -8;
        } else if (drag.y > rect.bottom - SCROLL_EDGE) {
          delta = 8;
        }
        if (delta) {
          scroller.scrollTop += delta;
          this._updateDropTarget();
          this.requestUpdate();
        }
      }
      this.__scrollFrame = requestAnimationFrame(step);
    };
    this.__scrollFrame = requestAnimationFrame(step);
  }
  /**
   * Works out where the carried blocks would land under the pointer:
   * above or below a row, into a layout (its row or a column row), or at
   * the end of the page; and whether they can go there.
   */
  _updateDropTarget() {
    const drag = this.__drag;
    const body = this._body;
    const wrap = this.shadowRoot.querySelector(".tree-wrap");
    const items = [...this.shadowRoot.querySelectorAll("li[data-index]")];
    if (!wrap || items.length === 0) {
      return;
    }
    const wrapRect = wrap.getBoundingClientRect();
    const indent = (depth) => {
      const li = items[0];
      const styles = globalThis.getComputedStyle(li);
      const base = parseFloat(styles.paddingLeft) || 0;
      // a guide is 8px plus its 4px margin
      return base + depth * 12;
    };
    let hit = null;
    for (const li of items) {
      const rect = li.getBoundingClientRect();
      if (drag.y >= rect.top && drag.y < rect.bottom) {
        hit = { li, rect, index: parseInt(li.getAttribute("data-index"), 10) };
        break;
      }
    }
    const schemaFor = (tag) => this._schemaFor(tag);
    let dest = null;
    let line = null;
    let intoIndex = -1;
    let targetName = "";
    let mode = "";
    if (!hit) {
      const last = items[items.length - 1].getBoundingClientRect();
      if (drag.y >= last.bottom) {
        dest = { parent: body, slot: "", before: null };
        line = { top: last.bottom - wrapRect.top, left: indent(0) };
        mode = "end";
      }
    } else {
      const row = this.elementList[hit.index];
      const upper = drag.y < hit.rect.top + hit.rect.height / 2;
      const topLine = hit.rect.top - wrapRect.top;
      const bottomLine = hit.rect.bottom - wrapRect.top;
      if (drag.items && row.kind === "item") {
        // list items: above or below another item
        dest = {
          parent: row.node.parentElement,
          slot: "",
          before: upper ? row.node : row.node.nextElementSibling,
        };
        line = { top: upper ? topLine : bottomLine, left: indent(row.depth) };
        targetName = this._shortName(row.node);
        mode = upper ? "above" : "below";
      } else if (
        drag.items &&
        ["UL", "OL"].includes(row.node.tagName) &&
        drag.y >= hit.rect.top + hit.rect.height / 3
      ) {
        // onto a list: to its end
        dest = { parent: row.node, slot: "", before: null };
        intoIndex = hit.index;
        targetName = row.name;
        mode = "into";
      } else if (row.kind === "column") {
        dest = { parent: row.node, slot: row.slot, before: null };
        intoIndex = hit.index;
        targetName = row.name;
        mode = "into";
      } else if (
        row.kind === "block" &&
        row.slots &&
        row.slots.length === 1 &&
        drag.y >= hit.rect.top + hit.rect.height / 3
      ) {
        dest = { parent: row.node, slot: row.slots[0].slot, before: null };
        intoIndex = hit.index;
        targetName = row.name;
        mode = "into";
      } else if (row.kind === "block") {
        // grid-plate rows only take drops above them; columns take "into"
        const above = upper || (row.slots && row.slots.length > 1);
        dest = {
          parent: row.node.parentElement,
          slot: row.node.getAttribute("slot") || "",
          before: above ? row.node : row.node.nextElementSibling,
        };
        line = { top: above ? topLine : bottomLine, left: indent(row.depth) };
        targetName = this._shortName(row.node);
        mode = above ? "above" : "below";
      } else if (row.kind === "page" && !upper) {
        dest = { parent: body, slot: "", before: row.node.nextElementSibling };
        line = { top: bottomLine, left: indent(0) };
        targetName = row.excerpt || row.name;
        mode = "below";
      } else if (row.kind === "child" || row.kind === "item") {
        // inside a list or a block's own content: below that block
        let owner = row.node.parentElement;
        let ownerRow = null;
        while (owner && owner !== body) {
          const found = this.elementList.find(
            (r) => r.node === owner && r.kind === "block",
          );
          if (found) {
            ownerRow = found;
            break;
          }
          owner = owner.parentElement;
        }
        if (ownerRow) {
          dest = {
            parent: ownerRow.node.parentElement,
            slot: ownerRow.node.getAttribute("slot") || "",
            before: ownerRow.node.nextElementSibling,
          };
          line = { top: bottomLine, left: indent(ownerRow.depth) };
          targetName = this._shortName(ownerRow.node);
          mode = "below";
        }
      }
    }
    let problem = dest
      ? dropProblem(drag.nodes, dest, body, schemaFor)
      : "self";
    // no change: dropping right where the blocks already are
    if (
      !problem &&
      dest.parent === drag.nodes[0].parentElement &&
      (dest.before === drag.nodes[0] ||
        dest.before === drag.nodes[drag.nodes.length - 1].nextElementSibling) &&
      (dest.slot || "") === (drag.nodes[0].getAttribute("slot") || "")
    ) {
      problem = "same";
    }
    if (problem) {
      line = null;
      intoIndex = -1;
    }
    this.__dropTarget = { dest, line, intoIndex, problem };
    const what = drag.what;
    const messages = {
      locked: this._format(this.t.noDropLocked, { target: targetName }),
      slot: this._format(this.t.noDropSlot, {
        target: targetName,
        what: this._nameFor(drag.nodes[0].tagName.toLowerCase()).name,
      }),
      self: dest ? this.t.noDropSelf : "",
      page: this.t.noDropPage,
      item: drag.items
        ? this.t.noDropItem
        : this._format(this.t.noDropBlock, { target: targetName }),
      same: "",
    };
    if (problem) {
      this.status = messages[problem] || "";
    } else if (mode === "into") {
      this.status = this._format(this.t.moveInto, { what, target: targetName });
    } else if (mode === "end") {
      this.status = this._format(this.t.moveToEnd, { what });
    } else {
      this.status = this._format(
        mode === "above" ? this.t.moveAbove : this.t.moveBelow,
        { what, target: targetName },
      );
    }
  }
  static get tag() {
    return "hax-map";
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * Title when open.
       */
      opened: {
        type: Boolean,
      },
      hidden: {
        type: Boolean,
        reflect: true,
      },
      dark: {
        type: Boolean,
        reflect: true,
      },
      elementList: {
        type: Array,
      },
      activeNode: {
        type: Object,
      },
      /**
       * What the outline last did or would do (read to assistive tech)
       */
      status: {
        type: String,
      },
      /**
       * The row that takes Tab focus
       */
      focusIndex: {
        type: Number,
        attribute: "focus-index",
      },
      /**
       * Whether the keyboard shortcuts show
       */
      showKeys: {
        type: Boolean,
        attribute: "show-keys",
      },
    };
  }
}
globalThis.customElements.define(HaxMap.tag, HaxMap);
export { HaxMap };
