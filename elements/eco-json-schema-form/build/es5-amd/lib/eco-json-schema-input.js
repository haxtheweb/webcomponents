define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js",
  "../node_modules/@polymer/app-localize-behavior/app-localize-behavior.js",
  "../node_modules/@polymer/paper-input/paper-input.js",
  "../node_modules/@polymer/paper-styles/typography.js"
], function(_polymerLegacy, _ironFlexLayoutClasses, _appLocalizeBehavior) {
  "use strict";
  var $_documentContainer = document.createElement("div");
  $_documentContainer.setAttribute("style", "display: none;");
  $_documentContainer.innerHTML =
    '<dom-module id="eco-json-schema-input">\n\n  \n  \n\n  <template>\n    <style is="custom-style" include="iron-flex iron-flex-alignment">\n      paper-input {\n        padding: 2px;\n\n        --paper-input-container-label: {\n          white-space: normal;\n          position: static;\n          font-size: 16px;\n          color: #212121;\n        }\n      }\n    </style>\n\n    <paper-input id="input" class="flex" value="{{value}}" auto-validate="">\n\n    </paper-input>\n\n  </template>\n\n  \n\n</dom-module>';
  document.head.appendChild($_documentContainer);
  (0, _polymerLegacy.Polymer)({
    is: "eco-json-schema-input",
    behaviors: [_appLocalizeBehavior.AppLocalizeBehavior],
    properties: {
      language: { value: "en" },
      resources: {
        value: function value() {
          return {};
        }
      },
      schema: { type: Object, observer: "_schemaChanged" },
      value: {
        type: String,
        notify: !0,
        value: function value() {
          return "";
        }
      },
      error: { type: String, observer: "_errorChanged", value: null }
    },
    ready: function ready() {},
    detached: function detached() {},
    _schemaChanged: function _schemaChanged() {
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
    _errorChanged: function _errorChanged() {
      if (this.error) {
        this.$.input.errorMessage = this.error;
        this.$.input.invalid = !0;
      } else {
        this.$.input.invalid = !1;
        this.$.input.errorMessage = null;
      }
    },
    _isSchemaValue: function _isSchemaValue(type) {
      return (
        this._isSchemaBoolean(type) ||
        this._isSchemaNumber(type) ||
        this._isSchemaString(type)
      );
    },
    _isSchemaBoolean: function _isSchemaBoolean(type) {
      if (Array.isArray(type)) {
        return -1 !== type.indexOf("boolean");
      } else {
        return "boolean" === type;
      }
    },
    _isSchemaNumber: function _isSchemaNumber(type) {
      if (Array.isArray(type)) {
        return -1 !== type.indexOf("number") || -1 !== type.indexOf("integer");
      } else {
        return "number" === type || "integer" === type;
      }
    },
    _isSchemaString: function _isSchemaString(type) {
      if (Array.isArray(type)) {
        return -1 !== type.indexOf("string");
      } else {
        return "string" === type;
      }
    },
    _isSchemaObject: function _isSchemaObject(type) {
      return "object" === type;
    },
    _isSchemaArray: function _isSchemaArray(type) {
      return "array" === type;
    }
  });
});
