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
    "\n:host([hidden]) {\n  display: none;\n}\n\n:host {\n  --simple-toolbar-border-color: #ddd;\n  --simple-toolbar-border-width: 1px;\n  --simple-toolbar-button-opacity: 1;\n  --simple-toolbar-button-color: #444;\n  --simple-toolbar-bg: #ffffff;\n  --simple-toolbar-button-bg: #ffffff;\n  --simple-toolbar-button-border-color: transparent;\n  --simple-toolbar-button-toggled-opacity: 1;\n  --simple-toolbar-button-toggled-color: #222;\n  --simple-toolbar-button-toggled-bg: #ddd;\n  --simple-toolbar-button-toggled-border-color: transparent;\n  --simple-toolbar-button-hover-opacity: 1;\n  --simple-toolbar-button-hover-color: #000;\n  --simple-toolbar-button-hover-bg: #f0f0f0;\n  --simple-toolbar-button-hover-border-color: unset;\n  --simple-toolbar-button-disabled-opacity: 1;\n  --simple-toolbar-button-disabled-color: #666;\n  --simple-toolbar-button-disabled-bg: transparent;\n  --simple-toolbar-button-disabled-border-color: transparent;\n}\n\n:host {\n  display: block;\n}\n\n:host(.heightmax[editing]) {\n  max-height: calc(100vh - 200px);\n  overflow-y: scroll;\n}\n\n\n#container {\n  display: flex;\n  align-items: stretch;\n  justify-content: space-between;\n}\n#placeholder {\n  display: none;\n}\n#source, #wysiwyg {\n  margin: 0;\n  padding: 0;\n  min-height: 40px;\n  cursor: pointer;\n  outline: var(--rich-text-editor-border-width, 2px) solid rgba(255,255,255,0);\n}\n\n:host(:empty) #source,\n:host(:empty) #wysiwyg {\n  outline: var(--rich-text-editor-border-width, 2px) dashed var(--simple-toolbar-border-color);\n  padding: 2px;\n  margin: 2px 0;\n}\n:host(:empty) #source:focus #placeholder,\n:host(:empty) #source:hover #placeholder {\n  display: block;\n  margin: 0;\n  padding: 0;\n}\n\n#source:hover,\n#wysiwyg:hover,\n#source:focus,\n#wysiwyg:focus {\n  outline: var(--rich-text-editor-border-width, 2px) solid var(--rich-text-editor-focus-color,blue);\n  padding: 2px;\n  margin: 2px 0;\n}\n\n:host([editing][view-source]) #source, \n:host([editing][view-source]) #wysiwyg {\n  resize: horizontal;\n  overflow: auto;\n  min-width: 10%;\n  max-width: 90%;\n  flex: 1 1 auto;\n  width: 50%;\n}\n\n*::selection .rich-text-editor-selection {\n  background-color: var(--rich-text-editor-selection-bg, rgb(146, 197, 255));\n}\n\n::slotted(*:first-child) {\n  margin-top: 0;\n}\n\n::slotted(*:last-child) {\n  margin-bottom: 0;\n}\n      ",
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
    '\n\n<div\n  id="container"\n  @focus="',
    '"\n  @blur="',
    '"\n  @mouseover="',
    '"\n  @mouseout="',
    '">\n  <div id="wysiwyg" ?contenteditable="',
    '">\n    <div id="placeholder" aria-placeholder="',
    '">',
    '</div>\n    <slot></slot>\n  </div>\n  <code-editor \n    id="source"\n    font-size="13"\n    ?hidden="',
    '" \n    language="html" \n    @value-changed="',
    '">\n  </code-editor>\n</div>',
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

    _createClass(
      RichTextEditor,
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
              this.editing,
              this.placeholder,
              this.placeholder,
              !(this.viewSource && this.editing),
              this._handleSourceChange
            );
          }, // haxProperty definition
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
          key: "haxProperties",
          get: function get() {
            return {
              canScale: true,
              canPosition: true,
              canEditSource: true,
              gizmo: {
                title: "Rich text-editor",
                description: "a standalone rich text editor",
                icon: "icons:android",
                color: "green",
                groups: ["Text"],
                handles: [
                  {
                    type: "todo:read-the-docs-for-usage",
                  },
                ],
                meta: {
                  author: "nikkimk",
                  owner: "Penn State University",
                },
              },
              settings: {
                configure: [
                  {
                    property: "title",
                    description: "",
                    inputMethod: "textfield",
                    required: false,
                    icon: "icons:android",
                  },
                ],
                advanced: [],
              },
            };
          }, // properties available to the custom element for data binding
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(_getPrototypeOf(RichTextEditor), "properties", this),
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
                 * code-editor for view source
                 */
                __codeEditor: {
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

    function RichTextEditor() {
      var _this;

      _classCallCheck(this, RichTextEditor);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(RichTextEditor).call(this)
      );
      _this.placeholder = "Click to edit";
      _this.toolbar = "";
      _this.type = "rich-text-editor-toolbar";
      _this.id = "";
      _this.range = undefined;
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
          var _this3 = this;

          _get(
            _getPrototypeOf(RichTextEditor.prototype),
            "connectedCallback",
            this
          ).call(this);

          setTimeout(function () {
            _this3.register();
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
          var _this4 = this;

          _get(_getPrototypeOf(RichTextEditor.prototype), "updated", this).call(
            this,
            changedProperties
          );

          changedProperties.forEach(function (oldValue, propName) {
            if (propName === "editing") _this4._editableChange();
            if (propName === "range") _this4._rangeChange();
            if (propName === "rawhtml" && !!_this4.rawhtml)
              _this4.setHTML(_this4.rawhtml);
            if (propName === "viewSource") _this4._handleViewSourceChange();
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
          return !this.__selection ? document : this.__selection.getRoot(this);
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
        /*
    getSanitizeClipboard(pasteContent) {
     let regex = "<body(.*\n)*>(.*\n)*</body>";
     if (pasteContent.match(regex) && pasteContent.match(regex).length > 0)
       pasteContent = pasteContent.match(regex)[0].replace(/<\?body(.*\n)*\>/i);
     return pasteContent;
    }
    /**
    * sets html of editor
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
          if (this.editing) {
            this.setCancelHTML();
            if (this.isEmpty()) this.innerHTML = this.placeholderHTML || "";
          } else {
            if (this.isPlaceholder()) {
              this.setCancelHTML("");
            }
          }

          this.__codeEditorValue = this.innerHTML;
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
          console.log(e, e.detail.value, this.innerHTML);
          if (!!e.detail.value && e.detail.value != this.innerHTML)
            this.innerHTML = e.detail.value;
        },
      },
      {
        key: "_handleViewSourceChange",
        value: function _handleViewSourceChange() {
          var editor = this.shadowRoot
            ? this.shadowRoot.querySelector("#source")
            : undefined;
          console.log(this.viewSource, editor.value, this.innerHTML);

          if (editor) {
            editor.editorValue = this.innerHTML;

            if (this.viewSource) {
              editor.addEventListener(
                "value-changed",
                this._handleSourceChange
              );
            } else {
              editor.removeEventListener(
                "value-changed",
                this._handleSourceChange
              );
            }
          }
        },
      },
      {
        key: "_hideSource",
        value: function _hideSource() {
          if (this.shadowRoot && this.shadowRoot.querySelector("#source"))
            this.shadowRoot
              .querySelector("#source")
              .removeEventListener("value-changed", this._handleSourceChange);
          /*console.log('hide source',this.codeEditor);
      this.codeEditor.removeEventListener(
        "value-changed",
        this._handleSourceChange
      );
      this.__codeEditor.removeEventListener("focus",e=>editor.__focused = true);
      this.__codeEditor.removeEventListener("blur",e=>editor.__focused = false);
      this.__codeEditor.removeEventListener("mousover",e=>editor.__hovered = true);
      this.__codeEditor.removeEventListener("out",e=>editor.__hovered = false);
      this.focus();
      this.codeEditor.remove();
      //this.toolbar.show = true;*/
        },
      },
      {
        key: "_rangeChange",
        value: function _rangeChange(e) {},
      },
      {
        key: "_showSource",
        value: function _showSource() {
          /*
      let editor = this;
      this.parentNode.insertBefore(this.codeEditor, this.nextElementSibling);
      this.codeEditor.editorValue = this.innerHTML;*/
          if (this.shadowRoot && this.shadowRoot.querySelector("#source"))
            this.shadowRoot
              .querySelector("#source")
              .addEventListener(
                "value-changed",
                this._handleSourceChange.bind(this)
              );
          /*this.__codeEditor.addEventListener("focus",e=>editor.__focused = true);
      this.__codeEditor.addEventListener("blur",e=>editor.__focused = false);
      this.__codeEditor.addEventListener("mousover",e=>editor.__hovered = true);
      this.__codeEditor.addEventListener("out",e=>editor.__hovered = false);
      this.__codeEditor.focus();
      console.log('show source',this.codeEditor,this.innerHTML);
      //this.toolbar.show = false;*/
        },
      },
      {
        key: "observer",
        get: function get() {
          return new MutationObserver(this._getRange);
        },
        /**
     *
     *
     * @readonly
     * @memberof RichTextEditor
     * /
    get codeEditor() {
      if (!this.__codeEditor)
        this.__codeEditor = document.createElement("code-editor");
      this.__codeEditor.language = "html";
      this.__codeEditor.style.margin = '0 0 0 0';
      console.log('codeEditor',this.__codeEditor);
      return this.__codeEditor;
    }
    /**
     * 
     *
     * @readonly
     * @memberof RichTextEditor
     */
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
