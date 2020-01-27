import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "./lrnapp-studio-submission-editbar-message.js";
class LrnappStudioSubmissionEditbar extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <simple-tooltip position="top" animation-delay="0" offset="-20">
        <slot name="lrnapp-studio-submission-editbar-message"></slot>
      </simple-tooltip>
      <slot></slot>
    `;
  }
  static get tag() {
    return "lrnapp-studio-submission-editbar";
  }
}
window.customElements.define(
  LrnappStudioSubmissionEditbar.tag,
  LrnappStudioSubmissionEditbar
);
export { LrnappStudioSubmissionEditbar };
