import {
  html,
  Polymer
} from "../../node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "../../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "../../node_modules/@polymer/iron-ajax/iron-ajax.js";
import "../../node_modules/@polymer/app-route/app-location.js";
import "../../node_modules/@polymer/app-route/app-route.js";
import "../../node_modules/@polymer/iron-icon/iron-icon.js";
import "../../node_modules/@polymer/paper-badge/paper-badge.js";
import "../../node_modules/@polymer/paper-toggle-button/paper-toggle-button.js";
import "../../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js";
import "../../node_modules/@polymer/paper-card/paper-card.js";
import "../../node_modules/@polymer/iron-list/iron-list.js";
import "../../node_modules/@polymer/paper-toast/paper-toast.js";
import "../../node_modules/@polymer/paper-button/paper-button.js";
import "../../node_modules/@polymer/paper-dialog/paper-dialog.js";
import "../../node_modules/@lrnwebcomponents/lrnsys-render-html/lrnsys-render-html.js";
import "../../node_modules/@lrnwebcomponents/lrnsys-layout/lib/lrnsys-dialog.js";
import "../../node_modules/@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import "../../node_modules/@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
import "../../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "./lrnapp-studio-project-button.js";
import "./lrnapp-studio-assignment-button.js";
Polymer({
  _template: html`
    <style include="materializecss-styles">
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
        min-height: 30em;
        width: 150vw;
        padding-top: 1em;
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
        min-height: 8em;
        max-height: 10em;
        overflow: scroll;
      }

      .project-operations {
        position: absolute;
        top: 0;
        right: 0;
        padding: 1em;
      }

      .project-operations .operation {
        display: inline-flex;
        height: 2.5em;
        width: 2.5em;
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
        height: 3em;
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

      .assignment-title {
        display: inline-flex;
        align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1em;
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
      }
      .assignment-operations .operation[hidden] {
        display: none;
      }

      lrnapp-studio-project-button {
        margin: 0em auto 1em;
        max-width: 20em;
      }
    </style>
    <iron-ajax
      auto=""
      id="projectbackend"
      url="[[sourcePath]]"
      handle-as="json"
      last-response="{{projectResponse}}"
      on-response="_handleProjectResponse"
    >
    </iron-ajax>
    <iron-ajax
      id="backend"
      url="[[sourcePath]]"
      params=""
      handle-as="json"
      last-response="{{backendResponse}}"
      on-response="_handleUpdateResponse"
    >
    </iron-ajax>

    <app-location
      route="{{route}}"
      query-params="{{queryParams}}"
    ></app-location>
    <app-route
      route="{{route}}"
      pattern="[[endPoint]]/:page"
      data="{{data}}"
      tail="{{tail}}"
      query-params="{{queryParams}}"
    >
    </app-route>
    <div id="loading">
      <h3>Loading..</h3>
      <elmsln-loading color="grey-text" size="large"></elmsln-loading>
    </div>
    <lrnapp-studio-project-button
      hidden\$="[[!projectResponse.data.canCreateProjects]]"
      classes="amber darken-3 white-text"
      end-point="[[endPoint]]"
      csrf-token="[[csrfToken]]"
      icon="add"
    ></lrnapp-studio-project-button>
    <div class="projects-window">
      <iron-list
        items="[[_toArray(projectResponse.data.projects)]]"
        as="project"
        class="projects-container"
        grid=""
      >
        <template class="projects-container-items">
          <div class="project-container">
            <paper-card
              id\$="project-[[project.id]]"
              class="project-card grey lighten-3"
              heading="{{project.attributes.title}}"
              elevation="2"
            >
              <div class="project-operations">
                <lrnsys-button
                  icon-class="no-margin"
                  id\$="project-[[project.id]]-edit"
                  alt="Edit project"
                  class="circle operation"
                  hover-class="amber lighten-2"
                  hidden="[[!project.meta.canUpdate]]"
                  icon="create"
                  on-tap="_makeProjectEditLink"
                >
                </lrnsys-button>
                <lrnapp-studio-assignment-button
                  project-id="[[project.id]]"
                  icon-class="no-margin"
                  id\$="project-[[project.id]]-add"
                  alt="Add assignment"
                  class="circle operation"
                  hover-class="amber lighten-2"
                  hidden="[[!project.meta.canUpdate]]"
                  icon="add"
                  end-point="[[endPoint]]"
                  csrf-token="[[csrfToken]]"
                >
                </lrnapp-studio-assignment-button>
                <lrnsys-button
                  id\$="project-[[project.id]]-delete"
                  alt="Delete project!"
                  class="circle operation"
                  hover-class="red darken-2 white-text"
                  header="Delete project!"
                  hidden="[[!project.meta.canDelete]]"
                  icon="delete-forever"
                  on-tap="_deleteProjectDialog"
                  icon-class="no-margin"
                >
                </lrnsys-button>
              </div>
              <div class="card-content">
                <iron-list
                  items="[[_toArray(project.relationships.assignments)]]"
                  as="assignment"
                >
                  <template>
                    <div class="assignment-row" id="assignment">
                      <lrnsys-dialog
                        body-append=""
                        on-focusin="assignmentFocusIn"
                        class="assignment-row-button"
                        id\$="assignment-[[project.id]]-[[assignment.id]]"
                        header="[[assignment.attributes.title]]"
                        hover-class="amber lighten-5"
                      >
                        <span slot="button" class="button-contents">
                          <div
                            class\$="status-indicator [[assignment.meta.relatedSubmissions.complete.color]]"
                          >
                            <iron-icon
                              icon="[[assignment.meta.relatedSubmissions.complete.icon]]"
                              disabled\$="[[!assignment.meta.relatedSubmissions.canCreate]]"
                            ></iron-icon>
                          </div>
                          <div class="assignment-title">
                            [[assignment.attributes.title]]
                          </div>
                        </span>
                        <div slot="content">
                          <app-toolbar
                            class\$="[[assignment.meta.relatedSubmissions.complete.color]]"
                          >
                            <div>
                              <iron-icon
                                icon="[[assignment.meta.relatedSubmissions.complete.icon]]"
                                disabled\$="[[!assignment.meta.relatedSubmissions.canCreate]]"
                              ></iron-icon>
                              [[assignment.meta.relatedSubmissions.complete.submission.title]]
                            </div>
                            <div
                              spacer=""
                              class="comment-box"
                              hidden\$="[[!assignment.meta.relatedSubmissions.complete.submission.id]]"
                            >
                              <paper-button
                                id\$="assignment-[[project.id]]-[[assignment.id]]-comments"
                                style="margin:0;padding:.25em;text-transform:none;"
                              >
                                <iron-icon
                                  icon="communication:forum"
                                ></iron-icon>
                                [[assignment.meta.relatedSubmissions.complete.submission.meta.comments.count]]
                                Comments
                              </paper-button>
                              <paper-badge
                                hidden\$="[[displayNewBadge(assignment.meta.relatedSubmissions.complete.submission.meta.new)]]"
                                for\$="assignment-[[project.id]]-[[assignment.id]]-comments"
                                label\$="[[assignment.meta.relatedSubmissions.complete.submission.meta.comments.new]]"
                              ></paper-badge>
                            </div>

                            <lrnapp-studio-submission-button
                              spacer=""
                              auto=""
                              assignment-id="[[assignment.id]]"
                              submission="{{submission}}"
                              end-point="[[buildSubmissionPath(basePath)]]"
                              csrf-token="[[csrfToken]]"
                              submission-id="[[assignment.meta.relatedSubmissions.complete.submission.id]]"
                            ></lrnapp-studio-submission-button>
                            <div main-title=""></div>
                            <paper-toggle-button
                              id\$="assignment-[[project.id]]-[[assignment.id]]-toggle"
                              on-tap="statusToggle"
                            ></paper-toggle-button>
                            <span
                              id\$="assignment-[[project.id]]-[[assignment.id]]-toggle-text"
                            ></span>
                            <div bottom-item="" class="status-rationale">
                              [[assignment.meta.relatedSubmissions.complete.rationale.text]]
                            </div>
                          </app-toolbar>
                          <lrnsys-render-html
                            style="padding:2em;"
                            html="[[assignment.attributes.body]]"
                          ></lrnsys-render-html>
                        </div>
                      </lrnsys-dialog>
                      <span class="assignment-operations">
                        <lrnsys-button
                          id\$="assignment-[[project.id]]-[[assignment.id]]-add-critique"
                          icon="editor:insert-comment"
                          alt="Add critique"
                          class="circle operation"
                          hover-class="green lighten-2"
                          hidden="[[!assignment.meta.canCritique]]"
                          href\$="[[assignment.meta.critiqueLink]]"
                          icon-class="no-margin"
                        ></lrnsys-button>
                        <lrnsys-button
                          id\$="assignment-[[project.id]]-[[assignment.id]]-edit"
                          icon="editor:mode-edit"
                          alt="Edit"
                          class="circle operation"
                          hover-class="amber lighten-4"
                          hidden="[[!assignment.meta.canUpdate]]"
                          on-tap="_makeAssignmentEditLink"
                          icon-class="no-margin green-text text-darken-4"
                        ></lrnsys-button>
                        <lrnsys-button
                          id\$="assignment-[[project.id]]-[[assignment.id]]-delete"
                          icon="delete"
                          alt="Delete"
                          class="circle operation"
                          hover-class="amber lighten-4"
                          hidden="[[!assignment.meta.canDelete]]"
                          on-tap="_deleteAssignmentDialog"
                          icon-class="no-margin red-text text-darken-4"
                        ></lrnsys-button>
                      </span>
                    </div>
                  </template>
                </iron-list>
              </div>
            </paper-card>
          </div>
        </template>
      </iron-list>
    </div>
    <paper-toast text="Updated" id="toast"></paper-toast>
    <paper-dialog id="delete" modal="">
      <h3>[[_deleteTitle]]</h3>
      <p>[[_deleteText]]</p>
      <div class="buttons">
        <paper-button dialog-dismiss="">Decline</paper-button>
        <paper-button
          id="deleteaccept"
          on-tap="_handleDelete"
          dialog-confirm=""
          autofocus=""
          >Accept</paper-button
        >
      </div>
    </paper-dialog>
  `,
  is: "lrnapp-studio-kanban",
  properties: {
    activeAssignment: { type: String, value: null, notify: !0 },
    projectToDelete: { type: String, value: null, notify: !0 },
    assignmentToDelete: { type: String, value: null, notify: !0 },
    sourcePath: { type: String, notify: !0 },
    submission: { type: Object, notify: !0 },
    projectResponse: { type: Object, notify: !0 },
    backendResponse: { type: Object, notify: !0 }
  },
  listeners: {
    "project-created": "_handleProjectCreated",
    "assignment-created": "_handleAssignmentCreated"
  },
  observers: [
    "_routeChanged(route, endPoint)",
    "_deleteToast(queryParams.deletetoast)"
  ],
  _routeChanged: function(route, endPoint) {
    if ("string" === typeof route.path) {
      if ("string" === typeof endPoint) {
        if (route.path.startsWith(endPoint)) {
          return;
        }
      }
      window.location = route.path;
    }
  },
  _deleteToast: function(deletetoast, old) {
    if (typeof deletetoast !== typeof void 0) {
      if ("error" == deletetoast) {
        this.$.toast.show("That submission on longer exists!");
      } else {
        this.$.toast.show("Submission deleted successfully!");
      }
      this.set("queryParams.deletetoast", void 0);
      this.notifyPath("queryParams.deletetoast");
    }
  },
  _makeProjectEditLink: function(e) {
    var normalizedEvent = dom(e),
      local = normalizedEvent.localTarget,
      parts = local.id.split("-");
    window.location.href =
      this.basePath +
      "../node/" +
      parts[1] +
      "/edit?destination=apps/lrnapp-studio-kanban";
  },
  _makeAssignmentEditLink: function(e) {
    var normalizedEvent = dom(e),
      local = normalizedEvent.localTarget,
      parts = local.id.split("-");
    window.location.href =
      this.basePath +
      "../node/" +
      parts[2] +
      "/edit?destination=apps/lrnapp-studio-kanban";
  },
  _deleteProjectDialog: function(e) {
    var normalizedEvent = dom(e),
      local = normalizedEvent.localTarget,
      parts = local.id.split("-");
    this.projectToDelete = parts[1];
    this._deleteTitle = "Delete project";
    this._deleteText =
      "Are you sure you want to delete this project and all related assignments!?";
    this._deleteType = "project";
    this.$.delete.open();
  },
  _handleDelete: function() {
    if ("project" == this._deleteType) {
      this.$.backend.method = "DELETE";
      this.$.backend.body = this.projectToDelete;
      this.$.backend.url =
        this.endPoint +
        "/api/projects/" +
        this.projectToDelete +
        "?token=" +
        this.csrfToken;
      this.$.backend.generateRequest();
    } else if ("assignment" == this._deleteType) {
      this.$.backend.method = "DELETE";
      this.$.backend.body = this.assignmentToDelete;
      this.$.backend.url =
        this.endPoint +
        "/api/assignments/" +
        this.assignmentToDelete +
        "?token=" +
        this.csrfToken;
      this.$.backend.generateRequest();
    }
  },
  _deleteAssignmentDialog: function(e) {
    var normalizedEvent = dom(e),
      local = normalizedEvent.localTarget,
      parts = local.id.split("-");
    this.assignmentToDelete = parts[2];
    this._deleteTitle = "Delete assignment";
    this._deleteText = "Are you sure you want to delete this assignment?";
    this._deleteType = "assignment";
    this.$.delete.open();
  },
  displayNewBadge: function(count) {
    if (0 == count) {
      return !0;
    }
    return !1;
  },
  statusToggle: function(e) {
    var xhr = this.$.backend,
      parts = this.activeAssignment.split("-"),
      submission = this.projectResponse.data.projects["project-" + parts[1]]
        .relationships.assignments["assignment-" + parts[2]].meta
        .relatedSubmissions.complete;
    if (
      !this.shadowRoot.querySelector("#" + this.activeAssignment + "-toggle")
        .disabled
    ) {
      this.$.loading.hidden = !1;
      xhr.params = {
        submissionid: submission.submission.id,
        status: this.shadowRoot.querySelector(
          "#" + this.activeAssignment + "-toggle"
        ).checked
      };
      xhr.generateRequest();
    }
  },
  assignmentFocusIn: function(e) {
    var normalizedEvent = dom(e),
      local = normalizedEvent.localTarget;
    if (null != this.activeAssignment && this.activeAssignment != local.id) {
      this.shadowRoot
        .querySelector("#" + this.activeAssignment)
        .nextElementSibling.classList.remove("show");
      this.shadowRoot
        .querySelector("#" + this.activeAssignment)
        .classList.remove("active");
    }
    this.activeAssignment = local.id;
    this._setToggle(!1);
    local.nextElementSibling.classList.add("show");
    local.classList.add("active");
  },
  _handleProjectResponse: function(event) {
    this.$.loading.hidden = !0;
    this._setToggle(!0);
  },
  buildSubmissionPath: function(path) {
    return path + "lrnapp-studio-submission";
  },
  _handleUpdateResponse: function(event) {
    if (200 == this.backendResponse.status) {
      this.$.toast.text = "Updated successfully";
      this.$.toast.toggle();
      this.$.projectbackend.generateRequest();
    } else {
      this.$.loading.hidden = !0;
    }
  },
  _setToggle: function(update) {
    if (null != this.activeAssignment) {
      var parts = this.activeAssignment.split("-"),
        submission = this.projectResponse.data.projects["project-" + parts[1]]
          .relationships.assignments["assignment-" + parts[2]].meta
          .relatedSubmissions.complete;
      if (0 == submission.status && 0 == submission.submission.length) {
        if (!update) {
          this.shadowRoot.querySelector(
            "#" + this.activeAssignment + "-toggle"
          ).disabled = !0;
          this.shadowRoot.querySelector(
            "#" + this.activeAssignment + "-toggle"
          ).checked = !1;
        }
        this.shadowRoot.querySelector(
          "#" + this.activeAssignment + "-toggle"
        ).title = "Submission not started";
        this.shadowRoot.querySelector(
          "#" + this.activeAssignment + "-toggle-text"
        ).textContent = "Submission not started";
      } else if (0 == submission.status) {
        if (!update) {
          this.shadowRoot.querySelector(
            "#" + this.activeAssignment + "-toggle"
          ).disabled = !1;
          this.shadowRoot.querySelector(
            "#" + this.activeAssignment + "-toggle"
          ).checked = !1;
        }
        this.shadowRoot.querySelector(
          "#" + this.activeAssignment + "-toggle"
        ).title = "Submission started";
        this.shadowRoot.querySelector(
          "#" + this.activeAssignment + "-toggle-text"
        ).textContent = "Submission in progress";
      } else {
        if (!update) {
          this.shadowRoot.querySelector(
            "#" + this.activeAssignment + "-toggle"
          ).disabled = !1;
          this.shadowRoot.querySelector(
            "#" + this.activeAssignment + "-toggle"
          ).checked = !0;
        }
        this.shadowRoot.querySelector(
          "#" + this.activeAssignment + "-toggle"
        ).title = "Submission ready";
        this.shadowRoot.querySelector(
          "#" + this.activeAssignment + "-toggle-text"
        ).textContent = "Submission ready";
      }
    }
  },
  _handleProjectCreated: function(e) {
    this.$.toast.text = "Project added";
    this.$.toast.toggle();
    this.$.projectbackend.generateRequest();
  },
  _handleAssignmentCreated: function(e) {
    this.$.toast.text = "Assignment added";
    this.$.toast.toggle();
    this.$.projectbackend.generateRequest();
  },
  _toArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
});
