import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/iron-icon/iron-icon.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "../node_modules/@polymer/paper-tooltip/paper-tooltip.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: inline-block;
      }
      iron-icon {
        display: inline-block;
        height: 16px;
        width: 16px;
      }
    </style>
    <paper-button raisedon-tap="_onTap" id$="[[id]]" aria-label$="[[title]]">
      <iron-icon icon="[[icon]]"></iron-icon> [[title]]
    </paper-button>
    <paper-tooltip for$="[[id]]" animation-delay="200">[[title]]</paper-tooltip>
`,
  is: "lrnsys-dialog-toolbar-button",
  properties: {
    title: { type: String },
    icon: { type: String },
    id: { type: String }
  },
  ready: function() {
    this.fire("button-initialized", { id: this.id });
  },
  _onTap: function(e) {
    var normalizedEvent = dom(e),
      localTarget = normalizedEvent.localTarget,
      id = localTarget.getAttribute("id");
    this.fire("dialog-toolbar-button-tapped", { id: id });
  }
});
