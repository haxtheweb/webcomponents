/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, css, html, nothing } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import { HAXStore } from "./hax-store.js";
import { wipeSlot } from "@haxtheweb/utils/lib/slot.js";
import { autorun, toJS } from "mobx";
import { HaxContextBehaviors } from "./hax-context-behaviors.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * grid-plate layouts offered by the Layout menu, in grid-plate's own order
 */
const GRID_LAYOUTS = [
  "1",
  "1-1",
  "2-1",
  "1-2",
  "3-1",
  "1-3",
  "1-1-1",
  "2-1-1",
  "1-2-1",
  "1-1-2",
  "2-1-2",
  "1-1-1-1",
];
const EASE_MOVE = "cubic-bezier(0.2, 0, 0, 1)";

/**
 * `hax-plate-context`
 * `The block bar: one row of block operations above the active block.`
 * @microcopy - the mental model for this element
 * - block bar - drag handle, move, block format, insert, layout, remove and
 *   More tools for the active block
 * - grid plate - the container / full HTML tag which can have operations applied to it.
 *
 * Every operation is sent as a `hax-context-item-selected` event, the same
 * event hax-body has always handled, so the operations themselves live in
 * hax-body.
 */
class HaxPlateContext extends I18NMixin(HaxContextBehaviors(LitElement)) {
  constructor() {
    super();
    this.disableOps = false;
    this.disableItemOps = false;
    this.insertAbove = true;
    this.disableDuplicate = false;
    this.hasActiveEditingElement = false;
    this.haxUIElement = true;
    this.moreOpen = false;
    this._confirmRemove = false;
    this._menu = null;
    this.t = {
      edit: "Edit",
      dragHandle: "Drag handle",
      moveUp: "Move up",
      moveDown: "Move down",
      addColumn: "Add column",
      removeColumn: "Remove column",
      remove: "Remove",
      duplicate: "Duplicate",
      confirmDelete: "Confirm delete",
      changeTo: "Change to",
      editElement: "Edit Mode",
      modifyHTMLSource: "Modify HTML source",
      regions: "Available regions",
      insertItemAbove: "Insert item above",
      insertItemAboveOrBelow: "Insert item above or below",
      insertItemBelow: "Insert item below",
      selectLayout: "Select Layout Element",
      lockContent: "Lock content",
      unlockContent: "Unlock content",
      layout: "Layout",
      columnLayout: "Column Layout",
      moreTools: "More tools",
      fewerTools: "Fewer tools",
      format: "Format",
      textAlignment: "Text alignment",
      left: "Left",
      center: "Center",
      right: "Right",
      blockP: "Paragraph",
      blockH2: "Heading 2",
      blockH3: "Heading 3",
      blockH4: "Heading 4",
      blockH5: "Heading 5",
      blockH6: "Heading 6",
      blockquote: "Blockquote",
      blockPre: "Preformatted",
      bulletedList: "Bulleted list",
      numberedList: "Numbered list",
      heading: "Heading",
      image: "Image",
      columns: "Columns",
      blocks: "Blocks…",
      allBlocks: "all blocks",
      back: "Back",
      indent: "Indent",
      outdent: "Outdent",
      listsOnly: "Lists only",
      notInLayout: "Not inside a layout",
      moveToColumn: "Move to column",
      dragHint: "Drag, or use the up and down arrow keys",
      confirmHint: "Click again to remove, Escape to keep",
      editingHTML: "Editing HTML",
      applyChanges: "Apply changes",
      cancel: "Cancel",
      layout1: "1: full width",
      "layout1-1": "2: equal width",
      "layout2-1": "2: wide & narrow",
      "layout1-2": "2: narrow & wide",
      "layout3-1": "2: wider & narrower",
      "layout1-3": "2: narrower & wider",
      "layout1-1-1": "3: equal width",
      "layout2-1-1": "3: wide, narrow, and narrow",
      "layout1-2-1": "3: narrow, wide, and narrow",
      "layout1-1-2": "3: narrow, narrow, and wide",
      "layout2-1-2": "3: wide, narrow, and wide",
      "layout1-1-1-1": "4: equal width",
    };
    this.registerLocalization({
      context: this,
      namespace: "hax",
    });
    this.ceButtons = [];
    this.activeTagName = "";
    this.activeTagIcon = "hax:paragraph";
    this.addEventListener(
      "hax-context-item-selected",
      this.handleCECustomEvent.bind(this),
    );
    this._outsideClick = this._outsideClick.bind(this);
  }
  static get tag() {
    return "hax-plate-context";
  }
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          width: auto;
          max-width: 100%;
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size, 14px);
          color: var(--hax-ui-color);
        }
        .bar {
          position: relative;
          display: flex;
          align-items: center;
          flex-wrap: nowrap;
        }
        .grp,
        .extra {
          display: flex;
          align-items: center;
          flex: none;
        }
        .grp + .grp,
        .extra,
        .extra > .grp + .grp {
          border-left: 1px solid var(--hax-ui-line);
          margin-left: 2px;
          padding-left: 2px;
        }
        .extra {
          overflow: hidden;
        }
        .extra[hidden] {
          display: none;
        }
        button {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--hax-ui-gap, 4px);
          height: var(--hax-ui-row-height, 32px);
          min-width: var(--hax-ui-row-height, 32px);
          padding: 0 6px;
          margin: 0;
          border: 0;
          border-radius: var(--hax-ui-radius, 4px);
          background: transparent;
          color: inherit;
          font: inherit;
          cursor: pointer;
          white-space: nowrap;
          transition: background-color var(--hax-ui-duration, 150ms)
            var(--hax-ui-easing, ease);
          --simple-icon-width: var(--hax-ui-icon, 16px);
          --simple-icon-height: var(--hax-ui-icon, 16px);
        }
        button:hover:not(:disabled) {
          background-color: var(--hax-ui-hover);
        }
        button:focus-visible {
          outline: var(--hax-ui-focus-width, 2px) solid var(--hax-ui-focus);
          outline-offset: 1px;
        }
        button:disabled {
          color: var(--hax-ui-disabled-color);
          cursor: default;
        }
        button[hidden] {
          display: none;
        }
        button[aria-pressed="true"],
        button[aria-expanded="true"] {
          background-color: var(--hax-ui-selected);
        }
        .drop {
          --simple-icon-width: 12px;
          --simple-icon-height: 12px;
          margin: 0 -4px;
          opacity: 0.75;
        }
        #drag {
          cursor: grab;
          touch-action: none;
        }
        #chip {
          font-weight: 700;
          min-width: 112px;
          justify-content: space-between;
          padding: 0 6px 0 10px;
          gap: 8px;
        }
        #chip .drop {
          margin: 0;
        }
        #remove {
          color: var(--hax-ui-danger);
          overflow: hidden;
        }
        #remove:hover:not(:disabled) {
          background-color: var(--hax-ui-danger-soft);
        }
        #remove:disabled {
          color: var(--hax-ui-disabled-color);
        }
        /* solid fill and white label so Confirm delete reads at a glance;
           the block itself carries the hatch */
        #remove[data-confirm] {
          color: var(--ddd-theme-default-white, #fff);
          background-color: var(--hax-ui-danger);
          padding: 0 12px 0 8px;
          gap: 6px;
          font-weight: 700;
          letter-spacing: 0.01em;
        }
        #remove[data-confirm]:hover {
          filter: brightness(1.08);
        }
        #more simple-icon-lite {
          transition: transform 200ms var(--hax-ui-easing-move, ease);
        }
        #more[aria-expanded="true"] simple-icon-lite {
          transform: rotate(90deg);
        }
        /* tooltip: the button's name after a short hover */
        button[data-tip]::after {
          content: attr(data-tip);
          position: absolute;
          left: 50%;
          bottom: calc(100% + 8px);
          transform: translateX(-50%);
          padding: 3px 8px;
          border-radius: var(--hax-ui-radius, 4px);
          background: var(--ddd-theme-default-coalyGray, #262626);
          color: var(--ddd-theme-default-white, #fff);
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
          line-height: 1.4;
          font-weight: 400;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          z-index: 3;
          transition: opacity 100ms;
        }
        button[data-tip]:hover::after {
          opacity: 1;
          transition-delay: 450ms;
        }
        button[aria-expanded="true"]::after,
        :host([dragging]) button::after {
          display: none;
        }
        /* menus */
        .pop {
          position: absolute;
          top: calc(100% + 6px);
          z-index: 4;
          width: max-content;
          min-width: 220px;
          max-width: calc(100vw - 32px);
          padding: 4px;
          display: grid;
          gap: 1px;
          background: var(--hax-ui-surface);
          color: var(--hax-ui-color);
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius-lg, 8px);
          box-shadow: var(--hax-ui-shadow-popover);
          transform-origin: top left;
          animation: hax-plate-pop 140ms var(--hax-ui-easing-move, ease);
        }
        .pop.up {
          top: auto;
          bottom: calc(100% + 6px);
          transform-origin: bottom left;
        }
        @keyframes hax-plate-pop {
          from {
            opacity: 0;
            transform: translateY(-4px) scale(0.98);
          }
        }
        .mh {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 8px 2px;
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--hax-ui-color-faded);
        }
        .mh button {
          height: 24px;
          min-width: 24px;
          margin-left: -4px;
        }
        .sep {
          height: 1px;
          background: var(--hax-ui-line);
          margin: 3px 0;
        }
        .mi {
          display: grid;
          grid-template-columns: 20px minmax(0, 1fr) auto;
          justify-content: stretch;
          text-align: left;
          gap: 10px;
          min-height: 30px;
          height: auto;
          padding: 2px 8px;
          line-height: 1.3;
          white-space: nowrap;
        }
        .mi:focus-visible {
          outline: none;
          box-shadow: inset 0 0 0 2px var(--hax-ui-focus);
        }
        .mi[aria-checked="true"] {
          background-color: var(--hax-ui-selected);
        }
        .mi::after {
          display: none;
        }
        .why {
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
          color: var(--hax-ui-color-faded);
        }
        .pv-h2 {
          font-size: 18px;
          font-weight: 700;
        }
        .pv-h3 {
          font-size: 16px;
          font-weight: 700;
        }
        .pv-h4,
        .pv-h5,
        .pv-h6 {
          font-size: 15px;
          font-weight: 700;
        }
        .pv-blockquote {
          font-style: italic;
        }
        .pv-pre {
          font-family: var(--ddd-font-secondary, monospace);
          font-size: 13px;
        }
        .seg {
          display: flex;
          gap: 2px;
          padding: 2px 4px 4px;
        }
        .seg button {
          flex: 1;
          border: 1px solid var(--hax-ui-line);
        }
        .lgrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 4px;
          padding: 2px 4px 4px;
        }
        .lgrid button {
          height: 36px;
          border: 1px solid var(--hax-ui-line);
        }
        .lgrid button[aria-checked="true"] {
          background-color: var(--hax-ui-selected);
          border-color: var(--hax-ui-accent-strong);
        }
        .lt {
          display: inline-flex;
          gap: 2px;
          width: 40px;
          height: 18px;
        }
        .lt i {
          display: block;
          height: 100%;
          border-radius: 1px;
          background: currentColor;
          opacity: 0.55;
        }
        .lname {
          padding: 0 8px 4px;
          min-height: 18px;
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
          color: var(--hax-ui-color-faded);
        }
        .bar.source {
          gap: 4px;
          padding-left: 6px;
        }
        .srclabel {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-right: 8px;
          font-weight: 700;
          --simple-icon-width: var(--hax-ui-icon, 16px);
          --simple-icon-height: var(--hax-ui-icon, 16px);
        }
        .bar.source button {
          padding: 0 12px 0 8px;
          border: 1px solid var(--hax-ui-line-strong);
        }
        .bar.source button.primary {
          color: var(--ddd-theme-default-white, #fff);
          background-color: var(--hax-ui-accent-strong);
          border-color: var(--hax-ui-accent-strong);
          font-weight: 700;
        }
        .bar.source button.primary:hover {
          filter: brightness(1.08);
        }
        @media (prefers-reduced-motion: reduce) {
          .pop,
          #more simple-icon-lite {
            animation: none;
            transition: none;
          }
        }
      `,
    ];
  }

  // ---------- helpers ----------
  _ic(icon) {
    return html`<simple-icon-lite
      icon="${icon}"
      aria-hidden="true"
    ></simple-icon-lite>`;
  }
  _drop() {
    return html`<simple-icon-lite
      class="drop"
      icon="arrow-drop-down"
      aria-hidden="true"
    ></simple-icon-lite>`;
  }
  /**
   * send an operation to hax-body from the element that was used, so
   * hax-body can read data-slot / eventData off it as it always has
   */
  _fire(el, eventName, value, eventData) {
    if (eventData !== undefined) el.eventData = eventData;
    el.dispatchEvent(
      new CustomEvent("hax-context-item-selected", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { target: el, eventName: eventName, value: value },
      }),
    );
  }
  get _isText() {
    return !!this.activeNode && HAXStore.isTextElement(this.activeNode);
  }
  get _tag() {
    return this.activeNode && this.activeNode.tagName
      ? this.activeNode.tagName.toLowerCase()
      : "";
  }
  get _gridPlate() {
    const node = this.activeNode;
    if (!node) return null;
    if (node.tagName === "GRID-PLATE") return node;
    if (node.parentNode && node.parentNode.tagName === "GRID-PLATE")
      return node.parentNode;
    return null;
  }
  get _allFormatBlocks() {
    return [
      { tag: "p", label: this.t.blockP },
      { tag: "h2", label: this.t.blockH2 },
      { tag: "h3", label: this.t.blockH3 },
      { tag: "h4", label: this.t.blockH4 },
      { tag: "h5", label: this.t.blockH5 },
      { tag: "h6", label: this.t.blockH6 },
      { tag: "blockquote", label: this.t.blockquote },
      { tag: "pre", label: this.t.blockPre },
    ];
  }
  get _formatBlocks() {
    return this.getFilteredBlocks(this._allFormatBlocks).filter((block) =>
      this._allows(block.tag),
    );
  }
  _allows(tag) {
    if (HAXStore.requiredPrimitives && HAXStore.requiredPrimitives.has(tag))
      return true;
    return HAXStore.platformAllows ? HAXStore.platformAllows(tag) : true;
  }
  get _chipLabel() {
    const tag = this._tag;
    if (tag === "ul") return this.t.bulletedList;
    if (tag === "ol") return this.t.numberedList;
    const block = this._allFormatBlocks.find((b) => b.tag === tag);
    if (block) return block.label;
    // with no block selected the chip still needs a name
    return (
      (this.activeNode ? this.elementLabel(this.activeNode) : "") ||
      this.t.format
    );
  }
  get _siblings() {
    const node = this.activeNode;
    if (!node || !node.parentNode) return { prev: null, next: null };
    return {
      prev: node.previousElementSibling,
      next: node.nextElementSibling,
    };
  }
  get _reducedMotion() {
    return (
      !!globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  // ---------- render ----------
  /**
   * while a block's HTML is being edited the bar only offers Apply changes
   * and Cancel, so it is clear the edit has to be finished first
   */
  _sourceTemplate() {
    return html`
      <div class="bar source" role="toolbar" aria-label="${this.t.editingHTML}">
        <span class="srclabel"
          >${this._ic("icons:code")}${this.t.editingHTML}</span
        >
        <button
          id="srcapply"
          type="button"
          class="primary"
          @click="${(e) =>
            this._fire(e.currentTarget, "hax-source-view-toggle")}"
        >
          ${this._ic("icons:check")}<span>${this.t.applyChanges}</span>
        </button>
        <button
          id="srccancel"
          type="button"
          @click="${(e) =>
            this._fire(e.currentTarget, "hax-source-view-cancel")}"
        >
          ${this._ic("icons:close")}<span>${this.t.cancel}</span>
        </button>
      </div>
    `;
  }
  /**
   * draw the eye to the bar (e.g. another block was clicked while the
   * HTML editor is open)
   */
  attention() {
    const bar = this.shadowRoot && this.shadowRoot.querySelector(".bar");
    if (!bar || !bar.animate) return;
    const apply = this.shadowRoot.querySelector("#srcapply");
    if (apply) apply.focus({ preventScroll: true });
    if (this._reducedMotion) return;
    bar.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-6px)" },
        { transform: "translateX(5px)" },
        { transform: "translateX(-3px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 320, easing: "ease-out" },
    );
  }
  render() {
    const novice = HAXStore.isPlatformAudience("novice");
    const moveDisabled =
      this.hasActiveEditingElement || !this.canMoveElement || this.viewSource;
    const sib = this._siblings;
    const upDisabled =
      moveDisabled || !sib.prev || sib.prev.tagName === "PAGE-BREAK";
    const downDisabled = moveDisabled || !sib.next;
    const opsDisabled =
      this.hasActiveEditingElement ||
      this.viewSource ||
      this.disableOps ||
      this.isLocked;
    if (this.viewSource) return this._sourceTemplate();
    return html`
      <div class="bar" role="toolbar" aria-label="${this._chipLabel}">
        <div class="grp" role="group" aria-label="${this.t.dragHandle}">
          <button
            id="drag"
            type="button"
            aria-label="${this.t.dragHandle}"
            aria-description="${this.t.dragHint}"
            data-tip="${this.t.dragHandle}"
            ?disabled="${moveDisabled}"
            ?hidden="${!this.canMoveElement}"
            @pointerdown="${this._dragPointerDown}"
            @keydown="${this._dragKeydown}"
          >
            ${this._ic("hax:admin-drag")}
          </button>
          <button
            id="up"
            type="button"
            aria-label="${this.t.moveUp}"
            data-tip="${this.t.moveUp}"
            ?disabled="${upDisabled}"
            ?hidden="${!this.canMoveElement}"
            @click="${(e) => this._fire(e.currentTarget, "hax-plate-up")}"
          >
            ${this._ic("icons:arrow-upward")}
          </button>
          <button
            id="down"
            type="button"
            aria-label="${this.t.moveDown}"
            data-tip="${this.t.moveDown}"
            ?disabled="${downDisabled}"
            ?hidden="${!this.canMoveElement}"
            @click="${(e) => this._fire(e.currentTarget, "hax-plate-down")}"
          >
            ${this._ic("icons:arrow-downward")}
          </button>
        </div>
        <div class="grp" role="group" aria-label="${this.t.format}">
          <button
            id="chip"
            type="button"
            aria-haspopup="${this._isText ? "menu" : nothing}"
            aria-expanded="${
              this._isText ? String(this._menu === "format") : nothing
            }"
            aria-label="${
              this._isText
                ? `${this.t.format}: ${this._chipLabel}`
                : this._chipLabel
            }"
            ?disabled="${!this._isText || this.viewSource || this.isLocked}"
            @click="${(e) => this._toggleMenu("format", e.currentTarget)}"
          >
            <span>${this._chipLabel}</span>${
              this._isText ? this._drop() : nothing
            }
          </button>
        </div>
        <div class="grp" role="group" aria-label="${this.t.edit}">
          <slot name="primary"></slot>
          <button
            id="insert"
            type="button"
            aria-haspopup="menu"
            aria-expanded="${String(
              !!this._menu && this._menu.indexOf("insert") === 0,
            )}"
            aria-label="${this.t.insertItemAboveOrBelow}"
            data-tip="${this.t.insertItemAboveOrBelow}"
            ?disabled="${this.viewSource}"
            @click="${(e) => this._toggleMenu("insert", e.currentTarget)}"
            @dblclick="${this.__dblClickFireInsert}"
          >
            ${this._ic("icons:add-box")}${this._drop()}
          </button>
          <button
            id="layout"
            type="button"
            aria-haspopup="menu"
            aria-expanded="${String(this._menu === "layout")}"
            aria-label="${this.t.layout}"
            data-tip="${this.t.layout}"
            ?disabled="${this.viewSource || this.disableOps || this.isLocked}"
            ?hidden="${novice}"
            @click="${(e) => this._toggleMenu("layout", e.currentTarget)}"
          >
            ${this._ic("icons:view-column")}${this._drop()}
          </button>
          <button
            id="remove"
            type="button"
            ?data-confirm="${this._confirmRemove}"
            aria-label="${
              this._confirmRemove ? this.t.confirmDelete : this.t.remove
            }"
            data-tip="${
              this._confirmRemove ? this.t.confirmHint : this.t.remove
            }"
            ?disabled="${opsDisabled}"
            @click="${this._removeClick}"
            @blur="${this._removeBlur}"
            @keydown="${this._removeKeydown}"
          >
            ${this._ic("icons:delete")}${
              this._confirmRemove
                ? html`<span class="lbl">${this.t.confirmDelete}</span>`
                : nothing
            }
          </button>
          <slot name="secondary"></slot>
        </div>
        <div class="grp" role="group" aria-label="${this.t.moreTools}">
          <button
            id="more"
            type="button"
            aria-expanded="${String(!!this.moreOpen)}"
            aria-controls="extra"
            aria-label="${this.moreOpen ? this.t.fewerTools : this.t.moreTools}"
            data-tip="${this.moreOpen ? this.t.fewerTools : this.t.moreTools}"
            @click="${this._toggleMore}"
          >
            ${this._ic("icons:more-horiz")}
          </button>
        </div>
        <div class="extra" id="extra" ?hidden="${!this.moreOpen}">
          <div class="grp" role="group" aria-label="${this.t.moreTools}">
            <button
              id="duplicate"
              type="button"
              aria-label="${this.t.duplicate}"
              data-tip="${this.t.duplicate}"
              ?disabled="${opsDisabled || this.disableDuplicate}"
              ?hidden="${novice}"
              @click="${(e) =>
                this._fire(e.currentTarget, "hax-plate-duplicate")}"
            >
              ${this._ic("icons:content-copy")}
            </button>
            ${
              this.editElementProperty
                ? html`<button
                    id="editmode"
                    type="button"
                    aria-pressed="${String(!!this.editElementToggled)}"
                    aria-label="${this.t.editElement}"
                    data-tip="${this.t.editElement}"
                    ?disabled="${
                      this.viewSource || this.disableOps || this.isLocked
                    }"
                    @click="${(e) =>
                      this._fire(
                        e.currentTarget,
                        "hax-edit-element-toggle",
                        undefined,
                        {
                          target: this.activeNode,
                          editMode: this.editElementProperty,
                        },
                      )}"
                  >
                    ${this._ic("editor:mode-edit")}
                  </button>`
                : nothing
            }
            <button
              id="source"
              type="button"
              aria-pressed="${String(!!this.viewSource)}"
              aria-label="${this.t.modifyHTMLSource}"
              data-tip="${this.t.modifyHTMLSource}"
              ?disabled="${
                !this.sourceView ||
                this.disableOps ||
                this.isLocked ||
                this.editElementToggled
              }"
              ?hidden="${novice}"
              @click="${(e) =>
                this._fire(e.currentTarget, "hax-source-view-toggle")}"
            >
              ${this._ic("icons:code")}
            </button>
            <button
              id="lock"
              type="button"
              aria-pressed="${String(!!this.isLocked)}"
              aria-label="${
                this.isLocked ? this.t.unlockContent : this.t.lockContent
              }"
              data-tip="${
                this.isLocked ? this.t.unlockContent : this.t.lockContent
              }"
              ?disabled="${this.viewSource}"
              ?hidden="${novice}"
              @click="${this._toggleActiveNodeLock}"
            >
              ${this._ic(this.isLocked ? "icons:lock" : "icons:lock-open")}
            </button>
            ${this.ceButtons.map(
              (el) =>
                html`<button
                  type="button"
                  aria-label="${el.label}"
                  data-tip="${el.label}"
                  ?disabled="${el.disabled || this.disableItemOps}"
                  @click="${(e) =>
                    this._fire(
                      e.currentTarget,
                      "hax-ce-custom-button",
                      el.callback,
                    )}"
                >
                  ${this._ic(el.icon)}
                </button>`,
            )}
            <slot name="more"></slot>
          </div>
        </div>
        ${this._menuTemplate()}
      </div>
    `;
  }

  // ---------- menus ----------
  _toggleMenu(name, anchor) {
    if (this._menu && this._menu.split(":")[0] === name) {
      this._closeMenu();
      return;
    }
    this._openMenu(name, anchor);
  }
  _openMenu(name, anchor) {
    if (anchor) this._menuAnchor = anchor;
    const a = this._menuAnchor;
    this._menuLeft = a ? a.offsetLeft : 0;
    const r = a ? a.getBoundingClientRect() : { top: 0, bottom: 0 };
    this._menuUp = globalThis.innerHeight - r.bottom < 360 && r.top > 360;
    this._menu = name;
    globalThis.document.addEventListener(
      "pointerdown",
      this._outsideClick,
      true,
    );
    this.updateComplete.then(() => {
      const pop = this.shadowRoot.querySelector(".pop");
      if (!pop) return;
      // keep the menu inside the screen
      const pr = pop.getBoundingClientRect();
      if (pr.right > globalThis.innerWidth - 8) {
        this._menuLeft = Math.max(
          -this.offsetLeft,
          this._menuLeft - (pr.right - globalThis.innerWidth + 8),
        );
        pop.style.left = `${this._menuLeft}px`;
      }
      const first = pop.querySelector(
        '[aria-checked="true"]:not(:disabled), .mi:not(:disabled), .lgrid button:not(:disabled)',
      );
      if (first) first.focus({ preventScroll: true });
    });
  }
  _closeMenu(refocus = true) {
    if (!this._menu) return;
    const anchor = this._menuAnchor;
    this._menu = null;
    globalThis.document.removeEventListener(
      "pointerdown",
      this._outsideClick,
      true,
    );
    if (refocus && anchor) anchor.focus({ preventScroll: true });
  }
  _outsideClick(e) {
    const path = e.composedPath ? e.composedPath() : [];
    const pop = this.shadowRoot.querySelector(".pop");
    if (pop && path.includes(pop)) return;
    if (this._menuAnchor && path.includes(this._menuAnchor)) return;
    this._closeMenu(false);
  }
  _menuKeydown(e) {
    const pop = e.currentTarget;
    const items = [
      ...pop.querySelectorAll(
        ".mi:not(:disabled), .seg button, .lgrid button:not(:disabled), .mh button",
      ),
    ];
    const k = items.indexOf(this.shadowRoot.activeElement);
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      items[(k + 1) % items.length].focus();
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      items[(k - 1 + items.length) % items.length].focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      this._closeMenu();
    } else if (e.key === "Tab") {
      this._closeMenu(false);
    }
  }
  _mi(icon, label, onClick, opts = {}) {
    return html`<button
      type="button"
      class="mi"
      role="${opts.checked !== undefined ? "menuitemradio" : "menuitem"}"
      aria-checked="${
        opts.checked !== undefined ? String(!!opts.checked) : nothing
      }"
      ?disabled="${!!opts.disabled}"
      data-slot="${opts.slot || nothing}"
      @click="${(e) => {
        if (!opts.keepOpen) this._closeMenu(false);
        onClick(e);
      }}"
    >
      ${icon ? this._ic(icon) : html`<span></span>`}
      <span class="${opts.cls || ""}">${label}</span>
      ${
        opts.disabled && typeof opts.disabled === "string"
          ? html`<span class="why">${opts.disabled}</span>`
          : opts.hint
            ? html`<span class="why">${opts.hint}</span>`
            : opts.checked
              ? this._ic("icons:check")
              : html`<span></span>`
      }
    </button>`;
  }
  _menuTemplate() {
    if (!this._menu) return nothing;
    let body = nothing;
    const parts = this._menu.split(":");
    if (parts[0] === "format") body = this._formatMenu();
    if (parts[0] === "insert")
      body = parts[1] ? this._blocksMenu(parts[1]) : this._insertMenu();
    if (parts[0] === "layout") body = this._layoutMenu();
    return html`<div
      class="pop ${this._menuUp ? "up" : ""}"
      role="menu"
      style="left:${this._menuLeft || 0}px"
      @keydown="${this._menuKeydown}"
    >
      ${body}
    </div>`;
  }
  _formatMenu() {
    const tag = this._tag;
    const align = this.activeNode
      ? this.activeNode.getAttribute("data-text-align") || ""
      : "";
    return html`
      <div class="mh">${this.t.format}</div>
      ${this._formatBlocks.map((b) =>
        this._mi(
          null,
          b.label,
          (e) => this._fire(e.currentTarget, "text-tag", b.tag),
          { checked: tag === b.tag, cls: `pv-${b.tag}` },
        ),
      )}
      <div class="sep"></div>
      ${
        this._allows("ul")
          ? this._mi(
              "editor:format-list-bulleted",
              this.t.bulletedList,
              (e) =>
                tag === "ul"
                  ? this._fire(e.currentTarget, "text-tag", "p")
                  : this._fire(e.currentTarget, "text-tag-ul"),
              { checked: tag === "ul" },
            )
          : nothing
      }
      ${
        this._allows("ol")
          ? this._mi(
              "editor:format-list-numbered",
              this.t.numberedList,
              (e) =>
                tag === "ol"
                  ? this._fire(e.currentTarget, "text-tag", "p")
                  : this._fire(e.currentTarget, "text-tag-ol"),
              { checked: tag === "ol" },
            )
          : nothing
      }
      <div class="mh">${this.t.textAlignment}</div>
      <div class="seg" role="radiogroup" aria-label="${this.t.textAlignment}">
        ${[
          ["", "editor:format-align-left", this.t.left],
          ["center", "editor:format-align-center", this.t.center],
          ["right", "editor:format-align-right", this.t.right],
        ].map(
          ([value, icon, label]) =>
            html`<button
              type="button"
              role="radio"
              aria-checked="${String(align === value)}"
              aria-label="${label}"
              @click="${(e) => {
                this._closeMenu(false);
                this._fire(e.currentTarget, "hax-text-align", value);
              }}"
            >
              ${this._ic(icon)}
            </button>`,
        )}
      </div>
    `;
  }
  _insertMenu() {
    return html`
      ${this._mi(
        "hardware:keyboard-arrow-up",
        this.t.insertItemAbove,
        () => this._openMenu("insert:above"),
        { disabled: !this.insertAbove, keepOpen: true },
      )}
      ${this._mi(
        "hardware:keyboard-arrow-down",
        this.t.insertItemBelow,
        () => this._openMenu("insert:below"),
        { keepOpen: true },
      )}
      ${
        HAXStore.isLayoutElement(this.activeNode)
          ? (this.slottedItems || []).map(
              (slot, i) => html`
                ${i < 1 ? html`<div class="sep"></div>` : nothing}
                ${this._mi(
                  null,
                  slot.label,
                  (e) => this._fire(e.currentTarget, "insert-into-active"),
                  { slot: slot.slot },
                )}
              `,
            )
          : nothing
      }
    `;
  }
  /**
   * the common blocks, Paragraph first, then Blocks… for everything else
   */
  get commonBlocks() {
    return [
      { tag: "p", label: this.t.blockP, icon: "hax:paragraph" },
      { tag: "h2", label: this.t.heading, icon: "editor:title" },
      {
        tag: "ul",
        label: this.t.bulletedList,
        icon: "editor:format-list-bulleted",
      },
      {
        tag: "ol",
        label: this.t.numberedList,
        icon: "editor:format-list-numbered",
      },
      { tag: "media-image", label: this.t.image, icon: "image:image" },
      { tag: "grid-plate", label: this.t.columns, icon: "icons:view-column" },
      {
        tag: "blockquote",
        label: this.t.blockquote,
        icon: "editor:format-quote",
      },
    ].filter(
      (b) =>
        this._allows(b.tag) &&
        (b.tag.indexOf("-") === -1 ||
          (!!HAXStore.elementList && !!HAXStore.elementList[b.tag])),
    );
  }
  _blocksMenu(where) {
    return html`
      <div class="mh">
        <button
          type="button"
          aria-label="${this.t.back}"
          @click="${() => this._openMenu("insert")}"
        >
          ${this._ic("icons:chevron-left")}
        </button>
        ${where === "above" ? this.t.insertItemAbove : this.t.insertItemBelow}
      </div>
      ${this.commonBlocks.map((b) =>
        this._mi(b.icon, b.label, (e) =>
          this._fire(e.currentTarget, "insert-block", {
            tag: b.tag,
            above: where === "above",
          }),
        ),
      )}
      <div class="sep"></div>
      ${this._mi(
        "icons:view-quilt",
        this.t.blocks,
        (e) =>
          this._fire(e.currentTarget, "insert-block-picker", {
            above: where === "above",
          }),
        { hint: this.t.allBlocks },
      )}
    `;
  }
  _layoutMenu() {
    const grid = this._gridPlate;
    const otherLayout =
      !grid && !!this.layoutElement && this.layoutElement !== this.activeNode;
    const current = grid ? grid.layout : null;
    const cols = current ? current.split("-").length : 1;
    const isList = ["UL", "OL", "LI"].includes(
      this.activeNode ? this.activeNode.tagName : "",
    );
    const inGrid = !!grid && grid !== this.activeNode;
    const label = (key) => this.t[`layout${key}`] || key;
    // the icon files are named the other way round from what they draw:
    // table-column-remove draws a column with +, plus-after draws one with x
    return html`
      <div class="mh">${this.t.columnLayout}</div>
      <div class="lgrid" role="radiogroup" aria-label="${this.t.columnLayout}">
        ${GRID_LAYOUTS.map(
          (key) =>
            html`<button
              type="button"
              role="radio"
              aria-checked="${String(key === current)}"
              aria-label="${label(key)}"
              ?disabled="${otherLayout || !this._allows("grid-plate")}"
              @mouseenter="${() => this._nameLayout(label(key))}"
              @focus="${() => this._nameLayout(label(key))}"
              @click="${(e) => {
                this._closeMenu(false);
                this._fire(e.currentTarget, "hax-plate-layout", key);
              }}"
            >
              <span class="lt" aria-hidden="true"
                >${key
                  .split("-")
                  .map((n) => html`<i style="flex: ${n} 1 0"></i>`)}</span
              >
            </button>`,
        )}
      </div>
      <div class="lname">${current ? label(current) : this.t.notInLayout}</div>
      <div class="sep"></div>
      ${this._mi(
        "hax:table-column-remove",
        this.t.addColumn,
        (e) => this._fire(e.currentTarget, "hax-plate-create-right"),
        { disabled: cols >= 4 || otherLayout },
      )}
      ${this._mi(
        "hax:table-column-plus-after",
        this.t.removeColumn,
        (e) => this._fire(e.currentTarget, "hax-plate-remove-right"),
        { disabled: !grid ? this.t.notInLayout : cols < 2 },
      )}
      ${this._mi(
        "hax:select-element",
        this.t.selectLayout,
        (e) =>
          this._fire(
            e.currentTarget,
            "hax-select-grid",
            undefined,
            this.layoutElement,
          ),
        {
          disabled:
            this.layoutElement && this.layoutElement !== this.activeNode
              ? false
              : this.t.notInLayout,
        },
      )}
      ${
        inGrid
          ? html`<div class="mh">${this.t.moveToColumn}</div>
              ${(this.slottedItems || []).map((slot) =>
                this._mi(
                  null,
                  slot.label,
                  (e) => this._fire(e.currentTarget, "move-to-slot"),
                  {
                    slot: slot.slot,
                    checked: this.activeNode.getAttribute("slot") === slot.slot,
                  },
                ),
              )}`
          : nothing
      }
      <div class="sep"></div>
      ${this._mi(
        "editor:format-indent-increase",
        this.t.indent,
        (e) => this._fire(e.currentTarget, "indent"),
        { disabled: isList ? false : this.t.listsOnly },
      )}
      ${this._mi(
        "editor:format-indent-decrease",
        this.t.outdent,
        (e) => this._fire(e.currentTarget, "outdent"),
        { disabled: isList ? false : this.t.listsOnly },
      )}
    `;
  }
  _nameLayout(text) {
    const el = this.shadowRoot.querySelector(".lname");
    if (el) el.textContent = text;
  }

  // ---------- More tools ----------
  _toggleMore() {
    this._closeMenu(false);
    const extra = this.shadowRoot.querySelector("#extra");
    const from = extra && !extra.hidden ? extra.offsetWidth : 0;
    this.dispatchEvent(
      new CustomEvent("hax-block-bar-more", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: { open: !this.moreOpen },
      }),
    );
    if (this._reducedMotion || !extra) return;
    this.updateComplete.then(() => {
      if (this.moreOpen) {
        extra.animate(
          [
            { width: "0px", opacity: 0 },
            { width: `${extra.scrollWidth}px`, opacity: 1 },
          ],
          { duration: 200, easing: EASE_MOVE },
        );
      } else if (from) {
        // keep it on screen just long enough to fold away
        extra.hidden = false;
        extra
          .animate(
            [
              { width: `${from}px`, opacity: 1 },
              { width: "0px", opacity: 0 },
            ],
            { duration: 160, easing: EASE_MOVE },
          )
          .finished.then(() => {
            extra.hidden = !this.moreOpen;
          })
          .catch(() => {});
      }
    });
  }

  // ---------- Remove: arm, then confirm ----------
  async _removeClick(e) {
    const button = e.currentTarget;
    if (this._confirmRemove) {
      clearTimeout(this.__armTimer);
      this._confirmRemove = false;
      this._fire(button, "hax-plate-delete");
      return;
    }
    const from = button.offsetWidth;
    this._confirmRemove = true;
    this._fire(button, "hax-plate-delete-arm");
    await this.updateComplete;
    if (!this._reducedMotion) {
      button.animate(
        [{ width: `${from}px` }, { width: `${button.offsetWidth}px` }],
        { duration: 200, easing: EASE_MOVE },
      );
      const lbl = button.querySelector(".lbl");
      if (lbl) {
        lbl.animate(
          [
            { opacity: 0, transform: "translateX(-6px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 200, delay: 60, fill: "backwards", easing: EASE_MOVE },
        );
      }
    }
  }
  async _disarm() {
    clearTimeout(this.__armTimer);
    if (!this._confirmRemove) return;
    const button = this.shadowRoot
      ? this.shadowRoot.querySelector("#remove")
      : null;
    const from = button ? button.offsetWidth : 0;
    this._confirmRemove = false;
    if (button) this._fire(button, "hax-plate-delete-disarm");
    await this.updateComplete;
    if (button && from && !this._reducedMotion) {
      button.animate(
        [{ width: `${from}px` }, { width: `${button.offsetWidth}px` }],
        { duration: 160, easing: EASE_MOVE },
      );
    }
  }
  _removeBlur() {
    setTimeout(() => {
      if (
        this._confirmRemove &&
        this.shadowRoot.activeElement !==
          this.shadowRoot.querySelector("#remove")
      ) {
        this._disarm();
      }
    }, 0);
  }
  _removeKeydown(e) {
    if (e.key === "Escape" && this._confirmRemove) {
      e.preventDefault();
      e.stopPropagation();
      this._disarm();
    }
  }

  // ---------- drag ----------
  /**
   * the grip only drags, it has no menu: hax-body lifts the block and it
   * follows the pointer. Arrow keys on the grip move the block one place.
   */
  _dragPointerDown(e) {
    if (e.button !== 0 || !this.canMoveElement) return;
    e.preventDefault();
    this._closeMenu(false);
    this._disarm();
    this.dispatchEvent(
      new CustomEvent("hax-block-drag-start", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          node: this.activeNode,
          clientX: e.clientX,
          clientY: e.clientY,
        },
      }),
    );
  }
  _dragKeydown(e) {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      this._fire(
        e.currentTarget,
        e.key === "ArrowUp" ? "hax-plate-up" : "hax-plate-down",
      );
      // keep focus on the grip so the next press moves again
      setTimeout(() => {
        const g = this.shadowRoot.querySelector("#drag");
        if (g) g.focus({ preventScroll: true });
      }, 80);
    }
  }

  __dblClickFireInsert(e) {
    this._closeMenu(false);
    this._fire(e.currentTarget, "insert-below-active");
  }
  handleCECustomEvent(e) {
    let detail = e.detail;
    switch (detail.eventName) {
      case "hax-ce-custom-button":
        if (
          this.activeNode &&
          typeof this.activeNode[detail.value] === "function"
        ) {
          if (this.activeNode[detail.value](e)) {
            HAXStore.refreshActiveNodeForm();
          }
        }
        break;
    }
  }
  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    // Derive reactive state in willUpdate so it batches into the current
    // update cycle. Setting these in updated() scheduled a redundant second
    // update (Lit change-in-update warning).
    if (changedProperties.has("activeNode")) {
      this.isLocked = this._isNodeLocked(this.activeNode);
      if (this._confirmRemove) {
        clearTimeout(this.__armTimer);
        this._confirmRemove = false;
      }
      if (this._menu) {
        this._menu = null;
        globalThis.document.removeEventListener(
          "pointerdown",
          this._outsideClick,
          true,
        );
      }
    }
    if (
      changedProperties.has("activeNode") ||
      changedProperties.has("activeEditingElement")
    ) {
      this.activeSchema = HAXStore.activeSchema();
      this.editElementProperty =
        this.activeSchema && this.activeSchema.editElement
          ? this.activeSchema.editElement
          : false;
      this.editElementToggled =
        this.activeNode &&
        this.editElementProperty &&
        !!this.activeNode[this.editElementProperty];
    }
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "onScreen" && this.onScreen) {
        this._resetCEMenu();
      }
    });
  }
  disconnectedCallback() {
    globalThis.document.removeEventListener(
      "pointerdown",
      this._outsideClick,
      true,
    );
    clearTimeout(this.__armTimer);
    if (super.disconnectedCallback) super.disconnectedCallback();
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    autorun(() => {
      const _mobx_val_0 = toJS(HAXStore.activeNode);
      Promise.resolve().then(() => {
        this.activeNode = _mobx_val_0;
        if (this.activeNode && this.activeNode.classList) {
          this._resetCEMenu();
        }
      });
    });
    autorun(() => {
      const _mobx_val_0 = toJS(HAXStore.activeEditingElement);
      Promise.resolve().then(() => {
        this.hasActiveEditingElement = !!_mobx_val_0;
      });
    });
  }
  /**
   * HAX properties changed, update buttons available.
   */
  async _resetCEMenu() {
    if (this.shadowRoot) {
      wipeSlot(this, "*");
    }
    // reset buttons in-case this element has new ones
    this.ceButtons = [];
    if (HAXStore.activeHaxBody && this.activeNode != null) {
      let schema = HAXStore.haxSchemaFromTag(this.activeNode.tagName);
      this.sourceView = schema.canEditSource;
      if (HAXStore.activeGizmo) {
        this.activeTagName = HAXStore.activeGizmo.title;
        this.activeTagIcon = HAXStore.activeGizmo.icon;
      }
    } else if (HAXStore.activeGizmo) {
      this.activeTagName = HAXStore.activeGizmo.title;
      this.activeTagIcon = HAXStore.activeGizmo.icon;
    } else {
      this.activeTagName = "";
      this.activeTagIcon = "";
    }
    // @see haxHook inlineContextMenu
    await HAXStore.runHook(this.activeNode, "inlineContextMenu", [this]);
  }
  _isNodeLocked(node) {
    if (!node || !node.getAttribute) {
      return false;
    }
    if (node.getAttribute("data-hax-lock") != null) {
      return true;
    }
    if (
      node.parentNode &&
      node.parentNode.getAttribute &&
      node.parentNode.getAttribute("data-hax-lock") != null
    ) {
      return true;
    }
    return false;
  }
  _toggleActiveNodeLock(e) {
    if (!this.activeNode || !this.activeNode.getAttribute) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const node = this.activeNode;
    let locked = node.getAttribute("data-hax-lock") != null;
    if (locked) {
      node.removeAttribute("data-hax-lock");
      locked = false;
    } else {
      node.setAttribute("data-hax-lock", "data-hax-lock");
      locked = true;
    }
    this.isLocked = locked;
    this.dispatchEvent(
      new CustomEvent("hax-toggle-active-node-lock", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          lock: locked,
          node: node,
        },
      }),
    );
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      ...super.properties,
      activeTagIcon: {
        type: String,
      },
      activeSchema: {
        type: Object,
      },
      editElementProperty: {
        type: String,
      },
      editElementToggled: {
        type: Boolean,
      },
      activeTagName: {
        type: String,
      },
      disableOps: {
        type: Boolean,
      },
      disableItemOps: {
        type: Boolean,
      },
      insertAbove: {
        type: Boolean,
      },
      disableDuplicate: {
        type: Boolean,
      },
      canMoveElement: {
        type: Boolean,
      },
      ceButtons: {
        type: Array,
      },
      hasActiveEditingElement: {
        type: Boolean,
      },
      onScreen: {
        type: Boolean,
        attribute: "on-screen",
        reflect: true,
      },
      sourceView: {
        type: Boolean,
      },
      isLocked: {
        type: Boolean,
      },
      /**
       * More tools is open: the rest of the bar shows in the same row
       */
      moreOpen: {
        type: Boolean,
        attribute: "more-open",
        reflect: true,
      },
      /**
       * hax-body sets this while a block is being dragged
       */
      dragging: {
        type: Boolean,
        reflect: true,
      },
      _confirmRemove: {
        type: Boolean,
        state: true,
      },
      _menu: {
        type: String,
        state: true,
      },
    };
  }
}
globalThis.customElements.define(HaxPlateContext.tag, HaxPlateContext);
export { HaxPlateContext };
