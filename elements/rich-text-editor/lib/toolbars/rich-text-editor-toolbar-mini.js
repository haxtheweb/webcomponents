/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { RichTextEditorToolbarBehaviors } from "./rich-text-editor-toolbar.js";
import "@haxtheweb/absolute-position-behavior/absolute-position-behavior.js";
/**
 * `rich-text-editor-toolbar-mini`
 * `a mini floating toolbar for the rich text editor`
 *
 * @customElement
 * @extends RichTextEditorToolbarBehaviors
 * @extends LitElement
 * @lit-html
 * @lit-element
 * @element rich-text-editor-toolbar-mini
 * @demo ./demo/mini.html mini floating toolbar
 */
class RichTextEditorToolbarMini extends RichTextEditorToolbarBehaviors(
  LitElement,
) {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-toolbar-mini";
  }

  static get styles() {
    return [...super.baseStyles, ...super.miniStyles];
  }

  // properties available to the custom element for data binding
  render() {
    return html` ${super.miniTemplate} `;
  }

  constructor() {
    super();
    this.sticky = false;
    this.config = this.miniConfig;
  }
  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      //disable sticky for mini
      if (propName === "sticky" && this.sticky) this.sticky = false;
    });
  }
}
export { RichTextEditorToolbarMini };

customElements.define(RichTextEditorToolbarMini.tag, RichTextEditorToolbarMini);
