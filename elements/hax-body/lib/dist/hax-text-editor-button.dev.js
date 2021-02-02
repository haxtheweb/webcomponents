"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxTextEditorButton = void 0;

var _litElement = require("lit-element/lit-element.js");

var _richTextEditorPromptButton = require("@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-prompt-button.js");

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

/**
 * `hax-text-editor-button`
 * @element hax-text-editor-button
 * `a custom-element button for hax text editor (custom buttons can extend this)`
 *
 */
var HaxTextEditorButton =
  /*#__PURE__*/
  (function (_RichTextEditorPrompt) {
    _inherits(HaxTextEditorButton, _RichTextEditorPrompt);

    _createClass(HaxTextEditorButton, null, [
      {
        key: "tag",

        /**
         * Store the tag name to make it easier to obtain directly.
         * @notice function name must be here for tooling to operate correctly
         */
        get: function get() {
          return "hax-text-editor-button";
        }, // properties available to the custom element for data binding
      },
      {
        key: "properties",
        get: function get() {
          return _objectSpread(
            {},
            _get(_getPrototypeOf(HaxTextEditorButton), "properties", this),
            {
              element: {
                type: Object,
              },
            }
          );
        },
      },
    ]);

    function HaxTextEditorButton() {
      var _this;

      _classCallCheck(this, HaxTextEditorButton);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxTextEditorButton).call(this)
      );
      _this.tag = HaxTextEditorButton.tag;
      _this.toggles = true;
      _this.value = {};
      _this.command = "insertHTML";
      return _this;
    }

    _createClass(HaxTextEditorButton, [
      {
        key: "updated",
        value: function updated(changedProperties) {
          var _this2 = this;

          _get(
            _getPrototypeOf(HaxTextEditorButton.prototype),
            "updated",
            this
          ).call(this, changedProperties);

          changedProperties.forEach(function (oldValue, propName) {
            if (propName === "element" && _this2.element)
              _this2.updateElement();
          });
        },
      },
      {
        key: "updateElement",
        value: function updateElement() {
          var el = this.element || {},
            settings = el.settings || {},
            gizmo = el.gizmo || {};
          this.fields = [].concat(
            _toConsumableArray(
              _get(
                _getPrototypeOf(HaxTextEditorButton.prototype),
                "fields",
                this
              )
            ),
            _toConsumableArray(
              (settings.configure || [])
                .map(function (f) {
                  if (f.inputMethod === "code-editor")
                    f.inputMethod = "textfield";
                  return f;
                })
                .filter(function (f) {
                  return f.slot !== "";
                })
            )
          );
          this.tagsList = gizmo.tag || "span";
          this.icon = gizmo.icon || "add";
          this.label = gizmo.title || "Add ".concat(gizmo.tag);
          this.updateButton();
        },
        /**
         * determines commandVal based on values passed from prompt
         */
      },
      {
        key: "getValue",

        /**
         * updates prompt fields with selected range data
         */
        value: function getValue(node) {
          var el = node || this.rangeElement(),
            val = _get(
              _getPrototypeOf(HaxTextEditorButton.prototype),
              "getValue",
              this
            ).call(this);

          if (el) {
            this.fields.forEach(function (field) {
              if (field.property && field.property !== "innerHTML")
                val[field.property] = el[field.property];

              if (field.slot && field.slot !== "") {
                var slot = el.querySelector("[slot=".concat(field.slot, "]"));
                val[field.slot] = !slot ? undefined : slot.innerHTML;
              }
            });
          }

          return !el ? undefined : val;
        },
      },
      {
        key: "setToggled",
        value: function setToggled() {
          this.toggled = !!this.value;
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
          var _this3 = this;

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
          var node = document.createElement(this.tagsList);
          this.fields.forEach(function (field) {
            if (!!field.property)
              node[field.property] = _this3.value[field.property];
            node.innerHTML = _this3.value.innerHTML;

            if (!!field.slot && field.slot !== "") {
              var div = document.createElement("div");
              div.slot = field.slot;
              div.innerHTML = _this3.value[field.slot];
              node.append(div);
            }
          });

          if (!!this.selectedNode) {
            //make sure old inline widgets are clear
            this.selectedNode.remove();
          } else {
            //empties inline text nodes
            _get(
              _getPrototypeOf(HaxTextEditorButton.prototype),
              "sendCommand",
              this
            ).call(this, command, "", range);
          } //inserts new updated widget

          range.insertNode(node);
        },
      },
      {
        key: "promptCommandVal",
        get: function get() {
          return this.value;
        },
      },
    ]);

    return HaxTextEditorButton;
  })(
    (0, _richTextEditorPromptButton.RichTextEditorPromptButtonBehaviors)(
      _litElement.LitElement
    )
  );

exports.HaxTextEditorButton = HaxTextEditorButton;
window.customElements.define(HaxTextEditorButton.tag, HaxTextEditorButton);
