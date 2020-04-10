/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@polymer/iron-icons/iron-icons.js";
import "./rich-text-editor-button-styles.js";
import { RichTextEditorPromptButton } from "./rich-text-editor-prompt-button.js";
import "../singletons/rich-text-editor-prompt.js";
/**
 * `rich-text-editor-image`
 * `an inline image button for rich text editor`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @polymer
 */
class RichTextEditorImage extends RichTextEditorPromptButton {
  constructor() {
    super();
    this.fields = [
      {
        property: "alt",
        title: "Alt Text",
        description: "The alt text",
        inputMethod: "textfield"
      },
      {
        property: "src",
        title: "Image URL",
        description: "The image URL. (Leave blank to remove.)",
        inputMethod: "textfield"
      }
    ];
    this.tag = "img";
    this.value = {
      src: null,
      alt: null
    };
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {};
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-image";
  }

  /**
   * an <a> tag is only needed if there is link text and an href
   * @param {object} value the prompt values
   * @returns {boolean} if the tag is needed for the element
   */
  _getTagNeeded(value) {
    return (
      value && this.getCleanValue("src") && this.getCleanValue("src") !== null
    );
  }
}
window.customElements.define(RichTextEditorImage.tag, RichTextEditorImage);
export { RichTextEditorImage };
