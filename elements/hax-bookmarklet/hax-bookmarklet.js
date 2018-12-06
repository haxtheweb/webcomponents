import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/cms-hax/cms-hax.js";
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
    <cms-hax
      open-default
      app-store-connection="[[appStoreConnection]]"
      body-offset-left
    >
      <slot></slot>
    </cms-hax>
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
