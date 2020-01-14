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

 * @polymer
 */
class RichTextEditorHeadingPicker extends RichTextEditorPicker {
  constructor() {
    super();
    this.command = "formatBlock";
    this.icon = null;
    this.label = "Block format";
    this.allowNull = true;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * The block options that can be applied
       */
      blocks: {
        name: "blocks",
        type: Array,
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
       * The command used for document.execCommand.
       */
      options: {
        name: "options",
        type: Array,
        computed: "_getBlockOptions(blocks)",
        notify: true
      },

      /**
       *
       */
      block: {
        name: "block",
        type: Boolean,
        value: true,
        readOnly: true
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-heading-picker";
  }

  _getBlockOptions(blocks) {
    let temp = [[{ alt: this.label, value: null }]];
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
