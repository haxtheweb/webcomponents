"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleFields = void 0;

var _litElement = require("lit-element/lit-element.js");

var _simpleFieldsLite = require("./lib/simple-fields-lite.js");

require("./lib/simple-fields-field.js");

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(receiver);
      }
      return desc.value;
    };
  }
  return _get(target, property, receiver || target);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true },
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

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
var SimpleFields =
  /*#__PURE__*/
  (function (_SimpleFieldsLite) {
    _inherits(SimpleFields, _SimpleFieldsLite);

    _createClass(SimpleFields, null, [
      {
        key: "tag",

        /* REQUIRED FOR TOOLING DO NOT TOUCH */

        /**
         * Store the tag name to make it easier to obtain directly.
         * @notice function name must be here for tooling to operate correctly
         */
        get: function get() {
          return "simple-fields";
        },
      },
    ]);

    function SimpleFields() {
      var _this;

      _classCallCheck(this, SimpleFields);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleFields).call(this)
      );
      _this.activeTabs = {};
      _this.disableResponsive = false;
      setTimeout(function () {
        _this.addEventListener("active-tab-changed", _this._handleActiveTab);
      }, 0);
      return _this;
    }
    /**
     * fields converted to JSON schema =
     *
     * @readonly
     * @returns object
     * @memberof SimpleFieldsLite
     */

    _createClass(SimpleFields, [
      {
        key: "updated",
        value: function updated(changedProperties) {
          var _this2 = this;

          if (_get(_getPrototypeOf(SimpleFields.prototype), "updated", this)) {
            _get(_getPrototypeOf(SimpleFields.prototype), "updated", this).call(
              this,
              changedProperties
            );
          }

          changedProperties.forEach(function (oldValue, propName) {
            if (["fields", "fieldsConversion"].includes(propName))
              _this2.schema = _this2.convertedSchema;
            if (propName === "__activeTabs" && _this2.activeTabs !== oldValue)
              _this2._handleActiveTabs();
          });
        },
        /**
         * updates the active tabs object
         *
         * @param {string} tabId, eg. 'settings.permisions.groups'
         * @memberof SimpleFields
         */
      },
      {
        key: "setActiveTab",
        value: function setActiveTab(tabId) {
          var tabsId = tabId.replace(/\.[0-9a-z]+$/, ""),
            tabs = this.querySelector("#".concat(tabsId)),
            tab = tabs.querySelector("#".concat(tabId));
          if (tabs && tab) tabs.activeTab = tabId;
        },
        /**
         * sets active tabs by path, eg. 'settings/permissions/groups'
         *
         * @param {string} path, eg. 'settings/permissions/groups'
         * @memberof SimpleFields
         */
      },
      {
        key: "setActivePath",
        value: function setActivePath(path) {
          var _this3 = this;

          var parts = path.split("/"),
            tabId = "";
          parts.forEach(function (part) {
            _this3.setActiveTab(part);

            tabId += part;
          });
        },
        /**
         * matches schema property to fieldsConversion settings
         * @param {object} field fields array item
         * @param {object} conversion section of fieldsConverstion to search
         * @param {object} settings closest current match's defaultSettings object
         * @returns {object}
         * @memberof SimpleFieldsLite
         */
      },
      {
        key: "_convertField",
        value: function _convertField(field) {
          var _this4 = this;

          var conversion =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : this.fieldsConversion;
          var settings =
            arguments.length > 2 && arguments[2] !== undefined
              ? arguments[2]
              : {};
          var fieldKeys = Object.keys(field || {}),
            convKeys = Object.keys(conversion || {}).filter(function (key) {
              return fieldKeys.includes(key);
            });
          if (conversion.defaultSettings) settings = conversion.defaultSettings;
          convKeys.forEach(function (key) {
            var val = field[key],
              convData = conversion ? conversion[key] : undefined,
              convVal = !convData
                ? undefined
                : Array.isArray(val)
                ? convData[val[0]]
                : convData[val];
            if (convVal)
              settings = _this4._convertField(field, convVal, settings);
          });
          return settings;
        },
        /**
         * converts fields array to schema properties
         * @param {object} field field object to convert
         * @returns object schema properties
         * @memberof SimpleFieldsLite
         */
      },
      {
        key: "_fieldToSchema",
        value: function _fieldToSchema(field) {
          var _this5 = this;

          var schema = {};
          Object.keys(field || {}).forEach(function (key) {
            if (!field.inputMethod && field.properties)
              field.inputMethod = "object";

            var conversion = _this5._convertField(field);

            if (conversion.type) schema.type = conversion.type;
            if (conversion.format) schema.format = conversion.format;

            if (key === "pattern") {
              if (field.validation != ".*") schema.pattern = field.validation;
            } else if (key === "properties") {
              if (
                conversion.type === "array" &&
                Array.isArray(field.properties)
              ) {
                schema.items = {
                  type: "object",
                  properties: _this5.fieldsToSchema(field.properties),
                };
              } else if (conversion.type === "array") {
                schema.items = _this5._fieldToSchema(field.properties);
              } else {
                schema.properties = _this5.fieldsToSchema(field.properties);
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
        },
        /**
         * converts fields array to schema properties
         * @param {*} fields fields array to convert
         * @returns object schema properties
         * @memberof SimpleFieldsLite
         */
      },
      {
        key: "fieldsToSchema",
        value: function fieldsToSchema(fields) {
          var _this6 = this;

          var schema = {};

          if (fields && fields.forEach) {
            fields.forEach(function (field) {
              var prop = !field.property ? "" : field.property;
              schema[prop] = _this6._fieldToSchema(field);
            });
          }

          return schema;
        },
        /**
         * handles active tabs changes
         *
         * @event "active-tabs-changed"
         * @memberof SimpleFields
         */
      },
      {
        key: "_handleActiveTabs",
        value: function _handleActiveTabs() {
          this.dispatchEvent(
            new CustomEvent("active-tabs-changed", {
              bubbles: true,
              cancelable: true,
              composed: false,
              detail: this,
            })
          );
        },
        /**
         * updates the active tabs object
         *
         * @param {event} e
         * @memberof SimpleFields
         */
      },
      {
        key: "_handleActiveTab",
        value: function _handleActiveTab(e) {
          if (e && e.detail && e.detail.id)
            this.activeTabs[e.detail.id] = e.detail.activeTab;
        },
      },
      {
        key: "convertedSchema",
        get: function get() {
          var schema = {
            $schema: "http://json-schema.org/schema#",
            title: this.label,
            type: "object",
            required: [],
            properties: this.fieldsToSchema(this.fields),
          };
          return schema;
        },
        /**
         * gets JSON schema to form element conversion object
         *
         * @readonly
         * @memberof SimpleFields
         */
      },
      {
        key: "schemaConversion",
        get: function get() {
          var _format;

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
                  format:
                    ((_format = {
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
                    }),
                    _defineProperty(_format, "date", {
                      defaultSettings: {
                        element: "simple-fields-field",
                        noWrap: true,
                        attributes: {
                          autofocus: true,
                          type: "date",
                        },
                      },
                    }),
                    _defineProperty(_format, "email", {
                      defaultSettings: {
                        element: "simple-fields-field",
                        noWrap: true,
                        attributes: {
                          autofocus: true,
                          type: "email",
                        },
                      },
                    }),
                    _defineProperty(_format, "fileupload", {
                      defaultSettings: {
                        import:
                          "@lrnwebcomponents/simple-fields/lib/simple-fields-upload.js",
                        element: "simple-fields-upload",
                        noWrap: true,
                        attributes: {
                          autofocus: true,
                        },
                      },
                    }),
                    _defineProperty(_format, "iconpicker", {
                      defaultSettings: {
                        import:
                          "@lrnwebcomponents/simple-icon-picker/simple-icon-picker.js",
                        element: "simple-icon-picker",
                        attributes: {
                          autofocus: true,
                        },
                        properties: {
                          options: "icons",
                          exclude: "exclude",
                          excludeSets: "excludeSets",
                          includeSets: "includeSets",
                        },
                      },
                    }),
                    _defineProperty(_format, "month", {
                      defaultSettings: {
                        element: "simple-fields-field",
                        noWrap: true,
                        attributes: {
                          autofocus: true,
                          type: "month",
                        },
                      },
                    }),
                    _defineProperty(_format, "textarea", {
                      defaultSettings: {
                        element: "simple-fields-field",
                        noWrap: true,
                        attributes: {
                          autofocus: true,
                          type: "textarea",
                        },
                      },
                    }),
                    _defineProperty(_format, "time", {
                      defaultSettings: {
                        element: "simple-fields-field",
                        noWrap: true,
                        attributes: {
                          autofocus: true,
                          type: "time",
                        },
                      },
                    }),
                    _defineProperty(_format, "uri", {
                      defaultSettings: {
                        element: "simple-fields-field",
                        noWrap: true,
                        attributes: {
                          autofocus: true,
                          type: "file",
                        },
                      },
                    }),
                    _format),
                },
              },
            }
          );
        },
        /**
         * gets fields array to JSON schema conversion object
         *
         * @readonly
         * @memberof SimpleFields
         */
      },
      {
        key: "fieldsConversion",
        get: function get() {
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
        },
      },
    ]);

    return SimpleFields;
  })(_simpleFieldsLite.SimpleFieldsLite);

exports.SimpleFields = SimpleFields;
window.customElements.define(SimpleFields.tag, SimpleFields);
