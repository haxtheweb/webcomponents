define([
  "exports",
  "../../node_modules/@polymer/polymer/polymer-element.js",
  "./rich-text-editor-button.js",
  "../../node_modules/@polymer/paper-tooltip/paper-tooltip.js",
  "../../node_modules/@polymer/iron-icons/iron-icons.js",
  "../singletons/rich-text-editor-selection.js",
  "../singletons/rich-text-editor-prompt.js",
  "./rich-text-editor-button-styles.js"
], function(
  _exports,
  _polymerElement,
  _richTextEditorButton,
  _paperTooltip,
  _ironIcons,
  _richTextEditorSelection,
  _richTextEditorPrompt,
  _richTextEditorButtonStyles
) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.RichTextEditorPromptButton = void 0;
  /**
   * Copyright 2019 Penn State University
   * @license Apache-2.0, see License.md for full text.
   */ /**
   * `rich-text-editor-prompt-button`
   * `a button that prompts for more information for rich text editor (custom buttons can extend this)`
   *
   * @microcopy - language worth noting:
   *  -
   *
   * @customElement
   * @polymer
   */ var RichTextEditorPromptButton = /*#__PURE__*/ (function(
    _RichTextEditorButton
  ) {
    babelHelpers.inherits(RichTextEditorPromptButton, _RichTextEditorButton);
    function RichTextEditorPromptButton() {
      babelHelpers.classCallCheck(this, RichTextEditorPromptButton);
      return babelHelpers.possibleConstructorReturn(
        this,
        babelHelpers.getPrototypeOf(RichTextEditorPromptButton).call(this)
      );
    } // properties available to the custom element for data binding
    babelHelpers.createClass(
      RichTextEditorPromptButton,
      [
        {
          key: "ready",
          /**
           * life cycle, element is ready
           */ value: function ready() {
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(
                  RichTextEditorPromptButton.prototype
                ),
                "ready",
                this
              )
              .call(this);
            var root = this;
            this.__prompt = window.RichTextEditorPrompt.requestAvailability();
            this.__selection = window.RichTextEditorSelection.requestAvailability();
          }
          /**
           * Handles button tap;
           */
        },
        {
          key: "_buttonTap",
          value: function _buttonTap(e) {
            e.preventDefault();
            this.open();
          }
          /**
           * updates prompt fields with selection data
           */
        },
        {
          key: "updatePrompt",
          value: function updatePrompt() {
            var _this = this;
            this.fields.forEach(function(field) {
              if (field.property && "" !== field.property) {
                _this.value[
                  field.property
                ] = _this.__selectionContents.getAttribute(field.property);
              } else if (field.property && "" !== field.property) {
                _this.value[
                  field.slot
                ] = _this.__selectionContents.querySelector(field.slot);
              } else {
                _this.value[""] = _this.__selectionContents.innerHTML;
              }
            });
          }
          /**
           * updates the insertion based on fields
           */
        },
        {
          key: "updateSelection",
          value: function updateSelection() {
            var _this2 = this,
              hasTag = !1;
            this.__selectionContents.innerHTML = "";
            this.fields.forEach(function(field) {
              if (field.property && "" !== field.property) {
                if (
                  null !== _this2.value[field.property] &&
                  "" !== _this2.value[field.property].trim()
                )
                  hasTag = !0;
                _this2.__selectionContents.setAttribute(
                  field.property,
                  _this2.value[field.property].trim()
                );
              } else if (
                field.slot &&
                "" !== field.slot &&
                null !== _this2.value[field.slot] &&
                "" !== _this2.value[field.slot].trim()
              ) {
                hasTag = !0;
                _this2.__selectionContents.innerHTML += ""
                  .concat(field.slot)
                  .concat(_this2.value[field.slot].trim())
                  .concat(field.slot);
              } else {
                _this2.__selectionContents.innerHTML += "".concat(
                  _this2.value[field.property]
                );
              }
            });
            if (!hasTag) this.__selection.unwrap();
          }
          /**
           * updates the insertion based on fields
           */
        },
        {
          key: "confirm",
          value: function confirm() {
            this.updateSelection();
            this.__selection.removeHighlight();
          }
          /**
           * updates the insertion based on fields
           */
        },
        {
          key: "cancel",
          value: function cancel() {
            this.__selection.innerHTML = "";
            while (this.__revertContents.firstChild) {
              this.__selection.appendChild(this.__revertContents.firstChild);
            }
            this.__selection.normalize();
            this.__revertContents.remove();
            this.__selection.removeHighlight();
          }
          /**
           * Handles selecting text and opening prompt
           */
        },
        {
          key: "open",
          value: function open() {
            this.__revertContents = document.createElement("div");
            this.__revertContents.appendChild(
              this.__selection.getRangeContents()
            );
            this.__selectionContents = this.__selection.wrapOrGetTag(this.tag);
            this.__selection.addHighlight();
            this.updatePrompt(); //make sure there is a unique id so that the prompt popover appears near the selection
            if (!this.__selectionContents.getAttribute("id"))
              this.__selectionContents.setAttribute(
                "id",
                "prompt" + Date.now()
              );
            this.__prompt.setTarget(this);
            this.dispatchEvent(new CustomEvent("select", { detail: this }));
          }
        }
      ],
      [
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * fields for the prompt popover.
               */ fields: {
                type: Array,
                value: [
                  {
                    property: "text",
                    title: "Text",
                    description: "The link text",
                    inputMethod: "textfield"
                  }
                ]
              },
              /**
               * the tag that will wrap the selection
               */ tag: { name: "tag", type: String, value: "span" },
              /**
               * The prefilled value of the prompt
               */ value: { type: Object, value: { link: null } },
              /**
               * the prompt that pops up when button is pressed
               */ __prompt: { name: "__prompt", type: Object, value: null },
              /**
               * the highlight surrounding the selected range
               */ __selection: {
                name: "__selection",
                type: Object,
                value: null
              },
              /**
               * the contents node inside the selected range
               */ __selectionContents: {
                name: "__selectionContents",
                type: Object,
                value: null
              },
              /**
               * the contents node inside the selected range
               */ __revertContents: {
                name: "__revertContents",
                type: Object,
                value: null
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
            return "rich-text-editor-prompt-button";
          }
        }
      ]
    );
    return RichTextEditorPromptButton;
  })(_richTextEditorButton.RichTextEditorButton);
  _exports.RichTextEditorPromptButton = RichTextEditorPromptButton;
  window.customElements.define(
    RichTextEditorPromptButton.tag,
    RichTextEditorPromptButton
  );
});
