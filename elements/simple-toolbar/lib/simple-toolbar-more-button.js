/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleToolbarButtonBehaviors } from "./simple-toolbar-button.js";
/**
 * `simple-toolbar-more-button`
 * a more button to toggle collapsed buttons in the rich text editor
 *
 * @element simple-toolbar-more-button
 * @demo ./demo/buttons.html
 */
class SimpleToolbarMoreButton extends SimpleToolbarButtonBehaviors(LitElement) {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "simple-toolbar-more-button";
  }

  constructor() {
    super();
    this.icon = "more-vert";
    this.collapseMax = "xs";
    this.toggled = false;
    this.toggles = true;
    this.label = "More buttons";
    this.labelToggled = "Fewer buttons";
    console.log("constructor");
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
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
}
window.customElements.define(
  SimpleToolbarMoreButton.tag,
  SimpleToolbarMoreButton
);
export { SimpleToolbarMoreButton };