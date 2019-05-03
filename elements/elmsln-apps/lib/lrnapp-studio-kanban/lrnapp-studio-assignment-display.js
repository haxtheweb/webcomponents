import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/marked-element/marked-element.js";
class LrnappStudioAssignmentDisplay extends PolymerElement {
  static get template() {
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
