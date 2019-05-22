define([
  "exports",
  "../../node_modules/@polymer/polymer/polymer-element.js",
  "./rich-text-editor-button.js",
  "../../node_modules/@lrnwebcomponents/es-global-bridge/es-global-bridge.js",
  "../../node_modules/@polymer/polymer/lib/utils/resolve-url.js",
  "../../node_modules/@lrnwebcomponents/simple-picker/simple-picker.js"
], function(
  _exports,
  _polymerElement,
  _richTextEditorButton,
  _esGlobalBridge,
  _resolveUrl,
  _simplePicker
) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.RichTextEditorPicker = void 0;
  function _templateObject_a743d5807cbb11e98cbdc9dc12e6ca7b() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n      <style include="rich-text-editor-button-styles">\n        :host {\n          margin: var(--rich-text-editor-button-margin);\n          --simple-picker-option: {\n            line-height: var(--simple-picker-option-size);\n            height: var(--simple-picker-option-size);\n            max-height: var(--simple-picker-option-size);\n          }\n        }\n      </style>\n      <simple-picker\n        id="button"\n        class="rtebutton"\n        disabled$="[[disabled]]"\n        controls="[[controls]]"\n        on-change="_pickerChange"\n        tabindex="0"\n        title-as-html$="[[titleAsHtml]]"\n        options="[[options]]"\n        value="{{value}}"\n      >\n        <span id="label" class$="[[labelStyle]]">[[__label]]</span>\n      </simple-picker>\n      <paper-tooltip id="tooltip" for="button">[[__label]]</paper-tooltip>\n    '
    ]);
    _templateObject_a743d5807cbb11e98cbdc9dc12e6ca7b = function _templateObject_a743d5807cbb11e98cbdc9dc12e6ca7b() {
      return data;
    };
    return data;
  }
  /**
   * `rich-text-editor-picker`
   * `a picker for rich text editor (custom buttons can extend this)`
   *
   * @microcopy - language worth noting:
   *  -
   *
   * @customElement
   * @polymer
   */ var RichTextEditorPicker = /*#__PURE__*/ (function(
    _RichTextEditorButton
  ) {
    babelHelpers.inherits(RichTextEditorPicker, _RichTextEditorButton);
    function RichTextEditorPicker() {
      var _this;
      babelHelpers.classCallCheck(this, RichTextEditorPicker);
      _this = babelHelpers.possibleConstructorReturn(
        this,
        babelHelpers.getPrototypeOf(RichTextEditorPicker).call(this)
      );
      _this.label = "Insert link";
      _this.icon = "";
      return _this;
    } // render function
    babelHelpers.createClass(
      RichTextEditorPicker,
      [
        {
          key: "_isToggled",
          /**
           * determins if the button is toggled
           *
           * @param {object} the text selection
           * @returns {boolean} whether the button is toggled
           *
           */ value: function _isToggled(selection) {
            var toggled = !1;
            if (null !== selection && !selection.isCollapsed) {
              if ("formatBlock" === this.command) {
                var ancestor = selection.commonAncestorContainer,
                  parent = ancestor.parentNode,
                  temp = [];
                this.options.forEach(function(row) {
                  row.forEach(function(option) {
                    temp.push(option.value);
                  });
                });
                this.$.button.value =
                  null !== parent.closest(temp.join(","))
                    ? parent.closest(temp.join(",")).tagName.toLowerCase()
                    : null;
              }
            }
            return !1;
          }
          /**
           * Handles default options loaded from an external js file
           */
        },
        {
          key: "_setOptions",
          value: function _setOptions() {
            this.set(
              "options",
              this._getPickerOptions(data, this.allowNull, this.icon)
            );
          }
          /**
           * Picker change
           */
        },
        {
          key: "_pickerChange",
          value: function _pickerChange(e) {
            var val = this.$.button.value;
            e.preventDefault();
            if (
              null !== val &&
              this.selection !== void 0 &&
              null !== this.selection
            ) {
              this.commandVal = this.$.button.value;
              if ((this.command = "formatBlock")) {
                this.doTextOperation();
              } else if ((this.command = "insertNode")) {
                var node = !this.block
                  ? document.createTextNode(val)
                  : document.createElement(val);
                this.selection.extractContents();
                this.selection.insertNode(node);
              }
              if (!0 !== this.block) {
                this.$.button.value = null;
                this.dispatchEvent(
                  new CustomEvent("deselect", { detail: this })
                );
              }
            }
          }
          /**
           * Converts option data to picker option data;
           * can be overridden in extended elements
           *
           * @param {object} data about the option
           * @returns {object} picker dato for the option
           */
        },
        {
          key: "_getOptionData",
          value: function _getOptionData(option) {
            return {
              alt: option.alt,
              icon: option.icon,
              style: option.style,
              value: option.value
            };
          }
          /**
           * gets a list of icons and load them in a format
           * that the simple-picker can take;
           * if no icons are provided, loads a list from iron-meta
           *
           * @param {array} a list of custom icons for the picker
           * @param {array} default list of icons for the picker
           * @param {boolean} allow a null value for the picker
           */
        },
        {
          key: "_getPickerOptions",
          value: function _getPickerOptions() {
            for (
              var options =
                  0 < arguments.length && arguments[0] !== void 0
                    ? arguments[0]
                    : [],
                allowNull =
                  1 < arguments.length && arguments[1] !== void 0
                    ? arguments[1]
                    : !1,
                icon =
                  2 < arguments.length && arguments[2] !== void 0
                    ? arguments[2]
                    : null,
                items =
                  !1 === allowNull && null === icon
                    ? [{ alt: "null", icon: icon, value: null }]
                    : [],
                cols =
                  11 > Math.sqrt(options.length)
                    ? Math.ceil(Math.sqrt(options.length))
                    : 10,
                i = 0;
              i < options.length;
              i++
            ) {
              var row = Math.floor(i / cols),
                col = i - row * cols,
                _data = this._getOptionData(options[i]);
              if (items[row] === void 0 || null === items[row]) items[row] = [];
              if (0 === row && !1 === allowNull && null !== icon) {
                items[0][0] = { alt: "null", icon: icon, value: null };
                col++;
              }
              items[row][col] = _data;
            }
            return items;
          }
        }
      ],
      [
        {
          key: "template",
          get: function get() {
            return (0, _polymerElement.html)(
              _templateObject_a743d5807cbb11e98cbdc9dc12e6ca7b()
            );
          } // properties available to the custom element for data binding
        },
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * Allow a null option to be selected?
               */ allowNull: { name: "allowNull", type: Boolean, value: !1 },
              /**
               * The command used for document.execCommand.
               */ command: {
                name: "command",
                type: String,
                value: "insertHTML",
                readOnly: !0
              },
              /**
               * Optional icon for null value
               */ icon: { name: "icon", type: String, value: null },
              /**
               * The command used for document.execCommand.
               */ options: {
                name: "options",
                type: Array,
                value: [],
                notify: !0
              },
              /**
               * Renders html as title. (Good for titles with HTML in them.)
               */ titleAsHtml: {
                name: "titleAsHtml",
                type: Boolean,
                value: !1
              },
              /**
               * The value
               */ value: { name: "value", type: Object, value: null }
            };
          }
          /**
           * Store the tag name to make it easier to obtain directly.
           * @notice function name must be here for tooling to operate correctly
           */
        },
        {
          key: "tag",
          get: function get() {
            return "rich-text-editor-picker";
          }
        }
      ]
    );
    return RichTextEditorPicker;
  })(_richTextEditorButton.RichTextEditorButton);
  _exports.RichTextEditorPicker = RichTextEditorPicker;
  window.customElements.define(RichTextEditorPicker.tag, RichTextEditorPicker);
});
