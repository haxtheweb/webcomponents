import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import "@polymer/paper-toast/paper-toast.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
/**
 * `lrnapp-studio-submission-button`
 * `Allows users to either start a submission or link to a submission.`

Usage:
```
<lrnapp-studio-submission-button assignment-id="[[id]]" submission-id="{{submissionId}}" end-point="[[endPoint]]" csrf-token=[[csrfToken]]></lrnapp-studio-submission-button>
*/
class LrnappStudioSubmissionButton extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <template is="dom-if" if="[[!submissionId]]">
        <lrnsys-button
          raised
          on-click="_createSubmission"
          label="Create submission"
        ></lrnsys-button>
        <iron-ajax
          id="ajaxCreateStub"
          url="[[endPoint]]/api/submissions/create-stub?token=[[csrfToken]]"
          method="POST"
          body="[[assignmentId]]"
          handle-as="json"
          on-response="_ajaxCreateStubHandler"
        ></iron-ajax>
      </template>
      <template is="dom-if" if="[[submissionId]]">
        <lrnsys-button
          raised=""
          label="View submission"
          show-href="[[_submissionUrl(submissionId)]]"
          href="[[_submissionUrl(submissionId)]]"
        ></lrnsys-button>
      </template>
      <template is="dom-if" if="[[displayErrors]]">
        <paper-toast id="toast"></paper-toast>
      </template>
    `;
  }
  static get tag() {
    return "lrnapp-studio-submission-button";
  }
  static get properties() {
    return {
      auto: {
        type: Boolean,
        reflectToAttribute: true,
        value: false,
        notify: true,
      },
      assignmentId: {
        type: String,
        reflectToAttribute: true,
      },
      submissionId: {
        type: String,
        value: false,
        reflectToAttribute: true,
      },
      displayErrors: {
        type: Boolean,
        value: true,
      },
      elmslnCourse: {
        type: String,
      },
      elmslnSection: {
        type: String,
      },
      basePath: {
        type: String,
        notify: true,
        reflectToAttribute: true,
      },
      csrfToken: {
        type: String,
        notify: true,
        reflectToAttribute: true,
      },
      endPoint: {
        type: String,
        notify: true,
        reflectToAttribute: true,
      },
    };
  }

  _createSubmission() {
    this.shadowRoot.querySelector("#ajaxCreateStub").generateRequest();
  }

  _ajaxCreateStubHandler(e) {
    var status = e.detail.response.status;
    var response = e.detail.response;
    if (status === 201) {
      var submissionId = e.detail.response.data.id;
      if (submissionId) {
        this.submissionId = submissionId;
        // auto implies we should just go there to the edit form after creation
        if (this.auto) {
          window.location.href = this._submissionUrl(submissionId) + "/edit";
        }
      }
    }
    // if we have errors to display
    if (typeof response.errors !== "undefined") {
      var ul = document.createElement("ul");
      var text = "";
      response.errors.forEach(function (error) {
        text = text + " " + error;
      });
      this.shadowRoot.querySelector("#toast").show(text);
    }
  }

  _submissionUrl(id) {
    return this.endPoint + "/submissions/" + id;
  }
}
window.customElements.define(
  LrnappStudioSubmissionButton.tag,
  LrnappStudioSubmissionButton
);
export { LrnappStudioSubmissionButton };
