import "./lrnapp-studio-submission-edit-add-asset.js";
import "./lrnapp-studio-submission-edit-image.js";
Polymer({
  _template: `
    <style>
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

      .images__images>* {
        margin-right: 1em;
        min-width: 200px;
      }

      neon-animated-pages .iron-selected {
        position: static;
      }

      paper-dialog {
        width: 50%;
        width: 50vmax;
        padding: 1em;
      }
    </style>

    <div class="images__images">
      <template is="dom-repeat" items="{{images}}" as="image">
        <lrnapp-studio-submission-edit-image image="{{image}}" on-deleted="_deleteImage" data-index\$="[[index]]"></lrnapp-studio-submission-edit-image>
      </template>
      <lrnapp-studio-submission-edit-add-asset on-click="_addImage" icon="image:photo-library"></lrnapp-studio-submission-edit-add-asset>
    </div>

    <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" with-backdrop="">
      <h2>Add Image(s)</h2>
      <paper-dialog-scrollable>
        <div class="images__upload">
          <template is="dom-if" if="[[uploadUrl]]">
            <vaadin-upload accept="[[fileTypes]]" target="[[uploadUrl]]" method="POST" form-data-name="file-upload" on-upload-success="_handleImageUploadSuccess">
              <div class="images__drop-label">
                <iron-icon icon="description"></iron-icon>
                Upload files here:
              </div>
            </vaadin-upload>
          </template>
        </div>
      </paper-dialog-scrollable>
      <div class="buttons">
        <paper-button dialog-dismiss="">Cancel</paper-button>
      </div>
    </paper-dialog>
`,

  is: "lrnapp-studio-submission-edit-images",
  behaviors: [SecureRequest.xhr],

  properties: {
    images: {
      type: Array,
      notify: true,
      value: []
    },
    selectedPage: {
      type: String,
      value: 0
    },
    uploadUrl: {
      type: String,
      value: null
    }
  },

  _addImage: function(e) {
    document.body.appendChild(this.$.dialog);
    this.$.dialog.open();
  },

  _selectPage: function(e) {
    var root = this;
    var normalizedEvent = dom(e);
    var page = normalizedEvent.localTarget.getAttribute("data-page");
    root.set("selectedPage", page);
  },

  _handleImageUploadSuccess: function(e) {
    var root = this;
    root.set("selectedPage", 0);
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
      if (root.images) {
        images = root.images.map(function(image) {
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
      this.set("images", images);
      this.$.dialog.close();
    }
  },

  _deleteImage: function(e) {
    var root = this;
    var normalizedEvent = dom(e);
    // console.log(normalizedEvent.localTarget);
    var deleteIndex = normalizedEvent.localTarget.getAttribute("data-index");
    // console.log(deleteIndex);
    root.splice("images", deleteIndex, 1);
  },

  ready: function() {
    const uploadUrl = this.generateUrl("/api/files");
    if (uploadUrl !== null) {
      this.set("uploadUrl", uploadUrl);
    }
  }
});
