/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "./lib/hex-a-gon.js";
/**
 * `hexagon-loader`
 * `a simple element that is for showing something is loading`
 *
 *
 * @customElement
 * @demo demo/index.html
 */
class HexagonLoader extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: none;
        }
        :host([hidden]) {
          display: none;
        }
        :host([loading]) {
          display: block;
        }
        :host([size="small"]) {
          transform: scale(0.5, 0.5);
          -webkit-transform: scale(0.5, 0.5);
          -moz-transform: scale(0.5, 0.5);
          -ms-transform: scale(0.5, 0.5);
          -o-transform: scale(0.5, 0.5);
        }
        :host([size="large"]) {
          transform: scale(1.25, 1.25);
          -webkit-transform: scale(1.25, 1.25);
          -moz-transform: scale(1.25, 1.25);
          -ms-transform: scale(1.25, 1.25);
          -o-transform: scale(1.25, 1.25);
        }
        :host([size="epic"]) {
          transform: scale(2.5, 2.5);
          -webkit-transform: scale(2.5, 2.5);
          -moz-transform: scale(2.5, 2.5);
          -ms-transform: scale(2.5, 2.5);
          -o-transform: scale(2.5, 2.5);
        }

        div {
          position: relative;
          width: 255px;
          height: 232.5px;
          margin: 0 auto;
        }

        hex-a-gon {
          display: none;
          position: absolute;
          top: 50%;
          left: 50%;
          width: 30px;
          height: 18px;
          color: #9fb475;
          -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
        }

        hex-a-gon:nth-of-type(1) {
          display: block;
          margin-left: -56.25px;
          margin-top: -97.875px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0s;
          animation-delay: 0s;
        }
        hex-a-gon:nth-of-type(2) {
          display: block;
          margin-left: -18.75px;
          margin-top: -97.875px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.05s;
          animation-delay: 0.05s;
        }
        hex-a-gon:nth-of-type(3) {
          display: block;
          margin-left: 18.75px;
          margin-top: -97.875px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s;
        }
        hex-a-gon:nth-of-type(4) {
          display: block;
          margin-left: 56.25px;
          margin-top: -97.875px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.15s;
          animation-delay: 0.15s;
        }
        hex-a-gon:nth-of-type(5) {
          display: block;
          margin-left: -75px;
          margin-top: -65.25px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0s;
          animation-delay: 0s;
        }
        hex-a-gon:nth-of-type(6) {
          display: block;
          margin-left: -37.5px;
          margin-top: -65.25px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.05s;
          animation-delay: 0.05s;
        }
        hex-a-gon:nth-of-type(7) {
          display: block;
          margin-left: 0px;
          margin-top: -65.25px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s;
        }
        hex-a-gon:nth-of-type(8) {
          display: block;
          margin-left: 37.5px;
          margin-top: -65.25px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.15s;
          animation-delay: 0.15s;
        }
        hex-a-gon:nth-of-type(9) {
          display: block;
          margin-left: 75px;
          margin-top: -65.25px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s;
        }
        hex-a-gon:nth-of-type(10) {
          display: block;
          margin-left: -93.75px;
          margin-top: -32.625px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0s;
          animation-delay: 0s;
        }
        hex-a-gon:nth-of-type(11) {
          display: block;
          margin-left: -56.25px;
          margin-top: -32.625px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.05s;
          animation-delay: 0.05s;
        }
        hex-a-gon:nth-of-type(12) {
          display: block;
          margin-left: -18.75px;
          margin-top: -32.625px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s;
        }
        hex-a-gon:nth-of-type(13) {
          display: block;
          margin-left: 18.75px;
          margin-top: -32.625px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.15s;
          animation-delay: 0.15s;
        }
        hex-a-gon:nth-of-type(14) {
          display: block;
          margin-left: 56.25px;
          margin-top: -32.625px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s;
        }
        hex-a-gon:nth-of-type(15) {
          display: block;
          margin-left: 93.75px;
          margin-top: -32.625px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.25s;
          animation-delay: 0.25s;
        }
        hex-a-gon:nth-of-type(16) {
          display: block;
          margin-left: -112.5px;
          margin-top: 0px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0s;
          animation-delay: 0s;
        }
        hex-a-gon:nth-of-type(17) {
          display: block;
          margin-left: -75px;
          margin-top: 0px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.05s;
          animation-delay: 0.05s;
        }
        hex-a-gon:nth-of-type(18) {
          display: block;
          margin-left: -37.5px;
          margin-top: 0px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s;
        }
        hex-a-gon:nth-of-type(19) {
          display: block;
          margin-left: 0px;
          margin-top: 0px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.15s;
          animation-delay: 0.15s;
        }
        hex-a-gon:nth-of-type(20) {
          display: block;
          margin-left: 37.5px;
          margin-top: 0px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s;
        }
        hex-a-gon:nth-of-type(21) {
          display: block;
          margin-left: 75px;
          margin-top: 0px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.25s;
          animation-delay: 0.25s;
        }
        hex-a-gon:nth-of-type(22) {
          display: block;
          margin-left: 112.5px;
          margin-top: 0px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.3s;
          animation-delay: 0.3s;
        }
        hex-a-gon:nth-of-type(23) {
          display: block;
          margin-left: -93.75px;
          margin-top: 32.625px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0s;
          animation-delay: 0s;
        }
        hex-a-gon:nth-of-type(24) {
          display: block;
          margin-left: -56.25px;
          margin-top: 32.625px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.05s;
          animation-delay: 0.05s;
        }
        hex-a-gon:nth-of-type(25) {
          display: block;
          margin-left: -18.75px;
          margin-top: 32.625px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s;
        }
        hex-a-gon:nth-of-type(26) {
          display: block;
          margin-left: 18.75px;
          margin-top: 32.625px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.15s;
          animation-delay: 0.15s;
        }
        hex-a-gon:nth-of-type(27) {
          display: block;
          margin-left: 56.25px;
          margin-top: 32.625px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s;
        }
        hex-a-gon:nth-of-type(28) {
          display: block;
          margin-left: 93.75px;
          margin-top: 32.625px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.25s;
          animation-delay: 0.25s;
        }
        hex-a-gon:nth-of-type(29) {
          display: block;
          margin-left: -75px;
          margin-top: 65.25px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0s;
          animation-delay: 0s;
        }
        hex-a-gon:nth-of-type(30) {
          display: block;
          margin-left: -37.5px;
          margin-top: 65.25px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.05s;
          animation-delay: 0.05s;
        }
        hex-a-gon:nth-of-type(31) {
          display: block;
          margin-left: 0px;
          margin-top: 65.25px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s;
        }
        hex-a-gon:nth-of-type(32) {
          display: block;
          margin-left: 37.5px;
          margin-top: 65.25px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.15s;
          animation-delay: 0.15s;
        }
        hex-a-gon:nth-of-type(33) {
          display: block;
          margin-left: 75px;
          margin-top: 65.25px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s;
        }
        hex-a-gon:nth-of-type(34) {
          display: block;
          margin-left: -56.25px;
          margin-top: 97.875px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0s;
          animation-delay: 0s;
        }
        hex-a-gon:nth-of-type(35) {
          display: block;
          margin-left: -18.75px;
          margin-top: 97.875px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.05s;
          animation-delay: 0.05s;
        }
        hex-a-gon:nth-of-type(36) {
          display: block;
          margin-left: 18.75px;
          margin-top: 97.875px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s;
        }
        hex-a-gon:nth-of-type(37) {
          display: block;
          margin-left: 56.25px;
          margin-top: 97.875px;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.15s;
          animation-delay: 0.15s;
        }

        @-webkit-keyframes scaleIt {
          25%,
          100% {
            -webkit-transform: scale(1) translate(-50%, -50%);
            transform: scale(1) translate(-50%, -50%);
          }
          50% {
            -webkit-transform: scale(0) translate(-50%, -50%);
            transform: scale(0) translate(-50%, -50%);
          }
        }

        @keyframes scaleIt {
          25%,
          100% {
            -webkit-transform: scale(1) translate(-50%, -50%);
            transform: scale(1) translate(-50%, -50%);
          }
          50% {
            -webkit-transform: scale(0) translate(-50%, -50%);
            transform: scale(0) translate(-50%, -50%);
          }
        }
      `
    ];
  }
  // LitElement render function
  render() {
    return html`
      <div>
        ${this.items.map(
          item =>
            html`
              <hex-a-gon></hex-a-gon>
            `
        )}
      </div>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * Color to make the loader
       */
      color: {
        name: "color",
        type: String,
        reflect: true
      },
      /**
       * The relative size of this loader. Options small, medium, large
       */
      size: {
        name: "size",
        type: String,
        reflect: true
      },
      /**
       * Loading state
       */
      loading: {
        name: "loading",
        type: Boolean,
        reflect: true
      },
      items: {
        name: "items",
        type: Array
      },
      /**
       * Count of the items
       */
      itemCount: {
        name: "itemCount",
        type: Number,
        reflect: true,
        attribute: "item-count"
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "hexagon-loader";
  }
  /**
   * VanillaJS life cycle
   */
  constructor() {
    super();
    // default for a nice arrangement of items
    this.itemCount = 37;
    this.items = [];
  }
  /**
   * LitElement life cycle - properties changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "color") {
        this._colorChanged(this[propName], oldValue);
      }
      if (propName == "itemCount") {
        this.items = [];
        for (let i = 0; i < this[propName]; i++) {
          this.items.push("");
        }
      }
    });
  }
  /**
   * Color changed
   */
  _colorChanged(newValue, oldValue) {
    if (newValue && window.ShadyCSS) {
      window.ShadyCSS.styleSubtree(this, { "--hexagon-color": newValue });
    }
  }
}
window.customElements.define(HexagonLoader.tag, HexagonLoader);
export { HexagonLoader };
