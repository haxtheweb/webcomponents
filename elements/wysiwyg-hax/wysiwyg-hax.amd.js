define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/cms-hax/cms-hax.js","./node_modules/@polymer/polymer/lib/utils/flattened-nodes-observer.js"],function(_exports,_polymerElement,_cmsHax,_flattenedNodesObserver){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.WysiwygHax=void 0;function _templateObject_0b254ef0ab1811e9a3179764733bd90d(){var data=babelHelpers.taggedTemplateLiteral(["\n      <style>\n        :host {\n          display: block;\n        }\n      </style>\n      <textarea id$=\"[[fieldId]]\" name=\"[[fieldName]]\" hidden=\"\">\n[[bodyValue]]</textarea\n      >\n      <cms-hax\n        open-default=\"[[openDefault]]\"\n        hide-message=\"\"\n        body-offset-left=\"[[bodyOffsetLeft]]\"\n        update-page-data=\"[[updatePageData]]\"\n        end-point=\"[[endPoint]]\"\n        app-store-connection=\"[[appStoreConnection]]\"\n        hide-export-button=\"[[hideExportButton]]\"\n        align=\"[[align]]\"\n      >\n      </cms-hax>\n    "],["\n      <style>\n        :host {\n          display: block;\n        }\n      </style>\n      <textarea id\\$=\"[[fieldId]]\" name=\"[[fieldName]]\" hidden=\"\">\n[[bodyValue]]</textarea\n      >\n      <cms-hax\n        open-default=\"[[openDefault]]\"\n        hide-message=\"\"\n        body-offset-left=\"[[bodyOffsetLeft]]\"\n        update-page-data=\"[[updatePageData]]\"\n        end-point=\"[[endPoint]]\"\n        app-store-connection=\"[[appStoreConnection]]\"\n        hide-export-button=\"[[hideExportButton]]\"\n        align=\"[[align]]\"\n      >\n      </cms-hax>\n    "]);_templateObject_0b254ef0ab1811e9a3179764733bd90d=function _templateObject_0b254ef0ab1811e9a3179764733bd90d(){return data};return data}/**
 * `wysiwyg-hax`
 * `Integration of wysiwyg edit form for a page with HAX.`
 */var WysiwygHax=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(WysiwygHax,_PolymerElement);function WysiwygHax(){babelHelpers.classCallCheck(this,WysiwygHax);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(WysiwygHax).apply(this,arguments))}babelHelpers.createClass(WysiwygHax,[{key:"_attachDom",/**
   * highjack shadowDom
   */value:function _attachDom(dom){this.appendChild(dom)}/**
   * Ensure we've imported our content on initial setup
   */},{key:"_activeHaxBodyUpdated",value:function _activeHaxBodyUpdated(newValue,oldValue){var _this=this;// ensure we import our content once we get an initial registration of active body
if(null!=newValue&&!this.__imported){this.__imported=!0;// see what's inside of this, in a template tag
var children=this.querySelector("template");// convert this template content into the real thing
// this helps with correctly preserving everything on the way down
if(null!=children){newValue.importContent(children.innerHTML);// need to dot his because of juggling unfortunately
this.editMode=!1;window.HaxStore.write("editMode",this.editMode,this);setTimeout(function(){_this.editMode=!0;window.HaxStore.write("editMode",_this.editMode,_this)},200)}}}},{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(WysiwygHax.prototype),"connectedCallback",this).call(this);document.body.addEventListener("hax-save",this._bodyContentUpdated.bind(this));document.body.addEventListener("hax-store-property-updated",this._haxStorePropertyUpdated.bind(this))}},{key:"disconnectedCallback",value:function disconnectedCallback(){document.body.removeEventListener("hax-save",this._bodyContentUpdated.bind(this));document.body.removeEventListener("hax-store-property-updated",this._haxStorePropertyUpdated.bind(this));babelHelpers.get(babelHelpers.getPrototypeOf(WysiwygHax.prototype),"disconnectedCallback",this).call(this)}/**
   * Store updated, sync.
   */},{key:"_haxStorePropertyUpdated",value:function _haxStorePropertyUpdated(e){if(e.detail&&babelHelpers.typeof(e.detail.value)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))&&e.detail.property){if("object"===babelHelpers.typeof(e.detail.value)){this.set(e.detail.property,null)}this.set(e.detail.property,e.detail.value)}}/**
   * Set the bubbled up event to the body value that just got changed
   */},{key:"_bodyContentUpdated",value:function _bodyContentUpdated(e){this.bodyValue=window.HaxStore.instance.activeHaxBody.haxToContent()}}],[{key:"template",get:function get(){return(0,_polymerElement.html)(_templateObject_0b254ef0ab1811e9a3179764733bd90d())}},{key:"tag",get:function get(){return"wysiwyg-hax"}},{key:"properties",get:function get(){return{/**
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
       */activeHaxBody:{type:Object,observer:"_activeHaxBodyUpdated"},__imported:{type:Boolean,value:!1}}}}]);return WysiwygHax}(_polymerElement.PolymerElement);_exports.WysiwygHax=WysiwygHax;window.customElements.define(WysiwygHax.tag,WysiwygHax)});