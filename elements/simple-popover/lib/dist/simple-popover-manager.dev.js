"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimplePopoverManager = void 0;

var _litElement = require("lit");

require("../simple-popover.js");

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
    '\n        simple-popover {\n          font-family: var(--simple-tour-font-family, unset);\n          font-size: var(--simple-tour-font-size, 14px);\n          max-width: var(--simple-popover-manager-max-width, 200px);\n          min-width: var(--simple-popover-manager-min-width, 200px);\n          display: flex;\n          --simple-popover-padding: 0;\n          --simple-icon-button-border: 1px solid\n            var(--simple-tour-border-color, #ddd);\n          --simple-icon-button-border-radius: 3px;\n        }\n        simple-popover[hidden] {\n          display: none !important;\n        }\n        .heading {\n          font-size: var(--simple-tour-titlebar-font-size, 14px);\n          flex: 0 0 auto;\n          background-color: var(\n            --simple-tour-titlebar-background-color,\n            #f0f4f8\n          );\n          border-bottom: 1px solid var(--simple-tour-border-color, #ddd);\n          line-height: 130%;\n          padding: var(--simple-tour-padding-sm, 2px)\n            var(--simple-tour-padding-sm, 2px)\n            var(--simple-tour-padding-sm, 2px)\n            var(--simple-tour-padding-lg, 10px);\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          position: sticky;\n          top: 0;\n        }\n        .body {\n          flex: 1 1 auto;\n          padding: var(--simple-tour-padding-sm, 2px)\n            var(--simple-tour-padding-lg, 10px);\n          background-color: var(--simple-tour-background-color, #fff);\n        }\n        .nav {\n          flex: 0 0 auto;\n          margin: 0;\n          padding: 0;\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          position: sticky;\n          bottom: 0;\n          background-color: var(--simple-tour-background-color, #fff);\n        }\n        ::slotted(.title) {\n          font-size: var(--simple-tour-titlebar-font-size, 14px);\n          margin: 0 calc(2 * var(--simple-tour-padding-sm, 2px)) 0 0;\n          line-height: 100%;\n        }\n        ::slotted(.subheading) {\n          font-size: var(--simple-tour-subheading-font-size, 16px);\n        }\n        ::slotted([slot="body"]) {\n          margin: var(--simple-tour-padding-sm, 2px) 0;\n        }\n        ::slotted(simple-icon-button-lite) {\n          flex: 1 1 auto;\n          background-color: var(--simple-tour-background-color, #fff);\n        }\n        ::slotted(simple-icon-button-lite[slot="heading"]) {\n          flex: 0 0 auto;\n        }\n        ::slotted(simple-icon-button-lite:focus-within),\n        ::slotted(simple-icon-button-lite:hover) {\n          --simple-icon-button-border: 1px solid #000;\n        }\n      ',
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n      <simple-popover\n        auto\n        part="simple-popover"\n        ?hidden="',
    '"\n        position="',
    '"\n      >\n        <div class="heading" part="simple-popover-heading">\n          <slot name="heading"></slot>\n        </div>\n        <div class="body" part="simple-popover-body">\n          <slot name="body"></slot>\n        </div>\n        <div class="nav" part="simple-popover-nav">\n          <slot name="nav"></slot>\n        </div>\n      </simple-popover>\n    ',
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

var SimplePopoverManager =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(SimplePopoverManager, _LitElement);

    function SimplePopoverManager() {
      var _this;

      _classCallCheck(this, SimplePopoverManager);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimplePopoverManager).call(this)
      );
      _this.popover = null;
      _this.opened = false;
      _this.context = null;
      _this.orientation = "tb";
      _this.position = "bottom";
      _this.__ignore = false;
      return _this;
    }

    _createClass(
      SimplePopoverManager,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              !this.opened,
              this.position
            );
          },
        },
        {
          key: "updated",
          value: function updated(changedProperties) {
            var _this2 = this;

            changedProperties.forEach(function (oldValue, propName) {
              // ensure that changes get reflected in the direction it should point
              // or state of open. This avoids minor timing issues when element
              // being pointed to requests changes to direction / state
              if (["opened", "position", "orientation"].includes(propName)) {
                clearTimeout(_this2.timer);
                _this2.timer = setTimeout(function () {
                  _this2.popover.updatePosition();
                }, 0);
              }
            });
          },
          /**
           * set target and optionally change content and open state
           */
        },
        {
          key: "setPopover",
          value: function setPopover(context, el) {
            var _this3 = this;

            var opened =
              arguments.length > 2 && arguments[2] !== undefined
                ? arguments[2]
                : null;
            var orientation =
              arguments.length > 3 && arguments[3] !== undefined
                ? arguments[3]
                : "tb";
            var mode = arguments.length > 4 ? arguments[4] : undefined;

            // this has the potential to cause 1 popover to change content and parent
            // in the same action. This would cause a open state change in 1 element
            // which would trigger a global state change to match.
            // The ignore flag implies we are actively switching an operation and thus
            // need to ignore the follow up change record, much like a debounce
            if (this.__ignore) {
              this.__ignore = false;
              setTimeout(function () {
                _this3.popover.updatePosition();
              }, 100);
            } else {
              if (el !== this.popover.target) {
                // helps manage state if multiple things leveraging this
                // yet having their own internal opened status
                if (
                  this.context &&
                  this.context.managerReset &&
                  context !== this.context
                ) {
                  this.context.managerReset();
                  this.__ignore = true;
                }

                this.context = context;
                this.setAttribute("mode", mode || "");
                this.popover.target = null;
                this.popover.target = el;
              }

              var position;
              var menu = el.getBoundingClientRect(); // top - bottom or left - right pointer orientation
              // Highly polarized detection of 50% in any direction
              // forces the pointer in the opposite direction

              if (orientation == "tb") {
                if (menu.y > window.innerHeight / 2) {
                  position = "top";
                } else {
                  position = "bottom";
                }
              } else {
                if (menu.x > window.innerWidth / 2) {
                  position = "left";
                } else {
                  position = "right";
                }
              } // see if we need to reposition

              this.orientation = orientation;
              this.position = position; // only open / close if told to change

              if (opened != null) {
                this.opened = opened;
              }
            }
          },
        },
        {
          key: "firstUpdated",
          value: function firstUpdated() {
            this.popover = this.shadowRoot.querySelector("simple-popover");
          },
        },
      ],
      [
        {
          key: "styles",
          get: function get() {
            return [(0, _litElement.css)(_templateObject2())];
          },
        },
        {
          key: "properties",
          get: function get() {
            return {
              position: {
                type: String,
              },
              opened: {
                type: Boolean,
              },
              orientation: {
                type: String,
              },
            };
          },
        },
      ]
    );

    return SimplePopoverManager;
  })(_litElement.LitElement);

exports.SimplePopoverManager = SimplePopoverManager;
customElements.define("simple-popover-manager", SimplePopoverManager);
// register globally so we can make sure there is only one
window.SimplePopoverManager = window.SimplePopoverManager || {}; // request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal

window.SimplePopoverManager.requestAvailability = function () {
  if (!window.SimplePopoverManager.instance) {
    window.SimplePopoverManager.instance = document.createElement(
      "simple-popover-manager"
    );
    document.body.appendChild(window.SimplePopoverManager.instance);
  }

  return window.SimplePopoverManager.instance;
}; // self append

window.SimplePopoverManager.requestAvailability();
