/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@vaadin/vaadin-upload/vaadin-upload.js";
/**
 * `lrnapp-media-upload`
 * `Simple media upload wrapper element`
 *
 * @demo demo/index.html
 */
let LrnappMediaUpload = Polymer({
  _template: html`
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
    <vaadin-upload target\$="{{uploadPath}}" method="POST" form-data-name="file-upload"></vaadin-upload>
`,

  is: "lrnapp-media-upload",

  properties: {
    uploadPath: {
      type: String,
      notify: true,
      reflectToAttribute: true
    }
  }
});
export { LrnappMediaUpload };
