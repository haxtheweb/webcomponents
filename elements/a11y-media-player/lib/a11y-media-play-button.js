/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { A11yMediaBehaviors } from "./a11y-media-behaviors.js";

/**
 * `a11y-media-play-button`
 * a giant play button that overlays the media in a11y-media-player.
```
Custom styles:
--a11y-play-button-bg-color: overlay background color, default is #000000
--a11y-play-button-focus-bg-color: overlay background color, default is --a11y-play-button-bg-color```
 *
 * @extends A11yMediaBehaviors
 * @customElement
 */
class A11yMediaPlayButton extends A11yMediaBehaviors {
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      /**
       * is button action to send as an event
       */
      action: {
        type: String
      },
      /**
       * is button disabled
       */
      disabled: {
        type: Boolean
      },
      /**
       * button label
       */
      label: {
        type: String
      },
      /**
       * is media playing
       */
      playing: {
        type: Boolean
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.

   */
  static get tag() {
    return "a11y-media-play-button";
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          opacity: 1;
          transition: opacity 0.5s;
        }
        :host([disabled]),
        :host([elapsed]) {
          opacity: 0;
        }
        :host,
        #thumbnail,
        #background,
        #button {
          width: 100%;
          top: 0;
          left: 0;
          opacity: 1;
          transition: opacity 0.5s;
        }
        #thumbnail,
        #background,
        #button {
          position: absolute;
          height: 100%;
          padding: 0;
          margin: 0;
          border: none;
        }
        #thumbnail {
          height: auto;
          overflow: hidden;
        }
        #button {
          overflow: hidden;
          background: transparent;
        }
        #button:hover {
          cursor: pointer;
        }
        #background {
          opacity: 0.3;
          background: var(--a11y-play-button-bg-color);
        }
        #button:focus #background,
        #button:hover #background {
          background: var(--a11y-play-button-focus-bg-color);
          opacity: 0.1;
        }
        #arrow {
          stroke: #ffffff;
          fill: #000000;
        }
        #text {
          fill: #ffffff;
        }
        .sr-only {
          font-size: 0;
        }
        paper-tooltip:not(:defined) {
          display: none;
        }
        @media print {
          :host(:not([thumbnail-src])),
          #background,
          #svg {
            display: none;
          }
        }
      `
    ];
  }

  //render function 
  render() {
    return html`
      <button
        id="button"
        aria-pressed="${this.playing ? 'true' : 'false'}"
        aria-hidden="${this.disabled ? 'true' : 'false'}"
        controls="video"
        label="${this.label}"
        tabindex="0"
        @click="${this._handleButtonClick}"
        ?disabled="${this.disabled}"
      >
        <svg
          id="svg"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          width="30%"
          height="30%"
          opacity="0.7"
        >
          <g>
            <polygon
              id="arrow"
              points="30,20 30,180 170,100"
              fill="#000000"
              stroke="#ffffff"
              stroke-width="15px"
            ></polygon>
            <text
              id="text"
              class="sr-only"
              x="50"
              y="115"
              fill="#ffffff"
              font-size="30px"
            >
              ${this.label}
            </text>
          </g>
        </svg>
      </button>
    `;
  }

  constructor(){
    super();
    this.action = null;
    this.disabled = false;
    this.label = "";
    this.__playing = false;
    import("@polymer/paper-tooltip/paper-tooltip.js");
  }

  /**
   * handle button tap
   */
  _handleButtonClick(e) {
    this.dispatchEvent(new CustomEvent("controls-change", { detail: this }));
  }
}
window.customElements.define(A11yMediaPlayButton.tag, A11yMediaPlayButton);
export { A11yMediaPlayButton };
