/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
/**
 * `meme-maker`
 * Connects lrndesign-gallery to HAX
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 *  - go forth and make dank memes yo
 */
class MemeMaker extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        * {
          box-sizing: border-box;
        }
        figure {
          position: relative;
          width: 100%;
          margin: 0;
          padding: 0;
          font-size: 20px;
        }
        img {
          width: 100%;
          height: auto;
        }
        .top-text,
        .bottom-text {
          position: absolute;
          left: 0;
          width: 100%;
          padding: 3% 2%;
          text-align: center;
          text-transform: uppercase;
          font-weight: 900;
          font-family: "Impact", "Arial Black", "sans serif";
          line-height: 1.2;
          font-size: var(--meme-maker-font-size, 36px);
          color: white;
          text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
            1px 1px 0 #000;
          letter-spacing: 2px;
        }
        .top-text {
          top: 0;
        }
        .bottom-text {
          bottom: 0;
        }
        @media (max-width: 800px) {
          .top-text,
          .bottom-text {
            font-size: var(--meme-maker-font-size-medium, 20px);
          }
        }
        @media (max-width: 600px) {
          .top-text,
          .bottom-text {
            font-size: var(--meme-maker-font-size-small, 20px);
          }
        }
      `
    ];
  }
  render() {
    return html`
      <figure>
        <img .src="${this.imageUrl}" .alt="${this.alt}" />
        <figcaption class="top-text">${this.topText}</figcaption>
        <figcaption class="bottom-text">${this.bottomText}</figcaption>
      </figure>
    `;
  }
  static get tag() {
    return "meme-maker";
  }
  constructor() {
    super();
    this.alt = "";
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setup(MemeMaker.haxProperties, MemeMaker.tag, this);
  }
  static get properties() {
    return {
      /**
       * Alt data passed down to appropriate tag
       */
      alt: {
        type: String
      },
      /**
       * url to the meme image
       */
      imageUrl: {
        type: String,
        attribute: "image-url",
        reflect: true
      },
      /**
       * Text on top of the image.
       */
      topText: {
        type: String,
        attribute: "top-text",
        reflect: true
      },
      /**
       * Bottom text for the image.
       */
      bottomText: {
        type: String,
        attribute: "bottom-text",
        reflect: true
      }
    };
  }
  /**
   * Attached to the DOM, now fire.
   */
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Meme",
        description: "Make a meme out of an image",
        icon: "editor:title",
        color: "orange",
        groups: ["Content", "Text", "Meme", "Funny"],
        handles: [
          {
            type: "image",
            source: "imageUrl",
            title: "topText",
            author: "bottomText",
            alt: "alt"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          {
            property: "topText",
            title: "Top text",
            description: "Top text of the meme.",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "bottomText",
            title: "Bottom text",
            description: "The date this was accessed.",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        configure: [
          {
            property: "imageUrl",
            title: "Source",
            description: "The source url for the element this is citing.",
            inputMethod: "haxupload",
            icon: "link"
          },
          {
            property: "topText",
            title: "Top text",
            description: "Top text of the meme.",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "bottomText",
            title: "Bottom text",
            description: "The date this was accessed.",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        advanced: []
      }
    };
  }
}
window.customElements.define(MemeMaker.tag, MemeMaker);
export { MemeMaker };
