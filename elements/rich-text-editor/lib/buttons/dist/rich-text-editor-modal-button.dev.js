"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RichTextEditorModalButton = exports.RichTextEditorModalButtonBehaviors = void 0;

var _lit = require("lit");

var _richTextEditorButton = require("./rich-text-editor-button.js");

var _simpleToolbarModalButton = require("@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-modal-button.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * RichTextEditorModalButtonBehaviors
 *
 * @customElement
 * @class
 * @lit-html
 * @lit-element
 * @extends RichTextEditorButtonBehaviors
 * @extends SimpleToolbarModalButtonBehaviors
 */
var RichTextEditorModalButtonBehaviors = function RichTextEditorModalButtonBehaviors(SuperClass) {
  return (
    /*#__PURE__*/
    function (_SimpleToolbarModalBu) {
      _inherits(_class, _SimpleToolbarModalBu);

      function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));
      }

      _createClass(_class, [{
        key: "render",
        // render function for template
        value: function render() {
          return this.simpleToolbarModalButtonRender;
        }
      }], [{
        key: "tag",

        /**
         * Store tag name to make it easier to obtain directly.
         */
        get: function get() {
          return "rich-text-editor-modal-button";
        }
      }, {
        key: "styles",
        get: function get() {
          return _toConsumableArray(_get(_getPrototypeOf(_class), "richTextEditorButtonStyles", this));
        }
      }]);

      return _class;
    }((0, _simpleToolbarModalButton.SimpleToolbarModalButtonBehaviors)((0, _richTextEditorButton.RichTextEditorButtonBehaviors)(SuperClass)))
  );
};
/**
 * `rich-text-editor-modal-button`
 * prompts for more information for rich text editor
 * (custom buttons can extend RichTextEditorModalButton)
 *
 * @extends RichTextEditorModalButton
 * @extends LitElement
 * @customElement
 * @lit-html
 * @lit-element
 * @element rich-text-editor-modal-button
 * @demo ./demo/buttons.html
 */


exports.RichTextEditorModalButtonBehaviors = RichTextEditorModalButtonBehaviors;

var RichTextEditorModalButton =
/*#__PURE__*/
function (_RichTextEditorModalB) {
  _inherits(RichTextEditorModalButton, _RichTextEditorModalB);

  function RichTextEditorModalButton() {
    _classCallCheck(this, RichTextEditorModalButton);

    return _possibleConstructorReturn(this, _getPrototypeOf(RichTextEditorModalButton).apply(this, arguments));
  }

  return RichTextEditorModalButton;
}(RichTextEditorModalButtonBehaviors(_lit.LitElement));

exports.RichTextEditorModalButton = RichTextEditorModalButton;
window.customElements.define(RichTextEditorModalButton.tag, RichTextEditorModalButton);