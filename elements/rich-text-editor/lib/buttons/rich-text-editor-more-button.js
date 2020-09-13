/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorButtonBehaviors } from "./rich-text-editor-button.js";
/**
 * `rich-text-editor-more-button`
 * a more button to toggle collapsed buttons in the rich text editor
 *
 * @element rich-text-editor-more-button
 * @demo ./demo/buttons.html
 */
class RichTextEditorMoreButton extends RichTextEditorButtonBehaviors(
  LitElement
) {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-more-button";
  }

  // render function for template
  render() {
    return super.render();
  }

  constructor() {
    super();
    this.icon = "more-vert";
    this.collapseMax = "xs";
    this.toggled = false;
    this.label = "More buttons";
    this.labelToggled = "Fewer buttons";
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
      /**
       * The maximum size where all of the buttons display
       */
      collapseMax: {
        attribute: "collapse-max",
        type: String,
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

  /**
   * Fires a button tap event
   */
  _buttonTap() {
    return true;
  }
}
window.customElements.define(
  RichTextEditorMoreButton.tag,
  RichTextEditorMoreButton
);
export { RichTextEditorMoreButton };
