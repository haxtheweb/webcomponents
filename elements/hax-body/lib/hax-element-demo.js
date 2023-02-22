import { LitElement, html, css } from "lit";
import { HAXStore } from "./hax-store.js";
import { haxElementToNode } from "@lrnwebcomponents/utils/utils.js";
import { IntersectionObserverMixin } from "@lrnwebcomponents/intersection-element/lib/IntersectionObserverMixin.js";
export class HaxElementDemo extends IntersectionObserverMixin(LitElement) {
  static get tag() {
    return "hax-element-demo";
  }
  constructor() {
    super();
    this.renderTag = null;
    this.shortcut = null;
    this.activeSchema = -1;
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
        .keyboard-shortcut {
            background-color: rgba(0, 0, 0, 0.1);
            border-radius: 0.25rem;
            color: rgba(0, 0, 0, 0.7);
            box-shadow: #d1d5db 0px -4px 0px inset, rgba(0, 0, 0, 0.4) 0px 1px 1px;
            padding: 0.25rem 0.5rem;
        }
      `,
    ];
  }
  render() {
    return html`
    <div>
      <kbd class="keyboard-shortcut">⌘ + Shift + ${this.shortcut}</kbd>
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
          document.querySelector("hax-picker") &&
          document.querySelector("hax-picker")._elements &&
          document.querySelector("hax-picker")._elements.length > 0
        ) {
          // bc of data rendering we need to get full schema from source
          // this is bizarre looking for sure but we template stamp
          // the element into the modal and so it's globlly available at this time
          // the element also has prebuilt all of the known valid transformations
          // so instead of rebuilding and finding ours again we can just set the active
          // index to what it was at render time
          el = haxElementToNode(
            document.querySelector("hax-picker")._elements[
              this.activePickerSchema
            ]
          );
        } else if (
          schema.gizmo.tag &&
          schema.demoSchema &&
          schema.demoSchema[0]
        ) {
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
