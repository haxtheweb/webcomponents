/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { ElmslnStudioStyles } from "./elmsln-studio-styles.js";
import { ElmslnStudioUtilities } from "./elmsln-studio-utilities.js";
import "@lrnwebcomponents/img-view-modal/img-view-modal.js";
import "@lrnwebcomponents/hax-iconset/hax-iconset.js";
import "@lrnwebcomponents/threaded-discussion/threaded-discussion.js";

/**
 * `elmsln-studio-portfolio`
 * Studio App for ELMS:LN
 *
 * @customElement elmsln-studio-portfolio
 * @lit-html
 * @lit-element
 * @demo demo/portfolio.html
 */
class ElmslnStudioPortfolio extends ElmslnStudioUtilities(
  ElmslnStudioStyles(LitElement)
) {
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          flex-wrap: wrap;
        }
        h1 {
          text-align: center;
        }
        #breadcrumb {
          margin: 0 0 var(--elmsln-studio-margin, 20px);
          flex: 1 0 100%;
          --elmsln-studio-link-Color: var(
            --simple-colors-fixed-theme-light-blue-8
          );
          --elmsln-studio-link-focus-Color: var(
            --simple-colors-fixed-theme-light-blue-9
          );
        }
        #breadcrumb > * {
          display: inline;
        }
        lrndesign-avatar,
        .student-name,
        .project-name,
        .assignment-name,
        .submission-date {
          font-weight: normal;
          display: block;
        }
        .student-name {
          font-size: calc(2 * var(--elmsln-studio-FontSize, 16px));
          font-weight: bold;
          color: #4b4b4b;
        }
        .project-name {
          font-size: calc(1.75 * var(--elmsln-studio-FontSize, 16px));
          color: #95989a;
        }
        #project-buttons,
        .submission-header {
          position: relative;
          height: 40px;
          margin-top: -40px;
        }
        #sort,
        .submission-header elmsln-studio-button {
          color: #95989a;
          font-size: var(--elmsln-studio-FontSize, 16px);
          text-transform: uppercase;
          position: absolute;
          right: 0;
          top: 0;
        }
        #sort:focus,
        #sort:hover,
        .submission-header elmsln-studio-button:focus,
        .submission-header elmsln-studio-button:hover {
          color: #4b4b4b;
        }
        #sort.sort-latest {
          transform: rotateX(180deg) rotateY(0deg);
        }
        section {
          border-top: 2px solid #eaeaea;
          padding: calc(0.5 * var(--elmsln-studio-margin, 20px)) 0
            var(--elmsln-studio-margin, 20px);
        }
        .view-discussion {
          border: 1px solid #eaeaea;
          padding: calc(0.5 * var(--elmsln-studio-margin, 20px));
        }
        .view-discussion section {
          opacity: 0.4;
          display: none;
        }
        .view-discussion section.section-discussion {
          display: block;
          opacity: 1;
        }
        h2 {
          margin: calc(2 * var(--elmsln-studio-margin, 20px)) auto;
          text-align: center;
        }
        .assignment-name {
          font-size: calc(1.5 * var(--elmsln-studio-FontSize, 16px));
          color: #555555;
        }
        .submission-date {
          font-size: var(--elmsln-studio-FontSize, 16px);
          color: #95989a;
        }
        .submission-body {
          color: #95989a;
          line-height: 160%;
          margin: calc(0.5 * var(--elmsln-studio-margin, 20px)) auto
            var(--elmsln-studio-margin, 20px);
        }
        .submission-body:first-child {
          margin-top: 0;
        }
        .submission-body:last-child {
          margin-bottom: 0;
        }
        .submission-links {
          list-style: none;
          padding-inline-start: 0;
        }
        .submission-links > li {
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
        }
        .submission-links a:link,
        .submission-links a:visited {
          font-size: calc(1.5 * var(--elmsln-studio-FontSize, 16px));
          font-weight: bold;
          color: #000;
          text-decoration: none;
        }
        .submission-links a:focus,
        .submission-links a:hover {
          text-decoration: underline;
        }
        .submission-links iron-icon {
          margin-right: 0.5em;
        }
        .submission-links a:focus iron-icon,
        .submission-links a:hover iron-icon {
          text-decoration: none;
        }
        .callout {
          font-size: calc(0.75 * var(--elmsln-studio-FontSize, 16px));
          border: 1px solid #eaeaea;
          padding: 0;
        }
        .discussion-label {
          text-align: left;
          font-size: calc(1 * var(--elmsln-studio-FontSize, 16px));
          margin: var(--elmsln-studio-margin, 20px) 0
            calc(0.25 * var(--elmsln-studio-margin, 20px));
        }
        .callout > * {
          padding: calc(0.25 * var(--elmsln-studio-margin, 20px))
            calc(0.5 * var(--elmsln-studio-margin, 20px));
        }
        .callout .callout-label {
          font-size: calc(1 * var(--elmsln-studio-FontSize, 16px));
          font-weight: normal;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin: 0;
          color: #4b4b4b;
          border-bottom: 1px solid #eaeaea;
        }
        .callout .callout-label iron-icon {
          margin-right: 1em;
        }
        threaded-discussion {
          background-color: #eaeaea;
          padding: 1px;
          --threaded-discussion-comment-button-BackgroundColor: var(
            --simple-colors-fixed-theme-light-blue-8
          );
          --threaded-discussion-comment-button-focus-BackgroundColor: var(
            --simple-colors-fixed-theme-light-blue-9
          );
        }
        #prev-next-nav {
          z-index: 10000;
          display: flex;
        }
        @media screen and (min-width: 600px) {
          :host {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
          }
          #primary {
            flex: 1 0 100%;
          }
          #primary.view-discussion {
            flex: 0 0 calc(50% - var(--elmsln-studio-margin, 20px));
          }
          #primary:not(.view-discussion) {
            max-width: calc(1000px - 2 * var(--elmsln-studio-margin, 20px));
            margin: 0 auto;
            border: 1px solid #eaeaea;
            padding: var(--elmsln-studio-margin, 20px);
          }
          .view-discussion section {
            display: block;
          }
          .view-discussion section.section-discussion {
            border: 4px solid #95989a;
            padding: calc(0.5 * var(--elmsln-studio-margin, 20px))
              calc(0.5 * var(--elmsln-studio-margin, 20px))
              var(--elmsln-studio-margin, 20px);
            opacity: 1;
          }
          #secondary {
            flex: 0 0 calc(50% - var(--elmsln-studio-margin, 20px));
          }
        }
      `,
    ];
  }
  // render function
  render() {
    return html`
      <div id="breadcrumb">
        <elmsln-studio-link href="/submissions">Submissions</elmsln-studio-link>
        <span> > </span>
        ${!this.portfolio
          ? ``
          : html`
              ${!this.portfolio.projectId || !this.portfolio.project
                ? ``
                : html`
                    <elmsln-studio-link
                      href="${`/submissions?project=${this.portfolio.projectId}`}"
                      >${this.portfolio.project ||
                      "Project"}</elmsln-studio-link
                    >
                    <span> > </span>
                  `}
            `}
        ${!this.portfolio || !this.assignment
          ? html`<em>Assignment</em>`
          : html`
              <elmsln-studio-link
                href="${`/submissions?${
                  !this.portfolio.projectId || !this.portfolio.project
                    ? ``
                    : `project=${this.portfolio.projectId}&`
                }assignment=${this.assignment.assignmentId}`}"
                >${this.assignment.assignment ||
                "Assignment"}</elmsln-studio-link
              >
            `}
        <span> > </span>
        <span
          >${!this.portfolio
            ? html`<em>Student</em>`
            : this.fullName(this.portfolio)}</span
        >
      </div>
      <div
        id="primary"
        class="${this.comment && this.comment !== "" ? "view-discussion" : ""}"
      >
        <article id="portfolio-project">
          <h1>
            <lrndesign-avatar
              accent-color="${!this.portfolio
                ? "grey"
                : this.accentColor(this.fullName(this.portfolio))}"
              aria-hidden="true"
              label="${!this.portfolio
                ? "undefined"
                : this.fullName(this.portfolio)}"
              .src="${this.portfolio && this.portfolio.avatar
                ? this.portfolio.avatar
                : undefined}"
              two-chars
            >
            </lrndesign-avatar>
            <span class="student-name"
              >${!this.portfolio
                ? "Loading..."
                : this.fullName(this.portfolio)}</span
            >
            ${!this.portfolio || !this.portfolio.project
              ? ``
              : html`
                  <span class="project-name">${this.portfolio.project}</span>
                `}
          </h1>
          ${!this.portfolio
            ? this.loading("grey")
            : html`
                <div id="project-buttons">
                  <button
                    id="sort"
                    aria-pressed="${this.sortLatest ? "false" : "true"}"
                    class="${!this.sortLatest ? "" : "sort-latest"}"
                    @click="${(e) => (this.sortLatest = !this.sortLatest)}"
                    controls="portfolio-project"
                  >
                    <iron-icon icon="sort"></iron-icon>
                    <span class="sr-only"
                      >Sort Submissions
                      ${!this.sortLatest
                        ? "Oldest First"
                        : "Newest First"}</span
                    >
                  </button>
                  <simple-tooltip for="sort"
                    >Sort Submissions
                    ${!this.sortLatest
                      ? "Oldest First"
                      : "Newest First"}</simple-tooltip
                  >
                </div>
                ${this.sortedSubmissions.map(
                  (s) => html`
                    <section
                      class="${this.assignmentFilter === s.id
                        ? "section-discussion"
                        : ""}"
                    >
                      <div class="submission-header">
                        <h2 id="sub-${s.id}">
                          <span class="assignment-name">${s.assignment}</span>
                          <span class="submission-date"
                            >Submitted:
                            <local-time
                              month="long"
                              day="numeric"
                              year="numeric"
                              hour="2-digit"
                              minute="2-digit"
                              second="2-digit"
                              time-zone-name="short"
                              datetime="${s.date}"
                            >
                              ${this.dateFormat(s.date)}
                            </local-time>
                          </span>
                        </h2>
                        <elmsln-studio-button
                          id="sub-${s.id}-toggle-button"
                          class="view-discussion-button"
                          aria-describedby="sub-${s.id}"
                          icon="${this.assignmentFilter === s.id && this.comment
                            ? "close"
                            : this.getFeedbackIcon(s.feedback.length)}"
                          path="${this.getActivityLink(
                            s,
                            this.assignmentFilter === s.id && this.comment
                          )}"
                        >
                          <span class="sr-only"
                            >${this.assignmentFilter === s.id && this.comment
                              ? "Close Feedback"
                              : `View Feedback (${s.feedback.length})`}</span
                          >
                        </elmsln-studio-button>
                        <simple-tooltip for="sub-${s.id}-toggle-button"
                          >${this.assignmentFilter === s.id && this.comment
                            ? "Close Feedback"
                            : `View Feedback (${s.feedback.length})`}</simple-tooltip
                        >
                      </div>
                      <div
                        class="submission-body"
                        ?hidden="${this.comment &&
                        this.assignmentFilter !== s.id}"
                      >
                        ${s.links && s.links.length > 0
                          ? html`
                              <ul class="submission-links">
                                ${s.links.map(
                                  (link) => html`
                                    <li>
                                      <elmsln-studio-link
                                        href="${link.url}"
                                        target="_blank"
                                      >
                                        <iron-icon
                                          aria-hidden="true"
                                          icon="${link.type === "pdf"
                                            ? "hax:file-pdf"
                                            : "link"}"
                                        ></iron-icon>
                                        ${link.text || link.url}
                                      </elmsln-studio-link>
                                    </li>
                                  `
                                )}
                              </ul>
                            `
                          : !s.sources || s.sources.length === 0
                          ? html` ${s.body} `
                          : this.getThumnailGrid(s)}
                      </div>
                    </section>
                  `
                )}
              `}
        </article>
      </div>
      <div
        id="secondary"
        ?hidden=${!this.portfolio || !this.comment || this.comment === ""}
      >
        <aside>
          ${!this.assignment
            ? this.loading("grey")
            : html`
                ${!this.assignment.feedbackInstructions &&
                !this.assignment.feedbackRubric
                  ? ``
                  : html`
                      <div class="instructions callout">
                        <h2 class="callout-label">
                          <iron-icon icon="info" aria-hidden="true"></iron-icon>
                          Giving Feedback
                        </h2>
                        <div>
                          ${this.assignment.feedbackInstructions
                            ? this.assignment.feedbackInstructions
                            : ""}
                          ${this.assignment.feedbackRubric
                            ? this.rubricTable(this.assignment.feedbackRubric)
                            : ""}
                        </div>
                      </div>
                    `}
                <h2 class="discussion-label">Feedback</h2>
                <div class="discussion callout">
                  <p class="callout-label">
                    <iron-icon
                      icon="communication:comment"
                      aria-hidden="true"
                    ></iron-icon>
                    Post New Feedback
                  </p>
                  ${!this.feedback
                    ? this.loading("grey")
                    : html`
                        <threaded-discussion
                          comment-icon="send"
                          ?demo="${this.demoMode}"
                          .data="${this.feedback || []}"
                          latest
                          relative-dates
                        >
                        </threaded-discussion>
                      `}
                </div>
              `}
        </aside>
      </div>
      ${this.nav}
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      portfolio: {
        type: Object,
      },
      feedback: {
        type: Object,
      },
      comment: {
        type: String,
        attribute: "comment",
      },
      submissions: {
        type: Array,
      },
      submissionFilter: {
        type: String,
        attribute: "submission-filter",
      },
      sortLatest: {
        type: Boolean,
        attribute: "sort-latest",
        reflect: true,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "elmsln-studio-portfolio";
  }

  // life cycle
  constructor() {
    super();
    this.feedback = {};
    this.comment = "";
    this.tag = ElmslnStudioPortfolio.tag;
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    this.fetchData("submissions");
    this.fetchData("portfolios");
    this.fetchData("discussion");
    console.log("updated", this.submissions, this.portfolios, this.discussion);
  }
  get nav() {
    let prevHref,
      nextHref,
      portfolio = this.portfolio || {},
      getLink = (s) => {
        return this.getActivityLink(
          { ...s, activity: "submission" },
          !this.comment
        );
      },
      prevLabel = !portfolio.prev ? "" : this.fullName(portfolio.prev),
      nextLabel = !portfolio.next ? "" : this.fullName(portfolio.next);
    (prevHref = portfolio.prev ? getLink(portfolio.prev) : undefined),
      (nextHref = portfolio.next ? getLink(portfolio.next) : undefined);
    return this.prevNextNav(prevLabel, prevHref, nextLabel, nextHref);
  }
  get sortedSubmissions() {
    return !this.portfolio || !this.portfolio.submissions
      ? []
      : this.sortDates(this.portfolio.submissions, this.sortLatest);
  }
  get assignment() {
    let filter =
      !this.portfolio || !this.portfolio.submissions
        ? []
        : this.portfolio.submissions.filter(
            (s) => !this.submissionFilter || s.id === this.submissionFilter
          );
    return !filter ? false : filter[0];
  }
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {});
  }
}
customElements.define("elmsln-studio-portfolio", ElmslnStudioPortfolio);
export { ElmslnStudioPortfolio };
