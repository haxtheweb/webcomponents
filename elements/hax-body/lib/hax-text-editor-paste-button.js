/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { HAXStore } from "./hax-store.js";
import { RichTextEditorButtonBehaviors } from "@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-button.js";
/**
 * `rich-text-editor-unlink`
 * a link button for rich text editor
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @extends RichTextEditorPromptButtonBehaviors
 * @extends LitElement
 * @element rich-text-editor-unlink
 * @demo ./demo/buttons.html
 */
class RichTextEditorUnlink extends RichTextEditorButtonBehaviors(LitElement) {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-unlink";
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
    this.command = "paste";
    this.icon = "content-paste";
    this.label = "Paste Clipboard";
  }
  sendCommand(e) {
    if (navigator && navigator.clipboard)
      HAXStore._onPaste({ ...e, clipboardData: navigator.clipboard });
  }
}
window.customElements.define(RichTextEditorUnlink.tag, RichTextEditorUnlink);
export { RichTextEditorUnlink };
