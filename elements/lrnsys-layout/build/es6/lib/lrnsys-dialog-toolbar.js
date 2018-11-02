import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js";
import "./lrnsys-dialog-toolbar-button.js";
Polymer({
  _template: html`
    <style is="custom-style">
     :host {
        display: block;
        --app-toolbar-primary-height: 40px;
        --app-toolbar-secondary-height: 50px;
        --app-toolbar-secondary-color: var(--lrnsys-dialog-secondary-background-color);
        --app-toolbar-primary-color: var(--lrnsys-dialog-toolbar-background-color);
        position: relative;
        margin: 0;
        padding: 0;
      }
      app-toolbar#primary {
        color: var(--lrnsys-dialog-color,#000);
        background-color: var(--app-toolbar-primary-color);
        z-index: 10;
        position: relative;
        height: var(--app-toolbar-primary-height);
      }
      app-toolbar#secondary {
        color: var(--lrnsys-dialog-color,#000);
        background-color: var(--app-toolbar-secondary-color);
        z-index: 5;
        position: absolute;
        width: 100%;
        transform: translateY(-100%);
        transition: all 0.3s ease-in;
        height: var(--app-toolbar-primary-height);
        display: flex;
        justify-content: center;
        padding: 0;
      }
      :host([secondary-visible]) #secondary {
        transform: translateY(0);
        height: var(--app-toolbar-secondary-height);
      }
      .secondary-buttons {
        display: flex;
      }
      .secondary-buttons ::shadow * {
        display: inline-flex;
      }
    </style>
    <app-toolbar id="primary">
      <slot name="primary"></slot>
      <div main-title=""></div>
      <lrnsys-dialog-toolbar-button icon="close" id="close" title="close dialog"></lrnsys-dialog-toolbar-button>
    </app-toolbar>
    <app-toolbar id="secondary" hidden\$="[[!_secondaryHasChildren]]">
      <div class="secondary-buttons">
        <slot name="secondary" id="secondary-slot"></slot>
      </div>
    </app-toolbar>
`,
  is: "lrnsys-dialog-toolbar",
  listeners: { "dialog-toolbar-button-tapped": "_tapHandler" },
  properties: { _secondaryHasChildren: { type: Boolean, value: !1 } },
  _tapHandler: function(e) {
    this.fire("button-clicked", e.detail);
  },
  ready: function() {
    this.$.secondary.addEventListener("button-initialized", () => {
      this._secondaryHasChildren = !0;
    });
  }
});
