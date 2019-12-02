import { LitElement, html, css } from "lit-element/lit-element.js";

import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-button/paper-button.js";
import "./lrnapp-studio-submission-edit-add-asset.js";
class LrnappStudioSubmissionEditLinks extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [css``];
  }
  render() {
    return html`
      <style>
        :host {
          display: block;
        }

        .item {
          display: flex;
          margin: auto;
        }

        .info {
          flex: 1 1 auto;
        }

        .create {
          display: flex;
          align-items: center;
        }

        .input {
          flex: 1 1 auto;
        }

        paper-dialog {
          width: 50%;
          width: 50vmax;
          padding: 1em;
        }
      </style>

      <template is="dom-repeat" items="{{links}}" as="link">
        <div class="item">
          <div class="info">
            <div class="linksfield__url">{{link.url}}</div>
          </div>
          <div class="linksfield__actions">
            <paper-icon-button
              icon="delete"
              class="linksfield__delete"
              data-index="{{index}}"
              @click="${this._deleteLink}"
            ></paper-icon-button>
          </div>
        </div>
      </template>
      <lrnapp-studio-submission-edit-add-asset
        icon="link"
        display="pill"
        @click="${this._openDialog}"
      ></lrnapp-studio-submission-edit-add-asset>

      <paper-dialog id="dialog">
        <h2>Add Link</h2>
        <paper-dialog-scrollable>
          <paper-input
            id="link-input"
            class="input"
            label="URL"
            value="{{newlink}}"
          ></paper-input>
        </paper-dialog-scrollable>
        <div class="buttons">
          <paper-button dialog-dismiss="">Cancel</paper-button>
          <paper-button dialog-confirm="" @click="${this._createLink}"
            >Add Link</paper-button
          >
        </div>
      </paper-dialog>
    `;
  }

  static get tag() {
    return "lrnapp-studio-submission-edit-links";
  }

  static get properties() {
    return {
      links: {
        type: Array,
        value: null,
        notify: true
      },
      newlink: {
        type: String,
        value: ""
      }
    };
  }

  _openDialog() {
    // @todo switch to singleton
    this.shadowRoot.querySelector("#dialog").open();
  }

  _createLink(e) {
    var links = this.links;
    if (links === null) {
      this.set("links", []);
    }
    this.push("links", { url: this.newlink });
    this.newlink = "";
  }

  _deleteLink(e) {
    var deleteIndex = e.target.getAttribute("data-index");
    this.links.splice(deleteIndex, 1);
  }
}
window.customElements.define(
  LrnappStudioSubmissionEditLinks.tag,
  LrnappStudioSubmissionEditLinks
);
export { LrnappStudioSubmissionEditLinks };
