import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
import "../node_modules/@polymer/app-layout/app-layout.js";
import "../node_modules/@polymer/neon-animation/neon-animation.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "../node_modules/@polymer/iron-icon/iron-icon.js";
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
        margin: 0 0 8px 0;
        text-align: left;
        @apply --lrnsys-drawer-header;
      }
      .drawer-header-slot {
      }
      .drawer-heading {
        font-size: 24px;
        margin: 0;
        padding: 0 15px;
        height: 40px;
        line-height: 48px;
      }
      .drawer-content {
        padding: 0 15px;
        text-align: left;
      }

      .drawer-header-slot ::slotted(*) {
        font-size: 24px;
        margin: 0;
        padding: 0 15px;
        height: 40px;
        line-height: 48px;
      }
      #close {
        position: absolute;
        right: 8px;
        top: 8px;
        padding: 4px;
        margin: 0;
        text-transform: none;
        float: right;
        font-size: 12px;
        color: var(--simple-modal-color, black);
        background-color: transparent;
        min-width: unset;
      }
      #close iron-icon {
        display: inline-block;
        width: 16px;
        height: 16px;
        margin-right: 2px;
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
        <paper-button id="close" on-tap="closeDrawer"><iron-icon icon="[[closeIcon]]"></iron-icon> [[closeLabel]]</paper-button>
      </div>
    </app-drawer>
`,
  is: "lrnsys-drawer-modal",
  properties: {
    opened: { type: Boolean, value: !1 },
    closeLabel: { type: String, value: "Close" },
    closeIcon: { type: String, value: "cancel" },
    align: { type: String, value: "left" },
    header: { type: String, value: !1 },
    disabled: { type: Boolean, value: !1 },
    headingClass: { type: String, value: "white-text black" }
  },
  open: function() {
    this.$.flyoutcontent.open();
    this.$.close.focus();
  },
  close: function() {
    this.$.flyoutcontent.close();
  },
  attached: function() {
    this.$.flyoutcontent.addEventListener(
      "opened-changed",
      this._drawerClosed.bind(this)
    );
  },
  detached: function() {
    this.$.flyoutcontent.removeEventListener(
      "opened-changed",
      this._drawerClosed.bind(this)
    );
  },
  _drawerClosed: function(e) {
    if (!this.$.flyoutcontent.opened) {
      this.fire("lrnsys-drawer-modal-closed", this);
    }
  },
  closeDrawer: function(e) {
    this.$.flyoutcontent.close();
  }
});
