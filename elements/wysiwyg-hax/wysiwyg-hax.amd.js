define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js","./node_modules/@lrnwebcomponents/cms-hax/cms-hax.js"],function(_exports,_polymerLegacy,_cmsHax){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.WysiwygHax=void 0;function _templateObject_a05190a06a8711e99355f9f0219852f8(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <textarea id$=\"[[fieldId]]\" name=\"[[fieldName]]\" hidden=\"\">\n[[bodyValue]]</textarea\n    >\n    <cms-hax\n      open-default=\"[[openDefault]]\"\n      hide-message=\"\"\n      body-offset-left=\"[[bodyOffsetLeft]]\"\n      update-page-data=\"[[updatePageData]]\"\n      end-point=\"[[endPoint]]\"\n      app-store-connection=\"[[appStoreConnection]]\"\n      hide-export-button=\"[[hideExportButton]]\"\n      align=\"[[align]]\"\n    >\n    </cms-hax>\n  "],["\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <textarea id\\$=\"[[fieldId]]\" name=\"[[fieldName]]\" hidden=\"\">\n[[bodyValue]]</textarea\n    >\n    <cms-hax\n      open-default=\"[[openDefault]]\"\n      hide-message=\"\"\n      body-offset-left=\"[[bodyOffsetLeft]]\"\n      update-page-data=\"[[updatePageData]]\"\n      end-point=\"[[endPoint]]\"\n      app-store-connection=\"[[appStoreConnection]]\"\n      hide-export-button=\"[[hideExportButton]]\"\n      align=\"[[align]]\"\n    >\n    </cms-hax>\n  "]);_templateObject_a05190a06a8711e99355f9f0219852f8=function _templateObject_a05190a06a8711e99355f9f0219852f8(){return data};return data}/*
`wysiwyg-hax`
Integration of wysiwyg edit form for a page with HAX.

*/var WysiwygHax=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_a05190a06a8711e99355f9f0219852f8()),is:"wysiwyg-hax",properties:{/**
     * Default the panel to open
     */openDefault:{type:Boolean,value:!1},/**
     * Hide the export button, not a common thing to show
     * in this mode but it's possible for debugging
     */hideExportButton:{type:Boolean,value:!0},/**
     * Direction to align the hax edit panel
     */align:{type:String,value:"right"},/**
     * Data binding of a hidden text area with the value from the hax-body tag
     */bodyValue:{type:String},/**
     * Connection object for talking to an app store.
     */appStoreConnection:{type:Object},/**
     * fieldId, id value on the input field.
     */fieldId:{type:String,value:"textarea-input-field"},/**
     * fieldName, internal to the form in whatever system it's in.
     */fieldName:{type:String,value:"data[content]"},/**
     * Offset from the left of the body field
     */bodyOffsetLeft:{type:Number,value:-22},/**
     * State of the panel
     */editMode:{type:Boolean,reflectToAttribute:!0},/**
     * Location to save content to.
     */endPoint:{type:String},/**
     * Page data, body of text as a string.
     */updatePageData:{type:String},/**
     * Reference to activeBody.
     */activeHaxBody:{type:Object,observer:"_activeHaxBodyUpdated"},__imported:{type:Boolean,value:!1}},/**
   * highjack shadowDom
   */_attachDom:function _attachDom(dom){this.appendChild(dom)},/**
   * Ensure we've imported our content on initial setup
   */_activeHaxBodyUpdated:function _activeHaxBodyUpdated(newValue,oldValue){var _this=this;// ensure we import our content once we get an initial registration of active body
if(null!=newValue&&!this.__imported){this.__imported=!0;// see what's inside of this, in a template tag
var children=this.queryEffectiveChildren("template");// convert this template content into the real thing
// this helps with correctly preserving everything on the way down
if(babelHelpers.typeof(children)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){newValue.importContent(children.innerHTML);// need to dot his because of juggling unfortunately
this.editMode=!1;window.HaxStore.write("editMode",this.editMode,this);setTimeout(function(){_this.editMode=!0;window.HaxStore.write("editMode",_this.editMode,_this)},200)}}},/**
   * Created life cycle
   */created:function created(){document.body.addEventListener("hax-store-property-updated",this._haxStorePropertyUpdated.bind(this))},/**
   * Attached to the DOM; now we can fire event to the store that
   * we exist and are the thing being edited.
   */attached:function attached(){document.body.addEventListener("hax-save",this._bodyContentUpdated.bind(this));document.body.addEventListener("hax-store-property-updated",this._haxStorePropertyUpdated.bind(this));// import the text area down into the active hax body, which cms-hax is providing
},/**
   * Store updated, sync.
   */_haxStorePropertyUpdated:function _haxStorePropertyUpdated(e){if(e.detail&&babelHelpers.typeof(e.detail.value)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))&&e.detail.property){if("object"===babelHelpers.typeof(e.detail.value)){this.set(e.detail.property,null)}this.set(e.detail.property,e.detail.value)}},/**
   * Set the bubbled up event to the body value that just got changed
   */_bodyContentUpdated:function _bodyContentUpdated(e){this.bodyValue=window.HaxStore.instance.activeHaxBody.haxToContent()}});_exports.WysiwygHax=WysiwygHax});