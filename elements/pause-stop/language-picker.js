/**
 * Copyright 2026 andyid23
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";

/**
 * `language-picker`
 * Language switcher for HAX (and any) pages that localize with i18n-manager.
 *
 * It does not translate anything itself. It changes the *document* language,
 * which is the switch every other layer already listens to:
 *
 *   - `i18n-manager` observes `<html lang>`/`<body lang>` (MutationObserver) and
 *     re-fetches `locales/<namespace>.<lang>.json` for every registered element,
 *   - `setupSiteLanguage()` in a HAXcms site reads the stored choice at boot,
 *   - the browser uses it for hyphenation, spellcheck, fonts and screen readers,
 *   - `dir` flips to `rtl` for right-to-left scripts.
 *
 * The choice is stored in localStorage (same key the site boot code reads), so a
 * returning visitor keeps their language after a reload or navigation.
 *
 * No `@lit/localize` is involved: lit-localize compiles `msg()` strings into
 * per-locale bundles at build time, which HAX components served from a CDN do
 * not have. i18n-manager JSON locales are the runtime equivalent.
 *
 * Set `reload` to also reload the page after switching — useful when the site
 * chrome (menu, footer) is rendered from the server-side `settings.lang`.
 * Reload is off by default, and it is skipped inside the HAX editor so an
 * unsaved page is never lost.
 *
 * @demo index.html
 * @element language-picker
 */
export const SITE_LANGUAGE_STORAGE_KEY = "hax-site-lang";

/**
 * Locales shipped with `langkah-bertahap` (`locales/langkah-bertahap.<code>.json`).
 * Names are written in their own language, which is what users expect in a
 * language picker; the codes are BCP 47 base tags.
 */
export const SUPPORTED_LANGUAGES = [
  { code: "id", name: "Bahasa Indonesia" },
  { code: "en", name: "English" },
  { code: "ar", name: "العربية" },
  { code: "bn", name: "বাংলা" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "hi", name: "हिन्दी" },
  { code: "ja", name: "日本語" },
  { code: "pt", name: "Português" },
  { code: "ru", name: "Русский" },
  { code: "zh", name: "中文" },
];

const RTL_LANGUAGES = /^(ar|arc|ckb|dv|fa|he|khw|ks|ps|sd|ug|ur|yi)(-|$)/i;

/**
 * Reduce a regional tag to its base language: `en-US` -> `en`, `pt_BR` -> `pt`.
 * i18n-manager looks for `langkah-bertahap.<base>.json`, and the element
 * announces its base language for the same reason.
 */
export const normalizeLanguage = (lang = "") =>
  String(lang).trim().replace(/_/g, "-").split("-")[0].toLowerCase();

export const isRtlLanguage = (lang = "") => RTL_LANGUAGES.test(lang);

/**
 * Same precedence i18n-manager uses: body before document element, then the
 * browser. `<html lang>` is the value HAXcms boot code (and this element) write.
 */
export const documentLanguage = () => {
  const doc = globalThis.document;
  const fromBody = doc && doc.body && doc.body.getAttribute("lang");
  const fromHtml =
    doc && doc.documentElement && doc.documentElement.getAttribute("lang");
  const fromBrowser = globalThis.navigator && globalThis.navigator.language;
  return normalizeLanguage(fromBody || fromHtml || fromBrowser || "en");
};

/**
 * Accept `["id", "en"]`, `[{ "code": "id", "name": "Bahasa Indonesia" }]`, or a
 * JSON / comma separated string (that is what a HAX setting hands over).
 */
const normalizeLanguageList = (list) => {
  const entries = Array.isArray(list)
    ? list
    : typeof list === "string" && list
      ? list.split(",")
      : [];
  const parsed = entries
    .map((entry) => {
      if (typeof entry === "string") {
        const code = normalizeLanguage(entry);
        const known = SUPPORTED_LANGUAGES.find((item) => item.code === code);
        return known
          ? { ...known }
          : code
            ? { code, name: entry.trim() }
            : null;
      }
      if (entry && entry.code) {
        return {
          code: normalizeLanguage(entry.code),
          name: entry.name || entry.code,
        };
      }
      return null;
    })
    .filter(Boolean);
  return parsed.length ? parsed : SUPPORTED_LANGUAGES;
};

const languagesConverter = {
  fromAttribute(value) {
    if (!value) {
      return SUPPORTED_LANGUAGES;
    }
    try {
      return normalizeLanguageList(JSON.parse(value));
    } catch {
      return normalizeLanguageList(value);
    }
  },
  toAttribute(value) {
    return Array.isArray(value) ? JSON.stringify(value) : null;
  },
};

export class LanguagePicker extends LitElement {
  static get tag() {
    return "language-picker";
  }

  static get properties() {
    return {
      /** Currently selected base language code (`id`, `en`, `ar`, ...). */
      value: { type: String },
      /** Visible + accessible label text. */
      label: { type: String },
      /** Hide the visual label but keep it for assistive technology. */
      hideLabel: { type: Boolean, attribute: "hide-label", reflect: true },
      /** Languages to offer; `[{ code, name }]` or a JSON/comma string. */
      languages: { type: Array, converter: languagesConverter },
      /** Remember the choice for the next visit. */
      persist: { type: Boolean, reflect: true },
      /** localStorage key shared with the site boot code. */
      storageKey: { type: String, attribute: "storage-key" },
      /** Reload after switching so server-rendered chrome follows. */
      reload: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this.value = "";
    this.label = "Language";
    this.hideLabel = false;
    this.languages = SUPPORTED_LANGUAGES;
    this.persist = true;
    this.storageKey = SITE_LANGUAGE_STORAGE_KEY;
    this.reload = false;
    this._handleWindowLanguage = this._handleWindowLanguage.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.value) {
      this.value = documentLanguage();
    }
    // another picker (or the site boot) may switch the document language after
    // this one rendered; keep every picker showing the same value
    globalThis.addEventListener("languagechange", this._handleWindowLanguage);
  }

  disconnectedCallback() {
    globalThis.removeEventListener(
      "languagechange",
      this._handleWindowLanguage,
    );
    super.disconnectedCallback();
  }

  /**
   * The browser fires `languagechange` without detail when the OS language
   * changes; i18n-manager and this element use `detail` for the requested code,
   * so anything without detail is ignored on purpose.
   */
  _handleWindowLanguage(e) {
    const detail = e && e.detail;
    const next = normalizeLanguage(
      typeof detail === "string" ? detail : (detail && detail.lang) || "",
    );
    if (next && next !== this.value) {
      this.value = next;
    }
  }

  _handleChange(e) {
    const lang = normalizeLanguage(e.target.value);
    if (!lang) {
      return;
    }
    this.value = lang;
    this._remember(lang);
    this._apply(lang);
    /**
     * Bubbling notification for the host page (HAXcms chrome, analytics,
     * "remember this" calls). Composed so it escapes shadow roots.
     */
    this.dispatchEvent(
      new CustomEvent("site-language-change", {
        detail: { lang },
        bubbles: true,
        composed: true,
      }),
    );
    /**
     * Reload opt-in so server-rendered chrome (menu, footer) follows the new
     * language. Skipped inside the HAX editor (`HaxStore` only exists there) so
     * switching language never throws away an unsaved page.
     */
    if (
      this.reload &&
      !globalThis.HaxStore &&
      globalThis.location &&
      globalThis.location.reload
    ) {
      globalThis.location.reload();
    }
  }

  _remember(lang) {
    if (!this.persist) {
      return;
    }
    try {
      globalThis.localStorage.setItem(this.storageKey, lang);
    } catch {
      // private mode / storage disabled: switching still works for this view
    }
  }

  _apply(lang) {
    const root = globalThis.document && globalThis.document.documentElement;
    if (root) {
      // assigning the same value still notifies the observer, so skip no-ops
      if (root.getAttribute("lang") !== lang) {
        root.setAttribute("lang", lang);
      }
      const dir = isRtlLanguage(lang) ? "rtl" : "ltr";
      if (root.getAttribute("dir") !== dir) {
        root.setAttribute("dir", dir);
      }
    }
    /**
     * i18n-manager listens for this on window (`changeLanguageEvent`) and
     * updates every registered element, including a regional fallback such as
     * `en-US` -> `en`. The MutationObserver above covers the rest.
     */
    globalThis.dispatchEvent(
      new CustomEvent("languagechange", { detail: lang }),
    );
  }

  render() {
    const label = this.label || "Language";
    return html`
      <label class="field">
        <span class="label-text ${this.hideLabel ? "sr-only" : ""}"
          >${label}</span
        >
        <select
          class="select"
          aria-label=${label}
          @change=${this._handleChange}
        >
          ${normalizeLanguageList(this.languages).map(
            (language) => html`
              <option
                value=${language.code}
                .selected=${language.code === this.value}
              >
                ${language.name}
              </option>
            `,
          )}
        </select>
      </label>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
        max-width: 100%;
      }
      .field {
        display: inline-flex;
        align-items: center;
        gap: var(--ddd-spacing-2, 8px);
        font-size: var(--ddd-font-size-s, 0.95rem);
        color: var(--ddd-theme-default-coalyGray, #1e293b);
      }
      .select {
        box-sizing: border-box;
        min-height: 44px;
        min-width: 11rem;
        max-width: 100%;
        padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-3, 12px);
        border: var(--ddd-border-sm, 2px solid #1e293b);
        border-radius: var(--ddd-radius-sm, 4px);
        background-color: var(--ddd-theme-default-white, #fff);
        color: inherit;
        font: inherit;
      }
      .select:focus-visible {
        outline: var(--ddd-border-md, 3px solid #005fa9);
        outline-offset: 2px;
      }
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: var(--ddd-spacing-0, 0);
        margin: -1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
        border: 0;
      }
    `;
  }

  /**
   * HAX editor schema. Kept inline (not a JSON file) because the element is a
   * small utility with no slots and only a handful of settings.
   */
  static get haxProperties() {
    return {
      api: "1",
      canScale: false,
      canPosition: true,
      canEditSource: false,
      designSystem: {
        accent: true,
        primary: true,
        card: false,
        text: true,
        designTreatment: false,
      },
      gizmo: {
        title: "Pemilih Bahasa",
        description:
          "Pilihan bahasa antarmuka. Mengganti bahasa dokumen sehingga i18n-manager memuat locale komponen yang sesuai dan arah tulisan (LTR/RTL) ikut menyesuaikan.",
        icon: "translate",
        color: "blue",
        tags: ["Localization", "Language", "Navigation", "Accessibility"],
        handles: [],
        meta: {
          author: "andyid23",
        },
      },
      settings: {
        configure: [
          {
            property: "label",
            title: "Label",
            description: "Teks label yang terlihat dan dibaca pembaca layar",
            inputMethod: "textfield",
            icon: "editor:title",
          },
          {
            property: "persist",
            title: "Ingat Pilihan",
            description:
              "Simpan bahasa pilihan pengunjung di perangkat ini agar dipakai lagi saat kembali",
            inputMethod: "boolean",
            icon: "bookmark:bookmark-border",
          },
        ],
        advanced: [
          {
            property: "reload",
            title: "Muat Ulang Halaman",
            description:
              "Muat ulang setelah berganti bahasa supaya menu dan footer yang dirender server ikut berubah (tidak berlaku di editor)",
            inputMethod: "boolean",
            icon: "av:refresh",
          },
          {
            property: "hideLabel",
            title: "Sembunyikan Label Visual",
            description:
              "Label tetap tersedia untuk pembaca layar, hanya tidak ditampilkan",
            inputMethod: "boolean",
            icon: "visibility:visibility-off",
          },
          {
            property: "languages",
            title: "Daftar Bahasa (JSON)",
            description:
              'Daftar kode bahasa atau objek {"code","name"}. Kosongkan untuk memakai daftar bawaan.',
            inputMethod: "textfield",
            icon: "editor:code",
          },
        ],
      },
      saveOptions: {
        wipeSlot: true,
        unsetAttributes: ["value", "dir"],
      },
      demoSchema: [
        {
          tag: "language-picker",
          properties: {
            label: "Bahasa",
          },
          content: "",
        },
      ],
    };
  }
}

globalThis.customElements.define(LanguagePicker.tag, LanguagePicker);
