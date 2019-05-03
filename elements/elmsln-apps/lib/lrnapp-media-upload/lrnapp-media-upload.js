/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@vaadin/vaadin-upload/vaadin-upload.js";
/**
 * `lrnapp-media-upload`
 * `Simple media upload wrapper element`
 *
 * @demo demo/index.html
 */
class LrnappMediaUpload extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        paper-button {
          padding: 0;
          margin: 0;
          min-width: 16px;
        }
        vaadin-upload.thick-border {
          --primary-color: #396;
          --dark-primary-color: #063;
          --light-primary-color: #6c9;
          --error-color: darkred;

          border: 2px solid #ccc;
          padding: 14px;
          background: #eee;
          border-radius: 0;
        }
        vaadin-upload.thick-border[dragover] {
          border-color: #396;
        }
      </style>
      <vaadin-upload
        target\$="{{uploadPath}}"
        method="POST"
        form-data-name="file-upload"
      ></vaadin-upload>
    `;
  }
  static get tag() {
    return "lrnapp-media-upload";
  }
  static get properties() {
    return {
      uploadPath: {
        type: String,
        notify: true,
        reflectToAttribute: true
      }
    };
  }
}
window.customElements.define(LrnappMediaUpload.tag, LrnappMediaUpload);
export { LrnappMediaUpload };
