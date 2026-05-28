import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  HaxSchematizer,
  HaxElementizer,
} from "@haxtheweb/hax-body-behaviors/lib/HAXFields.js";
import "@haxtheweb/simple-fields/simple-fields.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/code-editor/code-editor.js";
import "@haxtheweb/hax-body/lib/hax-upload-field.js";
import "./haxcms-system-allowed-blocks.js";

class HAXCMSSystemSettings extends DDD {
  static get tag() {
    return "haxcms-system-settings";
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
    };
  }

  constructor() {
    super();
    this.activePanel = "dashboard";
    this.statusMessage = "";
    this.statusRows = [];
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
    this.__skeletonUploadField = null;
    this.__skeletonUploadNode = null;
    this.__boundSkeletonUploadBefore = this._onSkeletonUploadBefore.bind(this);
    this.__boundSkeletonUploadResponse =
      this._onSkeletonUploadResponse.bind(this);
    this.__boundSkeletonUploadReject =
      this._onSkeletonUploadReject.bind(this);
    this.panelList = this._buildPanels();
    this.panelMap = this._buildPanelMap(this.panelList);
    this.defaultPanelValues = this._buildDefaultPanelValues(this.panelList);
    this.panelValues = this._cloneData(this.defaultPanelValues);
    const defaultStatusPayload = this._buildDefaultStatusPayload();
    this.statusRows = defaultStatusPayload.rows;
    this.statusSummary = defaultStatusPayload.summary;
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadPanelData(this.activePanel);
  }

  disconnectedCallback() {
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
      super.styles,
      css`
        :host {
          --haxcms-admin-panel-height: calc(
            var(--simple-modal-height, 80vh) - var(
                --simple-modal-titlebar-height,
                80px
              ) - var(--ddd-spacing-8, 32px)
          );
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          min-width: 78vw;
          min-height: min(65vh, var(--haxcms-admin-panel-height));
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
          font-family: var(--ddd-font-primary);
        }
        .dashboard-shell,
        .panel-shell {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }
        .dashboard-scroll,
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
        .dashboard-header {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
        }
        .dashboard-header h2 {
          margin: 0;
          font-size: var(--ddd-font-size-m);
          font-weight: var(--ddd-font-weight-bold);
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
        .dashboard-header p {
          margin: 0;
          font-size: var(--ddd-font-size-3xs);
          line-height: 1.45;
          opacity: 0.92;
        }
        .primary-grid,
        .advanced-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: var(--ddd-spacing-3);
        }
        .launcher {
          width: 100%;
          border-radius: var(--ddd-radius-sm);
          border: var(--ddd-border-sm) solid
            light-dark(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-white)
            );
          background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-black)
          );
          color: inherit;
          font-family: var(--ddd-font-primary);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--ddd-spacing-2);
          text-align: center;
          padding: var(--ddd-spacing-3);
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }
        .launcher:hover,
        .launcher:focus-visible {
          border-color: var(--ddd-theme-default-skyBlue);
          box-shadow: var(--ddd-boxShadow-sm);
          transform: translateY(-2px);
          outline: none;
          color: var(--ddd-theme-default-skyBlue);
        }
        .launcher[disabled],
        .launcher.disabled {
          cursor: not-allowed;
          opacity: 0.7;
          transform: none;
          box-shadow: none;
        }
        .launcher[disabled]:hover,
        .launcher[disabled]:focus-visible {
          border-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          color: inherit;
          transform: none;
          box-shadow: none;
        }
        .launcher.primary {
          min-height: 156px;
        }
        .launcher simple-icon-lite {
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-l, 56px);
          --simple-icon-height: var(--ddd-icon-l, 56px);
        }
        .launcher .label {
          font-size: var(--ddd-font-size-xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: 1.3;
        }
        .launcher .description {
          font-size: var(--ddd-font-size-5xs);
          line-height: 1.35;
          opacity: 0.9;
        }
        .coming-soon-chip {
          margin-top: var(--ddd-spacing-1);
          border-radius: var(--ddd-radius-xs);
          border: var(--ddd-border-xs) solid
            var(--ddd-theme-default-keystoneYellow);
          color: light-dark(
            var(--ddd-theme-default-potentialMidnight),
            var(--ddd-theme-default-keystoneYellow)
          );
          font-size: var(--ddd-font-size-6xs);
          font-weight: var(--ddd-font-weight-bold);
          padding: 2px var(--ddd-spacing-2);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .panel-header {
          display: flex;
          align-items: flex-start;
          gap: var(--ddd-spacing-3);
          border-bottom: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          padding-bottom: var(--ddd-spacing-3);
          margin-bottom: var(--ddd-spacing-2);
        }
        .panel-title-wrap {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
          min-width: 0;
        }
        .panel-title-wrap h2 {
          margin: 0;
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-m);
          font-weight: var(--ddd-font-weight-bold);
        }
        .panel-title-wrap h2 simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-3xs, 20px);
          --simple-icon-height: var(--ddd-icon-3xs, 20px);
          --simple-icon-color: currentColor;
        }
        .panel-title-wrap p {
          margin: 0;
          font-size: var(--ddd-font-size-3xs);
          line-height: 1.35;
          opacity: 0.92;
        }
        .section {
          border: var(--ddd-border-sm) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
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
          margin: 0 0 var(--ddd-spacing-3) 0;
        }
        .section-leading {
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
        .section-body {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-3);
        }
        .section-description {
          margin: 0;
          font-size: var(--ddd-font-size-4xs);
          line-height: 1.35;
          opacity: 0.9;
        }
        .helper {
          margin: 0;
          font-size: var(--ddd-font-size-4xs);
          opacity: 0.9;
        }
        .empty-state {
          margin: 0;
          border-radius: var(--ddd-radius-sm);
          border: var(--ddd-border-xs) dashed
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          padding: var(--ddd-spacing-3);
          font-size: var(--ddd-font-size-4xs);
          line-height: 1.35;
        }
        .style-guide-disabled {
          border-radius: var(--ddd-radius-md);
          border: var(--ddd-border-sm) dashed
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-theme-default-slateGray)
            );
          background: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            rgba(255, 255, 255, 0.04)
          );
          padding: var(--ddd-spacing-4);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
        }
        .style-guide-disabled h3 {
          margin: 0;
          font-size: var(--ddd-font-size-s);
        }
        .style-guide-disabled p {
          margin: 0;
          font-size: var(--ddd-font-size-4xs);
          line-height: 1.4;
        }
        .style-guide-disabled button {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          border-radius: var(--ddd-radius-sm);
          border: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          background: transparent;
          color: inherit;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          width: fit-content;
          cursor: not-allowed;
          opacity: 0.7;
        }
        .code-editor-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: var(--ddd-spacing-4);
        }
        .code-editor-wrapper {
          border: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          border-radius: var(--ddd-radius-md);
          padding: var(--ddd-spacing-2);
          background: light-dark(
            var(--ddd-theme-default-white),
            rgba(0, 0, 0, 0.15)
          );
        }
        .code-editor-wrapper code-editor {
          margin: 0;
          width: 100%;
        }
        .status-summary-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: var(--ddd-spacing-2);
        }
        .status-summary {
          border-radius: var(--ddd-radius-sm);
          border: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          background: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            rgba(255, 255, 255, 0.06)
          );
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
        }
        .status-summary .label {
          font-size: var(--ddd-font-size-6xs);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          opacity: 0.9;
        }
        .status-summary .value {
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: 1.3;
        }
        .status-table-wrap {
          overflow-x: auto;
          border-radius: var(--ddd-radius-sm);
          border: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          background: light-dark(
            var(--ddd-theme-default-white),
            rgba(255, 255, 255, 0.04)
          );
        }
        table.system-status-report {
          width: 100%;
          border-collapse: collapse;
          min-width: 720px;
        }
        table.system-status-report td {
          border-bottom: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          font-size: var(--ddd-font-size-4xs);
          vertical-align: top;
        }
        table.system-status-report tr:last-child td {
          border-bottom: 0;
        }
        .status-icon {
          width: 56px;
        }
        .status-icon-marker {
          width: var(--ddd-icon-4xs, 16px);
          height: var(--ddd-icon-4xs, 16px);
          border-radius: 50%;
          display: inline-flex;
          border: var(--ddd-border-xs) solid currentColor;
        }
        .status-title {
          width: 32%;
          font-weight: var(--ddd-font-weight-bold);
        }
        .status-description {
          font-size: var(--ddd-font-size-5xs);
          line-height: 1.35;
        }
        .status-row.ok {
          color: var(--ddd-theme-default-opportunityGreen);
        }
        .status-row.warning {
          color: light-dark(
            var(--ddd-theme-default-potentialMidnight),
            var(--ddd-theme-default-keystoneYellow)
          );
        }
        .status-row.error {
          color: var(--ddd-theme-default-original87Pink);
        }
        .status-row.info {
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-limestoneGray)
          );
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }
        .status-message {
          margin: 0;
          border-radius: var(--ddd-radius-sm);
          border: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          background: light-dark(
            var(--ddd-theme-default-athertonViolet),
            rgba(255, 255, 255, 0.06)
          );
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          font-size: var(--ddd-font-size-4xs);
        }
        .status-message.error {
          border-color: var(--ddd-theme-default-original87Pink);
          color: var(--ddd-theme-default-original87Pink);
          background: light-dark(
            var(--ddd-theme-default-potentialMidnight),
            rgba(0, 0, 0, 0.2)
          );
        }
        .settings-option-table-wrap {
          overflow-x: auto;
          border-radius: var(--ddd-radius-sm);
          border: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          background: light-dark(
            var(--ddd-theme-default-white),
            rgba(255, 255, 255, 0.04)
          );
        }
        table.settings-option-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          min-width: 760px;
        }
        table.settings-option-table th,
        table.settings-option-table td {
          text-align: left;
          vertical-align: top;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border-bottom: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
        }
        table.settings-option-table tbody tr:last-child td {
          border-bottom: 0;
        }
        table.settings-option-table th {
          font-size: var(--ddd-font-size-4xs);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-weight: var(--ddd-font-weight-bold);
        }
        table.settings-option-table .select-col {
          width: 88px;
          text-align: center;
        }
        table.settings-option-table .preview-col {
          width: 232px;
        }
        table.settings-option-table .actions-col {
          width: 128px;
          text-align: center;
        }
        table.settings-option-table input[type="checkbox"] {
          margin-top: 0;
          inline-size: var(--ddd-icon-xs);
          block-size: var(--ddd-icon-xs);
          cursor: pointer;
        }
        .settings-theme-preview {
          inline-size: 200px;
          block-size: 100px;
          border-radius: var(--ddd-radius-xs);
          border: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          background: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            rgba(255, 255, 255, 0.06)
          );
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .settings-theme-preview img {
          inline-size: 100%;
          block-size: 100%;
          object-fit: cover;
          object-position: top left;
          display: block;
        }
        .settings-theme-preview-fallback {
          font-size: var(--ddd-font-size-5xs);
          opacity: 0.86;
        }
        .skeleton-upload-wrap {
          border: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          border-radius: var(--ddd-radius-sm);
          background: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            rgba(255, 255, 255, 0.04)
          );
          padding: var(--ddd-spacing-3);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
        }
        .skeleton-upload-wrap hax-upload-field {
          display: block;
        }
        .skeleton-actions {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
        }
        .skeleton-action-button {
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-limestoneGray)
          );
          --simple-icon-width: var(--ddd-icon-4xs, 16px);
          --simple-icon-height: var(--ddd-icon-4xs, 16px);
        }
        .settings-option-row {
          transition:
            opacity 0.2s ease,
            background-color 0.2s ease;
        }
        .settings-option-row.enabled {
          opacity: 1;
          background-color: light-dark(
            rgba(0, 0, 0, 0.02),
            rgba(255, 255, 255, 0.06)
          );
        }
        .settings-option-row.disabled {
          opacity: 0.58;
          background-color: light-dark(
            rgba(0, 0, 0, 0),
            rgba(255, 255, 255, 0.02)
          );
        }
        .settings-option-title {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          font-weight: var(--ddd-font-weight-bold);
        }
        .settings-option-description {
          margin: var(--ddd-spacing-1) 0 0 0;
          font-size: var(--ddd-font-size-3xs);
          line-height: 1.35;
          opacity: 0.92;
        }
        .api-key-list {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-3);
        }
        .api-key-row {
          border-radius: var(--ddd-radius-sm);
          border: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          background: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            rgba(255, 255, 255, 0.05)
          );
          padding: var(--ddd-spacing-3);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
        }
        .api-key-row-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-2);
          flex-wrap: wrap;
        }
        .api-key-label {
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
        }
        .api-key-link {
          font-size: var(--ddd-font-size-5xs);
          color: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-skyBlue)
          );
          text-decoration: none;
        }
        .api-key-link:focus-visible,
        .api-key-link:hover {
          text-decoration: underline;
        }
        .api-key-input-wrap {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
        }
        .api-key-input {
          flex: 1 1 auto;
          min-width: 0;
          border-radius: var(--ddd-radius-sm);
          border: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-black)
          );
          color: inherit;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          line-height: 1.4;
        }
        .api-key-input:focus-visible {
          outline: var(--ddd-border-xs) solid var(--ddd-theme-default-skyBlue);
          outline-offset: 0;
          border-color: var(--ddd-theme-default-skyBlue);
        }
        .api-key-toggle {
          flex: 0 0 auto;
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-limestoneGray)
          );
          --simple-icon-width: var(--ddd-icon-4xs, 16px);
          --simple-icon-height: var(--ddd-icon-4xs, 16px);
        }
        .actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--ddd-spacing-3);
          border-top: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          padding-top: var(--ddd-spacing-3);
          margin-top: var(--ddd-spacing-2);
          background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          position: sticky;
          bottom: 0;
          z-index: 2;
        }
        button.action {
          border-radius: var(--ddd-radius-sm);
          border: var(--ddd-border-xs) solid
            light-dark(
              var(--ddd-theme-default-limestoneGray),
              var(--ddd-primary-5)
            );
          background: light-dark(
            var(--ddd-theme-default-white),
            rgba(255, 255, 255, 0.08)
          );
          color: inherit;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-xs);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          cursor: pointer;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }
        button.action:hover,
        button.action:focus-visible {
          border-color: var(--ddd-theme-default-skyBlue);
          box-shadow: var(--ddd-boxShadow-sm);
          transform: translateY(-1px);
          outline: none;
        }
        button.action.primary {
          border-color: var(--ddd-theme-default-navy);
          background: light-dark(
            var(--ddd-theme-default-skyBlue),
            var(--ddd-theme-default-navy)
          );
          color: var(--ddd-theme-default-white);
        }
        simple-fields {
          --simple-fields-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --simple-fields-background-color: transparent;
          --simple-fields-fieldset-background-color: transparent;
          --simple-fields-border-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-primary-5)
          );
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
        @media (max-width: 1200px) {
          .primary-grid,
          .advanced-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .status-summary-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 720px) {
          :host {
            min-width: 0;
            width: 100%;
          }
          .primary-grid,
          .advanced-grid,
          .status-summary-grid {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
          .actions {
            justify-content: stretch;
          }
          .actions button.action {
            flex: 1 1 auto;
          }
          .status-table-wrap {
            margin-right: var(--ddd-spacing-1);
          }
        }
      `,
    ];
  }

  _buildPanels() {
    return [
      {
        key: "status",
        label: "Status",
        icon: "hax:graph",
        group: "primary",
        description: "Runtime and update status",
        intro:
          "System health report modeled after the admin status table, using backend-friendly keys for both PHP and NodeJS deployments.",
        panelType: "status",
      },
      {
        key: "skeletons",
        label: "Skeletons",
        icon: "hax:site-map",
        group: "primary",
        description: "Available starter structures",
        intro:
          "Enable or disable site skeletons discovered from the skeleton listing endpoint.",
        panelType: "skeletons",
      },
      {
        key: "themes",
        label: "Themes",
        icon: "lrn:palette",
        group: "primary",
        description: "Available themes",
        intro:
          "Enable or disable installable themes discovered from the theme listing source.",
        panelType: "themes",
      },
      {
        key: "blocks",
        label: "Blocks",
        icon: "hax:blocks",
        group: "primary",
        description: "Allowed block registry",
        intro:
          "Manage allowed blocks using the same grouped checkbox experience as allowed-blocks UI.",
        panelType: "blocks",
      },
      {
        key: "integrations",
        label: "Integrations",
        icon: "communication:vpn-key",
        group: "advanced",
        description: "Third-party credentials",
        intro:
          "Configure API credentials and integration defaults used by media and automation features.",
        panelType: "integrations",
        sections: [
          {
            key: "api-keys",
            label: "API Keys",
            icon: "communication:vpn-key",
            description:
              "Manage provider API keys used for media and AI integrations. Keys are stored server-side in _config/apiKeys.json.",
            fields: [
              {
                property: "youtubeApiKey",
                providerLabel: "YouTube",
                storageKey: "youtube",
                title: "YouTube API key",
                helpUrl: "https://developers.google.com/youtube/v3/getting-started",
                inputMethod: "textfield",
                default: "",
              },
              {
                property: "giphyApiKey",
                providerLabel: "Giphy",
                storageKey: "giphy",
                title: "Giphy API key",
                helpUrl: "https://developers.giphy.com/dashboard/",
                inputMethod: "textfield",
                default: "",
              },
              {
                property: "vimeoApiKey",
                providerLabel: "Vimeo",
                storageKey: "vimeo",
                title: "Vimeo API key",
                helpUrl: "https://developer.vimeo.com/apps",
                inputMethod: "textfield",
                default: "",
              },
              {
                property: "unsplashApiKey",
                providerLabel: "Unsplash",
                storageKey: "unsplash",
                title: "Unsplash API key",
                helpUrl: "https://unsplash.com/developers",
                inputMethod: "textfield",
                default: "",
              },
              {
                property: "flickrApiKey",
                providerLabel: "Flickr",
                storageKey: "flickr",
                title: "Flickr API key",
                helpUrl: "https://www.flickr.com/services/apps/create/",
                inputMethod: "textfield",
                default: "",
              },
              {
                property: "anthropicApiKey",
                providerLabel: "Anthropic",
                storageKey: "anthropic",
                title: "Anthropic API key",
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
        label: "Media",
        icon: "image:image",
        group: "advanced",
        description: "Media defaults",
        intro:
          "Set image quality, upload constraints, and transformation behavior defaults.",
        panelType: "fields",
        disabled: true,
        sections: [
          {
            key: "media-policy",
            label: "Media policy",
            icon: "image:image",
            description:
              "Media values are staged in UI while backend persistence is implemented.",
            fields: [
              {
                property: "jpegQuality",
                title: "JPEG image quality (1-100)",
                inputMethod: "number",
                default: 90,
              },
              {
                property: "maxUploadSizeMb",
                title: "Max upload size (MB)",
                inputMethod: "number",
                default: 25,
              },
              {
                property: "acceptedFormats",
                title: "Accepted file formats",
                inputMethod: "textarea",
                default: "jpg,jpeg,png,webp,gif",
              },
            ],
          },
        ],
      },
      {
        key: "style-guide",
        label: "Style Guide",
        icon: "editor:format-color-text",
        group: "advanced",
        description: "Authoring style guidance",
        intro:
          "Style guide controls are intentionally disabled while backend support is finalized.",
        panelType: "style-guide",
        disabled: true,
      },
      {
        key: "custom-code",
        label: "JS/CSS",
        icon: "code",
        group: "advanced",
        description: "Global CSS and JavaScript",
        intro:
          "Edit global CSS and JavaScript. Empty values are valid and will save as empty.",
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

  _schemaFileOperationEndpoint() {
    const settings = this._appSettings();
    if (
      !settings ||
      !Object.prototype.hasOwnProperty.call(settings, "schemaFileOperation")
    ) {
      return "";
    }
    const endpoint =
      typeof settings.schemaFileOperation === "string"
        ? settings.schemaFileOperation.trim()
        : "";
    if (!endpoint) {
      return "";
    }
    if (
      endpoint.indexOf("http://") === 0 ||
      endpoint.indexOf("https://") === 0 ||
      endpoint.indexOf("/") === 0
    ) {
      return endpoint;
    }
    const api = this._backendApi();
    const basePath =
      api && typeof api.basePath === "string" && api.basePath
        ? api.basePath
        : "/";
    if (basePath.slice(-1) === "/" || endpoint.charAt(0) === "/") {
      return `${basePath}${endpoint}`;
    }
    return `${basePath}/${endpoint}`;
  }

  _hasSchemaFileOperationEndpoint() {
    return this._schemaFileOperationEndpoint() !== "";
  }

  _schemaOperationAuthPayload() {
    const api = this._backendApi();
    const payload = {};
    if (api && typeof api.jwt === "string" && api.jwt) {
      payload.jwt = api.jwt;
    }
    if (api && typeof api.token === "string" && api.token) {
      payload.token = api.token;
    }
    return payload;
  }

  async _schemaFileOperationJson(payload = {}) {
    const endpoint = this._schemaFileOperationEndpoint();
    if (!endpoint) {
      return {
        ok: false,
        status: 0,
        data: null,
        message: "Schema file operation endpoint is unavailable.",
      };
    }
    const body = {};
    const authPayload = this._schemaOperationAuthPayload();
    const authKeys = Object.keys(authPayload);
    for (let i = 0; i < authKeys.length; i++) {
      const key = authKeys[i];
      body[key] = authPayload[key];
    }
    if (payload && typeof payload === "object" && !Array.isArray(payload)) {
      const keys = Object.keys(payload);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        body[key] = payload[key];
      }
    }
    let response = null;
    let data = null;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      try {
        data = await response.json();
      } catch (e) {
        data = null;
      }
    } catch (e) {
      return {
        ok: false,
        status: 0,
        data: null,
        message: "Network request failed.",
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
        "Schema file operation failed.",
      ),
    };
  }

  _schemaOperationResponseMessage(response = null, fallback = "") {
    if (
      response &&
      response.__failed &&
      typeof response.__failed.message === "string" &&
      response.__failed.message
    ) {
      return response.__failed.message;
    }
    if (response && typeof response.message === "string" && response.message) {
      return response.message;
    }
    if (
      response &&
      response.data &&
      typeof response.data.message === "string" &&
      response.data.message
    ) {
      return response.data.message;
    }
    return fallback || "Request failed.";
  }

  _parseUploadJsonResponse(xhr = null) {
    if (!xhr || typeof xhr.response !== "string" || xhr.response.trim() === "") {
      return null;
    }
    try {
      return JSON.parse(xhr.response);
    } catch (e) {
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
    if (
      this.__skeletonUploadNode &&
      this.__skeletonUploadNode !== uploadNode
    ) {
      this._teardownSkeletonUploader();
    }
    uploadField.showSources = false;
    uploadField._canUpload = () => false;
    uploadNode.method = "POST";
    uploadNode.formDataName = "file";
    uploadNode.accept = ".json,application/json";
    uploadNode.withCredentials = true;
    uploadNode.target = this._schemaFileOperationEndpoint();
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
    if (!e || !e.detail || !e.detail.formData) {
      return;
    }
    const formData = e.detail.formData;
    if (typeof formData.delete === "function") {
      formData.delete("schema");
      formData.delete("action");
      formData.delete("jwt");
      formData.delete("token");
    }
    formData.append("schema", "skeleton");
    formData.append("action", "upload");
    const authPayload = this._schemaOperationAuthPayload();
    const authKeys = Object.keys(authPayload);
    for (let i = 0; i < authKeys.length; i++) {
      const key = authKeys[i];
      formData.append(key, authPayload[key]);
    }
    this.statusMessage = "Uploading skeleton…";
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
        ? `Uploaded skeleton: ${machineName}`
        : "Skeleton uploaded.";
      this._clearSkeletonUploaderQueue();
      await this._loadSkeletonOptions(true);
      return;
    }
    this.statusMessage = this._schemaOperationResponseMessage(
      response,
      "Unable to upload skeleton.",
    );
    this._clearSkeletonUploaderQueue();
  }

  _onSkeletonUploadReject(e = null) {
    let message = "Unable to upload skeleton.";
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
    return panel ? panel.label : "Settings";
  }

  _normalizePanelKey(panelKey) {
    if (typeof panelKey !== "string") {
      return "dashboard";
    }
    const normalized = panelKey.trim().toLowerCase();
    if (normalized === "" || normalized === "dashboard") {
      return "dashboard";
    }
    if (this.panelMap && this.panelMap[normalized]) {
      return normalized;
    }
    return "dashboard";
  }

  _loadPanelData(panelKey = "dashboard") {
    const normalized = this._normalizePanelKey(panelKey);
    if (normalized === "skeletons") {
      this._loadSkeletonOptions();
    } else if (normalized === "themes") {
      this._loadThemeOptions();
    } else if (normalized === "integrations") {
      this._loadApiKeysData();
    } else if (normalized === "status") {
      this._loadStatusData();
    }
  }

  setActivePanelFromRoute(panelKey = "dashboard") {
    const normalized = this._normalizePanelKey(panelKey);
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
    const response = await this._callAppEndpointWithData(["saveEnabledBlocks"], {
      enabledBlocks: enabledBlocks,
    });
    return !!(response && response.status === 200);
  }

  _showDashboard(historyMode = "push") {
    this.activePanel = "dashboard";
    this.statusMessage = "";
    this._dispatchPanelChanged("dashboard", historyMode);
  }

  _openPanel(panelKey) {
    const normalized = this._normalizePanelKey(panelKey);
    if (normalized === "dashboard") {
      this._showDashboard();
      return;
    }
    const panel = this._getPanelByKey(normalized);
    if (!panel) {
      this._showDashboard();
      return;
    }
    if (panel.disabled) {
      this.statusMessage = `${panel.label}: Coming soon`;
      return;
    }
    this.activePanel = normalized;
    this.statusMessage = "";
    this._loadPanelData(normalized);
    this._dispatchPanelChanged(normalized, "push");
  }

  _onPanelLauncherClick(panel, e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!panel || panel.disabled) {
      return;
    }
    this._openPanel(panel.key);
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
      e && e.detail && typeof e.detail.value === "string"
        ? e.detail.value
        : "";
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
        enabledThemes: this._selectedOptionMachineNames(values, this.themeOptions),
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
    if (!panelKey || panelKey === "dashboard" || this.panelSaving) {
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
        ? `${savePayload.enabledSkeletons.length} skeleton options saved`
        : "Unable to save skeleton options";
      if (saved) {
        this._reloadAfterOptionSave(panelKey);
      }
    } else if (panelKey === "themes") {
      saved = await this._saveEnabledThemesData(savePayload.enabledThemes);
      this.statusMessage = saved
        ? `${savePayload.enabledThemes.length} theme options saved`
        : "Unable to save theme options";
      if (saved) {
        this._reloadAfterOptionSave(panelKey);
      }
    } else if (panelKey === "custom-code") {
      this.statusMessage = `${this._panelLabel(panelKey)} saved locally`;
    } else if (panelKey === "integrations") {
      saved = await this._saveApiKeysData(savePayload);
      this.statusMessage = saved
        ? `${this._panelLabel(panelKey)} saved`
        : `Unable to save ${this._panelLabel(panelKey).toLowerCase()}`;
    } else {
      this.statusMessage = `${this._panelLabel(
        panelKey,
      )} saved locally (backend wiring pending)`;
    }
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
      ? "Enabled blocks saved"
      : "Unable to save enabled blocks";
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
      globalThis && globalThis.appSettings && typeof globalThis.appSettings === "object"
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
    const settings = this._appSettings();
    for (let i = 0; i < callKeys.length; i++) {
      const callKey = callKeys[i];
      if (
        settings &&
        Object.prototype.hasOwnProperty.call(settings, callKey) &&
        typeof settings[callKey] === "string" &&
        settings[callKey].trim() !== ""
      ) {
        try {
          const response = await api.makeCall(callKey);
          if (response) {
            return response;
          }
        } catch (e) {
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
    const settings = this._appSettings();
    const payload =
      data && typeof data === "object" && !Array.isArray(data) ? data : {};
    for (let i = 0; i < callKeys.length; i++) {
      const callKey = callKeys[i];
      if (
        settings &&
        Object.prototype.hasOwnProperty.call(settings, callKey) &&
        typeof settings[callKey] === "string" &&
        settings[callKey].trim() !== ""
      ) {
        try {
          const response = await api.makeCall(callKey, payload);
          if (response) {
            return response;
          }
        } catch (e) {
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
      if (section && Array.isArray(section.fields) && section.fields.length > 0) {
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
      const packagePath = "../../../../" + normalized;
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
      record && typeof record === "object" && !Array.isArray(record) ? record : {};
    for (let i = 0; i < fields.length; i++) {
      const property = fields[i].property;
      const nextValue = Object.prototype.hasOwnProperty.call(data, property)
        ? data[property]
        : "";
      panelValues[property] = this._normalizeIntegrationValue(nextValue);
    }
    currentValues.integrations = panelValues;
    this.panelValues = currentValues;
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
      values && typeof values === "object" && !Array.isArray(values) ? values : {};
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
      this.apiKeysError = "Saved API keys could not be loaded right now.";
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
    this.apiKeysError = "API key settings could not be saved.";
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
    const response = await this._callAppEndpointWithData(["saveEnabledThemes"], {
      enabledThemes: Array.isArray(enabledThemes) ? enabledThemes : [],
    });
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
    normalized = normalized.replace(/^-+/, "").replace(/-+$/, "");
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
        enabled:
          typeof item.enabled === "boolean" ? item.enabled : true,
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
    let options = [];
    const response = await this._callAppEndpointWithData(
      ["skeletonsList"],
      {
        includeDisabled: true,
      },
    );
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
    const settings = this._appSettings();
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
    if (options.length === 0 && settings && settings.themes) {
      options = this._normalizeThemeOptions(settings.themes);
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
        title: "Programming language runtime",
        value: summary.programmingLanguage,
      },
      {
        key: "server",
        tone: "ok",
        title: "Server version",
        value: summary.serverVersion,
      },
      {
        key: "storage",
        tone: "ok",
        title: "File system access",
        value: "Writable",
      },
      {
        key: "jobs",
        tone: "info",
        title: "Background jobs",
        value: "Enabled",
      },
      {
        key: "tls",
        tone: "ok",
        title: "TLS certificate",
        value: "Valid",
      },
    ];
    return this._ensureVersionStatusRow(
      rows,
      summary,
      "HAXcms version",
      "Compare installed HAXcms version with latest available release.",
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
      const title = row.title || row.label || row.key || "Status";
      const value =
        typeof row.value === "undefined" || row.value === null ? "" : row.value;
      const description = row.description || row.details || "";
      normalizedRows.push({
        key: row.key || this._normalizeMachineName(`${title}`),
        tone: tone,
        title: `${title}`,
        value: `${value}`,
        description: `${description || ""}`,
      });
    }
    return normalizedRows;
  }

  _ensureVersionStatusRow(
    rows,
    summary,
    title = "HAXcms version",
    description = "",
  ) {
    const compare = this._compareVersion(
      summary.haxcmsVersionCurrent,
      summary.haxcmsVersionLatest,
    );
    const versionTone = compare < 0 ? "warning" : "ok";
    const versionValue = summary.haxcmsVersionCurrent
      ? `${summary.haxcmsVersionCurrent} (${compare < 0 ? "update available" : "up to date"})`
      : "Unknown";
    const versionDescription =
      compare < 0
        ? `Current: ${summary.haxcmsVersionCurrent || "unknown"} · Latest: ${summary.haxcmsVersionLatest || "unknown"}`
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
    const response = await this._callAppEndpoint([
      "systemStatus",
      "status",
      "connectionSettings",
    ]);
    if (response && response.data && typeof response.data === "object") {
      const source = response.data;
      const summary = this._normalizeStatusSummary(
        source.summary ? source.summary : source,
        fallbackPayload.summary,
      );
      const rowsSource = source.rows && Array.isArray(source.rows) ? source.rows : [];
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
            title: "Programming language runtime",
            value: summary.programmingLanguage || "",
          },
          {
            key: "server",
            tone: "ok",
            title: "Server version",
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
      return "OK";
    }
    if (tone === "warning") {
      return "Warning";
    }
    if (tone === "error") {
      return "Error";
    }
    return "Info";
  }

  _statusSummaryValue(key) {
    if (!this.statusSummary || typeof this.statusSummary !== "object") {
      return "Unknown";
    }
    const value = this.statusSummary[key];
    if (typeof value === "undefined" || value === null || `${value}`.trim() === "") {
      return "Unknown";
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

  _renderPanelLauncher(panel, size = "primary") {
    if (!panel) {
      return "";
    }
    return html`
      <button
        type="button"
        class="launcher ${size} ${panel.disabled ? "disabled" : ""}"
        ?disabled="${panel.disabled ? true : false}"
        @click="${(e) => this._onPanelLauncherClick(panel, e)}"
        aria-label="${panel.label}"
        title="${panel.description}"
      >
        <simple-icon-lite icon="${panel.icon}" aria-hidden="true"></simple-icon-lite>
        <span class="label">${panel.label}</span>
        <span class="description">${panel.description}</span>
        ${panel.disabled
          ? html`<span class="coming-soon-chip">Coming soon</span>`
          : ""}
      </button>
    `;
  }

  _renderDashboard() {
    const firstRowOrder = ["status", "skeletons", "themes", "blocks"];
    const secondRowOrder = [
      "integrations",
      "media",
      "style-guide",
      "custom-code",
    ];
    return html`
      <div class="dashboard-shell">
        <div class="dashboard-scroll">
          <div class="dashboard-header">
            <h2>System settings</h2>
            <p>
              System-level controls for runtime status, skeletons, themes,
              allowed blocks, integrations, media defaults, and global custom
              code.
            </p>
          </div>
          <div class="primary-grid">
            ${firstRowOrder.map((panelKey) =>
              this._renderPanelLauncher(this._getPanelByKey(panelKey), "primary"),
            )}
          </div>
          <div class="advanced-grid">
            ${secondRowOrder.map((panelKey) =>
              this._renderPanelLauncher(this._getPanelByKey(panelKey), "primary"),
            )}
          </div>
        </div>
      </div>
    `;
  }

  _renderPanelSection(panelKey, section) {
    return html`
      <section class="section">
        <div class="section-title">
          <span class="section-leading">
            <simple-icon-lite icon="${section.icon}" aria-hidden="true"></simple-icon-lite>
            <h3>${section.label}</h3>
          </span>
        </div>
        <div class="section-body">
          <p class="section-description">${section.description}</p>
          <simple-fields
            .fields="${section.fields}"
            .value="${this._getPanelValue(panelKey)}"
            .schematizer="${HaxSchematizer}"
            .elementizer="${HaxElementizer}"
            @value-changed="${(e) => this._onPanelValueChanged(panelKey, e)}"
          ></simple-fields>
        </div>
      </section>
    `;
  }

  _renderSkeletonsPanel() {
    const options = Array.isArray(this.skeletonOptions)
      ? this.skeletonOptions
      : [];
    return html`
      <section class="section">
        <div class="section-body">
          ${this.loadingSkeletons
            ? html`<p class="helper">Loading skeleton options…</p>`
            : ""}
          <div class="skeleton-upload-wrap">
            <p class="helper">
              Drag and drop a skeleton JSON file to add it to user skeletons.
            </p>
            ${this._hasSchemaFileOperationEndpoint()
              ? html`
                  <hax-upload-field
                    id="skeleton-upload-field"
                    hide-source-selector
                    hide-input
                    no-camera
                    no-voice-record
                    no-screen-record
                  ></hax-upload-field>
                `
              : html`
                  <p class="empty-state">
                    Upload endpoint unavailable for this backend.
                  </p>
                `}
          </div>
          ${options.length > 0
            ? html`
                <div class="settings-option-table-wrap">
                  <table class="settings-option-table">
                    <thead>
                      <tr>
                        <th class="select-col">Enabled</th>
                        <th>Skeleton</th>
                        <th class="actions-col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${options.map((option, index) =>
                        this._renderSkeletonOptionRow(option, index),
                      )}
                    </tbody>
                  </table>
                </div>
              `
            : html`<p class="empty-state">No skeleton options were returned.</p>`}
        </div>
      </section>
    `;
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
    return this._isUserSkeletonOption(option) && this._hasSchemaFileOperationEndpoint();
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
    if (!option || !option.machineName || this._isSkeletonActionDisabled(option)) {
      return;
    }
    if (!globalThis || typeof globalThis.prompt !== "function") {
      this.statusMessage = "Rename prompt is unavailable.";
      return;
    }
    const currentName = this._normalizeMachineName(option.machineName);
    const requestedName = globalThis.prompt(
      "Rename skeleton machine name",
      currentName,
    );
    if (typeof requestedName !== "string") {
      return;
    }
    const nextName = this._normalizeMachineName(requestedName);
    if (!nextName) {
      this.statusMessage = "Skeleton name is required.";
      return;
    }
    if (nextName === currentName) {
      return;
    }
    this.skeletonActionBusy = true;
    try {
      const response = await this._schemaFileOperationJson({
        action: "rename",
        schema: "skeleton",
        name: currentName,
        newName: nextName,
      });
      if (response.ok) {
        this.statusMessage = `Renamed skeleton to ${nextName}.`;
        await this._loadSkeletonOptions(true);
      } else {
        this.statusMessage = this._schemaOperationResponseMessage(
          response.data,
          response.message || "Unable to rename skeleton.",
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
    if (!option || !option.machineName || this._isSkeletonActionDisabled(option)) {
      return;
    }
    if (!globalThis || typeof globalThis.confirm !== "function") {
      this.statusMessage = "Delete confirmation is unavailable.";
      return;
    }
    const machineName = this._normalizeMachineName(option.machineName);
    const shouldDelete = globalThis.confirm(
      `Delete skeleton "${machineName}"? This cannot be undone.`,
    );
    if (!shouldDelete) {
      return;
    }
    this.skeletonActionBusy = true;
    try {
      const response = await this._schemaFileOperationJson({
        action: "delete",
        schema: "skeleton",
        name: machineName,
      });
      if (response.ok) {
        this.statusMessage = `Deleted skeleton ${machineName}.`;
        await this._loadSkeletonOptions(true);
      } else {
        this.statusMessage = this._schemaOperationResponseMessage(
          response.data,
          response.message || "Unable to delete skeleton.",
        );
      }
    } finally {
      this.skeletonActionBusy = false;
    }
  }

  _renderSkeletonOptionRow(option, index = 0) {
    const checked = this._isSkeletonOptionChecked(option);
    const inputId = `skeleton-option-${index}-${option.machineName}`;
    const rowClass = checked
      ? "settings-option-row enabled"
      : "settings-option-row disabled";
    const canMutate = this._canMutateSkeletonOption(option);
    const actionDisabled = this._isSkeletonActionDisabled(option);
    return html`
      <tr class="${rowClass}">
        <td class="select-col">
          <input
            id="${inputId}"
            type="checkbox"
            .checked=${checked}
            @change=${(e) => this._onSkeletonOptionChanged(option, e)}
          />
        </td>
        <td>
          <label class="settings-option-title" for="${inputId}">
            <span>${option.label}</span>
          </label>
          ${option.description
            ? html`<p class="settings-option-description">${option.description}</p>`
            : ""}
        </td>
        <td class="actions-col">
          ${canMutate
            ? html`
                <div class="skeleton-actions">
                  <simple-icon-button-lite
                    class="skeleton-action-button"
                    icon="icons:create"
                    label="Rename skeleton ${option.machineName}"
                    ?disabled="${actionDisabled}"
                    @click="${(e) => this._renameSkeletonOption(option, e)}"
                  ></simple-icon-button-lite>
                  <simple-icon-button-lite
                    class="skeleton-action-button"
                    icon="delete"
                    label="Delete skeleton ${option.machineName}"
                    ?disabled="${actionDisabled}"
                    @click="${(e) => this._deleteSkeletonOption(option, e)}"
                  ></simple-icon-button-lite>
                </div>
              `
            : html`<span class="helper">—</span>`}
        </td>
      </tr>
    `;
  }

  _renderThemesPanel() {
    const options = Array.isArray(this.themeOptions) ? this.themeOptions : [];
    return html`
      <section class="section">
        <div class="section-body">
          ${this.loadingThemes ? html`<p class="helper">Loading theme options…</p>` : ""}
          ${options.length > 0
            ? html`
                <div class="settings-option-table-wrap">
                  <table class="settings-option-table">
                    <thead>
                      <tr>
                        <th class="select-col">Enabled</th>
                        <th class="preview-col">Preview</th>
                        <th>Theme</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${options.map((option, index) =>
                        this._renderThemeOptionRow(option, index),
                      )}
                    </tbody>
                  </table>
                </div>
              `
            : html`<p class="empty-state">No theme options were returned.</p>`}
        </div>
      </section>
    `;
  }
  _isThemeOptionChecked(option = null) {
    if (!option || !option.property) {
      return false;
    }
    const values = this._getPanelValue("themes");
    if (values && Object.prototype.hasOwnProperty.call(values, option.property)) {
      return values[option.property] !== false;
    }
    return typeof option.enabled === "boolean" ? option.enabled : true;
  }
  _onThemeOptionChanged(option = null, e = null) {
    if (!option || !option.property || !e || !e.currentTarget) {
      return;
    }
    this._setPanelPropertyValue("themes", option.property, !!e.currentTarget.checked);
  }
  _renderThemeOptionRow(option, index = 0) {
    const checked = this._isThemeOptionChecked(option);
    const inputId = `theme-option-${index}-${option.machineName}`;
    const rowClass = checked
      ? "settings-option-row enabled"
      : "settings-option-row disabled";
    return html`
      <tr class="${rowClass}">
        <td class="select-col">
          <input
            id="${inputId}"
            type="checkbox"
            .checked=${checked}
            @change=${(e) => this._onThemeOptionChanged(option, e)}
          />
        </td>
        <td class="preview-col">
          <div class="settings-theme-preview">
            ${option.screenshot
              ? html`
                  <img
                    src="${option.screenshot}"
                    alt="Preview of ${option.label} theme"
                    loading="lazy"
                    decoding="async"
                  />
                `
              : html`
                  <span class="settings-theme-preview-fallback"
                    >No preview</span
                  >
                `}
          </div>
        </td>
        <td>
          <label class="settings-option-title" for="${inputId}">
            <span>${option.label}</span>
          </label>
          ${option.description
            ? html`<p class="settings-option-description">${option.description}</p>`
            : ""}
        </td>
      </tr>
    `;
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

  _renderStatusSummaryCards() {
    return html`
      <div class="status-summary-grid">
        <div class="status-summary">
          <span class="label">Programming language</span>
          <span class="value">${this._statusSummaryValue("programmingLanguage")}</span>
        </div>
        <div class="status-summary">
          <span class="label">Server version</span>
          <span class="value">${this._statusSummaryValue("serverVersion")}</span>
        </div>
        <div class="status-summary">
          <span class="label">HAXcms current</span>
          <span class="value">${this._statusSummaryValue("haxcmsVersionCurrent")}</span>
        </div>
        <div class="status-summary">
          <span class="label">HAXcms latest</span>
          <span class="value">${this._statusSummaryValue("haxcmsVersionLatest")}</span>
        </div>
      </div>
    `;
  }

  _renderStatusPanel() {
    const rows = Array.isArray(this.statusRows) ? this.statusRows : [];
    return html`
      <section class="section">
        <div class="section-body">
          ${this.statusLoading ? html`<p class="helper">Loading status report…</p>` : ""}
          ${this.statusError
            ? html`<p class="status-message error">${this.statusError}</p>`
            : ""}
          ${this._renderStatusSummaryCards()}
          <div class="status-table-wrap">
            <table class="system-status-report">
              <tbody>
                ${rows.map(
                  (row) => html`
                    <tr class="status-row ${row.tone}">
                      <td class="status-icon">
                        <span class="status-icon-marker" aria-hidden="true"></span>
                        <span class="sr-only">${this._statusToneLabel(row.tone)}</span>
                      </td>
                      <td class="status-title">${row.title}</td>
                      <td class="status-value">${row.value || "—"}</td>
                    </tr>
                    ${row.description
                      ? html`
                          <tr class="status-row ${row.tone}">
                            <td colspan="3" class="status-description">
                              ${this._renderStatusDescription(row.description)}
                            </td>
                          </tr>
                        `
                      : ""}
                  `,
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    `;
  }

  _renderBlocksPanel() {
    return html`
      <section class="section">
        <div class="section-body">
          <haxcms-system-allowed-blocks
            @haxcms-save-allowed-blocks="${this._onAllowedBlocksSaved}"
            @simple-modal-hide="${this._onNestedModalHide}"
          ></haxcms-system-allowed-blocks>
        </div>
      </section>
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
      <section class="section">
        <div class="section-body">
          <div class="code-editor-grid">
            <div class="code-editor-wrapper">
              <code-editor
                title="Global CSS"
                language="css"
                theme="auto"
                .editorValue="${cssValue}"
                @value-changed="${(e) =>
                  this._onCodeEditorValueChanged("custom-code", "globalCss", e)}"
              ></code-editor>
            </div>
            <div class="code-editor-wrapper">
              <code-editor
                title="Global JavaScript"
                language="javascript"
                theme="auto"
                .editorValue="${jsValue}"
                @value-changed="${(e) =>
                  this._onCodeEditorValueChanged("custom-code", "globalJs", e)}"
              ></code-editor>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  _renderStyleGuidePanel() {
    return html`
      <div class="style-guide-disabled">
        <h3>Style guide</h3>
        <p>Coming soon</p>
        <p>
          Style guide controls are intentionally disabled in this release while
          backend integration is completed.
        </p>
        <button type="button" disabled>Coming soon</button>
      </div>
    `;
  }

  _renderIntegrationsPanel() {
    const fields = this._integrationFields();
    return html`
      <section class="section">
        <div class="section-body">
          ${this.apiKeysLoading ? html`<p class="helper">Loading saved API keys…</p>` : ""}
          ${this.apiKeysError
            ? html`<p class="status-message error">${this.apiKeysError}</p>`
            : ""}
          ${fields.length === 0
            ? html`<p class="empty-state">No integration providers are configured.</p>`
            : html`
                <div class="api-key-list">
                  ${fields.map(
                    (field) => html`
                      <div class="api-key-row">
                        <div class="api-key-row-header">
                          <label
                            class="api-key-label"
                            for="${this._integrationInputId(field.property)}"
                          >
                            ${field.providerLabel || field.title || field.property}
                          </label>
                          ${field.helpUrl
                            ? html`
                                <a
                                  class="api-key-link"
                                  href="${field.helpUrl}"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Get API key
                                </a>
                              `
                            : ""}
                        </div>
                        <div class="api-key-input-wrap">
                          <input
                            id="${this._integrationInputId(field.property)}"
                            class="api-key-input"
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
                          <simple-icon-button-lite
                            class="api-key-toggle"
                            icon="${this._isApiKeyVisible(field.property)
                              ? "icons:visibility-off"
                              : "icons:visibility"}"
                            label="${this._isApiKeyVisible(field.property)
                              ? "Hide API key value"
                              : "Show API key value"}"
                            @click="${(e) =>
                              this._toggleApiKeyVisibility(field.property, e)}"
                          ></simple-icon-button-lite>
                        </div>
                      </div>
                    `,
                  )}
                </div>
              `}
        </div>
      </section>
    `;
  }

  _renderActivePanelContent(panel) {
    if (!panel) {
      return "";
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
    if (panel.sections && panel.sections.length > 0) {
      return panel.sections.map((section) =>
        this._renderPanelSection(panel.key, section),
      );
    }
    return html`<p class="empty-state">No settings available for this panel yet.</p>`;
  }

  _renderActivePanel(panel) {
    return html`
      <div class="panel-shell">
        <div class="panel-header">
          <div class="panel-title-wrap">
            <h2>
              <simple-icon-lite icon="${panel.icon}" aria-hidden="true"></simple-icon-lite>
              ${panel.label}
            </h2>
            <p>${panel.intro}</p>
          </div>
        </div>
        <div class="panel-scroll">
          ${this._renderActivePanelContent(panel)}
          ${this.statusMessage
            ? html`<p class="status-message">${this.statusMessage}</p>`
            : ""}
        </div>
        ${this._showPanelSaveAction(panel)
          ? html`
              <div class="actions">
                <button
                  type="button"
                  class="action primary"
                  ?disabled="${this.panelSaving}"
                  @click="${this._saveActivePanel}"
                >
                  ${this.panelSaving ? "Saving…" : "Save"}
                </button>
              </div>
            `
          : ""}
      </div>
    `;
  }

  render() {
    if (!this.activePanel || this.activePanel === "dashboard") {
      return this._renderDashboard();
    }
    const panel = this._getPanelByKey(this.activePanel);
    if (!panel) {
      return this._renderDashboard();
    }
    return this._renderActivePanel(panel);
  }
}

globalThis.customElements.define(
  HAXCMSSystemSettings.tag,
  HAXCMSSystemSettings,
);

export { HAXCMSSystemSettings };