/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { ElmslnStudioUtilities } from "./elmsln-studio-utilities.js";
import "@lrnwebcomponents/progress-donut/progress-donut.js";

/**
 * `elmsln-studio-dashboard`
 * Studio App for ELMS:LN
 *
 * @customElement elmsln-studio-dashboard
 * @lit-html
 * @lit-element
 * @demo demo/dashboard.html
 */
class ElmslnStudioDashboard extends ElmslnStudioUtilities(LitElement) {
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
        progress-donut {
          max-width: 100px;
          margin: 0 auto;
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
          progress-donut {
            max-width: 150px;
          }
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
          #profile {
            --lrndesign-avatar-width: 200px;
          }
          #profile lrndesign-avatar {
            margin: 0 auto;
          }
          progress-donut {
            max-width: 200px;
          }
        }
      `
    ];
  }
  // render function
  render() {
    return html`
      <h1 class="sr-only">Overview</h1>
      ${!this.userData ? html`` : html`
        <div id="primary">
          <div id="profile">
            <h2>${this.getFullName(this.userData)}</h2>
            <accent-card accent-color="purple" class="card primary">
              <span slot="heading" class="sr-only">My Progress</span>
              <lrndesign-avatar
                accent-color="${this.getAccentColor(this.getFullName(this.userData))}"
                slot="content"
                .image-src="${this.userData.image
                  ? this.userData.image
                  : undefined}"
                label="${this.getFullName(this.userData)}"
                two-chars
                size="200px"
              ></lrndesign-avatar>
              <table slot="content">
                <tbody>
                  <tr>
                    <th scope="row">Feedback Given</th>
                    <td>
                      ${this._userStat("feedbackBy")}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Conversations</th>
                    <td>
                      ${this._userStat("repliesBy")+this._userStat("feedbackBy")}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Total Submissions</th>
                    <td>
                      ${this._userStat("submissions")}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Assignments Completed</th>
                    <td>
                      ${this._userStat("assignments")} / ${this.assignments.length}
                    </td>
                  </tr>
                </tbody>
              </table>
            </accent-card>
            <nav-card accent-color="green" class="card primary">
              <span slot="heading">Work Due</span>
              <div slot="linklist">
                ${this.workDue.map(
                  a => html`
                    <nav-card-item icon="chevron-right">
                      <button
                        id="due-${a.id}"
                        aria-describedby="due-${a.id}-desc"
                        slot="label"
                      >
                        ${a.assignment}
                      </button>
                      <span id="due-${a.id}-desc" slot="description"
                        >${this.fullDate(a.date)}</span
                      >
                    </nav-card-item>
                  `
                )}
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
              <button slot="subheading">All submissions</button>
              <div slot="linklist">
                ${(this.userData.submissions || []).slice(0, 5).map(
                  s => html`
                    <nav-card-item icon="chevron-right">
                      <button
                        id="sub-${s.id}"
                        aria-describedby="sub-${s.id}-desc"
                        slot="label"
                      >
                        ${s.assignment}
                      </button>
                      <span id="sub-${s.id}-desc" slot="description"
                        >${this.medDate(s.date)}</span
                      >
                    </nav-card-item>
                  `
                )}
              </div>
            </nav-card> 
            <nav-card
              accent-color="cyan"
              class="card primary"
              link-icon="chevron-right"
            >
              <span slot="heading">Feedback</span>
              <button slot="subheading">All feedback</button>
              <div slot="linklist">
                ${(this.userData.feedbackFor || []).slice(0, 3).map(
                  f => html`
                    <nav-card-item icon="chevron-right">
                      <button
                        id="feed-${f.id}"
                        aria-describedby="feed-${f.id}-desc"
                        slot="label"
                      >
                        ${this.user(f.userId).firstName}'s feedback
                      </button>
                      <span id="feed-${f.id}-desc" slot="description"
                        >${this.medDate(f.date)}</span
                      >
                    </nav-card-item>
                  `
                )}
              </div>
            </nav-card>
          </div>
        </div>
      `}
      <div id="secondary">
        <nav-card
          flat
          no-border
          class="card secondary"
          link-icon="chevron-right"
        >
          <span slot="heading">Recent Activity</span>
          <div slot="linklist">
            ${this.activity.map(
              a => html`
                <nav-card-item
                  accent-color="${this.getAccentColor(
                    this.user(a.userId).firstName
                  )}"
                  .avatar="${this.user(a.userId).image}"
                  icon="chevron-right"
                  .initials="${this.user(a.userId).firstName} ${this.user(
                    a.userId
                  ).lastName}"
                >
                  <button
                    id="act-${a.id}"
                    aria-describedby="act-${a.id}-desc"
                    slot="label"
                  >
                    ${this._getActivityTitle(a)}
                  </button>
                  <span id="act-${a.id}-desc" slot="description"
                    >${this.medDate(a.date)}</span
                  >
                </nav-card-item>
              `
            )}
          </div>
          <button
            class="load-more"
            slot="footer"
            ?disabled="${this.activity.length === this.activities.length}"
            ?hidden="${this.activity.length === this.activities.length}"
            @click="${e => this._loadMore(e, "activity", "activities", 10)}"
          >
            Load More
          </button>
        </nav-card>
      </div>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      activities: {
        type: Array
      },
      activity: {
        type: Array
      },
      assignments: {
        type: Array
      },
      userData: {
        type: Object,
        attirbute: "user-data"
      },
      activityLoad: {
        type: Number,
        attirbute: "activity-load"
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "elmsln-studio-dashboard";
  }

  // life cycle
  constructor() {
    super();
    this.assignments = [];
    this.activities = [];
    this.activityLoad = 15;
    this.tag = ElmslnStudioDashboard.tag;
  }  

  get activity(){
    return this.activities.slice(0, this.activityLoad);
  }
  get workDue(){
    return this.assignments.filter(i=>!this.userData || !this.userData.assignments || !this.userData.assignments.includes(i.id));
  }

  _userStat(arr){
    return this.userData && this.userData[arr] ? this.userData[arr].length : 0;
  }

  initDemo() {
    let data = this.loremData;
    if(!this.userId) this.userId = this._randomItem(Object.keys(this.loremData.students));
    this.userData = this._getProfile(this.userId);
    this.assignments = this._toArray(data.assignments);
    this.activities = data.activities;
  }

  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "demoMode" && this.demoMode) this.initDemo();
      if (propName === "userId" && this.demoMode) this.userData = this._getProfile(this.userId);
    });
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }

  _loadMoreComments(e) {
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
