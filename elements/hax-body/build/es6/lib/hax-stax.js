import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
Polymer({
  _template: html`
  <style>
    :host {
      display:none;
    }
  </style>
`,
  is: "hax-stax",
  properties: { data: { type: Object } },
  attached: function() {
    if (typeof this.data !== typeof void 0) {
      this.fire("hax-register-stax", this.data);
    }
  }
});
