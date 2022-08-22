import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import "@polymer/paper-toast/paper-toast.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import { normalizeEventPath } from "@lrnwebcomponents/utils/utils.js";

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
        lrnsys-button {
          border: 2px solid black;
          --lrnsys-button-height: auto;
          background-color: lightgray;
        }
      </style>
      <template is="dom-if" if="[[!submissionId]]">
        <lrnsys-button
          on-click="_createSubmission"
          label="Create submission"
        ></lrnsys-button>
        <iron-ajax
          reject-with-request
          on-last-error-changed="lastErrorChanged"
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
            }
          );
          break;
      }
    }
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
