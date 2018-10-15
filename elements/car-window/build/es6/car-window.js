import { props, withComponent } from "./node_modules/skatejs/dist/es/index.js";
import withLitHtml from "./node_modules/@skatejs/renderer-lit-html/dist/es/index.js";
import { html } from "./node_modules/lit-html/lit-html.js";
export { CarWindow };
class SkateJS extends withComponent(withLitHtml()) {}
class CarWindow extends SkateJS {
  render() {
    return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}

.tint-green {
  background-color: green;
}

.tint-clear {
  opacity: .7;
  background-color: grey;
}</style>
<h2>New car window</h2>
<div class="tint-${this.tint}">
    <div hidden="${this.manufacture}">${this.size}</div>
    <slot></slot>
</div>`;
  }
  static get properties() {
    return {
      tint: {
        name: "tint",
        type: "String",
        value: "clear",
        reflectToAttribute: !1,
        observer: !1
      },
      size: {
        name: "size",
        type: "Number",
        value: "1000",
        reflectToAttribute: !1,
        observer: !1
      },
      manufacture: {
        name: "manufacture",
        type: "Boolean",
        value: "",
        reflectToAttribute: !1,
        observer: !1
      }
    };
  }
  tag() {
    return "car-window";
  }
  constructor() {
    super();
    let obj = CarWindow.properties;
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (this.hasAttribute(p)) {
          this[p] = this.getAttribute(p);
        } else {
          this[p] = obj[p].value;
        }
      }
    }
  }
  static get props() {
    let obj = CarWindow.properties,
      simpleProps = {};
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        simpleProps[p] = obj[p].value;
      }
    }
    return simpleProps;
  }
  connected() {}
}
customElements.define("car-window", CarWindow);
