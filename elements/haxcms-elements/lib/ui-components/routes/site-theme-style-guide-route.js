/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXCMSI18NMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSI18NMixin.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/haxcms-elements/lib/core/haxcms-site-editor.js";

/**
 * `site-theme-style-guide-route`
 * `Route for editing theme style guide content via HAX editor`
 */
export class SiteThemeStyleGuideRoute extends HAXCMSI18NMixin(DDD) {
  static get tag() {
    return "site-theme-style-guide-route";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          padding: var(--ddd-spacing-4);
        }

        .style-guide-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .style-guide-header {
          margin-bottom: var(--ddd-spacing-6);
          text-align: center;
        }

        .style-guide-editor {
          min-height: 400px;
          border: 1px solid var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-xs);
          padding: var(--ddd-spacing-4);
          background-color: var(--ddd-theme-default-white);
        }
      `,
    ];
  }

  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.HAXCMSI18NMixinBase = "../../../";
    this.styleGuideContent = "";
    
    // Translations
    this.t.editStyleGuide = "Edit your theme's style guide using the HAX editor";
    this.loadStyleGuideContent();
  }

  /**
   * Load the theme/style-guide.html content using the store
   */
  async loadStyleGuideContent() {
    try {
      this.styleGuideContent = await store.loadStyleGuideContent();
    } catch (error) {
      console.error("Error loading style guide:", error);
      this.styleGuideContent = store.getDefaultStyleGuideContent();
    }
  }

  render() {
    return html`
      <div class="style-guide-container">
        <header class="style-guide-header">
          <p>${this.t.editStyleGuide}</p>
        </header>
        <slot></slot>
      </div>
    `;
  }

  static get properties() {
    return {
      ...super.properties,
      styleGuideContent: {
        type: String,
      },
    };
  }
}

globalThis.customElements.define(SiteThemeStyleGuideRoute.tag, SiteThemeStyleGuideRoute);
