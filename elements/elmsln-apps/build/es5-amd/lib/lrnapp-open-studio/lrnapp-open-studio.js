define([
  "../../node_modules/@polymer/polymer/polymer-legacy.js",
  "../../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../../node_modules/@polymer/iron-ajax/iron-ajax.js",
  "../../node_modules/@polymer/iron-list/iron-list.js",
  "../../node_modules/@polymer/iron-pages/iron-pages.js",
  "../../node_modules/@polymer/iron-selector/iron-selector.js",
  "../../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js",
  "../../node_modules/@polymer/app-route/app-location.js",
  "../../node_modules/@polymer/app-route/app-route.js",
  "../../node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js",
  "../../node_modules/@polymer/paper-listbox/paper-listbox.js",
  "../../node_modules/@polymer/paper-item/paper-item.js",
  "../../node_modules/@polymer/paper-toast/paper-toast.js",
  "../../node_modules/@lrnwebcomponents/lrndesign-gallerycard/lrndesign-gallerycard.js",
  "../../node_modules/@lrnwebcomponents/elmsln-loading/elmsln-loading.js",
  "./lrnapp-open-studio-table.js",
  "./lrnapp-open-studio-projects.js",
  "./lrnapp-open-studio-assignments.js"
], function(
  _polymerLegacy,
  _polymerDom,
  _ironAjax,
  _ironList,
  _ironPages,
  _ironSelector,
  _appToolbar,
  _appLocation,
  _appRoute,
  _paperDropdownMenu,
  _paperListbox,
  _paperItem,
  _paperToast,
  _lrndesignGallerycard,
  _elmslnLoading,
  _lrnappOpenStudioTable,
  _lrnappOpenStudioProjects,
  _lrnappOpenStudioAssignments
) {
  "use strict";
  function _templateObject_50c27fa0f76d11e89310d7f0fbc64afe() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style include="materializecss-styles">\n      :host {\n        display: block;\n        align-content: center;\n      }\n      #loading {\n        width: 100%;\n        z-index: 1000;\n        opacity: 0.8;\n        text-align: center;\n        align-content: center;\n        justify-content: center;\n        height: 100vh;\n        position: absolute;\n        background-color: white;\n      }\n      iron-selector {\n        line-height: 1em;\n      }\n      iron-selector lrnsys-button {\n        display: inline-flex;\n      }\n      paper-button.gallerycard-wrapper {\n        margin: 0;\n        padding: 0;\n      }\n      lrndesign-gallerycard {\n        padding: 0;\n        margin: 1em;\n        height: 15em;\n        width: 14em;\n      }\n      .gallery-grid {\n        margin: 0 auto;\n        width: 95%;\n      }\n      .iron-selected .display-mode {\n        background-color: #ff6f00;\n        color: white;\n      }\n      .iron-list-container {\n        display: flex;\n        flex-direction: column;\n        min-height: 50vh;\n      }\n      iron-list {\n        flex: 1 1 auto;\n      }\n    </style>\n    <iron-ajax\n      auto\n      url="[[sourcePath]]"\n      params=""\n      handle-as="json"\n      last-response="{{studioResponse}}"\n      on-response="_handleResponse"\n    ></iron-ajax>\n\n    <app-location\n      route="{{route}}"\n      query-params="{{queryParams}}"\n    ></app-location>\n    <app-route\n      route="{{route}}"\n      pattern="[[endPoint]]/:page"\n      data="{{data}}"\n      tail="{{tail}}"\n      query-params="{{queryParams}}"\n    >\n    </app-route>\n\n    <div id="loading">\n      <h3>Loading..</h3>\n      <elmsln-loading color="grey-text" size="large"></elmsln-loading>\n    </div>\n    <app-toolbar class="amber lighten-3">\n      <iron-selector\n        selected="{{data.page}}"\n        attr-for-selected="name"\n        role="navigation"\n      >\n        <a tabindex="-1" name="submissions" on-tap="_submissionsClicked"\n          ><lrnsys-button\n            icon="apps"\n            label="Submission display"\n            hover-class="amber darken-4 white-text"\n            class="display-mode"\n            button-class="display-mode style-scope lrnapp-open-studio x-scope lrnsys-button-0"\n          ></lrnsys-button\n        ></a>\n        <a tabindex="-1" name="projects" on-tap="_projectsClicked"\n          ><lrnsys-button\n            icon="folder"\n            label="Project board"\n            hover-class="amber darken-4 white-text"\n            class="display-mode"\n            button-class="display-mode style-scope lrnapp-open-studio x-scope lrnsys-button-0"\n          ></lrnsys-button\n        ></a>\n        <a tabindex="-1" name="assignments" on-tap="_assignmentsClicked"\n          ><lrnsys-button\n            icon="list"\n            label="Assignment centric"\n            hover-class="amber darken-4 white-text"\n            class="display-mode"\n            button-class="display-mode style-scope lrnapp-open-studio x-scope lrnsys-button-0"\n          ></lrnsys-button\n        ></a>\n        <a tabindex="-1" name="table" on-tap="_tableClicked"\n          ><lrnsys-button\n            icon="view-list"\n            label="Table view"\n            hover-class="amber darken-4 white-text"\n            class="display-mode"\n            button-class="display-mode style-scope lrnapp-open-studio x-scope lrnsys-button-0"\n          ></lrnsys-button\n        ></a>\n      </iron-selector>\n      <span main-title></span>\n      <span top-item style="text-align:right;font-size:.5em;padding-right:1em;"\n        >Displaying [[submissions.length]] of\n        [[originalSubmissions.length]]</span\n      >\n      <paper-dropdown-menu label="Author" hidden$="[[!authors]]">\n        <paper-listbox\n          slot="dropdown-content"\n          class="dropdown-content"\n          selected="{{queryParams.author}}"\n          attr-for-selected="item-id"\n        >\n          <paper-item></paper-item>\n          <template is="dom-repeat" items="[[_toArray(authors)]]" as="author">\n            <paper-item item-id="[[author.id]]"\n              >[[author.display_name]]</paper-item\n            >\n          </template>\n        </paper-listbox>\n      </paper-dropdown-menu>\n      <paper-dropdown-menu label="Project" hidden$="[[!projects]]">\n        <paper-listbox\n          slot="dropdown-content"\n          class="dropdown-content"\n          selected="{{queryParams.project}}"\n          attr-for-selected="item-id"\n        >\n          <paper-item></paper-item>\n          <template is="dom-repeat" items="[[_toArray(projects)]]" as="project">\n            <paper-item item-id="[[project.id]]"\n              >[[project.attributes.title]]</paper-item\n            >\n          </template>\n        </paper-listbox>\n      </paper-dropdown-menu>\n      <paper-dropdown-menu label="Assignment" hidden$="[[!assignments]]">\n        <paper-listbox\n          slot="dropdown-content"\n          class="dropdown-content"\n          selected="{{queryParams.assignment}}"\n          attr-for-selected="item-id"\n        >\n          <paper-item></paper-item>\n          <template\n            is="dom-repeat"\n            items="[[_toArray(assignments)]]"\n            as="assignment"\n          >\n            <paper-item item-id="[[assignment.id]]"\n              >[[assignment.attributes.title]]</paper-item\n            >\n          </template>\n        </paper-listbox>\n      </paper-dropdown-menu>\n    </app-toolbar>\n    <div class="gallery-grid">\n      <iron-pages\n        selected="{{data.page}}"\n        attr-for-selected="name"\n        fallback-selection="submissions"\n        role="main"\n      >\n        <div class="iron-list-container" name="submissions">\n          <iron-list id="ironlist" items="[[submissions]]" as="item" grid>\n            <template>\n              <paper-button\n                data-submission-id$="[[item.id]]"\n                class="gallerycard-wrapper"\n                on-tap="_loadSubmissionUrl"\n              >\n                <lrndesign-gallerycard\n                  elevation="2"\n                  data-submission-id$="[[item.id]]"\n                  title="[[item.attributes.title]]"\n                  author="[[item.relationships.author.data]]"\n                  comments="[[item.meta.comment_count]]"\n                  image="[[item.display.image]]"\n                  icon="[[item.display.icon]]"\n                  date="[[item.meta.humandate]]"\n                  class="ferpa-protect"\n                >\n                </lrndesign-gallerycard>\n              </paper-button>\n            </template>\n          </iron-list>\n        </div>\n        <lrnapp-open-studio-assignments\n          name="assignments"\n          base-path="[[basePath]]"\n          submissions="[[submissions]]"\n          assignments="[[assignments]]"\n          active-author-id="[[queryParams.author]]"\n          active-assignment-id="[[queryParams.assignment]]"\n        ></lrnapp-open-studio-assignments>\n        <lrnapp-open-studio-projects\n          name="projects"\n          base-path="[[basePath]]"\n          projects="[[projects]]"\n          submissions="[[submissions]]"\n          assignments="[[assignments]]"\n          active-author-id="[[queryParams.author]]"\n          active-project-id="[[queryParams.project]]"\n        ></lrnapp-open-studio-projects>\n        <lrnapp-open-studio-table\n          name="table"\n          base-path="[[basePath]]"\n          submissions="{{submissions}}"\n        ></lrnapp-open-studio-table>\n      </iron-pages>\n    </div>\n    <paper-toast id="toast"></paper-toast>\n  '
    ]);
    _templateObject_50c27fa0f76d11e89310d7f0fbc64afe = function _templateObject_50c27fa0f76d11e89310d7f0fbc64afe() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_50c27fa0f76d11e89310d7f0fbc64afe()
    ),
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
    _routeChanged: function _routeChanged(route, endPoint) {
      if ("string" === typeof route.path) {
        if ("string" === typeof endPoint) {
          if (route.path.startsWith(endPoint)) {
            return;
          }
        }
        window.location.reload();
      }
    },
    _routeChange: function _routeChange(e) {
      var details = e.detail;
      if (
        babelHelpers.typeof(details.queryParams.assignment) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        this.set("queryParams.assignment", details.queryParams.assignment);
      }
      if (
        babelHelpers.typeof(details.queryParams.project) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        this.set("queryParams.project", details.queryParams.project);
      }
      if (
        babelHelpers.typeof(details.queryParams.author) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        this.set("queryParams.author", details.queryParams.author);
      }
      if (
        babelHelpers.typeof(details.data.page) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        this.set("data.page", details.data.page);
      }
    },
    _submissionsCompute: function _submissionsCompute(
      originalSubmissions,
      queryParams
    ) {
      var _this = this;
      if ("undefined" === typeof originalSubmissions) {
        return [];
      }
      var root = this,
        filteredSubmissions = [];
      filteredSubmissions = originalSubmissions.filter(function(submission) {
        if ("undefined" !== typeof root.queryParams.author) {
          if (
            submission.relationships.author.data.id !== root.queryParams.author
          ) {
            return !1;
          }
        }
        if ("undefined" !== typeof root.queryParams.project) {
          if (
            submission.relationships.project.data.id !==
            root.queryParams.project
          ) {
            return !1;
          }
        }
        if ("undefined" !== typeof root.queryParams.assignment) {
          if (
            submission.relationships.assignment.id !==
            root.queryParams.assignment
          ) {
            return !1;
          }
        }
        return !0;
      });
      setTimeout(function() {
        _this.$.ironlist.fire("iron-resize");
      }, 200);
      return filteredSubmissions;
    },
    _deleteToast: function _deleteToast(deletetoast, old) {
      if (
        babelHelpers.typeof(deletetoast) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        if ("error" == deletetoast) {
          this.$.toast.show("That submission on longer exists!");
        } else {
          this.$.toast.show("Submission deleted successfully!");
        }
        this.set("queryParams.deletetoast", void 0);
        this.notifyPath("queryParams.deletetoast");
      }
    },
    _assignmentFilterChanged: function _assignmentFilterChanged(assignment) {
      if (
        babelHelpers.typeof(assignment) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        !this._blockcycle
      ) {
        this._blockcycle = !0;
        this.set("queryParams.project", void 0);
        this.notifyPath("queryParams.project");
        this.set("queryParams.assignment", assignment);
        this.notifyPath("queryParams.assignment");
      } else {
        this._blockcycle = !1;
      }
    },
    _projectFilterChanged: function _projectFilterChanged(project) {
      if (
        babelHelpers.typeof(project) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        !this._blockcycle
      ) {
        this._blockcycle = !0;
        this.set("queryParams.project", project);
        this.notifyPath("queryParams.project");
        this.set("queryParams.assignment", void 0);
        this.notifyPath("queryParams.assignment");
      } else {
        this._blockcycle = !1;
      }
    },
    _loadSubmissionUrl: function _loadSubmissionUrl(e) {
      var root = this,
        normalizedEvent = (0, _polymerDom.dom)(e),
        local = normalizedEvent.localTarget,
        active = local.getAttribute("data-submission-id");
      window.location.href =
        this.basePath + "lrnapp-studio-submission/submissions/" + active;
    },
    _handleResponse: function _handleResponse(event) {
      var root = this,
        author = {},
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
    _submissionsClicked: function _submissionsClicked(e) {
      this.set("route.path", this.endPoint + "/submissions");
      this.notifyPath("route.path");
    },
    _projectsClicked: function _projectsClicked(e) {
      this.set("route.path", this.endPoint + "/projects");
      this.notifyPath("route.path");
    },
    _assignmentsClicked: function _assignmentsClicked(e) {
      this.set("route.path", this.endPoint + "/assignments");
      this.notifyPath("route.path");
    },
    _tableClicked: function _tableClicked(e) {
      this.set("route.path", this.endPoint + "/table");
      this.notifyPath("route.path");
    },
    _toArray: function _toArray(obj) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    }
  });
});
