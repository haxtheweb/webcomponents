import "./lrnapp-studio-submission-edit-add-asset.js";
Polymer({
  _template: `
    <style>
      :host {
        display: flex;
        position: relative;
        align-items: stretch;
      }

      :host > *:not(paper-dialog) {
        background: lightgray;
        display: flex;
        align-items: center;
        margin-right: 1em;
      }

      iframe {
        display: block;
      }

      .videosfield__create {
        display: block;
        height: 250px;
        width: 300px;
      }

      paper-dialog {
        width: 50%;
        width: 50vmax;
        padding: 1em;
      }
    </style>

    <template is="dom-repeat" items="{{videos}}" as="video">
      <lrnapp-studio-submission-media-editoverlay on-delete="_videoDelete" data-index\$="[[index]]">
        <iframe class="videosfield__iframe" src="{{video.video_src}}"></iframe>
      </lrnapp-studio-submission-media-editoverlay>
    </template>

    <lrnapp-studio-submission-edit-add-asset icon="av:video-library" on-click="_openDialog"></lrnapp-studio-submission-edit-add-asset>

    <paper-dialog id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" with-backdrop="">
      <h2>Add Video</h2>
      <paper-dialog-scrollable>
        <paper-input label="Video URL" value="{{newvideo}}"></paper-input>
      </paper-dialog-scrollable>
      <div class="buttons">
        <paper-button dialog-dismiss="">Cancel</paper-button>
        <paper-button dialog-confirm="" on-click="_addImage">Add Video</paper-button>
      </div>
    </paper-dialog>

    <template is="dom-if" if="[[videoGenerateSourceUrl]]">
      <!-- Generate Video Source Url for preview -->
      <iron-ajax id="videoGenerateSourceUrl" url="[[videoGenerateSourceUrl]]" method="POST" body="[[newvideo]]" content-type="application/json" handle-as="json" on-response="_addImage"></iron-ajax>
    </template>
`,

  is: "lrnapp-studio-submission-edit-video",
  behaviors: [SecureRequest.xhr],

  properties: {
    videos: {
      type: Array,
      value: [],
      notify: true
    },
    selectedPage: {
      type: String,
      value: "0"
    },
    newvideo: {
      type: String,
      value: ""
    },
    videoGenerateSourceUrl: {
      type: String,
      value: null
    }
  },

  _openDialog: function(e) {
    document.body.appendChild(this.$.dialog);
    this.$.dialog.open();
  },

  _addImage: function(e) {
    var root = this;
    var video_url = root.newvideo;
    var normalizedEvent = dom(e);
    var tagname = normalizedEvent.localTarget.tagName;
    // find out if the component that called this function
    // if it's the iron-ajax then that means we have what we
    // need to add this new video to the array.
    if (tagname === "IRON-AJAX") {
      var video_src = e.detail.response.data;
      // make sure we upgrade from NULL to an array if needed
      if (Object.prototype.toString.call(root.videos) != "[object Array]") {
        this.videos = [];
      }
      root.push("videos", { video_url: root.newvideo, video_src: video_src });
      root.newvideo = "";
    }
    // if it wasn't iron ajax, then we need to go get the
    // newvideo's source url from the api
    else {
      this.shadowRoot
        .querySelector("#videoGenerateSourceUrl")
        .generateRequest();
    }
  },

  _videoDelete: function(e) {
    var root = this;
    var normalizedEvent = dom(e);
    var deleteIndex = normalizedEvent.localTarget.getAttribute("data-index");
    root.splice("videos", deleteIndex, 1);
  },

  ready: function() {
    const url = this.generateUrl("/api/video/generate-source-url");
    this.set("videoGenerateSourceUrl", url);
  }
});
