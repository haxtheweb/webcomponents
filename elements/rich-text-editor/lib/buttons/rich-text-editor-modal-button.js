/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { RichTextEditorButtonBehaviors, RichTextToolbarStyles } from "./rich-text-editor-button.js";
import { SimpleToolbarModalButtonBehaviors } from "@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-modal-button.js";

/**
 * RichTextEditorModalButtonBehaviors
 *
 * @customElement
 * @class
 * @lit-html
 * @lit-element
 * @extends RichTextEditorButtonBehaviors
 * @extends SimpleToolbarModalButtonBehaviors
 */
const RichTextEditorModalButtonBehaviors = function (SuperClass) {
  return class extends SimpleToolbarModalButtonBehaviors(RichTextEditorButtonBehaviors(SuperClass)) {
    /**
     * Store tag name to make it easier to obtain directly.
     */
    static get tag() {
      return "rich-text-editor-modal-button";
    }

    static get styles() {
      return [...super.richTextEditorButtonStyles];
    }

    // render function for template
    render() {
      return this.simpleToolbarModalButtonRender;
    }
  };
};
/**
 * `rich-text-editor-modal-button`
 * prompts for more information for rich text editor
 * (custom buttons can extend RichTextEditorModalButton)
 *
 * @extends RichTextEditorModalButton
 * @extends LitElement
 * @customElement
 * @lit-html
 * @lit-element
 * @element rich-text-editor-modal-button
 * @demo ./demo/buttons.html
 */
class RichTextEditorModalButton extends RichTextEditorModalButtonBehaviors(
  LitElement
) {}
window.customElements.define(
  RichTextEditorModalButton.tag,
  RichTextEditorModalButton
);
export { RichTextEditorModalButtonBehaviors, RichTextEditorModalButton };
