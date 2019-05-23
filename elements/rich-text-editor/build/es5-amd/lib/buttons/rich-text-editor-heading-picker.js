define([
  "exports",
  "../../node_modules/@polymer/polymer/polymer-element.js",
  "./rich-text-editor-picker.js",
  "../../node_modules/@polymer/iron-icons/editor-icons.js"
], function(_exports, _polymerElement, _richTextEditorPicker, _editorIcons) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.RichTextEditorHeadingPicker = void 0;
  /**
   * Copyright 2019 Penn State University
   * @license Apache-2.0, see License.md for full text.
   */ /**
   * `rich-text-editor-heading-picker`
   * `a heading picker for the rich-text-editor`
   *
   * @microcopy - language worth noting:
   *  -
   *
   * @customElement
   * @polymer
   */ var RichTextEditorHeadingPicker = /*#__PURE__*/ (function(
    _RichTextEditorPicker
  ) {
    babelHelpers.inherits(RichTextEditorHeadingPicker, _RichTextEditorPicker);
    function RichTextEditorHeadingPicker() {
      var _this;
      babelHelpers.classCallCheck(this, RichTextEditorHeadingPicker);
      _this = babelHelpers.possibleConstructorReturn(
        this,
        babelHelpers.getPrototypeOf(RichTextEditorHeadingPicker).call(this)
      );
      _this.command = "formatBlock";
      _this.icon = null;
      _this.label = "Block format";
      return _this;
    } // properties available to the custom element for data binding
    babelHelpers.createClass(
      RichTextEditorHeadingPicker,
      [
        {
          key: "_getBlockOptions",
          value: function _getBlockOptions(blocks) {
            var temp = [];
            blocks.forEach(function(block) {
              temp.push([{ alt: block.label, value: block.tag }]);
            });
            return temp;
          }
        }
      ],
      [
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * The block options that can be applied
               */ blocks: {
                name: "blocks",
                type: Array,
                notify: !0,
                value: [
                  { label: "Paragraph", tag: "p" },
                  { label: "Heading 1", tag: "h1" },
                  { label: "Heading 2", tag: "h2" },
                  { label: "Heading 3", tag: "h3" },
                  { label: "Heading 4", tag: "h4" },
                  { label: "Heading 5", tag: "h5" },
                  { label: "Heading 6", tag: "h6" },
                  { label: "Preformatted", tag: "pre" }
                ]
              },
              /**
               * The command used for document.execCommand.
               */ options: {
                name: "options",
                type: Array,
                computed: "_getBlockOptions(blocks)",
                notify: !0
              },
              /**
               *
               */ block: {
                name: "block",
                type: Boolean,
                value: !0,
                readOnly: !0
              }
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
            return "rich-text-editor-heading-picker";
          }
        }
      ]
    );
    return RichTextEditorHeadingPicker;
  })(_richTextEditorPicker.RichTextEditorPicker);
  _exports.RichTextEditorHeadingPicker = RichTextEditorHeadingPicker;
  window.customElements.define(
    RichTextEditorHeadingPicker.tag,
    RichTextEditorHeadingPicker
  );
});
