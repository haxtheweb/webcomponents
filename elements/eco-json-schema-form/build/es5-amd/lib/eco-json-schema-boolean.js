define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js",
  "../node_modules/@polymer/paper-checkbox/paper-checkbox.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_d6744e20ecf111e88a0b4725ebfbecff() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n<style is="custom-style" include="iron-flex iron-flex-alignment">\n      paper-checkbox {\n        color: #737373;\n        padding: 2px;\n        display: block;\n        font-size: 16px;\n        white-space: normal;\n    }\n    </style>\n\n    <paper-checkbox id="checkbox" class="flex" checked="{{value}}" invalid="[[error]]">[[_label]]</paper-checkbox>  \n'
    ]);
    _templateObject_d6744e20ecf111e88a0b4725ebfbecff = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    is: "eco-json-schema-boolean",
    _template: (0, _polymerLegacy.html)(
      _templateObject_d6744e20ecf111e88a0b4725ebfbecff()
    ),
    properties: {
      schema: { type: Object, observer: "_schemaChanged" },
      value: { type: Boolean, notify: !0, value: !1 },
      error: { type: Boolean, value: !1 },
      _label: { type: String, notify: !0, value: "" }
    },
    ready: function ready() {},
    detached: function detached() {},
    _schemaChanged: function _schemaChanged() {
      var schema = this.schema,
        inputEl = this.$.checkbox;
      if (schema.component && schema.component.properties) {
        Object.keys(schema.component.properties).forEach(function(prop) {
          inputEl[prop] = schema.component.properties[prop];
        });
      }
      if (schema.title) {
        this._label = schema.title;
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
