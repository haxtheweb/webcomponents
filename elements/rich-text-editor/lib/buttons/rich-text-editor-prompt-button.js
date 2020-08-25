/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorButtonBehaviors } from "./rich-text-editor-button.js";
import "../singletons/rich-text-editor-selection.js";
import "../singletons/rich-text-editor-prompt.js";

const RichTextEditorPromptButtonBehaviors = function(SuperClass) {
  return class extends RichTextEditorButtonBehaviors(SuperClass) {
    /**
     * Store the tag name to make it easier to obtain directly.
     */
    static get tag() {
      return "rich-text-editor-prompt-button";
    }

    // render function for template
    render() {
      return super.render();
    }

    // properties available to the custom element for data binding
    static get properties() {
      return {
        ...super.properties,
        /**
         * fields for the prompt popover.
         */
        fields: {
          type: Array,
          reflect: true
        },
        /**
         * is the element a custom inline widget element?
         */
        inlineWidget: {
          name: "inlineWidget",
          type: Boolean
        },
        /**
         * the tag that will wrap the selected range
         */
        tag: {
          name: "tag",
          type: String
        },
        /**
         * The prefilled value of the prompt
         */
        value: {
          type: Object
        },
        /**
         * fields for the prompt popover.
         */
        __promptFields: {
          type: Array
        },
        /**
         * the contents node inside the selected range
         */
        __oldValue: {
          name: "__oldValue",
          type: Object
        },
        /**
         * the prompt that pops up when button is pressed
         */
        __prompt: {
          name: "__prompt",
          type: Object
        },
        /**
         * the contents node inside the selected range
         */
        __selectionContents: {
          name: "__selectionContents",
          type: Object
        }
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
          description: "The inner text",
          inputMethod: "textfield"
        }
      ];
      this.tag = "span";
      this.value = {
        "": null,
        id: null
      };
      this.__prompt = window.RichTextEditorPrompt.requestAvailability();
    }

    /**
     * Handles button tap
     * @param {event} e the button tap event
     */
    _buttonTap(e) {
      console.log("_buttonTap", e);
      e.preventDefault();
      console.log(this.__selection,this.__selection.innerHTML,this.range,this.range.cloneContents);
      this.__selection.addHighlight();
      this.open();
    }
    /**
     * cancels the changes
     */
    cancel() {
      this.deselect();
    }

    /**
     * updates the insertion based on fields
     */
    confirm() {
      this.updateSelection();
      this.deselect();
    }

    /**
     * deselects the text
     */
    deselect() {
      /*this.__prompt.clearTarget("");
      this.__selection.normalize();
      this.__selection.childNodes.forEach(child => {
        this.__selection.parentNode.insertBefore(child, this.__selection);
        this.__selection.range.selectNode(child);
      });
      this.__selection.range.collapse();
      this.__selection.hidden = true;*/
    }

    /**
     * Handles editor change
     * @param {string} newVal the new editor's id
     * @param {string} oldVal the old editor's id
     * @returns {void}
     */
    _editorChanged(newVal, oldVal) {
      let newEditor = newVal ? document.getElementById(newVal) : null,
        oldEditor = oldVal ? document.getElementById(oldVal) : null;
      if (newEditor)
        newEditor.addEventListener(
          "click",
          e => this._editInlineWidget(newEditor, e),
          true
        );
      if (oldEditor)
        oldEditor.removeEventListener(
          "click",
          e => this._editInlineWidget(oldEditor, e),
          true
        );
      super._editorChanged(newVal, oldVal);
    }
    /**
     *
     * @param {object} editor the active editor
     * @param {event} e the edit event
     * @returns {boolean} whether to prevent the default behavior for an inline widget
     */
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
      this.__selection.selectNode(widget);
      this.__selectionContents = widget;
    }

    /**
     * Handles selecting text and opening prompt
     */
    open() {
      this.updatePrompt();
      this.__prompt.setTarget(this);
    }

    /**
     * updates prompt fields with selected range data
     */
    updatePrompt() {
      this.range = this.__selection.range;
      this.__selectionContents = this._getSelectedBlock();
      this.__promptFields = JSON.parse(JSON.stringify(this.fields));
    }

    /**
     * updates the insertion based on fields
     */
    updateSelection() {
      this.__selectionContents = this._getSelectedBlock() || this.__selection;
      this.setRange();
      this.toggled = !this.__prompt.value;
      this.commandVal = this.__prompt.value;
      this.execCommand();
    }
    setRange(){
      this.__selection.selectRange(this.range);
    }
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
