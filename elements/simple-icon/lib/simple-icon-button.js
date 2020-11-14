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
 * @demo demo/button.html
 * @element simple-icon
 */
class SimpleIconButton extends SimpleColors {
  /**
   * This is a convention, not the standard
   */
  static get tag() {
    return "simple-icon-button";
  }
  constructor() {
    super();
    this.accentColor = "white";
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
          border-radius: var(--simple-icon-button-padding, 0px);
          border-radius: var(--simple-icon-button-border-radius, 50%);
          height: calc(
            var(--simple-icon-height, 24px) - 2 *
              var(--simple-icon-button-padding, 0px)
          );
          width: calc(
            var(--simple-icon-width, 24px) - 2 *
              var(--simple-icon-button-padding, 0px)
          );
        }
        button {
          cursor: pointer;
          border: 0;
          border-radius: var(--simple-icon-button-border-radius, 50%);
          height: var(--simple-icon-height, 24px);
          width: var(--simple-icon-width, 24px);
          background-color: transparent;
          padding: 0px;
          margin: 0px;
        }
        button:focus,
        button:hover {
          opacity: var(--simple-icon-button-focus-opacity, 0.8);
          --simple-icon-color: var(--simple-icon-button-focus-color);
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
      icon: {
        type: String,
        reflect: true,
      },
      contrast: {
        type: Number,
        reflect: true,
      },
    };
  }
}
customElements.define(SimpleIconButton.tag, SimpleIconButton);
export { SimpleIconButton };
