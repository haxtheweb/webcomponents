/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { RichTextEditorPickerBehaviors } from "./rich-text-editor-picker.js";
/**
 * `rich-text-editor-heading-picker`
 * a heading picker for the rich-text-editor
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @extends RichTextEditorPickerBehaviors
 * @extends LitElement
 * @element rich-text-editor-heading-picker
 * @demo ./demo/buttons.html
 */
class RichTextEditorHeadingPicker extends RichTextEditorPickerBehaviors(
  LitElement,
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
    this.hideNullOption = true;
    this.blocks = [
      { label: "Paragraph", tag: "p" },
      { label: "Heading 1", tag: "h1" },
      { label: "Heading 2", tag: "h2" },
      { label: "Heading 3", tag: "h3" },
      { label: "Heading 4", tag: "h4" },
      { label: "Heading 5", tag: "h5" },
      { label: "Heading 6", tag: "h6" },
      { label: "Blockquote", tag: "blockquote" },
      { label: "Preformatted", tag: "pre" },
    ];
    this.command = "formatBlock";
    this.icon = undefined;
    this.label = "Block format";
    this.tagsList = "p,h1,h2,h3,h4,h5,h6,div,address,blockquote,pre";
    this.titleAsHtml = undefined;
  }

  get labelVisibleClass() {
    return "hide";
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "blocks") this._setOptions();
    });
  }

  /**
   * sets picker's value based ion current selected range
   */
  _setRangeValue() {
    let ancestor = this.rangeOrMatchingAncestor(),
      tag = ancestor ? ancestor.tagName : "",
      val = tag.toLowerCase();
    if (this.shadowRoot) {
      if (this.tagsArray.includes(val)) {
        this.shadowRoot.querySelector("#button").value = val;
      } else if (!this.range || this.range.collapsed) {
        this.shadowRoot.querySelector("#button").value = undefined;
      }
    }
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
        type: Array,
      },
    };
  }

  /**
   * overrides RichTextEditorPickerBehaviors
   * to populate picker with allowable blocks
   *
   * @memberof RichTextEditorHeadingPicker
   */
  _setOptions() {
    this.tagsList = this.blocks.map((block) => block.tag).join(",");
    this.options = [
      [{ alt: this.label, value: null }],
      ...this.blocks.map((block) => [{ alt: block.label, value: block.tag }]),
    ];
  }
}
customElements.define(
  RichTextEditorHeadingPicker.tag,
  RichTextEditorHeadingPicker,
);
export { RichTextEditorHeadingPicker };
