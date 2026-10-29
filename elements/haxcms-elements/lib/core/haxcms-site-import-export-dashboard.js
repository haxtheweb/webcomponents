import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import {
  HaxUiAdminTokens,
  HaxUiAdminPrimitives,
} from "@haxtheweb/hax-body/lib/hax-ui-styles.js";
import {
  IMPORT_WORKFLOWS,
  PAGE_EXPORT_FORMATS,
  SITE_EXPORT_FORMATS,
} from "./utils/import-export-options.js";

/**
 * `haxcms-site-import-export-dashboard`
 * The Import / Export admin section. Footer "none" in the one admin dialog
 * (haxcms-site-admin): every tile fires
 * `haxcms-site-import-export-action` with `{ action, format }` and the
 * editor runs it. It has no page title of its own, so the shell header is
 * the only one.
 *
 * @fires haxcms-site-import-export-action - detail `{ action, format }`
 */
class HAXCMSSiteImportExportDashboard extends I18NMixin(DDD) {
  static get tag() {
    return "haxcms-site-import-export-dashboard";
  }

  static get properties() {
    return {
      allowImportFiles: { type: Boolean, attribute: "allow-import-files" },
      allowImportLinks: { type: Boolean, attribute: "allow-import-links" },
      allowPageExport: { type: Boolean, attribute: "allow-page-export" },
      allowSiteExport: { type: Boolean, attribute: "allow-site-export" },
      /** set by haxcms-site-admin before the section connects */
      inShell: { type: Boolean, attribute: "in-shell", reflect: true },
    };
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      disabledInFeatures: "Disabled in Features",
      import: "Import",
      importDescription: "Bring external files or links into your site.",
      exportThisPage: "Export this page",
      exportThisPageDescription:
        "Download or copy the current page in multiple formats.",
      exportThisSite: "Export this site",
      exportThisSiteDescription:
        "Download the full site in publication-ready or portable formats.",
      importFileTitle: "Import from file",
      importFileDescription:
        "Pick a local file, then choose how to apply it to content or site structure.",
      importLinkTitle: "Import from URL",
      importLinkDescription:
        "Paste a URL and choose how to embed it, link it, or transform it in content.",
      exportPageHtmlTitle: "Export as HTML",
      exportPageHtmlDescription: "Download current page as HTML file",
      exportPageMarkdownTitle: "Export as Markdown",
      exportPageMarkdownDescription:
        "Download current page as Markdown (.md) file",
      exportPageJsonTitle: "Export as JSON",
      exportPageJsonDescription: "Download current page as JSON",
      exportPageYamlTitle: "Export as YAML",
      exportPageYamlDescription: "Download current page as YAML",
      exportPageXmlTitle: "Export as XML",
      exportPageXmlDescription: "Download current page as XML",
      exportPageDocxTitle: "Export as DOCX",
      exportPageDocxDescription: "Download current page as Word document",
      exportPagePdfTitle: "Export as PDF",
      exportPagePdfDescription: "Download current page as PDF file",
      exportPageEpubTitle: "Export as EPUB",
      exportPageEpubDescription: "Download current page as an EPUB book",
      exportSiteArchiveTitle: "Download site archive",
      exportSiteArchiveDescription: "Download the complete site as a ZIP file",
      exportSiteHtmlTitle: "Export site as HTML",
      exportSiteHtmlDescription:
        "Download the entire site as a single HTML document",
      exportSiteMarkdownTitle: "Export site as Markdown",
      exportSiteMarkdownDescription: "Download the entire site as Markdown",
      exportSiteDocxTitle: "Export site as DOCX",
      exportSiteDocxDescription: "Download the entire site as a Word document",
      exportSitePdfTitle: "Export site as PDF",
      exportSitePdfDescription: "Download the entire site as a PDF document",
      exportSiteEpubTitle: "Export site as EPUB",
      exportSiteEpubDescription: "Download the site as an EPUB book",
      exportSiteSkeletonTitle: "Export site skeleton",
      exportSiteSkeletonDescription:
        "Export a reusable site template for creating similar sites",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../locales/", import.meta.url).href,
    });
    this.allowImportFiles = true;
    this.allowImportLinks = true;
    this.allowPageExport = true;
    this.allowSiteExport = true;
    this.inShell = false;
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
          padding: var(--ddd-spacing-4, 16px) var(--ddd-spacing-5, 20px)
            var(--ddd-spacing-6, 24px);
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
        .dashboard-shell {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-5, 20px);
        }
        section {
          margin: 0;
        }
        .section-title {
          margin: 0;
          font-family: inherit;
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-bold, 700);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--hax-ui-text-muted);
        }
        .section-description {
          margin: 2px 0 0;
          font-size: 13px;
          color: var(--hax-ui-text-muted);
        }
        .action-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: var(--hax-ui-gap-md);
          margin-top: var(--hax-ui-gap-lg);
        }
        .action-button {
          all: unset;
          box-sizing: border-box;
          display: grid;
          grid-template-columns: var(--hax-ui-row-height) minmax(0, 1fr);
          gap: var(--hax-ui-gap-lg);
          align-items: center;
          width: 100%;
          min-height: calc(
            var(--hax-ui-row-height) + var(--ddd-spacing-4, 16px)
          );
          padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius);
          font-family: inherit;
          font-size: var(--hax-ui-admin-font-size);
          text-align: left;
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
          cursor: pointer;
          transition:
            background-color var(--hax-ui-duration) var(--hax-ui-easing),
            border-color var(--hax-ui-duration) var(--hax-ui-easing);
        }
        .action-button:hover {
          border-color: var(--hax-ui-line-strong);
          background-color: var(--hax-ui-hover);
        }
        .action-button:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .action-button:disabled {
          cursor: not-allowed;
          opacity: 0.55;
        }
        .action-button:disabled:hover {
          border-color: var(--hax-ui-line);
          background-color: var(--hax-ui-surface);
        }
        .action-icon {
          display: grid;
          place-items: center;
          width: var(--hax-ui-row-height);
          height: var(--hax-ui-row-height);
          border-radius: var(--hax-ui-radius);
          color: var(--hax-ui-accent-strong);
          background-color: var(--hax-ui-accent-soft);
        }
        .action-icon simple-icon-lite {
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
          --simple-icon-color: currentColor;
        }
        .action-title {
          display: block;
          font-weight: var(--ddd-font-weight-bold, 700);
          line-height: 1.25;
        }
        .action-description {
          display: block;
          margin-top: 2px;
          font-size: var(--hax-ui-admin-font-size-xs);
          line-height: 1.35;
          color: var(--hax-ui-text-muted);
        }
        .action-disabled {
          display: block;
          margin-top: 2px;
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
        }
        @media (max-width: 900px) {
          :host {
            padding: var(--hax-ui-gap-lg) var(--ddd-spacing-4, 16px);
          }
          .action-grid {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .action-button {
            transition: none;
          }
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

  // translate shared option metadata, falling back to its English text
  _actionText(item, field) {
    const suffix = field === "description" ? "Description" : "Title";
    return (item.tKey && this.t[`${item.tKey}${suffix}`]) || item[field];
  }

  _actionDisabledTooltip(item) {
    return this._isActionDisabled(item) ? this.t.disabledInFeatures : "";
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
        aria-label="${this._actionText(item, "title")}"
        ?disabled="${this._isActionDisabled(item)}"
        @click="${() => this._emitAction(item)}"
      >
        <span class="action-icon"
          ><simple-icon-lite
            icon="${item.icon}"
            aria-hidden="true"
          ></simple-icon-lite
        ></span>
        <span>
          <span class="action-title">${this._actionText(item, "title")}</span>
          <span class="action-description"
            >${this._actionText(item, "description")}</span
          >
          ${this._isActionDisabled(item)
            ? html`<span class="action-disabled"
                >${this.t.disabledInFeatures}</span
              >`
            : ""}
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
          <h3 class="section-title">${this.t.import}</h3>
          <p class="section-description">${this.t.importDescription}</p>
          <div class="action-grid">
            ${IMPORT_WORKFLOWS.map((item) => this._renderAction(item))}
          </div>
        </section>
        <section>
          <h3 class="section-title">${this.t.exportThisPage}</h3>
          <p class="section-description">${this.t.exportThisPageDescription}</p>
          <div class="action-grid">
            ${pageExportActions.map((item) => this._renderAction(item))}
          </div>
        </section>
        <section>
          <h3 class="section-title">${this.t.exportThisSite}</h3>
          <p class="section-description">${this.t.exportThisSiteDescription}</p>
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
