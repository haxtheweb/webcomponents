import {
  html,
  Polymer
} from "../../node_modules/@polymer/polymer/polymer-legacy.js";
import "../../node_modules/@polymer/paper-button/paper-button.js";
import "../../node_modules/@vaadin/vaadin-upload/vaadin-upload.js";
import "../../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "../../node_modules/@polymer/paper-dialog/paper-dialog.js";
import "../../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js";
import "../../node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js";
import "../../node_modules/@polymer/paper-listbox/paper-listbox.js";
import "../../node_modules/@polymer/paper-item/paper-item.js";
import "../../node_modules/@polymer/paper-checkbox/paper-checkbox.js";
import "../../node_modules/@polymer/paper-button/paper-button.js";
import "../../node_modules/@polymer/paper-input/paper-input.js";
let ElmsMediaUpload = Polymer({
  _template: html`
    <custom-style>
      <style is="custom-style" include="materializecss-styles">
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
    </custom-style>
    <vaadin-upload
      target\$="{{uploadPath}}"
      method="POST"
      form-data-name="file-upload"
      timeout="0"
      accept="video/mp4,image/*,audio/*,application/pdf,application/zip"
    ></vaadin-upload>
    <paper-dialog
      id="dialog"
      entry-animation="scale-up-animation"
      exit-animation="fade-out-animation"
      with-backdrop=""
    >
      <app-toolbar>
        <paper-dropdown-menu label="Display style">
          <paper-listbox slot="dropdown-content" class="dropdown-content">
            <paper-item value="image">Image</paper-item>
            <paper-item value="image__circle">Circle</paper-item>
          </paper-listbox>
        </paper-dropdown-menu>
        <paper-checkbox class="styled" checked="{{hasLightbox}}">
          Lightbox <span class="subtitle"> Users can click to expand </span>
        </paper-checkbox>
        <paper-button raised="" class="green">Save</paper-button>
      </app-toolbar>
      <h2 id="title">{{uploadTitle}}</h2>
      <paper-input
        label="Title"
        placeholder="Title"
        value="{{uploadTitle}}"
      ></paper-input>
      <div id="content"></div>
    </paper-dialog>
  `,
  is: "elmsmedia-upload",
  listeners: { "upload-success": "_uploadSuccess" },
  properties: {
    uploadPath: { type: String, reflectToAttribute: !0, notify: !0 },
    uploadTitle: { type: String, reflectToAttribute: !0, notify: !0 },
    hasLightbox: { type: Boolean, reflectToAttribute: !0, notify: !0 }
  },
  _uploadSuccess: function(event) {
    var response = JSON.parse(event.detail.xhr.response);
    this.uploadTitle = response.data.node.title;
    this.$.content.innerHTML = response.data.node.nid;
    this.$.dialog.open();
  }
});
export { ElmsMediaUpload };
