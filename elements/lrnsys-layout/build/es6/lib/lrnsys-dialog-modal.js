import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-dialog/paper-dialog.js";
import "../node_modules/@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/neon-animation/neon-animation.js";
import "../node_modules/@polymer/neon-animation/neon-animations.js";
import "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
import "./lrnsys-dialog-toolbar.js";
import "./lrnsys-button-inner.js";
Polymer({
  _template: html`
    <style is="custom-style" include="simple-colors">
      :host {
        display: inline-block;
        z-index: 1000;
      }

      paper-dialog {
        position: fixed;
        top: 5%;
        right: 5%;
        bottom: 5%;
        left: 5%;
        overflow: auto;
        border-radius: 3px;
        color: var(--lrnsys-dialog-color);
        background-color: var(--lrnsys-dialog-background-color);
      }
      paper-dialog-scrollable {
        margin-top:0;
        @apply --layout-flex;
      }

      paper-dialog>*:first-child {
        margin-top: 0;
      }

      .dialog-header {
        width: 100%;
        padding: 0;
        margin: 0;
      }
      .dialog-heading {
        padding: 0;
        margin: 0;
      }
      .dialog-header-slot ::slotted(*) {
        margin: 0;
        padding: 0 15px;
        line-height: 200%;
      }
    </style>
    <paper-dialog modal="[[modal]]" id="dialog" entry-animation="scale-up-animation" exit-animation="fade-out-animation" with-backdrop="" opened\$="[[opened]]">
      <!--START TOOLBAR TO DIALOG -->
      <lrnsys-dialog-toolbar on-button-clicked="_toolbarButtonClickedHandler">
        <span slot="primary">
          <slot name="toolbar-primary"></slot>
        </span>
        <span slot="secondary">
          <slot name="toolbar-secondary"></slot>
        </span>
      </lrnsys-dialog-toolbar>
      <!--END TOOLBAR TO DIALOG -->
      <div class\$="[[headingClass]] dialog-header">
        <div class\$="[[headingClass]] dialog-heading" hidden\$="[[!header]]">[[header]]</div>
        <span class="dialog-header-slot"><slot name="header"></slot></span>
      </div>
      <paper-dialog-scrollable class="dialog-contents" id="dialogcontent">
        <slot></slot>
      </paper-dialog-scrollable>
    </paper-dialog>
`,
  is: "lrnsys-dialog-modal",
  listeners: {
    "iron-overlay-closed": "_modalClosed",
    "iron-overlay-opened": "_resizeContent",
    "iron-overlay-canceled": "_changeOpen"
  },
  properties: {
    header: { type: String, value: !1 },
    modal: { type: Boolean, value: !1 },
    opened: { type: Boolean, value: !1, reflectToAttribute: !0, notify: !0 },
    headingClass: { type: String, value: "white-text black" },
    bodyAppend: { type: Boolean, value: !0 },
    _bodyAppended: { type: Boolean, value: !1 },
    dynamicImages: { type: Boolean, value: !1 }
  },
  toggleDialog: function() {
    if (this.dynamicImages) {
      for (
        var images = this.$.dialogcontent.getElementsByTagName("IRON-IMAGE"),
          i = 0;
        i < images.length;
        i++
      ) {
        images[i].preventLoad = !1;
      }
    }
    this.$.dialog.toggle();
  },
  _toolbarButtonClickedHandler: function(e) {
    if ("close" === e.detail.id) {
      this.$.dialog.cancel();
    }
    this.fire("toolbar-button-clicked", e.detail);
  },
  _modalClosed: function(e) {
    this._changeOpen(e);
    this.fire("lrnsys-dialog-modal-closed", this);
  },
  _resizeContent: function(e) {
    var evt = document.createEvent("UIEvents");
    evt.initUIEvent("resize", !0, !1, window, 0);
    window.dispatchEvent(evt);
    this._changeOpen(e);
  },
  ready: function() {
    const dialog = this.shadowRoot.querySelector("paper-dialog"),
      toolbar = this.shadowRoot.querySelector("lrnsys-dialog-toolbar");
    dialog.addEventListener("mouseover", () => {
      toolbar.setAttribute("secondary-visible", !0);
    });
    dialog.addEventListener("mouseout", () => {
      toolbar.removeAttribute("secondary-visible");
    });
  },
  attached: function() {
    if (this.bodyAppend && !this._bodyAppended) {
      this._bodyAppended = !0;
      document.body.appendChild(this);
    }
  },
  _changeOpen: function(e) {
    e.stopPropagation();
    if (e.srcElement === this.$.dialog) {
      this.opened = "iron-overlay-opened" === e.type;
      this.fire("lrnsys-dialog-modal-changed", this);
    }
  }
});
