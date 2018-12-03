import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/cms-hax/cms-hax.js";let WysiwygHax=Polymer({_template:html`
    <style>
      :host {
        display: block;
      }
    </style>
    <textarea
      id\$="[[fieldId]]"
      name="[[fieldName]]"
      hidden=""
    >[[bodyValue]]</textarea>
    <cms-hax
      open-default="[[openDefault]]"
      hide-message=""
      body-offset-left="[[bodyOffsetLeft]]"
      update-page-data="[[updatePageData]]"
      end-point="[[endPoint]]"
      app-store-connection="[[appStoreConnection]]"
      hide-export-button="[[hideExportButton]]"
      align="[[align]]"
    ></cms-hax>
  `,is:"wysiwyg-hax",properties:{openDefault:{type:Boolean,value:!1},hideExportButton:{type:Boolean,value:!0},align:{type:String,value:"right"},bodyValue:{type:String},appStoreConnection:{type:Object},fieldId:{type:String,value:"textarea-input-field"},fieldName:{type:String,value:"data[content]"},bodyOffsetLeft:{type:Number,value:-22},editMode:{type:Boolean,reflectToAttribute:!0},endPoint:{type:String},updatePageData:{type:String},activeHaxBody:{type:Object,observer:"_activeHaxBodyUpdated"},__imported:{type:Boolean,value:!1}},_activeHaxBodyUpdated:function(newValue,oldValue){if(null!=newValue&&!this.__imported){this.__imported=!0;let children=this.queryEffectiveChildren("template");if(typeof children!==typeof void 0){newValue.importContent(children.innerHTML);this.editMode=!1;window.HaxStore.write("editMode",this.editMode,this);setTimeout(()=>{this.editMode=!0;window.HaxStore.write("editMode",this.editMode,this)},200)}}},created:function(){document.body.addEventListener("hax-store-property-updated",this._haxStorePropertyUpdated.bind(this))},attached:function(){document.body.addEventListener("hax-save",this._bodyContentUpdated.bind(this));document.body.addEventListener("hax-store-property-updated",this._haxStorePropertyUpdated.bind(this))},_haxStorePropertyUpdated:function(e){if(e.detail&&typeof e.detail.value!==typeof void 0&&e.detail.property){if("object"===typeof e.detail.value){this.set(e.detail.property,null)}this.set(e.detail.property,e.detail.value)}},_bodyContentUpdated:function(e){this.bodyValue=window.HaxStore.instance.activeHaxBody.haxToContent()}});export{WysiwygHax};