"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.A11yMenuButtonItemBehaviors = exports.A11yMenuButtonItem = void 0;

var _litElement = require("lit");

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

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '\n        <li role="none">\n          <button\n            role="menuitem"\n            controls="',
    '"\n            ?disabled="',
    '"\n            part="button"\n          >\n            <slot></slot>\n          </button>\n        </li>\n      ',
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    ' <li role="none">\n        <a role="menuitem" href="',
    '" ?disabled="',
    '"\n            part="button">\n          <slot></slot>\n        </a>\n      </li>',
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n          :host {\n            margin: 0;\n            padding: 0;\n            display: block;\n          }\n          :host([hidden]) {\n            display: none;\n          }\n          *[role="menuitem"][disabled] {\n            cursor: not-allowed;\n          }\n\n          *[role="menuitem"],\n          *[role="menuitem"]:visited {\n            display: block;\n            margin: 0;\n            border-radius: 0;\n            font-family: inherit;\n            font-size: inherit;\n            text-decoration: var(--a11y-menu-button-item-text-decoration, none);\n            color: var(\n              --a11y-menu-button-item-color,\n              var(--a11y-menu-button-color, currentColor)\n            );\n            width: calc(\n              100% - 2 *\n                var(\n                  --a11y-menu-button-item-horizontal-padding,\n                  var(--a11y-menu-button-horizontal-padding, 5px)\n                )\n            );\n            text-align: var(--a11y-menu-button-item-text-align, left);\n            padding: var(\n                --a11y-menu-button-item-vertical-padding,\n                var(--a11y-menu-button-vertical-padding, 0)\n              )\n              var(\n                --a11y-menu-button-item-horizontal-padding,\n                var(--a11y-menu-button-horizontal-padding, 5px)\n              );\n            background-color: var(\n              --a11y-menu-button-item-bg-color,\n              var(--a11y-menu-button-bg-color, white)\n            );\n            border-left: var(--a11y-menu-button-item-border-left, none);\n            border-right: var(--a11y-menu-button-item-border-right, none);\n            border-top: var(--a11y-menu-button-item-border-top, none);\n            border-bottom: var(--a11y-menu-button-item-border-bottom, none);\n            border: var(--a11y-menu-button-item-border, none);\n            transition: all 0.25s ease-in-out;\n          }\n          button[role="menuitem"],\n          button[role="menuitem"]:visited {\n            width: 100%;\n          }\n\n          :host(:focus-within) *[role="button"],\n          *[role="menuitem"]:focus,\n          *[role="menuitem"]:hover {\n            text-decoration: var(\n              --a11y-menu-button-item-focus-text-decoration,\n              none\n            );\n            color: var(--a11y-menu-button-item-focus-color, currentColor);\n            background-color: var(\n              --a11y-menu-button-item-focus-bg-color,\n              #e0e0ff\n            );\n            border-left: var(--a11y-menu-button-item-focus-border-left, unset);\n            border-right: var(\n              --a11y-menu-button-item-focus-border-right,\n              unset\n            );\n            border-top: var(--a11y-menu-button-item-focus-border-top, unset);\n            border-bottom: var(\n              --a11y-menu-button-item-focus-border-bottom,\n              unset\n            );\n            border: var(--a11y-menu-button-item-focus-border, unset);\n          }\n        ',
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

var A11yMenuButtonItemBehaviors = function A11yMenuButtonItemBehaviors(
  SuperClass
) {
  return (
    /*#__PURE__*/
    (function (_SuperClass) {
      _inherits(_class, _SuperClass);

      _createClass(
        _class,
        [
          {
            key: "render",
            value: function render() {
              return this.href && this.href.trim() !== ""
                ? this.linkTemplate
                : this.buttonTemplate;
            },
          },
        ],
        [
          {
            key: "styles",
            get: function get() {
              return [(0, _litElement.css)(_templateObject())];
            },
          },
          {
            key: "tag",
            get: function get() {
              return "a11y-menu-button-item";
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
                },

                /**
                 * Whether toggle is disabled
                 */
                hidden: {
                  attribute: "hidden",
                  type: Boolean,
                  reflect: true,
                },

                /**
                 * Whether toggle is disabled
                 */
                href: {
                  attribute: "href",
                  type: String,
                },

                /**
                 * Whether toggle is disabled
                 */
                controls: {
                  attribute: "controls",
                  type: String,
                },
                slot: {
                  type: String,
                  attribute: "menuitem",
                  reflect: true,
                },
              };
            },
          },
        ]
      );

      function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(
          this,
          _getPrototypeOf(_class).call(this)
        );
      }
      /**
       * renders item as a link
       *
       * @readonly
       */

      _createClass(_class, [
        {
          key: "focus",

          /**
           * allows link or button to get focus
           *
           * @memberof A11yMenuButtonItem
           */
          value: function focus() {
            if (
              this.shadowRoot &&
              this.shadowRoot.querySelector("[role=menuitem]")
            )
              this.shadowRoot.querySelector("[role=menuitem]").focus();
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
            /**
             * Fires when menu item is added to dom
             * @event add-a11y-menu-button-item
             */

            this.dispatchEvent(
              new CustomEvent("add-a11y-menu-button-item", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: this,
              })
            );
          },
        },
        {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            _get(
              _getPrototypeOf(_class.prototype),
              "disconnectedCallback",
              this
            ).call(this);
            /**
             * Fires when menu item is removed from dom
             * @event remove-a11y-menu-button-item
             */

            this.dispatchEvent(
              new CustomEvent("remove-a11y-menu-button-item", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: this,
              })
            );
          },
        },
        {
          key: "linkTemplate",
          get: function get() {
            return (0, _litElement.html)(
              _templateObject2(),
              this.href,
              this.disabled
            );
          },
          /**
           * renders item as a button
           *
           * @readonly
           */
        },
        {
          key: "buttonTemplate",
          get: function get() {
            return (0, _litElement.html)(
              _templateObject3(),
              this.controls,
              this.disabled
            );
          },
        },
      ]);

      return _class;
    })(SuperClass)
  );
};
/**
 * a11y-menu-button-item
 * A toggle button for an property in editable-table interface (editable-table.html).
 *
### Styling

`<a11y-menu-button-item>` provides custom properties for styling:

Custom property | Description | Default
----------------|-------------|----------
--a11y-menu-button-item-text-decoration | button or link text decoration | none
--a11y-menu-button-item-color | button or link text color | --a11y-menu-button-color
--a11y-menu-button-item-text-align | button or link text alignment | left
--a11y-menu-button-item-vertical-padding | button or link vertical padding | --a11y-menu-button-vertical-padding
--a11y-menu-button-item-horizontal-padding | button or link horizontal padding | --a11y-menu-button-horizontal-padding
--a11y-menu-button-item-bg-color | button or link background color | --a11y-menu-button-bg-color
--a11y-menu-button-item-border | default button or link border  | none
--a11y-menu-button-item-border-left | overrides button or link left border  | none
--a11y-menu-button-item-border-right | overrides button or link right border | none
--a11y-menu-button-item-border-top | overrides button or link top border | none
--a11y-menu-button-item-border-bottom | overrides button or link bottom border | none
--a11y-menu-button-item-focus-text-decoration | button or link text decoration when focused | none
--a11y-menu-button-item-focus-color | button or link text color when focused | black
--a11y-menu-button-item-focus-bg-color | button or link background color when focused | #e0e0ff
--a11y-menu-button-item-focus-border-left | overrides button or link left border when focused | unset
--a11y-menu-button-item-focus-border-right | overrides button or link left border when focused | unset)
--a11y-menu-button-item-focus-border-top | overrides button or link left border when focused | unset
--a11y-menu-button-item-focus-border-bottom | overrides button or link left border when focused | unset
--a11y-menu-button-item-focus-border | button or link border when focused | unset
 *
 * @demo ./demo/index.html
 * @element a11y-menu-button-item
 * @extends A11yMenuButtonItemBehaviors
 */

exports.A11yMenuButtonItemBehaviors = A11yMenuButtonItemBehaviors;

var A11yMenuButtonItem =
  /*#__PURE__*/
  (function (_A11yMenuButtonItemBe) {
    _inherits(A11yMenuButtonItem, _A11yMenuButtonItemBe);

    function A11yMenuButtonItem() {
      _classCallCheck(this, A11yMenuButtonItem);

      return _possibleConstructorReturn(
        this,
        _getPrototypeOf(A11yMenuButtonItem).apply(this, arguments)
      );
    }

    return A11yMenuButtonItem;
  })(A11yMenuButtonItemBehaviors(_litElement.LitElement));

exports.A11yMenuButtonItem = A11yMenuButtonItem;
window.customElements.define(A11yMenuButtonItem.tag, A11yMenuButtonItem);
