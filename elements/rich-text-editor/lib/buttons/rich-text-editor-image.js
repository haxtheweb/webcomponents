/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { RichTextEditorPromptButtonBehaviors } from "./rich-text-editor-prompt-button.js";
/**
 * `rich-text-editor-image`
 * an inline image button for rich text editor
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @extends RichTextEditorPromptButtonBehaviors
 * @extends LitElement
 * @element rich-text-editor-image
 * @demo ./demo/buttons.html
 */
class RichTextEditorImage extends RichTextEditorPromptButtonBehaviors(
  LitElement,
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
   * overrides RichTextEditorPromptButtonBehaviors
   * so that isToggled is based on toggled property
   *
   * @readonly
   * @memberof RichTextEditorImage
   */
  get isToggled() {
    return this.toggled;
  }

  /**
   * overrides RichTextEditorPromptButtonBehaviors
   * to customize for setting image properties
   *
   * @param {object} node selected node
   * @memberof RichTextEditorImage
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
   * overrides RichTextEditorPromptButtonBehaviors
   * to customize for getting selected image properties
   *
   * @param {object} node selected node
   * @memberof RichTextEditorImage
   */
  getValue() {
    return !this.targetedNode
      ? undefined
      : {
          alt: !this.targetedNode
            ? undefined
            : this.targetedNode.getAttribute("alt"),
          src: !this.targetedNode
            ? undefined
            : this.targetedNode.getAttribute("src"),
          width: !this.targetedNode
            ? undefined
            : this.targetedNode.getAttribute("width"),
          height: !this.targetedNode
            ? undefined
            : this.targetedNode.getAttribute("height"),
        };
  }
  /**
   * overrides RichTextEditorPickerBehaviors
   * sets toggle based on whether an image is selected
   *
   * @memberof RichTextEditorLink
   */
  setToggled() {
    this.toggled = !!this.value;
  }
}
customElements.define(RichTextEditorImage.tag, RichTextEditorImage);
export { RichTextEditorImage };
