import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "../node_modules/@lrnwebcomponents/relative-heading/relative-heading.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: none;
      }
      :host #desc {
        margin: 0 0 15px;
      }
      @media print {
        :host {
          display: block;
        }
      }
    </style>
    <relative-heading hidden\$="[[!label]]" id="heading" text\$="[[label]]">
    </relative-heading>
    <div id="desc"><slot></slot></div>
`,
  is: "lrndesign-imagemap-hotspot",
  properties: {
    label: { type: String, value: null },
    hotspotId: { type: String, value: null }
  },
  setParentHeading: function(parent) {
    this.$.heading._setParent(parent);
  }
});
