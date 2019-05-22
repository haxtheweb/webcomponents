define([
  "exports",
  "../../node_modules/@polymer/polymer/polymer-element.js",
  "../../node_modules/@polymer/paper-tooltip/paper-tooltip.js",
  "../../node_modules/@polymer/iron-icons/iron-icons.js",
  "./rich-text-editor-button-styles.js",
  "./rich-text-editor-prompt-button.js",
  "../singletons/rich-text-editor-prompt.js"
], function(
  _exports,
  _polymerElement,
  _paperTooltip,
  _ironIcons,
  _richTextEditorButtonStyles,
  _richTextEditorPromptButton,
  _richTextEditorPrompt
) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.RichTextEditorLink = void 0;
  /**
   * Copyright 2019 Penn State University
   * @license Apache-2.0, see License.md for full text.
   */ /**
   * `rich-text-editor-link`
   * `a button for rich text editor (custom buttons can extend this)`
   *
   * @microcopy - language worth noting:
   *  -
   *
   * @customElement
   * @polymer
   */ var RichTextEditorLink = /*#__PURE__*/ (function(_RichTextEditorPrompt) {
    babelHelpers.inherits(RichTextEditorLink, _RichTextEditorPrompt);
    function RichTextEditorLink() {
      var _this;
      babelHelpers.classCallCheck(this, RichTextEditorLink);
      _this = babelHelpers.possibleConstructorReturn(
        this,
        babelHelpers.getPrototypeOf(RichTextEditorLink).call(this)
      );
      _this.fields = [
        {
          property: "",
          title: "Text",
          description: "The link text",
          inputMethod: "textfield"
        },
        {
          property: "href",
          title: "Link",
          description: "The link URL",
          inputMethod: "textfield"
        }
      ];
      _this.tag = "a";
      _this.value = { link: null };
      return _this;
    } // properties available to the custom element for data binding
    babelHelpers.createClass(RichTextEditorLink, null, [
      {
        key: "properties",
        get: function get() {
          return {};
        }
        /**
         * Store the tag name to make it easier to obtain directly.
         * @notice function name must be here for tooling to operate correctly
         */
      },
      {
        key: "tag",
        get: function get() {
          return "rich-text-editor-link";
        }
      }
    ]);
    return RichTextEditorLink;
  })(_richTextEditorPromptButton.RichTextEditorPromptButton);
  _exports.RichTextEditorLink = RichTextEditorLink;
  window.customElements.define(RichTextEditorLink.tag, RichTextEditorLink);
});
