import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "./lrnapp-studio-submission-comment.js";

class LrnappStudioSubmissionComments extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <template is="dom-if" if="[[submission.relationships.comments]]">
        <template
          is="dom-repeat"
          items="[[_toArray(submission.relationships.comments.data)]]"
          as="comment"
        >
          <lrnapp-studio-submission-comment
            comment="{{comment}}"
          ></lrnapp-studio-submission-comment>
        </template>
      </template>
    `;
  }
  static get tag() {
    return "lrnapp-studio-submission-comments";
  }
  static get properties() {
    return {
      submission: {
        type: Object,
      },
    };
  }
  /**
   * Simple way to convert from object to array.
   */
  _toArray(obj) {
    if (obj == null) {
      return [];
    }
    return Object.keys(obj).map(function (key) {
      return obj[key];
    });
  }
}
window.customElements.define(
  LrnappStudioSubmissionComments.tag,
  LrnappStudioSubmissionComments
);
export { LrnappStudioSubmissionComments };
