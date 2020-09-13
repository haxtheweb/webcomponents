import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/lrn-markdown-editor/lrn-markdown-editor.js";
class LrnappStudioSubmissionEditTextArea extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <lrn-markdown-editor content="{{content}}"></lrn-markdown-editor>
    `;
  }
  static get tag() {
    return "lrnapp-studio-submission-edit-textarea";
  }
  static get properties() {
    return {
      content: {
        type: String,
        notify: true,
      },
    };
  }
}
window.customElements.define(
  LrnappStudioSubmissionEditTextArea.tag,
  LrnappStudioSubmissionEditTextArea
);
export { LrnappStudioSubmissionEditTextArea };
