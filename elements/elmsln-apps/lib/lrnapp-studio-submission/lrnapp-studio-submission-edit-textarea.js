import { LitElement, html, css } from "lit-element/lit-element.js";

import "@lrnwebcomponents/lrn-markdown-editor/lrn-markdown-editor.js";
class LrnappStudioSubmissionEditTextArea extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
      
      `
    ];
  }
  render() {
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
        notify: true
      }
    };
  }
}
window.customElements.define(
  LrnappStudioSubmissionEditTextArea.tag,
  LrnappStudioSubmissionEditTextArea
);
export { LrnappStudioSubmissionEditTextArea };
