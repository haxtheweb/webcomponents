import { LitElement, html, css } from "lit";
import { HAXStore } from "./hax-store.js";
import { haxElementToNode } from "@lrnwebcomponents/utils/utils.js";
import { IntersectionObserverMixin } from "@lrnwebcomponents/intersection-element/lib/IntersectionObserverMixin.js";
export class HaxElementDemo extends IntersectionObserverMixin(LitElement) {
  static tag = 'hax-element-demo';
  constructor() {
    super();
    this.tagName = null;
    this.activeSchema = -1;
  }
  static get properties() {
    return {
      ...super.properties,
      tagName: { type: String, attribute: "tag-name" },
      activePickerSchema: { type: Number, attribute: "active-picker-schema"},
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
        // support for active element being run through for a conversion
        if (this.activePickerSchema !== -1 && document.querySelector("hax-picker") && document.querySelector("hax-picker")?._elements.length > 0) {
          // bc of data rendering we need to get full schema from source
          // this is bizarre looking for sure but we template stamp
          // the element into the modal and so it's globlly available at this time
          // the element also has prebuilt all of the known valid transformations
          // so instead of rebuilding and finding ours again we can just set the active
          // index to what it was at render time
          el = haxElementToNode(document.querySelector('hax-picker')._elements[this.activePickerSchema]);
        }
        else if (schema.gizmo.tag && schema.demoSchema && schema.demoSchema[0]) {
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