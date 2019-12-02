import { LitElement, html, css } from "lit-element/lit-element.js";
import { SecureRequestXhr } from "@lrnwebcomponents/secure-request/secure-request.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@lrnwebcomponents/secure-request/secure-request.js";
import "./lrnapp-studio-submission-edit-add-asset.js";
import "./lrnapp-studio-submission-media-editoverlay.js";
class LrnappStudioSubmissionEditVideo extends SecureRequestXhr(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
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
      `
    ];
  }
  render() {
    return html`
      ${this.videos.map((video, index) => html`
          <lrnapp-studio-submission-media-editoverlay
            @deleted="${this._videoDelete}"
            data-index="${index}"
          >
            <iframe
              class="videosfield__iframe"
              src="${video.video_src}"
            ></iframe>
          </lrnapp-studio-submission-media-editoverlay>
      `)}

      <lrnapp-studio-submission-edit-add-asset
        icon="av:video-library"
        @click="${this._openDialog}"
      ></lrnapp-studio-submission-edit-add-asset>

      <paper-dialog id="dialog">
        <h2>Add Video</h2>
        <paper-dialog-scrollable>
          <paper-input label="Video URL" value="${this.newvideo}" @value-changed="${this.newvideoEvent}"></paper-input>
        </paper-dialog-scrollable>
        <div class="buttons">
          <paper-button dialog-dismiss="">Cancel</paper-button>
          <paper-button dialog-confirm="" @click="${this._addVideo}"
            >Add Video</paper-button
          >
        </div>
      </paper-dialog>
      ${this.videoGenerateSourceUrl ? html`
        <!-- Generate Video Source Url for preview -->
        <iron-ajax
          id="videourl"
          url="${this.videoGenerateSourceUrl}"
          method="POST"
          .body="${this.newvideo}"
          content-type="application/json"
          handle-as="json"
          @response="${this._addVideoAjax}"
        ></iron-ajax>
      `: ``}
    `;
  }
  static get tag() {
    return "lrnapp-studio-submission-edit-video";
  }
  newvideoEvent(e) {
    this.newvideo = e.detail.value;
  }
  constructor() {
    super();
    this.videos = [];
    this.selectedPage = "0";
    this.newvideo = '';
    this.videoGenerateSourceUrl = this.generateUrl("/api/video/generate-source-url");
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == 'videos') {
        // notify
        this.dispatchEvent(
          new CustomEvent("videos-changed", {
            detail: {
              value: this[propName],
            }
          })
        );
      }
    });
  }
  static get properties() {
    return {
      videos: {
        type: Array,
      },
      selectedPage: {
        type: String,
        attribute: 'selected-page',
      },
      newvideo: {
        type: String,
      },
      videoGenerateSourceUrl: {
        type: String,
        attribute: 'video-generate-source-url',
      }
    };
  }
  _openDialog(e) {
    this.shadowRoot.querySelector("#dialog").open();
  }
  _addVideoAjax(e) {
    var video_src = e.detail.response.data;
    this.videos.push({ video_url: this.newvideo, video_src: video_src });
    this.newvideo = "";
  }
  _addVideo(e) {
    this.shadowRoot
        .querySelector("#videourl")
        .generateRequest();
  }

  _videoDelete(e) {
    var deleteIndex = e.target.getAttribute("data-index");
    this.videos.splice(deleteIndex, 1);
  }
}
window.customElements.define(
  LrnappStudioSubmissionEditVideo.tag,
  LrnappStudioSubmissionEditVideo
);
export { LrnappStudioSubmissionEditVideo };
