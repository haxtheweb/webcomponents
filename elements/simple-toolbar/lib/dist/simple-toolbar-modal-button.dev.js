"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleToolbarModalButton = exports.SimpleToolbarModalButtonBehaviors = void 0;

var _lit = require("lit");

var _simpleToolbarButton = require("./simple-toolbar-button.js");

require("@lrnwebcomponents/simple-modal/lib/simple-modal-template.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n        <simple-modal-template modal-id=\"", "-modal\" title=\"", "\">\n          ", "\n          ", "\n          ", "\n          ", "\n          ", "\n        </simple-modal-template>\n        <slot></slot>\n      "]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n        simple-modal-template {\n          --simple-modal-titlebar-color: var(--simple-toolbar-button-bg);\n          --simple-modal-titlebar-background: var(--simple-toolbar-button-color);\n          --simple-modal-header-color: var(--simple-toolbar-button-hover-color);\n          --simple-modal-header-background: var(--simple-toolbar-button-hover-bg);\n          --simple-modal-content-container-color: var(--simple-toolbar-button-color);\n          --simple-modal-content-container-background: var(--simple-toolbar-button-bg);\n          --simple-modal-buttons-color: var(--simple-toolbar-button-color);\n          --simple-modal-buttons-background: var(--simple-toolbar-button-bg);\n        }\n      "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["", "", ""]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n          :host([hidden]) {\n            display: none !important;\n          }\n        "]);

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
        key: "styles",
        get: function get() {
          return [].concat(_toConsumableArray(_get(_getPrototypeOf(_class), "styles", this)), [(0, _lit.css)(_templateObject())]);
        }
      }, {
        key: "properties",
        get: function get() {
          return _objectSpread({}, _get(_getPrototypeOf(_class), "properties", this), {
            id: {
              attribute: "id",
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
        window.removeEventListener("simple-modal-hide", _this._handleModalClose.bind(_assertThisInitialized(_this)));
        window.removeEventListener("simple-modal-show", _this._handleModalOpen.bind(_assertThisInitialized(_this)));
        return _this;
      }

      _createClass(_class, [{
        key: "render",
        value: function render() {
          return (0, _lit.html)(_templateObject2(), _get(_getPrototypeOf(_class.prototype), "render", this).call(this), this.modalTemplate);
        }
      }, {
        key: "_handleModalClose",
        value: function _handleModalClose(e) {
          var _this2 = this;

          this.toggled = false;

          this.__children.forEach(function (child) {
            return _this2.append(child);
          });

          this.__children = undefined;
        }
      }, {
        key: "_handleModalOpen",
        value: function _handleModalOpen(e) {
          if (e.detail && e.deal.invokedBy && e.deal.invokedBy == this) this.toggled = true;
        }
      }, {
        key: "_handleClick",
        value: function _handleClick(e) {
          this.toggleModal();
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
          var _this3 = this;

          if (this.shadowModal && this.shadowModal.openModal) {
            this.__children = _toConsumableArray(this.children);

            this.__children.forEach(function (child) {
              return _this3.shadowModal.append(child);
            });

            this.shadowModal.openModal();
          }
        }
      }, {
        key: "modalStyles",
        get: function get() {
          return (0, _lit.css)(_templateObject3());
        }
      }, {
        key: "modalTemplate",
        get: function get() {
          return (0, _lit.html)(_templateObject4(), this.id || 'modal-button', this.label, this.headerTemplate, this.precontentTemplate, this.contentTemplate, this.customTemplate, this.buttonsTemplate);
        }
      }, {
        key: "headerTemplate",
        get: function get() {
          return;
        }
      }, {
        key: "contentTemplate",
        get: function get() {
          return;
        }
      }, {
        key: "precontentTemplate",
        get: function get() {
          return;
        }
      }, {
        key: "buttonsTemplate",
        get: function get() {
          return;
        }
      }, {
        key: "customTemplate",
        get: function get() {
          return;
        }
      }, {
        key: "shadowModal",
        get: function get() {
          return this.shadowRoot && this.shadowRoot.querySelector('simple-modal-template') ? this.shadowRoot.querySelector('simple-modal-template') : undefined;
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