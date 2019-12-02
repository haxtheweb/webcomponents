import { LitElement, html, css } from "lit-element/lit-element.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
class LrnappStudioSubmissionMediaEditoverlay extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
      :host {
        display: flex;
        align-items: stretch;
        justify-content: stretch;
      }

      .wrapper {
        position: relative;
        z-index: 1;
        overflow: hidden;
        display: flex;
        align-items: center;
      }

      .actions {
        overflow: hidden;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        z-index: 5;
        color: white;
        background: rgba(0, 0, 0, 0.7);
        height: 100%;
        width: 100%;
        transition: all 0.2s ease-in-out;
        transform: translateY(-100%);
      }

      .wrapper:hover .actions {
        transform: translateY(0);
      }

      paper-dialog {
        width: 50%;
        width: 50vmax;
        padding: 1em;
      }
      `
    ];
  }
  render() {
    return html`
      <div class="wrapper">
        <slot></slot>
        <div class="actions">
          ${this.embedcode ? html`
            <paper-icon-button
              icon="code"
              class="embed"
              @click="${this._embedClicked}"
            ></paper-icon-button>
          `: ``}
          <paper-icon-button
            icon="delete"
            class="delete"
            @click="${this._deleteClicked}"
          ></paper-icon-button>
          <paper-ripple></paper-ripple>
        </div>
      </div>
        ${this.embedcode ? html`
        <paper-dialog id="dialog">
          <h2>Embed Code</h2>
          <p>Paste this into the text area and your image will appear.</p>
          <paper-dialog-scrollable>
            <pre>${this.embedcode}</pre>
          </paper-dialog-scrollable>
        </paper-dialog>
      `: ``}
    `;
  }
  static get tag() {
    return "lrnapp-studio-submission-media-editoverlay";
  }
  static get properties() {
    return {
      embedcode: {
        type: String
      }
    };
  }
  _embedClicked(e) {
    this.shadowRoot.querySelector("#dialog").open();
  }
  _deleteClicked(e) {
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
  LrnappStudioSubmissionMediaEditoverlay.tag,
  LrnappStudioSubmissionMediaEditoverlay
);
export { LrnappStudioSubmissionMediaEditoverlay };
