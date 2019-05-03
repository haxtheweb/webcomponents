import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-toast/paper-toast.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
/*
`lrnapp-studio-assignment-button`
Allows users to either start a assignment or link to a assignment.

Usage:
```
<lrnapp-studio-assignment-button assignment-id="[[id]]" assignment-id="{{assignmentId}}" end-point="[[endPoint]]" csrf-token=[[csrfToken]]></lrnapp-studio-assignment-button>
*/
class LrnappStudioAssignmentButton extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <lrnsys-button
        on-tap="_createAssignment"
        icon-class="[[iconClass]]"
        alt="[[alt]]"
        class\$="[[classes]]"
        button-class\$="[[classes]]"
        hover-class="[[hoverClass]]"
        icon="[[icon]]"
      ></lrnsys-button>
      <iron-ajax
        id="ajaxCreateStub"
        url="[[createAssignmentUrl]]"
        method="POST"
        body="[[projectId]]"
        handle-as="json"
        on-response="_ajaxCreateStubHandler"
      ></iron-ajax>
      <template is="dom-if" if="[[displayErrors]]">
        <paper-toast id="toast"></paper-toast>
      </template>
    `;
  }

  static get tag() {
    return "lrnapp-studio-assignment-button";
  }
  static get properties() {
    return {
      auto: {
        type: Boolean,
        reflectToAttribute: true,
        value: false,
        notify: true
      },
      displayErrors: {
        type: Boolean,
        value: true
      },
      projectId: {
        type: String
      },
      createAssignmentUrl: {
        type: String,
        value: null
      },
      iconClass: {
        type: String,
        value: null
      },
      alt: {
        type: String,
        value: null
      },
      classes: {
        type: String,
        value: null
      },
      hoverClass: {
        type: String,
        value: null
      },
      icon: {
        type: String,
        value: null
      },
      endPoint: String,
      csrfToken: String
    };
  }
  ready() {
    super.ready();
    // @todo need to load a assignment if one exists ahead of time
    this.createAssignmentUrl =
      this.endPoint + "/api/assignments/create-stub?token=" + this.csrfToken;
  }
  _createAssignment() {
    this.shadowRoot.querySelector("#ajaxCreateStub").generateRequest();
  }
  _ajaxCreateStubHandler(e) {
    var status = e.detail.response.status;
    var response = e.detail.response;
    if (status === 201) {
      var assignment = e.detail.response.data;
      if (assignment) {
        this.dispatchEvent(
          new CustomEvent("assignment-created", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: { assignment: assignment }
          })
        );
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
}
window.customElements.define(
  LrnappStudioAssignmentButton.tag,
  LrnappStudioAssignmentButton
);
export { LrnappStudioAssignmentButton };
