/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/a11y-collapse/lib/a11y-collapse-group.js";
import "@lrnwebcomponents/a11y-collapse/a11y-collapse.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/accent-card/accent-card.js";
/**
 * `product-card`
 * `basic display of a product with advanced data driven helpers`
 * @demo demo/index.html
 * @element product-card
 */
class ProductCard extends SimpleColors {
  static get styles() {
    return [...super.styles,
      css`
      :host {
        display: flex;
      }
    `
    ];
  }
  // render function
  render() {
    return html`
      <style>
        :host {
          display: block;
          opacity: 1;
          visibility: visible;
        }
        :host([hidden]) {
          display: none;
        }
        :host([disabled]) accent-card {
          cursor: not-allowed;
          opacity: .5;
        }
        :host([disabled]) accent-card:hover {
          cursor: not-allowed;
          opacity: .8;
        }
        a11y-collapse-group {
          margin: 0;
        }
        a11y-collapse {
          margin: 0 -20px;
          padding: 8px;
        }
        accent-card {
          margin: 0;
        }
        div[slot="heading"] {
          height: 40px;
        }
        div[slot="subheading"] {
          height: 30px;
        }
        div[slot="content"] {
          height: 40px;
        }
      </style>
      <accent-card accent-color="${!this.disabled ? this.accentColor : 'grey'}" accent-heading ?flat="${this.disabled}">
        <div slot="heading">
          ${this.icon ? html`<iron-icon icon="${this.icon}"></iron-icon>`:``}
          ${this.heading}
        </div>
        <div slot="subheading">${this.subheading}</div>
        <div slot="content"><slot></slot></div>
        <div slot="footer">
          <a11y-collapse-group>
          <a11y-collapse ?disabled="${this.disabled}" accordion>
            <div slot="heading">
              <slot name="details-collapse-header"></slot>
            </div>
            <div slot="content">
              <slot name="details-collapse-content"></slot>
            </div>
          </a11y-collapse>
          <a11y-collapse ?disabled="${this.disabled || !this.hasDemo}" accordion>
            <div slot="heading">
              <slot name="demo-collapse-header"></slot>
            </div>
            <div slot="content">
              <slot name="demo-collapse-content"></slot>
            </div>
          </a11y-collapse>
          </a11y-collapse-group>
        </div>
      </accent-card>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      disabled: {
        type: Boolean,
        reflect: true
      },
      heading: {
        type: String,
      },
      subheading: {
        type: String,
      },
      icon: {
        type: String,
      },
      hasDemo: {
        type: Boolean,
        attribute: "has-demo"
      }
    };
  }

  /**
   * Convention we use
   */
  static get tag() {
    return "product-card";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.disabled = false;
  }

}
customElements.define(ProductCard.tag, ProductCard);
export { ProductCard };
