/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { RichTextEditorButtonBehaviors } from "./rich-text-editor-button.js";
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
    this.command = "unlink";
    this.icon = "mdextra:unlink";
    this.label = "Remove Link";
    this.tagsList = "a";
    this.shortcutKeys = "ctrl+k";
  }

  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "range")
        if (this.commandIsToggled) {
          this.setAttribute("disabeld", "disabled");
        } else {
          this.removeAttribute("disabeld");
        }
    });
  }
}
customElements.define(RichTextEditorUnlink.tag, RichTextEditorUnlink);
export { RichTextEditorUnlink };
