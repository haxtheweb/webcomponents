import { LitElement, html, css} from "lit-element/lit-element.js";
import "../json-outline-schema.js";
import { wipeSlot, varGet, varExists } from "@lrnwebcomponents/utils/utils.js";
import "@lrnwebcomponents/dynamic-import-registry/dynamic-import-registry.js";

class JosRender extends LitElement {
  static get tag() {
    return 'jos-render';
  }
  constructor() {
    super();
    this.registry = window.DynamicImportRegistry.requestAvailability();
    if (window.WCAutoloadBasePath) {
      this.registry.basePath = window.WCAutoloadBasePath;
    }
    this.items = [];
  }
  static get styles() {
    return [css`
      :host {
        display: block;
      }
      .children {
        display: block;
        margin: 16px auto;
      }
      .children ::slotted(*) {
        display: inline-flex;
        min-width: var(--jos-render-width, 350px);
        width: var(--jos-render-width, 350px);
        margin: var(--jos-render-margin, 8px);
        padding: var(--jos-render-padding, 8px);
      }
    `];
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
        type: Array
      }
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
    changedProperties.forEach( async (oldValue, propName) => {
      if (propName == 'source') {
        let site = window.JSONOutlineSchema.requestAvailability();
        // load source
        if (await site.load(this[propName])) {
          this.items = [...site.items];
        }
      }
      if (propName == 'map' && this.map.path && this.map.tag) {
        // register
        this.registry.register({
          tag: this.map.tag,
          path: this.map.path
        });
        // load the definition
        this.registry.loadDefinition(this.map.tag);
        if (this.items.length > 0) {
          this.renderItems(this.items);
        }
      }
      if (propName == 'items') {
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
      setTimeout(() => {
        items.forEach((item) => {
          // create tag for the map
          let n = document.createElement(this.map.tag);
          for (var key in this.map.properties) {
            let value = this.map.properties[key];
            // complex transform capability for values that need processing
            // prior to being set
            if (value === true || value === false || value === null) {
              n[key] = value;
            }
            else if (value.transform && value.value && varExists(item, value.value)) {
              n[key] = value.transform(varGet(item, value.value), item);
            }
            // only set the value in the node IF we have a match in the item for data
            // odd trap but the transform case can potentially miss above and this then pass
            // which varExists requires value be a string
            else if (typeof value === 'string' && varExists(item, value)) {
              n[key] = varGet(item, value);
            }
            else {
              n[key] = value;
            }
          }
          this.appendChild(n);
        });      
      }, 0);
    }
  }
}
window.customElements.define(JosRender.tag, JosRender);
export { JosRender };