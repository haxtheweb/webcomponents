"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.EditableTableEditToolbar = void 0;

var _litElement = require("lit-element/lit-element.js");

var _richTextEditorToolbar = require("@lrnwebcomponents/rich-text-editor/lib/toolbars/rich-text-editor-toolbar.js");

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

/**
 * `editable-table-edit-toolbar`
 * An editor interface for tables that toggles between view mode.
 */
var EditableTableEditToolbar =
  /*#__PURE__*/
  (function (_RichTextEditorToolba) {
    _inherits(EditableTableEditToolbar, _RichTextEditorToolba);

    _createClass(
      EditableTableEditToolbar,
      [
        {
          key: "render",
          // render function for template
          value: function render() {
            return _get(
              _getPrototypeOf(EditableTableEditToolbar.prototype),
              "render",
              this
            ).call(this);
          }, // properties available to the custom element for data binding
        },
        {
          key: "defaultConfig",
          get: function get() {
            return [
              {
                type: "button-group",
                buttons: [this.closeButton],
              },
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
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "editable-table-edit-toolbar";
          },
        },
        {
          key: "styles",
          get: function get() {
            return [].concat(
              _toConsumableArray(
                _get(
                  _getPrototypeOf(EditableTableEditToolbar),
                  "baseStyles",
                  this
                )
              ),
              _toConsumableArray(
                _get(
                  _getPrototypeOf(EditableTableEditToolbar),
                  "stickyStyles",
                  this
                )
              )
            );
          },
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(
                _getPrototypeOf(EditableTableEditToolbar),
                "properties",
                this
              )
            );
          },
        },
      ]
    );

    function EditableTableEditToolbar() {
      var _this;

      _classCallCheck(this, EditableTableEditToolbar);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(EditableTableEditToolbar).call(this)
      );
      _this.config = _this.defaultConfig;
      console.log(_this.config, _this.defaultConfig);
      return _this;
    }

    _createClass(EditableTableEditToolbar, [
      {
        key: "updated",
        value: function updated(changedProperties) {
          console.log(this.config);
          if (
            _get(
              _getPrototypeOf(EditableTableEditToolbar.prototype),
              "updated",
              this
            )
          )
            _get(
              _getPrototypeOf(EditableTableEditToolbar.prototype),
              "updated",
              this
            ).call(this, changedProperties);
          console.log(this.config);
        },
      },
      {
        key: "firstUpdated",
        value: function firstUpdated(changedProperties) {
          console.log(this.config);
          if (
            _get(
              _getPrototypeOf(EditableTableEditToolbar.prototype),
              "firstUpdated",
              this
            )
          )
            _get(
              _getPrototypeOf(EditableTableEditToolbar.prototype),
              "firstUpdated",
              this
            ).call(this, changedProperties);
          console.log(this.config);
        },
      },
    ]);

    return EditableTableEditToolbar;
  })(
    (0, _richTextEditorToolbar.RichTextEditorToolbarBehaviors)(
      _litElement.LitElement
    )
  );

exports.EditableTableEditToolbar = EditableTableEditToolbar;
window.customElements.define(
  EditableTableEditToolbar.tag,
  EditableTableEditToolbar
);
