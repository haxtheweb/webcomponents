"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.RichTextStyles = exports.RichTextEditorButtonBehaviors = exports.RichTextEditorButton = void 0;

var _litElement = require("lit-element/lit-element.js");

var _simpleToolbarButton = require("@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-button.js");

require("@lrnwebcomponents/rich-text-editor/lib/singletons/rich-text-editor-selection.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icons.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js");

require("@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js");

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

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n    :host {\n      --simple-toolbar-border-color: #ddd;\n      --simple-toolbar-border-width: 1px;\n      --simple-toolbar-button-opacity: 1;\n      --simple-toolbar-button-color: #444;\n      --simple-toolbar-button-bg: #ffffff;\n      --simple-toolbar-button-border-color: transparent;\n      --simple-toolbar-button-toggled-opacity: 1;\n      --simple-toolbar-button-toggled-color: #222;\n      --simple-toolbar-button-toggled-bg: #ddd;\n      --simple-toolbar-button-toggled-border-color: transparent;\n      --simple-toolbar-button-hover-opacity: 1;\n      --simple-toolbar-button-hover-color: #000;\n      --simple-toolbar-button-hover-bg: #f0f0f0;\n      --simple-toolbar-button-hover-border-color: unset;\n      --simple-toolbar-button-disabled-opacity: 1;\n      --simple-toolbar-button-disabled-color: #666;\n      --simple-toolbar-button-disabled-bg: transparent;\n      --simple-toolbar-button-disabled-border-color: transparent;\n    }\n  ",
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

var RichTextStyles = [(0, _litElement.css)(_templateObject())];
exports.RichTextStyles = RichTextStyles;

var RichTextEditorButtonBehaviors = function RichTextEditorButtonBehaviors(
  SuperClass
) {
  return (
    /*#__PURE__*/
    (function (_SimpleToolbarButtonB) {
      _inherits(_class, _SimpleToolbarButtonB);

      _createClass(
        _class,
        [
          {
            key: "render",
            value: function render() {
              return _get(
                _getPrototypeOf(_class.prototype),
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
              return "rich-text-editor-button";
            },
          },
          {
            key: "styles",
            get: function get() {
              return [].concat(
                _toConsumableArray(
                  _get(_getPrototypeOf(_class), "styles", this)
                ),
                RichTextStyles
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
                   * Optional callback function, ex: (toolbar,editor,selection) => {}.
                   */
                  commandCallback: {
                    type: Object,
                    attribute: "callback",
                  },

                  /**
                   * The command used for document.execCommand.
                   */
                  command: {
                    type: String,
                    reflect: true,
                    attribute: "command",
                  },

                  /**
                   * Optional parameter for the command.
                   */
                  commandVal: {
                    attribute: "command-val",
                    type: Object,
                  },

                  /**
                   * The active selected range, inherited from the toolbar
                   */
                  range: {
                    type: Object,
                  },

                  /**
                   * tags edited by this button
                   */
                  tagsList: {
                    type: String,
                  },

                  /**
                   * The active selected range, inherited from the toolbar
                   */
                  target: {
                    type: Object,
                  },

                  /**
                   * The command used for document.execCommand when toggled.
                   */
                  toggledCommand: {
                    attribute: "toggled-command",
                    type: String,
                    reflect: true,
                  },

                  /**
                   * Optional parameter for the command when toggled.
                   */
                  toggledCommandVal: {
                    attribute: "toggled-command-val",
                    type: Object,
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
                   * highlight surrounding selected range
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
        _this.__selection = window.RichTextEditorSelection.requestAvailability();
        _this.tagsList = "";

        _this.commandCallback = function (toolbar, editor, selection) {
          console.log(_assertThisInitialized(_this));
        };

        return _this;
      }
      /**
       * whether button is toggled
       *
       * @readonly
       * @memberof RichTextEditorButton
       */

      _createClass(_class, [
        {
          key: "firstUpdated",
          value: function firstUpdated(changedProperties) {
            if (_get(_getPrototypeOf(_class.prototype), "firstUpdated", this)) {
              _get(
                _getPrototypeOf(_class.prototype),
                "firstUpdated",
                this
              ).call(this, changedProperties);
            }
            /*this.__a11y = this.shadowRoot.querySelector("#button");
          this.__a11y.addEventListener("keypress", (e) => {
            switch (e.key) {
              case "Enter":
                this._handleClick(e);
                break;
            }
          });*/
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
              if (propName === "controls")
                _this2._editorChanged(_this2.controls, oldValue);
              if (propName === "range")
                _this2._rangeChanged(_this2.range, oldValue);
            });
          },
          /**
           * life cycle, element is detatched
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
          },
          /**
           * indicates how highlight should be toggled
           * @event highlight
           * @param {boolean} [on=true] whether to turn highlight on
           */
        },
        {
          key: "highlight",
          value: function highlight() {
            var on =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : true;
            this.dispatchEvent(
              new CustomEvent("highlight", {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: on,
              })
            );
          },
          /**
           * indicates node that should be highlighted
           * @event highlightnode
           * @param {object} node
           */
        },
        {
          key: "highlightNode",
          value: function highlightNode(node) {
            this.dispatchEvent(
              new CustomEvent("highlightnode", {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: node,
              })
            );
          },
          /**
           * indicates range to be set
           * @event selectrange
           * @param {object} range
           */
        },
        {
          key: "selectRange",
          value: function selectRange(range) {
            this.dispatchEvent(
              new CustomEvent("selectrange", {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: range,
              })
            );
          },
          /**
           * indicates range should be a given node
           * @event selectnode
           * @param {object} node
           */
        },
        {
          key: "selectNode",
          value: function selectNode(node) {
            this.dispatchEvent(
              new CustomEvent("selectnode", {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: node,
              })
            );
          },
          /**
           * indicates range should be the contents of a given node
           * @event selectnodeccontents
           * @param {object} node
           */
        },
        {
          key: "selectNodeContents",
          value: function selectNodeContents(node) {
            this.dispatchEvent(
              new CustomEvent("selectnodeccontents", {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: node,
              })
            );
          },
          /**
           * indicates range should be wrapped in given element
           * @event wrapselection
           * @param {object} element html element
           */
        },
        {
          key: "wrapSelection",
          value: function wrapSelection(element) {
            this.dispatchEvent(
              new CustomEvent("wrapselection", {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: element,
              })
            );
          },
          /**
           * gets node where range starts
           *
           * @returns node
           */
        },
        {
          key: "startNode",
          value: function startNode() {
            var startContainer = !this.range
                ? undefined
                : this.range.startContainer,
              startOffset = !this.range ? undefined : this.range.startOffset;
            return !startContainer
              ? undefined
              : startContainer.children
              ? startContainer.children[startOffset - 1]
              : startContainer.childNodes
              ? startContainer.childNodes[startOffset - 1]
              : undefined;
          },
          /**
           * gets closest element to range
           *
           * @returns node
           */
        },
        {
          key: "rangeElement",
          value: function rangeElement() {
            return this.rangeIsElement()
              ? this.startNode()
              : this.rangeParent();
          },
          /**
           * determines if selection is a element node
           *
           * @returns node
           */
        },
        {
          key: "rangeIsElement",
          value: function rangeIsElement() {
            var startContainer = !this.range
                ? undefined
                : this.range.startContainer,
              startOffset = !this.range ? undefined : this.range.startOffset,
              endContainer = !this.range ? undefined : this.range.endContainer,
              endOffset = !this.range ? undefined : this.range.endOffset;
            return (
              startContainer === endContainer && endOffset - startOffset === 1
            );
          },
          /**
           * gets parent element of range
           *
           * @returns node
           */
        },
        {
          key: "rangeParent",
          value: function rangeParent() {
            var common = !this.range
              ? undefined
              : this.range.commonAncestorContainer;
            return !common
              ? undefined
              : common.nodeType == 1
              ? common
              : common.parentElement;
          },
          /**
           * gets closest node to range that matches selectors
           *
           * @param {string} [selectors=this.tagsList || this.tag]
           * @returns node
           */
        },
        {
          key: "rangeQuery",
          value: function rangeQuery() {
            var selectors =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : this.tagsList;
            selectors = selectors.toLowerCase().replace(/\s*/g, "");
            var start = this.rangeElement(),
              startTag =
                !start || !start.tagName
                  ? undefined
                  : start.tagName.toLowerCase(),
              tags = selectors.split(",");
            return !start
              ? undefined
              : startTag && tags.includes(startTag)
              ? start
              : start.closest(selectors);
          },
          /**
           * sends a command to the selection manager
           *
           * @param {string} [command=this.operationCommand]
           * @param {string} [commandVal=this.operationCommandVal]
           * @param {object} [range=this.range]
           */
        },
        {
          key: "sendCommand",
          value: function sendCommand() {
            var command =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : this.operationCommand;
            var commandVal =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : this.operationCommandVal;
            var range =
              arguments.length > 2 && arguments[2] !== undefined
                ? arguments[2]
                : this.range;
            this.dispatchEvent(
              new CustomEvent("command", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: {
                  command: command,
                  commandVal: commandVal,
                  range: range,
                  button: this,
                },
              })
            );
          },
          /**
           * expands range to selection's parent block
           */
        },
        {
          key: "setRange",
          value: function setRange() {
            /* if command is formatBlock expand selection to entire block */
            var block = this.rangeQuery();
            if (block) this.selectNode(block);
          },
          /**
           * Handles button tap
           */
        },
        {
          key: "_handleClick",
          value: function _handleClick(e) {
            if (this.command == "bold") console.log("click", this, this.range);
            e.preventDefault();
            this.sendCommand();
          },
          /**
           * handles range change
           *
           * @param {string} newVal new editor id
           * @param {string} oldVal old editor id
           */
        },
        {
          key: "_editorChanged",
          value: function _editorChanged(newValue, oldValue) {},
          /**
           * gets appplicable selection
           * @returns {object}
           */
        },
        {
          key: "_getSelection",
          value: function _getSelection() {
            return this.command === "formatBlock"
              ? this.rangeQuery()
              : this._getSelectedHtml();
          },
          /**
           * gets selected html
           * @returns {string}
           */
        },
        {
          key: "_getSelectedHtml",
          value: function _getSelectedHtml() {
            if (this.range) {
              var div = document.createElement("div"),
                contents = this.range.cloneContents(),
                val;
              div.appendChild(contents);
              val = div.innerHTML;
              div.remove();
              return val ? val.trim() : undefined;
            }

            return undefined;
          },
          /**
           * get selection's parent block
           *
           * @returns
           */
        },
        {
          key: "_getSelectedTag",
          value: function _getSelectedTag() {
            var block = this.rangeQuery(),
              tag =
                !!block && !!block.tagName
                  ? block.tagName.toLowerCase()
                  : false;
            return tag;
          },
          /**
           * gets appplicable selection
           * @returns {object}
           */
        },
        {
          key: "_getSelectionType",
          value: function _getSelectionType() {
            return this.command === "formatBlock"
              ? this._getSelectedTag()
              : this._getSelectedHtml();
          },
          /**
         * Handles keys the same way a button is handled
         * @param {event} e the  event
         * /
        _handleKeys(e) {
          e.preventDefault();
          this._handleClick(e);
        }
         /**
         * handles range change
         *
         * @param {object} newVal new range
         * @param {object} oldVal old range
         */
        },
        {
          key: "_rangeChanged",
          value: function _rangeChanged(newVal, oldVal) {
            if (this.command == "bold")
              console.log("_rangeChanged", this, newVal, oldVal);
          },
        },
        {
          key: "isToggled",
          get: function get() {
            var command =
                !!this.range && !!this.command
                  ? document.queryCommandState(this.command)
                  : false,
              /* workaround because queryCommandState("underline") returns true on links */
              block =
                this.command === "underline" ? !!this.rangeQuery("u") : command;
            return this.toggles && !!block ? true : false;
          },
          /**
           * gets command param for document.execCommand
           * @readonly
           */
        },
        {
          key: "operationCommand",
          get: function get() {
            return this.isToggled && !!this.toggledCommand
              ? this.toggledCommand
              : this.command;
          },
          /**
           * gets value param for document.execCommand
           * @readonly
           */
        },
        {
          key: "operationCommandVal",
          get: function get() {
            return this.isToggled && !!this.toggledCommand
              ? this.toggledCommandVal || ""
              : this.commandVal;
          },
        },
        {
          key: "tagsArray",
          get: function get() {
            return (this.tagsList || "")
              .replace(/\s*/g, "")
              .toLowerCase()
              .split(",");
          },
        },
      ]);

      return _class;
    })((0, _simpleToolbarButton.SimpleToolbarButtonBehaviors)(SuperClass))
  );
};
/**
 * `rich-text-editor-button`
 * a button for rich text editor (custom buttons can extend this)
 *
 * @element rich-text-editor-button
 * @demo ./demo/buttons.html
 */

exports.RichTextEditorButtonBehaviors = RichTextEditorButtonBehaviors;

var RichTextEditorButton =
  /*#__PURE__*/
  (function (_RichTextEditorButton) {
    _inherits(RichTextEditorButton, _RichTextEditorButton);

    function RichTextEditorButton() {
      _classCallCheck(this, RichTextEditorButton);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(RichTextEditorButton).apply(this, arguments)
      );
    }

    return RichTextEditorButton;
  })(RichTextEditorButtonBehaviors(_litElement.LitElement));

exports.RichTextEditorButton = RichTextEditorButton;
window.customElements.define(RichTextEditorButton.tag, RichTextEditorButton);
