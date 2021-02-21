"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxContextBehaviors = exports.HaxContextContainer = void 0;

var _litElement = require("lit-element/lit-element.js");

var _haxUiStyles = require("@lrnwebcomponents/hax-body/lib/hax-ui-styles.js");

var _SimpleTourFinder2 = require("@lrnwebcomponents/simple-popover/lib/SimpleTourFinder");

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
  var data = _taggedTemplateLiteral(["<slot></slot>\n      "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n          :host {\n            display: block;\n            pointer-events: none;\n            --hax-tray-spacing-sm: 1px;\n          }\n          :host [hidden] {\n            display: none;\n          }\n          :host > * {\n            margin: 0 auto;\n          }\n          .selected-buttons {\n            transition: 0.1s all ease-in-out;\n            width: 0;\n          }\n          :host([has-selected-text]) .selected-buttons {\n            width: 100%;\n          }\n          :host(.hax-context-pin-top) #toolbar {\n            position: fixed;\n            top: 0px;\n          }\n          :host(:hover),\n          :host(:focus-within) {\n            z-index: var(--hax-tray-focus-z-index)!important;\n          }\n          .group {\n            padding: 0;\n          }\n          hax-toolbar {\n            flex: 0 1 auto;\n            background-color: var(--hax-tray-border-color);\n            border: none!important;\n          }\n          hax-toolbar[collapse-disabled]::part(morebutton) {\n            display: none !important;\n          }\n          hax-toolbar *[hidden] {\n            display: none !important;\n          }\n          hax-toolbar[collapse-disabled]::part(morebutton) {\n            display: none !important;\n          }\n        ",
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

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _iterableToArray(iter) {
  if (
    Symbol.iterator in Object(iter) ||
    Object.prototype.toString.call(iter) === "[object Arguments]"
  )
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
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
 *
 * @customElement
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
var HaxContextBehaviors = function HaxContextBehaviors(SuperClass) {
  return (
    /*#__PURE__*/
    (function (_SimpleTourFinder) {
      _inherits(_class, _SimpleTourFinder);

      _createClass(_class, null, [
        {
          key: "styles",

          /**
           * LitElement constructable styles enhancement
           */
          get: function get() {
            return [].concat(
              _toConsumableArray(_haxUiStyles.HaxTrayBaseStyles),
              [(0, _litElement.css)(_templateObject())]
            );
          },
        },
      ]);

      function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(
          this,
          _getPrototypeOf(_class).call(this)
        );
      }

      _createClass(
        _class,
        [
          {
            key: "render",
            value: function render() {
              return (0, _litElement.html)(_templateObject2());
            },
          },
        ],
        [
          {
            key: "tag",
            get: function get() {
              return "hax-context-container";
            },
          },
        ]
      );

      return _class;
    })((0, _SimpleTourFinder2.SimpleTourFinder)(SuperClass))
  );
};
/**
 *
 *
 * @class HaxContext
 * @extends {LitElement}
 */

exports.HaxContextBehaviors = HaxContextBehaviors;

var HaxContextContainer =
  /*#__PURE__*/
  (function (_HaxContextBehaviors) {
    _inherits(HaxContextContainer, _HaxContextBehaviors);

    function HaxContextContainer() {
      _classCallCheck(this, HaxContextContainer);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxContextContainer).apply(this, arguments)
      );
    }

    return HaxContextContainer;
  })(HaxContextBehaviors(_litElement.LitElement));

exports.HaxContextContainer = HaxContextContainer;
window.customElements.define(HaxContextContainer.tag, HaxContextContainer);
