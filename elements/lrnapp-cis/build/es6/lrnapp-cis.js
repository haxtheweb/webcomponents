import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "./node_modules/@polymer/iron-ajax/iron-ajax.js";
import "./node_modules/@polymer/iron-pages/iron-pages.js";
import "./node_modules/@polymer/iron-list/iron-list.js";
import "./node_modules/@polymer/iron-selector/iron-selector.js";
import "./node_modules/@polymer/paper-toast/paper-toast.js";
import "./node_modules/@polymer/paper-styles/paper-styles.js";
import "./node_modules/@polymer/paper-button/paper-button.js";
import "./node_modules/@polymer/paper-listbox/paper-listbox.js";
import "./node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js";
import "./node_modules/@polymer/paper-item/paper-item.js";
import "./node_modules/@polymer/app-route/app-route.js";
import "./node_modules/@polymer/app-route/app-location.js";
import "./node_modules/@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import "./node_modules/@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
import "./lib/lrnapp-cis-course-card.js";
Polymer({
  _template: html`
    <style include="materializecss-styles"></style>
    <style>
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
        line-height: 16px;
      }
      iron-selector lrnsys-button {
        display: inline-flex;
      }
      paper-button.coursecard-wrapper {
        margin: 0;
        padding: 0;
      }
      lrnapp-cis-course-card {
        padding: 0;
        margin: 16px;
        height: 240px;
        width: 224px;
      }
      .courses-grid {
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
    <iron-ajax auto="" url="[[sourcePath]]" params="" handle-as="json" last-response="{{cisResponse}}" on-response="_handleResponse"></iron-ajax>

    <app-location route="{{route}}" query-params="{{queryParams}}"></app-location>
    <app-route route="{{route}}" pattern="[[endPoint]]/:page" data="{{data}}" tail="{{tail}}" query-params="{{queryParams}}">
    </app-route>

    <div id="loading">
      <h3>Loading..</h3>
      <elmsln-loading color="grey-text" size="large"></elmsln-loading>
    </div>
    <app-toolbar class="">
      <span main-title=""></span>
      <span top-item="" style="text-align:right;font-size:8px;padding-right:16px;">Displaying [[courses.length]] of [[originalCourses.length]]</span>
      <paper-dropdown-menu label="Course" hidden\$="[[!courses]]">
        <paper-listbox slot="dropdown-content" class="dropdown-content" selected="{{queryParams.course}}" attr-for-selected="item-id">
          <paper-item></paper-item>
          <template is="dom-repeat" items="[[_toArray(courses)]]" as="course">
          <paper-item item-id="[[course.id]]">[[course.data.name]]</paper-item>
          </template>
        </paper-listbox>
      </paper-dropdown-menu>
      <paper-dropdown-menu label="Program" hidden\$="[[!programs]]">
        <paper-listbox slot="dropdown-content" class="dropdown-content" selected="{{queryParams.program}}" attr-for-selected="item-id">
          <paper-item></paper-item>
        <template is="dom-repeat" items="[[_toArray(programs)]]" as="program">
          <paper-item item-id="[[program.id]]">[[program.data.name]]</paper-item>
        </template>
        </paper-listbox>
      </paper-dropdown-menu>
      <paper-dropdown-menu label="Academic home" hidden\$="[[!academics]]">
        <paper-listbox slot="dropdown-content" class="dropdown-content" selected="{{queryParams.academic}}" attr-for-selected="item-id">
          <paper-item></paper-item>
        <template is="dom-repeat" items="[[_toArray(academics)]]" as="academic">
          <paper-item item-id="[[academic.id]]">[[academic.data.name]]</paper-item>
        </template>
        </paper-listbox>
      </paper-dropdown-menu>
    </app-toolbar>
    <div class="courses-grid">
    <iron-pages selected="{{data.page}}" attr-for-selected="name" fallback-selection="courses" role="main">
      <div class="iron-list-container" name="courses">
        <iron-list items="[[courses]]" as="course" grid="">
          <template>
          <paper-button data-course-id\$="[[course.id]]" class="coursecard-wrapper" on-tap="_loadCourseUrl">
            <lrnapp-cis-course-card elevation="2" data-course-id\$="[[course.id]]" name="[[course.data.name]]" image="[[course.data.image]]" title="[[course.data.title]]" color="[[course.data.color]]">
            </lrnapp-cis-course-card>
          </paper-button>
          </template>
        </iron-list>
      </div>
    </iron-pages>
    </div>
    <paper-toast id="toast"></paper-toast>
`,
  is: "lrnapp-cis",
  properties: {
    cisResponse: { type: Object },
    courses: {
      type: Array,
      computed: "_coursesCompute(originalCourses, queryParams)"
    },
    originalCourses: { type: Array },
    courses: { type: Array, value: [] },
    programs: { type: Array, value: [] },
    academics: { type: Array, value: [] },
    sourcePath: { type: String },
    endPoint: { type: String, value: "/" },
    basePath: { type: String, value: "/" },
    activeCourse: { type: String, value: null },
    queryParams: { type: Object, notify: !0 },
    _blockcycle: { type: Boolean, value: !1 }
  },
  listeners: { "route-change": "_routeChange" },
  observers: ["_routeChanged(route, endPoint)"],
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
    if (typeof details.queryParams.course !== typeof void 0) {
      this.set("queryParams.course", details.queryParams.course);
    }
    if (typeof details.queryParams.academic !== typeof void 0) {
      this.set("queryParams.academic", details.queryParams.academic);
    }
    if (typeof details.queryParams.program !== typeof void 0) {
      this.set("queryParams.program", details.queryParams.program);
    }
    if (typeof details.data.page !== typeof void 0) {
      this.set("data.page", details.data.page);
    }
  },
  _toArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  },
  _handleResponse: function(event) {
    var course = {},
      program = {},
      academic = {},
      tmp = { courses: [], programs: [], academics: [] },
      programs = [],
      academics = [],
      courses = this._toArray(this.cisResponse.data.courses);
    this.set("originalCourses", courses);
    for (var index = 0; index < courses.length; index++) {
      course = courses[index];
      program = courses[index].relationships.program;
      academic = courses[index].relationships.academic;
      tmp.programs[program.id] = program;
      tmp.academics[academic.id] = academic;
      tmp.courses[course.id] = course;
    }
    tmp.programs.forEach(function(element) {
      programs.push(element);
    });
    tmp.academics.forEach(function(element) {
      academics.push(element);
    });
    this.$.loading.hidden = !0;
    this.set("academics", academics);
    this.set("programs", programs);
    this.set("courses", courses);
  },
  _loadCourseUrl: function(e) {
    let root = this;
    var normalizedEvent = dom(e),
      local = normalizedEvent.localTarget,
      active = local.getAttribute("data-course-id");
    let findCourse = this.originalCourses.filter(course => {
      if (course.id !== active) {
        return !1;
      }
      return !0;
    });
    if (0 < findCourse.length) {
      findCourse = findCourse.pop();
    }
    if (typeof findCourse.data.uri !== typeof void 0) {
      window.location.href = findCourse.data.uri;
    }
  },
  _coursesCompute: function(originalCourses, queryParams) {
    console.log(originalCourses);
    console.log(queryParams);
    if ("undefined" === typeof originalCourses) {
      return [];
    }
    const root = this;
    let filteredCourses = [];
    filteredCourses = originalCourses.filter(course => {
      if ("undefined" !== typeof root.queryParams.course) {
        if (course.id !== root.queryParams.course) {
          return !1;
        }
      }
      if ("undefined" !== typeof root.queryParams.program) {
        if (course.relationships.program.id !== root.queryParams.program) {
          return !1;
        }
      }
      if ("undefined" !== typeof root.queryParams.academic) {
        if (course.relationships.academic.id !== root.queryParams.academic) {
          return !1;
        }
      }
      return !0;
    });
    setTimeout(() => {
      document.querySelector("iron-list").fire("iron-resize");
    }, 200);
    return filteredCourses;
  }
});
