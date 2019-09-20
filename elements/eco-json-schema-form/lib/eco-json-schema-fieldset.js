import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { AppLocalizeBehavior } from "@polymer/app-localize-behavior/app-localize-behavior.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
/**
`eco-json-schema-fieldset` takes in a JSON schema of type fieldset and builds a form,
exposing a `value` property that represents an array described by the schema.

Please see the `eco-json-schema-object` documentation for further information.

@group eco Elements
@element eco-json-schema-fieldset
* @demo demo/index.html
*/
class EcoJsonSchemaFieldset extends mixinBehaviors(
  [AppLocalizeBehavior],
  PolymerElement
) {
  static get tag() {
    return "eco-json-schema-fieldset";
  }
  constructor() {
    super();
  }
  static get template() {
    return html`
      <style include="iron-flex iron-flex-alignment">
        :host {
          color: var(--eco-json-form-color);
          background-color: var(--eco-json-form-bg);
          font-family: var(--eco-json-form-font-family);
          margin-bottom: 15px;
        }
        :host ([hidden]) {
          display: none;
        }
        :host fieldset {
          border-radius: var(--eco-json-form-border-radius);
          border-style: solid;
          border-width: 1px;
          border-color: var(--eco-json-form-faded-color);
          transition: all 0.5s;
        }
        :host legend {
          transition: all 0.5s;
          color: var(--eco-json-form-faded-color);
        }
        :host fieldset:focus #legend,
        :host fieldset:focus-within #legend {
          color: var(--eco-json-form-active-color);
        }
        :host eco-json-schema-object {
          flex: 1 0 auto;
        }
      </style>
      <fieldset>
        <legend id="legend" class="flex" hidden\$="[[!schema.title]]">
          [[schema.title]]
        </legend>
        <div hidden$="[[!schema.description]]">[[item.description]]</div>
        <div class="item-fields"></div>
      </fieldset>
    `;
  }
  static get properties() {
    return {
      propertyName: {
        type: String,
        value: null
      },
      schema: {
        type: Object,
        value: {}
      }
    };
  }
  ready() {
    super.ready();
    this._schemaChanged();
  }
  /**
   * updates the array fields if the schema (which includes values) changes
   */
  _schemaChanged() {
    //make sure the content is there first
    afterNextRender(this, () => {
      this.shadowRoot
        .querySelectorAll(".item-fields")
        .forEach((item, index) => {
          let prefix = `${this.propertyName}`;
          this.dispatchEvent(
            new CustomEvent("build-fieldset", {
              bubbles: false,
              cancelable: true,
              composed: true,
              detail: {
                container: item,
                path: prefix,
                prefix: prefix,
                properties: this.schema.properties,
                type: EcoJsonSchemaFieldset.tag,
                value: this.schema.properties[index].value || {}
              }
            })
          );
        });
    });
  }
}
window.customElements.define(EcoJsonSchemaFieldset.tag, EcoJsonSchemaFieldset);
export { EcoJsonSchemaFieldset };
