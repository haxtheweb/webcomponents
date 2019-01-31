import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/h-a-x/h-a-x.js";
/**
 * `hax-bookmarklet`
 * `Pure, Evil.`
 *
 * @demo demo/index.html
 */
let HaxBookmarklet = Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        font-size: 16px;
      }
    </style>
    <h-a-x app-store$="[[appStoreConnection]]">
      <slot></slot>
    </h-a-x>
  `,

  is: "hax-bookmarklet",

  properties: {
    /**
     * Store data with path resolved.
     */
    appStoreConnection: {
      type: Object,
      value: {
        url: "appstore.json"
      }
    }
  }
});
export { HaxBookmarklet };
