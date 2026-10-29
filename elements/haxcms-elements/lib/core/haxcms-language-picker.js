import { css, html } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import {
  getLanguageOptions,
  getLanguageRegistry,
  loadLanguageRegistry,
  matchLanguageCode,
  searchLanguageOptions,
} from "@haxtheweb/i18n-manager/lib/LanguageRegistry.js";

/**
 * `haxcms-language-picker`
 * A searchable language select that lists every language in the canonical
 * language registry (`@haxtheweb/i18n-manager/lib/languages.json`) as
 * "English name - code", for example "Swahili - sw". Typing matches the
 * English name, native name, code or an alias, so "swa", "Kiswahili" and
 * "sw" all find Swahili.
 *
 * Like `haxcms-theme-picker` it only depends on DDD and I18NMixin (not the
 * site store), so a page like the installer can load just this file.
 *
 * Value contract:
 * - `value` is the canonical registry code (for example `"sw"`, `"pt-BR"`,
 *   `"zh-CN"`). Legacy forms are normalized: `zh_CN` becomes `zh-CN`.
 * - With `allow-custom`, a BCP-47 looking code the registry does not know
 *   (for example `fr-CA`) can be chosen and is kept as typed.
 * - Emits `value-changed` and `change` with `{ value, key, option }`.
 *
 * Embedding in a host that draws its own label (an admin field row):
 * - `label-hidden` hides the visible label but keeps it as the input's
 *   accessible name (visually hidden, still read by screen readers).
 * - Size the control to match the host with CSS custom properties. Every
 *   default is the stand-alone look, so leaving them unset changes nothing:
 *   - `--haxcms-language-picker-font-size` input text (default
 *     `--ddd-font-size-xs`)
 *   - `--haxcms-language-picker-option-font-size` list text (default
 *     `--ddd-theme-body-font-size`, the DDD list size)
 *   - `--haxcms-language-picker-input-height` input height (default 40px)
 *   - `--haxcms-language-picker-border` input border shorthand (default
 *     `--ddd-border-sm`)
 *   - `--haxcms-language-picker-border-color` (default limestoneGray)
 *   - `--haxcms-language-picker-radius` (default `--ddd-radius-sm`)
 *   - `--haxcms-language-picker-label-size` visible label size (default
 *     `--ddd-font-size-4xs`)
 *
 * @element haxcms-language-picker
 */
class HAXCMSLanguagePicker extends I18NMixin(DDD) {
  static get tag() {
    return "haxcms-language-picker";
  }

  static get properties() {
    return {
      ...super.properties,
      label: { type: String },
      description: { type: String },
      value: { type: String, reflect: true },
      name: { type: String },
      placeholder: { type: String },
      disabled: { type: Boolean, reflect: true },
      required: { type: Boolean, reflect: true },
      /**
       * Hide the visible label while keeping it as the input's accessible
       * name, for hosts that render their own visible label
       */
      labelHidden: { type: Boolean, reflect: true, attribute: "label-hidden" },
      /**
       * Which regional variants (en-GB, pt-BR...) are listed:
       * "featured" (default), "all" or "none". Any value stays selectable.
       */
      includeRegions: { type: String, attribute: "include-regions" },
      /**
       * List the most common languages first instead of purely by name
       */
      popularFirst: { type: Boolean, attribute: "popular-first" },
      /**
       * Let a person use a well-formed code the registry does not list
       */
      allowCustom: { type: Boolean, attribute: "allow-custom" },
      /**
       * Optional override list. Items are { value, label } or plain strings.
       * When empty the registry is used.
       */
      options: { type: Array },
      /**
       * Optional registry object (parsed languages.json) instead of the
       * shared one, for tests and server rendering
       */
      registry: { type: Object },
      _open: { state: true },
      _query: { state: true },
      _typing: { state: true },
      _activeIndex: { state: true },
      _ready: { state: true },
      _loadFailed: { state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          position: relative;
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-limestoneLight)
          );
          font-family: var(--ddd-font-primary);
        }
        :host([hidden]) {
          display: none;
        }
        label {
          display: block;
          margin: 0 0 var(--ddd-spacing-2);
          font-family: var(--ddd-font-navigation);
          font-size: var(
            --haxcms-language-picker-label-size,
            var(--ddd-font-size-4xs)
          );
          font-weight: var(--ddd-font-weight-medium);
          letter-spacing: var(--ddd-ls-16-sm);
        }
        /* label-hidden: still the input's accessible name, just not shown */
        label.visually-hidden {
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
        .description,
        .status-text {
          margin: 0 0 var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-4xs);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneGray)
          );
        }
        .control {
          position: relative;
        }
        input {
          box-sizing: border-box;
          inline-size: 100%;
          min-block-size: var(--haxcms-language-picker-input-height, 40px);
          margin: 0;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-8)
            var(--ddd-spacing-2) var(--ddd-spacing-3);
          font: inherit;
          font-size: var(
            --haxcms-language-picker-font-size,
            var(--ddd-font-size-xs)
          );
          color: inherit;
          border: var(--haxcms-language-picker-border, var(--ddd-border-sm));
          border-color: var(
            --haxcms-language-picker-border-color,
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-theme-default-limestoneLight)
            )
          );
          border-radius: var(
            --haxcms-language-picker-radius,
            var(--ddd-radius-sm)
          );
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        input:hover {
          border-color: var(--ddd-theme-default-link);
        }
        input:focus-visible {
          outline: none;
          border-color: var(--ddd-theme-default-link);
          box-shadow: 0 0 0 2px
            color-mix(in srgb, var(--ddd-theme-default-link) 35%, transparent);
        }
        input:disabled {
          cursor: not-allowed;
          opacity: 0.65;
        }
        .chevron {
          position: absolute;
          inset-block: 0;
          inset-inline-end: var(--ddd-spacing-3);
          display: flex;
          align-items: center;
          pointer-events: none;
          font-size: var(--ddd-font-size-4xs);
        }
        ul {
          position: absolute;
          z-index: var(--haxcms-language-picker-z-index, 10);
          inset-inline: 0;
          margin: var(--ddd-spacing-1) 0 0;
          padding: var(--ddd-spacing-1) 0;
          list-style: none;
          max-block-size: var(--haxcms-language-picker-max-height, 18rem);
          overflow-y: auto;
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
          box-shadow: var(--ddd-boxShadow-md);
        }
        ul[hidden] {
          display: none;
        }
        li {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          justify-content: space-between;
          gap: var(--ddd-spacing-1) var(--ddd-spacing-3);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          cursor: pointer;
          font-size: var(--ddd-font-size-xs);
        }
        /* DDD list styles (ul li) set the option size; match that
           specificity so a host can override it */
        ul[role="listbox"] li {
          font-size: var(
            --haxcms-language-picker-option-font-size,
            var(--ddd-theme-body-font-size)
          );
        }
        li[aria-selected="true"] {
          font-weight: var(--ddd-font-weight-bold);
        }
        li.active {
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            color-mix(
              in srgb,
              var(--ddd-theme-default-coalyGray) 80%,
              var(--ddd-theme-default-black)
            )
          );
          box-shadow: inset 3px 0 0 var(--ddd-theme-default-link);
        }
        .native {
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-regular);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneGray)
          );
        }
        .empty {
          cursor: default;
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneGray)
          );
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
      language: "Language",
      searchPlaceholder: "Search languages",
      noResults: "No languages match",
      oneLanguageFound: "1 language found",
      languagesFound: "{count} languages found",
      useCustom: "Use {code}",
      loadError: "The language list could not be loaded.",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../locales/", import.meta.url).href,
    });
    this.i18nDefault("label", "language");
    this.i18nDefault("placeholder", "searchPlaceholder");
    this.description = "";
    this.value = "";
    this.name = "";
    this.disabled = false;
    this.required = false;
    this.labelHidden = false;
    this.includeRegions = "featured";
    this.popularFirst = false;
    this.allowCustom = false;
    this.options = [];
    this.registry = null;
    this._open = false;
    this._query = "";
    this._typing = false;
    this._activeIndex = -1;
    this._ready = false;
    this._loadFailed = false;
    this.__id = `haxcms-language-picker-${Math.random()
      .toString(36)
      .slice(2, 10)}`;
    this.__fullOptions = null;
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this._ensureRegistry();
  }

  _ensureRegistry() {
    if (this.registry || getLanguageRegistry()) {
      this._ready = true;
      return;
    }
    loadLanguageRegistry()
      .then(() => {
        this._ready = true;
        this._loadFailed = false;
      })
      .catch(() => {
        this._loadFailed = true;
      });
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    if (changedProperties.has("registry")) {
      this.__fullOptions = null;
      if (this.registry) {
        this._ready = true;
      }
    }
    if (changedProperties.has("value") || changedProperties.has("_ready")) {
      // legacy forms (zh_CN, iw, no) become the canonical code
      const code = this._normalize(this.value);
      if (code && code !== this.value) {
        this.value = code;
      }
    }
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("_activeIndex") && this._open) {
      const active = this.shadowRoot
        ? this.shadowRoot.querySelector("li.active")
        : null;
      if (active && active.scrollIntoView) {
        active.scrollIntoView({ block: "nearest" });
      }
    }
  }

  /**
   * Canonical code for a value (zh_CN -> zh-CN, iw -> he), the trimmed value
   * when it is a custom code, or "" when empty.
   */
  _normalize(value) {
    if (value === null || typeof value === "undefined") {
      return "";
    }
    const text = String(value).trim();
    if (!text) {
      return "";
    }
    return this._matchCode(text) || text;
  }

  /**
   * The registry code a text is exactly (or an alias of); null when it is not
   * in the registry or the registry is not available.
   */
  _matchCode(text) {
    if (!this._ready || !text) {
      return null;
    }
    try {
      return matchLanguageCode(text, this._registryArg());
    } catch {
      return null;
    }
  }

  _registryArg() {
    return this.registry || undefined;
  }

  /**
   * Every option, regions included, so a stored value like de-DE can show
   * its label even though the list does not offer it.
   */
  get _everyOption() {
    if (!this._ready) {
      return [];
    }
    if (!this.__fullOptions) {
      this.__fullOptions = getLanguageOptions({
        includeRegions: true,
        registry: this._registryArg(),
      });
    }
    return this.__fullOptions;
  }

  _normalizeCustomOption(option) {
    if (option === null || typeof option === "undefined") {
      return null;
    }
    const raw =
      typeof option === "object" ? option : { value: option, label: option };
    const value = String(raw.value || "").trim();
    if (!value) {
      return null;
    }
    const label = String(raw.label || value);
    return {
      value,
      label,
      code: value,
      name: label,
      nativeName: raw.nativeName || label,
      locale: raw.locale || value,
      dir: raw.dir === "rtl" ? "rtl" : "ltr",
      search: label.toLowerCase() + " " + value.toLowerCase(),
    };
  }

  /**
   * The options the list offers (before any search)
   */
  get _listedOptions() {
    if (Array.isArray(this.options) && this.options.length > 0) {
      return this.options
        .map((option) => this._normalizeCustomOption(option))
        .filter((option) => !!option);
    }
    if (!this._ready) {
      return [];
    }
    const regions =
      this.includeRegions === "all"
        ? true
        : this.includeRegions === "none"
          ? false
          : "featured";
    return getLanguageOptions({
      includeRegions: regions,
      popularFirst: this.popularFirst,
      registry: this._registryArg(),
    });
  }

  /**
   * The option for the current value, even when the list does not offer it
   */
  get _selectedOption() {
    const value = this._normalize(this.value);
    if (!value) {
      return null;
    }
    const listed = this._listedOptions.find((o) => o.value === value);
    if (listed) {
      return listed;
    }
    const known = this._everyOption.find((o) => o.value === value);
    if (known) {
      return known;
    }
    return {
      value,
      label: value,
      code: value,
      name: value,
      nativeName: value,
      locale: value,
      dir: "ltr",
      custom: true,
    };
  }

  _looksLikeLanguageCode(text) {
    return /^[a-z]{2,3}(-[a-z0-9]{2,8}){0,2}$/i.test(String(text).trim());
  }

  /**
   * What is shown in the list right now: the search results, plus a
   * "use this code" entry when custom codes are allowed.
   */
  get _visibleOptions() {
    const listed = this._listedOptions;
    const query = this._typing ? this._query.trim() : "";
    if (!query) {
      return listed;
    }
    const found = searchLanguageOptions(query, listed);
    if (
      this.allowCustom &&
      this._looksLikeLanguageCode(query) &&
      !this._matchCode(query)
    ) {
      const code = query.trim();
      found.push({
        value: code,
        label: this.t.useCustom.replace("{code}", code),
        code: code,
        name: code,
        nativeName: code,
        locale: code,
        dir: "ltr",
        custom: true,
      });
    }
    return found;
  }

  get _inputText() {
    if (this._typing) {
      return this._query;
    }
    const selected = this._selectedOption;
    return selected ? selected.label : "";
  }

  get _statusMessage() {
    if (!this._open || !this._ready) {
      return "";
    }
    const count = this._visibleOptions.length;
    if (count === 0) {
      return this.t.noResults;
    }
    return count === 1
      ? this.t.oneLanguageFound
      : this.t.languagesFound.replace("{count}", count);
  }

  _openList() {
    if (this.disabled || this._open) {
      return;
    }
    this._open = true;
    this._typing = false;
    this._query = "";
    const selected = this._normalize(this.value);
    const index = this._visibleOptions.findIndex((o) => o.value === selected);
    this._activeIndex = index;
  }

  _closeList() {
    this._open = false;
    this._typing = false;
    this._query = "";
    this._activeIndex = -1;
  }

  _select(option) {
    if (!option || this.disabled) {
      return;
    }
    this.value = option.value;
    this._closeList();
    this._fireValueChanged(option);
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

  _onInput(e) {
    this._query = e.target.value;
    this._typing = true;
    this._open = true;
    const options = this._visibleOptions;
    this._activeIndex = options.length > 0 ? 0 : -1;
  }

  _onFocus(e) {
    this._openList();
    this._selectText(e);
  }

  _onClick(e) {
    if (!this._open) {
      this._openList();
    }
    // the click that follows focus collapses the selection, so select again
    this._selectText(e);
  }

  /**
   * With a language already chosen the box shows its label. Select it so the
   * first keystroke replaces it instead of being added to it.
   */
  _selectText(e) {
    if (!this._typing && e && e.target && e.target.select) {
      e.target.select();
    }
  }

  _onBlur() {
    // option selection uses mousedown + preventDefault, so a blur here is a
    // real focus change
    this._closeList();
  }

  _onKeydown(e) {
    const options = this._visibleOptions;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!this._open) {
          this._openList();
          if (this._activeIndex < 0 && options.length > 0) {
            this._activeIndex = 0;
          }
        } else if (options.length > 0) {
          this._activeIndex = (this._activeIndex + 1) % options.length;
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!this._open) {
          this._openList();
        } else if (options.length > 0) {
          this._activeIndex =
            this._activeIndex <= 0 ? options.length - 1 : this._activeIndex - 1;
        }
        break;
      case "Home":
        if (this._open && options.length > 0) {
          e.preventDefault();
          this._activeIndex = 0;
        }
        break;
      case "End":
        if (this._open && options.length > 0) {
          e.preventDefault();
          this._activeIndex = options.length - 1;
        }
        break;
      case "Enter":
        if (
          this._open &&
          this._activeIndex >= 0 &&
          options[this._activeIndex]
        ) {
          e.preventDefault();
          this._select(options[this._activeIndex]);
        }
        break;
      case "Escape":
        if (this._open) {
          e.preventDefault();
          this._closeList();
        }
        break;
      default:
        break;
    }
  }

  _renderOption(option, index) {
    const selected = option.value === this._normalize(this.value);
    const showNative =
      option.nativeName && option.nativeName !== option.name && !option.custom;
    return html`
      <li
        id="${this.__id}-option-${index}"
        role="option"
        class="${index === this._activeIndex ? "active" : ""}"
        aria-selected="${selected ? "true" : "false"}"
        @mousedown="${(e) => {
          e.preventDefault();
          this._select(option);
        }}"
        @mousemove="${() => {
          if (this._activeIndex !== index) {
            this._activeIndex = index;
          }
        }}"
      >
        <span>${option.label}</span>
        ${showNative
          ? html`<span
              class="native"
              lang="${option.locale}"
              dir="${option.dir}"
              >${option.nativeName}</span
            >`
          : ""}
      </li>
    `;
  }

  render() {
    const options = this._visibleOptions;
    const listId = `${this.__id}-list`;
    const describedBy = this.description ? `${this.__id}-description` : "";
    const activeId =
      this._open && this._activeIndex >= 0 && options[this._activeIndex]
        ? `${this.__id}-option-${this._activeIndex}`
        : "";
    return html`
      <label
        for="${this.__id}-input"
        class="${this.labelHidden ? "visually-hidden" : ""}"
        ?hidden="${!this.label}"
        >${this.label}</label
      >
      <p
        id="${this.__id}-description"
        class="description"
        ?hidden="${!this.description}"
      >
        ${this.description}
      </p>
      <div class="control">
        <input
          id="${this.__id}-input"
          type="text"
          role="combobox"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          aria-autocomplete="list"
          aria-expanded="${this._open ? "true" : "false"}"
          aria-controls="${listId}"
          aria-activedescendant="${activeId}"
          aria-describedby="${describedBy}"
          aria-required="${this.required ? "true" : "false"}"
          name="${this.name}"
          placeholder="${this.placeholder || ""}"
          .value="${this._inputText}"
          ?disabled="${this.disabled}"
          @input="${this._onInput}"
          @focus="${this._onFocus}"
          @click="${this._onClick}"
          @blur="${this._onBlur}"
          @keydown="${this._onKeydown}"
        />
        <span class="chevron" aria-hidden="true"
          >${this._open ? "▲" : "▼"}</span
        >
        <ul
          id="${listId}"
          role="listbox"
          aria-label="${this.label || this.t.language}"
          ?hidden="${!this._open}"
        >
          ${options.map((option, index) => this._renderOption(option, index))}
          ${options.length === 0 && this._ready
            ? html`<li class="empty" role="presentation">
                ${this.t.noResults}
              </li>`
            : ""}
        </ul>
      </div>
      <p class="status-text" ?hidden="${!this._loadFailed}">
        ${this.t.loadError}
      </p>
      <div class="sr-only" role="status" aria-live="polite">
        ${this._statusMessage}
      </div>
    `;
  }
}

globalThis.customElements.define(
  HAXCMSLanguagePicker.tag,
  HAXCMSLanguagePicker,
);
export { HAXCMSLanguagePicker };
