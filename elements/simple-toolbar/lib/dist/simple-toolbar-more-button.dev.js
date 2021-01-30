"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleToolbarMoreButton = void 0;

var _litElement = require("lit-element/lit-element.js");

var _simpleToolbarButton = require("./simple-toolbar-button.js");

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
 * `simple-toolbar-more-button`
 * a more button to toggle collapsed buttons in the rich text editor
 *
 * @element simple-toolbar-more-button
 * @demo ./demo/buttons.html
 */
var SimpleToolbarMoreButton =
  /*#__PURE__*/
  (function (_SimpleToolbarButtonB) {
    _inherits(SimpleToolbarMoreButton, _SimpleToolbarButtonB);

    _createClass(SimpleToolbarMoreButton, null, [
      {
        key: "tag",

        /**
         * Store the tag name to make it easier to obtain directly.
         */
        get: function get() {
          return "simple-toolbar-more-button";
        },
      },
    ]);

    function SimpleToolbarMoreButton() {
      var _this;

      _classCallCheck(this, SimpleToolbarMoreButton);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleToolbarMoreButton).call(this)
      );
      _this.icon = "more-vert";
      _this.toggled = false;
      _this.toggles = true;
      _this.label = "More buttons";
      _this.labelToggled = "Fewer buttons";
      return _this;
    }
    /**
     * toggles button if shortcutKey is pressed
     *
     * @param {string} key
     * @event toggle
     */

    _createClass(SimpleToolbarMoreButton, [
      {
        key: "_handleShortcutKeys",
        value: function _handleShortcutKeys(e, key) {
          this.dispatchEvent(
            new CustomEvent("toggle", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: _objectSpread({}, e.detail, {
                button: this,
                shortcutKey: this,
              }),
            })
          );
        },
      },
    ]);

    return SimpleToolbarMoreButton;
  })(
    (0, _simpleToolbarButton.SimpleToolbarButtonBehaviors)(
      _litElement.LitElement
    )
  );

exports.SimpleToolbarMoreButton = SimpleToolbarMoreButton;
window.customElements.define(
  SimpleToolbarMoreButton.tag,
  SimpleToolbarMoreButton
);
