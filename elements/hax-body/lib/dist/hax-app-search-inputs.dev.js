"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxAppSearchInputs = void 0;

var _litElement = require("lit-element/lit-element.js");

require("@lrnwebcomponents/simple-fields/simple-fields.js");

var _HAXFields = require("@lrnwebcomponents/hax-body-behaviors/lib/HAXFields.js");

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

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n      <h5 class="search-label">',
    '\n        <hax-tray-button \n          id="cancel"\n          class="',
    '" \n          icon="close"\n          label="Cancel Search"\n          event-name="cancel-search">\n        </hax-tray-button>\n      </h5>\n      <simple-fields\n        id="form"\n        .schema="',
    '"\n        .schematizer="',
    '"\n        .elementizer="',
    '"\n        @value-changed="',
    '"\n      ></simple-fields>\n    ',
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n        :host {\n          display: block;\n        }\n        .search-label {\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          width: 100%;\n        }\n        #cancel {\n          flex: 0 0 auto;\n        }\n        h5 {\n          margin: var(--hax-tray-margin-sm, 4px) 0;\n        }\n      ",
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
`hax-app-search-inputs`
 An element that brokers the visual display of a listing of material from an end point. The goal is to normalize data from some location which is media centric. This expects to get at least enough data in order to form a grid of items which are selectable. It's also generically implemented so that anything can be hooked up as a potential source for input (example: youtube API or custom in-house solution). The goal is to return enough info via fired event so that we can tell hax-body that the user selected a tag, properties, slot combination so that hax-body can turn the selection into a custom element / element injected into the hax-body slot.

* @demo demo/index.html

@microcopy - the mental model for this element
 - hax-app - a source of input we're querying for media / content
 - hax-app-search - element controlling the experience of searching an app
 - hax-body - the text are ultimately we are trying to insert this item into
*/
var HaxAppSearchInputs =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(HaxAppSearchInputs, _LitElement);

    _createClass(HaxAppSearchInputs, null, [
      {
        key: "styles",

        /**
         * LitElement constructable styles enhancement
         */
        get: function get() {
          return [(0, _litElement.css)(_templateObject())];
        },
      },
    ]);

    function HaxAppSearchInputs() {
      _classCallCheck(this, HaxAppSearchInputs);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxAppSearchInputs).call(this)
      );
    }

    _createClass(
      HaxAppSearchInputs,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(
              _templateObject2(),
              this.label,
              !this.searching ? "visibility-hidden" : "",
              this.schema,
              _HAXFields.HaxSchematizer,
              _HAXFields.HaxElementizer,
              this.searchValuesChanged
            );
          },
        },
        {
          key: "searchValuesChanged",
          value: function searchValuesChanged(e) {
            if (typeof e.detail.value !== "string") {
              // dispatch the event directly so that we can data bind to input
              this.dispatchEvent(
                new CustomEvent("search-values-changed", {
                  detail: e.detail.value,
                })
              );
            }
          },
        },
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "hax-app-search-inputs";
          },
        },
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * Schema used to generate the input types.
               */
              schema: {
                type: Object,
              },
            };
          },
        },
      ]
    );

    return HaxAppSearchInputs;
  })(_litElement.LitElement);

exports.HaxAppSearchInputs = HaxAppSearchInputs;
window.customElements.define(HaxAppSearchInputs.tag, HaxAppSearchInputs);
