import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/a11y-tabs/a11y-tabs.js";
import "@polymer/paper-input/paper-input.js";
import "./simple-fields-fieldset.js";
import "./simple-fields-array.js";
import "./simple-fields-field.js";
/**
 * `simple-fields-schema`
 * 
### Styling
`<simple-fields-schema>` provides following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|--------
`--simple-fields-schema-margin` | margin around simple-fields-schema | 15px 0

### Fields Schema Format
This element accepts JSON schema with additional features noted in the example below:
```
{
  $schema: "http://json-schema.org/schema#",
  title: "Store",
  type: "object",
  format: "tabs",                                 //default object behavior can be overridden by format
  required: [ "name", "email" ],
    properties: {
      settings: {
        title: "Settings",
        description: "Configure the following.",
        type: "object",
        format: "tabs",
        properties: {
          "basic-input": {
            title: "Basic input page",
            description: "Basic contact settings",
            type: "object",
            properties: {
              branch: {
                title: "Branch",
                type: "string"
              },
                name: {
                  title: "Name",
                  type: "string"
                },
                address: {
                  title: "Address",
                  type: "string",
                  minLength: 3
                },
                city: {
                  title: "City",
                  type: "string",
                  minLength: 3
                },
                province: {
                  title: "Province",
                  type: "string",
                  minLength: 2
                },
                country: {
                  title: "Country",
                  type: "string",
                  minLength: 2
                },
                postalCode: {
                  title: "Postal/Zip Code",
                  type: "string",
                  pattern:
                    "[a-zA-Z][0-9][a-zA-Z]\\s*[0-9][a-zA-Z][0-9]|[0-9]{5}(-[0-9]{4})?"
                },
                email: {
                  title: "Email",
                  type: "string",
                  pattern:
                    "(?:^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$)|(?:^$)"
                },
                website: {
                  title: "Website",
                  type: "string",
                  format: "uri"
                },
                establishedDate: {
                  title: "Established Date",
                  type: "string",
                  format: "date"
                },
                closedDate: {
                  title: "Closed Date",
                  type: ["string", "null"],
                  format: "date"
                }
              }
            },
            arrays: {
            title: "Basic arrays page",
            description: "Demonstrates arrays",
            type: "object",
            properties: {
              phoneNumbers: {
                title: "Phone numbers",
                description: "List phone numbers and type of number.",
                type: "array",
                items: {
                  type: "object",
                  previewBy: ["phoneNumber"],                               //simple-fields array allows a preview field 
                                                                            //for progressive disclosure of array items
                  properties: {
                    type: {
                      title: "Type",
                      type: "string"
                    },
                    phoneNumber: {
                      title: "Phone Number",
                      type: "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
```

### Configuring schemaConverstion Property
```
type: {                         //For properties in "this.schema", define elements based on a property's "type"
  object: {                     //Defines element used when property's "type" is an "object"
    format: {                   //Optional: define elements for "object" properties by "format"
      "tabs": {                 //Defines element used for object properties when "format" is "tabs"
        element: "a11y-tabs"    //Element to create, eg. "paper-input", "select", "simple-fields-array", etc.
        label: "label"          //Optional: element that contains label, i.e. "label"
        description: ""         //Optional: element that contains description, i.e. "p", "span", "paper-tooltip", etc.
        child: {                //Optional: child elements to be appended
          element: "a11y-tab"   //Optional: type of child element, eg. "paper-input", "select", "simple-fields-array", etc.
          attributes: {         //Optional: sets child element's attributes based on this.schemaConverstion
            disabled: true      //Example: sets disabled to true  
          } 
          properties: {          //Optional: sets child element's attributes based on this.schema properties
            icon: "iconName"     //Example: sets child element's icon property to this.schema property's iconName 
          }, 
          slots: {               //Optional: inserts schema properties in child element's slots
            label: "label",      //Example: places schema property's label into child element's label slot
            "": "description"    //Example: places schema property's description into child element's unnamed slot
          } 
        },
        attributes: {},
        properties: {},
        slots: {}
      }
    },
    defaultSettings: {   //Default element used for object properties
      element: ""
      label: ""
      description: ""     
      attributes: {}       
      properties: {}       
      slots: {}           
    }
  }
}
``` 
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
    this.disableAutofocus = false;
    this.codeTheme = "vs-light-2";
    this.__fields = [];
    this.language = "en";
    this.resources = {};
    this.schemaConverstion = {
      defaultSettings: {
        element: "paper-input",
        errorProperty: "errorMessage",
        invalidProperty: "invalid",
        labelProperty: "label",
        attributes: {
          type: "text"
        },
        properties: {
          minLength: "minlength",
          maxLength: "maxlength"
        }
      },
      type: {
        array: {
          defaultSettings: {
            element: "simple-fields-array",
            errorProperty: "errorMessage",
            invalidProperty: "invalid",
            labelProperty: "label",
            descriptionProperty: "description",
            child: {
              element: "simple-fields-array-item",
              labelProperty: "label",
              descriptionProperty: "description",
              properties: {
                previewBy: "previewBy"
              }
            }
          }
        },
        boolean: {
          defaultSettings: {
            element: "paper-input",
            errorProperty: "errorMessage",
            invalidProperty: "invalid",
            labelProperty: "label",
            attributes: {
              autofocus: true,
              value: false
            },
            attributes: {
              type: "checkbox"
            }
          }
        },
        file: {
          defaultSettings: {
            element: "simple-fields-file"
          }
        },
        integer: {
          defaultSettings: {
            element: "paper-input",
            errorProperty: "errorMessage",
            invalidProperty: "invalid",
            labelProperty: "label",
            attributes: {
              autofocus: true,
              step: 1,
              type: "number"
            },
            properties: {
              minimum: "min",
              maximum: "max",
              multipleOf: "step"
            }
          }
        },
        markup: {
          defaultSettings: {
            element: "simple-fields-markup"
          }
        },
        number: {
          defaultSettings: {
            element: "paper-input",
            errorProperty: "errorMessage",
            invalidProperty: "invalid",
            labelProperty: "label",
            type: "number",
            attributes: {
              autofocus: true,
              type: "number"
            },
            properties: {
              minimum: "min",
              maximum: "max",
              multipleOf: "step"
            }
          }
        },
        object: {
          defaultSettings: {
            element: "simple-fields-fieldset",
            labelProperty: "label",
            descriptionProperty: "description"
          },
          format: {
            tabs: {
              defaultSettings: {
                element: "a11y-tabs",
                labelSlot: "label",
                child: {
                  element: "a11y-tab",
                  labelProperty: "label",
                  descriptionSlot: ""
                }
              }
            }
          }
        },
        string: {
          format: {
            "date-time": {
              defaultSettings: {
                element: "paper-input",
                errorProperty: "errorMessage",
                invalidProperty: "invalid",
                labelProperty: "label",
                attributes: {
                  autofocus: true,
                  type: "datetime-local"
                }
              }
            },
            time: {
              defaultSettings: {
                element: "paper-input",
                errorProperty: "errorMessage",
                invalidProperty: "invalid",
                labelProperty: "label",
                attributes: {
                  autofocus: true,
                  type: "time"
                }
              }
            },
            date: {
              defaultSettings: {
                element: "paper-input",
                errorProperty: "errorMessage",
                invalidProperty: "invalid",
                labelProperty: "label",
                attributes: {
                  autofocus: true,
                  type: "date"
                }
              }
            },
            email: {
              defaultSettings: {
                element: "paper-input",
                errorProperty: "errorMessage",
                invalidProperty: "invalid",
                labelProperty: "label",
                attributes: {
                  autofocus: true,
                  type: "email"
                }
              }
            },
            uri: {
              defaultSettings: {
                element: "paper-input",
                errorProperty: "errorMessage",
                invalidProperty: "invalid",
                labelProperty: "label",
                attributes: {
                  autofocus: true,
                  type: "url"
                }
              }
            }
          }
        }
      }
    };
    this.value = {};
    setTimeout(() => {
      import("@polymer/iron-icons/iron-icons.js");
      import("@polymer/iron-icons/editor-icons.js");
      import("@polymer/paper-input/paper-input.js");
      import("@polymer/paper-icon-button/paper-icon-button.js");
    }, 0);
  }

  static get tag() {
    return "simple-fields-schema";
  }

  static get properties() {
    return {
      ...super.properties,
      disableAutofocus: {
        type: Boolean,
      },
      /* 
       * Error messages by field name, 
       * eg. `{ contactinfo.email: "A valid email is required." }`
      */
      error: {
        type: Object
      },
      label: {
        type: String
      },
      /* 
       * Language of the fields.
       */
      language: {
        type: String,
        attribute: "lang",
        reflect: true
      },
      resources: {
        type: Object
      },
      /* 
       * Fields schema.
       * _See [Fields Schema Format](fields-schema-format) above._
       */
      schema: {
        type: Object
      },
      /**
       * Conversion from JSON Schema to HTML form elements.
       * _See [Configuring schemaConverstion Property](configuring-the-schemaconverstion-property) above._
       */
      schemaConverstion: {
        type: Object
      },
      value: {
        type: Object
      }, 
      __fields: {
        type: Object
      }
    };
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      //console.log('changedProperties',propName,oldValue,this[propName]);
      if (propName === "schema") this._schemaChanged(this.schema, oldValue);
      if (propName === "value") this._valueChanged(this.value, oldValue);
      if (propName === "error") this._errorChanged();
    });
  }

  buildHtmlFromJsonSchema(
    schema = this.schema,
    target = this,
    prefix = "",
    child
  ) {
    let schemaProps = schema.properties,
      required = schema.required,
      schemaKeys = Object.keys(schemaProps || {});
    schemaKeys.forEach(key => {
      let schemaProp = schemaProps[key],
        data = child
          ? child
          : this._searchConversion(schemaProp, this.schemaConverstion);
      if (data && data.element) {
        let id = `${prefix}${key}`, 
          label =
            schemaProp.label ||
            schemaProp.title ||
            schemaProp.description ||
            key,
          desc = schemaProp.description 
            && (schemaProp.label || schemaProp.title)
            ? schemaProp.description
            : undefined,
          wrapper = document.createElement('simple-fields-field'),
          element = document.createElement(data.element),
          value = this._getValue(`${prefix}${key}`),
          valueProperty = data.valueProperty || schemaProp.valueProperty || "value",
          fieldData = [];
        console.log(prefix,key,id,schemaProp,data,element);
        
        element.autofocus = !this.disableAutofocus;
        element.resources = this.resources;
        element.setAttribute("name", id);
        element.setAttribute("language", this.language);
        element.id = id;
        wrapper.fieldId = id;
        wrapper.data = data;
        wrapper.field = element;
        wrapper.label = label;
        wrapper.desc = desc;
        fieldData = {
          id: id,
          element: element,
          data: data
        };

        //handle data type attributes
        Object.keys(data.attributes || {}).forEach(attr => {
          if (data.attributes[attr]) {
            element.setAttribute(attr, data.attributes[attr]);
          }
        });
        //console.log('attributes added',key,schemaProp,data,element);

        //handle schema properties
        Object.keys(data.properties || {}).forEach(prop => {
          if (data.properties[prop] && schemaProp[prop]) {
            element[data.properties[prop]] = schemaProp[prop];
          }
        });
        //console.log('props added',key,schemaProp,data,element);

        //handle data type slots
        Object.keys(data.slots || {}).forEach(slot => {
          if (data.slots[slot] && schemaProp[data.slots[slot]]) {
            data.slots[slot].split(/[\s,]/).forEach(field => {
              let span = document.createElement("span");
              span.slot = slot;
              span.innerHTML = schemaProp[field];
              element.appendChild(span);
            });
          }
        });
        //console.log('slots added',key,schemaProp,data,element);

        //handle required fields
        if (required && required.includes(key))
          element.setAttribute("required", true);
        //console.log('required handled',key,required);
        
        //handle labels
        //this._addLabel(label,element,target,data);
        //console.log('labelled',label,element,target);

        //place field in correct slot of its parent
        if (target.slots && target.slots[key]) element.slot = target.slots[key];
        //console.log('field slotted',key,schemaProp,data,element);

        //append element
        wrapper.appendChild(element);
        target.appendChild(wrapper);
        //console.log('field appended ',element.name,element,target);

        //handles arrays
        if (schemaProp.items) {
          this._addArrayItems(value,data.child,schemaProp,element);
          /*schemaProp.counter = value ? value.length - 1 : 0;
          if (value) {
            value.forEach((item, i) => {
              this._buildArrayItemFromSubschema(
                i,
                schemaProp,
                element,
                data.child
              );
            });
          }
          element.addEventListener("add", e => {
            schemaProp.counter++;
            this._setValue(`${element.name}.${value.length}`, {});
            this._buildArrayItemFromSubschema(
              schemaProp.counter,
              schemaProp,
              element,
              data.child
            );
          });
          element.addEventListener("remove", e => {
            let temp = this._deepClone(value);
            temp.splice(parseInt(e.detail.id.replace(/item-/, "")), 1);
            this._setValue(`${element.name}`, temp);
            e.detail.remove();
          });*/
        }
        //handles objects
        else if (schemaProp.properties) {
          this.buildHtmlFromJsonSchema(
            schemaProp,
            element,
            `${element.id}.`,
            data.child
          );
        } else {
          if (value)
            element.setAttribute(valueProperty, value);
        }
        //console.log('children added',element,target);

        //handle description
        //this._addDescription(desc,element,target,data);
        //console.log('description added',desc,element,target);

        this.__fields.push(fieldData);

        element.addEventListener(`${valueProperty}-changed`, e =>
          this._handleChange(element, valueProperty)
        );
      }
    });
  }

  _addArrayItems(value,child,schemaProp,element){
    //console.log('adding items',value,child,schemaProp,element);
    schemaProp.counter = value ? value.length - 1 : 0;
    if (value) {
      value.forEach((item, i) => {
        //console.log('adding item',i,item);
        this._buildArrayItemFromSubschema(
          i,
          schemaProp,
          element,
          child
        );
      });
    }
    element.addEventListener("add", e => {
      schemaProp.counter++;
      this._setValue(`${element.name}.${value.length}`, {});
      this._buildArrayItemFromSubschema(
        schemaProp.counter,
        schemaProp,
        element,
        child
      );
    });
    element.addEventListener("remove", e => {
      let temp = this._deepClone(value);
      temp.splice(parseInt(e.detail.id.replace(/item-/, "")), 1);
      this._setValue(`${element.name}`, temp);
      e.detail.remove();
    });
  }

  /**
   * adds a label above an input
   * adds a description to labelProperty, labelSlot, or as label before
   * @param {string} label
   * @param {object} element input element
   * @param {object} data configuration for this element type
   * @returns {object} label element
   */
  _addLabel(label,element,target,data){
    //console.log('_addLabel',label,element,target,data);
    if(label && data.labelProperty) {
      element[data.labelProperty] = label;
    } else if(label) {
      let el = document.createElement("label");
      el.id = `${element.name}-label`;
      el.innerHTML = label;
      el.setAttribute("for", element.name);
      if(data.labelSlot) {
        el.slot = data.labelSlot;
        element.appendChild(el);
      } else {
        target.appendChild(el);
      }
      element.setAttribute("aria-labeledby", el.id);
    }
  }

  /**
   * adds a description to descriptionProperty, descriptionSlot, or div after
   * @param {string} desc description
   * @param {object} element input element
   * @param {object} data configuration for this element type
   * @returns {object} description element
   */
  _addDescription(desc,element,target,data){
    //console.log('_addDescription',desc,element,target,data);
    if(desc && data.descriptionProperty) {
      element[data.descriptionProperty] = desc;
    } else if(desc) {
      let el = document.createElement("div");
      el.id = `${element.name}-desc`;
      el.innerHTML = desc;
      el.setAttribute("for", element.name);
      if(data.descriptionSlot) {
        el.slot = data.descriptionSlot;
        element.appendChild(el);
      } else {
        el.class = "field-description";
        target.appendChild(el);
      }
      element.setAttribute("aria-describedby", el.id);
    }
  }
  /**
   * uses array part of schema to add array item's fields
   *
   * @param {integer} i index of array item
   * @param {object} subschema array part of schema
   * @param {object} element array element
   * @param {object} item array item element
   */
  _buildArrayItemFromSubschema(i, subschema, element, item) {
    subschema.properties = {};
    subschema.properties[i] = subschema.items;
    subschema.properties[i].label = `${i + 1}`;
    this.buildHtmlFromJsonSchema(subschema, element, `${element.id}.`, item);
  }
  /**
   * handles changes to fields
   *
   * @param {object} element element that changed
   * @param {object} valueProperty
   */
  _handleChange(element, valueProperty) {
    this._setValue(element.name, element[valueProperty]);
    //console.log(element.name, element, element[valueProperty]);
    this._fireValueChanged();
  }

  /**
   * matches schema property to schemaConverstion settings
   *
   * @param {object} property a property in the schema
   * @param {object} conversion a section of schemaConverstion to search
   * @param {object} settings closest current match
   * @returns {object}
   */
  _searchConversion(property, conversion, settings) {
    let propKeys = Object.keys(property || {}),
      convKeys = Object.keys(conversion || {}).filter(key =>
        propKeys.includes(key)
      );
    if (conversion.defaultSettings) settings = conversion.defaultSettings;
    convKeys.forEach(key => {
      let val = property[key],
        convData = conversion ? conversion[key] : undefined,
        convVal = !convData
          ? undefined
          : Array.isArray(val)
          ? convData[val[0]]
          : convData[val];
      if (convVal)
        settings = this._searchConversion(property, convVal, settings);
    });
    return settings;
  }

  /**
   * sets value of a property
   *
   * @param {string} propName property to set
   * @param {*} propVal value of property
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
      //console.log('gv',path,pointer,prop,pointer[prop]);
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
   * clears form
   */
  _clearForm() {
    this.querySelectorAll("*").forEach(child => child.remove());
    this.__fields = [];
  }
  /**
   * handles errors
   * @todo how do we want to handle errors for nested fields?
   */
  _errorChanged() {
    console.log(
      "_errorChanged",
      this,
      this.__fields,
      this.querySelectorAll("[name]"),
      this.error
    );
    this.__fields.forEach(field => {
      if (this.error && this.error[field.id]) {
        console.log(
          "error",
          field.id,
          field.element,
          field.data,
          this.error[field.id]
        );
        if(field.data.invalidProperty) {
          field.element[field.data.invalidProperty] = true;
        } else {
          field.element.setAttribute('aria-invalid',true);
        }
        if(field.data.errorProperty) {
          field.element[field.data.errorProperty] = this.error[field.id];
        }
        console.log(
          "error",
          field.id,
          field.element,
          field.data,
          field.data.errorProperty,
          field.data.invalidProperty,
          field.element[field.data.invalidProperty],
          this.error[field.id]
        );

        //el.error = this.error[name];
      } else {
        if(field.data.invalidProperty) {
          field.element[field.data.invalidProperty] = false;
        } else {
          field.element.setAttribute('aria-invalid',false);
        }
        if(field.data.errorProperty) {
          field.element[field.data.errorProperty] = undefined;
        }
      }
    });
  }

  /**
   * clones an object and all its subproperties
   * @param {object} o object to clone
   * @returns {object} cloned object
   */
  _deepClone(o) {
    return JSON.parse(JSON.stringify(o));
  }
  /**
   * clears and rebuilds form
   */
  _rebuildForm() {
    this._clearForm();
    if (this.schema) {
      this.buildHtmlFromJsonSchema();
    }
    //console.log('fields',this.__fields);
  }

  /**
   * fires when value changes
   * @event value-changed
   */
  _fireValueChanged() {
    /*console.log(
      "value-changed",
      this.value,
      new CustomEvent("value-changed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );*/
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
  }
  /**
   * updates form  and fires event when value changes
   * @param {object} newValue new value for schema
   * @param {object} oldValue old value for schema
   */
  _valueChanged(newValue, oldValue) {
    /*console.log('before sort',vals);
            sort = data.child && data.child.slots ? data.child.slots.sort : undefined
    if(sort && subschema.sortBy && vals) {
      vals = vals.sort((a, b) => {
        let i = 0,
          ai = 0,
          bi = 0;
        while (i < subschema.sortBy.length && ai === bi) {
          ai = a[subschema.sortBy[i]];
          bi = b[subschema.sortBy[i]];
          i++;
        }
        return ai === bi ? 0 : ai < bi ? -1 : 1;
      });
    }
    console.log('after sort',vals);
    Object.keys(data.child.slots || {}).forEach(key=>{
      let slot = data.child.slots[key];
      console.log('----->',element.name,schema,data,schema[key],subschema[key]);
    });
    */
    if (newValue && newValue !== oldValue) this._fireValueChanged();
  }
  /**
   * updates form and fires event when schema changes
   * @param {object} newValue new value for schema
   * @param {object} oldValue old value for schema
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
