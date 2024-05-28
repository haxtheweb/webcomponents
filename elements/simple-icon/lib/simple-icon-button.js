/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import { SimpleIconButtonBehaviors } from "./simple-icon-button-lite.js";
import "./simple-icons.js";
import "../simple-icon.js";
/**
 *
 * @class SimpleIconButtonBehaviors
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
      <button
        ?autofocus="${this.autofocus}"
        .aria-labelledby="${this.ariaLabelledby}"
        .aria-pressed="${this.toggles || this.toggled
          ? "true"
          : this.toggles
            ? "false"
            : undefined}"
        controls="${this.controls}"
        part="button"
        ?disabled="${this.disabled}"
        form="${this.form}"
        label="${this.label}"
        aria-label="${this.label}"
        name="${this.fieldName}"
        .type="${this.type}"
        value="${this.value}"
      >
        <simple-icon
          part="icon"
          icon="${this.icon}"
          accent-color="${this.accentColor}"
          contrast="${this.contrast}"
          ?dark="${this.dark}"
          ?no-colorize="${this.noColorize}"
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
