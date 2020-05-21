/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `full-width-image`
 * `full width image that flows beyond boundaries`
 *
 * @microcopy - language worth noting:
 *  - images are best used when stretched across content
 *
 * @demo demo/index.html
 * @element full-width-image
 */
class FullWidthImage extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
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
      `
    ];
  }
  // render function
  render() {
    return html`
      <div id="image">
        <div class="wrapper">
          <div class="caption">
            ${this.caption}
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
            inputMethod: "haxupload",
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
      ...super.properties,

      source: {
        type: String,
        reflect: true
      },
      caption: {
        type: String,
        reflect: true
      }
    };
  }

  /**
   * convention
   */
  static get tag() {
    return "full-width-image";
  }
  /**
   * LitElement properties changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "source") {
        this._sourceChanged(this[propName]);
      }
    });
  }

  _sourceChanged(newValue) {
    if (typeof newValue !== typeof undefined) {
      this.shadowRoot.querySelector(
        "#image"
      ).style.backgroundImage = `url("${newValue}")`;
    }
  }
}
window.customElements.define("full-width-image", FullWidthImage);
export { FullWidthImage };
