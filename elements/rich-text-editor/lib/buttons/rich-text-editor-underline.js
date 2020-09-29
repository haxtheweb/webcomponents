/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorPromptButtonBehaviors } from "./rich-text-editor-prompt-button.js";
/**
 * `rich-text-editor-underline`
 * a button for rich text editor (custom buttons can extend this)
 *
 * @element rich-text-editor-underline
 * @demo ./demo/buttons.html
 */
class RichTextEditorUnderline extends RichTextEditorPromptButtonBehaviors(
  LitElement
) {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-underline";
  }

  // render function for template
  render() {
    return super.render();
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
    };
  }
  constructor() {
    super();
    this.fields = [
      {
        property: "confirm",
        title: "Underline (not recommended)",
        description:
          "Underlines can be confused with links. Use italics instead.",
        inputMethod: "boolean",
      },
    ];
    this.tag = "u";
    this.icon = "editor:format-underlined";
    this.label = "Underline (not recommended)";
    this.toggles = true;
    this.command = "underline";
    this.shortcutKeys = "ctrl+u";
    this.value = {
      confirm: false,
    };
  }
  get blockSelectors() {
    return "u";
  }

  /**
   * determaines commandVal based on values passed from prompt
   */
  get promptCommandVal() {
    this.commandVal = undefined;
  }

  /**
   * updates prompt fields with selected range data
   */
  getValue() {
    return { confirm: !!this.toggled };
  }
  setToggled() {
    this.toggled = !!this.getPropValue("confirm");
  }
}
window.customElements.define(
  RichTextEditorUnderline.tag,
  RichTextEditorUnderline
);
export { RichTextEditorUnderline };
