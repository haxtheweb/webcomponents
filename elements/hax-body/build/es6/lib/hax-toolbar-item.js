import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-icon-button/paper-icon-button.js";
import "../node_modules/@polymer/paper-tooltip/paper-tooltip.js";
import "../node_modules/@lrnwebcomponents/materializecss-styles/lib/colors.js";
Polymer({
  _template: html`
    <style include="materializecss-styles-colors">
      :host {
        display: flex;
        --hax-item-color: #e5e5e5;
        --hax-item-background: #2e2e2e;
        box-sizing: border-box;
      }
      :host([menu]) {
        width: 100%;
        position: relative;
        height: 32px;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -ms-flex-direction: row;
        -webkit-flex-direction: row;
        flex-direction: row;
        -webkit-justify-content: flex-start;
        justify-content: flex-start;
        font-family: 'Roboto', 'Noto', sans-serif;
        -webkit-font-smoothing: antialiased;
        font-size: 16px;
        font-weight: 400;
        line-height: 24px;
        --hax-item-color: #2e2e2e;
        --hax-item-background: #FFFFFF;
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
        background-color: var(--hax-item-background);
        color: var(--hax-item-color);
        min-width: 0;
        margin: 0;
        text-transform: none;
        padding: 8px;
        border-radius: 0;
        font-size: 12px;
        height: 32px;
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
      :host([default]) paper-button {
        background: black;
      }
      :host([light]) paper-button {
        background-color: var(--hax-item-color);
        color: var(--hax-item-background);
      }
      :host([light]) paper-button:hover {
        background-color: var(--hax-item-background);
        color: var(--hax-item-color);
      }
      :host([light]) paper-button:active {
        background: var(--hax-item-background);
        color: var(--hax-item-color);
      }
      :host([mini]) iron-icon {
        width: 16px;
        height: 16px;
      }
      :host([mini]) paper-button {
        border-radius: 50%;
        width: 18px;
        height: 18px;
        padding: 2px;
      }
      :host([menu]) paper-button {
        padding: 0 8px;
        width: 100%;
        height: 32px;
      }
      :host([menu]) paper-button:hover {
        background-color: #d3d3d3;
        color: #000000;
      }
      :host([corner="left"]) paper-button {
        border-top-left-radius: 25%;
      }
      :host([corner="right"]) paper-button {
        border-top-right-radius: 25%;
      }
      .flip-icon {
        transform: rotateY(180deg);
      }
    </style>

    <paper-button disabled="[[disabled]]" id="buttoncontainer" tabindex="0" title\$="[[tooltip]]">
      <iron-icon id="button" icon="[[icon]]" class\$="[[iconClass]]"></iron-icon> <span id="label" hidden\$="[[!label]]">[[label]]</span>
      <slot></slot>
    </paper-button>
    <paper-tooltip id="tooltip" for\$="[[this]]" offset="14" position="[[tooltipDirection]]" animation-delay="100">
      [[tooltip]]
    </paper-tooltip>
`,
  is: "hax-toolbar-item",
  properties: {
    corner: { type: String, reflectToAttribute: !0, value: "" },
    disabled: { type: Boolean, value: !1, reflectToAttribute: !0 },
    light: { type: Boolean, reflectToAttribute: !0, value: !1 },
    menu: { type: Boolean, value: !1, reflectToAttribute: !0 },
    mini: { type: Boolean, reflectToAttribute: !0, value: !1 },
    icon: { type: String, value: "" },
    label: { type: String, value: "" },
    tooltip: { type: String, value: "", observer: "_tooltipChanged" },
    tooltipDirection: { type: String, value: "top" },
    default: { type: Boolean, value: !1, reflectToAttribute: !0 },
    iconClass: { type: String, value: "", reflectToAttribute: !0 }
  },
  _tooltipChanged: function(newValue, oldValue) {
    if ("" == newValue || null == newValue) {
      this.$.tooltip.setAttribute("aria-hidden", "true");
    } else {
      this.$.tooltip.setAttribute("aria-hidden", "false");
    }
  }
});
