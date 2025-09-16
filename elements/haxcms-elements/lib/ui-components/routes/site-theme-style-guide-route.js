/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXCMSI18NMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSI18NMixin.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/haxcms-elements/lib/core/haxcms-site-editor.js";
import "@haxtheweb/page-break/lib/page-template.js";

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

        .style-guide-content {
          min-height: 400px;
          padding: var(--ddd-spacing-4);
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
      const content = await store.loadStyleGuideContent();
      this.styleGuideContent = content;
      // Update the store's activeItemContent so HAX can work with it
      store.activeItemContent = content;
      // Render content directly into the DOM for initial display
      this.renderStyleGuideContent();
      // Trigger a re-render to ensure the UI updates
      this.requestUpdate();
    } catch (error) {
      console.error("Error loading style guide:", error);
      this.styleGuideContent = store.getDefaultStyleGuideContent();
      // Update the store's activeItemContent so HAX can work with it
      store.activeItemContent = this.styleGuideContent;
      // Render content directly into the DOM for initial display
      this.renderStyleGuideContent();
      // Trigger a re-render to ensure the UI updates
      this.requestUpdate();
    }
  }

  /**
   * Render the style guide content directly into the DOM
   */
  renderStyleGuideContent() {
    if (this.styleGuideContent && this.shadowRoot) {
      // Create a temporary div to parse the HTML
      const tempDiv = globalThis.document.createElement('div');
      tempDiv.innerHTML = this.styleGuideContent;
      // Clear existing light DOM content first
      while (this.firstChild) {
        this.removeChild(this.firstChild);
      }
      // Append all children from the parsed HTML to the light DOM
      while (tempDiv.firstChild) {
        this.appendChild(tempDiv.firstChild);
      }
    }
  }

  /**
   * Called after the element's DOM has been updated the first time
   */
  firstUpdated(changedProperties) {
    super.firstUpdated && super.firstUpdated(changedProperties);
    // Now that the shadow DOM is ready, render the content if we have it
    if (this.styleGuideContent) {
      this.renderStyleGuideContent();
    }
  }

  /**
   * Called when properties change
   */
  updated(changedProperties) {
    super.updated && super.updated(changedProperties);
    // If styleGuideContent changed, re-render it
    if (changedProperties.has('styleGuideContent') && this.styleGuideContent) {
      this.renderStyleGuideContent();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    // Load content when connected if not already loaded
    if (!this.styleGuideContent) {
      this.loadStyleGuideContent();
    } else {
      // If content is already loaded, render it
      this.renderStyleGuideContent();
    }
    // Listen for HAX store ready events to integrate with editor
    globalThis.addEventListener('hax-store-ready', this._handleHaxStoreReady.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    globalThis.removeEventListener('hax-store-ready', this._handleHaxStoreReady.bind(this));
  }

  /**
   * Handle HAX store being ready
   */
  _handleHaxStoreReady(e) {
    if (globalThis.HaxStore && globalThis.HaxStore.requestAvailability()) {
      let haxStore = globalThis.HaxStore.requestAvailability();
      
      // Register page-template element for HAX editor if not already registered
      if (typeof haxStore.elementList['page-template'] === 'undefined') {
        // Create page-template element to trigger HAX registration
        let el = globalThis.document.createElement('page-template');
        // Ensure the element gets added to the autoloader to register its HAX properties
        haxStore.haxAutoloader.appendChild(el);
      }
      
      // When HAX is ready and we have content, import it
      if (this.styleGuideContent && haxStore.activeHaxBody) {
        haxStore.activeHaxBody.importContent(this.styleGuideContent);
      }
    }
  }

  render() {
    return html`
      <div class="style-guide-container">
        <header class="style-guide-header">
          <p>${this.t.editStyleGuide}</p>
        </header>
        <div class="style-guide-content">
          <slot></slot>
        </div>
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
