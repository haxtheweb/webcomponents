/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";

/**
 * `meme-maker`
 * Meme all the things
 *
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 *  - go forth and make dank memes yo
 * @element meme-maker
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
          overflow: hidden;
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
      `,
    ];
  }
  render() {
    return html`
      <figure>
        <img
          loading="lazy"
          src="${this.imageUrl}"
          alt="${this.alt || ""}"
          aria-describedby="${this.describedBy || ""}"
        />
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
  }
  static get properties() {
    return {
      /**
       * Alt data passed down to appropriate tag
       */
      alt: {
        type: String,
      },
      /**
       * Aria-describedby data passed down to appropriate tag
       */
      describedBy: {
        type: String,
        attribute: "described-by",
      },
      /**
       * url to the meme image
       */
      imageUrl: {
        type: String,
        attribute: "image-url",
        reflect: true,
      },
      /**
       * Text on top of the image.
       */
      topText: {
        type: String,
        attribute: "top-text",
        reflect: true,
      },
      /**
       * Bottom text for the image.
       */
      bottomText: {
        type: String,
        attribute: "bottom-text",
        reflect: true,
      },
    };
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      progressiveEnhancement: "haxprogressiveEnhancement",
      gizmoRegistration: "haxgizmoRegistration",
    };
  }
  /**
   * Supply translations for the UI elements of HAX in meme-maker
   */
  haxgizmoRegistration(store) {
    window.dispatchEvent(
      new CustomEvent("i18n-manager-register-element", {
        detail: {
          namespace: `meme-maker.haxProperties`,
          localesPath: new URL(`./locales`, import.meta.url).href,
          locales: ["es", "fr"],
        },
      })
    );
  }
  /**
   * Hook for HAX to support progressive enhancement and return a string
   * to place in the slot of this tag for RSS, bots and legacy formats
   */
  haxprogressiveEnhancement(el) {
    return `
    ${this.topText ? `<div>${this.topText}</div>` : ""}
      <img src="${this.imageUrl}" alt="${
      this.alt
    }" preload="lazy" aria-describedby="${this.describedBy || ""}"/>
    ${this.bottomText ? `<div>${this.bottomText}</div>` : ""}`;
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/meme-maker.haxProperties.json`, import.meta.url).href;
  }
}
customElements.define(MemeMaker.tag, MemeMaker);
export { MemeMaker };
