/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import "@polymer/iron-ajax/iron-ajax.js";
import "@lrnwebcomponents/accent-card/accent-card.js";
import "@lrnwebcomponents/nav-card/nav-card.js";
import "@lrnwebcomponents/progress-donut/progress-donut.js";
import "@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";

/**
 * `elmsln-studio-dashboard`
 * Studio App for ELMS:LN
 *
 * @customElement elmsln-studio-dashboard
 * @lit-html
 * @lit-element
 * @demo demo/dashboard.html
 */
class ElmslnStudioDashboard extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          font-family: var(--elmsln-studio-FontFamily, "Roboto", sans-serif);
          font-size: 13px;
        }
        .sr-only {
          position: absolute;
          left: -9999999px;
          width: 0;
          overflow: hidden;
        }
        h1,
        h2,
        h3,
        .card [slot="heading"] {
          font-size: 14px;
          font-weight: normal;
          margin: 0;
          color: var(--simple-colors-default-theme-grey-7, #666);
        }
        h2,
        #secondary [slot="heading"] {
          font-size: 18px;
        }
        .card {
          margin: calc(0.5 * var(--elmsln-studio-margin, 20px))
            var(--elmsln-studio-margin, 20px)
            calc(2 * var(--elmsln-studio-margin, 20px));
          flex: 1 0 calc(50% - 2 * var(--elmsln-studio-margin, 20px));
          --accent-card-footer-border-color: transparent;
        }
        .card [slot="subheading"] {
          text-decoration: underline;
          border: none;
          font-family: inherit;
          font-size: inherit;
          font-weight: normal;
        }
        .card [slot="subheading"]:focus,
        .card [slot="subheading"]:hover {
          text-decoration: none;
        }
        .card th,
        .card td {
          padding: 5px 0;
          text-align: left;
          min-height: 25px;
          border-bottom: 1px solid
            var(--simple-colors-default-theme-grey-4, #666);
        }
        #primary .card [slot="heading"],
        #primary .card [slot="subheading"] {
          text-align: center;
          display: block;
          margin: 0 auto;
        }
        #secondary {
          margin-top: 0;
          --accent-card-heading-padding-top: 0;
          --nav-card-linklist-margin-top: 0;
          --nav-card-linklist-left-size: 36px;
          --paper-avatar-width: var(--nav-card-linklist-left-size, 36px);
        }
        accent-card {
          --accent-card-heading-padding-top: 0;
        }
        progress-donut {
          max-width: 100px;
          margin: 0 auto;
        }
        accent-card table {
          width: 100%;
          border-collapse: collapse;
        }
        accent-card button,
        .linklist button {
          border: none;
          padding: 0;
          text-align: left;
          font-size: inherit;
          font-weight: inherit;
        }
        .linklist-footer {
          text-align: center;
          display: block;
          padding: 5px 10px;
          margin: 0 auto;
          border-radius: 3px;
          background-color: var(--simple-colors-default-theme-grey-2, #eee);
          color: var(--simple-colors-default-theme-grey11, #222);
        }
        .linklist-footer:focus,
        .linklist-footer:hover {
          background-color: var(--simple-colors-default-theme-grey-3, #ddd);
          color: var(--simple-colors-default-theme-grey12, #000);
        }
        @media screen and (min-width: 600px) {
          progress-donut {
            max-width: 150px;
          }
          :host {
            display: flex;
            align-items: stretch;
            justify-content: space-between;
          }
          #primary {
            flex: 0 0 calc(50%);
          }
          #secondary {
            flex: 0 0 calc(50%);
          }
          h1,
          h2 {
            flex: 0 0 calc(100% - var(--elmsln-studio-margin, 20px));
            padding: 0 var(--elmsln-studio-margin, 20px);
          }
        }
        @media screen and (min-width: 900px) {
          progress-donut {
            max-width: 200px;
          }
          #primary {
            flex: 0 0 calc(66.66666667%);
          }
          #secondary {
            flex: 0 0 calc(33.33333333%);
          }
          #primary > div {
            display: flex;
            align-items: stretch;
            justify-content: space-between;
            flex-wrap: wrap;
          }
        }
      `
    ];
  }
  // render function
  render() {
    return html`
      <iron-ajax
        auto
        url="${this.activitySrc}"
        @response="${e => this._handleArrayData(e, "__activity")}"
      ></iron-ajax>
      <iron-ajax
        auto
        url="${this.assignmentsSrc}"
        @response="${e => this._handleArrayData(e, "__assignments")}"
      ></iron-ajax>
      <iron-ajax
        auto
        url="${this.commentsSrc}"
        @response="${e => this._handleArrayData(e, "__comments")}"
      ></iron-ajax>
      <iron-ajax
        auto
        url="${this.profileSrc}"
        @response="${e => this._handleObjectData(e, "__profile")}"
      ></iron-ajax>
      <iron-ajax
        auto
        url="${this.submissionsSrc}"
        @response="${e => this._handleObjectData(e, "__submissions")}"
      ></iron-ajax>
      <h1 class="sr-only">Overview</h1>
      <div id="primary">
        <div id="profile">
          <h2>${this.__profile.student.data.display_name}</h2>
          <accent-card accent-color="purple" class="card">
            <span slot="heading" class="sr-only">My Progress</span>
            <progress-donut
              accent-color="purple"
              slot="content"
              animation="500"
              animation-delay="500"
              complete="[5,3,2,6]"
              donut-width="25%"
              chart-padding="0"
              image-src="${this.__profile.student.data.sis.avatar_url}"
              image-alt="Profile picture for ${this.__profile.student.data
                .display_name}"
              start-angle="0"
              total="30"
            ></progress-donut>
            <table slot="content">
              <tbody>
                <tr>
                  <th scope="row">Course Progress</th>
                  <td>
                    ${Math.round(
                      (this.__profile.student.progress.submissions.reduce(
                        (sum, val) => sum + val
                      ) *
                        100) /
                        this.__profile.student.progress.totalAssignments
                    )}%
                  </td>
                </tr>
                <tr>
                  <th scope="row">Comments</th>
                  <td>${this.__profile.student.progress.comments}</td>
                </tr>
                <tr>
                  <th scope="row">Submissions</th>
                  <td>
                    ${this.__profile.student.progress.submissions.reduce(
                      (sum, val) => sum + val
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </accent-card>
          <nav-card accent-color="green" class="card">
            <span slot="heading">Work Due</span>
            <div slot="linklist">
              ${this.__assignments.map(
                (assign, i) => html`
                  <nav-card-item icon="chevron-right">
                    <button
                      id="due-${i}"
                      aria-describedby="due-desc-${i}"
                      slot="label"
                    >
                      ${assign.attributes.title}
                    </button>
                    <span id="due-desc-${i}" slot="description">
                      ${this._getDueDate(assign)
                        ? html`
                            Due
                            ${this.date(
                              parseInt(this._getDueDate(assign)) * 1000
                            )}
                          `
                        : ``}
                    </span>
                  </nav-card-item>
                `
              )}
            </div>
          </nav-card>
        </div>
        <div id="work">
          <h2>Recent Work</h2>
          <nav-card accent-color="amber" class="card" link-icon="chevron-right">
            <span slot="heading">Submissions</span>
            <button slot="subheading">All submissions</button>
            <div slot="linklist">
              ${Object.keys(this.__submissions).map(
                (submission, i) => html`
                  <nav-card-item icon="chevron-right">
                    <button
                      id="submission-${i}"
                      aria-describedby="submission-desc-${i}"
                      slot="label"
                    >
                      ${this.__submissions[submission].attributes.title}
                    </button>
                    <span id="submission-desc-${i}" slot="description"
                      >${this.date(
                        this.__submissions[submission].meta.changed
                      )}</span
                    >
                  </nav-card-item>
                `
              )}
            </div>
          </nav-card>
          <nav-card accent-color="cyan" class="card" link-icon="chevron-right">
            <span slot="heading">Comments</span>
            <button slot="subheading">All comments</button>
            <!-- TODO need a comments list where student is in the thread or thread is about student submission -->
            <div slot="linklist">
              ${this.__comments.map(
                (comment, i) => html`
                  <nav-card-item icon="chevron-right">
                    <button
                      id="comment-${i}"
                      aria-describedby="comment-desc-${i}"
                      slot="label"
                    >
                      ${comment.attributes.subject}
                    </button>
                    <span id="comment-${i}" slot="description"
                      >${this.date(comment.attributes.changed)}</span
                    >
                  </nav-card-item>
                `
              )}
            </div>
          </nav-card>
        </div>
      </div>
      <nav-card
        id="secondary"
        flat
        no-border
        class="card"
        link-icon="chevron-right"
      >
        <span slot="heading">Recent Activity</span>
        <div slot="linklist">
          ${this.__activity.map(
            (activity, i) => html`
              <nav-card-item
                icon="chevron-right"
                avatar="${activity.relationships.author.data.avatar || ""}"
                initials="${activity.relationships.author.data.display_name ||
                  ""}"
              >
                <button
                  id="activity-${i}"
                  aria-describedby="activity-desc-${i}"
                  slot="label"
                >
                  ${activity.relationships.author.data.sis.sortable_name.replace(
                    /.*,/,
                    ""
                  )}
                  ${activity.type === "comment" ? "commented" : "submitted"}
                  ${activity.type === "comment"
                    ? activity.attributes.subject
                    : activity.attributes.title}
                </button>
                <span id="activity-desc-${i}" slot="description">
                  ${this.date(
                    activity.type === "comment"
                      ? activity.attributes.changed
                      : activity.meta.changed
                  )}
                </span>
              </nav-card-item>
            `
          )}
        </div>
        <button class="linklist-footer" slot="footer">Load More</button>
      </nav-card>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /*
       * source JSON for all activity
       * (submissions and comments by anyone)
       */
      activitySrc: {
        type: String,
        attribute: "activity-src"
      },
      /*
       * source JSON for upcoming assignments
       * that student hasn't submitted yet
       */
      assignmentsSrc: {
        type: String,
        attribute: "assignments-src"
      },
      /*
       * source JSON for most recent comments in response to
       * student's comment or submission
       */
      commentsSrc: {
        type: String,
        attribute: "comments-src"
      },
      /*
       * source JSON for student's profile data (name & course progress)
       */
      profileSrc: {
        type: String,
        attribute: "profile-src"
      },
      /*
       * source JSON for student's most recent submissions
       */
      submissionsSrc: {
        type: String,
        attribute: "submissions-src"
      },
      /*
       * recent activity
       * (submissions and comments from everyone)
       */
      __activity: {
        type: Array
      },
      /*
       * upcoming assignments
       */
      __assignments: {
        type: Array
      },
      /*
       * most recent comments in response to
       * student's comment or submission
       */
      __comments: {
        type: Array
      },
      /*
       * student's profile data
       * (name & course progress)
       */
      __profileSrc: {
        type: Object
      },
      /*
       * student's submissions
       */
      __submissions: {
        type: Object
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
    this.__activity = [];
    this.__assignments = [];
    this.__comments = [];
    this.__profile = {
      student: {
        data: {
          type: "user",
          id: "371",
          name: "toc5234",
          display_name: "Tom Cat",
          avatar: "http://placekitten.com/300/150",
          sis: {
            id: 6966348,
            name: "Tom Cat",
            created_at: "2019-07-24T16:16:51-04:00",
            sortable_name: "Cat, Tom",
            short_name: "Tom Cat",
            sis_user_id: "toc5234@psu.edu",
            integration_id: null,
            avatar_url: "http://placekitten.com/300/150"
          }
        },
        progress: {
          comments: 22,
          submissions: [5, 3, 2, 6],
          totalAssignments: 30
        }
      }
    };
    this.__submissions = [];
    this.tag = ElmslnStudioDashboard.tag;
  }
  _getDueDates(item) {
    return item.meta.rationale && item.meta.rationale.data
      ? item.meta.rationale.data
      : undefined;
  }
  _getDueDate(item) {
    //console.log('_getDueDate',item,this._getDueDates(item));
    return this._getDueDates(item)
      ? this._getDueDates(item)[1] || this._getDueDates(item)[0]
      : undefined;
  }
  _handleArrayData(e, propName) {
    this[propName] =
      e && e.detail && e.detail.response && e.detail.response.data
        ? e.detail.response.data
        : [];
    //console.log("_handleArrayData", e, propName, this[propName]);
  }
  _handleObjectData(e, propName) {
    this[propName] =
      e && e.detail && e.detail.response && e.detail.response.data
        ? e.detail.response.data
        : {};
    //console.log('_handleObjectData',e,propName,this[propName]);
  }

  date(time) {
    let date,
      options = {
        //weekday: 'long',
        year: "numeric",
        month: "long",
        day: "numeric"
      };
    if (time && isNaN(time)) {
      let parts = time.split(/\D+/);
      date = new Date(...parts);
      /*console.log('date',parts,
      '\ndate',date,
      '\ntoString',date.toString(),
      '\ntoLocaleString',date.toLocaleString(),
      '\ntoLocaleDateString',date.toLocaleDateString(undefined,options),
      '\ntoUTCString',date.toUTCString(),
      '\ntoTimeString',date.toTimeString(),
      '\ntoLocaleTimeString',date.toLocaleTimeString()
      );*/
    } else if (time) {
      date = new Date(parseInt(time));
    }
    return date.toLocaleDateString(undefined, options);
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }
  // static get observedAttributes() {
  //   return [];
  // }
  // disconnectedCallback() {}

  // attributeChangedCallback(attr, oldValue, newValue) {}
}
customElements.define("elmsln-studio-dashboard", ElmslnStudioDashboard);
export { ElmslnStudioDashboard };
