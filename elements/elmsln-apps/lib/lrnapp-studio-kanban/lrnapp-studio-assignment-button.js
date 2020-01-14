import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-toast/paper-toast.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
/**
 *`lrnapp-studio-assignment-button`
 * Allows users to either start a assignment or link to a assignment.
 */
class LrnappStudioAssignmentButton extends LitElement {
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
      <lrnsys-button
        @click="${this._createAssignment}"
        icon-class="${this.iconClass}"
        alt="${this.alt}"
        class="${this.classes}"
        button-class="${this.classes}"
        hover-class="${this.hoverClass}"
        icon="${this.icon}"
      ></lrnsys-button>
      <iron-ajax
        id="ajaxCreateStub"
        url="${this.endPoint}/api/assignments/create-stub?token=${this
          .csrfToken}"
        method="POST"
        body="${this.projectId}"
        handle-as="json"
        @response="${this._ajaxCreateStubHandler}"
      ></iron-ajax>
      ${this.displayErrors
        ? html`
            <paper-toast id="toast"></paper-toast>
          `
        : ``}
    `;
  }

  static get tag() {
    return "lrnapp-studio-assignment-button";
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
      projectId: {
        type: String,
        attribute: "project-id"
      },
      iconClass: {
        type: String,
        attribute: "icon-class"
      },
      alt: {
        type: String
      },
      classes: {
        type: String
      },
      hoverClass: {
        type: String,
        attribute: "hover-class"
      },
      icon: {
        type: String
      },
      csrfToken: {
        type: String,
        attribute: "csrf-token",
        reflect: true
      },
      endPoint: {
        type: String,
        attribute: "end-point",
        reflect: true
      },
      auto: {
        type: Boolean,
        reflect: true
      },
      displayErrors: {
        type: Boolean
      }
    };
  }
  constructor() {
    super();
    this.icon = null;
    this.hoverClass = null;
    this.classes = null;
    this.alt = null;
    this.iconClass = null;
    this.displayErrors = true;
    this.auto = false;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
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
      if (propName == "basePath") {
        // notify
        this.dispatchEvent(
          new CustomEvent("base-path-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (propName == "csrfToken") {
        // notify
        this.dispatchEvent(
          new CustomEvent("csrf-token-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (propName == "endPoint") {
        // notify
        this.dispatchEvent(
          new CustomEvent("end-point-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
    });
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
