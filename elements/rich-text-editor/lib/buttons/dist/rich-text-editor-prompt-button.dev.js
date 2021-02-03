"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.RichTextEditorPromptButtonBehaviors = exports.RichTextEditorPromptButton = void 0;

var _litElement = require("lit-element/lit-element.js");

var _richTextEditorButton = require("./rich-text-editor-button.js");

require("@lrnwebcomponents/rich-text-editor/lib/singletons/rich-text-editor-selection.js");

require("@lrnwebcomponents/rich-text-editor/lib/singletons/rich-text-editor-prompt.js");

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

var RichTextEditorPromptButtonBehaviors = function RichTextEditorPromptButtonBehaviors(
  SuperClass
) {
  return (
    /*#__PURE__*/
    (function (_RichTextEditorButton) {
      _inherits(_class, _RichTextEditorButton);

      _createClass(
        _class,
        [
          {
            key: "render",
            // render function for template
            value: function render() {
              return _get(
                _getPrototypeOf(_class.prototype),
                "render",
                this
              ).call(this);
            }, // properties available to custom element for data binding
          },
        ],
        [
          {
            key: "tag",

            /**
             * Store tag name to make it easier to obtain directly.
             */
            get: function get() {
              return "rich-text-editor-prompt-button";
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
                   * fields for prompt popover.
                   */
                  fields: {
                    type: Array,
                  },

                  /**
                   * is element a custom inline widget element?
                   */
                  id: {
                    name: "id",
                    type: String,
                    reflect: true,
                    attribute: "id",
                  },

                  /**
                   * prefilled value of prompt
                   */
                  value: {
                    type: Object,
                  },

                  /**
                   * prompt that pops up when button is pressed
                   */
                  prompt: {
                    name: "prompt",
                    type: Object,
                  },

                  /**
                   * contents node inside selected range
                   */
                  __wrap: {
                    name: "__wrap",
                    type: Object,
                  },

                  /**
                   * contents node inside selected range
                   */
                  __oldValue: {
                    name: "__oldValue",
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
        _this.editableSelection = false;
        _this.fields = [
          {
            property: "innerHTML",
            title: "Text",
            inputMethod: "textfield",
          },
        ];
        _this.tagsList = "span";
        _this.value = {
          innerHTML: undefined,
        };
        _this.prompt = window.RichTextEditorPrompt.requestAvailability();
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
          },
          /**
           * determines which command based on values passed from prompt
           * (can be overriden for custom prompt  commands)
           *
           * @readonly
           */
        },
        {
          key: "tagClickCallback",

          /**
           * override this custom function to perform a
           * custom operation when an element that matches the tags list is clicked
           *
           * @param {event} e click event
           */
          value: function tagClickCallback(e) {
            if (e.detail) {
              this.highlightNode(e.detail);
              this.selectedNode = e.detail;
              this.open(e.detail);
            }
          },
          /**
           * override to add function to cancelled prompt
           */
        },
        {
          key: "cancel",
          value: function cancel() {
            this.close();
          },
        },
        {
          key: "close",
          value: function close() {
            this.dispatchEvent(
              new CustomEvent("rich-text-editor-prompt-closed", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: this,
              })
            );
          },
          /**
           * updates insertion based on fields
           */
        },
        {
          key: "confirm",
          value: function confirm(val) {
            this.close();
            this.value = val;
            this.update();
            this.setToggled();
            this.promptCommandVal;
            this.updateSelection();
          },
          /**
           * expands selection to include this.tags
           *
           */
        },
        {
          key: "expandSelection",
          value: function expandSelection() {
            var element = this.rangeQuery();

            if (!!element) {
              this.highlightNode(element);
              this.selectedNode = element;
            }
          },
          /**
           * if selection is a node, gets node innerHTML
           *
           * @returns {string}
           */
        },
        {
          key: "getInnerHTML",
          value: function getInnerHTML() {
            var target =
                this.range && this.range.cloneContents
                  ? this.range.cloneContents()
                  : undefined,
              root = this.rangeElement() ? this.rangeElement() : undefined,
              temp,
              html;

            if (this.rangeIsElement()) {
              html = root ? root.innerHTML : undefined;
            } else {
              temp = document.createElement("span");
              if (target) temp.appendChild(target);
              html = temp.innerHTML;
              temp.remove();
            }

            return html;
          },
          /**
           * gets a field value (and trims it if it's a string)
           *
           * @param {string} prop field name
           * @returns {*}
           * @memberof RichTextEditorPrompt
           */
        },
        {
          key: "getPropValue",
          value: function getPropValue(prop) {
            var val = !!this.value ? this.value : false,
              rawVal =
                !val || !val[prop]
                  ? false
                  : val[prop].trim
                  ? val[prop].trim()
                  : val[prop];
            return rawVal && rawVal !== "" ? rawVal : false;
          },
          /**
           * gets value for prompt based on current selection
           * (can be overriden for custom prompt field values)
           */
        },
        {
          key: "getValue",
          value: function getValue(node) {
            return {
              innerHTML: this.getInnerHTML() || "",
            };
          },
          /**
           * Handles selecting text and opening prompt
           */
        },
        {
          key: "open",
          value: function open(node) {
            node || this.expandSelection();
            this.value = this.getValue(node);
            this.highlight();
            this.dispatchEvent(
              new CustomEvent("rich-text-editor-prompt-open", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: this,
              })
            );
          },
          /**
           * sets inner HTML of selection
           *
           * @param {string} html
           */
        },
        {
          key: "setInnerHTML",
          value: function setInnerHTML(html) {
            var target = this.rangeElement();

            if (target && this.rangeIsElement()) {
              target.innerHTML = html;
            } else if (this.range) {
              this.sendCommand("insertHtml", html);
            }
          },
          /**
           * updates toggled based on values passed from prompt
           * (can be overriden for custom toggled state)
           */
        },
        {
          key: "setToggled",
          value: function setToggled() {
            this.toggled = !this.value;
          },
          /**
           * updates selection based on values passed from prompt
           */
        },
        {
          key: "updateSelection",
          value: function updateSelection() {
            var range = this.range.cloneRange();

            var rangeInfo = function rangeInfo(range) {
              var contents = !range ? undefined : range.cloneContents(),
                ancestor = !range ? undefined : range.commonAncestorContainer,
                innerHTML = !contents ? undefined : contents.textContent,
                child = !contents ? undefined : contents.firstElementChild;
              return {
                range: range,
                ancestor: ancestor,
                child: child,
                innerHTML: innerHTML,
              };
            };

            console.log(
              this.promptCommand,
              this.promptCommandVal,
              rangeInfo(this.range),
              rangeInfo(range)
            );
            this.sendCommand(this.promptCommand, this.promptCommandVal);
            console.log(
              this.promptCommand,
              this.promptCommandVal,
              rangeInfo(this.range),
              rangeInfo(range)
            ); //this.selectRange(range);

            console.log(
              this.promptCommand,
              this.promptCommandVal,
              rangeInfo(this.range),
              rangeInfo(range)
            ); //if (this.setsInnerHTML) this.setInnerHTML(this.getPropValue("innerHTML"));

            console.log(
              this.promptCommand,
              this.promptCommandVal,
              rangeInfo(this.range),
              rangeInfo(range)
            );
          },
          /**
           * Handles button tap
           * @param {event} e button tap event
           */
        },
        {
          key: "_handleClick",
          value: function _handleClick(e) {
            e.preventDefault();
            this.open();
          },
          /**
           * Handles range change
           * @param {event} e button tap event
           */
        },
        {
          key: "_rangeChanged",
          value: function _rangeChanged(newVal, oldVal) {
            this.value = this.getValue();
            this.setToggled();
          },
        },
        {
          key: "promptCommand",
          get: function get() {
            return this.toggledCommand && !this.toggled
              ? this.toggledCommand
              : this.command;
          },
          /**
           * determines commandVal based on values passed from prompt
           * (can be overriden for custom prompt command values)
           */
        },
        {
          key: "promptCommandVal",
          get: function get() {
            return this.commandVal;
          },
          /**
           * determines if prompt also sets innerHTML of range
           * (can be overriden for custom prompts)
           */
        },
        {
          key: "setsInnerHTML",
          get: function get() {
            var innerHTML = (this.fields || []).filter(function (field) {
              return field.property === "innerHTML";
            });
            return innerHTML && innerHTML.length > 0;
          },
        },
      ]);

      return _class;
    })((0, _richTextEditorButton.RichTextEditorButtonBehaviors)(SuperClass))
  );
};
/**
 * `rich-text-editor-prompt-button`
 * a button that prompts for more information for rich text editor (custom buttons can extend this)
 *
 * @element rich-text-editor-prompt-button
 * @demo ./demo/buttons.html
 */

exports.RichTextEditorPromptButtonBehaviors = RichTextEditorPromptButtonBehaviors;

var RichTextEditorPromptButton =
  /*#__PURE__*/
  (function (_RichTextEditorPrompt) {
    _inherits(RichTextEditorPromptButton, _RichTextEditorPrompt);

    function RichTextEditorPromptButton() {
      _classCallCheck(this, RichTextEditorPromptButton);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(RichTextEditorPromptButton).apply(this, arguments)
      );
    }

    return RichTextEditorPromptButton;
  })(RichTextEditorPromptButtonBehaviors(_litElement.LitElement));

exports.RichTextEditorPromptButton = RichTextEditorPromptButton;
window.customElements.define(
  RichTextEditorPromptButton.tag,
  RichTextEditorPromptButton
);
