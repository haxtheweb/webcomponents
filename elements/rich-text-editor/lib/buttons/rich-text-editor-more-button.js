/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { RichTextEditorButton } from "./rich-text-editor-button.js";
/**
 * `rich-text-editor-more-button`
 * `a more button to toggle collapsed buttons in the rich text editor`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class RichTextEditorMoreButton extends RichTextEditorButton {
  constructor() {
    super();
    this.label = "More buttons";
    this.labelToggled = "Fewer buttons";
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Can this button toggle?
       */
      toggled: {
        name: "toggled",
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * The maximum size where all of the buttons display
       */
      collapseMax: {
        name: "collapseMax",
        type: String,
        value: "xs",
        reflectToAttribute: true
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-more-button";
  }

  /**
   * Fires a button tap event
   */
  _buttonTap(e) {
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
