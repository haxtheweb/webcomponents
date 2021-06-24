"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleModalTemplate = void 0;

var _litElement = require("lit");

var _simpleModal = require("../simple-modal.js");

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
    '\n      <slot name="header"></slot>\n      <slot name="content"></slot>\n      <slot name="buttons"></slot>\n    ',
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n        :host {\n          display: none;\n        }\n      ",
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

/**
 * `simple-modal-template`
 * `A simple modal that ensures accessibility and stack order context appropriately`
 * @demo ./demo/template.html
 * @element simple-modal-template
 */
var SimpleModalTemplate =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(SimpleModalTemplate, _LitElement);

    _createClass(SimpleModalTemplate, null, [
      {
        key: "styles",

        /**
         * LitElement constructable styles enhancement
         */
        get: function get() {
          return [(0, _litElement.css)(_templateObject())];
        },
        /**
         * Store the tag name to make it easier to obtain directly.
         */
      },
      {
        key: "tag",
        get: function get() {
          return "simple-modal-template";
        },
      },
    ]);

    function SimpleModalTemplate() {
      var _this;

      _classCallCheck(this, SimpleModalTemplate);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleModalTemplate).call(this)
      );
      _this.title = "";
      _this.modal = window.SimpleModal.requestAvailability();
      return _this;
    } //render function

    _createClass(
      SimpleModalTemplate,
      [
        {
          key: "render",
          //render function
          value: function render() {
            return (0, _litElement.html)(_templateObject2());
          },
          /**
           * sets event listeners for a specified target
           *
           * @param {object} the object that will have the event listener
           * @param {string} the event name
           * @param {boolean} whether the event bubbles (default is true)
           * @param {boolean} whether the event can be canceled (default is true)
           * @returns {object} the modal object
           */
        },
        {
          key: "associateEvents",
          value: function associateEvents(target) {
            var _this2 = this;

            var evt =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : "click";
            var bubbles =
              arguments.length > 2 && arguments[2] !== undefined
                ? arguments[2]
                : true;
            var cancelable =
              arguments.length > 3 && arguments[3] !== undefined
                ? arguments[3]
                : true;
            target.addEventListener(evt, function (e) {
              _this2.openModal(target, bubbles, cancelable);
            });
            return this.modal;
          },
          /**
           * dispatches event to populate and open the simple modal based template values
           *
           * @param {object} the object that will have the event listener
           * @param {boolean} whether the event bubbles (default is true)
           * @param {boolean} whether the event can be canceled (default is true)
           */
        },
        {
          key: "openModal",
          value: function openModal(target) {
            var bubbles =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : true;
            var cancelable =
              arguments.length > 2 && arguments[2] !== undefined
                ? arguments[2]
                : true;
            var tplStyles = getComputedStyle(this),
              styles = {};

            _simpleModal.SimpleModalCssVars.forEach(function (prop) {
              styles[prop] = tplStyles.getPropertyValue(prop); // support mosterously large values

              if (prop == "--simple-modal-z-index") {
                styles[prop] = Number(styles[prop]);
              }
            });

            var evt = new CustomEvent("simple-modal-show", {
              bubbles: bubbles,
              cancelable: cancelable,
              composed: true,
              detail: {
                id: this.getAttribute("modal-id"),
                elements: {
                  header: this._getSlot("header"),
                  content: this._getSlot("content"),
                  buttons: this._getSlot("buttons"),
                  custom: this._getCustom(),
                },
                resize: this.resize,
                invokedBy: target,
                modalClass: this.getAttribute("class"),
                styles: styles,
                clone: false,
                mode: this.mode !== null ? this.mode : false,
                title: this.title !== null ? this.title : false,
              },
            });
            window.dispatchEvent(evt);
          },
        },
        {
          key: "_getCustom",
          value: function _getCustom() {
            var slot = this.querySelectorAll('[slot="custom"]');
            return slot.length == 1
              ? slot[0].cloneNode(true)
              : this._getSlot("custom");
          },
          /**
           * clones content in a named slot
           *
           * @param {string} the name of the slot
           * @returns {object} a clone of the slotted content (or false if there is no slotted content)
           */
        },
        {
          key: "_getSlot",
          value: function _getSlot(slotName) {
            var slot = this.querySelectorAll('[slot="' + slotName + '"]'); // account for slot passing down from parent element

            if (slot && slot[0] && slot[0].tagName == "SLOT") {
              slot = slot[0].assignedNodes({
                flatten: true,
              });
            }

            var container = document.createElement("div");
            slot.forEach(function (el) {
              container.appendChild(el.cloneNode(true));
            });
            return slot !== null ? container.cloneNode(true) : false;
          },
        },
      ],
      [
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * the simple-modal
               */
              modal: {
                type: Object,
              },

              /**
               * the modal title
               */
              title: {
                type: String,
              },

              /**
               * the modal title
               */
              mode: {
                type: String,
              },
            };
          },
        },
      ]
    );

    return SimpleModalTemplate;
  })(_litElement.LitElement);

exports.SimpleModalTemplate = SimpleModalTemplate;
window.customElements.define(SimpleModalTemplate.tag, SimpleModalTemplate);
