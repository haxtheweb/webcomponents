import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icon/iron-icon.js";
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
    /**
     * Machine name of the button. This should be unique
     * to the animationctrl set
     */
    name: {
      type: String,
      value: "buttonid"
    },
    /**
     * Name of the Icon
     */
    icon: {
      type: String,
      value: false
    }
  },
  /**
   * Fire event
   */
  _tap: function(e) {
    e.preventDefault();
    this.fire("lrndesign-animationctrl-click", { button: this.name });
  }
});
