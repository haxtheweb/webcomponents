import { html, css, nothing } from "lit";
import { toJS } from "mobx";
import {
  HaxUiAdminTokens,
  HaxUiAdminPrimitives,
} from "@haxtheweb/hax-body/lib/hax-ui-styles.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import {
  HaxSchematizer,
  HaxElementizer,
} from "@haxtheweb/hax-body-behaviors/lib/HAXFields.js";
import { waitForHAXCMSSiteApiRegistryReady } from "./utils/haxcms-site-api-registry.js";
import "@haxtheweb/simple-fields/simple-fields.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";

/**
 * `haxcms-appearance-admin-dialog`
 * The Appearance admin section: theme, palette, branding and regions.
 * Renders inside the one admin dialog (haxcms-site-admin) and implements
 * its section contract: it stages edits against the values loaded from the
 * manifest, reports them with `haxcms-admin-section-state`, and its
 * `save()` fires the same `haxcms-save-appearance-settings` event and
 * payload as before. A theme / palette picked in the full-screen theme
 * preview (`applyThemePreviewSelection`) counts as an unsaved change.
 */
class HAXCMSAppearanceAdminDialog extends I18NMixin(DDD) {
  static get tag() {
    return "haxcms-appearance-admin-dialog";
  }

  static get properties() {
    return {
      groups: { type: Array },
      errorMessage: { type: String, attribute: "error-message" },
      /** set by haxcms-site-admin: the shell owns the Save button */
      inShell: { type: Boolean, attribute: "in-shell", reflect: true },
    };
  }

  constructor() {
    super();
    this.groups = [];
    this.values = {};
    this.errorMessage = "";
    this.inShell = false;
    this.__baseline = {};
    this.__fieldValues = {};
    this.__fieldLists = new WeakMap();
    this.__valueChangeLock = false;
    this.__themesRegistry = {};
    this.__themesRegistryLoaded = false;
    this.__themePreviewSelection = null;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      page: "Page",
      palette: "Palette",
      paletteDescription:
        "DDD palette applied at theme scope for color-token cascading",
      theme: "Theme",
      themeGroupDescription: "Choose the active theme for your site.",
      themeFieldDescription: "Design and presentation layer for your site",
      paletteGroupDescription: "Control accent colors and DDD palette tokens.",
      accentColor: "Accent color",
      accentColorDescription:
        "Accent color applied to themes that implement it",
      branding: "Branding",
      brandingDescription:
        "Set brand imagery, iconography, and related metadata.",
      image: "Image",
      imageDescription: "Image applied to themes that implement one",
      bannerAlt: "Banner alt",
      bannerAltDescription: "Alternative text for the banner image",
      bannerLink: "Banner link",
      bannerLinkDescription: "Optional banner image link",
      icon: "Icon",
      iconDescription: "Icon to represent the site in themes that implement it",
      regions: "Regions",
      regionsDescription: "Assign pages to theme region slots.",
      header: "Header",
      headerDescription: "Page shown in the header region",
      sidebarFirst: "Sidebar first",
      sidebarFirstDescription: "Page shown in the first sidebar region",
      sidebarSecond: "Sidebar second",
      sidebarSecondDescription: "Page shown in the second sidebar region",
      contentTop: "Content top",
      contentTopDescription: "Page shown in the top content region",
      contentBottom: "Content bottom",
      contentBottomDescription: "Page shown in the bottom content region",
      footerPrimary: "Footer primary",
      footerPrimaryDescription: "Page shown in the primary footer region",
      footerSecondary: "Footer secondary",
      footerSecondaryDescription: "Page shown in the secondary footer region",
      unableToLoadAppearanceSettings: "Unable to load appearance settings.",
      appearance: "Appearance",
      appearanceNote:
        "Configure theme, palette, branding, and layout regions for your site.",
      noAppearanceSettings: "No appearance settings are available.",
      themePreview: "Theme Preview",
      save: "Save",
      changed: "changed",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../locales/", import.meta.url).href,
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.refreshFromManifest();
    this._loadThemeRegistry();
  }

  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminTokens,
      ...HaxUiAdminPrimitives,
      css`
        :host {
          display: block;
          box-sizing: border-box;
          padding: var(--hax-ui-gap) var(--ddd-spacing-6, 24px)
            var(--ddd-spacing-8, 32px);
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
        }
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        /* standalone (not in the one admin dialog): the panel scrolls and
           keeps its own sticky Theme Preview and Save bar */
        :host(:not([in-shell])) {
          --haxcms-admin-panel-height: calc(
            var(--simple-modal-height, 80vh) - var(
                --simple-modal-titlebar-height,
                80px
              ) - var(--ddd-spacing-8, 32px)
          );
          display: flex;
          flex-direction: column;
          min-height: min(60vh, var(--haxcms-admin-panel-height));
          height: var(--haxcms-admin-panel-height);
          max-height: var(--haxcms-admin-panel-height);
          overflow: hidden;
          padding: var(--ddd-spacing-4, 16px);
        }
        .panel-shell {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
        }
        :host(:not([in-shell])) .panel-scroll {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: var(--hax-ui-gap);
        }
        .intro h2 {
          margin: 0 0 var(--hax-ui-gap);
          font-size: var(--ddd-font-size-xs, 20px);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .intro p {
          margin: 0 0 var(--hax-ui-gap-lg);
          color: var(--hax-ui-text-muted);
        }
        /* admin fieldset (contract-admin-fieldset), not DDD's content-scale
           details: no +/- marker, no 650px cap, no tinted bar */
        details {
          margin: 0;
          padding: 0;
          max-width: none;
          overflow: visible;
        }
        details > summary::after,
        details[open] > summary::after {
          content: none;
        }
        summary,
        details[open] > summary {
          background-color: transparent;
          color: inherit;
          filter: none;
          font-size: var(--hax-ui-admin-font-size);
          text-wrap: nowrap;
          user-select: none;
          transition: none;
        }
        summary {
          list-style: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          height: var(--hax-ui-row-height);
          margin-top: var(--ddd-spacing-4, 16px);
          padding: 0 var(--hax-ui-gap-md);
          border-radius: var(--hax-ui-radius);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        summary::-webkit-details-marker {
          display: none;
        }
        details > summary:hover,
        details[open] > summary:hover {
          background-color: var(--hax-ui-hover);
        }
        summary:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        summary simple-icon-lite {
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
        }
        summary .chev {
          transition: transform var(--hax-ui-duration) var(--hax-ui-easing);
        }
        details[open] > summary .chev {
          transform: rotate(90deg);
        }
        summary h3 {
          margin: 0;
          font-size: var(--hax-ui-admin-font-size);
          font-weight: inherit;
        }
        summary .count {
          font-weight: normal;
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        .group-help {
          display: block;
          margin: 2px 0 0;
          padding: 0 var(--hax-ui-gap-md) var(--hax-ui-gap-md)
            calc(
              var(--hax-ui-gap-md) + var(--hax-ui-icon) + var(--hax-ui-gap-md)
            );
          font-size: var(--hax-ui-admin-font-size-xs);
          line-height: 1.35;
          color: var(--hax-ui-text-muted);
        }
        /* one row per field: changed marker, then simple-fields with its
           own label (left) and control (right) */
        .fr {
          display: grid;
          grid-template-columns: 8px minmax(0, 1fr);
          gap: var(--hax-ui-gap-md);
          align-items: start;
          padding: var(--hax-ui-gap-lg) var(--hax-ui-gap-md);
          border-bottom: 1px solid var(--hax-ui-line);
        }
        .dot {
          display: block;
          width: 8px;
          height: 8px;
          margin-top: 7px;
          border-radius: 50%;
          background-color: var(--hax-ui-accent-strong);
        }
        simple-fields {
          display: block;
          min-width: 0;
          --simple-fields-font-size: var(--hax-ui-admin-font-size);
          --simple-fields-font-family: var(--hax-ui-admin-font-family);
          --simple-fields-detail-font-size: var(--hax-ui-admin-font-size-xs);
          --simple-fields-detail-font-family: var(--hax-ui-admin-font-family);
          --simple-fields-color: var(--hax-ui-text);
          --simple-fields-input-background-color: var(--hax-ui-surface);
          --simple-fields-input-border: 1px solid var(--hax-ui-line-strong);
          --simple-fields-background-color: transparent;
          --simple-fields-fieldset-background-color: transparent;
          --simple-fields-border-color: var(--hax-ui-line-strong);
          --simple-fields-border-color-light: var(--hax-ui-line);
          --simple-fields-select-option-background-color: var(--hax-ui-surface);
          --simple-fields-select-option-selected-background-color: var(
            --hax-ui-selected
          );
          --simple-fields-button-background-color: transparent;
          --simple-fields-margin: var(--hax-ui-gap-lg);
          --simple-fields-margin-small: var(--hax-ui-gap-md);
        }
        simple-fields > * {
          margin-bottom: 0;
        }
        simple-fields-field::part(label),
        simple-fields-container::part(label) {
          font-weight: var(--ddd-font-weight-bold, 700);
          font-size: var(--hax-ui-admin-font-size);
        }
        simple-fields-container::part(field-desc) {
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        simple-fields-field[type="text"]::part(option-input) {
          height: var(--ddd-textfield-height-sm, 40px);
          padding: 0 var(--hax-ui-gap-lg);
          border-radius: var(--hax-ui-radius);
        }
        simple-fields *::part(legend) {
          color: var(--hax-ui-text);
          background-color: transparent;
          font-weight: var(--ddd-font-weight-bold, 700);
          font-size: var(--hax-ui-admin-font-size);
        }
        simple-fields-array::part(fieldset) {
          margin: 0;
          padding: 0;
          border: 0;
        }
        simple-fields-array::part(add),
        simple-fields-array::part(expand) {
          min-height: var(--hax-ui-row-height);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        /* theme and palette cards stay cards, at HAX UI scale with the
           accent outline for the selected card */
        haxcms-theme-picker,
        hax-palette-picker {
          --ddd-theme-default-link: var(--hax-ui-accent-strong);
          --haxcms-theme-picker-legend-size: var(--hax-ui-admin-font-size);
          --haxcms-theme-picker-description-size: var(
            --hax-ui-admin-font-size-xs
          );
          --haxcms-theme-picker-theme-name-size: var(
            --hax-ui-admin-font-size-xs
          );
          --haxcms-theme-picker-fallback-size: var(--hax-ui-admin-font-size-xs);
          --haxcms-theme-picker-min-card-width: 140px;
          --haxcms-theme-picker-preview-height: 88px;
          font-family: var(--hax-ui-admin-font-family);
        }
        .status {
          margin: var(--ddd-spacing-4, 16px) 0 0;
          padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
          border-radius: var(--hax-ui-radius);
          color: var(--hax-ui-text-muted);
          background-color: var(--hax-ui-hover);
        }
        .status.error {
          color: var(--hax-ui-danger);
          background-color: var(--hax-ui-danger-soft);
        }
        .actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--hax-ui-gap-md);
          padding-top: var(--ddd-spacing-4, 16px);
          margin-top: var(--hax-ui-gap-lg);
          border-top: 1px solid var(--hax-ui-line);
          background-color: var(--hax-ui-surface);
          position: sticky;
          bottom: 0;
          z-index: 2;
          flex-shrink: 0;
        }
        button.action {
          height: var(--hax-ui-row-height);
          padding: 0 var(--hax-ui-gap-lg);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          font: inherit;
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
          cursor: pointer;
        }
        button.action:hover {
          background-color: var(--hax-ui-hover);
        }
        button.action:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        button.action.primary {
          border-color: var(--hax-ui-accent-strong);
          color: var(--hax-ui-on-accent);
          background-color: var(--hax-ui-accent-strong);
        }
        .action[disabled] {
          opacity: 0.45;
          cursor: not-allowed;
        }
        @media (max-width: 768px) {
          :host {
            padding: var(--hax-ui-gap) var(--ddd-spacing-4, 16px)
              var(--ddd-spacing-6, 24px);
          }
          :host(:not([in-shell])) {
            height: auto;
            min-height: 0;
            max-height: calc(
              100dvh - var(
                  --simple-modal-titlebar-mobile-height,
                  var(--simple-modal-titlebar-height, 80px)
                ) - var(--ddd-spacing-4, 16px)
            );
            overflow-y: auto;
          }
          :host(:not([in-shell])) .panel-scroll {
            overflow: visible;
          }
          .fr {
            padding-left: 0;
            padding-right: 0;
          }
          .actions {
            padding-bottom: calc(
              var(--ddd-spacing-3, 12px) + env(safe-area-inset-bottom, 0px)
            );
          }
        }
        @media (prefers-reduced-motion: reduce) {
          summary .chev {
            transition: none;
          }
        }
      `,
    ];
  }

  _cloneData(data) {
    if (typeof data === "undefined") {
      return data;
    }
    if (data === null) {
      return null;
    }
    return JSON.parse(JSON.stringify(data));
  }

  _normalizeCssVariable(value) {
    if (typeof value !== "string") {
      return value || "";
    }
    return value
      .replace("--simple-colors-default-theme-", "")
      .replace(/-7$/g, "");
  }

  _extractScalarValue(value) {
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return value;
    }
    if (!value || typeof value !== "object") {
      return "";
    }
    const keys = [
      "value",
      "url",
      "src",
      "path",
      "file",
      "icon",
      "element",
      "source",
      "id",
      "name",
    ];
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (typeof value[key] === "string" || typeof value[key] === "number") {
        return value[key];
      }
      if (key === "value" && value[key] && typeof value[key] === "object") {
        const nested = this._extractScalarValue(value[key]);
        if (nested !== "") {
          return nested;
        }
      }
    }
    return "";
  }

  _normalizeFieldValue(key, value) {
    if (key.indexOf("manifest-metadata-theme-regions-") === 0) {
      return this._regionValueToFieldValue(value);
    }
    if (key === "manifest-metadata-theme-variables-cssVariable") {
      return this._normalizeCssVariable(this._extractScalarValue(value));
    }
    return this._extractScalarValue(value);
  }

  _regionValueToFieldValue(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value
      .map((item) => {
        if (item && typeof item === "object" && item.node) {
          return { node: item.node };
        }
        return { node: item };
      })
      .filter((item) => !!item.node);
  }

  _buildRegionItemsList() {
    const itemManifest = store.getManifestItems(true);
    const items = [];
    itemManifest.forEach((el) => {
      let itemBuilder = el;
      let distance = "- ";
      while (itemBuilder && itemBuilder.parent != null) {
        itemBuilder = itemManifest.find((i) => i.id == itemBuilder.parent);
        if (itemBuilder) {
          distance = "--" + distance;
        }
      }
      items.push({
        text: distance + el.title,
        value: el.id,
      });
    });
    return items;
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

  async _loadThemeRegistry() {
    if (this.__themesRegistryLoaded) {
      return;
    }
    this.__themesRegistryLoaded = true;
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
            this.__themesRegistry = registry;
          }
        }
      }
    } catch {
      // intentionally empty
    }
    // rebuild with the registry's theme names and palettes, keeping any
    // edits staged while it loaded
    const staged = {};
    if (this.groups.length > 0) {
      Object.keys(this.values).forEach((key) => {
        if (this._isChanged(key)) {
          staged[key] = this._cloneData(this.values[key]);
        }
      });
    }
    this.refreshFromManifest();
    if (Object.keys(staged).length > 0 && this.groups.length > 0) {
      this.__valueChangeLock = true;
      Object.assign(this.values, staged);
      if (
        Object.prototype.hasOwnProperty.call(
          staged,
          "manifest-metadata-theme-element",
        )
      ) {
        this._updatePaletteFieldOptions(
          staged["manifest-metadata-theme-element"],
        );
      }
      this._resetFieldValues();
      this._emitState();
      setTimeout(() => {
        this.__valueChangeLock = false;
      }, 0);
    }
  }

  _themeOptions(currentThemeElement = "") {
    const mergedThemes = {};
    if (this.__themesRegistry && typeof this.__themesRegistry === "object") {
      Object.keys(this.__themesRegistry).forEach((key) => {
        mergedThemes[key] = this._cloneData(this.__themesRegistry[key]);
      });
    }
    const options = Object.keys(mergedThemes).map((key) => {
      const theme =
        mergedThemes[key] && typeof mergedThemes[key] === "object"
          ? mergedThemes[key]
          : {};
      const label = theme && theme.name ? theme.name : key;
      const rawPriority =
        typeof theme.priority === "number"
          ? theme.priority
          : Number(theme.priority);
      const priority = Number.isFinite(rawPriority) ? rawPriority : 0;
      return {
        key: key,
        value: key,
        label: label,
        name: label,
        thumbnail: this._resolveThemeThumbnail(
          theme && theme.thumbnail ? theme.thumbnail : "",
        ),
        hidden: theme && theme.hidden ? true : false,
        terrible:
          theme && theme.terrible ? true : key.indexOf("terrible") === 0,
        legacy:
          theme && (theme.legacy || theme.deprecated || theme.isLegacy)
            ? true
            : false,
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
      currentThemeElement &&
      !options.find((option) => option.value === currentThemeElement)
    ) {
      options.unshift({
        key: currentThemeElement,
        value: currentThemeElement,
        label: currentThemeElement,
        name: currentThemeElement,
        thumbnail: "",
        hidden: false,
        terrible: false,
        legacy: false,
        priority: -1000,
      });
    }
    return options;
  }

  _regionField(property, title, description, items) {
    return {
      property: property,
      title: title,
      description: description,
      inputMethod: "array",
      required: false,
      itemLabel: "item",
      hideReorder: true,
      expanded: false,
      hideDuplicate: true,
      properties: [
        {
          property: "node",
          title: this.t.page,
          inputMethod: "select",
          itemsList: items,
        },
      ],
    };
  }

  _getSupportedPalettesForTheme(themeElement) {
    if (!themeElement) {
      return null;
    }
    // prefer backend registry if available
    const theme = this.__themesRegistry && this.__themesRegistry[themeElement];
    if (
      theme &&
      Array.isArray(theme.supportedPalettes) &&
      theme.supportedPalettes.length > 0
    ) {
      return theme.supportedPalettes;
    }
    // fallback: read from the custom element class if already defined
    const ElClass = globalThis.customElements.get(themeElement);
    if (ElClass && ElClass.supportedPalettes) {
      const palettes = ElClass.supportedPalettes;
      if (Array.isArray(palettes) && palettes.length > 0) {
        return palettes;
      }
    }
    return null;
  }

  _buildAppearanceGroups(manifest) {
    const themeElement = this._normalizeFieldValue(
      "manifest-metadata-theme-element",
      manifest &&
        manifest.metadata &&
        manifest.metadata.theme &&
        manifest.metadata.theme.element
        ? manifest.metadata.theme.element
        : "",
    );
    const regionItems = this._buildRegionItemsList();
    const paletteOptions = this._getSupportedPalettesForTheme(themeElement);
    const paletteField = {
      property: "manifest-metadata-theme-variables-palette",
      title: this.t.palette,
      description: this.t.paletteDescription,
      inputMethod: "hax-palette-picker",
      required: false,
    };
    if (paletteOptions) {
      paletteField.options = paletteOptions;
    }
    return [
      {
        key: "theme",
        label: this.t.theme,
        icon: "image:style",
        description: this.t.themeGroupDescription,
        open: true,
        fields: [
          {
            property: "manifest-metadata-theme-element",
            title: this.t.theme,
            description: this.t.themeFieldDescription,
            inputMethod: "haxcms-theme-picker",
            required: false,
            options: this._themeOptions(themeElement),
            showAllThemes: store.showAllThemes,
            activeValue: themeElement,
          },
        ],
      },
      {
        key: "palette",
        label: this.t.palette,
        icon: "lrn:palette",
        description: this.t.paletteGroupDescription,
        open: false,
        fields: [
          paletteField,
          {
            property: "manifest-metadata-theme-variables-cssVariable",
            title: this.t.accentColor,
            description: this.t.accentColorDescription,
            inputMethod: "colorpicker",
            required: true,
          },
        ],
      },
      {
        key: "branding",
        label: this.t.branding,
        icon: "editor:insert-photo",
        description: this.t.brandingDescription,
        open: false,
        fields: [
          {
            property: "manifest-metadata-theme-variables-image",
            title: this.t.image,
            description: this.t.imageDescription,
            inputMethod: "haxupload",
            fileActions: true,
            noVoiceRecord: true,
            noScreenRecord: true,
            noCamera: true,
            required: false,
          },
          {
            property: "manifest-metadata-theme-variables-imageAlt",
            title: this.t.bannerAlt,
            description: this.t.bannerAltDescription,
            inputMethod: "textfield",
            required: false,
            noVoiceRecord: true,
          },
          {
            property: "manifest-metadata-theme-variables-imageLink",
            title: this.t.bannerLink,
            description: this.t.bannerLinkDescription,
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "manifest-metadata-theme-variables-icon",
            title: this.t.icon,
            description: this.t.iconDescription,
            inputMethod: "iconpicker",
            required: false,
          },
        ],
      },
      {
        key: "regions",
        label: this.t.regions,
        icon: "hax:site-map",
        description: this.t.regionsDescription,
        open: false,
        fields: [
          this._regionField(
            "manifest-metadata-theme-regions-header",
            this.t.header,
            this.t.headerDescription,
            regionItems,
          ),
          this._regionField(
            "manifest-metadata-theme-regions-sidebarFirst",
            this.t.sidebarFirst,
            this.t.sidebarFirstDescription,
            regionItems,
          ),
          this._regionField(
            "manifest-metadata-theme-regions-sidebarSecond",
            this.t.sidebarSecond,
            this.t.sidebarSecondDescription,
            regionItems,
          ),
          this._regionField(
            "manifest-metadata-theme-regions-contentTop",
            this.t.contentTop,
            this.t.contentTopDescription,
            regionItems,
          ),
          this._regionField(
            "manifest-metadata-theme-regions-contentBottom",
            this.t.contentBottom,
            this.t.contentBottomDescription,
            regionItems,
          ),
          this._regionField(
            "manifest-metadata-theme-regions-footerPrimary",
            this.t.footerPrimary,
            this.t.footerPrimaryDescription,
            regionItems,
          ),
          this._regionField(
            "manifest-metadata-theme-regions-footerSecondary",
            this.t.footerSecondary,
            this.t.footerSecondaryDescription,
            regionItems,
          ),
        ],
      },
    ];
  }

  _buildValueState(manifest) {
    const values = {};
    const metadata =
      manifest && manifest.metadata && manifest.metadata.theme
        ? manifest.metadata.theme
        : {};
    const variables = metadata.variables ? metadata.variables : {};
    const regions = metadata.regions ? metadata.regions : {};
    values["manifest-metadata-theme-element"] = this._normalizeFieldValue(
      "manifest-metadata-theme-element",
      metadata.element,
    );
    values["manifest-metadata-theme-variables-image"] =
      this._normalizeFieldValue(
        "manifest-metadata-theme-variables-image",
        variables.image,
      );
    values["manifest-metadata-theme-variables-imageAlt"] =
      this._normalizeFieldValue(
        "manifest-metadata-theme-variables-imageAlt",
        variables.imageAlt,
      );
    values["manifest-metadata-theme-variables-imageLink"] =
      this._normalizeFieldValue(
        "manifest-metadata-theme-variables-imageLink",
        variables.imageLink,
      );
    values["manifest-metadata-theme-variables-cssVariable"] =
      this._normalizeFieldValue(
        "manifest-metadata-theme-variables-cssVariable",
        variables.cssVariable,
      );
    if (
      typeof variables.palette !== "undefined" &&
      variables.palette !== null
    ) {
      values["manifest-metadata-theme-variables-palette"] =
        this._normalizeFieldValue(
          "manifest-metadata-theme-variables-palette",
          variables.palette,
        );
    } else if (
      store.themeElement &&
      typeof store.themeElement.dataPalette !== typeof undefined &&
      store.themeElement.dataPalette !== null
    ) {
      values["manifest-metadata-theme-variables-palette"] =
        `${store.themeElement.dataPalette}`.trim();
    } else {
      values["manifest-metadata-theme-variables-palette"] = "";
    }
    values["manifest-metadata-theme-variables-icon"] =
      this._normalizeFieldValue(
        "manifest-metadata-theme-variables-icon",
        variables.icon,
      );
    values["manifest-metadata-theme-regions-header"] =
      this._normalizeFieldValue(
        "manifest-metadata-theme-regions-header",
        regions.header,
      );
    values["manifest-metadata-theme-regions-sidebarFirst"] =
      this._normalizeFieldValue(
        "manifest-metadata-theme-regions-sidebarFirst",
        regions.sidebarFirst,
      );
    values["manifest-metadata-theme-regions-sidebarSecond"] =
      this._normalizeFieldValue(
        "manifest-metadata-theme-regions-sidebarSecond",
        regions.sidebarSecond,
      );
    values["manifest-metadata-theme-regions-contentTop"] =
      this._normalizeFieldValue(
        "manifest-metadata-theme-regions-contentTop",
        regions.contentTop,
      );
    values["manifest-metadata-theme-regions-contentBottom"] =
      this._normalizeFieldValue(
        "manifest-metadata-theme-regions-contentBottom",
        regions.contentBottom,
      );
    values["manifest-metadata-theme-regions-footerPrimary"] =
      this._normalizeFieldValue(
        "manifest-metadata-theme-regions-footerPrimary",
        regions.footerPrimary,
      );
    values["manifest-metadata-theme-regions-footerSecondary"] =
      this._normalizeFieldValue(
        "manifest-metadata-theme-regions-footerSecondary",
        regions.footerSecondary,
      );
    return values;
  }

  refreshFromManifest() {
    const manifest = toJS(store.manifest);
    if (!manifest || !manifest.metadata) {
      this.groups = [];
      this.values = {};
      this.__baseline = {};
      this.__fieldValues = {};
      this.errorMessage = this.t.unableToLoadAppearanceSettings;
      this._emitState();
      return;
    }
    this.__valueChangeLock = true;
    this.errorMessage = "";
    this.groups = this._buildAppearanceGroups(manifest);
    this.values = this._buildValueState(manifest);
    // the manifest is the baseline; a theme preview pick on top of it is an
    // unsaved change
    this.__baseline = this._cloneData(this.values);
    this._applyStoredThemePreviewSelection();
    this._resetFieldValues();
    this._emitState();
    setTimeout(() => {
      this.__valueChangeLock = false;
    }, 0);
  }

  _applyStoredThemePreviewSelection() {
    if (
      !this.__themePreviewSelection ||
      !this.values ||
      typeof this.values !== "object"
    ) {
      return;
    }
    const selection = this.__themePreviewSelection;
    const hasTheme =
      typeof selection.theme !== "undefined" && selection.theme !== null;
    const hasPalette = typeof selection.palette !== "undefined";
    if (hasTheme) {
      this.values["manifest-metadata-theme-element"] =
        this._normalizeFieldValue(
          "manifest-metadata-theme-element",
          selection.theme,
        );
    }
    if (hasPalette) {
      this.values["manifest-metadata-theme-variables-palette"] =
        this._normalizeFieldValue(
          "manifest-metadata-theme-variables-palette",
          selection.palette,
        );
    }
  }

  applyThemePreviewSelection(selection = {}) {
    if (!selection || typeof selection !== "object") {
      return;
    }
    const hasTheme =
      typeof selection.theme !== "undefined" && selection.theme !== null;
    const hasPalette = typeof selection.palette !== "undefined";
    if (!hasTheme && !hasPalette) {
      return;
    }
    this.__themePreviewSelection = {};
    if (hasTheme) {
      this.__themePreviewSelection.theme = selection.theme;
    }
    if (hasPalette) {
      this.__themePreviewSelection.palette = selection.palette;
    }
    this.__valueChangeLock = true;
    this._applyStoredThemePreviewSelection();
    this._resetFieldValues();
    this.requestUpdate();
    this._emitState();
    setTimeout(() => {
      this.__valueChangeLock = false;
    }, 0);
  }

  _openThemePreviewTap() {
    if (this.groups.length === 0) {
      return;
    }
    store.playSound("click");
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        cancelable: true,
        detail: {},
      }),
    );
    setTimeout(() => {
      globalThis.dispatchEvent(
        new CustomEvent("haxcms-open-theme-preview-program", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {
            source: "appearance-admin-dialog",
          },
        }),
      );
    }, 0);
  }

  /**
   * Theme Preview from the shell's header. Opening it leaves the shell, so
   * with unsaved changes the shell asks first (Stay / Discard and leave /
   * Save and leave) through its public requestLeave.
   */
  _openThemePreviewFromShell() {
    if (this.groups.length === 0) {
      return;
    }
    const shell = this.parentNode;
    if (shell && typeof shell.requestLeave === "function") {
      shell.requestLeave(() => this._openThemePreviewTap());
      return;
    }
    this._openThemePreviewTap();
  }

  /** section contract: header actions the shell renders */
  runHeaderAction(id) {
    if (id === "themePreview") {
      this._openThemePreviewFromShell();
    }
  }

  _fieldDefault(key) {
    return key.indexOf("manifest-metadata-theme-regions-") === 0 ? [] : "";
  }

  /** the value object each field's simple-fields renders */
  _resetFieldValues() {
    this.__fieldValues = {};
    this.groups.forEach((group) => {
      group.fields.forEach((field) => {
        const key = field.property;
        this.__fieldValues[key] = {
          [key]:
            typeof this.values[key] !== "undefined"
              ? this._cloneData(this.values[key])
              : this._fieldDefault(key),
        };
      });
    });
  }

  _fieldValue(field) {
    const key = field.property;
    if (!this.__fieldValues[key]) {
      this.__fieldValues[key] = {
        [key]:
          typeof this.values[key] !== "undefined"
            ? this._cloneData(this.values[key])
            : this._fieldDefault(key),
      };
    }
    return this.__fieldValues[key];
  }

  /** a stable one-field list per field, so re-renders keep the inputs */
  _fieldList(field) {
    if (!this.__fieldLists.has(field)) {
      this.__fieldLists.set(field, [field]);
    }
    return this.__fieldLists.get(field);
  }

  _onFieldValueChanged(e) {
    if (this.__valueChangeLock) {
      return;
    }
    if (!e || !e.detail || !e.detail.value) {
      return;
    }
    const incoming = this._cloneData(e.detail.value);
    let changed = false;
    Object.keys(incoming).forEach((key) => {
      const normalizedValue = this._normalizeFieldValue(key, incoming[key]);
      if (
        JSON.stringify(this.values[key]) !== JSON.stringify(normalizedValue)
      ) {
        this.values[key] = normalizedValue;
        // keep the same object so simple-fields is not rebuilt mid-edit
        if (this.__fieldValues[key]) {
          this.__fieldValues[key][key] = this._cloneData(normalizedValue);
        }
        changed = true;
      }
    });
    if (!changed) {
      return;
    }
    // if the theme changed, update the palette field options
    if (
      Object.prototype.hasOwnProperty.call(
        incoming,
        "manifest-metadata-theme-element",
      )
    ) {
      this._updatePaletteFieldOptions(
        this.values["manifest-metadata-theme-element"],
      );
    }
    this.requestUpdate();
    this._emitState();
  }

  /** a field's value in the form it is saved, for comparing */
  _savedForm(key, value) {
    if (key.indexOf("manifest-metadata-theme-regions-") === 0) {
      return this._regionValueToSavePayload(
        typeof value === "undefined" ? [] : value,
      );
    }
    return this._normalizeFieldValue(
      key,
      typeof value === "undefined" ? "" : value,
    );
  }

  _isChanged(key) {
    return (
      JSON.stringify(this._savedForm(key, this.values[key])) !==
      JSON.stringify(this._savedForm(key, this.__baseline[key]))
    );
  }

  /** section contract: labels of fields that differ from the manifest */
  get changedFields() {
    const changed = [];
    this.groups.forEach((group) => {
      group.fields.forEach((field) => {
        if (this._isChanged(field.property)) {
          changed.push(field.title);
        }
      });
    });
    return changed;
  }

  /** section contract: same rule as the old Save button */
  get canSave() {
    return this.groups.length > 0 && !this.errorMessage;
  }

  _emitState() {
    const changed = this.changedFields;
    const detail = {
      dirty: changed.length > 0,
      changes: changed,
      canSave: this.canSave,
    };
    if (this.inShell) {
      detail.headerActions = [
        {
          id: "themePreview",
          label: this.t.themePreview,
          icon: "image:remove-red-eye",
          disabled: this.groups.length === 0,
        },
      ];
    }
    this.dispatchEvent(
      new CustomEvent("haxcms-admin-section-state", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: detail,
      }),
    );
  }

  /** section contract: restore the values loaded from the manifest */
  discard() {
    this.__themePreviewSelection = null;
    this.__valueChangeLock = true;
    this.values = this._cloneData(this.__baseline) || {};
    this._updatePaletteFieldOptions(
      this.values["manifest-metadata-theme-element"],
    );
    this._resetFieldValues();
    this.requestUpdate();
    this._emitState();
    setTimeout(() => {
      this.__valueChangeLock = false;
    }, 0);
  }

  _updatePaletteFieldOptions(themeElement) {
    if (!themeElement || !this.groups) {
      return;
    }
    const paletteOptions = this._getSupportedPalettesForTheme(themeElement);
    const paletteGroupIndex = this.groups.findIndex((g) => g.key === "palette");
    if (paletteGroupIndex === -1) {
      return;
    }
    const paletteGroup = {
      ...this.groups[paletteGroupIndex],
      fields: [...this.groups[paletteGroupIndex].fields],
    };
    const paletteFieldIndex = paletteGroup.fields.findIndex(
      (f) => f.property === "manifest-metadata-theme-variables-palette",
    );
    if (paletteFieldIndex === -1) {
      return;
    }
    const paletteField = { ...paletteGroup.fields[paletteFieldIndex] };
    if (paletteOptions) {
      paletteField.options = paletteOptions;
    } else if (Object.prototype.hasOwnProperty.call(paletteField, "options")) {
      delete paletteField.options;
    }
    paletteGroup.fields[paletteFieldIndex] = paletteField;
    this.groups = [
      ...this.groups.slice(0, paletteGroupIndex),
      paletteGroup,
      ...this.groups.slice(paletteGroupIndex + 1),
    ];
    this.requestUpdate();
  }

  _regionValueToSavePayload(value) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value
      .map((item) => {
        if (item && typeof item === "object" && item.node) {
          return item.node;
        }
        return item;
      })
      .filter((item) => typeof item === "string" && item !== "");
  }

  _buildSavePayload() {
    const manifest = toJS(store.manifest);
    let siteName = "";
    if (
      manifest &&
      manifest.metadata &&
      manifest.metadata.site &&
      manifest.metadata.site.name
    ) {
      siteName = manifest.metadata.site.name;
    }
    const theme = {};
    this.groups.forEach((group) => {
      group.fields.forEach((field) => {
        const key = field.property;
        const value =
          typeof this.values[key] !== "undefined"
            ? this._cloneData(this.values[key])
            : group.key === "regions"
              ? []
              : "";
        if (group.key === "regions") {
          theme[key] = this._regionValueToSavePayload(value);
        } else {
          theme[key] = this._normalizeFieldValue(key, value);
        }
      });
    });
    return {
      site: {
        name: siteName,
      },
      manifest: {
        theme: theme,
      },
    };
  }

  /**
   * section contract: send the save. Fires the same
   * haxcms-save-appearance-settings event and payload as the old Save
   * button; the shell waits for haxcms-admin-save-result.
   * @returns {boolean} true when a save was sent
   */
  save() {
    if (!this.canSave) {
      return false;
    }
    store.playSound("click");
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-save-appearance-settings", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: this._buildSavePayload(),
      }),
    );
    if (!this.inShell) {
      setTimeout(() => {
        globalThis.dispatchEvent(
          new CustomEvent("simple-modal-hide", {
            bubbles: true,
            cancelable: true,
            detail: {},
          }),
        );
      }, 0);
    }
    return true;
  }

  /** the standalone Save button */
  _saveAppearanceSettingsTap() {
    this.save();
  }

  _renderField(group, field) {
    const changed = this._isChanged(field.property);
    return html`<div
      class="fr"
      data-field="${field.property}"
      ?data-changed="${changed}"
    >
      ${changed
        ? html`<span
            class="dot"
            role="img"
            aria-label="${this.t.changed}: ${field.title}"
          ></span>`
        : html`<span></span>`}
      <simple-fields
        data-group="${group.key}"
        .fields="${this._fieldList(field)}"
        .value="${this._fieldValue(field)}"
        .schematizer="${HaxSchematizer}"
        .elementizer="${HaxElementizer}"
        @value-changed="${this._onFieldValueChanged}"
      ></simple-fields>
    </div>`;
  }

  _renderGroup(group) {
    const count = group.fields.filter((field) =>
      this._isChanged(field.property),
    ).length;
    return html`
      <details ?open="${group.open}" data-group="${group.key}">
        <summary>
          <simple-icon-lite
            class="chev"
            icon="icons:chevron-right"
            aria-hidden="true"
          ></simple-icon-lite>
          <simple-icon-lite
            icon="${group.icon}"
            aria-hidden="true"
          ></simple-icon-lite>
          <h3>${group.label}</h3>
          ${count > 0
            ? html`<span
                class="dot"
                role="img"
                aria-label="${this.t.changed}"
              ></span>`
            : nothing}
        </summary>
        ${group.description
          ? html`<span class="group-help">${group.description}</span>`
          : nothing}
        ${group.fields.map((field) => this._renderField(group, field))}
      </details>
    `;
  }

  render() {
    return html`
      <div class="panel-shell">
        <div class="panel-scroll">
          ${!this.inShell
            ? html`<div class="intro">
                <h2>${this.t.appearance}</h2>
                <p>${this.t.appearanceNote}</p>
              </div>`
            : nothing}
          ${this.errorMessage
            ? html`<p class="status error" role="alert">
                ${this.errorMessage}
              </p>`
            : nothing}
          ${!this.errorMessage && this.groups.length === 0
            ? html`<p class="status">${this.t.noAppearanceSettings}</p>`
            : nothing}
          ${!this.errorMessage
            ? this.groups.map((group) => this._renderGroup(group))
            : nothing}
        </div>
        ${!this.inShell
          ? html`<div class="actions">
              <button
                type="button"
                class="action"
                @click="${this._openThemePreviewTap}"
                ?disabled="${this.groups.length === 0}"
              >
                ${this.t.themePreview}
              </button>
              <button
                type="button"
                class="action primary"
                @click="${this._saveAppearanceSettingsTap}"
                ?disabled="${this.groups.length === 0}"
              >
                ${this.t.save}
              </button>
            </div>`
          : nothing}
      </div>
    `;
  }
}

globalThis.customElements.define(
  HAXCMSAppearanceAdminDialog.tag,
  HAXCMSAppearanceAdminDialog,
);

export { HAXCMSAppearanceAdminDialog };
