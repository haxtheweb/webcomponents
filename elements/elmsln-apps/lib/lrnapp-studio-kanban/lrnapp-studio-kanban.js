import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/app-route/app-location.js";
import "@polymer/app-route/app-route.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-icons/communication-icons.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-badge/paper-badge.js";
import "@polymer/paper-toggle-button/paper-toggle-button.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "@polymer/app-layout/app-header/app-header.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/paper-toast/paper-toast.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@lrnwebcomponents/lrnsys-render-html/lrnsys-render-html.js";
import "@lrnwebcomponents/lrnsys-layout/lib/lrnsys-dialog.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import "@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "./lrnapp-studio-project-button.js";
import "./lrnapp-studio-assignment-button.js";
import "../lrnapp-studio-submission/lrnapp-studio-submission-button.js";
class LrnappStudioKanban extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
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
        .projects-container {
          -webkit-box-pack: start;
          -ms-flex-pack: start;
          justify-content: flex-start;
          -webkit-box-align: start;
          -ms-flex-align: start;
          align-items: flex-start;
          min-height: 23em;
          width: 150vw;
        }
        @media screen and (max-width: 800px) {
          .projects-container {
            width: auto;
          }
        }
        #activetoggle {
          padding-left: 16px;
        }
        .projects-window {
          width: 100vw;
          overflow-x: scroll;
          overflow-y: hidden;
          scrollbar-face-color: #833900;
          scrollbar-shadow-color: #ffc107;
          scrollbar-highlight-color: #ffc107;
          scrollbar-3dlight-color: #ffc107;
          scrollbar-darkshadow-color: #ffc107;
          scrollbar-track-color: #ffc107;
          scrollbar-arrow-color: #ffc107;
        }
        .projects-window::-webkit-scrollbar-track {
          background-color: #833900;
        }
        /* the new scrollbar will have a flat appearance with the set background color */
        .projects-window::-webkit-scrollbar-thumb {
          background-color: #ffc107;
        }
        /* this will style the thumb, ignoring the track */
        .projects-window::-webkit-scrollbar-button {
          background-color: #833900;
        }
        /* optionally, you can style the top and the bottom buttons (left and right for horizontal bars) */
        .projects-window::-webkit-scrollbar-corner {
          background-color: #833900;
        }
        /* if both the vertical and the horizontal bars appear, then perhaps the right bottom corner*/
        .projects-window::-webkit-scrollbar {
          width: 1rem;
          height: 1rem;
        }
        /* this targets the default scrollbar (compulsory) */
        paper-button {
          padding: 0;
          margin: 0;
          min-width: 1rem;
        }
        .project-card {
          width: 100%;
          min-width: 20em;
          max-width: 20em;
          margin: 0;
          height: 100%;
          min-height: 10em;
        }
        .project-container {
          padding: 1em;
        }
        .project-card .card-content {
          height: 100%;
          min-height: 288px;
          max-height: 300px;
          overflow: scroll;
        }
        .project-operations {
          position: absolute;
          top: 0;
          right: 0;
        }
        .project-operations .operation {
          display: inline-flex;
        }
        .project-operations .operation[hidden] {
          display: none;
        }
        .assignment-row {
          border: 1px solid #000000;
          background-color: #ffffff;
        }
        .assignment-row .assignment-row-button.active {
          background-color: var(--paper-amber-50);
          font-weight: bold;
        }
        .assignment-row:hover .assignment-operations {
          display: block;
          overflow: visible;
          margin: 0.2em;
        }
        .assignment-row-button {
          width: 100%;
          justify-content: flex-start;
          text-transform: none;
        }
        .status-indicator {
          border-right: 1px solid grey;
          padding: 0.5em;
          margin: 0 0.5em 0 0;
          display: inline-flex;
          line-height: 2em;
          height: 2em;
          justify-content: center;
          align-items: center;
        }
        .button-contents {
          display: flex;
          align-content: center;
        }
        .assignment-operations {
          position: absolute;
          top: 0;
          right: 0;
          padding: 0;
          display: none;
        }
        .assignment-operations.show {
          display: block;
          overflow: visible;
        }
        .assignment-operations .operation {
          display: inline-flex;
          width: 2.5em;
          height: 2.5em;
          margin: -4px 4px 0 0;
        }
        .assignment-operations .operation[hidden] {
          display: none;
        }
        lrnapp-studio-project-button {
          margin: 0em auto;
          max-width: 20em;
        }
      `
    ];
  }
  render() {
    return html`
      <custom-style>
        <style include="materializecss-styles">
          .project-card {
            --paper-card-header: {
              max-width: 60%;
              word-break: break-all;
            }
          }
        </style>
      </custom-style>
      <iron-ajax
        auto=""
        id="projectbackend"
        url="${this.sourcePath}"
        handle-as="json"
        @last-response-changed="${this.projectResponseChanged}"
        @response="${this._handleProjectResponse}"
      >
      </iron-ajax>
      <iron-ajax
        id="backend"
        url="${this.sourcePath}"
        params=""
        handle-as="json"
        @last-response-changed="${this.backendResponseChanged}"
        @response="${this._handleUpdateResponse}"
      >
      </iron-ajax>

      <app-location
        .route="${this.route}"
        @route-changed="${this.routeChangedEvent}"
        .query-params="${this.queryParams}"
        @query-params-changed="${this.queryParamsChangedEvent}"
      ></app-location>
      <app-route
        .route="${this.route}"
        @route-changed="${this.routeChangedEvent}"
        pattern="${this.endPoint}/:page"
        .data="${this.data}"
        @data-changed="${this.dataChangedEvent}"
        .tail="${this.tail}"
        @tail-changed="${this.tailChangedEvent}"
        .query-params="${this.queryParams}"
        @query-params-changed="${this.queryParamsChangedEvent}"
      >
      </app-route>
      <div id="loading">
        <h3>Loading..</h3>
        <elmsln-loading color="grey-text" size="large"></elmsln-loading>
      </div>
      <lrnapp-studio-project-button
        ?hidden="${!this.projectResponse.data.canCreateProjects}"
        classes="amber darken-4 white-text"
        end-point="${this.endPoint}"
        csrf-token="${this.csrfToken}"
        icon="add"
      ></lrnapp-studio-project-button>
      <div class="projects-window">
        ${this._toArray(this.projectResponse.data.projects).map(
          project => html`
            <div class="project-container">
              <paper-card
                id="project-${project.id}"
                class="project-card grey lighten-3"
                heading="${project.attributes.title}"
                elevation="2"
              >
                <div class="project-operations">
                  <lrnsys-button
                    icon-class="no-margin"
                    id="project-${project.id}-edit"
                    alt="Edit project"
                    class="operation"
                    hover-class="amber lighten-2"
                    ?hidden="${!project.meta.canUpdate}"
                    icon="create"
                    @click="${this._makeProjectEditLink}"
                  >
                  </lrnsys-button>
                  <lrnapp-studio-assignment-button
                    project-id="${project.id}"
                    icon-class="no-margin"
                    id="project-${project.id}-add"
                    alt="Add assignment"
                    class="operation"
                    hover-class="amber lighten-2"
                    ?hidden="${!project.meta.canUpdate}"
                    icon="add"
                    end-point="${this.endPoint}"
                    csrf-token="${this.csrfToken}"
                  >
                  </lrnapp-studio-assignment-button>
                  <lrnsys-button
                    id="project-${project.id}-delete"
                    alt="Delete project!"
                    class="operation"
                    hover-class="red darken-2 white-text"
                    header="Delete project!"
                    ?hidden="${!project.meta.canDelete}"
                    icon="delete-forever"
                    @click="${this._deleteProjectDialog}"
                    icon-class="no-margin"
                  >
                  </lrnsys-button>
                </div>
                <div class="card-content">
                  ${this._toArray(project.relationships.assignments).map(
                    assignment => html`
                      <div class="assignment-row" id="assignment">
                        <lrnsys-button
                          id="assignment-${project.id}-${assignment.id}"
                          class="assignment-row-button"
                          hover-class="amber lighten-5"
                          @click="${this.assignmentClick}"
                          icon="${assignment.meta.relatedSubmissions.complete
                            .icon}"
                        >
                          ${assignment.attributes.title}
                        </lrnsys-button>
                        <span class="assignment-operations">
                          <lrnsys-button
                            id="assignment-${project.id}-${assignment.id}-add-critique"
                            icon="editor:insert-comment"
                            alt="Add critique"
                            class="operation"
                            hover-class="green lighten-2"
                            ?hidden="${!assignment.meta.canCritique}"
                            href="${assignment.meta.critiqueLink}"
                            icon-class="no-margin"
                          ></lrnsys-button>
                          <lrnsys-button
                            id="assignment-${project.id}-${assignment.id}-edit"
                            icon="editor:mode-edit"
                            alt="Edit"
                            class="operation"
                            hover-class="amber lighten-4"
                            ?hidden="${!assignment.meta.canUpdate}"
                            @click="${this._makeAssignmentEditLink}"
                            icon-class="no-margin green-text text-darken-4"
                          ></lrnsys-button>
                          <lrnsys-button
                            id="assignment-${project.id}-${assignment.id}-delete"
                            icon="delete"
                            alt="Delete"
                            class="operation"
                            hover-class="amber lighten-4"
                            hidden="${!assignment.meta.canDelete}"
                            @click="${this._deleteAssignmentDialog}"
                            icon-class="no-margin red-text text-darken-4"
                          ></lrnsys-button>
                        </span>
                      </div>
                    `
                  )}
                </div>
              </paper-card>
            </div>
          `
        )}
      </div>
      <paper-toast text="Updated" id="toast"></paper-toast>
      <paper-dialog id="delete" modal="">
        <h3>${this._deleteTitle}</h3>
        <p>${this._deleteText}</p>
        <div class="buttons">
          <paper-button dialog-dismiss="">Decline</paper-button>
          <paper-button
            id="deleteaccept"
            @click="${this._handleDelete}"
            dialog-confirm=""
            autofocus=""
            >Accept</paper-button
          >
        </div>
      </paper-dialog>
      <paper-dialog id="activeitemcontainer" with-backdrop>
        <div id="activecontent">
          <app-header reveals>
            <app-toolbar
              class="${this.activeAssignmentNode.meta.relatedSubmissions
                .complete.color}"
            >
              <div>
                <iron-icon
                  icon="${this.activeAssignmentNode.meta.relatedSubmissions
                    .complete.icon}"
                  ?disabled="${!this.activeAssignmentNode.meta
                    .relatedSubmissions.canCreate}"
                ></iron-icon>
                ${this.activeAssignmentNode.meta.relatedSubmissions.complete
                  .submission.title}
              </div>
              <div
                spacer=""
                class="comment-box"
                ?hidden="${!this.activeAssignmentNode.meta.relatedSubmissions
                  .complete.submission.id}"
              >
                <paper-button
                  id="assignment-${this.activeAssignmentNode.relationships
                    .project.data.id}-${this.activeAssignmentNode.id}-comments"
                  style="margin:0;padding:.25em;text-transform:none;"
                >
                  <iron-icon icon="communication:forum"></iron-icon>
                  ${this.activeAssignmentNode.meta.relatedSubmissions.complete
                    .submission.meta.comments.count}
                  Comments
                </paper-button>
                <paper-badge
                  ?hidden="${this.displayNewBadge(
                    activeAssignmentNode.meta.relatedSubmissions.complete
                      .submission.meta.new
                  )}"
                  for="assignment-${this.activeAssignmentNode.relationships
                    .project.data.id}-${this.activeAssignmentNode.id}-comments"
                  label="${this.activeAssignmentNode.meta.relatedSubmissions
                    .complete.submission.meta.comments.new}"
                ></paper-badge>
              </div>

              <lrnapp-studio-submission-button
                spacer
                auto
                assignment-id="${this.activeAssignmentNode.id}"
                .submission="${this.submission}"
                end-point="${this.buildSubmissionPath(this.basePath)}"
                csrf-token="${this.csrfToken}"
                submission-id="${this.activeAssignmentNode.meta
                  .relatedSubmissions.complete.submission.id}"
              ></lrnapp-studio-submission-button>
              <paper-toggle-button
                id="activetoggle"
                @click="${this.statusToggle}"
              ></paper-toggle-button>
              <span id="activetoggletext"></span>
            </app-toolbar>
            <div class="status-rationale">
              ${this.activeAssignmentNode.meta.relatedSubmissions.complete
                .rationale.text}
            </div>
          </app-header>
          <lrnsys-render-html
            style="padding:2em;"
            html="${this.activeAssignmentNode.attributes.body}"
          ></lrnsys-render-html>
        </div>
      </paper-dialog>
    `;
  }

  static get tag() {
    return "lrnapp-studio-kanban";
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
      activeAssignment: {
        type: String,
        attribute: "active-assignment"
      },
      activeAssignmentNode: {
        type: Object
      },
      projectToDelete: {
        type: String,
        attribute: "project-to-delete"
      },
      assignmentToDelete: {
        type: String,
        attribute: "assignment-to-delete"
      },
      sourcePath: {
        type: String,
        attribute: "source-path"
      },
      /**
       * Submission for two-way data binding on return from the button being pushed
       */
      submission: {
        type: Object
      },
      /**
       * Response from the server.
       */
      projectResponse: {
        type: Object
      },
      /**
       * Response from the server for non-project requests.
       */
      backendResponse: {
        type: Object
      }
    };
  }
  backendResponseChanged(e) {
    this.backendResponse = { ...e.detail.value };
  }
  projectResponseChanged(e) {
    this.projectResponse = { ...e.detail.value };
  }
  routeChangedEvent(e) {
    this.route = { ...e.detail.value };
  }
  queryParamsChangedEvent(e) {
    this.queryParams = { ...e.detail.value };
  }
  tailChangedEvent(e) {
    this.tail = { ...e.detail.value };
  }
  dataChangedEvent(e) {
    this.data = { ...e.detail.value };
  }

  constructor() {
    super();
    this.assignmentToDelete = null;
    this.projectToDelete = null;
    this.activeAssignment = null;
    setTimeout(() => {
      this.addEventListener(
        "project-created",
        this._handleProjectCreated.bind(this)
      );
      this.addEventListener(
        "assignment-created",
        this._handleAssignmentCreated.bind(this)
      );
    }, 0);
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      let notifiedProps = [
        "basePath",
        "csrfToken",
        "endPoint",
        "activeAssignment",
        "backendResponse",
        "projectResponse",
        "submission",
        "sourcePath",
        "assignmentToDelete",
        "projectToDelete"
      ];
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
      if (["route", "endPoint"].includes(propName)) {
        this._routeChanged(this.route, this.endPoint);
      }
      if (propName == "queryParams") {
        this._deleteToast(this.queryParams.deletetoast);
      }
    });
  }

  // If the current route is outside the scope of our app
  // then allow the website to break out of the single page
  // application routing
  _routeChanged(route, endPoint) {
    if (typeof route.path === "string") {
      if (typeof endPoint === "string") {
        if (route.path.startsWith(endPoint) || route.path == "/") {
          return;
        }
      }
      window.location.reload();
    }
  }

  /**
   * Support having a toast message because of delete or error elsewhere.
   */
  _deleteToast(deletetoast, old) {
    if (typeof deletetoast !== typeof undefined) {
      if (deletetoast == "error") {
        this.shadowRoot
          .querySelector("#toast")
          .show("That submission on longer exists!");
      } else {
        this.shadowRoot
          .querySelector("#toast")
          .show("Submission deleted successfully!");
      }
      let attr = this.queryParams;
      attr.deletetoast = undefined;
      this.queryParams = { ...attr };
    }
  }

  /**
   * @todo  remove this once we have a modal for it
   */
  _makeProjectEditLink(e) {
    var local = e.target;
    var parts = local.id.split("-");
    window.location.href =
      this.basePath +
      "../node/" +
      parts[1] +
      "/edit?destination=apps/lrnapp-studio-kanban";
  }

  /**
   * @todo  remove this once we have a modal for it
   */
  _makeAssignmentEditLink(e) {
    var local = e.target;
    var parts = local.id.split("-");
    window.location.href =
      this.basePath +
      "../node/" +
      parts[2] +
      "/edit?destination=apps/lrnapp-studio-kanban";
  }

  /**
   * Handle the push to delete a project, pop up the modal.
   */
  _deleteProjectDialog(e) {
    var local = e.target;
    var parts = local.id.split("-");
    // set values so we know what to drop
    this.projectToDelete = parts[1];
    this._deleteTitle = "Delete project";
    this._deleteText =
      "Are you sure you want to delete this project and all related assignments!?";
    this._deleteType = "project";
    this.shadowRoot.querySelector("#delete").open();
  }

  /**
   * Handle the call to delete the assignment specified.
   */
  _handleDelete() {
    if (this._deleteType == "project") {
      this.shadowRoot.querySelector("#backend").method = "DELETE";
      this.shadowRoot.querySelector("#backend").body = this.projectToDelete;
      this.shadowRoot.querySelector("#backend").url =
        this.endPoint +
        "/api/projects/" +
        this.projectToDelete +
        "?token=" +
        this.csrfToken;
      this.shadowRoot.querySelector("#backend").generateRequest();
    } else if (this._deleteType == "assignment") {
      this.shadowRoot.querySelector("#backend").method = "DELETE";
      this.shadowRoot.querySelector("#backend").body = this.assignmentToDelete;
      this.shadowRoot.querySelector("#backend").url =
        this.endPoint +
        "/api/assignments/" +
        this.assignmentToDelete +
        "?token=" +
        this.csrfToken;
      this.shadowRoot.querySelector("#backend").generateRequest();
    }
  }
  /**
   * Handle the push to delete an assignment, pop up the modal.
   */
  _deleteAssignmentDialog(e) {
    var local = e.target;
    var parts = local.id.split("-");
    this.assignmentToDelete = parts[2];
    // set values so we know what to drop
    this._deleteTitle = "Delete assignment";
    this._deleteText = "Are you sure you want to delete this assignment?";
    this._deleteType = "assignment";
    this.shadowRoot.querySelector("#delete").open();
  }

  /**
   * if we should show new badge based on new comment count.
   */
  displayNewBadge(count) {
    if (typeof count === typeof undefined || count == 0) {
      return true;
    }
    return false;
  }

  /**
   * Handle toggling the status for the submission.
   */
  statusToggle(e) {
    // find our xhr for callbacks
    var xhr = this.shadowRoot.querySelector("#backend");
    // break the id out into project and assignment
    var parts = this.activeAssignment.split("-");
    // focus in on the submissions / assignment meta
    var submission = this.projectResponse.data.projects["project-" + parts[1]]
      .relationships.assignments["assignment-" + parts[2]].meta
      .relatedSubmissions.complete;
    // ensure this isn't disabled though it shouldn't be possible
    if (!this.shadowRoot.querySelector("#activetoggle").disabled) {
      // hide the loading screen
      this.shadowRoot.querySelector("#loading").hidden = false;
      // queue of the request parameters
      xhr.params = {
        submissionid: submission.submission.id,
        status: this.shadowRoot.querySelector("#activetoggle").checked
      };
      // send the request
      xhr.generateRequest();
    }
  }

  /**
   * Handle toggle for mouse class and manage classList array for paper-button.
   */
  assignmentClick(e) {
    var local = e.target;
    if (this.activeAssignment != null && this.activeAssignment != local.id) {
      this.shadowRoot
        .querySelector("#" + this.activeAssignment)
        .nextElementSibling.classList.remove("show");
      this.shadowRoot
        .querySelector("#" + this.activeAssignment)
        .classList.remove("active");
    }
    this.activeAssignment = local.id;
    var parts = this.activeAssignment.split("-");
    this.activeAssignmentNode = this.projectResponse.data.projects[
      "project-" + parts[1]
    ].relationships.assignments["assignment-" + parts[2]];
    this._setToggle(false);
    local.nextElementSibling.classList.add("show");
    local.classList.add("active");
    this.shadowRoot.querySelector("#activeitemcontainer").toggle();
  }

  /**
   * Handle response for the whole projects object.
   */
  _handleProjectResponse(event) {
    this.shadowRoot.querySelector("#loading").hidden = true;
    this._setToggle(true);
    if (this.activeAssignment) {
      setTimeout(() => {
        var parts = this.activeAssignment.split("-");
        this.activeAssignmentNode = this.projectResponse.data.projects[
          "project-" + parts[1]
        ].relationships.assignments["assignment-" + parts[2]];
      }, 100);
    }
  }

  /**
   * buildSubmissionPath for generating a new submission or linking to existing.
   */
  buildSubmissionPath(path) {
    return path + "lrnapp-studio-submission";
  }

  /**
   * Handle a response from updating an item
   */
  _handleUpdateResponse(event) {
    if (this.backendResponse.status == 200) {
      this.shadowRoot.querySelector("#toast").text = "Updated successfully";
      this.shadowRoot.querySelector("#toast").toggle();
      // this will force a repaint of the UI pieces on reload
      this.projectResponse = {};
      this.shadowRoot.querySelector("#projectbackend").generateRequest();
      setTimeout(() => {
        var parts = this.activeAssignment.split("-");
        this.activeAssignmentNode = this.projectResponse.data.projects[
          "project-" + parts[1]
        ].relationships.assignments["assignment-" + parts[2]];
      }, 500);
    } else {
      // this would imply an error
      this.shadowRoot.querySelector("#loading").hidden = true;
    }
  }

  /**
   * set the toggle state when assignment gets focus
   */
  _setToggle(update) {
    if (this.activeAssignment != null) {
      var parts = this.activeAssignment.split("-");
      // focus in on the submissions / assignment meta
      var submission = this.projectResponse.data.projects["project-" + parts[1]]
        .relationships.assignments["assignment-" + parts[2]].meta
        .relatedSubmissions.complete;
      // not finished but also not started
      if (submission.status == 0 && submission.submission.length == 0) {
        if (!update) {
          this.shadowRoot.querySelector("#activetoggle").disabled = true;
          this.shadowRoot.querySelector("#activetoggle").checked = false;
        }
        this.shadowRoot.querySelector("#activetoggle").title =
          "Submission not started";
        this.shadowRoot.querySelector("#activetoggletext").textContent =
          "Submission not started";
      } else if (submission.status == 0) {
        if (!update) {
          this.shadowRoot.querySelector("#activetoggle").disabled = false;
          this.shadowRoot.querySelector("#activetoggle").checked = false;
        }
        this.shadowRoot.querySelector("#activetoggle").title =
          "Submission started";
        this.shadowRoot.querySelector("#activetoggletext").textContent =
          "Submission in progress";
      } else {
        if (!update) {
          this.shadowRoot.querySelector("#activetoggle").disabled = false;
          this.shadowRoot.querySelector("#activetoggle").checked = true;
        }
        this.shadowRoot.querySelector("#activetoggle").title =
          "Submission ready";
        this.shadowRoot.querySelector("#activetoggletext").textContent =
          "Submission ready";
      }
    }
  }

  /**
   * Event came from the project button to indicate it was successful.
   */
  _handleProjectCreated(e) {
    this.shadowRoot.querySelector("#toast").text = "Project added";
    this.shadowRoot.querySelector("#toast").toggle();
    this.shadowRoot.querySelector("#projectbackend").generateRequest();
  }

  /**
   * Event came from the assignment button to indicate it was successful.
   */
  _handleAssignmentCreated(e) {
    this.shadowRoot.querySelector("#toast").text = "Assignment added";
    this.shadowRoot.querySelector("#toast").toggle();
    this.shadowRoot.querySelector("#projectbackend").generateRequest();
  }

  /*
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
window.customElements.define(LrnappStudioKanban.tag, LrnappStudioKanban);
export { LrnappStudioKanban };
