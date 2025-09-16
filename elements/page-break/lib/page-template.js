/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

/**
 * `page-template`
 * `Template component for style guide functionality`
 * 
 * @demo demo/index.html
 * @element page-template
 */
export class PageTemplate extends I18NMixin(SchemaBehaviors(DDD)) {
  static get tag() {
    return "page-template";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          margin: var(--ddd-spacing-4) 0;
          padding: var(--ddd-spacing-4);
          border: 1px dotted var(--ddd-theme-default-limestoneGray);
          border-radius: var(--ddd-radius-xs);
          background-color: transparent;
          position: relative;
          transition: border-color 0.2s ease-in-out;
        }

        :host(:hover) {
          border-color: var(--ddd-theme-default-coalyGray);
        }

        :host([use-as-default]) {
          border-color: var(--ddd-theme-default-skyBlue);
        }

        :host([use-as-default]:hover) {
          border-color: var(--ddd-theme-default-navy);
        }

        :host([use-as-default])::before {
          content: "Default Template";
          position: absolute;
          top: calc(-1 * var(--ddd-spacing-2));
          left: var(--ddd-spacing-2);
          background-color: var(--ddd-theme-default-skyBlue);
          color: var(--ddd-theme-default-white);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-xs);
          font-weight: var(--ddd-font-weight-medium);
          border-radius: var(--ddd-radius-xs);
          z-index: 10;
        }

        .template-id {
          position: absolute;
          top: calc(-1 * var(--ddd-spacing-2));
          left: var(--ddd-spacing-2);
          background-color: var(--ddd-theme-default-limestoneGray);
          color: var(--ddd-theme-default-coalyGray);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-xs);
          font-family: var(--ddd-font-secondary);
          border-radius: var(--ddd-radius-xs);
          z-index: 10;
          transition: background-color 0.2s ease-in-out;
        }

        :host(:hover) .template-id {
          background-color: var(--ddd-theme-default-coalyGray);
          color: var(--ddd-theme-default-white);
        }

        :host([use-as-default]) .template-id {
          left: calc(var(--ddd-spacing-2) + 120px + var(--ddd-spacing-2));
        }

        .template-header {
          margin-bottom: var(--ddd-spacing-4);
          padding-bottom: var(--ddd-spacing-2);
          border-bottom: 1px solid var(--ddd-theme-default-limestoneGray);
        }

        .template-name {
          font-size: var(--ddd-font-size-s);
          font-weight: var(--ddd-font-weight-medium);
          color: var(--ddd-theme-default-coalyGray);
          margin: 0;
        }

        .template-content {
          position: relative;
        }

        :host(:not([name])) .template-header {
          display: none;
        }
      `,
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Whether this is the default template
       */
      useAsDefault: {
        type: Boolean,
        reflect: true,
        attribute: "use-as-default",
      },
      /**
       * Name of the template for identification
       */
      name: {
        type: String,
        reflect: true,
      },
    };
  }

  constructor() {
    super();
    this.useAsDefault = false;
    this.name = "";
    
    // Initialize translations
    this.t = {
      pageTemplate: "Page Template",
      templateId: "Template ID",
      defaultTemplate: "Default Template",
      namedTemplate: "Named Template",
    };
    
    this.registerLocalization({
      context: this,
      localesPath: 
        new URL("../../locales/page-break.es.json", import.meta.url).href + "/../",
      locales: ["es"],
    });
  }

  render() {
    return html`
      ${this.schemaResourceID ? html`
        <div class="template-id">
          ${this.schemaResourceID}
        </div>
      ` : ""}
      
      ${this.name ? html`
        <div class="template-header">
          <h4 class="template-name">${this.name}</h4>
        </div>
      ` : ""}
      
      <div class="template-content">
        <slot></slot>
      </div>
    `;
  }

  /**
   * Implements haxProperties to define HAX editor integration
   */
  static get haxProperties() {
    return {
      canScale: false,
      canPosition: false,
      canEditSource: true,
      gizmo: {
        title: "Page Template",
        description: "A template component for defining reusable page layouts and styling",
        icon: "hax:templates",
        color: "blue",
        groups: ["Layout", "Templates"],
        handles: [],
        meta: {
          author: "HAXTheWeb",
          inlineOnly: false,
          hiddenFromSearch: false,
        },
      },
      settings: {
        configure: [
          {
            property: "name",
            title: "Template Name",
            description: "A descriptive name for this template",
            inputMethod: "textfield",
            required: false,
          }
        ],
        advanced: [
          {
            slot: "",
            title: "Template Content", 
            description: "The content that defines this template",
            inputMethod: "code-editor",
            required: false,
          },
        ],
      },
      demoSchema: [
        {
          tag: "page-template",
          properties: {
            name: "Example Template",
            useAsDefault: false,
          },
          content: "<h2>Template Heading</h2><p>This is example template content that demonstrates the styling and layout.</p>",
        },
      ],
    };
  }
}

globalThis.customElements.define(PageTemplate.tag, PageTemplate);
