import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/paper-input/paper-input.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import "./lrnapp-studio-submission-media-editoverlay.js";
import "./lrnapp-studio-submission-edit-images.js";
import "./lrnapp-studio-submission-edit-files.js";
import "./lrnapp-studio-submission-edit-video.js";
import "./lrnapp-studio-submission-edit-links.js";
import "./lrnapp-studio-submission-edit-textarea.js";
class LrnappStudioSubmissionEdit extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          padding: 16px;
        }
        .field {
          padding-bottom: 16px;
        }
        .actions {
          display: flex;
          border-top: 2px solid gainsboro;
          margin-top: 16px;
        }
        .actions .spacer {
          flex: 1 1 auto;
        }
        iron-icon {
          margin-right: 6px;
          --iron-icon-height: 32px;
          --iron-icon-width: 32px;
        }
        .imagesfiled__image_delete {
          position: absolute;
          top: 0;
          right: 0;
        }
      `
    ];
  }
  render() {
    return html`
      ${this.submission
        ? html`
            <div class="field">
              <paper-input
                label="Title"
                value="${this.submission.attributes.title}"
                @value-changed="${this.titleEvent}"
              ></paper-input>
            </div>
            <!-- Body -->
            <div class="field">
              <label>Submission Text</label>
              <lrnapp-studio-submission-edit-textarea
                content="${this.submission.attributes.body}"
                @content-changed="${this.contentEvent}"
              ></lrnapp-studio-submission-edit-textarea>
            </div>

            <!-- Images -->
            <div class="imagesfield field">
              <label for="image-upload">Images</label>
              <lrnapp-studio-submission-edit-images
                .images="${this.submission.attributes.images}"
                @images-changed="${this.imagesEvent}"
                file-types="${this.submission.meta.imagefieldTypes}"
              ></lrnapp-studio-submission-edit-images>
            </div>

            <!-- Files -->
            <div class="filesfield field">
              <label for="file-upload">Files</label>
              <lrnapp-studio-submission-edit-files
                .files="${this.submission.attributes.files}"
                @files-changed="${this.filesEvent}"
                file-types="${this.submission.meta.filefieldTypes}"
              >
              </lrnapp-studio-submission-edit-files>
            </div>

            <!-- Links -->
            <div id="linksfield" class="linksfield field">
              <label for="links-input">Links</label>
              <lrnapp-studio-submission-edit-links
                .links="${this.submission.attributes.links}"
                @links-changed="${this.linksEvent}"
              ></lrnapp-studio-submission-edit-links>
            </div>

            <!-- Videos -->
            <div id="videosfield" class="videosfield field">
              <label for="videos-input">Videos</label>
              <lrnapp-studio-submission-edit-video
                .videos="${this.submission.attributes.video}"
                @videos-changed="${this.submissionVideosChanged}"
                end-point="${this.endPoint}"
                csrf-token="${this.csrfToken}"
              ></lrnapp-studio-submission-edit-video>
            </div>

            <div class="actions">
              <lrnsys-button
                id="publish"
                icon="check"
                label="Publish to Studio"
                @click="${this._publishClicked}"
                hover-class="amber lighten-5 green-text text-darken-4"
                icon-class="green-text"
              ></lrnsys-button>
              <lrnsys-button
                id="save-draft"
                icon="drafts"
                label="Save Draft"
                @click="${this._saveDraftClicked}"
                hover-class="amber lighten-5 amber-text text-darken-4"
                icon-class="amber-text text-darken-4"
              ></lrnsys-button>
              <span class="spacer"></span>
              <lrnsys-button
                id="delete"
                label="Delete"
                icon="delete"
                @click="${this._deleteClicked}"
                hover-class="amber lighten-5 red-text"
                icon-class="red-text text-darken-4"
              >
              </lrnsys-button>
            </div>
          `
        : ``}
    `;
  }
  titleEvent(e) {
    this.submission.attributes.title = e.detail.value;
  }
  contentEvent(e) {
    this.submission.attributes.body = e.detail.value;
  }
  imagesEvent(e) {
    this.submission.attributes.images = [...e.detail.value];
  }
  filesEvent(e) {
    this.submission.attributes.files = [...e.detail.value];
  }
  linksEvent(e) {
    this.submission.attributes.links = [...e.detail.value];
  }
  submissionVideosChanged(e) {
    this.submission.attributes.video = [...e.detail.value];
  }
  static get tag() {
    return "lrnapp-studio-submission-edit";
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "title") {
        this._bodyChanged(this[propName]);
      }
      if (propName == "submission") {
        // notify
        this.dispatchEvent(
          new CustomEvent("submission-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
    });
  }
  static get properties() {
    return {
      submission: {
        type: Object
      },
      uploadFilesUrl: {
        type: String,
        attribute: "upload-files-url"
      },
      newlink: {
        type: String
      },
      newvideo: {
        type: String
      },
      videoGenerateSourceUrl: {
        type: String,
        attribute: "video-generate-source-url"
      }
    };
  }

  _publishClicked(e) {
    this.submission.attributes.state = "submission_ready";
    this.submission.attributes = { ...this.submission.attributes };
    this.dispatchEvent(
      new CustomEvent("submissionPublishClicked", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: true
      })
    );
  }
  _saveDraftClicked(e) {
    this.submission.attributes.state = "submission_in_progress";
    this.submission.attributes = { ...this.submission.attributes };
    this.dispatchEvent(
      new CustomEvent("submissionSaveDraftClicked", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: true
      })
    );
  }

  _deleteClicked(e) {
    this.dispatchEvent(
      new CustomEvent("submissionDeleteClicked", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: true
      })
    );
  }

  /**
   * Simple way to convert from object to array.
   */
  _toArray(obj) {
    if (obj == null) {
      return [];
    }
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
}
window.customElements.define(
  LrnappStudioSubmissionEdit.tag,
  LrnappStudioSubmissionEdit
);
export { LrnappStudioSubmissionEdit };
