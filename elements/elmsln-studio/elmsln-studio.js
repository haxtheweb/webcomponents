/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { router } from "lit-element-router";
import { ElmslnStudioUtilities } from "./lib/elmsln-studio-utilities.js";
import { ElmslnStudioStyles } from "./lib/elmsln-studio-styles.js";
import "./lib/elmsln-studio-main.js";
import "./lib/elmsln-studio-link.js";
import "./lib/elmsln-studio-button.js";
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
          ?active="${this.route === "submissions" || this.route === "project"}"
          href="/submissions"
          >Submissions</elmsln-studio-link
        >
        <elmsln-studio-link
          ?active="${this.route === "assignments" ||
          this.route === "assignment"}"
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
          .discussion="${this.recentDiscussions}"
          @fetch-data="${this._handleFetch}"
          route="dashboard"
          .profile="${this.profile}"
          .submissions="${this.recentSubmissions}"
        >
        </elmsln-studio-dashboard>
        <elmsln-studio-submissions
          assignment-filter="${this.query.assignment || ""}"
          .comments="${!this.discussion
            ? undefined
            : Object.keys(this.discussion || {}).map(
                (key) => this.discussion[key]
              )}"
          ?demo-mode="${this.demoMode}"
          @fetch-data="${this._handleFetch}"
          ?grid="${this.query.grid || false}"
          route="submissions"
          project-filter="${this.query.project || ""}"
          student-filter="${this.query.student || ""}"
          .submissions="${this.completedSubmissions}"
        >
        </elmsln-studio-submissions>
        <elmsln-studio-portfolio
          comment="${this.query.comment || ""}"
          ?demo-mode="${this.demoMode}"
          .feedback="${this.submissionFeedback}"
          @fetch-data="${this._handleFetch}"
          .portfolio="${this.portfolio}"
          route="project"
          ?sort-latest="${this.query.sort === "latest"}"
          submission-filter="${this.query.submission || ""}"
          .navigation="${this.prevNextSubmission}"
        >
        </elmsln-studio-portfolio>
        <elmsln-studio-assignments
          ?demo-mode="${this.demoMode}"
          @fetch-data="${this._handleFetch}"
          .lessons="${this.lessons}"
          .profile="${this.profile}"
          route="assignments"
        >
        </elmsln-studio-assignments>
        <elmsln-studio-assignment
          .assignment="${this.assignment}"
          .assignments="${this.assignments}"
          ?demo-mode="${this.demoMode}"
          @fetch-data="${this._handleFetch}"
          route="assignment"
          .submission="${this.submission}"
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
        attribute: "users-source",
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
        name: "project",
        pattern: "project/:portfolio",
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
    this.baseUrl = "/";
    this.route = "";
    this.params = {};
    this.query = {};
    this.data = {};
    this.refreshDates = {};
  }

  router(route, params, query, data) {
    console.log("ElmslnStudioPath router", route);
    this.route = route;
    this.params = params;
    this.query = query;
    this.data = data;
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    import("./lib/elmsln-studio-dashboard.js");
    import("./lib/elmsln-studio-submissions.js");
    import("./lib/elmsln-studio-assignments.js");
    import("./lib/elmsln-studio-assignment.js");
    import("./lib/elmsln-studio-portfolio.js");
    this.fetchData(this.usersSource, "users");
  }
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      //if (propName === "params") console.log("params", this.params);
      //if (propName === "query") console.log("query", this.query);
    });
  }

  get assignment() {
    return this.assignments && this.params.assignment
      ? this.assignments[this.params.assignment]
      : undefined;
  }
  get lesson() {
    let lessonId = (this.assignment || {}).lessonId;
    return this.getLesson(lessonId);
  }
  get project() {
    let projectId = (this.assignment || {}).projectId,
      lessonId = (this.assignment || {}).lessonId;
    return this.getProject(lessonId, projectId);
  }
  getLesson(lessonId) {
    return !lessonId
      ? undefined
      : this.lessons[lessonId] || { assignments: [] };
  }
  getProject(lessonId, projectId) {
    let lesson = this.getLesson(lessonId),
      projects =
        !lesson || !projectId
          ? []
          : (lesson.assignments || []).filter(
              (assignment) => assignment.id === projectId
            );
    return projects ? projects[0] : undefined;
  }
  get feedbackPercentile() {
    let score =
        !this.profile || !this.profile.given ? undefined : this.profile.length,
      scores = !this.profiles
        ? undefined
        : this.profiles
            .map((p) => (p.given ? p.given.length : undefined))
            .filter((p) => !!p);
    console.log("feedbackPercentile", score, scores);
    return !score || scores.length < 2
      ? undefined
      : this.getPercentile(scores, score);
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
  get filteredPortfolios() {
    let prev,
      portfolios = {},
      getPrefix = (id) => (!id ? undefined : id.replace(/-\w+$/, "")),
      portfolioId = !this.params.portfolio
        ? undefined
        : getPrefix(this.params.portfolio),
      assignmentId = !this.query.submission
        ? undefined
        : getPrefix(this.query.submission);
    if (!portfolioId || !this.portfolios) {
      return undefined;
    } else {
      Object.keys(this.portfolios || {}).forEach((i) => {
        let portfolio = this.portfolios[i],
          project = getPrefix(i) === portfolioId,
          assignment =
            !project || !assignmentId || !portfolio.userId
              ? undefined
              : `${assignmentId}-${portfolio.userId}`,
          submission =
            project ||
            (this.portfolios[i].submissions &&
              assignment &&
              this.portfolios[i].submissions.includes(assignment));
        if (submission) {
          portfolios[i] = portfolio;
          portfolios[i].prev = prev;
          if (prev) prev.next = portfolios[i];
          prev = portfolios[i];
        }
      });
      return portfolios;
    }
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
  /**
   * given a student submission gets peer submissions
   *
   * @readonly
   * @memberof ElmslnStudio
   */
  get peerSubmissions() {
    return !this.completedSubmissions || !this.query.submission
      ? undefined
      : this.completedSubmissions.filter(
          (s) => s.assignmentId === this.query.submission.replace(/\-\w+$/, "")
        );
  }
  /**
   * gets the previous and next submission data for a given submission
   *
   * @readonly
   * @memberof ElmslnStudio
   */
  get prevNextSubmission() {
    let nav = {};
    for (let i = 0; i < (this.peerSubmissions || []).length; i++) {
      console.log(this.peerSubmissions[i], this.query.submission);
      if (this.peerSubmissions[i].id === this.query.submission) {
        nav.prev = !this.peerSubmissions[i - 1]
          ? undefined
          : { ...this.peerSubmissions[i - 1], activity: "submission" };
        nav.next = !this.peerSubmissions[i + 1]
          ? undefined
          : { ...this.peerSubmissions[i + 1], activity: "submission" };
        i = this.peerSubmissions.length;
      }
    }
    console.log(
      "prevNextSubmission",
      nav,
      nav !== {},
      nav !== {} ? nav : undefined,
      this.peerSubmissions
    );
    return nav !== {} ? nav : undefined;
  }

  get submission() {
    let submissions =
      this.profile && this.profile.submissions && this.params.assignment
        ? this.profile.submissions.filter(
            (s) => s.assignmentId === this.params.assignment
          )
        : undefined;
    return submissions && submissions[0] ? submissions[0] : undefined;
  }
  get portfolio() {
    return this.params.portfolio && this.filteredPortfolios
      ? this.filteredPortfolios[this.params.portfolio]
      : undefined;
  }
  get submissionFeedback() {
    console.log(
      "submissionFeedback",
      this.query.submission,
      !this.query.submission || !this.discussion
        ? undefined
        : Object.keys(this.discussion || {})
            .filter(
              (key) =>
                this.discussion[key].submissionId == this.query.submission
            )
            .map((key) => this.discussion[key])
    );
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
    let type = e.detail.type,
      refresh = e.detail.refresh,
      source = `${type}Source`;
    if (refresh || !this.refreshDates[type]) {
      this.fetchData(this[source], type);
    }
  }
  _getPath(path, params) {
    let query = Object.keys(params || {})
      .map((p) => `${encodeURI(p)}=${encodeURI(params[p])}`)
      .join("&");
    return query ? `${path}?${query}` : path;
  }
}
customElements.define(ElmslnStudio.tag, ElmslnStudio);
export { ElmslnStudio };
