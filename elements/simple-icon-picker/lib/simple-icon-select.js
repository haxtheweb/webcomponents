/**
 * Copyright 2026 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
// the select lists every icon, so it needs the manifest (simple-icons.js
// only registers iconset locations)
import "@haxtheweb/simple-icon/lib/simple-iconset-manifest.js";
import { SimpleIconsetStore } from "@haxtheweb/simple-icon/lib/simple-iconset.js";

/**
 * parse an Array-or-JSON-string property into an array (or false when empty)
 * so attribute and property usage behave the same as simple-icon-picker
 */
const _toList = (list) => {
  if (!list || list.length === 0) return false;
  if (typeof list === "string") {
    try {
      const parsed = JSON.parse(list);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : false;
    } catch {
      return false;
    }
  }
  return list;
};

/**
 * gets icons that are registered in SimpleIconsetStore and filters them
 * based on include / exclude lists. Shared by simple-icon-picker and
 * simple-icon-select so both honor the same schema options.
 *
 * @param {object} options { includeSets, excludeSets, exclude }
 * @returns {array} icon names like "editor:format-paint"
 */
export const filterStoredIcons = (options = {}) => {
  let icons =
    SimpleIconsetStore && SimpleIconsetStore.iconlist
      ? SimpleIconsetStore.iconlist
      : [];
  const includeSets = _toList(options.includeSets),
    excludeSets = _toList(options.excludeSets),
    exclude = _toList(options.exclude);
  if (includeSets || excludeSets || exclude) {
    icons = icons.filter((icon) => {
      const prefix = icon.replace(/:.*/, ""),
        // strip the icons: prefix so exclusion matches prefix-less names too
        iconname = icon.replace("icons:", "");
      if (
        exclude &&
        (exclude.includes(icon) || exclude.includes(`icons:${iconname}`))
      )
        return false;
      if (includeSets && !includeSets.includes(prefix)) return false;
      if (excludeSets && excludeSets.includes(prefix)) return false;
      return true;
    });
  }
  return icons;
};

/**
 * human readable name for an icon id: "editor:format-paint" -> "Format paint"
 * @param {string} icon
 * @returns {string}
 */
export const iconFriendlyName = (icon) => {
  if (!icon) return "";
  const name = `${icon}`.replace(/^.*:/, "").replace(/[-_]+/g, " ").trim();
  return name.charAt(0).toUpperCase() + name.slice(1);
};

// how many rows render at once; more are added as the list scrolls
const PAGE_SIZE = 60;
// tallest the option list gets, like a native select's dropdown
const LIST_MAX_HEIGHT = 280;
// narrowest the dropdown gets so names stay readable in skinny columns
const PANEL_MIN_WIDTH = 240;
// space kept between the dropdown and the trigger / viewport edge
const GAP = 4;
const EDGE = 8;
// counter for unique ids; ids only need to be unique in the page, not secret
let _instanceCount = 0;
// top-layer rendering escapes any overflow / transform on ancestors (e.g. the
// HAX settings tray); position: fixed is the fallback where it is unsupported
const SUPPORTS_POPOVER =
  typeof HTMLElement !== "undefined" &&
  typeof HTMLElement.prototype.showPopover === "function";

/**
 * `simple-icon-select`
 * A searchable select list of icons where every option shows the icon plus
 * its name (modeled on the Merlin icon program results). Like a native
 * select, the dropdown floats over the page (top layer when supported,
 * position: fixed otherwise) anchored to the field, so it never changes the
 * surrounding layout and is never clipped by a narrow container like the HAX
 * element settings panel. It opens upward when there is no room below.
 *
 * Accepts the same inputs as simple-icon-picker (icons, include-sets,
 * exclude-sets, exclude, allow-null, value) and fires `value-changed`, so it
 * is a drop-in for the HAXSchema `iconpicker` input method.
 *
 * @element simple-icon-select
 * @demo demo/index.html
 */
class SimpleIconSelect extends LitElement {
  static get tag() {
    return "simple-icon-select";
  }

  static get properties() {
    return {
      /**
       * Allow "No icon" to be selected
       */
      allowNull: { type: Boolean, attribute: "allow-null" },
      /**
       * Explicit list of icons to choose from; when empty every registered
       * icon (filtered by the set options below) is offered
       */
      icons: { type: Array },
      includeSets: { type: Array, attribute: "include-sets" },
      excludeSets: { type: Array, attribute: "exclude-sets" },
      exclude: { type: Array, attribute: "exclude" },
      /**
       * Selected icon name, or null for no icon
       */
      value: { type: String, reflect: true },
      /**
       * Accessible label for the control
       */
      label: { type: String },
      /**
       * Placeholder for the search box
       */
      placeholder: { type: String },
      disabled: { type: Boolean, reflect: true },
      /**
       * Whether the list is expanded
       */
      expanded: { type: Boolean, reflect: true },
      __search: { type: String },
      __activeIndex: { type: Number },
      __limit: { type: Number },
      __allIcons: { type: Array },
    };
  }

  constructor() {
    super();
    this.t = {
      selectAnIcon: "Select an icon",
      searchIcons: "Search icons",
      noIcon: "No icon",
      noIconsFoundFor: 'No icons found for "{search}"',
      noIconsAvailable: "No icons available",
      showingIcons: "{shown} of {total} icons",
    };
    this.allowNull = true; // default true to match simple-icon-picker
    this.icons = [];
    this.includeSets = [];
    this.excludeSets = [];
    this.exclude = [];
    this.value = null;
    this.label = null;
    this.placeholder = null;
    this.disabled = false;
    this.expanded = false;
    this.__search = "";
    this.__activeIndex = -1;
    this.__limit = PAGE_SIZE;
    this.__allIcons = [];
    _instanceCount += 1;
    this.__uid = `simple-icon-select-${_instanceCount}`;
    this.__reposition = this._schedulePosition.bind(this);
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          min-width: 0;
          width: 100%;
          box-sizing: border-box;
          font-family: inherit;
          font-size: var(
            --simple-fields-font-size,
            var(--ddd-font-size-4xs, 14px)
          );
          color: var(--simple-fields-color, currentColor);
          --simple-icon-select-row-size: 32px;
          --simple-icon-select-border-color: var(
            --simple-fields-border-color,
            light-dark(
              var(--ddd-theme-default-limestoneGray, #a2aaad),
              var(--ddd-theme-default-slateGray, #666666)
            )
          );
          --simple-icon-select-background-color: var(
            --simple-fields-background-color,
            light-dark(
              var(--ddd-theme-default-white, #ffffff),
              var(--ddd-theme-default-coalyGray, #262626)
            )
          );
          --simple-icon-select-active-background-color: var(
            --simple-fields-select-option-selected-background-color,
            light-dark(rgba(0, 0, 0, 0.08), rgba(255, 255, 255, 0.14))
          );
          --simple-icon-select-accent-color: var(
            --simple-fields-accent-color,
            var(--ddd-theme-default-skyBlue, #009cde)
          );
        }
        :host([hidden]) {
          display: none;
        }
        :host([disabled]) {
          opacity: 0.6;
          pointer-events: none;
        }
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        .trigger,
        .search {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2, 8px);
          width: 100%;
          min-width: 0;
          min-height: var(--simple-icon-select-row-size);
          margin: 0;
          padding: var(--ddd-spacing-1, 4px) var(--ddd-spacing-2, 8px);
          font: inherit;
          color: inherit;
          background-color: var(--simple-icon-select-background-color);
          border: var(--ddd-border-xs, 1px solid)
            var(--simple-icon-select-border-color);
          border-radius: var(
            --simple-fields-border-radius,
            var(--ddd-radius-xs, 4px)
          );
        }
        .trigger {
          cursor: pointer;
          text-align: start;
        }
        .trigger:focus-visible,
        .search:focus-visible,
        .search:focus {
          outline: var(--ddd-border-sm, 2px solid)
            var(--simple-icon-select-accent-color);
          outline-offset: -2px;
        }
        .trigger .name {
          flex: 1 1 auto;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .trigger .empty {
          opacity: 0.7;
          font-style: italic;
        }
        .chevron {
          flex: 0 0 auto;
          --simple-icon-width: 18px;
          --simple-icon-height: 18px;
          transition: transform 0.15s ease-in-out;
        }
        :host([expanded]) .chevron {
          transform: rotate(180deg);
        }
        .panel {
          /* floats like a native select dropdown: out of the box model and
             positioned against the viewport from the trigger rect in JS */
          position: fixed;
          inset: auto;
          margin: 0;
          z-index: var(--simple-icon-select-z-index, 1000);
          overflow: visible;
          color: inherit;
          font: inherit;
          border: var(--ddd-border-xs, 1px solid)
            var(--simple-icon-select-border-color);
          border-radius: var(
            --simple-fields-border-radius,
            var(--ddd-radius-xs, 4px)
          );
          background-color: var(--simple-icon-select-background-color);
          box-shadow: var(--ddd-boxShadow-md, rgba(0, 0, 0, 0.25) 0 4px 12px 0);
          padding: var(--ddd-spacing-1, 4px);
        }
        .panel[hidden] {
          display: none;
        }
        .search {
          border-radius: var(--ddd-radius-xs, 4px);
        }
        .search::placeholder {
          color: inherit;
          opacity: 0.65;
        }
        ul[role="listbox"] {
          list-style: none;
          margin: var(--ddd-spacing-1, 4px) 0 0;
          padding: 0;
          max-height: var(--simple-icon-select-list-max-height, 280px);
          overflow-y: auto;
          overflow-x: hidden;
          overscroll-behavior: contain;
        }
        li[role="option"] {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2, 8px);
          min-height: var(--simple-icon-select-row-size);
          padding: var(--ddd-spacing-1, 4px) var(--ddd-spacing-2, 8px);
          border-radius: var(--ddd-radius-xs, 4px);
          cursor: pointer;
          min-width: 0;
        }
        li[role="option"].active {
          background-color: var(--simple-icon-select-active-background-color);
          outline: var(--ddd-border-xs, 1px solid)
            var(--simple-icon-select-accent-color);
          outline-offset: -1px;
        }
        li[role="option"][aria-selected="true"] {
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .tile {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          --simple-icon-width: 20px;
          --simple-icon-height: 20px;
        }
        .label-wrap {
          display: flex;
          flex-direction: column;
          min-width: 0;
          flex: 1 1 auto;
          line-height: 1.2;
        }
        .label-wrap .name,
        .label-wrap .id {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .label-wrap .id {
          font-size: 0.8em;
          font-weight: var(--ddd-font-weight-regular, 400);
          opacity: 0.7;
        }
        .check {
          flex: 0 0 auto;
          --simple-icon-width: 16px;
          --simple-icon-height: 16px;
          color: var(--simple-icon-select-accent-color);
        }
        .status {
          padding: var(--ddd-spacing-2, 8px);
          font-size: 0.85em;
          opacity: 0.75;
        }
        @media (prefers-reduced-motion: reduce) {
          .chevron {
            transition: none;
          }
        }
      `,
    ];
  }

  /**
   * full list of icon names offered (before search filtering)
   */
  _computeIcons() {
    const icons = _toList(this.icons);
    const list = icons
      ? icons
      : filterStoredIcons({
          includeSets: this.includeSets,
          excludeSets: this.excludeSets,
          exclude: this.exclude,
        });
    // de-dupe and sort by friendly name so the list reads alphabetically
    return [...new Set(list)].sort((a, b) =>
      iconFriendlyName(a).localeCompare(iconFriendlyName(b)),
    );
  }

  /**
   * icons matching the current search, matched on friendly name or id
   */
  get _matches() {
    const term = (this.__search || "").trim().toLowerCase();
    if (!term) return this.__allIcons;
    const words = term.split(/\s+/);
    return this.__allIcons.filter((icon) => {
      const haystack = `${icon} ${iconFriendlyName(icon)}`.toLowerCase();
      return words.every((w) => haystack.includes(w));
    });
  }

  /**
   * the rendered option rows: optional null row followed by matches
   */
  get _rows() {
    const rows = [];
    const term = (this.__search || "").trim();
    if (this.allowNull !== false && !term) rows.push(null);
    return rows.concat(this._matches.slice(0, this.__limit));
  }

  _optionId(index) {
    return `${this.__uid}-opt-${index}`;
  }

  get _accessibleName() {
    if (this.label && `${this.label}`.trim() !== "") return this.label;
    if (this.getAttribute("aria-label")) return this.getAttribute("aria-label");
    return this.t.selectAnIcon;
  }

  render() {
    const listId = `${this.__uid}-list`;
    const rows = this.expanded ? this._rows : [];
    const total = this.expanded ? this._matches.length : 0;
    const term = (this.__search || "").trim();
    return html`
      <button
        class="trigger"
        part="trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded="${this.expanded ? "true" : "false"}"
        aria-label="${this._accessibleName}: ${
          this.value ? iconFriendlyName(this.value) : this.t.noIcon
        }"
        ?disabled="${this.disabled}"
        @click="${this.toggle}"
        @keydown="${this._triggerKeydown}"
      >
        <span class="tile" aria-hidden="true">
          ${
            this.value
              ? html`<simple-icon-lite icon="${this.value}"></simple-icon-lite>`
              : ``
          }
        </span>
        <span class="name ${this.value ? "" : "empty"}">
          ${this.value ? iconFriendlyName(this.value) : this.t.noIcon}
        </span>
        <simple-icon-lite
          class="chevron"
          icon="icons:expand-more"
          aria-hidden="true"
        ></simple-icon-lite>
      </button>
      <div
        class="panel"
        part="panel"
        popover="${SUPPORTS_POPOVER ? "manual" : nothing}"
        ?hidden="${!this.expanded}"
      >
        <input
          class="search"
          part="search"
          type="search"
          role="combobox"
          autocomplete="off"
          spellcheck="false"
          aria-autocomplete="list"
          aria-expanded="${this.expanded ? "true" : "false"}"
          aria-controls="${listId}"
          aria-activedescendant="${
            this.__activeIndex >= 0 && this.__activeIndex < rows.length
              ? this._optionId(this.__activeIndex)
              : ""
          }"
          aria-label="${this.t.searchIcons}"
          placeholder="${this.placeholder || this.t.searchIcons}"
          .value="${this.__search}"
          @input="${this._searchInput}"
          @keydown="${this._searchKeydown}"
        />
        <ul
          id="${listId}"
          role="listbox"
          part="listbox"
          aria-label="${this._accessibleName}"
          @scroll="${this._listScroll}"
        >
          ${rows.map(
            (icon, index) => html`
              <li
                id="${this._optionId(index)}"
                role="option"
                part="option"
                class="${index === this.__activeIndex ? "active" : ""}"
                aria-selected="${
                  (icon === null && !this.value) || icon === this.value
                    ? "true"
                    : "false"
                }"
                data-value="${icon === null ? "" : icon}"
                @mousedown="${this._preventBlur}"
                @click="${() => this._select(icon)}"
                @mousemove="${() => this._setActive(index, false)}"
              >
                <span class="tile" aria-hidden="true">
                  ${
                    icon
                      ? html`<simple-icon-lite
                          icon="${icon}"
                        ></simple-icon-lite>`
                      : ``
                  }
                </span>
                <span class="label-wrap">
                  <span class="name"
                    >${icon ? iconFriendlyName(icon) : this.t.noIcon}</span
                  >
                  ${icon ? html`<span class="id">${icon}</span>` : ``}
                </span>
                ${
                  (icon === null && !this.value) || icon === this.value
                    ? html`<simple-icon-lite
                        class="check"
                        icon="icons:check"
                        aria-hidden="true"
                      ></simple-icon-lite>`
                    : ``
                }
              </li>
            `,
          )}
        </ul>
        ${
          this.expanded && total === 0
            ? html`<div class="status" role="status">
                ${
                  term
                    ? this.t.noIconsFoundFor.replace("{search}", () => term)
                    : this.t.noIconsAvailable
                }
              </div>`
            : this.expanded && total > this.__limit
              ? html`<div class="status" aria-hidden="true">
                  ${this.t.showingIcons
                    .replace("{shown}", () => Math.min(this.__limit, total))
                    .replace("{total}", () => total)}
                </div>`
              : ``
        }
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.__outsideHandler = this._outsideClick.bind(this);
    globalThis.addEventListener("pointerdown", this.__outsideHandler, true);
  }

  disconnectedCallback() {
    globalThis.removeEventListener("pointerdown", this.__outsideHandler, true);
    this._detachPositioning();
    this.expanded = false;
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    if (changedProperties.has("value") && this.__hasRendered) {
      /**
       * fires when value changes
       * @event value-changed
       */
      this.dispatchEvent(
        new CustomEvent("value-changed", {
          detail: { value: this.value },
        }),
      );
    }
    this.__hasRendered = true;
    if (
      ["icons", "includeSets", "excludeSets", "exclude"].some((p) =>
        changedProperties.has(p),
      ) &&
      this.expanded
    ) {
      this.__allIcons = this._computeIcons();
    }
  }

  /**
   * open / close the list
   */
  toggle() {
    if (this.expanded) this.close(true);
    else this.open();
  }

  async open() {
    if (this.disabled) return;
    // computed on open so iconsets registered after load are included
    this.__allIcons = this._computeIcons();
    this.__search = "";
    this.__limit = PAGE_SIZE;
    this.expanded = true;
    const rows = this._rows;
    const selected = rows.findIndex((icon) =>
      this.value ? icon === this.value : icon === null,
    );
    // the selected icon may be past the first page; render far enough to show it
    if (selected === -1 && this.value) {
      const pos = this.__allIcons.indexOf(this.value);
      if (pos !== -1) this.__limit = pos + PAGE_SIZE;
    }
    await this.updateComplete;
    const panel = this._panel;
    if (SUPPORTS_POPOVER && panel && !panel.matches(":popover-open")) {
      panel.showPopover();
    }
    this._positionPanel();
    this._attachPositioning();
    const index = this._rows.findIndex((icon) =>
      this.value ? icon === this.value : icon === null,
    );
    this._setActive(index >= 0 ? index : 0, true);
    const search = this.shadowRoot.querySelector(".search");
    if (search) search.focus({ preventScroll: true });
  }

  async close(refocus = false) {
    if (!this.expanded) return;
    this.expanded = false;
    this.__activeIndex = -1;
    this._detachPositioning();
    const panel = this._panel;
    if (SUPPORTS_POPOVER && panel && panel.matches(":popover-open")) {
      panel.hidePopover();
    }
    if (refocus) {
      await this.updateComplete;
      const trigger = this.shadowRoot.querySelector(".trigger");
      if (trigger) trigger.focus();
    }
  }

  get _panel() {
    return this.shadowRoot ? this.shadowRoot.querySelector(".panel") : null;
  }

  _attachPositioning() {
    // capture so scrolling any ancestor (form, tray, page) keeps it anchored
    globalThis.addEventListener("scroll", this.__reposition, true);
    globalThis.addEventListener("resize", this.__reposition);
  }

  _detachPositioning() {
    globalThis.removeEventListener("scroll", this.__reposition, true);
    globalThis.removeEventListener("resize", this.__reposition);
    if (this.__positionFrame) {
      globalThis.cancelAnimationFrame(this.__positionFrame);
      this.__positionFrame = null;
    }
  }

  _schedulePosition(e) {
    // scrolling the option list itself does not move the anchor
    if (e && e.type === "scroll" && e.composedPath) {
      const list = this.shadowRoot.querySelector('ul[role="listbox"]');
      if (list && e.composedPath()[0] === list) return;
    }
    if (this.__positionFrame) return;
    this.__positionFrame = globalThis.requestAnimationFrame(() => {
      this.__positionFrame = null;
      this._positionPanel();
    });
  }

  /**
   * place the dropdown against the trigger the way a native select does:
   * below when it fits, otherwise above, clamped to the viewport
   */
  _positionPanel() {
    const panel = this._panel;
    const trigger = this.shadowRoot.querySelector(".trigger");
    const list = this.shadowRoot.querySelector('ul[role="listbox"]');
    if (!this.expanded || !panel || !trigger || !list) return;
    const rect = trigger.getBoundingClientRect();
    const vw = globalThis.innerWidth;
    const vh = globalThis.innerHeight;
    // anchor scrolled fully out of view: close, like a native select
    if (rect.bottom < 0 || rect.top > vh) {
      this.close(false);
      return;
    }
    const width = Math.min(
      Math.max(rect.width, PANEL_MIN_WIDTH),
      vw - EDGE * 2,
    );
    const left = Math.min(Math.max(rect.left, EDGE), vw - width - EDGE);
    panel.style.width = `${width}px`;
    panel.style.left = `${left}px`;
    // height of everything in the panel except the scrolling list
    panel.style.setProperty(
      "--simple-icon-select-list-max-height",
      `${LIST_MAX_HEIGHT}px`,
    );
    const chrome = panel.offsetHeight - list.offsetHeight;
    const wanted = chrome + Math.min(LIST_MAX_HEIGHT, list.scrollHeight);
    const below = vh - rect.bottom - GAP - EDGE;
    const above = rect.top - GAP - EDGE;
    const up = below < wanted && above > below;
    const room = up ? above : below;
    const listMax = Math.max(
      Math.min(LIST_MAX_HEIGHT, room - chrome),
      Math.min(96, LIST_MAX_HEIGHT),
    );
    panel.style.setProperty(
      "--simple-icon-select-list-max-height",
      `${listMax}px`,
    );
    if (up) {
      panel.style.top = "auto";
      panel.style.bottom = `${vh - rect.top + GAP}px`;
    } else {
      panel.style.bottom = "auto";
      panel.style.top = `${rect.bottom + GAP}px`;
    }
    this.setAttribute("placement", up ? "top" : "bottom");
  }

  focus() {
    const trigger =
      this.shadowRoot && this.shadowRoot.querySelector(".trigger");
    if (trigger) trigger.focus();
    else super.focus();
  }

  _select(icon) {
    this.value = icon || null;
    this.close(true);
  }

  async _setActive(index, scroll = true) {
    const count = this._rows.length;
    if (count === 0) {
      this.__activeIndex = -1;
      return;
    }
    this.__activeIndex = Math.max(0, Math.min(index, count - 1));
    // near the end of the rendered page, render the next page
    if (
      this.__activeIndex >= count - 1 &&
      this._matches.length > this.__limit
    ) {
      this.__limit += PAGE_SIZE;
    }
    if (scroll) {
      await this.updateComplete;
      const el = this.shadowRoot.querySelector(
        `#${this._optionId(this.__activeIndex)}`,
      );
      if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
    }
  }

  _searchInput(e) {
    this.__search = e.target.value;
    this.__limit = PAGE_SIZE;
    this.__activeIndex = 0;
    const list = this.shadowRoot.querySelector('ul[role="listbox"]');
    if (list) list.scrollTop = 0;
    this.updateComplete.then(() => this._positionPanel());
  }

  _listScroll(e) {
    const list = e.target;
    if (
      list.scrollTop + list.clientHeight >= list.scrollHeight - 64 &&
      this._matches.length > this.__limit
    ) {
      this.__limit += PAGE_SIZE;
    }
  }

  _triggerKeydown(e) {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      if (!this.expanded) this.open();
    } else if (e.key === "Escape" && this.expanded) {
      e.preventDefault();
      this.close(true);
    }
  }

  _searchKeydown(e) {
    const rows = this._rows;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this._setActive(this.__activeIndex + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        this._setActive(this.__activeIndex - 1);
        break;
      case "PageDown":
        e.preventDefault();
        this._setActive(this.__activeIndex + 8);
        break;
      case "PageUp":
        e.preventDefault();
        this._setActive(this.__activeIndex - 8);
        break;
      case "Home":
        if (e.ctrlKey || !this.__search) {
          e.preventDefault();
          this._setActive(0);
        }
        break;
      case "End":
        if (e.ctrlKey || !this.__search) {
          e.preventDefault();
          this._setActive(rows.length - 1);
        }
        break;
      case "Enter":
        e.preventDefault();
        if (this.__activeIndex >= 0 && this.__activeIndex < rows.length) {
          this._select(rows[this.__activeIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        // keep the Escape from closing a surrounding dialog / tray
        e.stopPropagation();
        if (this.__search) {
          this.__search = "";
          this.__activeIndex = 0;
        } else {
          this.close(true);
        }
        break;
      case "Tab":
        this.close(false);
        break;
    }
  }

  _preventBlur(e) {
    // keep focus in the search box while clicking an option
    e.preventDefault();
  }

  _outsideClick(e) {
    if (!this.expanded) return;
    const path = e.composedPath ? e.composedPath() : [];
    if (!path.includes(this)) this.close(false);
  }
}
globalThis.customElements.define(SimpleIconSelect.tag, SimpleIconSelect);
export { SimpleIconSelect };
