import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
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
          .close_button {
            display: flex;
            flex-direction: row-reverse;
            margin-top: 0;
            background-color: #20427b;
            color: #fff;
            padding: 8px;
          }
        </style>
        <paper-dialog id="dialog" with-backdrop="" opened="{{opened}}">
          <div class="close_button">
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
    /**
     * Dialog state management.
     */
    opened: {
      type: Boolean,
      value: false,
      notify: true
    }
  },

  /**
   * Attached lifecyce
   */
  attached: function() {
    // support for appending to the light document
    // while also making sure we don't loop in attach
    if (this.bodyAppend && !this._bodyAppended) {
      this._bodyAppended = true;
      document.body.appendChild(this);
    }
  },

  /**
   * Modal has closed, let's react appropriately.
   */
  _modalClosed: function(e) {
    // fire so we can react to accessibly; don't care who invoked this
    // just that it has happened
    this._changeOpen(e);
    this.fire("lrn-vocab-dialog-closed", this);
  },

  /**
   * Ensure everything is visible in what's been expanded.
   */
  _resizeContent: function(e) {
    // fake a resize event to make contents happy
    var evt = document.createEvent("UIEvents");
    evt.initUIEvent("resize", true, false, window, 0);
    window.dispatchEvent(evt);
    this._changeOpen(e);
  },

  /**
   * Attached lifecyce
   */
  _changeOpen: function(e) {
    e.stopPropagation();
    // test if this is an IDENTICAL item
    if (e.srcElement === this.$.dialog) {
      this.opened = e.type === "iron-overlay-opened";
      this.fire("lrn-vocab-dialog-changed", this);
    }
  }
});
