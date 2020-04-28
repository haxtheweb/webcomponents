/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import "@polymer/iron-ajax/iron-ajax.js";
import "@lrnwebcomponents/accent-card/accent-card.js";
import "@lrnwebcomponents/a11y-collapse/a11y-collapse.js";
import "@lrnwebcomponents/progress-donut/progress-donut.js";
import "@polymer/iron-icons/iron-icons.js";

/**
 * `elmsln-studio-dashboard`
 * Studio App for ELMS:LN
 *
 * @customElement elmsln-studio-dashboard
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class ElmslnStudioDashboard extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          font-family: var(--elmsln-studio--FontFamily, sans-serif);
          font-size: 13px;
        }
        h1,
        h2,
        h3,
        [slot="heading"] {
          font-size: 14px;
          font-weight: normal;
          color: var(--simple-colors-default-theme-grey-7, #666);
          margin: 0;
        }
        [slot="subheading"] {
          text-decoration: underline;
        }
        [slot="subheading"]:focus,
        [slot="subheading"]:hover {
          text-decoration: none;
        }
        accent-card {
          margin: var(--elmsln-studio--Margin, 20px);
          flex: 1 0 calc(50% - 2 * var(--elmsln-studio--Margin, 20px));
        }
        .linklist {
          list-style-type: none;
          padding-inline-start: 0;
        }
        #comments .linklist {
          padding: 0 var(--elmsln-studio--Margin, 20px);
        }
        .linklist li {
          position: relative;
          padding: 5px 0;
          margin-bottom: 1px;
          opacity: 0.8;
        }
        .linklist li,
        accent-card th,
        accent-card td {
          padding: 5px 0;
          text-align: left;
          min-height: 25px;
          border-bottom: 1px solid
            var(--simple-colors-default-theme-grey-4, #666);
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
        .linklist iron-icon {
          position: absolute;
          width: 24px;
          height: 24px;
          right: 0px;
          top: calc(50% - 12px);
        }
        .linklist-heading::after {
          content: " ";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
        }
        .linklist li:focus,
        .linklist li:focus-within .linklist-heading::after {
          outline: 1px solid blue;
        }
        .linklist li:hover {
          cursor: pointer;
          opacity: 1;
        }
        .linklist-heading,
        .linklist-subheading {
          display: block;
          width: calc(100% - 24px);
        }
        .linklist-heading {
          font-weight: bold;
        }
        .linklist-subheading {
          font-size: 12px;
        }
        @media screen and (min-width: 600px) {
          :host {
            display: flex;
            align-items: stretch;
            justify-content: space-between;
          }
          #cards {
            width: calc(66.66666667%);
          }
          #comments {
            padding-right: var(--elmsln-studio--Padding, 20px);
            width: calc(33.33333333% - var(--elmsln-studio--Padding, 20px));
          }
          h1,
          h2 {
            flex: 0 0 calc(100% - var(--elmsln-studio--Margin, 20px));
            padding: 0 var(--elmsln-studio--Margin, 20px);
          }
        }
        @media screen and (min-width: 900px) {
          #cards > div {
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
      <!--h1 class="sr-only">Overview</h1-->
      <div id="cards">
        <div id="profile">
          <h2 class="sr-only">My Progress</h2>
          <accent-card accent-color="purple">
            <span slot="heading"
              >${this.__profile.student.data.display_name}</span
            >
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
          <accent-card accent-color="green">
            <span slot="heading">Work Due</span>
            <ul class="linklist" slot="content">
              ${this.__assignments.map(
                assign => html`
                  <li>
                    <iron-icon
                      aria-hidden="true"
                      icon="chevron-right"
                    ></iron-icon>
                    <button class="linklist-heading">
                      ${assign.attributes.title}
                    </button>
                    <span class="linklist-subheading"
                      >${this._getDueDate(assign)
                        ? html`
                            Due
                            ${this.date(
                              parseInt(this._getDueDate(assign)) * 1000
                            )}
                          `
                        : ``}
                    </span>
                  </li>
                `
              )}
            </ul>
          </accent-card>
        </div>
        <div id="work">
          <h2>Recent Work</h2>
          <accent-card accent-color="amber">
            <span slot="heading">Submissions</span>
            <button slot="subheading">All submissions</button>
            <ul class="linklist" slot="content">
              ${Object.keys(this.__submissions).map(
                submission => html`
                  <li>
                    <iron-icon
                      aria-hidden="true"
                      icon="chevron-right"
                    ></iron-icon>
                    <button class="linklist-heading">
                      ${this.__submissions[submission].attributes.title}
                    </button>
                    <span class="linklist-subheading"
                      >${this.date(
                        this.__submissions[submission].meta.changed
                      )}</span
                    >
                  </li>
                `
              )}
            </ul>
          </accent-card>
          <accent-card accent-color="cyan">
            <span slot="heading">Comments</span>
            <button slot="subheading">All comments</button>
            <!-- TODO need a comments list where student is in the thread or thread is about student submission -->
            <ul class="linklist" slot="content">
              ${this.__comments.map(
                comment => html`
                  <li>
                    <iron-icon
                      aria-hidden="true"
                      icon="chevron-right"
                    ></iron-icon>
                    <button class="linklist-heading">
                      ${comment.attributes.subject}
                    </button>
                    <span class="linklist-subheading"
                      >${this.date(comment.attributes.changed)}</span
                    >
                  </li>
                `
              )}
            </ul>
          </accent-card>
        </div>
      </div>
      <div id="comments">
        <h2>Recent Activity</h2>
        <ul class="linklist">
          ${this.__activity.map(
            activity => html`
              <li>
                <iron-icon aria-hidden="true" icon="chevron-right"></iron-icon>
                <button class="linklist-heading">
                  ${activity.relationships.author.data.sis.sortable_name.replace(
                    /.*,/,
                    ""
                  )}
                  ${activity.type === "comment" ? "commented" : "submitted"}
                  ${activity.type === "comment"
                    ? activity.attributes.subject
                    : activity.attributes.title}
                </button>
                <span class="linklist-subheading">
                  ${this.date(
                    activity.type === "comment"
                      ? activity.attributes.changed
                      : activity.meta.changed
                  )}
                </span>
              </li>
            `
          )}
        </ul>
      </div>
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
  tag() {
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
