import { LitElement, html, css, nothing } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import {
  HaxSchematizer,
  HaxElementizer,
} from "@haxtheweb/hax-body-behaviors/lib/HAXFields.js";
import {
  loadLanguageRegistry,
  matchLanguageCode,
} from "@haxtheweb/i18n-manager/lib/LanguageRegistry.js";
import "@haxtheweb/simple-fields/simple-fields.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import {
  HaxUiAdminStyles,
  HaxUiAdminShell,
  HaxUiAdminIcons,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminStyles.js";
import "@haxtheweb/code-editor/code-editor.js";
import "@haxtheweb/hax-body/lib/hax-upload-field.js";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { waitForAppHAXSystemApiRegistryReady } from "../app-hax-system-api-registry.js";
import "./haxcms-system-allowed-blocks.js";
// imported here rather than left to simple-fields' dynamic import, whose
// base path only resolves in the published node_modules layout
// (https://github.com/haxtheweb/issues/issues/3208)
import "@haxtheweb/haxcms-elements/lib/core/haxcms-language-picker.js";
import { haxcmsApiMessage } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSApiMessages.js";
import { trimChars } from "@haxtheweb/utils/lib/safe-html.js";

/** whether the section rail is collapsed to icons, per browser */
const RAIL_COLLAPSED_KEY = "haxcms-system-settings-rail-collapsed";
/** at or below this width (px) the rail holds its icons only */
const NARROW_WIDTH = 760;

/**
 * Status rows grouped by area, by the keys both backends report
 * (haxcms-nodejs and haxcms-php). A key not listed lands in Other.
 */
const STATUS_GROUP_KEYS = {
  environment: [
    "runtime",
    "server",
    "node-memory-limit",
    "php-memory-limit",
    "php-curl",
    "file-upload-limit",
    "git-installed",
  ],
  directories: [
    "installation-state",
    "config-directory",
    "config-directory-path",
    "sites-directory",
    "published-directory",
    "archived-directory",
    "user-files-directory",
  ],
  security: ["security-secrets", "jwt-security", "nginx-files-html-xss"],
  updates: ["haxcms-version"],
  support: ["community-support"],
};

class HAXCMSSystemSettings extends I18NMixin(LitElement) {
  static get tag() {
    return "haxcms-system-settings";
  }
  _supportsCall(callKey = "") {
    const normalizedCallKey = `${callKey || ""}`.trim();
    if (!normalizedCallKey) {
      return false;
    }
    const api = this._backendApi();
    return !!(
      api &&
      typeof api.supportsCall === "function" &&
      api.supportsCall(normalizedCallKey)
    );
  }

  _hasSkeletonRenameEndpoint() {
    return this._supportsCall("renameSkeleton");
  }

  _hasSkeletonDeleteEndpoint() {
    return this._supportsCall("deleteSkeleton");
  }

  static get properties() {
    return {
      activePanel: { type: String, attribute: "active-panel" },
      panelValues: { type: Object, attribute: false },
      statusMessage: { type: String, attribute: "status-message" },
      statusRows: { type: Array, attribute: false },
      statusSummary: { type: Object, attribute: false },
      statusLoading: { type: Boolean, attribute: "status-loading" },
      statusError: { type: String, attribute: "status-error" },
      skeletonOptions: { type: Array, attribute: false },
      themeOptions: { type: Array, attribute: false },
      loadingSkeletons: { type: Boolean, attribute: "loading-skeletons" },
      loadingThemes: { type: Boolean, attribute: "loading-themes" },
      apiKeysLoading: { type: Boolean, attribute: "api-keys-loading" },
      apiKeysError: { type: String, attribute: "api-keys-error" },
      apiKeyVisibility: { type: Object, attribute: false },
      panelSaving: { type: Boolean, attribute: "panel-saving" },
      skeletonActionBusy: {
        type: Boolean,
        attribute: "skeleton-action-busy",
      },
      _saveTone: { state: true },
      _pendingPanel: { state: true },
      _railCollapsed: { state: true },
      _narrow: { state: true },
      _filterText: { state: true },
      _filterView: { state: true },
    };
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      providerApiKey: "{provider} API key",
      status: "Status",
      skeletons: "Skeletons",
      themes: "Themes",
      blocks: "Blocks",
      integrations: "Integrations",
      apiKeys: "API Keys",
      media: "Media",
      mediaPolicy: "Media policy",
      configuration: "Configuration",
      localization: "Localization",
      styleGuide: "Style Guide",
      customCodePanel: "JS/CSS",
      runtimeAndUpdateStatus: "Runtime and update status",
      availableStarterStructures: "Available starter structures",
      availableThemes: "Available themes",
      allowedBlockRegistry: "Allowed block registry",
      thirdPartyCredentials: "Third-party credentials",
      mediaDefaults: "Media defaults",
      jpegImageQuality: "JPEG image quality (1-100)",
      maxUploadSizeMb: "Max upload size (MB)",
      acceptedFileFormats: "Accepted file formats",
      systemWideDefaults: "System-wide defaults",
      defaultLanguageForNewSites: "Default language for new sites",
      authoringStyleGuidance: "Authoring style guidance",
      globalCssAndJavaScript: "Global CSS and JavaScript",
      statusPanelIntro:
        "System health report modeled after the admin status table, using backend-friendly keys for both PHP and NodeJS deployments.",
      skeletonsPanelIntro:
        "Enable or disable site skeletons discovered from the skeleton listing endpoint.",
      themesPanelIntro:
        "Enable or disable installable themes discovered from the theme listing source.",
      blocksPanelIntro:
        "Manage allowed blocks using the same grouped checkbox experience as allowed-blocks UI.",
      integrationsPanelIntro:
        "Configure API credentials and integration defaults used by media and automation features.",
      apiKeysSectionDescription:
        "Manage provider API keys used for media and AI integrations. Keys are stored server-side in _config/apiKeys.json.",
      mediaPanelIntro:
        "Set image quality, upload constraints, and transformation behavior defaults.",
      mediaPolicySectionDescription:
        "Media policy values are stored in system-level media settings.",
      configurationPanelIntro:
        "Set the default language applied to newly created sites and other system-wide configuration defaults.",
      localizationSectionDescription:
        "Localization defaults are stored in the system config localization block.",
      styleGuidePanelIntro:
        "Style guide controls are intentionally disabled while backend support is finalized.",
      customCodePanelIntro:
        "Edit global CSS and JavaScript. Empty values are valid and will save as empty.",
      schemaEndpointUnavailable:
        "Schema file operation endpoint is unavailable.",
      networkRequestFailed: "Network request failed.",
      schemaOperationFailed: "Schema file operation failed.",
      requestFailed: "Request failed.",
      uploadingSkeleton: "Uploading skeleton…",
      uploadedSkeleton: "Uploaded skeleton: {machineName}",
      skeletonUploaded: "Skeleton uploaded.",
      unableToUploadSkeleton: "Unable to upload skeleton.",
      settings: "Settings",
      skeletonOptionsSaved: "{count} skeleton options saved",
      unableToSaveSkeletonOptions: "Unable to save skeleton options",
      themeOptionsSaved: "{count} theme options saved",
      unableToSaveThemeOptions: "Unable to save theme options",
      panelSavedLocally: "{panel} saved locally",
      panelSaved: "{panel} saved",
      unableToSavePanel: "Unable to save {panel}",
      panelSavedLocallyPending:
        "{panel} saved locally (backend wiring pending)",
      enabledBlocksSaved: "Enabled blocks saved",
      unableToSaveEnabledBlocks: "Unable to save enabled blocks",
      savedApiKeysLoadFailed: "Saved API keys could not be loaded right now.",
      apiKeySettingsSaveFailed: "API key settings could not be saved.",
      savedMediaSettingsLoadFailed:
        "Saved media settings could not be loaded right now.",
      savedLocalizationSettingsLoadFailed:
        "Saved localization settings could not be loaded right now.",
      programmingLanguageRuntime: "Programming language runtime",
      serverVersion: "Server version",
      fileSystemAccess: "File system access",
      writable: "Writable",
      backgroundJobs: "Background jobs",
      enabledStatus: "Enabled",
      tlsCertificate: "TLS certificate",
      valid: "Valid",
      haxcmsVersion: "HAXcms version",
      haxcmsVersionDescription:
        "Compare installed HAXcms version with latest available release.",
      versionUpdateAvailable: "{version} (update available)",
      versionUpToDate: "{version} (up to date)",
      unknown: "Unknown",
      currentLatestVersion: "Current: {current} · Latest: {latest}",
      unknownLower: "unknown",
      ok: "OK",
      warning: "Warning",
      error: "Error",
      info: "Info",
      comingSoon: "Coming soon",
      systemSettings: "System settings",
      systemSettingsDescription:
        "System-level controls for runtime status, skeletons, themes, allowed blocks, integrations, media defaults, configuration defaults, and global custom code.",
      loadingSkeletonOptions: "Loading skeleton options…",
      dragDropSkeleton:
        "Drag and drop a skeleton JSON file to add it to user skeletons.",
      uploadEndpointUnavailable:
        "Upload endpoint unavailable for this backend.",
      enabled: "Enabled",
      skeleton: "Skeleton",
      actions: "Actions",
      noSkeletonOptions: "No skeleton options were returned.",
      renamePromptUnavailable: "Rename prompt is unavailable.",
      renameSkeleton: "Rename skeleton",
      skeletonNameRequired: "Skeleton name is required.",
      skeletonNameNeedsAlphanumeric:
        "Skeleton name must include letters or numbers.",
      renameEndpointUnavailable: "Rename endpoint is unavailable.",
      renamedSkeleton: "Renamed skeleton to {machineName}.",
      unableToRenameSkeleton: "Unable to rename skeleton.",
      deleteConfirmationUnavailable: "Delete confirmation is unavailable.",
      deleteSkeletonConfirm:
        'Delete skeleton "{machineName}"? This cannot be undone.',
      deleteEndpointUnavailable: "Delete endpoint is unavailable.",
      deletedSkeleton: "Deleted skeleton {machineName}.",
      unableToDeleteSkeleton: "Unable to delete skeleton.",
      renameSkeletonNamed: "Rename skeleton {machineName}",
      deleteSkeletonNamed: "Delete skeleton {machineName}",
      loadingThemeOptions: "Loading theme options…",
      preview: "Preview",
      theme: "Theme",
      noThemeOptions: "No theme options were returned.",
      themePreviewAlt: "Preview of {theme} theme",
      noPreview: "No preview",
      programmingLanguage: "Programming language",
      haxcmsCurrent: "HAXcms current",
      haxcmsLatest: "HAXcms latest",
      loadingStatusReport: "Loading status report…",
      globalCss: "Global CSS",
      globalJavaScript: "Global JavaScript",
      styleGuideHeading: "Style guide",
      styleGuideDisabledRelease:
        "Style guide controls are intentionally disabled in this release while backend integration is completed.",
      loadingSavedApiKeys: "Loading saved API keys…",
      noIntegrationProviders: "No integration providers are configured.",
      getApiKey: "Get API key",
      hideApiKeyValue: "Hide API key value",
      showApiKeyValue: "Show API key value",
      noSettingsForPanel: "No settings available for this panel yet.",
      saving: "Saving…",
      save: "Save",
      statusIntro:
        "How this HAXcms install is running, and anything that needs fixing.",
      skeletonsIntro:
        "Starter structures people pick from when they create a site. Turned-off skeletons stay installed but are hidden.",
      themesIntro:
        "Which themes people can pick for a site on this install. Sites already using a theme you turn off keep it.",
      mediaIntro:
        "Image quality and upload limits for every site on this install.",
      configurationIntro: "Defaults applied to sites created on this install.",
      integrationsIntro:
        "API keys for media providers and AI features. Keys are stored on the server.",
      systemSettingsSections: "System settings sections",
      advanced: "Advanced",
      soon: "Soon",
      collapse: "Collapse",
      expand: "Expand",
      hasUnsavedChanges: "Has unsaved changes",
      checkAgain: "Check again",
      checking: "Checking…",
      needsAttention: "Needs attention",
      environment: "Environment",
      directories: "Directories",
      securityGroup: "Security",
      updates: "Updates",
      support: "Support",
      other: "Other",
      errorsCount: "{count} errors",
      warningsCount: "{count} warnings",
      okCount: "{count} OK",
      infoCount: "{count} info",
      runtime: "Runtime",
      server: "Server",
      latestRelease: "Latest release",
      updateAvailable: "Update available",
      upToDate: "Up to date",
      filterSkeletons: "Filter skeletons",
      filterThemes: "Filter themes",
      show: "Show",
      all: "All",
      off: "Off",
      on: "On",
      uploaded: "Uploaded",
      core: "Core",
      source: "Source",
      category: "Category",
      machineName: "Machine name",
      optionCount: "{count} of {total} on",
      noMatches: "Nothing matches this filter.",
      dropSkeletonHelp:
        "Drop a skeleton .json file here to add it. Uploaded skeletons can be renamed or deleted; core skeletons can only be turned off.",
      changed: "Changed",
      turnedOn: "{name} on",
      turnedOff: "{name} off",
      unsavedChange: "1 unsaved change",
      unsavedChanges: "{count} unsaved changes",
      noUnsavedChanges: "No unsaved changes",
      discard: "Discard",
      images: "Images",
      uploads: "Uploads",
      jpegQualityLabel: "JPEG image quality",
      jpegQualityHelp:
        "From 1 to 100. Used when HAX resizes or converts an uploaded image; higher looks better and makes larger files.",
      maxUploadLabel: "Max upload size",
      maxUploadHelp: "Files bigger than this are refused.",
      serverUploadLimitNote:
        "The server only accepts uploads up to {limit}, so files larger than that will still fail. See Status.",
      acceptedFormatsHelp:
        "File extensions people can upload. Type one and press Enter to add it.",
      addFileFormat: "Add a file format",
      removeFileFormat: "Remove {format}",
      resetToDefaults: "Reset to defaults",
      leaveTitle: "Save changes to {panel}?",
      leaveBody:
        "You have unsaved changes. Save them, or discard them and continue.",
      stay: "Stay",
      discardAndContinue: "Discard and continue",
      saveAndContinue: "Save and continue",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../locales/", import.meta.url).href,
    });
    this.activePanel = "status";
    this.statusMessage = "";
    this.statusRows = [];
    this._saveTone = "";
    this._pendingPanel = "";
    this._filterText = "";
    this._filterView = "all";
    this._railCollapsed = false;
    this._narrow = false;
    this.__resizeObserver = null;
    try {
      this._railCollapsed =
        globalThis.localStorage.getItem(RAIL_COLLAPSED_KEY) === "1";
    } catch {
      // storage can be blocked; the rail starts open
    }
    this.statusSummary = {};
    this.statusLoading = false;
    this.statusError = "";
    this.skeletonOptions = [];
    this.themeOptions = [];
    this.loadingSkeletons = false;
    this.loadingThemes = false;
    this.apiKeysLoading = false;
    this.apiKeysError = "";
    this.apiKeyVisibility = {};
    this.panelSaving = false;
    this.skeletonActionBusy = false;
    this.__statusLoaded = false;
    this.__skeletonsLoaded = false;
    this.__themesLoaded = false;
    this.__integrationsLoaded = false;
    this.__mediaLoaded = false;
    this.__localizationLoaded = false;
    this.__skeletonUploadField = null;
    this.__skeletonUploadNode = null;
    this.__boundSkeletonUploadBefore = this._onSkeletonUploadBefore.bind(this);
    this.__boundSkeletonUploadResponse =
      this._onSkeletonUploadResponse.bind(this);
    this.__boundSkeletonUploadReject = this._onSkeletonUploadReject.bind(this);
    this.panelList = this._buildPanels();
    this.panelMap = this._buildPanelMap(this.panelList);
    this.defaultPanelValues = this._buildDefaultPanelValues(this.panelList);
    this.panelValues = this._cloneData(this.defaultPanelValues);
    // what each panel loaded (or last saved); staged edits compare to it
    this.__loadedPanelValues = this._cloneData(this.defaultPanelValues);
    const defaultStatusPayload = this._buildDefaultStatusPayload();
    this.statusRows = defaultStatusPayload.rows;
    this.statusSummary = defaultStatusPayload.summary;
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadPanelData(this.activePanel);
    // the rail shows how many status checks need attention on every panel
    this._loadStatusData();
    // at narrow widths the rail holds its icons only
    if (globalThis.ResizeObserver && !this.__resizeObserver) {
      this.__resizeObserver = new globalThis.ResizeObserver((entries) => {
        const width = entries[0] ? entries[0].contentRect.width : 0;
        const narrow = width > 0 && width <= NARROW_WIDTH;
        if (narrow !== this._narrow) {
          this._narrow = narrow;
        }
      });
      this.__resizeObserver.observe(this);
    }
  }

  disconnectedCallback() {
    if (this.__resizeObserver) {
      this.__resizeObserver.disconnect();
      this.__resizeObserver = null;
    }
    this._teardownSkeletonUploader();
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    const needsSkeletonUploaderRefresh =
      changedProperties &&
      (changedProperties.has("activePanel") ||
        changedProperties.has("skeletonOptions") ||
        changedProperties.has("skeletonActionBusy"));
    if (
      changedProperties &&
      changedProperties.has("_pendingPanel") &&
      this._pendingPanel
    ) {
      this.updateComplete.then(() => {
        const stay = this.renderRoot.querySelector("#leave-stay");
        if (stay) {
          stay.focus();
        }
      });
    }
    if (needsSkeletonUploaderRefresh && this.activePanel === "skeletons") {
      this.updateComplete.then(() => {
        this._setupSkeletonUploader();
      });
    } else if (
      changedProperties &&
      changedProperties.has("activePanel") &&
      this.activePanel !== "skeletons"
    ) {
      this._teardownSkeletonUploader();
    }
  }

  static get styles() {
    return [
      ...HaxUiAdminStyles,
      ...HaxUiAdminShell,
      css`
        :host {
          display: block;
          box-sizing: border-box;
          /* follow the HAX UI theme switch, not only the OS, so light-dark()
             agrees with the --hax-ui-* colors */
          color-scheme: var(--hax-ui-color-scheme, inherit);
          position: relative;
          height: calc(
            var(--simple-modal-height, 80vh) - var(
                --simple-modal-titlebar-height,
                48px
              )
          );
          min-height: 320px;
          container-type: inline-size;
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          line-height: 1.4;
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
        }
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        simple-icon-lite {
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
          --simple-icon-color: currentColor;
          flex: none;
        }
        button,
        input,
        select,
        textarea {
          font-family: inherit;
        }
        button:focus-visible,
        a:focus-visible,
        input:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }
        .mono {
          font-family: var(--ddd-font-mono, monospace);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        a.link {
          color: var(--hax-ui-accent-strong);
          font-weight: var(--ddd-font-weight-bold, 700);
          text-decoration: none;
        }
        a.link:hover {
          text-decoration: underline;
        }

        /* shell: rail, header, body and action bar come from
           HaxUiAdminShell; these are what system settings adds to it */
        .rail-item {
          position: relative;
        }
        .rail-item .label {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .rail-item[aria-disabled="true"] {
          cursor: default;
          color: var(--hax-ui-text-muted);
        }
        .rail-item[aria-disabled="true"]:hover {
          background-color: transparent;
        }
        .rail-dot {
          width: 8px;
          height: 8px;
          flex: none;
          border-radius: 50%;
          background-color: var(--hax-ui-accent-strong);
        }
        .rail-foot {
          margin-top: auto;
          padding-top: var(--hax-ui-gap-md);
          border-top: 1px solid var(--hax-ui-line);
        }
        .rail-foot .rail-item {
          color: var(--hax-ui-text-muted);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        .rail-foot .rail-item:hover {
          color: var(--hax-ui-text);
        }
        .narrow .rail-foot,
        .rail-collapsed .rail-sub,
        .rail-collapsed .rail-badge[data-tone="soon"] {
          display: none;
        }
        .rail-collapsed .rail-dot {
          position: absolute;
          top: 3px;
          right: 6px;
        }
        .body {
          padding: var(--ddd-spacing-4, 16px) var(--ddd-spacing-5, 20px)
            var(--ddd-spacing-5, 20px);
        }
        .group-title:first-child {
          margin-top: 0;
        }
        .group-title .count {
          letter-spacing: 0;
          font-variant-numeric: tabular-nums;
        }

        /* untoned messages here are quiet loading and status lines */
        .hax-ui-message {
          margin: 0 0 var(--hax-ui-gap-lg);
        }
        /* status tones on the shared .hax-ui-pill; the report's tone names
           (ok, warning, error, info) are the data's, so they map here */
        .tone {
          gap: var(--hax-ui-gap);
          --simple-icon-width: 12px;
          --simple-icon-height: 12px;
        }
        .tone[data-tone="ok"] {
          color: var(--hax-ui-success);
          background-color: transparent;
          box-shadow: inset 0 0 0 1px currentColor;
        }
        .tone[data-tone="warning"] {
          color: var(--hax-ui-warning);
          background-color: var(--hax-ui-warning-soft);
        }
        .tone[data-tone="error"] {
          color: var(--hax-ui-danger);
          background-color: var(--hax-ui-danger-soft);
        }
        .tone[data-tone="info"],
        .tone[data-tone="accent"] {
          color: var(--hax-ui-accent-strong);
          background-color: var(--hax-ui-accent-soft);
        }
        .tone[data-tone="outline"] {
          background-color: transparent;
          box-shadow: inset 0 0 0 1px var(--hax-ui-line-strong);
        }

        /* status */
        .facts {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius-lg);
          overflow: hidden;
        }
        .fact {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
          padding: 10px 14px;
          border-left: 1px solid var(--hax-ui-line);
        }
        .fact:first-child {
          border-left: 0;
        }
        .fact .k {
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        .fact .v {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          font-size: 15px;
          font-weight: var(--ddd-font-weight-bold, 700);
          overflow-wrap: anywhere;
        }
        .tally {
          display: flex;
          flex-wrap: wrap;
          gap: var(--hax-ui-gap-md);
          margin-top: var(--hax-ui-gap-lg);
        }
        .rows {
          margin: 0;
          padding: 0;
          list-style: none;
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius-lg);
          overflow: hidden;
        }
        .rows.attention {
          border-color: color-mix(
            in srgb,
            var(--hax-ui-danger) 35%,
            var(--hax-ui-line)
          );
        }
        .row {
          display: grid;
          grid-template-columns: 96px minmax(0, 1fr) minmax(0, auto);
          align-items: center;
          column-gap: var(--hax-ui-gap-lg);
          row-gap: 2px;
          min-height: 40px;
          padding: 7px 14px;
          border-top: 1px solid var(--hax-ui-line);
        }
        .row:first-child {
          border-top: 0;
        }
        .row:hover {
          background-color: var(--hax-ui-hover);
        }
        .row .tone {
          justify-self: start;
        }
        .row .title {
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .row .value {
          color: var(--hax-ui-text-muted);
          text-align: right;
          overflow-wrap: anywhere;
        }
        .row .value a {
          color: var(--hax-ui-accent-strong);
          font-weight: var(--ddd-font-weight-bold, 700);
          text-decoration: none;
        }
        .row .value a:hover {
          text-decoration: underline;
        }
        .row .desc {
          grid-column: 2 / 4;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 4px var(--hax-ui-gap-lg);
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
          overflow-wrap: anywhere;
        }

        /* list tools: filter, view switch, count */
        .tools {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          margin-bottom: var(--hax-ui-gap-lg);
        }
        .search {
          position: relative;
          width: 240px;
          max-width: 100%;
        }
        .search simple-icon-lite {
          position: absolute;
          left: 8px;
          top: 8px;
          color: var(--hax-ui-text-muted);
        }
        /* room for the search icon inside the field */
        .search .hax-ui-input {
          padding-left: 30px;
        }
        .hax-ui-seg .n {
          font-weight: var(--ddd-font-weight-medium, 500);
          color: var(--hax-ui-text-muted);
        }
        .tools .count {
          margin-left: auto;
          font-size: 13px;
          color: var(--hax-ui-text-muted);
        }

        /* skeletons */
        .drop {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
          padding: var(--hax-ui-gap-md) 14px;
          margin-bottom: var(--hax-ui-gap-lg);
          border: 1px dashed var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius-lg);
          font-size: 13px;
          color: var(--hax-ui-text-muted);
        }
        .drop p {
          flex: 1 1 280px;
          margin: 0;
        }
        .drop hax-upload-field {
          flex: 1 1 320px;
        }
        .table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius-lg);
          overflow: hidden;
        }
        .table th,
        .table td {
          padding: 6px 10px;
          border-top: 1px solid var(--hax-ui-line);
          text-align: left;
          vertical-align: middle;
        }
        .table th {
          border-top: 0;
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-bold, 700);
          color: var(--hax-ui-text-muted);
          background-color: var(--hax-ui-sunken);
        }
        .table tbody tr:hover {
          background-color: var(--hax-ui-hover);
        }
        .table tr.changed {
          background-color: var(--hax-ui-accent-soft);
        }
        .table .check-col {
          width: 44px;
        }
        .table .actions-col {
          width: 72px;
          text-align: right;
        }
        .table input[type="checkbox"],
        .card input[type="checkbox"] {
          width: 16px;
          height: 16px;
          margin: 0;
          accent-color: var(--hax-ui-accent-strong);
        }
        .option-name {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: var(--ddd-font-weight-bold, 700);
          cursor: pointer;
        }
        .option-desc {
          margin: 2px 0 0;
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        .table td.mono {
          white-space: nowrap;
        }
        tr.off .option-name,
        tr.off .mono {
          color: var(--hax-ui-text-muted);
        }
        .row-actions {
          display: inline-flex;
          gap: 2px;
        }

        /* themes */
        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(176px, 1fr));
          gap: var(--hax-ui-gap-lg);
        }
        .card {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius-lg);
          overflow: hidden;
          background-color: var(--hax-ui-surface);
        }
        .card:hover {
          border-color: var(--hax-ui-accent-strong);
        }
        .card.changed {
          border-color: var(--hax-ui-accent-strong);
          box-shadow: 0 0 0 1px var(--hax-ui-accent-strong);
        }
        .card.off .shot img {
          opacity: 0.45;
        }
        .shot {
          aspect-ratio: 16 / 10;
          background-color: var(--hax-ui-sunken);
          border-bottom: 1px solid var(--hax-ui-line);
          display: grid;
          place-items: center;
          color: var(--hax-ui-text-muted);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        .shot img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top left;
        }
        .card-cap {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          min-height: 44px;
          padding: 6px 10px;
        }
        .card-cap .text {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .card-cap label {
          font-weight: var(--ddd-font-weight-bold, 700);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
        }
        .card.off .card-cap label {
          font-weight: var(--ddd-font-weight-medium, 500);
          color: var(--hax-ui-text-muted);
        }
        .card-cap .meta {
          font-size: 11px;
          color: var(--hax-ui-text-muted);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .card-cap .meta .mono {
          font-size: 11px;
        }

        /* field rows: label and help on the left, control on the right */
        /* field rows are .hax-ui-field-row; these controls set their
           parts side by side (slider and number, key and show button) */
        .hax-ui-field-row:first-child {
          padding-top: 0;
        }
        .hax-ui-field-control.inline {
          flex-direction: row;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
        }
        .hax-ui-field-control.inline > .hax-ui-input {
          flex: 1;
          width: auto;
          min-width: 0;
        }
        .hax-ui-field-control.inline > .hax-ui-message {
          flex-basis: 100%;
          margin: 0;
        }
        input[type="range"] {
          flex: 1 1 160px;
          accent-color: var(--hax-ui-accent-strong);
        }
        simple-fields {
          width: 100%;
          --simple-fields-color: var(--hax-ui-text);
          --simple-fields-background-color: transparent;
          --simple-fields-fieldset-background-color: transparent;
          --simple-fields-input-background-color: var(--hax-ui-surface);
          --simple-fields-border-color: var(--hax-ui-line-strong);
          --simple-fields-font-family: var(--hax-ui-admin-font-family);
          --simple-fields-font-size: var(--hax-ui-admin-font-size);
          --simple-fields-select-option-background-color: var(--hax-ui-surface);
          --simple-fields-button-background-color: transparent;
        }
        .code-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: var(--hax-ui-gap-lg);
        }
        .code-grid > div {
          min-height: 360px;
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius-lg);
          overflow: hidden;
        }
        .code-grid code-editor {
          display: block;
          height: 100%;
        }

        /* narrow: the rail holds its icons, rows and fields stack */
        @container (max-width: 760px) {
          .ph {
            padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
          }
          .ph h2 {
            font-size: 18px;
          }
          .body {
            padding: var(--hax-ui-gap-lg);
          }
          .ftr {
            padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
          }
          .facts {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .fact:nth-child(3) {
            border-left: 0;
          }
          .fact:nth-child(n + 3) {
            border-top: 1px solid var(--hax-ui-line);
          }
          .row {
            grid-template-columns: minmax(0, 1fr) auto;
          }
          .row .tone {
            grid-column: 1 / 3;
            justify-self: start;
          }
          .row .desc {
            grid-column: 1 / 3;
          }
          .hax-ui-field-row {
            grid-template-columns: minmax(0, 1fr);
            gap: var(--hax-ui-gap-md);
          }
          .code-grid {
            grid-template-columns: minmax(0, 1fr);
          }
          .table .hide-narrow {
            display: none;
          }
          .tools .count {
            margin-left: 0;
            width: 100%;
          }
        }
      `,
    ];
  }

  _buildPanels() {
    return [
      {
        key: "status",
        label: this.t.status,
        icon: HaxUiAdminIcons.check,
        group: "primary",
        description: this.t.runtimeAndUpdateStatus,
        intro: this.t.statusIntro,
        panelType: "status",
      },
      {
        key: "skeletons",
        label: this.t.skeletons,
        icon: HaxUiAdminIcons.structure,
        group: "primary",
        description: this.t.availableStarterStructures,
        intro: this.t.skeletonsIntro,
        panelType: "skeletons",
      },
      {
        key: "themes",
        label: this.t.themes,
        icon: HaxUiAdminIcons.theme,
        group: "primary",
        description: this.t.availableThemes,
        intro: this.t.themesIntro,
        panelType: "themes",
      },
      {
        key: "blocks",
        label: this.t.blocks,
        icon: HaxUiAdminIcons.blocks,
        group: "primary",
        description: this.t.allowedBlockRegistry,
        intro: this.t.blocksPanelIntro,
        panelType: "blocks",
        disabled: true,
      },
      {
        key: "integrations",
        label: this.t.integrations,
        icon: HaxUiAdminIcons.api,
        group: "advanced",
        description: this.t.thirdPartyCredentials,
        intro: this.t.integrationsIntro,
        panelType: "integrations",
        disabled: true,
        sections: [
          {
            key: "api-keys",
            label: this.t.apiKeys,
            icon: HaxUiAdminIcons.key,
            description: this.t.apiKeysSectionDescription,
            fields: [
              {
                property: "youtubeApiKey",
                providerLabel: "YouTube",
                storageKey: "youtube",
                title: this.t.providerApiKey.replace("{provider}", "YouTube"),
                helpUrl:
                  "https://developers.google.com/youtube/v3/getting-started",
                inputMethod: "textfield",
                default: "",
              },
              {
                property: "giphyApiKey",
                providerLabel: "Giphy",
                storageKey: "giphy",
                title: this.t.providerApiKey.replace("{provider}", "Giphy"),
                helpUrl: "https://developers.giphy.com/dashboard/",
                inputMethod: "textfield",
                default: "",
              },
              {
                property: "vimeoApiKey",
                providerLabel: "Vimeo",
                storageKey: "vimeo",
                title: this.t.providerApiKey.replace("{provider}", "Vimeo"),
                helpUrl: "https://developer.vimeo.com/apps",
                inputMethod: "textfield",
                default: "",
              },
              {
                property: "unsplashApiKey",
                providerLabel: "Unsplash",
                storageKey: "unsplash",
                title: this.t.providerApiKey.replace("{provider}", "Unsplash"),
                helpUrl: "https://unsplash.com/developers",
                inputMethod: "textfield",
                default: "",
              },
              {
                property: "flickrApiKey",
                providerLabel: "Flickr",
                storageKey: "flickr",
                title: this.t.providerApiKey.replace("{provider}", "Flickr"),
                helpUrl: "https://www.flickr.com/services/apps/create/",
                inputMethod: "textfield",
                default: "",
              },
              {
                property: "anthropicApiKey",
                providerLabel: "Anthropic",
                storageKey: "anthropic",
                title: this.t.providerApiKey.replace("{provider}", "Anthropic"),
                helpUrl: "https://console.anthropic.com/settings/keys",
                inputMethod: "textfield",
                default: "",
              },
            ],
          },
        ],
      },
      {
        key: "media",
        label: this.t.media,
        icon: HaxUiAdminIcons.image,
        group: "advanced",
        description: this.t.mediaDefaults,
        intro: this.t.mediaIntro,
        panelType: "fields",
        sections: [
          {
            key: "media-policy",
            label: this.t.mediaPolicy,
            icon: HaxUiAdminIcons.image,
            description: this.t.mediaPolicySectionDescription,
            fields: [
              {
                property: "jpegQuality",
                title: this.t.jpegImageQuality,
                inputMethod: "number",
                default: 90,
              },
              {
                property: "maxUploadSizeMb",
                title: this.t.maxUploadSizeMb,
                inputMethod: "number",
                default: 25,
              },
              {
                property: "acceptedFormats",
                title: this.t.acceptedFileFormats,
                inputMethod: "textarea",
                default: "jpg,jpeg,png,webp,gif",
              },
            ],
          },
        ],
      },
      {
        key: "configuration",
        label: this.t.configuration,
        icon: HaxUiAdminIcons.details,
        group: "advanced",
        description: this.t.systemWideDefaults,
        intro: this.t.configurationIntro,
        panelType: "fields",
        sections: [
          {
            key: "localization",
            label: this.t.localization,
            icon: HaxUiAdminIcons.language,
            description: this.t.localizationSectionDescription,
            fields: [
              {
                property: "defaultLanguage",
                title: this.t.defaultLanguageForNewSites,
                inputMethod: "haxcms-language-picker",
                allowCustom: true,
                default: "en-US",
              },
            ],
          },
        ],
      },
      {
        key: "style-guide",
        label: this.t.styleGuide,
        icon: HaxUiAdminIcons.text,
        group: "advanced",
        description: this.t.authoringStyleGuidance,
        intro: this.t.styleGuidePanelIntro,
        panelType: "style-guide",
        disabled: true,
      },
      {
        key: "custom-code",
        label: this.t.customCodePanel,
        icon: HaxUiAdminIcons.editor,
        group: "advanced",
        description: this.t.globalCssAndJavaScript,
        intro: this.t.customCodePanelIntro,
        panelType: "custom-code",
        disabled: true,
      },
    ];
  }

  _buildPanelMap(panelList) {
    const map = {};
    for (let i = 0; i < panelList.length; i++) {
      map[panelList[i].key] = panelList[i];
    }
    return map;
  }

  _buildDefaultPanelValues(panelList) {
    const defaults = {};
    for (let i = 0; i < panelList.length; i++) {
      const panel = panelList[i];
      const panelDefaults = {};
      if (panel.panelType === "custom-code") {
        panelDefaults.globalCss = "";
        panelDefaults.globalJs = "";
      }
      if (panel.sections && panel.sections.length > 0) {
        for (let j = 0; j < panel.sections.length; j++) {
          const section = panel.sections[j];
          if (!section.fields || section.fields.length === 0) {
            continue;
          }
          for (let k = 0; k < section.fields.length; k++) {
            const field = section.fields[k];
            if (typeof field.default !== "undefined") {
              panelDefaults[field.property] = this._cloneData(field.default);
            } else if (field.inputMethod === "boolean") {
              panelDefaults[field.property] = false;
            } else if (field.inputMethod === "number") {
              panelDefaults[field.property] = 0;
            } else {
              panelDefaults[field.property] = "";
            }
          }
        }
      }
      defaults[panel.key] = panelDefaults;
    }
    return defaults;
  }

  _cloneData(value) {
    if (value && typeof value === "object") {
      return JSON.parse(JSON.stringify(value));
    }
    return value;
  }

  _getPanelByKey(panelKey) {
    if (panelKey && this.panelMap && this.panelMap[panelKey]) {
      return this.panelMap[panelKey];
    }
    return null;
  }
  _getSystemOperationEndpoint(operationId = "") {
    const normalizedOperationId = `${operationId || ""}`.trim();
    if (!normalizedOperationId) {
      return "";
    }
    const operationName = `@system/${normalizedOperationId}`;
    const api = this._backendApi();
    if (api && typeof api._configureSystemApiRegistry === "function") {
      api._configureSystemApiRegistry();
    }
    if (
      !MicroFrontendRegistry ||
      typeof MicroFrontendRegistry.has !== "function" ||
      !MicroFrontendRegistry.has(operationName)
    ) {
      return "";
    }
    const operation = MicroFrontendRegistry.get(operationName, true);
    if (!operation || typeof operation.endpoint !== "string") {
      return "";
    }
    return operation.endpoint.trim();
  }
  async _ensureSystemRegistryReady() {
    const api = this._backendApi();
    if (api && typeof api._configureSystemApiRegistry === "function") {
      try {
        await api._configureSystemApiRegistry();
      } catch {
        // intentionally empty
      }
    }
    try {
      await waitForAppHAXSystemApiRegistryReady();
    } catch {
      // intentionally empty
    }
  }

  _schemaFileOperationEndpoint() {
    return this._getSystemOperationEndpoint("schemaFileOperation");
  }

  _hasSchemaFileOperationEndpoint() {
    return this._schemaFileOperationEndpoint() !== "";
  }

  _schemaOperationHeaders() {
    const api = this._backendApi();
    const settings = this._appSettings();
    const headers = {};
    const userTokenHeaderName =
      settings && typeof settings.userTokenHeader === "string"
        ? settings.userTokenHeader.trim()
        : "";
    const userTokenValue =
      settings && typeof settings.userToken === "string"
        ? settings.userToken.trim()
        : "";
    if (
      userTokenHeaderName !== "" &&
      userTokenValue !== "" &&
      !Object.prototype.hasOwnProperty.call(headers, userTokenHeaderName)
    ) {
      headers[userTokenHeaderName] = userTokenValue;
    }
    let jwtValue = "";
    if (api && typeof api.jwt === "string" && api.jwt.trim() !== "") {
      jwtValue = api.jwt.trim();
    } else if (
      settings &&
      typeof settings.jwt === "string" &&
      settings.jwt.trim() !== ""
    ) {
      jwtValue = settings.jwt.trim();
    }
    if (jwtValue !== "") {
      if (
        jwtValue.indexOf("Bearer ") !== 0 &&
        jwtValue.indexOf("bearer ") !== 0
      ) {
        jwtValue = `Bearer ${jwtValue}`;
      }
      if (!Object.prototype.hasOwnProperty.call(headers, "Authorization")) {
        headers.Authorization = jwtValue;
      }
    }
    return headers;
  }

  _schemaUploadPayload() {
    return {
      schema: "skeleton",
      action: "upload",
    };
  }

  _appendQueryParams(endpoint = "", params = {}) {
    const target = typeof endpoint === "string" ? endpoint.trim() : "";
    if (!target) {
      return "";
    }
    const hashIndex = target.indexOf("#");
    const baseWithQuery =
      hashIndex === -1 ? target : target.substring(0, hashIndex);
    const hash = hashIndex === -1 ? "" : target.substring(hashIndex);
    const queryIndex = baseWithQuery.indexOf("?");
    const basePath =
      queryIndex === -1
        ? baseWithQuery
        : baseWithQuery.substring(0, queryIndex);
    const existingQuery =
      queryIndex === -1 ? "" : baseWithQuery.substring(queryIndex + 1);
    const searchParams = new URLSearchParams(existingQuery);
    const payload =
      params && typeof params === "object" && !Array.isArray(params)
        ? params
        : {};
    const keys = Object.keys(payload);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = payload[key];
      if (typeof value === "undefined" || value === null) {
        continue;
      }
      const normalized = `${value}`.trim();
      if (!normalized) {
        continue;
      }
      searchParams.set(key, normalized);
    }
    const query = searchParams.toString();
    return `${basePath}${query ? `?${query}` : ""}${hash}`;
  }

  _schemaFileUploadTarget() {
    return this._schemaFileOperationEndpoint();
  }

  async _schemaFileOperationJson(payload = {}) {
    const endpoint = this._schemaFileOperationEndpoint();
    if (!endpoint) {
      return {
        ok: false,
        status: 0,
        data: null,
        message: this.t.schemaEndpointUnavailable,
      };
    }
    const body = {};
    if (payload && typeof payload === "object" && !Array.isArray(payload)) {
      const keys = Object.keys(payload);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        body[key] = payload[key];
      }
    }
    const headers = this._schemaOperationHeaders();
    headers["Content-Type"] = "application/json";
    let response = null;
    let data = null;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: headers,
        body: JSON.stringify(body),
      });
      try {
        data = await response.json();
      } catch {
        data = null;
      }
    } catch {
      return {
        ok: false,
        status: 0,
        data: null,
        message: this.t.networkRequestFailed,
      };
    }
    if (response && response.ok) {
      return {
        ok: true,
        status: response.status,
        data: data,
        message: "",
      };
    }
    return {
      ok: false,
      status: response ? response.status : 0,
      data: data,
      message: this._schemaOperationResponseMessage(
        data,
        this.t.schemaOperationFailed,
      ),
    };
  }

  _schemaOperationResponseMessage(response = null, fallback = "") {
    // backend message, translated by its code when possible (issues#3157)
    return haxcmsApiMessage(response, fallback || this.t.requestFailed);
  }

  _parseUploadJsonResponse(xhr = null) {
    if (
      !xhr ||
      typeof xhr.response !== "string" ||
      xhr.response.trim() === ""
    ) {
      return null;
    }
    try {
      return JSON.parse(xhr.response);
    } catch {
      return null;
    }
  }

  _setupSkeletonUploader() {
    if (!this._hasSchemaFileOperationEndpoint()) {
      this._teardownSkeletonUploader();
      return;
    }
    if (!this.renderRoot) {
      return;
    }
    const uploadField = this.renderRoot.querySelector("#skeleton-upload-field");
    if (!uploadField || !uploadField.shadowRoot) {
      return;
    }
    const uploadNode = uploadField.shadowRoot.querySelector("#fileupload");
    if (!uploadNode) {
      return;
    }
    if (this.__skeletonUploadNode && this.__skeletonUploadNode !== uploadNode) {
      this._teardownSkeletonUploader();
    }
    uploadField.showSources = false;
    uploadField._canUpload = () => false;
    uploadNode.method = "POST";
    uploadNode.formDataName = "file";
    uploadNode.accept = ".json,application/json";
    uploadNode.withCredentials = true;
    uploadNode.target = this._schemaFileUploadTarget();
    uploadNode.headers = this._schemaOperationHeaders();
    if (this.__skeletonUploadNode !== uploadNode) {
      uploadNode.addEventListener(
        "upload-before",
        this.__boundSkeletonUploadBefore,
      );
      uploadNode.addEventListener(
        "upload-response",
        this.__boundSkeletonUploadResponse,
      );
      uploadNode.addEventListener(
        "file-reject",
        this.__boundSkeletonUploadReject,
      );
    }
    this.__skeletonUploadField = uploadField;
    this.__skeletonUploadNode = uploadNode;
  }

  _teardownSkeletonUploader() {
    if (this.__skeletonUploadNode) {
      this.__skeletonUploadNode.removeEventListener(
        "upload-before",
        this.__boundSkeletonUploadBefore,
      );
      this.__skeletonUploadNode.removeEventListener(
        "upload-response",
        this.__boundSkeletonUploadResponse,
      );
      this.__skeletonUploadNode.removeEventListener(
        "file-reject",
        this.__boundSkeletonUploadReject,
      );
    }
    this.__skeletonUploadField = null;
    this.__skeletonUploadNode = null;
  }

  _clearSkeletonUploaderQueue() {
    if (this.__skeletonUploadNode) {
      this.__skeletonUploadNode.files = [];
    }
  }

  _onSkeletonUploadBefore(e = null) {
    const payload = this._schemaUploadPayload();
    if (this.__skeletonUploadNode) {
      this.__skeletonUploadNode.target = this._schemaFileUploadTarget();
      this.__skeletonUploadNode.headers = this._schemaOperationHeaders();
    }
    const formData =
      e && e.detail && e.detail.formData ? e.detail.formData : null;
    if (formData) {
      const keys = Object.keys(payload);
      if (typeof formData.delete === "function") {
        for (let i = 0; i < keys.length; i++) {
          formData.delete(keys[i]);
        }
      }
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        formData.append(key, payload[key]);
      }
    }
    this.statusMessage = this.t.uploadingSkeleton;
  }

  async _onSkeletonUploadResponse(e = null) {
    const xhr = e && e.detail ? e.detail.xhr : null;
    const status = xhr && typeof xhr.status === "number" ? xhr.status : 0;
    const response = this._parseUploadJsonResponse(xhr);
    if (status === 200) {
      const machineName =
        response &&
        response.data &&
        typeof response.data.machineName === "string" &&
        response.data.machineName
          ? response.data.machineName
          : "";
      this.statusMessage = machineName
        ? this.t.uploadedSkeleton.replace("{machineName}", () => machineName)
        : this.t.skeletonUploaded;
      this._clearSkeletonUploaderQueue();
      await this._loadSkeletonOptions(true);
      return;
    }
    this.statusMessage = this._schemaOperationResponseMessage(
      response,
      this.t.unableToUploadSkeleton,
    );
    this._clearSkeletonUploaderQueue();
  }

  _onSkeletonUploadReject(e = null) {
    let message = this.t.unableToUploadSkeleton;
    if (
      e &&
      e.detail &&
      typeof e.detail.error === "string" &&
      e.detail.error.trim() !== ""
    ) {
      message = e.detail.error.trim();
    }
    this.statusMessage = message;
  }

  _panelLabel(panelKey) {
    const panel = this._getPanelByKey(panelKey);
    return panel ? panel.label : this.t.settings;
  }

  /**
   * Status is where system settings opens; "dashboard" (the old launcher)
   * and anything unknown resolve to it so existing links keep working.
   */
  _normalizePanelKey(panelKey) {
    if (typeof panelKey !== "string") {
      return "status";
    }
    const normalized = panelKey.trim().toLowerCase();
    if (this.panelMap && this.panelMap[normalized]) {
      return normalized;
    }
    return "status";
  }

  _loadPanelData(panelKey = "status") {
    const normalized = this._normalizePanelKey(panelKey);
    if (normalized === "skeletons") {
      this._loadSkeletonOptions();
    } else if (normalized === "themes") {
      this._loadThemeOptions();
    } else if (normalized === "integrations") {
      this._loadApiKeysData();
    } else if (normalized === "media") {
      this._loadMediaSettingsData(true);
      // Media compares its upload size with the server's upload limit
      this._loadStatusData();
    } else if (normalized === "configuration") {
      this._loadLocalizationSettingsData(true);
    } else if (normalized === "status") {
      this._loadStatusData();
    }
  }

  setActivePanelFromRoute(panelKey = "status") {
    const normalized = this._normalizePanelKey(panelKey);
    if (normalized !== this.activePanel) {
      this._resetPanelView();
    }
    this.activePanel = normalized;
    this.statusMessage = "";
    this._loadPanelData(normalized);
  }

  _dispatchPanelChanged(panelKey, historyMode = "push") {
    this.dispatchEvent(
      new CustomEvent("haxcms-system-settings-panel-changed", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          panel: panelKey,
          historyMode: historyMode,
        },
      }),
    );
  }

  async _saveEnabledBlocksData(payload = {}) {
    let enabledBlocks = [];
    if (payload && Array.isArray(payload.allowedBlocks)) {
      enabledBlocks = payload.allowedBlocks
        .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
        .filter((tag) => tag !== "");
    } else if (
      payload &&
      payload.allowedBlocks !== null &&
      typeof payload.allowedBlocks !== "undefined"
    ) {
      return false;
    }
    const response = await this._callAppEndpointWithData(
      ["saveEnabledBlocks"],
      {
        enabledBlocks: enabledBlocks,
      },
    );
    return !!(response && response.status === 200);
  }

  _openPanel(panelKey) {
    const normalized = this._normalizePanelKey(panelKey);
    const panel = this._getPanelByKey(normalized);
    if (!panel || panel.disabled) {
      return;
    }
    if (normalized !== this.activePanel) {
      this._resetPanelView();
    }
    this.activePanel = normalized;
    this.statusMessage = "";
    this._loadPanelData(normalized);
    this._dispatchPanelChanged(normalized, "push");
  }

  _getPanelValue(panelKey) {
    if (this.panelValues && this.panelValues[panelKey]) {
      return this.panelValues[panelKey];
    }
    return {};
  }

  _isValueEqual(valueA, valueB) {
    if (valueA === valueB) {
      return true;
    }
    if (
      valueA &&
      valueB &&
      typeof valueA === "object" &&
      typeof valueB === "object"
    ) {
      return JSON.stringify(valueA) === JSON.stringify(valueB);
    }
    return false;
  }

  _onPanelValueChanged(panelKey, e) {
    if (!panelKey || !e || !e.detail || !e.detail.value) {
      return;
    }
    const incoming = e.detail.value;
    const currentValues = this._cloneData(this.panelValues || {});
    const panelValues = this._cloneData(currentValues[panelKey] || {});
    const keys = Object.keys(incoming);
    let hasChange = false;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (!this._isValueEqual(panelValues[key], incoming[key])) {
        panelValues[key] = this._cloneData(incoming[key]);
        hasChange = true;
      }
    }
    if (!hasChange) {
      return;
    }
    currentValues[panelKey] = panelValues;
    this.panelValues = currentValues;
  }

  _setPanelPropertyValue(panelKey, property, value) {
    const currentValues = this._cloneData(this.panelValues || {});
    const panelValues = this._cloneData(currentValues[panelKey] || {});
    if (this._isValueEqual(panelValues[property], value)) {
      return;
    }
    panelValues[property] = value;
    currentValues[panelKey] = panelValues;
    this.panelValues = currentValues;
  }

  _onCodeEditorValueChanged(panelKey, property, e) {
    const value =
      e && e.detail && typeof e.detail.value === "string" ? e.detail.value : "";
    this._setPanelPropertyValue(panelKey, property, value);
  }

  _showPanelSaveAction(panel) {
    if (!panel) {
      return false;
    }
    return !["status", "style-guide", "blocks"].includes(panel.key);
  }

  _buildSavePayload(panelKey, values) {
    if (panelKey === "skeletons") {
      return {
        enabledSkeletons: this._selectedOptionMachineNames(
          values,
          this.skeletonOptions,
        ),
      };
    }
    if (panelKey === "themes") {
      return {
        enabledThemes: this._selectedOptionMachineNames(
          values,
          this.themeOptions,
        ),
      };
    }
    if (panelKey === "custom-code") {
      return {
        globalCss: values && values.globalCss ? values.globalCss : "",
        globalJs: values && values.globalJs ? values.globalJs : "",
      };
    }
    if (panelKey === "integrations") {
      return this._buildIntegrationsSavePayload(values);
    }
    if (panelKey === "media") {
      return this._buildMediaSavePayload(values);
    }
    if (panelKey === "configuration") {
      return this._buildLocalizationSavePayload(values);
    }
    return values;
  }

  _reloadAfterOptionSave(panelKey = "") {
    if (!["skeletons", "themes"].includes(panelKey)) {
      return;
    }
    setTimeout(() => {
      globalThis.location.reload();
    }, 300);
  }
  async _saveActivePanel() {
    const panelKey = this.activePanel;
    if (!panelKey || this.panelSaving) {
      return;
    }
    const panel = this._getPanelByKey(panelKey);
    if (!panel || panel.disabled) {
      this.statusMessage = `${this._panelLabel(panelKey)}: Coming soon`;
      return;
    }
    this.panelSaving = true;
    const values = this._cloneData(this._getPanelValue(panelKey));
    const savePayload = this._buildSavePayload(panelKey, values);
    let saved = true;
    if (panelKey === "skeletons") {
      saved = await this._saveEnabledSkeletonsData(
        savePayload.enabledSkeletons,
      );
      this.statusMessage = saved
        ? this.t.skeletonOptionsSaved.replace(
            "{count}",
            () => savePayload.enabledSkeletons.length,
          )
        : this.t.unableToSaveSkeletonOptions;
      if (saved) {
        this._reloadAfterOptionSave(panelKey);
      }
    } else if (panelKey === "themes") {
      saved = await this._saveEnabledThemesData(savePayload.enabledThemes);
      this.statusMessage = saved
        ? this.t.themeOptionsSaved.replace(
            "{count}",
            () => savePayload.enabledThemes.length,
          )
        : this.t.unableToSaveThemeOptions;
      if (saved) {
        this._reloadAfterOptionSave(panelKey);
      }
    } else if (panelKey === "custom-code") {
      this.statusMessage = this.t.panelSavedLocally.replace("{panel}", () =>
        this._panelLabel(panelKey),
      );
    } else if (panelKey === "integrations") {
      saved = await this._saveApiKeysData(savePayload);
      this.statusMessage = saved
        ? this.t.panelSaved.replace("{panel}", () => this._panelLabel(panelKey))
        : this.t.unableToSavePanel.replace("{panel}", () =>
            this._panelLabel(panelKey).toLowerCase(),
          );
    } else if (panelKey === "media") {
      saved = await this._saveMediaSettingsData(savePayload);
      this.statusMessage = saved
        ? this.t.panelSaved.replace("{panel}", () => this._panelLabel(panelKey))
        : this.t.unableToSavePanel.replace("{panel}", () =>
            this._panelLabel(panelKey).toLowerCase(),
          );
    } else if (panelKey === "configuration") {
      saved = await this._saveLocalizationSettingsData(savePayload);
      this.statusMessage = saved
        ? this.t.panelSaved.replace("{panel}", () => this._panelLabel(panelKey))
        : this.t.unableToSavePanel.replace("{panel}", () =>
            this._panelLabel(panelKey).toLowerCase(),
          );
    } else {
      this.statusMessage = this.t.panelSavedLocallyPending.replace(
        "{panel}",
        () => this._panelLabel(panelKey),
      );
    }
    this._saveTone = saved ? "saved" : "error";
    this.dispatchEvent(
      new CustomEvent("haxcms-system-settings-save", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          panel: panelKey,
          values: savePayload,
          saved: saved,
        },
      }),
    );
    this.panelSaving = false;
  }

  async _onAllowedBlocksSaved(e) {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    const payload = e && e.detail ? e.detail : {};
    const saved = await this._saveEnabledBlocksData(payload);
    this.statusMessage = saved
      ? this.t.enabledBlocksSaved
      : this.t.unableToSaveEnabledBlocks;
    this.dispatchEvent(
      new CustomEvent("haxcms-system-settings-save", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          panel: "blocks",
          values: payload,
          saved: saved,
        },
      }),
    );
  }

  _onNestedModalHide(e) {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
  }

  _appSettings() {
    const settings =
      globalThis &&
      globalThis.appSettings &&
      typeof globalThis.appSettings === "object"
        ? globalThis.appSettings
        : {};
    return settings;
  }

  _backendApi() {
    if (
      globalThis &&
      globalThis.AppHaxAPI &&
      typeof globalThis.AppHaxAPI.requestAvailability === "function"
    ) {
      return globalThis.AppHaxAPI.requestAvailability();
    }
    if (globalThis && globalThis.AppHaxAPI && globalThis.AppHaxAPI.instance) {
      return globalThis.AppHaxAPI.instance;
    }
    return null;
  }

  async _callAppEndpoint(callKeys = []) {
    if (!Array.isArray(callKeys) || callKeys.length === 0) {
      return null;
    }
    const api = this._backendApi();
    if (!api || typeof api.makeCall !== "function") {
      return null;
    }
    for (let i = 0; i < callKeys.length; i++) {
      const callKey = callKeys[i];
      if (this._supportsCall(callKey)) {
        try {
          const response = await api.makeCall(callKey);
          if (response) {
            return response;
          }
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  async _callAppEndpointWithData(callKeys = [], data = {}) {
    if (!Array.isArray(callKeys) || callKeys.length === 0) {
      return null;
    }
    const api = this._backendApi();
    if (!api || typeof api.makeCall !== "function") {
      return null;
    }
    const payload =
      data && typeof data === "object" && !Array.isArray(data) ? data : {};
    for (let i = 0; i < callKeys.length; i++) {
      const callKey = callKeys[i];
      if (this._supportsCall(callKey)) {
        try {
          const response = await api.makeCall(callKey, payload);
          if (response) {
            return response;
          }
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  _integrationFields() {
    const panel = this._getPanelByKey("integrations");
    if (!panel || !Array.isArray(panel.sections)) {
      return [];
    }
    for (let i = 0; i < panel.sections.length; i++) {
      const section = panel.sections[i];
      if (
        section &&
        Array.isArray(section.fields) &&
        section.fields.length > 0
      ) {
        return section.fields;
      }
    }
    return [];
  }

  _resolveThemePreviewPath(path = "") {
    if (typeof path !== "string") {
      return "";
    }
    const normalized = path.trim();
    if (!normalized) {
      return "";
    }
    if (normalized.indexOf("@haxtheweb/") === 0) {
      const scopeMarker = "/@haxtheweb/";
      const markerIndex = import.meta.url.indexOf(scopeMarker);
      if (markerIndex !== -1) {
        const scopedBase = import.meta.url.substring(
          0,
          markerIndex + scopeMarker.length,
        );
        const packagePath = normalized.replace("@haxtheweb/", "");
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
        return `${basePath}${normalized}`;
      }
      const packagePath = `../../../../${normalized}`;
      return new URL(packagePath, import.meta.url).href;
    }
    return normalized;
  }

  _integrationFieldByProperty(property = "") {
    const fields = this._integrationFields();
    for (let i = 0; i < fields.length; i++) {
      if (fields[i] && fields[i].property === property) {
        return fields[i];
      }
    }
    return null;
  }

  _integrationInputId(property = "") {
    const cleaned = `${property || ""}`.replace(/[^a-z0-9_-]/gi, "");
    return `integration-${cleaned}`;
  }

  _normalizeIntegrationValue(value) {
    if (typeof value === "string") {
      return value;
    }
    if (value === null || typeof value === "undefined") {
      return "";
    }
    return `${value}`;
  }

  _normalizeApiKeysRecord(source = {}) {
    const fields = this._integrationFields();
    const data =
      source && typeof source === "object" && !Array.isArray(source)
        ? source
        : {};
    const normalized = {};
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const property = field.property;
      const storageKey =
        typeof field.storageKey === "string" && field.storageKey
          ? field.storageKey
          : property;
      let value = "";
      if (Object.prototype.hasOwnProperty.call(data, property)) {
        value = data[property];
      } else if (Object.prototype.hasOwnProperty.call(data, storageKey)) {
        value = data[storageKey];
      }
      normalized[property] = this._normalizeIntegrationValue(value);
    }
    return normalized;
  }

  _applyApiKeysRecord(record = {}) {
    const fields = this._integrationFields();
    if (fields.length === 0) {
      return;
    }
    const currentValues = this._cloneData(this.panelValues || {});
    const panelValues = this._cloneData(currentValues.integrations || {});
    const data =
      record && typeof record === "object" && !Array.isArray(record)
        ? record
        : {};
    for (let i = 0; i < fields.length; i++) {
      const property = fields[i].property;
      const nextValue = Object.prototype.hasOwnProperty.call(data, property)
        ? data[property]
        : "";
      panelValues[property] = this._normalizeIntegrationValue(nextValue);
    }
    currentValues.integrations = panelValues;
    this.panelValues = currentValues;
    this._snapshotPanel("integrations");
  }

  _integrationFieldValue(property = "") {
    const values = this._getPanelValue("integrations");
    if (
      values &&
      Object.prototype.hasOwnProperty.call(values, property) &&
      typeof values[property] !== "undefined" &&
      values[property] !== null
    ) {
      return `${values[property]}`;
    }
    return "";
  }

  _isApiKeyVisible(property = "") {
    return !!(
      this.apiKeyVisibility &&
      Object.prototype.hasOwnProperty.call(this.apiKeyVisibility, property) &&
      this.apiKeyVisibility[property]
    );
  }

  _toggleApiKeyVisibility(property = "", e = null) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!property) {
      return;
    }
    const visibility = this._cloneData(this.apiKeyVisibility || {});
    visibility[property] = !this._isApiKeyVisible(property);
    this.apiKeyVisibility = visibility;
  }

  _onApiKeyInputChanged(property = "", e = null) {
    const value =
      e && e.currentTarget && typeof e.currentTarget.value === "string"
        ? e.currentTarget.value
        : "";
    this._setPanelPropertyValue("integrations", property, value);
  }

  _buildIntegrationsSavePayload(values = {}) {
    const fields = this._integrationFields();
    const source =
      values && typeof values === "object" && !Array.isArray(values)
        ? values
        : {};
    const payload = {};
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const storageKey =
        typeof field.storageKey === "string" && field.storageKey
          ? field.storageKey
          : field.property;
      const value = Object.prototype.hasOwnProperty.call(source, field.property)
        ? source[field.property]
        : "";
      payload[storageKey] = this._normalizeIntegrationValue(value);
    }
    return payload;
  }

  async _loadApiKeysData(force = false) {
    if (this.apiKeysLoading) {
      return;
    }
    if (this.__integrationsLoaded && !force) {
      return;
    }
    this.apiKeysLoading = true;
    this.apiKeysError = "";
    const response = await this._callAppEndpoint(["getApiKeys"]);
    if (response && response.data && typeof response.data === "object") {
      this._applyApiKeysRecord(this._normalizeApiKeysRecord(response.data));
      this.__integrationsLoaded = true;
    } else {
      this.apiKeysError = this.t.savedApiKeysLoadFailed;
    }
    this.apiKeysLoading = false;
  }

  async _saveApiKeysData(payload = {}) {
    this.apiKeysError = "";
    const response = await this._callAppEndpointWithData(["saveApiKeys"], {
      apiKeys: payload,
    });
    if (response && response.data && typeof response.data === "object") {
      this._applyApiKeysRecord(this._normalizeApiKeysRecord(response.data));
      this.__integrationsLoaded = true;
      return true;
    }
    this.apiKeysError = this.t.apiKeySettingsSaveFailed;
    return false;
  }

  _normalizeMediaNumberValue(value, fallback = null, min = null, max = null) {
    let normalizedFallback = null;
    if (
      fallback !== null &&
      typeof fallback !== "undefined" &&
      fallback !== ""
    ) {
      const parsedFallback = parseInt(fallback, 10);
      if (!Number.isNaN(parsedFallback)) {
        normalizedFallback = parsedFallback;
      }
    }
    if (value === null || typeof value === "undefined" || value === "") {
      return normalizedFallback;
    }
    let parsedValue = parseInt(value, 10);
    if (Number.isNaN(parsedValue)) {
      return normalizedFallback;
    }
    if (typeof min === "number" && parsedValue < min) {
      parsedValue = min;
    }
    if (typeof max === "number" && parsedValue > max) {
      parsedValue = max;
    }
    return parsedValue;
  }

  _sanitizeAcceptedFormatsValue(value = "") {
    let source = value;
    if (Array.isArray(source)) {
      source = source.join(",");
    }
    if (source === null || typeof source === "undefined") {
      return "";
    }
    if (typeof source !== "string") {
      source = `${source}`;
    }
    const parts = source.split(",");
    const seen = {};
    const normalized = [];
    for (let i = 0; i < parts.length; i++) {
      const format = `${parts[i] || ""}`
        .trim()
        .toLowerCase()
        .replace(/^\.+/, "");
      if (!format || !/^[a-z0-9]+$/.test(format) || seen[format]) {
        continue;
      }
      seen[format] = true;
      normalized.push(format);
    }
    return normalized.join(",");
  }

  _normalizeAcceptedFormatsValue(value, fallback = "") {
    const normalized = this._sanitizeAcceptedFormatsValue(value);
    if (normalized) {
      return normalized;
    }
    return this._sanitizeAcceptedFormatsValue(fallback);
  }

  _normalizeMediaSettingsRecord(source = {}) {
    const defaults =
      this.defaultPanelValues &&
      this.defaultPanelValues.media &&
      typeof this.defaultPanelValues.media === "object"
        ? this.defaultPanelValues.media
        : {};
    const data =
      source && typeof source === "object" && !Array.isArray(source)
        ? source
        : {};
    const payload =
      data.mediaSettings &&
      typeof data.mediaSettings === "object" &&
      !Array.isArray(data.mediaSettings)
        ? data.mediaSettings
        : data;
    return {
      jpegQuality: this._normalizeMediaNumberValue(
        payload.jpegQuality,
        defaults.jpegQuality,
        1,
        100,
      ),
      maxUploadSizeMb: this._normalizeMediaNumberValue(
        payload.maxUploadSizeMb,
        defaults.maxUploadSizeMb,
        1,
        10240,
      ),
      acceptedFormats: this._normalizeAcceptedFormatsValue(
        payload.acceptedFormats,
        defaults.acceptedFormats,
      ),
    };
  }

  _applyMediaSettingsRecord(record = {}) {
    const normalized = this._normalizeMediaSettingsRecord(record);
    const currentValues = this._cloneData(this.panelValues || {});
    currentValues.media = normalized;
    this.panelValues = currentValues;
    this._snapshotPanel("media");
  }

  _buildMediaSavePayload(values = {}) {
    const normalized = this._normalizeMediaSettingsRecord(values);
    return {
      jpegQuality: normalized.jpegQuality,
      maxUploadSizeMb: normalized.maxUploadSizeMb,
      acceptedFormats: normalized.acceptedFormats,
    };
  }

  async _loadMediaSettingsData(force = false) {
    if (this.__mediaLoaded && !force) {
      return;
    }
    const response = await this._callAppEndpoint(["getMediaSettings"]);
    if (response && response.data && typeof response.data === "object") {
      this._applyMediaSettingsRecord(response.data);
      this.__mediaLoaded = true;
      return;
    }
    this._applyMediaSettingsRecord(this.defaultPanelValues.media || {});
    this.statusMessage = this.t.savedMediaSettingsLoadFailed;
  }

  async _saveMediaSettingsData(payload = {}) {
    const mediaSettings = this._buildMediaSavePayload(payload);
    const response = await this._callAppEndpointWithData(
      ["saveMediaSettings"],
      {
        mediaSettings: mediaSettings,
      },
    );
    if (response && response.data && typeof response.data === "object") {
      this._applyMediaSettingsRecord(response.data);
      this.__mediaLoaded = true;
      return true;
    }
    if (response && response.status === 200) {
      this._applyMediaSettingsRecord(mediaSettings);
      this.__mediaLoaded = true;
      return true;
    }
    return false;
  }

  /**
   * Tidy a language code from storage or the form. Known codes and aliases
   * become the canonical registry code (zh_CN -> zh-CN). Any other
   * well-formed tag (fr-CA) is kept as is, because the backends accept any
   * BCP-47 shaped tag. Anything else falls back.
   */
  _normalizeLanguageTagValue(value, fallback = "") {
    const clean = (candidate) => {
      const text = typeof candidate === "string" ? candidate.trim() : "";
      if (!text) {
        return "";
      }
      let known = null;
      try {
        known = matchLanguageCode(text);
      } catch {
        // registry not loaded yet; the shape check below still applies
      }
      if (known) {
        return known;
      }
      return /^[a-z]{2,3}(-[a-z0-9]{2,8}){0,2}$/i.test(text) ? text : "";
    };
    return clean(value) || clean(fallback) || "en-US";
  }

  _normalizeLocalizationSettingsRecord(source = {}) {
    const defaults =
      this.defaultPanelValues &&
      this.defaultPanelValues.configuration &&
      typeof this.defaultPanelValues.configuration === "object"
        ? this.defaultPanelValues.configuration
        : {};
    const data =
      source && typeof source === "object" && !Array.isArray(source)
        ? source
        : {};
    const payload =
      data.localizationSettings &&
      typeof data.localizationSettings === "object" &&
      !Array.isArray(data.localizationSettings)
        ? data.localizationSettings
        : data;
    return {
      defaultLanguage: this._normalizeLanguageTagValue(
        payload.defaultLanguage,
        defaults.defaultLanguage,
      ),
    };
  }

  _applyLocalizationSettingsRecord(record = {}) {
    const normalized = this._normalizeLocalizationSettingsRecord(record);
    const currentValues = this._cloneData(this.panelValues || {});
    currentValues.configuration = normalized;
    this.panelValues = currentValues;
    this._snapshotPanel("configuration");
  }

  _buildLocalizationSavePayload(values = {}) {
    const normalized = this._normalizeLocalizationSettingsRecord(values);
    return {
      defaultLanguage: normalized.defaultLanguage,
    };
  }

  async _loadLocalizationSettingsData(force = false) {
    if (this.__localizationLoaded && !force) {
      return;
    }
    // so a stored code like zh_CN is shown as its canonical form
    await loadLanguageRegistry().catch(() => {});
    const response = await this._callAppEndpoint(["getLocalizationSettings"]);
    if (response && response.data && typeof response.data === "object") {
      this._applyLocalizationSettingsRecord(response.data);
      this.__localizationLoaded = true;
      return;
    }
    this._applyLocalizationSettingsRecord(
      this.defaultPanelValues.configuration || {},
    );
    this.statusMessage = this.t.savedLocalizationSettingsLoadFailed;
  }

  async _saveLocalizationSettingsData(payload = {}) {
    const localizationSettings = this._buildLocalizationSavePayload(payload);
    const response = await this._callAppEndpointWithData(
      ["saveLocalizationSettings"],
      {
        localizationSettings: localizationSettings,
      },
    );
    if (response && response.data && typeof response.data === "object") {
      this._applyLocalizationSettingsRecord(response.data);
      this.__localizationLoaded = true;
      return true;
    }
    if (response && response.status === 200) {
      this._applyLocalizationSettingsRecord(localizationSettings);
      this.__localizationLoaded = true;
      return true;
    }
    return false;
  }

  async _saveEnabledSkeletonsData(enabledSkeletons = []) {
    const response = await this._callAppEndpointWithData(
      ["saveEnabledSkeletons"],
      {
        enabledSkeletons: Array.isArray(enabledSkeletons)
          ? enabledSkeletons
          : [],
      },
    );
    if (response && response.status === 200) {
      await this._loadSkeletonOptions(true);
      return true;
    }
    return false;
  }
  async _saveEnabledThemesData(enabledThemes = []) {
    const response = await this._callAppEndpointWithData(
      ["saveEnabledThemes"],
      {
        enabledThemes: Array.isArray(enabledThemes) ? enabledThemes : [],
      },
    );
    if (response && response.status === 200) {
      await this._loadThemeOptions(true);
      return true;
    }
    return false;
  }

  _normalizeMachineName(value = "") {
    if (typeof value !== "string") {
      return "";
    }
    let normalized = value.trim().toLowerCase();
    if (normalized === "") {
      return "";
    }
    if (normalized.indexOf("/") !== -1) {
      const parts = normalized.split("/");
      normalized = parts[parts.length - 1];
    }
    if (normalized.indexOf("?") !== -1) {
      normalized = normalized.split("?")[0];
    }
    if (normalized.indexOf("#") !== -1) {
      normalized = normalized.split("#")[0];
    }
    normalized = normalized.replace(/\.[^/.]+$/g, "");
    normalized = normalized.replace(/[\s_]+/g, "-");
    normalized = normalized.replace(/[^a-z0-9-]/g, "-");
    normalized = normalized.replace(/-+/g, "-");
    normalized = trimChars(normalized, "-");
    return normalized;
  }

  _checkboxProperty(prefix, machineName) {
    const normalized = this._normalizeMachineName(machineName);
    const safe = normalized.replace(/-/g, "_");
    return `${prefix}_${safe}`;
  }

  _normalizeListResponseArray(response) {
    if (!response) {
      return [];
    }
    if (Array.isArray(response)) {
      return response;
    }
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  }

  _normalizeSkeletonOptions(items = []) {
    const options = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i] || {};
      const candidates = [
        item.machineName,
        item.name,
        item["machine-name"],
        item["skeleton-url"],
        item.title,
      ];
      let machineName = "";
      for (let j = 0; j < candidates.length; j++) {
        machineName = this._normalizeMachineName(`${candidates[j] || ""}`);
        if (machineName) {
          break;
        }
      }
      if (!machineName) {
        continue;
      }
      const option = {
        machineName: machineName,
        property: this._checkboxProperty("skeleton", machineName),
        label: item.title || machineName,
        description: item.description || "",
        scope:
          typeof item.scope === "string" && item.scope
            ? item.scope.toLowerCase()
            : "core",
        categories: this._optionCategories(item.category),
        enabled: typeof item.enabled === "boolean" ? item.enabled : true,
      };
      options.push(option);
    }
    return options;
  }

  _normalizeThemeOptions(themeData) {
    const options = [];
    if (!themeData) {
      return options;
    }
    if (Array.isArray(themeData)) {
      for (let i = 0; i < themeData.length; i++) {
        const theme = themeData[i] || {};
        const machineName = this._normalizeMachineName(
          `${theme.machineName || theme.name || theme.element || ""}`,
        );
        if (!machineName) {
          continue;
        }
        const screenshot = this._resolveThemePreviewPath(
          `${theme.screenshot || theme.thumbnail || theme.preview || ""}`,
        );
        options.push({
          machineName: machineName,
          property: this._checkboxProperty("theme", machineName),
          label: theme.name || theme.title || machineName,
          description: theme.description || "",
          categories: this._optionCategories(theme.category),
          screenshot: screenshot,
          enabled:
            typeof theme.enabled === "boolean"
              ? theme.enabled
              : theme.hidden === true
                ? false
                : true,
        });
      }
      return options;
    }
    if (typeof themeData === "object") {
      const keys = Object.keys(themeData);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const theme = themeData[key] || {};
        const machineName = this._normalizeMachineName(key);
        if (!machineName) {
          continue;
        }
        const screenshot = this._resolveThemePreviewPath(
          `${theme.screenshot || theme.thumbnail || theme.preview || ""}`,
        );
        options.push({
          machineName: machineName,
          property: this._checkboxProperty("theme", machineName),
          label: theme.name || theme.title || machineName,
          description: theme.description || "",
          categories: this._optionCategories(theme.category),
          screenshot: screenshot,
          enabled:
            typeof theme.enabled === "boolean"
              ? theme.enabled
              : theme.hidden === true
                ? false
                : true,
        });
      }
    }
    return options;
  }

  _optionCategories(value) {
    const list = Array.isArray(value) ? value : value ? [value] : [];
    return list
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter((item) => item !== "");
  }

  _syncCheckboxPanelDefaults(panelKey, options) {
    const currentValues = this._cloneData(this.panelValues || {});
    const panelValues = this._cloneData(currentValues[panelKey] || {});
    const allowed = {};
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      allowed[option.property] = true;
      if (typeof panelValues[option.property] === "undefined") {
        panelValues[option.property] =
          typeof option.enabled === "boolean" ? option.enabled : true;
      }
    }
    const keys = Object.keys(panelValues);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key.indexOf(`${panelKey.slice(0, -1)}_`) === 0 && !allowed[key]) {
        delete panelValues[key];
      }
    }
    currentValues[panelKey] = panelValues;
    this.panelValues = currentValues;
    this._snapshotPanel(panelKey);
  }

  _selectedOptionMachineNames(values = {}, options = []) {
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (values && values[option.property]) {
        selected.push(option.machineName);
      }
    }
    return selected;
  }

  async _loadSkeletonOptions(force = false) {
    if (this.loadingSkeletons) {
      return;
    }
    if (this.__skeletonsLoaded && !force) {
      return;
    }
    this.loadingSkeletons = true;
    this.statusError = "";
    await this._ensureSystemRegistryReady();
    let options = [];
    const response = await this._callAppEndpointWithData(["skeletonsList"], {
      includeDisabled: true,
    });
    const items = this._normalizeListResponseArray(response);
    if (items.length > 0) {
      options = this._normalizeSkeletonOptions(items);
    }
    if (options.length === 0) {
      const fallbackItems = [
        { title: "Course", name: "course" },
        { title: "Blog", name: "blog" },
        { title: "Portfolio", name: "portfolio" },
        { title: "Documentation", name: "documentation" },
      ];
      options = this._normalizeSkeletonOptions(fallbackItems);
    }
    this.skeletonOptions = options;
    this._syncCheckboxPanelDefaults("skeletons", options);
    this.loadingSkeletons = false;
    this.__skeletonsLoaded = true;
  }

  async _loadThemeOptions(force = false) {
    if (this.loadingThemes) {
      return;
    }
    if (this.__themesLoaded && !force) {
      return;
    }
    this.loadingThemes = true;
    this.statusError = "";
    await this._ensureSystemRegistryReady();
    let options = [];
    const endpointResponse = await this._callAppEndpointWithData(
      ["themesList"],
      {
        includeDisabled: true,
      },
    );
    if (endpointResponse && endpointResponse.data) {
      options = this._normalizeThemeOptions(endpointResponse.data);
    }
    if (options.length === 0) {
      options = this._normalizeThemeOptions({
        "clean-one": { name: "Clean One" },
        "clean-two": { name: "Clean Two" },
        "learn-two-theme": { name: "Learn Two Theme" },
      });
    }
    this.themeOptions = options;
    this._syncCheckboxPanelDefaults("themes", options);
    this.loadingThemes = false;
    this.__themesLoaded = true;
  }

  _parseVersion(version = "") {
    const normalized = `${version || ""}`.trim();
    if (!normalized) {
      return [];
    }
    const matches = normalized.match(/\d+/g);
    if (!matches) {
      return [];
    }
    return matches.map((segment) => parseInt(segment, 10));
  }

  _compareVersion(current = "", latest = "") {
    const currentParts = this._parseVersion(current);
    const latestParts = this._parseVersion(latest);
    const maxLength = Math.max(currentParts.length, latestParts.length);
    for (let i = 0; i < maxLength; i++) {
      const left = typeof currentParts[i] === "number" ? currentParts[i] : 0;
      const right = typeof latestParts[i] === "number" ? latestParts[i] : 0;
      if (left < right) {
        return -1;
      }
      if (left > right) {
        return 1;
      }
    }
    return 0;
  }

  _buildDefaultStatusPayload() {
    const summary = {
      programmingLanguage: "node22.04",
      serverVersion: "nginx/1.26.1",
      haxcmsVersionCurrent: "26.0.0",
      haxcmsVersionLatest: "26.1.0",
    };
    const rows = [
      {
        key: "runtime",
        tone: "info",
        title: this.t.programmingLanguageRuntime,
        value: summary.programmingLanguage,
      },
      {
        key: "server",
        tone: "ok",
        title: this.t.serverVersion,
        value: summary.serverVersion,
      },
      {
        key: "storage",
        tone: "ok",
        title: this.t.fileSystemAccess,
        value: this.t.writable,
      },
      {
        key: "jobs",
        tone: "info",
        title: this.t.backgroundJobs,
        value: this.t.enabledStatus,
      },
      {
        key: "tls",
        tone: "ok",
        title: this.t.tlsCertificate,
        value: this.t.valid,
      },
    ];
    return this._ensureVersionStatusRow(
      rows,
      summary,
      this.t.haxcmsVersion,
      this.t.haxcmsVersionDescription,
    );
  }

  _normalizeStatusSummary(raw = {}, fallback = {}) {
    const summary = this._cloneData(fallback || {});
    const source = raw && typeof raw === "object" ? raw : {};
    const keys = [
      "programmingLanguage",
      "serverVersion",
      "haxcmsVersionCurrent",
      "haxcmsVersionLatest",
    ];
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (typeof source[key] !== "undefined" && source[key] !== null) {
        summary[key] = `${source[key]}`;
      }
    }
    if (!summary.programmingLanguage && source.runtime) {
      summary.programmingLanguage = `${source.runtime}`;
    }
    if (!summary.serverVersion && source.webServer) {
      summary.serverVersion = `${source.webServer}`;
    }
    if (!summary.haxcmsVersionCurrent && source.haxcmsVersion) {
      summary.haxcmsVersionCurrent = `${source.haxcmsVersion}`;
    }
    if (!summary.haxcmsVersionLatest && source.latestVersion) {
      summary.haxcmsVersionLatest = `${source.latestVersion}`;
    }
    return summary;
  }

  _normalizeStatusTone(value = "") {
    const normalized = `${value || ""}`.trim().toLowerCase();
    if (!normalized) {
      return "info";
    }
    if (["ok", "healthy", "success", "good", "pass"].includes(normalized)) {
      return "ok";
    }
    if (["warning", "warn", "stale", "partial"].includes(normalized)) {
      return "warning";
    }
    if (["error", "critical", "failed", "fail"].includes(normalized)) {
      return "error";
    }
    if (["info", "notice", "unknown"].includes(normalized)) {
      return "info";
    }
    return "info";
  }

  _normalizeStatusRows(rows = []) {
    const normalizedRows = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i] || {};
      const tone = this._normalizeStatusTone(row.tone || row.status);
      const title = row.title || row.label || row.key || this.t.status;
      const value =
        typeof row.value === "undefined" || row.value === null ? "" : row.value;
      const description = row.description || row.details || "";
      const normalized = {
        key: row.key || this._normalizeMachineName(`${title}`),
        tone: tone,
        title: `${title}`,
        value: `${value}`,
        description: `${description || ""}`,
      };
      if (typeof row.valueLink === "string" && row.valueLink.trim() !== "") {
        normalized.valueLink = row.valueLink.trim();
      }
      if (Array.isArray(row.links) && row.links.length > 0) {
        const normalizedLinks = this._normalizeStatusLinks(row.links);
        if (normalizedLinks.length > 0) {
          normalized.links = normalizedLinks;
        }
      }
      normalizedRows.push(normalized);
    }
    return normalizedRows;
  }

  _normalizeStatusLinks(links = []) {
    const normalized = [];
    if (!Array.isArray(links)) {
      return normalized;
    }
    for (let i = 0; i < links.length; i++) {
      const link = links[i] || {};
      const url = typeof link.url === "string" ? link.url.trim() : "";
      if (!url) {
        continue;
      }
      const label =
        typeof link.label === "string" && link.label.trim() !== ""
          ? link.label.trim()
          : url;
      normalized.push({ url: url, label: label });
    }
    return normalized;
  }

  _ensureVersionStatusRow(
    rows,
    summary,
    title = this.t.haxcmsVersion,
    description = "",
  ) {
    const compare = this._compareVersion(
      summary.haxcmsVersionCurrent,
      summary.haxcmsVersionLatest,
    );
    const versionTone = compare < 0 ? "warning" : "ok";
    const versionValue = summary.haxcmsVersionCurrent
      ? (compare < 0
          ? this.t.versionUpdateAvailable
          : this.t.versionUpToDate
        ).replace("{version}", () => summary.haxcmsVersionCurrent)
      : this.t.unknown;
    const versionDescription =
      compare < 0
        ? this.t.currentLatestVersion
            .replace(
              "{current}",
              () => summary.haxcmsVersionCurrent || this.t.unknownLower,
            )
            .replace(
              "{latest}",
              () => summary.haxcmsVersionLatest || this.t.unknownLower,
            )
        : description;
    const nextRows = Array.isArray(rows) ? this._cloneData(rows) : [];
    let found = false;
    for (let i = 0; i < nextRows.length; i++) {
      if (nextRows[i].key === "haxcms-version") {
        nextRows[i].tone = versionTone;
        nextRows[i].title = title;
        nextRows[i].value = versionValue;
        nextRows[i].description = versionDescription;
        found = true;
      }
    }
    if (!found) {
      nextRows.push({
        key: "haxcms-version",
        tone: versionTone,
        title: title,
        value: versionValue,
        description: versionDescription,
      });
    }
    return {
      summary: summary,
      rows: nextRows,
    };
  }

  async _loadStatusData(force = false) {
    if (this.statusLoading) {
      return;
    }
    if (this.__statusLoaded && !force) {
      return;
    }
    this.statusLoading = true;
    this.statusError = "";
    const fallbackPayload = this._buildDefaultStatusPayload();
    let statusPayload = {
      summary: this._cloneData(fallbackPayload.summary),
      rows: this._cloneData(fallbackPayload.rows),
    };
    const response = await this._callAppEndpoint(["systemStatus", "status"]);
    if (response && response.data && typeof response.data === "object") {
      const source = response.data;
      const summary = this._normalizeStatusSummary(
        source.summary ? source.summary : source,
        fallbackPayload.summary,
      );
      const rowsSource =
        source.rows && Array.isArray(source.rows) ? source.rows : [];
      if (rowsSource.length > 0) {
        statusPayload = this._ensureVersionStatusRow(
          this._normalizeStatusRows(rowsSource),
          summary,
        );
      } else {
        const generated = [
          {
            key: "runtime",
            tone: "info",
            title: this.t.programmingLanguageRuntime,
            value: summary.programmingLanguage || "",
          },
          {
            key: "server",
            tone: "ok",
            title: this.t.serverVersion,
            value: summary.serverVersion || "",
          },
        ];
        statusPayload = this._ensureVersionStatusRow(generated, summary);
      }
    }
    this.statusRows = statusPayload.rows;
    this.statusSummary = statusPayload.summary;
    this.statusLoading = false;
    this.__statusLoaded = true;
  }

  _statusToneLabel(tone = "info") {
    if (tone === "ok") {
      return this.t.ok;
    }
    if (tone === "warning") {
      return this.t.warning;
    }
    if (tone === "error") {
      return this.t.error;
    }
    return this.t.info;
  }

  _statusSummaryValue(key) {
    if (!this.statusSummary || typeof this.statusSummary !== "object") {
      return this.t.unknown;
    }
    const value = this.statusSummary[key];
    if (
      typeof value === "undefined" ||
      value === null ||
      `${value}`.trim() === ""
    ) {
      return this.t.unknown;
    }
    return `${value}`;
  }

  _checkboxFields(options = []) {
    const fields = [];
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      fields.push({
        property: option.property,
        title: option.label,
        description: option.description || "",
        inputMethod: "boolean",
      });
    }
    return fields;
  }

  _isSkeletonOptionChecked(option = null) {
    if (!option || !option.property) {
      return false;
    }
    const values = this._getPanelValue("skeletons");
    if (
      values &&
      Object.prototype.hasOwnProperty.call(values, option.property)
    ) {
      return values[option.property] !== false;
    }
    return typeof option.enabled === "boolean" ? option.enabled : true;
  }

  _onSkeletonOptionChanged(option = null, e = null) {
    if (!option || !option.property || !e || !e.currentTarget) {
      return;
    }
    this._setPanelPropertyValue(
      "skeletons",
      option.property,
      !!e.currentTarget.checked,
    );
  }

  _isUserSkeletonOption(option = null) {
    if (!option || typeof option.scope !== "string") {
      return false;
    }
    return option.scope.toLowerCase() === "user";
  }

  _canMutateSkeletonOption(option = null) {
    return (
      this._isUserSkeletonOption(option) &&
      (this._hasSkeletonRenameEndpoint() || this._hasSkeletonDeleteEndpoint())
    );
  }

  _isSkeletonActionDisabled(option = null) {
    if (this.skeletonActionBusy) {
      return true;
    }
    return !this._canMutateSkeletonOption(option);
  }

  async _renameSkeletonOption(option = null, e = null) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (
      !option ||
      !option.machineName ||
      this._isSkeletonActionDisabled(option)
    ) {
      return;
    }
    if (!globalThis || typeof globalThis.prompt !== "function") {
      this.statusMessage = this.t.renamePromptUnavailable;
      return;
    }
    const currentName = this._normalizeMachineName(option.machineName);
    const currentDisplayName =
      typeof option.label === "string" && option.label.trim() !== ""
        ? option.label.trim()
        : currentName;
    const requestedName = globalThis.prompt(
      this.t.renameSkeleton,
      currentDisplayName,
    );
    if (typeof requestedName !== "string") {
      return;
    }
    const displayName = requestedName.trim();
    if (!displayName) {
      this.statusMessage = this.t.skeletonNameRequired;
      return;
    }
    const nextName = this._normalizeMachineName(displayName);
    if (!nextName) {
      this.statusMessage = this.t.skeletonNameNeedsAlphanumeric;
      return;
    }
    if (nextName === currentName && displayName === currentDisplayName) {
      return;
    }
    if (!this._hasSkeletonRenameEndpoint()) {
      this.statusMessage = this.t.renameEndpointUnavailable;
      return;
    }
    this.skeletonActionBusy = true;
    try {
      const response = await this._callAppEndpointWithData(["renameSkeleton"], {
        skeletonName: currentName,
        newName: nextName,
        displayName: displayName,
      });
      if (response && response.status === 200) {
        const renamedMachineName =
          response &&
          response.data &&
          typeof response.data.machineName === "string" &&
          response.data.machineName.trim() !== ""
            ? response.data.machineName.trim()
            : nextName;
        this.statusMessage = this.t.renamedSkeleton.replace(
          "{machineName}",
          () => renamedMachineName,
        );
        await this._loadSkeletonOptions(true);
      } else {
        this.statusMessage = this._schemaOperationResponseMessage(
          response,
          this.t.unableToRenameSkeleton,
        );
      }
    } finally {
      this.skeletonActionBusy = false;
    }
  }

  async _deleteSkeletonOption(option = null, e = null) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (
      !option ||
      !option.machineName ||
      this._isSkeletonActionDisabled(option)
    ) {
      return;
    }
    if (!globalThis || typeof globalThis.confirm !== "function") {
      this.statusMessage = this.t.deleteConfirmationUnavailable;
      return;
    }
    const machineName = this._normalizeMachineName(option.machineName);
    const shouldDelete = globalThis.confirm(
      this.t.deleteSkeletonConfirm.replace("{machineName}", () => machineName),
    );
    if (!shouldDelete) {
      return;
    }
    if (!this._hasSkeletonDeleteEndpoint()) {
      this.statusMessage = this.t.deleteEndpointUnavailable;
      return;
    }
    this.skeletonActionBusy = true;
    try {
      const response = await this._callAppEndpointWithData(["deleteSkeleton"], {
        skeletonName: machineName,
      });
      if (response && response.status === 200) {
        this.statusMessage = this.t.deletedSkeleton.replace(
          "{machineName}",
          () => machineName,
        );
        await this._loadSkeletonOptions(true);
      } else {
        this.statusMessage = this._schemaOperationResponseMessage(
          response,
          this.t.unableToDeleteSkeleton,
        );
      }
    } finally {
      this.skeletonActionBusy = false;
    }
  }

  _isThemeOptionChecked(option = null) {
    if (!option || !option.property) {
      return false;
    }
    const values = this._getPanelValue("themes");
    if (
      values &&
      Object.prototype.hasOwnProperty.call(values, option.property)
    ) {
      return values[option.property] !== false;
    }
    return typeof option.enabled === "boolean" ? option.enabled : true;
  }
  _onThemeOptionChanged(option = null, e = null) {
    if (!option || !option.property || !e || !e.currentTarget) {
      return;
    }
    this._setPanelPropertyValue(
      "themes",
      option.property,
      !!e.currentTarget.checked,
    );
  }
  _renderStatusDescription(text = "") {
    const value = `${text || ""}`;
    if (!value) {
      return "";
    }
    const lines = value.split("\n");
    return html`
      ${lines.map((line, index) =>
        index === 0 ? html`${line}` : html`<br />${line}`,
      )}
    `;
  }

  _renderStatusValue(row) {
    if (!row) {
      return "—";
    }
    const value =
      typeof row.value === "string" && row.value !== "" ? row.value : "—";
    if (
      value !== "—" &&
      typeof row.valueLink === "string" &&
      row.valueLink !== ""
    ) {
      return html`<a
        class="link"
        href="${row.valueLink}"
        target="_blank"
        rel="noopener noreferrer"
        >${value}</a
      >`;
    }
    return html`${value}`;
  }

  _renderStatusLinks(links) {
    if (!Array.isArray(links) || links.length === 0) {
      return "";
    }
    return html`<span class="links">
      ${links.map(
        (link) =>
          html`<a
            class="link"
            href="${link.url}"
            target="_blank"
            rel="noopener noreferrer"
            >${link.label}</a
          >`,
      )}
    </span>`;
  }

  /* ------------------------------------------------------------------
   * Staged changes: each panel remembers the values it loaded (or last
   * saved), so the action bar can say what changed, Discard can restore
   * them and Save only lights up when there is something to save.
   * ---------------------------------------------------------------- */

  _snapshotPanel(panelKey = "") {
    if (!panelKey) {
      return;
    }
    const snapshots = Object.assign({}, this.__loadedPanelValues || {});
    snapshots[panelKey] = this._cloneData(this._getPanelValue(panelKey));
    this.__loadedPanelValues = snapshots;
    this.requestUpdate();
  }

  _sameValues(valueA, valueB) {
    const a = valueA && typeof valueA === "object" ? valueA : {};
    const b = valueB && typeof valueB === "object" ? valueB : {};
    const keys = Object.keys(Object.assign({}, a, b));
    for (let i = 0; i < keys.length; i++) {
      if (!this._isValueEqual(a[keys[i]], b[keys[i]])) {
        return false;
      }
    }
    return true;
  }

  _isPanelDirty(panelKey = "") {
    if (!panelKey || !this.__loadedPanelValues) {
      return false;
    }
    if (
      !Object.prototype.hasOwnProperty.call(this.__loadedPanelValues, panelKey)
    ) {
      return false;
    }
    return !this._sameValues(
      this._getPanelValue(panelKey),
      this.__loadedPanelValues[panelKey],
    );
  }

  /**
   * Short wording for each staged change, for the action bar. API key
   * values are never shown, only which provider changed.
   */
  _panelChanges(panelKey = "") {
    if (!this._isPanelDirty(panelKey)) {
      return [];
    }
    const current = this._getPanelValue(panelKey);
    const loaded = this.__loadedPanelValues[panelKey] || {};
    const changes = [];
    if (panelKey === "skeletons" || panelKey === "themes") {
      const options =
        panelKey === "skeletons" ? this.skeletonOptions : this.themeOptions;
      for (let i = 0; i < options.length; i++) {
        const option = options[i];
        if (current[option.property] !== loaded[option.property]) {
          changes.push(
            (current[option.property]
              ? this.t.turnedOn
              : this.t.turnedOff
            ).replace("{name}", () => option.label),
          );
        }
      }
      return changes;
    }
    const panel = this._getPanelByKey(panelKey);
    const fields = [];
    if (panel && Array.isArray(panel.sections)) {
      panel.sections.forEach((section) => {
        (section.fields || []).forEach((field) => fields.push(field));
      });
    }
    const keys = Object.keys(Object.assign({}, current, loaded));
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (this._isValueEqual(current[key], loaded[key])) {
        continue;
      }
      const field = fields.find((item) => item.property === key);
      const named = this._fieldName(key);
      changes.push(
        named !== key
          ? named
          : field
            ? field.providerLabel || field.title || key
            : key,
      );
    }
    return changes;
  }

  _fieldName(key = "") {
    const names = {
      jpegQuality: this.t.jpegQualityLabel,
      maxUploadSizeMb: this.t.maxUploadLabel,
      acceptedFormats: this.t.acceptedFileFormats,
      globalCss: this.t.globalCss,
      globalJs: this.t.globalJavaScript,
    };
    return names[key] || key;
  }

  _discardPanel(panelKey = this.activePanel) {
    if (!this.__loadedPanelValues || !this.__loadedPanelValues[panelKey]) {
      return;
    }
    const currentValues = this._cloneData(this.panelValues || {});
    currentValues[panelKey] = this._cloneData(
      this.__loadedPanelValues[panelKey],
    );
    this.panelValues = currentValues;
    this._saveTone = "";
    this.statusMessage = "";
  }

  /* ------------------------------------------------------------------
   * Navigation
   * ---------------------------------------------------------------- */

  _navigatePanel(panelKey = "", e = null) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const panel = this._getPanelByKey(panelKey);
    if (!panel || panel.disabled || panelKey === this.activePanel) {
      return;
    }
    if (this._isPanelDirty(this.activePanel)) {
      this._pendingPanel = panelKey;
      return;
    }
    this._openPanel(panelKey);
  }

  _resetPanelView() {
    this._filterText = "";
    this._filterView = "all";
    this._saveTone = "";
    this._pendingPanel = "";
  }

  _closeLeavePrompt() {
    this._pendingPanel = "";
  }

  _leaveDiscard() {
    const next = this._pendingPanel;
    this._discardPanel(this.activePanel);
    this._pendingPanel = "";
    if (next) {
      this._openPanel(next);
    }
  }

  async _leaveSave() {
    const next = this._pendingPanel;
    this._pendingPanel = "";
    await this._saveActivePanel();
    if (next && this._saveTone === "saved") {
      this._openPanel(next);
    }
  }

  _onLeaveKeydown(e) {
    if (e && e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      this._closeLeavePrompt();
    }
  }

  _toggleRail(e) {
    if (e) {
      e.preventDefault();
    }
    this._railCollapsed = !this._railCollapsed;
    try {
      globalThis.localStorage.setItem(
        RAIL_COLLAPSED_KEY,
        this._railCollapsed ? "1" : "0",
      );
    } catch {
      // storage can be blocked; the rail still toggles for this visit
    }
  }

  _scrollToAnchor(anchor = "", e = null) {
    if (e) {
      e.preventDefault();
    }
    const target = this.renderRoot
      ? this.renderRoot.querySelector(`#${anchor}`)
      : null;
    if (target && typeof target.scrollIntoView === "function") {
      target.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }

  /* ------------------------------------------------------------------
   * Status: rows grouped by area, problems and warnings pulled to the top
   * ---------------------------------------------------------------- */

  _statusGroupId(key = "") {
    const keys = STATUS_GROUP_KEYS;
    const ids = Object.keys(keys);
    for (let i = 0; i < ids.length; i++) {
      if (keys[ids[i]].includes(key)) {
        return ids[i];
      }
    }
    return "other";
  }

  _statusGroupLabel(id = "") {
    const labels = {
      attention: this.t.needsAttention,
      environment: this.t.environment,
      directories: this.t.directories,
      security: this.t.securityGroup,
      updates: this.t.updates,
      support: this.t.support,
      other: this.t.other,
    };
    return labels[id] || id;
  }

  _visibleStatusRows() {
    const rows = Array.isArray(this.statusRows) ? this.statusRows : [];
    const hasConfigDirectory = rows.some(
      (row) => row.key === "config-directory",
    );
    // the report names the config directory twice; keep the checked row
    return rows.filter(
      (row) => !(hasConfigDirectory && row.key === "config-directory-path"),
    );
  }

  _statusSections() {
    const rows = this._visibleStatusRows();
    const attention = rows
      .filter((row) => row.tone === "error" || row.tone === "warning")
      .sort((a, b) => (a.tone === b.tone ? 0 : a.tone === "error" ? -1 : 1));
    const sections = [];
    if (attention.length > 0) {
      sections.push({ id: "attention", rows: attention });
    }
    const order = Object.keys(STATUS_GROUP_KEYS).concat(["other"]);
    order.forEach((id) => {
      const groupRows = rows.filter(
        (row) =>
          row.tone !== "error" &&
          row.tone !== "warning" &&
          this._statusGroupId(row.key) === id,
      );
      if (groupRows.length > 0) {
        sections.push({ id: id, rows: groupRows });
      }
    });
    return sections;
  }

  _statusCounts() {
    const counts = { error: 0, warning: 0, ok: 0, info: 0 };
    this._visibleStatusRows().forEach((row) => {
      if (Object.prototype.hasOwnProperty.call(counts, row.tone)) {
        counts[row.tone]++;
      }
    });
    return counts;
  }

  _statusToneIcon(tone = "info") {
    if (tone === "ok") {
      return HaxUiAdminIcons.check;
    }
    if (tone === "warning" || tone === "error") {
      return HaxUiAdminIcons.warning;
    }
    return HaxUiAdminIcons.info;
  }

  /** "50mb", "64M", "2G" or a plain number of megabytes, as megabytes */
  _parseSizeMb(value = "") {
    const match = `${value || ""}`
      .trim()
      .match(/^(\d+(?:\.\d+)?)\s*([kmgt]?)(?:i?b)?$/i);
    if (!match) {
      return null;
    }
    const size = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    const scale = { "": 1, k: 1 / 1024, m: 1, g: 1024, t: 1024 * 1024 };
    return size * scale[unit];
  }

  _serverUploadLimit() {
    if (!this.__statusLoaded) {
      return null;
    }
    const row = this._visibleStatusRows().find(
      (item) => item.key === "file-upload-limit",
    );
    if (!row) {
      return null;
    }
    const mb = this._parseSizeMb(row.value);
    return mb === null ? null : { mb: mb, label: row.value };
  }

  /* ------------------------------------------------------------------
   * Skeleton and theme lists: filter text plus a view switch
   * ---------------------------------------------------------------- */

  _optionViews(panelKey = "", options = []) {
    const isOn = (option) =>
      panelKey === "skeletons"
        ? this._isSkeletonOptionChecked(option)
        : this._isThemeOptionChecked(option);
    const views = [{ id: "all", label: this.t.all, count: options.length }];
    const categories = [];
    options.forEach((option) => {
      (option.categories || []).forEach((category) => {
        if (!categories.includes(category)) {
          categories.push(category);
        }
      });
    });
    categories.sort().forEach((category) => {
      views.push({
        id: `category:${category}`,
        label: category,
        count: options.filter((option) =>
          (option.categories || []).includes(category),
        ).length,
      });
    });
    views.push({
      id: "off",
      label: this.t.off,
      count: options.filter((option) => !isOn(option)).length,
    });
    if (panelKey === "skeletons") {
      views.push({
        id: "uploaded",
        label: this.t.uploaded,
        count: options.filter((option) => this._isUserSkeletonOption(option))
          .length,
      });
    }
    return views;
  }

  _filteredOptions(panelKey = "", options = []) {
    const text = `${this._filterText || ""}`.trim().toLowerCase();
    const view = this._filterView || "all";
    return options.filter((option) => {
      if (text) {
        const haystack =
          `${option.label} ${option.machineName} ${option.description || ""}`.toLowerCase();
        if (haystack.indexOf(text) === -1) {
          return false;
        }
      }
      if (view === "off") {
        return panelKey === "skeletons"
          ? !this._isSkeletonOptionChecked(option)
          : !this._isThemeOptionChecked(option);
      }
      if (view === "uploaded") {
        return this._isUserSkeletonOption(option);
      }
      if (view.indexOf("category:") === 0) {
        return (option.categories || []).includes(
          view.replace("category:", ""),
        );
      }
      return true;
    });
  }

  _onFilterInput(e) {
    this._filterText = e && e.target ? e.target.value : "";
  }

  _setFilterView(view = "all") {
    this._filterView = view;
  }

  _isOptionChanged(panelKey = "", option = null) {
    if (!option || !this.__loadedPanelValues) {
      return false;
    }
    const loaded = this.__loadedPanelValues[panelKey] || {};
    const current = this._getPanelValue(panelKey);
    return (
      Object.prototype.hasOwnProperty.call(loaded, option.property) &&
      loaded[option.property] !== current[option.property]
    );
  }

  /* ------------------------------------------------------------------
   * Media: accepted formats edited as chips, stored as the same
   * comma-separated string the backends expect
   * ---------------------------------------------------------------- */

  _acceptedFormatsList() {
    const values = this._getPanelValue("media");
    const raw =
      values && typeof values.acceptedFormats === "string"
        ? values.acceptedFormats
        : "";
    return raw
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
  }

  _setAcceptedFormats(list = []) {
    this._setPanelPropertyValue("media", "acceptedFormats", list.join(","));
  }

  _removeAcceptedFormat(format = "") {
    this._setAcceptedFormats(
      this._acceptedFormatsList().filter((item) => item !== format),
    );
  }

  _onFormatKeydown(e) {
    if (!e || !e.target) {
      return;
    }
    const input = e.target;
    if (e.key === "Backspace" && input.value === "") {
      const list = this._acceptedFormatsList();
      if (list.length > 0) {
        list.pop();
        this._setAcceptedFormats(list);
      }
      return;
    }
    if (e.key !== "Enter" && e.key !== ",") {
      return;
    }
    e.preventDefault();
    const added = this._sanitizeAcceptedFormatsValue(input.value);
    if (!added) {
      input.value = "";
      return;
    }
    const merged = this._sanitizeAcceptedFormatsValue(
      this._acceptedFormatsList().concat(added.split(",")),
    );
    this._setAcceptedFormats(merged ? merged.split(",") : []);
    input.value = "";
  }

  _resetAcceptedFormats(e) {
    if (e) {
      e.preventDefault();
    }
    const defaults = this.defaultPanelValues.media || {};
    this._setPanelPropertyValue(
      "media",
      "acceptedFormats",
      this._sanitizeAcceptedFormatsValue(defaults.acceptedFormats || ""),
    );
  }

  _onMediaNumberInput(property = "", e = null) {
    if (!property || !e || !e.target) {
      return;
    }
    const raw = e.target.value;
    if (raw === "") {
      return;
    }
    const value = Number(raw);
    if (Number.isNaN(value)) {
      return;
    }
    this._setPanelPropertyValue("media", property, value);
  }

  /* ------------------------------------------------------------------
   * Rendering
   * ---------------------------------------------------------------- */

  _railBadge(panel) {
    if (panel.disabled) {
      return html`<span class="rail-badge" data-tone="soon"
        >${this.t.soon}</span
      >`;
    }
    if (this._isPanelDirty(panel.key)) {
      return html`<span class="rail-dot" aria-hidden="true"></span
        ><span class="sr-only">${this.t.hasUnsavedChanges}</span>`;
    }
    if (panel.key === "status" && this.__statusLoaded) {
      const counts = this._statusCounts();
      if (counts.error > 0) {
        return html`<span class="rail-badge" data-tone="danger"
          ><span aria-hidden="true">${counts.error}</span
          ><span class="sr-only"
            >${this.t.errorsCount.replace("{count}", () => counts.error)}</span
          ></span
        >`;
      }
      if (counts.warning > 0) {
        return html`<span class="rail-badge" data-tone="warning"
          ><span aria-hidden="true">${counts.warning}</span
          ><span class="sr-only"
            >${this.t.warningsCount.replace(
              "{count}",
              () => counts.warning,
            )}</span
          ></span
        >`;
      }
    }
    if (panel.key === "skeletons" && this.__skeletonsLoaded) {
      return html`<span class="rail-badge"
        >${this.skeletonOptions.length}</span
      >`;
    }
    if (panel.key === "themes" && this.__themesLoaded) {
      return html`<span class="rail-badge">${this.themeOptions.length}</span>`;
    }
    return nothing;
  }

  _railAnchors(panel) {
    if (!panel || panel.key !== this.activePanel) {
      return [];
    }
    if (panel.key === "status" && this.__statusLoaded) {
      return this._statusSections().map((section) => ({
        id: `group-${section.id}`,
        label: this._statusGroupLabel(section.id),
      }));
    }
    if (panel.key === "media") {
      return [
        { id: "group-images", label: this.t.images },
        { id: "group-uploads", label: this.t.uploads },
      ];
    }
    return [];
  }

  _renderRailItem(panel) {
    const current = panel.key === this.activePanel;
    const anchors = this._railAnchors(panel);
    return html`
      <li>
        <button
          type="button"
          class="rail-item"
          aria-current="${current ? "page" : "false"}"
          aria-disabled="${panel.disabled ? "true" : "false"}"
          title="${panel.disabled
            ? `${panel.label}: ${this.t.comingSoon}`
            : panel.label}"
          @click="${(e) => this._navigatePanel(panel.key, e)}"
        >
          <simple-icon-lite
            icon="${panel.icon}"
            aria-hidden="true"
          ></simple-icon-lite>
          <span class="label">${panel.label}</span>
          ${this._railBadge(panel)}
        </button>
        ${anchors.length > 0
          ? html`<ul class="rail-sub">
              ${anchors.map(
                (anchor) =>
                  html`<li>
                    <button
                      type="button"
                      class="rail-item sub"
                      @click="${(e) => this._scrollToAnchor(anchor.id, e)}"
                    >
                      <span class="label">${anchor.label}</span>
                    </button>
                  </li>`,
              )}
            </ul>`
          : nothing}
      </li>
    `;
  }

  _renderRail() {
    const primary = this.panelList.filter((panel) => panel.group === "primary");
    const advanced = this.panelList.filter(
      (panel) => panel.group === "advanced",
    );
    return html`
      <nav class="rail" aria-label="${this.t.systemSettingsSections}">
        <ul>
          ${primary.map((panel) => this._renderRailItem(panel))}
        </ul>
        <div class="rail-label">
          <span class="label">${this.t.advanced}</span>
        </div>
        <ul>
          ${advanced.map((panel) => this._renderRailItem(panel))}
        </ul>
        <div class="rail-foot">
          <button
            type="button"
            class="rail-item"
            aria-expanded="${this._railCollapsed ? "false" : "true"}"
            title="${this._railCollapsed ? this.t.expand : this.t.collapse}"
            @click="${this._toggleRail}"
          >
            <simple-icon-lite
              icon="${this._railCollapsed
                ? HaxUiAdminIcons.railExpand
                : HaxUiAdminIcons.railCollapse}"
              aria-hidden="true"
            ></simple-icon-lite>
            <span class="label"
              >${this._railCollapsed ? this.t.expand : this.t.collapse}</span
            >
          </button>
        </div>
      </nav>
    `;
  }

  _renderHeaderActions(panel) {
    if (panel.key === "status") {
      return html`<div class="ph-actions">
        <button
          type="button"
          class="hax-ui-btn"
          ?disabled="${this.statusLoading}"
          @click="${() => this._loadStatusData(true)}"
        >
          <simple-icon-lite
            icon="${HaxUiAdminIcons.refresh}"
            aria-hidden="true"
          ></simple-icon-lite>
          ${this.statusLoading ? this.t.checking : this.t.checkAgain}
        </button>
      </div>`;
    }
    return nothing;
  }

  _renderStatusRow(row) {
    return html`
      <li class="row">
        <span class="hax-ui-pill tone" data-tone="${row.tone}">
          <simple-icon-lite
            icon="${this._statusToneIcon(row.tone)}"
            aria-hidden="true"
          ></simple-icon-lite>
          ${this._statusToneLabel(row.tone)}
        </span>
        <span class="title">${row.title}</span>
        <span class="value">${this._renderStatusValue(row)}</span>
        ${row.description || (Array.isArray(row.links) && row.links.length)
          ? html`<span class="desc"
              >${row.description
                ? html`<span
                    >${this._renderStatusDescription(row.description)}</span
                  >`
                : nothing}${this._renderStatusLinks(row.links)}</span
            >`
          : nothing}
      </li>
    `;
  }

  _renderStatusPanel() {
    const current = this._statusSummaryValue("haxcmsVersionCurrent");
    const latest = this._statusSummaryValue("haxcmsVersionLatest");
    const known = current !== this.t.unknown && latest !== this.t.unknown;
    const behind = known && this._compareVersion(current, latest) < 0;
    const counts = this._statusCounts();
    const sections = this._statusSections();
    return html`
      ${this.statusLoading && !this.__statusLoaded
        ? html`<p class="hax-ui-note">${this.t.loadingStatusReport}</p>`
        : nothing}
      ${this.statusError
        ? html`<p class="hax-ui-message" data-tone="danger">
            ${this.statusError}
          </p>`
        : nothing}
      <div class="facts">
        <div class="fact">
          <span class="k">${this.t.runtime}</span>
          <span class="v"
            >${this._statusSummaryValue("programmingLanguage")}</span
          >
        </div>
        <div class="fact">
          <span class="k">${this.t.server}</span>
          <span class="v">${this._statusSummaryValue("serverVersion")}</span>
        </div>
        <div class="fact">
          <span class="k">${this.t.haxcmsVersion}</span>
          <span class="v">${current}</span>
        </div>
        <div class="fact">
          <span class="k">${this.t.latestRelease}</span>
          <span class="v"
            >${latest}
            ${known
              ? html`<span
                  class="hax-ui-pill tone"
                  data-tone="${behind ? "warning" : "ok"}"
                  >${behind ? this.t.updateAvailable : this.t.upToDate}</span
                >`
              : nothing}</span
          >
        </div>
      </div>
      <div class="tally">
        ${counts.error > 0
          ? html`<span class="hax-ui-pill tone" data-tone="error"
              >${this.t.errorsCount.replace(
                "{count}",
                () => counts.error,
              )}</span
            >`
          : nothing}
        ${counts.warning > 0
          ? html`<span class="hax-ui-pill tone" data-tone="warning"
              >${this.t.warningsCount.replace(
                "{count}",
                () => counts.warning,
              )}</span
            >`
          : nothing}
        <span class="hax-ui-pill tone" data-tone="ok"
          >${this.t.okCount.replace("{count}", () => counts.ok)}</span
        >
        <span class="hax-ui-pill tone" data-tone="info"
          >${this.t.infoCount.replace("{count}", () => counts.info)}</span
        >
      </div>
      ${sections.map(
        (section) => html`
          <h3 class="group-title" id="group-${section.id}">
            ${this._statusGroupLabel(section.id)}
            <span class="count">${section.rows.length}</span>
          </h3>
          <ul
            class="rows ${section.id === "attention" ? "attention" : ""}"
            aria-labelledby="group-${section.id}"
          >
            ${section.rows.map((row) => this._renderStatusRow(row))}
          </ul>
        `,
      )}
    `;
  }

  _renderListTools(panelKey, options, label) {
    const views = this._optionViews(panelKey, options);
    const onCount = options.filter((option) =>
      panelKey === "skeletons"
        ? this._isSkeletonOptionChecked(option)
        : this._isThemeOptionChecked(option),
    ).length;
    return html`
      <div class="tools">
        <label class="search">
          <span class="sr-only">${label}</span>
          <simple-icon-lite
            icon="${HaxUiAdminIcons.search}"
            aria-hidden="true"
          ></simple-icon-lite>
          <input
            class="hax-ui-input compact"
            type="search"
            placeholder="${label}"
            .value="${this._filterText || ""}"
            @input="${this._onFilterInput}"
          />
        </label>
        <div class="hax-ui-seg" role="group" aria-label="${this.t.show}">
          ${views.map(
            (view) => html`
              <button
                type="button"
                aria-pressed="${(this._filterView || "all") === view.id
                  ? "true"
                  : "false"}"
                @click="${() => this._setFilterView(view.id)}"
              >
                ${view.label}<span class="n">${view.count}</span>
              </button>
            `,
          )}
        </div>
        <span class="count"
          >${this.t.optionCount
            .replace("{count}", () => onCount)
            .replace("{total}", () => options.length)}</span
        >
      </div>
    `;
  }

  _renderSkeletonsPanel() {
    const options = Array.isArray(this.skeletonOptions)
      ? this.skeletonOptions
      : [];
    const visible = this._filteredOptions("skeletons", options);
    const showActions = options.some((option) =>
      this._canMutateSkeletonOption(option),
    );
    return html`
      ${this.loadingSkeletons
        ? html`<p class="hax-ui-note">${this.t.loadingSkeletonOptions}</p>`
        : nothing}
      ${this._renderListTools("skeletons", options, this.t.filterSkeletons)}
      <div class="drop">
        ${this._hasSchemaFileOperationEndpoint()
          ? html`
              <p>${this.t.dropSkeletonHelp}</p>
              <hax-upload-field
                id="skeleton-upload-field"
                hide-source-selector
                hide-input
                no-camera
                no-voice-record
                no-screen-record
              ></hax-upload-field>
            `
          : html`<p>${this.t.uploadEndpointUnavailable}</p>`}
      </div>
      ${options.length === 0 && !this.loadingSkeletons
        ? html`<p class="hax-ui-empty">${this.t.noSkeletonOptions}</p>`
        : visible.length === 0
          ? html`<p class="hax-ui-empty">${this.t.noMatches}</p>`
          : html`
              <table class="table">
                <thead>
                  <tr>
                    <th class="check-col" scope="col">${this.t.on}</th>
                    <th scope="col">${this.t.skeleton}</th>
                    <th scope="col" class="hide-narrow">
                      ${this.t.machineName}
                    </th>
                    <th scope="col" class="hide-narrow">${this.t.category}</th>
                    <th scope="col">${this.t.source}</th>
                    ${showActions
                      ? html`<th scope="col" class="actions-col">
                          <span class="sr-only">${this.t.actions}</span>
                        </th>`
                      : nothing}
                  </tr>
                </thead>
                <tbody>
                  ${visible.map((option) =>
                    this._renderSkeletonOptionRow(
                      option,
                      options.indexOf(option),
                      showActions,
                    ),
                  )}
                </tbody>
              </table>
            `}
    `;
  }

  _renderSkeletonOptionRow(option, index = 0, showActions = false) {
    const checked = this._isSkeletonOptionChecked(option);
    const changed = this._isOptionChanged("skeletons", option);
    const inputId = `skeleton-option-${index}-${option.machineName}`;
    const canMutate = this._canMutateSkeletonOption(option);
    const actionDisabled = this._isSkeletonActionDisabled(option);
    const canRename = canMutate && this._hasSkeletonRenameEndpoint();
    const canDelete = canMutate && this._hasSkeletonDeleteEndpoint();
    const categories = option.categories || [];
    return html`
      <tr class="${checked ? "" : "off"} ${changed ? "changed" : ""}">
        <td class="check-col">
          <input
            id="${inputId}"
            type="checkbox"
            .checked=${checked}
            @change=${(e) => this._onSkeletonOptionChanged(option, e)}
          />
        </td>
        <td>
          <label class="option-name" for="${inputId}"
            >${option.label}
            ${changed
              ? html`<span class="hax-ui-pill tone" data-tone="accent"
                  >${this.t.changed}</span
                >`
              : nothing}</label
          >
          ${option.description
            ? html`<p class="option-desc">${option.description}</p>`
            : nothing}
        </td>
        <td class="mono hide-narrow">${option.machineName}</td>
        <td class="hide-narrow">
          ${categories.length > 0
            ? categories.map(
                (category) =>
                  html`<span class="hax-ui-pill tone">${category}</span> `,
              )
            : html`<span class="option-desc">—</span>`}
        </td>
        <td>
          <span
            class="hax-ui-pill tone"
            data-tone="${this._isUserSkeletonOption(option)
              ? "accent"
              : "outline"}"
            >${this._isUserSkeletonOption(option)
              ? this.t.uploaded
              : this.t.core}</span
          >
        </td>
        ${showActions
          ? html`<td class="actions-col">
              <span class="row-actions">
                ${canRename
                  ? html`<button
                      type="button"
                      class="hax-ui-icon-btn"
                      aria-label="${this.t.renameSkeletonNamed.replace(
                        "{machineName}",
                        () => option.machineName,
                      )}"
                      title="${this.t.renameSkeleton}"
                      ?disabled="${actionDisabled}"
                      @click="${(e) => this._renameSkeletonOption(option, e)}"
                    >
                      <simple-icon-lite
                        icon="${HaxUiAdminIcons.edit}"
                        aria-hidden="true"
                      ></simple-icon-lite>
                    </button>`
                  : nothing}
                ${canDelete
                  ? html`<button
                      type="button"
                      class="hax-ui-icon-btn danger"
                      aria-label="${this.t.deleteSkeletonNamed.replace(
                        "{machineName}",
                        () => option.machineName,
                      )}"
                      title="${this.t.deleteSkeletonNamed.replace(
                        "{machineName}",
                        () => option.machineName,
                      )}"
                      ?disabled="${actionDisabled}"
                      @click="${(e) => this._deleteSkeletonOption(option, e)}"
                    >
                      <simple-icon-lite
                        icon="${HaxUiAdminIcons.delete}"
                        aria-hidden="true"
                      ></simple-icon-lite>
                    </button>`
                  : nothing}
              </span>
            </td>`
          : nothing}
      </tr>
    `;
  }

  _themeScreenshotLarge(src = "") {
    // the listing names the small portrait thumbnail; the same folder holds
    // the full landscape screenshot, which suits a 16:10 card
    return `${src || ""}`.replace(/-thumb(\.[a-z0-9]+)$/i, "$1");
  }

  _onThemeImageError(option, e) {
    const img = e && e.target ? e.target : null;
    if (img && option.screenshot && img.src !== option.screenshot) {
      img.src = option.screenshot;
    }
  }

  _renderThemesPanel() {
    const options = Array.isArray(this.themeOptions) ? this.themeOptions : [];
    const visible = this._filteredOptions("themes", options);
    return html`
      ${this.loadingThemes
        ? html`<p class="hax-ui-note">${this.t.loadingThemeOptions}</p>`
        : nothing}
      ${this._renderListTools("themes", options, this.t.filterThemes)}
      ${options.length === 0 && !this.loadingThemes
        ? html`<p class="hax-ui-empty">${this.t.noThemeOptions}</p>`
        : visible.length === 0
          ? html`<p class="hax-ui-empty">${this.t.noMatches}</p>`
          : html`<div class="cards">
              ${visible.map((option) =>
                this._renderThemeOptionRow(option, options.indexOf(option)),
              )}
            </div>`}
    `;
  }

  _renderThemeOptionRow(option, index = 0) {
    const checked = this._isThemeOptionChecked(option);
    const changed = this._isOptionChanged("themes", option);
    const inputId = `theme-option-${index}-${option.machineName}`;
    const categories = option.categories || [];
    return html`
      <div class="card ${checked ? "" : "off"} ${changed ? "changed" : ""}">
        <div class="shot">
          ${option.screenshot
            ? html`<img
                src="${this._themeScreenshotLarge(option.screenshot)}"
                alt="${this.t.themePreviewAlt.replace(
                  "{theme}",
                  () => option.label,
                )}"
                loading="lazy"
                @error="${(e) => this._onThemeImageError(option, e)}"
              />`
            : html`<span>${this.t.noPreview}</span>`}
        </div>
        <div class="card-cap">
          <input
            id="${inputId}"
            type="checkbox"
            .checked=${checked}
            @change=${(e) => this._onThemeOptionChanged(option, e)}
          />
          <span class="text">
            <label for="${inputId}" title="${option.label}"
              >${option.label}</label
            >
            <span class="meta"
              ><span class="mono">${option.machineName}</span
              >${categories.length > 0
                ? html` · ${categories.join(", ")}`
                : nothing}</span
            >
          </span>
          ${changed
            ? html`<span class="hax-ui-pill tone" data-tone="accent"
                >${this.t.changed}</span
              >`
            : nothing}
        </div>
      </div>
    `;
  }

  _renderMediaPanel() {
    const values = this._getPanelValue("media");
    const defaults = this.defaultPanelValues.media || {};
    const quality =
      typeof values.jpegQuality === "number"
        ? values.jpegQuality
        : defaults.jpegQuality;
    const maxUpload =
      typeof values.maxUploadSizeMb === "number"
        ? values.maxUploadSizeMb
        : defaults.maxUploadSizeMb;
    const serverLimit = this._serverUploadLimit();
    const overServer =
      serverLimit &&
      typeof maxUpload === "number" &&
      maxUpload > serverLimit.mb;
    const formats = this._acceptedFormatsList();
    return html`
      <h3 class="group-title" id="group-images">${this.t.images}</h3>
      <div class="hax-ui-field-row">
        <div class="hax-ui-field-label">
          <label for="media-jpeg-quality">${this.t.jpegQualityLabel}</label>
          <p>${this.t.jpegQualityHelp}</p>
        </div>
        <div class="hax-ui-field-control inline">
          <input
            type="range"
            min="1"
            max="100"
            .value="${`${quality}`}"
            aria-label="${this.t.jpegQualityLabel}"
            @input="${(e) => this._onMediaNumberInput("jpegQuality", e)}"
          />
          <span class="hax-ui-input-group">
            <input
              id="media-jpeg-quality"
              type="number"
              min="1"
              max="100"
              .value="${`${quality}`}"
              @input="${(e) => this._onMediaNumberInput("jpegQuality", e)}"
            />
            <span class="unit" aria-hidden="true">%</span>
          </span>
        </div>
      </div>
      <h3 class="group-title" id="group-uploads">${this.t.uploads}</h3>
      <div class="hax-ui-field-row">
        <div class="hax-ui-field-label">
          <label for="media-max-upload">${this.t.maxUploadLabel}</label>
          <p>${this.t.maxUploadHelp}</p>
        </div>
        <div class="hax-ui-field-control inline">
          <span class="hax-ui-input-group ${overServer ? "warning" : ""}">
            <input
              id="media-max-upload"
              type="number"
              min="1"
              .value="${`${maxUpload}`}"
              aria-describedby="${overServer ? "media-upload-note" : ""}"
              @input="${(e) => this._onMediaNumberInput("maxUploadSizeMb", e)}"
            />
            <span class="unit" aria-hidden="true">MB</span>
          </span>
          ${overServer
            ? html`<p
                class="hax-ui-message"
                data-tone="warning"
                id="media-upload-note"
                role="note"
              >
                <simple-icon-lite
                  icon="${HaxUiAdminIcons.warning}"
                  aria-hidden="true"
                ></simple-icon-lite>
                <span
                  >${this.t.serverUploadLimitNote.replace(
                    "{limit}",
                    () => serverLimit.label,
                  )}</span
                >
              </p>`
            : nothing}
        </div>
      </div>
      <div class="hax-ui-field-row">
        <div class="hax-ui-field-label">
          <label for="media-formats">${this.t.acceptedFileFormats}</label>
          <p>${this.t.acceptedFormatsHelp}</p>
        </div>
        <div class="hax-ui-field-control inline">
          <div class="hax-ui-tokens">
            ${formats.map(
              (format) => html`
                <span class="hax-ui-token"
                  >${format}<button
                    type="button"
                    aria-label="${this.t.removeFileFormat.replace(
                      "{format}",
                      () => format,
                    )}"
                    @click="${() => this._removeAcceptedFormat(format)}"
                  >
                    <simple-icon-lite
                      icon="${HaxUiAdminIcons.close}"
                      aria-hidden="true"
                    ></simple-icon-lite></button
                ></span>
              `,
            )}
            <input
              id="media-formats"
              type="text"
              placeholder="${this.t.addFileFormat}"
              autocomplete="off"
              @keydown="${this._onFormatKeydown}"
            />
          </div>
          <button
            type="button"
            class="hax-ui-btn ghost"
            @click="${this._resetAcceptedFormats}"
          >
            ${this.t.resetToDefaults}
          </button>
        </div>
      </div>
    `;
  }

  _renderPanelSection(panelKey, section) {
    return html`
      <div class="hax-ui-field-row" id="group-${section.key}">
        <div class="hax-ui-field-label">
          <span class="name">${section.label}</span>
          <p>${section.description}</p>
        </div>
        <div class="hax-ui-field-control">
          <simple-fields
            .fields="${section.fields}"
            .value="${this._getPanelValue(panelKey)}"
            .schematizer="${HaxSchematizer}"
            .elementizer="${HaxElementizer}"
            @value-changed="${(e) => this._onPanelValueChanged(panelKey, e)}"
          ></simple-fields>
        </div>
      </div>
    `;
  }

  _renderBlocksPanel() {
    return html`
      <haxcms-system-allowed-blocks
        @haxcms-save-allowed-blocks="${this._onAllowedBlocksSaved}"
        @simple-modal-hide="${this._onNestedModalHide}"
      ></haxcms-system-allowed-blocks>
    `;
  }

  _renderCustomCodePanel() {
    const panelValue = this._getPanelValue("custom-code");
    const cssValue =
      panelValue && typeof panelValue.globalCss === "string"
        ? panelValue.globalCss
        : "";
    const jsValue =
      panelValue && typeof panelValue.globalJs === "string"
        ? panelValue.globalJs
        : "";
    return html`
      <div class="code-grid">
        <div>
          <code-editor
            title="${this.t.globalCss}"
            language="css"
            theme="auto"
            .editorValue="${cssValue}"
            @value-changed="${(e) =>
              this._onCodeEditorValueChanged("custom-code", "globalCss", e)}"
          ></code-editor>
        </div>
        <div>
          <code-editor
            title="${this.t.globalJavaScript}"
            language="javascript"
            theme="auto"
            .editorValue="${jsValue}"
            @value-changed="${(e) =>
              this._onCodeEditorValueChanged("custom-code", "globalJs", e)}"
          ></code-editor>
        </div>
      </div>
    `;
  }

  _renderStyleGuidePanel() {
    return html`<p class="hax-ui-empty">
      ${this.t.styleGuideDisabledRelease}
    </p>`;
  }

  _renderIntegrationsPanel() {
    const fields = this._integrationFields();
    return html`
      ${this.apiKeysLoading
        ? html`<p class="hax-ui-note">${this.t.loadingSavedApiKeys}</p>`
        : nothing}
      ${this.apiKeysError
        ? html`<p class="hax-ui-message" data-tone="danger">
            ${this.apiKeysError}
          </p>`
        : nothing}
      ${fields.length === 0
        ? html`<p class="hax-ui-empty">${this.t.noIntegrationProviders}</p>`
        : fields.map(
            (field) => html`
              <div class="hax-ui-field-row">
                <div class="hax-ui-field-label">
                  <label for="${this._integrationInputId(field.property)}"
                    >${field.providerLabel ||
                    field.title ||
                    field.property}</label
                  >
                  ${field.helpUrl
                    ? html`<p>
                        <a
                          class="link"
                          href="${field.helpUrl}"
                          target="_blank"
                          rel="noopener noreferrer"
                          >${this.t.getApiKey}</a
                        >
                      </p>`
                    : nothing}
                </div>
                <div class="hax-ui-field-control inline">
                  <input
                    id="${this._integrationInputId(field.property)}"
                    class="hax-ui-input mono"
                    type="${this._isApiKeyVisible(field.property)
                      ? "text"
                      : "password"}"
                    .value="${this._integrationFieldValue(field.property)}"
                    autocomplete="off"
                    autocorrect="off"
                    autocapitalize="none"
                    spellcheck="false"
                    @input="${(e) =>
                      this._onApiKeyInputChanged(field.property, e)}"
                  />
                  <button
                    type="button"
                    class="hax-ui-icon-btn"
                    aria-label="${this._isApiKeyVisible(field.property)
                      ? this.t.hideApiKeyValue
                      : this.t.showApiKeyValue}"
                    aria-pressed="${this._isApiKeyVisible(field.property)
                      ? "true"
                      : "false"}"
                    @click="${(e) =>
                      this._toggleApiKeyVisibility(field.property, e)}"
                  >
                    <simple-icon-lite
                      icon="${this._isApiKeyVisible(field.property)
                        ? HaxUiAdminIcons.hide
                        : HaxUiAdminIcons.preview}"
                      aria-hidden="true"
                    ></simple-icon-lite>
                  </button>
                </div>
              </div>
            `,
          )}
    `;
  }

  _renderActivePanelContent(panel) {
    if (!panel) {
      return nothing;
    }
    if (panel.panelType === "status") {
      return this._renderStatusPanel();
    }
    if (panel.panelType === "skeletons") {
      return this._renderSkeletonsPanel();
    }
    if (panel.panelType === "themes") {
      return this._renderThemesPanel();
    }
    if (panel.panelType === "blocks") {
      return this._renderBlocksPanel();
    }
    if (panel.panelType === "custom-code") {
      return this._renderCustomCodePanel();
    }
    if (panel.panelType === "integrations") {
      return this._renderIntegrationsPanel();
    }
    if (panel.panelType === "style-guide") {
      return this._renderStyleGuidePanel();
    }
    if (panel.key === "media") {
      return this._renderMediaPanel();
    }
    if (panel.sections && panel.sections.length > 0) {
      return panel.sections.map((section) =>
        this._renderPanelSection(panel.key, section),
      );
    }
    return html`<p class="hax-ui-empty">${this.t.noSettingsForPanel}</p>`;
  }

  _renderFooterStatus(panel) {
    if (this.panelSaving) {
      return html`<div class="st muted" role="status">${this.t.saving}</div>`;
    }
    const changes = this._panelChanges(panel.key);
    if (changes.length > 0) {
      return html`<div class="st" role="status">
        <span class="dot" aria-hidden="true"></span>
        <b
          >${changes.length === 1
            ? this.t.unsavedChange
            : this.t.unsavedChanges.replace("{count}", () => changes.length)}</b
        >
        <span class="list">${changes.join(" · ")}</span>
      </div>`;
    }
    if (this.statusMessage && this._saveTone === "error") {
      return html`<div class="st error" role="status">
        ${this.statusMessage}
      </div>`;
    }
    if (this.statusMessage && this._saveTone === "saved") {
      return html`<div class="st saved" role="status">
        <simple-icon-lite
          icon="${HaxUiAdminIcons.check}"
          aria-hidden="true"
        ></simple-icon-lite>
        <b>${this.statusMessage}</b>
      </div>`;
    }
    return html`<div class="st muted" role="status">
      ${this.statusMessage || this.t.noUnsavedChanges}
    </div>`;
  }

  _renderFooter(panel) {
    if (!this._showPanelSaveAction(panel) || panel.disabled) {
      return nothing;
    }
    const dirty = this._isPanelDirty(panel.key);
    return html`
      <div class="ftr">
        ${this._renderFooterStatus(panel)}
        <button
          type="button"
          class="hax-ui-btn ghost"
          ?disabled="${!dirty || this.panelSaving}"
          @click="${() => this._discardPanel(panel.key)}"
        >
          ${this.t.discard}
        </button>
        <button
          type="button"
          class="hax-ui-btn primary"
          ?disabled="${!dirty || this.panelSaving}"
          @click="${this._saveActivePanel}"
        >
          ${this.panelSaving ? this.t.saving : this.t.save}
        </button>
      </div>
    `;
  }

  _renderLeavePrompt(panel) {
    if (!this._pendingPanel) {
      return nothing;
    }
    return html`
      <div class="scrim" @keydown="${this._onLeaveKeydown}">
        <div
          class="leave"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="leave-title"
          aria-describedby="leave-body"
        >
          <h3 id="leave-title">
            ${this.t.leaveTitle.replace("{panel}", () => panel.label)}
          </h3>
          <p id="leave-body">${this.t.leaveBody}</p>
          <div class="acts">
            <button
              type="button"
              class="hax-ui-btn ghost"
              id="leave-stay"
              @click="${this._closeLeavePrompt}"
            >
              ${this.t.stay}
            </button>
            <button
              type="button"
              class="hax-ui-btn"
              @click="${this._leaveDiscard}"
            >
              ${this.t.discardAndContinue}
            </button>
            <button
              type="button"
              class="hax-ui-btn primary"
              @click="${this._leaveSave}"
            >
              ${this.t.saveAndContinue}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const panel =
      this._getPanelByKey(this.activePanel) || this._getPanelByKey("status");
    const showInlineMessage =
      this.statusMessage && !this._showPanelSaveAction(panel);
    return html`
      <div
        class="section ${this._railCollapsed || this._narrow
          ? "rail-collapsed"
          : ""} ${this._narrow ? "narrow" : ""}"
      >
        ${this._renderRail()}
        <section class="main" aria-labelledby="panel-title">
          <header class="ph">
            <div class="ph-text">
              <h2 id="panel-title">${panel.label}</h2>
              <p>${panel.intro}</p>
            </div>
            ${this._renderHeaderActions(panel)}
          </header>
          <div class="body">
            ${showInlineMessage
              ? html`<p class="hax-ui-note" role="status">
                  ${this.statusMessage}
                </p>`
              : nothing}
            ${this._renderActivePanelContent(panel)}
          </div>
          ${this._renderFooter(panel)}
        </section>
      </div>
      ${this._renderLeavePrompt(panel)}
    `;
  }
}

globalThis.customElements.define(
  HAXCMSSystemSettings.tag,
  HAXCMSSystemSettings,
);

export { HAXCMSSystemSettings };
