import { LitElement, html, css } from "lit";
import "../json-outline-schema.js";
import { wipeSlot, valueMapTransform } from "@haxtheweb/utils/utils.js";
import "@haxtheweb/dynamic-import-registry/dynamic-import-registry.js";

class JosRender extends LitElement {
  static get tag() {
    return "jos-render";
  }
  constructor() {
    super();
    this.registry = globalThis.DynamicImportRegistry.requestAvailability();
    if (globalThis.WCGlobalBasePath) {
      this.registry.basePath = globalThis.WCGlobalBasePath;
    }
    this.items = [];
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        .children {
          display: block;
          margin: 16px auto;
        }
        .children ::slotted(*) {
          display: inline-flex;
          margin: var(--jos-render-margin, 8px);
          padding: var(--jos-render-padding, 8px);
        }
      `,
    ];
  }
  static get properties() {
    return {
      source: {
        type: String,
      },
      map: {
        type: Object,
      },
      items: {
        type: Array,
      },
    };
  }
  render() {
    return html`
      <div class="children">
        <slot></slot>
      </div>
    `;
  }
  updated(changedProperties) {
    changedProperties.forEach(async (oldValue, propName) => {
      if (propName == "source") {
        let site = globalThis.JSONOutlineSchema.requestAvailability();
        // load source
        if (await site.load(this[propName])) {
          this.items = [...site.items];
        }
      }
      if (propName == "map" && this.map.path && this.map.tag) {
        // register
        this.registry.register({
          tag: this.map.tag,
          path: this.map.path,
        });
        // load the definition
        this.registry.loadDefinition(this.map.tag);
        if (this.items.length > 0) {
          this.renderItems(this.items);
        }
      }
      if (propName == "items") {
        this.renderItems(this.items);
      }
    });
  }
  /**
   * Render any item list passed in and handle it via our map
   * Separate function to support dynamic property remapping
   */
  renderItems(items) {
    // ensure we have a map to render
    if (this.map && this.map.properties) {
      // wipe slot
      wipeSlot(this);
      let values = valueMapTransform(items, this.map.properties);
      values.forEach((item) => {
        let n = globalThis.document.createElement(this.map.tag);
        Object.assign(n, item);
        this.appendChild(n);
      });
    }
  }
}
customElements.define(JosRender.tag, JosRender);
export { JosRender };
