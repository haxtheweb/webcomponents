"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RichTextEditorHelpButton = void 0;

var _lit = require("lit");

var _richTextEditorButton = require("./rich-text-editor-button.js");

var _simpleToolbarHelpButton = require("@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-help-button.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
 * `rich-text-editor-help-button`
 * prompts for more information for rich text editor
 * (custom buttons can extend RichTextEditorHelpButton)
 *
 * @extends RichTextEditorHelpButton
 * @extends LitElement
 * @customElement
 * @lit-html
 * @lit-element
 * @element rich-text-editor-help-button
 * @demo ./demo/buttons.html
 */
var RichTextEditorHelpButton =
/*#__PURE__*/
function (_SimpleToolbarHelpBut) {
  _inherits(RichTextEditorHelpButton, _SimpleToolbarHelpBut);

  _createClass(RichTextEditorHelpButton, null, [{
    key: "tag",

    /**
     * Store tag name to make it easier to obtain directly.
     */
    get: function get() {
      return "rich-text-editor-help-button";
    }
  }, {
    key: "styles",
    get: function get() {
      return _toConsumableArray(_get(_getPrototypeOf(RichTextEditorHelpButton), "richTextEditorButtonStyles", this));
    }
  }]);

  function RichTextEditorHelpButton() {
    var _this;

    _classCallCheck(this, RichTextEditorHelpButton);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RichTextEditorHelpButton).call(this));
    _this.displayMode = '2';
    return _this;
  } // render function for template


  _createClass(RichTextEditorHelpButton, [{
    key: "render",
    value: function render() {
      return this.simpleToolbarModalButtonRender;
    }
  }]);

  return RichTextEditorHelpButton;
}((0, _simpleToolbarHelpButton.SimpleToolbarHelpButtonBehaviors)((0, _richTextEditorButton.RichTextEditorButtonBehaviors)(_lit.LitElement)));

exports.RichTextEditorHelpButton = RichTextEditorHelpButton;
window.customElements.define(RichTextEditorHelpButton.tag, RichTextEditorHelpButton);