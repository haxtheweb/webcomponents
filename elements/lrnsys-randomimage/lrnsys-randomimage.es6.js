/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@lrnwebcomponents/random-image/random-image.js";
import "@polymer/paper-button/paper-button.js";
/**
 * `lrnsys-randomimage`
 * @element lrnsys-randomimage
 * @demo demo/index.html
 */
class LrnsysRandomimage extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <div id="list">
        <random-image images-list$="{{images}}"></random-image>
      </div>
      <paper-button raised on-click="reload">Reload</paper-button>
    `;
  }
  static get tag() {
    return "lrnsys-randomimage";
  }
  static get properties() {
    return {
      /**
       * An array of images to pick from at random.
       */
      images: {
        type: Object,
        notify: true,
        value() {
          return [];
        }
      }
    };
  }
  /**
   * trigger a reload of the random-image element
   */
  reload(e) {
    this.shadowRoot.querySelector(
      "#list"
    ).innerHTML = this.shadowRoot.querySelector("#list").innerHTML;
  }
}
window.customElements.define(LrnsysRandomimage.tag, LrnsysRandomimage);
export { LrnsysRandomimage };
