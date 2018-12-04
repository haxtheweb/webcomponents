define([
  "../../node_modules/@polymer/polymer/polymer-legacy.js",
  "../../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "../../node_modules/@polymer/app-route/app-location.js",
  "../../node_modules/@polymer/app-route/app-route.js",
  "../../node_modules/@polymer/iron-ajax/iron-ajax.js",
  "../../node_modules/@polymer/paper-toggle-button/paper-toggle-button.js",
  "../../node_modules/@polymer/paper-item/paper-item.js",
  "../../node_modules/@polymer/paper-badge/paper-badge.js",
  "../../node_modules/@polymer/paper-button/paper-button.js",
  "../../node_modules/@polymer/paper-input/paper-input.js",
  "../../node_modules/@polymer/paper-icon-button/paper-icon-button.js",
  "../../node_modules/@polymer/paper-tooltip/paper-tooltip.js",
  "../../node_modules/@vaadin/vaadin-grid/vaadin-grid.js",
  "../../node_modules/@vaadin/vaadin-grid/vaadin-grid-filter.js",
  "../../node_modules/@vaadin/vaadin-grid/vaadin-grid-sorter.js",
  "../../node_modules/@vaadin/vaadin-grid/vaadin-grid-column-group.js",
  "../../node_modules/@vaadin/vaadin-grid/vaadin-grid-selection-column.js",
  "../../node_modules/@lrnwebcomponents/elmsln-loading/elmsln-loading.js",
  "../../node_modules/@lrnwebcomponents/lrndesign-chart/lib/lrndesign-bar.js",
  "../../node_modules/@lrnwebcomponents/lrndesign-chart/lib/lrndesign-line.js",
  "../../node_modules/@lrnwebcomponents/lrndesign-chart/lib/lrndesign-pie.js",
  "../../node_modules/@lrnwebcomponents/dropdown-select/dropdown-select.js",
  "../../node_modules/@lrnwebcomponents/lrnsys-button/lrnsys-button.js",
  "../../node_modules/@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js",
  "../../node_modules/@lrnwebcomponents/lrnsys-layout/lib/lrnsys-dialog.js",
  "./lrnapp-studio-submission.js"
], function(
  _polymerLegacy,
  _polymerDom,
  _appLocation,
  _appRoute,
  _ironAjax,
  _paperToggleButton,
  _paperItem,
  _paperBadge,
  _paperButton,
  _paperInput,
  _paperIconButton,
  _paperTooltip,
  _vaadinGrid,
  _vaadinGridFilter,
  _vaadinGridSorter,
  _vaadinGridColumnGroup,
  _vaadinGridSelectionColumn,
  _elmslnLoading,
  _lrndesignBar,
  _lrndesignLine,
  _lrndesignPie,
  _dropdownSelect,
  _lrnsysButton,
  _lrndesignAvatar,
  _lrnsysDialog,
  _lrnappStudioSubmission
) {
  "use strict";
  function _templateObject_50f94710f76d11e89310d7f0fbc64afe() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n  <style include="materializecss-styles">\n    :host {\n      display: block;\n      align-content: center;\n      padding: .8em;\n    }\n    vaadin-grid-table-body > vaadin-grid-cell-content {\n      height: unset !important;\n    }\n    lrnsys-dialog-toolbar {\n      top: 0;\n      position: sticky !important;\n      z-index: 1;\n    }\n    #loading {\n      width: 100%;\n      z-index: 1000;\n      opacity: .8;\n      text-align: center;\n      align-content: center;\n      justify-content: center;\n      height: 100vh;\n      position: absolute;\n      background-color: white;\n    }\n    .center-data {\n      text-align: center;\n    }\n    vaadin-grid#material {\n      height: 75vh;\n      font-family: Roboto, sans-serif;\n      --divider-color: rgba(0, 0, 0, var(--dark-divider-opacity));\n\n      --vaadin-grid-cell: {\n        padding: 0;\n      };\n\n      --vaadin-grid-header-cell: {\n        height: 3.5em;\n        color: rgba(0, 0, 0, var(--dark-secondary-opacity));\n        font-size: 1em;\n      };\n\n      --vaadin-grid-body-cell: {\n        height: 3em;\n        color: rgba(0, 0, 0, var(--dark-primary-opacity));\n        font-size: .8em;\n      };\n\n      --vaadin-grid-body-row-hover-cell: {\n        background-color: var(--paper-grey-200);\n      };\n\n      --vaadin-grid-body-row-selected-cell: {\n        background-color: var(--paper-grey-100);\n      };\n\n      --vaadin-grid-focused-cell: {\n        box-shadow: none;\n        font-weight: bold;\n      };\n    }\n\n    vaadin-grid#material .cell {\n      overflow: hidden;\n      text-overflow: ellipsis;\n      padding-right: 56px;\n    }\n\n    vaadin-grid#material .cell.last {\n      padding-right: 24px;\n    }\n\n    vaadin-grid#material .cell.numeric {\n      text-align: right;\n    }\n\n    vaadin-grid#material paper-checkbox {\n      --primary-color: var(--paper-indigo-500);\n      margin: 0 24px;\n    }\n\n    vaadin-grid#material vaadin-grid-sorter .cell {\n      flex: 1;\n      display: flex;\n      justify-content: space-between;\n      align-items: center;\n    }\n\n    vaadin-grid#material vaadin-grid-sorter iron-icon {\n      transform: scale(0.8);\n    }\n\n    vaadin-grid#material vaadin-grid-sorter:not([direction]) iron-icon {\n      color: rgba(0, 0, 0, var(--dark-disabled-opacity));\n    }\n\n    vaadin-grid#material vaadin-grid-sorter[direction] {\n      color: rgba(0, 0, 0, var(--dark-primary-opacity));\n    }\n\n    vaadin-grid#material vaadin-grid-sorter[direction=desc] iron-icon {\n      transform: scale(0.8) rotate(180deg);\n    }\n    vaadin-grid-sorter {\n      text-align: center;\n    }\n\n    lrndesign-avatar {\n      display: inline-block;\n    }\n    .avatar-label {\n      display: inline-block;\n      margin-left: .2em;\n    }\n\n    .avatar-button {\n\n    }\n    .assignment-button {\n      height: 1em;\n    }\n    .project-button {\n      height: 1em;\n    }\n    paper-badge {\n      top: 0 !important;\n      left: unset !important;\n      right: 0;\n      z-index: 1;\n    }\n    .avatar-link {\n      color: black;\n    }\n    .avatar-link paper-button {\n      text-transform: unset;\n    }\n    #selectedproject {\n      display: inline-block;\n    }\n    #datatype {\n      display: inline-block;\n      vertical-align: middle;\n      --paper-toggle-button-checked-bar-color:  var(--paper-green-500);\n      --paper-toggle-button-checked-button-color:  var(--paper-green-500);\n      --paper-toggle-button-checked-ink-color: var(--paper-green-500);\n      --paper-toggle-button-unchecked-bar-color:  var(--paper-amber-900);\n      --paper-toggle-button-unchecked-button-color:  var(--paper-amber-900);\n      --paper-toggle-button-unchecked-ink-color: var(--paper-amber-900);\n    }\n    .comment-list {\n      list-style-image: none;\n      display: inline-block;\n      padding: 0;\n      margin: 0;\n    }\n    .stats-text {\n      font-size: .8em;\n      font-style: italic;\n      line-height: 1em;\n      padding: 0 0 0 2em;\n      display: inline-block;\n      text-align: right;\n    }\n  </style>\n  <app-location route="{{route}}"></app-location>\n  <app-route\n      route="{{route}}"\n      pattern="[[endPoint]]/submissions/:submission"\n      data="{{data}}"\n      tail="{{tail}}">\n  </app-route>\n  <iron-ajax auto\n    id="projectrequest"\n    url="[[sourceProjectPath]]"\n    params=""\n    handle-as="json"\n    last-response="{{_projectData}}"\n    on-response="_handleProjectResponse"></iron-ajax>\n  <iron-ajax\n    id="studentrequest"\n    url="[[sourceStudentPath]]"\n    params=\'[[studentParams]]\'\n    handle-as="json"\n    last-response="{{_studentData}}"\n    on-response="_handleStudentResponse"></iron-ajax>\n  <div id="loading">\n    <h3>Loading..</h3>\n    <elmsln-loading color="grey-text" size="large"></elmsln-loading>\n  </div>\n  <div hidden$="[[activeProject]]">Select a project to begin reviewing work</div>\n  <dropdown-select id="selectedproject" label="Project">\n    <template is="dom-repeat" items="[[_toArray(projects)]]" as="project">\n      <paper-item value$="[[project.id]]">[[project.attributes.title]]</paper-item>\n    </template>\n  </dropdown-select>\n  <paper-toggle-button id="datatype" checked="{{dataType}}" disabled>\n    [[dataTypeText]]\n  </paper-toggle-button>\n  <lrnsys-dialog id="statsdialog" disabled>\n    <span slot="button"><iron-icon icon="editor:show-chart"></iron-icon> Statistics (beta)</span>\n    <span slot="toolbar-primary">\n      [[stats.header]]\n    </span>\n  <span slot="content">\n      <div style="padding: 2em 4em;">\n        <span class="stats-text">[[stats.overview]]</span>\n        <dropdown-select id="selectedchart" label="Graph style">\n          <paper-item value="byassignment-submissions">Submissions by Assignment</paper-item>\n          <paper-item value="byassignment-comments">Comments by Assignment</paper-item>\n          <paper-item value="byassignment-commenters">Commenters by Assignment</paper-item>\n        </dropdown-select>\n        <lrndesign-bar chart-title="[[activeChart.title]]" chart-desc="[[activeChart.description]]" data="[[activeChart.data]]"></lrndesign-bar>\n      </div>\n    </span>\n  </lrnsys-dialog>\n  <vaadin-grid hidden$="[[!students]]" id="material" aria-label="Student project list" items="[[_toArray(students)]]">\n    <vaadin-grid-column resizable>\n      <template class="header">\n        <vaadin-grid-sorter id="sorter" path="sis.sortable_name">Student</vaadin-grid-sorter>\n      </template>\n      <template>\n        <a href$="[[basePath]]lrnapp-open-studio/projects?author=[[item.id]]&project=[[activeProject]]" tabindex="-1" target="_blank" class="avatar-link ferpa-protect">\n          <paper-button class="avatar-button">\n            <lrndesign-avatar label="[[item.name]]" src="[[item.avatar]]"></lrndesign-avatar>\n            <span class="avatar-label">[[item.sis.sortable_name]]</span>\n          </paper-button>\n        </a>\n      </template>\n      <template class="footer">\n        <vaadin-grid-filter aria-label="Student" path="sis.sortable_name" value="[[_filterName]]">\n          <paper-input slot="filter" label="Student" value="{{_filterName::input}}" focus-target></paper-input>\n        </vaadin-grid-filter>\n      </template>\n    </vaadin-grid-column>\n    <template is="dom-repeat" items="[[_toArray(assignments)]]" as="assignment">\n      <vaadin-grid-column resizable>\n        <template class="header">\n          <span>[[assignment.title]]</span>\n        </template>\n        <template>\n          <template is="dom-if" if="[[_submissionStatus(item, assignment, dataType)]]">\n            <template is="dom-if" if="[[!dataType]]">\n              <lrnsys-button icon="[[_submissionPiece(item, assignment, \'icon\')]]" id$="student-[[item.id]]-assignment-[[assignment.id]]-submission-[[_submissionID(item, assignment)]]" label="[[_submissionPiece(item, assignment, \'title\')]]" on-tap="_setActiveSubmission">\n              </lrnsys-button>\n            </template>\n            <template is="dom-if" if="[[dataType]]">\n              <ul class="comment-list">\n              <template is="dom-repeat" items="[[_submissionPiece(item, assignment, \'comments\')]]" as="commented">\n                <li>\n                  <lrnsys-button icon="communication:comment" id$="student-[[item.id]]-assignment-[[assignment.id]]-submission-[[commented]]" label="#[[_commentIndex(index)]]" on-tap="_setActiveComment">\n                  </lrnsys-button>\n                </li>\n              </template>\n              </ul>\n            </template>\n          </template>\n          <template is="dom-if" if="[[!_submissionStatus(item, assignment, dataType)]]">\n            <paper-button disabled class="project-button" id$="student-[[item.id]]-assignment-[[assignment.id]]-submission-null">X</paper-button>\n          </template>\n          <template is="dom-if" if="[[_commentCount(item, assignment, dataType)]]">\n            <paper-badge id$="student-[[item.id]]-assignment-[[assignment.id]]-tip" for="student-[[item.id]]-assignment-[[assignment.id]]" label="[[_commentCount(item, assignment, dataType)]]"></paper-badge>\n            <paper-tooltip for="student-[[item.id]]-assignment-[[assignment.id]]-tip">Comments left on classmates [[assignment.title]]</paper-badge>\n          </template>\n        </template>\n      </vaadin-grid-column>\n    </template>\n  </vaadin-grid>\n  <lrnsys-dialog id="dialog" style="overflow: visible;">\n    <span slot="toolbar-primary">\n      <span style="width:15em;">\n        <paper-icon-button on-tap="_changeActiveItem" id="prevstudent" icon="arrow-upward" title="previous student"></paper-icon-button>\n        <paper-icon-button on-tap="_changeActiveItem" id="nextstudent" icon="arrow-downward" title="next student"></paper-icon-button>\n        <lrndesign-avatar class="ferpa-protect" label="[[activeData.student.name]]" src="[[activeData.student.avatar]]" style="display:inline-block;vertical-align:middle;"></lrndesign-avatar>\n        <span class="avatar-label ferpa-protect" style="margin-left:1em;">[[activeData.student.sis.sortable_name]]</span>\n      </span>\n      <paper-icon-button on-tap="_changeActiveItem" id="prevassignment" icon="arrow-back" title="previous assignment" style="margin-left:1em;"></paper-icon-button>\n      <paper-icon-button on-tap="_changeActiveItem" id="nextassignment" icon="arrow-forward" title="next assignment"></paper-icon-button>\n      <span style="font-weight:bold;">Assignment: [[activeData.assignment.title]]</span>\n    </span>\n    <span slot="content">\n      <template is="dom-if" if="[[activeData.submission]]">\n        <lrnapp-studio-submission-page base-path="[[basePath]]" route="{{tail}}" id="[[data.submission]]" end-point="[[basePath]]lrnapp-studio-submission" csrf-token="[[csrfToken]]" data="[[data]]" hide-menu-bar></lrnapp-studio-submission-page>\n      </template>\n      <template is="dom-if" if="[[!activeData.submission]]">\n        <div>\n          <h3>No submission for this assignment</h3>\n          <p>This student has not submitted anything for this assignment at this time.</p>\n        </div>\n      </template>\n    </span>\n  </lrnsys-dialog>  \n'
    ]);
    _templateObject_50f94710f76d11e89310d7f0fbc64afe = function _templateObject_50f94710f76d11e89310d7f0fbc64afe() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_50f94710f76d11e89310d7f0fbc64afe()
    ),
    is: "lrnapp-studio-instructor",
    observers: [
      "_routeChanged(route, endPoint)",
      "_activeDataChanged(activeData.student, activeData.assignment)"
    ],
    properties: {
      dataType: { type: Boolean, value: !1, observer: "_dataTypeChanged" },
      dataTypeText: { type: String, value: "Submissions" },
      projects: { type: Object, notify: !0 },
      assignments: { type: Object, notify: !0 },
      students: { type: Object, notify: !0, value: !1 },
      _projectData: { type: Object, value: {} },
      studentParams: {
        type: Object,
        value: { projectId: null, type: "submission" }
      },
      _studentData: { type: Object },
      _numWidth: { type: String, value: "2.25em" },
      sourcePath: { type: String, notify: !0 },
      basePath: { type: String, notify: !0 },
      route: { type: String },
      csrfToken: { type: String },
      elmslnCourse: { type: String },
      elmslnSection: { type: String },
      data: { type: Object },
      activeProject: { type: Number, value: !1 },
      activeData: {
        type: Object,
        value: { student: {}, assignment: {}, submission: {} }
      },
      stats: { type: Object, value: {} },
      activeChart: { type: Object, value: {} }
    },
    _chartChanged: function _chartChanged(e) {
      this.set("activeChart.title", e.detail.value);
      this.notifyPath("activeChart.title");
      this.set(
        "activeChart.description",
        "Chart of values relative to " + e.detail.value
      );
      this.notifyPath("activeChart.description");
      this.set("activeChart.data", this._formatChartData(e.detail.value));
      this.notifyPath("activeChart.data");
    },
    _formatChartData: function _formatChartData(type) {
      var labels = [],
        series = [[]],
        stats = this.stats.stats,
        assignments = this._toArray(this.assignments),
        parts = type.split("-");
      if (
        babelHelpers.typeof(stats[parts[0]]) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        babelHelpers.typeof(stats[parts[0]][parts[1]]) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
      ) {
        for (var i in assignments) {
          var title = assignments[i].title;
          if (
            babelHelpers.typeof(
              stats[parts[0]][parts[1]][assignments[i].id]
            ) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0))
          ) {
            series[0].push(stats[parts[0]][parts[1]][assignments[i].id]);
            title += " (".concat(
              stats[parts[0]][parts[1]][assignments[i].id],
              ")"
            );
          } else {
            series[0].push(0);
            title += " (0)";
          }
          labels.push(title);
        }
      }
      return { labels: labels, series: series };
    },
    _dataTypeChanged: function _dataTypeChanged(newValue, oldValue) {
      if (
        babelHelpers.typeof(oldValue) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        if (newValue) {
          this.dataTypeText = "Comments (beta)";
        } else {
          this.dataTypeText = "Submissions";
        }
      }
    },
    _commentIndex: function _commentIndex(index) {
      return index + 1;
    },
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
    _activeDataChanged: function _activeDataChanged(student, assignment) {
      if (
        babelHelpers.typeof(student.id) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        if (-1 == this._getObjectByPosition(this.students, student.id, -1)) {
          this.$.prevstudent.disabled = !0;
        } else {
          this.$.prevstudent.disabled = !1;
        }
        if (-1 == this._getObjectByPosition(this.students, student.id, 1)) {
          this.$.nextstudent.disabled = !0;
        } else {
          this.$.nextstudent.disabled = !1;
        }
        if (
          -1 == this._getObjectByPosition(this.assignments, assignment.id, -1)
        ) {
          this.$.prevassignment.disabled = !0;
        } else {
          this.$.prevassignment.disabled = !1;
        }
        if (
          -1 == this._getObjectByPosition(this.assignments, assignment.id, 1)
        ) {
          this.$.nextassignment.disabled = !0;
        } else {
          this.$.nextassignment.disabled = !1;
        }
      }
    },
    _projectChanged: function _projectChanged(e) {
      this.$.loading.hidden = !1;
      this.__rememberClick = this.$.statsdialog;
      this.$.statsdialog.disabled = !1;
      this.$.datatype.disabled = !1;
      this.activeProject = e.detail.value;
      this.studentParams.projectId = this.activeProject;
      this.$.studentrequest.generateRequest();
    },
    attached: function attached() {
      document.body.addEventListener(
        "lrnsys-dialog-modal-closed",
        this._accessibleFocus.bind(this)
      );
      this.$.selectedproject.addEventListener(
        "change",
        this._projectChanged.bind(this)
      );
      this.$.selectedchart.addEventListener(
        "change",
        this._chartChanged.bind(this)
      );
    },
    detached: function detached() {
      document.body.removeEventListener(
        "lrnsys-dialog-modal-closed",
        this._accessibleFocus.bind(this)
      );
      this.$.selectedproject.removeEventListener(
        "change",
        this._projectChanged.bind(this)
      );
      this.$.selectedchart.removeEventListener(
        "change",
        this._chartChanged.bind(this)
      );
    },
    _accessibleFocus: function _accessibleFocus(e) {
      document.body.classList.remove("scroll-disabled");
      this.__rememberClick.focus();
    },
    _handleProjectResponse: function _handleProjectResponse(event) {
      this.$.loading.hidden = !0;
      this.set("projects", this._projectData.data.projects);
    },
    _handleStudentResponse: function _handleStudentResponse(event) {
      var _this = this;
      this.$.loading.hidden = !0;
      this.set("students", []);
      this.set("students", this._studentData.data.students);
      this.set("assignments", []);
      this.set("assignments", this._studentData.data.assignments);
      this.stats = this._studentData.data.stats;
      this.set(
        "stats.header",
        "Statistics for " +
          this.projects["project-" + this.activeProject].attributes.title
      );
      setTimeout(function() {
        _this.shadowRoot.querySelector("#sorter").direction = "asc";
      }, 200);
    },
    _changeActiveItem: function _changeActiveItem(e) {
      document.body.classList.add("scroll-disabled");
      var normalizedEvent = (0, _polymerDom.dom)(e),
        local = normalizedEvent.localTarget,
        newstudent,
        newassignment;
      switch (local.id) {
        case "prevstudent":
          newstudent = this._getObjectByPosition(
            this.students,
            this.activeData.student.id,
            -1
          );
          if (
            -1 != newstudent &&
            babelHelpers.typeof(
              newstudent.assignments[this.activeData.assignment.id]
            ) !==
              ("undefined" === typeof void 0
                ? "undefined"
                : babelHelpers.typeof(void 0))
          ) {
            this.set("activeData.student", {});
            this.set("activeData.student", newstudent);
            this.set("activeData.submission", {});
            this.set(
              "activeData.submission",
              newstudent.assignments[this.activeData.assignment.id]
            );
            this.set(
              "route.path",
              this.endPoint + "/submissions/" + this.activeData.submission.id
            );
          }
          break;
        case "nextstudent":
          newstudent = this._getObjectByPosition(
            this.students,
            this.activeData.student.id,
            1
          );
          if (
            -1 != newstudent &&
            babelHelpers.typeof(
              newstudent.assignments[this.activeData.assignment.id]
            ) !==
              ("undefined" === typeof void 0
                ? "undefined"
                : babelHelpers.typeof(void 0))
          ) {
            this.set("activeData.student", {});
            this.set("activeData.student", newstudent);
            this.set("activeData.submission", {});
            this.set(
              "activeData.submission",
              newstudent.assignments[this.activeData.assignment.id]
            );
            this.set(
              "route.path",
              this.endPoint + "/submissions/" + this.activeData.submission.id
            );
          }
          break;
        case "prevassignment":
          newassignment = this._getObjectByPosition(
            this.assignments,
            this.activeData.assignment.id,
            -1
          );
          if (-1 != newassignment) {
            this.set("activeData.assignment", {});
            this.set("activeData.assignment", newassignment);
            if (
              babelHelpers.typeof(
                this.activeData.student.assignments[newassignment.id].id
              ) !==
              ("undefined" === typeof void 0
                ? "undefined"
                : babelHelpers.typeof(void 0))
            ) {
              this.set(
                "activeData.submission",
                this.activeData.student.assignments[newassignment.id]
              );
              this.set("activeData.submission", {});
              this.set(
                "route.path",
                this.endPoint +
                  "/submissions/" +
                  this.activeData.student.assignments[newassignment.id].id
              );
            } else {
              this.set("activeData.submission", !1);
            }
          }
          break;
        case "nextassignment":
          newassignment = this._getObjectByPosition(
            this.assignments,
            this.activeData.assignment.id,
            1
          );
          if (-1 != newassignment) {
            this.set("activeData.assignment", {});
            this.set("activeData.assignment", newassignment);
            if (
              babelHelpers.typeof(
                this.activeData.student.assignments[newassignment.id].id
              ) !==
              ("undefined" === typeof void 0
                ? "undefined"
                : babelHelpers.typeof(void 0))
            ) {
              this.set("activeData.submission", {});
              this.set(
                "activeData.submission",
                this.activeData.student.assignments[newassignment.id]
              );
              this.set(
                "route.path",
                this.endPoint +
                  "/submissions/" +
                  this.activeData.student.assignments[newassignment.id].id
              );
            } else {
              this.set("activeData.submission", !1);
            }
          }
          break;
      }
    },
    _getObjectByPosition: function _getObjectByPosition(items, key, i) {
      var keys = Object.keys(items).sort(function(a, b) {
        if (
          babelHelpers.typeof(items[a].sis) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
        ) {
          if (items[a].sis.sortable_name > items[b].sis.sortable_name) {
            return 1;
          } else if (items[a].sis.sortable_name < items[b].sis.sortable_name) {
            return -1;
          }
          return 0;
        } else {
          return a - b;
        }
      });
      if (key !== void 0) {
        key = key.toString();
      }
      var index = keys.indexOf(key);
      if (-1 == index) {
        index = keys.indexOf(parseInt(key));
      }
      if ((-1 == i && 0 < index) || (1 == i && index < keys.length - 1)) {
        return items[keys[index + i]];
      } else {
        return -1;
      }
    },
    _submissionStatus: function _submissionStatus(
      student,
      assignment,
      dataType
    ) {
      if (null != student) {
        if (
          !dataType &&
          babelHelpers.typeof(student.assignments[assignment.id]) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0)) &&
          babelHelpers.typeof(student.assignments[assignment.id].id) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0))
        ) {
          return !0;
        } else if (
          dataType &&
          babelHelpers.typeof(student.assignmentComments[assignment.id]) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0)) &&
          0 < this._toArray(student.assignmentComments[assignment.id]).length
        ) {
          return !0;
        }
      }
      return !1;
    },
    _submissionID: function _submissionID(student, assignment) {
      if (
        null != student &&
        babelHelpers.typeof(student.assignments[assignment.id]) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        babelHelpers.typeof(student.assignments[assignment.id].id) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
      ) {
        return student.assignments[assignment.id].id;
      }
      return !1;
    },
    _submissionPiece: function _submissionPiece(student, assignment, piece) {
      if (
        null != student &&
        babelHelpers.typeof(student.assignments[assignment.id]) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        babelHelpers.typeof(student.assignments[assignment.id].id) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
      ) {
        var submission = student.assignments[assignment.id];
        switch (piece) {
          case "url":
            return (
              this.basePath +
              "lrnapp-studio-submission/submissions/" +
              submission.id
            );
            break;
          case "title":
            return submission.attributes.title;
            break;
          case "icon":
            return submission.meta.state_icon;
            break;
          case "color":
            return submission.meta.state_color;
            break;
          case "comments":
            return this._toArray(student.assignmentComments[assignment.id]);
            break;
        }
      }
      return "";
    },
    _commentCount: function _commentCount(student, assignment, dataType) {
      if (
        !dataType &&
        null != student &&
        babelHelpers.typeof(student.assignmentComments[assignment.id]) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0))
      ) {
        return this._toArray(student.assignmentComments[assignment.id]).length;
      }
      return !1;
    },
    _setActiveSubmission: function _setActiveSubmission(e) {
      var normalizedEvent = (0, _polymerDom.dom)(e),
        local = normalizedEvent.localTarget;
      this.__rememberClick = local;
      var item = local.id.split("-");
      this.set("activeData.student", this.students[item[1]]);
      this.set("activeData.assignment", this.assignments[item[3]]);
      this.set(
        "activeData.submission",
        this.students[item[1]].assignments[item[3]]
      );
      this.set(
        "route.path",
        this.endPoint + "/submissions/" + item[item.length - 1]
      );
      document.body.classList.add("scroll-disabled");
      this.$.dialog.toggleDialog();
    },
    _setActiveComment: function _setActiveComment(e) {
      this.$.nextassignment.disabled = !0;
      this.$.prevassignment.disabled = !0;
      this.$.nextstudent.disabled = !0;
      this.$.prevstudent.disabled = !0;
      var normalizedEvent = (0, _polymerDom.dom)(e),
        local = normalizedEvent.localTarget;
      this.__rememberClick = local;
      var item = local.id.split("-");
      this.set("activeData.student", this.students[item[1]]);
      this.set("activeData.assignment", this.assignments[item[3]]);
      this.set(
        "activeData.submission",
        this.students[item[1]].assignments[item[3]]
      );
      this.set(
        "route.path",
        this.endPoint + "/submissions/" + item[item.length - 1]
      );
      document.body.classList.add("scroll-disabled");
      this.$.dialog.toggleDialog();
    },
    _toArray: function _toArray(obj) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    }
  });
});
