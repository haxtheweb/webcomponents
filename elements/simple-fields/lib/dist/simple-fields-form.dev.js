"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleFieldsForm = void 0;

var _litElement = require("lit");

var _simpleFieldsFormLite = require("./simple-fields-form-lite.js");

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

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n      <form part="form">\n        <slot name="before"></slot>\n        <simple-fields\n          id="sf"\n          .autofocus="',
    '"\n          ?watchColorPrefs="',
    '"\n          language="',
    '"\n          .resources="',
    '"\n          .schema="',
    '"\n          .fields="',
    '"\n          .schematizer="',
    '"\n          .elementizer="',
    '"\n          .value="',
    '"\n          @value-changed="',
    '"\n          part="fields"\n        >\n        </simple-fields>\n        <slot></slot>\n      </form>\n    ',
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
 * `simple-fields-form`
 * binding and submission capabilities on top of simple-fields
 *
 * @group simple-fields
 * @element simple-fields-form
 * @demo ./demo/form.html
 */
var SimpleFieldsForm =
  /*#__PURE__*/
  (function (_SimpleFieldsFormLite) {
    _inherits(SimpleFieldsForm, _SimpleFieldsFormLite);

    function SimpleFieldsForm() {
      _classCallCheck(this, SimpleFieldsForm);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleFieldsForm).apply(this, arguments)
      );
    }

    _createClass(
      SimpleFieldsForm,
      [
        {
          key: "render",
          // render function
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              !this.disableAutofocus,
              this.watchColorPrefs,
              this.language || "",
              this.resources,
              this.schema,
              this.fields,
              this.fieldsConversion,
              this.elementizer,
              this.value,
              this._valueChanged
            );
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
            } else if (this.loadResponse.data.fields) {
              this.fields = this.loadResponse.data.fields;
            }

            if (this.loadResponse.data.value)
              this.value = this.loadResponse.data.value;
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
          key: "defaultSchemaConversion",

          /**
           * gets default schemaConversion so parts of it can be overridden easily
           *
           * @readonly
           * @memberof SimpleFields
           */
          get: function get() {
            return _simpleFields.SimpleFields.defaultSchemaConversion;
          },
        },
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "simple-fields-form";
          },
        },
        {
          key: "fieldProperties",
          get: function get() {
            return _objectSpread(
              {},
              _get(_getPrototypeOf(SimpleFieldsForm), "fieldProperties", this),
              {
                /**
                 * Fields to convert to JSON Schema.
                 */
                fields: {
                  type: "Array",
                },

                /**
                 * Conversion from inputMethods to JSON schema types and formats.
                 * _See [Configuring fieldsConversion Property](configuring-the-fieldsconversion-property) above._
                 */
                fieldsConversion: {
                  type: "Object",
                  attribute: "fields-conversion",
                },
              }
            );
          },
        },
      ]
    );

    return SimpleFieldsForm;
  })(_simpleFieldsFormLite.SimpleFieldsFormLite);

exports.SimpleFieldsForm = SimpleFieldsForm;
window.customElements.define(SimpleFieldsForm.tag, SimpleFieldsForm);
