import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
import "../node_modules/@polymer/app-layout/app-layout.js";
import "../node_modules/@polymer/neon-animation/neon-animation.js";
import "../node_modules/@polymer/paper-icon-button/paper-icon-button.js";
import "./lrnsys-button-inner.js";
Polymer({
  _template: html`
    <style is="custom-style" include="simple-colors">
      :host {
        display: block;
        z-index: 1000;
      }
      app-drawer {
        --app-drawer-width: var(--lrnsys-drawer-width);
        --app-drawer-content-container: {
          padding: 0;
          overflow-y: scroll;
          position: fixed;
          color: var(--lrnsys-drawer-color);
          background-color: var(--lrnsys-drawer-background-color);
        }
      }
      .drawer-header {
        width: 100%;
        padding: 0;
        margin: 0 0 .5em 0;
        text-align: left;
        @apply --lrnsys-drawer-header;
      }
      .drawer-header-slot {
      }
      .drawer-heading {
        font-size: 1.5em;
        margin: 0;
        padding: 0 15px;
        height: 2.5em;
        line-height: 3em;
      }
      .drawer-content {
        padding: 0 15px;
        text-align: left;
      }

      #close {
        position: absolute;
        right: 0.5em;
        top: 0.5em;
        padding: 0 0 0 0.25em;
        margin: 0;
        min-width: .1em;
        text-transform: none;
      }
      .drawer-header-slot ::slotted(*) {
        font-size: 1.5em;
        margin: 0;
        padding: 0 15px;
        height: 2.5em;
        line-height: 3em;
      }
    </style>
    <app-drawer tabindex="0" id="flyoutcontent" opened="[[opened]]" align="[[align]]" role="dialog">
      <div class="drawer-contents">
        <div class="drawer-header">
          <div class\$="[[headingClass]] drawer-header-slot">
            <slot name="header"></slot>
          </div>
          <h3 class\$="[[headingClass]] drawer-heading" hidden\$="[[!header]]">[[header]]</h3>
        </div>
        <div class="drawer-content">
          <slot></slot>
        </div>
      </div>
      <paper-icon-button raised="" icon="close" on-tap="closeDrawer" id="close" aria-label="close dialog" class\$="[[headingClass]]"></paper-icon-button>
      <paper-tooltip for="close" animation-delay="500">Close dialog</paper-tooltip>
    </app-drawer>
`,
  is: "lrnsys-drawer-modal",
  listeners: { "flyoutcontent.opened-changed": "_drawerClosed" },
  properties: {
    opened: { type: Boolean, value: !1 },
    align: { type: String, value: "left" },
    header: { type: String, value: !1 },
    disabled: { type: Boolean, value: !1 },
    headingClass: { type: String, value: "white-text black" },
    bodyAppend: { type: Boolean, value: !0 },
    _bodyAppended: { type: Boolean, value: !1 }
  },
  open: function() {
    this.$.flyoutcontent.open();
    this.$.close.focus();
  },
  close: function() {
    this.$.flyoutcontent.close();
  },
  attached: function() {
    if (this.bodyAppend && !this._bodyAppended) {
      this._bodyAppended = !0;
      document.body.appendChild(this);
    }
  },
  _drawerClosed: function() {
    if (!this.$.flyoutcontent.opened) {
      this.fire("lrnsys-drawer-modal-closed", this);
    }
  },
  closeDrawer: function() {
    this.$.flyoutcontent.close();
  }
});
