import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { AppLocalizeBehavior } from "@polymer/app-localize-behavior/app-localize-behavior.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
import { encapScript, wipeSlot } from "@lrnwebcomponents/utils/utils.js";
import "@polymer/marked-element/marked-element.js";
/**
`eco-json-schema-tabs` takes in a JSON schema of type array and builds a form,
exposing a `value` property that represents an array described by the schema.

Please see the `eco-json-schema-object` documentation for further information.

@group eco Elements
@element eco-json-schema-tabs
* @demo demo/index.html
*/
class EcoJsonSchemaMarkup extends mixinBehaviors(
  [AppLocalizeBehavior],
  PolymerElement
) {
  static get tag() {
    return "eco-json-schema-markup";
  }
  static get template() {
    return html`
      <style include="iron-flex iron-flex-alignment">
        :host {
          color: var(--eco-json-form-color);
          background-color: var(--eco-json-form-bg);
          font-family: var(--eco-json-form-font-family);
        }
        :host ([hidden]) {
          display: none;
        }
      </style>
      <div class="markup">
        <slot></slot>
      </div>
    `;
  }
  static get properties() {
    return {
      value: {
        type: String,
        notify: true,
        value: ""
      }
    };
  }
  /**
   * render the markup requested
   */
  _valueChanged(newValue) {
    // clear self
    wipeSlot(this);
    // sanity check to ditch scripts
    let html = encapScript(newValue);
    let frag = document.createRange().createContextualFragment(html);
    // self apend to flow into slot and show up
    this.appendChild(frag);
  }
}
window.customElements.define(EcoJsonSchemaMarkup.tag, EcoJsonSchemaMarkup);
export { EcoJsonSchemaMarkup };
