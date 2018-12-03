import "./lrnapp-studio-project-button.js";
import "./lrnapp-studio-assignment-button.js";
Polymer({
  _template: `
    <style include="materializecss-styles"></style>
    <style>
      :host {
        display: block;
      }

      #loading {
        width: 100%;
        z-index: 1000;
        opacity: .8;
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
        padding:1em;
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
        background-color: #FFFFFF;
      }

      .assignment-row .assignment-row-button.active {
        background-color: var(--paper-amber-50);
        font-weight: bold;
      }

      .assignment-row:hover .assignment-operations {
        display: block;
        overflow: visible;
        margin: .2em;
      }

      .assignment-row-button {
        width: 100%;
        justify-content: flex-start;
        height: 3em;
        text-transform: none;
      }

      .status-indicator {
        border-right: 1px solid grey;
        padding: .5em;
        margin: 0 .5em 0 0;
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
    <iron-ajax auto="" id="projectbackend" url="[[sourcePath]]" handle-as="json" last-response="{{projectResponse}}" on-response="_handleProjectResponse">
    </iron-ajax>
    <iron-ajax id="backend" url="[[sourcePath]]" params="" handle-as="json" last-response="{{backendResponse}}" on-response="_handleUpdateResponse">
    </iron-ajax>

    <app-location route="{{route}}" query-params="{{queryParams}}"></app-location>
    <app-route route="{{route}}" pattern="[[endPoint]]/:page" data="{{data}}" tail="{{tail}}" query-params="{{queryParams}}">
    </app-route>
    <div id="loading">
      <h3>Loading..</h3>
      <elmsln-loading color="grey-text" size="large"></elmsln-loading>
    </div>
    <lrnapp-studio-project-button hidden\$="[[!projectResponse.data.canCreateProjects]]" classes="amber darken-3 white-text" end-point="[[endPoint]]" csrf-token="[[csrfToken]]" icon="add"></lrnapp-studio-project-button>
    <div class="projects-window">
      <iron-list items="[[_toArray(projectResponse.data.projects)]]" as="project" class="projects-container" grid="">
        <template class="projects-container-items">
          <div class="project-container">
            <paper-card id\$="project-[[project.id]]" class="project-card grey lighten-3" heading="{{project.attributes.title}}" elevation="2">
              <div class="project-operations">
                <lrnsys-button icon-class="no-margin" id\$="project-[[project.id]]-edit" alt="Edit project" class="circle operation" hover-class="amber lighten-2" hidden="[[!project.meta.canUpdate]]" icon="create" on-tap="_makeProjectEditLink">
                </lrnsys-button>
                <lrnapp-studio-assignment-button project-id="[[project.id]]" icon-class="no-margin" id\$="project-[[project.id]]-add" alt="Add assignment" class="circle operation" hover-class="amber lighten-2" hidden="[[!project.meta.canUpdate]]" icon="add" end-point="[[endPoint]]" csrf-token="[[csrfToken]]">
                </lrnapp-studio-assignment-button>
                <lrnsys-button id\$="project-[[project.id]]-delete" alt="Delete project!" class="circle operation" hover-class="red darken-2 white-text" header="Delete project!" hidden="[[!project.meta.canDelete]]" icon="delete-forever" on-tap="_deleteProjectDialog" icon-class="no-margin">
                  </lrnsys-button>
              </div>
              <div class="card-content">
                <iron-list items="[[_toArray(project.relationships.assignments)]]" as="assignment">
                  <template>
                    <div class="assignment-row" id="assignment">
                      <lrnsys-dialog body-append="" on-focusin="assignmentFocusIn" class="assignment-row-button" id\$="assignment-[[project.id]]-[[assignment.id]]" header="[[assignment.attributes.title]]" hover-class="amber lighten-5">
                        <span slot="button" class="button-contents">
                  <div class\$="status-indicator [[assignment.meta.relatedSubmissions.complete.color]]">
                    <iron-icon icon="[[assignment.meta.relatedSubmissions.complete.icon]]" disabled\$="[[!assignment.meta.relatedSubmissions.canCreate]]"></iron-icon>
                  </div>
                  <div class="assignment-title">[[assignment.attributes.title]]</div>
                </span>
                        <div slot="content">
                          <app-toolbar class\$="[[assignment.meta.relatedSubmissions.complete.color]]">
                            <div>
                              <iron-icon icon="[[assignment.meta.relatedSubmissions.complete.icon]]" disabled\$="[[!assignment.meta.relatedSubmissions.canCreate]]"></iron-icon>
                              [[assignment.meta.relatedSubmissions.complete.submission.title]]
                            </div>
                            <div spacer="" class="comment-box" hidden\$="[[!assignment.meta.relatedSubmissions.complete.submission.id]]">
                              <paper-button id\$="assignment-[[project.id]]-[[assignment.id]]-comments" style="margin:0;padding:.25em;text-transform:none;">
                                <iron-icon icon="communication:forum"></iron-icon>
                                [[assignment.meta.relatedSubmissions.complete.submission.meta.comments.count]] Comments
                              </paper-button>
                              <paper-badge hidden\$="[[displayNewBadge(assignment.meta.relatedSubmissions.complete.submission.meta.new)]]" for\$="assignment-[[project.id]]-[[assignment.id]]-comments" label\$="[[assignment.meta.relatedSubmissions.complete.submission.meta.comments.new]]"></paper-badge>
                            </div>

                            <lrnapp-studio-submission-button spacer="" auto="" assignment-id="[[assignment.id]]" submission="{{submission}}" end-point="[[buildSubmissionPath(basePath)]]" csrf-token="[[csrfToken]]" submission-id="[[assignment.meta.relatedSubmissions.complete.submission.id]]"></lrnapp-studio-submission-button>
                            <div main-title=""></div>
                            <paper-toggle-button id\$="assignment-[[project.id]]-[[assignment.id]]-toggle" on-tap="statusToggle"></paper-toggle-button>
                            <span id\$="assignment-[[project.id]]-[[assignment.id]]-toggle-text"></span>
                            <div bottom-item="" class="status-rationale">
                              [[assignment.meta.relatedSubmissions.complete.rationale.text]]
                            </div>
                          </app-toolbar>
                          <lrnsys-render-html style="padding:2em;" html="[[assignment.attributes.body]]"></lrnsys-render-html>
                        </div>
                      </lrnsys-dialog>
                      <span class="assignment-operations">
                <lrnsys-button id\$="assignment-[[project.id]]-[[assignment.id]]-add-critique" icon="editor:insert-comment" alt="Add critique" class="circle operation" hover-class="green lighten-2" hidden="[[!assignment.meta.canCritique]]" href\$="[[assignment.meta.critiqueLink]]" icon-class="no-margin"></lrnsys-button>
                <lrnsys-button id\$="assignment-[[project.id]]-[[assignment.id]]-edit" icon="editor:mode-edit" alt="Edit" class="circle operation" hover-class="amber lighten-4" hidden="[[!assignment.meta.canUpdate]]" on-tap="_makeAssignmentEditLink" icon-class="no-margin green-text text-darken-4"></lrnsys-button>
                <lrnsys-button id\$="assignment-[[project.id]]-[[assignment.id]]-delete" icon="delete" alt="Delete" class="circle operation" hover-class="amber lighten-4" hidden="[[!assignment.meta.canDelete]]" on-tap="_deleteAssignmentDialog" icon-class="no-margin red-text text-darken-4"></lrnsys-button>
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
        <paper-button id="deleteaccept" on-tap="_handleDelete" dialog-confirm="" autofocus="">Accept</paper-button>
      </div>
    </paper-dialog>
`,

  is: "lrnapp-studio-kanban",

  properties: {
    /**
     * Tracks the active assignment.
     */
    activeAssignment: {
      type: String,
      value: null,
      notify: true
    },
    projectToDelete: {
      type: String,
      value: null,
      notify: true
    },
    assignmentToDelete: {
      type: String,
      value: null,
      notify: true
    },
    sourcePath: {
      type: String,
      notify: true
    },
    /**
     * Submission for two-way data binding on return from the button being pushed
     */
    submission: {
      type: Object,
      notify: true
    },
    /**
     * Response from the server.
     */
    projectResponse: {
      type: Object,
      notify: true
    },
    /**
     * Response from the server for non-project requests.
     */
    backendResponse: {
      type: Object,
      notify: true
    }
  },

  listeners: {
    "project-created": "_handleProjectCreated",
    "assignment-created": "_handleAssignmentCreated"
  },

  observers: [
    "_routeChanged(route, endPoint)",
    "_deleteToast(queryParams.deletetoast)"
  ],

  // If the current route is outside the scope of our app
  // then allow the website to break out of the single page
  // application routing
  _routeChanged: function(route, endPoint) {
    if (typeof route.path === "string") {
      if (typeof endPoint === "string") {
        if (route.path.startsWith(endPoint)) {
          return;
        }
      }
      window.location = route.path;
    }
  },

  /**
   * Support having a toast message because of delete or error elsewhere.
   */
  _deleteToast: function(deletetoast, old) {
    if (typeof deletetoast !== typeof undefined) {
      if (deletetoast == "error") {
        this.$.toast.show("That submission on longer exists!");
      } else {
        this.$.toast.show("Submission deleted successfully!");
      }
      this.set("queryParams.deletetoast", undefined);
    }
  },

  /**
   * @todo  remove this once we have a modal for it
   */
  _makeProjectEditLink: function(e) {
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    var parts = local.id.split("-");
    window.location.href =
      this.basePath +
      "../node/" +
      parts[1] +
      "/edit?destination=apps/lrnapp-studio-kanban";
  },

  /**
   * @todo  remove this once we have a modal for it
   */
  _makeAssignmentEditLink: function(e) {
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    var parts = local.id.split("-");
    window.location.href =
      this.basePath +
      "../node/" +
      parts[2] +
      "/edit?destination=apps/lrnapp-studio-kanban";
  },

  /**
   * Handle the push to delete a project, pop up the modal.
   */
  _deleteProjectDialog: function(e) {
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    var parts = local.id.split("-");
    // set values so we know what to drop
    this.projectToDelete = parts[1];
    this._deleteTitle = "Delete project";
    this._deleteText =
      "Are you sure you want to delete this project and all related assignments!?";
    this._deleteType = "project";
    this.$.delete.open();
  },

  /**
   * Handle the call to delete the assignment specified.
   */
  _handleDelete: function() {
    if (this._deleteType == "project") {
      this.$.backend.method = "DELETE";
      this.$.backend.body = this.projectToDelete;
      this.$.backend.url =
        this.endPoint +
        "/api/projects/" +
        this.projectToDelete +
        "?token=" +
        this.csrfToken;
      this.$.backend.generateRequest();
    } else if (this._deleteType == "assignment") {
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

  /**
   * Handle the push to delete an assignment, pop up the modal.
   */
  _deleteAssignmentDialog: function(e) {
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    var parts = local.id.split("-");
    this.assignmentToDelete = parts[2];
    // set values so we know what to drop
    this._deleteTitle = "Delete assignment";
    this._deleteText = "Are you sure you want to delete this assignment?";
    this._deleteType = "assignment";
    this.$.delete.open();
  },

  /**
   * if we should show new badge based on new comment count.
   */
  displayNewBadge: function(count) {
    if (count == 0) {
      return true;
    }
    return false;
  },

  /**
   * Handle toggling the status for the submission.
   */
  statusToggle: function(e) {
    // find our xhr for callbacks
    var xhr = this.$.backend;
    // break the id out into project and assignment
    var parts = this.activeAssignment.split("-");
    // focus in on the submissions / assignment meta
    var submission = this.projectResponse.data.projects["project-" + parts[1]]
      .relationships.assignments["assignment-" + parts[2]].meta
      .relatedSubmissions.complete;
    // ensure this isn't disabled though it shouldn't be possible
    if (
      !this.shadowRoot.querySelector("#" + this.activeAssignment + "-toggle")
        .disabled
    ) {
      // hide the loading screen
      this.$.loading.hidden = false;
      // queue of the request parameters
      xhr.params = {
        submissionid: submission.submission.id,
        status: this.shadowRoot.querySelector(
          "#" + this.activeAssignment + "-toggle"
        ).checked
      };
      // send the request
      xhr.generateRequest();
    }
  },

  /**
   * Handle toggle for mouse class and manage classList array for paper-button.
   */
  assignmentFocusIn: function(e) {
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    if (this.activeAssignment != null && this.activeAssignment != local.id) {
      this.shadowRoot
        .querySelector("#" + this.activeAssignment)
        .nextElementSibling.classList.remove("show");
      this.shadowRoot
        .querySelector("#" + this.activeAssignment)
        .classList.remove("active");
    }
    this.activeAssignment = local.id;
    this._setToggle(false);
    local.nextElementSibling.classList.add("show");
    local.classList.add("active");
  },

  /**
   * Handle response for the whole projects object.
   */
  _handleProjectResponse: function(event) {
    this.$.loading.hidden = true;
    this._setToggle(true);
  },

  /**
   * buildSubmissionPath for generating a new submission or linking to existing.
   */
  buildSubmissionPath: function(path) {
    return path + "lrnapp-studio-submission";
  },

  /**
   * Handle a response from updating an item
   */
  _handleUpdateResponse: function(event) {
    if (this.backendResponse.status == 200) {
      this.$.toast.text = "Updated successfully";
      this.$.toast.toggle();
      this.$.projectbackend.generateRequest();
    } else {
      // this would imply an error
      this.$.loading.hidden = true;
    }
  },

  /**
   * set the toggle state when assignment gets focus
   */
  _setToggle: function(update) {
    if (this.activeAssignment != null) {
      var parts = this.activeAssignment.split("-");
      // focus in on the submissions / assignment meta
      var submission = this.projectResponse.data.projects["project-" + parts[1]]
        .relationships.assignments["assignment-" + parts[2]].meta
        .relatedSubmissions.complete;
      // not finished but also not started
      if (submission.status == 0 && submission.submission.length == 0) {
        if (!update) {
          this.shadowRoot.querySelector(
            "#" + this.activeAssignment + "-toggle"
          ).disabled = true;
          this.shadowRoot.querySelector(
            "#" + this.activeAssignment + "-toggle"
          ).checked = false;
        }
        this.shadowRoot.querySelector(
          "#" + this.activeAssignment + "-toggle"
        ).title = "Submission not started";
        this.shadowRoot.querySelector(
          "#" + this.activeAssignment + "-toggle-text"
        ).textContent = "Submission not started";
      } else if (submission.status == 0) {
        if (!update) {
          this.shadowRoot.querySelector(
            "#" + this.activeAssignment + "-toggle"
          ).disabled = false;
          this.shadowRoot.querySelector(
            "#" + this.activeAssignment + "-toggle"
          ).checked = false;
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
          ).disabled = false;
          this.shadowRoot.querySelector(
            "#" + this.activeAssignment + "-toggle"
          ).checked = true;
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

  /**
   * Event came from the project button to indicate it was successful.
   */
  _handleProjectCreated: function(e) {
    this.$.toast.text = "Project added";
    this.$.toast.toggle();
    this.$.projectbackend.generateRequest();
  },

  /**
   * Event came from the assignment button to indicate it was successful.
   */
  _handleAssignmentCreated: function(e) {
    this.$.toast.text = "Assignment added";
    this.$.toast.toggle();
    this.$.projectbackend.generateRequest();
  },

  /*
   * Simple way to convert from object to array.
   */
  _toArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
});
