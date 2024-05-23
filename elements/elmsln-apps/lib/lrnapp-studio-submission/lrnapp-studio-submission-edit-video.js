import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SecureRequestXhr } from "@haxtheweb/secure-request/secure-request.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@haxtheweb/secure-request/secure-request.js";
import "./lrnapp-studio-submission-edit-add-asset.js";
import "./lrnapp-studio-submission-media-editoverlay.js";
import { normalizeEventPath } from "@haxtheweb/utils/utils.js";

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
          reject-with-request
          on-last-error-changed="lastErrorChanged"
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
  /**
   * Handle the last error rolling in
   */
  lastErrorChanged(e) {
    if (e.detail.value) {
      console.error(e);
      const target = normalizeEventPath(e)[0];
      // check for JWT needing refreshed vs busted but must be 403
      switch (parseInt(e.detail.value.status)) {
        // cookie data not found, need to go get it
        // @notice this currently isn't possible but we could modify
        // the backend in the future to support throwing 401s dynamically
        // if we KNOW an event must expire the timing token
        case 401:
        case 401:
          // we know what the "target" is as an iron-ajax tag
          // so we know what call was just attempted. Let's await
          // a fetch against the top level site landing page with
          // no-cors will force a hit against the backend to refresh
          // the PHP session / bounce back from Azure as needed
          // so that when we reissue this call it'll go through (magically)
          fetch(window.Drupal.settings.basePath, { mode: "no-cors" }).then(
            (e) => {
              console.log(e);
              // delay just to be sure
              setTimeout(() => {
                target.generateRequest();
              }, 250);
            },
          );
          break;
      }
    }
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
customElements.define(
  LrnappStudioSubmissionEditVideo.tag,
  LrnappStudioSubmissionEditVideo,
);
export { LrnappStudioSubmissionEditVideo };
