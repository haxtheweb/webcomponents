import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "paper-collapse-item/paper-collapse-item.js";
import "paper-collapse-item/paper-collapse-group.js";
import "@polymer/app-localize-behavior/app-localize-behavior.js";
import "./eco-json-schema-boolean.js";
import "./eco-json-schema-enum.js";
import "./eco-json-schema-input.js";
import "./eco-json-schema-object.js";
import "./eco-json-schema-file.js";
/**
`eco-json-schema-array` takes in a JSON schema of type array and builds a form,
exposing a `value` property that represents an array described by the schema.

Please see the `eco-json-schema-object` documentation for further information.

@group eco Elements
@element eco-json-schema-array
* @demo demo/index.html
*/
Polymer({
  is: "eco-json-schema-array",
  _template: html`
    <custom-style>
      <style is="custom-style" include="iron-flex iron-flex-alignment">
        paper-input {
          padding: 2px;

          --paper-input-container-label: {
            white-space: normal;
            position: static;
            font-size: 22px;
            color: #212121;
          }
        }

        paper-collapse-item {
          --paper-collapse-item-header: {
            font-weight: bold;
            padding: 8px 0 0 8px;
          }
        }

        #form {
          border: 1px solid #aaaaaa;
        }

        #form div:nth-child(odd) {
          background-color: #f2f2f2;
          padding: 4px;
        }

        #form div:nth-child(even) {
          background-color: #e2e2e2;
          border-top: 1px solid #aaaaaa;
          border-bottom: 1px solid #aaaaaa;
          padding: 4px;
        }

        #form div:focus,
        #form div:hover,
        #form div:active {
          background-color: #ffffff !important;
        }

        paper-icon-button {
          float: right;
          border-radius: 50%;
        }

        .array-add {
          color: #34e79a;
          background-color: #f8f8f8;
        }

        .array-remove-element {
          color: #f44336;
          background-color: #f8f8f8;
        }

        .label {
          @apply --paper-input-container-label;
          white-space: normal;
          position: static;
          font-size: 22px;
          color: #212121;
        }

        :host {
          display: block;
        }
        .label {
          white-space: normal;
          position: static;
          font-size: 22px;
          color: #212121;
          @apply --paper-input-container-label;
        }
      </style>
    </custom-style>
    <div class="horizontal layout">
      <div class="flex" hidden\$="[[!label]]">[[label]]</div>
      <paper-icon-button
        id="addarray"
        title="Add another item"
        class="array-add"
        icon="add"
        on-click="_onAddItem"
        role="button"
        aria-label="Add another item"
      ></paper-icon-button>
    </div>

    <paper-collapse-group id="form" class="vertical flex layout"
      ><slot></slot
    ></paper-collapse-group>
  `,
  properties: {
    schema: {
      type: Object,
      notify: true,
      observer: "_schemaChanged"
    },
    label: {
      type: String
    },
    value: {
      type: Array,
      notify: true,
      value: function() {
        return [];
      },
      observer: "_valueChanged"
    },
    error: {
      type: Object,
      observer: "_errorChanged"
    },
    _schemaArrayItems: {
      type: Array,
      notify: true
    }
  },
  observers: ["_schemaArraySplicesChanged(_schemaArrayItems.splices)"],
  /**
   * Notice values have changed and rebuild the form
   * to match (potentially).
   */
  _valueChanged: function(newValue, oldValue) {
    if (
      newValue !== oldValue &&
      typeof newValue !== typeof undefined &&
      typeof this.schema !== typeof undefined
    ) {
      setTimeout(() => {
        this._buildSchemaArrayItems();
        // wipe schema array and go from there
        // this only fires when the element initially builds
        for (var i in newValue) {
          this._onAddItemWithValue(newValue[i], parseInt(i));
        }
      }, 325);
    }
  },
  ready: function() {},
  detached: function() {
    this._clearForm();
  },
  _buildSchemaArrayItems: function() {
    this.set("_schemaArrayItems", []);
  },
  _setValue: function() {
    let newValue = this._schemaArrayItems.map(function(item) {
      return item.value;
    });
    this.set("value", []);
    this.set("value", newValue);
    this.notifyPath("value.*");
  },
  _schemaArraySplicesChanged: function(detail) {
    if (!detail) {
      return console.warn("detail is undefined");
    }

    if (detail.keySplices) {
      console.warn("Got keySplices, don't know what to do with them!");
    }

    detail.indexSplices.forEach(splice => {
      var args = ["value", splice.index, splice.removed.length];

      if (splice.removed && splice.removed.length) {
        for (
          var i = splice.index, ii = splice.index + splice.removed.length;
          i < ii;
          i++
        ) {
          this._removeArrayEl(this.children[i]);
        }
      }

      if (splice.addedCount) {
        for (
          var i = splice.index, ii = splice.index + splice.addedCount;
          i < ii;
          i++
        ) {
          var item = splice.object[i];

          var componentEl = this.create(item.component.name, {
            label: item.label,
            schema: item.schema,
            schemaArrayItem: item
          });
          var containerEl = this.create("paper-collapse-item", {
            header: "Item " + (i + 1)
          });
          var buttonEl = this.create("paper-icon-button", {
            icon: "remove",
            title: "Remove item"
          });
          this.listen(buttonEl, "tap", "_onRemoveItem");
          buttonEl.classList.add("array-remove-element");
          componentEl.classList.add("flex", "horizontal", "layout");

          dom(containerEl).appendChild(componentEl);
          dom(containerEl).appendChild(buttonEl);

          var beforeEl = this.children[i];

          if (beforeEl) {
            dom(this).insertBefore(containerEl, beforeEl);
          } else {
            dom(this).appendChild(containerEl);
          }

          this.listen(
            componentEl,
            item.component.valueProperty
              .replace(/([A-Z])/g, "-$1")
              .toLowerCase() + "-changed",
            "_schemaArrayItemChanged"
          );
          args.push(this._deepClone(componentEl[item.component.valueProperty]));
        }
      }
      this.splice.apply(this, args);
    });
  },
  _schemaArrayItemChanged: function(event, detail) {
    if (detail.path && /\.length$/.test(detail.path)) {
      return;
    }

    var item = event.target.schemaArrayItem;
    var index = this._schemaArrayItems.indexOf(item);
    var path = ["value", index];

    if (detail.path && /\.splices$/.test(detail.path)) {
      path = path.concat(detail.path.split(".").slice(1, -1));

      if (detail.value.keySplices) {
        console.warn("Got keySplices, don't know what to do with them!");
      }

      detail.value.indexSplices.forEach(splice => {
        var args = [path.join("."), splice.index, splice.removed.length];
        if (splice.addedCount) {
          for (
            var i = splice.index, ii = splice.index + splice.addedCount;
            i < ii;
            i++
          ) {
            args.push(this._deepClone(splice.object[i]));
          }
        }
        this.splice.apply(this, args);
      });
    } else if (detail.path) {
      path = path.concat(detail.path.split(".").slice(1));
      this.set(path, this._deepClone(detail.value));
      this.notifyPath(path);
    } else {
      this.splice("value", index, 1, this._deepClone(detail.value));
      this.notifyPath("value.1");
    }
  },
  _removeArrayEl: function(el) {
    var polyEl = dom(el);
    if (typeof polyEl.childNodes[0] !== typeof undefined) {
      this.unlisten(
        polyEl.childNodes[0],
        polyEl.firstChild.schemaArrayItem.component.valueProperty
          .replace(/([A-Z])/g, "-$1")
          .toLowerCase() + "-changed",
        "_schemaArrayItemChanged"
      );
      if (typeof polyEl.childNodes[1] !== typeof undefined) {
        this.unlisten(polyEl.childNodes[1], "tap", "_onRemoveItem");
      }
    }
    el.schemaArrayItem = null;
    dom(this).removeChild(el);
  },
  _clearForm: function() {
    var formEl = dom(this);
    while (formEl.firstChild) {
      this._removeArrayEl(formEl.firstChild);
    }
  },
  _schemaChanged: function() {
    this._clearForm();
    this._buildSchemaArrayItems();
  },
  _errorChanged: function() {
    dom(this).childNodes.forEach((rowEl, idx) => {
      if (this.error && this.error[idx]) {
        dom(rowEl).childNodes[0].error = this.error[idx];
      } else {
        dom(rowEl).childNodes[0].error = null;
      }
    });
  },
  _onAddItemWithValue: function(values, pointer) {
    var schema = this.schema.items;
    var i = 0;
    // try to set values if we have them
    if (typeof values !== typeof undefined) {
      for (i in values) {
        if (typeof schema.properties[i] !== typeof undefined) {
          schema.properties[i].value = values[i];
        }
      }
    }
    var item = {
      schema: schema,
      component: schema.component || {}
    };
    if (schema.title) {
      item.label = schema.title;
    }

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
    var componentEl = this.create(item.component.name, {
      label: item.label,
      schema: item.schema,
      schemaArrayItem: item
    });
    var containerEl = this.create("paper-collapse-item", {
      header: "Item " + (this.children.length + 1)
    });
    var buttonEl = this.create("paper-icon-button", {
      icon: "remove",
      title: "Remove item"
    });
    this.listen(buttonEl, "tap", "_onRemoveItem");
    buttonEl.classList.add("array-remove-element");
    componentEl.classList.add("flex", "horizontal", "layout");

    dom(containerEl).appendChild(componentEl);
    dom(containerEl).appendChild(buttonEl);

    var beforeEl = this.children[this.children.length];

    if (beforeEl) {
      dom(this).insertBefore(containerEl, beforeEl);
    } else {
      dom(this).appendChild(containerEl);
    }
    this.listen(
      componentEl,
      item.component.valueProperty.replace(/([A-Z])/g, "-$1").toLowerCase() +
        "-changed",
      "_schemaArrayItemChanged"
    );
    // this will add it to the array but not force a splice mutation
    this._schemaArrayItems.push(item);
  },
  _onAddItem: function(e) {
    const schema = this.schema.items;
    var item = {
      label: schema.title,
      schema: schema,
      component: schema.component || {}
    };

    if (!item.component.valueProperty) {
      item.component.valueProperty = "value";
    }
    for (var i in item.schema.properties) {
      item.schema.properties[i].value = null;
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
  _onRemoveItem: function(e) {
    var item = dom(e).localTarget.previousSibling.schemaArrayItem;
    var index = this._schemaArrayItems.indexOf(item);
    this.splice("_schemaArrayItems", index, 1);
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
      return type.indexOf("file") !== -1;
    } else {
      return type === "file";
    }
  },
  _isSchemaBoolean: function(type) {
    if (Array.isArray(type)) {
      return type.indexOf("boolean") !== -1;
    } else {
      return type === "boolean";
    }
  },
  _isSchemaEnum: function(schema) {
    return !!schema.enum;
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
