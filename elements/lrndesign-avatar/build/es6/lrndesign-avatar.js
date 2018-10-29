import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@lrnwebcomponents/paper-avatar/paper-avatar.js";
import "./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
Polymer({
  _template: html`
    <style include="materializecss-styles"></style>
    <style>
      :host {
        display: block;
      }
    </style>
    <paper-avatar label="[[label]]" src="[[src]]" two-chars="[[twoChars]]" class\$="[[color]]" jdenticon="[[jdenticon]]"></paper-avatar>
`,
  is: "lrndesign-avatar",
  properties: {
    label: { type: String, value: "lrndesign-avatar" },
    src: { type: String },
    twoChars: { type: Boolean, value: !1 },
    color: { type: String, reflectToAttribute: !0 },
    jdenticon: { type: Boolean, value: !1 }
  }
});
