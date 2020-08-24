/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorPickerBehaviors } from "./rich-text-editor-picker.js";
/**
 * `rich-text-editor-heading-picker`
 * a heading picker for the rich-text-editor
 *
 * @element rich-text-editor-heading-picker
 * @demo ./demo/buttons.html
 */
class RichTextEditorHeadingPicker extends RichTextEditorPickerBehaviors(
  LitElement
) {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-heading-picker";
  }

  static get styles() {
    return [...super.styles];
  }

  // render function for template
  render() {
    return super.render();
  }

  constructor() {
    super();
    this.allowNull = true;
    this.blocks = [
      { label: "Paragraph", tag: "p" },
      { label: "Heading 1", tag: "h1" },
      { label: "Heading 2", tag: "h2" },
      { label: "Heading 3", tag: "h3" },
      { label: "Heading 4", tag: "h4" },
      { label: "Heading 5", tag: "h5" },
      { label: "Heading 6", tag: "h6" },
      { label: "Preformatted", tag: "pre" }
    ];
    this.command = "formatBlock";
    this.icon = null;
    this.label = "Block format";
  }

  // properties available to the custom element for data binding
  static get properties() {
    let props = super.properties;
    delete props.block;
    return {
      ...props,
      /**
       * block element options as array of objects, 
       * eg. [ { label: "Paragraph", tag: "p" }, { label: "Heading 1", tag: "h1" }, ...]
       * 
       */
      blocks: {
        name: "blocks",
        type: Array
      }
    };
  }

  /**
   * populates the picker
   */
  _setOptions() {
    this.tag = this.blocks.map(block => block.tag).join(",");
    this.options = [
      [{ alt: this.label, value: null }],
      ...this.blocks.map(block => [{ alt: block.label, value: block.tag }])
    ];
  }
}
window.customElements.define(
  RichTextEditorHeadingPicker.tag,
  RichTextEditorHeadingPicker
);
export { RichTextEditorHeadingPicker };
