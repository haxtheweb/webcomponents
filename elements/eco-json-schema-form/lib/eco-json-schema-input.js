import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import { AppLocalizeBehavior } from "@polymer/app-localize-behavior/app-localize-behavior.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-styles/typography.js";
/**
`eco-json-schema-input` takes in a JSON schema of type number and string and
contains a `paper-input`, exposing a `value` property that represents the schema.

Validation is handled for strings and number/integers by mapping JSON schema
validation keywords to `paper-input` attributes; form elements will automatically
try and validate themselves as users provide input:

Please see the `eco-json-schema-object` documentation for further information.

@group eco Elements
@element eco-json-schema-input
* @demo demo/index.html
*/
class EcoJsonSchemaInput extends mixinBehaviors(
  [AppLocalizeBehavior],
  PolymerElement
) {
  static get tag() {
    return "eco-json-schema-input";
  }
  static get template() {
    return html`
      <custom-style>
        <style
          is="custom-style"
          include="iron-flex iron-flex-alignment"
        ></style>
      </custom-style>
      <paper-input
        id="input"
        class="flex"
        value="{{value}}"
        auto-validate
      ></paper-input>
    `;
  }

  static get properties() {
    return {
      language: {
        value: "en"
      },
      resources: {
        value() {
          return {};
        }
      },
      schema: {
        type: Object,
        observer: "_schemaChanged"
      },
      value: {
        type: String,
        notify: true,
        value() {
          return "";
        }
      },
      error: {
        type: String,
        observer: "_errorChanged",
        value: null
      }
    };
  }
  _schemaChanged() {
    var schema = this.schema;
    var inputEl = this.$.input;
    if (schema.required) {
      inputEl.required = true;
    }
    if (this._isSchemaNumber(schema.type)) {
      inputEl.type = "number";

      if (schema.multipleOf) {
        inputEl.step = schema.multipleOf;
      }

      if (!isNaN(schema.maximum)) {
        if (schema.exclusiveMaximum) {
          inputEl.max = schema.maximum - (schema.multipleOf || 1);
        } else {
          inputEl.max = schema.maximum;
        }
      }

      if (!isNaN(schema.minimum)) {
        if (schema.exclusiveMinimum) {
          inputEl.min = schema.minimum + (schema.multipleOf || 1);
        } else {
          inputEl.min = schema.minimum;
        }
      }
    }

    if (this._isSchemaString(schema.type)) {
      if (schema.format === "date-time") {
        inputEl.type = "datetime-local";
        inputEl.alwaysFloatLabel = true; // label doesn't float when value not set
      } else if (schema.format === "date") {
        inputEl.type = "date";
      } else if (schema.format === "email") {
        inputEl.type = "email";
      } else if (schema.format === "hostname") {
        inputEl.type = "text";
      } else if (schema.format === "ipv4") {
        inputEl.type = "text";
      } else if (schema.format === "ipv6") {
        inputEl.type = "text";
      } else if (schema.format === "uri") {
        inputEl.type = "url";
      } else {
        inputEl.type = "text";
      }

      /*
        if (schema.maxLength || schema.minLength) {
          inputEl.charCounter = true;
        }
       */

      if (schema.maxLength) {
        inputEl.maxlength = schema.maxLength;
      }

      if (schema.minLength) {
        inputEl.minlength = schema.minLength;
      }

      if (schema.pattern) {
        inputEl.pattern = schema.pattern;
      }
    }

    if (schema.component && schema.component.properties) {
      Object.keys(schema.component.properties).forEach(function(prop) {
        inputEl[prop] = schema.component.properties[prop];
      });
    }

    inputEl.alwaysFloatLabel = true; // label doesn't float when value not set

    if (schema.title) {
      inputEl.label = schema.title;
    }
  }
  _errorChanged() {
    if (this.error) {
      this.$.input.errorMessage = this.error;
      this.$.input.invalid = true;
    } else {
      this.$.input.invalid = false;
      this.$.input.errorMessage = null;
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
window.customElements.define(EcoJsonSchemaInput.tag, EcoJsonSchemaInput);
export { EcoJsonSchemaInput };
