import "@polymer/polymer/polymer.js";
import "vaadin-upload/vaadin-upload.js";
Polymer({
  _template: `
    <style>
      :host {
        display: block;
      }
      paper-button {
        padding: 0;
        margin: 0;
        min-width: 1rem;
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
