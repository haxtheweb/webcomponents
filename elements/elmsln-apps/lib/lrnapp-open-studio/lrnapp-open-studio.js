import { LitElement, html, css } from "lit-element/lit-element.js";

import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/iron-list/iron-list.js";
import "@polymer/iron-pages/iron-pages.js";
import "@polymer/iron-selector/iron-selector.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "@polymer/app-route/app-location.js";
import "@polymer/app-route/app-route.js";
import "@polymer/paper-dropdown-menu/paper-dropdown-menu.js";
import "@polymer/paper-listbox/paper-listbox.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/paper-toast/paper-toast.js";
import "@lrnwebcomponents/lrndesign-gallerycard/lrndesign-gallerycard.js";
import "@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
import "./lrnapp-open-studio-table.js";
import "./lrnapp-open-studio-projects.js";
import "./lrnapp-open-studio-assignments.js";
class LrnappOpenStudio extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
      
      `
    ];
  }
  render() {
    return html`
      <style>
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
        iron-selector a {
          display: inline-block;
        }
        .gallerycard-wrapper {
          margin: 0;
          padding: 0;
        }
        lrndesign-gallerycard {
          padding: 0;
          margin: 1em;
          height: 15em;
          width: 14em;
        }
        app-toolbar {
          height: 48px;
        }
        .gallery-grid {
          margin: 0 auto;
          width: 95%;
        }
        .iron-selected .display-mode {
          background-color: var(--elmsln-system-color-dark);
          color: white;
          --lrnsys-button-link-color: white;
        }
        .iron-list-container {
          display: flex;
          flex-direction: column;
          min-height: 50vh;
        }
        iron-list {
          height: 100vh;
        }
      </style>
      <iron-ajax
        auto
        url="${this.sourcePath}"
        params=""
        handle-as="json"
        last-response="{{studioResponse}}"
        @response="${this._handleResponse}"
      ></iron-ajax>

      <app-location
        route="{{route}}"
        query-params="{{queryParams}}"
      ></app-location>
      <app-route
        route="{{route}}"
        pattern="${this.endPoint}/:page"
        data="{{data}}"
        tail="{{tail}}"
        query-params="{{queryParams}}"
      >
      </app-route>

      <div id="loading">
        <h3>Loading..</h3>
        <elmsln-loading color="grey-text" size="large"></elmsln-loading>
      </div>
      <app-toolbar>
        <iron-selector
          selected="{{data.page}}"
          attr-for-selected="name"
          role="navigation"
        >
          <a tabindex="-1" name="submissions" @click="${this._submissionsClicked}"
            ><lrnsys-button
              icon="apps"
              label="Submission display"
              hover-class="amber darken-4 white-text"
              class="display-mode"
              button-class="display-mode style-scope lrnapp-open-studio x-scope lrnsys-button-0"
            ></lrnsys-button
          ></a>
          <a tabindex="-1" name="projects" @click="${this._projectsClicked}"
            ><lrnsys-button
              icon="folder"
              label="Project board"
              hover-class="amber darken-4 white-text"
              class="display-mode"
              button-class="display-mode style-scope lrnapp-open-studio x-scope lrnsys-button-0"
            ></lrnsys-button
          ></a>
          <a tabindex="-1" name="assignments" @click="${this._assignmentsClicked}"
            ><lrnsys-button
              icon="list"
              label="Assignment centric"
              hover-class="amber darken-4 white-text"
              class="display-mode"
              button-class="display-mode style-scope lrnapp-open-studio x-scope lrnsys-button-0"
            ></lrnsys-button
          ></a>
          <a tabindex="-1" name="table" @click="${this._tableClicked}"
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
        <span
          top-item
          style="text-align:right;font-size:.5em;padding-right:1em;"
          >Displaying ${this.submissions.length} of
          ${this.originalSubmissions.length}</span
        >
        <paper-dropdown-menu label="Author" ?hidden="${!this.authors}">
          <paper-listbox
            slot="dropdown-content"
            class="dropdown-content"
            selected="{{queryParams.author}}"
            attr-for-selected="item-id"
          >
            <paper-item></paper-item>
            ${this._toArray(this.authors).map( author => html`
              <paper-item item-id="${author.id}"
                >${author.display_name}</paper-item
              >
            `)}
          </paper-listbox>
        </paper-dropdown-menu>
        <paper-dropdown-menu label="Project" ?hidden="${!this.projects}">
          <paper-listbox
            slot="dropdown-content"
            class="dropdown-content"
            selected="{{queryParams.project}}"
            attr-for-selected="item-id"
          >
            <paper-item></paper-item>
            ${this._toArray(this.projects).map(project => html`
              <paper-item item-id="${project.id}"
                >${project.attributes.title}</paper-item
              >
            `)}
          </paper-listbox>
        </paper-dropdown-menu>
        <paper-dropdown-menu label="Assignment" ?hidden="${!this.assignments}">
          <paper-listbox
            slot="dropdown-content"
            class="dropdown-content"
            selected="{{queryParams.assignment}}"
            attr-for-selected="item-id"
          >
            <paper-item></paper-item>
            ${this._toArray(this.assignments).map(assignment => html`
              <paper-item item-id="${assignment.id}"
                >${assignment.attributes.title}</paper-item
              >
            `)}
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
            <iron-list
              id="ironlist"
              .items="${this.submissions}"
              as="item"
              grid
              scroll-target="document"
            >
              <template>
                <div class="gallerycard-wrapper">
                  <a
                    href="${this.basePath}lrnapp-studio-submission/submissions/[[item.id]]"
                  >
                    <lrndesign-gallerycard
                      elevation="2"
                      data-submission-id="[[item.id]]"
                      title="[[item.attributes.title]]"
                      author="[[item.relationships.author.data]]"
                      comments="[[item.meta.comment_count]]"
                      image="[[item.display.image]]"
                      icon="[[item.display.icon]]"
                      date="[[item.meta.humandate]]"
                      class="ferpa-protect"
                    ></lrndesign-gallerycard>
                  </a>
                </div>
              </template>
            </iron-list>
          </div>
          <lrnapp-open-studio-assignments
            name="assignments"
            base-path="${this.basePath}"
            .submissions="${this.submissions}"
            .assignments="${this.assignments}"
            active-author-id="${this.queryParams.author}"
            active-assignment-id="${this.queryParams.assignment}"
          ></lrnapp-open-studio-assignments>
          <lrnapp-open-studio-projects
            name="projects"
            base-path="${this.basePath}"
            .projects="${this.projects}"
            .submissions="${this.submissions}"
            .assignments="${this.assignments}"
            active-author-id="${this.queryParams.author}"
            active-project-id="${this.queryParams.project}"
          ></lrnapp-open-studio-projects>
          <lrnapp-open-studio-table
            name="table"
            base-path="${this.basePath}"
            .submissions="${this.submissions}"
          ></lrnapp-open-studio-table>
        </iron-pages>
      </div>
      <paper-toast id="toast"></paper-toast>
    `;
  }
  static get tag() {
    return "lrnapp-open-studio";
  }
  static get properties() {
    return {
      elmslnCourse: {
        type: String,
        attribute: 'elmsln-course',
      },
      elmslnSection: {
        type: String,
        attribute: 'elmsln-section',
      },
      basePath: {
        type: String,
        attribute: 'base-path',
      },
      csrfToken: {
        type: String,
        attribute: 'csrf-token',
      },
      endPoint: {
        type: String,
        attribute: 'end-point',
      },
      /**
       * The studioResponse from server
       */
      studioResponse: {
        type: Object,
        notify: true
      },
      /**
       * The submissions to render; potentially filtered
       */
      submissions: {
        type: Object,
        notify: true,
        computed: "_submissionsCompute(originalSubmissions, queryParams)"
      },
      /**
       * The original submissions array; used to filter against
       */
      originalSubmissions: {
        type: Object,
        notify: true
      },
      /**
       * The submissions to render
       */
      projects: {
        type: Array,
        notify: true,
        value: []
      },
      /**
       * The assignments to render
       */
      assignments: {
        type: Array,
        notify: true,
        value: []
      },
      /**
       * The authors to render
       */
      authors: {
        type: Array,
        notify: true,
        value: []
      },
      /**
       * sourcePath for submission data.
       */
      sourcePath: {
        type: String,
        notify: true
      },
      /**
       * Endpoint for submission data.
       */
      endPoint: {
        type: String,
        notify: true
      },
      /**
       * base path for the app
       */
      basePath: {
        type: String,
        notify: true
      },
      /**
       * Active / clicked submission.
       */
      activeSubmission: {
        type: String,
        value: null,
        notify: true
      },
      queryParams: {
        type: Object,
        notify: true
      },
      _blockcycle: {
        type: Boolean,
        value: false
      }
    };
  }
  constructor() {
    super();
    this.addEventListener("route-change", this._routeChange.bind(this));
  }
  static get observers() {
    return [
      "_routeChanged(route, endPoint)",
      "_deleteToast(queryParams.deletetoast)",
      "_assignmentFilterChanged(queryParams.assignment)",
      "_projectFilterChanged(queryParams.project)"
    ];
  }
  // If the current route is outside the scope of our app
  // then allow the website to break out of the single page
  // application routing
  _routeChanged(route, endPoint) {
    if (typeof route.path === "string") {
      if (typeof endPoint === "string") {
        if (route.path.startsWith(endPoint)) {
          return;
        }
      }
      // reload the page which since route changed will load that page
      window.location.reload();
    }
  }
  /**
   * Change route from deeper in the app.
   */
  _routeChange(e) {
    var details = e.detail;
    if (typeof details.queryParams.assignment !== typeof undefined) {
      this.set("queryParams.assignment", details.queryParams.assignment);
    }
    if (typeof details.queryParams.project !== typeof undefined) {
      this.set("queryParams.project", details.queryParams.project);
    }
    if (typeof details.queryParams.author !== typeof undefined) {
      this.set("queryParams.author", details.queryParams.author);
    }
    if (typeof details.data.page !== typeof undefined) {
      this.set("data.page", details.data.page);
    }
  }
  _submissionsCompute(originalSubmissions, queryParams) {
    // if we don't have an original submissions object to work with then we need to bail
    if (typeof originalSubmissions === "undefined") {
      return [];
    }
    // define vars
    const root = this;
    let filteredSubmissions = [];
    // filter the submissions by the query params
    filteredSubmissions = originalSubmissions.filter(submission => {
      if (typeof root.queryParams.author !== "undefined") {
        if (
          submission.relationships.author.data.id !== root.queryParams.author
        ) {
          return false;
        }
      }
      if (typeof root.queryParams.project !== "undefined") {
        if (
          submission.relationships.project.data.id !== root.queryParams.project
        ) {
          return false;
        }
      }
      if (typeof root.queryParams.assignment !== "undefined") {
        if (
          submission.relationships.assignment.id !== root.queryParams.assignment
        ) {
          return false;
        }
      }
      return true;
    });
    // delay and repaint, can help with refresh issues
    setTimeout(() => {
      this.shadowRoot.querySelector("#ironlist").fire("iron-resize");
    }, 200);
    return filteredSubmissions;
  }
  _tableClicked(e) {
    this.set("route.path", this.endPoint + "/table");
    this.notifyPath("route.path");
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
      this.set("queryParams.deletetoast", undefined);
      this.notifyPath("queryParams.deletetoast");
    }
  }
  _assignmentFilterChanged(assignment) {
    // if we have a assignment then we need to uncheck project
    if (typeof assignment !== typeof undefined && !this._blockcycle) {
      this._blockcycle = true;
      this.set("queryParams.project", undefined);
      this.notifyPath("queryParams.project");
      this.set("queryParams.assignment", assignment);
      this.notifyPath("queryParams.assignment");
    } else {
      this._blockcycle = false;
    }
  }
  _projectFilterChanged(project) {
    // if we have a project then we need to uncheck assignment
    if (typeof project !== typeof undefined && !this._blockcycle) {
      this._blockcycle = true;
      this.set("queryParams.project", project);
      this.notifyPath("queryParams.project");
      this.set("queryParams.assignment", undefined);
      this.notifyPath("queryParams.assignment");
    } else {
      this._blockcycle = false;
    }
  }
  /**
   * Handle response for the whole projects object.
   */
  _handleResponse(event) {
    let root = this;
    var author = {};
    var project = {};
    var tmp = {
      authors: [],
      assignments: []
    };
    var assignment = {};
    var assignments = [];
    var authors = [];
    // get the submission response's data and convert to array ahead of time
    var submissions = [];
    if (root.studioResponse.data.submissions != null) {
      submissions = this._toArray(root.studioResponse.data.submissions);
    }
    var projects = [];
    if (root.studioResponse.data.projects != null) {
      projects = this._toArray(root.studioResponse.data.projects);
    }
    this.projects = [...projects];
    // original = active off the bat then we apply filters later to chang this
    this.originalSubmissions = [...submissions];
    // figure out authors and assignments
    for (var index = 0; index < submissions.length; index++) {
      author = submissions[index].relationships.author.data;
      tmp.authors[author.id] = author;
      project = submissions[index].relationships.project.data;
      assignment = submissions[index].relationships.assignment;
      tmp.assignments[assignment.id] = assignment;
      tmp.assignments[assignment.id].project = project.id;
    }
    // this is stupid but we have to normalize the IDs or else dom repeats will be screwed up
    tmp.authors.forEach(function(element) {
      authors.push(element);
    });
    // this is stupid but we have to normalize the IDs or else dom repeats will be screwed up
    tmp.assignments.forEach(function(element) {
      assignments.push(element);
    });
    root.shadowRoot.querySelector("#loading").hidden = true;
    this.assignments = [...assignments];
    this.authors = [...authors];
  }
  _submissionsClicked(e) {
    this.route.path = this.endPoint + "/submissions";
    this.route = { ...this.route };
  }
  _projectsClicked(e) {
    this.route.path = this.endPoint + "/projects";
    this.route = { ...this.route };
  }
  _assignmentsClicked(e) {
    this.route.path = this.endPoint + "/assignments";
    this.route = { ...this.route };
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
window.customElements.define(LrnappOpenStudio.tag, LrnappOpenStudio);
export { LrnappOpenStudio };
