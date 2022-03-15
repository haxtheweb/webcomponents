/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { ElmslnStudioUtilities } from "./elmsln-studio-utilities.js";
import { ElmslnStudioStyles } from "./elmsln-studio-styles.js";
import "./elmsln-studio-link.js";
import "./elmsln-studio-button.js";

/**
 * `elmsln-studio-dashboard`
 * Studio App for ELMS:LN
 *
 * @customElement elmsln-studio-dashboard
 * @lit-html
 * @lit-element
 * @demo demo/dashboard.html
 */
class ElmslnStudioDashboard extends ElmslnStudioUtilities(
  ElmslnStudioStyles(LitElement)
) {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "elmsln-studio-dashboard";
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        h1,
        h2,
        h3,
        .card [slot="heading"] {
          margin: 0;
          color: #9d9d9d;
          font-weight: normal;
          font-size: calc(1.5 * var(--elmsln-studio-FontSize, 16px));
          font-family: var(--elmsln-studio-FontFamily, "Roboto", sans-serif);
        }
        h2 {
          font-weight: bold;
          color: #989898;
        }
        #primary > div {
          margin: 0;
        }
        .card {
          font-size: var(--elmsln-studio-FontSize, 16px);
          font-family: var(--elmsln-studio-FontFamily, "Roboto", sans-serif);
          margin: calc(0.5 * var(--elmsln-studio-margin, 20px)) 0
            calc(2 * var(--elmsln-studio-margin, 20px));
          flex: 1 0 50%;
          color: #95989a;
          --accent-card-footer-border-color: transparent;
        }
        .card [slot="subheading"] {
          font-weight: bold;
          border: none;
          font-size: calc(0.75 * var(--elmsln-studio-FontSize, 16px));
        }
        .card.primary [slot="heading"],
        .card [slot="subheading"] {
          text-align: center;
          display: block;
          margin: 0 auto;
        }
        .card.primary [slot="label"] {
          color: #5c5c5c;
        }
        .card.primary [slot="description"] {
          color: #818181;
          font-size: calc(0.75 * var(--elmsln-studio-FontSize, 16px));
        }
        .card.feed {
          font-size: calc(0.75 * var(--elmsln-studio-FontSize, 16px));
          --lrndesign-avatar-width: var(--nav-card-linklist-left-size, 36px);
          --nav-card-item-avatar-width: var(
            --nav-card-linklist-left-size,
            36px
          );
          --nav-card-item-avatar-height: var(
            --nav-card-linklist-left-size,
            36px
          );
        }
        .card.due,
        .card.recent {
          --nav-card-linklist-left-size: 36px;
          --nav-card-item-avatar-size: 40px;
        }
        .card.secondary nav-card {
          border: none !important;
        }
        #profile {
          --lrndesign-avatar-width: 100px;
        }
        #profile lrndesign-avatar {
          margin: 0 auto;
          text-align: center;
        }
        accent-card {
          --accent-card-heading-padding-top: 0;
        }
        accent-card table {
          width: 100%;
          border-collapse: collapse;
          font-family: var(
            --elmsln-studio-secondary-FontFamily,
            "Helvetica Neue",
            sans-serif
          );
        }
        accent-card th,
        accent-card td {
          font-weight: normal;
          padding: 5px 0;
          text-align: left;
          min-height: 25px;
          border-bottom: 1px solid
            var(--simple-colors-default-theme-grey-4, #666);
        }
        accent-card td {
          text-align: right;
        }
        accent-card th simple-icon-lite {
          width: 20px;
          height: 20px;
        }
        accent-card.card th elmsln-studio-link {
          --elmsln-studio-link-TextDecoration: underline !important;
        }
        accent-card.card th elmsln-studio-link:focus,
        accent-card.card th elmsln-studio-link:focus-within,
        accent-card.card th elmsln-studio-link:hover {
          --elmsln-studio-link-TextDecoration: none !important;
        }
        @media screen and (min-width: 600px) {
          #profile {
            --lrndesign-avatar-width: 150px;
          }
          #profile lrndesign-avatar {
            margin: 0 auto;
          }
          h1,
          h2 {
            flex: 0 0 100%;
          }
          #primary > div {
            display: flex;
            align-items: stretch;
            justify-content: space-between;
            flex-wrap: wrap;
          }
          .card.primary {
            flex: 0 0 calc(50% - var(--elmsln-studio-margin, 20px));
          }
        }
        @media screen and (min-width: 900px) {
          :host {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
          }
          #profile {
            --lrndesign-avatar-width: 200px;
          }
          #profile lrndesign-avatar {
            margin: 0 auto;
          }
        }
      `,
    ];
  }
  // render function
  render() {
    return html`
      <h1 class="sr-only">Overview</h1>
      <div id="primary">
        <div id="profile">
          <h2>${this.profileName || "Loading Your Profile..."}</h2>
          <accent-card accent-color="purple" class="card primary">
            <span slot="heading" class="sr-only">My Progress</span>
            ${!this.profile || Object.keys(this.profile).length < 1
              ? this.loading("purple", "footer")
              : html`
                  <lrndesign-avatar
                    accent-color="${this.accentColor(this.profileName)}"
                    slot="content"
                    src="${!this.profile ? "unknown" : this.profile.image}"
                    label="${this.profileName}"
                    two-chars
                    size="200px"
                  ></lrndesign-avatar>
                  <table slot="content">
                    <tbody>
                      <tr>
                        <th scope="row">
                          <simple-icon-lite
                            icon="assignment-turned-in"
                          ></simple-icon-lite>
                          Assignments Completed
                        </th>
                        <td>
                          ${!this.profile ||
                          !this.profile.completed ||
                          !this.profile.due
                            ? "unknown"
                            : `${this.profile.completed.length} / ${
                                this.profile.completed.length +
                                this.profile.due.length
                              }`}
                        </td>
                      </tr>
                      ${!this.profile ||
                      (this.profile.features || []).length < 1
                        ? ``
                        : html`
                            <tr>
                              <th scope="row">
                                <simple-icon-lite
                                  icon="icons:favorite"
                                ></simple-icon-lite>
                                Submissions Featured
                              </th>
                              <td>
                                ${!this.profile || !this.profile.features
                                  ? "unknown"
                                  : this.profile.features.length}
                              </td>
                            </tr>
                          `}
                      <tr>
                        <th scope="row">
                          <simple-icon-lite
                            icon="communication:forum"
                          ></simple-icon-lite>
                          Peer Reviews Written
                          ${!this.profile || !this.profile.given
                            ? " (0)"
                            : ` (${this.profile.given.length})`}
                        </th>
                        <td>
                          <div id="rating">
                            ${this.profile.feedbackPercentile < 25
                              ? ""
                              : html`<simple-icon
                                  icon="star"
                                  accent-color="purple"
                                ></simple-icon>`}
                            ${this.profile.feedbackPercentile < 50
                              ? ""
                              : html`<simple-icon
                                  icon="star"
                                  accent-color="purple"
                                ></simple-icon>`}
                            ${this.profile.feedbackPercentile < 75
                              ? ""
                              : html`<simple-icon
                                  icon="star"
                                  accent-color="purple"
                                ></simple-icon>`}
                            ${this.profile.feedbackPercentile < 90
                              ? ""
                              : html`<simple-icon
                                  icon="star"
                                  accent-color="purple"
                                ></simple-icon>`}
                            ${this.profile.feedbackPercentile < 95
                              ? ""
                              : html`<simple-icon
                                  icon="star"
                                  accent-color="purple"
                                ></simple-icon>`}
                          </div>
                          <simple-tooltip
                            for="rating"
                            ?hidden="${!this.profile.feedbackPercentile}"
                            >Given peer reviews than
                            ${this.profile.feedbackPercentile}% of
                            classmates.</simple-tooltip
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                `}
          </accent-card>
          <nav-card accent-color="green" class="card primary due">
            <span slot="heading">Upcoming Assignments</span>
            <elmsln-studio-link slot="subheading" href="assignments"
              >All assignments</elmsln-studio-link
            >
            ${!this.profile || Object.keys(this.profile).length < 1
              ? this.loading("green", "footer")
              : html`
                  <div slot="linklist">
                    ${(this.profile.due || []).slice(0, 5).map(
                      (a) => html`
                        <nav-card-item
                          id="due-${a.id}-item"
                          accent-color="${this.isLate(a.date) ? "red" : "grey"}"
                          allow-grey
                          avatar="${this.isLate(a.date)
                            ? "report-problem"
                            : "assignment"}"
                          invert
                        >
                          <elmsln-studio-link
                            id="due-${a.id}"
                            aria-describedby="due-${a.id}-desc"
                            slot="label"
                            href="assignments/${a.id}"
                          >
                            ${a.assignment}
                          </elmsln-studio-link>
                          <relative-time
                            id="due-${a.id}-desc"
                            slot="description"
                            .datetime="${a.date}"
                          >
                            ${this.dateFormat(a.date, "long")}
                          </relative-time>
                        </nav-card-item>
                        <simple-tooltip for="due-${a.id}-item" position="left">
                          ${this.isLate(a.date) ? "Overdue" : "Not Submitted"}
                        </simple-tooltip>
                      `
                    )}
                  </div>
                `}
          </nav-card>
        </div>
        <div id="work">
          <h2>Recent Work</h2>
          <nav-card
            accent-color="amber"
            class="card primary recent"
            link-icon="chevron-right"
          >
            <span slot="heading">My Submissions</span>
            <elmsln-studio-link
              slot="subheading"
              href="submissions${!this.profile
                ? ""
                : `?student=${this.profile.id}`}"
              >All my submissions</elmsln-studio-link
            >
            ${!this.profile || Object.keys(this.profile).length < 1
              ? this.loading("orange", "footer")
              : html` <div slot="linklist">
                  ${(this.profile.submissions || []).slice(0, 5).map(
                    (s) => html`
                      <nav-card-item
                        id="due-${s.id}-item"
                        accent-color="${this.isLate(s.assignmentDate, s.date)
                          ? "amber"
                          : "green"}"
                        allow-grey
                        avatar="${this.isLate(s.assignmentDate, s.date)
                          ? "assignment-late"
                          : "assignment-turned-in"}"
                        invert
                      >
                        <elmsln-studio-link
                          id="sub-${s.id}"
                          aria-describedby="sub-${s.id}-desc"
                          slot="label"
                          href="project/${s.portfolioId}?submission=${s.id}"
                        >
                          ${s.assignment}
                        </elmsln-studio-link>
                        <relative-time
                          id="sub-${s.id}-desc"
                          slot="description"
                          .datetime="${s.date}"
                        >
                          ${this.dateFormat(s.date)}
                        </relative-time>
                      </nav-card-item>
                      <simple-tooltip for="due-${s.id}-item" position="left">
                        ${this.isLate(s.assignmentDate, s.date)
                          ? "Submitted Late"
                          : "Submitted"}
                      </simple-tooltip>
                    `
                  )}
                </div>`}
          </nav-card>
          <nav-card
            accent-color="cyan"
            class="card feed primary"
            link-icon="chevron-right"
          >
            <span slot="heading">Feedback for Me</span>
            ${!this.profile || Object.keys(this.profile).length < 1
              ? this.loading("cyan", "footer")
              : html` <div slot="linklist">
                  ${(this.profile.feedback || []).slice(0, 5).map(
                    (f) => html`
                      <nav-card-item
                        accent-color="${this.accentColor(
                          [f.firstName, f.lastName].join(" ")
                        )}"
                        .avatar="${f.avatar}"
                        .initials="${[f.firstName, f.lastName].join(" ")}"
                      >
                        <elmsln-studio-link
                          id="feed-${f.id}"
                          aria-describedby="feed-${f.id}-desc"
                          slot="label"
                          href="project/${f.portfolioId}?submission=${f.submissionId}&comment=${f.id}"
                        >
                          ${[f.firstName, f.lastName].join(" ")}'s feedback on
                          ${f.assignment}
                        </elmsln-studio-link>
                        <relative-time
                          id="feed-${f.id}-desc"
                          slot="description"
                          .datetime="${f.date}"
                        >
                          ${this.dateFormat(f.date)}
                        </relative-time>
                      </nav-card-item>
                    `
                  )}
                </div>`}
          </nav-card>
        </div>
      </div>
      <div id="secondary">
        <h2 slot="heading">Class Activity</h2>
        <accent-card accent-color="pink" class="card feed secondary">
          <nav-card flat no-border slot="content">
            <span slot="heading">Recent Submissions</span>
            <elmsln-studio-link slot="subheading" href="submissions"
              >All submissions</elmsln-studio-link
            >
            ${!this.submissions
              ? this.loading("pink", "body")
              : html` <div slot="linklist">
                  ${(this.submissions || []).map(
                    (s) => html`
                      <nav-card-item
                        accent-color="${this.accentColor(
                          [s.firstName, s.lastName].join(" ")
                        )}"
                        .avatar="${s.avatar}"
                        .initials="${[s.firstName, s.lastName].join(" ")}"
                      >
                        <elmsln-studio-link
                          id="act-${s.id}"
                          aria-describedby="act-${s.id}-desc"
                          slot="label"
                          href="${this.getActivityLink(s)}"
                        >
                          ${this.getActivityTitle(s)}
                        </elmsln-studio-link>
                        <relative-time
                          id="act-${s.id}-desc"
                          slot="description"
                          .datetime="${s.date}"
                        >
                          ${this.dateFormat(s.date)}
                        </relative-time>
                      </nav-card-item>
                    `
                  )}
                </div>`}
          </nav-card>
          <nav-card flat no-border slot="content">
            <span slot="heading">Recent Comments</span>
            ${!this.discussion
              ? this.loading("pink", "body")
              : html`
                  <div slot="linklist">
                    ${(this.discussion || []).map(
                      (d) => html`
                        <nav-card-item
                          accent-color="${this.accentColor(
                            [d.firstName, d.lastName].join(" ")
                          )}"
                          .avatar="${d.avatar}"
                          .initials="${[d.firstName, d.lastName].join(" ")}"
                        >
                          <elmsln-studio-link
                            id="act-${d.id}"
                            aria-describedby="act-${d.id}-desc"
                            slot="label"
                            href="${this.getActivityLink(d)}"
                          >
                            ${this.getActivityTitle(d)}
                          </elmsln-studio-link>
                          <relative-time
                            id="act-${d.id}-desc"
                            slot="description"
                            .datetime="${d.date}"
                          >
                            ${this.dateFormat(d.date)}
                          </relative-time>
                        </nav-card-item>
                      `
                    )}
                  </div>
                `}
          </nav-card>
        </accent-card>
      </div>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      discussion: {
        type: Array,
      },
      profile: {
        type: Object,
      },
      submissions: {
        type: Array,
      },
    };
  }

  // life cycle
  constructor() {
    super();
    this.profile = {};
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    this.fetchData("profile");
    this.fetchData("submissions");
  }
  get profileName() {
    return this.profile && this.profile.firstName && this.profile.lastName
      ? `${this.profile.firstName} ${this.profile.lastName}`
      : ``;
  }
}
customElements.define(ElmslnStudioDashboard.tag, ElmslnStudioDashboard);
export { ElmslnStudioDashboard };
