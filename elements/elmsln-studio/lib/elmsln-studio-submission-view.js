/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { ElmslnStudioUtilities } from "./elmsln-studio-utilities.js";
import "@lrnwebcomponents/lrndesign-gallery/lrndesign-gallery.js";

/**
 * `elmsln-studio-submission-view`
 * Studio App for ELMS:LN
 *
 * @customElement elmsln-studio-submission-view
 * @lit-html
 * @lit-element
 * @demo demo/dashboard.html
 */
class ElmslnStudioSubmissionView extends ElmslnStudioUtilities(LitElement) {
  static get styles() {
    return [
      ...super.styles,
      css`
        :host, section {
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
          color: #4B4B4B;
        }
        .project-name {
          font-size: calc(1.75 * var(--elmsln-studio-FontSize, 16px));
          color: #95989A;
        }
        .view-comments {
          text-align: right;
        }
        article button {
          background-color: transparent;
          border: none;
          color: #95989A;
          font-size: var(--elmsln-studio-FontSize, 16px);
          text-transform: uppercase;
        }
        article button:focus,
        article button:hover {
          color: #4B4B4B;
        }
        section {
          margin: calc(2 * var(--elmsln-studio-margin, 20px)) auto;
          border-top: 2px solid #EAEAEA;
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
          color: #95989A;
        }
        .submission-body {
          color: #95989A;
          line-height: 160%;
          margin: calc(0.5 * var(--elmsln-studio-margin, 20px)) auto var(--elmsln-studio-margin, 20px);
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
      `
    ];
  }
  // render function
  render() {
    return html`
      <article>
        <div class="close-view">
          <button class="close-view-button">
            <iron-icon aria-hidden="true" icon="close"></iron-icon>
            <span>Close</span>
          </button>
        </div>
        <h1>
          <lrndesign-avatar
            accent-color="${this.getAccentColor(this.firstName)}"
            aria-hidden="true"
            label="${this.firstName} ${this.lastName}"
            src="${this.image}"
            two-chars>
          </lrndesign-avatar>
          <span class="student-name">${this.firstName} ${this.lastName}</span>
          <span class="project-name">${this.project}</span>
        </h1>
        <div class="view-comments">
          <button class="view-comment-button">
            <iron-icon aria-hidden="true" icon="communication:comment"></iron-icon>
            <span class="sr-only">View Comments</span>
          </button>
        </div>
        ${this.submissions.map(s=>html`
          <section>
            <h2>
              <span class="assignment-name">${s.assignment}</span>
              <span class="submission-date">Submitted: ${s.date}</span>
            </h2>
            <div class="submission-body">
              ${s.links && s.links.length > 0
                ? html`
                  <ul class="submission-links">
                    ${s.links.map(link=>html`
                      <li>
                        <a href="${link.url}" target="external">
                          <iron-icon aria-hidden="true" icon="${link.type === "pdf" ? "description" : "link"}"></iron-icon>
                          ${link.text || link.url}
                        </a>
                      </li>
                    `)}
                  </ul>`
                : s.sources && s.sources.length > 0
                ? html` <lrndesign-gallery class="submission-image" layout="grid" .sources="${s.sources}"></lrndesign-gallery>` 
                : html`${s.body}`
              }
            </div>
          </section>
        `)}
      </article>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      firstName: {
        type: String
      },
      lastName: {
        type: String
      },
      image: {
        type: String
      },
      project: {
        type: String
      },
      submissions: {
        type: Array
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "elmsln-studio-submission-view";
  }

  // life cycle
  constructor() {
    super();
    this.links = [];
    this.sources = [];
    this.getFakeData();
    this.tag = ElmslnStudioSubmissionView.tag;
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }

  getFakeData() {
    let data = this.fakeData, 
      student = data.students[Math.floor(Math.random() * (data.students || []).length)];
    
    console.log(data,student);
    this.firstName = student.firstName;
    this.lastName = student.lastName;
    this.image = student.image;
    this.project = "Hypertext Narrative Project";
    this.submissions = data.submissionView;
  }
  // static get observedAttributes() {
  //   return [];
  // }
  // disconnectedCallback() {}

  // attributeChangedCallback(attr, oldValue, newValue) {}
}
customElements.define("elmsln-studio-submission-view", ElmslnStudioSubmissionView);
export { ElmslnStudioSubmissionView };
