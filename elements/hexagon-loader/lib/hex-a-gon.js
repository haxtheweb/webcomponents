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
 * @demo demo/hexagon.html
 */
class Hexagon extends HTMLElement {
  // render function
  get html() {
    return `
<style>
:host {
  display: inline-flex;
  position: relative;
  height: 36px;
  width: 36px;
}

:host div,
:host div:before,
:host div:after {
 background-color: var(--hexagon-color, orange);
}

div {
  width: 30px;
  height: 18px;
  margin: 9px 3px;
  position: absolute;
  color: var(--hexagon-color, orange);
}
div:before, div:after {
  content: '';
  position: absolute;
  width: 30px;
  height: 18px;
}
div:before {
  -webkit-transform: rotate(60deg);
          transform: rotate(60deg);
}
div:after {
  -webkit-transform: rotate(-60deg);
          transform: rotate(-60deg);
}
</style>
    <div></div>`;
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
}
window.customElements.define(Hexagon.tag, Hexagon);
