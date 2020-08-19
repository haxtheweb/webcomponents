/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorButtonStyles } from "./rich-text-editor-button-styles.js";
import { RichTextEditorButton } from "./rich-text-editor-button.js";
/**
 * `rich-text-editor-more-button`
 * `a more button to toggle collapsed buttons in the rich text editor`
 *
 * @element rich-text-editor-more-button
 */
class RichTextEditorMoreButton extends RichTextEditorButton {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-more-button";
  }

  constructor() {
    super();
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
        reflect: true
      },
      /**
       * The maximum size where all of the buttons display
       */
      collapseMax: {
        attribute: "collapse-max",
        type: String,
        reflect: true
      }
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
    this.dispatchEvent(
      new CustomEvent("rich-text-more-button-tap", { detail: this })
    );
  }
}
window.customElements.define(
  RichTextEditorMoreButton.tag,
  RichTextEditorMoreButton
);
export { RichTextEditorMoreButton };
