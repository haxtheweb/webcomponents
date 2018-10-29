define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js",
  "./node_modules/@polymer/iron-ajax/iron-ajax.js",
  "./node_modules/@polymer/iron-pages/iron-pages.js",
  "./node_modules/@polymer/iron-list/iron-list.js",
  "./node_modules/@polymer/iron-selector/iron-selector.js",
  "./node_modules/@polymer/paper-toast/paper-toast.js",
  "./node_modules/@polymer/paper-styles/paper-styles.js",
  "./node_modules/@polymer/paper-button/paper-button.js",
  "./node_modules/@polymer/paper-listbox/paper-listbox.js",
  "./node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js",
  "./node_modules/@polymer/paper-item/paper-item.js",
  "./node_modules/@polymer/app-route/app-route.js",
  "./node_modules/@polymer/app-route/app-location.js",
  "./node_modules/@lrnwebcomponents/lrnsys-button/lrnsys-button.js",
  "./node_modules/@lrnwebcomponents/elmsln-loading/elmsln-loading.js",
  "./lib/lrnapp-cis-course-card.js"
], function(_polymerLegacy, _polymerDom) {
  "use strict";
  var _properties;
  function _templateObject_8df0ee90dbb911e8919b87078017787e() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style include="materializecss-styles"></style>\n    <style>\n      :host {\n        display: block;\n        align-content: center;\n      }\n      #loading {\n        width: 100%;\n        z-index: 1000;\n        opacity: .8;\n        text-align: center;\n        align-content: center;\n        justify-content: center;\n        height: 100vh;\n        position: absolute;\n        background-color: white;\n      }\n      iron-selector {\n        line-height: 1em;\n      }\n      iron-selector lrnsys-button {\n        display: inline-flex;\n      }\n      paper-button.coursecard-wrapper {\n        margin: 0;\n        padding: 0;\n      }\n      lrnapp-cis-course-card {\n        padding: 0;\n        margin: 1em;\n        height: 15em;\n        width: 14em;\n      }\n      .courses-grid {\n        margin: 0 auto;\n        width: 95%;\n      }\n      .iron-selected .display-mode {\n        background-color: #ff6f00;\n        color: white;\n      }\n      .iron-list-container {\n        display: flex;\n        flex-direction: column;\n        min-height:50vh;\n      }\n      iron-list {\n        flex: 1 1 auto;\n      }\n    </style>\n    <iron-ajax auto="" url="[[sourcePath]]" params="" handle-as="json" last-response="{{cisResponse}}" on-response="_handleResponse"></iron-ajax>\n\n    <app-location route="{{route}}" query-params="{{queryParams}}"></app-location>\n    <app-route route="{{route}}" pattern="[[endPoint]]/:page" data="{{data}}" tail="{{tail}}" query-params="{{queryParams}}">\n    </app-route>\n\n    <div id="loading">\n      <h3>Loading..</h3>\n      <elmsln-loading color="grey-text" size="large"></elmsln-loading>\n    </div>\n    <app-toolbar class="">\n      <span main-title=""></span>\n      <span top-item="" style="text-align:right;font-size:.5em;padding-right:1em;">Displaying [[courses.length]] of [[originalCourses.length]]</span>\n      <paper-dropdown-menu label="Course" hidden$="[[!courses]]">\n        <paper-listbox slot="dropdown-content" class="dropdown-content" selected="{{queryParams.course}}" attr-for-selected="item-id">\n          <paper-item></paper-item>\n          <template is="dom-repeat" items="[[_toArray(courses)]]" as="course">\n          <paper-item item-id="[[course.id]]">[[course.data.name]]</paper-item>\n          </template>\n        </paper-listbox>\n      </paper-dropdown-menu>\n      <paper-dropdown-menu label="Program" hidden$="[[!programs]]">\n        <paper-listbox slot="dropdown-content" class="dropdown-content" selected="{{queryParams.program}}" attr-for-selected="item-id">\n          <paper-item></paper-item>\n        <template is="dom-repeat" items="[[_toArray(programs)]]" as="program">\n          <paper-item item-id="[[program.id]]">[[program.data.name]]</paper-item>\n        </template>\n        </paper-listbox>\n      </paper-dropdown-menu>\n      <paper-dropdown-menu label="Academic home" hidden$="[[!academics]]">\n        <paper-listbox slot="dropdown-content" class="dropdown-content" selected="{{queryParams.academic}}" attr-for-selected="item-id">\n          <paper-item></paper-item>\n        <template is="dom-repeat" items="[[_toArray(academics)]]" as="academic">\n          <paper-item item-id="[[academic.id]]">[[academic.data.name]]</paper-item>\n        </template>\n        </paper-listbox>\n      </paper-dropdown-menu>\n    </app-toolbar>\n    <div class="courses-grid">\n    <iron-pages selected="{{data.page}}" attr-for-selected="name" fallback-selection="courses" role="main">\n      <div class="iron-list-container" name="courses">\n        <iron-list items="[[courses]]" as="course" grid="">\n          <template>\n          <paper-button data-course-id$="[[course.id]]" class="coursecard-wrapper" on-tap="_loadCourseUrl">\n            <lrnapp-cis-course-card elevation="2" data-course-id$="[[course.id]]" name="[[course.data.name]]" image="[[course.data.image]]" title="[[course.data.title]]" color="[[course.data.color]]">\n            </lrnapp-cis-course-card>\n          </paper-button>\n          </template>\n        </iron-list>\n      </div>\n    </iron-pages>\n    </div>\n    <paper-toast id="toast"></paper-toast>\n'
      ],
      [
        '\n    <style include="materializecss-styles"></style>\n    <style>\n      :host {\n        display: block;\n        align-content: center;\n      }\n      #loading {\n        width: 100%;\n        z-index: 1000;\n        opacity: .8;\n        text-align: center;\n        align-content: center;\n        justify-content: center;\n        height: 100vh;\n        position: absolute;\n        background-color: white;\n      }\n      iron-selector {\n        line-height: 1em;\n      }\n      iron-selector lrnsys-button {\n        display: inline-flex;\n      }\n      paper-button.coursecard-wrapper {\n        margin: 0;\n        padding: 0;\n      }\n      lrnapp-cis-course-card {\n        padding: 0;\n        margin: 1em;\n        height: 15em;\n        width: 14em;\n      }\n      .courses-grid {\n        margin: 0 auto;\n        width: 95%;\n      }\n      .iron-selected .display-mode {\n        background-color: #ff6f00;\n        color: white;\n      }\n      .iron-list-container {\n        display: flex;\n        flex-direction: column;\n        min-height:50vh;\n      }\n      iron-list {\n        flex: 1 1 auto;\n      }\n    </style>\n    <iron-ajax auto="" url="[[sourcePath]]" params="" handle-as="json" last-response="{{cisResponse}}" on-response="_handleResponse"></iron-ajax>\n\n    <app-location route="{{route}}" query-params="{{queryParams}}"></app-location>\n    <app-route route="{{route}}" pattern="[[endPoint]]/:page" data="{{data}}" tail="{{tail}}" query-params="{{queryParams}}">\n    </app-route>\n\n    <div id="loading">\n      <h3>Loading..</h3>\n      <elmsln-loading color="grey-text" size="large"></elmsln-loading>\n    </div>\n    <app-toolbar class="">\n      <span main-title=""></span>\n      <span top-item="" style="text-align:right;font-size:.5em;padding-right:1em;">Displaying [[courses.length]] of [[originalCourses.length]]</span>\n      <paper-dropdown-menu label="Course" hidden\\$="[[!courses]]">\n        <paper-listbox slot="dropdown-content" class="dropdown-content" selected="{{queryParams.course}}" attr-for-selected="item-id">\n          <paper-item></paper-item>\n          <template is="dom-repeat" items="[[_toArray(courses)]]" as="course">\n          <paper-item item-id="[[course.id]]">[[course.data.name]]</paper-item>\n          </template>\n        </paper-listbox>\n      </paper-dropdown-menu>\n      <paper-dropdown-menu label="Program" hidden\\$="[[!programs]]">\n        <paper-listbox slot="dropdown-content" class="dropdown-content" selected="{{queryParams.program}}" attr-for-selected="item-id">\n          <paper-item></paper-item>\n        <template is="dom-repeat" items="[[_toArray(programs)]]" as="program">\n          <paper-item item-id="[[program.id]]">[[program.data.name]]</paper-item>\n        </template>\n        </paper-listbox>\n      </paper-dropdown-menu>\n      <paper-dropdown-menu label="Academic home" hidden\\$="[[!academics]]">\n        <paper-listbox slot="dropdown-content" class="dropdown-content" selected="{{queryParams.academic}}" attr-for-selected="item-id">\n          <paper-item></paper-item>\n        <template is="dom-repeat" items="[[_toArray(academics)]]" as="academic">\n          <paper-item item-id="[[academic.id]]">[[academic.data.name]]</paper-item>\n        </template>\n        </paper-listbox>\n      </paper-dropdown-menu>\n    </app-toolbar>\n    <div class="courses-grid">\n    <iron-pages selected="{{data.page}}" attr-for-selected="name" fallback-selection="courses" role="main">\n      <div class="iron-list-container" name="courses">\n        <iron-list items="[[courses]]" as="course" grid="">\n          <template>\n          <paper-button data-course-id\\$="[[course.id]]" class="coursecard-wrapper" on-tap="_loadCourseUrl">\n            <lrnapp-cis-course-card elevation="2" data-course-id\\$="[[course.id]]" name="[[course.data.name]]" image="[[course.data.image]]" title="[[course.data.title]]" color="[[course.data.color]]">\n            </lrnapp-cis-course-card>\n          </paper-button>\n          </template>\n        </iron-list>\n      </div>\n    </iron-pages>\n    </div>\n    <paper-toast id="toast"></paper-toast>\n'
      ]
    );
    _templateObject_8df0ee90dbb911e8919b87078017787e = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_8df0ee90dbb911e8919b87078017787e()
    ),
    is: "lrnapp-cis",
    properties: ((_properties = {
      cisResponse: { type: Object },
      courses: {
        type: Array,
        computed: "_coursesCompute(originalCourses, queryParams)"
      },
      originalCourses: { type: Array }
    }),
    babelHelpers.defineProperty(_properties, "courses", {
      type: Array,
      value: []
    }),
    babelHelpers.defineProperty(_properties, "programs", {
      type: Array,
      value: []
    }),
    babelHelpers.defineProperty(_properties, "academics", {
      type: Array,
      value: []
    }),
    babelHelpers.defineProperty(_properties, "sourcePath", { type: String }),
    babelHelpers.defineProperty(_properties, "endPoint", {
      type: String,
      value: "/"
    }),
    babelHelpers.defineProperty(_properties, "basePath", {
      type: String,
      value: "/"
    }),
    babelHelpers.defineProperty(_properties, "activeCourse", {
      type: String,
      value: null
    }),
    babelHelpers.defineProperty(_properties, "queryParams", {
      type: Object,
      notify: !0
    }),
    babelHelpers.defineProperty(_properties, "_blockcycle", {
      type: Boolean,
      value: !1
    }),
    _properties),
    listeners: { "route-change": "_routeChange" },
    observers: ["_routeChanged(route, endPoint)"],
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
      if (babelHelpers.typeof(details.queryParams.course) !== "undefined") {
        this.set("queryParams.course", details.queryParams.course);
      }
      if (babelHelpers.typeof(details.queryParams.academic) !== "undefined") {
        this.set("queryParams.academic", details.queryParams.academic);
      }
      if (babelHelpers.typeof(details.queryParams.program) !== "undefined") {
        this.set("queryParams.program", details.queryParams.program);
      }
      if (babelHelpers.typeof(details.data.page) !== "undefined") {
        this.set("data.page", details.data.page);
      }
    },
    _toArray: function _toArray(obj) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    },
    _handleResponse: function _handleResponse() {
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
    _loadCourseUrl: function _loadCourseUrl(e) {
      var root = this,
        normalizedEvent = (0, _polymerDom.dom)(e),
        local = normalizedEvent.localTarget,
        active = local.getAttribute("data-course-id"),
        findCourse = this.originalCourses.filter(function(course) {
          if (course.id !== active) {
            return !1;
          }
          return !0;
        });
      if (0 < findCourse.length) {
        findCourse = findCourse.pop();
      }
      if (babelHelpers.typeof(findCourse.data.uri) !== "undefined") {
        window.location.href = findCourse.data.uri;
      }
    },
    _coursesCompute: function _coursesCompute(originalCourses, queryParams) {
      console.log(originalCourses);
      console.log(queryParams);
      if ("undefined" === typeof originalCourses) {
        return [];
      }
      var root = this,
        filteredCourses = [];
      filteredCourses = originalCourses.filter(function(course) {
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
      setTimeout(function() {
        document.querySelector("iron-list").fire("iron-resize");
      }, 200);
      return filteredCourses;
    }
  });
});
