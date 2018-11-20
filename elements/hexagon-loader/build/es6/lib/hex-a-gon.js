export { Hexagon };
class Hexagon extends HTMLElement {
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
  static get tag() {
    return "hex-a-gon";
  }
  constructor(delayRender = !1) {
    super();
    this.tag = Hexagon.tag;
    this._queue = [];
    this.template = document.createElement("template");
    this.attachShadow({ mode: "open" });
    if (!delayRender) {
      this.render();
    }
  }
  connectedCallback() {
    if (window.ShadyCSS) {
      window.ShadyCSS.styleElement(this);
    }
    if (this._queue.length) {
      this._processQueue();
    }
  }
  _copyAttribute(name, to) {
    const recipients = this.shadowRoot.querySelectorAll(to),
      value = this.getAttribute(name),
      fname = null == value ? "removeAttribute" : "setAttribute";
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
    this.shadowRoot.appendChild(this.template.content.cloneNode(!0));
  }
}
window.customElements.define(Hexagon.tag, Hexagon);
