"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleModalStore = exports.SimpleModalCssVars = exports.SimpleModal = void 0;

var _litElement = require("lit-element/lit-element.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icons.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js");

require("web-dialog/index.js");

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
    '\n        :host {\n          display: block;\n        }\n\n        :host([hidden]) {\n          display: none;\n        }\n\n        :host web-dialog ::slotted(*) {\n          font-size: 14px;\n        }\n\n        #titlebar {\n          margin-top: 0;\n          padding: var(--simple-modal-titlebar-padding, 0px 16px);\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          color: var(--simple-modal-titlebar-color, #444);\n          background-color: var(--simple-modal-titlebar-background, #ddd);\n          border-radius: 0;\n          height: var(--simple-modal-titlebar-height, unset);\n          line-height: var(--simple-modal-titlebar-line-height, unset);\n        }\n\n        #headerbar {\n          margin: 0;\n          padding: var(--simple-modal-header-padding, 0px 16px);\n          color: var(--simple-modal-header-color, #222);\n          background-color: var(--simple-modal-header-background, #ccc);\n        }\n\n        h2 {\n          margin-right: 8px;\n          padding: 0;\n          margin: 0;\n          flex: auto;\n          font-size: 18px;\n          line-height: 18px;\n        }\n\n        #close {\n          top: 0;\n          border: var(--simple-modal-titlebar-button-border, none);\n          padding: var(--simple-modal-titlebar-button-padding, 10px 0);\n          min-width: unset;\n          text-transform: none;\n          color: var(--simple-modal-titlebar-color, #444);\n          background-color: transparent;\n        }\n\n        #close:focus {\n          opacity: 0.7;\n          outline: var(--simple-modal-titlebar-button-outline, 2px dotted grey);\n          outline-offset: var(\n            --simple-modal-titlebar-button-outline-offset,\n            2px\n          );\n        }\n\n        #close simple-icon-lite {\n          --simple-icon-height: var(--simple-modal-titlebar-icon-height, 16px);\n          --simple-icon-width: var(--simple-modal-titlebar-icon-width, 16px);\n          color: var(--simple-modal-titlebar-color, #444);\n        }\n\n        #simple-modal-content {\n          flex-grow: 1;\n          padding: var(--simple-modal-content-padding, 8px 16px);\n          margin: 0;\n          color: var(--simple-modal-content-container-color, #222);\n          background-color: var(\n            --simple-modal-content-container-background,\n            #fff\n          );\n        }\n\n        .buttons {\n          padding: 0;\n          padding: var(--simple-modal-buttons-padding, 0);\n          margin: 0;\n          color: var(--simple-modal-buttons-color, blue);\n          background-color: var(--simple-modal-buttons-background, #fff);\n        }\n\n        .buttons ::slotted(*) {\n          padding: 0;\n          margin: 0;\n          color: var(--simple-modal-button-color, --simple-modal-buttons-color);\n          background-color: var(\n            --simple-modal-button-background,\n            --simple-modal-buttons-background\n          );\n        }\n        web-dialog {\n          --dialog-border-radius: var(--simple-modal-border-radius, 2px);\n          z-index: var(--simple-modal-z-index, 1) !important;\n          padding: 0;\n        }\n        web-dialog::part(dialog) {\n          border: 1px solid var(--simple-modal-border-color, #222);\n          min-height: var(--simple-modal-min-height, unset);\n          min-width: var(--simple-modal-min-width, unset);\n          z-index: var(--simple-modal-z-index, 1000);\n          resize: var(--simple-modal-resize, unset);\n          padding: 0;\n          --dialog-height: var(--simple-modal-height, auto);\n          --dialog-width: var(--simple-modal-width, 75vw);\n          --dialog-max-width: var(--simple-modal-max-width, 100vw);\n          --dialog-max-height: var(--simple-modal-max-height, 100vh);\n        }\n        web-dialog.style-scope.simple-modal {\n          display: none !important;\n        }\n        web-dialog[open].style-scope.simple-modal {\n          display: flex !important;\n          position: fixed !important;\n          margin: auto;\n        }\n        :host([resize="none"]) web-dialog[open].style-scope.simple-modal,\n        :host([resize="horizontal"]) web-dialog[open].style-scope.simple-modal {\n          top: calc(50% - var(--simple-modal-height, auto) / 2);\n        }\n        :host([resize="none"]) web-dialog[open].style-scope.simple-modal,\n        :host([resize="vertical"]) web-dialog[open].style-scope.simple-modal {\n          left: calc(50% - var(--simple-modal-width, 75vw) / 2);\n        }\n      ',
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '<web-dialog\n      id="dialog"\n      center\n      role="dialog"\n      aria-describedby="simple-modal-content"\n      aria-label="',
    '"\n      aria-labelledby="',
    '"\n      aria-modal="true"\n      .mode="',
    '"\n      ?open="',
    '"\n      @open="',
    '"\n      @close="',
    '"\n    >\n      <div id="titlebar">\n        <h2 id="simple-modal-title" ?hidden="',
    '">',
    '</h2>\n        <div></div>\n        <simple-icon-button-lite\n          id="close"\n          dark\n          icon="',
    '"\n          @click="',
    '"\n          label="',
    '"\n        >\n        </simple-icon-button-lite>\n      </div>\n      <div id="headerbar"><slot name="header"></slot></div>\n      <div id="simple-modal-content">\n        <slot name="content"></slot>\n      </div>\n      <slot name="custom"></slot>\n      <div class="buttons">\n        <slot name="buttons"></slot>\n      </div>\n    </web-dialog>',
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

var SimpleModalCssVars = [
  "--simple-modal-resize",
  "--simple-modal-width",
  "--simple-modal-z-index",
  "--simple-modal-height",
  "--simple-modal-min-width",
  "--simple-modal-min-height",
  "--simple-modal-max-width",
  "--simple-modal-max-height",
  "--simple-modal-titlebar-color",
  "--simple-modal-titlebar-height",
  "--simple-modal-titlebar-line-height",
  "--simple-modal-titlebar-background",
  "--simple-modal-titlebar-padding",
  "--simple-modal-header-color",
  "--simple-modal-header-background",
  "--simple-modal-header-padding",
  "--simple-modal-content-container-color",
  "--simple-modal-content-container-background",
  "--simple-modal-content-padding",
  "--simple-modal-buttons-color",
  "--simple-modal-buttons-background",
  "--simple-modal-buttons-padding",
  "--simple-modal-button-color",
  "--simple-modal-button-background",
];
/**
 * `simple-modal`
 * `A simple modal that ensures accessibility and stack order context appropriately`
 * CSS Variables: ```
 * 
 * 
--simple-modal-resize: unset;
--simple-modal-titlebar-color: #444;
--simple-modal-titlebar-background: #ddd;
--simple-modal-titlebar-padding: 0px 16px;
--simple-modal-titlebar-height: unset;
--simple-modal-titlebar-line-height: unset;
--simple-modal-header-color: #222;
--simple-modal-header-background: #ccc;
--simple-modal-header-padding: 0px 16px;
--simple-modal-content-container-color: #222;
--simple-modal-content-container-background: #fff;
--simple-modal-content-padding: 8px 16px;
--simple-modal-buttons-color: unset;
--simple-modal-buttons-background: unset;
--simple-modal-buttons-padding: 0;
--simple-modal-button-color: var(--simple-modal-buttons-color);
--simple-modal-button-background: var(--simple-modal-buttons-background-color);
--simple-modal-z-index: 1000;
--simple-modal-width: 75vw;
--simple-modal-height: auto;
--simple-modal-min-width: unset;
--simple-modal-min-height: unset;
--simple-modal-max-width: unset;
--simple-modal-max-height: unset;
```
 * @demo ./demo/index.html demo
 * @demo ./demo/css.html styling simple-modal via CSS
 * @demo ./demo/details.html styling simple-modal via event details
 * @demo ./demo/template.html using simple-modal-template
 * @element simple-modal
 */

exports.SimpleModalCssVars = SimpleModalCssVars;

var SimpleModal =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(SimpleModal, _LitElement);

    _createClass(
      SimpleModal,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              this._getAriaLabel(this.title),
              this._getAriaLabelledby(this.title),
              this.mode,
              this.opened,
              this.open,
              this.close,
              !this.title,
              this.title,
              this.closeIcon,
              this.close,
              this.closeLabel
            );
          }, // properties available to the custom element for data binding
        },
      ],
      [
        {
          key: "styles",
          //styles function
          get: function get() {
            return [(0, _litElement.css)(_templateObject2())];
          },
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(_getPrototypeOf(SimpleModal), "properties", this),
              {
                /**
                 * heading / label of the modal
                 */
                title: {
                  type: String,
                },

                /**
                 * open state
                 */
                opened: {
                  type: Boolean,
                  reflect: true,
                },

                /**
                 * Close label
                 */
                closeLabel: {
                  attribute: "close-label",
                  type: String,
                },

                /**
                 * Close icon
                 */
                closeIcon: {
                  type: String,
                  attribute: "close-icon",
                },

                /**
                 * The element that invoked this. This way we can track our way back accessibly
                 */
                invokedBy: {
                  type: Object,
                },

                /**
                 * support for modal flag
                 */
                modal: {
                  type: Boolean,
                },

                /**
                 * can add a custom string to style modal based on what is calling it
                 */
                mode: {
                  type: String,
                  reflect: true,
                },
              }
            );
          },
          /**
           * convention
           */
        },
        {
          key: "tag",
          get: function get() {
            return "simple-modal";
          },
          /**
           * HTMLElement
           */
        },
      ]
    );

    function SimpleModal() {
      var _this;

      _classCallCheck(this, SimpleModal);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleModal).call(this)
      );
      _this.title = "";
      _this.opened = false;
      _this.closeLabel = "Close";
      _this.closeIcon = "close";
      _this.modal = false;
      return _this;
    }
    /**
     * LitElement
     */

    _createClass(SimpleModal, [
      {
        key: "updated",
        value: function updated(changedProperties) {
          var _this2 = this;

          changedProperties.forEach(function (oldValue, propName) {
            if (propName == "opened") {
              _this2._openedChanged(_this2[propName]);
            }
          });
        },
        /**
         * HTMLElement
         */
      },
      {
        key: "connectedCallback",
        value: function connectedCallback() {
          var _this3 = this;

          _get(
            _getPrototypeOf(SimpleModal.prototype),
            "connectedCallback",
            this
          ).call(this);

          setTimeout(function () {
            window.addEventListener(
              "simple-modal-hide",
              _this3.close.bind(_this3)
            );
            window.addEventListener(
              "simple-modal-show",
              _this3.showEvent.bind(_this3)
            );
          }, 0);
        },
        /**
         * HTMLElement
         */
      },
      {
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          window.removeEventListener(
            "simple-modal-hide",
            this.close.bind(this)
          );
          window.removeEventListener(
            "simple-modal-show",
            this.showEvent.bind(this)
          );

          _get(
            _getPrototypeOf(SimpleModal.prototype),
            "disconnectedCallback",
            this
          ).call(this);
        },
        /**
         * show event call to open the modal and display it's content
         *
         */
      },
      {
        key: "showEvent",
        value: function showEvent(e) {
          var _this4 = this;

          // if we're already opened and we get told to open again....
          // swap out the contents
          // ensure things don't conflict w/ the modal if its around
          window.dispatchEvent(
            new CustomEvent("simple-toast-hide", {
              bubbles: true,
              composed: true,
              cancelable: false,
              detail: false,
            })
          );

          if (this.opened) {
            // wipe the slot of our modal
            this.innerHTML = "";
            setTimeout(function () {
              _this4.show(
                e.detail.title,
                e.detail.mode,
                e.detail.elements,
                e.detail.invokedBy,
                e.detail.id,
                e.detail.modalClass,
                e.detail.styles,
                e.detail.clone,
                e.detail.modal
              );
            }, 0);
          } else {
            this.show(
              e.detail.title,
              e.detail.mode,
              e.detail.elements,
              e.detail.invokedBy,
              e.detail.id,
              e.detail.modalClass,
              e.detail.styles,
              e.detail.clone,
              e.detail.modal
            );
          }
        },
        /**
         * Show the modal and display the material
         */
      },
      {
        key: "show",
        value: function show(title, mode, elements, invokedBy) {
          var _this5 = this;

          var id =
            arguments.length > 4 && arguments[4] !== undefined
              ? arguments[4]
              : null;
          var modalClass =
            arguments.length > 5 && arguments[5] !== undefined
              ? arguments[5]
              : null;
          var styles =
            arguments.length > 6 && arguments[6] !== undefined
              ? arguments[6]
              : null;
          var clone =
            arguments.length > 7 && arguments[7] !== undefined
              ? arguments[7]
              : false;
          var modal =
            arguments.length > 8 && arguments[8] !== undefined
              ? arguments[8]
              : false;
          this.invokedBy = invokedBy;
          this.modal = modal;
          this.title = title;
          this.mode = mode;
          var element; // append element areas into the appropriate slots
          // ensuring they are set if it wasn't previously

          var slots = ["header", "content", "buttons", "custom"];

          if (id) {
            this.setAttribute("id", id);
          } else {
            this.removeAttribute("id");
          }

          this.setAttribute("style", "");

          if (styles) {
            SimpleModalCssVars.forEach(function (prop) {
              _this5.style.setProperty(prop, styles[prop] || "inherit");
            });
          }

          if (modalClass) {
            this.setAttribute("class", modalClass);
          } else {
            this.removeAttribute("class");
          }

          for (var i in slots) {
            if (elements[slots[i]]) {
              if (clone) {
                element = elements[slots[i]].cloneNode(true);
              } else {
                element = elements[slots[i]];
              }

              element.setAttribute("slot", slots[i]);
              this.appendChild(element);
            }
          } // minor delay to help the above happen prior to opening

          this.opened = true;
        },
        /**
         * Close the modal and do some clean up
         */
      },
      {
        key: "close",
        value: function close() {
          this.opened = false;

          if (window.ShadyCSS && !window.ShadyCSS.nativeShadow) {
            this.shadowRoot
              .querySelector("web-dialog")
              .shadowRoot.querySelector("#backdrop").style.position =
              "relative";
          }
        },
      },
      {
        key: "open",
        value: function open() {
          this.opened = true;

          if (window.ShadyCSS && !window.ShadyCSS.nativeShadow) {
            this.shadowRoot
              .querySelector("web-dialog")
              .shadowRoot.querySelector("#backdrop").style.position = "fixed";
            this.shadowRoot
              .querySelector("web-dialog")
              .shadowRoot.querySelector("#backdrop").style.top = 0;
            this.shadowRoot
              .querySelector("web-dialog")
              .shadowRoot.querySelector("#backdrop").style.bottom = 0;
            this.shadowRoot
              .querySelector("web-dialog")
              .shadowRoot.querySelector("#backdrop").style.left = 0;
            this.shadowRoot
              .querySelector("web-dialog")
              .shadowRoot.querySelector("#backdrop").style.right = 0;
          }
        }, // Observer opened for changes
      },
      {
        key: "_openedChanged",
        value: function _openedChanged(newValue) {
          var _this6 = this;

          if (
            _typeof(newValue) !==
              (typeof undefined === "undefined"
                ? "undefined"
                : _typeof(undefined)) &&
            !newValue
          ) {
            // wipe the slot of our modal
            this.title = "";

            while (this.firstChild !== null) {
              this.removeChild(this.firstChild);
            }

            if (this.invokedBy) {
              setTimeout(function () {
                _this6.invokedBy.focus();
              }, 500);
            }

            var evt = new CustomEvent("simple-modal-closed", {
              bubbles: true,
              cancelable: true,
              detail: {
                opened: false,
                invokedBy: this.invokedBy,
              },
            });
            this.dispatchEvent(evt);
          } else if (newValue) {
            // p dialog backport; a nice, simple solution for close buttons
            var children = this.querySelectorAll(
              "[dialog-dismiss],[dialog-confirm]"
            );
            children.forEach(function (el) {
              el.addEventListener("click", function (e) {
                _this6.close();
              });
            });

            var _evt = new CustomEvent("simple-modal-opened", {
              bubbles: true,
              cancelable: true,
              detail: {
                opened: true,
                invokedBy: this.invokedBy,
              },
            });

            this.dispatchEvent(_evt);
          }
        },
        /**
         * If there is a title, aria-labelledby should point to #simple-modal-title
         */
      },
      {
        key: "_getAriaLabelledby",
        value: function _getAriaLabelledby(title) {
          return !title ? null : "simple-modal-title";
        },
        /**
         * If there is no title, supply a generic aria-label
         */
      },
      {
        key: "_getAriaLabel",
        value: function _getAriaLabel(title) {
          return !title ? "Modal Dialog" : null;
        },
      },
    ]);

    return SimpleModal;
  })(_litElement.LitElement);

exports.SimpleModal = SimpleModal;
window.customElements.define(SimpleModal.tag, SimpleModal);
// register globally so we can make sure there is only one
window.SimpleModal = window.SimpleModal || {}; // request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal

window.SimpleModal.requestAvailability = function () {
  if (!window.SimpleModal.instance) {
    window.SimpleModal.instance = document.createElement("simple-modal");
    document.body.appendChild(window.SimpleModal.instance);
  }

  return window.SimpleModal.instance;
};

var SimpleModalStore = window.SimpleModal.requestAvailability();
exports.SimpleModalStore = SimpleModalStore;
