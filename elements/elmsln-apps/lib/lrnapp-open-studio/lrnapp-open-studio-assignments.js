import { LitElement, html, css } from "lit-element/lit-element.js";
import { materialCssStyles } from "@lrnwebcomponents/materializecss-styles/lib/colors.js";

class LrnappOpenStudioAssignments extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      materialCssStyles,
      css`
        :host {
          align-content: center;
        }
        #loading {
          width: 100%;
          z-index: 1000;
          opacity: 0.8;
          text-align: center;
          align-content: center;
          justify-content: center;
          height: 100vh;
          position: absolute;
          background-color: white;
        }
        h1.empty-title,
        h1.assignment-title {
          font-size: 2em;
        }
        .submission-title {
          font-size: 1em;
          font-weight: bold;
          width: 100%;
          margin-bottom: 2rem;
          text-transform: none;
        }
        .submission-list {
          display: flex;
          align-items: center;
        }
        .submission-list-item {
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          word-wrap: break-word;
        }
      `
    ];
  }
  render() {
    return html`
      ${this.showSubmissions
        ? html`
            <div class="submission-list">
              ${this.submissions.map(
                submission => html`
                  <lrnsys-button
                    @click="${this._scrollToTarget}"
                    raised=""
                    class="submission-list-item"
                    button-class="submission-list-item"
                    hover-class="blue white-text"
                    data-submission-id="${submission.id}"
                  >
                    <span slot="button">
                      <lrndesign-avatar
                        src="${submission.relationships.author.data.avatar}"
                        label="${submission.relationships.author.data.name}"
                        style="display:inline-block;"
                        data-submission-id="${submission.id}"
                      ></lrndesign-avatar>
                    </span>
                    <span slot="label"
                      >${submission.relationships.author.data
                        .display_name}</span
                    >
                  </lrnsys-button>
                `
              )}
            </div>
            ${this.submissions.map(
              submission => html`
                <lrnapp-studio-submission-display
                  id="submission-${submission.id}"
                  .submission="${submission}"
                  class="ferpa-protect"
                ></lrnapp-studio-submission-display>
                <paper-button
                  class="submission-title ferpa-protect"
                  @click="${this._loadSubmissionUrl}"
                  data-submission-id="${submission.id}"
                  >Tap to comment on ${submission.attributes.title} by
                  ${submission.relationships.author.data.display_name}
                </paper-button>
              `
            )}
          `
        : html`
            <h1 class="empty-title black-text">
              Please select an Assignment in order to view all submissions
            </h1>
          `}
    `;
  }
  constructor() {
    super();
    this.activeAssignment = {};
    this.assignments = [];
    this.submissions = [];
    this.activeAssignmentId = null;
    setTimeout(() => {
      import("@polymer/paper-button/paper-button.js");
      import("@lrnwebcomponents/lrnsys-button/lrnsys-button.js");
      import("@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js");
      import("@lrnwebcomponents/elmsln-apps/lib/lrnapp-studio-submission/lrnapp-studio-submission-display.js");
    }, 0);
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (["assignments", "activeAssignmentId"].includes(propName)) {
        this.activeAssignment = this._activeAssignmentCompute(
          this.activeAssignmentId,
          this.assignments
        );
      }
      if (propName == "activeAssignmentId") {
        // notify
        this.dispatchEvent(
          new CustomEvent("active-assignment-id-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (propName == "submissions") {
        // notify
        this.dispatchEvent(
          new CustomEvent("submissions-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (propName == "assignments") {
        // notify
        this.dispatchEvent(
          new CustomEvent("assignments-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (propName == "activeAssignment") {
        // notify
        this.dispatchEvent(
          new CustomEvent("active-assignment-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (propName == "activeAuthorId") {
        // notify
        this.dispatchEvent(
          new CustomEvent("active-author-id-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (propName == "activeAssignmentId") {
        this.showSubmissions = this._showSubmissions(this.activeAssignmentId);
      }
      if (propName == "showSubmissions") {
        // notify
        this.dispatchEvent(
          new CustomEvent("show-submissions-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (propName == "sourcePath") {
        // notify
        this.dispatchEvent(
          new CustomEvent("source-path-changed", {
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
    });
  }
  static get tag() {
    return "lrnapp-open-studio-assignments";
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
      /**
       * The assignments that exist so we can make other calls for data
       */
      assignments: {
        type: Array
      },
      /**
       * The submissions that exist so we can make other calls for data
       */
      submissions: {
        type: Array
      },
      activeAssignmentId: {
        type: String,
        reflect: true,
        attribute: "active-assignment-id"
      },
      activeAssignment: {
        type: Object,
        attribute: "active-assignment"
      },
      activeAuthorId: {
        type: String,
        reflect: true,
        attribute: "active-author-id"
      },
      showSubmissions: {
        type: Boolean,
        attribute: "show-submissions"
      },
      /**
       * Endpoint for submission data.
       */
      sourcePath: {
        type: String,
        attribute: "source-path"
      }
    };
  }
  /**
   * Handle tap on paper-button above to redirect to the correct submission url.
   */
  _loadSubmissionUrl(e) {
    var local = e.target;
    // this will have the id of the current submission
    var active = local.getAttribute("data-submission-id");
    // @todo need a cleaner integration but this at least goes the right place for now
    window.location.href =
      this.basePath + "lrnapp-studio-submission/submissions/" + active;
  }
  _activeAssignmentCompute(activeAssignmentId, assignments) {
    let activeAssignment = null;
    if (activeAssignmentId && assignments && assignments.length > 0) {
      activeAssignment = assignments.find(assignment => {
        return assignment.id == activeAssignmentId;
      });
    }
    return activeAssignment;
  }
  _showSubmissions(activeAssignmentId) {
    if (activeAssignmentId) {
      return true;
    }
    return false;
  }
  _scrollToTarget(e) {
    var local = e.target;
    // this will have the id of the current submission
    var active = local.getAttribute("data-submission-id");
    this.shadowRoot
      .querySelector("#submission-" + active)
      .scrollIntoView({ block: "start", behavior: "smooth" });
  }
  /**
   * Handle response for the whole assignments object.
   */
  _handleResponse(event) {
    this.shadowRoot.querySelector("#loading").hidden = true;
  }
  /**
   * Simple way to convert from object to array.
   */
  _toArray(obj) {
    if (obj == null) {
      return [];
    }
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
}
window.customElements.define(
  LrnappOpenStudioAssignments.tag,
  LrnappOpenStudioAssignments
);
export { LrnappOpenStudioAssignments };
