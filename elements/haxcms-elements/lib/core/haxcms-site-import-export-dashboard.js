import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import {
  IMPORT_WORKFLOWS,
  PAGE_EXPORT_FORMATS,
  SITE_EXPORT_FORMATS,
} from "./utils/import-export-options.js";

class HAXCMSSiteImportExportDashboard extends DDD {
  static get tag() {
    return "haxcms-site-import-export-dashboard";
  }

  static get properties() {
    return {
      allowImportFiles: { type: Boolean, attribute: "allow-import-files" },
      allowImportLinks: { type: Boolean, attribute: "allow-import-links" },
      allowPageExport: { type: Boolean, attribute: "allow-page-export" },
      allowSiteExport: { type: Boolean, attribute: "allow-site-export" },
    };
  }

  constructor() {
    super();
    this.allowImportFiles = true;
    this.allowImportLinks = true;
    this.allowPageExport = true;
    this.allowSiteExport = true;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          padding: var(--ddd-spacing-6);
        }
        .dashboard-shell {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-6);
        }
        .section-title {
          margin: 0;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-m);
          font-weight: var(--ddd-font-weight-bold);
        }
        .section-description {
          margin: var(--ddd-spacing-2) 0 0 0;
          font-size: var(--ddd-font-size-4xs);
        }
        .action-grid {
          display: grid;
          gap: var(--ddd-spacing-3);
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: var(--ddd-spacing-4);
        }
        @media (max-width: 900px) {
          .action-grid {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
        }
        .action-button {
          width: 100%;
          border-radius: var(--ddd-radius-sm);
          border: 2px solid light-dark(black, white);
          background: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-black)
          );
          font-family: var(--ddd-font-primary);
          cursor: pointer;
          padding: var(--ddd-spacing-3);
          text-align: left;
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: start;
          gap: var(--ddd-spacing-3);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }
        .action-button:hover,
        .action-button:focus-visible {
          border-color: var(--ddd-theme-default-skyBlue);
          box-shadow: var(--ddd-boxShadow-sm);
          transform: translateY(-2px);
          outline: none;
          color: var(--ddd-theme-default-skyBlue);
        }
        .action-button:disabled {
          cursor: not-allowed;
          opacity: 0.55;
          transform: none;
          box-shadow: none;
        }
        .action-button:disabled:hover,
        .action-button:disabled:focus-visible {
          border-color: var(--ddd-theme-default-limestoneGray);
          box-shadow: none;
          transform: none;
          color: inherit;
        }
        .action-button simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-xs, 40px);
          --simple-icon-height: var(--ddd-icon-xs, 40px);
          --simple-icon-color: currentColor;
          margin-top: var(--ddd-spacing-1);
        }
        .action-title {
          display: block;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-3xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: 1.2;
        }
        .action-description {
          display: block;
          margin-top: var(--ddd-spacing-1);
          font-size: var(--ddd-font-size-4xs);
          line-height: 1.35;
        }
      `,
    ];
  }

  _isActionDisabled(item) {
    if (!item || !item.action) {
      return true;
    }
    switch (item.action) {
      case "import-file":
        return !this.allowImportFiles;
      case "import-link":
        return !this.allowImportLinks;
      case "export-page":
        return !this.allowPageExport;
      case "export-site":
        return !this.allowSiteExport;
      default:
        return false;
    }
  }

  _actionDisabledTooltip(item) {
    return this._isActionDisabled(item) ? "Disabled in Features" : "";
  }

  _emitAction(item) {
    if (!item || this._isActionDisabled(item)) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent("haxcms-site-import-export-action", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: {
          action: item.action,
          format: item.format || "",
        },
      }),
    );
  }

  _renderAction(item) {
    if (!item) {
      return "";
    }
    return html`
      <button
        type="button"
        class="action-button"
        title="${this._actionDisabledTooltip(item)}"
        aria-label="${item.title}"
        ?disabled="${this._isActionDisabled(item)}"
        @click="${() => this._emitAction(item)}"
      >
        <simple-icon-lite
          icon="${item.icon}"
          aria-hidden="true"
        ></simple-icon-lite>
        <span>
          <span class="action-title">${item.title}</span>
          <span class="action-description">${item.description}</span>
        </span>
      </button>
    `;
  }

  render() {
    const pageExportActions = PAGE_EXPORT_FORMATS.filter(
      (item) => item && item.developerOnly !== true,
    ).map((item) =>
      Object.assign({}, item, {
        action: "export-page",
      }),
    );
    const siteExportActions = SITE_EXPORT_FORMATS.map((item) =>
      Object.assign({}, item, {
        action: "export-site",
      }),
    );
    return html`
      <div class="dashboard-shell">
        <section>
          <h3 class="section-title">Import</h3>
          <p class="section-description">
            Bring external files or links into your site.
          </p>
          <div class="action-grid">
            ${IMPORT_WORKFLOWS.map((item) => this._renderAction(item))}
          </div>
        </section>
        <section>
          <h3 class="section-title">Export this page</h3>
          <p class="section-description">
            Download or copy the current page in multiple formats.
          </p>
          <div class="action-grid">
            ${pageExportActions.map((item) => this._renderAction(item))}
          </div>
        </section>
        <section>
          <h3 class="section-title">Export this site</h3>
          <p class="section-description">
            Download the full site in publication-ready or portable formats.
          </p>
          <div class="action-grid">
            ${siteExportActions.map((item) => this._renderAction(item))}
          </div>
        </section>
      </div>
    `;
  }
}

globalThis.customElements.define(
  HAXCMSSiteImportExportDashboard.tag,
  HAXCMSSiteImportExportDashboard,
);

export { HAXCMSSiteImportExportDashboard };
