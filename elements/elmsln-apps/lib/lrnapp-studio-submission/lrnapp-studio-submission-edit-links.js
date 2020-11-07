import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-input/paper-input.js";
import "./lrnapp-studio-submission-edit-add-asset.js";
class LrnappStudioSubmissionEditLinks extends PolymerElement {
  static get template() {
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
            <simple-icon-button
              icon="delete"
              class="linksfield__delete"
              data-index$="{{index}}"
              on-click="_deleteLink"
            ></simple-icon-button>
          </div>
        </div>
      </template>
      <lrnapp-studio-submission-edit-add-asset
        icon="link"
        display="pill"
        on-click="_openDialog"
      ></lrnapp-studio-submission-edit-add-asset>

      <paper-dialog id="dialog">
        <h2>Add Link</h2>
        <div style="height:50vh;width:100%;overflow:scroll;">
          <paper-input
            id="link-input"
            class="input"
            label="URL"
            value="{{newlink}}"
          ></paper-input>
        </div>
        <div class="buttons">
          <button dialog-dismiss="">Cancel</button>
          <button dialog-confirm="" on-click="_createLink">Add Link</button>
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
        notify: true,
      },
      newlink: {
        type: String,
        value: "",
      },
    };
  }

  _openDialog() {
    // @todo switch to singleton
    this.$.dialog.open();
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
    var normalizedEvent = dom(e);
    var deleteIndex = normalizedEvent.localTarget.getAttribute("data-index");
    this.splice("links", deleteIndex, 1);
  }
}
window.customElements.define(
  LrnappStudioSubmissionEditLinks.tag,
  LrnappStudioSubmissionEditLinks
);
export { LrnappStudioSubmissionEditLinks };
