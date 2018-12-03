import "./lrnapp-cis-course-card.js";
/**
 `lrnapp-cis`
 A learning application for visualizing course information and listing.

@demo ../../demo/index.html

@microcopy - the mental model for this app
 - cis - Course Information System
 -

*/
Polymer({
  _template: `
    <style include="materializecss-styles"></style>
    <style>
      :host {
        display: block;
        align-content: center;
      }
      #loading {
        width: 100%;
        z-index: 1000;
        opacity: .9;
        padding: 4em 0 0 0;
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
      paper-button.coursecard-wrapper:focus {
        outline: blue solid 1px;
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
      .dialog-header {
        height: unset !important;
        padding: 0 !important;
      }
      .course-dialog-heading.lrndesign-course-banner {
        font-size: 1em;
        height: 4em !important;
      }
      #coursedetails {
        margin-top: 1em;
      }
      #confirm {
        max-width: 400px;
        max-height: 300px;
      }
      .buttons {
        text-align: center;
      }
      .buttons paper-button {
        width: 10em;
        height: 4em;
      }
      .dialog-body {
        padding: 1em;
        font-size: 1.8em;
        text-align: center;
        margin: 0 auto;
      }
      .dialog-body lrn-icon.service-confirm-icon {
        width: 5em;
        height: 5em;
      }
      .dialog-body responsive-grid-col {
        height: 4.5em;
      }
      .dialog-body lrndesign-avatar.service-confirm-icon {
        display: inline-block;
      }
    </style>
    <iron-ajax auto="" url="[[sourcePath]]" params="" handle-as="json" last-response="{{_cisResponse}}" on-response="_handleResponse"></iron-ajax>
    <iron-ajax url="[[courseDataPath]]" params="[[_courseDataParams]]" handle-as="json" id="courserequest" last-response="{{_courseResponse}}" on-response="_handleCourseResponse"></iron-ajax>
    <iron-ajax url="[[makeServicePath]]" params="" handle-as="json" id="makeservice" last-response="{{_makeServiceResponse}}" on-response="_handleMakeServiceResponse"></iron-ajax>
    <div id="loading">
      <elmsln-loading color="grey-text" size="large"></elmsln-loading>
      <h3>Loading..</h3>
    </div>
    <app-toolbar class="">
      <span main-title=""></span>
      <span top-item="" style="text-align:right;font-size:.5em;padding-right:1em;">Displaying [[courses.length]] of [[originalCourses.length]]</span>
      <paper-dropdown-menu label="Course" hidden\$="[[!courses]]">
        <paper-listbox slot="dropdown-content" class="dropdown-content" selected="{{queryParams.course}}" attr-for-selected="item-id">
          <paper-item>-- Any --</paper-item>
          <template is="dom-repeat" items="[[_toArray(originalCourses)]]" as="course">
          <paper-item item-id="[[course.id]]">[[course.attributes.name]]</paper-item>
          </template>
        </paper-listbox>
      </paper-dropdown-menu>
      <paper-dropdown-menu label="Program" hidden\$="[[!programs]]">
        <paper-listbox slot="dropdown-content" class="dropdown-content" selected="{{queryParams.program}}" attr-for-selected="item-id">
          <paper-item>-- Any --</paper-item>
        <template is="dom-repeat" items="[[_toArray(programs)]]" as="program">
          <paper-item item-id="[[program.id]]">[[program.attributes.name]]</paper-item>
        </template>
        </paper-listbox>
      </paper-dropdown-menu>
      <paper-dropdown-menu label="Academic home" hidden\$="[[!academics]]">
        <paper-listbox slot="dropdown-content" class="dropdown-content" selected="{{queryParams.academic}}" attr-for-selected="item-id">
          <paper-item>-- Any --</paper-item>
        <template is="dom-repeat" items="[[_toArray(academics)]]" as="academic">
          <paper-item item-id="[[academic.id]]">[[academic.attributes.name]]</paper-item>
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
              <lrnapp-cis-course-card elevation="2" data-course-id\$="[[course.id]]" name="[[course.attributes.name]]" image="[[course.attributes.image]]" title="[[course.attributes.title]]" color="[[course.attributes.color]]">
              </lrnapp-cis-course-card>
            </paper-button>
            </template>
          </iron-list>
        </div>
      </iron-pages>
    </div>
    <app-location route="{{route}}" query-params="{{queryParams}}"></app-location>
    <app-route route="{{route}}" pattern="[[endPoint]]/:page" data="{{data}}" tail="{{tail}}" query-params="{{queryParams}}">
    </app-route>
    <lrnsys-dialog tabindex="-1" id="dialog" disable-auto-focus="">
      <div slot="content">
        <div id="loadingCourse" class="loading">
          <h3>Loading..</h3>
          <elmsln-loading color="grey-text" size="large"></elmsln-loading>
        </div>
      </div>
      <div class="dialog-header" slot="header">
        <lrndesign-course-banner image="[[activeCourse.attributes.image]]" name="[[activeCourse.attributes.name]]" title="[[activeCourse.attributes.title]]" color="[[activeCourse.attributes.color]] darken-4">
        </lrndesign-course-banner>
      </div>
      <div id="coursedetails" slot="content">
        <responsive-grid-row gutter="5">
          <responsive-grid-col xl="6" lg="6" md="6" sm="12" xs="12">
            <div class="column">
              <h4>Details</h4>
              <ul>
                <li hidden\$="[[!activeCourse.relationships.academic.attributes.name]]">Academic unit: [[activeCourse.relationships.academic.attributes.name]]</li>
                <li hidden\$="[[!activeCourse.relationships.program.attributes.name]]">Program: [[activeCourse.relationships.program.attributes.name]]</li>
              </ul>
              <h4>Learning Network</h4>
              <template is="dom-repeat" items="[[activeCourse.topology.Network]]" as="service">
                <template is="dom-if" if="[[!service._exists]]">
                  <lrnsys-button raised="" on-tap="_makeService" color="grey lighten-4" icon-class="grey lighten-5" data-machine-name\$="[[service.machine_name]]">
                    <lrn-icon data-machine-name\$="[[service.machine_name]]" icon="[[service.icon]]" class="elmsln-hover-icon"></lrn-icon>
                    <span data-machine-name\$="[[service.machine_name]]">Make the [[service.title]] service</span>
                  </lrnsys-button>
                </template>
                <template is="dom-if" if="[[service._exists]]">
                  <lrnsys-button raised="" href="[[service.url]]" hover-class="[[service.color]] lighten-4">
                    <lrn-icon icon="[[service.icon]]" class="elmsln-hover-icon"></lrn-icon>
                    <span>[[service.title]]</span>
                  </lrnsys-button>
                </template>
              </template>
            </div>
          </responsive-grid-col>
          <responsive-grid-col xl="6" lg="6" md="6" sm="12" xs="12">
            <div class="column">
              <h4>Operations</h4>
              <template is="dom-if" if="[[activeCourse.meta.canUpdate]]">
                <lrnsys-button raised="" href="[[activeCourse.uris.edit]]" label="Edit" hover-class="green lighten-4" icon="create"></lrnsys-button>
                <lrnsys-button raised="" href="[[activeCourse.uris.addOffering]]" label="Add offering" hover-class="amber lighten-3" icon="icons:add"></lrnsys-button>
              </template>
              <lrnsys-button raised="" href="[[activeCourse.uris.offerings]]" label="Offerings" hover-class="amber lighten-4" icon="social:people"></lrnsys-button>
              <lrnsys-button raised="" href="[[activeCourse.uris.sync]]" label="Sync Roster" hover-class="amber lighten-4" icon="notification:sync"></lrnsys-button>
              <lrnsys-button raised="" href="[[activeCourse.uris.uri]]" label="Course page (legacy)" hover-class="brown lighten-4" icon="delete"></lrnsys-button>
              <template is="dom-if" if="[[activeCourse.meta.canDelete]]">
                <div style="padding: 1em;width: 100%;margin: .5em 0;display: block;background-color:#FF2222;color:#ffffff;border: 1px solid #222222;">
                  <h4>Danger zone</h4>
                  <lrnsys-button raised="" href="[[activeCourse.uris.delete]]" label="Delete" hover-class="red lighten-1" color="red lighten-3" icon="delete"></lrnsys-button>
                </div>
              </template>
            </div>
          </responsive-grid-col>
        </responsive-grid-row>
        <p>[[activeCourse.attributes.body]]</p>
      </div>
    </lrnsys-dialog>
    <lrnsys-dialog id="confirm">
      <div class="dialog-header" slot="header">
        Add this to the <strong>[[activeCourse.attributes.title]]</strong> network?
      </div>
      <div class="dialog-body">
        <responsive-grid-row gutter="5">
          <responsive-grid-col xl="3" lg="3" md="3" sm="3" xs="3"></responsive-grid-col>
          <responsive-grid-col xl="1" lg="1" md="1" sm="1" xs="1">Add</responsive-grid-col>
          <responsive-grid-col xl="2" lg="2" md="2" sm="2" xs="2"><lrn-icon icon="[[_activeService.icon]]" class\$="[[_activeService.color]]-text elmsln-hover-icon service-confirm-icon"></lrn-icon></responsive-grid-col>
          <responsive-grid-col xl="3" lg="3" md="3" sm="3" xs="3"><strong>[[_activeService.title]]</strong></responsive-grid-col>
          <responsive-grid-col xl="3" lg="3" md="3" sm="3" xs="3"></responsive-grid-col>
        </responsive-grid-row>
        <responsive-grid-row gutter="5">
          <responsive-grid-col xl="3" lg="3" md="3" sm="3" xs="3"></responsive-grid-col>
          <responsive-grid-col xl="1" lg="1" md="1" sm="1" xs="1">To</responsive-grid-col>
          <responsive-grid-col xl="2" lg="2" md="2" sm="2" xs="2"><lrndesign-avatar class="service-confirm-icon" label="[[activeCourse.attributes.name]]" jdenticon="" color="[[activeCourse.attributes.color]] darken-4">
          </lrndesign-avatar></responsive-grid-col>
          <responsive-grid-col xl="3" lg="3" md="3" sm="3" xs="3"><strong>[[activeCourse.attributes.title]]</strong></responsive-grid-col>
          <responsive-grid-col xl="3" lg="3" md="3" sm="3" xs="3"></responsive-grid-col>
        </responsive-grid-row>
        <div style="margin-top:1em;">This will take a few moments.</div>
      </div>
      <div class="buttons">
        <paper-button raised="" dialog-confirm="" autofocus="" on-tap="_confirmBuild" class="green">Let's do it!</paper-button>
        <paper-button dialog-dismiss="" class="red-text">Oops, go back.</paper-button>
      </div>
    </lrnsys-dialog>
    <paper-toast id="toast"></paper-toast>
`,

  is: "lrnapp-cis",

  properties: {
    /**
     * The load initial data
     */
    _cisResponse: {
      type: Object
    },
    /**
     * Load individual course data
     */
    _courseResponse: {
      type: Object
    },
    /**
     * Load service creation response
     */
    _makeServiceResponse: {
      type: Object
    },
    /**
     * The courses to render; potentially filtered
     */
    courses: {
      type: Array,
      value: [],
      computed: "_coursesCompute(originalCourses, queryParams)"
    },
    /**
     * The original courses array; used to filter against
     */
    originalCourses: {
      type: Array,
      value: [],
      notify: true
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
     * pathway to access info about a single course.
     */
    courseDataPath: {
      type: String
    },
    /**
     * pathway to creating new service instances
     */
    makeServicePath: {
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
      type: Array,
      value: null
    },
    queryParams: {
      type: Object,
      notify: true
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
        // ignore "home page" as well since that's our path
        if (route.path.startsWith(endPoint) || route.path == "/") {
          return;
        }
      }
      this.$.loading.hidden = false;
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
   * Handle course response for additional details about the item
   */
  _handleMakeServiceResponse: function(event) {
    // get the CIS response's data and convert to array ahead of time
    var response = this._makeServiceResponse;
    let activeCourse = this.__addServiceLinks(response.data.course);
    this.set("activeCourse", []);
    this.set("activeCourse", activeCourse);
    this.$.toast.show(response.message);
  },

  /**
   * Handle course response for additional details about the item
   */
  _handleCourseResponse: function(event) {
    // get the CIS response's data and convert to array ahead of time
    var activeCourse = this._courseResponse.data.course;
    this.__addServiceLinks(activeCourse);
    this.set("activeCourse", []);
    this.set("activeCourse", activeCourse);
    this.$.loadingCourse.hidden = true;
  },

  /**
   * Helper to mash up services that exist with those that could.
   */
  __addServiceLinks: function(courseObject) {
    // ensure there's a part for the Network people can request
    if (typeof courseObject.topology.Network === typeof undefined) {
      courseObject.topology.Network = {};
    }
    // loop our services to see what we should add as options
    for (var key in this.services) {
      // if it's not in the topology that means it can be added
      if (
        typeof courseObject.topology.Network[
          this.services[key].attributes.machine_name
        ] === typeof undefined
      ) {
        // if we get a miss that means we should add a "Add this" version
        courseObject.topology.Network[
          this.services[key].attributes.machine_name
        ] = {
          color: this.services[key].attributes.color,
          distro: this.services[key].attributes.distro,
          icon: this.services[key].attributes.icon,
          machine_name: this.services[key].attributes.machine_name,
          title: this.services[key].attributes.title,
          url: this.services[key].attributes.url,
          weight: this.services[key].attributes.weight,
          _exists: false
        };
      }
    }
    // convert to array after keys in place for the object
    courseObject.topology.Network = this._toArray(
      courseObject.topology.Network
    );
    // sort items based on weight of the things in the network
    // so we have a consistent order to things
    courseObject.topology.Network.sort(function(a, b) {
      return a.weight - b.weight;
    });
    return courseObject;
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
    var courses = this._toArray(this._cisResponse.data.courses);
    this.set("services", this._toArray(this._cisResponse.data.services));
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
  },

  /**
   * Request a new service to kick off.
   */
  _makeService: function(e) {
    var normalizedEvent = dom(e);
    let active = normalizedEvent.localTarget.getAttribute("data-machine-name");
    const network = this.activeCourse.topology.Network;
    let service = network.filter(service => {
      if (service.machine_name !== active) {
        return false;
      }
      return true;
    });
    // if we found one, make it the top level item
    if (service.length > 0) {
      service = service.pop();
      this.$.makeservice.params = {
        course: this.activeCourse.attributes.machine_name,
        service: service.machine_name
      };
      this._activeService = service;
      // confirm via paper prompt
      this.$.confirm.toggleDialog();
    } else {
      console.log("that was not a valid service..");
    }
  },

  /**
   * Confirm of build.
   */
  _confirmBuild: function(e) {
    this.$.makeservice.generateRequest();
  },

  /**
   * Attached lifecycle
   */
  attached: function() {
    // listen for focus event to have fired
    document.body.addEventListener(
      "lrnsys-dialog-modal-closed",
      this._accessibleFocus.bind(this)
    );
  },

  /**
   * Set ourselves as having focus after the modal closes.
   */
  _accessibleFocus: function(e) {
    // focus on our dialog triggering button
    this.__rememberClick.focus();
  },

  /**
   * Handle tap on paper-button above to redirect to the correct course url.
   */
  _loadCourseUrl: function(e) {
    this.__rememberClick = e.target;
    // reset dialog to appear to be loading
    this.$.loadingCourse.hidden = false;
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
    this.activeCourse = findCourse;
    // formulate the post data
    this._courseDataParams = {
      id: this.activeCourse.id
    };
    // @todo look at query cache mechanism to skip calls
    // if they've already happened. lrnapp-book has some stuff to do this
    this.$.courserequest.generateRequest();
    this.$.dialog.toggleDialog();
  },

  /**
   * Compute the active list of courses
   */
  _coursesCompute: function(originalCourses, queryParams) {
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
