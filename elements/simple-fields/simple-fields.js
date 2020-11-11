/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleFieldsLite } from "./lib/simple-fields-lite.js";
import "./lib/simple-fields-field.js";
/**
 * `simple-fields`
 * Uses JSON Schema to display a series of fields
 * 
### Styling
`<simple-fields>` provides following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|--------
`--simple-fields-margin` | vertical margin around container | 16px
`--simple-fields-margin-small` | smaller vertical margin above field itself | 8px
`--simple-fields-border-radus` | default border-radius | 2px
`--simple-fields-color` | text color | black
`--simple-fields-error-color` | error text color | #dd2c00
`--simple-fields-accent-color` | accent text/underline color | #3f51b5
`--simple-fields-border-color` | border-/underline color | #999
`--simple-fields-border-color-light` | used for range tracks | #ccc
`--simple-fields-faded-error-color` | used for range tracks | #ff997f

#### Field text
Custom property | Description | Default
----------------|-------------|--------
`--simple-fields-font-size` | font-size of field | 16px
`--simple-fields-font-family` | font-size of field | sans-serif
`--simple-fields-line-height` | line-height of field | 22px

#### Detail text
Custom property | Description | Default
----------------|-------------|--------
`--simple-fields-detail-font-size` | font-size of field details | 12px
`--simple-fields-detail-font-family` | font-size of field details | sans-serif
`--simple-fields-detail-line-height` | line-height of field details | 22px

#### Disabled Fields
Custom property | Description | Default
----------------|-------------|--------
`--simple-fields-disabled-color` | disabled text color | #999
`--simple-fields-disabled-opacity` | opacity for disabled field | 0.7

#### Radio Buttons and Checkboxes
Custom property | Description | Default
----------------|-------------|--------
`--simple-fields-radio-option-display` | display label with field (flex) or above (block) | flex
`--simple-fields-radio-option-flex-wrap` | allow radio options to wrap to next line | wrap

### Configuring schemaConversion Property
You can customise elements from JSON schema conversion by setting `schemaConversion` property.
```
type: {                                       //For properties in "this.schema", define elements based on a property's "type"
  object: {                                   //Defines element used when property's "type" is an "object"
    format: {                                 //Optional: define elements for "object" properties by "format"
      "tabs": {                               //Defines element used for object properties when "format" is "tabs"
        element: "a11y-tabs"                  //Element to create, eg. "paper-input", "select", "simple-fields-array", etc.
        descriptionProperty: "description"    //Optional: element's property that sets its description, e.g. "description"
        descriptionSlot: "description"        //Optional: element's slot that contains its description, e.g. "description"
        errorProperty: "error"                //Optional: element's property that sets its error status, e.g. "error"
        errorChangedProperty: "error"         //Optional: event element fires when error status changes, e.g. "error-changed"
        errorMessageProperty: "errorMessage"  //Optional: element's property that sets its error message, e.g. "errorMessage"
        errorMessageSlot: "errorMessage"      //Optional: element's slot that contains its error message, e.g. "errorMessage"
        labelProperty: "label"                //Optional: element's property that sets its label, e.g. "label"
        labelSlot: "label"                    //Optional: element's slot that contains its label, e.g. "label"
        valueProperty: "value"                //Optional: element's property that gets its value, e.g. "value" or "checked"
        setValueProperty: "value"             //Optional: element's property that sets its value, e.g. "value" or "checked" (default is same as valueProperty)
        valueChangedProperty: "value-changed" //Optional: event element fires when value property changes, e.g. "value-changed" or "click"
        valueSlot: ""                         //Optional: element's slot that's used to set its value, e.g. ""
        description: ""                       //Optional: element that contains description, e.g. "p", "span", "paper-tooltip", etc.
        child: {                              //Optional: child elements to be appended
          element: "a11y-tab"                 //Optional: type of child element, eg. "paper-input", "select", "simple-fields-array", etc.
          attributes: {                       //Optional: sets child element's attributes based on this.schemaConversion
            disabled: true                    //Example: sets disabled to true  
          } 
          properties: {                       //Optional: sets child element's attributes based on this.schema properties
            icon: "iconName"                  //Example: sets child element's icon property to this.schema property's iconName 
          }, 
          slots: {                            //Optional: inserts schema properties in child element's slots
            label: "label",                   //Example: places schema property's label into child element's label slot
            "": "description"                 //Example: places schema property's description into child element's unnamed slot
          } 
        },
        attributes: {},
        properties: {},
        slots: {}
      }
    },
    defaultSettings: {                        //Default element used for object properties
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
### Configuring fieldsConversion Property
You can customise fields to JSON schema conversion by setting `fieldsConversion` property.
```
defaultSettings: {            //default JSON schema type if no type is matched
  type: "string"              //sets JSON schema type to string
},
inputMethod: {                //for fields in "this.fields", define elements based on a property's "inputMethod"
  colorpicker: {              //settings if inputMethod is color picker
    defaultSettings: {        //default colorpicker settings
      type: "string",         //sets JSON schema type to string
      format: "color"         //sets JSON schema format to color
    }
  }
}
``` 
 * @element simple-fields
 * @extends simple-fields-lite
 * @demo ./demo/index.html
 * @demo ./demo/schema.html Schema
 * @demo ./demo/conditional.html Conditional Logic
 * @demo ./demo/subschema.html Subschemas
 * @demo ./demo/form.html Form
 */
class SimpleFields extends SimpleFieldsLite {
  //styles function
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          --simple-picker-background-color: var(
            --simple-fields-background-color,
            white
          );
          --simple-picker-border-width: 0;
          --simple-picker-focus-border-width: 0;
          --simple-picker-display: block;
          --simple-picker-listbox-border-width: 1px;
          --simple-picker-listbox-outline: none;
        }

        :host([hidden]) {
          display: none;
        }
      `,
    ];
  }

  // render function
  render() {
    return html` <div id="schema-fields" aria-live="polite">
      <slot></slot>
    </div>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {};
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * Fields to convert to JSON Schema.
       */
      fields: {
        type: Array,
      },
      /**
       * Conversion from fields array with inputMethods to JSON schema types and formats.
       * _See [Configuring fieldsConversion Property](configuring-the-fieldsconversion-property) above._
       */
      schematizer: {
        type: Object,
        attribute: "schematizer",
      },
      /**
       * Schema label
       */
      label: {
        type: String,
      },
      /**
       * tracks all activeTabs as an object
       */
      __activeTabs: {
        type: Object,
        attribute: "active-path",
      },
      disableResponsive: {
        type: Boolean,
        attribute: "disable-responsive",
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-fields";
  }
  constructor() {
    super();
    this.activeTabs = {};
    this.disableResponsive = false;
    setTimeout(() => {
      this.addEventListener("active-tab-changed", this._handleActiveTab);
    }, 0);
  }

  /**
   * fields converted to JSON schema =
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
      properties: this.fieldsToSchema(this.fields),
    };
    return schema;
  }
  /**
   * gets JSON schema to form element conversion object
   *
   * @readonly
   * @memberof SimpleFields
   */
  get schemaConversion() {
    return (
      this.elementizer || {
        defaultSettings: {
          element: "simple-fields-field",
          errorProperty: "errorMessage",
          invalidProperty: "invalid",
          noWrap: true,
          attributes: {
            type: "text",
          },
          properties: {
            minLength: "minlength",
            maxLength: "maxlength",
          },
        },
        format: {
          radio: {
            defaultSettings: {
              element: "simple-fields-field",
              noWrap: true,
              attributes: {
                autofocus: true,
                type: "radio",
              },
              properties: {
                options: "options",
              },
              child: {
                element: "simple-fields-array-item",
                noWrap: true,
                descriptionProperty: "description",
                properties: {
                  previewBy: "previewBy",
                },
              },
            },
          },
          select: {
            defaultSettings: {
              element: "simple-fields-field",
              noWrap: true,
              attributes: {
                autofocus: true,
                type: "select",
              },
              properties: {
                options: "options",
                items: "itemsList",
              },
            },
          },
          "simple-picker": {
            defaultSettings: {
              import: "@lrnwebcomponents/simple-picker/simple-picker.js",
              element: "simple-picker",
              attributes: {
                autofocus: true,
              },
              properties: {
                options: "options",
              },
            },
          },
        },
        type: {
          array: {
            defaultSettings: {
              element: "simple-fields-array",
              noWrap: true,
              descriptionProperty: "description",
              child: {
                element: "simple-fields-array-item",
                noWrap: true,
                descriptionProperty: "description",
                properties: {
                  previewBy: "previewBy",
                },
              },
            },
          },
          boolean: {
            defaultSettings: {
              element: "simple-fields-field",
              noWrap: true,
              attributes: {
                autofocus: true,
                type: "checkbox",
                value: false,
              },
            },
          },
          file: {
            defaultSettings: {
              element: "simple-fields-field",
              noWrap: true,
              attributes: {
                autofocus: true,
                type: "file",
              },
              properties: {
                accepts: "accepts",
              },
            },
          },
          integer: {
            defaultSettings: {
              element: "simple-fields-field",
              noWrap: true,
              attributes: {
                autofocus: true,
                step: 1,
                type: "number",
              },
              properties: {
                minimum: "min",
                maximum: "max",
                multipleOf: "step",
              },
            },
          },
          markup: {
            defaultSettings: {
              import:
                "@lrnwebcomponents/simple-fields/lib/simple-fields-code.js",
              element: "simple-fields-code",
              setValueProperty: "editorValue",
              noWrap: true,
            },
            format: {
              "md-block": {
                defaultSettings: {
                  element: "md-block",
                  setValueProperty: "source",
                  noWrap: true,
                },
              },
            },
          },
          number: {
            defaultSettings: {
              element: "simple-fields-field",
              noWrap: true,
              type: "number",
              attributes: {
                autofocus: true,
                type: "number",
              },
              properties: {
                minimum: "min",
                maximum: "max",
                multipleOf: "step",
              },
            },
          },
          object: {
            defaultSettings: {
              element: "simple-fields-fieldset",
              noWrap: true,
            },
            format: {
              tabs: {
                defaultSettings: {
                  import:
                    "@lrnwebcomponents/simple-fields/lib/simple-fields-tabs.js",
                  element: "simple-fields-tabs",
                  noWrap: true,
                  child: {
                    import:
                      "@lrnwebcomponents/simple-fields/lib/simple-fields-tab.js",
                    element: "simple-fields-tab",
                    noWrap: true,
                    labelSlot: "label",
                    descriptionSlot: "",
                  },
                  properties: {
                    layoutBreakpoint: "layoutBreakpoint",
                    iconBreakpoint: "iconBreakpoint",
                    sticky: "sticky",
                    disableResponsive: this.disableResponsive,
                  },
                },
              },
              fields: {
                defaultSettings: {
                  element: "simple-fields",
                  noWrap: true,
                  descriptionProperty: "description",
                  properties: {
                    schema: "schema",
                  },
                },
              },
            },
          },
          string: {
            format: {
              alt: {
                defaultSettings: {
                  element: "simple-fields-field",
                  noWrap: true,
                  attributes: {
                    autofocus: true,
                    required: true,
                  },
                },
              },
              color: {
                defaultSettings: {
                  element: "simple-fields-field",
                  noWrap: true,
                  attributes: {
                    autofocus: true,
                    type: "color",
                  },
                },
              },
              colorpicker: {
                defaultSettings: {
                  import:
                    "@lrnwebcomponents/simple-colors/lib/simple-colors-picker.js",
                  element: "simple-colors-picker",
                  attributes: {
                    autofocus: true,
                  },
                },
              },
              date: {
                defaultSettings: {
                  element: "simple-fields-field",
                  noWrap: true,
                  attributes: {
                    autofocus: true,
                    type: "date",
                  },
                },
              },
              "date-time": {
                defaultSettings: {
                  element: "simple-fields-field",
                  noWrap: true,
                  attributes: {
                    autofocus: true,
                    type: "datetime-local",
                  },
                },
              },
              date: {
                defaultSettings: {
                  element: "simple-fields-field",
                  noWrap: true,
                  attributes: {
                    autofocus: true,
                    type: "date",
                  },
                },
              },
              email: {
                defaultSettings: {
                  element: "simple-fields-field",
                  noWrap: true,
                  attributes: {
                    autofocus: true,
                    type: "email",
                  },
                },
              },
              fileupload: {
                defaultSettings: {
                  import:
                    "@lrnwebcomponents/simple-fields/lib/simple-fields-upload.js",
                  element: "simple-fields-upload",
                  noWrap: true,
                  attributes: {
                    autofocus: true,
                  },
                },
              },
              iconpicker: {
                defaultSettings: {
                  import:
                    "@lrnwebcomponents/simple-icon-picker/simple-icon-picker.js",
                  element: "simple-icon-picker",
                  attributes: {
                    autofocus: true,
                  },
                },
              },
              month: {
                defaultSettings: {
                  element: "simple-fields-field",
                  noWrap: true,
                  attributes: {
                    autofocus: true,
                    type: "month",
                  },
                },
              },
              textarea: {
                defaultSettings: {
                  element: "simple-fields-field",
                  noWrap: true,
                  attributes: {
                    autofocus: true,
                    type: "textarea",
                  },
                },
              },
              time: {
                defaultSettings: {
                  element: "simple-fields-field",
                  noWrap: true,
                  attributes: {
                    autofocus: true,
                    type: "time",
                  },
                },
              },
              uri: {
                defaultSettings: {
                  element: "simple-fields-field",
                  noWrap: true,
                  attributes: {
                    autofocus: true,
                    type: "file",
                  },
                },
              },
            },
          },
        },
      }
    );
  }
  /**
   * gets fields array to JSON schema conversion object
   *
   * @readonly
   * @memberof SimpleFields
   */
  get fieldsConversion() {
    return (
      this.schematizer || {
        defaultSettings: {
          type: "string",
        },
        format: {
          "simple-fields": {
            defaultSettings: {
              type: "object",
              format: "simple-fields",
            },
          },
        },
        inputMethod: {
          alt: {
            defaultSettings: {
              type: "string",
              format: "alt",
            },
          },
          array: {
            defaultSettings: {
              type: "array",
            },
            properties: {
              label: "itemLabel",
            },
          },
          boolean: {
            defaultSettings: {
              type: "boolean",
            },
          },
          code: {
            defaultSettings: {
              type: "markup",
            },
          },
          "code-editor": {
            defaultSettings: {
              type: "markup",
            },
          },
          color: {
            defaultSettings: {
              type: "string",
              format: "color",
            },
          },
          colorpicker: {
            defaultSettings: {
              type: "string",
              format: "colorpicker",
            },
          },
          "date-time": {
            defaultSettings: {
              type: "string",
              format: "date-time",
            },
          },
          datepicker: {
            defaultSettings: {
              type: "string",
              format: "date",
            },
          },
          fieldset: {
            defaultSettings: {
              type: "object",
            },
          },
          fileupload: {
            defaultSettings: {
              type: "string",
              format: "fileupload",
            },
          },
          haxupload: {
            defaultSettings: {
              type: "string",
              format: "fileupload",
            },
          },
          iconpicker: {
            defaultSettings: {
              type: "string",
              format: "iconpicker",
            },
          },
          markup: {
            defaultSettings: {
              type: "markup",
            },
          },
          "md-block": {
            defaultSettings: {
              type: "markup",
              format: "md-block",
            },
          },
          monthpicker: {
            defaultSettings: {
              type: "string",
              format: "month",
            },
          },
          number: {
            defaultSettings: {
              type: "number",
            },
          },
          object: {
            defaultSettings: {
              type: "object",
            },
          },
          select: {
            defaultSettings: {
              type: "string",
              format: "select",
            },
          },
          slider: {
            defaultSettings: {
              type: "number",
              format: "slider",
            },
          },
          tabs: {
            defaultSettings: {
              type: "object",
              format: "tabs",
            },
          },
          textarea: {
            defaultSettings: {
              type: "string",
              format: "textarea",
            },
          },
          timepicker: {
            defaultSettings: {
              type: "string",
              format: "time",
            },
          },
          weekpicker: {
            defaultSettings: {
              type: "string",
              format: "week",
            },
          },
        },
      }
    );
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (["fields", "fieldsConversion"].includes(propName))
        this.schema = this.convertedSchema;
      if (propName === "__activeTabs" && this.activeTabs !== oldValue)
        this._handleActiveTabs();
    });
  }
  /**
   * updates the active tabs object
   *
   * @param {string} tabId, eg. 'settings.permisions.groups'
   * @memberof SimpleFields
   */
  setActiveTab(tabId) {
    let tabsId = tabId.replace(/\.[0-9a-z]+$/, ""),
      tabs = this.querySelector(`#${tabsId}`),
      tab = tabs.querySelector(`#${tabId}`);

    if (tabs && tab) tabs.activeTab = tabId;
  }

  /**
   * sets active tabs by path, eg. 'settings/permissions/groups'
   *
   * @param {string} path, eg. 'settings/permissions/groups'
   * @memberof SimpleFields
   */
  setActivePath(path) {
    let parts = path.split("/"),
      tabId = "";
    parts.forEach((part) => {
      this.setActiveTab(part);
      tabId += part;
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
      convKeys = Object.keys(conversion || {}).filter((key) =>
        fieldKeys.includes(key)
      );
    if (conversion.defaultSettings) settings = conversion.defaultSettings;
    convKeys.forEach((key) => {
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
   * @param {object} field field object to convert
   * @returns object schema properties
   * @memberof SimpleFieldsLite
   */
  _fieldToSchema(field) {
    let schema = {};
    Object.keys(field || {}).forEach((key) => {
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
            properties: this.fieldsToSchema(field.properties),
          };
        } else if (conversion.type === "array") {
          schema.items = this._fieldToSchema(field.properties);
        } else {
          schema.properties = this.fieldsToSchema(field.properties);
        }
        /*} else if (key === "slot") {
        schema[key] = !field[key] || field[key] === "" 
          ? "unnamed-slot-placeholder" 
          : field[key];*/
      } else if (
        ![
          "items",
          "inputMethod",
          "property",
          "properties",
          "required",
          "type",
          "validation",
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
  fieldsToSchema(fields) {
    let schema = {};
    if (fields && fields.forEach) {
      fields.forEach((field) => {
        let prop = !field.property ? "" : field.property;
        schema[prop] = this._fieldToSchema(field);
      });
    }
    return schema;
  }
  /**
   * handles active tabs changes
   *
   * @event "active-tabs-changed"
   * @memberof SimpleFields
   */
  _handleActiveTabs() {
    this.dispatchEvent(
      new CustomEvent("active-tabs-changed", {
        bubbles: true,
        cancelable: true,
        composed: false,
        detail: this,
      })
    );
  }
  /**
   * updates the active tabs object
   *
   * @param {event} e
   * @memberof SimpleFields
   */
  _handleActiveTab(e) {
    if (e && e.detail && e.detail.id)
      this.activeTabs[e.detail.id] = e.detail.activeTab;
  }
}
window.customElements.define(SimpleFields.tag, SimpleFields);
export { SimpleFields };
