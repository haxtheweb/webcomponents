/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { HAXStore } from "./hax-store.js";
import { RichTextEditorButtonBehaviors } from "@haxtheweb/rich-text-editor/lib/buttons/rich-text-editor-button.js";
/**
 * `hax-text-editor-paste-button`
 * a link button for rich text editor
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @extends RichTextEditorPromptButtonBehaviors
 * @extends LitElement
 * @element hax-text-editor-paste-button
 * @demo ./demo/buttons.html
 */
class HaxTextEditorPasteButton extends RichTextEditorButtonBehaviors(
  LitElement,
) {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "hax-text-editor-paste-button";
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
    if (navigator && globalThis.navigator.clipboard)
      HAXStore._onPaste({
        ...e,
        clipboardData: globalThis.navigator.clipboard,
      });
  }
}
customElements.define(HaxTextEditorPasteButton.tag, HaxTextEditorPasteButton);
export { HaxTextEditorPasteButton };
