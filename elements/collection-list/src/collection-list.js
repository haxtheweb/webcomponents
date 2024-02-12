/**
 * Copyright 2023
 * @license , see License.md for full text.
 */
import { html, css } from "lit";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import { DDD } from "@lrnwebcomponents/d-d-d/d-d-d.js";

/**
 * `collection-list`
 * `listing and display elements for collections of items`
 * @demo demo/index.html
 * @element collection-list
 */
class CollectionList extends (DDD) {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.itemsPerRow = null;
    this.breakpointSm = 900;
    this.breakpointMd = 1200;
    this.breakpointLg = 1500;
    this.breakpointXl = 1800;
  }

  static get properties() {
    return {
      /**
       * Custom small breakpoint for the layouts; only updated on attached
       */
      breakpointSm: {
        type: Number,
        attribute: "breakpoint-sm",
      },
      /**
       * Custom medium breakpoint for the layouts; only updated on attached
       */
      breakpointMd: {
        type: Number,
        attribute: "breakpoint-md",
      },
      /**
       * Custom large breakpoint for the layouts; only updated on attached
       */
      breakpointLg: {
        type: Number,
        attribute: "breakpoint-lg",
      },
      /**
       * Custom extra-large breakpoint for the layouts; only updated on attached
       */
      breakpointXl: {
        type: Number,
        attribute: "breakpoint-xl",
      },
      itemsPerRow: {
        type: String,
        reflect: true,
        attribute: "items-per-row",
      },
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

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    globalThis.dispatchEvent(
      new CustomEvent("responsive-element", {
        detail: {
          element: this,
          attribute: "responsive-size",
          relativeToParent: false,
          sm: this.breakpointSm,
          md: this.breakpointMd,
          lg: this.breakpointLg,
          xl: this.breakpointXl,
        },
      })
    );
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
        }
        :host .wrapper {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          column-gap: 2vw;
          row-gap: 2vw;
        }
        :host([responsive-size="sm"]) .wrapper {
          column-gap: 1.5vw;
          row-gap: 1.5vw;
        }
        :host([responsive-size="xs"]) .wrapper {
          column-gap: 1vw;
          row-gap: 1vw;
        }

        :host([items-per-row="1"]) .wrapper {
          grid-template-columns: repeat(1, minmax(250px, 1fr));
        }
        :host([items-per-row="2"]) .wrapper {
          grid-template-columns: repeat(2, minmax(250px, 1fr));
        }
        :host([items-per-row="3"]) .wrapper {
          grid-template-columns: repeat(3, minmax(250px, 1fr));
        }
        :host([items-per-row="3"][responsive-size="xs"]) .wrapper {
          column-gap: 1.5vw;
          row-gap: 1.5vw;
          grid-template-columns: repeat(2, minmax(250px, 1fr));
        }
        :host([items-per-row="4"]) .wrapper {
          grid-template-columns: repeat(4, minmax(200px, 1fr));
          column-gap: 1.5vw;
          row-gap: 1.5vw;
        }
        :host([items-per-row="4"][responsive-size="xs"]) .wrapper {
          grid-template-columns: repeat(2, minmax(200px, 1fr));
        }
        :host([items-per-row="5"]) .wrapper {
          grid-template-columns: repeat(5, minmax(200px, 1fr));
          column-gap: 1.25vw;
          row-gap: 1.25vw;
        }
        :host([items-per-row="5"][responsive-size="xs"]) .wrapper {
          grid-template-columns: repeat(3, minmax(150px, 1fr));
        }
        :host([items-per-row="6"]) .wrapper {
          grid-template-columns: repeat(6, minmax(150px, 1fr));
          column-gap: 1vw;
          row-gap: 1vw;
        }
        :host([items-per-row="6"][responsive-size="xs"]) .wrapper {
          grid-template-columns: repeat(3, minmax(150px, 1fr));
        }
        :host([items-per-row="7"]) .wrapper {
          grid-template-columns: repeat(7, minmax(150px, 1fr));
          column-gap: 0.5vw;
          row-gap: 0.5vw;
        }
        :host([items-per-row="7"][responsive-size="md"]) .wrapper {
          grid-template-columns: repeat(5, minmax(125px, 1fr));
        }
        :host([items-per-row="7"][responsive-size="sm"]) .wrapper {
          grid-template-columns: repeat(4, minmax(125px, 1fr));
        }
        :host([items-per-row="7"][responsive-size="xs"]) .wrapper {
          grid-template-columns: repeat(3, minmax(125px, 1fr));
        }
        :host([items-per-row="8"]) .wrapper {
          grid-template-columns: repeat(8, minmax(125px, 1fr));
          column-gap: 0.5vw;
          row-gap: 0.5vw;
        }
        :host([items-per-row="8"][responsive-size="sm"]) .wrapper {
          grid-template-columns: repeat(4, minmax(125px, 1fr));
        }
        :host([items-per-row="8"][responsive-size="xs"]) .wrapper {
          grid-template-columns: repeat(3, minmax(125px, 1fr));
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <div class="wrapper">
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
