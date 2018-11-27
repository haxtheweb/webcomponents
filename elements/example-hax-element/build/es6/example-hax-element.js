import { HAXWiring } from "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
export { ExampleHaxElement };
class ExampleHaxElement extends HTMLElement {
  get html() {
    return `
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`;
  }
  static get haxProperties() {
    return {
      canScale: !0,
      canPosition: !0,
      canEditSource: !1,
      gizmo: {
        title: "Example hax-element",
        description:
          "Provide an example to pick apart of a working HAX element",
        icon: "icons:android",
        color: "green",
        groups: ["Hax"],
        handles: [{ type: "todo:read-the-docs-for-usage" }],
        meta: { author: "You", owner: "Your Company" }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "title",
            description: "",
            inputMethod: "textfield",
            required: !1,
            icon: "icons:android"
          },
          {
            property: "available",
            description: "",
            inputMethod: "boolean",
            required: !1,
            icon: "icons:android"
          }
        ],
        advanced: []
      }
    };
  }
  static get properties() {
    return {
      title: {
        name: "title",
        type: "String",
        value: "My Example",
        reflectToAttribute: !1,
        observer: !1
      },
      available: {
        name: "available",
        type: "Boolean",
        value: "",
        reflectToAttribute: !1,
        observer: !1
      }
    };
  }
  static get tag() {
    return "example-hax-element";
  }
  constructor(delayRender = !1) {
    super();
    this.tag = ExampleHaxElement.tag;
    let obj = ExampleHaxElement.properties;
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
    this.HAXWiring = new HAXWiring();
    this.HAXWiring.setHaxProperties(
      ExampleHaxElement.haxProperties,
      ExampleHaxElement.tag,
      this
    );
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
window.customElements.define(ExampleHaxElement.tag, ExampleHaxElement);
