/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `lrndesign-gallery-details`
 * An element that renders the print view of a gallery item.
 *
 * @customElement lrndesign-gallery-details
 * 
 * @microcopy - language worth noting:```
<lrndesign-gallery-details 
  details="<strong>HTML MARKUP HERE</strong>"       //required, an array of item data
</lrndesign-gallery-details>```
 *
 */
class LrndesignGalleryDetails extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        :host([hidden]) {
          display: none;
        }
      `
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "lrndesign-gallery-details";
  }
  // render function
  render() {
    return html`
      <div id="details"></div>
    `;
  }
  constructor() {
    super();
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "details") {
        this._detailsChanged(this[propName]);
      }
    });
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * image's details in as a string of HTML
       */
      details: {
        type: String
      }
    };
  }
  /**
   * updates the details
   */
  _detailsChanged(newValue) {
    if (this.shadowRoot) {
      this.shadowRoot.querySelector("#details").innerHTML = newValue;
    }
  }
}
window.customElements.define(
  LrndesignGalleryDetails.tag,
  LrndesignGalleryDetails
);
export { LrndesignGalleryDetails };
