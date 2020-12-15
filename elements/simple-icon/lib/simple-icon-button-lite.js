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
            border-radius: var(--simple-icon-button-border-radius, 50%);
            background-color: var(
              --simple-icon-button-background-color,
              transparent
            );
            padding: 0;
            margin: 0;
            color: inherit;
          }
          button {
            color: inherit;
            cursor: pointer;
            opacity: var(--simple-icon-button-opacity, 1);
            border: var(--simple-icon-button-border, 0);
            border-radius: var(--simple-icon-button-border-radius, 50%);
            background-color: var(
              --simple-icon-button-background-color,
              transparent
            );
            padding: var(--simple-icon-button-padding, 0px);
            margin: 0px;
          }
          button[aria-pressed] {
            opacity: var(--simple-icon-button-toggled-opacity, 1);
            --simple-icon-button-border: var(
              --simple-icon-toggled-button-border
            );
            --simple-icon-color: var(--simple-icon-button-toggled-color);
            --simple-icon-button-background-color: var(
              --simple-icon-button-toggled-background-color
            );
          }
          button:focus,
          button:hover {
            opacity: var(--simple-icon-button-focus-opacity, 0.8);
            --simple-icon-button-border: var(--simple-icon-button-focus-border);
            --simple-icon-color: var(--simple-icon-button-focus-color);
            --simple-icon-button-background-color: var(
              --simple-icon-button-focus-background-color
            );
          }
          button[disabled] {
            opacity: var(--simple-icon-button-disabled-opacity, 0.5);
            --simple-icon-button-border: var(
              --simple-icon-button-disabled-border
            );
            --simple-icon-color: var(--simple-icon-button-disabled-color);
            --simple-icon-button-background-color: var(
              --simple-icon-button-disabled-background-color
            );
          }

          simple-icon-lite {
            color: inherit;
            height: calc(
              var(--simple-icon-height, 24px) - 2 *
                var(--simple-icon-button-padding, 0px)
            );
            width: calc(
              var(--simple-icon-width, 24px) - 2 *
                var(--simple-icon-button-padding, 0px)
            );
          }
        `,
      ];
    }
    // render function
    render() {
      return html`
        <button
          ?autofocus="${this.autofocus}"
          aria-labelledby="${this.ariaLabelledby}"
          .aria-pressed="${this.toggles || this.toggled
            ? "true"
            : this.toggles
            ? "false"
            : undefined}"
          controls="${this.controls}"
          ?disabled="${this.disabled}"
          form="${this.form}"
          label="${this.label}"
          name="${this.fieldName}"
          type="${this.type}"
          value="${this.value}"
        >
          <simple-icon-lite icon=${this.icon}> </simple-icon-lite>
        </button>
      `;
    }

    // properties available to the custom element for data binding
    static get properties() {
      return {
        ...super.properties,
        autofocus: {
          attribute: "autofocus",
          type: Boolean,
        },
        ariaLabelledby: {
          attribute: "aria-labelledby",
          type: String,
        },
        controls: {
          attribute: "controls",
          type: String,
        },
        disabled: {
          attribute: "disabled",
          type: Boolean,
        },
        fieldName: {
          attribute: "field-name",
          type: String,
        },
        form: {
          attribute: "form",
          type: String,
        },
        icon: {
          type: String,
          reflect: true,
        },
        label: {
          attribute: "label",
          type: String,
        },
        type: {
          attribute: "type",
          type: String,
        },
        value: {
          attribute: "value",
          type: String,
          reflect: true,
        },
        toggles: {
          attribute: "toggles",
          type: Boolean,
          reflect: true,
        },
        toggled: {
          attribute: "toggled",
          type: Boolean,
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
    this.type = "button";
  }
}
customElements.define(SimpleIconButtonLite.tag, SimpleIconButtonLite);
export { SimpleIconButtonLite };
