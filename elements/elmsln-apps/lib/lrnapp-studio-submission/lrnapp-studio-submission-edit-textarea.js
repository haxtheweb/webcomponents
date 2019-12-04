import { LitElement, html, css } from "lit-element/lit-element.js";

import "@lrnwebcomponents/lrn-markdown-editor/lrn-markdown-editor.js";
class LrnappStudioSubmissionEditTextArea extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [css`:host {
          display: block;
        }`];
  }
  render() {
    return html`
      <lrn-markdown-editor content="{{content}}"></lrn-markdown-editor>
    `;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      let notifiedProps = ['content'];
      if (notifiedProps.includes(propName)) {
        // notify
        let eventName = `${propName.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()}-changed`
        this.dispatchEvent(
          new CustomEvent(eventName, {
            detail: {
              value: this[propName],
            }
          })
        );
      }
    });
  }
  static get tag() {
    return "lrnapp-studio-submission-edit-textarea";
  }
  static get properties() {
    return {
      content: {
        type: String,
      }
    };
  }
}
window.customElements.define(
  LrnappStudioSubmissionEditTextArea.tag,
  LrnappStudioSubmissionEditTextArea
);
export { LrnappStudioSubmissionEditTextArea };
