"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleToolbarModalButton = exports.SimpleToolbarModalButtonBehaviors = void 0;

var _lit = require("lit");

var _simpleToolbarButton = require("./simple-toolbar-button.js");

var _simpleModal = require("@lrnwebcomponents/simple-modal/simple-modal.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n        <slot hidden name=\"header\"></slot>\n        <slot hidden name=\"precontent\"></slot>\n        <slot hidden name=\"content\"></slot>\n        <slot hidden name=\"buttons\"></slot>\n        <slot hidden name=\"custom\"></slot>\n      "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["", "", ""]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var SimpleToolbarModalButtonBehaviors = function SimpleToolbarModalButtonBehaviors(SuperClass) {
  return (
    /*#__PURE__*/
    function (_SimpleToolbarButtonB) {
      _inherits(_class, _SimpleToolbarButtonB);

      _createClass(_class, null, [{
        key: "tag",

        /**
         * Store the tag name to make it easier to obtain directly.
         */
        get: function get() {
          return "simple-toolbar-modal-button";
        }
      }, {
        key: "properties",
        get: function get() {
          return _objectSpread({}, _get(_getPrototypeOf(_class), "properties", this), {
            /**
             * The `id` of modal that button controls.
             */
            controls: {
              type: String,
              attribute: "controls-editor",
              reflect: false
            },
            id: {
              attribute: "id",
              type: String,
              reflect: true
            },
            title: {
              attribute: "string",
              type: String,
              reflect: true
            }
          });
        }
      }]);

      function _class() {
        var _this;

        _classCallCheck(this, _class);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this));
        window.SimpleModal.requestAvailability();
        window.removeEventListener("simple-modal-hide", _this._handleModalClose.bind(_assertThisInitialized(_this)));
        window.removeEventListener("simple-modal-show", _this._handleModalOpen.bind(_assertThisInitialized(_this)));
        return _this;
      }

      _createClass(_class, [{
        key: "firstUpdated",
        value: function firstUpdated(changedProperties) {
          if (_get(_getPrototypeOf(_class.prototype), "firstUpdated", this)) _get(_getPrototypeOf(_class.prototype), "firstUpdated", this).call(this, changedProperties);
          this.setAttribute('aria-haspopup', "true");
        }
      }, {
        key: "render",
        value: function render() {
          return this.simpleToolbarModalButtonRender;
        }
      }, {
        key: "_handleModalClose",
        value: function _handleModalClose(e) {
          this.toggled = false;
        }
      }, {
        key: "_handleModalOpen",
        value: function _handleModalOpen(e) {
          if (e.detail && e.deal.invokedBy && e.deal.invokedBy == this) this.toggled = true;
        }
      }, {
        key: "_getModalStyles",
        value: function _getModalStyles(target) {
          var styles = getComputedStyle(target);
          return {
            "--simple-modal-titlebar-color": styles.getPropertyValue('--simple-toolbar-button-bg'),
            "--simple-modal-titlebar-background": styles.getPropertyValue('--simple-toolbar-button-color'),
            "--simple-modal-header-color": styles.getPropertyValue('--simple-toolbar-button-hover-color'),
            "--simple-modal-header-background": styles.getPropertyValue('--simple-toolbar-button-hover-bg'),
            "--simple-modal-content-container-color": styles.getPropertyValue('--simple-toolbar-button-color'),
            "--simple-modal-content-container-background": styles.getPropertyValue('--simple-toolbar-button-bg'),
            "--simple-modal-buttons-color": styles.getPropertyValue('--simple-toolbar-button-color'),
            "--simple-modal-buttons-background": styles.getPropertyValue('--simple-toolbar-button-bg'),
            "--simple-modal-z-index": Number(styles.getPropertyValue('--simple-toolbar-button-z-index)') + 2)
          };
        }
      }, {
        key: "_handleClick",
        value: function _handleClick(e) {
          this.toggleModal();
        }
        /**
         * toggles button if shortcutKey is pressed
         *
         * @param {string} key
         * @event toggle
         */

      }, {
        key: "_handleShortcutKeys",
        value: function _handleShortcutKeys(e, key) {
          if (!!this.shortcutKeys && this.shortcutKeys != '') this.dispatchEvent(new CustomEvent("toggle", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: _objectSpread({}, e.detail, {
              button: this,
              shortcutKey: this
            })
          }));
        }
      }, {
        key: "toggleModal",
        value: function toggleModal() {
          if (this.toggled) {
            this.closeModal();
          } else {
            this.openModal(this);
          }
        }
      }, {
        key: "closeModal",
        value: function closeModal() {
          window.dispatchEvent(new CustomEvent("simple-modal-hide", {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: false
          }));
        }
      }, {
        key: "openModal",
        value: function openModal() {
          var styles = this._getModalStyles(this),
              elements = {};

          _toConsumableArray(this.children).forEach(function (child) {
            var clone = child.cloneNode(true),
                slot = child.slot;
            clone.hidden = false;
            delete clone.slot;
            if (!elements[slot]) elements[slot] = [];
            elements[slot].push(clone);
          });

          this.dispatchEvent(new CustomEvent("simple-modal-show", {
            bubbles: true,
            cancelable: true,
            detail: {
              title: this.title || this.label,
              id: this.id || this.getAttribute('id'),
              elements: elements,
              styles: styles,
              invokedBy: this
            }
          }));
        }
      }, {
        key: "simpleToolbarModalButtonRender",
        get: function get() {
          return (0, _lit.html)(_templateObject(), _get(_getPrototypeOf(_class.prototype), "render", this).call(this), this.modalTemplate);
        }
      }, {
        key: "modalTemplate",
        get: function get() {
          return (0, _lit.html)(_templateObject2());
        }
      }]);

      return _class;
    }((0, _simpleToolbarButton.SimpleToolbarButtonBehaviors)(SuperClass))
  );
};
/**
 * `simple-toolbar-modal-button`
 * a more button to toggle collapsed buttons in the rich text editor
 *
 * @customElement
 * @extends SimpleToolbarButtonBehaviors
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo ./demo/buttons.html
 */


exports.SimpleToolbarModalButtonBehaviors = SimpleToolbarModalButtonBehaviors;

var SimpleToolbarModalButton =
/*#__PURE__*/
function (_SimpleToolbarModalBu) {
  _inherits(SimpleToolbarModalButton, _SimpleToolbarModalBu);

  function SimpleToolbarModalButton() {
    _classCallCheck(this, SimpleToolbarModalButton);

    return _possibleConstructorReturn(this, _getPrototypeOf(SimpleToolbarModalButton).apply(this, arguments));
  }

  return SimpleToolbarModalButton;
}(SimpleToolbarModalButtonBehaviors(_lit.LitElement));

exports.SimpleToolbarModalButton = SimpleToolbarModalButton;
window.customElements.define(SimpleToolbarModalButton.tag, SimpleToolbarModalButton);