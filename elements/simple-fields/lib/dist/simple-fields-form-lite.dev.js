"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleFieldsFormLite = void 0;

var _litElement = require("lit");

var _simpleFieldsLite = require("./simple-fields-lite.js");

var _simpleFields = require("../simple-fields.js");

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

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key)
        );
      });
    }
  }
  return target;
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

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    "\n        :host {\n          display: block;\n        }\n      ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _iterableToArrayLimit(arr, i) {
  if (
    !(
      Symbol.iterator in Object(arr) ||
      Object.prototype.toString.call(arr) === "[object Arguments]"
    )
  ) {
    return;
  }
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n      <form part="form">\n        <slot name="before"></slot>\n        <simple-fields-lite\n          id="sf"\n          .autofocus="',
    '"\n          .language="',
    '"\n          .resources="',
    '"\n          .schema="',
    '"\n          .elementizer="',
    '"\n          .value="',
    '"\n          @value-changed="',
    '"\n          part="fields"\n        >\n        </simple-fields-lite>\n        <slot name="after"></slot>\n        <slot></slot>\n      </form>\n    ',
  ]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  return Object.freeze(
    Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })
  );
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
 * `simple-fields-form-lite`
 * binding and submission capabilities on top of simple-fields-lite
 *
 * @customElement
 * @group simple-fields
 * @element simple-fields-form-lite
 * @demo ./demo/form-lite.html
 * @class SimpleFieldsFormLite
 * @extends {LitElement}
 */
var SimpleFieldsFormLite =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(SimpleFieldsFormLite, _LitElement);

    _createClass(
      SimpleFieldsFormLite,
      [
        {
          key: "render",
          // render function
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              !this.disableAutofocus,
              this.language,
              this.resources,
              this.schema,
              this.elementizer,
              this.value,
              this._valueChanged
            );
          },
          /**
           * updates the form value when a field changes
           *
           * @param {*} e value-changed event
           * @memberof SimpleFieldsFormLite
           */
        },
        {
          key: "_valueChanged",
          value: function _valueChanged(e) {
            this.value = e.detail.value;
          },
          /**
           * allow setting value
           */
        },
        {
          key: "setValue",
          value: function setValue(value) {
            this.value = value;
          },
          /**
           * first update hook; also implies default settings
           */
        },
        {
          key: "firstUpdated",
          value: function firstUpdated(changedProperties) {
            var _this2 = this;

            changedProperties.forEach(function (oldValue, propName) {
              // request form when it changes
              if (propName === "loadEndpoint" && _this2.autoload) {
                _this2.loadData();
              }
            });
          },
        },
        {
          key: "updated",
          value: function updated(changedProperties) {
            var _this3 = this;

            changedProperties.forEach(function (oldValue, propName) {
              if (_this3.autoload && !_this3.loadResponse && !_this3.loading) {
                if (propName === "loadEndpoint" || propName === "autoload") {
                  _this3.loadData();
                }
              } // we have response data from an end point this should create the form

              if (propName === "loadResponse" && _this3.loadResponse.data) {
                _this3._applyLoadedData();
                /**
                 * fires event for things to react to about the response
                 * @event response
                 */

                _this3.dispatchEvent(
                  new CustomEvent("response", {
                    bubbles: true,
                    composed: true,
                    cancelable: false,
                    detail: _this3.loadResponse,
                  })
                );
              }
            });
          },
          /**
           * applies loaded datda to simple-fields-lite
           *
           * @memberof SimpleFieldsFormLite
           */
        },
        {
          key: "_applyLoadedData",
          value: function _applyLoadedData() {
            if (this.loadResponse.data.schema) {
              this.schema = this.loadResponse.data.schema;
            }

            if (this.loadResponse.data.value)
              this.value = this.loadResponse.data.value;
          },
          /**
           * load data from the end point
           */
        },
        {
          key: "loadData",
          value: function loadData() {
            var _this4 = this;

            this.loading = true;
            this.fetchData(
              this.loadEndpoint,
              this.method,
              this.headers,
              this.body
            ).then(function (data) {
              _this4.loading = false;
              _this4.loadResponse = data;
              /**
               * fires event when forma data is loaded
               * @event simple-fields-form-data-loaded
               */

              _this4.dispatchEvent(
                new CustomEvent("simple-fields-form-data-loaded", {
                  detail: {
                    value: data,
                  },
                })
              );
            });
          },
        },
        {
          key: "fetchData",
          value: function fetchData(path, method, headers, body) {
            var response, data;
            return regeneratorRuntime.async(function fetchData$(_context) {
              while (1) {
                switch ((_context.prev = _context.next)) {
                  case 0:
                    response = {};

                    if (!(method == "GET")) {
                      _context.next = 8;
                      break;
                    }

                    if (body) {
                      path +=
                        "?" +
                        Object.entries(body)
                          .map(function (_ref) {
                            var _ref2 = _slicedToArray(_ref, 2),
                              key = _ref2[0],
                              val = _ref2[1];

                            return ""
                              .concat(encodeURIComponent(key), "=")
                              .concat(encodeURIComponent(val));
                          })
                          .join("&");
                    }

                    _context.next = 5;
                    return regeneratorRuntime.awrap(
                      fetch(path, {
                        method: method,
                        headers: headers,
                      })
                    );

                  case 5:
                    response = _context.sent;
                    _context.next = 11;
                    break;

                  case 8:
                    _context.next = 10;
                    return regeneratorRuntime.awrap(
                      fetch(path, {
                        method: method,
                        headers: headers,
                        //make sure to serialize your JSON body
                        body: JSON.stringify(body),
                      })
                    );

                  case 10:
                    response = _context.sent;

                  case 11:
                    _context.next = 13;
                    return regeneratorRuntime.awrap(response.json());

                  case 13:
                    data = _context.sent;
                    return _context.abrupt("return", data);

                  case 15:
                  case "end":
                    return _context.stop();
                }
              }
            });
          },
        },
      ],
      [
        {
          key: "styles",
          get: function get() {
            return [(0, _litElement.css)(_templateObject2())];
          },
        },
        {
          key: "tag",
          get: function get() {
            return "simple-fields-form-lite";
          },
        },
      ]
    );

    function SimpleFieldsFormLite() {
      var _this;

      _classCallCheck(this, SimpleFieldsFormLite);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleFieldsFormLite).call(this)
      );

      _this._setFieldProperties();

      _this._setFormProperties();

      return _this;
    }
    /**
     * allows constructor to be overridden
     *
     * @memberof SimpleFieldsFormLite
     */

    _createClass(
      SimpleFieldsFormLite,
      [
        {
          key: "_setFieldProperties",
          value: function _setFieldProperties() {
            this.disableAutofocus = false;
            this.language = "en";
            this.resources = {};
            this.schema = {};
            this.value = {};
          },
          /**
           * allows constructor to be overridden
           *
           * @memberof SimpleFieldsFormLite
           */
        },
        {
          key: "_setFormProperties",
          value: function _setFormProperties() {
            this.method = "POST";
            this.loading = false;
            this.autoload = false;
            this.headers = {
              Accept: "application/json",
              "Content-Type": "application/json",
            };
            this.body = {};
          },
          /**
           * Submit form values if we have an end point, otherwise return value
           * of the fields as they currently exist.
           */
        },
        {
          key: "submit",
          value: function submit() {
            var sf = this.shadowRoot.querySelector("#sf");

            if (this.saveEndpoint) {
              fetch(this.saveEndpoint, {
                method: this.method,
                headers: this.headers,
                //make sure to serialize your JSON body
                body: JSON.stringify(sf.value),
              });
            }

            return sf.value;
          },
          /**
           * properties specific to field function
           *
           * @readonly
           * @static
           * @memberof SimpleFieldsFormLite
           */
        },
        {
          key: "formFields",

          /**
           * gets the simple-fields object
           *
           * @readonly
           * @memberof SimpleFieldsLite
           */
          get: function get() {
            return this.shadowRoot &&
              this.shadowRoot.querySelector &&
              this.shadowRoot.querySelector("#sf")
              ? this.shadowRoot.querySelector("#sf")
              : undefined;
          },
          /**
           * form elements by id
           *
           * @readonly
           * @memberof SimpleFieldsLite
           */
        },
        {
          key: "formElements",
          get: function get() {
            return this.formFields ? this.formFields.formElements : {};
          },
          /**
           * list of form elements in order
           *
           * @readonly
           * @memberof SimpleFieldsLite
           */
        },
        {
          key: "formElementsArray",
          get: function get() {
            return this.formFields ? this.formFields.formElementsArray : [];
          },
          /**
           * Props down
           */
        },
      ],
      [
        {
          key: "fieldProperties",
          get: function get() {
            return {
              /*
               * Disables autofocus on fields.
               */
              disableAutofocus: {
                type: Boolean,
              },

              /*
               * Error messages by field name,
               * eg. `{ contactinfo.email: "A valid email is required." }`
               */
              error: {
                type: Object,
              },

              /*
               * Language of the fields.
               */
              language: {
                type: String,
                attribute: "lang",
                reflect: true,
              },

              /*
               * resource link
               */
              resources: {
                type: Object,
              },

              /*
               * Fields schema.
               * _See [Fields Schema Format](fields-schema-format) above._
               */
              schema: {
                type: Object,
              },

              /**
               * Conversion from JSON Schema to HTML form elements.
               * _See [Configuring schemaConversion Property](configuring-the-schemaConversion-property) above._
               */
              schemaConversion: {
                type: Object,
                attribute: "schema-conversion",
              },

              /*
               * value of fields
               */
              value: {
                type: Object,
              },
            };
          },
          /**
           * properties specific to form function
           *
           * @readonly
           * @static
           * @memberof SimpleFieldsFormLite
           */
        },
        {
          key: "formProperties",
          get: function get() {
            return {
              autoload: {
                type: Boolean,
                reflect: true,
              },
              loading: {
                type: Boolean,
                reflect: true,
              },
              loadEndpoint: {
                type: String,
                attribute: "load-endpoint",
              },
              saveEndpoint: {
                type: String,
                attribute: "save-endpoint",
              },
              method: {
                type: String,
              },
              headers: {
                type: Object,
              },
              body: {
                type: Object,
              },
              loadResponse: {
                type: Object,
              },
            };
          },
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              this.fieldProperties,
              {},
              this.formProperties
            );
          },
        },
      ]
    );

    return SimpleFieldsFormLite;
  })(_litElement.LitElement);

exports.SimpleFieldsFormLite = SimpleFieldsFormLite;
window.customElements.define(SimpleFieldsFormLite.tag, SimpleFieldsFormLite);
