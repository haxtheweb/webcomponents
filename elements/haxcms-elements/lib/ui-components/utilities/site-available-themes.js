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
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/media-image/media-image.js";
import "@haxtheweb/simple-icon/simple-icon.js";

/**
 * Site Available Themes
 * Displays available HAXcms themes in a gallery or table format for documentation purposes
 * Includes dynamic theme switching capabilities for live preview
 *
 * @element site-available-themes
 */
export class SiteAvailableThemes extends DDDSuper(I18NMixin(LitElement)) {
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
          --theme-gallery-border-radius: var(--ddd-radius-sm);
          --theme-gallery-border: var(--ddd-border-sm);
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
        }

        .view-toggle {
          display: flex;
          gap: var(--ddd-spacing-2);
        }

        .toggle-button {
          background: var(--ddd-theme-default-white);
          border: var(--theme-gallery-border);
          border-radius: var(--theme-gallery-border-radius);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          font-size: var(--ddd-font-size-xs);
        }

        .toggle-button:hover,
        .toggle-button.active {
          background: var(--ddd-theme-default-skyBlue);
          color: var(--ddd-theme-default-white);
        }

        .theme-count {
          color: var(--ddd-theme-default-coalyGray);
          font-size: var(--ddd-font-size-xs);
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
        }

        .theme-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--ddd-boxShadow-md);
        }

        .theme-card.current {
          border-color: var(--ddd-theme-default-skyBlue);
          border-width: 2px;
        }

        .theme-thumbnail {
          width: 100%;
          height: 200px;
          position: relative;
        }

        .current-badge {
          position: absolute;
          top: var(--ddd-spacing-2);
          right: var(--ddd-spacing-2);
          background: var(--ddd-theme-default-skyBlue);
          color: var(--ddd-theme-default-white);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-xs);
          font-size: var(--ddd-font-size-3xs);
          z-index: 1;
        }

        .theme-info {
          padding: var(--ddd-spacing-4);
        }

        .theme-name {
          font-weight: var(--ddd-font-weight-bold);
          color: var(--ddd-theme-default-coalyGray);
          margin: 0 0 var(--ddd-spacing-2) 0;
          font-size: var(--ddd-font-size-sm);
        }

        .theme-description {
          font-size: var(--ddd-font-size-xs);
          color: var(--ddd-theme-default-slateGray);
          margin: 0 0 var(--ddd-spacing-2) 0;
        }

        .theme-element {
          font-size: var(--ddd-font-size-3xs);
          color: var(--ddd-theme-default-limestoneGray);
          font-family: var(--ddd-font-navigation);
          margin-bottom: var(--ddd-spacing-2);
        }

        .preview-button {
          background: var(--ddd-theme-default-skyBlue);
          color: var(--ddd-theme-default-white);
          border: none;
          border-radius: var(--theme-gallery-border-radius);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          cursor: pointer;
          font-size: var(--ddd-font-size-xs);
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
          transition: all 0.2s ease;
        }

        .preview-button:hover {
          background: var(--ddd-theme-default-navy);
        }

        .preview-button:disabled {
          background: var(--ddd-theme-default-limestoneGray);
          cursor: not-allowed;
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
          width: 80px;
          height: 50px;
        }

        .table-name {
          font-weight: var(--ddd-font-weight-bold);
          color: var(--ddd-theme-default-coalyGray);
        }

        .table-element {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-xs);
          color: var(--ddd-theme-default-limestoneGray);
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
            width: 60px;
            height: 40px;
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

      // Convert themes object to array and add screenshot paths
      this.themes = Object.entries(themesData).map(([key, theme]) => ({
        key,
        ...theme,
        thumbnailPath:
          theme.thumbnail ||
          `theme-screenshots/theme-${theme.element}-thumb.jpg`,
        fullImagePath:
          theme.screenshot || `theme-screenshots/theme-${theme.element}.jpg`,
      }));

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

        console.log(`Theme switched to: ${themeElement}`);
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
    return html`
      <div class="gallery-grid">
        ${this.themes.map(
          (theme) => html`
            <div
              class="theme-card ${theme.element === this.currentTheme
                ? "current"
                : ""}"
            >
              ${theme.element === this.currentTheme
                ? html` <div class="current-badge">Current</div> `
                : ""}
              <div class="theme-thumbnail">
                <media-image
                  source="${theme.fullImagePath}"
                  thumbnail="${theme.thumbnailPath}"
                  alt="${theme.name}"
                  accent-color="grey"
                  size="wide"
                ></media-image>
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
                        ?disabled="${theme.element === this.currentTheme}"
                        @click="${() => this.switchTheme(theme.element)}"
                      >
                        <simple-icon icon="visibility"></simple-icon>
                        ${theme.element === this.currentTheme
                          ? "Current Theme"
                          : "Preview Theme"}
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
          ${this.themes.map(
            (theme) => html`
              <tr
                class="${theme.element === this.currentTheme ? "current" : ""}"
              >
                <td>
                  <div class="table-thumbnail">
                    <media-image
                      source="${theme.fullImagePath}"
                      thumbnail="${theme.thumbnailPath}"
                      alt="${theme.name}"
                      accent-color="grey"
                      size="wide"
                    ></media-image>
                  </div>
                </td>
                <td>
                  <div class="table-name">${theme.name}</div>
                  ${theme.element === this.currentTheme
                    ? html`
                        <div
                          style="color: var(--ddd-theme-default-skyBlue); font-size: var(--ddd-font-size-3xs);"
                        >
                          Current
                        </div>
                      `
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
                    ?disabled="${theme.element === this.currentTheme}"
                    @click="${() => this.switchTheme(theme.element)}"
                  >
                    <simple-icon icon="visibility"></simple-icon>
                    ${theme.element === this.currentTheme
                      ? "Current"
                      : "Preview"}
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

    return html`
      <div class="gallery-header">
        <div>
          <h2 class="gallery-title">Available HAXcms Themes</h2>
          <div class="theme-count">${this.themes.length} themes available</div>
        </div>
        <div class="view-toggle">
          <button
            class="toggle-button ${this.viewMode === "gallery" ? "active" : ""}"
            @click="${() => this.setViewMode("gallery")}"
          >
            <simple-icon icon="view-module"></simple-icon>
            Gallery
          </button>
          <button
            class="toggle-button ${this.viewMode === "table" ? "active" : ""}"
            @click="${() => this.setViewMode("table")}"
          >
            <simple-icon icon="view-list"></simple-icon>
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
        tags: ["Theme", "Gallery", "HAXcms", "Developer", "Documentation"],
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
            columns: 3,
          },
          content: "",
        },
      ],
    };
  }
}

globalThis.customElements.define(SiteAvailableThemes.tag, SiteAvailableThemes);
