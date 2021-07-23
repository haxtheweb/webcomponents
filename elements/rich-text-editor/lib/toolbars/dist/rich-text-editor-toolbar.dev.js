"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.RichTextEditorToolbarBehaviors = exports.RichTextEditorToolbar = void 0;

var _litElement = require("lit-element/lit-element.js");

var _simpleToolbar = require("@lrnwebcomponents/simple-toolbar/simple-toolbar.js");

var _simpleToolbarButton = require("@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-button.js");

var _richTextEditorButton = require("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-button.js");

var _richTextEditorRangeBehaviors = require("@lrnwebcomponents/rich-text-editor/lib/singletons/rich-text-editor-range-behaviors.js");

require("@lrnwebcomponents/rich-text-editor/lib/singletons/rich-text-editor-prompt.js");

require("@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js");

var shadow = _interopRequireWildcard(
  require("shadow-selection-polyfill/shadow.js")
);

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
    "\n          :host {\n            border: var(--rich-text-editor-border-width, 1px) solid\n              var(--rich-text-editor-border-color, #ddd);\n            background-color: var(--rich-text-editor-bg, #ffffff);\n          }\n        ",
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
    "\n          :host {\n            position: relative;\n            height: 0;\n            margin: 0 auto;\n            padding: 0;\n            border: none;\n            background-color: none;\n          }\n          #container {\n            display: flex;\n            position: absolute;\n            bottom: 0;\n            margin: 0 auto;\n            padding: 0;\n            border: var(--rich-text-editor-border-width, 1px) solid\n              var(--rich-text-editor-border-color, #ddd);\n            background-color: var(\n              --rich-text-editor-bg,\n              var(--rich-text-editor-bg, #ffffff)\n            );\n          }\n        ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([' <div id="container">', "</div> "]);

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

window.RichTextEditorToolbars = window.RichTextEditorToolbars || [];
/**
 * RichTextEditorToolbarBehaviors
 *
 * @extends SimpleToolbarBehaviors
 * @extends RichTextToolbarStyles
 * @customElement
 * @class
 * @lit-html
 * @lit-element
 */

var RichTextEditorToolbarBehaviors = function RichTextEditorToolbarBehaviors(
  SuperClass
) {
  return (
    /*#__PURE__*/
    (function (_RichTextEditorRangeB) {
      _inherits(_class, _RichTextEditorRangeB);

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

            /**
             * default config for an undo button
             *
             * @readonly
             */
            get: function get() {
              return {
                command: "undo",
                icon: "undo",
                label: "Undo",
                shortcutKeys: "ctrl+z",
                type: "rich-text-editor-button",
              };
            },
            /**
             * default config for a redo button
             *
             * @readonly
             */
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
            /**
             * default config for a history button group: undo + redo
             *
             * @readonly
             */
          },
          {
            key: "historyButtonGroup",
            get: function get() {
              return {
                type: "button-group",
                buttons: [this.undoButton, this.redoButton],
              };
            },
            /**
             * default config for a format button
             *
             * @readonly
             */
          },
          {
            key: "formatButton",
            get: function get() {
              return {
                label: "Format",
                type: "rich-text-editor-heading-picker",
              };
            },
            /**
             * default config for a bold button
             *
             * @readonly
             */
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
            /**
             * default config for an italic button
             *
             * @readonly
             */
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
            /**
             * default config for an underline button
             *
             * @readonly
             */
          },
          {
            key: "underlineButton",
            get: function get() {
              return {
                type: "rich-text-editor-underline",
              };
            },
            /**
             * default config for a remove format button
             *
             * @readonly
             */
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
            /**
             * default config for a style button group: format, bold, italic, and remove format
             *
             * @readonly
             */
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
            /**
             * default config for a link button
             *
             * @readonly
             */
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
            /**
             * default config for a link button group: link
             *
             * @readonly
             */
          },
          {
            key: "linkButtonGroup",
            get: function get() {
              return {
                type: "button-group",
                buttons: [this.linkButton],
              };
            },
            /**
             * default config for a cut button
             *
             * @readonly
             */
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
            /**
             * default config for a copy button
             *
             * @readonly
             */
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
            /**
             * default config for a paste button
             *
             * @readonly
             */
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
            /**
             * default config for a clipboard button group: cut, copy, and paste
             *
             * @readonly
             */
          },
          {
            key: "clipboardButtonGroup",
            get: function get() {
              return {
                type: "button-group",
                buttons: [this.cutButton, this.copyButton, this.pasteButton],
              };
            },
            /**
             * default config for a subscript button
             *
             * @readonly
             */
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
            /**
             * default config for a superscript button
             *
             * @readonly
             */
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
            /**
             * default config for a script button group: subscript & superscript
             *
             * @readonly
             */
          },
          {
            key: "scriptButtonGroup",
            get: function get() {
              return {
                type: "button-group",
                buttons: [this.subscriptButton, this.superscriptButton],
              };
            },
            /**
             * default config for a symbol button
             *
             * @readonly
             */
          },
          {
            key: "symbolButton",
            get: function get() {
              return {
                symbolTypes: ["symbols"],
                type: "rich-text-editor-symbol-picker",
              };
            },
            /**
             * default config for an emoji button
             *
             * @readonly
             */
          },
          {
            key: "emojiButton",
            get: function get() {
              return {
                type: "rich-text-editor-emoji-picker",
              };
            },
            /**
             * default config for an image button
             *
             * @readonly
             */
          },
          {
            key: "imageButton",
            get: function get() {
              return {
                type: "rich-text-editor-image",
              };
            },
            /**
             * default config for an insert button group: image
             *
             * @readonly
             */
          },
          {
            key: "insertButtonGroup",
            get: function get() {
              return {
                type: "button-group",
                buttons: [this.imageButton, this.symbolButton],
              };
            },
            /**
             * default config for an ordered list button
             *
             * @readonly
             */
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
            /**
             * default config for an unordered list button
             *
             * @readonly
             */
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
            /**
             * default config for a blockquote button
             *
             * @readonly
             */
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
            /**
             * default config for an indent button
             *
             * @readonly
             */
          },
          {
            key: "indentButton",
            get: function get() {
              return {
                command: "indent",
                icon: "editor:format-indent-increase",
                label: "Increase Indent",
                shortcutKeys: "ctrl+]",
                type: "rich-text-editor-button",
              };
            },
            /**
             * default config for an outdent button
             *
             * @readonly
             */
          },
          {
            key: "outdentButton",
            get: function get() {
              return {
                command: "outdent",
                icon: "editor:format-indent-decrease",
                label: "Decrease Indent",
                shortcutKeys: "ctrl+[",
                type: "rich-text-editor-button",
              };
            },
            /**
             * default config for a list and indent button group:
             * ordered, unordered, blockquote, indent, outdent
             *
             * @readonly
             */
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
            /**
             * default config for an save button
             *
             * @readonly
             */
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
            /**
             * default config for a close button
             *
             * @readonly
             */
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
            /**
             * default config for a save and close button group: save and close
             *
             * @readonly
             */
          },
          {
            key: "saveCloseButtonGroup",
            get: function get() {
              return {
                type: "button-group",
                buttons: [this.saveButton],
              };
            },
            /**
             * default config for a view source button
             *
             * @readonly
             */
          },
          {
            key: "sourceButton",
            get: function get() {
              return {
                type: "rich-text-editor-source-code",
              };
            },
            /**
             * default config for a source button group: view source
             *
             * @readonly
             */
          },
          {
            key: "sourceButtonGroup",
            get: function get() {
              return {
                type: "button-group",
                buttons: [this.sourceButton],
              };
            },
            /**
             * default config for toolbar with
             * default history, style, link, clipboard, script, insert, and list button groups
             *
             * @readonly
             */
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
            /**
             * default config for toolbar with
             * default a custom group of style buttons,
             * default link button group,
             * default script button group,
             * and a custom list button groups
             *
             * @readonly
             */
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
            /**
             * a template that places toolbar in a container
             * so that it can be positioned absolutely
             *
             * @readonly
             */
          },
          {
            key: "miniTemplate",
            get: function get() {
              return (0, _litElement.html)(
                _templateObject(),
                _get(_getPrototypeOf(_class.prototype), "toolbarTemplate", this)
              );
            },
            /**
             * default toolbar template uses simple-toolbar
             *
             * @readonly
             */
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
            /**
             * styles for small floating toolbar
             *
             * @readonly
             * @static
             */
          },
          {
            key: "miniStyles",
            get: function get() {
              return [(0, _litElement.css)(_templateObject2())];
            },
            /**
             * base styles toolbar: simple toolbar base styles + custom styles for rich text
             *
             * @readonly
             * @static
             */
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
            /**
             * default styles for toolbar: base + simple-toolbar sticky styles
             *
             * @readonly
             * @static
             */
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
                   * The label for the breadcrums area.
                   */
                  breadcrumbsLabel: {
                    name: "breadcrumbsLabel",
                    type: String,
                    attribute: "breadcrumbs-label",
                  },

                  /**
                   * The label for the breadcrums area.
                   */
                  breadcrumbsSelectAllLabel: {
                    name: "breadcrumbsSelectAllLabel",
                    type: String,
                    attribute: "breadcrumbs-select-all-label",
                  },

                  /**
                   * `rich-text-editor` element that is currently in `editing` mode
                   */
                  target: {
                    name: "target",
                    type: Object,
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
                   * or defaults to only when connected to a toolbar
                   */
                  show: {
                    type: String,
                    attribute: "show",
                    reflect: true,
                  },

                  /**
                   * Tracks inline widgets that require selection data
                   */
                  clickableElements: {
                    name: "clickableElements",
                    type: Object,
                  },

                  /**
                   * contains cancelled edits
                   */
                  __canceledEdits: {
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
                  __prompt: {
                    type: Object,
                  },

                  /**
                   * whether prompt is open
                   */
                  __promptOpen: {
                    name: "__promptOpen",
                    type: Boolean,
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

        _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this)); // prettier-ignore

        Promise.resolve().then(function () {
          return _interopRequireWildcard(require("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-source-code.js"));
        }); // prettier-ignore

        Promise.resolve().then(function () {
          return _interopRequireWildcard(require("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-heading-picker.js"));
        }); // prettier-ignore

        Promise.resolve().then(function () {
          return _interopRequireWildcard(require("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-symbol-picker.js"));
        }); // prettier-ignore

        Promise.resolve().then(function () {
          return _interopRequireWildcard(require("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-underline.js"));
        }); // prettier-ignore

        Promise.resolve().then(function () {
          return _interopRequireWildcard(require("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-image.js"));
        }); // prettier-ignore

        Promise.resolve().then(function () {
          return _interopRequireWildcard(
            require("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-link.js")
          );
        });
        _this.config = _this.defaultConfig;
        _this.clickableElements = {};
        _this.breadcrumbsLabel = "Select";
        _this.breadcrumbsSelectAllLabel = "All";
        _this.__toolbar = _assertThisInitialized(_this);
        document.addEventListener(
          shadow.eventName,
          _this._handleTargetSelection.bind(_this.__toolbar)
        ); //stops mousedown from bubbling up and triggering HAX focus logic

        _this.addEventListener("mousedown", function (e) {
          return e.stopImmediatePropagation();
        });

        return _this;
      }

      _createClass(_class, [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            _get(
              _getPrototypeOf(_class.prototype),
              "connectedCallback",
              this
            ).call(this);

            window.RichTextEditorToolbars.push(this);
          },
          /**
           * life cycle, element is disconnected
           * @returns {void}
           */
        },
        {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            var _this2 = this;

            _get(
              _getPrototypeOf(_class.prototype),
              "disconnectedCallback",
              this
            ).call(this);

            window.RichTextEditorToolbars = window.RichTextEditorToolbars.filter(
              function (toolbar) {
                return toolbar !== _this2;
              }
            );
          },
        },
        {
          key: "firstUpdated",
          value: function firstUpdated(changedProperties) {
            var _this3 = this;

            if (!this.id) this.id = this._generateUUID();

            _get(_getPrototypeOf(_class.prototype), "firstUpdated", this).call(
              this,
              changedProperties
            );

            if (this.hasBreadcrumbs) this._addBreadcrumbs();
            this.__prompt = window.RichTextEditorPrompt.requestAvailability();

            this.__prompt.addEventListener("open", function (e) {
              _this3.__promptOpen = true;
            });

            this.__prompt.addEventListener("close", function (e) {
              _this3.__promptOpen = false;
            });

            this.onmousedown = this._addHighlight;
            this.onkeydown = this._addHighlight;
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
              if (propName === "range") _this4._rangeChanged();
              if (propName === "editor") _this4._editorChange();
              if (["editor", "show", "range"].includes(propName))
                _this4.hidden = _this4.disconnected;
              if (
                ["breadcrumbs", "sticky"].includes(propName) &&
                !!_this4.breadcrumbs
              )
                _this4.breadcrumbs.sticky = _this4.sticky;
            });
          },
          /**
           * id of editor currently being controlled
           * @readonly
           * @returns {string}
           */
        },
        {
          key: "cancel",

          /**
           * cancels edits to active editor
           * @returns {void}
           * @event cancel
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
           * @returns {void}
           * @event disableediting
           *
           */
        },
        {
          key: "close",
          value: function close() {
            //if (editor) this.disableEditing(editor);
            this.target = undefined;
            this.positionByTarget(false);
            this.dispatchEvent(
              new CustomEvent("close", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: this,
              })
            );
          },
          /**
           * fires when editor changed
           * @event editor-change
           */
        },
        {
          key: "_editorChanged",
          value: function _editorChanged() {
            this.dispatchEvent(
              new CustomEvent("editor-change", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: this,
              })
            );
          },
          /* ------- RANGES -------- */

          /**
           * function for getting range;
           * can be overriden
           */
        },
        {
          key: "getRange",
          value: function getRange() {
            var shadowRoot = function shadowRoot(el) {
              var parent = el.parentNode;
              return parent ? shadowRoot(parent) : el;
            };

            try {
              this.range = shadowRoot(this.target)
                ? shadow.getRange(shadowRoot(this.target))
                : undefined;
            } catch (e) {
              this.range = undefined;
            }

            return this.range;
          },
        },
        {
          key: "getSelection",
          value: (function (_getSelection) {
            function getSelection() {
              return _getSelection.apply(this, arguments);
            }

            getSelection.toString = function () {
              return _getSelection.toString();
            };

            return getSelection;
          })(function () {
            return window, getSelection();
          }),
          /**
           * maintains consistent range info across toolbar and target
           *
           * @param {object} editor
           * @param {range} range
           * @memberof RichTextEditorManager
           */
        },
        {
          key: "updateRange",
          value: function updateRange(target) {
            var range =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : this.range;
            if (!target) return;
            if (!target.range) target.range = range;
            this.range = target.range;
          },
          /**
           * updates buttons and fires when rane changes
           * @event range-changed
           * @param {event} e
           */
        },
        {
          key: "_rangeChanged",
          value: function _rangeChanged(e) {
            this._updateButtonRanges();

            this.dispatchEvent(
              new CustomEvent("range-changed", {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: this,
              })
            );
          },
          /* ------- BUTTONS AND BREADCRUMBS -------- */

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
            this.clickableElements = {};
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
            var _this5 = this;

            if (
              _get(_getPrototypeOf(_class.prototype), "deregisterButton", this)
            )
              _get(
                _getPrototypeOf(_class.prototype),
                "deregisterButton",
                this
              ).call(this, button);
            (button.tagsArray || []).forEach(function (tag) {
              return delete _this5.clickableElements[tag];
            });
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
            var _this6 = this;

            if (_get(_getPrototypeOf(_class.prototype), "registerButton", this))
              _get(
                _getPrototypeOf(_class.prototype),
                "registerButton",
                this
              ).call(this, button); //firefox doesn't allow for clipboard button

            if (button.command === "paste" && !navigator.clipboard) {
              button.remove();
              return;
            }

            button.__toolbar = this;
            button.disabled = !this.target;
            (button.tagsArray || []).forEach(function (tag) {
              return (_this6.clickableElements[tag] = function (e) {
                return button.tagClickCallback(e);
              });
            });
          },
          /**
           * adds breadcrumbfeature
           *
           */
        },
        {
          key: "_addBreadcrumbs",
          value: function _addBreadcrumbs() {
            if (!this.breadcrumbs) {
              this.breadcrumbs = document.createElement(
                "rich-text-editor-breadcrumbs"
              );
              document.body.appendChild(this.breadcrumbs);
            }

            this.breadcrumbs.label = this.breadcrumbsLabel;
          },
          /**
           * Generate a UUID
           * @returns {string} unique id
           */
        },
        {
          key: "_generateUUID",
          value: function _generateUUID() {
            var hex = Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
            return "rte-" + "ss-s-s-s-sss".replace(/s/g, hex);
          },
          /**
           * handles updated button
           *
           * @param {event} e
           */
        },
        {
          key: "_handleButtonUpdate",
          value: function _handleButtonUpdate(e) {
            if (
              _get(
                _getPrototypeOf(_class.prototype),
                "_handleButtonUpdate",
                this
              )
            )
              _get(
                _getPrototypeOf(_class.prototype),
                "_handleButtonUpdate",
                this
              ).call(this, e);
          },
          /**
           * updates buttons with selected range
           * @returns {void}
           */
        },
        {
          key: "_updateButtonRanges",
          value: function _updateButtonRanges() {
            var _this7 = this;

            if (
              this.range &&
              this.target &&
              this.rangeNodeOrParentNode(this.range) &&
              this.target.contains(this.rangeNodeOrParentNode(this.range))
            ) {
              var nodes = [],
                getParentNode = function getParentNode(node) {
                  if (
                    node.tagName.toLowerCase() !== "rich-text-editor-highlight"
                  )
                    nodes.push(node);
                  if (node.parentNode && node.parentNode !== _this7.target)
                    getParentNode(node.parentNode);
                };

              if (this.rangeNodeOrParentNode(this.range) !== this.target)
                getParentNode(this.rangeNodeOrParentNode(this.range));
              nodes.push({
                nodeName: this.breadcrumbsSelectAllLabel,
                selectAll: this.target,
              });
              this.selectedNode = nodes[0];
              this.selectionAncestors = nodes.reverse();
              (this.buttons || []).forEach(function (button) {
                button.range = undefined;
                button.range = _this7.range;
                button.selectedNode = _this7.selectedNode;
                button.selectionAncestors = _this7.selectionAncestors;
              });

              if (this.breadcrumbs) {
                this.breadcrumbs.selectionAncestors = this.selectionAncestors;
                this.breadcrumbs.hidden = this.disconnected;
                this.breadcrumbs.__target = this.__target;
              }
            }
          },
          /* ------- TARGET -------- */

          /**
           * undo for canceled edits
           *
           * @param {object} editor
           * @memberof RichTextEditorManager
           */
        },
        {
          key: "cancelEdits",
          value: function cancelEdits() {
            var target =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : this.target;
            this.revertTarget(target);
            this.target(editor, false);
          },
        },
        {
          key: "positionByTarget",

          /**
           * moves toolbar into position before the target
           * (can be overriden for custom positioning)
           * @param {object} target
           */
          value: function positionByTarget(target) {
            if (!!target) {
              target.parentNode.insertBefore(this, target);
              this.slot = target.slot;

              if (this.breadcrumbs) {
                this.target.parentNode.insertBefore(
                  this.breadcrumbs,
                  this.target.nextSibling
                );
                this.breadcrumbs.slot = target.slot;
              }
            } else {
              document.body.append(this);
              this.slot = undefined;

              if (this.breadcrumbs) {
                document.body.append(this.breadcrumbs);
                this.breadcrumbs.slot = undefined;
              }
            }
          },
          /**
           * disables editing
           *
           * @param {object} editor
           * @memberof RichTextEditorManager
           */
        },
        {
          key: "enableEditing",
          value: function enableEditing() {
            var _this8 = this;

            var target =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : this.target;
            var handlers = this.enabledTargetHandlers;

            if (!!target && !target.hidden && !target.disabled) {
              if (target.makeSticky) target.makeSticky(this.sticky);
              this.positionByTarget(target);
              target.setAttribute("contenteditable", "true");
              Object.keys(handlers).forEach(function (handler) {
                return target.removeEventListener(handler, handlers[handler]);
              });
              this.setCanceledEdits();
              this.updateRange(target);
              this.observeChanges(true);

              this.getRoot(target).onselectionchange = function (e) {
                if (!_this8.__promptOpen) _this8.updateRange(target);
              };

              this.dispatchEvent(
                new CustomEvent("enabled", {
                  bubbles: true,
                  composed: true,
                  cancelable: true,
                  detail: (this.target.innerHTML || "")
                    .replace(/<!--[^(-->)]*-->/g, "")
                    .trim(),
                })
              );
            }
          },
        },
        {
          key: "disableEditing",
          value: function disableEditing() {
            var target =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : this.target;
            var handlers = this.enabledTargetHandlers,
              range = this.getRange();

            if (!!target) {
              if (!!range) range.collapse();

              this.__highlight.emptyContents();

              this.getRoot(target).onselectionchange = undefined;
              this.observeChanges(false);
              if (this.__source) this.__source.toggle(false);
              target.removeAttribute("contenteditable");
              Object.keys(handlers).forEach(function (handler) {
                return target.removeEventListener(handler, handlers[handler]);
              });
              if (target.makeSticky) target.makeSticky(false);
              this.dispatchEvent(
                new CustomEvent("disabled", {
                  bubbles: true,
                  composed: true,
                  cancelable: true,
                  detail: (this.target.innerHTML || "")
                    .replace(/<!--[^(-->)]*-->/g, "")
                    .trim(),
                })
              );
            }
          },
          /**
           * make an new editable element
           *
           * @param {object} editor an HTML object that can be edited
           * @returns {void}
           */
        },
        {
          key: "insertNew",
          value: function insertNew(target) {
            var content = document.createElement("rich-text-editor");
            target.parentNode.insertBefore(content, target);
            content.appendChild(target);
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
              this.observer.observe(this.target, {
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
           * revert content to before editing=true
           *
           * @memberof RichTextEditor
           */
        },
        {
          key: "revertTarget",
          value: function revertTarget() {
            var target =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : this.target;
            if (this.target) this.target.innerHTML = this.__canceledEdits;
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
           * holds on to edits so cancel willwork
           *
           * @param {string} [html=this.innerHTML]
           * @memberof RichTextEditor
           */
        },
        {
          key: "setCanceledEdits",
          value: function setCanceledEdits(html) {
            this.__canceledEdits = html
              ? html
              : this.target && this.target.innerHTML
              ? this.target.innerHTML
              : "";
          },
        },
        {
          key: "setTarget",
          value: function setTarget(target) {
            var _this9 = this;

            var handlers = this.targetHandlers(target);

            if (!!target) {
              var oldTarget = this.target;
              target.setAttribute("role", "textbox");

              if (oldTarget !== target) {
                if (!!oldTarget) this.unsetTarget(oldTarget);
                Object.keys(handlers).forEach(function (handler) {
                  return target.addEventListener(handler, handlers[handler]);
                });

                this.getRoot(target).onselectionchange = function (e) {
                  if (!_this9.__promptOpen) _this9.updateRange(target);
                };

                this.target = target;
                this.enableEditing(target);
              }
            }

            this.updateRange(this.target);
            if (this.breadcrumbs) this.breadcrumbs.controls = this.controls;
            this.buttons.forEach(function (button) {
              if (button.command !== "close") button.disabled = !_this9.target;
            });
            this.range = undefined;

            this._rangeChanged();
          },
        },
        {
          key: "unsetTarget",
          value: function unsetTarget() {
            var target =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : this.target;
            var handlers = this.targetHandlers(target);
            this.disableEditing(target);
            Object.keys(handlers).forEach(function (handler) {
              return target.removeEventListener(handler, handlers[handler]);
            });
            this.target = undefined;
          },
          /**
           * determines if target is empty
           *
           * @returns {string}
           * @memberof RichTextEditor
           */
        },
        {
          key: "targetEmpty",
          value: function targetEmpty() {
            return (
              !this.target ||
              !this.target.innerHTML ||
              this.trimHTML(this.target) == ""
            );
          },
          /**
           * list of event handlers for a given target
           *
           * @param {*} target
           * @returns
           */
        },
        {
          key: "targetHandlers",
          value: function targetHandlers(target) {
            var _this10 = this;

            return {
              click: function click(e) {
                return _this10._handleTargetClick(target, e);
              },
              dblclick: function dblclick(e) {
                return _this10._handleTargetDoubleClick(target, e);
              },
              focus: function focus(e) {
                return _this10._handleTargetFocus(target, e);
              },
              keydown: function keydown(e) {
                return _this10._handleShortcutKeys(e);
              },
              paste: function paste(e) {
                return _this10._handlePaste(e);
              },
            };
          },
          /**
           * gets cleaned HTML from the target
           *
           * @returns {string}
           * @memberof RichTextEditor
           */
        },
        {
          key: "htmlMatchesTarget",
          value: function htmlMatchesTarget(html) {
            var outdentedHTML = !!html ? this.outdentHTML(html) : undefined,
              cleanHTML = outdentedHTML
                ? outdentedHTML.replace(/\s+/gm, "")
                : undefined,
              cleanTarget = this.targetHTML
                ? this.targetHTML.replace(/\s+/gm, "")
                : undefined;
            return (
              cleanHTML && cleanTarget && cleanTarget.localeCompare(cleanHTML)
            );
          },
        },
        {
          key: "_handleTargetDoubleClick",
          value: function _handleTargetDoubleClick(target, e) {
            if (!target || target.disabled || this.target !== target) return;
            var els = Object.keys(this.clickableElements || {}),
              el = e.target ||
                e.srcElement || {
                  tagName: "",
                },
              evt = {
                detail: el,
              },
              tagname = (el.tagName || "").toLowerCase();

            if (tagname && els.includes(tagname)) {
              e.preventDefault();
              this.clickableElements[tagname](evt);
              this.updateRange();
            }
          },
        },
        {
          key: "_handleTargetClick",
          value: function _handleTargetClick(target, e) {
            if (!target || target.disabled) return;

            if (this.target !== target) {
              e.preventDefault();
              this.setTarget(target);
            } else {
              var els = Object.keys(this.clickableElements || {}),
                el = e.target ||
                  e.srcElement || {
                    tagName: "",
                  },
                evt = {
                  detail: el,
                },
                tagname = (el.tagName || "").toLowerCase();

              if (tagname && els.includes(tagname)) {
                e.preventDefault();
                this.clickableElements[tagname](evt);
              }
            }

            this.range = this.getRange();
            this.updateRange();
          },
        },
        {
          key: "_handleTargetFocus",
          value: function _handleTargetFocus(target, e) {
            if (!this.__promptOpen && !target.disabled) this.setTarget(target);
          },
        },
        {
          key: "_handleTargetKeypress",
          value: function _handleTargetKeypress(e) {
            if (this.targetEmpty() && e.key) {
              this.innerHTML = e.key
                .replace(">", "&gt;")
                .replace("<", "&lt;")
                .replace("&", "&amp;");
              this.range = this.getRange();
              this.range.selectNodeContents(this);
              this.range.collapse();
            }
          },
        },
        {
          key: "_handleTargetMutation",
          value: function _handleTargetMutation() {
            var _this11 = this;

            var mutations =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : [];

            this._handleTargetSelection();

            (mutations || []).forEach(function (mutation) {
              if (mutation.type == "attributes") {
                if (
                  (target.disabled || target.hidden) &&
                  target.conteneditable
                ) {
                  _this11.disableEditing(target);

                  target.tabindex = -1;
                } else if (
                  !target.disabled &&
                  !target.hidden &&
                  target.conteneditable
                ) {
                  _this11.enableEditing(target);

                  target.tabindex = 0;
                }
              }
            });
          },
        },
        {
          key: "_handleTargetSelection",
          value: function _handleTargetSelection(e) {
            if (!this.__promptOpen) this.range = this.getRange();
          },
        },
        {
          key: "_handlePaste",
          value: function _handlePaste(e) {
            e.stopImmediatePropagation();
            this.pasteFromClipboard();
          },
        },
        {
          key: "_addHighlight",
          value: function _addHighlight() {
            if (!this.__highlight.hidden) return;
            this.range = this.getRange();
            if (
              !this.target ||
              !this.target.getAttribute("contenteditable") == "true"
            )
              return;

            this.__highlight.wrap(this.range || this.getRange());
          },
        },
        {
          key: "_removeHighlight",
          value: function _removeHighlight() {
            this.__highlight.unwrap(this.range || this.getRange());
          },
        },
        {
          key: "controls",
          get: function get() {
            var controls = !this.target
              ? undefined
              : this.target.getAttribute("id");
            this.setAttribute("controls", controls);
            return controls;
          },
          /**
           * determines if the toolbar is hidden
           *
           * @readonly
           * @returns {boolean}
           */
        },
        {
          key: "disconnected",
          get: function get() {
            return this.show == "always"
              ? false
              : this.show != "selection"
              ? !this.target
              : this.noSelection;
          },
          /**
           * determines if the toolbar has an extive selection
           *
           * @readonly
           * @returns {boolean}
           */
        },
        {
          key: "noSelection",
          get: function get() {
            return !this.range || this.range.collapsed;
          },
          /**
           * mutation observer
           *
           * @readonly
           * @memberof RichTextEditor
           */
        },
        {
          key: "observer",
          get: function get() {
            return new MutationObserver(this._handleTargetMutation.bind(this));
          },
        },
        {
          key: "enabledTargetHandlers",
          get: function get() {
            return {
              keydown: this._removeHighlight.bind(this),
              keypress: this._handleTargetKeypress.bind(this),
              mousedown: this._removeHighlight.bind(this),
            };
          },
        },
        {
          key: "targetHTML",
          get: function get() {
            return !!this.target
              ? this.outdentHTML(this.target.innerHTML)
              : undefined;
          },
        },
      ]);

      return _class;
    })(
      (0, _richTextEditorRangeBehaviors.RichTextEditorRangeBehaviors)(
        (0, _simpleToolbar.SimpleToolbarBehaviors)(SuperClass)
      )
    )
  );
};
/**
 * `rich-text-editor-toolbar`
 * is a default toolbar for rich text editor 
 * (can customize by extending RichTextEditorToolbarBehaviors)
 *
 * ### Styling
`<rich-text-editor-toolbar>` uses RichTextToolbarStyles constant to set 
SimpleToolbarBehaviors's simple-toolbar/simple-toolbar-button variables.

To further customize a toolbar and its buttons:

Custom property | Description | Default
----------------|-------------|----------
--rich-text-editor-border-color | default border color | #ddd
--rich-text-editor-border-width | default border width | 1px
--rich-text-editor-bg | default toolbar background | #ffffff
--rich-text-editor-button-opacity | default button opacity | 1
--rich-text-editor-button-color | default button color | #444
--rich-text-editor-button-bg | default button background | #ffffff
--rich-text-editor-button-border-color | overrides default border-color for buttons | transparent
--rich-text-editor-button-toggled-opacity | overrides default opacity when button is toggled | 1
--rich-text-editor-button-toggled-color | overrides default text color when button is toggled | #222
--rich-text-editor-button-toggled-bg | overrides default background when button is toggled | #ddd
--rich-text-editor-button-toggled-border-color | overrides default border-color when button is toggled | transparent
--rich-text-editor-button-hover-opacity | overrides default opacity when button is hovered or focused | 1
--rich-text-editor-button-hover-color | overrides default text color when button is hovered or focused  | #000
--rich-text-editor-button-hover-bg | overrides default background when button is hovered or focused | #f0f0f0
--rich-text-editor-button-hover-border-color | overrides default border-color when button is hovered or focused | unset
--rich-text-editor-button-disabled-opacity | overrides default opacity when button is disabled | 1
--rich-text-editor-button-disabled-color | overrides default text color when button is disabled | #666
--rich-text-editor-button-disabled-bg | overrides default background when button is disabled | transparent
--rich-text-editor-button-disabled-border-color | overrides default border-color when button is toggled | transparent
 *
 * @extends RichTextEditorToolbarBehaviors
 * @extends LitElement
 * @customElement
 * @lit-html
 * @lit-element
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
