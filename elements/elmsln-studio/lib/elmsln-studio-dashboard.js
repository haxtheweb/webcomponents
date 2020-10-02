/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
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
        h2,
        #secondary [slot="heading"] {
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
        .card.primary [slot="subheading"] {
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
          --paper-avatar-width: var(--nav-card-linklist-left-size, 36px);
          --nav-card-linklist-left-size: 36px;
        }
        .card.secondary {
          margin-top: 0;
          --accent-card-heading-padding-top: 0;
          --nav-card-linklist-margin-top: 0;
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
            --elmsln-studio-ssecondary-FontFamily,
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
          .card.due {
            --lrndesign-avatar-border-radius: 0%;
            --nav-card-item-avatar-width: 20px;
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
          <h2>${this.profileName}</h2>
          <accent-card accent-color="purple" class="card primary">
            <span slot="heading" class="sr-only">My Progress</span>
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
                    <elmsln-studio-link href="/assignments">Assignments Completed</elmsln-studio-link>
                  </th>
                  <td>
                    ${
                      !this.profile ||
                      !this.profile.completed ||
                      !this.profile.due
                        ? "unknown"
                        : `${this.profile.completed.length} / ${
                            this.profile.completed.length +
                            this.profile.due.length
                          }`
                    }
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                      Featured Submissions
                  </th>
                  <td>
                    ${
                      !this.profile || !this.profile.features
                        ? "unknown"
                        : this.profile.features.length
                    }
                  </td>
                </tr>
                <tr>
                  <th scope="row">Feedback Given</th>
                  <td>
                    ${
                      !this.profile || !this.profile.given
                        ? "unknown"
                        : this.profile.given.length
                    }
                  </td>
                </tr>
                <tr>
                  <th scope="row">Conversations</th>
                  <td>
                    ${
                      !this.profile ||
                      !this.profile.given ||
                      !this.profile.discussions
                        ? "unknown"
                        : this.profile.given.length +
                          this.profile.discussions.length
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </accent-card>
          <nav-card accent-color="green" class="card primary due">
            <span slot="heading">Work Due</span>
            <div slot="linklist">
              ${
                !this.profile
                  ? "unknown"
                  : (this.profile.due || []).slice(0, 5).map(
                      (a) => html`
                        <nav-card-item
                          accent-color="${this.isLate(a.date) ? "red" : "grey"}"
                          allow-grey
                          avatar="${this.isLate(a.date)
                            ? "icons:assignment-late"
                            : "assignment"}"
                          icon="chevron-right"
                          invert
                        >
                          <elmsln-studio-link
                            id="due-${a.id}"
                            aria-describedby="due-${a.id}-desc"
                            slot="label"
                            href="/assignments?assignments=${a.id}"
                          >
                            ${a.assignment}
                          </elmsln-studio-link>
                          <relative-time
                            id="due-${a.id}-desc"
                            slot="description"
                            datetime="${a.date}"
                          >
                            ${this.dateFormat(a.date, "long")}
                          </relative-time>
                        </nav-card-item>
                      `
                    )
              }
            </div>
          </nav-card>
        </div>
        <div id="work">
          <h2>Recent Work</h2>
          <nav-card
            accent-color="amber"
            class="card primary"
            link-icon="chevron-right"
          >
            <span slot="heading">Submissions</span>
            <elmsln-studio-link slot="subheading" href="/submissions${
              !this.profile ? "" : `?student=${this.profile.id}`
            }">All submissions</elmsln-studio-link>
            <div slot="linklist">
              ${
                !this.profile
                  ? "unknown"
                  : (this.profile.submissions || []).slice(0, 5).map(
                      (s) => html`
                        <nav-card-item icon="chevron-right">
                          <elmsln-studio-link
                            id="sub-${s.id}"
                            aria-describedby="sub-${s.id}-desc"
                            slot="label"
                            href="/portfolios/${s.portfolioId}?submission=${s.id}"
                          >
                            ${s.assignment}
                          </elmsln-studio-link>
                          <relative-time
                            id="sub-${s.id}-desc"
                            slot="description"
                            datetime="${s.date}"
                          >
                            ${this.dateFormat(s.date)}
                          </relative-time>
                        </nav-card-item>
                      `
                    )
              }
            </div>
          </nav-card>
          <nav-card
            accent-color="cyan"
            class="card feed primary"
            link-icon="chevron-right"
          >
            <span slot="heading">Feedback</span>
            <elmsln-studio-link slot="subheading">All feedback</elmsln-studio-link>
            <div slot="linklist">
              ${
                !this.profile
                  ? "unknown"
                  : (this.profile.feedback || []).slice(0, 5).map(
                      (f) => html`
                        <nav-card-item
                          accent-color="${this.accentColor(
                            [f.firstName, f.lastName].join(" ")
                          )}"
                          .avatar="${f.avatar}"
                          icon="chevron-right"
                          .initials="${[f.firstName, f.lastName].join(" ")}"
                        >
                          <elmsln-studio-link
                            id="feed-${f.id}"
                            aria-describedby="feed-${f.id}-desc"
                            slot="label"
                            href="/portfolios/${f.portfolioId}?submission${f.submissionId}&comment=${f.id}"
                          >
                            ${[f.firstName, f.lastName].join(" ")}'s feedback on
                            ${f.assignment}
                          </elmsln-studio-link>
                          <relative-time
                            id="feed-${f.id}-desc"
                            slot="description"
                            datetime="${f.date}"
                          >
                            ${this.dateFormat(f.date)}
                          </relative-time>
                        </nav-card-item>
                      `
                    )
              }
            </div>
          </nav-card>
        </div>
      </div>
      <div id="secondary">
        <nav-card
          flat
          no-border
          class="card feed secondary"
          link-icon="chevron-right"
        >
          <span slot="heading">Recent Activity</span>
          <div slot="linklist">
            ${(this.activity || []).slice(0, this.activityLoad).map(
              (a) => html`
                <nav-card-item
                  accent-color="${this.accentColor(
                    [a.firstName, a.lastName].join(" ")
                  )}"
                  .avatar="${a.avatar}"
                  icon="chevron-right"
                  .initials="${[a.firstName, a.lastName].join(" ")}"
                >
                  <elmsln-studio-link
                    id="act-${a.id}"
                    aria-describedby="act-${a.id}-desc"
                    slot="label"
                    href="${this.getActivityLink(a)}"
                  >
                    ${this.getActivityTitle(a)}
                  </elmsln-studio-link>
                  <relative-time
                    id="act-${a.id}-desc"
                    slot="description"
                    datetime="${a.date}"
                  >
                    ${this.dateFormat(a.date)}
                  </relative-time>
                </nav-card-item>
              `
            )}
          </div>
          <button
            class="load-more"
            slot="footer"
            ?disabled="${this.activityLoad >= this.activity.length}"
            ?hidden="${this.activityLoad >= this.activity.length}"
            @click="${(e) => (this.activityLoad += 10)}"
          >
            Load More
          </button>
        </nav-card>
      </div-->
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      activity: {
        type: Array,
      },
      activityLoad: {
        type: Number,
        attribute: "activity-load",
      },
      profile: {
        type: Object,
      },
    };
  }

  // life cycle
  constructor() {
    super();
    this.activity = [];
    this.profile = {};
    this.activityLoad = 15;
    this.tag = ElmslnStudioDashboard.tag;
  }
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "activity") this.activityLoad = 15;
    });
  }
  get profileName() {
    return this.profile && this.profile.firstName && this.profile.lastName
      ? `${this.profile.firstName} ${this.profile.lastName}`
      : ``;
  }

  loadMoreComments(e) {
    this.activityLoad += 10;
  }
  // static get observedAttributes() {
  //   return [];
  // }
  // disconnectedCallback() {}

  // attributeChangedCallback(attr, oldValue, newValue) {}
}
customElements.define("elmsln-studio-dashboard", ElmslnStudioDashboard);
export { ElmslnStudioDashboard };
