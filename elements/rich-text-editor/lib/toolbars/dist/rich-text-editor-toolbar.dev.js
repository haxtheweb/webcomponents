"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.RichTextEditorToolbarBehaviors = exports.RichTextEditorToolbar = void 0;

var _litElement = require("lit-element/lit-element.js");

var _simpleToolbar = require("@lrnwebcomponents/simple-toolbar/simple-toolbar.js");

var _simpleToolbarButton = require("@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-button.js");

var _richTextEditorButton = require("../buttons/rich-text-editor-button.js");

require("@lrnwebcomponents/rich-text-editor/lib/singletons/rich-text-editor-selection.js");

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

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    "\n          :host {\n            border: var(--simple-toolbar-border-width, 1px) solid\n              var(--simple-toolbar-border-color, #ddd);\n            background-color: var(--simple-toolbar-button-bg, #ffffff);\n          }\n        ",
  ]);

  _templateObject3 = function _templateObject3() {
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

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    "\n          :host {\n            display: block;\n            border: none;\n            background-color: transparent;\n          }\n          #floating {\n            display: flex;\n            background-color: var(--simple-toolbar-button-bg, #ffffff);\n            border: var(--simple-toolbar-border-width, 1px) solid\n              var(--simple-toolbar-border-color, #ddd);\n          }\n          #floating[hidden] {\n            display: none;\n          }\n          #buttons[collapsed] {\n            width: max-content;\n          }\n        ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n        <absolute-position-behavior\n          ?auto="',
    '"\n          id="floating"\n          fit-to-visible-bounds\n          for="',
    '"\n          ?hidden="',
    '"\n          position="top"\n        >\n          ',
    "\n        </absolute-position-behavior>\n      ",
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

var RichTextEditorToolbarBehaviors = function RichTextEditorToolbarBehaviors(
  SuperClass
) {
  return (
    /*#__PURE__*/
    (function (_SimpleToolbarBehavio) {
      _inherits(_class, _SimpleToolbarBehavio);

      _createClass(
        _class,
        [
          {
            key: "render",
            // render function for template
            value: function render() {
              return this.toolbarTemplate;
            }, // properties available to custom element for data binding
          },
          {
            key: "undoButton",
            get: function get() {
              return {
                command: "undo",
                icon: "undo",
                label: "Undo",
                shortcutKeys: "ctrl+z",
                type: "rich-text-editor-button",
              };
            },
          },
          {
            key: "redoButton",
            get: function get() {
              return {
                command: "redo",
                icon: "redo",
                label: "Redo",
                shortcutKeys: "ctrl+shift+z",
                type: "rich-text-editor-button",
              };
            },
          },
          {
            key: "historyButtonGroup",
            get: function get() {
              return {
                type: "button-group",
                buttons: [this.undoButton, this.redoButton],
              };
            },
          },
          {
            key: "formatButton",
            get: function get() {
              return {
                label: "Format",
                type: "rich-text-editor-heading-picker",
              };
            },
          },
          {
            key: "boldButton",
            get: function get() {
              return {
                command: "bold",
                icon: "editor:format-bold",
                label: "Bold",
                shortcutKeys: "ctrl+b",
                toggles: true,
                type: "rich-text-editor-button",
              };
            },
          },
          {
            key: "italicButton",
            get: function get() {
              return {
                command: "italic",
                icon: "editor:format-italic",
                label: "Italics",
                shortcutKeys: "ctrl+i",
                toggles: true,
                type: "rich-text-editor-button",
              };
            },
          },
          {
            key: "underlineButton",
            get: function get() {
              return {
                type: "rich-text-editor-underline",
              };
            },
          },
          {
            key: "removeFormatButton",
            get: function get() {
              return {
                command: "removeFormat",
                icon: "editor:format-clear",
                label: "Erase Format",
                type: "rich-text-editor-button",
              };
            },
          },
          {
            key: "basicInlineButtonGroup",
            get: function get() {
              return {
                type: "button-group",
                buttons: [
                  this.formatButton,
                  this.boldButton,
                  this.italicButton,
                  this.removeFormatButton,
                ],
              };
            },
          },
          {
            key: "linkButton",
            get: function get() {
              return {
                icon: "link",
                label: "Link",
                shortcutKeys: "ctrl+k",
                type: "rich-text-editor-link",
              };
            },
          },
          {
            key: "linkButtonGroup",
            get: function get() {
              return {
                type: "button-group",
                buttons: [this.linkButton],
              };
            },
          },
          {
            key: "cutButton",
            get: function get() {
              return {
                command: "cut",
                icon: "content-cut",
                label: "Cut",
                shortcutKeys: "ctrl+x",
                type: "rich-text-editor-button",
              };
            },
          },
          {
            key: "copyButton",
            get: function get() {
              return {
                command: "copy",
                icon: "content-copy",
                label: "Copy",
                shortcutKeys: "ctrl+c",
                type: "rich-text-editor-button",
              };
            },
          },
          {
            key: "pasteButton",
            get: function get() {
              return {
                command: "paste",
                icon: "content-paste",
                label: "Paste",
                shortcutKeys: "ctrl+v",
                type: "rich-text-editor-button",
              };
            },
          },
          {
            key: "clipboardButtonGroup",
            get: function get() {
              return {
                type: "button-group",
                buttons: [this.cutButton, this.copyButton, this.pasteButton],
              };
            },
          },
          {
            key: "subscriptButton",
            get: function get() {
              return {
                command: "subscript",
                icon: "mdextra:subscript",
                label: "Subscript",
                toggles: true,
                type: "rich-text-editor-button",
              };
            },
          },
          {
            key: "superscriptButton",
            get: function get() {
              return {
                command: "superscript",
                icon: "mdextra:superscript",
                label: "Superscript",
                toggles: true,
                type: "rich-text-editor-button",
              };
            },
          },
          {
            key: "scriptButtonGroup",
            get: function get() {
              return {
                type: "button-group",
                buttons: [this.subscriptButton, this.superscriptButton],
              };
            },
          },
          {
            key: "symbolButton",
            get: function get() {
              return {
                symbolTypes: ["symbols"],
                type: "rich-text-editor-symbol-picker",
              };
            },
          },
          {
            key: "emojiButton",
            get: function get() {
              return {
                type: "rich-text-editor-emoji-picker",
              };
            },
          },
          {
            key: "imageButton",
            get: function get() {
              return {
                type: "rich-text-editor-image",
              };
            },
          },
          {
            key: "insertButtonGroup",
            get: function get() {
              return {
                type: "button-group",
                buttons: [this.imageButton, this.symbolButton],
              };
            },
          },
          {
            key: "orderedListButton",
            get: function get() {
              return {
                command: "insertOrderedList",
                icon: "editor:format-list-numbered",
                label: "Ordered List",
                toggles: true,
                type: "rich-text-editor-button",
              };
            },
          },
          {
            key: "unorderedListButton",
            get: function get() {
              return {
                command: "insertUnorderedList",
                icon: "editor:format-list-bulleted",
                label: "Unordered List",
                toggles: true,
                type: "rich-text-editor-button",
              };
            },
          },
          {
            key: "blockquoteButton",
            get: function get() {
              return {
                command: "formatBlock",
                commandVal: "blockquote",
                label: "Blockquote",
                icon: "editor:format-quote",
                shortcutKeys: "ctrl+'",
                type: "rich-text-editor-button",
              };
            },
          },
          {
            key: "indentButton",
            get: function get() {
              return {
                command: "indent",
                icon: "editor:format-indent-increase",
                event: "text-indent",
                label: "Increase Indent",
                shortcutKeys: "ctrl+]",
                type: "rich-text-editor-button",
              };
            },
          },
          {
            key: "outdentButton",
            get: function get() {
              return {
                command: "outdent",
                event: "text-outdent",
                icon: "editor:format-indent-decrease",
                label: "Decrease Indent",
                shortcutKeys: "ctrl+[",
                type: "rich-text-editor-button",
              };
            },
          },
          {
            key: "listIndentButtonGroup",
            get: function get() {
              return {
                type: "button-group",
                buttons: [
                  this.orderedListButton,
                  this.unorderedListButton,
                  this.blockquoteButton,
                  this.indentButton,
                  this.outdentButton,
                ],
              };
            },
          },
          {
            key: "saveButton",
            get: function get() {
              return {
                command: "save",
                icon: "save",
                label: "Save",
                type: "rich-text-editor-button",
              };
            },
          },
          {
            key: "closeButton",
            get: function get() {
              return {
                command: "cancel",
                icon: "close",
                label: "Cancel",
                type: "rich-text-editor-button",
              };
            },
          },
          {
            key: "saveCloseButtonGroup",
            get: function get() {
              return {
                type: "button-group",
                buttons: [this.saveButton],
              };
            },
          },
          {
            key: "sourceButton",
            get: function get() {
              return {
                type: "rich-text-editor-source-code",
              };
            },
          },
          {
            key: "sourceButtonGroup",
            get: function get() {
              return {
                type: "button-group",
                buttons: [this.sourceButton],
              };
            },
          },
          {
            key: "defaultConfig",
            get: function get() {
              return [
                this.historyButtonGroup,
                this.basicInlineButtonGroup,
                this.linkButtonGroup,
                this.clipboardButtonGroup,
                this.scriptButtonGroup,
                this.insertButtonGroup,
                this.listIndentButtonGroup,
              ];
            },
          },
          {
            key: "miniConfig",
            get: function get() {
              return [
                {
                  type: "button-group",
                  buttons: [
                    this.boldButton,
                    this.italicButton,
                    this.removeFormatButton,
                  ],
                },
                this.linkButtonGroup,
                this.scriptButtonGroup,
                {
                  type: "button-group",
                  buttons: [this.orderedListButton, this.unorderedListButton],
                },
              ];
            },
          },
          {
            key: "miniTemplate",
            get: function get() {
              return (0, _litElement.html)(
                _templateObject(),
                this.controls,
                this.controls,
                !this.controls,
                _get(_getPrototypeOf(_class.prototype), "toolbarTemplate", this)
              );
            }, // render function for toolbar
          },
          {
            key: "toolbarTemplate",
            get: function get() {
              return _get(
                _getPrototypeOf(_class.prototype),
                "toolbarTemplate",
                this
              );
            },
          },
        ],
        [
          {
            key: "tag",

            /**
             * Store tag name to make it easier to obtain directly.
             */
            get: function get() {
              return "rich-text-editor-toolbar";
            },
          },
          {
            key: "miniStyles",
            get: function get() {
              return [(0, _litElement.css)(_templateObject2())];
            },
          },
          {
            key: "baseStyles",
            get: function get() {
              return [].concat(
                _toConsumableArray(
                  _get(_getPrototypeOf(_class), "baseStyles", this)
                ),
                _toConsumableArray(_richTextEditorButton.RichTextStyles),
                [(0, _litElement.css)(_templateObject3())]
              );
            },
          },
          {
            key: "styles",
            get: function get() {
              return [].concat(
                _toConsumableArray(this.baseStyles),
                _toConsumableArray(
                  _get(_getPrototypeOf(_class), "stickyStyles", this)
                )
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
                   * `rich-text-editor` element that is currently in `editing` mode
                   */
                  editor: {
                    name: "editor",
                    type: Object,
                    attribute: "editor",
                  },

                  /**
                   * `rich-text-editor` unique id
                   */
                  id: {
                    name: "id",
                    type: String,
                    attribute: "id",
                    reflect: true,
                  },

                  /**
                   * current text selected range.
                   */
                  savedSelection: {
                    name: "savedSelection",
                    type: Object,
                  },

                  /**
                   * current text selected range, which is actually a range.
                   */
                  range: {
                    name: "range",
                    type: Object,
                  },

                  /**
                   * selection singleton
                   */
                  registered: {
                    type: Boolean,
                  },

                  /**
                   * currently selected node
                   */
                  selectedNode: {
                    type: Object,
                  },

                  /**
                   * array of ancestors of currently selected node
                   */
                  selectionAncestors: {
                    type: Array,
                  },

                  /**
                   * when to make toolbar visible:
                   * "always" to keep it visible,
                   * "selection" when there is an active selection,
                   * or defaults to only when connected to an
                   */
                  show: {
                    type: String,
                    attribute: "show",
                    reflect: true,
                  },

                  /**
                   * Tracks inline widgets that require selection data
                   */
                  __clickableElements: {
                    name: "__clickableElements",
                    type: Object,
                  },

                  /**
                   * hides paste button in Firefox
                   */
                  __pasteDisabled: {
                    name: "__pasteDisabled",
                    type: Boolean,
                    attribute: "paste-disabled",
                    reflect: true,
                  },

                  /**
                   * whether prompt is open
                   */
                  __promptOpen: {
                    name: "__promptOpen",
                    type: Boolean,
                  },

                  /**
                   * selection singleton
                   */
                  __selection: {
                    type: Object,
                  },
                }
              );
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
        Promise.resolve().then(function () {
          return _interopRequireWildcard(
            require("../buttons/rich-text-editor-button.js")
          );
        });
        Promise.resolve().then(function () {
          return _interopRequireWildcard(
            require("../buttons/rich-text-editor-source-code.js")
          );
        });
        Promise.resolve().then(function () {
          return _interopRequireWildcard(
            require("../buttons/rich-text-editor-heading-picker.js")
          );
        });
        Promise.resolve().then(function () {
          return _interopRequireWildcard(
            require("../buttons/rich-text-editor-symbol-picker.js")
          );
        });
        Promise.resolve().then(function () {
          return _interopRequireWildcard(
            require("../buttons/rich-text-editor-underline.js")
          );
        });
        Promise.resolve().then(function () {
          return _interopRequireWildcard(
            require("../buttons/rich-text-editor-image.js")
          );
        });
        Promise.resolve().then(function () {
          return _interopRequireWildcard(
            require("../buttons/rich-text-editor-link.js")
          );
        });
        _this.config = _this.defaultConfig;
        _this.__clickableElements = {};
        return _this;
      }

      _createClass(_class, [
        {
          key: "firstUpdated",
          value: function firstUpdated(changedProperties) {
            _get(_getPrototypeOf(_class.prototype), "firstUpdated", this).call(
              this,
              changedProperties
            );

            this.__selection = window.RichTextEditorSelection.requestAvailability();
            this.register();
          },
        },
        {
          key: "updated",
          value: function updated(changedProperties) {
            var _this2 = this;

            _get(_getPrototypeOf(_class.prototype), "updated", this).call(
              this,
              changedProperties
            );

            changedProperties.forEach(function (oldValue, propName) {
              if (propName === "range") _this2._rangeChange();
              if (propName === "editor") _this2._editorChange();
            });
          },
        },
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            _get(
              _getPrototypeOf(_class.prototype),
              "connectedCallback",
              this
            ).call(this);

            this.register();
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
          /**
           * id of editor currently being controlled
           * @readonly
           */
        },
        {
          key: "cancel",

          /**
           * cancels edits to active editor
           * @returns {void}
           */
          value: function cancel() {
            this.dispatchEvent(
              new CustomEvent("cancel", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: this,
              })
            );
          },
          /**
           * closes toolbar
           *
           * @param {object} editor connected rich-text-editor
           */
        },
        {
          key: "close",
          value: function close() {
            this.dispatchEvent(
              new CustomEvent("disableediting", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: this,
              })
            ); //if (editor) this.disableEditing(editor);

            this.editor = undefined;
            document.body.append(this);
          },
          /**
           * uses selection to create a range placeholder that keeps range highlighted
           *
           * @param {boolean} [add=true] add highlight?
           * @returns {void}
           */
        },
        {
          key: "highlight",
          value: function highlight() {
            var add =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : true;
            this.dispatchEvent(
              new CustomEvent("highlight", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: add,
              })
            );
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
                  toolbar: this,
                },
              })
            );
          },
          /**
           * selects a given node inside connected editor
           *
           * @param {object} node
           * @returns {void}
           */
        },
        {
          key: "setRange",
          value: function setRange(range) {
            this.dispatchEvent(
              new CustomEvent("setrange", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: {
                  editor: this.editor,
                  range: range,
                },
              })
            );
          },
          /**
           * selects a given node inside connected editor
           *
           * @param {object} node
           * @returns {void}
           */
        },
        {
          key: "selectNode",
          value: function selectNode(node) {
            this.dispatchEvent(
              new CustomEvent("selectnode", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: node,
              })
            );
          },
          /**
           * selects a given node inside connected editor
           *
           * @param {object} node
           * @returns {void}
           */
        },
        {
          key: "selectNodeContents",
          value: function selectNodeContents(node) {
            this.dispatchEvent(
              new CustomEvent("selectnodecontents", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: node,
              })
            ); //if (this.__selection) this.__selection.selectNodeContents(node, this.editor);
          },
          /**
           * selects a given node inside connected editor
           *
           * @param {object} node
           * @returns {void}
           */
        },
        {
          key: "selectRange",
          value: function selectRange(range) {
            this.dispatchEvent(
              new CustomEvent("selectrange", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: range,
              })
            ); //if (this.__selection) this.__selection.selectRange(range, this.editor);
          },
          /**
           * make an new editable element
           *
           * @param {object} editor an HTML object that can be edited
           * @returns {void}
           */
        },
        {
          key: "newEditor",
          value: function newEditor(editor) {
            var content = document.createElement("rich-text-editor");
            editor.parentNode.insertBefore(content, editor);
            content.appendChild(editor);
          },
          /**
           * pastes sanitized clipboard contents into current editor's selected range
           * @param {object} editor an HTML object that can be edited
           * @returns {void}
           */
        },
        {
          key: "pasteFromClipboard",
          value: function pasteFromClipboard() {
            this.dispatchEvent(
              new CustomEvent("pastefromclipboard", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: this.editor,
              })
            );
          },
          /**
           * clears toolbar and resets shortcuts
           *
           * @returns
           * @memberof SimpleToolbar
           */
        },
        {
          key: "clearToolbar",
          value: function clearToolbar() {
            if (_get(_getPrototypeOf(_class.prototype), "clearToolbar", this))
              _get(
                _getPrototypeOf(_class.prototype),
                "clearToolbar",
                this
              ).call(this);
            this.__clickableElements = {};
          },
          /**
           * registers button when appended to toolbar
           *
           * @param {object} button button node
           * @memberof SimpleToolbar
           */
        },
        {
          key: "registerButton",
          value: function registerButton(button) {
            var _this3 = this;

            if (_get(_getPrototypeOf(_class.prototype), "registerButton", this))
              _get(
                _getPrototypeOf(_class.prototype),
                "registerButton",
                this
              ).call(this, button);
            (button.tags || []).forEach(function (tag) {
              return (_this3.__clickableElements[tag] = button.handler);
            });
            button.disabled = !this.editor; //firefox doesn't allow for clipboard button

            if (button.command === "paste" && !navigator.clipboard)
              button.remove();
          },
          /**
           * registers button when appended to toolbar
           *
           * @param {object} button button node
           * @memberof SimpleToolbar
           */
        },
        {
          key: "deregisterButton",
          value: function deregisterButton(button) {
            var _this4 = this;

            if (
              _get(_getPrototypeOf(_class.prototype), "deregisterButton", this)
            )
              _get(
                _getPrototypeOf(_class.prototype),
                "deregisterButton",
                this
              ).call(this, button);
            (button.tags || []).forEach(function (tag) {
              return delete _this4.__clickableElements[tag];
            });
          },
          /**
           * sets up breadcrumbs when editor changes
           * @returns {void}
           */
        },
        {
          key: "_editorChange",
          value: function _editorChange() {
            var _this5 = this;

            this.range = undefined;

            if (this.breadcrumbs) {
              this.breadcrumbs.controls = this.controls;
              this.breadcrumbs.sticky = this.sticky;
              this.breadcrumbs.controls = this.controls;
              this.breadcrumbs.hidden = this.disconnected;
              if (!!this.editor)
                this.editor.parentNode.insertBefore(
                  this.breadcrumbs,
                  this.editor.nextSibling
                );
            }

            this.buttons.forEach(function (button) {
              if (button.command !== "close") button.disabled = !_this5.editor;
            });
            console.log("editor change", !this.editor);
          },
          /**
           * Gets updated selected range.
           * @returns {void}
           */
        },
        {
          key: "_rangeChange",
          value: function _rangeChange() {
            var _this6 = this;

            if (
              this.range &&
              this.range.commonAncestorContainer &&
              this.editor &&
              this.editor.contains(this.range.commonAncestorContainer)
            ) {
              (this.buttons || []).forEach(function (button) {
                button.range = undefined;
                button.range = _this6.range;
                button.selectedNode = _this6.selectedNode;
                button.selectionAncestors = _this6.selectionAncestors;
              });

              if (this.breadcrumbs) {
                this.breadcrumbs.controls = this.controls;
                this.breadcrumbs.selectionAncestors = this.selectionAncestors;
                this.breadcrumbs.hidden = this.disconnected;
              }
            }
          },
        },
        {
          key: "controls",
          get: function get() {
            return !this.editor ? undefined : this.editor.getAttribute("id");
          },
        },
        {
          key: "disconnected",
          get: function get() {
            return this.show == "always"
              ? false
              : this.show != "selection"
              ? !this.editor
              : this.noSelection;
          },
        },
        {
          key: "noSelection",
          get: function get() {
            return !this.range || this.range.collapsed;
          },
        },
      ]);

      return _class;
    })((0, _simpleToolbar.SimpleToolbarBehaviors)(SuperClass))
  );
};
/**
 * `rich-text-editor-toolbar`
 * default toolbar for rich text editor
 *
### Styling

`<rich-text-editor-toolbar` provides following custom properties and mixins
for styling:

Custom property | Description | Default
----------------|-------------|----------
 *
 * @element rich-text-editor-toolbar
 * @demo ./demo/toolbar.html
 */

exports.RichTextEditorToolbarBehaviors = RichTextEditorToolbarBehaviors;

var RichTextEditorToolbar =
  /*#__PURE__*/
  (function (_RichTextEditorToolba) {
    _inherits(RichTextEditorToolbar, _RichTextEditorToolba);

    function RichTextEditorToolbar() {
      _classCallCheck(this, RichTextEditorToolbar);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(RichTextEditorToolbar).apply(this, arguments)
      );
    }

    return RichTextEditorToolbar;
  })(RichTextEditorToolbarBehaviors(_litElement.LitElement));

exports.RichTextEditorToolbar = RichTextEditorToolbar;
window.customElements.define(RichTextEditorToolbar.tag, RichTextEditorToolbar);
