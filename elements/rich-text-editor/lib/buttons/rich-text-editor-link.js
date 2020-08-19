/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorPromptButton } from "./rich-text-editor-prompt-button.js";
import { RichTextEditorButtonStyles } from "./rich-text-editor-button-styles.js";
import "../singletons/rich-text-editor-prompt.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@polymer/iron-icons/iron-icons.js";
/**
 * `rich-text-editor-link`
 * `a button for rich text editor (custom buttons can extend this)`
 *
 * @element rich-text-editor-link
 */
class RichTextEditorLink extends RichTextEditorPromptButton {

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-link";
  }

  // properties available to the custom element for data binding
  static get properties() {
    return { ...super.properties };
  }
  constructor() {
    super();
    this.fields = [
      {
        property: "",
        title: "Text",
        description: "The link text",
        inputMethod: "textfield"
      },
      {
        property: "href",
        title: "Link",
        description: "The link URL. (Leave blank to remove.)",
        inputMethod: "textfield"
      }
    ];
    this.tag = "a";
    this.value = {
      link: null
    };
    this.shortcutKeys = "ctrl+k";
  }

  /**
   * an <a> tag is only needed if there is link text and an href
   * @param {object} value the prompt values
   * @returns {boolean} if the tag is needed for the element
   */
  _getTagNeeded(value) {
    return (
      value &&
      this.getCleanValue("") &&
      this.getCleanValue("") !== "" &&
      this.getCleanValue("href") &&
      this.getCleanValue("href") !== null
    );
  }
}
window.customElements.define(RichTextEditorLink.tag, RichTextEditorLink);
export { RichTextEditorLink };
