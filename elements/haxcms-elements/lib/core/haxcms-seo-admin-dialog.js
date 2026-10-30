import { html, css, nothing } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { licenseList } from "@haxtheweb/license-element/license-element.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminPrimitives,
} from "@haxtheweb/hax-body/lib/hax-ui-styles.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import "./haxcms-language-picker.js";

/**
 * `haxcms-seo-admin-dialog`
 * The SEO admin section: how the site is described and found (SEO group)
 * and who made it (Author group). The "author" admin route renders this
 * same element with `activeGroup` set to "author", which opens that group.
 * Renders inside the one admin dialog (haxcms-site-admin) and implements
 * its section contract: it stages edits, reports them with
 * `haxcms-admin-section-state`, and its `save()` fires the same
 * `haxcms-save-seo-data` event and payload as before.
 */
class HAXCMSSEOAdminDialog extends I18NMixin(DDD) {
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
      /** set by haxcms-site-admin: the shell owns the Save button */
      inShell: { type: Boolean, attribute: "in-shell", reflect: true },
    };
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      author: "Author",
      description: "Description",
      descriptionDescription: "Simple description of the site",
      favicon: "Favicon",
      faviconDescription:
        "Browser tab image / used on phones as small site logo",
      domain: "Domain",
      domainDescription: "Domain of this website",
      language: "Language",
      languageDescription:
        "Language of this site. Search by name or code, or enter another code such as fr-CA.",
      googleAnalyticsId: "Google Analytics ID",
      googleAnalyticsIdDescription:
        "Tracking ID used for analytics integrations",
      privateSite: "Private site",
      privateSiteDescription:
        "Prevent indexing and require authentication to access content",
      canonical: "Canonical",
      canonicalDescription:
        "Treat domain as canonical to improve SEO consistency",
      pathauto: "Pathauto",
      pathautoDescription: "Automatically maintain and update page paths",
      hideUnpublishedPages: "Hide unpublished pages",
      hideUnpublishedPagesDescription:
        "Check the box to hide unpublished pages",
      license: "License",
      licenseDescription: "License applied to your site content",
      image: "Image",
      imageDescription: "Photo path or URL",
      name: "Name",
      nameDescription: "Author name",
      email: "Email",
      emailDescription: "Primary email for author contact",
      socialMediaLink: "Social media link",
      socialMediaLinkDescription: "A primary social space or point of contact",
      socialMediaLink2: "Social media link 2",
      socialMediaLink2Description:
        "An additional social space or point of contact",
      phone: "Phone",
      phoneDescription: "Phone number for contact",
      location: "Location",
      locationDescription: "Author location or address",
      website: "Website",
      websiteDescription: "Personal website or portfolio URL",
      website2: "Website 2",
      website2Description: "Additional website URL",
      unableToLoadSeoSettings: "Unable to load SEO settings.",
      noSeoSettings: "No SEO settings are available.",
      normalizeSlugs: "Normalize slugs",
      save: "Save",
      seo: "SEO",
      changed: "changed",
      hasChanges: "has changes",
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
    this.licenseOptions = new licenseList("select");
    this.activeGroup = "seo";
    this.inShell = false;
    this.__baseline = {};
    this.__manifestReaction = null;
  }

  connectedCallback() {
    super.connectedCallback();
    // the upload field (and its file actions) comes from hax-body; load it
    // the way the HAX elementizer used to, only once the section is shown
    import("@haxtheweb/hax-body/lib/hax-upload-field.js");
    if (!this.__manifestReaction) {
      this.__manifestReaction = autorun(() => {
        const _mobx_val_0 = toJS(store.manifest);
        Promise.resolve().then(() => {
          this.refreshFromManifest(_mobx_val_0);
        });
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
          transition: transform var(--hax-ui-duration) var(--hax-ui-easing);
        }
        details[open] > summary simple-icon-lite {
          transform: rotate(90deg);
        }
        summary h3 {
          margin: 0;
          font-size: var(--hax-ui-admin-font-size);
          font-weight: inherit;
        }
        .fr {
          display: grid;
          grid-template-columns: minmax(160px, 240px) minmax(0, 480px);
          gap: var(--ddd-spacing-6, 24px);
          align-items: start;
          padding: var(--hax-ui-gap-lg) var(--hax-ui-gap-md);
          border-bottom: 1px solid var(--hax-ui-line);
        }
        .lab {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .help {
          display: block;
          margin-top: 2px;
          font-size: var(--hax-ui-admin-font-size-xs);
          line-height: 1.35;
          color: var(--hax-ui-text-muted);
        }
        .dot {
          width: 8px;
          height: 8px;
          flex: none;
          border-radius: 50%;
          background-color: var(--hax-ui-accent-strong);
        }
        input[type="text"],
        select {
          width: 100%;
          height: var(--ddd-textfield-height-sm, 40px);
          padding: 0 var(--hax-ui-gap-lg);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          font-family: var(--ddd-font-primary, sans-serif);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
        }
        input[type="text"]:focus-visible,
        select:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 1px;
        }
        /* the row draws the visible label (label-hidden keeps it as the
           control's accessible name); size the picker like the inputs */
        haxcms-language-picker {
          --haxcms-language-picker-font-size: var(--hax-ui-admin-font-size);
          --haxcms-language-picker-option-font-size: var(
            --hax-ui-admin-font-size
          );
          --haxcms-language-picker-input-height: var(
            --ddd-textfield-height-sm,
            40px
          );
          --haxcms-language-picker-border: 1px solid;
          --haxcms-language-picker-border-color: var(--hax-ui-line-strong);
          --haxcms-language-picker-radius: var(--hax-ui-radius);
          font-family: var(--ddd-font-primary, sans-serif);
        }
        /* compact: one row at the control height, small Image info row */
        hax-upload-field {
          --hax-upload-field-font-size: var(--hax-ui-admin-font-size);
          --hax-upload-field-control-height: var(
            --ddd-textfield-height-sm,
            40px
          );
          --hax-upload-field-info-height: var(--hax-ui-row-height);
        }
        .swrow {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-lg);
          min-height: var(--ddd-textfield-height-sm, 40px);
          font-size: 13px;
          color: var(--hax-ui-text-muted);
        }
        .swrow .spacer {
          flex: 1;
        }
        .sw {
          all: unset;
          cursor: pointer;
          position: relative;
          flex: none;
          width: 36px;
          height: 20px;
          border-radius: var(--hax-ui-radius-pill);
          background-color: var(--hax-ui-line-strong);
        }
        .sw::after {
          content: "";
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: var(--ddd-theme-default-white, #fff);
          transition: left var(--hax-ui-duration) var(--hax-ui-easing);
        }
        .sw[aria-checked="true"] {
          background-color: var(--hax-ui-accent-strong);
        }
        .sw[aria-checked="true"]::after {
          left: 18px;
        }
        .sw:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .btn,
        .standalone-actions button {
          height: var(--hax-ui-row-height);
          padding: 0 var(--hax-ui-gap-lg);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius);
          font: inherit;
          font-size: 13px;
          font-weight: var(--ddd-font-weight-medium, 500);
          white-space: nowrap;
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
          cursor: pointer;
        }
        .btn:hover,
        .standalone-actions button:hover {
          background-color: var(--hax-ui-hover);
        }
        .btn:focus-visible,
        .standalone-actions button:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .standalone-actions button {
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .standalone-actions button[disabled] {
          opacity: 0.45;
          cursor: not-allowed;
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
        .standalone-actions {
          display: flex;
          justify-content: flex-end;
          padding-top: var(--ddd-spacing-4, 16px);
        }
        @media (max-width: 768px) {
          :host {
            padding: var(--hax-ui-gap) var(--ddd-spacing-4, 16px)
              var(--ddd-spacing-6, 24px);
          }
          .fr {
            grid-template-columns: minmax(0, 1fr);
            gap: var(--hax-ui-gap-md);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          summary simple-icon-lite,
          .sw::after {
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
        label: this.t.seo,
        icon: "hax:admin-seo",
        open: activeGroup === "seo",
        fields: [
          {
            property: "manifest-description",
            title: this.t.description,
            description: this.t.descriptionDescription,
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "manifest-metadata-site-logo",
            title: this.t.favicon,
            description: this.t.faviconDescription,
            inputMethod: "haxupload",
            required: false,
            fileActions: true,
            noVoiceRecord: true,
            noScreenRecord: true,
          },
          {
            property: "manifest-metadata-site-domain",
            title: this.t.domain,
            description: this.t.domainDescription,
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "manifest-metadata-site-settings-lang",
            title: this.t.language,
            description: this.t.languageDescription,
            inputMethod: "haxcms-language-picker",
            allowCustom: true,
            required: false,
          },
          {
            property: "manifest-metadata-site-settings-gaID",
            title: this.t.googleAnalyticsId,
            description: this.t.googleAnalyticsIdDescription,
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "manifest-metadata-site-settings-private",
            title: this.t.privateSite,
            description: this.t.privateSiteDescription,
            inputMethod: "boolean",
            required: false,
          },
          {
            property: "manifest-metadata-site-settings-canonical",
            title: this.t.canonical,
            description: this.t.canonicalDescription,
            inputMethod: "boolean",
            required: false,
          },
          {
            property: "manifest-metadata-site-settings-pathauto",
            title: this.t.pathauto,
            description: this.t.pathautoDescription,
            inputMethod: "boolean",
            required: false,
          },
          {
            property: "manifest-metadata-site-settings-publishPagesOn",
            title: this.t.hideUnpublishedPages,
            description: this.t.hideUnpublishedPagesDescription,
            inputMethod: "boolean",
            required: false,
          },
        ],
      },
      {
        key: "author",
        label: this.t.author,
        icon: "hax:admin-author",
        open: activeGroup === "author",
        fields: [
          {
            property: "manifest-license",
            title: this.t.license,
            description: this.t.licenseDescription,
            inputMethod: "select",
            options: options,
            required: false,
          },
          {
            property: "manifest-metadata-author-image",
            title: this.t.image,
            description: this.t.imageDescription,
            inputMethod: "haxupload",
            required: false,
            fileActions: true,
            noVoiceRecord: true,
            noScreenRecord: true,
          },
          {
            property: "manifest-metadata-author-name",
            title: this.t.name,
            description: this.t.nameDescription,
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "manifest-metadata-author-email",
            title: this.t.email,
            description: this.t.emailDescription,
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "manifest-metadata-author-socialLink",
            title: this.t.socialMediaLink,
            description: this.t.socialMediaLinkDescription,
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "manifest-metadata-author-socialLink2",
            title: this.t.socialMediaLink2,
            description: this.t.socialMediaLink2Description,
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "manifest-metadata-author-phone",
            title: this.t.phone,
            description: this.t.phoneDescription,
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "manifest-metadata-author-location",
            title: this.t.location,
            description: this.t.locationDescription,
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "manifest-metadata-author-website",
            title: this.t.website,
            description: this.t.websiteDescription,
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "manifest-metadata-author-website2",
            title: this.t.website2,
            description: this.t.website2Description,
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
      metadataSite &&
      metadataSite.settings &&
      typeof metadataSite.settings === "object"
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
    const authorSocialLink2 = this._firstDefinedString([
      metadataAuthor.socialLink2,
      topAuthorObject.socialLink2,
      siteAuthorObject.socialLink2,
    ]);
    const authorPhone = this._firstDefinedString([
      metadataAuthor.phone,
      topAuthorObject.phone,
      siteAuthorObject.phone,
    ]);
    const authorLocation = this._firstDefinedString([
      metadataAuthor.location,
      topAuthorObject.location,
      siteAuthorObject.location,
    ]);
    const authorWebsite = this._firstDefinedString([
      metadataAuthor.website,
      topAuthorObject.website,
      siteAuthorObject.website,
    ]);
    const authorWebsite2 = this._firstDefinedString([
      metadataAuthor.website2,
      topAuthorObject.website2,
      siteAuthorObject.website2,
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
    values["manifest-metadata-author-socialLink2"] = authorSocialLink2;
    values["manifest-metadata-author-phone"] = authorPhone;
    values["manifest-metadata-author-location"] = authorLocation;
    values["manifest-metadata-author-website"] = authorWebsite;
    values["manifest-metadata-author-website2"] = authorWebsite2;
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
      false,
    );
    values["manifest-metadata-site-settings-publishPagesOn"] =
      this._toBoolValue(publishPagesOn, true);
    return values;
  }

  refreshFromManifest(manifestData = null) {
    const manifest = manifestData || toJS(store.manifest);
    if (!manifest || !manifest.metadata) {
      this.groups = [];
      this.values = {};
      this.__baseline = {};
      this.errorMessage = this.t.unableToLoadSeoSettings;
      this._emitState();
      return;
    }
    this.errorMessage = "";
    this.groups = this._buildSeoGroups();
    this.values = this._buildValueState(manifest);
    this.__baseline = this._cloneData(this.values);
    this._emitState();
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    // the editor picks the group (seo or author) before the section shows;
    // open that one if it changes after the groups were built
    if (
      changedProperties.has("activeGroup") &&
      typeof changedProperties.get("activeGroup") !== "undefined" &&
      this.groups.length > 0
    ) {
      const activeGroup = this.activeGroup === "author" ? "author" : "seo";
      this.groups = this.groups.map((group) =>
        Object.assign({}, group, { open: group.key === activeGroup }),
      );
    }
  }

  /** fields whose value differs from what was loaded */
  get changedFields() {
    const changed = [];
    this.groups.forEach((group) => {
      group.fields.forEach((field) => {
        if (this._isChanged(field.property)) {
          changed.push(field);
        }
      });
    });
    return changed;
  }

  /** same rule as the old Save button: nothing to save without settings */
  get canSave() {
    return this.groups.length > 0;
  }

  _emitState() {
    const changed = this.changedFields;
    this.dispatchEvent(
      new CustomEvent("haxcms-admin-section-state", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          dirty: changed.length > 0,
          changes: changed.map((field) => field.title),
          canSave: this.canSave,
        },
      }),
    );
  }

  _setValue(key, value) {
    if (JSON.stringify(this.values[key]) === JSON.stringify(value)) {
      return;
    }
    this.values = Object.assign({}, this.values, { [key]: value });
    this._emitState();
  }

  _isChanged(key) {
    return (
      JSON.stringify(this.values[key]) !== JSON.stringify(this.__baseline[key])
    );
  }

  /** section contract: restore the values that were loaded */
  discard() {
    this.values = this._cloneData(this.__baseline);
    this._emitState();
    // a select the person changed keeps its own choice over ?selected
    this.updateComplete.then(() => {
      if (!this.shadowRoot) {
        return;
      }
      this.shadowRoot.querySelectorAll("select[name]").forEach((select) => {
        const v = this.values ? this.values[select.name] : "";
        select.value = v === undefined || v === null ? "" : String(v);
      });
    });
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
      authorSocialLink2: this.values["manifest-metadata-author-socialLink2"]
        ? String(this.values["manifest-metadata-author-socialLink2"])
        : "",
      authorPhone: this.values["manifest-metadata-author-phone"]
        ? String(this.values["manifest-metadata-author-phone"])
        : "",
      authorLocation: this.values["manifest-metadata-author-location"]
        ? String(this.values["manifest-metadata-author-location"])
        : "",
      authorWebsite: this.values["manifest-metadata-author-website"]
        ? String(this.values["manifest-metadata-author-website"])
        : "",
      authorWebsite2: this.values["manifest-metadata-author-website2"]
        ? String(this.values["manifest-metadata-author-website2"])
        : "",
      pathauto: this._toBoolValue(
        this.values["manifest-metadata-site-settings-pathauto"],
        false,
      ),
      publishPagesOn: this._toBoolValue(
        this.values["manifest-metadata-site-settings-publishPagesOn"],
        true,
      ),
    };
  }

  _normalizeSlugsTap() {
    store.playSound("click");
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-normalize-slugs", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {},
      }),
    );
  }

  /**
   * section contract: send the save. Fires the same haxcms-save-seo-data
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
      new CustomEvent("haxcms-save-seo-data", {
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

  _renderLabel(field, id, useLabel = true) {
    const dot = this._isChanged(field.property)
      ? html`<span
          class="dot"
          role="img"
          aria-label="${this.t.changed}"
        ></span>`
      : nothing;
    return html`<div>
      ${useLabel
        ? html`<label class="lab" for="${id}" id="${id}-label"
            >${dot}${field.title}</label
          >`
        : html`<span class="lab" id="${id}-label">${dot}${field.title}</span>`}
      <span class="help" id="${id}-help">${field.description}</span>
    </div>`;
  }

  _renderSelectOptions(field, value) {
    const options = field.options || {};
    const keys = Object.keys(options);
    const current = String(value || "");
    // keep a value the list does not know visible instead of showing the
    // first option as if it were chosen
    if (current !== "" && keys.indexOf(current) === -1) {
      keys.unshift(current);
    }
    return keys.map(
      (key) =>
        html`<option value="${key}" ?selected="${current === key}">
          ${Object.prototype.hasOwnProperty.call(options, key)
            ? options[key]
            : key}
        </option>`,
    );
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
            id="${id}"
            name="${key}"
            aria-describedby="${id}-help"
            @change="${(e) => this._setValue(key, e.target.value)}"
          >
            ${this._renderSelectOptions(field, value)}
          </select>
        </div>`;
      case "boolean":
        return html`<div class="fr">
          ${this._renderLabel(field, id)}
          <div class="swrow">
            <button
              type="button"
              class="sw"
              id="${id}"
              name="${key}"
              role="switch"
              aria-checked="${value ? "true" : "false"}"
              aria-labelledby="${id}-label"
              aria-describedby="${id}-help"
              @click="${() => this._setValue(key, !value)}"
            ></button>
            <span aria-hidden="true">${value ? this.t.on : this.t.off}</span>
            ${key === "manifest-metadata-site-settings-pathauto"
              ? html`<span class="spacer"></span
                  ><button
                    type="button"
                    class="btn normalize"
                    @click="${this._normalizeSlugsTap}"
                  >
                    ${this.t.normalizeSlugs}
                  </button>`
              : nothing}
          </div>
        </div>`;
      case "haxupload":
        return html`<div class="fr">
          ${this._renderLabel(field, id, false)}
          <hax-upload-field
            id="${id}"
            name="${key}"
            label="${field.title}"
            compact
            label-hidden
            .value="${value || ""}"
            .fileActions="${!!field.fileActions}"
            ?no-voice-record="${field.noVoiceRecord}"
            ?no-screen-record="${field.noScreenRecord}"
            @value-changed="${(e) =>
              this._setValue(
                key,
                e.detail && typeof e.detail.value === "string"
                  ? e.detail.value
                  : "",
              )}"
          ></hax-upload-field>
        </div>`;
      case "haxcms-language-picker":
        return html`<div class="fr">
          ${this._renderLabel(field, id, false)}
          <haxcms-language-picker
            id="${id}"
            name="${key}"
            label="${field.title}"
            label-hidden
            .value="${value || ""}"
            ?allow-custom="${field.allowCustom}"
            @value-changed="${(e) =>
              this._setValue(
                key,
                e.detail && typeof e.detail.value === "string"
                  ? e.detail.value
                  : "",
              )}"
          ></haxcms-language-picker>
        </div>`;
      default:
        return html`<div class="fr">
          ${this._renderLabel(field, id)}
          <input
            type="text"
            id="${id}"
            name="${key}"
            .value="${value || ""}"
            aria-describedby="${id}-help"
            @input="${(e) => this._setValue(key, e.target.value)}"
          />
        </div>`;
    }
  }

  _groupChanged(group) {
    return group.fields.some((field) => this._isChanged(field.property));
  }

  render() {
    return html`
      ${this.errorMessage
        ? html`<p class="status error" role="alert">${this.errorMessage}</p>`
        : nothing}
      ${!this.errorMessage && this.groups.length === 0
        ? html`<p class="status">${this.t.noSeoSettings}</p>`
        : nothing}
      ${!this.errorMessage
        ? this.groups.map(
            (group) => html`
              <details ?open="${group.open}" data-group="${group.key}">
                <summary>
                  <simple-icon-lite
                    icon="hax:admin-chevron"
                    aria-hidden="true"
                  ></simple-icon-lite>
                  <h3>${group.label}</h3>
                  ${this._groupChanged(group)
                    ? html`<span
                        class="dot"
                        role="img"
                        aria-label="${this.t.hasChanges}"
                      ></span>`
                    : nothing}
                </summary>
                ${group.fields.map((field) => this._renderField(field))}
              </details>
            `,
          )
        : nothing}
      ${!this.inShell
        ? html`<div class="standalone-actions">
            <button
              type="button"
              class="save"
              ?disabled="${!this.canSave}"
              @click="${this.save}"
            >
              ${this.t.save}
            </button>
          </div>`
        : nothing}
    `;
  }
}

globalThis.customElements.define(
  HAXCMSSEOAdminDialog.tag,
  HAXCMSSEOAdminDialog,
);

export { HAXCMSSEOAdminDialog };
