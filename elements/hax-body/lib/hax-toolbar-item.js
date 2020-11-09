import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
class HaxToolbarItem extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          box-sizing: border-box;
          height: 36px;
          width: 36px;
          --hax-contextual-action-text-color: white;
        }
        :host([large]),
        :host([mini]) {
          height: unset;
          width: unset;
        }
        :host([disabled]) {
          pointer-events: none;
          opacity: 0.5;
        }
        :host([danger]) {
          --hax-contextual-action-hover-color: var(
            --simple-colors-default-theme-red-8,
            #ff7777
          );
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
        :host([menu]) button {
          -webkit-justify-content: flex-start;
          justify-content: flex-start;
        }
        #label {
          padding-left: 5px;
        }
        button {
          display: flex;
          align-items: center;
          min-width: 0;
          margin: 0;
          border: 0px;
          text-transform: none;
          padding: 0;
          border-radius: 0;
          font-size: 12px;
          transition: 0.2s all, 0 height;
          height: 36px;
          width: 36px;
          min-width: unset;
          background-color: var(
            --hax-contextual-action-color,
            var(--simple-colors-default-theme-grey-12, #007999)
          );

          color: var(
            --hax-contextual-action-text-color,
            var(--simple-colors-default-theme-grey-1, #fff)
          );
        }
        :host(:not([disabled])) button:active,
        :host(:not([disabled])) button:hover,
        :host(:not([disabled])) button:focus {
          background-color: var(
            --hax-contextual-action-hover-color,
            var(--simple-colors-default-theme-grey-8, #009dc7)
          );
          color: var(
            --hax-contextual-action-text-color,
            var(--simple-colors-default-theme-grey-1, #fff)
          );
          outline: 1px solid
            var(
              --hax-contextual-action-color,
              var(--simple-colors-default-theme-grey-8, #007999)
            );
          z-index: 2;
        }
        :host([default]) button {
          background: black;
        }
        :host([dark]:not([disabled])) button {
          background-color: var(--hax-color-text);
          color: var(--hax-color-bg-accent);
        }
        :host([dark]:not([disabled])) button:hover {
          background-color: var(--hax-color-bg-accent);
          color: var(--hax-color-text);
        }
        :host([dark]) button:active {
          background: var(--hax-color-bg-accent);
          color: var(--hax-color-text);
        }
        simple-icon {
          --simple-icon-height: 20px;
          --simple-icon-width: 20px;
          padding: 0;
          margin: 0;
        }
        :host([mini]) button {
          width: 28px;
          height: 28px;
          padding: 1px;
          border: 0px;
        }
        :host([light]) button {
          background-color: #aaaaaa;
          color: #ffffff;
        }
        :host([circle]) button {
          border-radius: 50%;
          display: block;
        }
        :host([large]) button {
          border-radius: 0;
          width: unset;
          padding: 0px;
          border: 0px;
        }
        :host([mini]:not([disabled])) button:active,
        :host([mini]:not([disabled])) button:hover,
        :host([mini]:not([disabled])) button:focus {
          outline: unset;
          border: 1px solid
            var(--hax-color-accent1, --simple-colors-default-theme-light-blue-7);
        }
        :host([menu]) button {
          padding: 0 8px;
          width: 100%;
          height: 36px;
        }
        :host([menu]:not([disabled])) button:hover {
          color: white;
        }
        .flip-icon {
          transform: rotateY(180deg);
        }
        simple-tooltip {
          --simple-tooltip-background: #000000;
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: #ffffff;
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-duration-in: 100ms;
          --simple-tooltip-duration-out: 0;
          --simple-tooltip-border-radius: 0;
          --simple-tooltip-font-size: 14px;
        }
      `,
    ];
  }
  render() {
    return html`
      <button
        .disabled="${this.disabled}"
        id="btn"
        tabindex="0"
        .title="${this.tooltip}"
      >
        <simple-icon
          ?dark="${!this.dark}"
          icon="${this.icon}"
          ?hidden="${this.icon == "" ? true : false}"
        ></simple-icon>

        <span id="label" ?hidden="${this.label == "" ? true : false}"
          >${this.label}</span
        >
        <slot></slot>
      </button>
      <simple-tooltip
        for="btn"
        ?hidden="${this.tooltip == "" ? true : false}"
        id="tooltip"
        offset="10"
        position="${this.tooltipDirection}"
      >
        ${this.tooltip}
      </simple-tooltip>
    `;
  }
  static get tag() {
    return "hax-toolbar-item";
  }
  constructor() {
    super();
    this.simple = false;
    this.circle = false;
    this.corner = "";
    this.large = false;
    this.disabled = false;
    this.dark = false;
    this.danger = false;
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
        reflect: true,
      },
      circle: {
        type: Boolean,
        reflect: true,
      },
      height: {
        type: String,
      },
      /**
       * disabled state
       */
      disabled: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Inverted display mode
       */
      dark: {
        type: Boolean,
        reflect: true,
      },
      danger: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Style to be presented in a menu
       */
      menu: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Present smaller the normal but consistent
       */
      mini: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Present larger then normal but consistent
       */
      large: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Icon to represent this button, required.
       */
      icon: {
        type: String,
      },
      /**
       * Text applied to the button
       */
      label: {
        type: String,
      },
      /**
       * Hover tip text
       */
      tooltip: {
        type: String,
      },
      /**
       * Direction that the tooltip should flow
       */
      tooltipDirection: {
        type: String,
        attribute: "tooltip-direction",
      },
      default: {
        type: Boolean,
        reflect: true,
      },
    };
  }
}
window.customElements.define(HaxToolbarItem.tag, HaxToolbarItem);
export { HaxToolbarItem };
