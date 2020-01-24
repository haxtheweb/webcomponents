import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
class LrnappStudioSubmissionEditbarMessage extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <slot></slot>
    `;
  }
  static get tag() {
    return "lrnapp-studio-submission-editbar-message";
  }
}
window.customElements.define(
  LrnappStudioSubmissionEditbarMessage.tag,
  LrnappStudioSubmissionEditbarMessage
);
export { LrnappStudioSubmissionEditbarMessage };
