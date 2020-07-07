/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { ElmslnStudioUtilities } from "./elmsln-studio-utilities.js";
import { ElmslnStudioStyles } from "./elmsln-studio-styles.js";

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
        .card a:link {
          color: var(--accent-card-color);
          font-style: normal;
        }
        .card a[slot="subheading"]:link,
        .card [slot="subheading"] {
          font-weight: bold;
          text-decoration: underline;
          border: none;
          font-size: calc(0.75 * var(--elmsln-studio-FontSize, 16px));
        }
        .card [slot="subheading"]:focus,
        .card [slot="subheading"]:hover {
          text-decoration: none;
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
        .card.secondary {
          margin-top: 0;
          font-size: calc(0.75 * var(--elmsln-studio-FontSize, 16px));
          --accent-card-heading-padding-top: 0;
          --nav-card-linklist-margin-top: 0;
          --nav-card-linklist-left-size: 36px;
          --paper-avatar-width: var(--nav-card-linklist-left-size, 36px);
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
        nav-card button,
        accent-card button {
          background-color: transparent;
        }
        accent-card button,
        .linklist button {
          border: none;
          padding: 0;
          text-align: left;
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
      `
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
                  <th scope="row">Feedback Given</th>
                  <td>
                    ${
                      !this.profile || !this.profile.feedbackBy
                        ? "unknown"
                        : this.profile.feedbackBy
                    }
                  </td>
                </tr>
                <tr>
                  <th scope="row">Conversations</th>
                  <td>
                    ${
                      !this.profile || !this.profile.feedbackBy || !this.profile.repliesBy
                        ? "unknown"
                        : (this.profile.repliesBy + this.profile.feedbackBy)
                    }
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <a href="/submissions${
                      !this.profile
                        ? ""
                        : `?student=${this.profile.id}`
                    }">
                      Total Submissions
                    </a>
                  </th>
                  <td>
                    ${
                      !this.profile
                        ? "unknown"
                        : (this.profile.submissions || []).length
                    }
                  </td>
                </tr>
                <tr>
                  <th scope="row">Assignments Completed</th>
                  <td>
                    ${
                      !this.profile || !this.profile.assignmentsCompleted || !this.profile.workDue || !this.profile.assignmentsTotal
                        ? "unknown"
                        : `${this.profile.assignmentsCompleted} / ${this.profile.assignmentsTotal}`
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </accent-card>
          <nav-card accent-color="green" class="card primary">
            <span slot="heading">Work Due</span>
            <div slot="linklist">
              ${
                !this.profile
                  ? "unknown"
                  : (this.profile.workDue || []).slice(0, 5).map(
                      a => html`
                        <nav-card-item icon="chevron-right">
                          <a
                            id="due-${a.id}"
                            aria-describedby="due-${a.id}-desc"
                            slot="label"
                          >
                            ${a.title}
                          </a>
                          <span id="due-${a.id}-desc" slot="description"
                            >${this.dateFormat(a.date, "long")}</span
                          >
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
            <a slot="subheading" href="/submissions${
              !this.profile
                ? ""
                : `?student=${this.profile.id}`
            }">All submissions</a>
            <div slot="linklist">
              ${
                !this.profile
                  ? "unknown"
                  : (this.profile.submissions || []).slice(0, 5).map(
                      s => html`
                        <nav-card-item icon="chevron-right">
                          <a
                            id="sub-${s.id}"
                            aria-describedby="sub-${s.id}-desc"
                            slot="label"
                            href="${s.link}"
                          >
                            ${s.title}
                          </a>
                          <span id="sub-${s.id}-desc" slot="description"
                            >${this.dateFormat(s.date)}</span
                          >
                        </nav-card-item>
                      `
                    )
              }
            </div>
          </nav-card>
          <nav-card
            accent-color="cyan"
            class="card primary"
            link-icon="chevron-right"
          >
            <span slot="heading">Feedback</span>
            <a slot="subheading">All feedback</a>
            <div slot="linklist">
              ${
                !this.profile
                  ? "unknown"
                  : (this.profile.feedbackFor || []).slice(0, 5).map(
                      f => html`
                        <nav-card-item icon="chevron-right">
                          <a
                            id="feed-${f.id}"
                            aria-describedby="feed-${f.id}-desc"
                            slot="label"
                            href="${f.link}"
                          >
                            ${f.title}
                          </a>
                          <span id="feed-${f.id}-desc" slot="description"
                            >${this.dateFormat(f.date)}</span
                          >
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
          class="card secondary"
          link-icon="chevron-right"
        >
          <span slot="heading">Recent Activity</span>
          <div slot="linklist">
            ${(this.activity || []).slice(0, this.activityLoad).map(
              a => html`
                <nav-card-item
                  accent-color="${this.accentColor(a.name)}"
                  .avatar="${a.avatar}"
                  icon="chevron-right"
                  .initials="${a.name}"
                >
                  <a
                    id="act-${a.id}"
                    aria-describedby="act-${a.id}-desc"
                    slot="label"
                    href="${a.link}"
                  >
                    ${a.title}
                  </a>
                  <div id="act-${a.id}-desc" slot="description">
                    ${this.dateFormat(a.date)}
                  </div>
                </nav-card-item>
              `
            )}
          </div>
          <button
            class="load-more"
            slot="footer"
            ?disabled="${this.activityLoad >= this.activity.length}"
            ?hidden="${this.activityLoad >= this.activity.length}"
            @click="${e => (this.activityLoad += 10)}"
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
        type: Array
      },
      activityLoad: {
        type: Number,
        attribute: "activity-load"
      },
      profile: {
        type: Object
      }
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
    return this.profile &&
      this.profile.firstName &&
      this.profile.lastName
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
