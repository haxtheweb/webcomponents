"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.RichTextEditor = void 0;

var _litElement = require("lit-element/lit-element.js");

var _richTextEditorButton = require("./lib/buttons/rich-text-editor-button.js");

var shadow = _interopRequireWildcard(
  require("shadow-selection-polyfill/shadow.js")
);

require("./lib/singletons/rich-text-editor-selection.js");

require("./lib/toolbars/rich-text-editor-toolbar.js");

require("./lib/toolbars/rich-text-editor-toolbar-mini.js");

require("./lib/toolbars/rich-text-editor-toolbar-full.js");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();
  _getRequireWildcardCache = function _getRequireWildcardCache() {
    return cache;
  };
  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }
  if (
    obj === null ||
    (_typeof(obj) !== "object" && typeof obj !== "function")
  ) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache();
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj["default"] = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

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
 * `rich-text-editor`
 * @element rich-text-editor
 * a standalone rich text editor
 *
 * @demo ./demo/index.html demo
 * @demo ./demo/mini.html mini floating toolbar
 * @demo ./demo/full.html toolbar with breadcrumb
 * @demo ./demo/config.html custom configuration
 * @demo ./demo/rawhtml.html raw HTML
 */
var RichTextEditor =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(RichTextEditor, _LitElement);

    _createClass(RichTextEditor, null, [
      {
        key: "tag",

        /* REQUIRED FOR TOOLING DO NOT TOUCH */

        /**
         * Store the tag name to make it easier to obtain directly.
         * @notice function name must be here for tooling to operate correctly
         */
        get: function get() {
          return "rich-text-editor";
        },
      },
    ]);

    function RichTextEditor() {
      var _this;

      _classCallCheck(this, RichTextEditor);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(RichTextEditor).call(this)
      );
      _this.haxUIElement = true;
      _this.placeholder = "Click to edit";
      _this.toolbar = "";
      _this.type = "rich-text-editor-toolbar";
      _this.id = "";
      _this.range = undefined;
      _this.__focused = false;
      _this.__hovered = false;
      _this.contenteditable = false;
      _this.__selection = window.RichTextEditorSelection.requestAvailability();

      var root = _assertThisInitialized(_this);

      document.addEventListener(shadow.eventName, _this._getRange.bind(root));
      return _this;
    }
    /**
     * mutation observer
     *
     * @readonly
     * @memberof RichTextEditor
     */

    _createClass(RichTextEditor, [
      {
        key: "connectedCallback",
        value: function connectedCallback() {
          var _this2 = this;

          _get(
            _getPrototypeOf(RichTextEditor.prototype),
            "connectedCallback",
            this
          ).call(this);

          setTimeout(function () {
            _this2.register();
          }, 1);
        },
        /**
         * life cycle, element is disconnected
         * @returns {void}
         */
      },
      {
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          _get(
            _getPrototypeOf(RichTextEditor.prototype),
            "disconnectedCallback",
            this
          ).call(this);

          this.register(true);
        },
      },
      {
        key: "firstUpdated",
        value: function firstUpdated() {
          if (
            _get(
              _getPrototypeOf(RichTextEditor.prototype),
              "firstUpdated",
              this
            )
          )
            _get(
              _getPrototypeOf(RichTextEditor.prototype),
              "firstUpdated",
              this
            ).call(this);

          if (this.isEmpty() && !!this.rawhtml) {
            this.setHTML(this.rawhtml);
          } else {
            if (this.isEmpty()) this.innerHTML = "";

            this._editableChange();
          }
        },
      },
      {
        key: "updated",
        value: function updated(changedProperties) {
          var _this3 = this;

          _get(_getPrototypeOf(RichTextEditor.prototype), "updated", this).call(
            this,
            changedProperties
          );

          changedProperties.forEach(function (oldValue, propName) {
            if (propName === "contenteditable") _this3._editableChange();
            if (propName === "range") _this3._rangeChange();
            if (propName === "rawhtml" && !!_this3.rawhtml)
              _this3.setHTML(_this3.rawhtml);
          });
          if (!this.innerHTML) this.innerHTML = "";
        },
        /**
         * Implements haxHooks to tie into life-cycle if hax exists.
         */
      },
      {
        key: "haxHooks",
        value: function haxHooks() {
          return {
            activeElementChanged: "haxactiveElementChanged",
          };
        },
        /**
         * allow HAX to toggle edit state when activated
         */
      },
      {
        key: "haxactiveElementChanged",
        value: function haxactiveElementChanged(el, val) {
          // overwrite the HAX dom w/ what our editor is supplying
          if (!val && el) {
            el.innerHTML = this.getValue();
          }

          return el;
        },
      },
      {
        key: "disableEditing",
        value: function disableEditing() {
          this.contenteditable = false;
          this.dispatchEvent(
            new CustomEvent("editing-disabled", {
              bubbles: true,
              composed: true,
              cancelable: true,
              detail: (this.innerHTML || "")
                .replace(/<!--[^(-->)]*-->/g, "")
                .trim(),
            })
          );
        },
      },
      {
        key: "enableEditing",
        value: function enableEditing() {
          this.contenteditable = true;
          this.dispatchEvent(
            new CustomEvent("editing-enabled", {
              bubbles: true,
              composed: true,
              cancelable: true,
              detail: (this.innerHTML || "")
                .replace(/<!--[^(-->)]*-->/g, "")
                .trim(),
            })
          );
        },
      },
      {
        key: "focus",
        value: function focus() {
          this.__focused = true;
          this.dispatchEvent(
            new CustomEvent("focus", {
              bubbles: true,
              composed: true,
              cancelable: true,
              detail: this.querySelector("*"),
            })
          );
        },
      },
      {
        key: "getHTML",
        value: function getHTML() {
          return this.isEmpty() || this.isPlaceholder()
            ? ""
            : (this.innerHTML || "").replace(/<!--[^(-->)]*-->/g, "").trim();
        },
        /**
         * determines if editor is empty
         *
         * @returns {string}
         * @memberof RichTextEditor
         */
      },
      {
        key: "isEmpty",
        value: function isEmpty() {
          return !this.innerHTML || this.trimHTML(this) == "";
        },
      },
      {
        key: "isPlaceholder",
        value: function isPlaceholder() {
          this.trimHTML(this) === this.trimString(this.placeholderHTML);
        },
        /**
         * allows editor to fit within a stick toolbar
         *
         * @param {boolean} sticky
         * @memberof RichTextEditor
         */
      },
      {
        key: "makeSticky",
        value: function makeSticky() {
          var sticky =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : true;

          if (!sticky) {
            this.classList.add("heightmax");
          } else {
            this.classList.remove("heightmax");
          }
        },
        /**
         * set observer on or off
         *
         * @param {boolean} [on=true]
         * @memberof RichTextEditor
         */
      },
      {
        key: "observeChanges",
        value: function observeChanges() {
          var on =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : true;

          if (on) {
            this.observer.observe(this, {
              attributes: false,
              childList: true,
              subtree: true,
              characterData: false,
            });
          } else {
            if (this.observer) this.observer.disconnect;
          }
        },
        /**
         *
         *
         * @memberof RichTextEditor
         */
      },
      {
        key: "paste",
        value: function paste(pasteContent) {
          var sanitized =
            arguments.length > 1 && arguments[1] !== undefined
              ? arguments[1]
              : true;

          this._handlePaste(pasteContent);
        },
        /**
         * handles registration to selection singleton's toolbars list
         * @param {boolean} remove whether to remove
         * @event register
         */
      },
      {
        key: "register",
        value: function register() {
          var remove =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : false;
          window.dispatchEvent(
            new CustomEvent("register", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: {
                remove: remove,
                editor: this,
              },
            })
          );
        },
        /**
         * revert content to before contenteditable=true
         *
         * @memberof RichTextEditor
         */
      },
      {
        key: "revert",
        value: function revert() {
          this.innerHTML = this.__canceledEdits;
        },
        /**
         * gets closet document oor shadowRoot
         *
         * @returns node
         * @memberof RichTextEditor
         */
      },
      {
        key: "rootNode",
        value: function rootNode() {
          return !this.__selection ? document : this.__selection.getRoot(this);
        },
      },
      {
        key: "setHTML",
        value: function setHTML() {
          var rawhtml =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : "";
          this.innerHTML = rawhtml.trim();
          this.setCancelHTML(rawhtml.trim());
          if (this.isEmpty()) this.innerHTML = "";

          this._editableChange();
        },
        /**
         * holds on to edits so cancel willwork
         *
         * @param {string} [html=this.innerHTML]
         * @memberof RichTextEditor
         */
      },
      {
        key: "setCancelHTML",
        value: function setCancelHTML() {
          var html =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : this.innerHTML;
          this.__canceledEdits = html || "";
        },
        /**
         * gets trimmed version of innerHTML
         *
         * @param {obj} node
         * @returns string
         * @memberof RichTextEditor
         */
      },
      {
        key: "trimHTML",
        value: function trimHTML(node) {
          var str = node ? node.innerHTML : undefined;
          return this.trimString(str);
        },
      },
      {
        key: "trimString",
        value: function trimString(str) {
          return (str || "")
            .replace(/<!--[^(-->)]*-->/g, "")
            .replace(/[\s\t\r\n]/gim, "");
        },
      },
      {
        key: "updateRange",
        value: function updateRange(e) {
          this.dispatchEvent(
            new CustomEvent("getrange", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: this,
            })
          );
        },
        /**
         * updates editor placeholder and watches for range changes
         *
         * @memberof RichTextEditor
         */
      },
      {
        key: "_editableChange",
        value: function _editableChange() {
          if (this.contenteditable) {
            this.setCancelHTML();
            if (this.isEmpty()) this.innerHTML = this.placeholderHTML || "";
          } else {
            if (this.isPlaceholder()) {
              this.setCancelHTML("");
            }
          }
        },
      },
      {
        key: "_getRange",
        value: function _getRange() {
          var shadowRoot = function shadowRoot(el) {
            var parent = el.parentNode;
            return parent ? shadowRoot(parent) : el;
          };

          this.range = shadow.getRange(shadowRoot(this));
          this.updateRange();
        },
        /**
         * Handles paste.
         *
         * @param {event} e paste event
         * @returns {void}
         */
      },
      {
        key: "_handlePaste",
        value: function _handlePaste(e) {
          var pasteContent = ""; // intercept paste event

          if (e && (e.clipboardData || e.originalEvent.clipboardData)) {
            pasteContent = (e.originalEvent || e).clipboardData.getData(
              "text/html"
            );
          } else if (window.clipboardData) {
            pasteContent = window.clipboardData.getData("Text");
          }

          this.dispatchEvent(
            new CustomEvent("pastefromclipboard", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: this,
            })
          );
          e.preventDefault();
        },
      },
      {
        key: "_rangeChange",
        value: function _rangeChange(e) {},
      },
      {
        key: "observer",
        get: function get() {
          return new MutationObserver(this._getRange);
        },
      },
      {
        key: "placeHolderHTML",
        get: function get() {
          return "<p>".concat(this.placeholder, "</p>");
        },
      },
    ]);

    return RichTextEditor;
  })(_litElement.LitElement);

exports.RichTextEditor = RichTextEditor;
window.customElements.define(RichTextEditor.tag, RichTextEditor);
