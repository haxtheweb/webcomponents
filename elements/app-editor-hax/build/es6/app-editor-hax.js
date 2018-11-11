import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "hax-body/hax-store.js";
import "hax-body/hax-body.js";
import "hax-body/hax-autoloader.js";
import "hax-body/hax-manager.js";
import "hax-body/hax-panel.js";
import "hax-body/hax-app-picker.js";
import "hax-body/hax-export-dialog.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        font-size: 16px;
        box-sizing: content-box;
      }
    </style>
    <hax-store skip-exit-trap="" hidden="" app-store="[[appStoreConnection]]"></hax-store>
    <hax-autoloader hidden=""></hax-autoloader>
    <hax-panel id="panel" hide-panel-ops="" hide-export-button="" hide-preferences-button\$="[[hidePreferencesButton]]" align="right"></hax-panel>
    <hax-body id="body"></hax-body>
    <hax-manager></hax-manager>
    <hax-export-dialog></hax-export-dialog>
    <hax-app-picker></hax-app-picker>
`,
  is: "app-editor-hax",
  properties: {
    appStoreConnection: { type: Object },
    hidePreferencesButton: { value: !1, type: Boolean }
  },
  save: function() {
    let content = window.HaxStore.instance.activeHaxBody.haxToContent();
    this.fire("app-editor-hax-save", content);
  },
  import: function(html) {
    window.HaxStore.instance.activeHaxBody.importContent(html);
    this.fire("app-editor-hax-import", !0);
  }
});
