/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { RichTextEditorButtonBehaviors } from "./rich-text-editor-button.js";
import { SimpleToolbarHelpButtonBehaviors } from "@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-help-button.js";

/**
 * `rich-text-editor-help-button`
 * prompts for more information for rich text editor
 * (custom buttons can extend RichTextEditorHelpButton)
 *
 * @extends RichTextEditorHelpButton
 * @extends LitElement
 * @customElement
 * @lit-html
 * @lit-element
 * @element rich-text-editor-help-button
 * @demo ./demo/buttons.html
 */
class RichTextEditorHelpButton extends SimpleToolbarHelpButtonBehaviors(RichTextEditorButtonBehaviors(LitElement)) {
  /**
   * Store tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-help-button";
  }

  static get styles() {
    return [...super.richTextEditorButtonStyles];
  }
  constructor(){
    super();
    this.displayMode = '2';
  }

  // render function for template
  render() {
    return this.simpleToolbarModalButtonRender;
  }
}
window.customElements.define(
  RichTextEditorHelpButton.tag,
  RichTextEditorHelpButton
);
export { RichTextEditorHelpButton };
