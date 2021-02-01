"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.RichTextEditorBreadcrumbs = void 0;

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

function _templateObject4() {
  var data = _taggedTemplateLiteral([
    "\n        :host {\n          display: block;\n          background-color: var(--simple-toolbar-button-bg, #ffffff);\n          color: var(--simple-toolbar-button-color #444);\n          border: var(--simple-toolbar-border-width, 1px) solid var(--simple-toolbar-border-color, #ddd);\n          padding: 3px 10px;\n        }\n        :host([sticky]) {\n          position: sticky;\n          bottom: 0;\n        }\n        .selectednode {\n          background-color: var(--simple-toolbar-button-bg, #ffffff);\n        }\n        button {\n          display: inline-block;\n          text-align: center;\n          min-width: 25px;\n          margin: 0;\n          padding: 2px 5px;\n        }\n        .selectNode {\n          font-family: monospace;\n        }\n\xA0\xA0\xA0\xA0\xA0\xA0",
  ]);

  _templateObject4 = function _templateObject4() {
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

function _templateObject3() {
  var data = _taggedTemplateLiteral([' <span class="divider"> &gt; </span> ']);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n              <button\n                class="',
    '"\n                controls="',
    '"\n                @click="',
    '"\n                tabindex="0"\n              >\n                ',
    "\n              </button>\n              ",
    "\n            ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n      ", ": \n      ", "\n    "]);

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
 * `rich-text-editor-breadcrumbs`
 * `A utility that manages state of multiple rich-text-prompts on one page.`
 *
 *  @element rich-text-editor-breadcrumbs
 */
var RichTextEditorBreadcrumbs =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(RichTextEditorBreadcrumbs, _LitElement);

    _createClass(RichTextEditorBreadcrumbs, null, [
      {
        key: "tag",

        /**
         * Store tag name to make it easier to obtain directly.
         */
        get: function get() {
          return "rich-text-editor-breadcrumbs";
        },
      },
      {
        key: "properties",
        get: function get() {
          return {
            /**
             * active rict-text-editor.
             */
            controls: {
              type: String,
            },

            /**
             * Hide breadcrumbs
             */
            hidden: {
              type: Boolean,
              attribute: "hidden",
              reflect: true,
            },

            /**
             * breadcrumb labels.
             */
            label: {
              type: String,
            },

            /**
             * Should breadcrumbs stick to top so that it is always visible?
             */
            sticky: {
              type: Boolean,
              reflect: true,
            },

            /**
             * array of ancestors of currently selected node
             */
            selectionAncestors: {
              type: Array,
            },
          };
        },
      },
    ]);

    function RichTextEditorBreadcrumbs() {
      var _this;

      _classCallCheck(this, RichTextEditorBreadcrumbs);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(RichTextEditorBreadcrumbs).call(this)
      );
      _this.hidden = true;
      _this.sticky = false;
      _this.label = "Select";
      return _this;
    }
    /**
     * Handles button tap;
     * @param {event} e the button tab event
     * @returns {void}
     */

    _createClass(
      RichTextEditorBreadcrumbs,
      [
        {
          key: "_handleClick",
          value: function _handleClick(ancestor) {
            this.dispatchEvent(
              new CustomEvent("breadcrumb-click", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: ancestor,
              })
            );
          },
        },
        {
          key: "render",
          value: function render() {
            var _this2 = this;

            return (0, _litElement.html)(
              _templateObject(),
              this.label,
              !this.selectionAncestors
                ? ""
                : (this.selectionAncestors || []).map(function (ancestor, i) {
                    return (0, _litElement.html)(
                      _templateObject2(),
                      ancestor.selectAll ? "" : "selectnode",
                      _this2.controls,
                      function (e) {
                        return _this2._handleClick(ancestor);
                      },
                      ancestor.nodeName.toLowerCase(),
                      i + 1 >= (_this2.selectionAncestors || []).length
                        ? ""
                        : (0, _litElement.html)(_templateObject3())
                    );
                  })
            );
          },
        },
      ],
      [
        {
          key: "styles",
          get: function get() {
            return [].concat(
              _toConsumableArray(_richTextEditorButton.RichTextStyles),
              [(0, _litElement.css)(_templateObject4())]
            );
          },
        },
      ]
    );

    return RichTextEditorBreadcrumbs;
  })(_litElement.LitElement);

exports.RichTextEditorBreadcrumbs = RichTextEditorBreadcrumbs;
window.customElements.define(
  RichTextEditorBreadcrumbs.tag,
  RichTextEditorBreadcrumbs
);
