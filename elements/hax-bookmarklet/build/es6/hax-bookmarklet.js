import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@lrnwebcomponents/cms-hax/cms-hax.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        font-size: 16px;
      }
    </style>
    <cms-hax open-default="" app-store-connection="[[storeData]]" body-offset-left="">
    <template><slot></slot></template>
    </cms-hax>
`,
  is: "hax-bookmarklet",
  properties: { storeData: { type: Object } },
  ready: function() {
    let json = { url: this.resolveUrl("appstore.json") };
    this.storeData = json;
  }
});
