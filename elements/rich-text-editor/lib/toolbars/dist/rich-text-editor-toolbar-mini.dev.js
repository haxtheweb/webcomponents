"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.RichTextEditorToolbarMini = void 0;

var _litElement = require("lit-element/lit-element.js");

var _richTextEditorToolbar = require("./rich-text-editor-toolbar.js");

require("@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js");

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
  var data = _taggedTemplateLiteral([" ", " "]);

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
 * `rich-text-editor-toolbar-mini`
 * `a mini floating toolbar for the rich text editor`
 *
 * @customElement
 * @extends RichTextEditorToolbarBehaviors
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @element rich-text-editor-toolbar-mini
 * @demo ./demo/mini.html mini floating toolbar
 */
var RichTextEditorToolbarMini =
  /*#__PURE__*/
  (function (_RichTextEditorToolba) {
    _inherits(RichTextEditorToolbarMini, _RichTextEditorToolba);

    _createClass(
      RichTextEditorToolbarMini,
      [
        {
          key: "render",
          // properties available to the custom element for data binding
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              _get(
                _getPrototypeOf(RichTextEditorToolbarMini.prototype),
                "miniTemplate",
                this
              )
            );
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
            return "rich-text-editor-toolbar-mini";
          },
        },
        {
          key: "styles",
          get: function get() {
            return [].concat(
              _toConsumableArray(
                _get(
                  _getPrototypeOf(RichTextEditorToolbarMini),
                  "baseStyles",
                  this
                )
              ),
              _toConsumableArray(
                _get(
                  _getPrototypeOf(RichTextEditorToolbarMini),
                  "miniStyles",
                  this
                )
              )
            );
          },
        },
      ]
    );

    function RichTextEditorToolbarMini() {
      var _this;

      _classCallCheck(this, RichTextEditorToolbarMini);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(RichTextEditorToolbarMini).call(this)
      );
      _this.sticky = false;
      _this.config = _this.miniConfig;
      return _this;
    }

    _createClass(RichTextEditorToolbarMini, [
      {
        key: "updated",
        value: function updated(changedProperties) {
          var _this2 = this;

          _get(
            _getPrototypeOf(RichTextEditorToolbarMini.prototype),
            "updated",
            this
          ).call(this, changedProperties);

          changedProperties.forEach(function (oldValue, propName) {
            //disable sticky for mini
            if (propName === "sticky" && _this2.sticky) _this2.sticky = false;
          });
        },
      },
    ]);

    return RichTextEditorToolbarMini;
  })(
    (0, _richTextEditorToolbar.RichTextEditorToolbarBehaviors)(
      _litElement.LitElement
    )
  );

exports.RichTextEditorToolbarMini = RichTextEditorToolbarMini;
window.customElements.define(
  RichTextEditorToolbarMini.tag,
  RichTextEditorToolbarMini
);
