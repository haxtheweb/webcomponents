/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import "./lib/hex-a-gon.js";

export { HexagonLoader };
/**
 * `hexagon-loader`
 * `a simple VJS element that is for showing something is loading`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @demo demo/index.html
 */
class HexagonLoader extends HTMLElement {
  // render function
  get html() {
    return `
<style>:host {
  display: block;
   --hexagon-loader-color: orange;
}

:host([hidden]) {
  display: none;
}

.loader {
  position: relative;
  width: 255px;
  height: 232.5px;
  margin: 0 auto;
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
  25%,100% {
    -webkit-transform: scale(1) translate(-50%, -50%);
            transform: scale(1) translate(-50%, -50%);
  }
  50% {
    -webkit-transform: scale(0) translate(-50%, -50%);
            transform: scale(0) translate(-50%, -50%);
  }
}

@keyframes scaleIt {
  25%,100% {
    -webkit-transform: scale(1) translate(-50%, -50%);
            transform: scale(1) translate(-50%, -50%);
  }
  50% {
    -webkit-transform: scale(0) translate(-50%, -50%);
            transform: scale(0) translate(-50%, -50%);
  }
}</style>
<div class="loader">
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
    <hex-a-gon></hex-a-gon>
</div>`;
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
        value: "orange"
      },
      /**
       * The relative size of this loader. Options small, medium, large
       */
      size: {
        name: "size",
        type: "String",
        value: "medium"
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
   * life cycle
   */
  constructor(delayRender = false) {
    super();

    // set tag for later use
    this.tag = HexagonLoader.tag;
    // map our imported properties json to real props on the element
    // @notice static getter of properties is built via tooling
    // to edit modify src/HexagonLoader-properties.json
    let obj = HexagonLoader.properties;
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (this.hasAttribute(p)) {
          this[p] = this.getAttribute(p);
        } else {
          this.setAttribute(p, obj[p].value);
          this[p] = obj[p].value;
        }
      }
    }
    // optional queue for future use
    this._queue = [];
    this.template = document.createElement("template");

    this.attachShadow({ mode: "open" });

    if (!delayRender) {
      this.render();
    }
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    if (window.ShadyCSS) {
      window.ShadyCSS.styleElement(this);
    }

    if (this._queue.length) {
      this._processQueue();
    }
  }

  _copyAttribute(name, to) {
    const recipients = this.shadowRoot.querySelectorAll(to);
    const value = this.getAttribute(name);
    const fname = value == null ? "removeAttribute" : "setAttribute";
    for (const node of recipients) {
      node[fname](name, value);
    }
  }

  _queueAction(action) {
    this._queue.push(action);
  }

  _processQueue() {
    this._queue.forEach(action => {
      this[`_${action.type}`](action.data);
    });

    this._queue = [];
  }

  _setProperty({ name, value }) {
    this[name] = value;
  }

  render() {
    this.shadowRoot.innerHTML = null;
    this.template.innerHTML = this.html;

    if (window.ShadyCSS) {
      window.ShadyCSS.prepareTemplate(this.template, this.tag);
    }
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
  }

  //static get observedAttributes() {
  //  return [];
  //}
  // disconnectedCallback() {}
  // attributeChangedCallback(attr, oldValue, newValue) {}
}
window.customElements.define(HexagonLoader.tag, HexagonLoader);
