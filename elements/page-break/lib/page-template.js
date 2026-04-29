/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { generateResourceID } from "@haxtheweb/utils/lib/ids.js";

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
          min-height: 100px;
        }

        :host(:hover) {
          border-color: var(--ddd-theme-default-coalyGray);
        }


        :host([data-hax-ray])
          .template-content
          ::slotted(*.hax-hovered)::before {
          content: " ";
          width: calc(100% + 32px);
          display: block;
          position: relative;
          margin: -28px -16px 12px;
          z-index: 2;
          height: 12px;
          border: none !important;
          transition: 0.3s all ease-in-out;
          background-color: var(--hax-body-target-background-color) !important;
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
       * Name of the template for identification
       */
      name: {
        type: String,
        reflect: true,
      },
      /**
       * Schema type defining how this template should be used
       * Options: 'block', 'area', 'page'
       */
      schema: {
        type: String,
        reflect: true,
      },
    };
  }

  constructor() {
    super();
    this.name = "";
    this.schema = "area";

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
        new URL("../../locales/page-break.es.json", import.meta.url).href +
        "/../",
    });
  }

  /**
   * Ensure template has a unique ID when connected to DOM
   */
  connectedCallback() {
    super.connectedCallback();

    // Auto-generate data-haxsg-id if it doesn't exist
    if (!this.getAttribute("data-haxsg-id")) {
      const templateType = this.schema || "area";
      const prefix =
        templateType === "page"
          ? "page"
          : templateType === "block"
            ? "block"
            : "template";
      const uniqueId = `${prefix}-${generateResourceID("").substring(1)}`; // Remove the '#' prefix
      this.setAttribute("data-haxsg-id", uniqueId);
    }
  }

  render() {
    return html`
      ${this.name ? html` <div class="template-label">${this.name}</div> ` : ""}
      <div class="template-content">
        <slot></slot>
      </div>
    `;
  }

}

globalThis.customElements.define(PageTemplate.tag, PageTemplate);
