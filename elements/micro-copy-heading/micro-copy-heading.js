/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import {
  LitElement,
  html,
  css,
  customElement,
  property
} from "lit-element/lit-element.js";
/**
 * `micro-copy-heading`
 * `small call to action / attention that acts as a heading too`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-element
 * @demo demo/index.html
 */
class MicroCopyHeading extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: block;
          margin: 16px 0;
        }

        :host([hidden]) {
          display: none;
        }
        span {
          margin-left: 8px;
        }
        h2 {
          display: inline-flex;
          margin: unset;
          padding: unset;
          font-size: 0.75em;
          color: var(--simple-colors-default-theme-red-5, #de2654);
          border: 2px solid var(--simple-colors-default-theme-red-5, #de2654);
          line-height: 12px;
          margin-right: 10px;
          text-transform: uppercase;
          font-weight: 500;
          letter-spacing: 0.09em;
          padding: 6px 16px;
        }
      `
    ];
  }
  // render function
  render() {
    return html`
      <h2>${this.heading}<span aria-hidden="true">${this.endcap}</span></h2>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Micro copy-heading",
        description:
          "small call to action / attention that acts as a heading too",
        icon: "icons:android",
        color: "green",
        groups: ["Copy"],
        handles: [
          {
            type: "todo:read-the-docs-for-usage"
          }
        ],
        meta: {
          author: "btopro",
          owner: "The Pennsylvania State University"
        }
      },
      settings: {
        quick: [
          {
            property: "heading",
            description: "",
            inputMethod: "textfield",
            required: false,
            icon: "icons:android"
          },
          {
            property: "endCap",
            description: "",
            inputMethod: "textfield",
            required: false,
            icon: "icons:android"
          }
        ],
        configure: [
          {
            property: "heading",
            description: "",
            inputMethod: "textfield",
            required: false,
            icon: "icons:android"
          },
          {
            property: "endCap",
            description: "",
            inputMethod: "textfield",
            required: false,
            icon: "icons:android"
          }
        ],
        advanced: []
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * Heading / call to action to display
       */
      heading: {
        name: "heading",
        type: String,
        value: "Telling our story"
      },
      /**
       * ending cap to the statement, possibly a character, icon, etc
       */
      endcap: {
        name: "endcap",
        type: String,
        value: "//"
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "micro-copy-heading";
  }

  // life cycle
  constructor() {
    super();
    this.tag = MicroCopyHeading.tag;
    // map our imported properties json to real props on the element
    // @notice static getter of properties is built via tooling
    // to edit modify src/micro-copy-heading-properties.json
    let obj = MicroCopyHeading.properties;
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (this.hasAttribute(p)) {
          this[p] = this.getAttribute(p);
        } else {
          this.setAttribute(p, obj[p].value);
          this[p] = obj[p].value;
        }
      }
    }
  }
}
customElements.define(MicroCopyHeading.tag, MicroCopyHeading);
export { MicroCopyHeading };
