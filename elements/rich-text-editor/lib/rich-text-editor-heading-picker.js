/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { RichTextEditorPicker } from "./rich-text-editor-picker.js";
import "@polymer/iron-icons/editor-icons.js";
/**
 * `rich-text-editor-heading-picker`
 * `a button for rich text editor (custom buttons can extend this)`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class RichTextEditorHeadingPicker extends RichTextEditorPicker {
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Allow a null option to be selected?
       */
      allowNull: {
        name: "allowNull",
        type: "Boolean",
        value: false
      },
      /**
       * The command used for document.execCommand.
       */
      command: {
        name: "command",
        type: "String",
        value: "formatBlock",
        readOnly: true
      },
      /**
       * The command used for document.execCommand.
       */
      options: {
        name: "options",
        type: "Array",
        value: [
          [{ alt: "Paragraph", value: "p" }],
          [{ alt: "Heading 1", value: "h1" }],
          [{ alt: "Heading 2", value: "h2" }],
          [{ alt: "Heading 3", value: "h3" }],
          [{ alt: "Heading 4", value: "h4" }],
          [{ alt: "Heading 5", value: "h5" }],
          [{ alt: "Heading 6", value: "h6" }]
        ],
        notify: true
      },

      /**
       * Renders html as title. (Good for titles with HTML in them.)
       */
      titleAsHtml: {
        name: "titleAsHtml",
        type: "Boolean",
        value: false
      },

      /**
       *
       */
      wrap: {
        name: "wrap",
        type: "Boolean",
        value: true,
        readOnly: true
      },

      /**
       *
       */
      block: {
        name: "block",
        type: "Boolean",
        value: true,
        readOnly: true
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "rich-text-editor-heading-picker";
  }
}
window.customElements.define(
  RichTextEditorHeadingPicker.tag,
  RichTextEditorHeadingPicker
);
export { RichTextEditorHeadingPicker };
