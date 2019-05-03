/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "./lib/hex-a-gon.js";
export { HexagonLoader };
/**
 * `hexagon-loader`
 * `a simple element that is for showing something is loading`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class HexagonLoader extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style>
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
      </style>
      <div>
        <template is="dom-repeat" items="[[items]]">
          <hex-a-gon></hex-a-gon>
        </template>
      </div>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Color to make the loader
       */
      color: {
        name: "color",
        type: "String",
        observer: "_colorChanged",
        reflectToAttribute: true
      },
      /**
       * The relative size of this loader. Options small, medium, large
       */
      size: {
        name: "size",
        type: "String",
        reflectToAttribute: true
      },
      /**
       * Loading state
       */
      loading: {
        name: "loading",
        type: "Boolean",
        reflectToAttribute: true
      },
      /**
       * Count of the items
       */
      itemCount: {
        name: "itemCount",
        type: "Number",
        value: 37
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
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    let items = [];
    for (var i = 0; i < this.itemCount; i++) {
      items.push("");
    }
    this.set("items", items);
  }
  /**
   * Color changed
   */
  _colorChanged(newValue, oldValue) {
    if (newValue) {
      this.updateStyles({ "--hexagon-color": newValue });
    }
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(HexagonLoader.tag, HexagonLoader);
