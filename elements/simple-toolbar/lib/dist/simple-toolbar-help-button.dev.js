"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleToolbarHelpButtonBehaviors = exports.SimpleToolbarHelpButton = void 0;

var _lit = require("lit");

var _simpleToolbarModalButton = require("./simple-toolbar-modal-button.js");

require("@lrnwebcomponents/end-user-doc/end-user-doc.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject() {
  var data = _taggedTemplateLiteral(["<end-user-doc id=\"helpDocsTemplate\" hidden class=\"", "\" ?searchable=\"", "\" display-mode=\"", "\"></end-user-doc>"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

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

/**
 * @extends SimpleToolbarModalButtonBehaviors
 */
var SimpleToolbarHelpButtonBehaviors = function SimpleToolbarHelpButtonBehaviors(SuperClass) {
  return (
    /*#__PURE__*/
    function (_SimpleToolbarModalBu) {
      _inherits(_class, _SimpleToolbarModalBu);

      _createClass(_class, null, [{
        key: "tag",

        /**
         * Store the tag name to make it easier to obtain directly.
         */
        get: function get() {
          return "simple-toolbar-help-button";
        }
      }, {
        key: "properties",
        get: function get() {
          return _objectSpread({}, _get(_getPrototypeOf(_class), "properties", this), {
            /**
             * whether help documentation can be searched
             */
            searchable: {
              name: "helpSearchable",
              type: Boolean,
              attribute: "searchable",
              reflect: true
            },

            /**
             * display mode for help documents
             */
            displayMode: {
              name: "displayMode",
              type: Boolean,
              attribute: "display-mode",
              reflect: true
            }
          });
        }
      }]);

      function _class() {
        var _this;

        _classCallCheck(this, _class);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this));
        _this.icon = "help-outline";
        _this.toggled = false;
        _this.toggles = true;
        _this.label = "Help";
        _this.disabled = false;
        _this.shortcutKeys = "F1";
        return _this;
      }

      _createClass(_class, [{
        key: "openModal",
        value: function openModal() {
          var styles = this._getModalStyles(this),
              content = this.endUserDoc.cloneNode(true);

          content.hidden = false;
          content.contents = this.endUserDoc.contents;
          this.dispatchEvent(new CustomEvent("simple-modal-show", {
            bubbles: true,
            cancelable: true,
            detail: {
              title: this.title || this.label,
              elements: {
                content: content
              },
              styles: styles,
              invokedBy: this
            }
          }));
        }
      }, {
        key: "endUserDoc",
        get: function get() {
          return this.shadowRoot && this.shadowRoot.querySelector('end-user-doc#helpDocsTemplate') ? this.shadowRoot.querySelector('end-user-doc#helpDocsTemplate') : undefined;
        }
      }, {
        key: "modalTemplate",
        get: function get() {
          return (0, _lit.html)(_templateObject(), this.icon, this.searchable, this.displayMode);
        }
      }]);

      return _class;
    }((0, _simpleToolbarModalButton.SimpleToolbarModalButtonBehaviors)(SuperClass))
  );
};
/**
 * `simple-toolbar-help-button`
 * a more button to toggle collapsed buttons in the rich text editor
 *
 * @customElement
 * @extends SimpleToolbarHelpButtonBehaviors
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @demo ./demo/buttons.html
 */


exports.SimpleToolbarHelpButtonBehaviors = SimpleToolbarHelpButtonBehaviors;

var SimpleToolbarHelpButton =
/*#__PURE__*/
function (_SimpleToolbarHelpBut) {
  _inherits(SimpleToolbarHelpButton, _SimpleToolbarHelpBut);

  function SimpleToolbarHelpButton() {
    _classCallCheck(this, SimpleToolbarHelpButton);

    return _possibleConstructorReturn(this, _getPrototypeOf(SimpleToolbarHelpButton).apply(this, arguments));
  }

  return SimpleToolbarHelpButton;
}(SimpleToolbarHelpButtonBehaviors(_lit.LitElement));

exports.SimpleToolbarHelpButton = SimpleToolbarHelpButton;
window.customElements.define(SimpleToolbarHelpButton.tag, SimpleToolbarHelpButton);