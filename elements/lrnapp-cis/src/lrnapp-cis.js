import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/iron-pages/iron-pages.js";
import "@polymer/iron-list/iron-list.js";
import "@polymer/iron-selector/iron-selector.js";
import "@polymer/paper-toast/paper-toast.js";
import "@polymer/paper-styles/paper-styles.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-listbox/paper-listbox.js";
import "@polymer/paper-dropdown-menu/paper-dropdown-menu.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/app-route/app-route.js";
import "@polymer/app-route/app-location.js";
import "@lrnwebcomponents/lrnsys-button/lrnsys-button.js";
import "@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
import "./lib/lrnapp-cis-course-card.js";
/**
`lrnapp-cis`
A learning application for visualizing course information and listing.

@demo ../../demo/index.html

@microcopy - the mental model for this app
 - cis - Course Information System
 -
 -

*/
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
        line-height: 1em;
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
        margin: 1em;
        height: 15em;
        width: 14em;
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
      <span top-item="" style="text-align:right;font-size:.5em;padding-right:1em;">Displaying [[courses.length]] of [[originalCourses.length]]</span>
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
    /**
     * The cisResponse from server
     */
    cisResponse: {
      type: Object
    },
    /**
     * The courses to render; potentially filtered
     */
    courses: {
      type: Array,
      computed: "_coursesCompute(originalCourses, queryParams)"
    },
    /**
     * The original courses array; used to filter against
     */
    originalCourses: {
      type: Array
    },
    /**
     * The courses to render
     */
    courses: {
      type: Array,
      value: []
    },
    /**
     * The programs to render
     */
    programs: {
      type: Array,
      value: []
    },
    /**
     * The academics to render
     */
    academics: {
      type: Array,
      value: []
    },
    /**
     * sourcePath for data.
     */
    sourcePath: {
      type: String
    },
    /**
     * Endpoint for data.
     */
    endPoint: {
      type: String,
      value: "/"
    },
    /**
     * base path for the app
     */
    basePath: {
      type: String,
      value: "/"
    },
    /**
     * Active / clicked course.
     */
    activeCourse: {
      type: String,
      value: null
    },
    queryParams: {
      type: Object,
      notify: true
    },
    _blockcycle: {
      type: Boolean,
      value: false
    }
  },

  listeners: {
    "route-change": "_routeChange"
  },

  observers: ["_routeChanged(route, endPoint)"],

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
      // reload the page which since route changed will load that page
      window.location.reload();
    }
  },

  /**
   * Change route from deeper in the app.
   */
  _routeChange: function(e) {
    var details = e.detail;
    if (typeof details.queryParams.course !== typeof undefined) {
      this.set("queryParams.course", details.queryParams.course);
    }
    if (typeof details.queryParams.academic !== typeof undefined) {
      this.set("queryParams.academic", details.queryParams.academic);
    }
    if (typeof details.queryParams.program !== typeof undefined) {
      this.set("queryParams.program", details.queryParams.program);
    }
    if (typeof details.data.page !== typeof undefined) {
      this.set("data.page", details.data.page);
    }
  },

  /**
   * Simple way to convert from object to array.
   */
  _toArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  },

  /**
   * Handle response for the whole courses object.
   */
  _handleResponse: function(event) {
    var course = {};
    var program = {};
    var academic = {};
    var tmp = {
      courses: [],
      programs: [],
      academics: []
    };
    var programs = [];
    var academics = [];
    // get the CIS response's data and convert to array ahead of time
    var courses = this._toArray(this.cisResponse.data.courses);
    // original = active off the bat then we apply filters later to chang this
    this.set("originalCourses", courses);
    // figure out courses, programs and academics
    for (var index = 0; index < courses.length; index++) {
      course = courses[index];
      program = courses[index].relationships.program;
      academic = courses[index].relationships.academic;
      tmp.programs[program.id] = program;
      tmp.academics[academic.id] = academic;
      tmp.courses[course.id] = course;
    }
    // this is stupid but we have to normalize the IDs or else dom repeats will be screwed up
    tmp.programs.forEach(function(element) {
      programs.push(element);
    });
    // this is stupid but we have to normalize the IDs or else dom repeats will be screwed up
    tmp.academics.forEach(function(element) {
      academics.push(element);
    });
    this.$.loading.hidden = true;
    this.set("academics", academics);
    this.set("programs", programs);
    this.set("courses", courses);
  },

  /**
   * Handle tap on paper-button above to redirect to the correct course url.
   */
  _loadCourseUrl: function(e) {
    let root = this;
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    // this will have the id of the current course
    var active = local.getAttribute("data-course-id");
    // find the course by it's unique id and filter just to it
    let findCourse = this.originalCourses.filter(course => {
      if (course.id !== active) {
        return false;
      }
      return true;
    });
    // if we found one, make it the top level item
    if (findCourse.length > 0) {
      findCourse = findCourse.pop();
    }
    // double check we have a URI
    if (typeof findCourse.data.uri !== typeof undefined) {
      window.location.href = findCourse.data.uri;
    }
  },

  /**
   * Compute the active list of courses
   */
  _coursesCompute: function(originalCourses, queryParams) {
    console.log(originalCourses);
    console.log(queryParams);
    // if we don't have an original courses object to work with then we need to bail
    if (typeof originalCourses === "undefined") {
      return [];
    }
    // define vars
    const root = this;
    let filteredCourses = [];
    // filter the courses by the query params
    filteredCourses = originalCourses.filter(course => {
      if (typeof root.queryParams.course !== "undefined") {
        if (course.id !== root.queryParams.course) {
          return false;
        }
      }
      if (typeof root.queryParams.program !== "undefined") {
        if (course.relationships.program.id !== root.queryParams.program) {
          return false;
        }
      }
      if (typeof root.queryParams.academic !== "undefined") {
        if (course.relationships.academic.id !== root.queryParams.academic) {
          return false;
        }
      }
      return true;
    });
    // delay and repaint, can help with refresh issues
    setTimeout(() => {
      document.querySelector("iron-list").fire("iron-resize");
    }, 200);
    return filteredCourses;
  }
});
