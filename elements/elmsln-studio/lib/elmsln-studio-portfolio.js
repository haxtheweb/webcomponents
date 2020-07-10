/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { ElmslnStudioStyles } from "./elmsln-studio-styles.js";
import { ElmslnStudioUtilities } from "./elmsln-studio-utilities.js";
import "@lrnwebcomponents/lrndesign-gallery/lrndesign-gallery.js";
import "@lrnwebcomponents/hax-iconset/hax-iconset.js";
import "./elmsln-studio-link.js";
import "./elmsln-studio-button.js";

/**
 * `elmsln-studio-portfolio`
 * Studio App for ELMS:LN
 *
 * @customElement elmsln-studio-portfolio
 * @lit-html
 * @lit-element
 * @demo demo/portfolio.html
 */
class ElmslnStudioPortfolio extends ElmslnStudioUtilities(
  ElmslnStudioStyles(LitElement)
) {
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
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
        .submission-header {
          position: relative;
        }
        .submission-header elmsln-studio-button {
          color: #95989a;
          font-size: var(--elmsln-studio-FontSize, 16px);
          text-transform: uppercase;
          position: absolute;
          right: 0;
          top: 0;
        }
        .submission-header elmsln-studio-button:focus,
        .submission-header elmsln-studio-button:hover {
          color: #4b4b4b;
        }
        section {
          border-top: 2px solid #eaeaea;
          padding: calc(0.5 * var(--elmsln-studio-margin, 20px)) 0
            var(--elmsln-studio-margin, 20px);
        }
        .view-discussion section {
          opacity: 0.4;
        }
        .view-discussion section.section-discussion {
          border: 4px solid #95989a;
          padding: calc(0.5 * var(--elmsln-studio-margin, 20px))
            calc(0.5 * var(--elmsln-studio-margin, 20px))
            var(--elmsln-studio-margin, 20px);
          opacity: 1;
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
        .callout {
          font-size: calc(0.75 * var(--elmsln-studio-FontSize, 16px));
          border: 1px solid #eaeaea;
          padding: 0;
        }
        .discussion-label {
          text-align: left;
          font-size: calc(1 * var(--elmsln-studio-FontSize, 16px));
          margin: var(--elmsln-studio-margin, 20px) 0
            calc(0.25 * var(--elmsln-studio-margin, 20px));
        }
        .callout > * {
          padding: calc(0.25 * var(--elmsln-studio-margin, 20px))
            calc(0.5 * var(--elmsln-studio-margin, 20px));
        }
        .callout .callout-label {
          font-size: calc(1 * var(--elmsln-studio-FontSize, 16px));
          font-weight: normal;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin: 0;
          color: #4b4b4b;
          border-bottom: 1px solid #eaeaea;
        }
        .callout .callout-label iron-icon {
          margin-right: 1em;
        }
        .comment-textarea {
          flex: 1 0 100%;
          height: 100px;
          overflow-x: auto;
          border: none;
          resize: none;
          border-bottom: 1px solid #eaeaea;
        }
        .comment-form {
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
        }
        .callout .comment-form {
          width: calc(100% - var(--elmsln-studio-margin, 20px));
        }
        .comment-submit {
          border: none;
          text-align: center;
          display: inline;
          background-color: #4b4b4b;
          color: #fff;
          margin: calc(0.25 * var(--elmsln-studio-margin, 20px)) 0;
        }
        .comment-submit:focus,
        .comment-submit:hover {
          background-color: var(--simple-colors-default-theme-grey11, #222);
        }
        #threads {
          background-color: #eaeaea;
          padding: 1px;
        }
        .thread {
          width: 100%;
          transition: all 0.5s ease-in-out;
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
        @media screen and (min-width: 600px) {
          :host {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
          }
          #primary.view-discussion {
            flex: 0 0 calc(50% - var(--elmsln-studio-margin, 20px));
          }
          #primary {
            flex: 1 0 100%;
          }
          #secondary {
            flex: 0 0 calc(50% - var(--elmsln-studio-margin, 20px));
          }
        }
      `
    ];
  }
  // render function
  render() {
    return html`
      <div
        id="primary"
        ?hidden="${!this.portfolio}"
        class="${this.comment && this.comment !== "" ? "view-discussion" : ""}"
      >
        <article>
          <!--div class="close-view" hidden>
            <button class="close-view-button">
              <iron-icon aria-hidden="true" icon="close"></iron-icon>
              <span>Close</span>
            </button>
          </div-->
          <h1>
            <lrndesign-avatar
              accent-color="${this.accentColor(this.fullName(this.portfolio))}"
              aria-hidden="true"
              label="${this.fullName(this.portfolio)}"
              .src="${this.portfolio && this.portfolio.avatar
                ? this.portfolio.avatar
                : undefined}"
              two-chars
            >
            </lrndesign-avatar>
            <span class="student-name">${this.fullName(this.portfolio)}</span>
            <span class="project-name">${this.portfolio.project}</span>
          </h1>
          ${!this.portfolio
            ? ``
            : (this.portfolio.submissions || []).map(
                s => html`
                  <section
                    class="${this.submissionFilter === s.id
                      ? "section-discussion"
                      : ""}"
                  >
                    <div class="submission-header">
                      <h2 id="sub-${s.id}">
                        <span class="assignment-name">${s.assignment}</span>
                        <span class="submission-date"
                          >Submitted: ${this.dateFormat(s.date)}</span
                        >
                      </h2>
                      <elmsln-studio-button
                        class="view-discussion-button"
                        aria-describedby="sub-${s.id}"
                        icon="${this._getFeedbackIcon(s.feedback.length)}"
                        path="${s.link}&comment=show"
                      >
                        <span class="sr-only">Give / View Feedback (${s.feedback.length})</span>
                      </elmsln-studio-button>
                    </div>
                    <div class="submission-body">
                      ${s.links && s.links.length > 0
                        ? html`
                            <ul class="submission-links">
                              ${s.links.map(
                                link => html`
                                  <li>
                                    <elmsln-studio-link
                                      href="${link.url}"
                                      target="_blank"
                                    >
                                      <iron-icon
                                        aria-hidden="true"
                                        icon="${link.type === "pdf"
                                          ? "hax:file-pdf"
                                          : "link"}"
                                      ></iron-icon>
                                      ${link.text || link.url}
                                    </elmsln-studio-link>
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
      <div
        id="secondary"
        ?hidden=${!this.portfolio || !this.comment || this.comment === ""}
      >
        <aside>
          <div class="instructions callout">
            <h2 class="callout-label">
              <iron-icon icon="info" aria-hidden="true"></iron-icon>
              Directions for Assignment
            </h2>
            <div>
              <ul>
                <li>Step 1. Do something.</li>
                <li>Step 2. Do another thing.</li>
                <li>Step 3. Do something else.</li>
                <li>Step 4. Do ALL THE THINGS!</li>
              </ul>
            </div>
          </div>
          <h2 class="discussion-label">
            Discussion for Submission
          </h2>
          <div class="discussion callout">
            <label class="callout-label" for="feedback">
              <iron-icon
                icon="communication:comment"
                aria-hidden="true"
              ></iron-icon>
              Feedback
            </label>
            ${this.makeWrite("feedback", `sub-${this.submission.id}`)}
          </div>
          <div id="threads">
            ${(this.submission.feedback || []).map(
              f => html`
                <div class="thread">
                  ${this.makeComment(f)}
                  ${f.replies.map(r => this.makeComment(r))}
                </div>
              `
            )}
          </div>
        </aside>
      </div>
    `;
  }

  makeWrite(id, describedby = "", hidden = false, label) {
    return html`
      <div id="${id}-div" ?hidden=${hidden} class="comment-form">
        ${label
          ? html`
              <label class="sr-only" for="${id}">${label}</label>
            `
          : ``}
        <textarea
          id="${id}"
          aria-desccribedby="${describedby}"
          class="comment-textarea"
        ></textarea>
        <button
          controls="${id}"
          @click="${e => this._handleComment(id, describedby)}"
          class="comment-submit"
        >
          <iron-icon icon="send" aria-hidden="true"></iron-icon>
          Submit
        </button>
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
            accent-color="${this.accentColor(this.fullName(c))}"
            initials="${this.fullName(c)}"
            .src="${c.avatar}"
            two-chars
          >
          </lrndesign-avatar>
          <div>
            <p class="comment-name">${this.fullName(c)}</p>
            <p class="comment-date">${this.dateFormat(c.date)}</p>
          </div>
          <iron-icon icon="thumb-up"></iron-icon>
        </div>
        <div class="comment-body">
          <p>${c.body}</p>
        </div>
        <div class="comment-footer" ?hidden="${c.feedbackId}">
          <button
            controls="reply-to-${c.id}-div"
            @click="${e => this._handleReply(`reply-to-${c.id}`)}"
          >
            Reply
            <iron-icon icon="arrow-forward"></iron-icon>
          </button>
          ${this.makeWrite(`reply-to-${c.id}`, c.id, true, "Write Reply")}
        </div>
      </div>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      portfolio: {
        type: Object
      },
      submission: {
        type: Object
      },
      comment: {
        type: String,
        attribute: "comment"
      },
      submissionFilter: {
        type: String,
        attribute: "submission-filter"
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
    this.portfolio = {};
    this.submission = {};
    this.submissionFilter = "";
    this.comment = "";
    this.tag = ElmslnStudioPortfolio.tag;
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }
  _getFeedbackIcon(comments){
    if(comments === 0){
      return "communication:comment";
    } else if(comments < 10){
      return `hax:messages-${comments}`;
    }
    return "hax:messages-9-plus";
  }
  _handleReply(replyform) {
    let form = this.shadowRoot.querySelector(`#${replyform}-div`),
      button = this.shadowRoot.querySelector(`[controls=${replyform}]`);
    console.log("_handleComment", replyform, form, button);
  }
  _handleComment(id, target) {
    let form = this.shadowRoot.querySelector(`#${id}`),
      parent = this.shadowRoot.querySelector(`#${target}`);
    console.log("_handleComment", id, target, form, parent);
  }

  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {});
    console.log("portfolio", this.portfolio, this.feedback);
  }
}
customElements.define("elmsln-studio-portfolio", ElmslnStudioPortfolio);
export { ElmslnStudioPortfolio };
