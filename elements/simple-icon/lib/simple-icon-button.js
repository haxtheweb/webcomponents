/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { SimpleIconButtonBehaviors } from "./simple-icon-button-lite.js";
import "./simple-icons.js";
import "../simple-icon.js";
/**
 * `simple-icon`
 * `Render an SVG based icon`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @demo demo/button.html
 * @element simple-icon
 */
class SimpleIconButton extends SimpleIconButtonBehaviors(SimpleColors) {
  /**
   * This is a convention, not the standard
   */
  static get tag() {
    return "simple-icon-button";
  }
  constructor() {
    super();
    this.accentColor = "grey";
    this.contrast = 4;
    this.dark = false;
  }
  // render function
  render() {
    return html`
      <button>
        <simple-icon
          icon="${this.icon}"
          accent-color="${this.accentColor}"
          contrast="${this.contrast}"
          ?dark="${this.dark}"
        ></simple-icon>
      </button>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      contrast: {
        type: Number,
        reflect: true,
      },
    };
  }
}
customElements.define(SimpleIconButton.tag, SimpleIconButton);
export { SimpleIconButton };
