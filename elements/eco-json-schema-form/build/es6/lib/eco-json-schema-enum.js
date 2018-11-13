import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "../node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js";
import "../node_modules/@polymer/paper-item/paper-item.js";
import "../node_modules/@polymer/paper-listbox/paper-listbox.js";
import { IronValidatableBehavior } from "../node_modules/@polymer/iron-validatable-behavior/iron-validatable-behavior.js";
Polymer({
  _template: html`
  <style is="custom-style" include="iron-flex iron-flex-alignment">
      paper-input {
        --paper-input-container-label: {
          white-space: normal;
          position: static;
          font-size: 22px;
          color: #212121;
        }
      };

      paper-dropdown-menu {
        --paper-input-container-label: {
          white-space: normal;
          position: static;
          font-size: 22px;
          color: #212121;
        }
        --paper-dropdown-menu-button: {
          padding: 2px;
        }
      }
    </style>

    <paper-dropdown-menu id="dropdown" class="layout horizontal vertical" value="{{value}}" required="">
      <paper-dropdown-menu class="dropdown-content">
        <paper-listbox slot="dropdown-content" selected="0">
        <template is="dom-repeat" items="[[_items]]">
          <paper-item class="flex" label="[[item]]">[[item]]</paper-item>
        </template>
        </paper-listbox>
      </paper-dropdown-menu>
    </paper-dropdown-menu>
`,
  is: "eco-json-schema-enum",
  behaviors: [IronValidatableBehavior],
  properties: {
    schema: { type: Object, observer: "_schemaChanged" },
    value: { type: String, notify: !0, value: null },
    error: { type: String, observer: "_errorChanged", value: null },
    _items: {
      type: Object,
      value: function() {
        return {};
      }
    }
  },
  ready: function() {},
  detached: function() {},
  _schemaChanged: function() {
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
  _errorChanged: function() {
    if (this.error) {
      this.$.dropdown.invalid = !0;
    } else {
      this.$.dropdown.invalid = !1;
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
