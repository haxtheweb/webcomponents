define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js",
  "../node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js",
  "../node_modules/@polymer/paper-item/paper-item.js",
  "../node_modules/@polymer/paper-listbox/paper-listbox.js",
  "../node_modules/@polymer/iron-validatable-behavior/iron-validatable-behavior.js"
], function(
  _polymerLegacy,
  _ironFlexLayoutClasses,
  _paperDropdownMenu,
  _paperItem,
  _paperListbox,
  _ironValidatableBehavior
) {
  "use strict";
  function _templateObject_8ee32b10f1e411e8bd8eaf7090426072() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n  <style is="custom-style" include="iron-flex iron-flex-alignment">\n      paper-input {\n        --paper-input-container-label: {\n          white-space: normal;\n          position: static;\n          font-size: 22px;\n          color: #212121;\n        }\n      };\n\n      paper-dropdown-menu {\n        --paper-input-container-label: {\n          white-space: normal;\n          position: static;\n          font-size: 22px;\n          color: #212121;\n        }\n        --paper-dropdown-menu-button: {\n          padding: 2px;\n        }\n      }\n    </style>\n\n    <paper-dropdown-menu id="dropdown" class="layout horizontal vertical" value="{{value}}" required="">\n      <paper-dropdown-menu class="dropdown-content">\n        <paper-listbox slot="dropdown-content" selected="0">\n        <template is="dom-repeat" items="[[_items]]">\n          <paper-item class="flex" label="[[item]]">[[item]]</paper-item>\n        </template>\n        </paper-listbox>\n      </paper-dropdown-menu>\n    </paper-dropdown-menu>\n'
    ]);
    _templateObject_8ee32b10f1e411e8bd8eaf7090426072 = function _templateObject_8ee32b10f1e411e8bd8eaf7090426072() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_8ee32b10f1e411e8bd8eaf7090426072()
    ),
    is: "eco-json-schema-enum",
    behaviors: [_ironValidatableBehavior.IronValidatableBehavior],
    properties: {
      schema: { type: Object, observer: "_schemaChanged" },
      value: { type: String, notify: !0, value: null },
      error: { type: String, observer: "_errorChanged", value: null },
      _items: {
        type: Object,
        value: function value() {
          return {};
        }
      }
    },
    ready: function ready() {},
    detached: function detached() {},
    _schemaChanged: function _schemaChanged() {
      var schema = this.schema,
        inputEl = this.$.dropdown;
      if (schema.component && schema.component.properties) {
        Object.keys(schema.component.properties).forEach(function(prop) {
          inputEl[prop] = schema.component.properties[prop];
        });
      }
      this._items = schema.enum.filter(function(item) {
        return null !== item;
      });
      if (schema.title) {
        inputEl.label = schema.title;
      }
    },
    _errorChanged: function _errorChanged() {
      if (this.error) {
        this.$.dropdown.invalid = !0;
      } else {
        this.$.dropdown.invalid = !1;
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
