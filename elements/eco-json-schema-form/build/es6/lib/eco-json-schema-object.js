import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import { AppLocalizeBehavior } from "../node_modules/@polymer/app-localize-behavior/app-localize-behavior.js";
import "./eco-json-schema-array.js";
import "./eco-json-schema-boolean.js";
import "./eco-json-schema-enum.js";
import "./eco-json-schema-file.js";
import "./eco-json-schema-input.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");
$_documentContainer.innerHTML = `<dom-module id="eco-json-schema-object">

  
  
  
  
  
  

  <template>

    <style is="custom-style" include="iron-flex iron-flex-alignment">
      div.layout {
        height: auto;
      }
      #form {
        display: block;
        @apply(--eco-json-schema-object-form);
        @apply(--layout-vertical);
        @apply(--layout-wrap);
      }
    </style>

    <template is="dom-if" if="{{!wizard}}">
      <div class="header" hidden\$="[[!label]]">[[label]]</div>
    </template>
    <div class="layout vertical flex start-justified">
      <div id="form" class="layout horizontal flex start-justified"></div>
    </div>


  </template>

  

</dom-module>`;
document.head.appendChild($_documentContainer);
Polymer({
  is: "eco-json-schema-object",
  behaviors: [AppLocalizeBehavior],
  properties: {
    language: { value: "en" },
    resources: {
      value: function() {
        return {};
      }
    },
    schema: { type: Object, observer: "_schemaChanged" },
    label: { type: String },
    value: {
      type: Object,
      notify: !0,
      value: function() {
        return {};
      }
    },
    error: { type: Object, observer: "_errorChanged" },
    wizard: { type: Boolean, notify: !0 }
  },
  detached: function() {
    this._clearForm();
  },
  _buildSchemaProperties: function() {
    var ctx = this;
    this._schemaProperties = Object.keys(this.schema.properties || []).map(
      function(key) {
        var schema = ctx.schema.properties[key],
          property = {
            property: key,
            label: schema.title || key,
            schema: schema,
            component: schema.component || {}
          };
        if (!property.component.valueProperty) {
          property.component.valueProperty = "value";
        }
        if (!property.component.slot) {
          property.component.slot = "";
        }
        if (ctx._isSchemaEnum(schema)) {
          property.component.name =
            property.component.name || "eco-json-schema-enum";
          if (typeof schema.value === typeof void 0) {
            schema.value = "";
          }
          property.value = schema.value;
        } else if (ctx._isSchemaBoolean(schema.type)) {
          property.component.name =
            property.component.name || "eco-json-schema-boolean";
          if (typeof schema.value === typeof void 0) {
            schema.value = !1;
          }
          property.value = schema.value;
        } else if (ctx._isSchemaFile(schema.type)) {
          property.component.name =
            property.component.name || "eco-json-schema-file";
          if (typeof schema.value === typeof void 0) {
            schema.value = {};
          }
          property.value = schema.value;
        } else if (ctx._isSchemaValue(schema.type)) {
          property.component.name =
            property.component.name || "eco-json-schema-input";
          if (typeof schema.value === typeof void 0) {
            schema.value = "";
          }
          property.value = schema.value;
        } else if (ctx._isSchemaObject(schema.type)) {
          property.component.name =
            property.component.name || "eco-json-schema-object";
          if (typeof schema.value === typeof void 0) {
            schema.value = {};
          }
          property.value = schema.value;
        } else if (ctx._isSchemaArray(schema.type)) {
          property.component.name =
            property.component.name || "eco-json-schema-array";
          if (typeof schema.value === typeof void 0) {
            schema.value = [];
          }
          property.value = schema.value;
        } else {
          return console.error("Unknown property type %s", schema.type);
        }
        return property;
      }
    );
  },
  _schemaPropertyChanged: function(event, detail) {
    if (detail.path && /\.length$/.test(detail.path)) {
      return;
    }
    var ctx = this,
      property = event.target.schemaProperty,
      path = ["value", property.property];
    if (detail.path && /\.splices$/.test(detail.path)) {
      var parts = detail.path.split(".").slice(1, -1);
      while (parts.length) {
        path.push(parts.shift());
        if (property.keyMap && property.keyMap[path.join(".")]) {
          path = property.keyMap[path.join(".")].split(".");
        }
      }
      if (detail.value.keySplices) {
        if (property.keyMap) {
          detail.value.keySplices.forEach(function(splice) {
            splice.removed.forEach(function(k) {
              delete property.keyMap[path.concat([k]).join(".")];
            });
          });
        }
      }
      if (detail.value) {
        detail.value.indexSplices.forEach(function(splice) {
          var args = [path.join("."), splice.index, splice.removed.length];
          if (splice.addedCount) {
            for (var i = 0, ii = splice.addedCount; i < ii; i++) {
              if (splice.addedKeys && splice.addedKeys[i]) {
                property.keyMap = property.keyMap || {};
                property.keyMap[
                  path.concat([splice.addedKeys[i]]).join(".")
                ] = path.concat([i + splice.index]).join(".");
              }
              args.push(ctx._deepClone(splice.object[i + splice.index]));
            }
          }
          ctx.splice.apply(ctx, args);
        });
      }
    } else if (detail.path) {
      var parts = detail.path.split(".").slice(1),
        v = this.value;
      if (!v.hasOwnProperty(property.property)) {
        this.set("value." + property.property, {});
      }
      while (parts.length) {
        var k = parts.shift();
        path.push(k);
        if (property.keyMap && property.keyMap[path.join(".")]) {
          path = property.keyMap[path.join(".")].split(".");
        }
      }
      this.set(path.join("."), this._deepClone(detail.value));
    } else {
      property.value = detail.value;
      this.set(path, this._deepClone(detail.value));
    }
  },
  _setValue: function() {
    var ctx = this,
      value = {};
    this._schemaProperties.forEach(function(property) {
      if (typeof property.value !== typeof void 0) {
        value[property.property] = ctx._deepClone(property.value);
      }
    });
    this.value = value;
  },
  _buildForm: function() {
    var ctx = this;
    this._schemaProperties.forEach(property => {
      var el = ctx.create(property.component.name, {
        label: property.label,
        schema: property.schema,
        schemaProperty: property,
        language: this.language,
        resources: this.resources
      });
      el.setAttribute("name", property.property);
      el.className = "flex start-justified";
      el[property.component.valueProperty] = property.value;
      for (var attr in property.component.attributes) {
        el.setAttribute(attr, property.component.attributes[attr]);
      }
      for (var prop in property.component.properties) {
        el[prop] = property.component.properties[prop];
      }
      ctx.listen(
        el,
        property.component.valueProperty
          .replace(/([A-Z])/g, "-$1")
          .toLowerCase() + "-changed",
        "_schemaPropertyChanged"
      );
      dom(ctx.$.form).appendChild(el);
      if ("" != property.component.slot) {
        var temp = document.createElement("template");
        temp.innerHTML = property.component.slot;
        dom(el).appendChild(temp.content);
      }
    });
  },
  _removePropertyEl: function(el) {
    if (typeof el.schemaProperty !== typeof void 0) {
      this.unlisten(
        el,
        el.schemaProperty.component.valueProperty
          .replace(/([A-Z])/g, "-$1")
          .toLowerCase() + "-changed",
        "_schemaPropertyChanged"
      );
    }
    el.schemaProperty = null;
    dom(this.$.form).removeChild(el);
  },
  _clearForm: function() {
    var formEl = dom(this.$.form);
    while (formEl.firstChild) {
      this._removePropertyEl(formEl.firstChild);
    }
  },
  _schemaChanged: function() {
    this._clearForm();
    this._buildSchemaProperties();
    this._buildForm();
    this._setValue();
  },
  _errorChanged: function() {
    var ctx = this;
    dom(this.$.form).childNodes.forEach(function(el) {
      var name = el.getAttribute("name");
      if (ctx.error && ctx.error[name]) {
        el.error = ctx.error[name];
      } else {
        el.error = null;
      }
    });
  },
  _deepClone: function(o) {
    return JSON.parse(JSON.stringify(o));
  },
  _isSchemaValue: function(type) {
    return (
      this._isSchemaBoolean(type) ||
      this._isSchemaNumber(type) ||
      this._isSchemaString(type) ||
      this._isSchemaFile(type)
    );
  },
  _isSchemaFile: function(type) {
    if (Array.isArray(type)) {
      return -1 !== type.indexOf("file");
    } else {
      return "file" === type;
    }
  },
  _isSchemaBoolean: function(type) {
    if (Array.isArray(type)) {
      return -1 !== type.indexOf("boolean");
    } else {
      return "boolean" === type;
    }
  },
  _isSchemaEnum: function(schema) {
    return !!schema.enum;
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
