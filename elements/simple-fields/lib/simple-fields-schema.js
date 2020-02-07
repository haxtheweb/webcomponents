import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `simple-fields-schema`
 * @customElement simple-fields-schema
 * 
### Styling

`<simple-fields-schema>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--simple-fields-schema-margin` | margin around the simple-fields-schema | 15px 0
 *
 * @demo ./demo/index.html
 */
class SimpleFieldsSchema extends LitElement {
  static get styles() {
    return [
      css``
    ];
  }
  render() {
    return html`
      <div id="schema-fields" aria-live="polite">
        <slot></slot>
      </div>`;
  }
  constructor() {
    super();
    this.autofocus = false;
    this.codeTheme = "vs-light-2";
    this.dataTypes = {
      array: {
        component: "simple-fields-array",
        defaultValue: [],
        isFieldset: true
      },
      boolean: {
        component: "simple-fields-boolean",
        defaultValue: false
      },
      fieldset: {
        component: "simple-fields-fieldset",
        defaultValue: {},
        isFieldset: true
      },
      file: {
        component: "simple-fields-file",
        defaultValue: {}
      },
      integer: {
        component: "paper-input",
        defaultValue: ""
      },
      markup: {
        component: "simple-fields-markup",
        defaultValue: ""
      },
      number: {
        component: "paper-input",
        defaultValue: ""
      },
      object: {
        component: "simple-fields-fieldset",
        defaultValue: {},
        isFieldset: true
      },
      string: {
        component: "paper-input"
      },
      tabs: {
        component: "a11y-tabs",
        defaultValue: {},
        isFieldset: true
      }
    };
    this.language = "en";
    this.resources = {};
    this.value = {};
    import("./lib/simple-fields-fieldset.js");
    import("./lib/simple-fields-array.js");
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
   * returns form properties
   * @readonly
   * @returns {array} form properties
   */
  get formProperties(){
    console.log('formProperties',this.schema,this.schema ? this._getProperties(this.schema) : []);
    return this.schema ? this._getProperties(this.schema) : [];
  }

  _getFormElement(property,parent = this){
    let el  = document.createElement(property.component.name),
      props  = {
        label: property.label,
        schema: property.schema,
        schemaProperty: property,
        language: this.language,
        resources: this.resources
      },
      attr = {
        hidden: property.schema.hidden
      };
    Object.keys(props).forEach(key=>el[key] = props[key]);
    Object.keys(attr).forEach(key=> {
      if(props[key]) el.setAttribute(key,props[key]);
    });
    parent.append(el);
    /* gets nested fields for a fieldset */
    if(property.schema && property.schema.properties) property.schema.properties.forEach(child=>this._getFormElement(child,el));
  }

  /**
   * returns an array of properties for a given schema object
   * @param {object} target parent of nested properties
   * @returns {array} form properties
   */
  _getProperties(target = this.schema){
    let root = this;
    return Object.keys(target.properties || []).map(key => {
      let schema = target.properties[key],
        property = {
          name: key,
          schema: schema,
          label: schema.title || key,
          description: schema.description,
          component: schema.component || {}
        };
      if (!property.component.valueProperty) {
        property.component.valueProperty = "value";
      }
      if (!property.component.slot) {
        property.component.slot = "";
      }
      /* match the schema type to the correct data type */
      Object.keys(root.dataTypes).forEach(dataType=>{
        if (
          (Array.isArray(schema.type) && schema.type.indexOf(dataType) !== -1) 
          || schema.type === dataType
        ){
          property.component.name = property.component.name || root.dataTypes[dataType].component;
          if (typeof schema.value === typeof undefined) schema.value = root.dataTypes[dataType].defaultValue;
          property.value = schema.value;

          /* handle fieldsets by getting nested properties */
          if(root.dataTypes[dataType].isFieldset){
            if(!schema.items || !schema.items.properties) schema.items = { properties: schema.properties ? this._deepClone(schema.properties) : {} };
            if(schema.items && schema.items.properties) {
              Object.keys(schema.items.properties).forEach(key=>schema.items.properties[key].value = schema.value[key]);
              property.schema.properties = this._getProperties(schema.items);
            }
          }
          return;
        }
      });
      if(!property.component.name) console.error("Unknown property type %s", schema.type);
      return property;
    });
  }
  /**
   * Updates a11y-collapse item when properties change
   */
  updated(changedProperties) {
    //observer: "error _errorChanged"
    //observer: "schema _schemaChanged notify"
    // value wizard notify
    changedProperties.forEach((oldValue, propName) => {
      if(propName === "schema") this._schemaChanged(this.schema, oldValue);
    });
  }
  /**
   * clears a form or a fieldset container within a form
   * @param {object} el the element to remove
   * @param {*} parent the container where the field element exists
   */
  _clearForm(container = this) {
    /*if (typeof this.$ !== typeof undefined) {
      var formEl = container;
      while (formEl.firstChild) {
        this._removePropertyEl(formEl.firstChild, container);
      }
    }*/
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
   * updates the form when the schema changes
   * @param {object} newValue the new value for the schema
   * @param {object} oldValue the old value for the schema
   */
  _schemaChanged(newValue, oldValue) {
    if (newValue && newValue !== oldValue) {
      this._clearForm();
      this.formProperties.forEach(property=>this._getFormElement(property));
      //this.formProperties;
      //this._buildForm();
      //this._setValue();
      //fire schemaChanged
    }
    console.log('this._schemaChanged',this.formProperties);
  }
  disconnectedCallback() {
    this._clearForm();
    super.disconnectedCallback();
  }
}
window.customElements.define(SimpleFieldsSchema.tag, SimpleFieldsSchema);
export { SimpleFieldsSchema };
