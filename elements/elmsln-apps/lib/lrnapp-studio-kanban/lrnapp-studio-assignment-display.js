import { LitElement, html, css } from "lit-element/lit-element.js";

import "@polymer/marked-element/marked-element.js";
class LrnappStudioAssignmentDisplay extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [css``];
  }
  render() {
    return html`
      <style>
        :host {
          display: block;
          padding: 16px;
        }
        #assignment-body {
          font-size: 21px;
        }
      </style>
      <h1>[[assignment.attributes.title]]</h1>
      <marked-element
        id="assignment-body"
        markdown="[[assignment.attributes.body]]"
      ></marked-element>
    `;
  }
  static get tag() {
    return "lrnapp-studio-assignment-display";
  }
  static get properties() {
    return {
      elmslnCourse: {
        type: String,
        attribute: "elmsln-course"
      },
      elmslnSection: {
        type: String,
        attribute: "elmsln-section"
      },
      basePath: {
        type: String,
        attribute: "base-path"
      },
      csrfToken: {
        type: String,
        attribute: "csrf-token"
      },
      endPoint: {
        type: String,
        attribute: "end-point"
      },
      assignment: {
        type: Object
      }
    };
  }
}
window.customElements.define(
  LrnappStudioAssignmentDisplay.tag,
  LrnappStudioAssignmentDisplay
);
export { LrnappStudioAssignmentDisplay };
