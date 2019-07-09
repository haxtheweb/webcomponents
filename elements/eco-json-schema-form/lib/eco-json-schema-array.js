import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@lrnwebcomponents/a11y-collapse/a11y-collapse.js";
import "@lrnwebcomponents/a11y-collapse/lib/a11y-collapse-group.js";
import { AppLocalizeBehavior } from "@polymer/app-localize-behavior/app-localize-behavior.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
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
class EcoJsonSchemaArray extends mixinBehaviors(
  [AppLocalizeBehavior],
  PolymerElement
) {
  static get tag() {
    return "eco-json-schema-array";
  }
  static get template() {
    return html`
      <custom-style>
        <style is="custom-style" include="iron-flex iron-flex-alignment">
          :host ([hidden]) {
            display: none;
            color: var(--eco-json-form-color, var(--primary-text-color, #222));
            background-color: var(
              --eco-json-form-bg,
              var(--primary-background-color, #fff)
            );
            font-family: var(
              --eco-json-form-font-family,
              var(--paper-font-caption_-_font-family, unset)
            );
          }
          :host #legend {
            transition: all 0.5s;
            color: var(
              --eco-json-form-faded-color,
              var(--secondary-text-color, #888)
            );
          }
          :host(:focus) #legend,
          :host(:focus-within) #legend {
            color: var(
              --eco-json-form-active-color,
              var(--primary-color, #000)
            );
          }
          :host #fieldset {
            border-radius: var(--eco-json-form-border-radius, 2px);
            transition: all 0.5s;
            border: 1px solid
              var(
                --eco-json-form-faded-color,
                var(--secondary-text-color, #888)
              );
          }
          paper-button {
            display: flex;
            text-transform: none;
            align-items: center;
            justify-content: space-between;
            background-color: var(
              --eco-json-form-faded-color,
              var(--secondary-text-color, #888)
            );
            color: var(
              --eco-json-form-bg,
              var(--primary-background-color, #fff)
            );
            padding-left: 16px;
            padding-right: 16px;
            margin: 0;
          }
          paper-button:focus,
          paper-button:hover {
            background-color: var(
              --eco-json-form-active-color,
              var(--primary-color, #000)
            );
          }
          paper-button iron-icon {
            padding: 0 10px;
          }
          #addarray {
            border-radius: 0 0 var(--eco-json-form-border-radius, 2px)
              var(--eco-json-form-border-radius, 2px);
            background-color: var(--eco-json-form-add-color, #008800);
          }
          #addarray:focus,
          #addarray:hover {
            background-color: var(--eco-json-form-add-focus, #007700);
          }
          #addarray {
            background-color: var(--eco-json-form-add-color, #008800);
          }
          #addarray:focus,
          #addarray:hover {
            background-color: var(--eco-json-form-add-focus, #007700);
          }
          .array-remove-element {
            background-color: var(--eco-json-form-remove-color, #880000);
          }
          .array-remove-element:focus,
          .array-remove-element:hover {
            background-color: var(--eco-json-form-remove-focus, #770000);
          }
          a11y-collapse-group {
            margin: 0;
            border-radius: var(--eco-json-form-border-radius, 2px)
              var(--eco-json-form-border-radius, 2px) 0 0;
            border: 1px solid
              var(
                --eco-json-form-faded-color,
                var(--secondary-text-color, #888)
              );
            --a11y-collapse-border: 1px solid
              var(
                --eco-json-form-faded-color,
                var(--secondary-text-color, #888)
              );
            --a11y-collapse-heading: {
              font-weight: normal;
              margin: 0;
            }
          }
        </style>
      </custom-style>
      <fieldset>
        <legend id="legend" class="flex" hidden\$="[[!label]]">
          [[label]]
        </legend>
        <a11y-collapse-group
          id="form"
          icon="settings"
          class="vertical flex layout"
          global-options="[[globalOptions]]"
          ><slot></slot
        ></a11y-collapse-group>
        <paper-button
          id="addarray"
          icon="add"
          on-click="_onAddItem"
          role="button"
        >
          Add an item
          <iron-icon icon="add"></iron-icon>
        </paper-button>
      </fieldset>
    `;
  }
  static get properties() {
    return {
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
        value() {
          return [];
        },
        observer: "_valueChanged"
      },
      error: {
        type: Object,
        observer: "_errorChanged"
      },
      globalOptions: {
        type: Object,
        value: {
          icon: "settings",
          tooltip: "configure item"
        }
      },
      _schemaArrayItems: {
        type: Array,
        notify: true
      }
    };
  }
  static get observers() {
    return ["_schemaArraySplicesChanged(_schemaArrayItems.splices)"];
  }
  /**
   * Notice values have changed and rebuild the form
   * to match (potentially).
   */
  _valueChanged(newValue, oldValue) {
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
  }
  disconnectedCallback() {
    this._clearForm();
    super.disconnectedCallback();
  }
  _buildSchemaArrayItems() {
    this.set("_schemaArrayItems", []);
  }
  _setValue() {
    let newValue = this._schemaArrayItems.map(function(item) {
      return item.value;
    });
    this.set("value", []);
    this.set("value", newValue);
    this.notifyPath("value.*");
  }
  _schemaArraySplicesChanged(detail) {
    console.log("_schemaArraySplicesChanged", detail, this._schemaArrayItems);
    if (!detail) {
      return false;
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
          var containerEl = this.create("a11y-collapse", {});
          var containerHeader = this.create("p", {
            slot: "heading"
          });
          containerHeader.innerHTML = "Item " + (i + 1);
          containerEl.appendChild(containerHeader);
          var buttonEl = this.create("paper-button", {});
          var buttonIcon = this.create("iron-icon", {
            icon: "delete"
          });
          buttonEl.innerHTML = "Remove item ";
          buttonEl.appendChild(buttonIcon);
          this.listen(buttonEl, "click", "_onRemoveItem");
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
  }
  _schemaArrayItemChanged(event, detail) {
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
  }
  _removeArrayEl(el) {
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
        this.unlisten(polyEl.childNodes[1], "click", "_onRemoveItem");
      }
    }
    el.schemaArrayItem = null;
    dom(this).removeChild(el);
  }
  _clearForm() {
    var formEl = dom(this);
    while (formEl.firstChild) {
      this._removeArrayEl(formEl.firstChild);
    }
  }
  _schemaChanged() {
    this._clearForm();
    this._buildSchemaArrayItems();
  }
  _errorChanged() {
    dom(this).childNodes.forEach((rowEl, idx) => {
      if (this.error && this.error[idx]) {
        dom(rowEl).childNodes[0].error = this.error[idx];
      } else {
        dom(rowEl).childNodes[0].error = null;
      }
    });
  }
  _onAddItemWithValue(values, pointer) {
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
    var containerEl = this.create("a11y-collapse", {});
    var containerHeader = this.create("p", {
      slot: "heading"
    });
    containerHeader.innerHTML = "Item " + (this.children.length + 1);
    containerEl.appendChild(containerHeader);
    var buttonEl = this.create("paper-button", {});
    var buttonIcon = this.create("iron-icon", {
      icon: "delete"
    });
    buttonEl.innerHTML = "Remove item ";
    buttonEl.appendChild(buttonIcon);
    this.listen(buttonEl, "click", "_onRemoveItem");
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
  }
  _onAddItem(e) {
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
  }
  _onRemoveItem(e) {
    var item = dom(e).localTarget.previousSibling.schemaArrayItem;
    var index = this._schemaArrayItems.indexOf(item);
    this.splice("_schemaArrayItems", index, 1);
  }
  _deepClone(o) {
    return JSON.parse(JSON.stringify(o));
  }
  _isSchemaValue(type) {
    return (
      this._isSchemaBoolean(type) ||
      this._isSchemaNumber(type) ||
      this._isSchemaString(type) ||
      this._isSchemaFile(type)
    );
  }
  _isSchemaFile(type) {
    if (Array.isArray(type)) {
      return type.indexOf("file") !== -1;
    } else {
      return type === "file";
    }
  }
  _isSchemaBoolean(type) {
    if (Array.isArray(type)) {
      return type.indexOf("boolean") !== -1;
    } else {
      return type === "boolean";
    }
  }
  _isSchemaEnum(schema) {
    return !!schema.enum;
  }
  _isSchemaNumber(type) {
    if (Array.isArray(type)) {
      return type.indexOf("number") !== -1 || type.indexOf("integer") !== -1;
    } else {
      return type === "number" || type === "integer";
    }
  }
  _isSchemaString(type) {
    if (Array.isArray(type)) {
      return type.indexOf("string") !== -1;
    } else {
      return type === "string";
    }
  }
  _isSchemaObject(type) {
    return type === "object";
  }
  _isSchemaArray(type) {
    return type === "array";
  }
}
window.customElements.define(EcoJsonSchemaArray.tag, EcoJsonSchemaArray);
export { EcoJsonSchemaArray };
