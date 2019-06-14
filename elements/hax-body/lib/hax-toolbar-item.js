import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./hax-shared-styles.js";

class HaxToolbarItem extends PolymerElement {
  constructor() {
    super();
    import("@polymer/paper-button/paper-button.js");
    import("@polymer/paper-tooltip/paper-tooltip.js");
  }
  static get template() {
    return html`
      <style include="hax-shared-styles">
        :host {
          display: flex;
          box-sizing: border-box;
          height: 36px;
          width: 36px;
        }
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
          background-color: var(--hax-color-bg-accent);
          color: var(--hax-color-text);
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
          @apply --hax-toolbar-item-container;
          --paper-button-ink-color: var(--hax-color-accent1);
        }
        paper-button:active,
        paper-button:hover,
        paper-button:focus {
          color: var(--hax-color-text-active);
          outline: 1px solid var(--hax-color-accent1);
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
          --paper-tooltip: {
            border-radius: 0;
          }
        }
      </style>

      <paper-button
        disabled="[[disabled]]"
        id="buttoncontainer"
        tabindex="0"
        title\$="[[tooltip]]"
      >
        <iron-icon id="button" icon="[[icon]]" hidden\$="[[!icon]]"></iron-icon>
        <span id="label" hidden\$="[[!label]]">[[label]]</span> <slot></slot>
      </paper-button>
      <paper-tooltip
        id="tooltip"
        for\$="[[this]]"
        offset="10"
        position="[[tooltipDirection]]"
        animation-delay="0"
      >
        [[tooltip]]
      </paper-tooltip>
    `;
  }
  static get tag() {
    return "hax-toolbar-item";
  }
  static get properties() {
    return {
      /**
       * corner
       */
      corner: {
        type: String,
        reflectToAttribute: true,
        value: ""
      },
      /**
       * disabled state
       */
      disabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * Inverted display mode
       */
      dark: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },
      /**
       * Style to be presented in a menu
       */
      menu: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * Present smaller the normal but consistent
       */
      mini: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },
      /**
       * Icon to represent this button, required.
       */
      icon: {
        type: String,
        value: false
      },
      /**
       * Text applied to the button
       */
      label: {
        type: String,
        value: false
      },
      /**
       * Hover tip text
       */
      tooltip: {
        type: String,
        value: "",
        observer: "_tooltipChanged"
      },
      /**
       * Direction that the tooltip should flow
       */
      tooltipDirection: {
        type: String,
        value: "top"
      },
      default: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    };
  }
  /**
   * Keep accessibility inline with tooltip
   */
  _tooltipChanged(newValue, oldValue) {
    if (newValue == "" || newValue == null) {
      this.shadowRoot
        .querySelector("#tooltip")
        .setAttribute("aria-hidden", "true");
    } else {
      this.shadowRoot
        .querySelector("#tooltip")
        .setAttribute("aria-hidden", "false");
    }
  }
}
window.customElements.define(HaxToolbarItem.tag, HaxToolbarItem);
export { HaxToolbarItem };
