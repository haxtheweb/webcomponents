/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/iron-icons/iron-icons.js";
import "./rich-text-editor-button-styles.js";
import { RichTextEditorPromptButton } from "./rich-text-editor-prompt-button.js";
import "./rich-text-editor-prompt.js";
/**
 * `rich-text-editor-link`
 * `a button for rich text editor (custom buttons can extend this)`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class RichTextEditorLink extends RichTextEditorPromptButton {
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
        ]
      },

      /**
       * Label for the icon.
       */
      label: {
        name: "label",
        type: "String",
        value: "Insert link"
      },
      /**
       * the text of the prompt, as in "Link href" or "Image src"
       */
      tag: {
        name: "tag",
        type: String,
        value: "a"
      },
      /**
       * The prefilled value of the prompt
       */
      value: {
        type: Object,
        value: {
          link: null
        }
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "rich-text-editor-link";
  }
  /**
   * placeholder function for prompt action
   * /
  updateSelection() {
    this.selectedText.setAttribute("href", this.value.link.trim());
    this.selectedText.innerHTML = this.value.text;
    this.deselectText(this.value.link === null || this.value.link.trim() === "");
  }*/
}
window.customElements.define(RichTextEditorLink.tag, RichTextEditorLink);
export { RichTextEditorLink };
