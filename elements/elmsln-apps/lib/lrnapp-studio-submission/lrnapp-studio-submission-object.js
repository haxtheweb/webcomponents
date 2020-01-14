import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/iron-pages/iron-pages.js";
import "./lrnapp-studio-submission-display.js";
import "./lrnapp-studio-submission-edit.js";
import "./lrnapp-studio-submission-critique.js";
class LrnappStudioSubmissionObject extends LitElement {
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
      <iron-pages selected="${this.selectedPage}">
        <lrnapp-studio-submission-display
          .submission="${this.submission}"
          @submission-changed="${this.submissionChanged}"
        ></lrnapp-studio-submission-display>
        <lrnapp-studio-submission-edit
          .submission="${this.submission}"
          @submission-changed="${this.submissionChanged}"
        ></lrnapp-studio-submission-edit>
        <lrnapp-studio-submission-critique
          .submission="${this.submission}"
          @submission-changed="${this.submissionChanged}"
          ?edit="${this.edit}"
        ></lrnapp-studio-submission-critique>
      </iron-pages>
    `;
  }
  static get tag() {
    return "lrnapp-studio-submission-object";
  }
  static get properties() {
    return {
      elmslnCourse: {
        type: String,
        attribute: "elmsln-course"
      },
      elmslnSection: {
        type: String,
        attribute: "elmsln-section"
      },
      basePath: {
        type: String,
        attribute: "base-path"
      },
      csrfToken: {
        type: String,
        attribute: "csrf-token"
      },
      endPoint: {
        type: String,
        attribute: "end-point"
      },
      submission: {
        type: Object
      },
      edit: {
        type: Boolean
      },
      selectedPage: {
        type: Number,
        attribute: "selected-page"
      }
    };
  }
  submissionChanged(e) {
    this.submission = { ...e.detail.value };
  }
  constructor() {
    super();
    this.submission = null;
    this.edit = false;
    this.selectedPage = 0;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "submission") {
        // notify
        this.dispatchEvent(
          new CustomEvent("submission-changed", {
            detail: {
              value: this[propName]
            }
          })
        );
      }
      if (["edit", "submission"].includes(propName)) {
        this._selectedPageChanged(
          this.edit,
          this.submission.meta.submissionType
        );
      }
    });
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
    this.selectedPage = selected;
  }
}
window.customElements.define(
  LrnappStudioSubmissionObject.tag,
  LrnappStudioSubmissionObject
);
export { LrnappStudioSubmissionObject };
