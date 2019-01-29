/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
/**
 * `full-width-image`
 * `full width image that flows beyond boundaries`
 *
 * @microcopy - language worth noting:
 *  - images are best used when stretched across content
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class FullWidthImage extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          background-color: #000000;
          height: 300px;
          margin: 0 !important;
          padding: 0 !important;
        }

        :host([hidden]) {
          display: none;
        }

        #image {
          left: 0;
          right: 0;
          position: absolute;
          background-repeat: no-repeat;
          background-position: center center;
          background-size: cover;
          width: 100%;
          text-align: center;
        }

        :host([hax-preview-mode]) #image {
          left: unset;
          right: unset;
          position: unset;
        }

        .wrapper {
          opacity: 1;
          background-color: rgba(0, 0, 0, 0.6);
          padding: 100px;
          height: 100px;
          transition: 0.5s all ease-in-out;
          -webkit-transition: 0.5s all ease-in-out;
          -moz-transition: 0.5s all ease-in-out;
          -ms-transition: 0.5s all ease-in-out;
          -o-transition: 0.5s all ease-in-out;
        }
        .wrapper:hover {
          opacity: 0;
          background-color: transparent;
        }

        .caption {
          padding: 35px 0;
          font-size: 25px;
          line-height: 40px;
          color: #fff;
          font-style: italic;
        }
      </style>
      <div id="image">
        <div class="wrapper">
          <div class="caption">
            [[caption]]
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: false,
      canPosition: false,
      canEditSource: false,
      gizmo: {
        title: "Full width-image",
        description: "full width image that flows beyond boundaries",
        icon: "image:image",
        color: "green",
        groups: ["Width"],
        handles: [
          {
            type: "image",
            source: "source",
            caption: "caption",
            title: "caption"
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
            icon: "image:image",
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
          },
          {
            property: "caption",
            description: "",
            inputMethod: "textfield"
          }
        ],
        advanced: []
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      source: {
        name: "source",
        type: "String",
        reflectToAttributes: true,
        observer: "_sourceChanged"
      },
      caption: {
        name: "caption",
        type: "String",
        reflectToAttributes: true
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "full-width-image";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(
      FullWidthImage.haxProperties,
      FullWidthImage.tag,
      this
    );
  }
  // Observer source for changes
  _sourceChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      this.$.image.style.backgroundImage = `url("${newValue}")`;
    }
  }
}
window.customElements.define("full-width-image", FullWidthImage);
export { FullWidthImage };
