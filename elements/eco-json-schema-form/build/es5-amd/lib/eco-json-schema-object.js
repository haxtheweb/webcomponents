define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js",
  "../node_modules/@polymer/app-localize-behavior/app-localize-behavior.js",
  "./eco-json-schema-array.js",
  "./eco-json-schema-boolean.js",
  "./eco-json-schema-enum.js",
  "./eco-json-schema-file.js",
  "./eco-json-schema-input.js"
], function(
  _polymerLegacy,
  _polymerDom,
  _ironFlexLayoutClasses,
  _appLocalizeBehavior
) {
  "use strict";
  function _templateObject_d62df650ecf111e88a0b4725ebfbecff() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n  <custom-style>\n    <style is="custom-style" include="iron-flex iron-flex-alignment">\n      div.layout {\n        height: auto;\n      }\n      #form {\n        display: block;\n        @apply --eco-json-schema-object-form;\n        @apply --layout-vertical;\n        @apply --layout-wrap;\n      }\n      #form ::slotted(paper-input) {\n        --paper-input-container-shared-input-style: {\n          border: none !important;\n          width: 100% !important;\n          background-color: transparent !important;\n        };\n      }\n    </style>\n  </custom-style>\n\n    <template is="dom-if" if="{{!wizard}}">\n      <div class="header" hidden$="[[!label]]">[[label]]</div>\n    </template>\n    <div class="layout vertical flex start-justified">\n      <div id="form" class="layout horizontal flex start-justified"><slot></slot></div>\n    </div>  \n'
      ],
      [
        '\n  <custom-style>\n    <style is="custom-style" include="iron-flex iron-flex-alignment">\n      div.layout {\n        height: auto;\n      }\n      #form {\n        display: block;\n        @apply --eco-json-schema-object-form;\n        @apply --layout-vertical;\n        @apply --layout-wrap;\n      }\n      #form ::slotted(paper-input) {\n        --paper-input-container-shared-input-style: {\n          border: none !important;\n          width: 100% !important;\n          background-color: transparent !important;\n        };\n      }\n    </style>\n  </custom-style>\n\n    <template is="dom-if" if="{{!wizard}}">\n      <div class="header" hidden\\$="[[!label]]">[[label]]</div>\n    </template>\n    <div class="layout vertical flex start-justified">\n      <div id="form" class="layout horizontal flex start-justified"><slot></slot></div>\n    </div>  \n'
      ]
    );
    _templateObject_d62df650ecf111e88a0b4725ebfbecff = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    is: "eco-json-schema-object",
    _template: (0, _polymerLegacy.html)(
      _templateObject_d62df650ecf111e88a0b4725ebfbecff()
    ),
    behaviors: [_appLocalizeBehavior.AppLocalizeBehavior],
    properties: {
      language: { value: "en" },
      resources: {
        value: function value() {
          return {};
        }
      },
      schema: { type: Object, observer: "_schemaChanged" },
      label: { type: String },
      value: {
        type: Object,
        notify: !0,
        value: function value() {
          return {};
        }
      },
      error: { type: Object, observer: "_errorChanged" },
      wizard: { type: Boolean, notify: !0 }
    },
    detached: function detached() {
      this._clearForm();
    },
    _buildSchemaProperties: function _buildSchemaProperties() {
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
            if (babelHelpers.typeof(schema.value) === "undefined") {
              schema.value = "";
            }
            property.value = schema.value;
          } else if (ctx._isSchemaBoolean(schema.type)) {
            property.component.name =
              property.component.name || "eco-json-schema-boolean";
            if (babelHelpers.typeof(schema.value) === "undefined") {
              schema.value = !1;
            }
            property.value = schema.value;
          } else if (ctx._isSchemaFile(schema.type)) {
            property.component.name =
              property.component.name || "eco-json-schema-file";
            if (babelHelpers.typeof(schema.value) === "undefined") {
              schema.value = {};
            }
            property.value = schema.value;
          } else if (ctx._isSchemaValue(schema.type)) {
            property.component.name =
              property.component.name || "eco-json-schema-input";
            if (babelHelpers.typeof(schema.value) === "undefined") {
              schema.value = "";
            }
            property.value = schema.value;
          } else if (ctx._isSchemaObject(schema.type)) {
            property.component.name =
              property.component.name || "eco-json-schema-object";
            if (babelHelpers.typeof(schema.value) === "undefined") {
              schema.value = {};
            }
            property.value = schema.value;
          } else if (ctx._isSchemaArray(schema.type)) {
            property.component.name =
              property.component.name || "eco-json-schema-array";
            if (babelHelpers.typeof(schema.value) === "undefined") {
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
    _schemaPropertyChanged: function _schemaPropertyChanged(event, detail) {
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
    _setValue: function _setValue() {
      var ctx = this,
        value = {};
      this._schemaProperties.forEach(function(property) {
        if (babelHelpers.typeof(property.value) !== "undefined") {
          value[property.property] = ctx._deepClone(property.value);
        }
      });
      this.value = value;
    },
    _buildForm: function _buildForm() {
      var _this = this,
        ctx = this;
      this._schemaProperties.forEach(function(property) {
        var el = ctx.create(property.component.name, {
          label: property.label,
          schema: property.schema,
          schemaProperty: property,
          language: _this.language,
          resources: _this.resources
        });
        if ("paper-input" === property.component.name) {
          el.style["background-color"] = "transparent";
          el.style.width = "100%";
        }
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
        if (babelHelpers.typeof(ctx.$) !== "undefined") {
          (0, _polymerDom.dom)(_this).appendChild(el);
        }
        if ("" != property.component.slot) {
          var temp = document.createElement("template");
          temp.innerHTML = property.component.slot;
          (0, _polymerDom.dom)(el).appendChild(temp);
        }
      });
    },
    _removePropertyEl: function _removePropertyEl(el) {
      if (babelHelpers.typeof(el.schemaProperty) !== "undefined") {
        this.unlisten(
          el,
          el.schemaProperty.component.valueProperty
            .replace(/([A-Z])/g, "-$1")
            .toLowerCase() + "-changed",
          "_schemaPropertyChanged"
        );
      }
      el.schemaProperty = null;
      (0, _polymerDom.dom)(this).removeChild(el);
    },
    _clearForm: function _clearForm() {
      if (babelHelpers.typeof(this.$) !== "undefined") {
        var formEl = (0, _polymerDom.dom)(this);
        while (formEl.firstChild) {
          this._removePropertyEl(formEl.firstChild);
        }
      }
    },
    _schemaChanged: function _schemaChanged(newValue, oldValue) {
      if (newValue && babelHelpers.typeof(oldValue) !== "undefined") {
        this._clearForm();
        this._buildSchemaProperties();
        this._buildForm();
        this._setValue();
      }
    },
    _errorChanged: function _errorChanged() {
      var ctx = this;
      (0, _polymerDom.dom)(this).childNodes.forEach(function(el) {
        var name = el.getAttribute("name");
        if (ctx.error && ctx.error[name]) {
          el.error = ctx.error[name];
        } else {
          el.error = null;
        }
      });
    },
    _deepClone: function _deepClone(o) {
      return JSON.parse(JSON.stringify(o));
    },
    _isSchemaValue: function _isSchemaValue(type) {
      return (
        this._isSchemaBoolean(type) ||
        this._isSchemaNumber(type) ||
        this._isSchemaString(type) ||
        this._isSchemaFile(type)
      );
    },
    _isSchemaFile: function _isSchemaFile(type) {
      if (Array.isArray(type)) {
        return -1 !== type.indexOf("file");
      } else {
        return "file" === type;
      }
    },
    _isSchemaBoolean: function _isSchemaBoolean(type) {
      if (Array.isArray(type)) {
        return -1 !== type.indexOf("boolean");
      } else {
        return "boolean" === type;
      }
    },
    _isSchemaEnum: function _isSchemaEnum(schema) {
      return !!schema.enum;
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
