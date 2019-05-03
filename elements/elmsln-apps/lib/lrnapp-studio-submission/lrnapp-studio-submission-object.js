import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-pages/iron-pages.js";
import "./lrnapp-studio-submission-display.js";
import "./lrnapp-studio-submission-edit.js";
import "./lrnapp-studio-submission-critique.js";
class LrnappStudioSubmissionObject extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <iron-pages selected="[[selectedPage]]">
        <lrnapp-studio-submission-display
          submission="{{submission}}"
        ></lrnapp-studio-submission-display>
        <lrnapp-studio-submission-edit
          submission="{{submission}}"
        ></lrnapp-studio-submission-edit>
        <lrnapp-studio-submission-critique
          submission="{{submission}}"
          edit="[[edit]]"
        ></lrnapp-studio-submission-critique>
      </iron-pages>
    `;
  }
  static get tag() {
    return "lrnapp-studio-submission-object";
  }
  static get properties() {
    return {
      submission: {
        type: Object,
        value: null,
        notify: true
      },
      edit: {
        type: Boolean,
        value: false
      },
      selectedPage: {
        type: Number,
        value: 0
      }
    };
  }

  static get observers() {
    return ["_selectedPageChanged(edit, submission.meta.submissionType)"];
  }

  _selectedPageChanged(edit, type) {
    var selected = 0;
    if (edit) {
      switch (type) {
        case "default":
          selected = 1;
          break;
        case "critique":
          selected = 2;
          break;
      }
    } else {
      switch (type) {
        case "default":
          selected = 0;
          break;
        case "critique":
          selected = 2;
          break;
      }
    }
    this.set("selectedPage", selected);
  }
}
window.customElements.define(
  LrnappStudioSubmissionObject.tag,
  LrnappStudioSubmissionObject
);
export { LrnappStudioSubmissionObject };
