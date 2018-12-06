import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-toast/paper-toast.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
/*
`lrnapp-studio-submission-button`
Allows users to either start a submission or link to a submission.

Usage:
```
<lrnapp-studio-submission-button assignment-id="[[id]]" submission-id="{{submissionId}}" end-point="[[endPoint]]" csrf-token=[[csrfToken]]></lrnapp-studio-submission-button>
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>

    <template is="dom-if" if="[[!submissionId]]">
      <lrnsys-button
        raised=""
        on-tap="_createSubmission"
        label="Create submission"
      ></lrnsys-button>
      <iron-ajax
        id="ajaxCreateStub"
        url="[[createStubUrl]]"
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
  `,

  is: "lrnapp-studio-submission-button",

  properties: {
    auto: {
      type: Boolean,
      reflectToAttribute: true,
      value: false,
      notify: true
    },
    assignmentId: {
      type: String,
      reflectToAttribute: true
    },
    submissionId: {
      type: String,
      value: false,
      reflectToAttribute: true
    },
    endPoint: String,
    csrfToken: String,
    displayErrors: {
      type: Boolean,
      value: true
    }
  },

  observers: ["_requestUrlChanged(endPoint, csrfToken)"],

  _requestUrlChanged: function(endPoint, csrfToken) {
    this.createStubUrl =
      endPoint + "/api/submissions/create-stub?token=" + csrfToken;
  },

  _createSubmission: function() {
    this.shadowRoot.querySelector("#ajaxCreateStub").generateRequest();
  },

  _ajaxCreateStubHandler: function(e) {
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
  },

  _submissionUrl: function(id) {
    return this.endPoint + "/submissions/" + id;
  }
});
