import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@lrnwebcomponents/paper-avatar/paper-avatar.js";
import "../node_modules/@lrnwebcomponents/lrn-icons/lrn-icons.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      :host > div > * {
        vertical-align: middle;
      }
      .text-label {
        margin-left: 0.5em;
      }
      .text-label-only {
        margin-left: 0em;
      }
    </style>
    <div>
      <template is="dom-if" if="[[avatar]]">
        <paper-avatar src\$="[[avatar]]"></paper-avatar>
      </template>
      <template is="dom-if" if="[[icon]]">
        <lrn-icon icon="[[icon]]"></lrn-icon>
      </template>
      <template is="dom-if" if="[[text]]">
        <span class\$="[[_getTextLabelClass()]]">[[text]]</span>
      </template>
    </div>
    <div><slot name="button"></slot></div>
`,
  is: "lrnsys-button-inner",
  properties: {
    icon: { type: String },
    avatar: { type: String },
    text: { type: String }
  },
  _getTextLabelClass: function() {
    if (!this.avatar && !this.icon) {
      return "text-label-only";
    }
    return "text-label";
  }
});
