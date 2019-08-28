import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { AppLocalizeBehavior } from "@polymer/app-localize-behavior/app-localize-behavior.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
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
        <eco-json-schema-object
          id="schemaobject"
          controls$="item-[[index]]"
          item="[[index]]"
          autofocus$="[[autofocus]]"
          on-value-changed="_valueChanged"
          hide-line-numbers$="[[hideLineNumbers]]"
          schema="[[__validatedSchema]]"
          value="{{value}}"
        >
        </eco-json-schema-object>
      </fieldset>
    `;
  }
  static get properties() {
    return {
      /**
       * automatically set focus on the first field if that field has autofocus
       */
      autofocus: {
        type: Boolean,
        value: false
      },
      globalOptions: {
        type: Object,
        value: {
          icon: "settings",
          tooltip: "configure item"
        }
      },
      /**
       * hide code-editor line numbers
       */
      hideLineNumbers: {
        type: Boolean,
        value: false
      },
      title: {
        type: String
      },
      schema: {
        type: Object,
        notify: true,
        observer: "_schemaChanged"
      },
      value: {
        type: Array,
        notify: true,
        value: []
      },
      /**
       * Fields to conver to JSON Schema.
       */
      __validatedSchema: {
        type: Array,
        value: [],
        notify: true
      }
    };
  }
  /**
   * Handles data changes
   * @param {event} e the change event
   */
  _valueChanged(e) {
    /*console.log('_valueChanged','\nschema:',this.schema,'\nvalue:',this.value,'\nvalidated:',this.__validatedSchema);
    let root = this, items = this.__validatedSchema.items,
      val = {};
    if(items) for (let prop in items.properties) {
      val[prop] = items.properties[prop].value;
    }
    this.notifyPath("value.*");
    this.set("value", val);
    console.log('_valueChanged 2','\nschema:',this.schema,'\nvalue:',this.value,'\nvalidated:',this.__validatedSchema);
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: root
      })
    );*/
  }

  /**
   * fires when the fields array changes
   * @param {object} oldValue the old value
   * @param {object} newValue the new value
   */
  _schemaChanged(oldValue, newValue) {
    console.log("_schemaChanged");
    let root = this;
    //prevent a potential feedback loop
    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      this._setValues();
    }
    this.dispatchEvent(
      new CustomEvent("schema-changed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: root
      })
    );
  }
  /**
   * when either the fields or the value changes, updates the schema and form to match
   */
  _setValues() {
    /*let schema = [];
    console.log('_setValues','\nschema:',this.schema,'\nvalue:',this.value,'\nvalidated:',this.__validatedSchema);
    schema = JSON.parse(JSON.stringify(this.schema.items));
    for (let prop in this.value) {
      console.log('****** prop',prop,schema.properties[prop],this.value[prop]);
      if (schema.properties[prop])
        schema.properties[prop].value = this.value[prop];
    }
    this.notifyPath("__validatedSchema.*");
    this.__validatedSchema = schema;
    console.log('_setValues 2','\nschema:',this.schema,'\nvalue:',this.value,'\nvalidated:',this.__validatedSchema);*/
  }
}
window.customElements.define(EcoJsonSchemaFieldset.tag, EcoJsonSchemaFieldset);
export { EcoJsonSchemaFieldset };
