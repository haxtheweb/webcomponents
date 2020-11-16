/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css, LitElement } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./simple-icons.js";
import "./simple-icon-lite.js";

export const SimpleIconButtonBehaviors = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
    }

    static get styles() {
      return [
        ...[super.styles || []],
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
          <simple-icon-lite icon=${this.icon}> </simple-icon-lite>
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
  };
};
/**
 * `simple-icon`
 * `Render an SVG based icon`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @demo demo/button-lite.html
 * @element simple-icon
 */
class SimpleIconButtonLite extends SimpleIconButtonBehaviors(LitElement) {
  /**
   * This is a convention, not the standard
   */
  static get tag() {
    return "simple-icon-button-lite";
  }
  constructor() {
    super();
  }
}
customElements.define(SimpleIconButtonLite.tag, SimpleIconButtonLite);
export { SimpleIconButtonLite };
