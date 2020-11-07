import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import "@polymer/paper-dialog/paper-dialog.js";
class LrnappStudioSubmissionMediaEditoverlay extends PolymerElement {
  static get template() {
    return html`
      <style>
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
      </style>
      <div class="wrapper">
        <slot></slot>
        <div class="actions">
          <template is="dom-if" if="[[embedcode]]">
            <simple-icon-button
              icon="code"
              class="embed"
              on-click="_embedClicked"
            ></simple-icon-button>
          </template>
          <simple-icon-button
            icon="delete"
            class="delete"
            on-click="_deleteClicked"
          ></simple-icon-button>
        </div>
      </div>
      <template is="dom-if" if="[[embedcode]]">
        <paper-dialog id="dialog">
          <h2>Embed Code</h2>
          <p>Paste this into the text area and your image will appear.</p>
          <div style="height:50vh;width:100%;overflow:scroll;">
            <pre>{{embedcode}}</pre>
          </div>
        </paper-dialog>
      </template>
    `;
  }
  static get tag() {
    return "lrnapp-studio-submission-media-editoverlay";
  }
  static get properties() {
    return {
      embedcode: {
        type: String,
      },
    };
  }
  _embedClicked(e) {
    // @todo switch to singleton
    this.shadowRoot.querySelector("#dialog").open();
  }
  _deleteClicked(e) {
    this.dispatchEvent(
      new CustomEvent("deleted", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: true,
      })
    );
  }
}
window.customElements.define(
  LrnappStudioSubmissionMediaEditoverlay.tag,
  LrnappStudioSubmissionMediaEditoverlay
);
export { LrnappStudioSubmissionMediaEditoverlay };
