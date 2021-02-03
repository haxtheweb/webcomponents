"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.RichTextEditorBehaviors = exports.RichTextEditor = void 0;

var _litElement = require("lit-element/lit-element.js");

var _richTextEditorButton = require("./lib/buttons/rich-text-editor-button.js");

var shadow = _interopRequireWildcard(
  require("shadow-selection-polyfill/shadow.js")
);

require("./lib/singletons/rich-text-editor-selection.js");

require("./lib/toolbars/rich-text-editor-toolbar.js");

require("./lib/toolbars/rich-text-editor-toolbar-mini.js");

require("./lib/toolbars/rich-text-editor-toolbar-full.js");

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

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    "\n\n          :host {\n            display: block;\n          }\n          :host([hidden]) {\n            display: none;\n          }\n          :host([disabled]){\n            cursor: not-allowed;\n          }\n          :host(:empty) {\n            opacity: 0.7;\n          }\n          :host(:focus) {\n            outline: none;\n          }\n\n          :host(.heightmax[editing]) {\n            max-height: calc(100vh - 200px);\n            overflow-y: scroll;\n          }\n\n          #container,\n          #wysiwyg {\n            display: block;\n            width: 100%;\n          }\n          #source,\n          #wysiwyg {\n            margin: 0;\n            padding: 0;\n            min-height: var(--rich-text-editor-min-height, 20px);\n            cursor: pointer;\n            outline: none;\n            flex: 1 1 100%;\n            width: 100%;\n          }\n          :host(:empty) #wysiwyg::after {\n            display: block;\n            content: attr(aria-placeholder);\n          }\n\n          :host(:hover),\n          :host(:focus-within){\n            opacity: 1;\n            outline: var(--rich-text-editor-border-width, 2px) solid\n              var(--rich-text-editor-focus-color, blue);\n          }\n          :host([disabled]),\n          :host([view-source]){\n            outline: none !important;\n          }\n\n          #source:hover, \n          #source:focus-within {\n            outline: var(--rich-text-editor-border-width, 2px) solid\n              var(--rich-text-editor-focus-color, blue);\n          }\n          :host([editing][view-source]) #container {\n            display: flex;\n            align-items: stretch;\n            justify-content: space-between;\n            width: 100%;\n          }\n          :host([editing][view-source]) #source,\n          :host([editing][view-source]) #wysiwyg {\n            resize: horizontal;\n            overflow: auto;\n            flex: 1 1 auto;\n            width: 50%;\n          }\n          :host([editing][view-source]) #source {\n            min-width: 300px;\n          }\n          :host([editing][view-source]) #wysiwyg {\n            cursor: not-allowed;\n            margin-right: 10px;\n            width: calc(50% - 10px);\n          }\n\n          *::selection .rich-text-editor-selection {\n            background-color: var(\n              --rich-text-editor-selection-bg,\n              rgb(146, 197, 255)\n            );\n          }\n        ",
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
    ' <div\n        id="container"\n        @focus="',
    '"\n        @blur="',
    '"\n        @mouseover="',
    '"\n        @mouseout="',
    '"\n      >\n        <div id="wysiwyg" aria-placeholder="',
    '">\n          <slot></slot>\n        </div>\n        <code-editor\n          id="source"\n          font-size="13"\n          ?hidden="',
    '"\n          language="html"\n          @value-changed="',
    '"\n          word-wrap\n        >\n        </code-editor>\n      </div>',
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

var RichTextEditorBehaviors = function RichTextEditorBehaviors(SuperClass) {
  return (
    /*#__PURE__*/
    (function (_SuperClass) {
      _inherits(_class, _SuperClass);

      _createClass(
        _class,
        [
          {
            key: "render",
            // render function
            value: function render() {
              var _this2 = this;

              return (0, _litElement.html)(
                _templateObject(),
                function (e) {
                  return (_this2.__focused = true);
                },
                function (e) {
                  return (_this2.__focused = false);
                },
                function (e) {
                  return (_this2.__hovered = true);
                },
                function (e) {
                  return (_this2.__hovered = false);
                },
                this.placeholder,
                !(this.viewSource && this.editing),
                this._handleSourceChange
              );
            }, // properties available to the custom element for data binding
          },
        ],
        [
          {
            key: "styles",
            //styles function
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
              return _objectSpread(
                {},
                _get(_getPrototypeOf(_class), "properties", this),
                {
                  /**
                   * editor's unique id
                   */
                  id: {
                    name: "id",
                    type: String,
                    reflect: true,
                    attribute: "id",
                  },

                  /**
                   * Maps to editing attribute
                   */
                  editing: {
                    name: "editing",
                    type: Boolean,
                    reflect: true,
                    attribute: "editing",
                  },

                  /**
                   * don't reveal toolbar on mouseover
                   */
                  disabled: {
                    name: "disabled",
                    type: Boolean,
                    attribute: "disabled",
                    reflect: true,
                  },

                  /**
                   * don't reveal toolbar on mouseover
                   */
                  disableHover: {
                    name: "disableHover",
                    type: Boolean,
                    attribute: "disable-hover",
                  },

                  /**
                   * Placeholder text for empty editable regions
                   */
                  placeholder: {
                    name: "placeholder",
                    type: String,
                    reflect: true,
                    attribute: "placeholder",
                  },

                  /**
                   * id for toolbar
                   */
                  toolbar: {
                    name: "toolbar",
                    type: String,
                    reflect: true,
                    attribute: "toolbar",
                  },

                  /**
                   * current range
                   */
                  range: {
                    name: "range",
                    type: Object,
                    attribute: "range",
                  },

                  /**
                   * raw html
                   */
                  rawhtml: {
                    type: String,
                    attribute: "rawhtml",
                  },

                  /**
                   * type of editor toolbar, i.e.
                   * full - full for full toolbar with breadcrumb,
                   * mini - mini for mini floating toolbar, or
                   * default toolbar if neither.
                   */
                  type: {
                    name: "type",
                    type: String,
                    reflect: true,
                    attribute: "type",
                  },

                  /**
                   * whether to update range
                   */
                  updateRange: {
                    type: Boolean,
                  },

                  /**
                   * whether editor is view source code mode
                   */
                  viewSource: {
                    type: Boolean,
                    attribute: "view-source",
                    reflect: true,
                  },

                  /**
                   * contains cancelled edits
                   */
                  __canceledEdits: {
                    type: Object,
                  },

                  /**
                   * connected toolbar
                   */
                  __connectedToolbar: {
                    type: Object,
                  },

                  /**
                   * code-editor for view source
                   */
                  __codeEditorValue: {
                    type: String,
                  },

                  /**
                   * has focus
                   */
                  __needsUpdate: {
                    type: Boolean,
                  },

                  /**
                   * has focus
                   */
                  __focused: {
                    type: Boolean,
                  },

                  /**
                   * is hovered
                   */
                  __hovered: {
                    type: Boolean,
                  },

                  /**
                   * selection management
                   */
                  __selection: {
                    type: Object,
                  },
                }
              );
            },
            /**
             * Store the tag name to make it easier to obtain directly.
             * @notice function name must be here for tooling to operate correctly
             */
          },
          {
            key: "tag",
            get: function get() {
              return "rich-text-editor";
            },
          },
        ]
      );

      function _class() {
        var _this;

        _classCallCheck(this, _class);

        _this = _possibleConstructorReturn(
          this,
          _getPrototypeOf(_class).call(this)
        );
        _this.placeholder = "Click to edit";
        _this.toolbar = "";
        _this.type = "rich-text-editor-toolbar";
        _this.id = "";
        _this.range = undefined;
        _this.disabled = false;
        _this.__focused = false;
        _this.__hovered = false;
        _this.editing = false;
        _this.__selection = window.RichTextEditorSelection.requestAvailability();

        var root = _assertThisInitialized(_this);

        Promise.resolve().then(function () {
          return _interopRequireWildcard(
            require("@lrnwebcomponents/code-editor/code-editor.js")
          );
        });

        _this.setAttribute("tabindex", 1);

        document.addEventListener(shadow.eventName, _this._getRange.bind(root));
        return _this;
      }
      /**
       * mutation observer
       *
       * @readonly
       * @memberof RichTextEditor
       */

      _createClass(_class, [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            var _this3 = this;

            _get(
              _getPrototypeOf(_class.prototype),
              "connectedCallback",
              this
            ).call(this);

            setTimeout(function () {
              _this3.register();
            }, 500);
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
              _getPrototypeOf(_class.prototype),
              "disconnectedCallback",
              this
            ).call(this);

            this.register(true);
          },
        },
        {
          key: "firstUpdated",
          value: function firstUpdated() {
            if (_get(_getPrototypeOf(_class.prototype), "firstUpdated", this))
              _get(
                _getPrototypeOf(_class.prototype),
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
            var _this4 = this;

            _get(_getPrototypeOf(_class.prototype), "updated", this).call(
              this,
              changedProperties
            );

            changedProperties.forEach(function (oldValue, propName) {
              if (propName === "editing") _this4._editableChange();

              if (propName === "disabled") {
                _this4.disableEditing();

                _this4.setAttribute("tabindex", _this4.disabled ? -1 : 0);
              }

              if (propName === "range") _this4._rangeChange();
              if (propName === "rawhtml" && !!_this4.rawhtml)
                _this4.setHTML(_this4.rawhtml);
              if (propName === "viewSource") _this4._handleViewSourceChange();

              if (["viewSource", "editing"].includes(propName)) {
                if (_this4.editing && !_this4.viewSource) {
                  _this4.setAttribute("contenteditable", true);
                } else {
                  _this4.removeAttribute("contentEditable");
                }
              }
            });
            if (!this.innerHTML) this.innerHTML = "";
          },
        },
        {
          key: "disableEditing",
          value: function disableEditing() {
            this.editing = false;
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
            this.editing = true;
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
            return this.isEmpty()
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
           * revert content to before editing=true
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
            return !this.__selection
              ? document
              : this.__selection.getRoot(this);
          },
          /**
           * sanitizesHTML
           * override this function to make your own filters
           *
           * @param {string} html html to be pasted
           * @returns {string} filtered html as string
           */
        },
        {
          key: "sanitizeHTML",
          value: function sanitizeHTML(html) {
            if (!html) return;
            var regex = "<body(.*\n)*>(.*\n)*</body>";
            if (html.match(regex) && html.match(regex).length > 0)
              html = html.match(regex)[0].replace(/<\?body(.*\n)*\>/i);
            return html;
          },
          /**
           *
           *
           * @param {string} [rawhtml=""]
           * @memberof RichTextEditor
           */
        },
        {
          key: "setHTML",
          value: function setHTML() {
            var rawhtml =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : "";
            var html = this.sanitizeHTML(rawhtml).trim();
            this.innerHTML = html;
            this.setCancelHTML(html);
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
          value: function updateRange() {
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
           * watches for range changes
           *
           * @memberof RichTextEditor
           */
        },
        {
          key: "_editableChange",
          value: function _editableChange() {
            var _this5 = this;

            var keyPress = function keyPress(e) {
              if (_this5.isEmpty() && e.key) {
                _this5.innerHTML = e.key
                  .replace(">", "&gt;")
                  .replace("<", "&lt;")
                  .replace("&", "&amp;");

                var range = _this5._getRange();

                _this5.range.selectNodeContents(_this5);

                _this5.range.collapse();
              }
            };

            if (this.editing) {
              this.addEventListener("keypress", keyPress);
              this.setCancelHTML();
            } else {
              this.removeEventListener("keypress", keyPress);
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

            this.range = shadowRoot(this)
              ? shadow.getRange(shadowRoot(this))
              : undefined;
            if (this.updateRange) this.updateRange();
            return this.range;
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
          /**
           * updates editor content to code-editor value
           *
           * @param {event} e code-editor's value change event
           * @memberof RichTextEditor
           */
        },
        {
          key: "_handleSourceChange",
          value: function _handleSourceChange(e) {
            var _this6 = this;

            if (!this.__needsUpdate) {
              var _html = "".concat(this.innerHTML),
                code = !!e.detail.value ? "".concat(e.detail.value) : _html,
                cleanCode = this._outdentHTML(code).replace(/\s+/gm, ""),
                cleanHTML = this._outdentHTML(_html).replace(/\s+/gm, "");

              this.__needsUpdate = cleanCode.localeCompare(cleanHTML);

              var update = function update() {
                _this6.__needsUpdate = false;
                _this6.innerHTML = e.detail.value;
              };

              if (this.__needsUpdate) setTimeout(update.bind(this), 300);
            }
          },
        },
        {
          key: "_outdentHTML",
          value: function _outdentHTML() {
            var str =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : "";
            str = this.sanitizeHTML(str)
              .replace(/[\s]*$/, "")
              .replace(/^[\n\r]*/, "")
              .replace(/[\n\r]+/gm, "\n");
            var match = str.match(/^\s+/),
              find = match ? match[0] : false,
              regex = !find ? false : new RegExp("\\n".concat(find), "gm");
            str = str.replace(/^\s+/, "");
            str = regex ? str.replace(regex, "\n ") : str;
            return str;
          },
        },
        {
          key: "_handleViewSourceChange",
          value: function _handleViewSourceChange() {
            var code = this.shadowRoot
              ? this.shadowRoot.querySelector("#source")
              : undefined;

            if (code && this.viewSource) {
              code.editorValue = this._outdentHTML(this.innerHTML);
              code.addEventListener(
                "value-changed",
                this._handleSourceChange.bind(this)
              );
            } else if (code) {
              code.removeEventListener(
                "value-changed",
                this._handleSourceChange.bind(this)
              );
            }
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
      ]);

      return _class;
    })(SuperClass)
  );
};
/**
 * `rich-text-editor`
 * @element rich-text-editor
 * a standalone rich text editor
### Styling

`<rich-text-editor` provides following custom properties and mixins
for styling:

Custom property | Description | Default
----------------|-------------|----------
--rich-text-editor-min-height | minimum height of editor | 20px
--rich-text-editor-outline-width | width of editor's outline when focused | 1px
--rich-text-editor-focus-color | color of editor's outline when focused | blue 
--rich-text-editor-selection-bg | color of hiighlighted selection | rgb(146, 197, 255)
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo ./demo/index.html demo
 * @demo ./demo/mini.html mini floating toolbar
 * @demo ./demo/full.html toolbar with breadcrumb
 * @demo ./demo/config.html custom configuration
 * @demo ./demo/rawhtml.html raw HTML
 */

exports.RichTextEditorBehaviors = RichTextEditorBehaviors;

var RichTextEditor =
  /*#__PURE__*/
  (function (_RichTextEditorBehavi) {
    _inherits(RichTextEditor, _RichTextEditorBehavi);

    function RichTextEditor() {
      _classCallCheck(this, RichTextEditor);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(RichTextEditor).apply(this, arguments)
      );
    }

    return RichTextEditor;
  })(RichTextEditorBehaviors(_litElement.LitElement));

exports.RichTextEditor = RichTextEditor;
window.customElements.define(RichTextEditor.tag, RichTextEditor);
