"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleFieldsFieldset = void 0;

var _litElement = require("lit-element/lit-element.js");

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

function _templateObject5() {
  var data = _taggedTemplateLiteral([
    "\n        fieldset {\n          padding: var(--simple-fields-margin-small, 8px)\n            var(--simple-fields-margin, 16px);\n          margin: var(--simple-fields-margin-small, 8px) 0\n            var(--simple-fields-margin, 16px);\n          border: 1px solid var(--simple-fields-border-color-light, #ccc);\n          border-radius: var(--simple-fields-border-radius, 2px);\n          transition: all 0.3s ease-in-out;\n        }\n        :host(:last-of-type) {\n          margin-bottom: 0;\n        }\n        #label {\n          font-family: var(--simple-fields-font-family, sans-serif);\n          font-size: var(--simple-fields-font-size, 16px);\n          line-height: var(--simple-fields-line-height, 22px);\n        }\n        :host([error]) #label {\n          color: var(--simple-fields-error-color, #dd2c00);\n          transition: all 0.3s ease-in-out;\n        }\n        #description {\n          font-family: var(--simple-fields-detail-font-family, sans-serif);\n          font-size: var(--simple-fields-detail-font-size, 12px);\n          line-height: var(--simple-fields-detail-line-height, 22px);\n        }\n      ",
  ]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral([
    '\n      <div id="item-fields" part="fields">\n        <slot></slot>\n      </div>\n    ',
  ]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '\n      <div id="description" ?hidden="',
    '" part="description">\n        ',
    "\n      </div>\n    ",
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n      <legend id="label" ?hidden="',
    '" part="legend">\n        ',
    "",
    "\n      </legend>\n    ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n      <fieldset part="fieldset">',
    " ",
    " ",
    "</fieldset>\n    ",
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
 *`simple-fields-fieldset` takes in a JSON schema of type fieldset and builds a form,
 * exposing a `value` property that represents an array described by the schema.
 *
 * @group simple-fields
 * @element simple-fields-fieldset
 */
var SimpleFieldsFieldset =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(SimpleFieldsFieldset, _LitElement);

    function SimpleFieldsFieldset() {
      _classCallCheck(this, SimpleFieldsFieldset);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleFieldsFieldset).apply(this, arguments)
      );
    }

    _createClass(
      SimpleFieldsFieldset,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              this.legend,
              this.desc,
              this.fields
            );
          },
        },
        {
          key: "legend",
          get: function get() {
            return (0, _litElement.html)(
              _templateObject2(),
              !this.label,
              this.label,
              this.error ? "*" : ""
            );
          },
        },
        {
          key: "desc",
          get: function get() {
            return (0, _litElement.html)(
              _templateObject3(),
              !this.description,
              this.description
            );
          },
        },
        {
          key: "fields",
          get: function get() {
            return (0, _litElement.html)(_templateObject4());
          },
        },
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "simple-fields-fieldset";
          },
        },
        {
          key: "styles",
          get: function get() {
            return [(0, _litElement.css)(_templateObject5())];
          },
        },
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * whether the tabbed interface is disabled
               */
              disabled: {
                type: Boolean,
                reflect: true,
              },

              /**
               * whether fieldset has fields with errors
               */
              error: {
                type: Boolean,
                reflect: true,
              },

              /**
               * whether the tabbed interface is hidden
               */
              hidden: {
                type: Boolean,
                reflect: true,
              },

              /**
               * whether the tabbed interface is hidden
               */
              readonly: {
                type: Boolean,
                reflect: true,
              },

              /**
               * fieldset legend
               */
              label: {
                type: String,
                reflect: true,
              },

              /**
               * unique name
               */
              name: {
                type: String,
                reflect: true,
                attribute: "name",
              },

              /**
               * optional description
               */
              description: {
                type: String,
              },
            };
          },
        },
      ]
    );

    return SimpleFieldsFieldset;
  })(_litElement.LitElement);

exports.SimpleFieldsFieldset = SimpleFieldsFieldset;
window.customElements.define(SimpleFieldsFieldset.tag, SimpleFieldsFieldset);
