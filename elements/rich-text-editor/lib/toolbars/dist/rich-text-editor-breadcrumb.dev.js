"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.RichTextEditorBreadcrumb = void 0;

var _litElement = require("lit-element/lit-element.js");

var _richTextEditorButton = require("../buttons/rich-text-editor-button.js");

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
    "\n        #button {\n          font-family: monospace;\n          display: inline-block;\n          text-align: center;\n          min-width: 25px;\n          margin: 0;\n          padding: 2px 5px;\n        }\n\xA0\xA0\xA0\xA0\xA0\xA0",
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
    '\n      <button\n        id="button"\n        aria-controls="',
    '"\n        @click="',
    '"\n        tabindex="0"\n      >\n        ',
    "\n      </button>\n    ",
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
 * `rich-text-editor-breadcrumb`
 * `a button for rich text editor breadcrumbs`
 *
 *  @element rich-text-editor-breadcrumb
 */
var RichTextEditorBreadcrumb =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(RichTextEditorBreadcrumb, _LitElement);

    _createClass(
      RichTextEditorBreadcrumb,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              this.controls,
              this._handleClick,
              this.label
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
            return "rich-text-editor-breadcrumb";
          },
        },
        {
          key: "styles",
          get: function get() {
            return [].concat(
              _toConsumableArray(_richTextEditorButton.RichTextStyles),
              [(0, _litElement.css)(_templateObject2())]
            );
          },
        },
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * The text-editor that this breadcrumb controls.
               */
              controls: {
                type: String,
              },

              /**
               * The tag for this breadcrumb.
               */
              label: {
                type: String,
              },

              /**
               * The target node that this breadcrumb selects.
               */
              target: {
                type: Object,
              },
            };
          },
        },
      ]
    );

    function RichTextEditorBreadcrumb() {
      var _this;

      _classCallCheck(this, RichTextEditorBreadcrumb);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(RichTextEditorBreadcrumb).call(this)
      );
      _this.label = "";
      return _this;
    }
    /**
     * Handles button tap;
     * @param {event} e the button tab event
     * @returns {void}
     */

    _createClass(RichTextEditorBreadcrumb, [
      {
        key: "_handleClick",
        value: function _handleClick(e) {
          e.preventDefault();
          this.dispatchEvent(
            new CustomEvent("breadcrumb-click", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: this,
            })
          );
        },
      },
    ]);

    return RichTextEditorBreadcrumb;
  })(_litElement.LitElement);

exports.RichTextEditorBreadcrumb = RichTextEditorBreadcrumb;
window.customElements.define(
  RichTextEditorBreadcrumb.tag,
  RichTextEditorBreadcrumb
);
