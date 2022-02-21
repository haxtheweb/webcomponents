"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.RichTextToolbarStyles =
  exports.RichTextStyles =
  exports.RichTextEditorButtonBehaviors =
  exports.RichTextEditorButton =
    void 0;

var _litElement = require("lit");

var _simpleToolbarButton = require("@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-button.js");

var _richTextEditorRangeBehaviors = require("@lrnwebcomponents/rich-text-editor/lib/singletons/rich-text-editor-range-behaviors.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icons.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js");

require("@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js");

var _simpleToolbar = require("@lrnwebcomponents/simple-toolbar/simple-toolbar");

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

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n    :host {\n      --simple-toolbar-border-color: var(--rich-text-editor-border-color, #ddd);\n      --simple-toolbar-border-width: var(--rich-text-editor-border-width, 1px);\n      --simple-toolbar-button-opacity: var(\n        --rich-text-editor-button-opacity,\n        1\n      );\n      --simple-toolbar-button-color: var(--rich-text-editor-button-color, #444);\n      --simple-toolbar-button-bg: var(--rich-text-editor-button-bg, #ffffff);\n      --simple-toolbar-button-border-color: var(\n        --rich-text-editor-button-border-color,\n        transparent\n      );\n      --simple-toolbar-button-toggled-opacity: var(\n        --rich-text-editor-button-toggled-opacity,\n        1\n      );\n      --simple-toolbar-button-toggled-color: var(\n        --rich-text-editor-button-toggled-color,\n        #222\n      );\n      --simple-toolbar-button-toggled-bg: var(\n        --rich-text-editor-button-toggled-bg,\n        #ddd\n      );\n      --simple-toolbar-button-toggled-border-color: var(\n        --rich-text-editor-button-toggled-border-color,\n        transparent\n      );\n      --simple-toolbar-button-hover-opacity: var(\n        --rich-text-editor-button-hover-opacity,\n        1\n      );\n      --simple-toolbar-button-hover-color: var(\n        --rich-text-editor-button-hover-color,\n        #000\n      );\n      --simple-toolbar-button-hover-bg: var(\n        --rich-text-editor-button-hover-bg,\n        #f0f0f0\n      );\n      --simple-toolbar-button-hover-border-color: var(\n        --rich-text-editor-button-hover-border-color,\n        unset\n      );\n      --simple-toolbar-button-disabled-opacity: var(\n        --rich-text-editor-button-disabled-opacity,\n        1\n      );\n      --simple-toolbar-button-disabled-color: var(\n        --rich-text-editor-button-disabled-color,\n        #666\n      );\n      --simple-toolbar-button-disabled-bg: var(\n        --rich-text-editor-button-disabled-bg,\n        transparent\n      );\n      --simple-toolbar-button-disabled-border-color: var(\n        --rich-text-editor-button-disabled-border-color,\n        transparent\n      );\n    }\n    button[part="button"] {\n      border-radius: var(--rich-text-editor-button-disabled-border-radius, 0px);\n    }\n  ',
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n    :host {\n      --simple-toolbar-border-color: var(--rich-text-editor-border-color, #ddd);\n      --simple-toolbar-border-width: var(--rich-text-editor-border-width, 1px);\n      --simple-toolbar-button-bg: var(--rich-text-editor-bg, #ffffff);\n      --simple-fields-focus-color: var(--rich-text-editor-focus-color, blue);\n      --simple-fields-invalid-color: var(--rich-text-editor-error-color, #800);\n    }\n  ",
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

/**
 * RichTextStyles
 *
 * @lit-html
 * @lit-element
 * @const
 * @default
 * @type {array}
 */
var RichTextStyles = [(0, _litElement.css)(_templateObject())];
/**
 * RichTextStyles
 *
 * @lit-html
 * @lit-element
 * @const
 * @default
 * @type {array}
 * @extends RichTextStyles
 */

exports.RichTextStyles = RichTextStyles;
var RichTextToolbarStyles = [].concat(RichTextStyles, [
  (0, _litElement.css)(_templateObject2()),
]);
/**
 * RichTextEditorButtonBehaviors
 *
 * @extends SimpleToolbarButtonBehaviors
 * @customElement
 * @class
 * @lit-html
 * @lit-element
 */

exports.RichTextToolbarStyles = RichTextToolbarStyles;

var RichTextEditorButtonBehaviors = function RichTextEditorButtonBehaviors(
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
                _toConsumableArray(RichTextToolbarStyles)
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
                   * Hide the null option
                   */
                  disabled: {
                    type: Boolean,
                    reflect: true,
                    attribute: "disabled",
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
        _this.tagsList = "";
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
              if (
                ["shortcutKeys", "tagsList", "tagClickCallback"].includes(
                  propName
                )
              )
                _this2.updateButtonRegistry();
            });
            if (this.tag === "rich-text-editor-heading-picker")
              console.log("disabled", this, this.disabled);
          },
          /**
           * Called every time the element is inserted into the DOM. Useful for
           * running setup code, such as fetching resources or rendering.
           * Generally, you should try to delay work until this time.
           */
        },
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            _get(
              _getPrototypeOf(_class.prototype),
              "connectedCallback",
              this
            ).call(this);
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
           * override this custom function to perform a
           * custom operation after button is clicked
           *
           * @param {object} editor current editor
           * @param {object} toolbar parent toolbar
           * @param {object} selection range/selection manager
           */
        },
        {
          key: "commandCallback",
          value: function commandCallback(editor, toolbar, selection) {},
          /**
           * override this custom function to perform a
           * custom operation when an element that matches the tags list is clicked
           *
           * @param {event} e click event
           */
        },
        {
          key: "tagClickCallback",
          value: function tagClickCallback(e) {},
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
           * sends a command to the selection manager
           *
           * @param {object} event
           */
        },
        {
          key: "sendCommand",
          value: function sendCommand(event) {
            this._handleCommand(
              this.operationCommand,
              this.operationCommandVal,
              this.range
            ); // optional callback so that custom buttons can perform
            // custom toolbar and/or editor opperations

            if (this.commandCallback)
              this.commandCallback(this.target, this.__toolbar, this);
            this.dispatchEvent(
              new CustomEvent("command", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: {
                  command: this.operationCommand,
                  commandVal: this.operationCommandVal,
                  range: this.range,
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
            if (!this.tagsList || this.tagsList === "") return;
            /* if command is formatBlock expand selection to entire block */

            var block = this.rangeOrMatchingAncestor();
            if (block) this.selectNode(block);
          },
          /**
           * Handles button tap
           */
        },
        {
          key: "_handleClick",
          value: function _handleClick(e) {
            e.preventDefault();
            this.sendCommand(e);
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
              ? this.rangeOrMatchingAncestor()
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
            var block = this.rangeOrMatchingAncestor(),
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
           * handles range change
           *
           * @param {object} newVal new range
           * @param {object} oldVal old range
           */
        },
        {
          key: "_rangeChanged",
          value: function _rangeChanged(newVal, oldVal) {},
        },
        {
          key: "isToggled",
          get: function get() {
            return this.commandIsToggled;
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
          /**
           * tagslist as an array
           *
           * @readonly
           */
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
    })(
      (0, _richTextEditorRangeBehaviors.RichTextEditorRangeBehaviors)(
        (0, _simpleToolbarButton.SimpleToolbarButtonBehaviors)(SuperClass)
      )
    )
  );
};
/**
 * `rich-text-editor-button`
 * is a basic button for rich text editor (custom buttons can extend RichTextEditorButtonBehaviors)
 * 
 * ### Styling
`<rich-text-editor-button>` uses RichTextToolbarStyles constant to set 
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
 * 
 * @extends RichTextEditorButtonBehaviors
 * @customElement
 * @lit-html
 * @lit-element
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
