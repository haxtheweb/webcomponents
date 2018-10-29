import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "../node_modules/@polymer/iron-icon/iron-icon.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        --lrndesign-mapmenu-item-height: 16px;
      }
      iron-icon {
        --iron-icon-height: var(--lrndesign-mapmenu-item-height);
      }
    </style>
    <template is="dom-if" if="[[icon]]">
      <iron-icon icon="[[icon]]"></iron-icon>
    </template>
    <span id="title">[[title]]</span>
`,
  is: "lrndesign-mapmenu-item",
  properties: {
    icon: { type: String, value: "" },
    title: { type: String, value: "" },
    url: { type: String, value: "" },
    icon: { type: String, value: "" }
  }
});
