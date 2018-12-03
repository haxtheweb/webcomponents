import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/marked-element/marked-element.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import "./lrnapp-studio-block.js";
import "./lrnapp-studio-submission-edit-textarea.js";
Polymer({
  _template: html`
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

      :host([edit]) .submission-critique-outline--feedback lrnapp-studio-block {
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
  `,
  is: "lrnapp-studio-submission-critique-panel",
  properties: {
    submission: {
      type: Object,
      notify: true
    },
    edit: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    }
  },
  _publishClicked: function(e) {
    this.set("submission.attributes.state", "submission_ready");
    this.notifyPath("submission.attributes.state");
    this.fire("submissionPublishClicked");
  },
  _saveDraftClicked: function(e) {
    this.set("submission.attributes.state", "submission_in_progress");
    this.notifyPath("submission.attributes.state");
    this.fire("submissionSaveDraftClicked");
  },
  _deleteClicked: function(e) {
    this.fire("submissionDeleteClicked");
  }
});
