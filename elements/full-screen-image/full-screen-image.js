/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
/**
 * `full-screen-image`
 * @element full-screen-image
 * `full screen banner image with down arrow`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @polymer
 * @demo demo/index.html
 */
class FullScreenImage extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: block;
          font-variant-ligatures: common-ligatures;
        }

        :host([hidden]) {
          display: none;
        }

        h2 {
          font-size: 4em;
          font-weight: 200;
          margin: 0px !important;
          line-height: 1em;
          text-transform: lowercase;
          color: white;
          letter-spacing: -0.04em;
          font-family: "Source Sans Pro", Arial, Helvetica, sans-serif;
        }

        p {
          font-weight: 400;
          color: white;
          line-height: 1em;
          font-family: "Source Sans Pro", Arial, Helvetica, sans-serif;
          font-size: 1em;
          letter-spacing: 0.01em;
          margin-top: 0;
          margin-bottom: 1em;
        }

        img {
          position: absolute;
          margin: 0px;
          padding: 0px;
          border: none;
          width: 1239px;
          height: 774.375px;
          max-width: none;
          z-index: -999999;
          left: 0px;
          top: -57.1875px;
        }

        simple-icon-button {
          --simple-icon-height: 45px;
          --simple-icon-width: 75px;
          line-height: 45px;
          bottom: 1px;
          right: 0px;
          display: block;
          position: absolute;
          text-align: center;
          color: white;
          background-color: rgba(0, 0, 0, 0.6);
        }

        .fullpage-container {
          display: block;
        }

        .image-wrapper {
          left: 0px;
          top: 0px;
          bottom: 0px;
          right: 0px;
          overflow: hidden;
          margin: 0px;
          padding: 0px;
          width: 100%;
          z-index: -999998;
          position: absolute;
        }

        .overlay-container {
          display: block;
          position: absolute;
          text-align: right;
          padding: 0.1em 1.5em 0.1em 6em;
          bottom: 60px;
          right: 0px;
          background-color: rgba(191, 147, 45, 0.7);
        }
      `,
    ];
  }

  // render function
  render() {
    return html` <div class="fullpage-container">
      <div class="overlay-container">
        <h2>${this.title}</h2>
        <p>${this.subtitle}</p>
      </div>
      <simple-icon-button
        id="down"
        icon="hardware:keyboard-arrow-down"
      ></simple-icon-button>
      <div class="image-wrapper">
        <img loading="lazy" id="img" src="${this.source}" />
      </div>
    </div>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Full screen-image",
        description: "full screen banner image with down arrow",
        icon: "icons:android",
        color: "green",
        groups: ["Screen"],
        handles: [
          {
            type: "todo:read-the-docs-for-usage",
          },
        ],
        meta: {
          author: "ELMS:LN",
          owner: "The Pennsylvania State University",
        },
      },
      settings: {
        quick: [
          {
            property: "source",
            description: "",
            inputMethod: "textfield",
            required: true,
            icon: "icons:link",
            validationType: "url",
          },
        ],
        configure: [
          {
            property: "title",
            description: "",
            inputMethod: "textfield",
            required: false,
            icon: "icons:android",
          },
          {
            property: "subtitle",
            description: "",
            inputMethod: "textfield",
            required: false,
            icon: "icons:android",
          },
          {
            property: "source",
            description: "",
            inputMethod: "textfield",
            required: true,
            icon: "icons:link",
            validationType: "url",
          },
        ],
        advanced: [],
      },
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      title: {
        type: String,
      },
      subtitle: {
        type: String,
      },
      source: {
        type: String,
      },
    };
  }

  /**
   * convention
   */
  static get tag() {
    return "full-screen-image";
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.title = "";
    this.subtitle = "";
    this.source = null;
  }
  /**
   * LitElement ready
   */
  firstUpdated() {
    this.shadowRoot.querySelector("#down").addEventListener("click", (e) => {
      this.nextElementSibling.scrollIntoView({
        block: "start",
        inline: "nearest",
        behavior: "smooth",
      });
    });
  }
}
window.customElements.define(FullScreenImage.tag, FullScreenImage);
export { FullScreenImage };
