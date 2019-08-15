/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";

class ElmsMediaUpload extends PolymerElement {
  constructor() {
    super();
    import("@polymer/paper-button/paper-button.js");
    import("@vaadin/vaadin-upload/vaadin-upload.js");
    import("@polymer/paper-dialog/paper-dialog.js");
    import("@polymer/app-layout/app-toolbar/app-toolbar.js");
    import("@polymer/paper-dropdown-menu/paper-dropdown-menu.js");
    import("@polymer/paper-listbox/paper-listbox.js");
    import("@polymer/paper-item/paper-item.js");
    import("@polymer/paper-checkbox/paper-checkbox.js");
    import("@polymer/paper-button/paper-button.js");
    import("@polymer/paper-input/paper-input.js");
  }
  static get template() {
    return html`
      <style include="simple-colors-shared-styles">
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
        .green {
          background-color: var(--simple-colors-default-theme-green-6);
        }
      </style>
      <vaadin-upload
        target$="[[uploadPath]]"
        method="POST"
        form-data-name="file-upload"
        timeout="0"
        accept="video/mp4,image/*,audio/*,application/pdf,application/zip"
      ></vaadin-upload>
      <paper-dialog id="dialog">
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
          <paper-button raised class="green">Save</paper-button>
        </app-toolbar>
        <h2>[[uploadTitle]]</h2>
        <paper-input
          label="Title"
          placeholder="Title"
          value="{{uploadTitle}}"
        ></paper-input>
        <div id="content"></div>
      </paper-dialog>
    `;
  }
  static get tag() {
    return "elmsmedia-upload";
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.addEventListener("upload-success", this._uploadSuccess.bind(this));
    });
  }
  static get properties() {
    return {
      uploadPath: {
        type: String,
        notify: true
      },
      uploadTitle: {
        type: String,
        notify: true
      },
      hasLightbox: {
        type: Boolean,
        notify: true
      }
    };
  }
  /**
   * _uploadSuccess triggered after an event of a successful upload goes through
   */
  _uploadSuccess(event) {
    // parse the raw response cause it won't be natively
    // since event wants to tell you about the file generally
    let response = JSON.parse(event.detail.xhr.response);
    this.uploadTitle = response.data.node.title;
    this.shadowRoot.querySelector("#content").innerHTML =
      response.data.node.nid;
    this.shadowRoot.querySelector("#dialog").open();
  }
}
window.customElements.define(ElmsMediaUpload.tag, ElmsMediaUpload);
export { ElmsMediaUpload };
