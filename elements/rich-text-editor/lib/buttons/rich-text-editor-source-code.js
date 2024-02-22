/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { RichTextEditorButtonBehaviors } from "./rich-text-editor-button.js";
/**
 * `rich-text-editor-source-code`
 * a button to toggle source code on rich text editor
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @element rich-text-editor-source-code
 * @demo ./demo/buttons.html
 */
class RichTextEditorSourceCode extends RichTextEditorButtonBehaviors(
  LitElement,
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
    this.initViewSource();
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      /**
       * Is this button toggle?
       */
      toggled: {
        attribute: "toggled",
        type: Boolean,
        reflect: true,
      },
    };
  }

  /**
   * whether not button is toggled based on toggled property
   * overriden from RichTextEditorButtonBehaviors
   * @readonly
   * @memberof RichTextEditorSourceCode
   */
  get isToggled() {
    return this.toggled;
  }
  /**
   *
   * callback frunction after button is clicked
   * toggles editor view source mode
   * (overriden from RichTextEditorButtonBehaviors)
   * @param {object} editor
   * @memberof RichTextEditorSourceCode
   */
  commandCallback(editor, toolbar, selection) {
    if (!this.toggled) this.__highlight.unwrap(this.range);
    this.toggled =
      this.__toolbar &&
      this.__source &&
      this.__source.__toolbar == this.__toolbar;
  }
}
customElements.define(RichTextEditorSourceCode.tag, RichTextEditorSourceCode);
export { RichTextEditorSourceCode };
