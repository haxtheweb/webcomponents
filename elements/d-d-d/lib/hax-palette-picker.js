import { css, html } from "lit";
import { DDD } from "../d-d-d.js";
import {
  DDDPaletteSwatches,
  getDDDPaletteOptionByValue,
  getDDDPaletteOptions,
} from "./DDDPaletteRegistry.js";
import { DDDPaletteStyles } from "./DDDStyles.js";

/**
 * `hax-palette-picker`
 * A radio-style palette selector that writes values compatible with `data-palette`.
 *
 * Value contract:
 * - `value` is the canonical `data-palette` attribute value (for example `"5"`).
 * - `selectedKey` is the associated palette key (for example `"monotone"`).
 * - Emits `value-changed` with `{ value, key, dataPalette, option }`.
 */
class HaxPalettePicker extends DDD {
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
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-limestoneLight)
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
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneGray)
          );
        }
        .options {
          display: grid;
          gap: var(--ddd-spacing-3);
        }
        .option {
          position: relative;
          display: block;
          cursor: pointer;
          border: var(--ddd-border-sm);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-limestoneLight)
          );
          border-radius: var(--ddd-radius-sm);
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          padding: var(--ddd-spacing-2);
          transition:
            border-color 120ms ease-in-out,
            box-shadow 120ms ease-in-out,
            background-color 120ms ease-in-out;
        }
        .flags {
          position: absolute;
          display: block;
          right: var(--ddd-spacing-3);
          top: 6px;
        }
        .flag {
          border-radius: var(--ddd-radius-xs);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-6xs);
        }
        .flag.active {
          background: var(--ddd-theme-default-keystoneYellow);
          color: var(--ddd-theme-default-coalyGray);
        }
        .flag.selected {
          background: var(--ddd-theme-default-link);
          color: var(--ddd-theme-default-white);
        }
        .option:hover {
          border-color: var(--ddd-theme-default-link);
        }
        .option:focus-within {
          border-color: var(--ddd-theme-default-link);
          box-shadow: 0 0 0 2px
            color-mix(in srgb, var(--ddd-theme-default-link) 35%, transparent);
        }
        .option.selected {
          border-color: var(--ddd-theme-default-link);
          box-shadow: var(--ddd-boxShadow-sm);
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
        .option-display {
          display: grid;
          gap: var(--ddd-spacing-1);
        }
        .option-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: var(--ddd-spacing-2);
        }
        .option-label {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-6xs);
          font-weight: var(--ddd-font-weight-medium);
        }
        .swatches {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: var(--ddd-spacing-1);
        }
        .swatch {
          display: block;
          border: var(--ddd-border-xs);
          border-color: color-mix(
            in srgb,
            var(--ddd-theme-default-black) 35%,
            transparent
          );
          min-block-size: var(--ddd-spacing-6);
        }
        .swatch-1 {
          background-color: var(--ddd-palette-color-1);
        }
        .swatch-2 {
          background-color: var(--ddd-palette-color-2);
        }
        .swatch-3 {
          background-color: var(--ddd-palette-color-3);
        }
        .swatch-4 {
          background-color: var(--ddd-palette-color-4);
        }
        .swatch-5 {
          background-color: var(--ddd-palette-color-5);
        }
        .swatch-6 {
          background-color: var(--ddd-palette-color-6);
        }
        .swatch-7 {
          background-color: var(--ddd-palette-color-7);
        }
        :host([disabled]) .option {
          pointer-events: none;
          cursor: not-allowed;
          opacity: 0.7;
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
    this.label = "Palette";
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
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
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
      this._getMatchedOption(this.fallbackValue);
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

  _renderOption(option, index) {
    const checked = this._optionMatchesValue(option, this.value);
    const active = this._optionMatchesValue(option, this.activeValue);
    const id = `${this.__inputId}-${index}`;
    return html`
      <label
        class="option ${checked ? "selected" : ""}"
        data-palette="${option.dataPalette}"
      >
        <input
          id="${id}"
          type="radio"
          name="${this.name || this.__inputId}"
          value="${option.dataPalette}"
          ?checked="${checked}"
          ?required="${this.required}"
          ?disabled="${this.disabled}"
          @change="${() => this._handleSelection(option)}"
        />
        <div
          class="flags"
          ?hidden="${!this.showStatusFlags || !(active || checked)}"
        >
          <span class="flag active" ?hidden="${!active}">Active</span>
          <span class="flag selected" ?hidden="${!checked}">Selected</span>
        </div>
        <div class="option-display">
          <div class="option-header">
            <span class="option-label">${option.label}</span>
          </div>
          <div class="swatches" aria-hidden="true">
            ${option.swatches.map(
              (swatchIndex) => html`
                <span class="swatch swatch-${swatchIndex}"></span>
              `,
            )}
          </div>
        </div>
        <span
          class="sr-only"
          ?hidden="${!this.showStatusFlags || !(active && checked)}"
        >
          Currently active and selected palette
        </span>
        <span
          class="sr-only"
          ?hidden="${!this.showStatusFlags || !(active && !checked)}"
        >
          Currently active palette
        </span>
        <span
          class="sr-only"
          ?hidden="${!this.showStatusFlags || !(!active && checked)}"
        >
          Selected palette to apply
        </span>
      </label>
    `;
  }

  render() {
    return html`
      <fieldset
        role="radiogroup"
        aria-label="${this.label || "Palette selection"}"
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
        <div class="options">
          ${this._pickerOptions.map((option, index) =>
            this._renderOption(option, index),
          )}
        </div>
      </fieldset>
    `;
  }
}

globalThis.customElements.define(HaxPalettePicker.tag, HaxPalettePicker);
export { HaxPalettePicker };
