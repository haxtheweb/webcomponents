/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorPromptButtonBehaviors } from "./rich-text-editor-prompt-button.js";
/**
 * `rich-text-editor-image`
 * an inline image button for rich text editor
 *
 * @element rich-text-editor-image
 * @demo ./demo/buttons.html
 */
class RichTextEditorImage extends RichTextEditorPromptButtonBehaviors(
  LitElement
) {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-image";
  }

  // render function for template
  render() {
    return super.render();
  }

  // properties available to the custom element for data binding
  static get properties() {
    return { ...super.properties };
  }

  constructor() {
    super();
    this.fields = [
      {
        property: "src",
        title: "Image URL",
        description: "The image URL. (Leave blank to remove.)",
        inputMethod: "textfield",
      },
      {
        property: "alt",
        title: "Alt Text",
        inputMethod: "textfield",
      },
      {
        property: "width",
        title: "Width",
        inputMethod: "textfield",
        inline: true,
      },
      {
        property: "height",
        title: "Height",
        inputMethod: "textfield",
        inline: true,
      },
    ];
    this.command = "insertHTML";
    this.label = "Insert Inline Image";
    this.icon = "editor:insert-photo";
    this.tagsList = "img";
    this.value = {};
  }

  /**
   * whether button is toggled
   *
   * @readonly
   * @memberof RichTextEditorButton
   */
  get isToggled() {
    return this.toggled;
  }

  /**
   * determaines commandVal based on values passed from prompt
   */
  get promptCommandVal() {
    let alt = this.getPropValue("alt"),
      src = this.getPropValue("src"),
      width = this.getPropValue("width"),
      height = this.getPropValue("height");
    return !src
      ? ""
      : `<img src="${src}"${!alt ? "" : ` alt="${alt}"`}${
          !width ? "" : ` width="${width}"`
        }${!height ? "" : ` width="${height}"`}>`;
  }

  /**
   * updates prompt fields with selected range data
   */
  getValue(node) {
    let img = node || this.rangeQuery();
    return !img
      ? undefined
      : {
          alt: !img ? undefined : img.getAttribute("alt"),
          src: !img ? undefined : img.getAttribute("src"),
          width: !img ? undefined : img.getAttribute("width"),
          height: !img ? undefined : img.getAttribute("height"),
        };
  }
  setToggled() {
    this.toggled = !!this.value;
  }
}
window.customElements.define(RichTextEditorImage.tag, RichTextEditorImage);
export { RichTextEditorImage };
