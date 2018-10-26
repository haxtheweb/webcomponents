import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "../node_modules/@polymer/paper-checkbox/paper-checkbox.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");
$_documentContainer.innerHTML = `<dom-module id="eco-json-schema-boolean">

  

  <template>
    <style is="custom-style" include="iron-flex iron-flex-alignment">
      paper-checkbox {
        color: #737373;
        padding: 2px;
        display: block;
        font-size: 16px;
        white-space: normal;
    }
    </style>

    <paper-checkbox id="checkbox" class="flex" checked="{{value}}" invalid="[[error]]">[[_label]]</paper-checkbox>

  </template>

  

</dom-module>`;
document.head.appendChild($_documentContainer);
Polymer({
  is: "eco-json-schema-boolean",
  properties: {
    schema: { type: Object, observer: "_schemaChanged" },
    value: { type: Boolean, notify: !0, value: !1 },
    error: { type: Boolean, value: !1 },
    _label: { type: String, notify: !0, value: "" }
  },
  ready: function() {},
  detached: function() {},
  _schemaChanged: function() {
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
