import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <form action="[[endPoint]]" method="POST" target="_blank">
      <input type="hidden" name="data" value\$="[[dataString]]">
      <input type="image" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-1/cp-arrow-right.svg" width="40" height="40" value="Create New Pen with Prefilled Data" class="codepen-mover-button">
    </form>
`,
  is: "code-pen-button",
  properties: {
    endPoint: { type: String, value: "https://codepen.io/pen/define" },
    dataString: { type: String, computed: "_getDataString(data)" },
    data: { type: Object, value: {} }
  },
  _getDataString: function(data) {
    return JSON.stringify(data)
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }
});
