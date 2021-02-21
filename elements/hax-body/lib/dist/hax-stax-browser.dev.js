"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxStaxBrowser = void 0;

var _litElement = require("lit-element/lit-element.js");

require("@lrnwebcomponents/simple-toolbar/lib/simple-button-grid.js");

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

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '\n            <hax-tray-button\n              icon-position="top"\n              show-text-label\n              index="',
    '"\n              label="',
    '"\n              .stax="',
    '"\n              icon="hax:templates"\n              color="green"\n              event-name="insert-stax"\n            ></hax-tray-button>\n          ',
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n      <simple-button-grid columns="3" rows="1" always-expanded>\n        ',
    "\n      </simple-button-grid>\n    ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n        :host {\n          display: flex;\n          flex-direction: column;\n          align-items: stretch;\n          flex: 0 0 auto;\n          overflow-y: auto;\n        }\n        simple-button-grid {\n          overflow: auto;\n        }\n      ",
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
 * `hax-stax-browser`
 * @element hax-stax-browser
 * `Select a stack / template to insert`
 * @microcopy - the mental model for this element
 * - stax - silly name for the general public when talking about custom elements and what it provides in the end.
 */
var HaxStaxBrowser =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(HaxStaxBrowser, _LitElement);

    _createClass(HaxStaxBrowser, null, [
      {
        key: "styles",
        get: function get() {
          return [(0, _litElement.css)(_templateObject())];
        },
      },
    ]);

    function HaxStaxBrowser() {
      var _this;

      _classCallCheck(this, HaxStaxBrowser);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxStaxBrowser).call(this)
      );
      _this.staxList = [];
      return _this;
    }

    _createClass(
      HaxStaxBrowser,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(
              _templateObject2(),
              this.staxList.map(function (stax) {
                return (0,
                _litElement.html)(_templateObject3(), stax.index, stax.details.title, stax.stax);
              })
            );
          },
        },
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "hax-stax-browser";
          },
        },
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * The list of stax
               */
              staxList: {
                type: Array,
              },
            };
          },
        },
      ]
    );

    return HaxStaxBrowser;
  })(_litElement.LitElement);

exports.HaxStaxBrowser = HaxStaxBrowser;
window.customElements.define(HaxStaxBrowser.tag, HaxStaxBrowser);
