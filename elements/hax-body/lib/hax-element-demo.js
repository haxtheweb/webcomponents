import { LitElement, html, css } from "lit";
import { HAXStore } from "./hax-store.js";
import { haxElementToNode } from "@haxtheweb/utils/utils.js";
import { IntersectionObserverMixin } from "@haxtheweb/intersection-element/lib/IntersectionObserverMixin.js";
export class HaxElementDemo extends IntersectionObserverMixin(LitElement) {
  static get tag() {
    return "hax-element-demo";
  }
  constructor() {
    super();
    this.renderTag = null;
    this.activePickerSchema = -1;
  }
  static get properties() {
    return {
      ...super.properties,
      renderTag: { type: String, attribute: "render-tag" },
      activePickerSchema: { type: Number, attribute: "active-picker-schema" },
    };
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
          overflow: hidden;
          height: 150px;
          width: 150px;
        }
        div ::slotted(*) {
          transform: scale(0.4) translate(-75%, -75%);
          width: 500px;
          max-height: 300px;
        }
      `,
    ];
  }
  render() {
    return html` <div class="wrap">
      <slot></slot>
    </div>`;
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "renderTag" && this[propName]) {
        this.innerHTML = "";
        let schema = HAXStore.haxSchemaFromTag(this[propName]);
        var el;
        // support for active element being run through for a conversion
        if (
          this.activePickerSchema !== -1 &&
          globalThis.document.querySelector("hax-picker") &&
          globalThis.document.querySelector("hax-picker")._elements &&
          globalThis.document.querySelector("hax-picker")._elements.length > 0
        ) {
          // bc of data rendering we need to get full schema from source
          // this is bizarre looking for sure but we template stamp
          // the element into the modal and so it's globlly available at this time
          // the element also has prebuilt all of the known valid transformations
          // so instead of rebuilding and finding ours again we can just set the active
          // index to what it was at render time
          el = haxElementToNode(
            globalThis.document.querySelector("hax-picker")._elements[
              this.activePickerSchema
            ],
          );
        } else if (
          schema.gizmo.tag &&
          schema.demoSchema &&
          schema.demoSchema[0]
        ) {
          el = haxElementToNode(schema.demoSchema[0]);
        } else {
          el = globalThis.document.createElement(this[propName]);
        }
        this.appendChild(el);
      }
    });
  }
}

customElements.define(HaxElementDemo.tag, HaxElementDemo);
