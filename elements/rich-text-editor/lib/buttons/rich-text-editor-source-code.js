/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorButtonBehaviors } from "./rich-text-editor-button.js";
/**
 * `rich-text-editor-source-code`
 * a more button to toggle collapsed buttons in the rich text editor
 *
 * @element rich-text-editor-source-code
 * @demo ./demo/buttons.html
 */
class RichTextEditorSourceCode extends RichTextEditorButtonBehaviors(
  LitElement
) {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-source-code";
  }

  // render function for template
  render() {
    return super.render();
  }

  constructor() {
    super();
    this.icon = "code";
    this.toggled = false;
    this.label = "Source Code";
    this.labelToggled = "Rich Text";
    this.command = "viewSource";
    this.toggledCommand = "viewSource";
    this.commandVal = true;
    this.toggledCommandVal = false;
    this.shortcutKeys = "cmd+<";
    this.commandCallback = (editor, toolbar, selection) => {
      if (editor) {
        editor.viewSource = this.operationCommandVal;
        this.toggled = editor.viewSource;
      }
    };
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      /**
       * Can this button toggle?
       */
      toggled: {
        attribute: "toggled",
        type: Boolean,
        reflect: true,
      },
    };
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
}
window.customElements.define(
  RichTextEditorSourceCode.tag,
  RichTextEditorSourceCode
);
export { RichTextEditorSourceCode };
