/**
 * Copyright 2025 The HAX team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";

/**
 * Site Available Themes
 * Displays available HAXcms themes in a gallery or table format for documentation purposes
 * Includes dynamic theme switching capabilities for live preview
 *
 * @element site-available-themes
 */
export class SiteAvailableThemes extends I18NMixin(DDD) {
  static get tag() {
    return "site-available-themes";
  }

  constructor() {
    super();
    this.themes = [];
    this.loading = true;
    this.error = null;
    this.viewMode = "gallery"; // gallery or table
    this.showDetails = true;
    this.showAllThemes = false;
    this.columns = 3;
    this.currentTheme = "";
    this.t = this.t || {};

    this.registerLocalization({
      context: this,
      localesPath:
        new URL(
          "../../../../../../locales/site-available-themes/",
          import.meta.url,
        ).href + "/",
      locales: ["en"],
    });
  }

  static get properties() {
    return {
      ...super.properties,
      themes: { type: Array },
      loading: { type: Boolean },
      error: { type: String },
      viewMode: { type: String, attribute: "view-mode" },
      showDetails: { type: Boolean, attribute: "show-details" },
      showAllThemes: { type: Boolean, attribute: "show-all-themes" },
      columns: { type: Number },
      currentTheme: { type: String, attribute: "current-theme" },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          --theme-gallery-gap: var(--ddd-spacing-4);
          --theme-gallery-border-radius: var(--ddd-radius-xs);
          --theme-gallery-border: var(--ddd-border-xs);
          --theme-card-width: 180px;
          --theme-card-height: 300px;
          --theme-card-preview-height: 240px;
        }
        .toggle-button simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }

        .loading,
        .error {
          text-align: center;
          padding: var(--ddd-spacing-8);
          color: var(--ddd-theme-default-coalyGray);
        }

        .error {
          color: var(--ddd-theme-default-original87Pink);
          background: var(--ddd-theme-default-opportunityGreen);
          border-radius: var(--theme-gallery-border-radius);
          padding: var(--ddd-spacing-4);
        }

        .gallery-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--ddd-spacing-4);
          padding: var(--ddd-spacing-2) 0;
          border-bottom: var(--theme-gallery-border);
        }

        .gallery-title {
          margin: 0;
          color: var(--ddd-theme-default-coalyGray);
          font-size: var(--ddd-font-size-s);
          font-family: var(--ddd-font-navigation);
        }

        .view-toggle {
          display: flex;
          gap: var(--ddd-spacing-2);
        }

        .toggle-button {
          background: var(--ddd-theme-default-white);
          border: var(--theme-gallery-border);
          border-radius: var(--theme-gallery-border-radius);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          font-size: var(--ddd-font-size-4xs);
          font-family: var(--ddd-font-navigation);
        }

        .toggle-button:hover,
        .toggle-button.active {
          background: var(--ddd-theme-default-skyBlue);
          color: var(--ddd-theme-default-white);
        }

        .theme-count {
          color: var(--ddd-theme-default-coalyGray);
          font-size: var(--ddd-font-size-4xs);
        }

        /* Gallery View */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(var(--columns, 3), 1fr);
          gap: var(--theme-gallery-gap);
        }

        .theme-card {
          border: var(--theme-gallery-border);
          border-radius: var(--theme-gallery-border-radius);
          overflow: hidden;
          background: var(--ddd-theme-default-white);
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
          position: relative;
          width: 100%;
          max-width: var(--theme-card-width);
          min-height: var(--theme-card-height);
          margin: 0 auto;
        }

        .theme-thumbnail img {
          width: 85%;
          height: 85%;
          object-fit: cover;
          object-position: left;
          display: block;
        }

        .theme-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--ddd-boxShadow-md);
          border-color: var(--ddd-theme-default-beaverBlue);
        }

        .theme-card.current {
          border-color: var(--ddd-theme-default-skyBlue);
          border-width: 2px;
        }

        .theme-thumbnail {
          width: 100%;
          height: var(--theme-card-preview-height);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: var(--theme-gallery-border);
          background: var(--ddd-theme-default-white);
        }

        .current-badge {
          position: absolute;
          top: var(--ddd-spacing-2);
          right: var(--ddd-spacing-2);
          background: var(--ddd-theme-default-keystoneYellow);
          color: var(--ddd-theme-default-coalyGray);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-xs);
          font-size: var(--ddd-font-size-5xs);
          font-family: var(--ddd-font-navigation);
          z-index: 1;
        }

        .theme-info {
          padding: var(--ddd-spacing-2);
        }

        .theme-name {
          font-weight: var(--ddd-font-weight-medium);
          color: var(--ddd-theme-default-coalyGray);
          margin: 0 0 var(--ddd-spacing-1) 0;
          font-size: var(--ddd-font-size-4xs);
          font-family: var(--ddd-font-navigation);
        }

        .theme-description {
          font-size: var(--ddd-font-size-5xs);
          color: var(--ddd-theme-default-slateGray);
          margin: 0 0 var(--ddd-spacing-1) 0;
        }

        .theme-element {
          font-size: var(--ddd-font-size-5xs);
          color: var(--ddd-theme-default-limestoneGray);
          font-family: var(--ddd-font-navigation);
          margin-bottom: var(--ddd-spacing-1);
        }

        .preview-button {
          background: var(--ddd-theme-default-link);
          color: var(--ddd-theme-default-white);
          border: var(--ddd-border-xs);
          border-color: transparent;
          border-radius: var(--theme-gallery-border-radius);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          cursor: pointer;
          font-size: var(--ddd-font-size-5xs);
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          transition: all 0.2s ease;
          font-family: var(--ddd-font-navigation);
        }

        .preview-button:hover {
          background: var(--ddd-theme-default-beaverBlue);
        }

        .preview-button:disabled {
          background: var(--ddd-theme-default-limestoneGray);
          cursor: not-allowed;
        }
        .preview-button simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-5xs);
          --simple-icon-height: var(--ddd-icon-5xs);
        }

        /* Table View */
        .theme-table {
          width: 100%;
          border-collapse: collapse;
          border: var(--theme-gallery-border);
          border-radius: var(--theme-gallery-border-radius);
          overflow: hidden;
        }

        .theme-table th,
        .theme-table td {
          padding: var(--ddd-spacing-4);
          text-align: left;
          border-bottom: var(--theme-gallery-border);
        }

        .theme-table th {
          background: var(--ddd-theme-default-limestoneLight);
          font-weight: var(--ddd-font-weight-bold);
          color: var(--ddd-theme-default-coalyGray);
          font-size: var(--ddd-font-size-xs);
        }

        .theme-table tr:hover {
          background: var(--ddd-theme-default-limestoneLight);
        }

        .theme-table tr.current {
          background: var(--ddd-theme-default-skyMaxlight);
        }

        .table-thumbnail {
          width: 90px;
          height: 60px;
          border: var(--ddd-border-xs);
          border-color: var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-xs);
          overflow: hidden;
          background: var(--ddd-theme-default-white);
        }

        .table-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .table-name {
          font-weight: var(--ddd-font-weight-bold);
          color: var(--ddd-theme-default-coalyGray);
        }

        .table-element {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-5xs);
          color: var(--ddd-theme-default-limestoneGray);
        }

        .current-label {
          color: var(--ddd-theme-default-link);
          font-size: var(--ddd-font-size-5xs);
          font-family: var(--ddd-font-navigation);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .gallery-header {
            flex-direction: column;
            gap: var(--ddd-spacing-2);
            align-items: flex-start;
          }

          .theme-table {
            font-size: var(--ddd-font-size-xs);
          }

          .table-thumbnail {
            width: 72px;
            height: 46px;
          }
        }

        @media (max-width: 480px) {
          .gallery-grid {
            grid-template-columns: 1fr;
          }
        }
      `,
    ];
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has("columns")) {
      this.style.setProperty("--columns", this.columns);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadThemes();
    this.detectCurrentTheme();
  }
  _isTruthy(value) {
    return value === true || value === "true" || value === 1 || value === "1";
  }

  _resolveThemeThumbnail(thumbnail = "") {
    if (!thumbnail || typeof thumbnail !== "string") {
      return "";
    }
    if (thumbnail.indexOf("@haxtheweb/") === 0) {
      const scopeMarker = "/@haxtheweb/";
      const markerIndex = import.meta.url.indexOf(scopeMarker);
      if (markerIndex !== -1) {
        const scopedBase = import.meta.url.substring(
          0,
          markerIndex + scopeMarker.length,
        );
        const packagePath = thumbnail.replace("@haxtheweb/", "");
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
        return `${basePath}${thumbnail}`;
      }
      const packagePath = `../../../../${thumbnail}`;
      return new URL(packagePath, import.meta.url).href;
    }
    return thumbnail;
  }

  _getVisibleThemes() {
    return this.themes.filter((theme) => {
      if (!theme) {
        return false;
      }
      if (theme.element === this.currentTheme) {
        return true;
      }
      if (this.showAllThemes) {
        return true;
      }
      if (theme.hidden || theme.terrible || theme.legacy) {
        return false;
      }
      return true;
    });
  }

  async loadThemes() {
    this.loading = true;
    this.error = null;

    try {
      // Load themes.json using relative path from component location
      const themesUrl = new URL("../../themes.json", import.meta.url);
      const response = await fetch(themesUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const themesData = await response.json();

      // Mirror app-hax and haxcms-theme-picker data normalization
      this.themes = Object.entries(themesData)
        .map(([key, theme]) => {
          const baseTheme =
            theme && typeof theme === "object" ? theme : { element: key };
          const element = baseTheme.element || key;
          const priorityRaw =
            typeof baseTheme.priority === "number"
              ? baseTheme.priority
              : Number(baseTheme.priority);
          const fallbackThumbnail = `@haxtheweb/haxcms-elements/lib/theme-screenshots/theme-${element}-thumb.jpg`;
          const thumbnailSource = baseTheme.thumbnail || fallbackThumbnail;
          const fullImageSource =
            baseTheme.screenshot || baseTheme.thumbnail || fallbackThumbnail;
          return {
            key,
            ...baseTheme,
            element: element,
            name: baseTheme.name || element,
            description: baseTheme.description || "",
            hidden: this._isTruthy(baseTheme.hidden),
            terrible:
              this._isTruthy(baseTheme.terrible) ||
              key.indexOf("terrible") === 0,
            legacy:
              this._isTruthy(baseTheme.legacy) ||
              this._isTruthy(baseTheme.deprecated) ||
              this._isTruthy(baseTheme.isLegacy),
            priority: Number.isFinite(priorityRaw) ? priorityRaw : 0,
            thumbnailPath: this._resolveThemeThumbnail(thumbnailSource),
            fullImagePath: this._resolveThemeThumbnail(fullImageSource),
          };
        })
        .sort((a, b) => {
          if (a.priority !== b.priority) {
            return a.priority - b.priority;
          }
          return a.name.localeCompare(b.name);
        });

      this.loading = false;
    } catch (error) {
      this.error = `Failed to load themes: ${error.message}`;
      this.loading = false;
      console.error("Error loading themes:", error);
    }
  }

  detectCurrentTheme() {
    // Try to detect the current theme from HAXCMS if available
    if (
      globalThis.HAXCMS &&
      globalThis.HAXCMS.instance &&
      globalThis.HAXCMS.instance.store &&
      globalThis.HAXCMS.instance.store.manifest &&
      globalThis.HAXCMS.instance.store.manifest.metadata &&
      globalThis.HAXCMS.instance.store.manifest.metadata.theme &&
      globalThis.HAXCMS.instance.store.manifest.metadata.theme.element
    ) {
      this.currentTheme =
        globalThis.HAXCMS.instance.store.manifest.metadata.theme.element;
    }
  }

  async switchTheme(themeElement) {
    if (globalThis.HAXCMS && globalThis.HAXCMS.setTheme) {
      try {
        await globalThis.HAXCMS.setTheme(themeElement);
        this.currentTheme = themeElement;

        // Fire a custom event to notify other components
        this.dispatchEvent(
          new CustomEvent("theme-changed", {
            bubbles: true,
            composed: true,
            detail: { themeElement },
          }),
        );
      } catch (error) {
        console.error("Failed to switch theme:", error);
      }
    } else {
      console.warn("HAXCMS theme switching not available");
    }
  }

  setViewMode(mode) {
    this.viewMode = mode;
  }

  renderGalleryView() {
    const visibleThemes = this._getVisibleThemes();
    if (visibleThemes.length === 0) {
      return html`<div class="loading">
        No themes available for this view.
      </div>`;
    }
    return html`
      <div class="gallery-grid">
        ${visibleThemes.map(
          (theme) => html`
            <div
              class="theme-card ${theme.element === this.currentTheme
                ? "current"
                : ""}"
            >
              ${theme.element === this.currentTheme
                ? html` <div class="current-badge">Active</div> `
                : ""}
              <div class="theme-thumbnail">
                <img
                  src="${theme.thumbnailPath || theme.fullImagePath}"
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </div>
              ${this.showDetails
                ? html`
                    <div class="theme-info">
                      <h3 class="theme-name">${theme.name}</h3>
                      ${theme.description
                        ? html`
                            <p class="theme-description">
                              ${theme.description}
                            </p>
                          `
                        : ""}
                      <div class="theme-element">&lt;${theme.element}&gt;</div>
                      <button
                        class="preview-button"
                        type="button"
                        aria-label="${theme.element === this.currentTheme
                          ? `${theme.name} theme is active`
                          : `Apply ${theme.name} theme`}"
                        ?disabled="${theme.element === this.currentTheme}"
                        @click="${() => this.switchTheme(theme.element)}"
                      >
                        <simple-icon-lite icon="visibility"></simple-icon-lite>
                        ${theme.element === this.currentTheme
                          ? "Active"
                          : "Apply"}
                      </button>
                    </div>
                  `
                : ""}
            </div>
          `,
        )}
      </div>
    `;
  }

  renderTableView() {
    const visibleThemes = this._getVisibleThemes();
    if (visibleThemes.length === 0) {
      return html`<div class="loading">
        No themes available for this view.
      </div>`;
    }
    return html`
      <table class="theme-table">
        <thead>
          <tr>
            <th>Preview</th>
            <th>Name</th>
            <th>Element</th>
            ${this.showDetails ? html`<th>Description</th>` : ""}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${visibleThemes.map(
            (theme) => html`
              <tr
                class="${theme.element === this.currentTheme ? "current" : ""}"
              >
                <td>
                  <div class="table-thumbnail">
                    <img
                      src="${theme.thumbnailPath || theme.fullImagePath}"
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </td>
                <td>
                  <div class="table-name">${theme.name}</div>
                  ${theme.element === this.currentTheme
                    ? html` <div class="current-label">Active</div> `
                    : ""}
                </td>
                <td>
                  <div class="table-element">&lt;${theme.element}&gt;</div>
                </td>
                ${this.showDetails
                  ? html`<td>${theme.description || ""}</td>`
                  : ""}
                <td>
                  <button
                    class="preview-button"
                    type="button"
                    aria-label="${theme.element === this.currentTheme
                      ? `${theme.name} theme is active`
                      : `Apply ${theme.name} theme`}"
                    ?disabled="${theme.element === this.currentTheme}"
                    @click="${() => this.switchTheme(theme.element)}"
                  >
                    <simple-icon-lite icon="visibility"></simple-icon-lite>
                    ${theme.element === this.currentTheme ? "Active" : "Apply"}
                  </button>
                </td>
              </tr>
            `,
          )}
        </tbody>
      </table>
    `;
  }

  render() {
    if (this.loading) {
      return html`<div class="loading">Loading themes...</div>`;
    }

    if (this.error) {
      return html`<div class="error">${this.error}</div>`;
    }
    const visibleThemes = this._getVisibleThemes();
    const themeCountLabel = this.showAllThemes
      ? `${visibleThemes.length} themes shown`
      : `${visibleThemes.length} themes shown (app-hax defaults)`;

    return html`
      <div class="gallery-header">
        <div>
          <h2 class="gallery-title">Available HAXcms Themes</h2>
          <div class="theme-count">${themeCountLabel}</div>
        </div>
        <div class="view-toggle">
          <button
            class="toggle-button ${this.viewMode === "gallery" ? "active" : ""}"
            type="button"
            aria-pressed="${this.viewMode === "gallery" ? "true" : "false"}"
            @click="${() => this.setViewMode("gallery")}"
          >
            <simple-icon-lite icon="view-module"></simple-icon-lite>
            Gallery
          </button>
          <button
            class="toggle-button ${this.viewMode === "table" ? "active" : ""}"
            type="button"
            aria-pressed="${this.viewMode === "table" ? "true" : "false"}"
            @click="${() => this.setViewMode("table")}"
          >
            <simple-icon-lite icon="view-list"></simple-icon-lite>
            Table
          </button>
        </div>
      </div>

      ${this.viewMode === "gallery"
        ? this.renderGalleryView()
        : this.renderTableView()}
    `;
  }

  /**
   * HAX properties
   */
  static get haxProperties() {
    return {
      canScale: false,
      canPosition: false,
      canEditSource: true,
      contentEditable: false,
      gizmo: {
        title: "Available Themes",
        description:
          "Display available HAXcms themes with live preview switching",
        icon: "image:collections",
        color: "purple",
        tags: [
          "Other",
          "Theme",
          "Gallery",
          "HAXcms",
          "Developer",
          "Documentation",
        ],
        handles: [],
        meta: {
          author: "HAXTheWeb team",
          owner: "The Pennsylvania State University",
        },
      },
      settings: {
        configure: [
          {
            property: "viewMode",
            title: "View Mode",
            description: "Choose how to display the themes",
            inputMethod: "select",
            options: {
              gallery: "Gallery",
              table: "Table",
            },
          },
          {
            property: "showDetails",
            title: "Show Details",
            description: "Show theme descriptions and additional information",
            inputMethod: "boolean",
          },
          {
            property: "showAllThemes",
            title: "Show Hidden and Legacy Themes",
            description:
              "Show hidden, legacy, and terrible themes in addition to dashboard defaults",
            inputMethod: "boolean",
          },
          {
            property: "columns",
            title: "Columns (Gallery)",
            description: "Number of columns in gallery view",
            inputMethod: "number",
            min: 1,
            max: 6,
          },
        ],
      },
      demoSchema: [
        {
          tag: "site-available-themes",
          properties: {
            viewMode: "gallery",
            showDetails: true,
            showAllThemes: false,
            columns: 3,
          },
          content: "",
        },
      ],
    };
  }
}

globalThis.customElements.define(SiteAvailableThemes.tag, SiteAvailableThemes);
