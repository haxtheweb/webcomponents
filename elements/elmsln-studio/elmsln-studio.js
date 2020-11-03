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
import "./lib/elmsln-studio-assignment.js";
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
          .discussion="${this.recentDiscussions}"
          .profile="${this.profile}"
          .submissions="${this.recentSubmissions}"
          route="dashboard"
          @fetch-data="${this._handleFetch}"
        >
        </elmsln-studio-dashboard>
        <elmsln-studio-submissions
          ?demo-mode="${this.demoMode}"
          route="submissions"
          .submissions="${this.completedSubmissions}"
          .comments="${!this.discussion
            ? undefined
            : Object.keys(this.discussion || {}).map(
                (key) => this.discussion[key]
              )}"
          ?grid="${this.query.grid || false}"
          student-filter="${this.query.student || ""}"
          assignment-filter="${this.query.assignment || ""}"
          project-filter="${this.query.project || ""}"
          @fetch-data="${this._handleFetch}"
        >
        </elmsln-studio-submissions>
        <elmsln-studio-portfolio
          ?demo-mode="${this.demoMode}"
          route="portfolios"
          .portfolio="${this.portfolio}"
          .feedback="${this.submissionFeedback}"
          student-id="${this.query.student || ""}"
          assignment-id="${this.query.assignment || ""}"
          project-id="${this.query.project || ""}"
          ?sort-latest="${this.query.sort === "latest"}"
          submission-filter="${this.query.submission || ""}"
          comment="${this.query.comment || ""}"
          @fetch-data="${this._handleFetch}"
        >
        </elmsln-studio-portfolio>
        <elmsln-studio-assignments
          ?demo-mode="${this.demoMode}"
          route="assignments"
          .lessons="${this.lessons || {}}"
          .profile="${this.profile || {}}"
          @fetch-data="${this._handleFetch}"
        >
        </elmsln-studio-assignments>
        <elmsln-studio-assignment
          ?demo-mode="${this.demoMode}"
          route="assignment"
          .assignment="${this.assignment}"
          .submission="${this.submission}"
          @fetch-data="${this._handleFetch}"
        >
        </elmsln-studio-assignment>
      </elmsln-studio-main>
    `;
  }

  static get properties() {
    return {
      ...super.properties,
      assignments: { type: Object },
      assignmentsSource: {
        type: String,
        reflect: true,
        attribute: "assignments-source",
      },
      discussion: { type: Object },
      discussionSource: {
        type: String,
        reflect: true,
        attribute: "discussion-source",
      },
      lessons: { type: Object },
      lessonsSource: {
        type: String,
        reflect: true,
        attribute: "lessons-source",
      },
      portfolios: { type: Object },
      portfoliosSource: {
        type: String,
        reflect: true,
        attribute: "portfolios-source",
      },
      profile: { type: Object },
      profileSource: {
        type: String,
        reflect: true,
        attribute: "profile-source",
      },
      profiles: { type: Object },
      profilesSource: {
        type: String,
        reflect: true,
        attribute: "profiles-source",
      },
      projects: { type: Array },
      projectsSource: {
        type: String,
        reflect: true,
        attribute: "projects-source",
      },
      sourcePath: {
        type: String,
        reflect: true,
        attribute: "source-path",
      },
      submissions: { type: Object },
      submissionsSource: {
        type: String,
        reflect: true,
        attribute: "submissions-source",
      },
      users: { type: Object },
      usersSource: {
        type: String,
        reflect: true,
        attribute: "users",
      },
      route: { type: String },
      params: { type: Object },
      query: { type: Object },
      data: { type: Object },
    };
  }

  static get routes() {
    return [
      {
        name: "assignments",
        pattern: "assignments",
      },
      {
        name: "assignment",
        pattern: "assignments/:assignment",
      },
      {
        name: "submissions",
        pattern: "submissions",
      },
      {
        name: "portfolios",
        pattern: "portfolios/:portfolio",
      },
      {
        name: "dashboard",
        pattern: "*",
        data: { title: "Home" },
      },
    ];
  }

  constructor() {
    super();
    window.ElmslnStudioPath = "";
    this.assignments = {};
    this.lessons = {};
    this.projects = {};
    this.profile = {};
    this.profiles = {};
    this.users = {};

    this.route = "";
    this.params = {};
    this.query = {};
    this.data = {};
    this.refreshDates = {};
  }

  router(route, params, query, data) {
    this.route = route;
    this.params = params;
    this.query = query;
    this.data = data;
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    this.fetchData("users");
  }
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "params") console.log("params", this.params);
      if (propName === "query") console.log("query", this.query);
    });
  }

  get assignment() {
    console.log("assignment", this.params.assignment, this.assignments);
    return this.params.assignment
      ? this.assignments[this.params.assignment]
      : {};
  }
  get recentDiscussions() {
    if (this.discussion) {
      let discussions = [];
      discussions = Object.keys(this.discussion || {}).map(
        (key) => this.discussion[key]
      );
      discussions.forEach((d) =>
        (d.replies || []).forEach((r) => discussions.push(r))
      );
      return this.sortDates(discussions).slice(0, 10);
    }
    return undefined;
  }
  get recentSubmissions() {
    return !this.completedSubmissions
      ? undefined
      : this.sortDates(
          Object.keys(this.completedSubmissions || {}).map(
            (key) => this.completedSubmissions[key]
          )
        ).slice(0, 5);
  }

  get completedSubmissions() {
    return !this.submissions
      ? undefined
      : Object.keys(this.submissions || {})
          .filter((key) => !!this.submissions[key].date)
          .map((key) => this.submissions[key]);
  }

  get submission() {
    let submissions =
      this.profile.submissions && this.params.assignment
        ? this.profile.submissions.filter(
            (s) => s.assignmentId === this.params.assignment
          )
        : undefined;
    return submissions && submissions[0] ? submissions[0] : undefined;
  }
  get portfolio() {
    console.log("portfolios", this.portfolios, this.params.portfolio);
    return this.params.portfolio && this.portfolios
      ? this.portfolios[this.params.portfolio]
      : undefined;
  }
  get submissionFeedback() {
    return !this.query.submission || !this.discussion
      ? undefined
      : Object.keys(this.discussion || {})
          .filter(
            (key) => this.discussion[key].submissionId == this.query.submission
          )
          .map((key) => this.discussion[key]);
  }

  _filterBy(lookup, query, prefix = "") {
    return lookup && query && lookup[`${prefix}${query}`]
      ? lookup[`${prefix}${query}`]
      : {};
  }
  fetchData(source, propName, params) {
    console.log("fetchData", source, propName, params);
    fetch(this._getPath(source, params))
      .then((response) => {
        if (response && response.json) return response.json();
        return false;
      })
      .then((data) => {
        if (data) {
          this[propName] = data;
          this.refreshDates[propName] = new Date();
          console.log(
            `${propName} Loaded`,
            source,
            data,
            this[propName],
            this.refreshDates
          );
        }
      });
  }

  _handleFetch(e = { detail: {} }) {
    console.log("_handleFetch", e);
    let type = e.detail.type,
      refresh = e.detail.refresh,
      source = `${type}Source`;
    console.log("_handleFetch", type, refresh, source);
    if (refresh || !this.refreshDates[type]) {
      this.fetchData(this[source], type);
    }
  }
  _getPath(path, params) {
    console.log("_getPath", path, params);
    let query = Object.keys(params || {})
      .map((p) => `${encodeURI(p)}=${encodeURI(params[p])}`)
      .join("&");
    return query ? `${path}?${query}` : path;
  }
}
customElements.define(ElmslnStudio.tag, ElmslnStudio);
export { ElmslnStudio };
