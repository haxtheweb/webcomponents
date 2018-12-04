import {
  html,
  Polymer
} from "../../node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "../../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "../../node_modules/@polymer/app-route/app-location.js";
import "../../node_modules/@polymer/app-route/app-route.js";
import "../../node_modules/@polymer/iron-ajax/iron-ajax.js";
import "../../node_modules/@polymer/paper-toggle-button/paper-toggle-button.js";
import "../../node_modules/@polymer/paper-item/paper-item.js";
import "../../node_modules/@polymer/paper-badge/paper-badge.js";
import "../../node_modules/@polymer/paper-button/paper-button.js";
import "../../node_modules/@polymer/paper-input/paper-input.js";
import "../../node_modules/@polymer/paper-icon-button/paper-icon-button.js";
import "../../node_modules/@polymer/paper-tooltip/paper-tooltip.js";
import "../../node_modules/@vaadin/vaadin-grid/vaadin-grid.js";
import "../../node_modules/@vaadin/vaadin-grid/vaadin-grid-filter.js";
import "../../node_modules/@vaadin/vaadin-grid/vaadin-grid-sorter.js";
import "../../node_modules/@vaadin/vaadin-grid/vaadin-grid-column-group.js";
import "../../node_modules/@vaadin/vaadin-grid/vaadin-grid-selection-column.js";
import "../../node_modules/@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
import "../../node_modules/@lrnwebcomponents/lrndesign-chart/lib/lrndesign-bar.js";
import "../../node_modules/@lrnwebcomponents/lrndesign-chart/lib/lrndesign-line.js";
import "../../node_modules/@lrnwebcomponents/lrndesign-chart/lib/lrndesign-pie.js";
import "../../node_modules/@lrnwebcomponents/dropdown-select/dropdown-select.js";
import "../../node_modules/@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import "../../node_modules/@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";
import "../../node_modules/@lrnwebcomponents/lrnsys-layout/lib/lrnsys-dialog.js";
import "./lrnapp-studio-submission.js";
Polymer({
  _template: html`
  <style include="materializecss-styles">
    :host {
      display: block;
      align-content: center;
      padding: .8em;
    }
    vaadin-grid-table-body > vaadin-grid-cell-content {
      height: unset !important;
    }
    lrnsys-dialog-toolbar {
      top: 0;
      position: sticky !important;
      z-index: 1;
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
    .center-data {
      text-align: center;
    }
    vaadin-grid#material {
      height: 75vh;
      font-family: Roboto, sans-serif;
      --divider-color: rgba(0, 0, 0, var(--dark-divider-opacity));

      --vaadin-grid-cell: {
        padding: 0;
      };

      --vaadin-grid-header-cell: {
        height: 3.5em;
        color: rgba(0, 0, 0, var(--dark-secondary-opacity));
        font-size: 1em;
      };

      --vaadin-grid-body-cell: {
        height: 3em;
        color: rgba(0, 0, 0, var(--dark-primary-opacity));
        font-size: .8em;
      };

      --vaadin-grid-body-row-hover-cell: {
        background-color: var(--paper-grey-200);
      };

      --vaadin-grid-body-row-selected-cell: {
        background-color: var(--paper-grey-100);
      };

      --vaadin-grid-focused-cell: {
        box-shadow: none;
        font-weight: bold;
      };
    }

    vaadin-grid#material .cell {
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 56px;
    }

    vaadin-grid#material .cell.last {
      padding-right: 24px;
    }

    vaadin-grid#material .cell.numeric {
      text-align: right;
    }

    vaadin-grid#material paper-checkbox {
      --primary-color: var(--paper-indigo-500);
      margin: 0 24px;
    }

    vaadin-grid#material vaadin-grid-sorter .cell {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    vaadin-grid#material vaadin-grid-sorter iron-icon {
      transform: scale(0.8);
    }

    vaadin-grid#material vaadin-grid-sorter:not([direction]) iron-icon {
      color: rgba(0, 0, 0, var(--dark-disabled-opacity));
    }

    vaadin-grid#material vaadin-grid-sorter[direction] {
      color: rgba(0, 0, 0, var(--dark-primary-opacity));
    }

    vaadin-grid#material vaadin-grid-sorter[direction=desc] iron-icon {
      transform: scale(0.8) rotate(180deg);
    }
    vaadin-grid-sorter {
      text-align: center;
    }

    lrndesign-avatar {
      display: inline-block;
    }
    .avatar-label {
      display: inline-block;
      margin-left: .2em;
    }

    .avatar-button {

    }
    .assignment-button {
      height: 1em;
    }
    .project-button {
      height: 1em;
    }
    paper-badge {
      top: 0 !important;
      left: unset !important;
      right: 0;
      z-index: 1;
    }
    .avatar-link {
      color: black;
    }
    .avatar-link paper-button {
      text-transform: unset;
    }
    #selectedproject {
      display: inline-block;
    }
    #datatype {
      display: inline-block;
      vertical-align: middle;
      --paper-toggle-button-checked-bar-color:  var(--paper-green-500);
      --paper-toggle-button-checked-button-color:  var(--paper-green-500);
      --paper-toggle-button-checked-ink-color: var(--paper-green-500);
      --paper-toggle-button-unchecked-bar-color:  var(--paper-amber-900);
      --paper-toggle-button-unchecked-button-color:  var(--paper-amber-900);
      --paper-toggle-button-unchecked-ink-color: var(--paper-amber-900);
    }
    .comment-list {
      list-style-image: none;
      display: inline-block;
      padding: 0;
      margin: 0;
    }
    .stats-text {
      font-size: .8em;
      font-style: italic;
      line-height: 1em;
      padding: 0 0 0 2em;
      display: inline-block;
      text-align: right;
    }
  </style>
  <app-location route="{{route}}"></app-location>
  <app-route
      route="{{route}}"
      pattern="[[endPoint]]/submissions/:submission"
      data="{{data}}"
      tail="{{tail}}">
  </app-route>
  <iron-ajax auto
    id="projectrequest"
    url="[[sourceProjectPath]]"
    params=""
    handle-as="json"
    last-response="{{_projectData}}"
    on-response="_handleProjectResponse"></iron-ajax>
  <iron-ajax
    id="studentrequest"
    url="[[sourceStudentPath]]"
    params='[[studentParams]]'
    handle-as="json"
    last-response="{{_studentData}}"
    on-response="_handleStudentResponse"></iron-ajax>
  <div id="loading">
    <h3>Loading..</h3>
    <elmsln-loading color="grey-text" size="large"></elmsln-loading>
  </div>
  <div hidden$="[[activeProject]]">Select a project to begin reviewing work</div>
  <dropdown-select id="selectedproject" label="Project">
    <template is="dom-repeat" items="[[_toArray(projects)]]" as="project">
      <paper-item value$="[[project.id]]">[[project.attributes.title]]</paper-item>
    </template>
  </dropdown-select>
  <paper-toggle-button id="datatype" checked="{{dataType}}" disabled>
    [[dataTypeText]]
  </paper-toggle-button>
  <lrnsys-dialog id="statsdialog" disabled>
    <span slot="button"><iron-icon icon="editor:show-chart"></iron-icon> Statistics (beta)</span>
    <span slot="toolbar-primary">
      [[stats.header]]
    </span>
  <span slot="content">
      <div style="padding: 2em 4em;">
        <span class="stats-text">[[stats.overview]]</span>
        <dropdown-select id="selectedchart" label="Graph style">
          <paper-item value="byassignment-submissions">Submissions by Assignment</paper-item>
          <paper-item value="byassignment-comments">Comments by Assignment</paper-item>
          <paper-item value="byassignment-commenters">Commenters by Assignment</paper-item>
        </dropdown-select>
        <lrndesign-bar chart-title="[[activeChart.title]]" chart-desc="[[activeChart.description]]" data="[[activeChart.data]]"></lrndesign-bar>
      </div>
    </span>
  </lrnsys-dialog>
  <vaadin-grid hidden$="[[!students]]" id="material" aria-label="Student project list" items="[[_toArray(students)]]">
    <vaadin-grid-column resizable>
      <template class="header">
        <vaadin-grid-sorter id="sorter" path="sis.sortable_name">Student</vaadin-grid-sorter>
      </template>
      <template>
        <a href$="[[basePath]]lrnapp-open-studio/projects?author=[[item.id]]&project=[[activeProject]]" tabindex="-1" target="_blank" class="avatar-link ferpa-protect">
          <paper-button class="avatar-button">
            <lrndesign-avatar label="[[item.name]]" src="[[item.avatar]]"></lrndesign-avatar>
            <span class="avatar-label">[[item.sis.sortable_name]]</span>
          </paper-button>
        </a>
      </template>
      <template class="footer">
        <vaadin-grid-filter aria-label="Student" path="sis.sortable_name" value="[[_filterName]]">
          <paper-input slot="filter" label="Student" value="{{_filterName::input}}" focus-target></paper-input>
        </vaadin-grid-filter>
      </template>
    </vaadin-grid-column>
    <template is="dom-repeat" items="[[_toArray(assignments)]]" as="assignment">
      <vaadin-grid-column resizable>
        <template class="header">
          <span>[[assignment.title]]</span>
        </template>
        <template>
          <template is="dom-if" if="[[_submissionStatus(item, assignment, dataType)]]">
            <template is="dom-if" if="[[!dataType]]">
              <lrnsys-button icon="[[_submissionPiece(item, assignment, 'icon')]]" id$="student-[[item.id]]-assignment-[[assignment.id]]-submission-[[_submissionID(item, assignment)]]" label="[[_submissionPiece(item, assignment, 'title')]]" on-tap="_setActiveSubmission">
              </lrnsys-button>
            </template>
            <template is="dom-if" if="[[dataType]]">
              <ul class="comment-list">
              <template is="dom-repeat" items="[[_submissionPiece(item, assignment, 'comments')]]" as="commented">
                <li>
                  <lrnsys-button icon="communication:comment" id$="student-[[item.id]]-assignment-[[assignment.id]]-submission-[[commented]]" label="#[[_commentIndex(index)]]" on-tap="_setActiveComment">
                  </lrnsys-button>
                </li>
              </template>
              </ul>
            </template>
          </template>
          <template is="dom-if" if="[[!_submissionStatus(item, assignment, dataType)]]">
            <paper-button disabled class="project-button" id$="student-[[item.id]]-assignment-[[assignment.id]]-submission-null">X</paper-button>
          </template>
          <template is="dom-if" if="[[_commentCount(item, assignment, dataType)]]">
            <paper-badge id$="student-[[item.id]]-assignment-[[assignment.id]]-tip" for="student-[[item.id]]-assignment-[[assignment.id]]" label="[[_commentCount(item, assignment, dataType)]]"></paper-badge>
            <paper-tooltip for="student-[[item.id]]-assignment-[[assignment.id]]-tip">Comments left on classmates [[assignment.title]]</paper-badge>
          </template>
        </template>
      </vaadin-grid-column>
    </template>
  </vaadin-grid>
  <lrnsys-dialog id="dialog" style="overflow: visible;">
    <span slot="toolbar-primary">
      <span style="width:15em;">
        <paper-icon-button on-tap="_changeActiveItem" id="prevstudent" icon="arrow-upward" title="previous student"></paper-icon-button>
        <paper-icon-button on-tap="_changeActiveItem" id="nextstudent" icon="arrow-downward" title="next student"></paper-icon-button>
        <lrndesign-avatar class="ferpa-protect" label="[[activeData.student.name]]" src="[[activeData.student.avatar]]" style="display:inline-block;vertical-align:middle;"></lrndesign-avatar>
        <span class="avatar-label ferpa-protect" style="margin-left:1em;">[[activeData.student.sis.sortable_name]]</span>
      </span>
      <paper-icon-button on-tap="_changeActiveItem" id="prevassignment" icon="arrow-back" title="previous assignment" style="margin-left:1em;"></paper-icon-button>
      <paper-icon-button on-tap="_changeActiveItem" id="nextassignment" icon="arrow-forward" title="next assignment"></paper-icon-button>
      <span style="font-weight:bold;">Assignment: [[activeData.assignment.title]]</span>
    </span>
    <span slot="content">
      <template is="dom-if" if="[[activeData.submission]]">
        <lrnapp-studio-submission-page base-path="[[basePath]]" route="{{tail}}" id="[[data.submission]]" end-point="[[basePath]]lrnapp-studio-submission" csrf-token="[[csrfToken]]" data="[[data]]" hide-menu-bar></lrnapp-studio-submission-page>
      </template>
      <template is="dom-if" if="[[!activeData.submission]]">
        <div>
          <h3>No submission for this assignment</h3>
          <p>This student has not submitted anything for this assignment at this time.</p>
        </div>
      </template>
    </span>
  </lrnsys-dialog>  
`,
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
  _chartChanged: function(e) {
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
  _formatChartData: function(type) {
    var labels = [],
      series = [[]];
    const stats = this.stats.stats,
      assignments = this._toArray(this.assignments);
    let parts = type.split("-");
    if (
      typeof stats[parts[0]] !== typeof void 0 &&
      typeof stats[parts[0]][parts[1]] !== typeof void 0
    ) {
      for (var i in assignments) {
        let title = assignments[i].title;
        if (
          typeof stats[parts[0]][parts[1]][assignments[i].id] !== typeof void 0
        ) {
          series[0].push(stats[parts[0]][parts[1]][assignments[i].id]);
          title += ` (${stats[parts[0]][parts[1]][assignments[i].id]})`;
        } else {
          series[0].push(0);
          title += " (0)";
        }
        labels.push(title);
      }
    }
    return { labels: labels, series: series };
  },
  _dataTypeChanged: function(newValue, oldValue) {
    if (typeof oldValue !== typeof void 0) {
      if (newValue) {
        this.dataTypeText = "Comments (beta)";
      } else {
        this.dataTypeText = "Submissions";
      }
    }
  },
  _commentIndex: function(index) {
    return index + 1;
  },
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
  _activeDataChanged: function(student, assignment) {
    if (typeof student.id !== typeof void 0) {
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
      if (-1 == this._getObjectByPosition(this.assignments, assignment.id, 1)) {
        this.$.nextassignment.disabled = !0;
      } else {
        this.$.nextassignment.disabled = !1;
      }
    }
  },
  _projectChanged: function(e) {
    this.$.loading.hidden = !1;
    this.__rememberClick = this.$.statsdialog;
    this.$.statsdialog.disabled = !1;
    this.$.datatype.disabled = !1;
    this.activeProject = e.detail.value;
    this.studentParams.projectId = this.activeProject;
    this.$.studentrequest.generateRequest();
  },
  attached: function() {
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
  detached: function() {
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
  _accessibleFocus: function(e) {
    document.body.classList.remove("scroll-disabled");
    this.__rememberClick.focus();
  },
  _handleProjectResponse: function(event) {
    this.$.loading.hidden = !0;
    this.set("projects", this._projectData.data.projects);
  },
  _handleStudentResponse: function(event) {
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
    setTimeout(() => {
      this.shadowRoot.querySelector("#sorter").direction = "asc";
    }, 200);
  },
  _changeActiveItem: function(e) {
    document.body.classList.add("scroll-disabled");
    var normalizedEvent = dom(e),
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
          typeof newstudent.assignments[this.activeData.assignment.id] !==
            typeof void 0
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
          typeof newstudent.assignments[this.activeData.assignment.id] !==
            typeof void 0
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
            typeof this.activeData.student.assignments[newassignment.id].id !==
            typeof void 0
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
            typeof this.activeData.student.assignments[newassignment.id].id !==
            typeof void 0
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
  _getObjectByPosition: function(items, key, i) {
    var keys = Object.keys(items).sort(function(a, b) {
      if (typeof items[a].sis !== typeof void 0) {
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
  _submissionStatus: function(student, assignment, dataType) {
    if (null != student) {
      if (
        !dataType &&
        typeof student.assignments[assignment.id] !== typeof void 0 &&
        typeof student.assignments[assignment.id].id !== typeof void 0
      ) {
        return !0;
      } else if (
        dataType &&
        typeof student.assignmentComments[assignment.id] !== typeof void 0 &&
        0 < this._toArray(student.assignmentComments[assignment.id]).length
      ) {
        return !0;
      }
    }
    return !1;
  },
  _submissionID: function(student, assignment) {
    if (
      null != student &&
      typeof student.assignments[assignment.id] !== typeof void 0 &&
      typeof student.assignments[assignment.id].id !== typeof void 0
    ) {
      return student.assignments[assignment.id].id;
    }
    return !1;
  },
  _submissionPiece: function(student, assignment, piece) {
    if (
      null != student &&
      typeof student.assignments[assignment.id] !== typeof void 0 &&
      typeof student.assignments[assignment.id].id !== typeof void 0
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
  _commentCount: function(student, assignment, dataType) {
    if (
      !dataType &&
      null != student &&
      typeof student.assignmentComments[assignment.id] !== typeof void 0
    ) {
      return this._toArray(student.assignmentComments[assignment.id]).length;
    }
    return !1;
  },
  _setActiveSubmission: function(e) {
    var normalizedEvent = dom(e),
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
  _setActiveComment: function(e) {
    this.$.nextassignment.disabled = !0;
    this.$.prevassignment.disabled = !0;
    this.$.nextstudent.disabled = !0;
    this.$.prevstudent.disabled = !0;
    var normalizedEvent = dom(e),
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
  _toArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
});
