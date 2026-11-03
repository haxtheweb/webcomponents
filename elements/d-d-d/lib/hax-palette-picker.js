import { css, html } from "lit";
import { DDD } from "../d-d-d.js";
import {
  DDDPaletteSwatches,
  getDDDPaletteOptionByValue,
  getDDDPaletteOptions,
} from "./DDDPaletteRegistry.js";
import { DDDPaletteStyles } from "./DDDStyles.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `hax-palette-picker`
 * A radio-style palette selector that writes values compatible with `data-palette`.
 *
 * Value contract:
 * - `value` is the canonical `data-palette` attribute value (for example `"5"`).
 * - `selectedKey` is the associated palette key (for example `"monotone"`).
 * - Emits `value-changed` with `{ value, key, dataPalette, option }`.
 */
class HaxPalettePicker extends I18NMixin(DDD) {
  static get tag() {
    return "hax-palette-picker";
  }

  static get properties() {
    return {
      ...super.properties,
      label: { type: String },
      description: { type: String },
      value: { type: String, reflect: true },
      activeValue: { type: String, attribute: "active-value", reflect: true },
      selectedKey: { type: String, attribute: "selected-key", reflect: true },
      showStatusFlags: { type: Boolean, attribute: "show-status-flags" },
      options: { type: Array },
      name: { type: String },
      fallbackValue: { type: String, attribute: "fallback-value" },
      disabled: { type: Boolean, reflect: true },
      required: { type: Boolean, reflect: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      DDDPaletteStyles,
      css`
        :host {
          display: block;
          color: var(
            --hax-ui-text,
            light-dark(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-limestoneLight)
            )
          );
        }
        fieldset {
          margin: 0;
          padding: 0;
          border: none;
          min-inline-size: 0;
        }
        legend {
          margin: 0 0 var(--ddd-spacing-2);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-6xs);
          font-weight: var(--ddd-font-weight-medium);
          letter-spacing: var(--ddd-ls-16-sm);
        }
        .description {
          margin: 0 0 var(--ddd-spacing-3);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-6xs);
          color: var(
            --hax-ui-text-muted,
            light-dark(
              var(--ddd-theme-default-slateGray),
              var(--ddd-theme-default-limestoneGray)
            )
          );
        }
        /* one row per palette: a disc cut into its colours, the name and
           an Active pill; wide pickers list rows in a grid with the chosen
           palette in full below, narrow ones preview a palette beside the
           row on hover or focus */
        .options {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 2px var(--hax-ui-gap-md, var(--ddd-spacing-2));
        }
        :host([data-narrow]) .options {
          grid-template-columns: minmax(0, 1fr);
        }
        .option {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          block-size: 40px;
          padding: 0 var(--hax-ui-gap-md, var(--ddd-spacing-2));
          border-radius: var(--hax-ui-radius, var(--ddd-radius-sm));
          cursor: pointer;
          color: inherit;
        }
        .option:hover {
          background-color: var(
            --hax-ui-hover,
            light-dark(
              var(--ddd-theme-default-limestoneMaxLight),
              rgba(255, 255, 255, 0.08)
            )
          );
        }
        .option.selected {
          background-color: var(
            --hax-ui-selected,
            light-dark(
              var(--ddd-theme-default-skyMaxLight),
              rgba(65, 161, 255, 0.18)
            )
          );
          box-shadow: inset 3px 0 0
            var(--hax-ui-accent-strong, var(--ddd-theme-default-link));
        }
        .option:focus-within {
          outline: var(--hax-ui-focus-width, 2px) solid
            var(--hax-ui-focus, var(--ddd-theme-default-keystoneYellow));
          outline-offset: 1px;
        }
        .option input[type="radio"] {
          position: absolute;
          inline-size: 1px;
          block-size: 1px;
          margin: -1px;
          padding: 0;
          border: 0;
          clip: rect(0 0 0 0);
          overflow: hidden;
          white-space: nowrap;
        }
        .disc {
          flex: none;
          display: block;
          border-radius: 50%;
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.18);
        }
        .option .disc {
          inline-size: 28px;
          block-size: 28px;
        }
        .option-label {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-family: var(
            --hax-ui-admin-font-family,
            var(--ddd-font-navigation)
          );
          font-size: var(--hax-ui-admin-font-size, var(--ddd-font-size-4xs));
          font-weight: var(--ddd-font-weight-medium, 500);
        }
        .flag {
          flex: none;
          padding: 0 7px;
          border-radius: var(--hax-ui-radius-pill, 999px);
          font-family: var(
            --hax-ui-admin-font-family,
            var(--ddd-font-navigation)
          );
          font-size: 11px;
          font-weight: var(--ddd-font-weight-bold, 700);
          line-height: 1.6;
          color: var(--hax-ui-accent-strong, var(--ddd-theme-default-link));
          box-shadow: inset 0 0 0 1px currentColor;
        }
        /* the chosen palette in full: disc, name and colours 1 to 7 */
        .specimen {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          align-items: center;
          gap: 14px;
          margin-top: var(--hax-ui-gap-md, var(--ddd-spacing-3));
          padding: var(--hax-ui-gap-lg, var(--ddd-spacing-3));
          border: 1px solid
            var(
              --hax-ui-line,
              light-dark(
                var(--ddd-theme-default-limestoneLight),
                rgba(255, 255, 255, 0.16)
              )
            );
          border-radius: var(--hax-ui-radius-lg, var(--ddd-radius-md));
        }
        .specimen .disc {
          inline-size: 56px;
          block-size: 56px;
        }
        .specimen-name,
        .peek-name {
          margin: 0 0 6px;
          font-family: var(
            --hax-ui-admin-font-family,
            var(--ddd-font-navigation)
          );
          font-size: 15px;
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .codes {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
          gap: 4px 12px;
          margin: 0;
          padding: 0;
          list-style: none;
          font-variant-numeric: tabular-nums;
        }
        .codes li {
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 0;
          padding: 0;
          font-family: var(--ddd-font-mono, ui-monospace, monospace);
          font-size: 12px;
          line-height: 1.5;
        }
        .codes i {
          flex: none;
          inline-size: 12px;
          block-size: 12px;
          border-radius: 50%;
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.18);
        }
        /* narrow: a preview beside the picker, like the HAX blocks menu */
        .peek {
          position: fixed;
          z-index: 1000;
          inline-size: 240px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 14px;
          border: 1px solid
            var(
              --hax-ui-line-strong,
              light-dark(
                var(--ddd-theme-default-limestoneGray),
                rgba(255, 255, 255, 0.32)
              )
            );
          border-radius: var(--hax-ui-radius-lg, var(--ddd-radius-md));
          background-color: var(
            --hax-ui-surface,
            light-dark(var(--ddd-theme-default-white), #161616)
          );
          color: var(
            --hax-ui-text,
            light-dark(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-limestoneLight)
            )
          );
          box-shadow: var(
            --hax-ui-shadow-popover,
            0 8px 28px rgba(0, 20, 40, 0.24)
          );
          pointer-events: none;
        }
        .peek[hidden] {
          display: none;
        }
        .peek-head {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .peek-head .disc {
          inline-size: 44px;
          block-size: 44px;
        }
        .peek-name {
          margin: 0;
        }
        .peek-sub {
          display: block;
          font-size: 12px;
          color: var(
            --hax-ui-text-muted,
            light-dark(
              var(--ddd-theme-default-slateGray),
              var(--ddd-theme-default-limestoneGray)
            )
          );
        }
        .peek .codes {
          grid-template-columns: 1fr 1fr;
        }
        .peek::after {
          content: "";
          position: absolute;
          top: var(--peek-arrow, 22px);
          inline-size: 12px;
          block-size: 12px;
          background: inherit;
          border: inherit;
          border-width: 0;
          transform: rotate(45deg);
        }
        .peek[data-side="left"]::after {
          right: -7px;
          border-top-width: 1px;
          border-right-width: 1px;
        }
        .peek[data-side="right"]::after {
          left: -7px;
          border-bottom-width: 1px;
          border-left-width: 1px;
        }

        :host([disabled]) .option {
          pointer-events: none;
          cursor: not-allowed;
          opacity: var(--ddd-opacity-80, 0.7);
        }
        .sr-only {
          position: absolute;
          inline-size: 1px;
          block-size: 1px;
          margin: -1px;
          padding: 0;
          border: 0;
          clip: rect(0 0 0 0);
          overflow: hidden;
          white-space: nowrap;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      palette: "Palette",
      paletteSelection: "Palette selection",
      active: "Active",
      selected: "Selected",
      currentlyActiveAndSelectedPalette:
        "Currently active and selected palette",
      currentlyActivePalette: "Currently active palette",
      selectedPaletteToApply: "Selected palette to apply",
      activePaletteLabel: "Active palette",
      colorNumber: "Colour {number}",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales/", import.meta.url).href,
    });
    this.i18nDefault("label", "palette");
    this.description = "";
    this.activeValue = "";
    this.showStatusFlags = false;
    this.name = "";
    this.disabled = false;
    this.required = false;
    this.fallbackValue = "0";
    this.options = getDDDPaletteOptions();
    const fallback = getDDDPaletteOptionByValue(this.fallbackValue);
    this.value = fallback ? fallback.dataPalette : this.fallbackValue;
    this.selectedKey = fallback ? fallback.key : "";
    this.__inputId = `hax-palette-picker-${Math.random()
      .toString(36)
      .slice(2, 10)}`;
    this._peekKey = "";
    this._onScroll = this._onScroll.bind(this);
  }

  static get NARROW_WIDTH() {
    return 420;
  }

  connectedCallback() {
    super.connectedCallback();
    // narrow when the picker itself is narrow (the Theme Preview panel),
    // whatever the viewport
    if (globalThis.ResizeObserver && !this.__resize) {
      this.__resize = new globalThis.ResizeObserver((entries) => {
        const entry = entries[entries.length - 1];
        const width = entry ? entry.contentRect.width : this.offsetWidth;
        this._setNarrow(width > 0 && width < HaxPalettePicker.NARROW_WIDTH);
      });
    }
    if (this.__resize) {
      this.__resize.observe(this);
    }
  }

  disconnectedCallback() {
    if (this.__resize) {
      this.__resize.disconnect();
    }
    this._hidePeek();
    super.disconnectedCallback();
  }

  _setNarrow(narrow) {
    if (narrow === this.hasAttribute("data-narrow")) {
      return;
    }
    this.toggleAttribute("data-narrow", narrow);
    if (!narrow) {
      this._hidePeek();
    }
    this.requestUpdate();
  }

  get _narrow() {
    return this.hasAttribute("data-narrow");
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) super.willUpdate(changedProperties);
    // Derive selectedKey/value from the option list in willUpdate so
    // reactive sets batch into the current update cycle. _syncValueToOption
    // sets this.selectedKey and potentially this.value; calling it from
    // updated() scheduled a redundant second update (Lit change-in-update
    // warning).
    if (
      changedProperties.has("value") ||
      changedProperties.has("options") ||
      changedProperties.has("fallbackValue")
    ) {
      this._syncValueToOption();
    }
  }

  get _pickerOptions() {
    const defaultOptions = getDDDPaletteOptions();
    if (Array.isArray(this.options) && this.options.length > 0) {
      return this.options
        .map((option) => this._normalizeOption(option))
        .filter((option) => !!option);
    }
    if (this.options && typeof this.options === "object") {
      return Object.keys(this.options)
        .map((key) =>
          this._normalizeOption({
            key,
            label: this.options[key],
            dataPalette: key,
          }),
        )
        .filter((option) => !!option);
    }
    return defaultOptions;
  }

  _normalizeValue(value) {
    if (value === 0 || value === "0") {
      return "0";
    }
    if (!value && value !== 0) {
      return "";
    }
    if (!value.toString) {
      return "";
    }
    return value.toString().trim().toLowerCase();
  }

  _optionMatchesValue(option, value) {
    const normalizedValue = this._normalizeValue(value);
    if (!normalizedValue || !option) {
      return false;
    }
    if (
      normalizedValue === this._normalizeValue(option.key) ||
      normalizedValue === this._normalizeValue(option.dataPalette)
    ) {
      return true;
    }
    if (!Array.isArray(option.aliases)) {
      return false;
    }
    return option.aliases
      .map((alias) => this._normalizeValue(alias))
      .includes(normalizedValue);
  }

  _normalizeOption(option) {
    if (!option && option !== 0) {
      return null;
    }
    if (typeof option === "string" || typeof option === "number") {
      return getDDDPaletteOptionByValue(option, this.fallbackValue);
    }
    const fallbackOption = getDDDPaletteOptionByValue(
      option.dataPalette || option.key || option.value,
      this.fallbackValue,
    );
    const dataPalette = option.dataPalette || option.value;
    const aliases = Array.isArray(option.aliases)
      ? option.aliases.map((alias) => this._normalizeValue(alias))
      : fallbackOption
        ? [...fallbackOption.aliases]
        : [this._normalizeValue(option.key), this._normalizeValue(dataPalette)];
    const swatches =
      Array.isArray(option.swatches) && option.swatches.length > 0
        ? [...option.swatches]
        : fallbackOption
          ? [...fallbackOption.swatches]
          : [...DDDPaletteSwatches];
    return {
      key:
        option.key || (fallbackOption ? fallbackOption.key : `${dataPalette}`),
      label:
        option.label ||
        option.text ||
        (fallbackOption ? fallbackOption.label : `${dataPalette}`),
      dataPalette: `${dataPalette || (fallbackOption ? fallbackOption.dataPalette : this.fallbackValue)}`,
      aliases,
      swatches,
    };
  }

  _getMatchedOption(value = this.value) {
    const options = this._pickerOptions;
    return (
      options.find((option) => this._optionMatchesValue(option, value)) || null
    );
  }

  _syncValueToOption() {
    const selectedOption =
      this._getMatchedOption(this.value) ||
      (this.value === null || this.value === undefined || this.value === ""
        ? null
        : this._getMatchedOption(this.fallbackValue));
    if (selectedOption) {
      this.selectedKey = selectedOption.key;
      if (this.value !== selectedOption.dataPalette) {
        this.value = selectedOption.dataPalette;
      }
      return;
    }
    this.selectedKey = "";
  }

  _fireValueChanged(option) {
    const detail = {
      value: this.value,
      key: option ? option.key : "",
      dataPalette: option ? option.dataPalette : this.value,
      option,
    };
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail,
      }),
    );
    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail,
      }),
    );
  }

  _handleSelection(option) {
    if (!option || this.disabled) {
      return;
    }
    this.value = option.dataPalette;
    this.selectedKey = option.key;
    this._fireValueChanged(option);
  }

  /** a disc cut into the palette's colours, as vertical stripes */
  _discStyle(option) {
    const swatches =
      option && Array.isArray(option.swatches) && option.swatches.length
        ? option.swatches
        : DDDPaletteSwatches;
    const step = 100 / swatches.length;
    const stops = swatches
      .map(
        (swatch, i) =>
          `var(--ddd-palette-color-${swatch}) ${(i * step).toFixed(3)}% ${(
            (i + 1) *
            step
          ).toFixed(3)}%`,
      )
      .join(", ");
    return `background: linear-gradient(90deg, ${stops});`;
  }

  _renderDisc(option) {
    return html`<span
      class="disc"
      aria-hidden="true"
      data-palette="${option.dataPalette}"
      style="${this._discStyle(option)}"
    ></span>`;
  }

  _toHex(color) {
    const parts = String(color || "").match(/[\d.]+/g);
    if (!parts || parts.length < 3) {
      return "";
    }
    return `#${parts
      .slice(0, 3)
      .map((part) => Math.round(parseFloat(part)).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()}`;
  }

  /** the palette's swatch numbers, in order */
  _swatchesOf(option) {
    return option && Array.isArray(option.swatches) && option.swatches.length
      ? option.swatches
      : DDDPaletteSwatches;
  }

  /**
   * Hex codes are read live from each dot after it renders, so they always
   * match the colours DDD resolves, whenever those load.
   */
  _fillHexCodes() {
    const root = this.renderRoot || this.shadowRoot;
    if (!root) {
      return;
    }
    root.querySelectorAll(".codes li").forEach((li) => {
      const dot = li.querySelector("i");
      const out = li.querySelector(".hex");
      if (dot && out) {
        const hex = this._toHex(
          globalThis.getComputedStyle(dot).backgroundColor,
        );
        if (out.textContent !== hex) {
          out.textContent = hex;
        }
      }
    });
  }

  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    this._fillHexCodes();
    // colours that resolve a moment later (site styles still loading)
    globalThis.requestAnimationFrame(() => this._fillHexCodes());
  }

  _renderCodes(option) {
    return html`<ul class="codes">
      ${this._swatchesOf(option).map(
        (number) =>
          html`<li>
            <i
              data-palette="${option.dataPalette}"
              style="background-color: var(--ddd-palette-color-${number})"
              aria-hidden="true"
            ></i
            ><span
              ><span class="sr-only"
                >${this.t.colorNumber.replace("{number}", number)}</span
              ><span aria-hidden="true">${number}</span>
              <span class="hex"></span
            ></span>
          </li>`,
      )}
    </ul>`;
  }

  _renderSpecimen() {
    if (this._narrow) {
      return "";
    }
    const option = this._getMatchedOption(this.value);
    if (!option) {
      return "";
    }
    const active = this._optionMatchesValue(option, this.activeValue);
    return html`<div class="specimen" aria-hidden="true">
      ${this._renderDisc(option)}
      <div>
        <p class="specimen-name">
          ${option.label}${active && this.showStatusFlags
            ? ` · ${this.t.active}`
            : ""}
        </p>
        ${this._renderCodes(option)}
      </div>
    </div>`;
  }

  _renderPeek() {
    const option = this._peekKey
      ? this._pickerOptions.find((o) => o.key === this._peekKey)
      : null;
    const active = option && this._optionMatchesValue(option, this.activeValue);
    return html`<div
      class="peek"
      id="${this.__inputId}-peek"
      role="tooltip"
      ?hidden="${!option}"
    >
      ${option
        ? html`<div class="peek-head">
              ${this._renderDisc(option)}
              <div>
                <p class="peek-name">${option.label}</p>
                <span class="peek-sub"
                  >${active ? this.t.activePaletteLabel : this.t.palette}</span
                >
              </div>
            </div>
            ${this._renderCodes(option)}`
        : ""}
    </div>`;
  }

  _showPeek(option, row) {
    if (!this._narrow || !option || !row) {
      return;
    }
    this._peekKey = option.key;
    this.__peekRow = row;
    globalThis.addEventListener("scroll", this._onScroll, true);
    this.requestUpdate();
    this.updateComplete.then(() => this._placePeek());
  }

  _hidePeek() {
    if (!this._peekKey) {
      return;
    }
    this._peekKey = "";
    this.__peekRow = null;
    globalThis.removeEventListener("scroll", this._onScroll, true);
    this.requestUpdate();
  }

  _onScroll() {
    this._hidePeek();
  }

  /** beside the picker on the side with room, pointing at the row */
  _placePeek() {
    const peek = this.shadowRoot && this.shadowRoot.querySelector(".peek");
    const row = this.__peekRow;
    if (!peek || !row || peek.hidden) {
      return;
    }
    this._fillHexCodes();
    const host = this.getBoundingClientRect();
    const r = row.getBoundingClientRect();
    const width = peek.offsetWidth;
    const height = peek.offsetHeight;
    const gap = 12;
    const viewW = globalThis.innerWidth;
    const viewH = globalThis.innerHeight;
    const left = host.left - width - gap;
    const side =
      left >= 8 || host.right + gap + width > viewW ? "left" : "right";
    const x = side === "left" ? Math.max(8, left) : host.right + gap;
    let y = r.top + r.height / 2 - 24;
    y = Math.max(8, Math.min(y, viewH - height - 8));
    peek.dataset.side = side;
    peek.style.left = `${Math.round(x)}px`;
    peek.style.top = `${Math.round(y)}px`;
    const arrow = Math.max(
      12,
      Math.min(height - 24, r.top + r.height / 2 - y - 6),
    );
    peek.style.setProperty("--peek-arrow", `${Math.round(arrow)}px`);
  }

  _onKeydown(e) {
    if (e.key === "Escape" && this._peekKey) {
      this._hidePeek();
    }
  }

  _renderOption(option, index) {
    const checked = this._optionMatchesValue(option, this.value);
    const active = this._optionMatchesValue(option, this.activeValue);
    const id = `${this.__inputId}-${index}`;
    const describedBy = this._narrow ? `${this.__inputId}-peek` : "";
    return html`
      <label
        class="option ${checked ? "selected" : ""}"
        data-palette="${option.dataPalette}"
        @mouseenter="${(e) => this._showPeek(option, e.currentTarget)}"
        @mouseleave="${() => this._hidePeek()}"
      >
        <input
          id="${id}"
          type="radio"
          name="${this.name || this.__inputId}"
          value="${option.dataPalette}"
          aria-describedby="${describedBy}"
          ?checked="${checked}"
          ?required="${this.required}"
          ?disabled="${this.disabled}"
          @change="${() => this._handleSelection(option)}"
          @focus="${(e) => this._showPeek(option, e.target.closest("label"))}"
          @blur="${() => this._hidePeek()}"
        />
        ${this._renderDisc(option)}
        <span class="option-label">${option.label}</span>
        <span
          class="flag active"
          ?hidden="${!this.showStatusFlags || !active}"
          aria-hidden="true"
          >${this.t.active}</span
        >
        <span
          class="sr-only"
          ?hidden="${!this.showStatusFlags || !(active && checked)}"
        >
          ${this.t.currentlyActiveAndSelectedPalette}
        </span>
        <span
          class="sr-only"
          ?hidden="${!this.showStatusFlags || !(active && !checked)}"
        >
          ${this.t.currentlyActivePalette}
        </span>
        <span
          class="sr-only"
          ?hidden="${!this.showStatusFlags || !(!active && checked)}"
        >
          ${this.t.selectedPaletteToApply}
        </span>
      </label>
    `;
  }

  render() {
    return html`
      <fieldset
        role="radiogroup"
        aria-label="${this.label || this.t.paletteSelection}"
        aria-describedby="${this.description
          ? `${this.__inputId}-description`
          : ""}"
        ?disabled="${this.disabled}"
      >
        <legend ?hidden="${!this.label}">${this.label}</legend>
        <p
          id="${this.__inputId}-description"
          class="description"
          ?hidden="${!this.description}"
        >
          ${this.description}
        </p>
        <div class="options" @keydown="${this._onKeydown}">
          ${this._pickerOptions.map((option, index) =>
            this._renderOption(option, index),
          )}
        </div>
        ${this._renderSpecimen()}
      </fieldset>
      ${this._renderPeek()}
    `;
  }
}

globalThis.customElements.define(HaxPalettePicker.tag, HaxPalettePicker);
export { HaxPalettePicker };
