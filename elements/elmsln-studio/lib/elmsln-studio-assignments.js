/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { ElmslnStudioUtilities } from "./elmsln-studio-utilities.js";
import { ElmslnStudioStyles } from "./elmsln-studio-styles.js";

/**
 * `elmsln-studio-assignments`
 * Studio App for ELMS:LN
 *
 * @customElement elmsln-studio-assignments
 * @lit-html
 * @lit-element
 * @demo demo/dashboard.html
 */
class ElmslnStudioAssignments extends ElmslnStudioUtilities(
  ElmslnStudioStyles(LitElement)
) {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "elmsln-studio-assignments";
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: flex;
          color: #2c2c2c;
          margin: 0 auto;
          justify-content: center;
        }
        h2 {
          color: #525252;
          margin-top: calc(0.5 * var(--elmsln-studio-margin, 20px));
        }
        nav-card [slot="heading"] {
          color: #4d4d4d;
          font-size: 80%;
        }
        nav-card-item [slot="label"] {
          font-weight: normal;
        }
        nav-card-item [slot="description"] {
          color: #95989a;
        }
        .lesson {
          background-color: #eee;
          padding: calc(0.5 * var(--elmsln-studio-margin, 20px));
          --lrndesign-avatar-border-radius: 0%;
          --nav-card-item-avatar-width: 40px;
          border: 1px solid var(--accent-card-border-color, #ddd);
          border-bottom: none;
        }
        .lesson > .assignment {
          background-color: #fff;
          border: 1px solid var(--accent-card-border-color, #ddd);
          padding: calc(0.5 * var(--elmsln-studio-margin, 20px))
            var(--elmsln-studio-margin, 20px);
          margin-bottom: 15px;
        }
        nav-card-item:not([avatar]) .assignment-link:before {
          position: absolute;
          overflow: hidden;
          display: inline-block;
          -webkit-animation: ellipsis steps(4, end) 900ms infinite;
          animation: ellipsis steps(4, end) 900ms infinite;
          content: "...";
          font-size: 300%;
          left: 0;
          top: 0;
          width: 0px;
        }

        @keyframes ellipsis {
          to {
            width: 1.25em;
          }
        }

        @-webkit-keyframes ellipsis {
          to {
            width: 1.25em;
          }
        }
        @media screen and (min-width: 400px) {
          #lessons {
            display: flex;
            align-items: stretch;
            justify-content: flex-start;
            overflow-x: auto;
            max-width: 100%;
            padding: 0 calc(0.5 * var(--elmsln-studio-margin, 20px));
          }
          .lesson {
            width: 300px;
            flex: 0 0 300px;
            margin: 0 var(--elmsln-studio-margin, 20px);
            border-bottom: 1px solid var(--accent-card-border-color, #ddd);
          }
        }
      `,
    ];
  }
  // render function
  /*
      
   */
  render() {
    return html`
      <h1 class="sr-only">Assignments</h1>
      <div id="lessons">
        ${!this.lessons
          ? this.loading("green", undefined, "large")
          : Object.keys(this.lessons || {}).map(
              (l) => html`
                <div class="lesson">
                  <h2>${this.lessons[l].lesson}</h2>
                  ${(this.lessons[l].assignments || []).map((p) =>
                    !p.assignments
                      ? html`
                          <div class="assignment">
                            ${this.renderAssignment(p)}
                          </div>
                        `
                      : html`
                          <nav-card flat no-border class="card secondary">
                            <span slot="heading" ?hidden="${!p.project}">
                              ${p.project}
                            </span>
                            <div slot="linklist">
                              ${this.sortDates(
                                p.assignments || [],
                                true
                              ).map((a) => this.renderAssignment(a))}
                            </div>
                          </nav-card>
                        `
                  )}
                </div>
              `
            )}
      </div>
    `;
  }

  renderAssignment(assignment) {
    return !assignment
      ? ``
      : html`
          <nav-card-item
            id="act-${assignment.id}-item"
            accent-color="${!this.profile
              ? "grey"
              : this.getStatusColor(
                  this.getSubmission(assignment.id),
                  assignment
                )}"
            allow-grey
            avatar="${!this.profile
              ? undefined
              : this.getStatusIcon(
                  this.getSubmission(assignment.id),
                  assignment
                )}"
            invert
          >
            <elmsln-studio-link
              id="act-${assignment.id}"
              class="assignment-link"
              aria-describedby="act-${assignment.id}-desc act-${assignment.id}-item"
              slot="label"
              href="/assignments/${assignment.id}"
            >
              ${assignment.assignment}
            </elmsln-studio-link>
            <div id="act-${assignment.id}-desc" slot="description">
              Due:
              <local-time
                month="long"
                day="numeric"
                year="numeric"
                hour="2-digit"
                minute="2-digit"
                second="2-digit"
                time-zone-name="short"
                datetime="${assignment.date}"
              >
                ${this.dateFormat(assignment.date)}
              </local-time>
            </div>
          </nav-card-item>
          <simple-tooltip for="act-${assignment.id}" position="left">
            ${this.getStatusMessage(
              this.getSubmission(assignment.id),
              assignment
            )}
          </simple-tooltip>
        `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      lessons: {
        type: Object,
      },
      profile: {
        type: Object,
      },
    };
  }

  // life cycle
  constructor() {
    super();
    this.tag = ElmslnStudioAssignments.tag;
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    this.fetchData("profile");
    this.fetchData("lessons");
  }
  getSubmission(id) {
    let submissions =
      this.profile && this.profile.id && this.profile.submissions
        ? this.profile.submissions.filter(
            (s) => s.id === `${id}-${this.profile.id}`
          )
        : [];
    return submissions.length > 0 ? submissions[0] : undefined;
  }
  // static get observedAttributes() {
  //   return [];
  // }
  // disconnectedCallback() {}

  // attributeChangedCallback(attr, oldValue, newValue) {}
}
customElements.define("elmsln-studio-assignments", ElmslnStudioAssignments);
export { ElmslnStudioAssignments };
