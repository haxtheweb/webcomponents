import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-tooltip/simple-tooltip.js";
import "./lrnapp-studio-submission-editbar-message.js";
class LrnappStudioSubmissionEditbar extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
      `
    ];
  }
  render() {
    return html`
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
