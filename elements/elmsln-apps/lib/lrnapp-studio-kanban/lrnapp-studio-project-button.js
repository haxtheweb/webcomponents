import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-toast/paper-toast.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";

/*
`lrnapp-studio-project-button`
Allows users to create new projects.

Usage:
```
<lrnapp-studio-project-button classes="amber white-text" icon="add" display-errors="true" end-point="[[endPoint]]" csrf-token=[[csrfToken]]></lrnapp-studio-project-button>
*/
class LrnappStudioProjectButton extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <template is="dom-if" if="[[createProjectsUrl]]">
        <lrnsys-button
          raised=""
          class\$="[[classes]]"
          button-class\$="[[classes]]"
          icon="[[icon]]"
          on-tap="_createProject"
          label="Create project"
        ></lrnsys-button>
        <iron-ajax
          id="ajaxCreateStub"
          url="[[createProjectsUrl]]"
          method="POST"
          handle-as="json"
          on-response="_ajaxCreateStubHandler"
        ></iron-ajax>
      </template>
      <template is="dom-if" if="[[displayErrors]]">
        <paper-toast id="toast"></paper-toast>
      </template>
    `;
  }
  static get tag() {
    return "lrnapp-studio-project-button";
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
      createProjectsUrl: {
        type: String,
        value: null
      },
      classes: {
        type: String,
        value: ""
      },
      icon: {
        type: String,
        value: ""
      }
    };
  }

  ready() {
    super.ready();
    this.createProjectsUrl =
      this.endPoint + "/api/projects/create-stub?token=" + this.csrfToken;
  }

  _createProject() {
    this.shadowRoot.querySelector("#ajaxCreateStub").generateRequest();
  }

  _ajaxCreateStubHandler(e) {
    var status = e.detail.response.status;
    var response = e.detail.response;
    if (status === 201) {
      var project = e.detail.response.data;
      if (project) {
        this.dispatchEvent(
          new CustomEvent("project-created", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: { project: project }
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
  LrnappStudioProjectButton.tag,
  LrnappStudioProjectButton
);
export { LrnappStudioProjectButton };
