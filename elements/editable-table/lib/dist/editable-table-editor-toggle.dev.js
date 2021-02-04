"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.EditableTableEditorToggle = void 0;

var _litElement = require("lit-element/lit-element.js");

require("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");

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

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n        :host([hidden]) {\n          display: none;\n        }\n        button {\n          padding: 2px;\n          margin: 0;\n          width: 100%;\n          min-width: unset;\n          display: inline-flex;\n          justify-content: space-between;\n          align-items: center;\n          align-content: stretch;\n          text-transform: unset;\n          font-family: var(\n            --editable-table-secondary-font-family,\n            "Roboto",\n            "Noto",\n            sans-serif\n          );\n          background-color: var(\n            --editable-table-button-bg-color,\n            var(--editable-table-bg-color, #fff)\n          );\n          color: var(--editable-table-border-color, #999);\n          border: none;\n          border-radius: 0;\n        }\n        :host([toggled]) button {\n          background-color: var(--editable-table-button-toggled-bg-color);\n          color: var(\n            --editable-table-button-toggled-color,\n            var(--editable-table-color, #222)\n          );\n        }\n        :host(:not([disabled])) button:focus,\n        :host(:not([disabled])) button:hover {\n          background-color: var(\n            --editable-table-button-hover-bg-color,\n            var(--editable-table-heading-bg-color, #e8e8e8)\n          );\n          color: var(\n            --editable-table-button-hover-color,\n            var(--editable-table-border-color, #999)\n          );\n          cursor: pointer;\n        }\n        :host([toggled]:not([disabled])) button:focus,\n        :host([toggled]:not([disabled])) button:hover {\n          background-color: var(\n            --editable-table-button-toggled-hover-bg-color,\n            var(--editable-table-heading-bg-color, #e8e8e8)\n          );\n          color: var(\n            --editable-table-button-toggled-hover-color,\n            var(--editable-table-heading-color)\n          );\n          cursor: pointer;\n        }\n        :host([disabled]) button {\n          background-color: var(\n            --editable-table-button-disabled-bg-color,\n            var(--editable-table-bg-color, #fff)\n          );\n          color: var(--editable-table-button-disabled-color);\n          cursor: not-allowed;\n        }\n        button > div {\n          flex-grow: 1;\n        }\n        .sr-only {\n          position: absolute;\n          left: -9999px;\n          font-size: 0;\n          height: 0;\n          width: 0;\n          overflow: hidden;\n        }\n        #filter-off {\n          opacity: 0.25;\n        }\n      ',
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
    '\n      <button\n        id="button"\n        ?active="',
    '"\n        ?disabled="',
    '"\n        label="',
    '"\n        toggles\n        @click="',
    '"\n      >\n        <span class="sr-only">',
    '</span>\n        <simple-icon-lite\n          icon="',
    '"\n          aria-hidden="true"\n        ></simple-icon-lite>\n      </button>\n      <simple-tooltip id="tooltip" for="button" aria-hidden="true"\n        >',
    "</simple-tooltip\n      >\n    ",
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
 * `editable-table-editor-toggle`
 * A toggle button for an property in editable-table interface (editable-table.html).
 *
 * @demo ./demo/editor.html
 * @customElement
 * @extends LitElement
 */
var EditableTableEditorToggle =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(EditableTableEditorToggle, _LitElement);

    function EditableTableEditorToggle() {
      _classCallCheck(this, EditableTableEditorToggle);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(EditableTableEditorToggle).apply(this, arguments)
      );
    }

    _createClass(
      EditableTableEditorToggle,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              this.toggled,
              this.disabled,
              this.label,
              this._onClick,
              this.label,
              this.icon,
              this.label
            );
          },
        },
        {
          key: "_onClick",

          /**
           * Fires when button is clicked
           * @event change
           */
          value: function _onClick() {
            this.toggled = !this.toggled;
            this.dispatchEvent(
              new CustomEvent("change", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: this,
              })
            );
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
                  _getPrototypeOf(EditableTableEditorToggle),
                  "styles",
                  this
                ) || []
              ),
              [(0, _litElement.css)(_templateObject2())]
            );
          },
        },
        {
          key: "tag",
          get: function get() {
            return "editable-table-editor-toggle";
          },
        },
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * Whether toggle is disabled
               */
              disabled: {
                attribute: "disabled",
                type: Boolean,
                value: false,
                reflect: true,
              },

              /**
               * Table id for accessibility
               */
              controls: {
                attribute: "controls",
                type: String,
                value: "table",
                readOnly: true,
                reflect: true,
              },

              /**
               * Button id that matches table property to toggle
               */
              id: {
                attribute: "id",
                type: String,
                value: null,
              },

              /**
               * Button icon
               */
              icon: {
                type: String,
                value: null,
              },

              /**
               * Button label
               */
              label: {
                type: String,
                value: null,
              },

              /**
               * Whether button is toggled
               */
              toggled: {
                attribute: "toggled",
                type: Boolean,
                value: false,
                reflect: true,
              },
            };
          },
        },
      ]
    );

    return EditableTableEditorToggle;
  })(_litElement.LitElement);

exports.EditableTableEditorToggle = EditableTableEditorToggle;
window.customElements.define(
  EditableTableEditorToggle.tag,
  EditableTableEditorToggle
);
