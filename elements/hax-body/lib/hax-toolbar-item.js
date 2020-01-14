import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-colors/lib/simple-colors-polymer.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";

class HaxToolbarItem extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          box-sizing: border-box;
          height: 36px;
          width: 36px;
        }
        :host([large]),
        :host([mini]) {
          height: unset;
          width: unset;
        }
        :host([menu]) {
          width: 100%;
          position: relative;
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          -ms-flex-direction: row;
          -webkit-flex-direction: row;
          flex-direction: row;
          -webkit-justify-content: flex-start;
          justify-content: flex-start;
          -webkit-font-smoothing: antialiased;
          font-size: 16px;
          font-weight: 400;
          line-height: 24px;
        }
        :host([menu]) paper-button {
          -webkit-justify-content: flex-start;
          justify-content: flex-start;
        }
        #label {
          padding-left: 5px;
        }
        paper-button {
          display: flex;
          align-items: center;
          background-color: var(
            --hax-toolbar-item-bg,
            var(--hax-color-bg-accent, white)
          );
          color: var(--hax-toolbar-item-color, --hax-color-text);
          min-width: 0;
          margin: 0;
          text-transform: none;
          padding: 0;
          border-radius: 0;
          font-size: 12px;
          transition: 0.3s all;
          height: 36px;
          width: 36px;
          min-width: unset;
          --paper-button-ink-color: var(
            --hax-toolbar-item-color,
            --hax-color-accent1
          );
        }
        paper-button:active,
        paper-button:hover,
        paper-button:focus {
          color: var(--hax-color-text-active);
          outline: 1px solid var(--hax-color-accent1);
          z-index: 2;
        }
        :host([default]) paper-button {
          background: black;
        }
        :host([dark]) paper-button {
          background-color: var(--hax-color-text);
          color: var(--hax-color-bg-accent);
        }
        :host([dark]) paper-button:hover {
          background-color: var(--hax-color-bg-accent);
          color: var(--hax-color-text);
        }
        :host([dark]) paper-button:active {
          background: var(--hax-color-bg-accent);
          color: var(--hax-color-text);
        }
        iron-icon {
          width: 20px;
          height: 20px;
          padding: 0;
          margin: 0;
        }
        :host([mini]) iron-icon {
          width: 16px;
          height: 16px;
        }
        :host([mini]) paper-button {
          border-radius: 50%;
          width: 18px;
          height: 18px;
          padding: 1px;
          border: 1px solid var(--hax-color-border-outline);
        }
        :host([large][light]) paper-button {
          background-color: #aaaaaa;
          color: #eeeeee;
        }
        :host([large]) paper-button {
          border-radius: 0;
          width: unset;
          padding: 0px;
          border: 0px;
        }
        :host([mini]) paper-button:active,
        :host([mini]) paper-button:hover,
        :host([mini]) paper-button:focus {
          outline: unset;
          border: 1px solid var(--hax-color-accent1);
        }
        :host([menu]) paper-button {
          padding: 0 8px;
          width: 100%;
          height: 36px;
        }
        :host([menu]) paper-button:hover {
          background-color: #d3d3d3;
          color: #000000;
        }
        .flip-icon {
          transform: rotateY(180deg);
        }
        paper-tooltip {
          --paper-tooltip-background: #000000;
          --paper-tooltip-opacity: 1;
          --paper-tooltip-text-color: #ffffff;
          --paper-tooltip-delay-in: 0;
          --paper-tooltip-duration-in: 200ms;
          --paper-tooltip-duration-out: 0;
        }
      `
    ];
  }
  render() {
    return html`
      <custom-style>
        <style>
          paper-tooltip {
            --paper-tooltip: {
              border-radius: 0;
              font-size: 14px;
            }
          }
        </style>
      </custom-style>
      <paper-button
        .disabled="${this.disabled}"
        id="btn"
        tabindex="0"
        .title="${this.tooltip}"
      >
        <iron-icon
          icon="${this.icon}"
          ?hidden="${this.icon == "" ? true : false}"
        ></iron-icon>
        <span id="label" ?hidden="${this.label == "" ? true : false}"
          >${this.label}</span
        >
        <slot></slot>
      </paper-button>
      <paper-tooltip
        for="btn"
        ?hidden="${this.tooltip == "" ? true : false}"
        id="tooltip"
        offset="10"
        position="${this.tooltipDirection}"
      >
        ${this.tooltip}
      </paper-tooltip>
    `;
  }
  static get tag() {
    return "hax-toolbar-item";
  }
  constructor() {
    super();
    this.corner = "";
    this.large = false;
    this.disabled = false;
    this.dark = false;
    this.menu = false;
    this.mini = false;
    this.icon = "";
    this.label = "";
    this.tooltip = "";
    this.tooltipDirection = "top";
    this.default = false;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "height" && this.shadowRoot) {
        this.shadowRoot.querySelector("#btn").style.height = this[propName];
      }
    });
  }
  static get properties() {
    return {
      /**
       * corner
       */
      corner: {
        type: String,
        reflect: true
      },
      height: {
        type: String
      },
      /**
       * disabled state
       */
      disabled: {
        type: Boolean,
        reflect: true
      },
      /**
       * Inverted display mode
       */
      dark: {
        type: Boolean,
        reflect: true
      },
      /**
       * Style to be presented in a menu
       */
      menu: {
        type: Boolean,
        reflect: true
      },
      /**
       * Present smaller the normal but consistent
       */
      mini: {
        type: Boolean,
        reflect: true
      },
      /**
       * Present larger then normal but consistent
       */
      large: {
        type: Boolean,
        reflect: true
      },
      /**
       * Icon to represent this button, required.
       */
      icon: {
        type: String
      },
      /**
       * Text applied to the button
       */
      label: {
        type: String
      },
      /**
       * Hover tip text
       */
      tooltip: {
        type: String
      },
      /**
       * Direction that the tooltip should flow
       */
      tooltipDirection: {
        type: String,
        attribute: "tooltip-direction"
      },
      default: {
        type: Boolean,
        reflect: true
      }
    };
  }
}
window.customElements.define(HaxToolbarItem.tag, HaxToolbarItem);
export { HaxToolbarItem };
