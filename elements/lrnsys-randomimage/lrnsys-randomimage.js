import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/random-image/random-image.js";
import "@polymer/paper-button/paper-button.js";
/**
`lrnsys-randomimage`
A LRN element

@demo demo/index.html
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <div id="image-list">
      <random-image images-list\$="{{images}}"></random-image>
  </div>
  <paper-button raised="" on-click="reload">Reload</paper-button>
`,

  is: "lrnsys-randomimage",

  properties: {
    /**
     * An array of images to pick from at random.
     */
    images: {
      type: Object,
      notify: true,
      value: function() {
        return [];
      }
    }
  },

  /**
   * trigger a reload of the random-image element
   */
  reload: function(e) {
    let root = this;
    root.shadowRoot.querySelector(
      "#image-list"
    ).innerHTML = root.shadowRoot.querySelector("#image-list").innerHTML;
  }
});
