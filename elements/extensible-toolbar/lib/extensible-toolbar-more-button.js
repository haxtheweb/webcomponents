/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { ExtensibleToolbarButton } from "./extensible-toolbar-button.js";
/**
 * `extensible-toolbar-more-button`
 * `a more button to toggle collapsed buttons in the rich text editor`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class ExtensibleToolbarMoreButton extends ExtensibleToolbarButton {
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
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "extensible-toolbar-more-button";
  }

  /**
   * Fires a button tap event
   */
  _handleButton(e) {
    this.toggled = !this.toggled;
  }
}
window.customElements.define(
  ExtensibleToolbarMoreButton.tag,
  ExtensibleToolbarMoreButton
);
export { ExtensibleToolbarMoreButton };
