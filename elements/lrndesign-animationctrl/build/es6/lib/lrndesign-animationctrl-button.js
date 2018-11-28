import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/iron-icon/iron-icon.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      paper-button {
        @apply --animationctrl-button;
      }
      iron-icon {
        display: inline-flex;
      }
      :host iron-icon[hidden] {
        display: none;
      }
    </style>
    <paper-button raised="" id="[[name]]" on-tap="_tap">
      [[name]] 
      <iron-icon icon="[[icon]]" hidden$="[[!icon]]"></iron-icon>
    </paper-button>
`,
  is: "lrndesign-animationctrl-button",
  properties: {
    name: { type: String, value: "buttonid" },
    icon: { type: String, value: !1 }
  },
  _tap: function(e) {
    e.preventDefault();
    this.fire("lrndesign-animationctrl-click", { button: this.name });
  }
});
