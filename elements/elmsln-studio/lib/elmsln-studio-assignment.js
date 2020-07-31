/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { ElmslnStudioStyles } from "./elmsln-studio-styles.js";
import { ElmslnStudioUtilities } from "./elmsln-studio-utilities.js";
import "@lrnwebcomponents/lrndesign-gallery/lrndesign-gallery.js";
import "@lrnwebcomponents/hax-iconset/hax-iconset.js";
import "@lrnwebcomponents/threaded-discussion/threaded-discussion.js";
import "./elmsln-studio-link.js";
import "./elmsln-studio-button.js";

/**
 * `elmsln-studio-assignment`
 * Studio App for ELMS:LN
 *
 * @customElement elmsln-studio-assignment
 * @lit-html
 * @lit-element
 * @demo demo/portfolio.html
 */
class ElmslnStudioAssignment extends ElmslnStudioUtilities(
  ElmslnStudioStyles(LitElement)
) {
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          flex-wrap: wrap;
        }
        h1 {
          text-align: center;
        }
        #breadcrumb {
          margin: 0 0 var(--elmsln-studio-margin, 20px);
          flex: 1 0 100%;
          --elmsln-studio-link-Color: var(
            --simple-colors-fixed-theme-light-blue-8
          );
          --elmsln-studio-link-focus-Color: var(
            --simple-colors-fixed-theme-light-blue-9
          );
        }
        #breadcrumb > * {
          display: inline;
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
        #project-buttons,
        .submission-header {
          position: relative;
          height: 40px;
          margin-top: -40px;
        }
        #sort,
        .submission-header elmsln-studio-button {
          color: #95989a;
          font-size: var(--elmsln-studio-FontSize, 16px);
          text-transform: uppercase;
          position: absolute;
          right: 0;
          top: 0;
        }
        #sort:focus,
        #sort:hover,
        .submission-header elmsln-studio-button:focus,
        .submission-header elmsln-studio-button:hover {
          color: #4b4b4b;
        }
        #sort.sort-latest {
          transform: rotateX(180deg) rotateY(0deg);
        }
        section {
          border-top: 2px solid #eaeaea;
          padding: calc(0.5 * var(--elmsln-studio-margin, 20px)) 0
            var(--elmsln-studio-margin, 20px);
        }
        .view-discussion {
          border: 1px solid #eaeaea;
          padding: calc(0.5 * var(--elmsln-studio-margin, 20px));
        }
        .view-discussion section {
          opacity: 0.4;
          display: none;
        }
        .view-discussion section.section-discussion {
          display: block;
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
        threaded-discussion {
          background-color: #eaeaea;
          padding: 1px;
          --threaded-discussion-comment-button-BackgroundColor: var(
            --simple-colors-fixed-theme-light-blue-8
          );
          --threaded-discussion-comment-button-focus-BackgroundColor: var(
            --simple-colors-fixed-theme-light-blue-9
          );
        }
        @media screen and (min-width: 600px) {
          :host {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
          }
          #primary {
            flex: 1 0 100%;
          }
          #primary.view-discussion {
            flex: 0 0 calc(50% - var(--elmsln-studio-margin, 20px));
          }
          #primary:not(.view-discussion) {
            max-width: calc(1000px - 2 * var(--elmsln-studio-margin, 20px));
            margin: 0 auto;
            border: 1px solid #eaeaea;
            padding: var(--elmsln-studio-margin, 20px);
          }
          .view-discussion section {
            display: block;
          }
          .view-discussion section.section-discussion {
            border: 4px solid #95989a;
            padding: calc(0.5 * var(--elmsln-studio-margin, 20px))
              calc(0.5 * var(--elmsln-studio-margin, 20px))
              var(--elmsln-studio-margin, 20px);
            opacity: 1;
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
    return !this.assignment
      ? ""
      : html`
          <div id="breadcrumb">
            <elmsln-studio-link href="/assignments"
              >Assignments</elmsln-studio-link
            >
            <span> > </span>
            ${!this.assignment.projectId || !this.assignment.project
              ? ``
              : html`
                  <elmsln-studio-link
                    href="${`/assignments?project=${
                      this.assignment.projectId
                    }`}"
                    >${this.assignment.project}</elmsln-studio-link
                  >
                  <span> > </span>
                `}
            <span>${this.assignment.assignment}</span>
          </div>
          <div
            id="primary"
            ?hidden="${!this.assignment}"
            class="view-assignment"
          >
            <article id="assignment">
              <h1>
                <span class="lesson-name">${this.assignment.lesson}</span>
                <span class="project-name">${this.assignment.assignment}</span>
              </h1>
              <p>${this.assignment.body}</p>
              ${!this.assignment.rubric
                ? ""
                : html`
                    <table>
                      <caption>
                        Rubric
                      </caption>
                      ${!this.assignment.rubric || !this.assignment.rubric[0]
                        ? ``
                        : html`
                            <thead>
                              ${this.assignment.rubric[0].map(
                                col => html`
                                  <th scope="row">${col}</th>
                                `
                              )}
                            </thead>
                          `}
                      <tbody>
                        ${(this.assignment.rubric || []).map((row, i) =>
                          i === 0
                            ? ""
                            : html`
                                <tr>
                                  ${this.assignment.rubric[0].map((col, ii) =>
                                    ii === 0
                                      ? html`
                                          <th scope="col">${col}</th>
                                        `
                                      : html`
                                          <td>${col}</td>
                                        `
                                  )}
                                </tr>
                              `
                        )}
                      </tbody>
                    </table>
                  `}
              ${!this.assignment.uploads
                ? ""
                : html`
                    <section>
                      <h2 class="sr-only">Manage Uploads</h2>
                    </section>
                  `}
              ${!this.assignment.links
                ? ""
                : html`
                    <section>
                      <h2 class="sr-only">Manage Links</h2>
                      <input type="text" />
                    </section>
                  `}
              ${!this.assignment.text
                ? ""
                : html`
                    <section>
                      <h2 class="sr-only">Edit Text</h2>
                      <textarea></textarea>
                    </section>
                  `}
              <section>
                ${this.submission.draft}
                <elmsln-studio-button class="delete" icon="" path=""
                  >Delete</elmsln-studio-button
                >
                <elmsln-studio-button class="save" path=""
                  >Save Draft</elmsln-studio-button
                >
                <elmsln-studio-button class="submit" icon="done" path=""
                  >Submit Assignment</elmsln-studio-button
                >
              </section>
            </article>
          </div>
        `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      assignment: {
        type: Object
      },
      submission: {
        type: Object
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "elmsln-studio-assignment";
  }

  // life cycle
  constructor() {
    super();
    this.portfolio = {};
    this.submission = {};
    this.submissionFilter = "";
    this.comment = "";
    this.tag = ElmslnStudioAssignment.tag;
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }

  get sortedSubmissions() {
    return !this.portfolio.submissions
      ? []
      : this.sortDates(this.portfolio.submissions, this.sortLatest);
  }
  get assignment() {
    let filter =
      !this.submissionFilter || !this.portfolio || !this.portfolio.submissions
        ? []
        : this.portfolio.submissions.filter(
            s => s.id === this.submissionFilter
          );
    return !filter ? false : filter[0];
  }
  _getFeedbackIcon(comments) {
    if (comments === 0) {
      return "communication:comment";
    } else if (comments < 10) {
      return `hax:messages-${comments}`;
    }
    return "hax:messages-9-plus";
  }
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {});
  }
}
customElements.define("elmsln-studio-assignment", ElmslnStudioAssignment);
export { ElmslnStudioAssignment };
