/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js"
import { ElmslnStudioStyles } from "./elmsln-studio-styles.js";
import { ElmslnStudioUtilities } from "./elmsln-studio-utilities.js";
import "@polymer/iron-icons/communication-icons.js";

/**
 * `elmsln-studio-submissions`
 * Studio App for ELMS:LN
 *
 * @customElement elmsln-studio-submissions
 * @lit-html
 * @lit-element
 * @demo demo/submission.html
 */
class ElmslnStudioSubmissions extends ElmslnStudioUtilities(LitElement) {
  static get styles() {
    return [
      ...ElmslnStudioStyles.styles,
      css`
        #layout {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }
        #primary .filters > *,
        #layout > * {
          flex: 0 1 auto;
          margin: 0 calc(0.5 * var(--elmsln-studio-margin, 20px));
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
        accent-card button {
          padding: calc(0.5 * var(--elmsln-studio-margin, 20px));
          background-color: transparent;
          text-align: left;
        }
        accent-card button:last-child {
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
      <div id="primary">
        <div class="filters">
          <simple-fields-field
            inline
            label="Assignment:"
            .options="${this.assignmentOptions}"
            @value-changed="${e => (this.assignmentFilter = e.detail.value)}"
          >
          </simple-fields-field>
          <simple-fields-field
            inline
            label="Student:"
            .options="${this.studentOptions}"
            @value-changed="${e => (this.studentFilter = e.detail.value)}"
          >
          </simple-fields-field>
          <div id="layout">
            <button
              aria-pressed="${this.grid ? "false" : "true"}"
              @click="${e => (this.grid = false)}"
            >
              <iron-icon icon="icons:view-list"></iron-icon>
              <span class="sr-only">display as list</span>
            </button>
            <button
              aria-pressed="${this.grid ? "true" : "false"}"
              @click="${e => (this.grid = true)}"
            >
              <iron-icon icon="icons:view-module"></iron-icon>
              <span class="sr-only">display as grid</span>
            </button>
          </div>
        </div>
        <div id="cards" class="${this.grid ? "grid" : "list"}">
          <div
            class="no-submissions"
            ?hidden="${this.filteredSubmissions.length > 0}"
          >
            No submissions for applied filters.
          </div>
          ${this.filteredSubmissions.map(
            s => html`
              <accent-card
                no-border
                image-src="${s.image.src}"
                ?horizontal="${s.feature || !this.grid ? true : false}"
                image-align="${this._getAlign(s.gravity)}"
                image-valign="${this._getValign(s.gravity)}"
                gravity="${s.gravity}"
              >
                <div slot="image-corner" class="image-zoom">
                  <iron-icon icon="zoom-in"></iron-icon>
                </div>
                <div slot="heading" id="student-${s.id}" class="card-student">
                  ${this.user(s.userId).firstName}
                  ${this.user(s.userId).lastName}
                </div>
                <div slot="corner" id="date-${s.id}">
                  ${this.grid ? this.dateFormat(s.date,"short") : this.dateFormat(s.date)}
                </div>
                <div slot="subheading" id="assignment-${s.id}">
                  ${this.assignment(s.assignmentId).assignment}
                </div>
                <div slot="content" id="project-${s.id}">
                  ${this.project(this.assignment(s.assignmentId).projectId)
                    .project}
                </div>
                <div slot="content" class="feature" ?hidden="${!s.feature}">
                  ${s.feature}
                </div>
                <div slot="footer">
                  <button
                    aria-describedby="student-${s.id} date-${s.id} assignment-${s.id} project${s.id}"
                    @click="${e=>location.href='./portfolio?submission=${s.id}'}&feedback=${s.feedback[0]}'}"
                  >
                    <iron-icon icon="communication:comment"></iron-icon>
                    Discussion
                  </button>
                  <button
                    aria-describedby="student-${s.id} date-${s.id} assignment-${s.id} project${s.id}"
                    @click="${e=>location.href='./portfolio?submission=${s.id}'}"
                  >
                    <iron-icon icon="visibility"></iron-icon>
                    View
                  </button>
                </div>
              </accent-card>
            `
          )}
        </div>
      </div>
      <div id="secondary">
        <div class="filters">
          <span class="comments">Comments:&nbsp;</span>
          <span class="comments-filter"
            >${this.assignmentFilter !== "" || this.studentFilter !== ""
              ? "Filtered"
              : "All"}</span
          >
        </div>
        <nav-card flat no-border class="card" link-icon="chevron-right">
          <span slot="heading">Recent Comments</span>
          <div slot="body" ?hidden="${this.filteredComments.length > 0}">
            No comments for applied filters.
          </div>
          <div slot="linklist">
            ${this.filteredComments.map(
              f => html`
                <nav-card-item
                  accent-color="${this.accentColor(
                    this.user(f.userId).firstName
                  )}"
                  .avatar="${this.user(f.userId).image}"
                  icon="chevron-right"
                  initials="${this.user(f.userId).firstName} ${this.user(
                    f.userId
                  ).lastName}"
                >
                  <button
                    id="comment-${this.user(f.userId).id}"
                    aria-describedby="comment-${this.user(f.userId).id}-desc"
                    slot="label"
                  >
                    ${this.user(f.userId).firstName} feedback on
                    ${this.user(this.submission(f.submissionId).userId)
                      .firstName}'s
                    ${this.assignment(
                      this.submission(f.submissionId).assignmentId
                    ).assignment}
                  </button>
                  <span id="comment-${f.id}v" slot="description">
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
      assignmentOptions: {
        type: Array
      },
      feedbackData:{
        type: Array
      },
      grid: {
        type: Boolean,
        attribute: "grid"
      },
      studentFilter: {
        type: String,
        attribute: "student-filter"
      },
      studentOptions: {
        type: Array
      },
      submissionData: {
        type: Array
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "elmsln-studio-submissions";
  }

  // life cycle
  constructor() {
    super();
    this.assignmentFilter = "";
    this.assignmentOptions = { "": "All" };
    this.grid = false;
    this.studentOptions = { "": "All" };
    this.studentFilter = "";
    this.submissionData = [];
    this.feedbackData = [];
    this.tag = ElmslnStudioSubmissions.tag;
  }

  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "demoMode" && this.demoMode) console.log(propName,oldValue,this.demoMode);
      if (propName === "demoMode" && this.demoMode) this.initDemo();
    });
  }

  initDemo() {
    this.studentOptions = { "": "All" };
    this.assignmentOptions = { "": "All" };
    Object.keys(this.loremData.students).forEach(i => this.studentOptions[i] = `${this.loremData.users[i].lastName}, ${this.loremData.users[i].firstName}`);
    Object.keys(this.loremData.assignments).forEach(i => this.assignmentOptions[i] = this.loremData.assignments[i].assignment);
    this.submissionData = Object.keys(this.loremData.submissions).map(i=>{
      let submission = this.loremData.submissions[i];
      submission.id = i;
      return submission;
    }).sort((a,b)=>b.date-a.date);
    this.feedbackData = Object.keys(this.loremData.feedback).map(i=>{
      let feedback = this.loremData.feedback[i];
      feedback.id = i;
      return feedback;
    }).sort((a,b)=>b.date-a.date);
    console.log("submissions", this.submissionData, this.studentOptions,this.filteredSubmissions);
  }
  get filteredSubmissions() {
    let filter = this.submissionData.filter(a =>
    this._isFiltered(a.userId, a.assignmentId)
    );
    //console.log("submissions", this.submissionData, filter);
    return filter;
  }
  get filteredComments() {
    let filter = this.feedbackData.filter(i =>
      this._isFiltered(
        this.submission(i.submissionId).userId,
        this.submission(i.submissionId).assignmentId
      )
    );
    return filter;
  }

  _discussionClick(id){
    /**
     * Fires when constructed, so that parent radio group can listen for it.
     *
     * @event a11y-collapse-attached
     */
    this.dispatchEvent(
      new CustomEvent("discuss-submission", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: id
      })
    );
  }
  _viewClick(id){
    /**
     * Fires when constructed, so that parent radio group can listen for it.
     *
     * @event a11y-collapse-attached
     */
    this.dispatchEvent(
      new CustomEvent("view-submission", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: id
      })
    );

  }
  _zoomClick(id){
    /**
     * Fires when constructed, so that parent radio group can listen for it.
     *
     * @event a11y-collapse-attached
     */
    this.dispatchEvent(
      new CustomEvent("zoom-submission", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: id
      })
    );

  }

  _getValign(gravity) {
    return gravity && gravity.indexOf("top") > -1
      ? "top"
      : gravity && gravity.indexOf("bottom") > -1
      ? "bottom"
      : "center";
  }

  _getAlign(gravity) {
    return gravity && gravity.indexOf("left") > -1
      ? "left"
      : gravity && gravity.indexOf("right") > -1
      ? "right"
      : "center";
  }
  _isFiltered(student = "", assignment = "") {
    //console.log(this.assignmentFilter,this.studentFilter);
    /*console.log(
      student,
      "-",
      this._isFilteredStudent(student),
      "-",
      assignment,
      "-",
      this._isFilteredAssignment(assignment),
      "=",
      this._isFilteredStudent(student) || this._isFilteredAssignment(assignment)
    );*/
    return (
      this._isFilteredStudent(student) && this._isFilteredAssignment(assignment)
    );
  }
  _isFilteredAssignment(assignment = "") {
    return this.assignmentFilter === "" || assignment === this.assignmentFilter;
  }
  _isFilteredStudent(student = "") {
    return this.studentFilter === "" || student === this.studentFilter;
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
customElements.define("elmsln-studio-submissions", ElmslnStudioSubmissions);
export { ElmslnStudioSubmissions };
