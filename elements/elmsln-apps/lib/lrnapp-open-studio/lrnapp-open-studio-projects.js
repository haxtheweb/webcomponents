import { LitElement, html, css } from "lit-element/lit-element.js";
import { materialCssStyles } from "@lrnwebcomponents/materializecss-styles/lib/colors.js";

class LrnappOpenStudioProjects extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      materialCssStyles,
      css`
        :host {
          display: block;
          align-content: center;
        }
        h1.empty-title,
        h1.project-title {
          font-size: 2em;
        }
        h2.assignment-title {
          font-size: 1.5em;
          font-weight: bold;
          width: 100%;
          border-bottom: solid 1px grey;
        }
        .project-steps {
          display: flex;
          align-items: center;
        }
        .project-step {
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          word-wrap: break-word;
        }
      `
    ];
  }
  constructor() {
    super();
    import("@lrnwebcomponents/lrnsys-button/lrnsys-button.js");
    import("@lrnwebcomponents/elmsln-apps/lib/lrnapp-studio-submission/lrnapp-studio-submission-display.js");
  }
  render() {
    return html`
      ${this.showSubmissions
        ? html`
            <h1 class="project-title black-text">
              ${this.activeProject.attributes.title}
            </h1>
            <div class="project-steps">
              ${this.activeProject.attributes.steps.map(
                assignment => html`
                  <lrnsys-button
                    icon="${this._getSubmissionIcon(assignment.id)}"
                    icon-class="${this._getSubmissionClass(assignment.id)}"
                    @click="${this._scrollToTarget}"
                    label="${assignment.title}"
                    data-assignment-id="${assignment.id}"
                    class="project-step"
                    hover-class="blue white-text"
                    raised=""
                    ?hidden="${!assignment.title}"
                  ></lrnsys-button>
                `
              )}
            </div>
            ${this.renderSubmissions.map(
              submission => html`
                <a
                  name="${submission.relationships.assignment.title}"
                  class="assignment-${submission.relationships.assignment.id}"
                  ><h2 class="assignment-title">
                    ${submission.relationships.assignment.title}
                  </h2></a
                >
                <lrnapp-studio-submission-display
                  .submission="${submission}"
                  class="ferpa-protect"
                ></lrnapp-studio-submission-display>
              `
            )}
          `
        : html`
            <h1 class="empty-title black-text">
              Please select an Author and Project in order to review their
              portfolio
            </h1>
          `}
    `;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (
        ["submissions", "activeProject", "activeAuthorId"].includes(propName)
      ) {
        this.renderSubmissions = this._renderSubmissionsCompute(
          this.submissions,
          this.activeProject,
          this.activeAuthorId
        );
      }
      if (propName == "renderSubmissions") {
        // notify
        this.dispatchEvent(
          new CustomEvent("render-submissions-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (propName == "projects") {
        this.showSubmissions = this._activeProjectCompute(
          this.activeProjectId,
          this.activeAuthorId
        );
        // notify
        this.dispatchEvent(
          new CustomEvent("projects-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (propName == "activeAuthorId") {
        this.showSubmissions = this._showSubmissions(
          this.activeProjectId,
          this.activeAuthorId
        );
      }
      if (propName == "activeProjectId") {
        this.showSubmissions = this._showSubmissions(
          this.activeProjectId,
          this.activeAuthorId
        );
        this.activeProject = this._activeProjectCompute(
          this.activeProjectId,
          this.projects
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
    return "lrnapp-open-studio-projects";
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
       * The projects that exist so we can make other calls for data
       */
      projects: {
        type: Array
      },
      /**
       * The submissions that exist so we can make other calls for data
       */
      submissions: {
        type: Array
      },
      /**
       * The renderSubmissions we kick to the screen
       */
      renderSubmissions: {
        type: Array
      },
      activeProjectId: {
        type: String,
        reflect: true,
        attribute: "active-project-id"
      },
      activeProject: {
        type: Object
      },
      activeAuthorId: {
        type: String,
        reflect: true
      },
      showSubmissions: {
        type: Boolean
      },
      /**
       * Endpoint for submission data.
       */
      sourcePath: {
        type: String
      }
    };
  }

  _renderSubmissionsCompute(submissions, activeProject, activeAuthorId) {
    // if we don't have all three variables then we need to bail and set to null
    if (!submissions || !activeProject || !activeAuthorId) {
      return null;
    }
    let renderSubmissions = [];
    // make an array of parent assignment ids
    const parentAssignments = activeProject.attributes.steps.map(
      step => step.id
    );
    // filter the submissions by if they are listed in the active projects steps
    renderSubmissions = submissions.filter(submission => {
      return parentAssignments.includes(submission.relationships.assignment.id);
    });
    // sort render submissions by how the assignment steps are listed in the active project
    renderSubmissions.sort(function(a, b) {
      for (
        var index = 0;
        index < activeProject.attributes.steps.length;
        index++
      ) {
        if (
          activeProject.attributes.steps[index].id ==
          a.relationships.assignment.id
        ) {
          return -1;
        }
        if (
          activeProject.attributes.steps[index].id ==
          b.relationships.assignment.id
        ) {
          return 1;
        }
      }
      return 0;
    });
    return renderSubmissions;
  }
  _activeProjectCompute(activeProjectId, projects) {
    let activeProject = null;
    if (projects) {
      activeProject = projects.find(project => {
        return project.id === activeProjectId;
      });
    }
    return activeProject;
  }
  _showSubmissions(activeProjectId, activeAuthorId) {
    if (activeProjectId && activeAuthorId) {
      return true;
    }
    return false;
  }
  _getSubmissionIcon(id) {
    for (var index = 0; index < this.renderSubmissions.length; index++) {
      if (this.renderSubmissions[index].relationships.assignment.id == id) {
        return "check";
      }
    }
    return "assignment";
  }
  _getSubmissionClass(id) {
    for (var index = 0; index < this.renderSubmissions.length; index++) {
      if (this.renderSubmissions[index].relationships.assignment.id == id) {
        return "green-text text-darken-2";
      }
    }
    return "grey-text";
  }
  _scrollToTarget(e) {
    var local = e.target;
    // this will have the id of the current submission
    var active = local.getAttribute("data-assignment-id");
    if (this.shadowRoot.querySelector(".assignment-" + active)) {
      this.shadowRoot.querySelector(".assignment-" + active).scrollIntoView({
        block: "end",
        behavior: "smooth"
      });
    }
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
  LrnappOpenStudioProjects.tag,
  LrnappOpenStudioProjects
);
export { LrnappOpenStudioProjects };
