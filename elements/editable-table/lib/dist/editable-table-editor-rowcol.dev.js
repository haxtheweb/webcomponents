"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.EditableTableEditorRowcol = void 0;

var _litElement = require("lit-element/lit-element.js");

var _editableTableBehaviors = require("./editable-table-behaviors.js");

var _a11yMenuButton = require("@lrnwebcomponents/a11y-menu-button/a11y-menu-button.js");

require("@lrnwebcomponents/a11y-menu-button/lib/a11y-menu-button-item.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icons.js");

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

function _templateObject4() {
  var data = _taggedTemplateLiteral([
    '\n        :host {\n          display: block;\n          height: 100%;\n          width: 100%;\n          --paper-item-min-height: 24px;\n          --a11y-menu-button-border: none;\n          --a11y-menu-button-list-border: 1px solid\n            var(--editable-table-border-color, #999);\n          --a11y-menu-button-vertical-padding: var(\n            --editable-table-cell-vertical-padding,\n            10px\n          );\n          --a11y-menu-button-horizontal-padding: var(\n            --editable-table-cell-horizontal-padding,\n            6px\n          );\n          --a11y-menu-button-item-focus-bg-color: var(\n            --editable-table-heading-bg-color,\n            #e8e8e8\n          );\n          --a11y-menu-button-list-bg-color: var(\n            --editable-table-bg-color,\n            #fff\n          );\n        }\n        a11y-menu-button {\n          display: block;\n          height: 100%;\n          width: 100%;\n        }\n        a11y-menu-button::part(button) {\n          height: 100%;\n          width: 100%;\n        }\n        a11y-menu-button::part(menu-outer) {\n          min-width: 150px;\n        }\n        a11y-menu-button-item {\n          font-family: var(\n            --editable-table-secondary-font-family,\n            "Roboto",\n            "Noto",\n            sans-serif\n          );\n          color: var(--editable-table-color, #222);\n          font-size: var(--editable-table-secondary-font-size, 12px);\n          line-height: 150%;\n        }\n      ',
  ]);

  _templateObject4 = function _templateObject4() {
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

function _templateObject3() {
  var data = _taggedTemplateLiteral(['<span class="sr-only">', "</span>"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '<a11y-menu-button-item\n      @click="',
    '"\n    >\n      ',
    "\n      ",
    "",
    "\n      ",
    "\n    </a11y-menu-button-item>",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n      <a11y-menu-button\n        id="menubutton" \n        position="',
    '"\n        @open="',
    '">\n        <span class="sr-only" slot="button">',
    '</span>\n        <span id="label" slot="button">',
    ' </span>\n        <span class="sr-only" slot="button">Menu</span>\n        <simple-icon-lite icon="arrow-drop-down" slot="button"></simple-icon-lite>\n          ',
    " \n          ",
    "\n          ",
    "\n        </ul>\n      </a11y-menu-button>\n    ",
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

/**
 * `editable-table-editor-rowcol`
 * A header label and menu for inserting and deleting a row or a column of editable-table interface (editable-table.html).
 *
 * @demo ./demo/editor.html
 * @customElement
 * @extends cellBehaviors
 * @extends A11yMenuButton
 */
var EditableTableEditorRowcol =
  /*#__PURE__*/
  (function (_cellBehaviors) {
    _inherits(EditableTableEditorRowcol, _cellBehaviors);

    function EditableTableEditorRowcol() {
      _classCallCheck(this, EditableTableEditorRowcol);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(EditableTableEditorRowcol).apply(this, arguments)
      );
    }

    _createClass(
      EditableTableEditorRowcol,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              this.row ? "right" : "bottom",
              this._onOpen,
              this.type,
              this.label || "",
              this._getItem(),
              this._getItem(false, true),
              this._getItem(true)
            );
          },
        },
        {
          key: "rowColAction",

          /**
           * Fires when  selection is made from menu button
           * @event delete-rowcol
           * @param {number} index index to perform action
           * @param {boolean} whether action is to insert
           */
          value: function rowColAction() {
            var index =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : this.index;
            var insert =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : true;
            this.dispatchEvent(
              new CustomEvent("rowcol-action", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: {
                  insert: insert,
                  row: this.row,
                  index: index,
                },
              })
            );
          },
        },
        {
          key: "_getItem",
          value: function _getItem() {
            var deleteItem =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : false;
            var after =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : false;
            return (0, _litElement.html)(
              _templateObject2(),
              deleteItem
                ? this._onDelete
                : after
                ? this._onInsertAfter
                : this._onInsertBefore,
              deleteItem ? "Delete" : "Insert",
              this.type,
              deleteItem ? " " : after ? " After " : " Before ",
              this.labelInfo
            );
          },
        },
        {
          key: "_onOpen",
          value: function _onOpen(e) {
            this.dispatchEvent(
              new CustomEvent("rowcol-menuopen", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: {
                  insert: insert,
                  row: this.row,
                  index: index,
                },
              })
            );
          },
          /**
           * Handles when Delete Row/Column is clicked
           * @param {event} e button event
           */
        },
        {
          key: "_onDelete",
          value: function _onDelete(e) {
            this.rowColAction(this.index, false);
          },
          /**
           * Handles when Insert Row/Column is clicked
           * @param {event} e button event
           */
        },
        {
          key: "_onInsertBefore",
          value: function _onInsertBefore(e) {
            this.rowColAction(this.row ? this.index - 1 : this.index);
          },
          /**
           * Handles when Insert Row/Column After is clicked
           * @param {event} e button event
           */
        },
        {
          key: "_onInsertAfter",
          value: function _onInsertAfter(e) {
            this.rowColAction(this.row ? this.index : this.index + 1);
          },
        },
        {
          key: "controls",

          /**
           *
           * Gets first cell that menu controls
           * @readonly
           * @memberof EditableTableEditorRowcol
           */
          get: function get() {
            return this.row
              ? "cell-0-".concat(this.index)
              : "cell-".concat(this.index, "-0");
          },
          /**
           *
           * Gets row or column label based on type
           * @readonly
           * @memberof EditableTableEditorRowcol
           */
        },
        {
          key: "label",
          get: function get() {
            return this.row
              ? this._getLabel(this.index, true)
              : this._getLabel(this.index, false);
          },
          /**
           *
           * get cell label
           * @readonly
           * @memberof EditableTableEditorRowcol
           */
        },
        {
          key: "labelInfo",
          get: function get() {
            return (0, _litElement.html)(_templateObject3(), this.label);
          },
          /**
           *
           * Gets row or column type
           * @readonly
           * @memberof EditableTableEditorRowcol
           */
        },
        {
          key: "type",
          get: function get() {
            return this.row ? "Row" : "Column";
          },
        },
      ],
      [
        {
          key: "styles",
          get: function get() {
            return [].concat(
              _toConsumableArray(
                _get(
                  _getPrototypeOf(EditableTableEditorRowcol),
                  "styles",
                  this
                ) || []
              ),
              _toConsumableArray(
                _editableTableBehaviors.editableTableCellStyles
              ),
              [(0, _litElement.css)(_templateObject4())]
            );
          },
        },
        {
          key: "tag",
          get: function get() {
            return "editable-table-editor-rowcol";
          },
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(
                _getPrototypeOf(EditableTableEditorRowcol),
                "properties",
                this
              ),
              {
                /**
                 * Index of row or column
                 */
                index: {
                  type: Number,
                },

                /**
                 * Whether menu button controls a row
                 */
                row: {
                  type: Boolean,
                },
              }
            );
          },
        },
      ]
    );

    return EditableTableEditorRowcol;
  })(
    (0, _editableTableBehaviors.cellBehaviors)(_a11yMenuButton.A11yMenuButton)
  );

exports.EditableTableEditorRowcol = EditableTableEditorRowcol;
window.customElements.define(
  EditableTableEditorRowcol.tag,
  EditableTableEditorRowcol
);
