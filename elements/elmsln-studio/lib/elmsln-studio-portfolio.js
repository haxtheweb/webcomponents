/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js"
import { ElmslnStudioStyles } from "./elmsln-studio-styles.js";
import { ElmslnStudioUtilities } from "./elmsln-studio-utilities.js";
import "@lrnwebcomponents/lrndesign-gallery/lrndesign-gallery.js";
import "@lrnwebcomponents/hax-iconset/hax-iconset.js";

/**
 * `elmsln-studio-portfolio`
 * Studio App for ELMS:LN
 *
 * @customElement elmsln-studio-portfolio
 * @lit-html
 * @lit-element
 * @demo demo/portfolio.html
 */
class ElmslnStudioPortfolio extends ElmslnStudioUtilities(LitElement) {
  static get styles() {
    return [
      ...ElmslnStudioStyles.styles,
      css`
        :host,
        section {
          display: block;
          width: 80%;
          margin: var(--elmsln-studio-margin, 20px) auto;
        }
        h1 {
          text-align: center;
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
        .view-comments {
          text-align: right;
        }
        article button {
          background-color: transparent;
          border: none;
          color: #95989a;
          font-size: var(--elmsln-studio-FontSize, 16px);
          text-transform: uppercase;
        }
        article button.has-comments {
          font-weight: normal;
        }
        article button:focus,
        article button:hover {
          color: #4b4b4b;
        }
        section {
          margin: calc(2 * var(--elmsln-studio-margin, 20px)) auto;
          border-top: 2px solid #eaeaea;
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
        #secondary {
          background-color: #eaeaea;
          padding: 1px;
        }
        .comment {
          background-color: white;
          margin: 1px;
          padding: calc(0.5 * var(--elmsln-studio-margin, 20px)) 0;
        }
        .comment-reply {
          margin-left: calc(1 * var(--elmsln-studio-margin, 20px));
        }
        .comment-header,
        .comment-footer {
          display: flex;
          align-items: stretch;
          justify-content: space-between;
        }
        .comment-header,
        .comment-body {
          padding: 0 calc(0.5 * var(--elmsln-studio-margin, 20px));
        }
        .comment-header > div {
          margin: 0 calc(0.5 * var(--elmsln-studio-margin, 20px));
          flex: 1 1 auto;
        }
        .comment-name {
          margin: 0 0 calc(0.25 * var(--elmsln-studio-margin, 20px));
          font-size: var(--elmsln-studio-FontSize, 16px);
          font-size: calc(1.25 * var(--elmsln-studio-FontSize, 16px));
          font-weight: bold;
          color: #4b4b4b;
        }
        .comment-date {
          margin: 0;
          font-size: calc(0.75 * var(--elmsln-studio-FontSize, 16px));
          font-weight: normal;
          color: #95989a;
        }
        .comment-body {
          line-height: 160%;
          font-size: calc(0.8 * var(--elmsln-studio-FontSize, 16px));
          color: #95989a;
        }
        .comment-header iron-icon {
          color: var(--simple-colors-default-theme-grey-4);
        }
        .comment-read iron-icon {
          color: var(--simple-colors-default-theme-light-blue-7);
        }
        .comment-footer {
          justify-content: flex-end;
          padding: 0;
        }
        .comment button {
          border: none;
          background-color: transparent;
        }
        @media screen and (min-width: 900px) {
          :host {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
          }
        }
      `
    ];
  }
  // render function
  render() {
    return html`
      <div id="primary">
        <article>
          <div class="close-view">
            <button class="close-view-button">
              <iron-icon aria-hidden="true" icon="close"></iron-icon>
              <span>Close</span>
            </button>
          </div>
          <h1>
            <lrndesign-avatar
              accent-color="${this.accentColor(
                this.fullName(this.studentData)
              )}"
              aria-hidden="true"
              label="${this.fullName(this.studentData)}"
              src="${this.studentData && this.studentData.image ? this.studentData.image : undefined}"
              two-chars
            >
            </lrndesign-avatar>
            <span class="student-name"
              >${this.fullName(this.studentData)}</span
            >
            <span class="project-name"
              >${this.portfolioData.project}</span
            >
          </h1>
          ${this.submissionData.map(
            (s,i) => html`
              <section>
                <h2 id="sub-${s.id}">
                  <span class="assignment-name"
                    >${s.assignment.assignment}</span
                  >
                  <span class="submission-date"
                    >Submitted: ${this.medDate(s.date)}</span
                  >
                </h2>
                <div class="view-comments">
                  <button
                    class="view-comment-button ${s.feedback.length < 1
                      ? ""
                      : "has-comments"}"
                    aria-describedby="sub-${s.id}"
                    @click="${e => (this.submissionIndex = i)}"
                  >
                    <iron-icon
                      aria-hidden="true"
                      icon="communication:comment"
                    ></iron-icon>
                    <span class="sr-only">View Comments</span>
                  </button>
                </div>
                <div class="submission-body">
                  ${s.links && s.links.length > 0
                    ? html`
                        <ul class="submission-links">
                          ${s.links.map(
                            link => html`
                              <li>
                                <a href="${link.url}" target="_blank">
                                  <iron-icon
                                    aria-hidden="true"
                                    icon="${link.type === "pdf"
                                      ? "hax:file-pdf"
                                      : "link"}"
                                  ></iron-icon>
                                  ${link.text || link.url}
                                </a>
                              </li>
                            `
                          )}
                        </ul>
                      `
                    : s.sources && s.sources.length > 0
                    ? html`
                        <lrndesign-gallery
                          class="submission-image"
                          layout="grid"
                          .sources="${s.sources}"
                        ></lrndesign-gallery>
                      `
                    : html`
                        ${s.body}
                      `}
                </div>
              </section>
            `
          )}
        </article>
      </div>
      <div id="secondary">
        ${this.feedbackData.map(
          f => html`
            <div class="thread">
              ${this.makeComment(f)}
              ${f.replies.map(r => this.makeComment(r))}
            </div>
          `
        )}
      </div>
    `;
  }

  makeComment(c) {
    return html`
      <div
        id="${c.id}"
        class="comment ${c.feedbackId ? "comment-reply" : ""}"
        aria-describedby="${c.feedbackId || ""}"
      >
        <div class="comment-header ${c.feedbackId ? "comment-read" : ""}">
          <lrndesign-avatar
            accent-color="${this.accentColor(c.user.firstName)}"
            initials="${c.user.firstName} ${c.user.lastName}"
            .src="${c.user.image}"
            two-chars
          >
          </lrndesign-avatar>
          <div>
            <p class="comment-name">${c.user.firstName} ${c.user.lastName}</p>
            <p class="comment-date">${this.medDate(c.date)}</p>
          </div>
          <iron-icon icon="thumb-up"></iron-icon>
        </div>
        <div class="comment-body">
          <p>${c.body}</p>
        </div>
        <div class="comment-footer">
          <button>
            Reply
            <iron-icon icon="arrow-forward"></iron-icon>
          </button>
        </div>
      </div>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      feedbackData: {
        type: Array
      },
      portfolioData: {
        type: Object
      },
      portfolioId: {
        type: String,
        attribute: "portfolio-id"
      },
      studentData: {
        type: Object
      },
      submissionData: {
        type: Object
      },
      submissionFilter: {
        type: String,
        attribute: "submission-filter"
      },
      commentFilter: {
        type: String,
        attribute: "comment-filter"
      }
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
    this.feedbackData = [];
    this.portfolioData = {};
    this.studentData = [];
    this.submissionData = [];
    this.tag = ElmslnStudioPortfolio.tag;
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }

  initDemo() {
    if (!this.portfolioId)
      this.portfolioId = this._randomItem(
        Object.keys(this.loremData.portfolios)
      );
    this.portfolioData = this.loremData.portfolios[this.portfolioId];
    this.portfolioData.project = this.loremData.projects[
      this.portfolioData.projectId
    ].project;
    this.studentData = this.loremData.users[
      this.portfolioData.userId
    ];
    this.submissionData = this.portfolioData.submissions
      .map(i => {
        let s = this.loremData.submissions[i];
        s.id = i;
        s.assignment = this.loremData.assignments[s.assignmentId];
        return s;
      })
      .sort((a, b) => a.date - b.date);
    this.submissionIndex = this.submissionData 
      && this.submissionData.length > 0
      ? 0
      : undefined;
  }

  demoFeedback() {
    if (
      !this.submissionIndex ||
      !this.submissionData ||
      !this.submissionData[this.submissionIndex]
    )
    this.submissionIndex = this.submissionData 
      && this.submissionData.length > 0
      ? 0
      : undefined;
    this.feedbackData = this.submissionData[this.submissionIndex]
      ? this.submissionData[this.submissionIndex].feedback
          .map(i => {
            let feedback = this.loremData.feedback[i];
            feedback.id = i;
            feedback.user = this.loremData.users[feedback.userId];
            feedback.replies = feedback.replies
              .map(j => {
                let reply = this.loremData.replies[j];
                reply.user = this.loremData.users[reply.userId];
                reply.id = j;
                return reply;
              })
              .sort((a, b) => a.date - b.date);
              return feedback;
          })
          .sort((a, b) => a.date - b.date)
      : [];
  }

  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (["portfolioId", "demoMode"].includes(propName) && this.demoMode)
        this.initDemo();
      if (
        ["portfolioId", "submissionIndex", "demoMode"].includes(propName) &&
        this.demoMode
      )
        this.demoFeedback();
      if(propName === "submissionIndex" && this.shadowRoot) console.log('------- "sub-${s.id}"',this.submissionIndex); 
    });
  }
  // static get observedAttributes() {
  //   return [];
  // }
  // disconnectedCallback() {}

  // attributeChangedCallback(attr, oldValue, newValue) {}
}
customElements.define(
  "elmsln-studio-portfolio",
  ElmslnStudioPortfolio
);
export { ElmslnStudioPortfolio };
