import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@lrnwebcomponents/materializecss-styles/lib/colors.js";
Polymer({
  _template: html`
    <style include="materializecss-styles-colors">
      :host {
        display: flex;
        --hax-item-color: #e5e5e5;
        --hax-item-background: #2e2e2e;
        box-sizing: border-box;
      }
      :host[menu] {
        width: 100%;
        position: relative;
        height: 48px;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -ms-flex-direction: row;
        -webkit-flex-direction: row;
        flex-direction: row;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        font-family: 'Roboto', 'Noto', sans-serif;
        -webkit-font-smoothing: antialiased;
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        --hax-item-color: #2e2e2e;
        --hax-item-background: #FFFFFF;
      }
      #label {
        padding-left: 5px;
      }
      paper-button {
        display: flex;
        align-items: center;
        background-color: var(--hax-item-background);
        color: var(--hax-item-color);
        min-width: 0;
        margin: 0;
        text-transform: none;
        padding: 8px;
        border-radius: 0;
        font-size: 12px;
        height: 40px;
        transition: .1s all;
        @apply --hax-toolbar-item-container;
      }
      paper-button:hover {
        background-color: var(--hax-item-color);
        color: var(--hax-item-background);
      }
      paper-button:active {
        background: var(--hax-item-color);
        color: var(--hax-item-background);
      }
      :host[default] paper-button {
        background: black;
      }
      :host[light] paper-button {
        background-color: var(--hax-item-color);
        color: var(--hax-item-background);
      }
      :host[light] paper-button:hover {
        background-color: var(--hax-item-background);
        color: var(--hax-item-color);
      }
      :host[light] paper-button:active {
        background: var(--hax-item-background);
        color: var(--hax-item-color);
      }
      :host[mini] iron-icon {
        width: 16px;
        height: 16px;
      }
      :host[mini] paper-button {
        border-radius: 50%;
        width: 18px;
        height: 18px;
        padding: 2px;
      }
      :host[menu] paper-button {
        padding: 0px 16px;
        width: 100%;
        height: 48px;
      }
      :host[menu] paper-button:hover {
        background-color: #d3d3d3;
        color: #000000;
      }
      .flip-icon {
        transform: rotateY(180deg);
      }
    </style>

    <paper-button disabled="[[disabled]]" id="buttoncontainer" tabindex="0">
      <iron-icon id="button" icon="[[icon]]" class\$="[[iconClass]]"></iron-icon> <span id="label" hidden\$="[[!label]]">[[label]]</span>
      <slot></slot>
    </paper-button>
    <paper-tooltip for\$="[[this]]" offset="14" position="[[tooltipDirection]]" animation-delay="200">
      [[tooltip]]
    </paper-tooltip>
`,

  is: "hax-toolbar-item",

  properties: {
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
    light: {
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
      value: ""
    },
    /**
     * Text applied to the button
     */
    label: {
      type: String,
      value: ""
    },
    /**
     * Hover tip text
     */
    tooltip: {
      type: String,
      value: ""
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
    },
    /**
     * Icon for the button.
     */
    iconClass: {
      type: String,
      value: "",
      reflectToAttribute: true
    }
  }
});
