import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/marked-element/marked-element.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import "./lrnapp-studio-block.js";
import "./lrnapp-studio-submission-edit-textarea.js";
class LrnappStudioSubmissionCritiquePanel extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        .field {
          padding-top: 32px;
          padding-bottom: 32px;
        }

        .actions {
          display: flex;
          border-top: 2px solid gainsboro;
          margin-top: 16px;
          font-size: 14px;
        }

        .actions .spacer {
          flex: 1 1 auto;
        }

        .submission-critique-outline + .submission-critique-outline {
          margin-top: 16px;
        }

        :host([edit])
          .submission-critique-outline--feedback
          lrnapp-studio-block {
          padding: 0;
        }
      `
    ];
  }
  render() {
    return html`
      <!-- Body -->
      <div class="field">
        <div class="submission-critique-outline">
          <lrnapp-studio-block title="Directions" icon="info-outline">
            <marked-element
              markdown="${this.submission.relationships.assignment.attributes
                .critiqueOutline}"
            ></marked-element>
          </lrnapp-studio-block>
        </div>
        <div
          class="submission-critique-outline submission-critique-outline--feedback"
        >
          <lrnapp-studio-block title="Feedback" icon="communication:comment">
            ${this.edit
              ? html`
                  <lrnapp-studio-submission-edit-textarea
                    content="${this.submission.attributes.body}"
                    @content-changed="${this.submissionAttributesBody}"
                  ></lrnapp-studio-submission-edit-textarea>
                `
              : html`
                  <marked-element
                    markdown="${this.submission.attributes.body}"
                    @markdown-changed="${this.submissionAttributesBody}"
                  ></marked-element>
                `}
          </lrnapp-studio-block>
        </div>
      </div>
      ${this.edit
        ? html`
            <div class="actions">
              <lrnsys-button
                id="publish"
                icon="check"
                label="Publish Feedback"
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
                label="Delete Feedback"
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
  submissionAttributesBody(e) {
    let attr = this.submission.attributes;
    attr.body = e.detail.value;
    this.submission.attributes = { ...attr };
  }
  static get tag() {
    return "lrnapp-studio-submission-critique-panel";
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
  constructor() {
    super();
    this.edit = false;
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
  _publishClicked(e) {
    let attr = this.submission.attributes;
    attr.state = "submission_ready";
    this.submission.attributes = { ...attr };
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
    let attr = this.submission.attributes;
    attr.state = "submission_in_progress";
    this.submission.attributes = { ...attr };
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
}
window.customElements.define(
  LrnappStudioSubmissionCritiquePanel.tag,
  LrnappStudioSubmissionCritiquePanel
);
export { LrnappStudioSubmissionCritiquePanel };
