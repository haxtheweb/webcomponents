import { LitElement, html, css } from "lit-element/lit-element.js";
import "./lrnapp-studio-submission-comment.js";

class LrnappStudioSubmissionComments extends LitElement {
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
      ${this._toArray(this.submission.relationships.comments.data).map(
        comment => html`
          <lrnapp-studio-submission-comment
            .comment="${comment}"
          ></lrnapp-studio-submission-comment>
        `
      )}
    `;
  }
  static get tag() {
    return "lrnapp-studio-submission-comments";
  }
  static get properties() {
    return {
      submission: {
        type: Object
      }
    };
  }
  /**
   * Simple way to convert from object to array.
   */
  _toArray(obj) {
    if (obj == null) {
      return [];
    }
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
}
window.customElements.define(
  LrnappStudioSubmissionComments.tag,
  LrnappStudioSubmissionComments
);
export { LrnappStudioSubmissionComments };
