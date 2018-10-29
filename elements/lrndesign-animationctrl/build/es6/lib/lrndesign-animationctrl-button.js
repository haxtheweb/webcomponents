import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-button/paper-button.js";
import "../node_modules/@lrnwebcomponents/lrn-icons/lrn-icons.js";
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
  properties: { name: String, icon: String },
  ready: function() {
    var root = this;
    root.shadowRoot
      .querySelector("paper-button")
      .addEventListener("click", function(e) {
        e.preventDefault();
        root.fire("lrndesign-animationctrl-click", { button: root.name });
      });
  }
});
