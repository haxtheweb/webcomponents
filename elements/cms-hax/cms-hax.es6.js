import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import{dom}from"./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";import{FlattenedNodesObserver}from"./node_modules/@polymer/polymer/lib/utils/flattened-nodes-observer.js";import"./node_modules/@polymer/iron-ajax/iron-ajax.js";import"./node_modules/@polymer/paper-toast/paper-toast.js";import"./node_modules/@lrnwebcomponents/hax-body/lib/hax-store.js";import"./node_modules/@lrnwebcomponents/hax-body/hax-body.js";import"./node_modules/@lrnwebcomponents/hax-body/lib/hax-autoloader.js";import"./node_modules/@lrnwebcomponents/hax-body/lib/hax-manager.js";import"./node_modules/@lrnwebcomponents/hax-body/lib/hax-panel.js";import"./node_modules/@lrnwebcomponents/hax-body/lib/hax-app-picker.js";import"./node_modules/@lrnwebcomponents/hax-body/lib/hax-export-dialog.js";import"./lib/cms-token.js";import"./lib/cms-block.js";import"./lib/cms-views.js";import"./lib/cms-entity.js";let CmsHax=Polymer({_template:html`
    <style>
      :host {
        display: block;
        font-size: 16px;
        box-sizing: content-box;
      }
    </style>
    <iron-ajax
      id="pageupdateajax"
      url="[[endPoint]]"
      method="[[method]]"
      body="[[updatePageData]]"
      content-type="application/json"
      handle-as="json"
      on-response="_handleUpdateResponse"
    ></iron-ajax>
    <paper-toast id="toast" horizontal-align="left"></paper-toast>
    <hax-store
      hidden=""
      app-store="[[appStoreConnection]]"
      valid-tag-list="[[allowedTags]]"
    ></hax-store>
    <hax-autoloader id="loader" hidden=""></hax-autoloader>
    <hax-panel
      id="panel"
      hide-export-button="{{hideExportButton}}"
      hide-panel-ops="[[hidePanelOps]]"
      hide-preferences-button="[[hidePreferencesButton]]"
      align="[[align]]"
    ></hax-panel>
    <hax-body id="body" context-offset-left="[[bodyOffsetLeft]]"></hax-body>
    <hax-manager></hax-manager>
    <hax-app-picker></hax-app-picker>
    <hax-export-dialog></hax-export-dialog>
    <cms-token></cms-token>
    <cms-views></cms-views>
    <cms-block></cms-block>
    <cms-entity></cms-entity>
  `,is:"cms-hax",properties:{openDefault:{type:Boolean,value:!1},hideExportButton:{type:Boolean,value:!0},hidePanelOps:{type:Boolean,value:!1},hidePreferencesButton:{type:Boolean,value:!1},align:{type:String,value:"right"},allowedTags:{type:Array},endPoint:{type:String},method:{type:String,value:"PUT"},updatePageData:{type:String},appStoreConnection:{type:Object},bodyOffsetLeft:{type:Number,value:-164},editMode:{type:Boolean,reflectToAttribute:!0},syncBody:{type:Boolean,value:!1},bodyValue:{type:String,value:""},hideMessage:{type:Boolean,value:!1},redirectLocation:{type:String},redirectOnSave:{type:Boolean,computed:"_computeRedirectOnSave(redirectLocation)"},activeHaxBody:{type:Object,observer:"_activeHaxBodyUpdated"},__imported:{type:Boolean,value:!1}},_activeHaxBodyUpdated:function(newValue,oldValue){if(null!=newValue&&!this.__imported){this.__imported=!0;let children=this.queryEffectiveChildren("template");if(typeof children!==typeof void 0){newValue.importContent(children.innerHTML)}}},_computeRedirectOnSave:function(redirectLocation){if(typeof redirectLocation!==typeof void 0){return!0}return!1},created:function(){document.body.addEventListener("hax-store-property-updated",this._haxStorePropertyUpdated.bind(this))},attached:function(){this.__lock=!1;document.body.addEventListener("hax-save",this._saveFired.bind(this));if(this.openDefault){window.HaxStore.write("editMode",!0,this)}if(this.syncBody){FlattenedNodesObserver(this.$.body,info=>{if(!this.__lock){this.__lock=!0;this.fire("hax-body-content-changed",window.HaxStore.instance.activeHaxBody.haxToContent());setTimeout(()=>{this.__lock=!1},100)}})}},_haxStorePropertyUpdated:function(e){if(e.detail&&typeof e.detail.value!==typeof void 0&&e.detail.property){if("object"===typeof e.detail.value){this.set(e.detail.property,null)}this.set(e.detail.property,e.detail.value);this.notifyPath(e.detail.property)}},_saveFired:function(e){this.updatePageData=window.HaxStore.instance.activeHaxBody.haxToContent();this.$.pageupdateajax.generateRequest()},_handleUpdateResponse:function(e){if(!this.hideMessage){this.$.toast.show("Saved!");if(this.redirectOnSave){setTimeout(()=>{this.$.panel.toggle();window.location=this.redirectLocation},1e3)}}}});export{CmsHax};