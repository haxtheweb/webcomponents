/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { ElmslnStudioUtilities } from "./elmsln-studio-utilities.js";
import { ElmslnStudioStyles } from "./elmsln-studio-styles.js";
import "./elmsln-studio-link.js";
import "./elmsln-studio-button.js";

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
          --nav-card-item-avatar-width: 20px;
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
      `
    ];
  }
  // render function
  /*
      
   */
  render() {
    return html`
      <h1 class="sr-only">Assignments</h1>
      <div id="lessons">
        ${Object.keys(this.lessons || {}).map(
          l => html`
            <div class="lesson">
              <h2>${this.lessons[l].lesson}</h2>
              ${(this.lessons[l].assignments || []).map(p =>
                !p.assignments
                  ? html`
                      <div class="assignment">${this.renderAssignment(p)}</div>
                    `
                  : html`
                      <nav-card flat no-border class="card secondary">
                        <span slot="heading" ?hidden="${!p.project}">
                          ${p.project}
                        </span>
                        <div slot="linklist">
                          ${this.sortDates(p.assignments || [], true).map(a =>
                            this.renderAssignment(a)
                          )}
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
            accent-color="${!this._incomplete(assignment.id)
              ? "green"
              : this._late(assignment.date)
              ? "red"
              : "grey"}"
            allow-grey
            avatar="${!this._incomplete(assignment.id)
              ? "assignment-turned-in"
              : this._late(assignment.date)
              ? "icons:assignment-late"
              : "assignment"}"
            invert
          >
            <elmsln-studio-link
              id="act-${assignment.id}"
              aria-describedby="act-${assignment.id}-desc"
              slot="label"
              href="/assignments/${assignment.id}"
            >
              ${assignment.assignment}
            </elmsln-studio-link>
            <div id="act-${assignment.id}-desc" slot="description">
              Due: ${this.dateFormat(assignment.date)}
            </div>
          </nav-card-item>
        `;
  }

  _incomplete(id) {
    return (
      this.profile &&
      this.profile.due &&
      this.profile.due.filter(s => s.id === id).length > 0
    );
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      lessons: {
        type: Object
      },
      profile: {
        type: Object
      }
    };
  }

  // life cycle
  constructor() {
    super();
    this.profile = {};
    this.lessons = {};
    this.tag = ElmslnStudioAssignments.tag;
  }
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {});
    console.log("updated", this.lessons, this.profile);
  }
  // static get observedAttributes() {
  //   return [];
  // }
  // disconnectedCallback() {}

  // attributeChangedCallback(attr, oldValue, newValue) {}
}
customElements.define("elmsln-studio-assignments", ElmslnStudioAssignments);
export { ElmslnStudioAssignments };
