import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "@polymer/paper-checkbox/paper-checkbox.js";
class EcoJsonSchemaBoolean extends PolymerElement {
  static get tag() {
    return "eco-json-schema-boolean";
  }
  static get template() {
    return html`
      <style is="custom-style" include="iron-flex iron-flex-alignment">
        :host ([hidden]) {
          display: none;
        }
        paper-checkbox {
          color: #737373;
          padding: 2px;
          display: block;
          font-size: 16px;
          white-space: normal;
        }
      </style>

      <paper-checkbox
        id="checkbox"
        class="flex"
        hidden$="[[hidden]]"
        checked="{{value}}"
        invalid="[[error]]"
        >[[_label]]</paper-checkbox
      >
    `;
  }
  static get properties() {
    return {
      schema: {
        type: Object,
        observer: "_schemaChanged"
      },
      value: {
        type: Boolean,
        notify: true,
        value: false
      },
      error: {
        type: Boolean,
        value: false
      },
      _label: {
        type: String,
        notify: true,
        value: ""
      }
    };
  }
  _schemaChanged() {
    var schema = this.schema;
    var inputEl = this.$.checkbox;

    if (schema.component && schema.component.properties) {
      Object.keys(schema.component.properties).forEach(function(prop) {
        inputEl[prop] = schema.component.properties[prop];
      });
    }

    if (schema.title) {
      this._label = schema.title;
    }
  }
  _isSchemaValue(type) {
    return (
      this._isSchemaBoolean(type) ||
      this._isSchemaNumber(type) ||
      this._isSchemaString(type)
    );
  }
  _isSchemaBoolean(type) {
    if (Array.isArray(type)) {
      return type.indexOf("boolean") !== -1;
    } else {
      return type === "boolean";
    }
  }
  _isSchemaNumber(type) {
    if (Array.isArray(type)) {
      return type.indexOf("number") !== -1 || type.indexOf("integer") !== -1;
    } else {
      return type === "number" || type === "integer";
    }
  }
  _isSchemaString(type) {
    if (Array.isArray(type)) {
      return type.indexOf("string") !== -1;
    } else {
      return type === "string";
    }
  }
  _isSchemaObject(type) {
    return type === "object";
  }
  _isSchemaArray(type) {
    return type === "array";
  }
}
window.customElements.define(EcoJsonSchemaBoolean.tag, EcoJsonSchemaBoolean);
export { EcoJsonSchemaBoolean };
