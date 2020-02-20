import { LitElement, html, css } from "lit-element/lit-element.js";
import "./simple-fields-array.js";
/**
 * `simple-fields-schema`
 * 
### Styling

`<simple-fields-schema>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--simple-fields-schema-margin` | margin around the simple-fields-schema | 15px 0
 *
 * @demo ./demo/schema.html
 * @customElement simple-fields-schema
 */
class SimpleFieldsSchema extends LitElement {
  static get styles() {
    return [css``];
  }
  render() {
    return html`
      <div id="schema-fields" aria-live="polite">
        <slot></slot>
      </div>
    `;
  }
  constructor() {
    super();
    this.autofocus = false;
    this.codeTheme = "vs-light-2";
    this.dataTypes = {
      array: {
        element: "simple-fields-array",
        defaultValue: [],
        isArray: true,
        previewSlot: "preview",
        sortSlot: "sort"
      },
      boolean: {
        element: "simple-fields-boolean",
        defaultValue: false
      },
      fieldset: {
        element: "simple-fields-fieldset",
        defaultValue: {},
        isFieldset: true
      },
      file: {
        element: "simple-fields-file",
        defaultValue: {}
      },
      integer: {
        element: "paper-input",
        defaultValue: "",
        type: "number",
        step: 1
      },
      markup: {
        element: "simple-fields-markup",
        defaultValue: ""
      },
      number: {
        element: "paper-input",
        type: "number",
        defaultValue: ""
      },
      object: {
        element: "simple-fields-fieldset",
        defaultValue: {},
        isFieldset: true
      },
      string: {
        element: "paper-input"
      },
      tabs: {
        element: "a11y-tabs",
        defaultValue: {},
        isFieldset: true
      }
    };
    this.language = "en";
    this.resources = {};
    this.value = {};
    setTimeout(() => {
      import("./simple-fields-fieldset.js");
      import("@polymer/iron-icons/iron-icons.js");
      import("@polymer/iron-icons/editor-icons.js");
      import("@polymer/paper-input/paper-input.js");
      import("@polymer/paper-icon-button/paper-icon-button.js");
      import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
    }, 0);
  }

  static get tag() {
    return "simple-fields-schema";
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * automatically set focus on the first field if that field has autofocus
       */
      autofocus: {
        type: Boolean
      },
      /**
       * the name of the code-editor theme
       */
      codeTheme: {
        type: String
      },
      dataTypes: {
        type: Object
      },
      error: {
        type: Object
      },
      label: {
        type: String
      },
      language: {
        type: String,
        attribute: "lang",
        reflect: true
      },
      resources: {
        type: Object
      },
      schema: {
        type: Object
      },
      value: {
        type: Object
      },
      wizard: {
        type: Boolean
      }
    };
  }

  /**
   * adds form element to page
   *
   * @param {object} config properties object for the element
   * @param {object} [parent=this] parent where element will be appended
   * @param {number} index if in array, element's index
   * @param {string} string name of slot
   * @returns {object} form element
   */
  _buildFormElement(config, parent = this, index = -1, slot) {
    let el = document.createElement(config.component.type.element),
      elname =
        index > -1 ? config.name.replace("..", `.${index}.`) : config.name,
      elval = this._getValue(elname);
    el.label = config.label || config.title;
    el.schema = config.schema;
    el.resources = this.resources;
    el.setAttribute("language", this.language);
    el.setAttribute("name", elname);
    Object.keys(config.component.type).forEach(key => {
      if (key !== "element" || "valueProperty")
        el.setAttribute(key, config.component.type[key]);
    });
    if (config.schema.hidden) el.setAttribute("hidden", true);
    if (slot) el.slot = slot;
    parent.append(el);
    console.log("_buildFormElement", el, config, parent, index, slot);
    if (config.component.type.isArray && index < 0) {
      let keys = Object.keys(config.schema.properties),
        sortSlot = config.component.type.sortSlot,
        sortKeys = keys.filter(
          key => config.schema.properties[key].sortField === true
        );
      keys.forEach(key => {
        if (config.schema.properties[key].sortField === true)
          sortKeys = config.name;
      });
      el.addEventListener("add", e =>
        this._setValue(`${elname}.${elval.length}`, {})
      );
      el.addEventListener("remove", e => {
        if (confirm("Remove item?")) e.detail.remove();
      });
      if (sortKeys.length > 0)
        elval = elval.sort((a, b) => {
          console.log(
            a,
            b,
            sortKeys[0],
            elval,
            config.schema.properties[sortKeys[0]]
          );
          return a - b;
        });
      /* gets array items */
      if (elval)
        elval.forEach((item, i) => {
          /* gets array item config */
          let id = `item-${i}`,
            child = el.buildItem(id),
            previewSlot = config.component.type.previewSlot,
            previewKeys = keys.filter(
              key => config.schema.properties[key].previewField === true
            );
          if (previewKeys.length < 1) previewKeys.push(keys[0]);
          /* adds fields to array items */
          keys.forEach(key =>
            this._buildFormElement(
              config.schema.properties[key],
              child,
              i,
              key === sortKeys[0]
                ? sortSlot
                : previewKeys.includes(key)
                ? previewSlot
                : undefined
            )
          );
        });
    } else if (config.schema && config.schema.properties) {
      /* gets nested fields for a fieldset */
      Object.keys(config.schema.properties).forEach(key =>
        this._buildFormElement(config.schema.properties[key], el)
      );
    } else {
      el[config.component.valueProperty] = elval;
      el.onchange = e =>
        this._setValue(elname, el[config.component.valueProperty]);
    }
  }

  /**
   * returns an array of properties for a given schema object
   * @param {object} target parent of nested properties
   * @returns {array} form properties
   */
  _getProperties(target = this.schema, prefix) {
    //console.log('_getProperties',target);
    let root = this;
    return Object.keys(target.properties || []).map(key => {
      let schema = target.properties[key],
        property = {
          name: prefix ? `${prefix}.${key}` : key,
          schema: schema,
          component: schema.component || {},
          description: schema.description,
          label: schema.title || key,
          previewField: schema.previewField,
          sortField: schema.sortField
        };
      property.component.valueProperty =
        property.component.valueProperty || "value";
      property.component.slot = property.component.slot || "";

      /* match the schema type to the correct data type */
      Object.keys(root.dataTypes).forEach(key => {
        if (
          (Array.isArray(schema.type) && schema.type.indexOf(key) !== -1) ||
          schema.type === key
        ) {
          property.component.type = this._deepClone(root.dataTypes[key]);
          property.component.type.element =
            property.component.name || property.component.type.element;
          property.component.type.type = schema.format;

          /* handle fieldsets by getting nested properties */
          if (
            property.component.type.isFieldset ||
            property.component.type.isArray
          ) {
            if (!schema.items || !schema.items.properties)
              schema.items = {
                properties: schema.properties
                  ? this._deepClone(schema.properties)
                  : {}
              };
            if (schema.items && schema.items.properties) {
              //console.log('schema.items',schema.items);
              property.schema.properties = this._getProperties(
                schema.items,
                property.component.type.isArray
                  ? `${property.name}.`
                  : property.name
              );
            }
          }
        }
      });
      if (!property.component.type || !property.component.type.element)
        console.error("Unknown property type %s", schema.type);
      return property;
    });
  }

  /**
   * sets value of a property
   *
   * @param {string} propName property to set
   * @param {*} propVal value of the property
   */
  _setValue(propName, propVal) {
    //console.log('_setValue',propName,propVal);
    let oldValue = this._deepClone(this.value),
      newValue = this.value,
      props = propName.split("."),
      l = props.length;
    for (var i = 0; i < l - 1; i++) {
      let pointer = props[i];
      if (!newValue[pointer]) newValue[pointer] = {};
      newValue = newValue[pointer];
    }

    newValue[props[l - 1]] = propVal;
    this._valueChanged(this.value, oldValue);
  }

  /**
   * gets value of a property
   *
   * @param {string} propName property to set
   * @returns {*}
   */
  _getValue(propName) {
    let path = propName.split("."),
      pointer = this.value;
    path.forEach(prop => {
      if (pointer && pointer[prop]) {
        pointer = pointer[prop];
      } else {
        pointer = undefined;
        return;
      }
    });
    return pointer;
  }

  /**
   * Updates a11y-collapse item when properties change
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      //console.log('changedProperties',propName,oldValue,this[propName]);
      if (propName === "schema") this._schemaChanged(this.schema, oldValue);
      if (propName === "value") this._valueChanged(this.value, oldValue);
    });
  }

  /**
   * clears the form
   */
  _clearForm() {
    this.querySelectorAll("*").forEach(child => child.remove());
  }

  /**
   * clones an object and all its subproperties
   * @param {object} o the object to clone
   * @returns {object} the cloned object
   */
  _deepClone(o) {
    return JSON.parse(JSON.stringify(o));
  }
  /**
   * clears and rebuilds the form
   */
  _rebuildForm() {
    //console.log("_rebuildForm",this.value,this.schema);
    this._clearForm();
    if (this.schema) {
      let formProperties = this._getProperties(this.schema);
      formProperties.forEach(property => this._buildFormElement(property));
    }
  }
  /**
   * updates the form  and fires event when the value changes
   * @param {object} newValue the new value for the schema
   * @param {object} oldValue the old value for the schema
   * @event value-changed
   */
  _valueChanged(newValue, oldValue) {
    //console.log("this._valueChanged",this.value,oldValue);
    if (newValue && newValue !== oldValue) {
      this._rebuildForm();

      this.dispatchEvent(
        new CustomEvent("value-changed", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
    }
  }
  /**
   * updates the form and fires event when the schema changes
   * @param {object} newValue the new value for the schema
   * @param {object} oldValue the old value for the schema
   * @event schema-changed
   */
  _schemaChanged(newValue, oldValue) {
    //console.log("this._schemaChanged",this.schema,oldValue);
    if (newValue && newValue !== oldValue) {
      this._rebuildForm();

      this.dispatchEvent(
        new CustomEvent("schema-changed", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
    }
  }
  disconnectedCallback() {
    this._clearForm();
    super.disconnectedCallback();
  }
}
window.customElements.define(SimpleFieldsSchema.tag, SimpleFieldsSchema);
export { SimpleFieldsSchema };
