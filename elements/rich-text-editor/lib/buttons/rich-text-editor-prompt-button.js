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
         * is element a custom inline widget element?
         */
        id: {
          name: "id",
          type: String,
          reflect: true,
          attribute: "id",
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
         * prompt that pops up when button is pressed
         */
        prompt: {
          name: "prompt",
          type: Object,
        },
        /**
         * contents node inside selected range
         */
        __oldValue: {
          name: "__oldValue",
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
          property: "text",
          title: "Text",
          description: "inner text",
          inputMethod: "textfield",
        },
      ];
      this.tag = "span";
      this.value = { text: undefined };
      this.prompt = window.RichTextEditorPrompt.requestAvailability();
    }

    /**
     * Handles button tap
     * @param {event} e button tap event
     */
    _buttonTap(e) {
      e.preventDefault();
      this.open();
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
     * updates insertion based on fields
     */
    confirm() {
      this.value = this.prompt.value;
      this.updateSelection();
      this.updateToggled();
      this.updateCommandVal();
      this.sendCommand();
    }

    /**
     * gets a field value (and trims it if it's a string)
     *
     * @param {string} prop field name
     * @returns {*}
     * @memberof RichTextEditorPrompt
     */
    getPropValue(prop) {
      let val = !!this.value ? this.value : false,
        rawVal =
          !val || !val[prop]
            ? false
            : val[prop].trim
            ? val[prop].trim()
            : val[prop];
      return rawVal && rawVal !== "" ? rawVal : false;
    }

    /**
     * Handles selecting text and opening prompt
     */
    open() {
      let node = this.selectTag();
      this.value = this.getSelectionValue();
      this.prompt.fields = [...this.fields];
      this.prompt.value = { ...this.value };
      this.dispatchEvent(
        new CustomEvent("rich-text-editor-prompt-open", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        })
      );

      this.prompt.addEventListener("cancel", this.cancel);
      this.prompt.addEventListener("confirm", this.confirm);
    }

    targetNode() {
      let common =
          this.range && this.range.commonAncestorContainer
            ? this.range.commonAncestorContainer.querySelector(
                "rich-text-editor-selection"
              )
            : undefined,
        highlight = this._getSelectedNode(),
        firstChild = highlight ? highlight.firstChild : undefined,
        tag = this._getSelectedTag(),
        node =
          firstChild &&
          firstChild.tagName &&
          firstChild.tagName.toLowerCase() === this.tag
            ? firstChild
            : highlight;
      return node || common;
    }
    selectTag() {
      let node = this._getSelectedNode(),
        child =
          this.tag && node && node.children && node.children.length == 1
            ? node.querySelector(this.tag)
            : undefined,
        closest =
          !node || !this.tag ? undefined : child || node.closest(this.tag);
      if (node && closest && closest !== child) this.highlightNode(closest);
    }

    targetInnerHTML() {
      let root = this.targetNode();
      return root ? root.innerHTML : "";
    }
    setTargetInnerHTML(html) {
      let target = this.targetNode();
      if (target) target.innerHTML = html;
    }

    /**
     * updates prompt based on values passed from selection
     */
    getSelectionValue() {
      return { text: this.targetInnerHTML() || "" };
    }
    /**
     * updates commandVal based on values passed from prompt
     */
    updateCommandVal() {
      this.commandVal = this.value;
    }
    /**
     * updates selection based on values passed from prompt
     */
    updateSelection() {
      this.setTargetInnerHTML(this.getPropValue("text"));
    }
    /**
     * updates toggled based on values passed from prompt
     */
    updateToggled() {
      this.toggled = !this.value;
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
