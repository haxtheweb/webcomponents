import { LitElement, html, css } from "lit-element/lit-element.js";
import "./simple-fields-array.js";
import "@lrnwebcomponents/a11y-tabs/a11y-tabs.js";
import "./simple-fields-fieldset.js";
/**
 * `simple-fields-schema`
 * 
### Styling
`<simple-fields-schema>` provides following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|--------
`--simple-fields-schema-margin` | margin around simple-fields-schema | 15px 0

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
    this.autofocus = false;
    this.codeTheme = "vs-light-2";
    this.schemaConverstion = {
      defaultSettings: {
        element: "paper-input",
        attributes: {
          type: "text"
        },
        properties: {
          label: "label",
          minLength: "minlength",
          maxLength: "maxlength"
        }
      },
      type: {
        array: {
          defaultSettings: {
            element: "simple-fields-array",
            child: {
              element: "simple-fields-array-item",
              properties: {
                label: "label",
                description: "description",
                previewBy: "previewBy"
              }
            },
            sort: {
              element: "paper-input",
              attributes: {
                step: 1,
                type: "number"
              },
              properties: {
                label: "label",
                minimum: "min",
                maximum: "max",
                multipleOf: "step"
              }
            },
            properties: {
              label: "label",
              description: "description"
            }
          }
        },
        boolean: {
          defaultSettings: {
            element: "simple-fields-boolean",
            attributes: {
              autofocus: true,
              value: false
            },
            properties: {
              label: "label"
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
            attributes: {
              autofocus: true,
              step: 1,
              type: "number"
            },
            properties: {
              label: "label",
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
            type: "number",
            attributes: {
              autofocus: true,
              type: "number"
            },
            properties: {
              label: "label",
              minimum: "min",
              maximum: "max",
              multipleOf: "step"
            }
          }
        },
        object: {
          defaultSettings: {
            element: "simple-fields-fieldset",
            properties: {
              label: "label",
              description: "description"
            }
          },
          format: {
            tabs: {
              defaultSettings: {
                element: "a11y-tabs",
                label: 'label',
                description: 'p',
                slots: {
                  "label": "description"
                },
                child: {
                  element: "a11y-tab",
                  properties: {
                    label: "label"
                  },
                  slots: {
                    "": "description"
                  }
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
                attributes: {
                  autofocus: true,
                  type: "datetime-local"
                },
                properties: {
                  label: "label"
                }
              }
            },
            time: {
              defaultSettings: {
                element: "paper-input",
                attributes: {
                  autofocus: true,
                  type: "time"
                },
                properties: {
                  label: "label"
                }
              }
            },
            date: {
              defaultSettings: {
                element: "paper-input",
                attributes: {
                  autofocus: true,
                  type: "date"
                },
                properties: {
                  label: "label"
                }
              }
            },
            email: {
              defaultSettings: {
                element: "paper-input",
                attributes: {
                  autofocus: true,
                  type: "email"
                },
                properties: {
                  label: "label"
                }
              }
            },
            uri: {
              defaultSettings: {
                element: "paper-input",
                attributes: {
                  autofocus: true,
                  type: "url"
                },
                properties: {
                  label: "label"
                }
              }
            }
          }
        }
      }
    };
    this.language = "en";
    this.resources = {};
    this.value = {};
    setTimeout(() => {
      import("@polymer/iron-icons/iron-icons.js");
      import("@polymer/iron-icons/editor-icons.js");
      import("@polymer/paper-input/paper-input.js");
      import("@polymer/paper-icon-button/paper-icon-button.js");
      import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
      import("./simple-fields-info.js");
    }, 0);
  }

  static get tag() {
    return "simple-fields-schema";
  }

  static get properties() {
    return {
      ...super.properties,
      /** 
       * Conversion from JSON Schema to HTML form elements.
       * _See [Configuring schemaConverstion Property](configuring-the-schemaconverstion-property) above._
      */
      schemaConverstion: {
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
      }
    };
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      //console.log('changedProperties',propName,oldValue,this[propName]);
      if (propName === "schema") this._schemaChanged(this.schema, oldValue);
      if (propName === "value") this._valueChanged(this.value, oldValue);
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
        let label =
            schemaProp.label ||
            schemaProp.title ||
            schemaProp.description ||
            key,
          desc =
            schemaProp.label || schemaProp.title
              ? schemaProp.description
              : undefined,
          element = document.createElement(data.element),
          value = this._getValue(`${prefix}${key}`),
          valueProperty = data.valueProperty || "value",
          labelEl, descEl;

        element.name = `${prefix}${key}`;
        element[valueProperty] = value;
        element.resources = this.resources;
        element.setAttribute("language", this.language);
        schemaProp.label = label;
        schemaProp.description = desc;

        //handle data type attributes
        Object.keys(data.attributes || {}).forEach(attr => {
          if (data.attributes[attr]) {
            element.setAttribute(attr, data.attributes[attr]);
          }
        });

        //handle schema properties
        Object.keys(data.properties || {}).forEach(prop => {
          if (data.properties[prop] && schemaProp[prop]) {
            element[data.properties[prop]] = schemaProp[prop];
          }
        });

        //handle data type slots
        Object.keys(data.slots || {}).forEach(slot => {
          if (data.slots[slot] && schemaProp[data.slots[slot]]) {
            data.slots[slot].split(/[\s,]/).forEach(field=>{
              let span = document.createElement('span');
              span.slot = slot;
              span.innerHTML = schemaProp[field];
              element.appendChild(span);
            });
          }
        });

        //place field in correct slot of its parent
        if (target.slots && target.slots[key]) element.slot = target.slots[key];

        //handle required fields
        if (required && required.includes(key))
          element.setAttribute("required", true);

        //handles label if not already added as an attribute, property, or slot
        if (label  && data.label) {
          labelEl = document.createElement(data.label.element || 'label');
          labelEl.id = `${element.name}-label`;
          labelEl.innerHTML = label;
          labelEl.setAttribute("for", element.name);
          target.setAttribute("aria-labeledby", labelEl.id);
        }
        //handles description if not already added as an attribute, property, or slot
        if (desc && data.description) {
          descEl = document.createElement(data.description.element || 'p');
          descEl.id = `${element.name}-desc`;
          descEl.classList.add = 'description';
          descEl.innerHTML = desc;
          target.setAttribute("aria-describedby", descEl.id);
        }
        
        //handles arrays
        if (schemaProp.items) {
          schemaProp.counter = value ? value.length - 1 : 0;
          if (value){
            value.forEach((item, i) => {
              this._buildArrayItemFromSubschema(i,schemaProp,element,data.child);
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
          }
          );
          element.addEventListener("remove", e => {
            let temp = this._deepClone(value);
            temp.splice(parseInt(e.detail.id.replace(/item-/, "")), 1);
            this._setValue(`${element.name}`, temp);
            e.detail.remove();
          });
        }
        //handles objects
        else if (schemaProp.properties) {
          this.buildHtmlFromJsonSchema(
            schemaProp,
            element,
            `${element.name}.`,
            data.child
          );
        } else {
          if (value && !element.getAttribute(valueProperty))
            element.setAttribute(valueProperty, value);
        }
        target.appendChild(element);

        element.addEventListener(`${valueProperty}-changed`, e =>
          this._handleChange(element, valueProperty)
        );
      }
    });
  }
  /**
   * uses array part of schema to add array item's fields
   *
   * @param {integer} i index of array item
   * @param {object} subschema array part of schema
   * @param {object} element array element
   * @param {object} item array item element
   */
  _buildArrayItemFromSubschema(i,subschema,element,item){
    subschema.properties = {};
    subschema.properties[i] = subschema.items;
    subschema.properties[i].label = `${i + 1}`;
    this.buildHtmlFromJsonSchema(
      subschema,
      element,
      `${element.name}.`,
      item
    );
  }
  /**
   * handles changes to fields
   *
   * @param {object} element element that changed
   * @param {object} valueProperty
   */
  _handleChange(element, valueProperty) {
    this._setValue(element.name,element[valueProperty]);
    console.log(element.name, element, element[valueProperty]);
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
  }

  /**
   * fires when value changes
   * @event value-changed
   */
  _fireValueChanged() {
    console.log(
      "value-changed",
      this.value,
      new CustomEvent("value-changed", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
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
