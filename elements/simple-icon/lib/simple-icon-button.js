/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./simple-icons.js";
import "../simple-icon.js";
/**
 * `simple-icon`
 * `Render an SVG based icon`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @demo demo/index.html
 * @element simple-icon
 */
class SimpleIconButton extends SimpleColors {
  /**
   * This is a convention, not the standard
   */
  static get tag() {
    return "simple-icon-button";
  }
  static get styles() {
    return [
      ...super.styles,
      css`
        :host([hidden]) {
          display: none;
        }
        :host {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
          vertical-align: middle;
          height: var(--simple-icon-height, 24px);
          width: var(--simple-icon-width, 24px);
        }
        button {
          cursor: pointer;
          border: 0;
          border-radius: 50%;
          height: var(--simple-icon-height, 24px);
          width: var(--simple-icon-width, 24px);
          background-color: transparent;
          padding: 0px;
          margin: 0px;
        }
        simple-icon {
          height: var(--simple-icon-height, 24px);
          width: var(--simple-icon-width, 24px);
        }
      `,
    ];
  }
  // render function
  render() {
    return html`
      <button>
        <simple-icon
          icon=${this.icon}
          accent-color="${this.accentColor}"
          ?dark="${this.dark}"
        ></simple-icon>
      </button>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      icon: {
        type: String,
        reflect: true,
      },
    };
  }
}
customElements.define(SimpleIconButton.tag, SimpleIconButton);
export { SimpleIconButton };
