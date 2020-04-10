/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html } from "lit-element";
import "@polymer/iron-ajax/iron-ajax.js";
import "@lrnwebcomponents/progress-donut/progress-donut.js";
import "@lrnwebcomponents/accent-card/accent-card.js";

/**
 * `elmsln-studio-dashboard-profile`
 * Studio App for ELMS:LN
 *
 * @customElement elmsln-studio-dashboard-profile
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class ElmslnStudioDashboardProfile extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          width: 100%;
          display: block;
        }
        :host accent-card {
          width: 100%;
        }
        :host .progress-item {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          width: 100%;
          color: var(--lrnapp-studio-dashboard-color, #666);
          border-top: var(--lrnapp-studio-dashboard-border, #ddd);
          padding: 0.5em 0;
        }
        :host .progress-item span:last-child {
          text-align: right;
        }
      `
    ];
  }
  // render function
  render() {
    return html`
      <accent-card no-border>
        <div slot="content">
          <progress-donut
            id="donut"
            title="Your Progress"
            desc="${this.desc}"
            image-src="${this.profile.avatar}"
            complete="${this.complete}"
            total="${this.profile.totalAssignments}"
          >
          </progress-donut>
          <div class="progress-item">
            <span>Overall Progress</span><span>${this.percentComplete}</span>
          </div>
          <div class="progress-item">
            <span>Comments</span><span>${this.profile.totalComments}</span>
          </div>
          <div class="progress-item">
            <span>Submissions</span
            ><span>${this.profile.totalSubmissions}</span>
          </div>
        </div>
      </accent-card>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      profile: {
        type: Object
      }
    };
  }

  get desc() {
    return this.profile
      ? `You have completed ${
          this.profile.completedAssignments
        } assignments out of ${this.profile.totalAssignments}.`
      : ``;
  }
  get complete() {
    return this._getProgressComplete(this.profile);
  }
  get percentComplete() {
    return this.profile
      ? `${Math.round(
          (100 * this.profile.completedAssignments) /
            this.profile.totalAssignments
        )}%`
      : "0%";
  }
  get chart() {
    return this.profile.completedAssignments.map(assign => 1);
  }
  /** TODO this chart could just autoupdate when data changes */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (
        propName === "complete" &&
        this.shadowRoot &&
        this.shadowRoot.querySelector("#donut")
      )
        this.shadowRoot.querySelector("#donut").makeChart();
    });
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  tag() {
    return "elmsln-studio-dashboard-profile";
  }

  // life cycle
  constructor() {
    super();

    this.tag = ElmslnStudioDashboardProfile.tag;
    this.title = "Project 1 Title";
    this.author = "Bill Billerson";
    // map our imported properties json to real props on the element
    // @notice static getter of properties is built via tooling
    // to edit modify src/elmsln-studio-dashboard-profile-properties.json
    let obj = ElmslnStudioDashboardProfile.properties;
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (this.hasAttribute(p)) {
          this[p] = this.getAttribute(p);
        } else {
          this.setAttribute(p, obj[p].value);
          this[p] = obj[p].value;
        }
      }
    }
  }
  /**
   * Simple way to convert from object to array.
   * @param {object} obj object to convert
   * @returns {array}
   */
  _toArray(obj) {
    return Object.keys(obj).map(key => obj[key]);
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
customElements.define(
  "elmsln-studio-dashboard-profile",
  ElmslnStudioDashboardProfile
);
export { ElmslnStudioDashboardProfile };
