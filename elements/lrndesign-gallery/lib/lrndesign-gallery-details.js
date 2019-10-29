/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";

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
        :host([hidden]) {
          display: none;
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
        value: null,
        observer: "_detailsChanged"
      }
    };
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this._detailsChanged();
  }

  /**
   * updates the details
   *
   * @param {details} the details to be updated
   */
  _detailsChanged() {
    this.$.details.innerHTML = this.details;
  }
}
window.customElements.define(
  LrndesignGalleryDetails.tag,
  LrndesignGalleryDetails
);
