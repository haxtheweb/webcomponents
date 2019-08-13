/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "h5p-standalone/src/js/h5pintegration.es6";
/**
 * `h5p-element`
 * `h5p wrapper for loading and presenting .h5p files`
 *
 * @microcopy - language worth noting:
 *  - h5p is it's own eco system, we're just trying to wrap it a bit
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class H5PElement extends LitElement {
  // render function
  render() {
    return html`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }
      </style>
      <div class="h5p-container" data-content-id="${this.contentId}">
        <slot></slot>
      </div>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "H 5-p-element",
        description: "h5p wrapper for loading and presenting .h5p files",
        icon: "icons:android",
        color: "green",
        groups: ["5"],
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
            property: "source",
            description: "",
            inputMethod: "textfield",
            required: true,
            icon: "icons:link",
            validationType: "url"
          }
        ],
        configure: [
          {
            property: "source",
            description: "",
            inputMethod: "textfield",
            required: true,
            icon: "icons:link",
            validationType: "url"
          }
        ],
        advanced: []
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    let props = {
      /**
       * Source of the .h5p file
       */
      source: {
        name: "source",
        type: String
      }
    };
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  tag() {
    return "h5p-element";
  }
  /**
   * Register CSS styles
   */
  static get styles() {
    return ["h5p-standalone/src/styles/h5p.css"];
  }

  // life cycle
  constructor() {
    super();
    // make a random ID for the targeting
    this.contentId = this.generateUUID();
  }
  generateUUID() {
    return "item-sss-ss-ss".replace(/s/g, this._uuidPart);
  }
  _uuidPart() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    (function($) {
      $(function() {
        $(".h5p-container").h5p({
          frameJs: "../dist/js/h5p-standalone-frame.min.js",
          frameCss: "../dist/styles/h5p.css",
          h5pContent: "../workspace"
        });
      });
    })(H5P.jQuery);
    this.classList.add("h5p-content", "h5p-frame");
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(H5PElement.haxProperties, H5PElement.tag, this);
  }
  /**
   * life cycle, element removed from DOM
   */
  disconnectedCallback() {
    super.disconnectedCallback();
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {});
  }
}
customElements.define("h5p-element", H5PElement);
export { H5PElement };
var H5P = H5P || {};
H5P.externalEmbed = false;
