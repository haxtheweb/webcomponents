/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { A11yMediaBehaviors } from "./a11y-media-behaviors.js";
import "@polymer/paper-tooltip/paper-tooltip.js";

export { A11yMediaPlayButton };
/**
 * `a11y-media-play-button`
 * `A giant play button that overlays the media in a11y-media-player.`
 *
 * @microcopy - language worth noting:
```
Custom styles:
--a11y-play-button-bg-color: overlay background color, default is #000000
--a11y-play-button-focus-bg-color: overlay background color, default is --a11y-play-button-bg-color```
 *
 * @extends A11yMediaBehaviors
 * @customElement
 * @polymer
 */
class A11yMediaPlayButton extends A11yMediaBehaviors {
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * is button action to send as an event
       */
      action: {
        type: String,
        value: null
      },
      /**
       * is button disabled
       */
      disabled: {
        type: Boolean,
        value: false
      },
      /**
       * is media playing
       */
      playing: {
        type: Boolean,
        value: false
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "a11y-media-play-button";
  }

  //get player-specifc properties
  static get behaviors() {
    return [A11yMediaBehaviors];
  }

  //render function
  static get template() {
    return html`
      <style>
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
        :host #thumbnail,
        :host #background,
        :host #button {
          width: 100%;
          top: 0;
          left: 0;
          opacity: 1;
          transition: opacity 0.5s;
        }
        :host #thumbnail,
        :host #background,
        :host #button {
          position: absolute;
          height: 100%;
          padding: 0;
          margin: 0;
          border: none;
        }
        :host #thumbnail {
          height: auto;
          overflow: hidden;
        }
        :host #button {
          overflow: hidden;
          background: transparent;
        }
        :host #button:hover {
          cursor: pointer;
        }
        :host #background {
          opacity: 0.3;
          background: var(--a11y-play-button-bg-color);
        }
        :host #button:focus #background,
        :host #button:hover #background {
          background: var(--a11y-play-button-focus-bg-color);
          opacity: 0.1;
        }
        :host #arrow {
          stroke: #ffffff;
          fill: #000000;
        }
        :host #text {
          fill: #ffffff;
        }
        :host .sr-only {
          font-size: 0;
        }
        @media print {
          :host(:not([thumbnail-src])),
          :host #background,
          :host #svg {
            display: none;
          }
        }
      </style>
      <button
        id="button"
        aria-pressed$="[[playing]]"
        aria-hidden$="[[disabled]]"
        controls="video"
        disabled$="[[disabled]]"
        label="[[playPause.label]]"
        on-tap="_buttonTap"
        tabindex="0"
        title$="[[label]]"
      >
        <svg
          id="svg"
          aria-hidden
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
              [[playPause.label]]
            </text>
          </g>
        </svg>
      </button>
      <iron-a11y-keys
        id="a11y"
        keys="enter space"
        target$="[[__target]]"
        on-keys-pressed="_buttonTap"
      ></iron-a11y-keys>
    `;
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.$.text.innerText = this.playLabel;
  }

  /**
   * sets target for a11y keys
   */
  ready() {
    super.ready();
    this.target = this.$.button;
  }

  /**
   * handle button tap
   */
  _buttonTap() {
    let root = this;
    root.dispatchEvent(new CustomEvent("controls-change", { detail: this }));
  }
}
window.customElements.define(A11yMediaPlayButton.tag, A11yMediaPlayButton);
