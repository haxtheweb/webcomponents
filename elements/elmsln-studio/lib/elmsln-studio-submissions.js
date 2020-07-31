/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { ElmslnStudioStyles } from "./elmsln-studio-styles.js";
import { ElmslnStudioUtilities } from "./elmsln-studio-utilities.js";
import "@polymer/iron-icons/communication-icons.js";
import "./elmsln-studio-link.js";
import "./elmsln-studio-button.js";
import "./elmsln-studio-zoom.js";

/**
 * `elmsln-studio-submissions`
 * Studio App for ELMS:LN
 *
 * @customElement elmsln-studio-submissions
 * @lit-html
 * @lit-element
 * @demo demo/submission.html
 */
class ElmslnStudioSubmissions extends ElmslnStudioUtilities(
  ElmslnStudioStyles(LitElement)
) {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "elmsln-studio-submissions";
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          flex-wrap: wrap;
        }
        .filters > *,
        #layout > * {
          flex: 0 1 auto;
          margin: 0 calc(0.5 * var(--elmsln-studio-margin, 20px));
        }
        .filters {
          flex: 1 0 100%;
        }
        #layout {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }
        #layout > button {
          background-color: transparent;
          border: 0px solid rgba(0, 0, 0, 0);
          opacity: 0.25;
          transform: opacity 0.5s ease-in-out;
          margin: 0 5px;
          height: calc(2 * var(--elmsln-studio-FontSize, 16px));
          width: calc(2 * var(--elmsln-studio-FontSize, 16px));
        }
        #layout button:focus,
        #layout button:hover {
          opacity: 0.75;
        }
        #layout button[aria-pressed="true"] {
          opacity: 1;
        }
        #cards {
          margin: var(--elmsln-studio-margin, 20px)
            calc(-0.5 * var(--elmsln-studio-margin, 20px));
          display: flex;
          align-items: stretch;
          justify-content: flex-start;
          flex-wrap: wrap;
        }
        .no-submissions {
          font-weight: var(--elmsln-studio-FontWeightLight, 300);
          font-size: 22px;
          margin: calc(0.5 * var(--elmsln-studio-margin, 20px));
          padding: var(--elmsln-studio-margin, 20px);
          width: calc(100% - 2 * var(--elmsln-studio-margin, 20px));
          background-color: #e8e8e8;
          text-align: center;
        }
        accent-card {
          line-height: 160%;
          --accent-card-padding: 0;
          --accent-card-heading-padding-top: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-heading-padding-left: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-heading-padding-right: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-subheading-padding-left: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-subheading-padding-right: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-content-padding-left: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-content-padding-right: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-content-padding-bottom: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-footer-padding-top: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-footer-padding-bottom: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-footer-padding-left: 0;
          --accent-card-footer-padding-right: 0;
          --accent-card-image-padding-bottom: 5px;
          --accent-card-image-padding-right: calc(
            0.5 * var(--elmsln-studio-margin, 20px)
          );
          --accent-card-image-width: 33.33333%;
          --accent-card-image-height: 200px;
          margin: calc(0.5 * var(--elmsln-studio-margin, 20px))
            calc(0.5 * var(--elmsln-studio-margin, 20px));
          flex: 0 0 calc(100% - var(--elmsln-studio-margin, 20px));
        }
        .grid accent-card {
          --accent-card-image-width: 50%;
        }
        .feature {
          margin-top: var(--elmsln-studio-margin, 20px);
          height: calc(
            var(--accent-card-image-height, 200px) -
              var(--elmsln-studio-margin, 20px)
          );
          overflow: auto;
        }
        accent-card [slot="image-corner"] {
          display: inline-flex;
          right: 5px;
          bottom: 10px;
          position: absolute;
          border-radius: 3px;
          background-color: rgba(0, 0, 0, 0.25);
        }
        accent-card [slot="image-corner"]:focus-within,
        accent-card [slot="image-corner"]:hover {
          background-color: rgba(0, 0, 0, 0.5);
        }
        accent-card [slot="heading"] {
          font-weight: var(--elmsln-studio-FontWeightLight, 300);
          font-size: 22px;
        }
        accent-card [slot="corner"] {
          font-weight: var(--elmsln-studio-FontWeightNormal, 400);
          font-size: 12px;
        }
        accent-card [slot="subheading"] {
          font-weight: var(--elmsln-studio-FontWeightBold, 500);
          font-size: 18px;
          font-style: normal;
          color: #5d5e5f;
        }
        accent-card [slot="content"] {
          font-weight: var(--elmsln-studio-FontWeightNormal, 400);
          font-size: 14px;
          color: #7e7e7e;
        }
        accent-card [slot="footer"] {
          font-weight: var(--elmsln-studio-FontWeightNormal, 400);
          font-size: 12px;
          text-transform: uppercase;
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          color: #95989a;
        }
        accent-card.card.submission-card elmsln-studio-link {
          margin: 0 calc(0.5 * var(--elmsln-studio-margin, 20px));
          text-align: left;
          --elmsln-studio-link-Color: #7e7e7e;
        }
        accent-card.card.submission-card elmsln-studio-link:focus,
        accent-card.card.submission-card elmsln-studio-link:focus-within,
        accent-card.card.submission-card elmsln-studio-link:hover {
          --elmsln-studio-link-Color: #95989a;
          --elmsln-studio-link-TextDecoration: none !important;
        }
        accent-card.card.submission-card elmsln-studio-link:last-child {
          text-align: right;
        }
        #secondary {
          margin-top: 0;
          --nav-card-linklist-margin-top: 0;
          --nav-card-linklist-left-size: 36px;
          --paper-avatar-width: var(--nav-card-linklist-left-size, 36px);
        }
        #secondary .filters {
          justify-content: flex-start;
        }
        .comments {
          color: #95989a;
        }
        nav-card {
          margin: calc(1.5 * var(--elmsln-studio-margin, 20px)) 0 0;
        }
        @media screen and (min-width: 500px) {
          .grid accent-card:not([horizontal]) {
            flex: 0 0 calc(50% - var(--elmsln-studio-margin, 20px));
          }
        }
        @media screen and (min-width: 900px) {
          :host {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
          }
          .grid accent-card:not([horizontal]) {
            flex: 0 0 calc(50% - var(--elmsln-studio-margin, 20px));
          }
        }
        @media screen and (min-width: 1200px) {
          .grid accent-card[horizontal] {
            flex: 0 0 calc(66.66666667% - var(--elmsln-studio-margin, 20px));
          }
          .grid accent-card:not([horizontal]) {
            flex: 0 0 calc(33.3333333333% - var(--elmsln-studio-margin, 20px));
          }
        }
        @media screen and (min-width: 1600px) {
          .grid accent-card[horizontal] {
            --accent-card-image-width: 33.33333%;
            flex: 0 0 calc(75% - var(--elmsln-studio-margin, 20px));
          }
          .grid accent-card:not([horizontal]) {
            flex: 0 0 calc(25% - var(--elmsln-studio-margin, 20px));
          }
          .list accent-card {
            --accent-card-image-width: 50%;
          }
        }
      `
    ];
  }
  // render function
  render() {
    return html`
      <h1 class="sr-only">Submissions</h1>
      <div class="filters">
        <simple-fields-field
          inline
          label="Project:"
          .options="${this.projectOptions}"
          value="${this.projectFilter || ""}"
          @value-changed="${e => (this.projectFilter = e.detail.value)}"
        >
        </simple-fields-field>
        <simple-fields-field
          inline
          label="Assignment:"
          .options="${this.assignmentOptions}"
          value="${this.assignmentFilter || ""}"
          @value-changed="${e => (this.assignmentFilter = e.detail.value)}"
        >
        </simple-fields-field>
        <simple-fields-field
          inline
          label="Student:"
          .options="${this.studentOptions}"
          value="${this.studentFilter || ""}"
          @value-changed="${e => (this.studentFilter = e.detail.value)}"
        >
        </simple-fields-field>
        <div id="layout">
          <button
            aria-pressed="${this.list ? "true" : "false"}"
            @click="${e => (this.list = true)}"
          >
            <iron-icon icon="icons:view-list"></iron-icon>
            <span class="sr-only">display as list</span>
          </button>
          <button
            aria-pressed="${this.list ? "false" : "true"}"
            @click="${e => (this.list = false)}"
          >
            <iron-icon icon="icons:view-module"></iron-icon>
            <span class="sr-only">display as grid</span>
          </button>
        </div>
      </div>
      <div id="primary">
        <div id="cards" class="${this.list ? "list" : "grid"}">
          <div
            class="no-submissions"
            ?hidden="${this.filteredSubmissions.length > 0}"
          >
            No submissions for applied filters.
          </div>
          ${this.filteredSubmissions.map(
            (s,i) => html`
              <accent-card
                no-border
                class="card submission-card"
                image-src="${s.image || ""}"
                .image-alt="${s.imageAlt || undefined}"
                ?horizontal="${s.feature || this.list ? true : false}"
                .image-align="${this._getAlign(s.imageGravity || undefined)}"
                .image-valign="${this._getValign(s.imageGravity || undefined)}"
                .gravity="${s.imageGravity || undefined}"
              >
                <div slot="image-corner" class="image-zoom">
                  <elmsln-studio-zoom 
                    id="zoom-${i}"
                    src="${s.image}"
                    next="${i + 1 < this.filteredSubmissions.length ? i + 1 : -1}"
                    prev="${i > 0 ? i - 1 : -1}">
                  </elmsln-studio-zoom>
                </div>
                <div slot="heading" id="student-${s.id}" class="card-student">
                  ${[s.firstName, s.lastName].join(" ")}
                </div>
                <div slot="corner" id="date-${s.id}">
                  ${this.list
                    ? this.dateFormat(s.date)
                    : this.dateFormat(s.date, "short")}
                </div>
                <div slot="subheading" id="assignment-${s.id}">
                  ${s.assignment}
                </div>
                <div slot="content" id="project-${s.id}">
                  ${s.project}
                </div>
                <div slot="content" class="feature" ?hidden="${!s.feature}">
                  ${s.feature}
                </div>
                <div slot="footer">
                  <elmsln-studio-link
                    aria-describedby="student-${s.id} date-${s.id} assignment-${s.id} project${s.id}"
                    href="${this.getActivityLink(s)}"
                  >
                    <iron-icon icon="communication:comment"></iron-icon>
                    Discussion${!s.feedback || s.feedback.length < 1
                      ? ``
                      : `: ${s.feedback.length}`}
                  </elmsln-studio-link>
                  <elmsln-studio-link
                    aria-describedby="student-${s.id} date-${s.id} assignment-${s.id} project${s.id}"
                    href="${this.getActivityLink(s, true)}"
                  >
                    <iron-icon icon="visibility"></iron-icon>
                    View
                  </elmsln-studio-link>
                </div>
              </accent-card>
            `
          )}
        </div>
      </div>
      <div id="secondary">
        <nav-card flat no-border class="card" link-icon="chevron-right">
          <span slot="heading">Recent Comments</span>
          <div slot="body" ?hidden="${this.filteredComments.length > 0}">
            No comments for applied filters.
          </div>
          <div slot="linklist">
            ${this.filteredComments.map(
              f => html`
                <nav-card-item
                  accent-color="${this.accentColor(this.fullName(f))}"
                  .avatar="${f.avatar}"
                  icon="chevron-right"
                  initials="${this.fullName(f)}"
                >
                  <elmsln-studio-link
                    id="comment-${f.id}"
                    aria-describedby="comment-${f.id}-desc"
                    slot="label"
                    href="${this.getActivityLink(f)}"
                  >
                    ${this.getActivityTitle(f)}
                  </elmsln-studio-link>
                  <span id="comment-${f.id}" slot="description">
                    ${this.dateFormat(f.date)}
                  </span>
                </nav-card-item>
              `
            )}
          </div>
        </nav-card>
      </div>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      assignmentFilter: {
        type: String,
        attribute: "assignment-filter"
      },
      comments: {
        type: Array
      },
      list: {
        type: Boolean,
        attribute: "list"
      },
      projectFilter: {
        type: String,
        attribute: "project-filter"
      },
      studentFilter: {
        type: String,
        attribute: "student-filter"
      },
      submissions: {
        type: Array
      }
    };
  }

  // life cycle
  constructor() {
    super();
    this.list = false;
    this.submissions = [];
    this.comments = [];
    this.tag = ElmslnStudioSubmissions.tag;
  }
  get filteredComments() {
    return (this.comments || []).filter(
      i =>
        this._isFilteredStudent(i.userId) &&
        this._isFilteredAssignment(i.assignmentId) &&
        this._isFilteredProject(i.projectId)
    );
  }
  get studentOptions() {
    let options = { "": "All" };
    (this.submissions || []).forEach(
      i => (options[i.userId] = this.fullName(i))
    );
    return options;
  }
  get assignmentOptions() {
    let options = { "": "All" };
    (this.submissions || [])
      .filter(i => this._isFilteredProject(i.projectId))
      .forEach(i => (options[i.assignmentId] = i.assignment));
    return options;
  }
  get projectOptions() {
    let options = { "": "All" };
    (this.submissions || [])
      .filter(i => i.project)
      .forEach(i => (options[i.projectId] = i.project));
    return options;
  }
  get filteredSubmissions() {
    return (this.submissions || []).filter(i => {
      return (
        this._isFilteredStudent(i.userId) &&
        this._isFilteredAssignment(i.assignmentId) &&
        this._isFilteredProject(i.projectId)
      );
    });
  }
  _isFilteredAssignment(assignment = "") {
    return this.assignmentFilter === "" || assignment === this.assignmentFilter;
  }
  _isFilteredProject(project = "") {
    return this.projectFilter === "" || project === this.projectFilter;
  }
  _isFilteredStudent(student = "") {
    return this.studentFilter === "" || student === this.studentFilter;
  }
}
customElements.define("elmsln-studio-submissions", ElmslnStudioSubmissions);
export { ElmslnStudioSubmissions };
