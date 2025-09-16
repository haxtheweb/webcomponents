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

        :host([enforce-styles]) {
          border-color: var(--ddd-theme-default-skyBlue);
        }

        :host([enforce-styles]:hover) {
          border-color: var(--ddd-theme-default-navy);
        }

        .template-label {
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
      enforceStyles: {
        type: Boolean,
        reflect: true,
        attribute: "enforce-styles",
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
    this.enforceStyles = false;
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
      ${this.name ? html`
        <div class="template-label">
          ${this.name}
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
      type: "grid",
      canScale: false,
      canPosition: false,
      canEditSource: true,
      contentEditable: true,
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
            description: "Name you will see in the editor",
            inputMethod: "textfield",
            required: false,
          },
          {
            property: "enforceStyles",
            title: "Enforce Template Styles",
            description: "Apply this template to any matching tag, ignoring the local styles",
            inputMethod: "boolean",
            required: false,
          }
        ],
        advanced: [
          {
            slot: "",
            title: "Template Content", 
            description: "The elements and content that define this template section",
            inputMethod: "textarea",
            required: false,
          },
        ],
      },
      demoSchema: [
        {
          tag: "page-template",
          properties: {
            name: "Example Template",
            enforceStyles: false,
          },
          content: "<h2>Template Heading</h2><p>Add your content elements inside this template. This acts as a container that can hold any HAX elements.</p>",
        },
      ],
    };
  }
}

globalThis.customElements.define(PageTemplate.tag, PageTemplate);
