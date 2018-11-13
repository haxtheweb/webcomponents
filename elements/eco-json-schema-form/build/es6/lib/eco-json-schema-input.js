import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import { AppLocalizeBehavior } from "../node_modules/@polymer/app-localize-behavior/app-localize-behavior.js";
import "../node_modules/@polymer/paper-input/paper-input.js";
import "../node_modules/@polymer/paper-styles/typography.js";
Polymer({
  is: "eco-json-schema-input",
  _template: html`
    <style is="custom-style" include="iron-flex iron-flex-alignment">
      paper-input {
        padding: 2px;
        --paper-input-container-label: {
          white-space: normal;
          position: static;
          font-size: 16px;
          color: #212121;
        }
        --paper-input-container: {
          width: 100%;
        };
        --paper-input-container-input: {
          background-color: transparent;
          border: none;
        };
        --paper-input-container-shared-input-style: {
          width: 100%;
          background-color: transparent;
          border: none;
        };
      }
    </style>
    <paper-input id="input" class="flex" value="{{value}}" auto-validate></paper-input>  
`,
  behaviors: [AppLocalizeBehavior],
  properties: {
    language: { value: "en" },
    resources: {
      value: function() {
        return {};
      }
    },
    schema: { type: Object, observer: "_schemaChanged" },
    value: {
      type: String,
      notify: !0,
      value: function() {
        return "";
      }
    },
    error: { type: String, observer: "_errorChanged", value: null }
  },
  ready: function() {},
  detached: function() {},
  _schemaChanged: function() {
    var schema = this.schema,
      inputEl = this.$.input;
    if (schema.required) {
      inputEl.required = !0;
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
      if ("date-time" === schema.format) {
        inputEl.type = "datetime-local";
        inputEl.alwaysFloatLabel = !0;
      } else if ("date" === schema.format) {
        inputEl.type = "date";
      } else if ("email" === schema.format) {
        inputEl.type = "email";
      } else if ("hostname" === schema.format) {
        inputEl.type = "text";
      } else if ("ipv4" === schema.format) {
        inputEl.type = "text";
      } else if ("ipv6" === schema.format) {
        inputEl.type = "text";
      } else if ("uri" === schema.format) {
        inputEl.type = "url";
      } else {
        inputEl.type = "text";
      }
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
    inputEl.alwaysFloatLabel = !0;
    if (schema.title) {
      inputEl.label = schema.title;
    }
  },
  _errorChanged: function() {
    if (this.error) {
      this.$.input.errorMessage = this.error;
      this.$.input.invalid = !0;
    } else {
      this.$.input.invalid = !1;
      this.$.input.errorMessage = null;
    }
  },
  _isSchemaValue: function(type) {
    return (
      this._isSchemaBoolean(type) ||
      this._isSchemaNumber(type) ||
      this._isSchemaString(type)
    );
  },
  _isSchemaBoolean: function(type) {
    if (Array.isArray(type)) {
      return -1 !== type.indexOf("boolean");
    } else {
      return "boolean" === type;
    }
  },
  _isSchemaNumber: function(type) {
    if (Array.isArray(type)) {
      return -1 !== type.indexOf("number") || -1 !== type.indexOf("integer");
    } else {
      return "number" === type || "integer" === type;
    }
  },
  _isSchemaString: function(type) {
    if (Array.isArray(type)) {
      return -1 !== type.indexOf("string");
    } else {
      return "string" === type;
    }
  },
  _isSchemaObject: function(type) {
    return "object" === type;
  },
  _isSchemaArray: function(type) {
    return "array" === type;
  }
});
