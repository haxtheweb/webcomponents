/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

export { Hexagon };
/**
 * `hex-a-gon`
 * `A simple CSS based hexagon`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @demo demo/index.html
 */
class Hexagon extends HTMLElement {
  // render function
  get html() {
    return `
<style>

:host([color="orange"]) .hex,
:host([color="orange"]) .hex:before,
:host([color="orange"]) .hex:after {
  background-color: orange;
}
:host([color="purple"]) .hex,
:host([color="purple"]) .hex:before,
:host([color="purple"]) .hex:after {
  background-color: purple;
}
:host([color="blue"]) .hex,
:host([color="blue"]) .hex:before,
:host([color="blue"]) .hex:after {
  background-color: blue;
}

.hex {
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
.hex:before, .hex:after {
  content: '';
  position: absolute;
  width: 30px;
  height: 18px;
}
.hex:before {
  -webkit-transform: rotate(60deg);
          transform: rotate(60deg);
}
.hex:after {
  -webkit-transform: rotate(-60deg);
          transform: rotate(-60deg);
}
</style>
    <div class="hex"></div>`;
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
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "hex-a-gon";
  }
  /**
   * life cycle
   */
  constructor(delayRender = false) {
    super();

    // set tag for later use
    this.tag = Hexagon.tag;
    // map our imported properties json to real props on the element
    // @notice static getter of properties is built via tooling
    let obj = Hexagon.properties;
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
window.customElements.define(Hexagon.tag, Hexagon);
