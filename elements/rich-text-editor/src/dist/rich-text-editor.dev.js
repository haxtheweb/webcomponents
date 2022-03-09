"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RichTextEditorBehaviors = exports.RichTextEditor = void 0;

var _lit = require("lit");

var _richTextEditorButton = require("./lib/buttons/rich-text-editor-button.js");

require("./lib/toolbars/rich-text-editor-toolbar.js");

require("./lib/toolbars/rich-text-editor-toolbar-mini.js");

require("./lib/toolbars/rich-text-editor-toolbar-full.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n          :host {\n            display: block;\n          }\n          :host([hidden]) {\n            display: none;\n          }\n          :host([disabled]) {\n            cursor: not-allowed;\n          }\n          :host(:empty) {\n            opacity: 0.7;\n          }\n\n          :host(.heightmax[contenteditable=\"true\"]) {\n            max-height: calc(100vh - 200px);\n            overflow-y: scroll;\n          }\n\n          #container,\n          #wysiwyg {\n            display: block;\n            width: 100%;\n          }\n          #source,\n          #wysiwyg {\n            margin: 0;\n            padding: 0;\n            min-height: var(--rich-text-editor-min-height, 20px);\n            cursor: pointer;\n            flex: 1 1 100%;\n            width: 100%;\n          }\n          :host(:empty) {\n            min-height: 20px;\n          }\n          :host(:empty)::after {\n            display: block;\n            content: attr(aria-placeholder);\n          }\n\n          :host(:hover),\n          :host(:focus-within) {\n            opacity: 1;\n            outline: var(--rich-text-editor-border-width, 1px) dotted\n              var(--rich-text-editor-focus-color, currentColor);\n          }\n          :host([disabled]),\n          :host([view-source]) {\n            outline: none !important;\n          }\n\n          #source:hover,\n          #source:focus-within {\n            outline: var(--rich-text-editor-border-width, 1px) dotted\n              var(--rich-text-editor-focus-color, currentColor);\n          }\n          :host([contenteditable=\"true\"][view-source]) #container {\n            display: flex;\n            align-items: stretch;\n            justify-content: space-between;\n            width: 100%;\n          }\n          :host([contenteditable=\"true\"][view-source]) #source,\n          :host([contenteditable=\"true\"][view-source]) #wysiwyg {\n            resize: horizontal;\n            overflow: auto;\n            flex: 1 1 auto;\n            width: 50%;\n          }\n          :host([contenteditable=\"true\"][view-source]) #source {\n            min-width: 300px;\n          }\n          :host([contenteditable=\"true\"][view-source]) #wysiwyg {\n            cursor: not-allowed;\n            margin-right: 10px;\n            width: calc(50% - 10px);\n          }\n          ::slotted(*:first-child) {\n            margin-top: 0px;\n          }\n          ::slotted(*:last-child) {\n            margin-bottom: 0px;\n          }\n        "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _templateObject() {
  var data = _taggedTemplateLiteral([" <div\n        id=\"container\"\n        @focus=\"", "\"\n        @blur=\"", "\"\n        @mouseover=\"", "\"\n        @mouseout=\"", "\"\n      >\n        <slot></slot>\n      </div>"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

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

 * RichTextEditorBehaviors
 * @extends RichTextStyles
 *
 * @customElement
 * @class
 * @lit-html
 * @lit-element
 */
var RichTextEditorBehaviors = function RichTextEditorBehaviors(SuperClass) {
  return (
    /*#__PURE__*/
    function (_SuperClass) {
      _inherits(_class, _SuperClass);

      _createClass(_class, [{
        key: "render",
        // render function
        value: function render() {
          var _this2 = this;

          return (0, _lit.html)(_templateObject(), function (e) {
            return _this2.__focused = true;
          }, function (e) {
            return _this2.__focused = false;
          }, function (e) {
            return _this2.__hovered = true;
          }, function (e) {
            return _this2.__hovered = false;
          });
        }
      }], [{
        key: "styles",
        //styles function
        get: function get() {
          return [].concat(_toConsumableArray(_richTextEditorButton.RichTextStyles), [(0, _lit.css)(_templateObject2())]);
        }
      }, {
        key: "properties",
        get: function get() {
          return _objectSpread({}, _get(_getPrototypeOf(_class), "properties", this), {
            /**
             * editor's unique id
             */
            id: {
              name: "id",
              type: String,
              reflect: true,
              attribute: "id"
            },

            /**
             * Maps to editing attribute
             */
            contenteditable: {
              name: "contenteditable",
              type: String,
              reflect: true,
              attribute: "contenteditable"
            },

            /**
             * don't reveal toolbar on mouseover
             */
            disabled: {
              name: "disabled",
              type: Boolean,
              attribute: "disabled",
              reflect: true
            },

            /**
             * don't reveal toolbar on mouseover
             */
            disableHover: {
              name: "disableHover",
              type: Boolean,
              attribute: "disable-hover"
            },

            /**
             * Placeholder text for empty editable regions
             */
            placeholder: {
              name: "placeholder",
              type: String,
              reflect: true,
              attribute: "aria-placeholder"
            },

            /**
             * id for toolbar
             */
            toolbarId: {
              name: "toolbarId",
              type: String,
              reflect: true,
              attribute: "toolbar-id"
            },

            /**
             * current range
             */
            range: {
              name: "range",
              type: Object,
              attribute: "range"
            },

            /**
             * raw html
             */
            rawhtml: {
              type: String,
              attribute: "rawhtml"
            },

            /**
             * type of editor toolbar, i.e.
             * full - full for full toolbar with breadcrumb,
             * mini - mini for mini floating toolbar, or
             * default toolbar if neither.
             */
            type: {
              name: "type",
              type: String,
              reflect: true,
              attribute: "type"
            },

            /**
             * whether editor is view source code mode
             */
            viewSource: {
              type: Boolean,
              attribute: "view-source",
              reflect: true
            },

            /**
             * code-editor for view source
             */
            __codeEditorValue: {
              type: String
            },

            /**
             * has focus
             */
            __needsUpdate: {
              type: Boolean
            },

            /**
             * has focus
             */
            __focused: {
              type: Boolean
            },

            /**
             * is hovered
             */
            __hovered: {
              type: Boolean
            }
          });
        }
        /**
         * Store the tag name to make it easier to obtain directly.
         * @notice function name must be here for tooling to operate correctly
         */

      }, {
        key: "tag",
        get: function get() {
          return "rich-text-editor";
        }
      }]);

      function _class() {
        var _this;

        _classCallCheck(this, _class);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this));
        _this.placeholder = "Click to edit";
        _this.toolbarId = "";
        _this.type = "rich-text-editor-toolbar";
        _this.id = "";
        _this.range = undefined;
        _this.disabled = false;
        _this.__focused = false;
        _this.__hovered = false;
        _this.editing = false;

        _this.setAttribute("tabindex", 1);

        _this.addEventListener("click", _this._handleClick);

        return _this;
      }

      _createClass(_class, [{
        key: "firstUpdated",
        value: function firstUpdated() {
          if (_get(_getPrototypeOf(_class.prototype), "firstUpdated", this)) _get(_getPrototypeOf(_class.prototype), "firstUpdated", this).call(this);

          if (this.isEmpty && !!this.rawhtml) {
            this.innerHTML = this.rawhtml.trim();
          } else if (this.isEmpty) {
            this.innerHTML = "";
          }
        }
      }, {
        key: "updated",
        value: function updated(changedProperties) {
          var _this3 = this;

          _get(_getPrototypeOf(_class.prototype), "updated", this).call(this, changedProperties);

          changedProperties.forEach(function (oldValue, propName) {
            if (propName === "rawhtml" && !!_this3.rawhtml) {
              _this3.innerHTML = _this3.rawhtml.trim();
            }

            if (propName === "contenteditable") _this3._contenteditableChange();
          });
          if (!this.innerHTML) this.innerHTML = "";
        }
        /**
         * focuses on the contenteditable region
         * @memberof RichTextEditor
         */

      }, {
        key: "focus",
        value: function focus() {
          if (!this.disabled) {
            this.contenteditable = "true";
            this.__focused = true;
          }

          this.dispatchEvent(new CustomEvent("focus", {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: this.querySelector("*")
          }));
        }
        /**
         * allows editor to fit within a stick toolbar
         *
         * @param {boolean} sticky
         * @memberof RichTextEditor
         */

      }, {
        key: "makeSticky",
        value: function makeSticky() {
          var sticky = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

          if (!sticky) {
            this.classList.add("heightmax");
          } else {
            this.classList.remove("heightmax");
          }
        }
        /**
         * fires when contenteditable changed
         * @event contenteditable-changed
         *
         */

      }, {
        key: "_contenteditableChange",
        value: function _contenteditableChange() {
          this.dispatchEvent(new CustomEvent("contenteditable-change", {
            bubbles: true,
            composed: true,
            cancelable: true,
            detail: this
          }));
        }
        /**
         * Handles clicking to edit.
         *
         * @param {event} e click event
         * @returns {void}
         */

      }, {
        key: "_handleClick",
        value: function _handleClick(e) {
          var _this4 = this;

          e.preventDefault();

          if (!this.disabled && !this.editable && !this.__toolbar) {
            //get toolbar by id
            var toolbar,
                filter = !this.toolbarId ? [] : (window.RichTextEditorToolbars || []).filter(function (toolbar) {
              return toolbar.id === _this4.toolbarId;
            }); //get toolbar by type

            if (filter.length === 0) {
              filter = !this.type ? [] : (window.RichTextEditorToolbars || []).filter(function (toolbar) {
                return toolbar.type === _this4.type;
              });
            } //get any toolbar


            if (filter.length === 0) filter = window.RichTextEditorToolbars;

            if (filter[0]) {
              toolbar = filter[0];
            } else if (filter.length === 0) {
              //make toolbar
              var toolbarType = this.type || "rich-text-editor-toolbar";
              toolbar = document.createElement(toolbarType);
            }

            this.__toolbar = toolbar;
            if (!this.disabled && this.__toolbar && this.__toolbar.setTarget) this.__toolbar.setTarget(this);
          }
        }
      }, {
        key: "editable",
        get: function get() {
          return !!this.contenteditable && this.contenteditable !== "false";
        }
      }, {
        key: "isEmpty",
        get: function get() {
          return !this.innerHTML || this.innerHTML.replace(/<!--[^(-->)]*-->/g, "").replace(/[\s\t\r\n]/gim, "") == "";
        }
      }]);

      return _class;
    }(SuperClass)
  );
};
/**
 * `rich-text-editor`
 * a standalone rich text editor
 * (can customize by extending RichTextEditorBehaviors)
### Styling

`<rich-text-editor>`  uses RichTextStyles variables, 
as well as an additional style:

Custom property | Description | Default
----------------|-------------|----------
--rich-text-editor-min-height | minimum height of editor | 20px
 *
 * @extends RichTextEditorBehaviors
 * @extends LitElement
 * @customElement
 * @element rich-text-editor
 * @lit-html
 * @lit-element
 * @demo ./demo/index.html demo
 * @demo ./demo/mini.html mini floating toolbar
 * @demo ./demo/full.html toolbar with breadcrumb
 * @demo ./demo/config.html custom configuration
 * @demo ./demo/rawhtml.html raw HTML
 * @demo ./demo/markdown.html markdown support
 */


exports.RichTextEditorBehaviors = RichTextEditorBehaviors;

var RichTextEditor =
/*#__PURE__*/
function (_RichTextEditorBehavi) {
  _inherits(RichTextEditor, _RichTextEditorBehavi);

  function RichTextEditor() {
    _classCallCheck(this, RichTextEditor);

    return _possibleConstructorReturn(this, _getPrototypeOf(RichTextEditor).apply(this, arguments));
  }

  return RichTextEditor;
}(RichTextEditorBehaviors(_lit.LitElement));

exports.RichTextEditor = RichTextEditor;
window.customElements.define(RichTextEditor.tag, RichTextEditor);