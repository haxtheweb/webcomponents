/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { router } from "lit-element-router";
import { ElmslnStudioUtilities } from "./lib/elmsln-studio-utilities.js";
import { ElmslnStudioStyles } from "./lib/elmsln-studio-styles.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "./lib/elmsln-studio-main.js";
import "./lib/elmsln-studio-link.js";
import "./lib/elmsln-studio-button.js";
import "./lib/elmsln-studio-dashboard.js";
import "./lib/elmsln-studio-submissions.js";
import "./lib/elmsln-studio-assignments.js";
import "./lib/elmsln-studio-portfolio.js";
/**
 * `elmsln-studio`
 * Studio App for ELMS:LN
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement elmsln-studio
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class ElmslnStudio extends router(
  ElmslnStudioUtilities(ElmslnStudioStyles(LitElement))
) {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "elmsln-studio";
  }

  render() {
    return html`
      <div id="studio-nav">
        <elmsln-studio-link ?active="${this.route === "dashboard"}" href="/"
          >Dashboard</elmsln-studio-link
        >
        <elmsln-studio-link
          ?active="${this.route === "submissions" ||
            this.route === "portfolios"}"
          href="/submissions"
          >Submissions</elmsln-studio-link
        >
        <elmsln-studio-link
          ?active="${this.route === "assignments"}"
          href="/assignments"
          >Assignments</elmsln-studio-link
        >
        <elmsln-studio-link
          ?active="${this.route === "activity"}"
          href="/activity"
          >Activity Index</elmsln-studio-link
        >
      </div>
      <br />
      <elmsln-studio-main active-route="${this.route}">
        <elmsln-studio-dashboard
          ?demo-mode="${this.demoMode}"
          route="dashboard"
          .profile="${this.profile}"
          .activity="${this.activity}"
          route="dashboard"
        >
        </elmsln-studio-dashboard>
        <elmsln-studio-submissions
          ?demo-mode="${this.demoMode}"
          route="submissions"
          .submissions="${Object.keys(this.submissions || {}).map(
            key => this.submissions[key]
          )}"
          .comments="${Object.keys(this.discussion || {}).map(
            key => this.discussion[key]
          )}"
          ?grid="${this.query.grid || false}"
          student-filter="${this.query.student || ""}"
          assignment-filter="${this.query.assignment || ""}"
          project-filter="${this.query.project || ""}"
        >
        </elmsln-studio-submissions>
        <elmsln-studio-portfolio
          ?demo-mode="${this.demoMode}"
          route="portfolios"
          .portfolio="${this.portfolio}"
          .submission="${this.submissionFeedback}"
          ?sort-latest="${this.query.sort === "latest"}"
          submission-filter="${this.query.submission || ""}"
          comment="${this.query.comment || ""}"
        >
        </elmsln-studio-portfolio>
        <elmsln-studio-assignments
          ?demo-mode="${this.demoMode}"
          route="assignments"
          .lessons="${this.lessons || {}}"
          .profile="${this.profile || {}}"
        >
        </elmsln-studio-assignments>
      </elmsln-studio-main>
    `;
  }

  static get properties() {
    return {
      ...super.properties,

      activity: { type: Array },
      activitySource: {
        type: String,
        reflect: true,
        attribute: "activity-source"
      },
      assignments: { type: Object },
      assignmentsSource: {
        type: String,
        reflect: true,
        attribute: "assignments-source"
      },
      demoImagesSource: {
        type: String,
        reflect: true,
        attribute: "demo-images-source"
      },
      discussion: { type: Object },
      discussionSource: {
        type: String,
        reflect: true,
        attribute: "discussion-source"
      },
      lessons: { type: Object },
      lessonsSource: {
        type: String,
        reflect: true,
        attribute: "lessons-source"
      },
      portfolios: { type: Object },
      portfoliosSource: {
        type: String,
        reflect: true,
        attribute: "portfolios-source"
      },
      profile: { type: Object },
      profileSource: {
        type: String,
        reflect: true,
        attribute: "profile-source"
      },
      projects: { type: Array },
      projectsSource: {
        type: String,
        reflect: true,
        attribute: "projects-source"
      },
      sourcePath: {
        type: String,
        reflect: true,
        attribute: "source-path"
      },
      submissions: { type: Object },
      submissionsSource: {
        type: String,
        reflect: true,
        attribute: "submissions-source"
      },
      users: { type: Object },
      usersSource: {
        type: String,
        reflect: true,
        attribute: "users"
      },
      route: { type: String },
      params: { type: Object },
      query: { type: Object },
      data: { type: Object }
    };
  }

  static get routes() {
    return [
      {
        name: "assignments",
        pattern: "assignments"
      },
      {
        name: "submissions",
        pattern: "submissions"
      },
      {
        name: "portfolios",
        pattern: "portfolios/:portfolio"
      },
      {
        name: "dashboard",
        pattern: "*",
        data: { title: "Home" }
      }
    ];
  }

  constructor() {
    super();
    this.activity = [];
    this.assignments = {};
    this.discussion = {};
    this.lessons = {};
    this.portfolios = {};
    this.projects = {};
    this.profile = {};
    this.submissions = {};
    this.users = {};

    this.route = "";
    this.params = {};
    this.query = {};
    this.data = {};
  }

  router(route, params, query, data) {
    this.route = route;
    this.params = params;
    this.query = query;
    this.data = data;
  }
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "params") console.log("params", this.params);
      if (propName === "query") console.log("query", this.query);
      if (propName === "usersSource") this.fetchData(this.usersSource, "users");
      if (propName === "profileSource")
        this.fetchData(this.profileSource, "profile");
      if (propName === "activitySource")
        this.fetchData(this.activitySource, "activity");
      if (propName === "lessonsSource")
        this.fetchData(this.lessonsSource, "lessons");
      if (propName === "projectsSource")
        this.fetchData(this.projectsSource, "projects");
      if (propName === "assignmentsSource")
        this.fetchData(this.assignmentsSource, "assignments");
      if (propName === "portfoliosSource")
        this.fetchData(this.portfoliosSource, "portfolios");
      if (propName === "submissionsSource")
        this.fetchData(this.submissionsSource, "submissions");
      if (propName === "discussionSource")
        this.fetchData(this.discussionSource, "discussion");
      if (propName === "demoImagesSource")
        this.fetchData(this.demoImagesSource, "demoImages");
      if (
        propName === "demoImages" &&
        this.shadowRoot
      ) {
        let images = this.demoImages.map(
          img => `${this.sourcePath}${img.replace(/^\.\//, "")}`
        );
        this.shadowRoot.querySelectorAll(
          "elmsln-studio-submissions,elmsln-studio-portfolio"
        ).forEach(el=>el.demoImages = images);
      }
    });
  }
  get portfolio() {
    return this.params.portfolio ? this.portfolios[this.params.portfolio] : {};
  }
  get submissionFeedback() {
    return !this.query.submission
      ? []
      : Object.keys(this.discussion || {})
          .filter(
            key => this.discussion[key].submissionId == this.query.submission
          )
          .map(key => this.discussion[key]);
  }

  _filterBy(lookup, query, prefix = "") {
    return lookup && query && lookup[`${prefix}${query}`]
      ? lookup[`${prefix}${query}`]
      : {};
  }
  fetchData(source, propName, params) {
    fetch(this._getPath(source, params))
      .then(response => response.json())
      .then(data => {
        this[propName] = data;
        console.log(`${propName} Loaded`, data, this[propName]);
      });
  }
  _getPath(path, params) {
    let query = Object.keys(params || {})
      .map(p => `${encodeURI(p)}=${encodeURI(params[p])}`)
      .join("&");
    return query ? `${path}?${query}` : path;
  }
}
customElements.define(ElmslnStudio.tag, ElmslnStudio);
export { ElmslnStudio };
