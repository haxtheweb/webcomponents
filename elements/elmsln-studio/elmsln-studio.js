/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { router } from "lit-element-router";
import { ElmslnStudioUtilities } from "./lib/elmsln-studio-utilities.js";
import "./lib/elmsln-studio-main.js";
import "./lib/elmsln-studio-link.js";
import "./lib/elmsln-studio-dashboard.js";
//import "./lib/elmsln-studio-submissions.js";
//import "./lib/elmsln-studio-portfolio.js";
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

  static get properties() {
    return {
      activityData: {
        type: Array,
        attribute: "activity-data"
      },
      profileData: {
        type: Object,
        attribute: "profile-data"
      },
      submissionsData: {
        type: Array,
        attribute: "submissions-data"
      },
      portfolioData: { type: Object },
      activitySource: { type: String },
      profileSource: { type: String },
      submissionsSource: { type: String },
      portfolioSource: { type: String },
      activityParams: { type: String },
      profileParams: { type: String },
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
    this.route = "";
    this.params = {};
    this.query = {};
    this.data = {};
    this.profileData = {};
    this.submissionsData = [];
    this.activityData = [];
  }

  router(route, params, query, data) {
    this.route = route;
    this.params = params;
    this.query = query;
    this.data = data;
    console.log(route, params, query, data);
  }
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {});
    console.log("studio data", this.submissionsData);
  }

  render() {
    return html`
      <link
        ref="//fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;1,100;1,300;1,400;1,500;1,700&display=swap"
        rel="stylesheet"
      />
      <iron-ajax
        url="${this.profileSource}"
        params="${this.profileParams}"
        handle-as="json"
        last-response="${this.profileData}"
      ></iron-ajax>
      <iron-ajax
        url="${this.activitySource}"
        params="${this.activityParams}"
        handle-as="json"
        last-response="${this.profileData}"
      ></iron-ajax>
      <iron-ajax
        url="${this.submissionsSource}"
        handle-as="json"
        last-response="${this.submissionsData}"
      ></iron-ajax>
      <iron-ajax
        url="${this.portfolioSource}"
        params="${this.params.portfolio
          ? `{"portfolio": "portfolio-${this.params.portfolio}"}`
          : undefined}"
        handle-as="json"
        last-response="${this.portfolioData}"
      ></iron-ajax>
      <p>
        <elmsln-studio-link href="/">Dashboard</elmsln-studio-link>
        <elmsln-studio-link href="/submissions">Submissions</elmsln-studio-link>
        <!--elmsln-studio-link href="/submissions?assignment=assignment-1"
          >Submissions for Assignment 1</elmsln-studio-link
        >
        data-params="${JSON.stringify(this.params)}"

        <elmsln-studio-link href="/submissions?student=kmk5124"
          >Submissions by kmk5124</elmsln-studio-link
        >
      <textarea> ${JSON.stringify(this.profile || {})} </textarea>
        <elmsln-studio-link
          href="/submissions?assignment=assignment-1&student=kmk5124"
          >Submissions for Assignment 1 by kmk5124</elmsln-studio-link
        -->
        <elmsln-studio-link href="/portfolios/kmk5124-project-0"
          >kmk5124-project-0</elmsln-studio-link
        >
        <elmsln-studio-link href="/portfolios">portfolios</elmsln-studio-link>
      </p>
      <br />
      <elmsln-studio-main active-route="${this.route}">
        <elmsln-studio-dashboard
          route="dashboard"
          profile-data="${JSON.stringify(this.profileData || {})}"
          activity-data="${JSON.stringify(this.activityData || [])}"
          route="dashboard"
        >
        </elmsln-studio-dashboard>
        <elmsln-studio-submissions
          route="submissions"
          submissions-data="${JSON.stringify(this.submissionsData || [])}"
          ?grid="${this.query.grid || false}"
          student-filter="${this.query.student || ""}"
          assignment-filter="${this.query.assignment || ""}"
        >
        </elmsln-studio-submissions>
        <!--elmsln-studio-portfolio 
          route="portfolios" 
          .portfolio-data=${this.portfolioData}
          .feedback-data=${this.feedbackData}
          .submission-filter="${this.query.submission || ""}"
          .comment-filter="${this.query.comment || ""}">
        </elmsln-studio-portfolio-->
      </elmsln-studio-main>
    `;
  }
}
customElements.define(ElmslnStudio.tag, ElmslnStudio);
export { ElmslnStudio };
