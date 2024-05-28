/**
 * Copyright 2023
 * @license , see License.md for full text.
 */
import { html, css } from "lit";
import "@haxtheweb/responsive-utility/responsive-utility.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

/**
 * `collection-list`
 * `listing and display elements for collections of items`
 * @demo demo/index.html
 * @element collection-list
 */
class CollectionList extends DDD {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.responsiveSize = "lg";
  }

  static get properties() {
    return {
      /**
       * Responsive size as `xs`, `sm`, `md`, `lg`, or `xl`
       */
      responsiveSize: {
        type: String,
        reflect: true,
        attribute: "responsive-size",
      },
    };
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
      styles,
      css`
        :host {
          display: block;
          container-type: inline-size;
        }
        .wrapper {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          column-gap: 2vw;
          row-gap: 2vw;
          --cssIdealSize: 200px;
        }
        .wrapper > * {
          /* Targets all direct children of the wrapper */
          grid-column: span 1; /* Ensures each item takes up exactly one column */
        }

        @container (min-width: 480px) {
          .wrapper {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @container (min-width: 720px) {
          .wrapper {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @container (min-width: 960px) {
          .wrapper {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @container (min-width: 1200px) {
          .wrapper {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        @container (min-width: 1440px) {
          .wrapper {
            grid-template-columns: repeat(6, 1fr);
          }
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <div class="wrapper" style="--cssIdealSize: ${this.size}">
        <slot></slot>
      </div>
    `;
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }

  /**
   * Convention we use
   */
  static get tag() {
    return "collection-list";
  }
}
customElements.define(CollectionList.tag, CollectionList);
export { CollectionList };
