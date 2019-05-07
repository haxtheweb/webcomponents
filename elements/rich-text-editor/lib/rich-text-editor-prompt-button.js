/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/iron-icons/iron-icons.js";
import "./rich-text-editor-toolbar-styles.js";
import { RichTextEditorButton } from "./rich-text-editor-button.js";
import "./rich-text-editor-prompt.js";
import "./rich-text-editor-selection.js";
import { RichTextEditorSelection } from "./rich-text-editor-selection.js";
/**
 * `rich-text-editor-prompt-button`
 * `a button that prompts for more information for rich text editor (custom buttons can extend this)`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class RichTextEditorPromptButton extends RichTextEditorButton {
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * fields for the prompt popover.
       */
      fields: {
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
       * the selected text of the prompt
       */
      selectedText: {
        name: "selectedText",
        type: Object,
        value: null
      },
      /**
       * the tag that will wrap the selection
       */
      tag: {
        name: "tag",
        type: String,
        value: "span"
      },
      /**
       * The prefilled value of the prompt
       */
      value: {
        type: Object,
        value: {
          link: null
        }
      },
      /**
       * the rich-text-selection object thart highlights the text
       */
      __highlight: {
        name: "__highlight",
        type: Object,
        value: null
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "rich-text-editor-prompt-button";
  }

  /**
   * life cycle, element is ready
   */
  ready() {
    super.ready();
    let root = this;
    this.__popover = window.richTextEditorPrompt.requestAvailability();
  }
  /**
   * Handles button tap;
   */
  _buttonTap(e) {
    e.preventDefault();
    this.selectText();
    this.__popover.setTarget(this);
  }
  /**
   * Handles selecting text and opening prompt
   * @param {boolean} whether or not the selection should be unwrapped from a tag
   */
  deselectText(unwrap = false) {
    console.log(
      "deselectText",
      this.__highlight,
      this.selection,
      this.selectedText,
      unwrap
    );
    if (this.__highlight) this.__highlight.deselect(this.selectedText, unwrap);
    this.__highlight = undefined;
    this.value = {};
    this.selectedText = null;
    this.dispatchEvent(new CustomEvent("deselect", { detail: this }));
  }
  /**
   * updates prompt fields with selection data
   */
  updatePrompt() {
    this.fields.forEach(field => {
      if (field.property && field.property !== "") {
        this.value[field.property] = this.selectedText.getAttribute(
          field.property
        );
      } else if (field.property && field.property !== "") {
        this.value[field.slot] = this.selectedText.querySelector(field.slot);
      } else {
        this.value[""] = this.selectedText.innerHTML;
      }
    });
  }
  /**
   * updates the insertion based on fields
   */
  updateSelection() {
    /**
     * this.selectedText.setAttribute("href", this.value.link.trim());
     * this.selectedText.innerHTML = this.value.text;
     */
    let hasVals = false;
    this.selectedText.innerHTML = ``;
    this.fields.forEach(field => {
      if (field.property && field.property !== "") {
        if (
          this.value[field.property] !== null &&
          this.value[field.property].trim() !== ""
        )
          hasVals = true;
        this.selectedText.setAttribute(
          field.property,
          this.value[field.property].trim()
        );
      } else if (
        field.slot &&
        field.slot !== "" &&
        this.value[field.slot] !== null &&
        this.value[field.slot].trim() !== ""
      ) {
        hasVals = true;
        this.selectedText.innerHTML += `${field.slot}${this.value[
          field.slot
        ].trim()}${field.slot}`;
      } else {
        this.selectedText.innerHTML += `${this.value[field.property]}`;
      }
    });
    this.deselectText(!hasVals);
  }
  /**
   * Handles selecting text and opening prompt
   */
  selectText() {
    let sel = this.selection.commonAncestorContainer;
    let parent =
      sel.tagName !== undefined &&
      sel.tagName.toLowerCase() === this.tag.toLowerCase()
        ? sel
        : sel.parentNode;
    if (parent.tagName.toLowerCase() === this.tag.toLowerCase()) {
      //if the selection is wrapped in this tag, no need to make a new one
      this.selectedText = parent;
    } else {
      //if not, wrap the selection in this tag
      this.selectedText = document.createElement(this.tag.toLowerCase());
      this.selectedText.appendChild(this.selection.extractContents());
    }
    //highlight the selection for when prompt gets focus
    this.__highlight = document.createElement("rich-text-editor-selection");
    this.__highlight.select(this.selection, this.selectedText);
    console.log(
      "selectText",
      this.__highlight,
      this.selection,
      this.selectedText
    );
    this.updatePrompt();
    //make sure there is a unique id so that the prompt popover appears near the selection
    if (!this.selectedText.getAttribute("id"))
      this.selectedText.setAttribute("id", "prompt" + Date.now());
    this.dispatchEvent(new CustomEvent("select", { detail: this }));
  }
}
window.customElements.define(
  RichTextEditorPromptButton.tag,
  RichTextEditorPromptButton
);
export { RichTextEditorPromptButton };
