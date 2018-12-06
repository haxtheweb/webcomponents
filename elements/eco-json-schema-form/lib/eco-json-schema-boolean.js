import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "@polymer/paper-checkbox/paper-checkbox.js";
Polymer({
  is: "eco-json-schema-boolean",
  _template: html`
    <style is="custom-style" include="iron-flex iron-flex-alignment">
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
      checked="{{value}}"
      invalid="[[error]]"
      >[[_label]]</paper-checkbox
    >
  `,
  properties: {
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
  },
  ready: function() {},
  detached: function() {},
  _schemaChanged: function() {
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
      return type.indexOf("boolean") !== -1;
    } else {
      return type === "boolean";
    }
  },
  _isSchemaNumber: function(type) {
    if (Array.isArray(type)) {
      return type.indexOf("number") !== -1 || type.indexOf("integer") !== -1;
    } else {
      return type === "number" || type === "integer";
    }
  },
  _isSchemaString: function(type) {
    if (Array.isArray(type)) {
      return type.indexOf("string") !== -1;
    } else {
      return type === "string";
    }
  },
  _isSchemaObject: function(type) {
    return type === "object";
  },
  _isSchemaArray: function(type) {
    return type === "array";
  }
});
