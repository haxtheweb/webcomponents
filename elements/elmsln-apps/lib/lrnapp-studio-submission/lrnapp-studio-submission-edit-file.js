import { LitElement, html, css } from "lit-element/lit-element.js";
import "./lrnapp-studio-submission-media-editoverlay.js";
class LrnappStudioSubmissionEditFile extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
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
      `
    ];
  }
  render() {
    return html`
      <lrnapp-studio-submission-media-editoverlay
        data-index="${this.index}"
        embedcode="${this.embedcode}"
      >
        <div class="file_url">${this.file.filename}</div>
      </lrnapp-studio-submission-media-editoverlay>
    `;
  }

  static get tag() {
    return "lrnapp-studio-submission-edit-file";
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "file") {
        this.embedcode = this._computeEmbedCode(this[propName]);
      }
    });
  }
  static get properties() {
    return {
      file: {
        type: Object
      },
      index: {
        type: String
      },
      embedcode: {
        type: String
      }
    };
  }
  _computeEmbedCode(file) {
    return "[Alternative Text Here](" + file.url + ")";
  }
}
window.customElements.define(
  LrnappStudioSubmissionEditFile.tag,
  LrnappStudioSubmissionEditFile
);
export { LrnappStudioSubmissionEditFile };
