import { html, css } from "lit";
import { toJS } from "mobx";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import {
  HaxSchematizer,
  HaxElementizer,
} from "@haxtheweb/hax-body-behaviors/lib/HAXFields.js";
import { waitForHAXCMSSiteApiRegistryReady } from "./utils/haxcms-site-api-registry.js";
import "@haxtheweb/simple-fields/simple-fields.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";

class HAXCMSAppearanceAdminDialog extends DDD {
  static get tag() {
    return "haxcms-appearance-admin-dialog";
  }

  static get properties() {
    return {
      groups: { type: Array },
      errorMessage: { type: String, attribute: "error-message" },
    };
  }

  constructor() {
    super();
    this.groups = [];
    this.values = {};
    this.errorMessage = "";
    this.__valueChangeLock = false;
    this.__groupValues = {};
    this.__themesRegistry = {};
    this.__themesRegistryLoaded = false;
    this.__themePreviewSelection = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.refreshFromManifest();
    this._loadThemeRegistry();
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --haxcms-admin-panel-height: calc(
            var(--simple-modal-height, 80vh) - var(
                --simple-modal-titlebar-height,
                80px
              ) - var(--ddd-spacing-8, 32px)
          );
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          min-width: 80vw;
          min-height: min(60vh, var(--haxcms-admin-panel-height));
          height: var(--haxcms-admin-panel-height);
          max-height: var(--haxcms-admin-panel-height);
          overflow: hidden;
          font-family: var(--ddd-font-primary);
          padding: var(--ddd-spacing-4);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          flex-shrink: 0;
        }
        .panel-shell {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
        }
        .panel-scroll {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: var(--ddd-spacing-1);
          display: flex;
          flex-direction: column;
        }
        h2 {
          margin: 0 0 var(--ddd-spacing-4) 0;
          font-size: var(--ddd-font-size-m);
          font-weight: var(--ddd-font-weight-bold);
        }
        .appearance-note {
          margin: 0 0 var(--ddd-spacing-4) 0;
          font-size: var(--ddd-font-size-xs);
          line-height: 1.4;
          opacity: 0.92;
        }
        .section {
          border: var(--ddd-border-sm);
          border-radius: var(--ddd-radius-md);
          background: light-dark(
            var(--ddd-theme-default-white),
            rgba(0, 0, 0, 0.15)
          );
          padding: var(--ddd-spacing-4);
        }
        details {
          max-width: 100%;
        }
        .group {
          padding: var(--ddd-spacing-3) 0;
          border-top: var(--ddd-border-xs);
        }
        .group:first-of-type {
          border-top: 0;
          padding-top: 0;
        }
        .group-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-3);
          margin-bottom: var(--ddd-spacing-2);
          cursor: pointer;
        }
        .group-summary:focus-visible {
          outline: var(--ddd-border-sm) solid var(--ddd-theme-default-skyBlue);
          outline-offset: 2px;
          border-radius: var(--ddd-radius-xs);
        }
        .summary-leading {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }
        .group-summary simple-icon-lite {
          --simple-icon-color: currentColor;
          --simple-icon-height: var(--ddd-icon-3xs, 20px);
          --simple-icon-width: var(--ddd-icon-3xs, 20px);
        }
        .group-summary h3 {
          margin: 0;
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
        }
        .group-body {
          padding-bottom: var(--ddd-spacing-2);
        }
        .group-description {
          margin: 0 0 var(--ddd-spacing-3) 0;
          font-size: var(--ddd-font-size-3xs);
          line-height: 1.35;
          opacity: 0.9;
        }
        .status,
        .error {
          margin: 0;
          padding: var(--ddd-spacing-3);
          border-radius: var(--ddd-radius-sm);
          font-size: var(--ddd-font-size-4xs);
        }
        .status {
          border: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          background: light-dark(
            var(--ddd-theme-default-athertonViolet),
            var(--ddd-theme-default-coalyGray)
          );
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        .error {
          border: var(--ddd-border-xs) solid
            var(--ddd-theme-default-original87Pink);
          background: light-dark(
            var(--ddd-theme-default-potentialMidnight),
            var(--ddd-theme-default-coalyGray)
          );
          color: light-dark(
            var(--ddd-theme-default-original87Pink),
            var(--ddd-theme-default-original87Pink)
          );
        }
        .actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--ddd-spacing-3);
          padding-top: var(--ddd-spacing-4);
          margin-top: var(--ddd-spacing-4);
          border-top: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          position: sticky;
          bottom: 0;
          z-index: 2;
          flex-shrink: 0;
        }
        button.action {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-s);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-5);
          border-radius: var(--ddd-radius-sm);
          border: var(--ddd-border-xs);
          cursor: pointer;
          color: var(--ddd-theme-default-white);
          background-color: var(--ddd-theme-default-skyBlue);
        }
        button.action:focus,
        button.action:hover {
          outline: 2px solid var(--ddd-theme-default-keystoneYellow);
        }
        button.action.secondary {
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          background-color: transparent;
        }
        .action[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
        }
        simple-fields {
          --simple-fields-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --simple-fields-background-color: transparent;
          --simple-fields-select-option-background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          --simple-fields-select-option-selected-background-color: light-dark(
            var(--ddd-theme-default-skyBlue),
            var(--ddd-theme-default-potentialMidnight)
          );
          --simple-fields-button-background-color: transparent;
        }
        @media screen and (max-width: 900px) {
          :host {
            min-width: 0;
            width: 100%;
            min-height: 0;
            height: auto;
            max-height: calc(
              100dvh - var(
                  --simple-modal-titlebar-mobile-height,
                  var(--simple-modal-titlebar-height, 80px)
                ) - var(--ddd-spacing-4, 16px)
            );
            overflow-y: auto;
            overflow-x: hidden;
            padding: var(--ddd-spacing-3);
          }
          .panel-shell {
            min-height: auto;
          }
          .panel-scroll {
            flex: 0 0 auto;
            min-height: auto;
            overflow: visible;
            padding-right: 0;
          }
          .section {
            padding: var(--ddd-spacing-3);
          }
          .actions {
            position: sticky;
            bottom: 0;
            padding-bottom: calc(
              var(--ddd-spacing-3) + env(safe-area-inset-bottom, 0px)
            );
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
    } catch (e) {}
    this.refreshFromManifest();
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
          title: "Page",
          inputMethod: "select",
          itemsList: items,
        },
      ],
    };
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
    return [
      {
        key: "theme",
        label: "Theme",
        icon: "image:style",
        description: "Choose the active theme for your site.",
        open: true,
        fields: [
          {
            property: "manifest-metadata-theme-element",
            title: "Theme",
            description: "Design and presentation layer for your site",
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
        label: "Palette",
        icon: "lrn:palette",
        description: "Control accent colors and DDD palette tokens.",
        open: false,
        fields: [
          {
            property: "manifest-metadata-theme-variables-palette",
            title: "Palette",
            description:
              "DDD palette applied at theme scope for color-token cascading",
            inputMethod: "hax-palette-picker",
            required: false,
          },
          {
            property: "manifest-metadata-theme-variables-cssVariable",
            title: "Accent color",
            description: "Accent color applied to themes that implement it",
            inputMethod: "colorpicker",
            required: true,
          },
        ],
      },
      {
        key: "branding",
        label: "Branding",
        icon: "editor:insert-photo",
        description: "Set brand imagery, iconography, and related metadata.",
        open: false,
        fields: [
          {
            property: "manifest-metadata-theme-variables-image",
            title: "Image",
            description: "Image applied to themes that implement one",
            inputMethod: "haxupload",
            required: false,
          },
          {
            property: "manifest-metadata-theme-variables-imageAlt",
            title: "Banner alt",
            description: "Alternative text for the banner image",
            inputMethod: "textfield",
            required: false,
            noVoiceRecord: true,
          },
          {
            property: "manifest-metadata-theme-variables-imageLink",
            title: "Banner link",
            description: "Optional banner image link",
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "manifest-metadata-theme-variables-icon",
            title: "Icon",
            description:
              "Icon to represent the site in themes that implement it",
            inputMethod: "iconpicker",
            required: false,
          },
        ],
      },
      {
        key: "regions",
        label: "Regions",
        icon: "hax:site-map",
        description: "Assign pages to theme region slots.",
        open: false,
        fields: [
          this._regionField(
            "manifest-metadata-theme-regions-header",
            "Header",
            "Page shown in the header region",
            regionItems,
          ),
          this._regionField(
            "manifest-metadata-theme-regions-sidebarFirst",
            "Sidebar first",
            "Page shown in the first sidebar region",
            regionItems,
          ),
          this._regionField(
            "manifest-metadata-theme-regions-sidebarSecond",
            "Sidebar second",
            "Page shown in the second sidebar region",
            regionItems,
          ),
          this._regionField(
            "manifest-metadata-theme-regions-contentTop",
            "Content top",
            "Page shown in the top content region",
            regionItems,
          ),
          this._regionField(
            "manifest-metadata-theme-regions-contentBottom",
            "Content bottom",
            "Page shown in the bottom content region",
            regionItems,
          ),
          this._regionField(
            "manifest-metadata-theme-regions-footerPrimary",
            "Footer primary",
            "Page shown in the primary footer region",
            regionItems,
          ),
          this._regionField(
            "manifest-metadata-theme-regions-footerSecondary",
            "Footer secondary",
            "Page shown in the secondary footer region",
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
    values["manifest-metadata-theme-variables-palette"] =
      this._normalizeFieldValue(
        "manifest-metadata-theme-variables-palette",
        variables.palette,
      );
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
      this.__groupValues = {};
      this.errorMessage = "Unable to load appearance settings.";
      return;
    }
    this.__valueChangeLock = true;
    this.errorMessage = "";
    this.groups = this._buildAppearanceGroups(manifest);
    this.values = this._buildValueState(manifest);
    this._applyStoredThemePreviewSelection();
    this.__groupValues = {};
    this.groups.forEach((group) => {
      this.__groupValues[group.key] = this._buildGroupValue(group);
    });
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
    this.__groupValues = {};
    this.groups.forEach((group) => {
      this.__groupValues[group.key] = this._buildGroupValue(group);
    });
    this.requestUpdate();
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

  _buildGroupValue(group) {
    const value = {};
    group.fields.forEach((field) => {
      const key = field.property;
      if (typeof this.values[key] !== "undefined") {
        value[key] = this._cloneData(this.values[key]);
      } else if (group.key === "regions") {
        value[key] = [];
      } else {
        value[key] = "";
      }
    });
    return value;
  }

  _groupValue(group) {
    if (!this.__groupValues[group.key]) {
      this.__groupValues[group.key] = this._buildGroupValue(group);
    }
    return this.__groupValues[group.key];
  }

  _onGroupValueChanged(e) {
    if (this.__valueChangeLock) {
      return;
    }
    if (!e || !e.detail || !e.detail.value) {
      return;
    }
    const incoming = this._cloneData(e.detail.value);
    const groupKey =
      e &&
      e.target &&
      e.target.getAttribute &&
      e.target.getAttribute("data-group")
        ? e.target.getAttribute("data-group")
        : null;
    let changed = false;
    Object.keys(incoming).forEach((key) => {
      const normalizedValue = this._normalizeFieldValue(key, incoming[key]);
      incoming[key] = normalizedValue;
      if (
        JSON.stringify(this.values[key]) !== JSON.stringify(normalizedValue)
      ) {
        this.values[key] = normalizedValue;
        changed = true;
      }
    });
    if (!changed) {
      return;
    }
    if (groupKey) {
      this.__groupValues[groupKey] = incoming;
    }
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

  _saveAppearanceSettingsTap() {
    if (this.groups.length === 0) {
      return;
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

  render() {
    return html`
      <div class="panel-shell">
        <div class="panel-scroll">
          <h2>Appearance</h2>
          <p class="appearance-note">
            Configure theme, palette, branding, and layout regions for your
            site.
          </p>
          ${this.errorMessage
            ? html`<p class="error">${this.errorMessage}</p>`
            : ``}
          ${!this.errorMessage && this.groups.length === 0
            ? html`<p class="status">No appearance settings are available.</p>`
            : ``}
          ${!this.errorMessage
            ? html`
                <div class="section">
                  ${this.groups.map(
                    (group) => html`
                      <details class="group" ?open="${group.open}">
                        <summary class="group-summary">
                          <span class="summary-leading">
                            <simple-icon-lite
                              icon="${group.icon}"
                              aria-hidden="true"
                            ></simple-icon-lite>
                            <h3>${group.label}</h3>
                          </span>
                        </summary>
                        <div class="group-body">
                          ${group.description
                            ? html`
                                <p class="group-description">
                                  ${group.description}
                                </p>
                              `
                            : ``}
                          <simple-fields
                            data-group="${group.key}"
                            .fields="${group.fields}"
                            .value="${this._groupValue(group)}"
                            .schematizer="${HaxSchematizer}"
                            .elementizer="${HaxElementizer}"
                            @value-changed="${this._onGroupValueChanged}"
                          ></simple-fields>
                        </div>
                      </details>
                    `,
                  )}
                </div>
              `
            : ``}
        </div>
        <div class="actions">
          <button
            type="button"
            class="action secondary"
            @click="${this._openThemePreviewTap}"
            ?disabled="${this.groups.length === 0}"
          >
            Theme Preview
          </button>
          <button
            type="button"
            class="action"
            @click="${this._saveAppearanceSettingsTap}"
            ?disabled="${this.groups.length === 0}"
          >
            Save
          </button>
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(
  HAXCMSAppearanceAdminDialog.tag,
  HAXCMSAppearanceAdminDialog,
);

export { HAXCMSAppearanceAdminDialog };
