import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "./lrnapp-studio-submission-media-editoverlay.js";
class LrnappStudioSubmissionEditFile extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-flex;
          justify-content: space-around;
          align-items: stretch;
          min-height: 100px;
          width: 100px;
          position: relative;
          background: lightgray;
          color: #333333;
        }

        lrnapp-studio-submission-media-editoverlay {
          display: flex;
        }

        .file_url {
          margin: 1em;
        }
      </style>

      <lrnapp-studio-submission-media-editoverlay
        on-deleted="_delete"
        data-index\$="[[index]]"
        embedcode="{{embedcode}}"
      >
        <div class="file_url">[[file.filename]]</div>
      </lrnapp-studio-submission-media-editoverlay>
    `;
  }

  static get tag() {
    return "lrnapp-studio-submission-edit-file";
  }

  static get properties() {
    return {
      file: {
        type: Object
      },
      embedcode: {
        type: String,
        computed: "_computeEmbedCode(file)"
      }
    };
  }
  _computeEmbedCode(file) {
    return "[Alternative Text Here](" + file.url + ")";
  }

  _delete(e) {
    this.dispatchEvent(
      new CustomEvent("deleted", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: true
      })
    );
  }
}
window.customElements.define(
  LrnappStudioSubmissionEditFile.tag,
  LrnappStudioSubmissionEditFile
);
export { LrnappStudioSubmissionEditFile };
