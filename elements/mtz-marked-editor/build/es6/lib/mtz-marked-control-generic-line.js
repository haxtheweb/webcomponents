import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "../node_modules/@polymer/paper-icon-button/paper-icon-button.js";
import "./mtz-marked-control-line-behavior.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: inline-block;
      }
    </style>

    <paper-icon-button icon="[[icon]]" noink="[[noink]]" on-click="_handleCommand" alt="[[title]]"></paper-icon-button>

    <iron-a11y-keys keys="[[keys]]" on-keys-pressed="_handleCommand" target="[[__editor]]"></iron-a11y-keys>
`,
  is: "mtz-marked-control-generic-line",
  behaviors: [mtz.MarkedControlLineBehavior],
  properties: { title: String, icon: String, keys: String, noink: Boolean }
});
