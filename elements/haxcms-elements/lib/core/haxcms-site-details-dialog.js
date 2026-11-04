import { HaxcmsAdminPanelStyles } from "./admin/HaxcmsAdminPanelStyles.js";
import { HaxcmsAdminFieldsMixin } from "./admin/HaxcmsAdminSectionMixin.js";
import { html, css, nothing } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import {
  HaxUiAdminStyles,
  HaxUiAdminIcons,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminStyles.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";

/**
 * `haxcms-site-details-dialog`
 * The Details admin section: site title, home page and two advanced
 * switches. Renders inside the one admin dialog (haxcms-site-admin) and
 * implements its section contract: it stages edits, reports them with
 * `haxcms-admin-section-state`, and its `save()` fires the same
 * `haxcms-save-site-data` event and payload as before.
 */
class HAXCMSSiteDetailsDialog extends HaxcmsAdminFieldsMixin(I18NMixin(DDD)) {
  static get tag() {
    return "haxcms-site-details-dialog";
  }

  static get properties() {
    return {
      groups: { type: Array },
      values: { type: Object },
      errorMessage: { type: String, attribute: "error-message" },
      homePageItemsList: { type: Array, attribute: false },
      /** set by haxcms-site-admin: the shell owns the Save button */
      inShell: { type: Boolean, attribute: "in-shell", reflect: true },
    };
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      defaultToFirstPage: "-- default to first page --",
      details: "Details",
      title: "Title",
      titleDescription: "Name of the site",
      homePage: "Home page",
      homePageDescription: "Page to use as the default landing / home page",
      advanced: "Advanced",
      serviceWorker: "Add service worker to dynamic page",
      serviceWorkerDescription:
        "Disable this if users should always see the latest server output immediately.",
      forceBrowserUpgrade: "Force browser upgrade",
      forceBrowserUpgradeDescription:
        "Require evergreen browsers before loading the site experience.",
      unableToLoadSiteDetails: "Unable to load site details.",
      noSiteDetails: "No site details are available.",
      save: "Save",
      titleRequired: "Enter a title for the site.",
      changed: "changed",
      on: "On",
      off: "Off",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../locales/", import.meta.url).href,
    });
    this.groups = [];
    this.values = {};
    this.errorMessage = "";
    this.inShell = false;
    this.i18nDefault("homePageItemsList", (t) => [
      { value: "", text: t.defaultToFirstPage },
    ]);
    this.__baseline = {};
    this.__manifestReaction = null;
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.__manifestReaction) {
      this.__manifestReaction = autorun(() => {
        const _mobx_val_0 = toJS(store.manifest);
        Promise.resolve().then(() => {
          this.refreshFromManifest(_mobx_val_0);
        });
      });
    }
  }

  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminStyles,
      HaxcmsAdminPanelStyles,
      css`
        .msg {
          display: inline-flex;
          margin-top: var(--hax-ui-gap-md);
          padding: var(--hax-ui-gap) var(--hax-ui-gap-md);
          border-radius: var(--hax-ui-radius);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-danger);
          background-color: var(--hax-ui-danger-soft);
        }
        .swrow {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-lg);
          min-height: var(--ddd-textfield-height-sm, 40px);
          font-size: 13px;
          color: var(--hax-ui-text-muted);
        }
        /* status lines are the shared .hax-ui-message (danger tone for
           errors); only the spacing is local */
        .status {
          margin: var(--ddd-spacing-4, 16px) 0 0;
        }
        .standalone-actions {
          display: flex;
          justify-content: flex-end;
          padding-top: var(--ddd-spacing-4, 16px);
        }
      `,
    ];
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

  // Build an ordered items list (not a keyed `options` object) because
  // simple-fields-field's `options` property is always re-sorted
  // alphabetically by key before rendering, which would scramble the page
  // hierarchy/order presented here. `itemsList` preserves given order.
  _buildHomePageItemsList(manifest) {
    const itemManifest = this._manifestItems(manifest);
    const items = [{ value: "", text: this.t.defaultToFirstPage }];
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
      items.push({ value: item.id, text: `${distance}${itemTitle}` });
    });
    return items;
  }

  _buildDetailsGroups() {
    return [
      {
        key: "details",
        label: this.t.details,
        icon: HaxUiAdminIcons.details,
        open: true,
        fields: [
          {
            property: "manifest-title",
            title: this.t.title,
            description: this.t.titleDescription,
            inputMethod: "textfield",
            required: true,
          },
          {
            property: "manifest-metadata-site-homePageId",
            title: this.t.homePage,
            description: this.t.homePageDescription,
            inputMethod: "select",
            itemsList: this._cloneData(this.homePageItemsList),
            required: false,
          },
        ],
      },
      {
        key: "advanced",
        label: this.t.advanced,
        icon: HaxUiAdminIcons.advanced,
        open: false,
        fields: [
          {
            property: "manifest-metadata-site-settings-sw",
            title: this.t.serviceWorker,
            description: this.t.serviceWorkerDescription,
            inputMethod: "boolean",
            required: false,
          },
          {
            property: "manifest-metadata-site-settings-forceUpgrade",
            title: this.t.forceBrowserUpgrade,
            description: this.t.forceBrowserUpgradeDescription,
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
      this.__baseline = {};
      this.errorMessage = this.t.unableToLoadSiteDetails;
      this._emitState();
      return;
    }
    this.errorMessage = "";
    this.homePageItemsList = this._buildHomePageItemsList(manifest);
    this.groups = this._buildDetailsGroups();
    this.values = this._buildValueState(manifest);
    this.__baseline = this._cloneData(this.values);
    this._emitState();
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

  /** field properties whose value differs from what was loaded */
  get changedFields() {
    const changed = [];
    this.groups.forEach((group) => {
      group.fields.forEach((field) => {
        const key = field.property;
        if (
          JSON.stringify(this.values[key]) !==
          JSON.stringify(this.__baseline[key])
        ) {
          changed.push(field);
        }
      });
    });
    return changed;
  }

  get canSave() {
    if (this.groups.length === 0) {
      return false;
    }
    const title = this.values["manifest-title"]
      ? String(this.values["manifest-title"]).trim()
      : "";
    return title !== "";
  }

  _setValue(key, value) {
    this.values = Object.assign({}, this.values, { [key]: value });
    this._emitState();
  }

  /** section contract: restore the values that were loaded */
  discard() {
    this.values = this._cloneData(this.__baseline);
    this._emitState();
  }

  /**
   * section contract: send the save. Fires the same haxcms-save-site-data
   * event and payload as before; the shell waits for
   * haxcms-admin-save-result.
   * @returns {boolean} true when a save was sent
   */
  save() {
    if (!this.canSave) {
      return false;
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

  _renderLabel(field, id) {
    return html`<div>
      <label class="lab" for="${id}" id="${id}-label"
        >${
          this._isChanged(field.property)
            ? html`<span
                class="dot"
                role="img"
                aria-label="${this.t.changed}"
              ></span>`
            : nothing
        }${field.title}</label
      ><span class="help" id="${id}-help">${field.description}</span>
    </div>`;
  }

  _renderField(field) {
    const key = field.property;
    const id = `f-${key}`;
    const value = this.values[key];
    switch (field.inputMethod) {
      case "select":
        return html`<div class="fr">
          ${this._renderLabel(field, id)}
          <select
            class="hax-ui-select"
            id="${id}"
            name="${key}"
            aria-describedby="${id}-help"
            @change="${(e) => this._setValue(key, e.target.value)}"
          >
            ${(field.itemsList || []).map(
              (item) =>
                html`<option
                  value="${item.value}"
                  ?selected="${String(value || "") === String(item.value)}"
                >
                  ${item.text}
                </option>`,
            )}
          </select>
        </div>`;
      case "boolean":
        return html`<div class="fr">
          ${this._renderLabel(field, id)}
          <div class="swrow">
            <button
              type="button"
              class="hax-ui-switch"
              id="${id}"
              name="${key}"
              role="switch"
              aria-checked="${value ? "true" : "false"}"
              aria-labelledby="${id}-label"
              aria-describedby="${id}-help"
              @click="${() => this._setValue(key, !value)}"
            ></button>
            <span aria-hidden="true">${value ? this.t.on : this.t.off}</span>
          </div>
        </div>`;
      default: {
        const invalid = field.required && String(value || "").trim() === "";
        return html`<div class="fr">
          ${this._renderLabel(field, id)}
          <div>
            <input
              type="text"
              class="hax-ui-input"
              id="${id}"
              name="${key}"
              .value="${value || ""}"
              ?required="${field.required}"
              aria-invalid="${invalid ? "true" : "false"}"
              aria-describedby="${id}-help${invalid ? ` ${id}-msg` : ""}"
              @input="${(e) => this._setValue(key, e.target.value)}"
            />
            ${
              invalid
                ? html`<span class="msg" id="${id}-msg"
                    >${this.t.titleRequired}</span
                  >`
                : nothing
            }
          </div>
        </div>`;
      }
    }
  }

  render() {
    return html`
      ${
        this.errorMessage
          ? html`<p
              class="hax-ui-message status"
              data-tone="danger"
              role="alert"
            >
              ${this.errorMessage}
            </p>`
          : nothing
      }
      ${
        !this.errorMessage && this.groups.length === 0
          ? html`<p class="hax-ui-message status">${this.t.noSiteDetails}</p>`
          : nothing
      }
      ${this.groups.map(
        (group) => html`
          <details ?open="${group.open}" data-group="${group.key}">
            <summary>
              <simple-icon-lite
                icon="${HaxUiAdminIcons.chevron}"
                aria-hidden="true"
              ></simple-icon-lite>
              <h3>${group.label}</h3>
            </summary>
            ${group.fields.map((field) => this._renderField(field))}
          </details>
        `,
      )}
      ${
        !this.inShell
          ? html`<div class="standalone-actions">
              <button
                type="button"
                class="hax-ui-btn primary"
                ?disabled="${!this.canSave}"
                @click="${this.save}"
              >
                ${this.t.save}
              </button>
            </div>`
          : nothing
      }
    `;
  }
}

globalThis.customElements.define(
  HAXCMSSiteDetailsDialog.tag,
  HAXCMSSiteDetailsDialog,
);

export { HAXCMSSiteDetailsDialog };
