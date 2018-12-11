/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
/*import "./lrndesign-gallery-zoom.js";*/

export { LrndesignGalleryDetails };
/**
 * `lrndesign-gallery-details`
 * `An element that renders the print view of a gallery item.`
 *
 * @microcopy - language worth noting:```
<lrndesign-gallery-details 
  details="<strong>HTML MARKUP HERE</strong>"       //required, an array of item data
</lrndesign-gallery-details>```
 *
 * @customElement
 * @polymer
 */
class LrndesignGalleryDetails extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "lrndesign-gallery-details";
  }

  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <div id="details"></div>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * image's details in as a string of HTML
       */
      details: {
        type: String,
        value: null
      },
      /**
       * image's details in as a string of HTML
       */
      __details: {
        type: String,
        computed: "_getDetails(details)"
      }
    };
  }

  /**
   * updates the details
   */
  _getDetails(details) {
    this.$.details.innerHTML = details;
  }
}
window.customElements.define(
  LrndesignGalleryDetails.tag,
  LrndesignGalleryDetails
);
