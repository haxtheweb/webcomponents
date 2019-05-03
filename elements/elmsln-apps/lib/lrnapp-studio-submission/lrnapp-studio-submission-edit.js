import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import "./lrnapp-studio-submission-media-editoverlay.js";
import "./lrnapp-studio-submission-edit-images.js";
import "./lrnapp-studio-submission-edit-files.js";
import "./lrnapp-studio-submission-edit-video.js";
import "./lrnapp-studio-submission-edit-links.js";
import "./lrnapp-studio-submission-edit-textarea.js";
class LrnappStudioSubmissionEdit extends PolymerElement {
  static get template() {
    return html`
      <style>
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
      </style>
      <template is="dom-if" if="{{submission}}">
        <div class="field">
          <paper-input
            label="Title"
            value="{{submission.attributes.title}}"
          ></paper-input>
        </div>
        <!-- Body -->
        <div class="field">
          <label>Submission Text</label>
          <lrnapp-studio-submission-edit-textarea
            content="{{submission.attributes.body}}"
          ></lrnapp-studio-submission-edit-textarea>
        </div>

        <!-- Images -->
        <div class="imagesfield field">
          <label for="image-upload">Images</label>
          <lrnapp-studio-submission-edit-images
            images="{{submission.attributes.images}}"
            file-types="[[submission.meta.imagefieldTypes]]"
          ></lrnapp-studio-submission-edit-images>
        </div>

        <!-- Files -->
        <div class="filesfield field">
          <label for="file-upload">Files</label>
          <lrnapp-studio-submission-edit-files
            files="{{submission.attributes.files}}"
            file-types="[[submission.meta.filefieldTypes]]"
          >
          </lrnapp-studio-submission-edit-files>
        </div>

        <!-- Links -->
        <div id="linksfield" class="linksfield field">
          <label for="links-input">Links</label>
          <lrnapp-studio-submission-edit-links
            links="{{submission.attributes.links}}"
          ></lrnapp-studio-submission-edit-links>
        </div>

        <!-- Videos -->
        <div id="videosfield" class="videosfield field">
          <label for="videos-input">Videos</label>
          <lrnapp-studio-submission-edit-video
            videos="{{submission.attributes.video}}"
            end-point="[[endPoint]]"
            csrf-token="[[csrfToken]]"
          ></lrnapp-studio-submission-edit-video>
        </div>

        <div class="actions">
          <lrnsys-button
            id="publish"
            icon="check"
            label="Publish to Studio"
            on-click="_publishClicked"
            hover-class="amber lighten-5 green-text text-darken-4"
            icon-class="green-text"
          ></lrnsys-button>
          <lrnsys-button
            id="save-draft"
            icon="drafts"
            label="Save Draft"
            on-click="_saveDraftClicked"
            hover-class="amber lighten-5 amber-text text-darken-4"
            icon-class="amber-text text-darken-4"
          ></lrnsys-button>
          <span class="spacer"></span>
          <lrnsys-button
            id="delete"
            label="Delete"
            icon="delete"
            on-click="_deleteClicked"
            hover-class="amber lighten-5 red-text"
            icon-class="red-text text-darken-4"
          >
          </lrnsys-button>
        </div>
      </template>
    `;
  }
  static get tag() {
    return "lrnapp-studio-submission-edit";
  }
  static get properties() {
    return {
      submission: {
        type: Object,
        notify: true
      },
      uploadFilesUrl: {
        type: String
      },
      newlink: {
        type: String
      },
      newvideo: {
        type: String
      },
      videoGenerateSourceUrl: {
        type: String
      },
      submission: {
        type: Object,
        notify: true
      }
    };
  }

  static get observers() {
    return ["_bodyChanged(title)"];
  }

  _publishClicked(e) {
    this.set("submission.attributes.state", "submission_ready");
    this.notifyPath("submission.attributes.state");
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
    this.set("submission.attributes.state", "submission_in_progress");
    this.notifyPath("submission.attributes.state");
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
