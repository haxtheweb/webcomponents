import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { licenseList } from "@haxtheweb/license-element/license-element.js";
import {
  HaxSchematizer,
  HaxElementizer,
} from "@haxtheweb/hax-body-behaviors/lib/HAXFields.js";
import "@haxtheweb/simple-fields/simple-fields.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";

class HAXCMSSEOAdminDialog extends DDD {
  static get tag() {
    return "haxcms-seo-admin-dialog";
  }

  static get properties() {
    return {
      groups: { type: Array },
      values: { type: Object },
      errorMessage: { type: String, attribute: "error-message" },
      licenseOptions: { type: Object, attribute: false },
      activeGroup: { type: String, attribute: "active-group" },
    };
  }

  constructor() {
    super();
    this.groups = [];
    this.values = {};
    this.errorMessage = "";
    this.licenseOptions = new licenseList("select");
    this.activeGroup = "seo";
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
            var(--simple-modal-height, 85vh) -
              var(--simple-modal-titlebar-height, 80px) - var(--ddd-spacing-8, 32px)
          );
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          min-width: 70vw;
          min-height: min(60vh, var(--haxcms-admin-panel-height));
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
          overflow: hidden;
        }
        .panel-scroll {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: var(--ddd-spacing-1);
          padding-bottom: var(--ddd-spacing-4);
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
          display: flex;
          flex-direction: column;
          min-height: 0;
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
            padding-bottom: 0;
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

  _firstDefinedString(values = []) {
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      if (typeof value !== "undefined" && value !== null) {
        const normalized = String(value).trim();
        if (normalized !== "") {
          return normalized;
        }
      }
    }
    return "";
  }

  _buildSeoGroups() {
    const options = this._cloneData(this.licenseOptions || {});
    const activeGroup = this.activeGroup === "author" ? "author" : "seo";
    return [
      {
        key: "seo",
        label: "SEO",
        icon: "icons:search",
        open: activeGroup === "seo",
        fields: [
          {
            property: "manifest-description",
            title: "Description",
            description: "Simple description of the site",
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "manifest-metadata-site-logo",
            title: "Favicon",
            description: "Browser tab image / used on phones as small site logo",
            inputMethod: "haxupload",
            required: false,
            noVoiceRecord: true,
          },
          {
            property: "manifest-metadata-site-domain",
            title: "Domain",
            description: "Domain of this website",
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "manifest-metadata-site-settings-lang",
            title: "Language",
            description:
              "ISO 639-1 language code for this site (for example, en, es, fr).",
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "manifest-metadata-site-settings-gaID",
            title: "Google Analytics ID",
            description: "Tracking ID used for analytics integrations",
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "manifest-metadata-site-settings-private",
            title: "Private site",
            description:
              "Prevent indexing and require authentication to access content",
            inputMethod: "boolean",
            required: false,
          },
          {
            property: "manifest-metadata-site-settings-canonical",
            title: "Canonical",
            description:
              "Treat domain as canonical to improve SEO consistency",
            inputMethod: "boolean",
            required: false,
          },
          {
            property: "manifest-metadata-site-settings-pathauto",
            title: "Pathauto",
            description: "Automatically maintain and update page paths",
            inputMethod: "boolean",
            required: false,
          },
          {
            property: "manifest-metadata-site-settings-publishPagesOn",
            title: "Show unpublished pages",
            description: "Whether unpublished pages should be visible",
            inputMethod: "boolean",
            required: false,
          },
        ],
      },
      {
        key: "author",
        label: "Author",
        icon: "social:person",
        open: activeGroup === "author",
        fields: [
          {
            property: "manifest-license",
            title: "License",
            description: "License applied to your site content",
            inputMethod: "select",
            options: options,
            required: false,
          },
          {
            property: "manifest-metadata-author-image",
            title: "Image",
            description: "Photo path or URL",
            inputMethod: "haxupload",
            required: false,
            noVoiceRecord: true,
          },
          {
            property: "manifest-metadata-author-name",
            title: "Name",
            description: "Author name",
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "manifest-metadata-author-email",
            title: "Email",
            description: "Primary email for author contact",
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "manifest-metadata-author-socialLink",
            title: "Social media link",
            description: "A primary social space or point of contact",
            inputMethod: "textfield",
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
    const metadataAuthor =
      metadata && metadata.author && typeof metadata.author === "object"
        ? metadata.author
        : {};
    const metadataSite =
      metadata && metadata.site && typeof metadata.site === "object"
        ? metadata.site
        : {};
    const topAuthorObject =
      manifest && manifest.author && typeof manifest.author === "object"
        ? manifest.author
        : {};
    const siteAuthorObject =
      metadata &&
      metadata.site &&
      metadata.site.author &&
      typeof metadata.site.author === "object"
        ? metadata.site.author
        : {};
    const topAuthorString =
      manifest && typeof manifest.author === "string" ? manifest.author : "";
    const siteSettings =
      metadataSite && metadataSite.settings && typeof metadataSite.settings === "object"
        ? metadataSite.settings
        : {};
    const seoSettings =
      manifest && manifest.seo && typeof manifest.seo === "object"
        ? manifest.seo
        : {};
    const license = this._firstDefinedString([
      manifest ? manifest.license : "",
      metadataAuthor.license,
      topAuthorObject.license,
      siteAuthorObject.license,
    ]);
    const authorImage = this._firstDefinedString([
      metadataAuthor.image,
      topAuthorObject.image,
      siteAuthorObject.image,
    ]);
    const authorName = this._firstDefinedString([
      metadataAuthor.name,
      topAuthorObject.name,
      siteAuthorObject.name,
      topAuthorString,
    ]);
    const authorSocialLink = this._firstDefinedString([
      metadataAuthor.socialLink,
      topAuthorObject.socialLink,
      siteAuthorObject.socialLink,
      topAuthorObject.social,
      siteAuthorObject.social,
    ]);
    const authorEmail = this._firstDefinedString([
      metadataAuthor.email,
      topAuthorObject.email,
      siteAuthorObject.email,
    ]);
    const domain = this._firstDefinedString([metadataSite.domain]);
    const siteDescription = this._firstDefinedString([
      manifest ? manifest.description : "",
    ]);
    const favicon = this._firstDefinedString([metadataSite.logo]);
    const lang = this._firstDefinedString([
      siteSettings.lang,
      seoSettings.lang,
    ]);
    const gaID = this._firstDefinedString([
      siteSettings.gaID,
      seoSettings.gaID,
    ]);
    const privateSite =
      typeof siteSettings.private !== "undefined"
        ? siteSettings.private
        : seoSettings.private;
    const canonical =
      typeof siteSettings.canonical !== "undefined"
        ? siteSettings.canonical
        : seoSettings.canonical;
    const pathauto =
      typeof siteSettings.pathauto !== "undefined"
        ? siteSettings.pathauto
        : seoSettings.pathauto;
    const publishPagesOn =
      typeof siteSettings.publishPagesOn !== "undefined"
        ? siteSettings.publishPagesOn
        : seoSettings.publishPagesOn;
    values["manifest-license"] = license !== "" ? license : "by-sa";
    values["manifest-metadata-author-image"] = authorImage;
    values["manifest-metadata-author-name"] = authorName;
    values["manifest-metadata-author-email"] = authorEmail;
    values["manifest-metadata-author-socialLink"] = authorSocialLink;
    values["manifest-description"] = siteDescription;
    values["manifest-metadata-site-logo"] = favicon;
    values["manifest-metadata-site-domain"] = domain;
    values["manifest-metadata-site-settings-lang"] = lang;
    values["manifest-metadata-site-settings-gaID"] = gaID;
    values["manifest-metadata-site-settings-private"] = this._toBoolValue(
      privateSite,
      false,
    );
    values["manifest-metadata-site-settings-canonical"] = this._toBoolValue(
      canonical,
      true,
    );
    values["manifest-metadata-site-settings-pathauto"] = this._toBoolValue(
      pathauto,
      true,
    );
    values["manifest-metadata-site-settings-publishPagesOn"] = this._toBoolValue(
      publishPagesOn,
      true,
    );
    return values;
  }

  refreshFromManifest(manifestData = null) {
    const manifest = manifestData || toJS(store.manifest);
    if (!manifest || !manifest.metadata) {
      this.groups = [];
      this.values = {};
      this.__groupValues = {};
      this.errorMessage = "Unable to load SEO settings.";
      return;
    }
    this.__valueChangeLock = true;
    this.errorMessage = "";
    this.groups = this._buildSeoGroups();
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
    return {
      license: this.values["manifest-license"]
        ? String(this.values["manifest-license"])
        : "by-sa",
      description: this.values["manifest-description"]
        ? String(this.values["manifest-description"])
        : "",
      logo: this.values["manifest-metadata-site-logo"]
        ? String(this.values["manifest-metadata-site-logo"])
        : "",
      domain: this.values["manifest-metadata-site-domain"]
        ? String(this.values["manifest-metadata-site-domain"])
        : "",
      lang: this.values["manifest-metadata-site-settings-lang"]
        ? String(this.values["manifest-metadata-site-settings-lang"])
        : "",
      gaID: this.values["manifest-metadata-site-settings-gaID"]
        ? String(this.values["manifest-metadata-site-settings-gaID"])
        : "",
      private: this._toBoolValue(
        this.values["manifest-metadata-site-settings-private"],
        false,
      ),
      canonical: this._toBoolValue(
        this.values["manifest-metadata-site-settings-canonical"],
        true,
      ),
      authorImage: this.values["manifest-metadata-author-image"]
        ? String(this.values["manifest-metadata-author-image"])
        : "",
      authorName: this.values["manifest-metadata-author-name"]
        ? String(this.values["manifest-metadata-author-name"])
        : "",
      authorEmail: this.values["manifest-metadata-author-email"]
        ? String(this.values["manifest-metadata-author-email"])
        : "",
      authorSocialLink: this.values["manifest-metadata-author-socialLink"]
        ? String(this.values["manifest-metadata-author-socialLink"])
        : "",
      pathauto: this._toBoolValue(
        this.values["manifest-metadata-site-settings-pathauto"],
        true,
      ),
      publishPagesOn: this._toBoolValue(
        this.values["manifest-metadata-site-settings-publishPagesOn"],
        true,
      ),
    };
  }

  _saveSEOSettingsTap() {
    if (this.groups.length === 0) {
      return;
    }
    store.playSound("click");
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-save-seo-data", {
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
            ? html`<p class="status">No SEO settings are available.</p>`
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
            @click="${this._saveSEOSettingsTap}"
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
  HAXCMSSEOAdminDialog.tag,
  HAXCMSSEOAdminDialog,
);

export { HAXCMSSEOAdminDialog };
