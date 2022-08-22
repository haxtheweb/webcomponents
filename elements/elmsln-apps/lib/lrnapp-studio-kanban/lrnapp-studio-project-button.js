import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-toast/paper-toast.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import { normalizeEventPath } from "@lrnwebcomponents/utils/utils.js";

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
          class$="[[classes]]"
          button-class$="[[classes]]"
          icon="[[icon]]"
          on-click="_createProject"
          label="Create project"
        ></lrnsys-button>
        <iron-ajax
          reject-with-request
          on-last-error-changed="lastErrorChanged"
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
      elmslnCourse: {
        type: String,
      },
      elmslnSection: {
        type: String,
      },
      basePath: {
        type: String,
      },
      csrfToken: {
        type: String,
      },
      endPoint: {
        type: String,
      },
      auto: {
        type: Boolean,
        reflectToAttribute: true,
        value: false,
        notify: true,
      },
      displayErrors: {
        type: Boolean,
        value: true,
      },
      createProjectsUrl: {
        type: String,
        value: null,
      },
      classes: {
        type: String,
        value: "",
      },
      icon: {
        type: String,
        value: "",
      },
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
            detail: { project: project },
          })
        );
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
}
window.customElements.define(
  LrnappStudioProjectButton.tag,
  LrnappStudioProjectButton
);
export { LrnappStudioProjectButton };
