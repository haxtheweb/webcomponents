import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: none;
        clear: both;
      }
    </style>
`,
  is: "responsive-grid-clear",
  properties: {
    xl: { type: Boolean, value: !1 },
    lg: { type: Boolean, value: !1 },
    md: { type: Boolean, value: !1 },
    sm: { type: Boolean, value: !1 },
    xs: { type: Boolean, value: !1 }
  }
});
