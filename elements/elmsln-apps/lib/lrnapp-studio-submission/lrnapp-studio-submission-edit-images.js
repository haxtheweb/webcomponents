import { LitElement, html, css } from "lit-element/lit-element.js";
import { SecureRequestXhr } from "@lrnwebcomponents/secure-request/secure-request.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-button/paper-button.js";
import "@vaadin/vaadin-upload/vaadin-upload.js";
import "./lrnapp-studio-submission-edit-add-asset.js";
import "./lrnapp-studio-submission-edit-image.js";
class LrnappStudioSubmissionEditImages extends SecureRequestXhr(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          position: relative;
          min-height: 200px;
        }
        #pages {
          display: block;
        }
        .images__images {
          display: flex;
          flex-wrap: wrap;
        }
        .images__images > * {
          margin-right: 16px;
          min-width: 200px;
        }
        neon-animated-pages .iron-selected {
          position: static;
        }
        paper-dialog {
          width: 50%;
          width: 50vmax;
          padding: 16px;
        }
      `
    ];
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <div class="images__images">
        ${this.images.map(
          (image, index) => html`
            <lrnapp-studio-submission-edit-image
              .image="${image}"
              @deleted="${this._deleteImage}"
              data-index="${index}"
            ></lrnapp-studio-submission-edit-image>
          `
        )}
        <lrnapp-studio-submission-edit-add-asset
          @click="${this._addImage}"
          icon="image:photo-library"
        ></lrnapp-studio-submission-edit-add-asset>
      </div>
      <paper-dialog id="dialog">
        <h2>Add Image(s)</h2>
        <paper-dialog-scrollable>
          <div class="images__upload">
            ${this.uploadUrl
              ? html`
                  <vaadin-upload
                    accept="${this.fileTypes}"
                    target="${this.uploadUrl}"
                    method="POST"
                    form-data-name="file-upload"
                    @upload-success="${this._handleImageUploadSuccess}"
                  >
                    <div class="images__drop-label">
                      <iron-icon icon="description"></iron-icon>
                      Upload files here:
                    </div>
                  </vaadin-upload>
                `
              : ``}
          </div>
        </paper-dialog-scrollable>
        <div class="buttons">
          <paper-button dialog-dismiss="">Cancel</paper-button>
        </div>
      </paper-dialog>
    `;
  }
  static get tag() {
    return "lrnapp-studio-submission-edit-images";
  }
  static get properties() {
    return {
      images: {
        type: Array
      },
      selectedPage: {
        type: String,
        attribute: "selected-page"
      },
      fileTypes: {
        type: String,
        attribute: "file-types"
      },
      uploadUrl: {
        type: String,
        attribute: "upload-url"
      }
    };
  }

  _addImage(e) {
    // @todo switch to singleton
    this.shadowRoot.querySelector("#dialog").open();
  }

  _selectPage(e) {
    var page = e.target.getAttribute("data-page");
    this.selectedPage = page;
  }

  _handleImageUploadSuccess(e) {
    this.selectedPage = 0;
    var images = [];
    var response = e.detail.xhr.response;
    // normalize response string
    var response = JSON.parse(response);
    // get the newely created file
    if (response.data.file) {
      var file = response.data.file;
      // add it to the list of submission images.
      // find out if the image is already referenced in the submission
      // images array and if it is replace it.
      var replacement = false;
      if (this.images) {
        images = this.images.map(function(image) {
          if (image.fid === file.fid) {
            replacement = true;
            return file;
          } else {
            return image;
          }
        });
      }
      // if the image was not a replacement then add it to the array
      if (!replacement) {
        images.push(file);
      }
      this.images = [...images];
      this.shadowRoot.querySelector("#dialog").close();
    }
  }

  _deleteImage(e) {
    var deleteIndex = e.target.getAttribute("data-index");
    this.images.splice(deleteIndex, 1);
  }
  constructor() {
    super();
    this.images = [];
    this.selectedPage = "0";
    this.uploadUrl = this.generateUrl("/api/files");
  }
}
window.customElements.define(
  LrnappStudioSubmissionEditImages.tag,
  LrnappStudioSubmissionEditImages
);
export { LrnappStudioSubmissionEditImages };
