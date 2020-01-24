import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/marked-element/marked-element.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import "./lrnapp-studio-block.js";
import "./lrnapp-studio-submission-edit-textarea.js";
class LrnappStudioSubmissionCritiquePanel extends PolymerElement {
  static get template() {
    return html`
      <style>
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
      </style>
      <!-- Body -->
      <div class="field">
        <div class="submission-critique-outline">
          <lrnapp-studio-block title="Directions" icon="info-outline">
            <marked-element
              markdown="[[submission.relationships.assignment.attributes.critiqueOutline]]"
            ></marked-element>
          </lrnapp-studio-block>
        </div>
        <div
          class="submission-critique-outline submission-critique-outline--feedback"
        >
          <lrnapp-studio-block title="Feedback" icon="communication:comment">
            <template is="dom-if" if="[[edit]]">
              <lrnapp-studio-submission-edit-textarea
                content="{{submission.attributes.body}}"
              ></lrnapp-studio-submission-edit-textarea>
            </template>
            <template is="dom-if" if="[[!edit]]">
              <marked-element
                markdown="{{submission.attributes.body}}"
              ></marked-element>
            </template>
          </lrnapp-studio-block>
        </div>
      </div>
      <template is="dom-if" if="[[edit]]">
        <div class="actions">
          <lrnsys-button
            id="publish"
            icon="check"
            label="Publish Feedback"
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
            label="Delete Feedback"
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
    return "lrnapp-studio-submission-critique-panel";
  }
  static get properties() {
    return {
      submission: {
        type: Object,
        notify: true
      },
      edit: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    };
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
}
window.customElements.define(
  LrnappStudioSubmissionCritiquePanel.tag,
  LrnappStudioSubmissionCritiquePanel
);
export { LrnappStudioSubmissionCritiquePanel };
