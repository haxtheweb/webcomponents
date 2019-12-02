import { LitElement, html, css } from "lit-element/lit-element.js";

import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-toast/paper-toast.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
/**
 * `lrnapp-studio-submission-button`
 * `Allows users to either start a submission or link to a submission.`

Usage:
```
<lrnapp-studio-submission-button assignment-id="[[id]]" submission-id="{{submissionId}}" end-point="${this.endPoint}" csrf-token=${this.csrfToken}></lrnapp-studio-submission-button>
*/
class LrnappStudioSubmissionButton extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [css``];
  }
  render() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <template is="dom-if" if="[[!submissionId]]">
        <lrnsys-button
          raised
          @click="${this._createSubmission}"
          label="Create submission"
        ></lrnsys-button>
        <iron-ajax
          id="ajaxCreateStub"
          url="${this.endPoint}/api/submissions/create-stub?token=${this
            .csrfToken}"
          method="POST"
          body="[[assignmentId]]"
          handle-as="json"
          @response="${this._ajaxCreateStubHandler}"
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
        reflect: true,
        value: false,
        notify: true
      },
      assignmentId: {
        type: String,
        reflect: true
      },
      submissionId: {
        type: String,
        value: false,
        reflect: true
      },
      displayErrors: {
        type: Boolean,
        value: true
      },
      elmslnCourse: {
        type: String
      },
      elmslnSection: {
        type: String
      },
      basePath: {
        type: String,
        notify: true,
        reflect: true
      },
      csrfToken: {
        type: String,
        notify: true,
        reflect: true
      },
      endPoint: {
        type: String,
        notify: true,
        reflect: true
      }
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
      response.errors.forEach(function(error) {
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
