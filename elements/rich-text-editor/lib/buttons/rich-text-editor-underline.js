/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { RichTextEditorPromptButton } from "./rich-text-editor-prompt-button.js";
/**
 * `rich-text-editor-underline`
 * `a button for rich text editor (custom buttons can extend this)`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class RichTextEditorUnderline extends RichTextEditorPromptButton {
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
        property: "tag",
        title: "Underline despite usability issues",
        description:
          "Underlines can be confused with links on the web. To prevent usability issues, we recommend using italics instead.",
        inputMethod: "boolean"
      }
    ];
    this.tag = "u";
    this.icon = "editor:format-underlined";
    this.label = "Underline (not recommended)";
    this.toggles = true;
    this.command = "underline";
    this.value = {
      tag: false
    };
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {};
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "rich-text-editor-underline";
  }

  /**
   * a <u> tag is only needed if there is text content
   * and the tag usability warning is confirmed
   * @param {object} value the prompt values
   * @returns {boolean} if the tag is needed for the element
   */
  _getTagNeeded(value) {
    return (
      value &&
      this.getCleanValue("") &&
      this.getCleanValue("") !== "" &&
      this.getCleanValue("tag") &&
      this.getCleanValue("tag")
    );
  }
}
window.customElements.define(
  RichTextEditorUnderline.tag,
  RichTextEditorUnderline
);
export { RichTextEditorUnderline };
