import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/hax-body/lib/hax-store.js";import"./node_modules/@lrnwebcomponents/hax-body/hax-body.js";import"./node_modules/@lrnwebcomponents/hax-body/lib/hax-autoloader.js";import"./node_modules/@lrnwebcomponents/hax-body/lib/hax-manager.js";import"./node_modules/@lrnwebcomponents/hax-body/lib/hax-panel.js";import"./node_modules/@lrnwebcomponents/hax-body/lib/hax-app-picker.js";import"./node_modules/@lrnwebcomponents/hax-body/lib/hax-export-dialog.js";let AppEditorHax=Polymer({_template:html`
    <style>
      :host {
        display: block;
        font-size: 16px;
        box-sizing: content-box;
      }
    </style>
    <hax-store
      skip-exit-trap=""
      hidden=""
      app-store="[[appStoreConnection]]"
    ></hax-store>
    <hax-autoloader hidden=""></hax-autoloader>
    <hax-panel
      id="panel"
      hide-panel-ops=""
      hide-export-button=""
      hide-preferences-button\$="[[hidePreferencesButton]]"
      align="right"
    ></hax-panel>
    <hax-body id="body"></hax-body>
    <hax-manager></hax-manager>
    <hax-export-dialog></hax-export-dialog>
    <hax-app-picker></hax-app-picker>
  `,is:"app-editor-hax",properties:{appStoreConnection:{type:Object},hidePreferencesButton:{value:!1,type:Boolean}},save:function(){let content=window.HaxStore.instance.activeHaxBody.haxToContent();this.fire("app-editor-hax-save",content)},import:function(html){window.HaxStore.instance.activeHaxBody.importContent(html);this.fire("app-editor-hax-import",!0)}});export{AppEditorHax};