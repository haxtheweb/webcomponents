import { LitElement, html, css } from "lit-element/lit-element.js";
import { SecureRequestXhr } from "@lrnwebcomponents/secure-request/secure-request.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@vaadin/vaadin-upload/vaadin-upload.js";
import "@lrnwebcomponents/secure-request/secure-request.js";
import "./lrnapp-studio-submission-edit-add-asset.js";
import "./lrnapp-studio-submission-edit-file.js";
class LrnappStudioSubmissionEditFiles extends SecureRequestXhr(LitElement) {
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
        .files__files {
          display: flex;
          flex-wrap: wrap;
        }
        .files__files > * {
          margin-right: 16px;
          min-width: 200px;
        }
        paper-dialog {
          width: 50%;
          width: 50vmax;
          padding: 16px;
        }
      `
    ];
  }
  render() {
    return html`
      <div class="files__files">
        ${this.files.map(
          (file, index) => html`
            <lrnapp-studio-submission-edit-file
              .file="${file}"
              @deleted="${this._deleteImage}"
              data-index="${index}"
            ></lrnapp-studio-submission-edit-file>
          `
        )}
        <lrnapp-studio-submission-edit-add-asset
          @click="${this._addFile}"
          icon="editor:attach-file"
        ></lrnapp-studio-submission-edit-add-asset>
      </div>
      <paper-dialog id="dialog">
        <h2>Add Files</h2>
        <div class="files__upload">
          ${this.uploadUrl
            ? html`
                <vaadin-upload
                  accept="${this.fileTypes}"
                  target="${this.uploadUrl}"
                  method="POST"
                  form-data-name="file-upload"
                  @upload-success="${this._handleImageUploadSuccess}"
                >
                  <div class="files__drop-label">
                    <iron-icon icon="description"></iron-icon>
                    Upload files here:
                  </div>
                </vaadin-upload>
              `
            : ``}
        </div>
        <div>
          <paper-button dialog-dismiss>Cancel</paper-button>
        </div>
      </paper-dialog>
    `;
  }
  static get tag() {
    return "lrnapp-studio-submission-edit-files";
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      let notifiedProps = ["files"];
      if (notifiedProps.includes(propName)) {
        // notify
        let eventName = `${propName
          .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
          .toLowerCase()}-changed`;
        this.dispatchEvent(
          new CustomEvent(eventName, {
            detail: {
              value: this[propName]
            }
          })
        );
      }
    });
  }
  constructor() {
    super();
    this.files = [];
    this.selectedPage = 0;
    this.uploadUrl = null;
    this.fileTypes = "";
  }
  static get properties() {
    return {
      files: {
        type: Array
      },
      selectedPage: {
        type: String
      },
      uploadUrl: {
        type: String
      },
      fileTypes: {
        type: String,
        attribute: "file-types"
      }
    };
  }

  _addFile(e) {
    // @todo switch to singleton
    this.shadowRoot.querySelector("#dialog").open();
  }

  _selectPage(e) {
    var page = e.target.getAttribute("data-page");
    this.selectedPage = page;
  }

  _handleImageUploadSuccess(e) {
    this.selectedPage = 0;
    var response = e.detail.xhr.response;
    // normalize response string
    var response = JSON.parse(response);
    // get the newely created file
    if (response.data.file) {
      var file = response.data.file;
      if (this.files === null) {
        this.files = [];
      }
      this.files.push(file);
      this.shadowRoot.querySelector("#dialog").close();
    }
  }

  _deleteImage(e) {
    var deleteIndex = e.target.getAttribute("data-index");
    this.files.splice(Number(deleteIndex), 1);
  }

  _canUpload() {
    const uploadUrl = this.uploadUrl;
    if (uploadUrl !== null) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * attached life cycle
   */
  connectedCallback() {
    super.connectedCallback();
    const uploadUrl = this.generateUrl("/api/files");
    if (uploadUrl !== null) {
      this.uploadUrl = uploadUrl;
    }
  }
}
window.customElements.define(
  LrnappStudioSubmissionEditFiles.tag,
  LrnappStudioSubmissionEditFiles
);
export { LrnappStudioSubmissionEditFiles };
