define([
  "exports",
  "../../node_modules/@polymer/polymer/polymer-element.js",
  "./rich-text-editor-button.js"
], function(_exports, _polymerElement, _richTextEditorButton) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.RichTextEditorMoreButton = void 0;
  /**
   * Copyright 2019 Penn State University
   * @license Apache-2.0, see License.md for full text.
   */ /**
   * `rich-text-editor-more-button`
   * `a more button to toggle collapsed buttons in the rich text editor`
   *
   * @microcopy - language worth noting:
   *  -
   *
   * @customElement
   * @polymer
   */ var RichTextEditorMoreButton = /*#__PURE__*/ (function(
    _RichTextEditorButton
  ) {
    babelHelpers.inherits(RichTextEditorMoreButton, _RichTextEditorButton);
    function RichTextEditorMoreButton() {
      var _this;
      babelHelpers.classCallCheck(this, RichTextEditorMoreButton);
      _this = babelHelpers.possibleConstructorReturn(
        this,
        babelHelpers.getPrototypeOf(RichTextEditorMoreButton).call(this)
      );
      _this.label = "More buttons";
      _this.labelToggled = "Fewer buttons";
      return _this;
    } // properties available to the custom element for data binding
    babelHelpers.createClass(
      RichTextEditorMoreButton,
      [
        {
          key: "_buttonTap",
          /**
           * Fires a button tap event
           */ value: function _buttonTap(e) {
            this.dispatchEvent(
              new CustomEvent("rich-text-more-button-tap", { detail: this })
            );
          }
        }
      ],
      [
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * Can this button toggle?
               */ toggled: {
                name: "toggled",
                type: Boolean,
                value: !1,
                reflectToAttribute: !0
              },
              /**
               * The maximum size where all of the buttons display
               */ collapseMax: {
                name: "collapseMax",
                type: String,
                value: "xs",
                reflectToAttribute: !0
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
            return "rich-text-editor-more-button";
          }
        }
      ]
    );
    return RichTextEditorMoreButton;
  })(_richTextEditorButton.RichTextEditorButton);
  _exports.RichTextEditorMoreButton = RichTextEditorMoreButton;
  window.customElements.define(
    RichTextEditorMoreButton.tag,
    RichTextEditorMoreButton
  );
});
