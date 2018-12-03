import './lrnapp-studio-submission-media-editoverlay.js';
import './lrnapp-studio-submission-edit-images.js';
import './lrnapp-studio-submission-edit-files.js';
import './lrnapp-studio-submission-edit-video.js';
import './lrnapp-studio-submission-edit-links.js';
import './lrnapp-studio-submission-edit-textarea.js';
Polymer({
  _template: `
    <style>
      :host {
        display: block;
        padding: 1em;
      }

      .field {
        padding-bottom: 1em;
      }

      .actions {
        display: flex;
        border-top: 2px solid gainsboro;
        margin-top: 1em;
      }

      .actions .spacer {
        flex: 1 1 auto;
      }

      iron-icon {
        margin-right: .4em;
        --iron-icon-height: 2em;
        --iron-icon-width: 2em;
      }

      .imagesfiled {}

      .imagesfiled__image_delete {
        position: absolute;
        top: 0;
        right: 0;
      }

      paper-dialog {
        width: 50%;
        width: 50vmax;
        padding: 1em;
      }
    </style>

    <template is="dom-if" if="{{submission}}">
      <div class="field">
        <paper-input label="Title" value="{{submission.attributes.title}}"></paper-input>
      </div>

      <!-- Body -->
      <div class="field">
        <label>Submission Text</label>
        <lrnapp-studio-submission-edit-textarea content="{{submission.attributes.body}}"></lrnapp-studio-submission-edit-textarea>
      </div>

      <!-- Images -->
      <div class="imagesfield field">
        <label for="image-upload">Images</label>
        <lrnapp-studio-submission-edit-images images="{{submission.attributes.images}}" file-types="[[submission.meta.imagefieldTypes]]"></lrnapp-studio-submission-edit-images>
      </div>

      <!-- Files -->
      <div class="filesfield field">
        <label for="file-upload">Files</label>
        <lrnapp-studio-submission-edit-files files="{{submission.attributes.files}}" file-types="[[submission.meta.filefieldTypes]]">
      </lrnapp-studio-submission-edit-files></div>

      <!-- Links -->
      <div id="linksfield" class="linksfield field">
        <label for="links-input">Links</label>
        <lrnapp-studio-submission-edit-links links="{{submission.attributes.links}}"></lrnapp-studio-submission-edit-links>
      </div>

      <!-- Videos -->
      <div id="videosfield" class="videosfield field">
        <label for="videos-input">Videos</label>
        <lrnapp-studio-submission-edit-video videos="{{submission.attributes.video}}" end-point="[[endPoint]]" csrf-token="[[csrfToken]]"></lrnapp-studio-submission-edit-video>
      </div>


      <div class="actions">
        <lrnsys-button id="publish" icon="check" label="Publish to Studio" on-click="_publishClicked" hover-class="amber lighten-5 green-text text-darken-4" icon-class="green-text"></lrnsys-button>
        <lrnsys-button id="save-draft" icon="drafts" label="Save Draft" on-click="_saveDraftClicked" hover-class="amber lighten-5 amber-text text-darken-4" icon-class="amber-text text-darken-4"></lrnsys-button>
        <span class="spacer"></span>
        <lrnsys-button id="delete" label="Delete" icon="delete" on-click="_deleteClicked" hover-class="amber lighten-5 red-text" icon-class="red-text text-darken-4">
        </lrnsys-button>
      </div>
    </template>
`,

  is: 'lrnapp-studio-submission-edit',

  properties: {
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
  },

  observers: [
    '_bodyChanged(title)'
  ],

  _publishClicked: function (e) {
    this.set('submission.attributes.state', 'submission_ready');
    this.fire('submissionPublishClicked');
  },

  _saveDraftClicked: function (e) {
    this.set('submission.attributes.state', 'submission_in_progress');
    this.fire('submissionSaveDraftClicked');
  },

  _deleteClicked: function (e) {
    this.fire('submissionDeleteClicked');
  },

  /**
   * Simple way to convert from object to array.
   */
  _toArray: function (obj) {
    return Object.keys(obj).map(function (key) {
      return obj[key];
    });
  },

  ready: function () {
  }
});
