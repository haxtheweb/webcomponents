"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.RichTextEditorMoreButton = void 0;

var _litElement = require("lit-element/lit-element.js");

var _richTextEditorButton = require("./rich-text-editor-button.js");

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

/**
 * `rich-text-editor-more-button`
 * a more button to toggle collapsed buttons in the rich text editor
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @element rich-text-editor-more-button
 * @demo ./demo/buttons.html
 */
var RichTextEditorMoreButton =
  /*#__PURE__*/
  (function (_RichTextEditorButton) {
    _inherits(RichTextEditorMoreButton, _RichTextEditorButton);

    _createClass(
      RichTextEditorMoreButton,
      [
        {
          key: "render",
          // render function for template
          value: function render() {
            return _get(
              _getPrototypeOf(RichTextEditorMoreButton.prototype),
              "render",
              this
            ).call(this);
          },
        },
      ],
      [
        {
          key: "tag",

          /**
           * Store the tag name to make it easier to obtain directly.
           */
          get: function get() {
            return "rich-text-editor-more-button";
          },
        },
      ]
    );

    function RichTextEditorMoreButton() {
      var _this;

      _classCallCheck(this, RichTextEditorMoreButton);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(RichTextEditorMoreButton).call(this)
      );
      _this.icon = "more-vert";
      _this.toggled = false;
      _this.label = "More buttons";
      _this.labelToggled = "Fewer buttons";
      return _this;
    } // properties available to the custom element for data binding

    _createClass(
      RichTextEditorMoreButton,
      [
        {
          key: "_handleClick",

          /**
           * Fires a button tap event
           */
          value: function _handleClick() {
            return true;
          },
        },
        {
          key: "isToggled",

          /**
           * whether button is toggled
           *
           * @readonly
           * @memberof RichTextEditorButton
           */
          get: function get() {
            return this.toggled;
          },
        },
      ],
      [
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(
                _getPrototypeOf(RichTextEditorMoreButton),
                "properties",
                this
              ),
              {
                /**
                 * Can this button toggle?
                 */
                toggled: {
                  attribute: "toggled",
                  type: Boolean,
                  reflect: true,
                },
              }
            );
          },
        },
      ]
    );

    return RichTextEditorMoreButton;
  })(
    (0, _richTextEditorButton.RichTextEditorButtonBehaviors)(
      _litElement.LitElement
    )
  );

exports.RichTextEditorMoreButton = RichTextEditorMoreButton;
window.customElements.define(
  RichTextEditorMoreButton.tag,
  RichTextEditorMoreButton
);
