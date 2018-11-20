import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
import "@lrnwebcomponents/cms-hax/cms-hax.js";
/**
 * `hax-bookmarklet`
 * `Pure, Evil.`
 * 
 * @demo ../../demo/index.html
 */
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

  properties: {
    /**
     * Store data with path resolved.
     */
    storeData: {
      type: Object
    }
  },
  /**
   * ready life cycle
   */
  ready: function() {
    let json = {
      url: pathFromUrl(import.meta.url) + "appstore.json"
    };
    this.storeData = json;
  }
});
