import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-toast/paper-toast.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
/**
 * `lrnapp-studio-project-button`
 * Allows users to create new projects.
 */
class LrnappStudioProjectButton extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
      `
    ];
  }
  render() {
    return html`
      ${this.createProjectsUrl
        ? html`
            <lrnsys-button
              raised=""
              class="${this.classes}"
              button-class="${this.classes}"
              icon="${this.icon}"
              @click="${this._createProject}"
              label="Create project"
            ></lrnsys-button>
            <iron-ajax
              id="ajaxCreateStub"
              url="${this.createProjectsUrl}"
              method="POST"
              handle-as="json"
              @response="${this._ajaxCreateStubHandler}"
            ></iron-ajax>
          `
        : ``}
      ${this.displayErrors
        ? html`
            <paper-toast id="toast"></paper-toast>
          `
        : ``}
    `;
  }
  static get tag() {
    return "lrnapp-studio-project-button";
  }

  static get properties() {
    return {
      elmslnCourse: {
        type: String,
        attribute: "elmsln-course"
      },
      elmslnSection: {
        type: String,
        attribute: "elmsln-section"
      },
      basePath: {
        type: String,
        attribute: "base-path"
      },
      csrfToken: {
        type: String,
        attribute: "csrf-token"
      },
      endPoint: {
        type: String,
        attribute: "end-point"
      },
      auto: {
        type: Boolean,
        reflect: true
      },
      displayErrors: {
        type: Boolean,
        attribute: "display-errors"
      },
      createProjectsUrl: {
        type: String,
        attribute: "create-projects-url"
      },
      classes: {
        type: String
      },
      icon: {
        type: String
      }
    };
  }
  constructor() {
    super();
    this.icon = "";
    this.classes = "";
    this.displayErrors = true;
    this.auto = false;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (["endPoint", "csrfToken"].includes(propName)) {
        this.createProjectsUrl =
          this.endPoint + "/api/projects/create-stub?token=" + this.csrfToken;
      }
      if (propName == "auto") {
        // notify
        this.dispatchEvent(
          new CustomEvent("auto-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
    });
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
