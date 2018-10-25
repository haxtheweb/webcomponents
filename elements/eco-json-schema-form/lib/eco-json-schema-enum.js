import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "@polymer/paper-dropdown-menu/paper-dropdown-menu.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/paper-listbox/paper-listbox.js";
import { IronValidatableBehavior } from "@polymer/iron-validatable-behavior/iron-validatable-behavior.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<dom-module id="eco-json-schema-enum">

  
  
  
  

  <template>
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

  </template>

  

</dom-module>`;

document.head.appendChild($_documentContainer);
Polymer({
  is: "eco-json-schema-enum",
  behaviors: [IronValidatableBehavior],
  properties: {
    schema: {
      type: Object,
      observer: "_schemaChanged"
    },
    value: {
      type: String,
      notify: true,
      value: null
    },
    error: {
      type: String,
      observer: "_errorChanged",
      value: null
    },
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
    var schema = this.schema;
    var inputEl = this.$.dropdown;

    if (schema.component && schema.component.properties) {
      Object.keys(schema.component.properties).forEach(function(prop) {
        inputEl[prop] = schema.component.properties[prop];
      });
    }

    this._items = schema.enum.filter(function(item) {
      return item !== null;
    });

    if (schema.title) {
      inputEl.label = schema.title;
    }
  },
  _errorChanged: function() {
    if (this.error) {
      this.$.dropdown.invalid = true;
    } else {
      this.$.dropdown.invalid = false;
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
