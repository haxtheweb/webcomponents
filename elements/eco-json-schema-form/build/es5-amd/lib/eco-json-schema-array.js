define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@polymer/iron-icons/editor-icons.js",
  "../node_modules/@polymer/paper-icon-button/paper-icon-button.js",
  "../node_modules/paper-collapse-item/paper-collapse-item.js",
  "../node_modules/paper-collapse-item/paper-collapse-group.js",
  "../node_modules/@polymer/app-localize-behavior/app-localize-behavior.js",
  "./eco-json-schema-boolean.js",
  "./eco-json-schema-enum.js",
  "./eco-json-schema-input.js",
  "./eco-json-schema-object.js",
  "./eco-json-schema-file.js"
], function(_polymerLegacy) {
  "use strict";
  var $_documentContainer = document.createElement("div");
  $_documentContainer.setAttribute("style", "display: none;");
  $_documentContainer.innerHTML =
    '<dom-module id="eco-json-schema-array">\n\n  \n  \n  \n  \n  \n  \n\n  \n  \n  \n  \n  \n\n  <template>\n    <style is="custom-style" include="iron-flex iron-flex-alignment">\n      paper-input {\n        padding: 2px;\n\n        --paper-input-container-label: {\n          white-space: normal;\n          position: static;\n          font-size: 22px;\n          color: #212121;\n        }\n      }\n\n      paper-collapse-item {\n        --paper-collapse-item-header: {\n          font-weight: bold;\n          padding: 8px 0 0 8px;\n        }\n\n        ;\n      }\n\n      #form {\n        border: 1px solid #AAAAAA;\n      }\n\n      #form div:nth-child(odd) {\n        background-color: #F2F2F2;\n        padding: 4px;\n      }\n\n      #form div:nth-child(even) {\n        background-color: #E2E2E2;\n        border-top: 1px solid #AAAAAA;\n        border-bottom: 1px solid #AAAAAA;\n        padding: 4px;\n      }\n\n      #form div:focus,\n      #form div:hover,\n      #form div:active {\n        background-color: #FFFFFF !important;\n      }\n\n      paper-icon-button {\n        float: right;\n        border-radius: 50%;\n      }\n\n      .array-add {\n        color: #34e79a;\n        background-color: #f8f8f8;\n      }\n\n      .array-remove-element {\n        color: #f44336;\n        background-color: #f8f8f8;\n      }\n\n      .label {\n        @apply(--paper-input-container-label);\n        white-space: normal;\n        position: static;\n        font-size: 22px;\n        color: #212121;\n      }\n\n      :host {\n        display: block;\n\n        .label {\n          @apply(--paper-input-container-label);\n          white-space: normal;\n          position: static;\n          font-size: 22px;\n          color: #212121;\n        }\n      }\n    </style>\n\n    <div class="horizontal layout">\n      <div class="flex" hidden$="[[!label]]">[[label]]</div>\n      <paper-icon-button id="addarray" title="Add another item" class="array-add" icon="add" on-click="_onAddItem" role="button" aria-label="Add another item"></paper-icon-button>\n    </div>\n\n    <paper-collapse-group id="form" class="vertical flex layout"></paper-collapse-group>\n\n  </template>\n\n  \n\n</dom-module>';
  document.head.appendChild($_documentContainer);
  (0, _polymerLegacy.Polymer)({
    is: "eco-json-schema-array",
    properties: {
      schema: { type: Object, observer: "_schemaChanged" },
      label: { type: String },
      value: {
        type: Array,
        notify: !0,
        value: function value() {
          return [];
        },
        observer: "_valueChanged"
      },
      error: { type: Object, observer: "_errorChanged" },
      _schemaArrayItems: {
        type: Array,
        notify: !0,
        value: function value() {
          return [];
        }
      }
    },
    observers: ["_schemaArraySplicesChanged(_schemaArrayItems.splices)"],
    _valueChanged: function _valueChanged(newValue, oldValue) {
      var _this = this;
      if (
        newValue !== oldValue &&
        babelHelpers.typeof(newValue) !== "undefined" &&
        babelHelpers.typeof(this.schema) !== "undefined"
      ) {
        setTimeout(function() {
          _this._buildSchemaArrayItems();
          for (var i in newValue) {
            _this._onAddItemWithValue(newValue[i], parseInt(i));
          }
        }, 100);
      }
    },
    ready: function ready() {},
    detached: function detached() {
      this._clearForm();
    },
    _buildSchemaArrayItems: function _buildSchemaArrayItems() {
      this._schemaArrayItems = [];
    },
    _setValue: function _setValue() {
      this.value = [];
      this.value = this._schemaArrayItems.map(function(item) {
        return item.value;
      });
    },
    _schemaArraySplicesChanged: function _schemaArraySplicesChanged(detail) {
      if (!detail) {
        return console.warn("detail is undefined");
      }
      var ctx = this;
      if (detail.keySplices) {
        console.warn("Got keySplices, don't know what to do with them!");
      }
      detail.indexSplices.forEach(function(splice) {
        var args = ["value", splice.index, splice.removed.length];
        if (splice.removed && splice.removed.length) {
          for (
            var i = splice.index, ii = splice.index + splice.removed.length;
            i < ii;
            i++
          ) {
            ctx._removeArrayEl(ctx.$.form.children[i]);
          }
        }
        if (splice.addedCount) {
          for (
            var i = splice.index, ii = splice.index + splice.addedCount;
            i < ii;
            i++
          ) {
            var item = splice.object[i],
              componentEl = ctx.create(item.component.name, {
                label: item.label,
                schema: item.schema,
                schemaArrayItem: item
              }),
              containerEl = ctx.create("paper-collapse-item", {
                header: "Item " + (i + 1)
              }),
              buttonEl = ctx.create("paper-icon-button", {
                icon: "remove",
                title: "Remove item"
              });
            ctx.listen(buttonEl, "tap", "_onRemoveItem");
            buttonEl.classList.add("array-remove-element");
            componentEl.classList.add("flex", "horizontal", "layout");
            dom(containerEl).appendChild(componentEl);
            dom(containerEl).appendChild(buttonEl);
            var beforeEl = ctx.$.form.children[i];
            if (beforeEl) {
              dom(ctx.$.form).insertBefore(containerEl, beforeEl);
            } else {
              dom(ctx.$.form).appendChild(containerEl);
            }
            ctx.listen(
              componentEl,
              item.component.valueProperty
                .replace(/([A-Z])/g, "-$1")
                .toLowerCase() + "-changed",
              "_schemaArrayItemChanged"
            );
            args.push(
              ctx._deepClone(componentEl[item.component.valueProperty])
            );
          }
        }
        ctx.splice.apply(ctx, args);
      });
    },
    _schemaArrayItemChanged: function _schemaArrayItemChanged(event, detail) {
      if (detail.path && /\.length$/.test(detail.path)) {
        return;
      }
      var ctx = this,
        item = event.target.schemaArrayItem,
        index = this._schemaArrayItems.indexOf(item),
        path = ["value", index];
      if (detail.path && /\.splices$/.test(detail.path)) {
        path = path.concat(detail.path.split(".").slice(1, -1));
        if (detail.value.keySplices) {
          console.warn("Got keySplices, don't know what to do with them!");
        }
        detail.value.indexSplices.forEach(function(splice) {
          var args = [path.join("."), splice.index, splice.removed.length];
          if (splice.addedCount) {
            for (
              var i = splice.index, ii = splice.index + splice.addedCount;
              i < ii;
              i++
            ) {
              args.push(ctx._deepClone(splice.object[i]));
            }
          }
          ctx.splice.apply(ctx, args);
        });
      } else if (detail.path) {
        path = path.concat(detail.path.split(".").slice(1));
        this.set(path, this._deepClone(detail.value));
      } else {
        this.splice("value", index, 1, this._deepClone(detail.value));
      }
    },
    _removeArrayEl: function _removeArrayEl(el) {
      var polyEl = dom(el);
      if (babelHelpers.typeof(polyEl.childNodes[0]) !== "undefined") {
        this.unlisten(
          polyEl.childNodes[0],
          polyEl.firstChild.schemaArrayItem.component.valueProperty
            .replace(/([A-Z])/g, "-$1")
            .toLowerCase() + "-changed",
          "_schemaArrayItemChanged"
        );
        if (babelHelpers.typeof(polyEl.childNodes[1]) !== "undefined") {
          this.unlisten(polyEl.childNodes[1], "tap", "_onRemoveItem");
        }
      }
      el.schemaArrayItem = null;
      dom(this.$.form).removeChild(el);
    },
    _clearForm: function _clearForm() {
      var formEl = dom(this.$.form);
      while (formEl.firstChild) {
        this._removeArrayEl(formEl.firstChild);
      }
    },
    _schemaChanged: function _schemaChanged() {
      this._clearForm();
      this._buildSchemaArrayItems();
      this._setValue();
    },
    _errorChanged: function _errorChanged() {
      var ctx = this;
      dom(this.$.form).childNodes.forEach(function(rowEl, idx) {
        if (ctx.error && ctx.error[idx]) {
          dom(rowEl).childNodes[0].error = ctx.error[idx];
        } else {
          dom(rowEl).childNodes[0].error = null;
        }
      });
    },
    _onAddItemWithValue: function _onAddItemWithValue(values) {
      var schema = this.schema.items;
      if (babelHelpers.typeof(values) !== "undefined") {
        for (var i in values) {
          if (babelHelpers.typeof(schema.properties[i]) !== "undefined") {
            schema.properties[i].value = values[i];
          }
        }
      }
      var item = {
        label: schema.title,
        schema: schema,
        component: schema.component || {}
      };
      if (!item.component.valueProperty) {
        item.component.valueProperty = "value";
      }
      if (!item.component.name) {
        if (this._isSchemaEnum(schema)) {
          item.component.name = "eco-json-schema-enum";
        } else if (this._isSchemaBoolean(schema.type)) {
          item.component.name = "eco-json-schema-boolean";
        } else if (this._isSchemaFile(schema.type)) {
          item.component.name = "eco-json-schema-file";
        } else if (this._isSchemaValue(schema.type)) {
          item.component.name = "eco-json-schema-input";
        } else if (this._isSchemaObject(schema.type)) {
          item.component.name = "eco-json-schema-object";
        } else if (this._isSchemaArray(schema.type)) {
          item.component.name = "eco-json-schema-array";
        } else {
          return console.error("Unknown item type %s", schema.type);
        }
      }
      var ctx = this,
        componentEl = ctx.create(item.component.name, {
          label: item.label,
          schema: item.schema,
          schemaArrayItem: item
        }),
        containerEl = ctx.create("paper-collapse-item", {
          header: "Item " + (i + 1)
        }),
        buttonEl = ctx.create("paper-icon-button", {
          icon: "remove",
          title: "Remove item"
        });
      ctx.listen(buttonEl, "tap", "_onRemoveItem");
      buttonEl.classList.add("array-remove-element");
      componentEl.classList.add("flex", "horizontal", "layout");
      dom(containerEl).appendChild(componentEl);
      dom(containerEl).appendChild(buttonEl);
      var beforeEl = ctx.$.form.children[i];
      if (beforeEl) {
        dom(ctx.$.form).insertBefore(containerEl, beforeEl);
      } else {
        dom(ctx.$.form).appendChild(containerEl);
      }
      ctx.listen(
        componentEl,
        item.component.valueProperty.replace(/([A-Z])/g, "-$1").toLowerCase() +
          "-changed",
        "_schemaArrayItemChanged"
      );
      this._schemaArrayItems.push(item);
    },
    _onAddItem: function _onAddItem() {
      var schema = this.schema.items,
        item = {
          label: schema.title,
          schema: schema,
          component: schema.component || {}
        };
      if (!item.component.valueProperty) {
        item.component.valueProperty = "value";
      }
      if (!item.component.name) {
        if (this._isSchemaEnum(schema)) {
          item.component.name = "eco-json-schema-enum";
        } else if (this._isSchemaBoolean(schema.type)) {
          item.component.name = "eco-json-schema-boolean";
        } else if (this._isSchemaFile(schema.type)) {
          item.component.name = "eco-json-schema-file";
        } else if (this._isSchemaValue(schema.type)) {
          item.component.name = "eco-json-schema-input";
        } else if (this._isSchemaObject(schema.type)) {
          item.component.name = "eco-json-schema-object";
        } else if (this._isSchemaArray(schema.type)) {
          item.component.name = "eco-json-schema-array";
        } else {
          return console.error("Unknown item type %s", schema.type);
        }
      }
      this.push("_schemaArrayItems", item);
    },
    _onRemoveItem: function _onRemoveItem(e) {
      var item = dom(e).localTarget.previousSibling.schemaArrayItem,
        index = this._schemaArrayItems.indexOf(item);
      this.splice("_schemaArrayItems", index, 1);
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
