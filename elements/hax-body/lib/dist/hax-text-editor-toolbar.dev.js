"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxTextEditorToolbar = void 0;

var _litElement = require("lit-element");

var _richTextEditorToolbar = require("@lrnwebcomponents/rich-text-editor/lib/toolbars/rich-text-editor-toolbar.js");

var _haxTextEditorButton = require("./hax-text-editor-button.js");

var _haxStore = require("./hax-store.js");

var _haxContextBehaviors = require("./hax-context-behaviors.js");

var _I18NMixin = require("@lrnwebcomponents/i18n-manager/lib/I18NMixin.js");

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

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    "\n        :host {\n          --rich-text-editor-button-color: var(--hax-ui-color);\n          --rich-text-editor-button-bg: var(--hax-ui-background-color);\n          --rich-text-editor-button-border-color: transparent;\n          --rich-text-editor-button-hover-color: var(--hax-ui-color);\n          --rich-text-editor-button-hover-bg: var(\n            --hax-ui-background-color-secondary\n          );\n          --rich-text-editor-button-toggled-color: var(--hax-ui-color-accent);\n          --rich-text-editor-button-toggled-bg: var(--hax-ui-background-color);\n          --rich-text-editor-button-toggled-border-color: var(\n            --hax-ui-color-accent\n          );\n          --rich-text-editor-button-disabled-opacity: 0.5;\n          --rich-text-editor-button-disabled-color: var(--hax-ui-color);\n          --rich-text-editor-button-disabled-bg: var(--hax-ui-background-color);\n          --rich-text-editor-button-disabled-border-color: transparent;\n        }\n        ::slotted([icon-position]:hover) {\n          --rich-text-editor-button-toggled-bg: var(\n            --hax-ui-background-color-accent\n          );\n        }\n        ::slotted(.group) {\n          flex: 1 0 auto;\n          justify-content: center;\n          border-width: 1px;\n          margin: -1px;\n          padding: 0px;\n        }\n        ::slotted(.group),\n        ::slotted([icon-position]) {\n          z-index: 1;\n        }\n        ::slotted([icon-position]),\n        :host([collapsed]) ::slotted(.group) {\n          flex: 0 0 auto;\n        }\n        :host .group:focus,\n        :host .group:focus-within,\n        :host .group > *:focus,\n        :host .group > *:focus-within {\n          z-index: 2;\n        }\n        :host .group:hover,\n        :host .group > *:hover {\n          z-index: 3;\n        }\n      ",
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
    ' <div slot="tour" data-stop-content>\n      ',
    "\n    </div>",
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
 * `hax-text-editor-toolbar`
 * a customized toolbar (with buttons) for HAX
 *
 * @extends RichTextEditorToolbarBehaviors
 * @extends LitElement
 * @customElement
 * @demo demo/index.html
 */
var HaxTextEditorToolbar =
  /*#__PURE__*/
  (function (_RichTextEditorToolba) {
    _inherits(HaxTextEditorToolbar, _RichTextEditorToolba);

    _createClass(
      HaxTextEditorToolbar,
      [
        {
          key: "render",
          // render function
          value: function render() {
            return _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "toolbarTemplate",
              this
            );
          }, // properties available to the custom element for data binding
        },
        {
          key: "tag",

          /**
           * Store the tag name to make it easier to obtain directly.
           * @notice function name must be here for tooling to operate correctly
           */
          value: function tag() {
            return "hax-text-editor-toolbar";
          }, // life cycle
        },
        {
          key: "tourTemplate",
          get: function get() {
            return (0, _litElement.html)(
              _templateObject(),
              this.t.textEditorToolbarTour
            );
          },
        },
      ],
      [
        {
          key: "styles",
          //styles function
          get: function get() {
            return [].concat(
              _toConsumableArray(
                _get(_getPrototypeOf(HaxTextEditorToolbar), "baseStyles", this)
              ),
              _toConsumableArray(
                _get(
                  _getPrototypeOf(HaxTextEditorToolbar),
                  "stickyStyles",
                  this
                )
              ),
              [(0, _litElement.css)(_templateObject2())]
            );
          },
        },
        {
          key: "properties",
          get: function get() {
            return {
              __updated: {
                type: Boolean,
              },
            };
          },
        },
      ]
    );

    function HaxTextEditorToolbar() {
      var _this;

      _classCallCheck(this, HaxTextEditorToolbar);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxTextEditorToolbar).call(this)
      );
      _this.tag = HaxTextEditorToolbar.tag;
      _this.t = {
        undoButton: "Undo",
        redoButton: "Redo",
        formatButton: "Format",
        blockP: "Paragraph",
        blockH1: "Heading 1",
        blockH2: "Heading 2",
        blockH3: "Heading 3",
        blockH4: "Heading 4",
        blockH5: "Heading 5",
        blockH6: "Heading 6",
        blockPre: "Preformatted",
        italicButton: "Italic",
        boldButton: "Bold",
        underlineButton: "Underline",
        strikethroughButton: "Cross out",
        removeFormatButton: "Remove format",
        linkButton: "Link",
        cutButton: "Cut",
        copyButton: "Copy",
        pasteButton: "Paste",
        subscriptButton: "Subscript",
        superscriptButton: "Superscript",
        symbolButton: "Insert Symbol",
        emojiButton: "Insert Emoticon",
        imageButton: "Insert Image",
        orderedListButton: "Bulleted list",
        unorderedListButton: "Numbered list",
        blockquoteButton: "Blockquote",
        indentButton: "Indent",
        outdentButton: "Outdent",
        textEditorToolbarTour:
          "Change how the text is structured and visualized in the page.",
      };

      _this.registerLocalization({
        context: _assertThisInitialized(_this),
        namespace: "hax",
      });

      _this.sourceView = false;
      _this.haxUIElement = true;
      _this.tourName = "hax";
      window.HaxTextEditorToolbarConfig =
        window.HaxTextEditorToolbarConfig || {};
      window.HaxTextEditorToolbarConfig.inlineGizmos =
        window.HaxTextEditorToolbarConfig.inlineGizmos || {};
      window.HaxTextEditorToolbarConfig["default"] =
        window.HaxTextEditorToolbarConfig["default"] ||
        _toConsumableArray(_this.defaultConfig);
      _this.config = window.HaxTextEditorToolbarConfig["default"];
      _this.sticky = false;
      _this.__updated = false;

      _this.setTarget(undefined);

      window.addEventListener(
        "hax-store-ready",
        _this._handleHaxStoreReady.bind(_assertThisInitialized(_this))
      );
      window.addEventListener(
        "hax-register-properties",
        _this._handleElementRegister.bind(_assertThisInitialized(_this))
      );
      return _this;
    }
    /**
     * default config for a format button
     *
     * @readonly
     */

    _createClass(HaxTextEditorToolbar, [
      {
        key: "updated",
        value: function updated(changedProperties) {
          var _this2 = this;

          if (
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "updated",
              this
            )
          )
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "updated",
              this
            ).call(this, changedProperties);
          changedProperties.forEach(function (oldValue, propName) {
            if (propName === "parentSchema") _this2.updateBlocks();
            if (propName === "activeNode" && _this2.activeNode !== oldValue)
              _this2.setTarget(_this2.activeNode);
            if (propName === "t" && _this2.t !== oldValue)
              _this2.updateToolbarElements();
          });
        },
      },
      {
        key: "firstUpdated",
        value: function firstUpdated(changedProperties) {
          if (
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "firstUpdated",
              this
            )
          )
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "firstUpdated",
              this
            ).call(this, changedProperties);
          this.config = this.updateToolbarElements();
        },
      },
      {
        key: "updateBlocks",
        value: function updateBlocks() {
          if (
            this.formatButton.type &&
            this.querySelector(this.formatButton.type)
          )
            this.querySelector(
              this.formatButton.type
            ).blocks = this.filteredBlocks;
        },
      },
      {
        key: "getRange",
        value: function getRange() {
          var range = _haxStore.HAXStore.getRange();

          return !range || range.rangeCount < 1
            ? undefined
            : _haxStore.HAXStore.getRange();
        },
      },
      {
        key: "getSelection",
        value: function getSelection() {
          return _haxStore.HAXStore.getSelection();
        },
        /**
         * moves toolbar into position before the target
         * (can be overriden for custom positioning)
         * @param {object} target
         */
      },
      {
        key: "positionByTarget",
        value: function positionByTarget(target) {
          return;
        },
      },
      {
        key: "_handleElementRegister",

        /**
         * when an element is registered,
         * check its properties
         *
         * @param {event} e
         * @memberof HaxTextEditorToolbar
         */
        value: function _handleElementRegister(e) {
          var detail = e.detail || {},
            tag = detail.tag || {},
            props = detail.properties || {};

          this._setInlineElement(tag, props);
        },
        /**
         * when hax-store is ready,
         * check its registered elements
         *
         * @param {event} e
         * @memberof HaxTextEditorToolbar
         */
      },
      {
        key: "_handleHaxStoreReady",
        value: function _handleHaxStoreReady(e) {
          var _this3 = this;

          var elements = _haxStore.HAXStore.elementList || {},
            keys = Object.keys(elements);
          keys.forEach(function (key) {
            return _this3._setInlineElement(key, elemets[key]);
          });
        },
        /**
         * if an an element is inline,
         * adds it to list of inline elements
         *
         * @param {*} tag
         * @param {*} props
         * @returns
         * @memberof HaxTextEditorToolbar
         */
      },
      {
        key: "_setInlineElement",
        value: function _setInlineElement(tag, props) {
          //skip if tag is already registered
          if (
            !tag ||
            !props ||
            !!window.HaxTextEditorToolbarConfig.inlineGizmos[tag] ||
            tag.indexOf("-") < 0
          )
            return;
          var element = props,
            gizmo = props.gizmo || {},
            handles = gizmo.handles || [],
            title =
              gizmo.title ||
              gizmo.tag.replace(/-./g, function (x) {
                return x.toUpperCase()[1];
              }),
            inline = handles.filter(function (handle) {
              return handle.type === "inline";
            });
          element.gizmo = element.gizmo || {};
          element.gizmo.title = "Add ".concat(title);

          if (inline.length > 0) {
            window.HaxTextEditorToolbarConfig.inlineGizmos[tag] = {
              element: element,
              type: "hax-text-editor-button",
            };
            this.__updated = false;
            setTimeout(this.updateToolbarElements.bind(this), 500);
          }
        },
        /**
         * updates the toolbar buttons
         * to include custom inline element buttons
         *
         * @returns
         * @memberof HaxTextEditorToolbar
         */
      },
      {
        key: "updateToolbarElements",
        value: function updateToolbarElements() {
          if (this.__updated) return;
          this.__updated = true;
          var buttons = Object.keys(
            window.HaxTextEditorToolbarConfig.inlineGizmos || {}
          ).map(function (key) {
            return window.HaxTextEditorToolbarConfig.inlineGizmos[key];
          });
          this.config =
            buttons.length === 0
              ? _toConsumableArray(this.defaultConfig)
              : [].concat(_toConsumableArray(this.defaultConfig), [
                  {
                    type: "button-group",
                    buttons: buttons,
                  },
                ]);
          this.updateToolbar();
        },
      },
      {
        key: "undoButton",
        get: function get() {
          return _objectSpread(
            {},
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "undoButton",
              this
            ),
            {
              label: this.t.undoButton,
            }
          );
        },
        /**
         * default config for a format button
         *
         * @readonly
         */
      },
      {
        key: "redoButton",
        get: function get() {
          return _objectSpread(
            {},
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "redoButton",
              this
            ),
            {
              label: this.t.redoButton,
            }
          );
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
          return _objectSpread(
            {},
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "formatButton",
              this
            ),
            {
              label: this.t.formatButton,
              blocks: this.formatBlocks,
            }
          );
        },
      },
      {
        key: "formatBlocks",
        get: function get() {
          return [
            {
              label: this.t.blockP,
              tag: "p",
            },
            {
              label: this.t.blockH1,
              tag: "h1",
            },
            {
              label: this.t.blockH2,
              tag: "h2",
            },
            {
              label: this.t.blockH3,
              tag: "h3",
            },
            {
              label: this.t.blockH4,
              tag: "h4",
            },
            {
              label: this.t.blockH5,
              tag: "h5",
            },
            {
              label: this.t.blockH6,
              tag: "h6",
            },
            {
              label: this.t.blockPre,
              tag: "pre",
            },
          ];
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
          return _objectSpread(
            {},
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "boldButton",
              this
            ),
            {
              label: this.t.boldButton,
            }
          );
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
          return _objectSpread(
            {},
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "italicButton",
              this
            ),
            {
              label: this.t.italicButton,
            }
          );
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
          return _objectSpread(
            {},
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "underlineButton",
              this
            ),
            {
              label: this.t.underlineButton,
            }
          );
        },
        /**
         * default config for an underline button
         *
         * @readonly
         */
      },
      {
        key: "strikethroughButton",
        get: function get() {
          return _objectSpread(
            {},
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "strikethroughButton",
              this
            ),
            {
              label: this.t.strikethroughButton,
            }
          );
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
          return _objectSpread(
            {},
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "removeFormatButton",
              this
            ),
            {
              label: this.t.removeFormatButton,
            }
          );
        },
        /**
         * default config for a style button group: format, bold, italic, and remove format
         *
         * @readonly
         */
      },
      {
        key: "advancedInlineButtonGroup",
        get: function get() {
          return {
            type: "button-group",
            subtype: "advanced-inline-button-group",
            buttons: [this.underlineButton, this.strikethroughButton],
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
          return _objectSpread(
            {},
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "linkButton",
              this
            ),
            {
              label: this.t.linkButton,
            }
          );
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
          return _objectSpread(
            {},
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "cutButton",
              this
            ),
            {
              label: this.t.cutButton,
            }
          );
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
          return _objectSpread(
            {},
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "copyButton",
              this
            ),
            {
              label: this.t.copyButton,
            }
          );
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
          return _objectSpread(
            {},
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "pasteButton",
              this
            ),
            {
              label: this.t.pasteButton,
            }
          );
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
          return _objectSpread(
            {},
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "subscriptButton",
              this
            ),
            {
              label: this.t.subscriptButton,
            }
          );
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
          return _objectSpread(
            {},
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "superscriptButton",
              this
            ),
            {
              label: this.t.superscriptButton,
            }
          );
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
          return _objectSpread(
            {},
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "symbolButton",
              this
            ),
            {
              label: this.t.symbolButton,
            }
          );
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
          return _objectSpread(
            {},
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "emojiButton",
              this
            ),
            {
              label: this.t.emojiButton,
            }
          );
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
          return _objectSpread(
            {},
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "imageButton",
              this
            ),
            {
              label: this.t.imageButton,
            }
          );
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
          return _objectSpread(
            {},
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "orderedListButton",
              this
            ),
            {
              label: this.t.orderedListButton,
            }
          );
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
          return _objectSpread(
            {},
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "unorderedListButton",
              this
            ),
            {
              label: this.t.unorderedListButton,
            }
          );
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
          return _objectSpread(
            {},
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "blockquoteButton",
              this
            ),
            {
              label: this.t.blockquoteButton,
            }
          );
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
          return _objectSpread(
            {},
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "indentButton",
              this
            ),
            {
              label: this.t.indentButton,
            }
          );
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
          return _objectSpread(
            {},
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "outdentButton",
              this
            ),
            {
              label: this.t.outdentButton,
            }
          );
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
          return _objectSpread(
            {},
            _get(
              _getPrototypeOf(HaxTextEditorToolbar.prototype),
              "sourceButton",
              this
            )
          );
        },
      },
      {
        key: "haxInsertButtonGroup",
        get: function get() {
          return {
            type: "button-group",
            subtype: "hax-insert-button-group",
            blocks: [this.symbolButton, this.emojiButton],
          };
        },
      },
      {
        key: "iconButton",
        get: function get() {
          return {};
        },
      },
      {
        key: "defaultConfig",
        get: function get() {
          return [
            this.basicInlineButtonGroup,
            this.linkButtonGroup,
            this.listIndentButtonGroup,
            this.haxInsertButtonGroup,
            this.scriptButtonGroup,
            this.advancedInlineButtonGroup,
          ];
        },
      },
      {
        key: "filteredBlocks",
        get: function get() {
          var _this4 = this;

          return this.formatBlocks.filter(function (block) {
            if (!block.tag) return;
            var tag = block.tag || "",
              wrapper =
                !!_this4.slotSchema &&
                !!_this4.slotSchema.slotWrapper &&
                !!_this4.slotSchema.slotWrapper
                  ? _this4.slotSchema.slotWrapper
                  : undefined,
              allowed =
                !!_this4.slotSchema &&
                !!_this4.slotSchema.slotWrapper &&
                !!_this4.slotSchema.allowedSlotWrappers
                  ? _this4.slotSchema.allowedSlotWrappers
                  : undefined,
              excluded =
                !!_this4.slotSchema &&
                !!_this4.slotSchema.slotWrapper &&
                !!_this4.slotSchema.excludedSlotWrappers
                  ? _this4.slotSchema.excludedSlotWrappers
                  : undefined,
              allowAny = !_this4.slotSchema || (!wrapper && !allowed),
              allowOnly =
                (!!wrapper && wrapper === tag) ||
                (!!allowed && allowed.includes(tag)),
              allowExcept = !!excluded && excluded.includes(tag),
              show = !allowExcept && (allowAny || allowOnly);
            return show;
          });
        },
      },
    ]);

    return HaxTextEditorToolbar;
  })(
    (0, _richTextEditorToolbar.RichTextEditorToolbarBehaviors)(
      (0, _I18NMixin.I18NMixin)(
        (0, _haxContextBehaviors.HaxContextBehaviors)(_litElement.LitElement)
      )
    )
  );

exports.HaxTextEditorToolbar = HaxTextEditorToolbar;
customElements.define("hax-text-editor-toolbar", HaxTextEditorToolbar);
