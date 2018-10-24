import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/lrn-icons/lrn-icons.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      paper-button {
        @apply --animationctrl-button;
      }
    </style>
    <paper-button raised="" id="[[name]]">
      [[name]] 
      <template is="dom-if" if="[[icon]]">
        <lrn-icon icon="[[icon]]"></lrn-icon>
      </template>
    </paper-button>
`,

  is: "lrndesign-animationctrl-button",

  properties: {
    /**
     * Machine name of the button. This should be unique
     * to the animationctrl set
     */
    name: String,
    /**
     * Name of the LRN Icon
     */
    icon: String
  },

  ready: function() {
    var root = this;
    /**
     * Fired when a button is clicked.
     *
     * @event lrndesign-animationctrl-click
     * @param {string} button Name of the button that was clicked.
     */
    root.$$("paper-button").addEventListener("click", function(e) {
      e.preventDefault();
      root.fire("lrndesign-animationctrl-click", { button: root.name });
    });
  }
});
