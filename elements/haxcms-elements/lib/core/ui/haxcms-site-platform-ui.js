import { html, css, nothing } from "lit";
import { autorun, toJS } from "mobx";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXCMSI18NMixin } from "../utils/HAXCMSI18NMixin.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminPrimitives,
} from "@haxtheweb/hax-body/lib/hax-ui-styles.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-body/lib/hax-text-editor-toolbar.js";

const FEATURE_DEFS = [
  {
    key: "addPage",
    label: "Add pages",
    icon: "hax:add-page",
    group: "CMS",
    description:
      "Allows creating new pages from the top bar, outline actions, and command search actions.",
  },
  {
    key: "deletePage",
    label: "Delete pages",
    icon: "icons:delete",
    group: "CMS",
    description:
      "Allows deleting pages from page actions, outline actions, and related admin flows.",
  },
  {
    key: "outlineDesigner",
    label: "Outline designer",
    icon: "hax:site-map",
    group: "CMS",
    description:
      "Enables site structure tools, including outline actions and Structure admin operations.",
  },
  {
    key: "styleGuide",
    label: "Style guide",
    icon: "lrn:palette",
    group: "CMS",
    description:
      "Shows Style Guide access in admin tools and command search shortcuts.",
  },
  {
    // Keep "insights" as the platform feature key for compatibility; this controls Reports UI.
    key: "insights",
    label: "Reports",
    icon: "hax:graph",
    group: "CMS",
    description:
      "Enables Reports in admin and command search so analytics and insights views are available.",
  },
  {
    key: "siteManifest",
    label: "Site settings",
    icon: "hax:home-edit",
    group: "CMS",
    description:
      "Controls Site Settings sections for Details, Blocks, and Editor configuration.",
  },
  {
    key: "themeManifest",
    label: "Theme settings",
    icon: "hax:home-edit",
    group: "CMS",
    description:
      "Enables the Appearance/Theme settings section in site administration.",
  },
  {
    key: "authorManifest",
    label: "Author settings",
    icon: "hax:home-edit",
    group: "CMS",
    description:
      "Enables author profile and author metadata settings in site administration.",
  },
  {
    key: "seoManifest",
    label: "SEO settings",
    icon: "hax:home-edit",
    group: "CMS",
    description:
      "Enables search engine and metadata optimization settings in site administration.",
  },
  {
    key: "pageBreak",
    label: "Edit page details",
    icon: "hax:page-edit",
    group: "CMS",
    description:
      "Shows page-level metadata editing controls like title, icon, status, tags, and locking.",
  },
  {
    key: "addBlock",
    label: "Add blocks",
    icon: "hax:add-brick",
    group: "HAX",
    description:
      "Shows the blocks browser and allows adding new content blocks while editing.",
  },
  {
    key: "popularGizmos",
    label: "Popular blocks section",
    icon: "hax:add-brick",
    group: "HAX",
    description: "Shows the Popular blocks section inside the block picker.",
  },
  {
    key: "recentGizmos",
    label: "Recent blocks section",
    icon: "hax:add-brick",
    group: "HAX",
    description: "Shows the Recent blocks section inside the block picker.",
  },
  {
    key: "contentMap",
    label: "Page content map",
    icon: "hax:newspaper",
    group: "HAX",
    description:
      "Shows the page content map/structure panel while editing content.",
  },
  {
    key: "viewSource",
    label: "View source",
    icon: "hax:html-code",
    group: "HAX",
    description: "Enables HTML source view for direct page markup editing.",
  },
  {
    key: "uploadMedia",
    label: "Upload media",
    icon: "hax:add-page",
    group: "HAX",
    description:
      "Enables file upload workflows and related media/file management access.",
  },
  {
    key: "onlineMedia",
    label: "Online media search",
    icon: "hax:add-page",
    group: "HAX",
    description:
      "Enables online media integrations and remote media search sources.",
  },
  {
    key: "community",
    label: "Community outreach",
    icon: "hax:add-page",
    group: "HAX",
    description:
      "Enables community-related command search context and outreach-oriented actions.",
  },
];

/**
 * `haxcms-site-platform-ui`
 * UI for selecting platformConfig settings and exporting a skeleton.
 *
 * Two uses:
 * - the Features admin section (platformSettingsMode, saves
 *   `haxcms-save-platform-settings`). Inside the one admin dialog
 *   (haxcms-site-admin, `inShell`) it implements the form section contract:
 *   it stages edits, reports them with `haxcms-admin-section-state`, and
 *   `save()` fires the same event and payload as its Save button.
 * - skeleton export (ExportSiteProgram, not platformSettingsMode): picks an
 *   experience level and features, then downloads a skeleton. Unchanged.
 */
class HAXCMSSitePlatformUI extends HAXCMSI18NMixin(DDD) {
  static get tag() {
    return "haxcms-site-platform-ui";
  }

  static get properties() {
    return {
      audience: { type: String },
      features: { type: Object },
      haxBlocks: { type: Array },
      allowedBlocks: { type: Object },
      blockFilter: { type: String, attribute: "block-filter" },
      busy: { type: Boolean, reflect: true },
      pageCount: { type: Number, attribute: "page-count" },
      platformConfig: { type: Object },
      platformSettingsMode: {
        type: Boolean,
        attribute: "platform-settings-mode",
      },
      isMobile: { type: Boolean, attribute: "is-mobile", reflect: true },
      /** set by haxcms-site-admin: the shell owns the title and Save button */
      inShell: { type: Boolean, attribute: "in-shell", reflect: true },
    };
  }

  constructor() {
    super();
    this.inShell = false;
    this.__baseline = null;
    this.audience = "expert";
    this.audienceOptions = [
      { value: "novice", label: "Novice" },
      { value: "expert", label: "Expert" },
    ];
    this.features = {};
    this.haxBlocks = [];
    this.allowedBlocks = new Set();
    this.blockFilter = "";
    this.busy = false;
    this.pageCount = 0;
    this.platformConfig = {};
    this.platformSettingsMode = false;
    this.isMobile = false;

    this.__disposer = [];

    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Platform Features",
      experienceLevel: "Experience level",
      cmsFeatures: "CMS features",
      editorFeatures: "Editor features",
      blocks: "Blocks",
      filterBlocks: "Filter blocks",
      requiredTextNote:
        "Some text tags are required and always enabled (shown disabled).",
      download: "Download skeleton",
      save: "Save",
      generating: "Generating skeleton…",
      generated: "Skeleton downloaded",
      enabled: "Enabled",
      feature: "Feature",
      details: "Details",
      featuresWarning:
        "Disabling these options can remove major authoring and administration capabilities.",
      largeSiteWarning:
        "This site has many pages. Skeleton generation may take a while.",
      novice: "Novice",
      expert: "Expert",
      toolbarPreviewAlt: "{audience} editing toolbar preview",
      skeletonExportFailed: "Skeleton export failed: {error}",
      savingPlatformSettingsFailed: "Saving platform settings failed: {error}",
      // FEATURE_DEFS labels / descriptions, looked up by `${key}FeatureLabel`
      // and `${key}FeatureDescription` in _featureText
      addPageFeatureLabel: "Add pages",
      addPageFeatureDescription:
        "Allows creating new pages from the top bar, outline actions, and command search actions.",
      deletePageFeatureLabel: "Delete pages",
      deletePageFeatureDescription:
        "Allows deleting pages from page actions, outline actions, and related admin flows.",
      outlineDesignerFeatureLabel: "Outline designer",
      outlineDesignerFeatureDescription:
        "Enables site structure tools, including outline actions and Structure admin operations.",
      styleGuideFeatureLabel: "Style guide",
      styleGuideFeatureDescription:
        "Shows Style Guide access in admin tools and command search shortcuts.",
      insightsFeatureLabel: "Reports",
      insightsFeatureDescription:
        "Enables Reports in admin and command search so analytics and insights views are available.",
      siteManifestFeatureLabel: "Site settings",
      siteManifestFeatureDescription:
        "Controls Site Settings sections for Details, Blocks, and Editor configuration.",
      themeManifestFeatureLabel: "Theme settings",
      themeManifestFeatureDescription:
        "Enables the Appearance/Theme settings section in site administration.",
      authorManifestFeatureLabel: "Author settings",
      authorManifestFeatureDescription:
        "Enables author profile and author metadata settings in site administration.",
      seoManifestFeatureLabel: "SEO settings",
      seoManifestFeatureDescription:
        "Enables search engine and metadata optimization settings in site administration.",
      pageBreakFeatureLabel: "Edit page details",
      pageBreakFeatureDescription:
        "Shows page-level metadata editing controls like title, icon, status, tags, and locking.",
      addBlockFeatureLabel: "Add blocks",
      addBlockFeatureDescription:
        "Shows the blocks browser and allows adding new content blocks while editing.",
      popularGizmosFeatureLabel: "Popular blocks section",
      popularGizmosFeatureDescription:
        "Shows the Popular blocks section inside the block picker.",
      recentGizmosFeatureLabel: "Recent blocks section",
      recentGizmosFeatureDescription:
        "Shows the Recent blocks section inside the block picker.",
      contentMapFeatureLabel: "Page content map",
      contentMapFeatureDescription:
        "Shows the page content map/structure panel while editing content.",
      viewSourceFeatureLabel: "View source",
      viewSourceFeatureDescription:
        "Enables HTML source view for direct page markup editing.",
      uploadMediaFeatureLabel: "Upload media",
      uploadMediaFeatureDescription:
        "Enables file upload workflows and related media/file management access.",
      onlineMediaFeatureLabel: "Online media search",
      onlineMediaFeatureDescription:
        "Enables online media integrations and remote media search sources.",
      communityFeatureLabel: "Community outreach",
      communityFeatureDescription:
        "Enables community-related command search context and outreach-oriented actions.",
      changed: "changed",
      featureOn: "{label} on",
      featureOff: "{label} off",
      featuresOnCount: "{on} of {total} on",
      skeletonLargeSiteConfirm:
        "This site has {count} pages. Generating a skeleton may take a while and create a large file. Continue?",
    };

    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../locales/", import.meta.url).href,
    });
  }

  static get styles() {
    return [
      super.styles,
      ...HaxUiAdminTokens,
      ...HaxUiAdminPrimitives,
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
          font-family: var(--ddd-font-primary);
          min-height: min(60vh, var(--haxcms-admin-panel-height));
          height: var(--haxcms-admin-panel-height);
          max-height: var(--haxcms-admin-panel-height);
          overflow: hidden;
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

        :host([busy]) {
          pointer-events: none;
          opacity: var(--ddd-opacity-80, 0.8);
        }

        h2 {
          margin: 0 0 var(--ddd-spacing-4) 0;
          font-size: var(--ddd-font-size-m);
          font-weight: var(--ddd-font-weight-bold);
        }

        h4 {
          margin: 0;
          font-size: var(--ddd-font-size-xs);
          font-weight: var(--ddd-font-weight-bold);
        }
        .panel-shell {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
        }
        .panel-scroll {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding-right: var(--ddd-spacing-1);
        }

        .row {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-6);
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

        .section-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-3);
          margin-bottom: var(--ddd-spacing-3);
          cursor: pointer;
        }
        .section-title:focus-visible {
          outline: var(--ddd-border-size-sm) solid
            var(--ddd-theme-default-skyBlue);
          outline-offset: 2px;
          border-radius: var(--ddd-radius-xs);
        }

        .summary-leading {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }

        .section-title simple-icon-lite {
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-3xs, 20px);
          --simple-icon-height: var(--ddd-icon-3xs, 20px);
        }
        .section-title h3 {
          margin: 0;
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-bold);
        }

        fieldset {
          border: 0;
          padding: 0;
          margin: 0;
        }

        .check-grid {
          flex: 7;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: var(--ddd-spacing-3);
        }

        label.check {
          display: flex;
          align-items: flex-start;
          gap: var(--ddd-spacing-2);
          line-height: 1.3;
        }

        label.check input {
          margin-top: 2px;
        }

        .controls-container {
          display: flex;
          align-items: flex-start;
          gap: var(--ddd-spacing-3);
        }

        .feature-table-wrapper {
          flex: 7;
          min-width: 0;
        }

        .feature-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-sm);
          overflow: hidden;
          background: light-dark(
            var(--ddd-theme-default-white),
            rgba(0, 0, 0, 0.12)
          );
        }

        .feature-table th,
        .feature-table td {
          text-align: left;
          vertical-align: top;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border-bottom: var(--ddd-border-size-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
        }

        .feature-table tbody tr:last-child td {
          border-bottom: 0;
        }
        .feature-row {
          transition:
            opacity var(--ddd-duration-normal, 0.3s) ease-in-out,
            background-color var(--ddd-duration-normal, 0.3s) ease-in-out;
        }

        .feature-row.enabled {
          opacity: 1;
          background-color: light-dark(
            rgba(0, 0, 0, 0.02),
            rgba(255, 255, 255, 0.06)
          );
        }

        .feature-row.disabled {
          opacity: var(--ddd-opacity-60, 0.58);
          background-color: light-dark(
            rgba(0, 0, 0, 0),
            rgba(255, 255, 255, 0.02)
          );
        }

        .feature-table th {
          font-size: var(--ddd-font-size-4xs);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-weight: var(--ddd-font-weight-bold);
        }

        .feature-table .select-col {
          width: 88px;
          text-align: center;
        }

        .feature-table input[type="checkbox"] {
          margin-top: 0;
          inline-size: var(--ddd-icon-xs);
          block-size: var(--ddd-icon-xs);
          cursor: pointer;
        }

        .feature-title {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          font-weight: var(--ddd-font-weight-bold);
        }

        .feature-title simple-icon-lite {
          --simple-icon-height: var(--ddd-icon-xs);
          --simple-icon-width: var(--ddd-icon-xs);
        }

        .feature-description {
          margin: var(--ddd-spacing-1) 0 0 0;
          font-size: var(--ddd-font-size-3xs);
          line-height: 1.35;
          opacity: 0.92;
        }

        .mobile-feature-list {
          display: none;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
        }

        .feature-card {
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          transition:
            opacity 0.2s ease,
            background-color 0.2s ease;
          cursor: pointer;
          outline: none;
        }

        .feature-card.enabled {
          opacity: 1;
          background-color: light-dark(
            rgba(0, 0, 0, 0.02),
            rgba(255, 255, 255, 0.06)
          );
        }

        .feature-card.disabled {
          opacity: var(--ddd-opacity-60, 0.58);
          background-color: light-dark(
            rgba(0, 0, 0, 0),
            rgba(255, 255, 255, 0.02)
          );
        }

        .feature-card:focus-visible {
          outline: 2px solid var(--ddd-theme-default-keystoneYellow);
          outline-offset: 2px;
        }

        .feature-card-main {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          min-height: 44px;
        }

        .feature-card-main input[type="checkbox"] {
          margin-top: 0;
          inline-size: var(--ddd-icon-xs);
          block-size: var(--ddd-icon-xs);
          cursor: pointer;
        }

        .feature-card .feature-title {
          flex: 1;
          min-width: 0;
        }

        .feature-card-details {
          margin-top: var(--ddd-spacing-2);
        }

        .feature-card-details summary {
          min-height: 44px;
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: var(--ddd-font-size-4xs);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          font-weight: var(--ddd-font-weight-bold);
        }

        .platform-note {
          margin: 0 0 var(--ddd-spacing-4) 0;
          font-size: var(--ddd-font-size-xs);
          line-height: 1.4;
        }

        select,
        input[type="text"] {
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-s);
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-2);
          background: light-dark(
            var(--ddd-theme-default-white),
            rgba(0, 0, 0, 0.25)
          );
          color: inherit;
        }

        .audience {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
        }

        .audience-content {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        .audience label {
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-xs);
        }

        .blocks-list {
          max-height: 40vh;
          overflow: auto;
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-3);
          background: light-dark(
            var(--ddd-theme-default-white),
            rgba(0, 0, 0, 0.2)
          );
        }

        .block-category {
          padding: var(--ddd-spacing-3) 0;
          border-top: var(--ddd-border-xs);
        }

        .block-category:first-of-type {
          border-top: 0;
          padding-top: 0;
        }

        .block-category-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-3);
          margin-bottom: var(--ddd-spacing-2);
        }

        .block-category-note {
          margin: 0 0 var(--ddd-spacing-3) 0;
          font-size: var(--ddd-font-size-3xs);
          opacity: 0.9;
        }

        .blocks-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-3);
          margin-bottom: var(--ddd-spacing-3);
        }

        .block-search {
          flex: 7;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--ddd-spacing-3);
          padding-top: var(--ddd-spacing-4);
          margin-top: var(--ddd-spacing-4);
          border-top: var(--ddd-border-size-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          flex-shrink: 0;
          position: sticky;
          bottom: 0;
          z-index: 2;
        }

        button.action {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-s);
          padding: var(--ddd-spacing-3) var(--ddd-spacing-5);
          border-radius: var(--ddd-radius-sm);
          border: var(--ddd-border-xs);
          cursor: pointer;
          background-color: var(--ddd-theme-default-skyBlue);
          color: var(--ddd-theme-default-white);
        }

        button.action.secondary {
          background-color: var(--ddd-theme-default-discoveryCoral);
        }

        button.action:focus,
        button.action:hover {
          outline: 2px solid var(--ddd-theme-default-keystoneYellow);
        }

        .note {
          margin-top: var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-xs);
          opacity: 0.9;
        }

        details {
          min-width: 100%;
          box-sizing: border-box;
        }

        summary .section-title {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        /* in the admin dialog: the HAX UI admin layer. The shell owns the
           title, the scrolling body and the action bar. */
        :host([in-shell]) {
          display: block;
          height: auto;
          min-height: 0;
          max-height: none;
          overflow: visible;
          padding: var(--hax-ui-gap-lg) var(--ddd-spacing-6, 24px)
            var(--ddd-spacing-8, 32px);
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
        }
        :host([in-shell]) *,
        :host([in-shell]) *::before,
        :host([in-shell]) *::after {
          box-sizing: border-box;
        }
        .admin-note {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          margin: 0;
          padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
          border-radius: var(--hax-ui-radius);
          font-size: 13px;
          line-height: 1.35;
          color: light-dark(
            var(--ddd-theme-default-potentialMidnight, #000321),
            var(--ddd-theme-default-warningLight, #fff4e5)
          );
          background-color: light-dark(
            var(--ddd-theme-default-warningLight, #fff4e5),
            rgba(255, 174, 0, 0.14)
          );
        }
        .admin-note simple-icon-lite {
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
          --simple-icon-color: currentColor;
          flex: none;
        }
        .admin-count {
          margin: var(--hax-ui-gap-md) 0 0;
          font-size: var(--hax-ui-admin-font-size-xs);
          font-variant-numeric: tabular-nums;
          color: var(--hax-ui-text-muted);
        }
        :host([in-shell]) .group-title {
          margin: var(--ddd-spacing-5, 20px) 0 var(--hax-ui-gap);
          padding: 0 var(--hax-ui-gap-md);
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-bold, 700);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--hax-ui-text-muted);
        }
        .frow {
          display: grid;
          grid-template-columns: 44px minmax(0, 1fr);
          gap: var(--hax-ui-gap-lg);
          align-items: center;
          min-height: 52px;
          padding: var(--hax-ui-gap) var(--hax-ui-gap-md);
          border-bottom: 1px solid var(--hax-ui-line);
        }
        .frow:hover {
          background-color: var(--hax-ui-hover);
        }
        .frow.chg {
          background-color: var(--hax-ui-accent-soft);
        }
        .frow .lab {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .frow.off .lab {
          color: var(--hax-ui-text-muted);
        }
        .frow .help {
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
        @media (prefers-reduced-motion: reduce) {
          .sw::after {
            transition: none;
          }
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

          .audience-content {
            flex-direction: column;
            gap: var(--ddd-spacing-3);
          }

          .toolbar-img {
            width: 100%;
            max-width: 320px;
          }

          .feature-table-wrapper {
            display: none;
          }

          .controls-container {
            display: block;
          }

          .mobile-feature-list {
            display: flex;
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

  connectedCallback() {
    super.connectedCallback();

    this.__disposer.push(
      autorun((_reaction) => {
        const _mobx_val_0 = toJS(store.manifest);
        Promise.resolve().then(() => {
          const manifest = _mobx_val_0;
          if (manifest && manifest.items) {
            this.pageCount = manifest.items.length;
          }
        });
      }),
    );

    this.__disposer.push(
      autorun((_reaction) => {
        const _mobx_val_0 = toJS(HAXStore.platformConfig);
        const _mobx_val_1 = HAXStore.platformConfig
          ? toJS(HAXStore.platformConfig.features)
          : undefined;
        const _mobx_val_2 = toJS(HAXStore.gizmoList);
        Promise.resolve().then(() => {
          const platformConfig = _mobx_val_0;
          this.platformConfig = platformConfig || {};

          // hydrate local state from platformConfig so the UI reflects current site settings
          if (platformConfig) {
            if (platformConfig.audience) {
              this.audience = platformConfig.audience;
            }

            if (platformConfig.features) {
              this.features = _mobx_val_1;
            } else {
              this.features = {};
            }

            // allowedBlocks may arrive as null, a Set (store), or an Array (serialized)
            const allowedBlocks = platformConfig.allowedBlocks;
            if (allowedBlocks === null) {
              this.allowedBlocks = null;
            } else if (allowedBlocks instanceof Set) {
              this.allowedBlocks = new Set(Array.from(allowedBlocks));
            } else if (Array.isArray(allowedBlocks)) {
              this.allowedBlocks = new Set(allowedBlocks);
            } else {
              this.allowedBlocks = new Set();
            }
          } else {
            this.allowedBlocks = new Set();
            this.features = {};
          }

          const currentGizmos = _mobx_val_2;
          const gizmos = Array.isArray(currentGizmos) ? currentGizmos : [];
          this.haxBlocks = gizmos.filter(
            (item) =>
              !(
                item.meta &&
                (item.meta.inlineOnly ||
                  item.meta.hidden ||
                  item.meta.requiresParent)
              ),
          );
          this._captureBaseline();
        });
      }),
    );

    this.__disposer.push(
      autorun((_reaction) => {
        const _mobx_val_0 = toJS(store.isMobile);
        Promise.resolve().then(() => {
          this.isMobile = !!_mobx_val_0;
        });
      }),
    );

    // this.__haxRegisterPropertiesHandler = () => {
    //   this._refreshBlocksList()
    // }
    // globalThis.addEventListener(
    //   'hax-register-properties',
    //   this.__haxRegisterPropertiesHandler,
    // )

    // // Delay initial block list until HAXStore has had a chance to register
    // setTimeout(() => {
    //   this._refreshBlocksList()
    // }, 0)
  }

  disconnectedCallback() {
    while (this.__disposer.length) {
      const d = this.__disposer.pop();
      if (d && typeof d.dispose === "function") {
        d.dispose();
      }
    }
    // if (this.__haxRegisterPropertiesHandler) {
    //   globalThis.removeEventListener(
    //     'hax-register-properties',
    //     this.__haxRegisterPropertiesHandler,
    //   )
    // }
    super.disconnectedCallback();
  }

  render() {
    const cmsFeatures = FEATURE_DEFS.filter((f) => f.group === "CMS");
    const editorFeatures = FEATURE_DEFS.filter((f) => f.group === "HAX");
    if (this.inShell) {
      return this._renderShellBody(cmsFeatures, editorFeatures);
    }

    let toolbarImgPath = new URL(
      `./assets/${this.audience.toLowerCase()}.png`,
      import.meta.url,
    ).href;
    return html`
      <div class="panel-shell">
        <div class="panel-scroll">
          <h2>${this.t.title}</h2>
          <p class="platform-note">${this.t.featuresWarning}</p>

          <div class="row">
            ${!this.platformSettingsMode
              ? html`
                  <div class="section">
                    <div class="audience-content">
                      <div class="audience-selector">
                        <label for="audience">${this.t.experienceLevel}</label>
                        <select
                          id="audience"
                          @change="${this._audienceChanged}"
                        >
                          ${this.audienceOptions.map(
                            (opt) =>
                              html`<option
                                value="${opt.value}"
                                ?selected=${this.audience === opt.value}
                              >
                                ${this.t[opt.value] || opt.label}
                              </option>`,
                          )}
                        </select>
                      </div>
                      <img
                        class="toolbar-img"
                        src=${toolbarImgPath}
                        alt="${this.t.toolbarPreviewAlt.replace(
                          "{audience}",
                          () => this.audience,
                        )}"
                      />
                    </div>
                    ${this.pageCount > 20
                      ? html`<div class="note">${this.t.largeSiteWarning}</div>`
                      : ""}
                  </div>
                `
              : ``}
            ${this._renderFeatureSection(
              this.t.cmsFeatures,
              "hax:home-edit",
              cmsFeatures,
              true,
            )}
            ${this._renderFeatureSection(
              this.t.editorFeatures,
              "hax:page-edit",
              editorFeatures,
            )}
          </div>
        </div>
        <div class="actions">
          <button
            class="action"
            @click="${this.platformSettingsMode
              ? this._savePlatformSettings
              : this._download}"
          >
            ${this.busy
              ? this.t.generating
              : this.platformSettingsMode
                ? this.t.save
                : this.t.download}
          </button>
        </div>
      </div>
    `;
  }

  _isFeatureChecked(key) {
    if (this.features && Object.hasOwn(this.features, key)) {
      return this.features[key] !== false;
    }
    return store.platformAllows(key);
  }

  _setFeatureChecked(key, checked) {
    if (!key) {
      return;
    }
    this.features = {
      ...this.features,
      [key]: !!checked,
    };
    this._emitState();
  }

  /** remember what was loaded, so edits can be counted and discarded */
  _captureBaseline() {
    this.__baseline = {
      audience: this.audience,
      features: this._cloneData(this.features || {}),
      allowedBlocks:
        this.allowedBlocks === null
          ? null
          : Array.from(this.allowedBlocks || []),
    };
    this._emitState();
  }

  _cloneData(data) {
    return JSON.parse(JSON.stringify(data));
  }

  /** whether a feature was on in the loaded values */
  _baselineFeatureChecked(key) {
    const features = this.__baseline ? this.__baseline.features : {};
    if (features && Object.hasOwn(features, key)) {
      return features[key] !== false;
    }
    return store.platformAllows(key);
  }

  /** human labels of what differs from the loaded values */
  get changedFields() {
    if (!this.__baseline) {
      return [];
    }
    const changed = [];
    if (this.audience !== this.__baseline.audience) {
      changed.push(this.t.experienceLevel);
    }
    FEATURE_DEFS.forEach((item) => {
      const checked = this._isFeatureChecked(item.key);
      if (checked !== this._baselineFeatureChecked(item.key)) {
        const label = this._featureText(item, "label");
        changed.push(
          (checked ? this.t.featureOn : this.t.featureOff).replace(
            "{label}",
            () => label,
          ),
        );
      }
    });
    return changed;
  }

  /** only platform settings mode saves; the skeleton export downloads */
  get canSave() {
    return !!this.platformSettingsMode && !this.busy;
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
          changes: changed,
          canSave: this.canSave,
        },
      }),
    );
  }

  /** section contract: restore the values that were loaded */
  discard() {
    if (this.__baseline) {
      this.audience = this.__baseline.audience;
      this.features = this._cloneData(this.__baseline.features);
      this.allowedBlocks =
        this.__baseline.allowedBlocks === null
          ? null
          : new Set(this.__baseline.allowedBlocks);
    }
    this._emitState();
  }

  /**
   * section contract: send the save. Fires the same
   * haxcms-save-platform-settings event and payload as the Save button.
   * @returns {boolean} true when a save was sent
   */
  save() {
    if (!this.canSave) {
      return false;
    }
    let sent = false;
    try {
      this.busy = true;
      const platformConfig = this._platformConfigForExport();

      // bubble up to the site editor, which owns the calls
      this.dispatchEvent(
        new CustomEvent("haxcms-save-platform-settings", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: platformConfig,
        }),
      );
      sent = true;

      // close modal; successful write will reload (just like saving the manifest)
      if (!this.inShell) {
        this.dispatchEvent(
          new CustomEvent("simple-modal-hide", {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: false,
          }),
        );
      }
    } catch (error) {
      console.error("Saving platform settings failed:", error);
      HAXStore.toast(
        this.t.savingPlatformSettingsFailed.replace(
          "{error}",
          () => error.message,
        ),
        5000,
        {},
        "fit-bottom",
      );
    }

    this.busy = false;
    return sent;
  }

  _renderShellBody(cmsFeatures, editorFeatures) {
    const all = cmsFeatures.concat(editorFeatures);
    const onCount = all.filter((f) => this._isFeatureChecked(f.key)).length;
    return html`
      <p class="admin-note" role="note">
        <simple-icon-lite
          icon="icons:warning"
          aria-hidden="true"
        ></simple-icon-lite>
        ${this.t.featuresWarning}
      </p>
      <p class="admin-count">
        ${this.t.featuresOnCount
          .replace("{on}", () => onCount)
          .replace("{total}", () => all.length)}
      </p>
      ${this._renderShellGroup("cms", this.t.cmsFeatures, cmsFeatures)}
      ${this._renderShellGroup("hax", this.t.editorFeatures, editorFeatures)}
    `;
  }

  _renderShellGroup(key, title, features) {
    return html`
      <section aria-labelledby="group-${key}">
        <h3 class="group-title" id="group-${key}">${title}</h3>
        ${features.map((f) => this._renderShellRow(f))}
      </section>
    `;
  }

  _renderShellRow(item) {
    const checked = this._isFeatureChecked(item.key);
    const changed = checked !== this._baselineFeatureChecked(item.key);
    const id = `platform-feature-${item.group.toLowerCase()}-${item.key}`;
    return html`
      <div class="frow ${checked ? "" : "off"} ${changed ? "chg" : ""}">
        <button
          type="button"
          class="sw"
          id="${id}"
          data-key="${item.key}"
          role="switch"
          aria-checked="${checked ? "true" : "false"}"
          aria-labelledby="${id}-label"
          aria-describedby="${id}-help"
          @click="${() => this._setFeatureChecked(item.key, !checked)}"
        ></button>
        <div>
          <span class="lab" id="${id}-label"
            >${changed
              ? html`<span
                  class="dot"
                  role="img"
                  aria-label="${this.t.changed}"
                ></span>`
              : nothing}${this._featureText(item, "label")}</span
          ><span class="help" id="${id}-help"
            >${this._featureText(item, "description")}</span
          >
        </div>
      </div>
    `;
  }

  _renderFeatureSection(title, icon, features, open = false) {
    return html`
      <details class="section" ?open=${open}>
        <summary class="section-title">
          <span class="summary-leading">
            <simple-icon-lite
              icon="${icon}"
              aria-hidden="true"
            ></simple-icon-lite>
            <h3>${title}</h3>
          </span>
        </summary>
        <div class="controls-container">
          ${this.isMobile
            ? html`
                <div class="mobile-feature-list">
                  ${features.map((f) => this._renderFeatureCard(f))}
                </div>
              `
            : html`
                <div class="feature-table-wrapper">
                  <table class="feature-table">
                    <thead>
                      <tr>
                        <th class="select-col">${this.t.enabled}</th>
                        <th>${this.t.feature}</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${features.map((f) => this._renderFeatureRow(f))}
                    </tbody>
                  </table>
                </div>
              `}
        </div>
      </details>
    `;
  }

  /**
   * translated label / description for a FEATURE_DEFS item (module scope
   * defs keep the English as the fallback)
   */
  _featureText(item, field) {
    const suffix = field === "description" ? "Description" : "Label";
    return this.t[`${item.key}Feature${suffix}`] || item[field];
  }

  _renderFeatureRow(item) {
    const checked = this._isFeatureChecked(item.key);
    const inputId = `platform-feature-${item.group.toLowerCase()}-${item.key}`;
    const rowClass = checked ? "feature-row enabled" : "feature-row disabled";
    return html`
      <tr class="${rowClass}">
        <td class="select-col">
          <input
            id="${inputId}"
            type="checkbox"
            data-key="${item.key}"
            .checked=${checked}
            @change=${this._checkboxChanged}
          />
        </td>
        <td>
          <label class="feature-title" for="${inputId}">
            <simple-icon-lite icon=${item.icon}></simple-icon-lite>
            <span>${this._featureText(item, "label")}</span>
          </label>
          <p class="feature-description">
            ${this._featureText(item, "description")}
          </p>
        </td>
      </tr>
    `;
  }

  _renderFeatureCard(item) {
    const checked = this._isFeatureChecked(item.key);
    const inputId = `platform-feature-${item.group.toLowerCase()}-${item.key}`;
    const rowClass = checked ? "feature-card enabled" : "feature-card disabled";
    return html`
      <div
        class="${rowClass}"
        data-key="${item.key}"
        role="checkbox"
        aria-checked="${checked ? "true" : "false"}"
        tabindex="0"
        @click="${this._featureCardClicked}"
        @keydown="${this._featureCardKeydown}"
      >
        <div class="feature-card-main">
          <input
            id="${inputId}"
            type="checkbox"
            data-key="${item.key}"
            data-stop-toggle="true"
            .checked=${checked}
            @click="${this._stopCardToggle}"
            @change=${this._checkboxChanged}
          />
          <label
            class="feature-title"
            for="${inputId}"
            data-stop-toggle="true"
            @click="${this._stopCardToggle}"
          >
            <simple-icon-lite icon=${item.icon}></simple-icon-lite>
            <span>${this._featureText(item, "label")}</span>
          </label>
        </div>
        <details
          class="feature-card-details"
          data-stop-toggle="true"
          @click="${this._stopCardToggle}"
        >
          <summary data-stop-toggle="true">${this.t.details}</summary>
          <p class="feature-description">
            ${this._featureText(item, "description")}
          </p>
        </details>
      </div>
    `;
  }

  _renderBlockCheckbox(item) {
    const isDisabled = HAXStore.requiredPrimitives.has(item.tag) ? true : false;
    return html`
      <label class="check">
        <input
          type="checkbox"
          data-tag="${item.tag}"
          .checked=${!item.platformRestricted}
          ?disabled=${isDisabled}
          @change=${this._checkboxChanged}
        />
        <simple-icon-lite icon="${item.icon}"></simple-icon-lite>
        <span>${item.title}</span>
      </label>
    `;
  }

  _audienceChanged(e) {
    const value = e && e.target ? e.target.value : "expert";
    this.audience = value;
    this._emitState();
  }
  _isCardInteraction(e) {
    const path = e && e.composedPath ? e.composedPath() : [];
    for (const node of path) {
      if (!node) {
        continue;
      }
      if (
        node.getAttribute &&
        node.getAttribute("data-stop-toggle") === "true"
      ) {
        return true;
      }
      if (!node.tagName) {
        continue;
      }
      const tag = node.tagName.toLowerCase();
      if (
        tag === "input" ||
        tag === "button" ||
        tag === "a" ||
        tag === "summary" ||
        tag === "details" ||
        tag === "simple-icon-button-lite"
      ) {
        return true;
      }
    }
    return false;
  }

  _featureCardClicked(e) {
    if (this._isCardInteraction(e)) {
      return;
    }
    const key = e && e.currentTarget ? e.currentTarget.dataset.key : null;
    if (!key) {
      return;
    }
    this._setFeatureChecked(key, !this._isFeatureChecked(key));
  }

  _featureCardKeydown(e) {
    const key = e && e.key ? e.key : "";
    if (key !== " " && key !== "Enter") {
      return;
    }
    if (this._isCardInteraction(e)) {
      return;
    }
    e.preventDefault();
    const featureKey =
      e && e.currentTarget ? e.currentTarget.dataset.key : null;
    if (!featureKey) {
      return;
    }
    this._setFeatureChecked(featureKey, !this._isFeatureChecked(featureKey));
  }

  _stopCardToggle(e) {
    if (e) {
      e.stopPropagation();
    }
  }

  _checkboxChanged(e) {
    const input = e.currentTarget;
    if (!input || input.type !== "checkbox") return;
    const { key } = input.dataset;

    if (key) {
      this._setFeatureChecked(key, input.checked);
      return;
    }
  }

  _compareCategories(a, b) {
    const categoryA = a || "Other";
    const categoryB = b || "Other";

    // Writing / Text first, Other last, then alphabetical
    const first = ["Writing", "Text"];
    const last = ["Other"];

    if (first.includes(categoryA) && !first.includes(categoryB)) return -1;
    if (!first.includes(categoryA) && first.includes(categoryB)) return 1;

    if (last.includes(categoryA) && !last.includes(categoryB)) return 1;
    if (!last.includes(categoryA) && last.includes(categoryB)) return -1;

    if (first.includes(categoryA) && first.includes(categoryB)) {
      return first.indexOf(categoryA) - first.indexOf(categoryB);
    }

    if (categoryA < categoryB) return -1;
    if (categoryA > categoryB) return 1;
    return 0;
  }

  _groupBlocksByCategory(items) {
    const groupMap = {};
    items.forEach((item) => {
      const required = HAXStore.requiredPrimitives.has(item.tag);
      let category = "Other";
      if (Array.isArray(item.tags) && item.tags.length > 0) {
        category = item.tags[0];
      }
      // Ensure required text primitives show up in Writing group even if missing tags
      if (required && category === "Other") {
        category = "Text";
      }

      if (!groupMap[category]) {
        groupMap[category] = [];
      }
      groupMap[category].push(item);
    });

    const categories = Object.keys(groupMap);
    categories.sort((a, b) => this._compareCategories(a, b));

    return categories.map((category) => ({
      category,
      blocks: groupMap[category],
    }));
  }

  _platformConfigForExport() {
    let allowedBlocks = [];
    if (this.allowedBlocks === null) {
      allowedBlocks = null;
    } else {
      allowedBlocks = Array.from(this.allowedBlocks || []).filter(
        (tag) => !HAXStore.requiredPrimitives.has(tag),
      );
      allowedBlocks.sort();
    }

    return {
      audience: this.audience,
      features: this.features,
      allowedBlocks: allowedBlocks,
    };
  }

  async _download() {
    try {
      this.busy = true;
      // Load generator on demand
      const { default: SiteSkeletonGenerator } = await import(
        "../utils/site-skeleton-generator.js"
      );

      const skeleton = await SiteSkeletonGenerator.generateFromCurrentSite(
        true,
        this.t,
      );

      const platformConfig = this._platformConfigForExport();
      if (!skeleton.site) {
        skeleton.site = {};
      }
      skeleton.site.platform = platformConfig;

      SiteSkeletonGenerator.downloadSkeleton(skeleton);

      HAXStore.toast(this.t.generated, 3000, {}, "fit-bottom");

      // close modal
      this.dispatchEvent(
        new CustomEvent("simple-modal-hide", {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: false,
        }),
      );
    } catch (error) {
      console.error("Skeleton export failed:", error);
      HAXStore.toast(
        this.t.skeletonExportFailed.replace("{error}", () => error.message),
        5000,
        {},
        "fit-bottom",
      );
    }

    this.busy = false;
  }

  /** the standalone Save button (platform settings mode outside the shell) */
  _savePlatformSettings() {
    this.save();
  }
}

globalThis.customElements.define(
  HAXCMSSitePlatformUI.tag,
  HAXCMSSitePlatformUI,
);
export { HAXCMSSitePlatformUI };
