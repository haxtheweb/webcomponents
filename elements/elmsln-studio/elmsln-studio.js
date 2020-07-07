/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { router } from "lit-element-router";
import { ElmslnStudioUtilities } from "./lib/elmsln-studio-utilities.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "./lib/elmsln-studio-main.js";
import "./lib/elmsln-studio-link.js";
import "./lib/elmsln-studio-dashboard.js";
import "./lib/elmsln-studio-submissions.js";
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
class ElmslnStudio extends router(ElmslnStudioUtilities(LitElement)) {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "elmsln-studio";
  }
  
  render() {
    return html`
      <iron-ajax
        auto
        url="${this.profileSource}"
        handle-as="json"
        @response="${this._profileLoaded}"
      ></iron-ajax>
      <iron-ajax
        auto
        url="${this.activitySource}"
        handle-as="json"
        @response="${this._activityLoaded}"
      ></iron-ajax>
      <iron-ajax
        auto
        url="${this.submissionsSource}"
        handle-as="json"
        @response="${this._submissionsLoaded}"
      ></iron-ajax>
      <iron-ajax
        auto
        url="${this.discussionSource}"
        handle-as="json"
        @response="${this._discussionLoaded}"
      ></iron-ajax>
      <iron-ajax
        auto
        url="${this.portfoliosSource}"
        handle-as="json"
        @response="${this._portfoliosLoaded}"
      ></iron-ajax>
      <p>
        <elmsln-studio-link href="/">Dashboard</elmsln-studio-link>
        <elmsln-studio-link href="/submissions">Submissions</elmsln-studio-link>
      </p>
      <br />
      <elmsln-studio-main active-route="${this.route}">
        <elmsln-studio-dashboard
          route="dashboard"
          .profile="${this.profile || {}}"
          .activity="${this.activity || []}"
          route="dashboard"
        >
        </elmsln-studio-dashboard>
        <elmsln-studio-submissions
          route="submissions"
          .submissions="${this.submissions}"
          .comments="${Object.keys(this.discussion || {})
            .map(i => this.discussion[i].feedback)
            .flat()}"
          ?grid="${this.query.grid || false}"
          student-filter="${this.query.student || ""}"
          assignment-filter="${this.query.assignment || ""}"
        >
        </elmsln-studio-submissions>
        <elmsln-studio-portfolio
          route="portfolios"
          .portfolio="${this._filterBy(
            this.portfolios,
            this.params.portfolio,
            "portfolio-"
          )}"
          .feedback="${this._filterBy(this.discussions, this.query.submission)
            .feedback || []}"
          .discussion-filter="${this.query.submission || ""}"
        >
        </elmsln-studio-portfolio>
      </elmsln-studio-main>
    `;
  }

  static get properties() {
    return {
      activity: { type: Array },
      activitySource: {
        type: String,
        reflect: true,
        attribute: "activity-source"
      },
      discussion: { type: Array },
      discussionSource: {
        type: String,
        reflect: true,
        attribute: "discussion-source"
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
      sourcePath: {
        type: String,
        reflect: true,
        attribute: "source-path"
      },
      submissions: { type: Array },
      submissionsSource: {
        type: String,
        reflect: true,
        attribute: "submissions-source"
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
    this.discussion = [];
    this.portfolios = {};
    this.profile = {};
    this.submissions = [];
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
      if (propName === "params") console.log, "params"(this.params);
      if (propName === "query") console.log("query", this.query);
    });
  }

  _filterBy(lookup, query, prefix) {
    return lookup && query && lookup[`${prefix}${query}`]
      ? lookup[`${prefix}${query}`]
      : {};
  }

  _loadDiscussion(e) {
    this.query.discussion = e.detail || true;
  }
  _profileLoaded(e) {
    console.log("_profileLoaded", e.detail.__data.response);
    this.profile = e.detail.__data.response;
  }
  _activityLoaded(e) {
    console.log("_activityLoaded", e.detail.__data.response);
    this.activity = e.detail.__data.response;
  }
  _submissionsLoaded(e) {
    console.log("_submissionsLoaded", e.detail.__data.response);
    this.submissions = e.detail.__data.response;
  }
  _discussionLoaded(e) {
    console.log("_discussionLoaded", e.detail.__data.response);
    this.discussion = e.detail.__data.response;
  }
  _portfoliosLoaded(e) {
    console.log("_portfoliosLoaded", e.detail.__data.response);
    this.portfolios = e.detail.__data.response;
  }
}
customElements.define(ElmslnStudio.tag, ElmslnStudio);
export { ElmslnStudio };
