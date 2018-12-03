<link rel="import" href="../../bower_components/polymer/polymer.html">
<link rel="import" href="../../bower_components/lrndesign-gallerycard/lrndesign-gallerycard.html">
<link rel="import" href="../../bower_components/elmsln-loading/elmsln-loading.html">
<link rel="import" href="../../bower_components/iron-ajax/iron-ajax.html">
<link rel="import" href="../../bower_components/iron-list/iron-list.html">
<link rel="import" href="../../bower_components/iron-pages/iron-pages.html">
<link rel="import" href="../../bower_components/iron-selector/iron-selector.html">
<link rel="import" href="../../bower_components/app-layout/app-toolbar/app-toolbar.html">
<link rel="import" href="../../bower_components/app-route/app-location.html">
<link rel="import" href="../../bower_components/app-route/app-route.html">
<link rel="import" href="../../bower_components/paper-dropdown-menu/paper-dropdown-menu.html">
<link rel="import" href="../../bower_components/paper-listbox/paper-listbox.html">
<link rel="import" href="../../bower_components/paper-item/paper-item.html">
<link rel="import" href="../../bower_components/paper-toast/paper-toast.html">
<script type="module" src="./lrnapp-open-studio-table.js"></script>
<script type="module" src="./lrnapp-open-studio-projects.js"></script>
<script type="module" src="./lrnapp-open-studio-assignments.js"></script>

<dom-module id="lrnapp-open-studio">
  <template>
    <style include="materializecss-styles">
      :host {
        display: block;
        align-content: center;
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
        min-height:50vh;
      }
      iron-list {
        flex: 1 1 auto;
      }
    </style>
    <iron-ajax auto
      url="[[sourcePath]]"
      params=''
      handle-as="json"
      last-response="{{studioResponse}}"
      on-response="_handleResponse"></iron-ajax>

    <app-location route="{{route}}" query-params="{{queryParams}}"></app-location>
    <app-route
        route="{{route}}"
        pattern="[[endPoint]]/:page"
        data="{{data}}"
        tail="{{tail}}"
        query-params="{{queryParams}}">
    </app-route>

    <div id="loading">
      <h3>Loading..</h3>
      <elmsln-loading color="grey-text" size="large"></elmsln-loading>
    </div>
    <app-toolbar class="amber lighten-3">
      <iron-selector selected="{{data.page}}" attr-for-selected="name" role="navigation">
        <a tabindex="-1" name="submissions" on-tap="_submissionsClicked"><lrnsys-button icon="apps" label="Submission display" hover-class="amber darken-4 white-text" class="display-mode" button-class="display-mode style-scope lrnapp-open-studio x-scope lrnsys-button-0"></lrnsys-button></a>
        <a tabindex="-1" name="projects" on-tap="_projectsClicked"><lrnsys-button icon="folder" label="Project board" hover-class="amber darken-4 white-text" class="display-mode" button-class="display-mode style-scope lrnapp-open-studio x-scope lrnsys-button-0"></lrnsys-button></a>
        <a tabindex="-1" name="assignments" on-tap="_assignmentsClicked"><lrnsys-button icon="list" label="Assignment centric" hover-class="amber darken-4 white-text" class="display-mode" button-class="display-mode style-scope lrnapp-open-studio x-scope lrnsys-button-0"></lrnsys-button></a>
        <a tabindex="-1" name="table" on-tap="_tableClicked"><lrnsys-button icon="view-list" label="Table view" hover-class="amber darken-4 white-text" class="display-mode" button-class="display-mode style-scope lrnapp-open-studio x-scope lrnsys-button-0"></lrnsys-button></a>
      </iron-selector>
      <span main-title></span>
      <span top-item style="text-align:right;font-size:.5em;padding-right:1em;">Displaying [[submissions.length]] of [[originalSubmissions.length]]</span>
      <paper-dropdown-menu label="Author" hidden$="[[!authors]]">
        <paper-listbox slot="dropdown-content" class="dropdown-content" selected="{{queryParams.author}}" attr-for-selected="item-id">
          <paper-item></paper-item>
          <template is="dom-repeat" items="[[_toArray(authors)]]" as="author">
          <paper-item item-id="[[author.id]]">[[author.display_name]]</paper-item>
          </template>
        </paper-listbox>
      </paper-dropdown-menu>
      <paper-dropdown-menu label="Project" hidden$="[[!projects]]">
        <paper-listbox slot="dropdown-content" class="dropdown-content" selected="{{queryParams.project}}" attr-for-selected="item-id">
          <paper-item></paper-item>
        <template is="dom-repeat" items="[[_toArray(projects)]]" as="project">
          <paper-item item-id="[[project.id]]">[[project.attributes.title]]</paper-item>
        </template>
        </paper-listbox>
      </paper-dropdown-menu>
      <paper-dropdown-menu label="Assignment" hidden$="[[!assignments]]">
        <paper-listbox slot="dropdown-content" class="dropdown-content" selected="{{queryParams.assignment}}" attr-for-selected="item-id">
          <paper-item></paper-item>
        <template is="dom-repeat" items="[[_toArray(assignments)]]" as="assignment">
          <paper-item item-id="[[assignment.id]]">[[assignment.attributes.title]]</paper-item>
        </template>
        </paper-listbox>
      </paper-dropdown-menu>
    </app-toolbar>
    <div class="gallery-grid">
    <iron-pages
      selected="{{data.page}}"
      attr-for-selected="name"
      fallback-selection="submissions"
      role="main">
      <div class="iron-list-container" name="submissions">
        <iron-list items="[[submissions]]" as="item" grid>
          <template>
          <paper-button data-submission-id$="[[item.id]]" class="gallerycard-wrapper" on-tap="_loadSubmissionUrl">
            <lrndesign-gallerycard elevation="2" data-submission-id$="[[item.id]]" title="[[item.attributes.title]]" author="[[item.relationships.author.data]]" comments="[[item.meta.comment_count]]" image="[[item.display.image]]" icon="[[item.display.icon]]" date="[[item.meta.humandate]]" class="ferpa-protect">
            </lrndesign-gallerycard>
          </paper-button>
          </template>
        </iron-list>
      </div>
      <lrnapp-open-studio-assignments name="assignments" base-path="[[basePath]]" submissions="[[submissions]]" assignments="[[assignments]]" active-author-id="[[queryParams.author]]" active-assignment-id="[[queryParams.assignment]]"></lrnapp-open-studio-assignments>
      <lrnapp-open-studio-projects name="projects" base-path="[[basePath]]" projects="[[projects]]" submissions="[[submissions]]" assignments="[[assignments]]" active-author-id="[[queryParams.author]]" active-project-id="[[queryParams.project]]"></lrnapp-open-studio-projects>
      <lrnapp-open-studio-table name="table" base-path="[[basePath]]" submissions="{{submissions}}"></lrnapp-open-studio-table>
    </iron-pages>
    </div>
    <paper-toast id="toast"></paper-toast>
  </template>

  <script type="module">
import './lrnapp-open-studio-table.js';
import './lrnapp-open-studio-projects.js';
import './lrnapp-open-studio-assignments.js';
Polymer({
  is: 'lrnapp-open-studio',
  properties: {
    /**
     * The studioResponse from server
     */
    studioResponse: {
      type: Object,
      notify: true,
    },
    /**
     * The submissions to render; potentially filtered
     */
    submissions: {
      type: Object,
      notify: true,
      computed: '_submissionsCompute(originalSubmissions, queryParams)'
    },
    /**
     * The original submissions array; used to filter against
     */
    originalSubmissions: {
      type: Object,
      notify: true,
    },
    /**
     * The submissions to render
     */
    projects: {
      type: Array,
      notify: true,
      value: [],
    },
    /**
     * The assignments to render
     */
    assignments: {
      type: Array,
      notify: true,
      value: [],
    },
    /**
     * The authors to render
     */
    authors: {
      type: Array,
      notify: true,
      value: [],
    },
    /**
     * sourcePath for submission data.
     */
    sourcePath: {
      type: String,
      notify: true,
    },
    /**
     * Endpoint for submission data.
     */
    endPoint: {
      type: String,
      notify: true,
    },
    /**
     * base path for the app
     */
    basePath: {
      type: String,
      notify: true,
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
      notify: true,
    },
    _blockcycle: {
      type: Boolean,
      value: false,
    },
  },
  listeners: {
    'route-change': '_routeChange',
  },
  observers: [
    '_routeChanged(route, endPoint)',
    '_deleteToast(queryParams.deletetoast)',
    '_assignmentFilterChanged(queryParams.assignment)',
    '_projectFilterChanged(queryParams.project)',
  ],
  // If the current route is outside the scope of our app
  // then allow the website to break out of the single page
  // application routing
  _routeChanged: function(route, endPoint) {
    if (typeof route.path === 'string') {
      if (typeof endPoint === 'string') {
        if (route.path.startsWith(endPoint)) {
          return;
        }
      }
      // reload the page which since route changed will load that page
      window.location.reload();
    }
  },
  /**
   * Change route from deeper in the app.
   */
  _routeChange: function(e) {
    var details = e.detail;
    if (typeof details.queryParams.assignment !== typeof undefined) {
      this.set('queryParams.assignment', details.queryParams.assignment);
    }
    if (typeof details.queryParams.project !== typeof undefined) {
      this.set('queryParams.project', details.queryParams.project);
    }
    if (typeof details.queryParams.author !== typeof undefined) {
      this.set('queryParams.author', details.queryParams.author);
    }
    if (typeof details.data.page !== typeof undefined) {
      this.set('data.page', details.data.page);
    }
  },
  _submissionsCompute: function (originalSubmissions, queryParams) {
    // if we don't have an original submissions object to work with then we need to bail
    if (typeof originalSubmissions === 'undefined') {
      return [];
    }
    // define vars
    const root = this;
    let filteredSubmissions = [];
    // filter the submissions by the query params
    filteredSubmissions = originalSubmissions.filter(submission => {
      if (typeof root.queryParams.author !== 'undefined') {
        if (submission.relationships.author.data.id !== root.queryParams.author) {
          return false;
        }
      }
      if (typeof root.queryParams.project !== 'undefined') {
        if (submission.relationships.project.data.id !== root.queryParams.project) {
          return false;
        }
      }
      if (typeof root.queryParams.assignment !== 'undefined') {
        if (submission.relationships.assignment.id !== root.queryParams.assignment) {
          return false;
        }
      }
      return true;
    });
    // delay and repaint, can help with refresh issues
    (setTimeout(() => {
        document.querySelector('iron-list').fire('iron-resize');
      }, 200));
    return filteredSubmissions;
  },
  /**
   * Support having a toast message because of delete or error elsewhere.
   */
  _deleteToast: function (deletetoast, old) {
    if (typeof deletetoast !== typeof undefined) {
      if (deletetoast == 'error') {
        this.$.toast.show('That submission on longer exists!');
      }
      else {
        this.$.toast.show('Submission deleted successfully!');
      }
      this.set('queryParams.deletetoast', undefined);
    }
  },
  _assignmentFilterChanged: function (assignment) {
    // if we have a assignment then we need to uncheck project
    if (typeof assignment !== typeof undefined && !this._blockcycle) {
      this._blockcycle = true;
      this.set('queryParams.project', undefined);
      this.set('queryParams.assignment', assignment);
    }
    else {
      this._blockcycle = false;
    }
  },
  _projectFilterChanged: function (project) {
    // if we have a project then we need to uncheck assignment
    if (typeof project !== typeof undefined && !this._blockcycle) {
      this._blockcycle = true;
      this.set('queryParams.project', project);
      this.set('queryParams.assignment', undefined);
    }
    else {
      this._blockcycle = false;
    }
  },
  /**
   * Handle tap on paper-button above to redirect to the correct submission url.
   */
  _loadSubmissionUrl: function(e) {
    let root = this;
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    // this will have the id of the current submission
    var active = local.getAttribute('data-submission-id');
    // @todo need a cleaner integration but this at least goes the right place for now
    window.location.href = this.basePath + 'lrnapp-studio-submission/submissions/' + active;
  },
  /**
   * Handle response for the whole projects object.
   */
  _handleResponse: function(event) {
    let root = this;
    var author = {};
    var project = {};
    var tmp = {
      "authors": [],
      "assignments": [],
    };
    var assignment = {};
    var assignments = [];
    var authors = [];
    // get the submission response's data and convert to array ahead of time
    var submissions = this._toArray(root.studioResponse.data.submissions);
    var projects = this._toArray(root.studioResponse.data.projects);
    this.set('projects', projects);
    // original = active off the bat then we apply filters later to chang this
    this.set('originalSubmissions', submissions);
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
    root.$.loading.hidden = true;
    this.set('assignments', assignments);
    this.set('authors', authors);
  },
  _submissionsClicked: function (e) {
    this.set('route.path', this.endPoint + '/submissions');
  },
  _projectsClicked: function (e) {
    this.set('route.path', this.endPoint + '/projects');
  },
  _assignmentsClicked: function (e) {
    this.set('route.path', this.endPoint + '/assignments');
  },
  _tableClicked: function (e) {
    this.set('route.path', this.endPoint + '/table');
  },
  /**
   * Simple way to convert from object to array.
   */
  _toArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
});
</script>
</dom-module>