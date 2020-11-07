import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SecureRequestXhr } from "@lrnwebcomponents/secure-request/secure-request.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@lrnwebcomponents/secure-request/secure-request.js";
import "./lrnapp-studio-submission-edit-add-asset.js";
import "./lrnapp-studio-submission-media-editoverlay.js";
class LrnappStudioSubmissionEditVideo extends SecureRequestXhr(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          position: relative;
          align-items: stretch;
        }

        lrnapp-studio-submission-media-editoverlay,
        lrnapp-studio-submission-edit-add-asset {
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

      <dom-repeat items="[[videos]]" as="video">
        <template>
          <lrnapp-studio-submission-media-editoverlay
            on-deleted="_videoDelete"
            data-index$="[[index]]"
          >
            <iframe
              class="videosfield__iframe"
              src$="[[video.video_src]]"
            ></iframe>
          </lrnapp-studio-submission-media-editoverlay>
        </template>
      </dom-repeat>

      <lrnapp-studio-submission-edit-add-asset
        icon="av:video-library"
        on-click="_openDialog"
      ></lrnapp-studio-submission-edit-add-asset>

      <paper-dialog id="dialog">
        <h2>Add Video</h2>
        <div style="height:50vh;width:100%;overflow:scroll;">
          <paper-input label="Video URL" value="{{newvideo}}"></paper-input>
        </div>
        <div class="buttons">
          <button dialog-dismiss="">Cancel</button>
          <button dialog-confirm="" on-click="_addImage">Add Video</button>
        </div>
      </paper-dialog>

      <template is="dom-if" if="[[videoGenerateSourceUrl]]">
        <!-- Generate Video Source Url for preview -->
        <iron-ajax
          id="videoGenerateSourceUrl"
          url="[[videoGenerateSourceUrl]]"
          method="POST"
          body="[[newvideo]]"
          content-type="application/json"
          handle-as="json"
          on-response="_addImage"
        ></iron-ajax>
      </template>
    `;
  }
  static get tag() {
    return "lrnapp-studio-submission-edit-video";
  }

  static get properties() {
    return {
      videos: {
        type: Array,
        notify: true,
      },
      selectedPage: {
        type: String,
        value: "0",
      },
      newvideo: {
        type: String,
        value: "",
      },
      videoGenerateSourceUrl: {
        type: String,
        value: null,
      },
    };
  }
  _openDialog(e) {
    this.$.dialog.open();
  }

  _addImage(e) {
    var video_url = this.newvideo;
    var normalizedEvent = dom(e);
    var tagname = normalizedEvent.localTarget.tagName;
    // find out if the component that called this function
    // if it's the iron-ajax then that means we have what we
    // need to add this new video to the array.
    if (tagname === "IRON-AJAX") {
      var video_src = e.detail.response.data;
      // make sure we upgrade from NULL to an array if needed
      if (Object.prototype.toString.call(this.videos) != "[object Array]") {
        this.videos = [];
      }
      this.push("videos", { video_url: this.newvideo, video_src: video_src });
      this.newvideo = "";
    }
    // if it wasn't iron ajax, then we need to go get the
    // newvideo's source url from the api
    else {
      this.shadowRoot
        .querySelector("#videoGenerateSourceUrl")
        .generateRequest();
    }
  }

  _videoDelete(e) {
    var normalizedEvent = dom(e);
    var deleteIndex = normalizedEvent.localTarget.getAttribute("data-index");
    this.splice("videos", deleteIndex, 1);
  }

  ready() {
    super.ready();
    const url = this.generateUrl("/api/video/generate-source-url");
    this.set("videoGenerateSourceUrl", url);
  }
}
window.customElements.define(
  LrnappStudioSubmissionEditVideo.tag,
  LrnappStudioSubmissionEditVideo
);
export { LrnappStudioSubmissionEditVideo };
