/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "./lib/hex-a-gon.js";
/**
  * `hexagon-loader`
  * @element hexagon-loader
  * `a simple element that is for showing something is loading`
  *
  *
 
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
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: center;
          margin: 0 auto;
          padding: 0 0 0 0 !important;
          width: var(--hexagon-loader-width, 255px);
          height: var(--hexagon-loader-height, 232.5px);
        }

        :host([size="small"]) {
          width: calc(0.5 * var(--hexagon-loader-width, 255px));
          height: calc(0.5 * var(--hexagon-loader-height, 232.5px));
        }

        :host([size="large"]) {
          width: calc(1.25 * var(--hexagon-loader-width, 255px));
          height: calc(1.25 * var(--hexagon-loader-height, 232.5px));
        }

        :host([size="epic"]) {
          width: calc(2.5 * var(--hexagon-loader-width, 255px));
          height: calc(2.5 * var(--hexagon-loader-height, 232.5px));
        }

        div {
          position: relative;
          margin: 0 auto;
          flex: 1 1 100%;
          width: 100%;
        }

        hex-a-gon {
          display: none;
          position: absolute;
          top: 9px;
          left: 15px;
          width: var(--hexagon-width, 30px);
          height: var(--hexagon-height, 18px);
          color: #9fb475;
          -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
          -webkit-transform-origin: 0 0;
          transform-origin: 0 0;
        }

        :host([size="small"]) hex-a-gon {
          --hexagon-width: calc(0.5 * 30px);
          --hexagon-height: calc(0.5 * 18px);
          top: calc(0.1 * 9px);
          left: calc(0.5 * 15px);
        }

        :host([size="large"]) hex-a-gon {
          --hexagon-width: calc(1.25 * 30px);
          --hexagon-height: calc(1.25 * 18px);
          top: calc(1.5 * 9px);
          left: calc(1.25 * 15px);
        }

        :host([size="epic"]) hex-a-gon {
          --hexagon-width: calc(2.5 * 30px);
          --hexagon-height: calc(2.5 * 18px);
          top: calc(4 * 9px);
          left: calc(2.5 * 15px);
        }

        hex-a-gon:nth-of-type(1) {
          display: block;
          margin-left: calc(100% * 1.5 / 7);
          margin-top: 0%;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0s;
          animation-delay: 0s;
        }

        hex-a-gon:nth-of-type(2) {
          display: block;
          margin-left: calc(100% * 2.5 / 7);
          margin-top: 0%;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.05s;
          animation-delay: 0.05s;
        }

        hex-a-gon:nth-of-type(3) {
          display: block;
          margin-left: calc(100% * 3.5 / 7);
          margin-top: 0%;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s;
        }

        hex-a-gon:nth-of-type(4) {
          display: block;
          margin-left: calc(100% * 4.5 / 7);
          margin-top: 0%;
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.15s;
          animation-delay: 0.15s;
        }

        hex-a-gon:nth-of-type(5) {
          display: block;
          margin-left: calc(100% * 1 / 7);
          margin-top: calc(100% * 1 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0s;
          animation-delay: 0s;
        }

        hex-a-gon:nth-of-type(6) {
          display: block;
          margin-left: calc(100% * 2 / 7);
          margin-top: calc(100% * 1 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.05s;
          animation-delay: 0.05s;
        }

        hex-a-gon:nth-of-type(7) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 3 / 7));
          margin-top: calc(100% * 1 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s;
        }

        hex-a-gon:nth-of-type(8) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 4 / 7));
          margin-top: calc(100% * 1 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.15s;
          animation-delay: 0.15s;
        }

        hex-a-gon:nth-of-type(9) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 5 / 7));
          margin-top: calc(100% * 1 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s;
        }

        hex-a-gon:nth-of-type(10) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 0.5 / 7));
          margin-top: calc(100% * 2 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0s;
          animation-delay: 0s;
        }

        hex-a-gon:nth-of-type(11) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 1.5 / 7));
          margin-top: calc(100% * 2 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.05s;
          animation-delay: 0.05s;
        }

        hex-a-gon:nth-of-type(12) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 2.5 / 7));
          margin-top: calc(100% * 2 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s;
        }

        hex-a-gon:nth-of-type(13) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 3.5 / 7));
          margin-top: calc(100% * 2 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.15s;
          animation-delay: 0.15s;
        }

        hex-a-gon:nth-of-type(14) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 4.5 / 7));
          margin-top: calc(100% * 2 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s;
        }

        hex-a-gon:nth-of-type(15) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 5.5 / 7));
          margin-top: calc(100% * 2 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.25s;
          animation-delay: 0.25s;
        }

        hex-a-gon:nth-of-type(16) {
          display: block;
          margin-left: 0%;
          margin-top: calc(100% * 3 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0s;
          animation-delay: 0s;
        }

        hex-a-gon:nth-of-type(17) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 1 / 7));
          margin-top: calc(100% * 3 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.05s;
          animation-delay: 0.05s;
        }

        hex-a-gon:nth-of-type(18) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 2 / 7));
          margin-top: calc(100% * 3 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s;
        }

        hex-a-gon:nth-of-type(19) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 3 / 7));
          margin-top: calc(100% * 3 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.15s;
          animation-delay: 0.15s;
        }

        hex-a-gon:nth-of-type(20) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 4 / 7));
          margin-top: calc(100% * 3 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s;
        }

        hex-a-gon:nth-of-type(21) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 5 / 7));
          margin-top: calc(100% * 3 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.25s;
          animation-delay: 0.25s;
        }

        hex-a-gon:nth-of-type(22) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 6 / 7));
          margin-top: calc(100% * 3 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.3s;
          animation-delay: 0.3s;
        }

        hex-a-gon:nth-of-type(23) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 0.5 / 7));
          margin-top: calc(100% * 4 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0s;
          animation-delay: 0s;
        }

        hex-a-gon:nth-of-type(24) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 1.5 / 7));
          margin-top: calc(100% * 4 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.05s;
          animation-delay: 0.05s;
        }

        hex-a-gon:nth-of-type(25) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 2.5 / 7));
          margin-top: calc(100% * 4 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s;
        }

        hex-a-gon:nth-of-type(26) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 3.5 / 7));
          margin-top: calc(100% * 4 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.15s;
          animation-delay: 0.15s;
        }

        hex-a-gon:nth-of-type(27) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 4.5 / 7));
          margin-top: calc(100% * 4 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s;
        }

        hex-a-gon:nth-of-type(28) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 5.5 / 7));
          margin-top: calc(100% * 4 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.25s;
          animation-delay: 0.25s;
        }

        hex-a-gon:nth-of-type(29) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 1 / 7));
          margin-top: calc(100% * 5 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0s;
          animation-delay: 0s;
        }

        hex-a-gon:nth-of-type(30) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 2 / 7));
          margin-top: calc(100% * 5 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.05s;
          animation-delay: 0.05s;
        }

        hex-a-gon:nth-of-type(31) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 3 / 7));
          margin-top: calc(100% * 5 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s;
        }

        hex-a-gon:nth-of-type(32) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 4 / 7));
          margin-top: calc(100% * 5 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.15s;
          animation-delay: 0.15s;
        }

        hex-a-gon:nth-of-type(33) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 5 / 7));
          margin-top: calc(100% * 5 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.2s;
          animation-delay: 0.2s;
        }

        hex-a-gon:nth-of-type(34) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 1.5 / 7));
          margin-top: calc(100% * 6 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0s;
          animation-delay: 0s;
        }

        hex-a-gon:nth-of-type(35) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 2.5 / 7));
          margin-top: calc(100% * 6 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.05s;
          animation-delay: 0.05s;
        }

        hex-a-gon:nth-of-type(36) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 3.5 / 7));
          margin-top: calc(100% * 6 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.1s;
          animation-delay: 0.1s;
        }

        hex-a-gon:nth-of-type(37) {
          display: block;
          margin-left: var(--hexagon-margin-left, calc(100% * 4.5 / 7));
          margin-top: calc(100% * 6 / 7);
          -webkit-animation: scaleIt 1.5s ease-in-out infinite both;
          animation: scaleIt 1.5s ease-in-out infinite both;
          -webkit-animation-delay: 0.15s;
          animation-delay: 0.15s;
        }

        :host([item-count="1"]) hex-a-gon:nth-of-type(1),
        :host([item-count="3"]) hex-a-gon:nth-of-type(2) {
          margin-left: calc(100% * 3 / 7);
        }

        :host([item-count="2"]) hex-a-gon:nth-of-type(1) {
          margin-left: calc(100% * 2.5 / 7);
        }

        :host([item-count="2"]) hex-a-gon:nth-of-type(2) {
          margin-left: calc(100% * 3.5 / 7);
        }

        :host([item-count="3"]) hex-a-gon:nth-of-type(1) {
          margin-left: calc(100% * 2 / 7);
        }

        :host([item-count="3"]) hex-a-gon:nth-of-type(3) {
          margin-left: calc(100% * 4 / 7);
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
      `,
    ];
  }

  // render function
  render() {
    return html` <div>
      ${this.items.map((item) => html`<hex-a-gon></hex-a-gon>`)}
    </div>`;
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
        reflect: true,
      },
      /**
       * The relative size of this loader. Options small, medium, large
       */
      size: {
        name: "size",
        type: String,
        reflect: true,
      },
      /**
       * Loading state
       */
      loading: {
        name: "loading",
        type: Boolean,
        reflect: true,
      },
      items: {
        name: "items",
        type: Array,
      },
      /**
       * Count of the items
       */
      itemCount: {
        name: "itemCount",
        type: Number,
        reflect: true,
        attribute: "item-count",
      },
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
        let ctr = -4,
          increment = 255 / 7,
          height = 0,
          order = 0,
          rownum = 0,
          offset = 0;
        [4, 5, 6, 7, 6, 5, 4].forEach((row, i) => {
          ctr += row;
          if (this.itemCount >= ctr) {
            height = increment * (i + 1);
            order = this.itemCount - ctr;
            rownum = i + 1;
          }
        });
        offset = rownum > 3 ? 4 : rownum > 2 ? 3 : rownum > 1 ? 2 : 1;
        this.style.setProperty("--hexagon-loader-height", `${height}px`);
      }
    });
  }

  /**
   * Color changed
   */
  _colorChanged(newValue, oldValue) {
    if (newValue && globalThis.ShadyCSS) {
      globalThis.ShadyCSS.styleSubtree(this, { "--hexagon-color": newValue });
    }
  }
}
customElements.define(HexagonLoader.tag, HexagonLoader);
export { HexagonLoader };
