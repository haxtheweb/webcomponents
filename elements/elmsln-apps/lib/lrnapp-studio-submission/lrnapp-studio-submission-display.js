import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/marked-element/marked-element.js";
import "@polymer/iron-image/iron-image.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import "@lrnwebcomponents/image-inspector/image-inspector.js";
import "@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";
import "@lrnwebcomponents/word-count/word-count.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import "@lrnwebcomponents/lrndesign-contentblock/lrndesign-contentblock.js";
import "@lrnwebcomponents/lrnsys-layout/lib/lrnsys-dialog.js";
class LrnappStudioSubmissionDisplay extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        p {
          font-size: 14px;
          line-height: 18px;
        }
        h1,
        h2,
        h3 {
          margin: 0;
          text-align: left;
        }
        iron-selector {
          line-height: 1em;
        }
        iron-selector lrnsys-button {
          display: inline-flex;
        }
        marked-element {
          display: block;
          margin: 0 5em 0 5em;
        }
        iron-image {
          margin: 0 0.5em;
        }
        lrnsys-dialog {
          display: inline;
        }
        .contain {
          width: 10em;
          height: 10em;
          background: #ddd;
        }
        .center {
          margin: auto;
          width: 100%;
        }
        .title {
          color: #222;
          font-size: 2rem;
          font-weight: 600;
          line-height: 2.5rem;
          padding: 0.25rem 0;
          white-space: nowrap;
          overflow-x: hidden;
          text-overflow: ellipsis;
          margin-top: 1rem;
          text-align: center;
        }
        .author {
          color: #555;
          font-size: 1rem;
          font-weight: 500;
          font-style: normal;
          line-height: 1rem;
          padding: 0.25rem 0 0.5rem 0;
          margin: 0;
          text-transform: capitalize;
        }
        .date {
          color: #555;
          font-size: 16px;
          font-style: normal;
          padding: 0.25rem 0 0.5rem 0;
          margin: 0;
        }
        .flex-wrap {
          display: flex;
        }
        .submission-page-card {
          width: 100%;
          margin: 0;
        }
        :host([edit-page]) .submission-page {
          width: 100%;
        }
        .image-dialog-header {
          display: flex;
        }
        app-toolbar {
          width: 36em;
          background: #ddd;
        }
        lrnsys-button {
          padding: 0.75em;
        }
        .top {
          top: 8em;
        }
      </style>
      <div class="submission-page">
        <paper-card class="submission-page-card ferpa-protect">
          <div class="card-content">
            <lrndesign-avatar
              class="center"
              label="{{submission.relationships.author.data.name}}"
              src="{{submission.relationships.author.data.avatar}}"
            ></lrndesign-avatar>
            <div class="author center">
              {{submission.relationships.author.data.display_name}}
            </div>
            <h2 class="title center">{{submission.attributes.title}}</h2>
            <div class="date center">
              Created: [[date(submission.meta.created)]]
            </div>
            <div class="date center">
              Last updated: [[date(submission.meta.changed)]]
            </div>
            <!-- ----- Text Submission ----- -->
            <template is="dom-if" if="[[submission.attributes.body]]">
              <word-count
                ><marked-element
                  markdown="[[submission.attributes.body]]"
                ></marked-element
              ></word-count>
            </template>
            <!-- ----- Images Submission ----- -->
            <template is="dom-if" if="[[submission.attributes.images]]">
              <lrndesign-contentblock class="center">
                <template
                  is="dom-repeat"
                  items="[[_toArray(submission.attributes.images)]]"
                  as="image"
                >
                  <lrnsys-dialog alt="View Image" dynamic-images="">
                    <div class="image-dialog-header"></div>
                    <span slot="button">
                      <iron-image
                        style="width:200px; height:200px; background-color: lightgray;"
                        sizing="contain"
                        class="contain"
                        src="[[image.thumbnail]]"
                        preload=""
                        fade=""
                      ></iron-image>
                    </span>
                    <div style="text-align: center;">
                      <template is="dom-if" if="[[!_isGif(image.url)]]">
                        <image-inspector src="[[image.url]]">
                          <span slot="toolbar">
                            <lrnsys-button
                              alt="Download all images"
                              icon="icons:file-download"
                              href="[[submission.attributes.download_files]]"
                              target="_blank"
                            ></lrnsys-button>
                          </span>
                        </image-inspector>
                      </template>
                      <template is="dom-if" if="[[_isGif(image.url)]]">
                        <iron-image
                          style="width:500px; height:500px; background-color: lightgray;"
                          sizing="contain"
                          class="contain"
                          src="[[image.url]]"
                          preload=""
                          fade=""
                        ></iron-image>
                      </template>
                    </div>
                  </lrnsys-dialog>
                </template>
              </lrndesign-contentblock>
            </template>
            <!-- ----- Video Submission ----- -->
            <template is="dom-if" if="[[submission.attributes.video]]">
              <lrndesign-contentblock class="center">
                <template
                  is="dom-repeat"
                  items="[[_toArray(submission.attributes.video)]]"
                  as="video"
                >
                  <iframe
                    width="460"
                    height="249"
                    src="[[video.video_src]]"
                  ></iframe>
                </template>
              </lrndesign-contentblock>
            </template>
            <!-- ----- Links Submission ----- -->
            <template is="dom-if" if="[[submission.attributes.links]]">
              <lrndesign-contentblock>
                <template
                  is="dom-repeat"
                  items="[[_toArray(submission.attributes.links)]]"
                  as="link"
                >
                  <p>
                    <strong>[[link.title]]:</strong>
                    <a class="link" href="[[link.url]]" target="_blank"
                      >[[link.url]]</a
                    >
                  </p>
                </template>
              </lrndesign-contentblock>
            </template>
            <!-- ----- Files Submission ----- -->
            <template is="dom-if" if="[[submission.attributes.files]]">
              <lrndesign-contentblock title="Files Submitted">
                <template
                  is="dom-repeat"
                  items="[[_toArray(submission.attributes.files)]]"
                  as="file"
                >
                  <p>
                    <strong>[[file.filename]]:</strong>
                    <a class="link" href="[[file.url]]" target="_blank"
                      >[[file.url]]</a
                    >
                  </p>
                </template>
              </lrndesign-contentblock>
            </template>
          </div>
        </paper-card>
      </div>
    `;
  }
  static get tag() {
    return "lrnapp-studio-submission-display";
  }
  static get properties() {
    return {
      /**
       * Object that has all the details of a submission that
       * is being viewed.
       */
      submission: {
        type: Object,
        notify: true
      }
    };
  }
  date(time) {
    if (time) {
      var parts = time.split("-");
      let times = time.split("T");
      let month = parts[2].split("T");
      times = times[1].split("-");
      return parts[1] + "/" + month[0] + " - " + times[0];
    }
  }
  /**
   * Simple way to convert from object to array.
   */
  _toArray(obj) {
    if (typeof obj === "object" && obj !== null) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    }
    return [];
  }
  /**
   * See if this is a GIF, if it is then report back so we
   * know which player to display.
   */
  _isGif(url) {
    if (url.indexOf(".gif") != -1) {
      return true;
    }
    return false;
  }
}
window.customElements.define(
  LrnappStudioSubmissionDisplay.tag,
  LrnappStudioSubmissionDisplay
);
export { LrnappStudioSubmissionDisplay };
