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
          align-items: stretch;
          justify-content: flex-start;
          overflow-x: auto;
        }
        :host > * {
          width: 300px;
          margin: 0 var(--elmsln-studio-margin, 20px);
          --lrndesign-avatar-border-radius: 0%;
          --nav-card-item-avatar-width: 20px;
        }
      `
    ];
  }
  // render function
  render() {
    return html`
      <h1 class="sr-only">Assignments</h1>
      ${Object.keys(this.projects || {}).map(p=>html`
        <nav-card
          flat
          no-border
          class="card secondary"
        >
          <span slot="heading">${this.projects[p].project}</span>
          <div slot="linklist">
            ${this.sortDates(Object.keys(this.projects[p].assignments || {}),true).map(
              a => this.renderAssignment(this.projects[p].assignments[a])
            )}
          </div>
        </nav-card>
      `)}
    `;
  }

  renderAssignment(assignment){
    console.log(assignment);
    return !assignment ? `` : html`
      <nav-card-item 
        accent-color="${this._incomplete(assignment.id) ? "grey" : "green"}"  
        allow-grey
        avatar="${this._incomplete(assignment.id) ? "assignment" : "assignment-turned-in"}"
        invert>
        <elmsln-studio-link
          id="act-${assignment.id}"
          aria-describedby="act-${assignment.id}-desc"
          slot="label"
          href="${assignment.link}"
        >
          ${assignment.assignment}
        </elmsln-studio-link>
        <div id="act-${assignment.id}-desc" slot="description">
          Due: ${this.dateFormat(assignment.date)}
        </div>
      </nav-card-item>
    `;
  }

  _incomplete(id){
    console.log(id,this.profile.workDue,this.profile.workDue.filter(s=>s.id === id));
    return this.profile && this.profile.workDue && this.profile.workDue.filter(s=>s.id === id).length > 0;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      projects: {
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
    this.projects = {};
    this.tag = ElmslnStudioAssignments.tag;
  }
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
    });
    console.log('updated',this.projects,this.profile);
  }
  // static get observedAttributes() {
  //   return [];
  // }
  // disconnectedCallback() {}

  // attributeChangedCallback(attr, oldValue, newValue) {}
}
customElements.define("elmsln-studio-assignments", ElmslnStudioAssignments);
export { ElmslnStudioAssignments };
