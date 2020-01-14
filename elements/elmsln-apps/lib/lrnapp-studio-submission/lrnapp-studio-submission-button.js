import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-toast/paper-toast.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
/**
 * `lrnapp-studio-submission-button`
 * `Allows users to either start a submission or link to a submission.`
 */
class LrnappStudioSubmissionButton extends LitElement {
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
      ${this.submissionId
        ? html`
            <lrnsys-button
              raised=""
              label="View submission"
              show-href="${this._submissionUrl(this.submissionId)}"
              href="${this._submissionUrl(this.submissionId)}"
            ></lrnsys-button>
          `
        : html`
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
              body="${this.assignmentId}"
              handle-as="json"
              @response="${this._ajaxCreateStubHandler}"
            ></iron-ajax>
          `}
      ${this.displayErrors
        ? html`
            <paper-toast id="toast"></paper-toast>
          `
        : ``}
    `;
  }
  static get tag() {
    return "lrnapp-studio-submission-button";
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
      assignmentId: {
        type: String,
        reflect: true,
        attribute: "assignment-id"
      },
      submissionId: {
        type: String,
        reflect: true,
        attribute: "submission-id"
      },
      displayErrors: {
        type: Boolean,
        attribute: "display-errors"
      }
    };
  }
  constructor() {
    super();
    this.auto = false;
    this.submissionId = false;
    this.displayErrors = true;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      let notifiedProps = ["csrfToken", "endPoint", "basePath", "auto"];
      if (notifiedProps.includes(propName)) {
        // notify
        let eventName = `${propName
          .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
          .toLowerCase()}-changed`;
        this.dispatchEvent(
          new CustomEvent(eventName, {
            detail: {
              value: this[propName]
            }
          })
        );
      }
    });
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
