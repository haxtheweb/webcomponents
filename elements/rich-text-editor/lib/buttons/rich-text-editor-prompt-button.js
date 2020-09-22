/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorButtonBehaviors } from "./rich-text-editor-button.js";
import "../singletons/rich-text-editor-selection.js";
import "../singletons/rich-text-editor-prompt.js";

const RichTextEditorPromptButtonBehaviors = function (SuperClass) {
  return class extends RichTextEditorButtonBehaviors(SuperClass) {
    /**
     * Store tag name to make it easier to obtain directly.
     */
    static get tag() {
      return "rich-text-editor-prompt-button";
    }

    // render function for template
    render() {
      return super.render();
    }

    // properties available to custom element for data binding
    static get properties() {
      return {
        ...super.properties,
        /**
         * fields for prompt popover.
         */
        fields: {
          type: Array,
        },
        /**
         * is element a custom inline widget element?
         */
        inlineWidget: {
          name: "inlineWidget",
          type: Boolean,
        },
        /**
         * tag that will wrap selected range
         */
        tag: {
          name: "tag",
          type: String,
        },
        /**
         * prefilled value of prompt
         */
        value: {
          type: Object,
        },
        /**
         * fields for prompt popover.
         */
        __promptFields: {
          type: Array,
        },
        /**
         * contents node inside selected range
         */
        __oldValue: {
          name: "__oldValue",
          type: Object,
        },
        /**
         * prompt that pops up when button is pressed
         */
        __prompt: {
          name: "__prompt",
          type: Object,
        },
      };
    }
    constructor() {
      super();
      this.editableSelection = false;
      this.inlineWidget = false;
      this.fields = [
        {
          slot: "",
          title: "Text",
          description: "inner text",
          inputMethod: "textfield",
        },
      ];
      this.tag = "span";
      this.value = {
        "": null,
        id: null,
      };
      this.__prompt = window.RichTextEditorPrompt.requestAvailability();
    }

    /**
     * Handles button tap
     * @param {event} e button tap event
     */
    _buttonTap(e) {
      e.preventDefault();
      let block = this._getSelectedBlock();
      if (block) {
        this.selectNode(block);
      } else {
        this.__selection.wrap();
      }
      //this.addHighlight();
      this.range = this.__selection.range;
      this.open();
    }
    /**
     * cancels changes
     */
    cancel() {}

    /**
     * updates insertion based on fields
     */
    confirm() {
      this.toggled = !this.__prompt.value;
      this.commandVal = this.__prompt.value;
      this._buttonExec();
    }

    /**
     * Handles editor change
     * @param {string} newVal new editor's id
     * @param {string} oldVal old editor's id
     * @returns {void}
     * /
    _editorChanged(newVal, oldVal) {
      let newEditor = newVal ? document.getElementById(newVal) : null,
        oldEditor = oldVal ? document.getElementById(oldVal) : null;
      if (newEditor)
        newEditor.addEventListener(
          "click",
          (e) => this._editInlineWidget(newEditor, e),
          true
        );
      if (oldEditor)
        oldEditor.removeEventListener(
          "click",
          (e) => this._editInlineWidget(oldEditor, e),
          true
        );
      super._editorChanged(newVal, oldVal);
    }
    /**
     *
     * @param {object} editor active editor
     * @param {event} e edit event
     * @returns {boolean} whether to prevent default behavior for an inline widget
     * /
    _editInlineWidget(editor, e) {
      if (
        editor.getAttribute("contenteditable") &&
        this.inlineWidget &&
        e.target.tagName &&
        e.target.tagName.toLowerCase() === this.tag
      ) {
        e.stopPropagation();
        e.preventDefault();
        this.selectWidget(e.target);
        this.open();
        return false;
      } else {
        return true;
      }
    }

    selectWidget(widget) {
      this.selectNode(widget);
      this.__selectionContents = widget;
    }

    /**
     * Handles selecting text and opening prompt
     */
    open() {
      let node = this._getSelectedBlock(this.tag);
      console.log("block", node, this.tag);

      if (node) {
        this.__selection.selectNode(node);
      } else {
        this.__selection.wrap();
      }
      this.updatePrompt();
      this.__prompt.setTarget(this);
    }

    updatePrompt() {}
  };
};
/**
 * `rich-text-editor-prompt-button`
 * a button that prompts for more information for rich text editor (custom buttons can extend this)
 *
 * @element rich-text-editor-prompt-button
 * @demo ./demo/buttons.html
 */
class RichTextEditorPromptButton extends RichTextEditorPromptButtonBehaviors(
  LitElement
) {}
window.customElements.define(
  RichTextEditorPromptButton.tag,
  RichTextEditorPromptButton
);
export { RichTextEditorPromptButton, RichTextEditorPromptButtonBehaviors };
