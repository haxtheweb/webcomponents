import { LitElement, html, css } from "lit";
import { HAXStore } from "./hax-store.js";
import { haxElementToNode } from "@lrnwebcomponents/utils/utils.js";
import { IntersectionObserverMixin } from "@lrnwebcomponents/intersection-element/lib/IntersectionObserverMixin.js";

export class HaxElementDemo extends IntersectionObserverMixin(LitElement) {
  static tag = 'hax-element-demo';
  constructor() {
    super();
    this.tagName = null;
  }
  static get properties() {
    return {
      ...super.properties,
      tagName: { type: String, attribute: "tag-name" }
    };
  }
  static get styles() {
    return [css`
      :host {
        display: block;
        overflow: hidden;
        max-width: 200px;
        max-height: 250px;
      }
    `];
  }
  render() {
    return html`<slot></slot>`;
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'tagName' && this[propName]) {
        this.innerHTML = '';
        let schema = HAXStore.haxSchemaFromTag(this[propName]);
        var el;
        if (schema.gizmo.tag && schema.demoSchema && schema.demoSchema[0]) {
          el = haxElementToNode(schema.demoSchema[0]);
        } else {
          el = document.createElement(this[propName]);
        }
        this.appendChild(el);
      }
    });
  }
}

customElements.define(HaxElementDemo.tag, HaxElementDemo);