import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import {
  HaxSchematizer,
  HaxElementizer,
} from "@haxtheweb/hax-body-behaviors/lib/HAXFields.js";
import "@haxtheweb/simple-fields/simple-fields.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";

class HAXCMSSiteDetailsDialog extends DDD {
  static get tag() {
    return "haxcms-site-details-dialog";
  }

  static get properties() {
    return {
      groups: { type: Array },
      values: { type: Object },
      errorMessage: { type: String, attribute: "error-message" },
      homePageOptions: { type: Object, attribute: false },
    };
  }

  constructor() {
    super();
    this.groups = [];
    this.values = {};
    this.errorMessage = "";
    this.homePageOptions = {
      "": "-- default to first page --",
    };
    this.__valueChangeLock = false;
    this.__groupValues = {};
    this.__manifestReaction = null;
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.__manifestReaction) {
      this.__manifestReaction = autorun(() => {
        this.refreshFromManifest(toJS(store.manifest));
      });
    }
  }

  disconnectedCallback() {
    if (this.__manifestReaction) {
      this.__manifestReaction();
      this.__manifestReaction = null;
    }
    super.disconnectedCallback();
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
          gap: var(--ddd-spacing-4);
        }
        details {
          max-width: 100%;
          min-width: 100%;
          box-sizing: border-box;
        }
        .group {
          width: 100%;
          border: var(--ddd-border-sm);
          border-radius: var(--ddd-radius-md);
          background: light-dark(
            var(--ddd-theme-default-white),
            rgba(0, 0, 0, 0.15)
          );
          padding: var(--ddd-spacing-4);
          box-sizing: border-box;
        }
        .group-summary {
          list-style: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-3);
          margin-bottom: 0;
        }
        .group[open] .group-summary {
          margin-bottom: var(--ddd-spacing-3);
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
        .group-summary h3 {
          margin: 0;
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
        }
        .group-body {
          padding: 0;
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
        button.action[disabled] {
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
          --simple-icon-width: var(--ddd-icon-xs);
          --simple-icon-height: var(--ddd-icon-xs);
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
          .group {
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

  _toBoolValue(value, fallback = false) {
    if (value === true || value === false) {
      return value;
    }
    if (value === "true" || value === "1" || value === 1) {
      return true;
    }
    if (value === "false" || value === "0" || value === 0) {
      return false;
    }
    return fallback;
  }

  _manifestItems(manifest) {
    if (
      store &&
      store.getManifestItems &&
      typeof store.getManifestItems === "function"
    ) {
      const manifestItems = store.getManifestItems(true);
      if (Array.isArray(manifestItems) && manifestItems.length > 0) {
        return manifestItems;
      }
    }
    if (manifest && Array.isArray(manifest.items)) {
      return manifest.items;
    }
    return [];
  }

  _buildHomePageOptions(manifest) {
    const itemManifest = this._manifestItems(manifest);
    const options = {
      "": "-- default to first page --",
    };
    itemManifest.forEach((item) => {
      if (!item || !item.id) {
        return;
      }
      let itemBuilder = item;
      let distance = "- ";
      while (itemBuilder && itemBuilder.parent != null) {
        itemBuilder = itemManifest.find((i) => i.id === itemBuilder.parent);
        if (itemBuilder) {
          distance = `--${distance}`;
        }
      }
      const itemTitle = item.title ? item.title : item.id;
      options[item.id] = `${distance}${itemTitle}`;
    });
    return options;
  }

  _buildDetailsGroups() {
    return [
      {
        key: "details",
        label: "Details",
        icon: "settings",
        open: true,
        fields: [
          {
            property: "manifest-title",
            title: "Title",
            description: "Name of the site",
            inputMethod: "textfield",
            required: true,
          },
          {
            property: "manifest-metadata-site-homePageId",
            title: "Home page",
            description: "Page to use as the default landing / home page",
            inputMethod: "select",
            options: this._cloneData(this.homePageOptions),
            required: false,
          },
        ],
      },
      {
        key: "advanced",
        label: "Advanced",
        icon: "hax:add-item",
        open: false,
        fields: [
          {
            property: "manifest-metadata-site-settings-sw",
            title: "Add service worker to dynamic page",
            description:
              "Disable this if users should always see the latest server output immediately.",
            inputMethod: "boolean",
            required: false,
          },
          {
            property: "manifest-metadata-site-settings-forceUpgrade",
            title: "Force browser upgrade",
            description:
              "Require evergreen browsers before loading the site experience.",
            inputMethod: "boolean",
            required: false,
          },
        ],
      },
    ];
  }

  _buildValueState(manifest) {
    const values = {};
    const metadata =
      manifest && manifest.metadata && typeof manifest.metadata === "object"
        ? manifest.metadata
        : {};
    const metadataSite =
      metadata && metadata.site && typeof metadata.site === "object"
        ? metadata.site
        : {};
    const siteSettings =
      metadataSite &&
      metadataSite.settings &&
      typeof metadataSite.settings === "object"
        ? metadataSite.settings
        : {};
    values["manifest-title"] =
      manifest && manifest.title ? String(manifest.title) : "";
    values["manifest-metadata-site-homePageId"] =
      metadataSite && metadataSite.homePageId
        ? String(metadataSite.homePageId)
        : "";
    values["manifest-metadata-site-settings-sw"] = this._toBoolValue(
      siteSettings.sw,
      true,
    );
    values["manifest-metadata-site-settings-forceUpgrade"] = this._toBoolValue(
      siteSettings.forceUpgrade,
      false,
    );
    return values;
  }

  refreshFromManifest(manifestData = null) {
    const manifest = manifestData || toJS(store.manifest);
    if (!manifest || !manifest.metadata) {
      this.groups = [];
      this.values = {};
      this.__groupValues = {};
      this.errorMessage = "Unable to load site details.";
      return;
    }
    this.__valueChangeLock = true;
    this.errorMessage = "";
    this.homePageOptions = this._buildHomePageOptions(manifest);
    this.groups = this._buildDetailsGroups();
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
      value[key] =
        typeof this.values[key] !== "undefined"
          ? this._cloneData(this.values[key])
          : "";
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
      if (JSON.stringify(this.values[key]) !== JSON.stringify(incoming[key])) {
        this.values[key] = incoming[key];
        changed = true;
      }
    });
    if (groupKey) {
      this.__groupValues[groupKey] = incoming;
    }
    if (!changed) {
      return;
    }
  }

  _buildSavePayload() {
    const title = this.values["manifest-title"]
      ? String(this.values["manifest-title"]).trim()
      : "";
    const homePageId = this.values["manifest-metadata-site-homePageId"]
      ? String(this.values["manifest-metadata-site-homePageId"]).trim()
      : "";
    const sw = this._toBoolValue(
      this.values["manifest-metadata-site-settings-sw"],
      true,
    );
    const forceUpgrade = this._toBoolValue(
      this.values["manifest-metadata-site-settings-forceUpgrade"],
      false,
    );
    return {
      title: title,
      homePageId: homePageId,
      sw: sw,
      forceUpgrade: forceUpgrade,
      manifest: {
        site: {
          "manifest-title": title,
          "manifest-metadata-site-homePageId": homePageId,
        },
        seo: {
          "manifest-metadata-site-settings-sw": sw,
          "manifest-metadata-site-settings-forceUpgrade": forceUpgrade,
        },
      },
    };
  }

  _saveSiteDetailsTap() {
    if (this.groups.length === 0) {
      return;
    }
    store.playSound("click");
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-save-site-data", {
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
          ${this.errorMessage
            ? html`<p class="error">${this.errorMessage}</p>`
            : ``}
          ${!this.errorMessage && this.groups.length === 0
            ? html`<p class="status">No site details are available.</p>`
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
                        <h3>${group.label}</h3>
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
            class="action"
            @click="${this._saveSiteDetailsTap}"
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
  HAXCMSSiteDetailsDialog.tag,
  HAXCMSSiteDetailsDialog,
);

export { HAXCMSSiteDetailsDialog };
