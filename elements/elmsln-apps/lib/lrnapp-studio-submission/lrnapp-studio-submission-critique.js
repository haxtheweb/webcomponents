import { LitElement, html, css } from "lit-element/lit-element.js";
import "@vaadin/vaadin-split-layout/vaadin-split-layout.js";
import "./lrnapp-studio-submission-media-editoverlay.js";
import "./lrnapp-studio-submission-edit-images.js";
import "./lrnapp-studio-submission-edit-files.js";
import "./lrnapp-studio-submission-edit-video.js";
import "./lrnapp-studio-submission-edit-links.js";
import "./lrnapp-studio-submission-display.js";
import "./lrnapp-studio-submission-edit-textarea.js";
import "./lrnapp-studio-block.js";
import "./lrnapp-studio-submission-critique-panel.js";
class LrnappStudioSubmissionCritique extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        .submission-critique {
          display: flex;
          justify-content: space-around;
        }

        .submission-critique-panel {
          flex: 1 1 auto;
          width: 100%;
          flex-wrap: nowrap;
          margin: 0.3em;
        }
      `
    ];
  }
  render() {
    return html`
      ${this.edit
        ? html`
            <div class="submission-critique">
              <!-- critique panel -->
              <div class="submission-critique-panel" id="crititque-panel">
                <lrnapp-studio-submission-display
                  .submission="${this.submission.relationships
                    .relatedSubmission}"
                ></lrnapp-studio-submission-display>
              </div>
              <!-- critique panel -->
              <div class="submission-critique-panel">
                <lrnapp-studio-submission-critique-panel
                  .submission="${this.submission}"
                  ?edit="${this.edit}"
                ></lrnapp-studio-submission-critique-panel>
              </div>
            </div>
          `
        : html`
            <vaadin-split-layout class="submission-critique">
              <!-- critique panel -->
              <div class="submission-critique-panel" id="crititque-panel">
                <lrnapp-studio-submission-display
                  .submission="${this.submission.relationships
                    .relatedSubmission}"
                ></lrnapp-studio-submission-display>
              </div>
              <!-- critique panel -->
              <div class="submission-critique-panel">
                <lrnapp-studio-submission-critique-panel
                  .submission="${this.submission}"
                  @submission-changed="${this.submissionChanged}"
                  ?edit="${this.edit}"
                ></lrnapp-studio-submission-critique-panel>
              </div>
            </vaadin-split-layout>
          `}
    `;
  }
  submissionChanged(e) {
    this.submission = { ...e.detail.value };
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
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
  constructor() {
    super();
    this.edit = false;
  }
  static get tag() {
    return "lrnapp-studio-submission-critique";
  }
  static get properties() {
    return {
      submission: {
        type: Object
      },
      edit: {
        type: Boolean,
        reflect: true
      }
    };
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
  LrnappStudioSubmissionCritique.tag,
  LrnappStudioSubmissionCritique
);
export { LrnappStudioSubmissionCritique };
