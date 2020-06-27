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
          color: #9D9D9D; 
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
          color: #95989A;
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
          color: #5C5C5C;
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
          font-family: var(--elmsln-studio-ssecondary-FontFamily, "Helvetica Neue", sans-serif);
        }
        accent-card  th,
        accent-card  td {
          font-weight: normal;
          padding: 5px 0;
          text-align: left;
          min-height: 25px;
          border-bottom: 1px solid
            var(--simple-colors-default-theme-grey-4, #666);
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
        .linklist-footer {
          text-align: center;
          display: block;
          padding: 10px;
          margin: 0;
          border-radius: 3px;
          border: none;
          background-color: var(--simple-colors-default-theme-grey-2, #eee);
          color: var(--simple-colors-default-theme-grey11, #222);
          width: calc(100% - 20px);
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
      <div id="primary">
        <div id="profile">
          <h2>${this.profile.firstName} ${this.profile.lastName}</h2>
          <accent-card accent-color="purple" class="card primary">
            <span slot="heading" class="sr-only">My Progress</span>
            <progress-donut
              accent-color="purple"
              slot="content"
              animation="500"
              animation-delay="500"
              .complete="${this.projects}"
              donut-width="25%"
              chart-padding="0"
              .image-src="${this.profile.image}"
              image-alt="Profile picture for ${this.profile.firstName} ${this.profile.lastName}"
              start-angle="0"
              total="${this.assignments.length}"
            ></progress-donut>
            <table slot="content">
              <tbody>
                <tr>
                  <th scope="row">Course Progress</th>
                  <td>
                    ${this.submissions.length} /${this.assignments.length} =
                    ${(Math.round(100 * this.submissions.length / this.assignments.length) ) }%
                  </td>
                </tr>
                <tr>
                  <th scope="row">Comments</th>
                  <td>${this.contributions.length}</td>
                </tr>
                <tr>
                  <th scope="row">Submissions</th>
                  <td>${this.submissions.length}</td>
                </tr>
              </tbody>
            </table>
          </accent-card>
          <nav-card accent-color="green" class="card primary">
            <span slot="heading">Work Due</span>
            <div slot="linklist">
              ${this.assignments.slice(3,7).map(assign => html`
                  <nav-card-item icon="chevron-right">
                    <button
                      id="due-${assign.id}"
                      aria-describedby="due-desc-${assign.id}"
                      slot="label"
                    >
                    ${assign.project}: ${assign.assignment}
                    </button>
                    <span id="due-desc-${assign.id}" slot="description">${assign.date}</span>
                  </nav-card-item>
                `
              )}
            </div>
          </nav-card>
        </div>
        <div id="work">
          <h2>Recent Work</h2>
          <nav-card accent-color="amber" class="card primary" link-icon="chevron-right">
            <span slot="heading">Submissions</span>
            <button slot="subheading">All submissions</button>
            <div slot="linklist">
              ${this.submissions.slice(0,5).map(submission => html`
                  <nav-card-item icon="chevron-right">
                    <button
                      id="submission-${submission.id}"
                      aria-describedby="submission-desc-${submission.id}"
                      slot="label"
                    >
                      ${submission.project}: ${submission.assignment}
                    </button>
                    <span id="submission-desc-${submission.id}" slot="description">${submission.date}</span>
                  </nav-card-item>
                `
              )}
            </div>
          </nav-card>
          <nav-card accent-color="cyan" class="card primary" link-icon="chevron-right">
            <span slot="heading">Comments</span>
            <button slot="subheading">All comments</button>
            <!-- TODO need a comments list where student is in the thread or thread is about student submission -->
            <div slot="linklist">
              ${this.comments.slice(0,5).map(comment => html`
                  <nav-card-item icon="chevron-right">
                    <button
                      id="comment-${comment.id}"
                      aria-describedby="comment-desc-${comment.id}"
                      slot="label"
                    >
                      ${comment.firstName}'s feedback on ${comment.assignment}
                    </button>
                    <span id="comment-${comment.id}" slot="description">${comment.date}</span>
                  </nav-card-item>
                `
              )}
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
            ${this.activity.map(activity => html`
                <nav-card-item
                  icon="chevron-right"
                  .avatar="${activity.image}"
                  .initials="${activity.firstName} ${activity.lastName}"
                >
                  <button
                    id="activity-${activity.id}"
                    aria-describedby="activity-desc-${activity.id}"
                    slot="label"
                  > ${activity.firstName} commented on 
                    ${activity.student}'s ${activity.assignment}
                  </button>
                  <span id="activity-desc-${activity.id}" slot="description">${activity.date}</span>
                </nav-card-item>
              `
            )}
          </div>
          <button 
            class="linklist-footer" 
            slot="footer" 
            ?disabled="${this.activity.length === this.activities.length}"
            ?hidden="${this.activity.length === this.activities.length}"
            @click="${this._loadMoreComments}">
            Load More
          </button>
        </nav-card>
      </div>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      activities: {
        type: Array
      },
      activity: {
        type: Array
      },
      assignments: {
        type: Array
      },
      comments: {
        type: Array
      },
      contributions: {
        type: Array
      },
      profile: {
        type: Object
      },
      projects: {
        type: Array
      },
      studentId: {
        type: String
      },
      submissions: {
        type: Array
      },
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
    this.getFakeData();
    this.tag = ElmslnStudioDashboard.tag;
  }
  _loadMoreComments(e){
    this.activity = this.activities.slice(0,this.activity.length+10);
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }

  getFakeData(){
    let data = this.fakeData,
    students = data && data.students ? data.students : [], 
    random = Math.floor(Math.random() * students.length);
    this.profile = students.length > 0 ? students[random] : {};
    this.studentId = this.profile && this.profile.id ? this.profile.id : undefined;
    this.activities = data && data.comments ? data.comments : [];
    this.activity = this.activities.slice(0,15);
    this.contributions = this.activities.filter(c=>this.studentId === c.commenterId);
    this.comments = this.activities.filter(c=>this.studentId === c.studentId);
    this.assignments = data && data.assignments ? data.assignments : [];
    this.submissions = data && data.submissions ? data.submissions.filter(s=>this.studentId === s.studentId) : [];
    this.projects = [];
    if(data && data.projects) data.projects.forEach(p=>{
      this.projects.push(
        this.submissions.filter(s=>s.projectId ===  p.id).length
      );
    });
  }
  // static get observedAttributes() {
  //   return [];
  // }
  // disconnectedCallback() {}

  // attributeChangedCallback(attr, oldValue, newValue) {}
}
customElements.define("elmsln-studio-dashboard", ElmslnStudioDashboard);
export { ElmslnStudioDashboard };
