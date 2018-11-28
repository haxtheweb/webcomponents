import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-dialog/paper-dialog.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "../node_modules/@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
import "../node_modules/@polymer/paper-icon-button/paper-icon-button.js";
Polymer({
  _template: html`
        <style>
          :host {
            display: block;
            position: relative;
          }
          paper-dialog {
            display: block;
            margin: auto;
            width: 80%;
            height: auto;
            z-index: 1000;
          }
          .top {
            display: flex;
            margin-top: 0;
            justify-content: space-between;
            background-color: #20427b;
            color: #fff;
            padding: 8px 16px;
          }
          .top h2 {
            margin: 8px;
            font-size: 40px;
          }
          .top paper-icon-button {
            margin: 8px;
            padding: 2px;
          }
        </style>
        <paper-dialog id="dialog" with-backdrop opened="{{opened}}">
          <div class="top">
            <h2>[[term]]</h2>
            <paper-icon-button icon="cancel" dialog-dismiss=""></paper-icon-button>
          </div>
          <paper-dialog-scrollable>
            <slot></slot>
          </paper-dialog-scrollable>
        </paper-dialog>
`,
  is: "lrn-vocab-dialog",
  listeners: {
    "iron-overlay-closed": "_modalClosed",
    "iron-overlay-opened": "_resizeContent",
    "iron-overlay-canceled": "_changeOpen"
  },
  properties: {
    opened: { type: Boolean, value: !1, notify: !0 },
    term: { type: String }
  },
  _modalClosed: function(e) {
    this._changeOpen(e);
    this.fire("lrn-vocab-dialog-closed", this);
  },
  _resizeContent: function(e) {
    var evt = document.createEvent("UIEvents");
    evt.initUIEvent("resize", !0, !1, window, 0);
    window.dispatchEvent(evt);
    this._changeOpen(e);
  },
  _changeOpen: function(e) {
    e.stopPropagation();
    if (e.srcElement === this.$.dialog) {
      this.opened = "iron-overlay-opened" === e.type;
      this.fire("lrn-vocab-dialog-changed", this);
    }
  }
});
