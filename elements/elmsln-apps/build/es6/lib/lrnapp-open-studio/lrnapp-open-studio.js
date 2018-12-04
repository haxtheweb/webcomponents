import {
  html,
  Polymer
} from "../../node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "../../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "../../node_modules/@polymer/iron-ajax/iron-ajax.js";
import "../../node_modules/@polymer/iron-list/iron-list.js";
import "../../node_modules/@polymer/iron-pages/iron-pages.js";
import "../../node_modules/@polymer/iron-selector/iron-selector.js";
import "../../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js";
import "../../node_modules/@polymer/app-route/app-location.js";
import "../../node_modules/@polymer/app-route/app-route.js";
import "../../node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js";
import "../../node_modules/@polymer/paper-listbox/paper-listbox.js";
import "../../node_modules/@polymer/paper-item/paper-item.js";
import "../../node_modules/@polymer/paper-toast/paper-toast.js";
import "../../node_modules/@lrnwebcomponents/lrndesign-gallerycard/lrndesign-gallerycard.js";
import "../../node_modules/@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
import "./lrnapp-open-studio-table.js";
import "./lrnapp-open-studio-projects.js";
import "./lrnapp-open-studio-assignments.js";
Polymer({
  _template: html`
    <style include="materializecss-styles">
      :host {
        display: block;
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
      iron-selector {
        line-height: 1em;
      }
      iron-selector lrnsys-button {
        display: inline-flex;
      }
      paper-button.gallerycard-wrapper {
        margin: 0;
        padding: 0;
      }
      lrndesign-gallerycard {
        padding: 0;
        margin: 1em;
        height: 15em;
        width: 14em;
      }
      .gallery-grid {
        margin: 0 auto;
        width: 95%;
      }
      .iron-selected .display-mode {
        background-color: #ff6f00;
        color: white;
      }
      .iron-list-container {
        display: flex;
        flex-direction: column;
        min-height: 50vh;
      }
      iron-list {
        flex: 1 1 auto;
      }
    </style>
    <iron-ajax
      auto
      url="[[sourcePath]]"
      params=""
      handle-as="json"
      last-response="{{studioResponse}}"
      on-response="_handleResponse"
    ></iron-ajax>

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
    <app-toolbar class="amber lighten-3">
      <iron-selector
        selected="{{data.page}}"
        attr-for-selected="name"
        role="navigation"
      >
        <a tabindex="-1" name="submissions" on-tap="_submissionsClicked"
          ><lrnsys-button
            icon="apps"
            label="Submission display"
            hover-class="amber darken-4 white-text"
            class="display-mode"
            button-class="display-mode style-scope lrnapp-open-studio x-scope lrnsys-button-0"
          ></lrnsys-button
        ></a>
        <a tabindex="-1" name="projects" on-tap="_projectsClicked"
          ><lrnsys-button
            icon="folder"
            label="Project board"
            hover-class="amber darken-4 white-text"
            class="display-mode"
            button-class="display-mode style-scope lrnapp-open-studio x-scope lrnsys-button-0"
          ></lrnsys-button
        ></a>
        <a tabindex="-1" name="assignments" on-tap="_assignmentsClicked"
          ><lrnsys-button
            icon="list"
            label="Assignment centric"
            hover-class="amber darken-4 white-text"
            class="display-mode"
            button-class="display-mode style-scope lrnapp-open-studio x-scope lrnsys-button-0"
          ></lrnsys-button
        ></a>
        <a tabindex="-1" name="table" on-tap="_tableClicked"
          ><lrnsys-button
            icon="view-list"
            label="Table view"
            hover-class="amber darken-4 white-text"
            class="display-mode"
            button-class="display-mode style-scope lrnapp-open-studio x-scope lrnsys-button-0"
          ></lrnsys-button
        ></a>
      </iron-selector>
      <span main-title></span>
      <span top-item style="text-align:right;font-size:.5em;padding-right:1em;"
        >Displaying [[submissions.length]] of
        [[originalSubmissions.length]]</span
      >
      <paper-dropdown-menu label="Author" hidden$="[[!authors]]">
        <paper-listbox
          slot="dropdown-content"
          class="dropdown-content"
          selected="{{queryParams.author}}"
          attr-for-selected="item-id"
        >
          <paper-item></paper-item>
          <template is="dom-repeat" items="[[_toArray(authors)]]" as="author">
            <paper-item item-id="[[author.id]]"
              >[[author.display_name]]</paper-item
            >
          </template>
        </paper-listbox>
      </paper-dropdown-menu>
      <paper-dropdown-menu label="Project" hidden$="[[!projects]]">
        <paper-listbox
          slot="dropdown-content"
          class="dropdown-content"
          selected="{{queryParams.project}}"
          attr-for-selected="item-id"
        >
          <paper-item></paper-item>
          <template is="dom-repeat" items="[[_toArray(projects)]]" as="project">
            <paper-item item-id="[[project.id]]"
              >[[project.attributes.title]]</paper-item
            >
          </template>
        </paper-listbox>
      </paper-dropdown-menu>
      <paper-dropdown-menu label="Assignment" hidden$="[[!assignments]]">
        <paper-listbox
          slot="dropdown-content"
          class="dropdown-content"
          selected="{{queryParams.assignment}}"
          attr-for-selected="item-id"
        >
          <paper-item></paper-item>
          <template
            is="dom-repeat"
            items="[[_toArray(assignments)]]"
            as="assignment"
          >
            <paper-item item-id="[[assignment.id]]"
              >[[assignment.attributes.title]]</paper-item
            >
          </template>
        </paper-listbox>
      </paper-dropdown-menu>
    </app-toolbar>
    <div class="gallery-grid">
      <iron-pages
        selected="{{data.page}}"
        attr-for-selected="name"
        fallback-selection="submissions"
        role="main"
      >
        <div class="iron-list-container" name="submissions">
          <iron-list id="ironlist" items="[[submissions]]" as="item" grid>
            <template>
              <paper-button
                data-submission-id$="[[item.id]]"
                class="gallerycard-wrapper"
                on-tap="_loadSubmissionUrl"
              >
                <lrndesign-gallerycard
                  elevation="2"
                  data-submission-id$="[[item.id]]"
                  title="[[item.attributes.title]]"
                  author="[[item.relationships.author.data]]"
                  comments="[[item.meta.comment_count]]"
                  image="[[item.display.image]]"
                  icon="[[item.display.icon]]"
                  date="[[item.meta.humandate]]"
                  class="ferpa-protect"
                >
                </lrndesign-gallerycard>
              </paper-button>
            </template>
          </iron-list>
        </div>
        <lrnapp-open-studio-assignments
          name="assignments"
          base-path="[[basePath]]"
          submissions="[[submissions]]"
          assignments="[[assignments]]"
          active-author-id="[[queryParams.author]]"
          active-assignment-id="[[queryParams.assignment]]"
        ></lrnapp-open-studio-assignments>
        <lrnapp-open-studio-projects
          name="projects"
          base-path="[[basePath]]"
          projects="[[projects]]"
          submissions="[[submissions]]"
          assignments="[[assignments]]"
          active-author-id="[[queryParams.author]]"
          active-project-id="[[queryParams.project]]"
        ></lrnapp-open-studio-projects>
        <lrnapp-open-studio-table
          name="table"
          base-path="[[basePath]]"
          submissions="{{submissions}}"
        ></lrnapp-open-studio-table>
      </iron-pages>
    </div>
    <paper-toast id="toast"></paper-toast>
  `,
  is: "lrnapp-open-studio",
  properties: {
    studioResponse: { type: Object, notify: !0 },
    submissions: {
      type: Object,
      notify: !0,
      computed: "_submissionsCompute(originalSubmissions, queryParams)"
    },
    originalSubmissions: { type: Object, notify: !0 },
    projects: { type: Array, notify: !0, value: [] },
    assignments: { type: Array, notify: !0, value: [] },
    authors: { type: Array, notify: !0, value: [] },
    sourcePath: { type: String, notify: !0 },
    endPoint: { type: String, notify: !0 },
    basePath: { type: String, notify: !0 },
    activeSubmission: { type: String, value: null, notify: !0 },
    queryParams: { type: Object, notify: !0 },
    _blockcycle: { type: Boolean, value: !1 }
  },
  listeners: { "route-change": "_routeChange" },
  observers: [
    "_routeChanged(route, endPoint)",
    "_deleteToast(queryParams.deletetoast)",
    "_assignmentFilterChanged(queryParams.assignment)",
    "_projectFilterChanged(queryParams.project)"
  ],
  _routeChanged: function(route, endPoint) {
    if ("string" === typeof route.path) {
      if ("string" === typeof endPoint) {
        if (route.path.startsWith(endPoint)) {
          return;
        }
      }
      window.location.reload();
    }
  },
  _routeChange: function(e) {
    var details = e.detail;
    if (typeof details.queryParams.assignment !== typeof void 0) {
      this.set("queryParams.assignment", details.queryParams.assignment);
    }
    if (typeof details.queryParams.project !== typeof void 0) {
      this.set("queryParams.project", details.queryParams.project);
    }
    if (typeof details.queryParams.author !== typeof void 0) {
      this.set("queryParams.author", details.queryParams.author);
    }
    if (typeof details.data.page !== typeof void 0) {
      this.set("data.page", details.data.page);
    }
  },
  _submissionsCompute: function(originalSubmissions, queryParams) {
    if ("undefined" === typeof originalSubmissions) {
      return [];
    }
    const root = this;
    let filteredSubmissions = [];
    filteredSubmissions = originalSubmissions.filter(submission => {
      if ("undefined" !== typeof root.queryParams.author) {
        if (
          submission.relationships.author.data.id !== root.queryParams.author
        ) {
          return !1;
        }
      }
      if ("undefined" !== typeof root.queryParams.project) {
        if (
          submission.relationships.project.data.id !== root.queryParams.project
        ) {
          return !1;
        }
      }
      if ("undefined" !== typeof root.queryParams.assignment) {
        if (
          submission.relationships.assignment.id !== root.queryParams.assignment
        ) {
          return !1;
        }
      }
      return !0;
    });
    setTimeout(() => {
      this.$.ironlist.fire("iron-resize");
    }, 200);
    return filteredSubmissions;
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
  _assignmentFilterChanged: function(assignment) {
    if (typeof assignment !== typeof void 0 && !this._blockcycle) {
      this._blockcycle = !0;
      this.set("queryParams.project", void 0);
      this.notifyPath("queryParams.project");
      this.set("queryParams.assignment", assignment);
      this.notifyPath("queryParams.assignment");
    } else {
      this._blockcycle = !1;
    }
  },
  _projectFilterChanged: function(project) {
    if (typeof project !== typeof void 0 && !this._blockcycle) {
      this._blockcycle = !0;
      this.set("queryParams.project", project);
      this.notifyPath("queryParams.project");
      this.set("queryParams.assignment", void 0);
      this.notifyPath("queryParams.assignment");
    } else {
      this._blockcycle = !1;
    }
  },
  _loadSubmissionUrl: function(e) {
    let root = this;
    var normalizedEvent = dom(e),
      local = normalizedEvent.localTarget,
      active = local.getAttribute("data-submission-id");
    window.location.href =
      this.basePath + "lrnapp-studio-submission/submissions/" + active;
  },
  _handleResponse: function(event) {
    let root = this;
    var author = {},
      project = {},
      tmp = { authors: [], assignments: [] },
      assignment = {},
      assignments = [],
      authors = [],
      submissions = this._toArray(root.studioResponse.data.submissions),
      projects = this._toArray(root.studioResponse.data.projects);
    this.set("projects", projects);
    this.set("originalSubmissions", submissions);
    for (var index = 0; index < submissions.length; index++) {
      author = submissions[index].relationships.author.data;
      tmp.authors[author.id] = author;
      project = submissions[index].relationships.project.data;
      assignment = submissions[index].relationships.assignment;
      tmp.assignments[assignment.id] = assignment;
      tmp.assignments[assignment.id].project = project.id;
    }
    tmp.authors.forEach(function(element) {
      authors.push(element);
    });
    tmp.assignments.forEach(function(element) {
      assignments.push(element);
    });
    root.$.loading.hidden = !0;
    this.set("assignments", assignments);
    this.set("authors", authors);
  },
  _submissionsClicked: function(e) {
    this.set("route.path", this.endPoint + "/submissions");
    this.notifyPath("route.path");
  },
  _projectsClicked: function(e) {
    this.set("route.path", this.endPoint + "/projects");
    this.notifyPath("route.path");
  },
  _assignmentsClicked: function(e) {
    this.set("route.path", this.endPoint + "/assignments");
    this.notifyPath("route.path");
  },
  _tableClicked: function(e) {
    this.set("route.path", this.endPoint + "/table");
    this.notifyPath("route.path");
  },
  _toArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
});
