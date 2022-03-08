"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleToolbarHelpButtonBehaviors = exports.SimpleToolbarHelpButton = void 0;

var _lit = require("lit");

var _simpleToolbarModalButton = require("./simple-toolbar-modal-button.js");

require("./simple-toolbar-help-docs.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _templateObject2() {
  var data = _taggedTemplateLiteral(["<simple-toolbar-help-docs hidden></simple-toolbar-help-docs>"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([""]);

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
        key: "styles",
        get: function get() {
          return [].concat(_toConsumableArray(_get(_getPrototypeOf(_class), "styles", this)), [(0, _lit.css)(_templateObject())]);
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
        _this.tooltipDirection = "left";
        _this.disabled = false;
        _this.shortcutKeys = "F1";
        return _this;
      }

      _createClass(_class, [{
        key: "openModal",
        value: function openModal() {
          var styles = this._getModalStyles(this),
              content = this.docs.cloneNode(true);

          content.hidden = false;
          content.contents = this.docs.contents;
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
        key: "docs",
        get: function get() {
          return this.shadowRoot && this.shadowRoot.querySelector('simple-toolbar-help-docs') ? this.shadowRoot.querySelector('simple-toolbar-help-docs') : undefined;
        }
      }, {
        key: "modalTemplate",
        get: function get() {
          return (0, _lit.html)(_templateObject2());
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