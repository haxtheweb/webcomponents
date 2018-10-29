import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@polymer/paper-card/paper-card.js";
import "./node_modules/@polymer/paper-button/paper-button.js";
Polymer({
  _template: html`
        <style>
            :host {
                display: none;
            }
            :host([file]) {
                display: inherit;
            }
        </style>

        <template is="dom-if" if="[[card]]">
            <paper-card heading="[[heading]]" elevation="[[elevation]]">
                <div class="card-content">
                    <object data="[[file]]" type="application/pdf" width="[[width]]" height="[[height]]">
                        <p>
                            {{notSupportedMessage}} <a href="[[file]]">{{notSupportedLinkMessage}}</a>
                        </p>
                    </object>
                </div>
                <div class="card-actions">
                    <paper-button on-click="_download">[[downloadLabel]]</paper-button>
                </div>
            </paper-card>
        </template>

        <template is="dom-if" if="[[!card]]">
            <object data="[[file]]" type="application/pdf" width="[[width]]" height="[[height]]">
                <p>
                    {{notSupportedMessage}} <a href="[[file]]">{{notSupportedLinkMessage}}</a>
                </p>
            </object>
        </template>
`,
  is: "pdf-browser-viewer",
  properties: {
    file: { type: String, value: void 0, reflectToAttribute: !0 },
    notSupportedMessage: {
      type: String,
      value:
        "It appears your Web browser is not configured to display PDF files. No worries, just"
    },
    notSupportedLinkMessage: {
      type: String,
      value: "click here to download the PDF file."
    },
    height: { type: String, value: "400px" },
    width: { type: String, value: "100%" },
    card: { type: Boolean, value: !1 },
    downloadLabel: { type: String, value: "Download" },
    elevation: { type: String, value: "1" }
  },
  clear: function() {
    this.file = void 0;
  },
  _download: function() {
    window.location = this.file;
  }
});
