/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFieldsLite } from "./lib/simple-fields-lite.js";
import "./simple-fields-field.js";
/**
 * `simple-fields`
 * Uses eco-json-form and HAX wiring to display a series of fields
 * 
### Configuring fieldsConverstion Property
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
          attributes: {         //Optional: sets child element's attributes based on this.schemaConversion
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
 * @customElement simple-fields
 * @demo ./demo/index.html
 * @demo ./demo/schema.html Schema
 * @demo ./demo/form.html Form
 */
class SimpleFields extends SimpleFieldsLite {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-fields";
  }
  constructor() {
    super();
    this.fieldsConversion = {
      defaultSettings: {
        type: "string"
      },
      inputMethod: {
        alt: {
          defaultSettings: {
            type: "string"
          }
        },
        array: {
          defaultSettings: {
            type: "array"
          }
        },
        "code-editor": {
          defaultSettings: {
            type: "markup"
          }
        },
        markup: {
          defaultSettings: {
            type: "markup"
          }
        },
        boolean: {
          defaultSettings: {
            type: "boolean"
          }
        },
        colorpicker: {},
        datepicker: {
          defaultSettings: {
            type: "string",
            format: "date-time"
          }
        },
        fieldset: {
          defaultSettings: {
            type: "object"
          }
        },
        flipboolean: {},
        haxupload: {
          defaultSettings: {
            type: "uri"
          }
        },
        iconpicker: {},
        number: {
          defaultSettings: {
            type: "number"
          }
        },
        object: {
          defaultSettings: {
            type: "object"
          }
        },
        select: {
          defaultSettings: {
            type: "string",
            format: "select"
          }
        },
        slider: {
          defaultSettings: {
            type: "number",
            format: "slider"
          }
        },
        tabs: {
          defaultSettings: {
            type: "object",
            format: "tabs"
          }
        },
        textarea: {},
        textfield: {
          defaultSettings: {
            type: "string"
          },
          validationType: {
            url: {
              //???
              defaultSettings: {
                type: "string",
                format: "uri"
              }
            }
          }
        }
      }
    };
    this.schemaConversion = {
      defaultSettings: {
        element: "simple-fields-field",
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
      format: {
        radio: {
          defaultSettings: {
            element: "simple-fields-field",
            attributes: {
              autofocus: true,
              type: "radio"
            },
            properties: {
              options: "options"
            },
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
        select: {
          defaultSettings: {
            element: "simple-fields-field",
            attributes: {
              autofocus: true,
              type: "select"
            },
            properties: {
              options: "options"
            }
          }
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
            element: "simple-fields-field",
            errorProperty: "errorMessage",
            invalidProperty: "invalid",
            labelSlot: "",
            valueProperty: "checked",
            attributes: {
              autofocus: true,
              type: "checkbox",
              value: false
            }
          }
        },
        file: {
          defaultSettings: {
            element: "simple-fields-field",
            attributes: {
              autofocus: true,
              type: "file"
            },
            properties: {
              accepts: "accepts"
            }
          }
        },
        integer: {
          defaultSettings: {
            element: "simple-fields-field",
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
            element: "simple-fields-field",
            attributes: {
              autofocus: true,
              type: "textarea"
            }
          }
        },
        number: {
          defaultSettings: {
            element: "simple-fields-field",
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
                element: "simple-fields-field",
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
                element: "simple-fields-field",
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
                element: "simple-fields-field",
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
                element: "simple-fields-field",
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
                element: "simple-fields-field",
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
    setTimeout(() => {
      import("@lrnwebcomponents/a11y-tabs/a11y-tabs.js");
      import("@polymer/paper-input/paper-input.js");
      import("@polymer/paper-checkbox/paper-checkbox.js");
    }, 0);
  }
  /**
   * fields converted to JSON schema
   *
   * @readonly
   * @returns object
   * @memberof SimpleFieldsLite
   */
  get convertedSchema() {
    let schema = {
      $schema: "http://json-schema.org/schema#",
      title: this.label,
      type: "object",
      required: [],
      properties: this._fieldsToSchema(this.fields)
    };
    return schema;
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "fields") this.schema = this.convertedSchema;
    });
  }

  /**
   * matches schema property to fieldsConversion settings
   * @param {object} field fields array item
   * @param {object} conversion section of fieldsConverstion to search
   * @param {object} settings closest current match's defaultSettings object
   * @returns {object}
   * @memberof SimpleFieldsLite
   */
  _convertField(field, conversion = this.fieldsConversion, settings = {}) {
    let fieldKeys = Object.keys(field || {}),
      convKeys = Object.keys(conversion || {}).filter(key =>
        fieldKeys.includes(key)
      );
    if (conversion.defaultSettings) settings = conversion.defaultSettings;
    convKeys.forEach(key => {
      let val = field[key],
        convData = conversion ? conversion[key] : undefined,
        convVal = !convData
          ? undefined
          : Array.isArray(val)
          ? convData[val[0]]
          : convData[val];
      if (convVal) settings = this._convertField(field, convVal, settings);
    });
    return settings;
  }

  /**
   * converts fields array to schema properties
   * @param {*} field field object to convert
   * @returns object schema properties
   * @memberof SimpleFieldsLite
   */
  _fieldToSchema(field) {
    let schema = {};
    Object.keys(field || {}).forEach(key => {
      if (!field.inputMethod && field.properties) field.inputMethod = "object";
      let conversion = this._convertField(field);
      if (conversion.type) schema.type = conversion.type;
      if (conversion.format) schema.format = conversion.format;
      if (key === "pattern") {
        if (field.validation != ".*") schema.pattern = field.validation;
      } else if (key === "properties") {
        if (conversion.type === "array" && Array.isArray(field.properties)) {
          schema.items = {
            type: "object",
            properties: this._fieldsToSchema(field.properties)
          };
        } else if (conversion.type === "array") {
          schema.items = this._fieldToSchema(field.properties);
        } else {
          schema.properties = this._fieldsToSchema(field.properties);
        }
      } else if (
        ![
          "items",
          "inputMethod",
          "property",
          "properties",
          "required",
          "type",
          "validation"
        ].includes(key)
      ) {
        schema[key] = field[key];
      }
    });
    return schema;
  }

  /**
   * converts fields array to schema properties
   * @param {*} fields fields array to convert
   * @returns object schema properties
   * @memberof SimpleFieldsLite
   */
  _fieldsToSchema(fields) {
    let schema = {};
    fields.forEach(
      field => (schema[field.property] = this._fieldToSchema(field))
    );
    return schema;
  }
}
window.customElements.define(SimpleFields.tag, SimpleFields);
export { SimpleFields };
