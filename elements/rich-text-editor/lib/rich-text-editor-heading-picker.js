/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { RichTextEditorPicker } from "./rich-text-editor-picker.js";
import "@polymer/iron-icons/editor-icons.js";
/**
 * `rich-text-editor-heading-picker`
 * `a heading picker for the rich-text-editor`
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
      blocks: {
        name: "blocks",
        type: "Array",
        notify: true,
        value: [
          { label: "Paragraph", tag: "p" },
          { label: "Heading 1", tag: "h1" },
          { label: "Heading 2", tag: "h2" },
          { label: "Heading 3", tag: "h3" },
          { label: "Heading 4", tag: "h4" },
          { label: "Heading 5", tag: "h5" },
          { label: "Heading 6", tag: "h6" },
          { label: "Preformatted", tag: "pre" }
        ]
      },

      /**
       * Label for the icon.
       */
      label: {
        name: "label",
        type: "String",
        value: "Block format"
      },
      /**
       * The command used for document.execCommand.
       */
      options: {
        name: "options",
        type: "Array",
        computed: "_getBlockOptions(blocks)",
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

  _getBlockOptions(blocks) {
    let temp = [];
    blocks.forEach(function(block) {
      temp.push([
        {
          alt: block.label,
          value: block.tag
        }
      ]);
    });
    return temp;
  }
}
window.customElements.define(
  RichTextEditorHeadingPicker.tag,
  RichTextEditorHeadingPicker
);
export { RichTextEditorHeadingPicker };
