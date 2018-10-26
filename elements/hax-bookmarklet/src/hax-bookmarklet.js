import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "cms-hax/cms-hax.js";
/**
`hax-bookmarklet`
Pure, Evil.

@demo ../../demo/index.html

*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        font-size: 1em;
      }
    </style>
    <cms-hax open-default="" app-store-connection="[[storeData]]" body-offset-left="">
    <template><slot></slot></template>
    </cms-hax>
`,

  is: "hax-bookmarklet",

  properties: {
    /**
     * Store data with path resolved.
     */
    storeData: {
      type: Object
    }
  },

  ready: function() {
    let json = {
      url: this.resolveUrl("appstore.json")
    };
    this.storeData = json;
  }
});
