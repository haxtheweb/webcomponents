import { css, html } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

/**
 * `haxcms-theme-picker`
 * A radio-style theme selector with preview cards.
 *
 * Value contract:
 * - `value` is the selected theme key (for example `"clean-one"`).
 * - Emits `value-changed` and `change` with `{ value, key, option }`.
 */
class HAXCMSThemePicker extends DDD {
  static get tag() {
    return "haxcms-theme-picker";
  }

  static get properties() {
    return {
      ...super.properties,
      label: { type: String },
      description: { type: String },
      value: { type: String, reflect: true },
      activeValue: { type: String, attribute: "active-value", reflect: true },
      options: { type: Array },
      name: { type: String },
      disabled: { type: Boolean, reflect: true },
      required: { type: Boolean, reflect: true },
      showAllThemes: { type: Boolean, attribute: "show-all-themes" },
      showStatusFlags: { type: Boolean, attribute: "show-status-flags" },
      mini: { type: Boolean, reflect: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        :host([mini]) {
          --haxcms-theme-picker-preview-height: var(
            --haxcms-theme-picker-mini-preview-height,
            64px
          );
          --haxcms-theme-picker-legend-size: var(
            --ddd-font-size-5xs,
            var(--ddd-font-size-4xs)
          );
          --haxcms-theme-picker-description-size: var(
            --ddd-font-size-5xs,
            var(--ddd-font-size-4xs)
          );
          --haxcms-theme-picker-fallback-size: var(
            --ddd-font-size-5xs,
            var(--ddd-font-size-4xs)
          );
          --haxcms-theme-picker-flag-size: var(
            --ddd-font-size-6xs,
            var(--ddd-font-size-5xs, var(--ddd-font-size-4xs))
          );
          --haxcms-theme-picker-theme-name-size: var(--ddd-font-size-4xs);
        }
        fieldset {
          margin: 0;
          padding: 0;
          border: 0;
          min-inline-size: 0;
        }
        legend {
          margin: 0 0 var(--ddd-spacing-2);
          font-family: var(--ddd-font-navigation);
          font-size: var(
            --haxcms-theme-picker-legend-size,
            var(--ddd-font-size-4xs)
          );
          font-weight: var(--ddd-font-weight-medium);
          line-height: 1.2;
          letter-spacing: var(--ddd-ls-16-sm);
        }
        .description,
        .empty {
          margin: 0 0 var(--ddd-spacing-3);
          font-family: var(--ddd-font-primary);
          font-size: var(
            --haxcms-theme-picker-description-size,
            var(--ddd-font-size-4xs)
          );
          line-height: 1.3;
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneGray)
          );
        }
        .options {
          display: grid;
          gap: var(--ddd-spacing-3);
          grid-template-columns: repeat(
            auto-fill,
            minmax(var(--haxcms-theme-picker-min-card-width, 160px), 1fr)
          );
        }
        .option {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: var(--ddd-spacing-2);
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
        .option.active {
          box-shadow: inset 0 0 0 1px
            color-mix(
              in srgb,
              var(--ddd-theme-default-keystoneYellow) 45%,
              transparent
            );
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
        .preview-wrap {
          position: relative;
        }
        .flags {
          position: absolute;
          top: var(--ddd-spacing-1);
          left: var(--ddd-spacing-1);
          right: var(--ddd-spacing-1);
          z-index: 1;
          display: flex;
          justify-content: space-between;
          pointer-events: none;
        }
        .flag {
          border-radius: var(--ddd-radius-xs);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          font-family: var(--ddd-font-navigation);
          font-size: var(
            --haxcms-theme-picker-flag-size,
            var(--ddd-font-size-4xs)
          );
          line-height: 1.2;
        }
        .flag.active {
          background: var(--ddd-theme-default-keystoneYellow);
          color: var(--ddd-theme-default-coalyGray);
        }
        .flag.selected {
          background: var(--ddd-theme-default-link);
          color: var(--ddd-theme-default-white);
        }
        .preview {
          display: flex;
          align-items: center;
          justify-content: center;
          inline-size: 100%;
          block-size: var(--haxcms-theme-picker-preview-height, 220px);
          border-radius: var(--ddd-radius-xs);
          border: var(--ddd-border-xs);
          border-color: color-mix(
            in srgb,
            var(--ddd-theme-default-black) 15%,
            transparent
          );
          background: light-dark(
            var(--ddd-theme-default-limestoneLight),
            color-mix(
              in srgb,
              var(--ddd-theme-default-coalyGray) 80%,
              var(--ddd-theme-default-black)
            )
          );
          object-fit: cover;
        }
        .preview-fallback {
          font-family: var(--ddd-font-primary);
          font-size: var(
            --haxcms-theme-picker-fallback-size,
            var(--ddd-font-size-4xs)
          );
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneGray)
          );
        }
        .theme-name {
          font-family: var(--ddd-font-navigation);
          font-size: var(
            --haxcms-theme-picker-theme-name-size,
            var(--ddd-font-size-xs)
          );
          font-weight: var(--ddd-font-weight-medium);
          line-height: 1.2;
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
        :host([disabled]) .option {
          pointer-events: none;
          cursor: not-allowed;
          opacity: 0.65;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.label = "Theme";
    this.description = "";
    this.value = "";
    this.activeValue = "";
    this.options = {};
    this.name = "";
    this.disabled = false;
    this.required = false;
    this.showAllThemes = false;
    this.showStatusFlags = true;
    this.mini = false;
    this.__inputId = `haxcms-theme-picker-${Math.random()
      .toString(36)
      .slice(2, 10)}`;
    this.__imageLoadErrors = {};
    this.__refreshThemePickerHandler = this._refreshThemePicker.bind(this);
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    globalThis.addEventListener(
      "haxcms-theme-picker-refresh",
      this.__refreshThemePickerHandler,
    );
  }

  disconnectedCallback() {
    globalThis.removeEventListener(
      "haxcms-theme-picker-refresh",
      this.__refreshThemePickerHandler,
    );
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
  }

  _refreshThemePicker(e) {
    if (e && e.detail === true) {
      this.showAllThemes = true;
    }
    this.requestUpdate();
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (
      changedProperties.has("value") ||
      changedProperties.has("activeValue") ||
      changedProperties.has("options") ||
      changedProperties.has("showAllThemes")
    ) {
      this._syncValueToOption();
    }
  }

  _isTruthy(value) {
    return value === true || value === "true" || value === 1 || value === "1";
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
    return value.toString().trim();
  }

  _themeRegistry() {
    if (
      globalThis.appSettings &&
      globalThis.appSettings.themes &&
      typeof globalThis.appSettings.themes === "object"
    ) {
      return globalThis.appSettings.themes;
    }
    return {};
  }

  _resolveThemeThumbnail(thumbnail = "") {
    if (!thumbnail || typeof thumbnail !== "string") {
      return "";
    }
    if (thumbnail.indexOf("@haxtheweb/") === 0) {
      const scopeMarker = "/@haxtheweb/";
      const markerIndex = import.meta.url.indexOf(scopeMarker);
      if (markerIndex !== -1) {
        const scopedBase = import.meta.url.substring(
          0,
          markerIndex + scopeMarker.length,
        );
        const packagePath = thumbnail.replace("@haxtheweb/", "");
        return `${scopedBase}${packagePath}`;
      }
      let basePath = "";
      if (
        globalThis.WCAutoloadBasePath &&
        typeof globalThis.WCAutoloadBasePath === "string"
      ) {
        basePath = globalThis.WCAutoloadBasePath;
      } else if (
        globalThis.WCGlobalBasePath &&
        typeof globalThis.WCGlobalBasePath === "string"
      ) {
        basePath = globalThis.WCGlobalBasePath;
      }
      if (basePath) {
        if (basePath.charAt(basePath.length - 1) !== "/") {
          basePath += "/";
        }
        return `${basePath}${thumbnail}`;
      }
      const packagePath = `../../../../${thumbnail}`;
      return new URL(packagePath, import.meta.url).href;
    }
    return thumbnail;
  }

  _normalizeOption(option) {
    if (!option && option !== 0) {
      return null;
    }
    let raw = option;
    if (typeof raw === "string" || typeof raw === "number") {
      raw = {
        key: `${raw}`,
        value: `${raw}`,
      };
    }
    const value = this._normalizeValue(raw.value || raw.key || raw.element);
    if (!value) {
      return null;
    }
    const registry = this._themeRegistry();
    const registryTheme = registry[value] ? registry[value] : {};
    const label =
      raw.label ||
      raw.text ||
      raw.name ||
      registryTheme.name ||
      registryTheme.title ||
      value;
    const thumbnail = this._resolveThemeThumbnail(
      raw.thumbnail || raw.preview || registryTheme.thumbnail || "",
    );
    const hidden =
      this._isTruthy(raw.hidden) || this._isTruthy(registryTheme.hidden);
    const terrible =
      this._isTruthy(raw.terrible) ||
      this._isTruthy(registryTheme.terrible) ||
      value.indexOf("terrible") === 0;
    const legacy =
      this._isTruthy(raw.legacy) ||
      this._isTruthy(raw.deprecated) ||
      this._isTruthy(raw.isLegacy) ||
      this._isTruthy(registryTheme.legacy) ||
      this._isTruthy(registryTheme.deprecated) ||
      this._isTruthy(registryTheme.isLegacy);
    return {
      value: value,
      label: label,
      thumbnail: thumbnail,
      hidden: hidden,
      terrible: terrible,
      legacy: legacy,
    };
  }

  get _allOptions() {
    let options = [];
    if (Array.isArray(this.options) && this.options.length > 0) {
      options = this.options
        .map((option) => this._normalizeOption(option))
        .filter((option) => !!option);
    } else if (this.options && typeof this.options === "object") {
      options = Object.keys(this.options)
        .map((key) =>
          this._normalizeOption({
            key: key,
            value: key,
            label: this.options[key],
          }),
        )
        .filter((option) => !!option);
    } else {
      const registry = this._themeRegistry();
      options = Object.keys(registry)
        .map((key) =>
          this._normalizeOption({
            key: key,
            value: key,
          }),
        )
        .filter((option) => !!option);
    }
    const selectedValue = this._normalizeValue(this.value);
    const activeValue = this._normalizeValue(this.activeValue);
    if (
      selectedValue &&
      !options.find(
        (option) => this._normalizeValue(option.value) === selectedValue,
      )
    ) {
      options.push(
        this._normalizeOption({
          key: selectedValue,
          value: selectedValue,
          label: selectedValue,
        }),
      );
    }
    if (
      activeValue &&
      !options.find(
        (option) => this._normalizeValue(option.value) === activeValue,
      )
    ) {
      options.push(
        this._normalizeOption({
          key: activeValue,
          value: activeValue,
          label: activeValue,
        }),
      );
    }
    return options.filter((option) => !!option);
  }

  _isVisibleOption(option) {
    if (!option) {
      return false;
    }
    const selectedValue = this._normalizeValue(this.value);
    const activeValue = this._normalizeValue(this.activeValue);
    if (selectedValue && selectedValue === this._normalizeValue(option.value)) {
      return true;
    }
    if (activeValue && activeValue === this._normalizeValue(option.value)) {
      return true;
    }
    if (this._isTruthy(this.showAllThemes)) {
      return true;
    }
    if (option.hidden || option.terrible || option.legacy) {
      return false;
    }
    return true;
  }

  get _visibleOptions() {
    return this._allOptions.filter((option) => this._isVisibleOption(option));
  }

  _syncValueToOption() {
    const selectedValue = this._normalizeValue(this.value);
    if (!selectedValue) {
      return;
    }
    const hasMatch = this._allOptions.find(
      (option) => this._normalizeValue(option.value) === selectedValue,
    );
    if (!hasMatch) {
      this.value = "";
    }
  }

  _fireValueChanged(option) {
    const detail = {
      value: this.value,
      key: option ? option.value : "",
      option: option,
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
    this.value = option.value;
    this._fireValueChanged(option);
  }

  _isThumbnailUnavailable(option) {
    if (!option || !option.thumbnail) {
      return true;
    }
    return this.__imageLoadErrors[this._normalizeValue(option.value)] === true;
  }

  _markThumbnailError(option) {
    if (!option) {
      return;
    }
    const key = this._normalizeValue(option.value);
    if (!key) {
      return;
    }
    this.__imageLoadErrors = {
      ...this.__imageLoadErrors,
      [key]: true,
    };
    this.requestUpdate();
  }

  _renderOption(option, index) {
    const checked =
      this._normalizeValue(option.value) === this._normalizeValue(this.value);
    const active =
      this._normalizeValue(option.value) ===
      this._normalizeValue(this.activeValue);
    const showActiveState = this.showStatusFlags && active;
    const id = `${this.__inputId}-${index}`;
    return html`
      <label
        class="option ${checked ? "selected" : ""} ${showActiveState
          ? "active"
          : ""}"
      >
        <input
          id="${id}"
          type="radio"
          name="${this.name || this.__inputId}"
          value="${option.value}"
          ?checked="${checked}"
          ?required="${this.required}"
          ?disabled="${this.disabled}"
          aria-label="${option.label}"
          @change="${() => this._handleSelection(option)}"
        />
        <div class="preview-wrap">
          <div
            class="flags"
            ?hidden="${!this.showStatusFlags || !(active || checked)}"
          >
            <span class="flag active" ?hidden="${!active}">Active</span>
            <span class="flag selected" ?hidden="${!checked}">Selected</span>
          </div>
          ${this._isThumbnailUnavailable(option)
            ? html`
                <div class="preview preview-fallback" aria-hidden="true">
                  No preview
                </div>
              `
            : html`
                <img
                  class="preview"
                  src="${option.thumbnail}"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  @error="${() => this._markThumbnailError(option)}"
                />
              `}
        </div>
        <div class="theme-name">${option.label}</div>
        <span
          class="sr-only"
          ?hidden="${!this.showStatusFlags || !(active && checked)}"
        >
          Currently active and selected theme
        </span>
        <span
          class="sr-only"
          ?hidden="${!this.showStatusFlags || !(active && !checked)}"
        >
          Currently active theme
        </span>
        <span
          class="sr-only"
          ?hidden="${!this.showStatusFlags || !(!active && checked)}"
        >
          Selected theme to apply on save
        </span>
      </label>
    `;
  }

  render() {
    const pickerOptions = this._visibleOptions;
    return html`
      <fieldset
        role="radiogroup"
        aria-label="${this.label || "Theme selection"}"
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
        <div class="options" ?hidden="${pickerOptions.length === 0}">
          ${pickerOptions.map((option, index) =>
            this._renderOption(option, index),
          )}
        </div>
        <p class="empty" ?hidden="${pickerOptions.length !== 0}">
          No themes available.
        </p>
      </fieldset>
    `;
  }
}

globalThis.customElements.define(HAXCMSThemePicker.tag, HAXCMSThemePicker);
export { HAXCMSThemePicker };
