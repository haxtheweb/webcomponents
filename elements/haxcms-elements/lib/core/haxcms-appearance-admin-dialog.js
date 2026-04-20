import { html, css } from "lit";
import { toJS } from "mobx";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import {
  HaxSchematizer,
  HaxElementizer,
} from "@haxtheweb/hax-body-behaviors/lib/HAXFields.js";
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
  }

  connectedCallback() {
    super.connectedCallback();
    this.refreshFromManifest();
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --haxcms-admin-panel-height: calc(
            var(--simple-modal-height, 85vh) -
              var(--simple-modal-titlebar-height, 80px) - var(--ddd-spacing-8, 32px)
          );
          display: flex;
          flex-direction: column;
          min-width: 70vw;
          min-height: min(60vh, var(--haxcms-admin-panel-height));
          height: var(--haxcms-admin-panel-height);
          max-height: var(--haxcms-admin-panel-height);
          overflow: hidden;
          font-family: var(--ddd-font-navigation);
        }
        .panel-shell {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          padding: var(--ddd-spacing-4);
          gap: var(--ddd-spacing-3);
        }
        details {
          max-width: 100%;
        }
        .panel-scroll {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: var(--ddd-spacing-1);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
        }
        .group {
          display: inline-table;
          width: 100%;
          min-width: 0;
          border: var(--ddd-border-sm) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-theme-default-slateGray)
            );
          border-radius: var(--ddd-radius-sm);
          background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          overflow: hidden;
        }
        .group-summary {
          list-style: none;
          cursor: pointer;
          padding: var(--ddd-spacing-3);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-medium);
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        .group-summary::-webkit-details-marker {
          display: none;
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
          --simple-icon-width: var(--ddd-icon-3xs, 20px);
          --simple-icon-height: var(--ddd-icon-3xs, 20px);
        }
        .group-body {
          padding: var(--ddd-spacing-3);
          border-top: var(--ddd-border-xs) solid var(--ddd-theme-default-limestoneGray);
        }
        .status,
        .error {
          margin: 0;
          padding: var(--ddd-spacing-3);
          border-radius: var(--ddd-radius-sm);
          font-size: var(--ddd-font-size-4xs);
        }
        .status {
          border: var(--ddd-border-xs) solid var(--ddd-theme-default-limestoneGray);
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
          border: var(--ddd-border-xs) solid var(--ddd-theme-default-original87Pink);
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
          justify-content: flex-start;
          align-items: center;
          gap: var(--ddd-spacing-2);
          border-top: var(--ddd-border-xs) solid var(--ddd-theme-default-limestoneGray);
          padding-top: var(--ddd-spacing-3);
        }
        .hax-modal-btn {
          font-size: var(--ddd-font-size-s);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          color: var(--ddd-theme-default-white);
          background-color: var(--ddd-theme-default-skyBlue);
          border: var(--ddd-border-sm) solid var(--ddd-theme-default-navy);
          border-radius: var(--ddd-radius-sm);
          font-family: var(--ddd-font-navigation);
          cursor: pointer;
        }
        .hax-modal-btn.cancel {
          background-color: var(--ddd-theme-default-original87Pink);
          border-color: var(--ddd-theme-default-potentialMidnight);
        }
        .hax-modal-btn:focus-visible {
          outline: var(--ddd-border-sm) solid var(--ddd-theme-default-keystoneYellow);
          outline-offset: 2px;
        }
        .hax-modal-btn[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
        }
        simple-fields {
          --simple-fields-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
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

  _themeOptions(currentThemeElement = "") {
    const options = {};
    if (globalThis.appSettings && globalThis.appSettings.themes) {
      Object.keys(globalThis.appSettings.themes).forEach((key) => {
        const theme = globalThis.appSettings.themes[key];
        options[key] = theme && theme.name ? theme.name : key;
      });
    }
    if (currentThemeElement && !options[currentThemeElement]) {
      options[currentThemeElement] = currentThemeElement;
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
        open: true,
        fields: [
          {
            property: "manifest-metadata-theme-element",
            title: "Theme",
            description: "Design and presentation layer for your site",
            inputMethod: "select",
            required: false,
            options: this._themeOptions(themeElement),
          },
        ],
      },
      {
        key: "palette",
        label: "Palette",
        icon: "lrn:palette",
        open: false,
        fields: [
          {
            property: "manifest-metadata-theme-variables-cssVariable",
            title: "Accent color",
            description: "Accent color applied to themes that implement it",
            inputMethod: "colorpicker",
            required: true,
          },
          {
            property: "manifest-metadata-theme-variables-palette",
            title: "Palette",
            description: "DDD palette applied at theme scope for color-token cascading",
            inputMethod: "hax-palette-picker",
            required: false,
          },
        ],
      },
      {
        key: "branding",
        label: "Branding",
        icon: "editor:insert-photo",
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
            description: "Icon to represent the site in themes that implement it",
            inputMethod: "iconpicker",
            required: false,
          },
        ],
      },
      {
        key: "regions",
        label: "Regions",
        icon: "hax:site-map",
        open: false,
        fields: [
          this._regionField(
            "manifest-metadata-theme-regions-header",
            "Header",
            "Page to use for the content of the header region",
            regionItems,
          ),
          this._regionField(
            "manifest-metadata-theme-regions-sidebarFirst",
            "Sidebar first",
            "Page to use for the content of the sidebar first region",
            regionItems,
          ),
          this._regionField(
            "manifest-metadata-theme-regions-sidebarSecond",
            "Sidebar second",
            "Page to use for the content of the sidebar second region",
            regionItems,
          ),
          this._regionField(
            "manifest-metadata-theme-regions-contentTop",
            "Content top",
            "Page to use for the content of the content top region",
            regionItems,
          ),
          this._regionField(
            "manifest-metadata-theme-regions-contentBottom",
            "Content bottom",
            "Page to use for the content of the content bottom region",
            regionItems,
          ),
          this._regionField(
            "manifest-metadata-theme-regions-footerPrimary",
            "Footer primary",
            "Page to use for the content of the footer primary region",
            regionItems,
          ),
          this._regionField(
            "manifest-metadata-theme-regions-footerSecondary",
            "Footer secondary",
            "Page to use for the content of the footer secondary region",
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
    values["manifest-metadata-theme-variables-image"] = this._normalizeFieldValue(
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
    values["manifest-metadata-theme-variables-icon"] = this._normalizeFieldValue(
      "manifest-metadata-theme-variables-icon",
      variables.icon,
    );
    values["manifest-metadata-theme-regions-header"] = this._normalizeFieldValue(
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
    this.__groupValues = {};
    this.groups.forEach((group) => {
      this.__groupValues[group.key] = this._buildGroupValue(group);
    });
    setTimeout(() => {
      this.__valueChangeLock = false;
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
    const regions = {};
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
          regions[key] = this._normalizeFieldValue(key, value);
        } else {
          theme[key] = this._normalizeFieldValue(key, value);
        }
      });
    });
    theme.regions = regions;
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
          ${this.errorMessage ? html`<p class="error">${this.errorMessage}</p>` : ``}
          ${!this.errorMessage && this.groups.length === 0
            ? html`<p class="status">No appearance settings are available.</p>`
            : ``}
          ${!this.errorMessage
            ? this.groups.map(
                (group) => html`
                  <details class="group" ?open="${group.open}">
                    <summary class="group-summary">
                      <span class="summary-leading">
                        <simple-icon-lite
                          icon="${group.icon}"
                          aria-hidden="true"
                        ></simple-icon-lite>
                        <span>${group.label}</span>
                      </span>
                    </summary>
                    <div class="group-body">
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
              )
            : ``}
        </div>
        <div class="actions">
          <button
            class="hax-modal-btn"
            @click="${this._saveAppearanceSettingsTap}"
            ?disabled="${this.groups.length === 0}"
          >
            OK
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
