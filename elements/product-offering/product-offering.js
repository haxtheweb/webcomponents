import { html, css } from "lit-element";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { IntersectionObserverMixin } from "@lrnwebcomponents/intersection-element/lib/IntersectionObserverMixin.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";

/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

/**
 * `product-offering`
 * `Simple card for displaying product info`
 * @demo demo/index.html
 * @element product-offering
 */
class ProductOffering extends IntersectionObserverMixin(SimpleColors) {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.alt = "";
    this.accentColor = "blue";
    this.dark = false;
  }
  /**
   * LitElement style callback
   */
  static get styles() {
    // support for using in other classes
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      ...styles,
      css`
        :host {
          display: block;
          padding: var(--product-offering-padding, 25px);
          color: var(--product-offering-text-color, #000);
          font-family: var(--product-offering-font-family, Verdana, sans-serif);
        }
        .container {
          padding: 5%;
          display: grid;
          grid-template-columns: 25% 75%;
        }
        .image {
          height: var(--product-offering-image-height, 150px);
          width: var(--product-offering-image-width, 200px);
          border-radius: 2%;
        }
        simple-icon {
          padding: 8px;
          height: 30px;
          width: 30px;
        }
        .icon-background {
          background-color: var(
            --simple-colors-default-theme-accent-12,
            #eeeeee
          );
          border-radius: 50%;
          padding: 2px;
          margin: 5px;
          margin-right: 10px;
          box-shadow: 10px 10px 25px 0 rgb(0 0 0 / 10%);
        }
        .squareTitle {
          display: flex;
        }
        .underline {
          border-bottom: 5px solid orange;
          display: inline-block;
        }
        .sqaureDescription {
          color: var(--simple-colors-default-theme-accent-12, #eeeeee);
          font-size: 12pt;
          padding: 20px;
          padding-left: 60px;
          margin: 0;
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      ${this.elementVisible
        ? html` <!-- Container -->
            <div class="container">
              <img class="image" src="${this.source}" alt="${this.alt}" />

              <div class="square">
                <!-- Icon, Header -->
                <div class="squareTitle">
                  <!-- icon -->
                  <div class="icon-background">
                    <simple-icon
                      accent-color="${this.accentColor}"
                      ?dark="${this.dark}"
                      .icon="${this.icon}"
                    ></simple-icon>
                  </div>
                  <!-- header -->
                  <h4>
                    <span class="underline">${this._titleOne}</span>&nbsp;<span
                      >${this._titleTwo}</span
                    >
                  </h4>
                </div>

                <!-- descripton -->
                <div class="sqaureDescription">
                  <slot name="description">${this.description}</slot>
                </div>
              </div>
            </div>`
        : ``}
    `;
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "product-offering";
  }
  static get properties() {
    return {
      ...super.properties,
      alt: { type: String },
      source: { type: String },
      icon: { type: String },
      title: { type: String },
      _titleOne: { type: String },
      _titleTwo: { type: String },
      description: { type: String },
    };
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "title") {
        if (this.title.split(" ").length > 1) {
          const tmp = this.title.split(" ");
          this._titleOne = tmp.shift();
          this._titleTwo = tmp.join(" ");
        } else {
          this._titleOne = this.title;
        }
      }
    });
  }
}
customElements.define(ProductOffering.tag, ProductOffering);
export { ProductOffering };
