import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
Polymer({
  _template: html`
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
          <paper-icon-button
            icon="code"
            class="embed"
            on-click="_embedClicked"
          ></paper-icon-button>
        </template>
        <paper-icon-button
          icon="delete"
          class="delete"
          on-click="_deleteClicked"
        ></paper-icon-button>
        <paper-ripple></paper-ripple>
      </div>
    </div>

    <template is="dom-if" if="[[embedcode]]">
      <paper-dialog
        id="dialog"
        entry-animation="scale-up-animation"
        exit-animation="fade-out-animation"
        with-backdrop=""
      >
        <h2>Embed Code</h2>
        <p>Paste this into the text area and your image will appear.</p>
        <paper-dialog-scrollable>
          <pre>{{embedcode}}</pre>
        </paper-dialog-scrollable>
      </paper-dialog>
    </template>
  `,

  is: "lrnapp-studio-submission-media-editoverlay",

  properties: {
    embedcode: {
      type: String
    }
  },

  _embedClicked: function(e) {
    // @todo switch to singleton
    this.shadowRoot.querySelector("#dialog").open();
  },

  _deleteClicked: function(e) {
    this.fire("delete");
  }
});
