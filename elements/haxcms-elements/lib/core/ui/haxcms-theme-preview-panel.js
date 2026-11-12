/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { resolveThemeThumbnail } from "../utils/haxcms-admin-helpers.js";
import { HaxcmsAdminSectionMixin } from "../admin/HaxcmsAdminSectionMixin.js";
import { html, css } from "lit";
import { toJS } from "mobx";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { store } from "../haxcms-site-store.js";
import { waitForHAXCMSSiteApiRegistryReady } from "../utils/haxcms-site-api-registry.js";
import "../haxcms-theme-picker.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminPrimitives,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";
import { HaxUiAdminControls } from "@haxtheweb/d-d-d/lib/HaxUiAdminControls.js";
import "@haxtheweb/d-d-d/lib/hax-palette-picker.js";

class HAXCMSThemePreviewPanel extends HaxcmsAdminSectionMixin(I18NMixin(DDD)) {
  static get tag() {
    return "haxcms-theme-preview-panel";
  }

  static get properties() {
    return {
      ...super.properties,
      open: { type: Boolean, reflect: true },
      activeTheme: { type: String, attribute: "active-theme" },
      activePalette: { type: String, attribute: "active-palette" },
      selectedTheme: { type: String, attribute: "selected-theme" },
      selectedPalette: { type: String, attribute: "selected-palette" },
      themeOptions: { type: Array, attribute: false },
      loadingThemes: {
        type: Boolean,
        attribute: "loading-themes",
        reflect: true,
      },
      showAllThemes: { type: Boolean, attribute: "show-all-themes" },
      collapsed: { type: Boolean, reflect: true },
      _themesRegistry: { type: Object, attribute: false },
    };
  }

  constructor() {
    super();
    this.open = false;
    this.activeTheme = "";
    this.activePalette = "";
    this.selectedTheme = "";
    this.selectedPalette = "";
    this.themeOptions = [];
    this.loadingThemes = false;
    this.showAllThemes = false;
    this.collapsed = false;
    this._themesRegistry = {};
    this.__snapshotThemeData = null;
    this.__windowKeyHandler = this._windowKeydown.bind(this);
    this.t = this.t || {};
    this.t = {
      ...this.t,
      showThemePreview: "Show Theme Preview",
      hideThemePreview: "Hide Theme Preview",
      themePreviewPanel: "Theme Preview Panel",
      themePreview: "Theme Preview",
      themePreviewDescription:
        "Try a theme and palette temporarily while you browse. Use Cancel to restore your original appearance.",
      loadingThemes: "Loading themes...",
      theme: "Theme",
      palette: "Palette",
      cancel: "Cancel",
      openAppearanceSettings: "Open Appearance Settings",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../locales/", import.meta.url).href,
    });
  }

  connectedCallback() {
    super.connectedCallback();
    globalThis.addEventListener("keydown", this.__windowKeyHandler);
    this._captureSessionSnapshot();
    this._hydrateSelectionFromManifest();
    this._loadThemeRegistry();
  }

  disconnectedCallback() {
    this._restoreSnapshot();
    globalThis.removeEventListener("keydown", this.__windowKeyHandler);
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("collapsed")) {
      this.dispatchEvent(
        new CustomEvent("haxcms-theme-preview-collapsed-changed", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            value: this.collapsed,
          },
        }),
      );
    }
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.setAttribute("tabindex", "-1");
    this.focus();
  }

  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminTokens,
      ...HaxUiAdminPrimitives,
      ...HaxUiAdminControls,
      css`
        /* a HAX UI side panel over the page: surface, strong line, a
           detail-panel header, two picker groups and an action bar */
        :host {
          position: fixed;
          top: var(--top-bar-height, 64px);
          right: 0;
          bottom: 0;
          width: var(--haxcms-theme-preview-width, 420px);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          z-index: 9998;
          color-scheme: var(--hax-ui-color-scheme, inherit);
          border-left: 1px solid var(--hax-ui-line-strong);
          background-color: var(--hax-ui-surface);
          color: var(--hax-ui-text);
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          box-shadow: var(--hax-ui-shadow-popover);
          overflow: hidden;
          outline: none;
        }
        :host([collapsed]) {
          width: auto;
          bottom: auto;
          border-left: 0;
          box-shadow: none;
          background: transparent;
          overflow: visible;
        }
        :host(:focus-visible) {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: calc(-1 * var(--hax-ui-focus-width));
        }
        .panel-toggle {
          margin: var(--hax-ui-gap-md);
          align-self: stretch;
        }
        :host([collapsed]) .panel-toggle {
          align-self: auto;
          box-shadow: var(--hax-ui-shadow-popover);
        }
        .shell {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
        }
        :host([collapsed]) .shell {
          display: none;
        }
        .header {
          padding: var(--hax-ui-gap-md) var(--ddd-spacing-4, 16px)
            var(--hax-ui-gap-lg);
          border-bottom: 1px solid var(--hax-ui-line);
        }
        .title {
          margin: 0;
          font-size: 18px;
          font-weight: var(--ddd-font-weight-bold, 700);
          line-height: 1.2;
        }
        .description {
          margin: var(--hax-ui-gap) 0 0;
          font-size: var(--hax-ui-admin-font-size-xs);
          line-height: 1.4;
          color: var(--hax-ui-text-muted);
        }
        .content {
          flex: 1;
          min-height: 0;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: var(--hax-ui-gap-lg);
          padding: var(--hax-ui-gap-lg);
          overflow: hidden;
        }
        .picker-column {
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius-lg);
          padding: var(--hax-ui-gap-md);
          background-color: var(--hax-ui-surface);
        }
        .picker-heading {
          margin: 0 0 var(--hax-ui-gap-md);
          font-size: 11px;
          font-weight: var(--ddd-font-weight-bold, 700);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--hax-ui-text-muted);
        }
        .theme-picker {
          --haxcms-theme-picker-min-card-width: 120px;
          --haxcms-theme-picker-mini-preview-height: 64px;
        }
        .actions {
          display: flex;
          gap: var(--hax-ui-gap-md);
          justify-content: flex-end;
          align-items: center;
          min-height: var(--hax-ui-action-bar-height);
          padding: var(--hax-ui-gap-md) var(--ddd-spacing-4, 16px)
            calc(var(--hax-ui-gap-md) + env(safe-area-inset-bottom, 0px));
          border-top: 1px solid var(--hax-ui-line);
          background-color: var(--hax-ui-surface);
        }
        @media screen and (max-width: 1100px) {
          :host {
            width: min(92vw, var(--haxcms-theme-preview-width, 420px));
          }
          .content {
            grid-template-columns: 1fr;
            gap: var(--hax-ui-gap-md);
            padding: var(--hax-ui-gap-md);
          }
          .theme-picker {
            --haxcms-theme-picker-min-card-width: 96px;
            --haxcms-theme-picker-mini-preview-height: 52px;
          }
          .actions {
            flex-wrap: wrap;
          }
          .actions .hax-ui-btn {
            flex: 1 1 100%;
          }
        }
      `,
    ];
  }

  _windowKeydown(e) {
    if (!e || e.defaultPrevented) {
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      this._cancelPreview();
    }
  }

  _captureSessionSnapshot() {
    const manifest = toJS(store.manifest);
    if (
      manifest &&
      manifest.metadata &&
      manifest.metadata.theme &&
      typeof manifest.metadata.theme === "object"
    ) {
      this.__snapshotThemeData = this._cloneData(manifest.metadata.theme);
      this.activeTheme = this.__snapshotThemeData.element
        ? `${this.__snapshotThemeData.element}`
        : "";
      if (
        this.__snapshotThemeData.variables &&
        typeof this.__snapshotThemeData.variables === "object" &&
        typeof this.__snapshotThemeData.variables.palette !== "undefined" &&
        this.__snapshotThemeData.variables.palette !== null
      ) {
        this.activePalette =
          `${this.__snapshotThemeData.variables.palette}`.trim();
      } else if (
        store.themeElement &&
        typeof store.themeElement.dataPalette !== typeof undefined &&
        store.themeElement.dataPalette !== null
      ) {
        this.activePalette = `${store.themeElement.dataPalette}`.trim();
      } else {
        this.activePalette = "";
      }
      return;
    }
    this.__snapshotThemeData = null;
    this.activeTheme = "";
    this.activePalette = "";
  }

  _hydrateSelectionFromManifest() {
    const manifest = toJS(store.manifest);
    let activeTheme = "";
    let activePalette = "";
    if (
      manifest &&
      manifest.metadata &&
      manifest.metadata.theme &&
      typeof manifest.metadata.theme === "object"
    ) {
      if (manifest.metadata.theme.element) {
        activeTheme = `${manifest.metadata.theme.element}`;
      }
      if (
        manifest.metadata.theme.variables &&
        typeof manifest.metadata.theme.variables === "object" &&
        typeof manifest.metadata.theme.variables.palette !== "undefined" &&
        manifest.metadata.theme.variables.palette !== null
      ) {
        activePalette = `${manifest.metadata.theme.variables.palette}`.trim();
      } else if (
        store.themeElement &&
        typeof store.themeElement.dataPalette !== typeof undefined &&
        store.themeElement.dataPalette !== null
      ) {
        activePalette = `${store.themeElement.dataPalette}`.trim();
      }
    }
    this.selectedTheme = activeTheme;
    this.selectedPalette = activePalette;
    if (!this.selectedTheme && this.activeTheme) {
      this.selectedTheme = this.activeTheme;
    }
    if (!this.selectedPalette && this.activePalette) {
      this.selectedPalette = this.activePalette;
    }
  }

  _normalizeThemeMapEntry(incoming = {}, key = "") {
    if (!incoming || typeof incoming !== "object") {
      return {
        element: key,
        name: key,
      };
    }
    const normalized = this._cloneData(incoming);
    if (!normalized.element) {
      normalized.element = key;
    }
    if (!normalized.name) {
      normalized.name = key;
    }
    return normalized;
  }

  _getSupportedPalettesForTheme(themeKey) {
    if (!themeKey) {
      return null;
    }
    // prefer backend registry if available
    const theme = this._themesRegistry && this._themesRegistry[themeKey];
    if (
      theme &&
      Array.isArray(theme.supportedPalettes) &&
      theme.supportedPalettes.length > 0
    ) {
      return theme.supportedPalettes;
    }
    // fallback: read from the custom element class if already defined
    const ElClass = globalThis.customElements.get(themeKey);
    if (ElClass && ElClass.supportedPalettes) {
      const palettes = ElClass.supportedPalettes;
      if (Array.isArray(palettes) && palettes.length > 0) {
        return palettes;
      }
    }
    return null;
  }

  _buildThemeOptions() {
    const options = Object.keys(this._themesRegistry).map((key) => {
      const theme = this._normalizeThemeMapEntry(
        this._themesRegistry[key],
        key,
      );
      const rawPriority =
        typeof theme.priority === "number"
          ? theme.priority
          : Number(theme.priority);
      const priority = Number.isFinite(rawPriority) ? rawPriority : 0;
      return {
        key: key,
        value: key,
        label: theme.name || key,
        name: theme.name || key,
        thumbnail: resolveThemeThumbnail(
          theme.thumbnail || "",
          import.meta.url,
        ),
        hidden: theme.hidden ? true : false,
        terrible: theme.terrible ? true : key.indexOf("terrible") === 0,
        legacy:
          theme.legacy || theme.deprecated || theme.isLegacy ? true : false,
        priority: priority,
      };
    });
    options.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return a.label.localeCompare(b.label);
    });
    if (
      this.selectedTheme &&
      !options.find((option) => option.value === this.selectedTheme)
    ) {
      options.unshift({
        key: this.selectedTheme,
        value: this.selectedTheme,
        label: this.selectedTheme,
        name: this.selectedTheme,
        thumbnail: "",
        hidden: false,
        terrible: false,
        legacy: false,
        priority: -1000,
      });
    }
    this.themeOptions = options;
  }

  _mergeThemeRegistry() {
    const merged = {};
    if (this._themesRegistry && typeof this._themesRegistry === "object") {
      Object.keys(this._themesRegistry).forEach((key) => {
        merged[key] = this._normalizeThemeMapEntry(
          this._themesRegistry[key],
          key,
        );
      });
    }
    this._themesRegistry = merged;
  }

  async _loadThemeRegistry() {
    this.loadingThemes = true;
    this._themesRegistry = {};
    try {
      await waitForHAXCMSSiteApiRegistryReady();
      if (
        MicroFrontendRegistry &&
        typeof MicroFrontendRegistry.call === "function" &&
        typeof MicroFrontendRegistry.has === "function" &&
        MicroFrontendRegistry.has("@site/listThemes")
      ) {
        const response = await MicroFrontendRegistry.call(
          "@site/listThemes",
          {
            "page.limit": "500",
            includeDisabled: "true",
          },
          null,
          null,
        );
        let status = 0;
        if (response && typeof response.status === "number") {
          status = response.status;
        } else if (response && typeof response.status === "string") {
          const parsed = parseInt(response.status, 10);
          status = Number.isNaN(parsed) ? 0 : parsed;
        }
        if (status === 0 || status === 200) {
          const payload =
            response && response.data && typeof response.data === "object"
              ? response.data
              : {};
          const themes =
            payload && Array.isArray(payload.themes) ? payload.themes : [];
          if (themes.length > 0) {
            const registry = {};
            themes.forEach((theme) => {
              if (!theme || typeof theme !== "object") {
                return;
              }
              const machineName =
                typeof theme.machineName === "string"
                  ? theme.machineName.trim()
                  : "";
              const element =
                typeof theme.element === "string" ? theme.element.trim() : "";
              const key = element || machineName;
              if (!key) {
                return;
              }
              registry[key] = {
                ...theme,
                element: key,
                machineName: machineName || key,
                thumbnail: theme.screenshot || theme.thumbnail || "",
              };
            });
            this._themesRegistry = registry;
          }
        }
      }
    } catch {
      // intentionally empty
    }
    this._mergeThemeRegistry();
    this._buildThemeOptions();
    this.loadingThemes = false;
    this._applyPreviewToManifest();
  }

  _themeFromRegistry(themeKey = "") {
    if (!themeKey || !this._themesRegistry[themeKey]) {
      return null;
    }
    return this._cloneData(this._themesRegistry[themeKey]);
  }

  _applyPreviewToManifest() {
    if (!store.manifest || !store.manifest.metadata) {
      return;
    }
    if (!store.manifest.metadata.theme) {
      store.manifest.metadata.theme = {};
    }
    const currentTheme =
      store.manifest.metadata.theme &&
      typeof store.manifest.metadata.theme === "object"
        ? this._cloneData(store.manifest.metadata.theme)
        : {};
    const registryTheme =
      this.selectedTheme && this._themeFromRegistry(this.selectedTheme)
        ? this._themeFromRegistry(this.selectedTheme)
        : {};
    const variables = {
      ...(registryTheme.variables && typeof registryTheme.variables === "object"
        ? registryTheme.variables
        : {}),
      ...(currentTheme.variables && typeof currentTheme.variables === "object"
        ? currentTheme.variables
        : {}),
    };
    if (this.selectedPalette !== "") {
      variables.palette = this.selectedPalette;
    } else {
      delete variables.palette;
    }
    const regions =
      currentTheme.regions && typeof currentTheme.regions === "object"
        ? this._cloneData(currentTheme.regions)
        : registryTheme.regions && typeof registryTheme.regions === "object"
          ? this._cloneData(registryTheme.regions)
          : {};
    const previewTheme = {
      ...currentTheme,
      ...registryTheme,
      variables: variables,
      regions: regions,
    };
    if (this.selectedTheme) {
      previewTheme.element = this.selectedTheme;
    }
    store.manifest.metadata.theme = previewTheme;
  }

  _restoreSnapshot() {
    if (!store.manifest || !store.manifest.metadata) {
      return;
    }
    if (
      this.__snapshotThemeData &&
      typeof this.__snapshotThemeData === "object"
    ) {
      store.manifest.metadata.theme = this._cloneData(this.__snapshotThemeData);
    }
  }

  _themeValueChanged(e) {
    if (!e || !e.detail) {
      return;
    }
    const value =
      typeof e.detail.value === "undefined" || e.detail.value === null
        ? ""
        : `${e.detail.value}`.trim();
    if (!value || value === this.selectedTheme) {
      return;
    }
    this.selectedTheme = value;
    this._applyPreviewToManifest();
  }

  _paletteValueChanged(e) {
    if (!e || !e.detail) {
      return;
    }
    const value =
      typeof e.detail.value === "undefined" || e.detail.value === null
        ? ""
        : `${e.detail.value}`.trim();
    if (value === this.selectedPalette) {
      return;
    }
    this.selectedPalette = value;
    this._applyPreviewToManifest();
  }

  _cancelPreview() {
    this._restoreSnapshot();
    this.dispatchEvent(
      new CustomEvent("haxcms-theme-preview-cancel", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          restored: true,
        },
      }),
    );
  }

  _toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }

  _openAdminTheme() {
    this.dispatchEvent(
      new CustomEvent("haxcms-theme-preview-open-admin", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          theme: this.selectedTheme,
          palette: this.selectedPalette,
        },
      }),
    );
  }

  render() {
    return html`
      <button
        class="hax-ui-btn panel-toggle"
        type="button"
        @click=${this._toggleCollapsed}
        aria-expanded="${this.collapsed ? "false" : "true"}"
      >
        ${this.collapsed ? this.t.showThemePreview : this.t.hideThemePreview}
      </button>
      <section class="shell" aria-label="${this.t.themePreviewPanel}">
        <header class="header">
          <h2 class="title">${this.t.themePreview}</h2>
          <p class="description">${this.t.themePreviewDescription}</p>
        </header>
        <div class="content">
          <div class="picker-column">
            ${
              this.loadingThemes
                ? html`<p class="hax-ui-note status">
                    ${this.t.loadingThemes}
                  </p>`
                : html`<haxcms-theme-picker
                    class="theme-picker"
                    mini
                    .label=${this.t.theme}
                    .value=${this.selectedTheme}
                    .showStatusFlags=${false}
                    .options=${this.themeOptions}
                    .showAllThemes=${this.showAllThemes}
                    @value-changed=${this._themeValueChanged}
                  ></haxcms-theme-picker>`
            }
          </div>
          <div class="picker-column">
            <h3 class="picker-heading">${this.t.palette}</h3>
            <hax-palette-picker
              .label=${this.t.palette}
              .value=${this.selectedPalette}
              .activeValue=${this.activePalette}
              .showStatusFlags=${true}
              .options=${this._getSupportedPalettesForTheme(this.selectedTheme)}
              @value-changed=${this._paletteValueChanged}
            ></hax-palette-picker>
          </div>
        </div>
        <div class="actions">
          <button
            class="hax-ui-btn ghost action secondary"
            type="button"
            @click=${this._cancelPreview}
          >
            ${this.t.cancel}
          </button>
          <button
            class="hax-ui-btn primary action"
            type="button"
            @click=${this._openAdminTheme}
          >
            ${this.t.openAppearanceSettings}
          </button>
        </div>
      </section>
    `;
  }
}

globalThis.customElements.define(
  HAXCMSThemePreviewPanel.tag,
  HAXCMSThemePreviewPanel,
);
export { HAXCMSThemePreviewPanel };
