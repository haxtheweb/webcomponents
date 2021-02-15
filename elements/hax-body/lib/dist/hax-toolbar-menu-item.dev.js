"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxToolbarMenuItem = void 0;

var _litElement = require("lit-element/lit-element.js");

require("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");

var _a11yMenuButtonItem = require("@lrnwebcomponents/a11y-menu-button/lib/a11y-menu-button-item.js");

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
    "\n        :host {\n          --simple-toolbar-button-min-width: 100% !important;\n          --simple-toolbar-button-border-color: var(\n            --hax-toolbar-button-bg,\n            #fff\n          ) !important;\n          --simple-toolbar-button-hover-bg: var(\n            --hax-toolbar-menu-button-hover-bg,\n            #c4ecff\n          );\n          --simple-toolbar-button-border-radius: var(\n            --hax-toolbar-menu-button-border-radius,\n            0\n          );\n        }\n        :host ::slotted([danger]) {\n          --simple-toolbar-button-hover-bg: var(\n            --hax-toolbar-button-danger-color,\n            #882222\n          );\n          --simple-toolbar-button-hover-border-color: var(\n            --hax-toolbar-button-danger-color,\n            #882222\n          );\n          --simple-toolbar-button-hover-color: var(\n            --hax-toolbar-button-bg,\n            #fff\n          );\n          z-index: 1001;\n        }\n      ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
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

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n      <li role="none">\n        <slot></slot>\n      </li>\n    ',
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
 * `hax-toolbar-menu`
 * `An icon / button that has support for multiple options via drop down.`
 *
 * @microcopy - the mental model for this element
 * - panel - the flyout from left or right side that has elements that can be placed
 * - button - an item that expresses what interaction you will have with the content.
 *
 * @element hax-toolbar-menu-item
 * @extends A11yMenuButtonItemBehaviors
 */
var HaxToolbarMenuItem =
  /*#__PURE__*/
  (function (_A11yMenuButtonItemBe) {
    _inherits(HaxToolbarMenuItem, _A11yMenuButtonItemBe);

    function HaxToolbarMenuItem() {
      _classCallCheck(this, HaxToolbarMenuItem);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxToolbarMenuItem).call(this)
      );
    }

    _createClass(
      HaxToolbarMenuItem,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(_templateObject());
          },
          /**
           * allows link or button to get focus
           *
           * @memberof A11yMenuButtonItem
           */
        },
        {
          key: "focus",
          value: function focus() {
            if (this.querySelector("[role=menuitem]"))
              this.querySelector("[role=menuitem]").focus();
          },
        },
      ],
      [
        {
          key: "styles",
          get: function get() {
            return [].concat(
              _toConsumableArray(
                _get(_getPrototypeOf(HaxToolbarMenuItem), "styles", this)
              ),
              [(0, _litElement.css)(_templateObject2())]
            );
          },
        },
        {
          key: "tag",
          get: function get() {
            return "hax-toolbar-menu-item";
          },
        },
      ]
    );

    return HaxToolbarMenuItem;
  })(
    (0, _a11yMenuButtonItem.A11yMenuButtonItemBehaviors)(_litElement.LitElement)
  );

exports.HaxToolbarMenuItem = HaxToolbarMenuItem;
window.customElements.define(HaxToolbarMenuItem.tag, HaxToolbarMenuItem);
