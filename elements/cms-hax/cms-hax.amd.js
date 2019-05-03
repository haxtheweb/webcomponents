define(["exports","require","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/polymer/lib/utils/flattened-nodes-observer.js","./node_modules/@polymer/iron-ajax/iron-ajax.js","./node_modules/@lrnwebcomponents/h-a-x/h-a-x.js","./node_modules/@lrnwebcomponents/simple-toast/simple-toast.js"],function(_exports,_require,_polymerElement,_flattenedNodesObserver,_ironAjax,_hAX,_simpleToast){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.CmsHax=void 0;_require=babelHelpers.interopRequireWildcard(_require);function _templateObject_d30eaa406d6c11e9af343d974c50b918(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: block;\n        font-size: 16px;\n        box-sizing: content-box;\n      }\n    </style>\n    <iron-ajax\n      id=\"pageupdateajax\"\n      url=\"[[endPoint]]\"\n      method=\"[[method]]\"\n      body=\"[[updatePageData]]\"\n      content-type=\"application/json\"\n      handle-as=\"json\"\n      on-response=\"_handleUpdateResponse\"\n    ></iron-ajax>\n    <h-a-x app-store$=\"[[appStoreConnection]]\"></h-a-x>\n  "]);_templateObject_d30eaa406d6c11e9af343d974c50b918=function _templateObject_d30eaa406d6c11e9af343d974c50b918(){return data};return data}/**
 * `cms-hax`
 * @demo ../../demo/index.html
 */var CmsHax=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(CmsHax,_PolymerElement);babelHelpers.createClass(CmsHax,[{key:"_activeHaxBodyUpdated",/**
   * Ensure we've imported our content on initial setup
   */value:function _activeHaxBodyUpdated(newValue,oldValue){// ensure we import our content once we get an initial registration of active body
if(null!=newValue&&!this.__imported){this.__imported=!0;// see what's inside of this, in a template tag
var children=this.queryEffectiveChildren("template");// convert this template content into the real thing
// this helps with correctly preserving everything on the way down
if(babelHelpers.typeof(children)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){newValue.importContent(children.innerHTML)}}}/**
   * Calculate if we have anywhere to redirect to.
   */},{key:"_computeRedirectOnSave",value:function _computeRedirectOnSave(redirectLocation){if(babelHelpers.typeof(redirectLocation)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){return!0}return!1}/**
   * Break the shadow root for this element (by design)
   */},{key:"_attachDom",value:function _attachDom(dom){this.appendChild(dom)}/**
   * Set certain data bound values to the store once it's ready
   */},{key:"_noticeTagChanges",value:function _noticeTagChanges(allowedTags,hideExportButton,hidePanelOps,hidePreferencesButton,align,bodyOffsetLeft){if(window.HaxStore.ready){// double check because this can cause issues
if(allowedTags){window.HaxStore.instance.validTagList=allowedTags}window.HaxStore.instance.haxPanel.hideExportButton=hideExportButton;window.HaxStore.instance.haxPanel.hidePanelOps=hidePanelOps;window.HaxStore.instance.haxPanel.hidePreferencesButton=hidePreferencesButton;window.HaxStore.instance.haxPanel.align=align;window.HaxStore.instance.activeHaxBody.contextOffsetLeft=bodyOffsetLeft}}/**
   * Set certain data bound values to the store once it's ready
   */},{key:"_storeReady",value:function _storeReady(e){// trigger the update of different parts of the global state
this._noticeTagChanges(this.allowedTags,this.hideExportButton,this.hidePanelOps,this.hidePreferencesButton,this.align,this.bodyOffsetLeft)}/**
   * Created life cycle
   */}],[{key:"template",get:function get(){return(0,_polymerElement.html)(_templateObject_d30eaa406d6c11e9af343d974c50b918())}},{key:"tag",get:function get(){return"cms-hax"}},{key:"observers",get:function get(){return["_noticeTagChanges(allowedTags, hideExportButton, hidePanelOps, hidePreferencesButton, align, bodyOffsetLeft)"]}},{key:"properties",get:function get(){return{/**
       * Default the panel to open
       */openDefault:{type:Boolean,value:!1},/**
       * Hide the export button, showing it is good for developers
       * or those doing QA testing of new elements.
       */hideExportButton:{type:Boolean,value:!0},/**
       * Hide the panel operations (save and cancel),
       */hidePanelOps:{type:Boolean,value:!1},/**
       * Hide preferences button
       */hidePreferencesButton:{type:Boolean,value:!1},/**
       * Direction to align the hax edit panel
       */align:{type:String,value:"right"},/**
       * allowed Tags, usually as dictated by the input filtering
       * layer of the backend system that HAX is riding on.
       * While not fullproof, this at least will enforce front-end
       * filtering to match what actually is going to be allowed
       * to be saved in the first place.
       */allowedTags:{type:Array},/**
       * Location to save content to.
       */endPoint:{type:String},/**
       * Method to save content.
       */method:{type:String,value:"PUT"},/**
       * Page data, body of text as a string.
       */updatePageData:{type:String},/**
       * Connection object for talking to an app store.
       */appStoreConnection:{type:Object},/**
       * Offset from the left of the body field
       */bodyOffsetLeft:{type:Number,value:-164},/**
       * State of the panel
       */editMode:{type:Boolean,reflectToAttribute:!0},/**
       * syncBody
       */syncBody:{type:Boolean,value:!1},/**
       * Only available if syncBody is true; this allows data binding to the value being worked on in hax-body tag
       */bodyValue:{type:String,value:""},/**
       * Flag to hide the toast.
       */hideMessage:{type:Boolean,value:!1},/**
       * Optional URL to redirect to once we save.
       */redirectLocation:{type:String},/**
       * Option to redirect once we save successfully
       */redirectOnSave:{type:Boolean,computed:"_computeRedirectOnSave(redirectLocation)"},/**
       * Reference to activeBody.
       */activeHaxBody:{type:Object,observer:"_activeHaxBodyUpdated"},__imported:{type:Boolean,value:!1}}}}]);function CmsHax(){var _this;babelHelpers.classCallCheck(this,CmsHax);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(CmsHax).call(this));new Promise(function(res,rej){return _require.default(["@lrnwebcomponents/cms-hax/lib/cms-token.js"],res,rej)});new Promise(function(res,rej){return _require.default(["@lrnwebcomponents/cms-hax/lib/cms-block.js"],res,rej)});new Promise(function(res,rej){return _require.default(["@lrnwebcomponents/cms-hax/lib/cms-views.js"],res,rej)});new Promise(function(res,rej){return _require.default(["@lrnwebcomponents/cms-hax/lib/cms-entity.js"],res,rej)});window.addEventListener("hax-store-property-updated",_this._haxStorePropertyUpdated.bind(babelHelpers.assertThisInitialized(_this)));window.addEventListener("hax-store-ready",_this._storeReady.bind(babelHelpers.assertThisInitialized(_this)));return _this}/**
   * detached life cycle
   */babelHelpers.createClass(CmsHax,[{key:"disconnectedCallback",value:function disconnectedCallback(){window.removeEventListener("hax-store-ready",this._storeReady.bind(this));window.removeEventListener("hax-save",this._saveFired.bind(this));babelHelpers.get(babelHelpers.getPrototypeOf(CmsHax.prototype),"disconnectedCallback",this).call(this)}/**
   * Attached to the DOM; now we can fire event to the store that
   * we exist and are the thing being edited.
   */},{key:"connectedCallback",value:function connectedCallback(){var _this2=this;babelHelpers.get(babelHelpers.getPrototypeOf(CmsHax.prototype),"connectedCallback",this).call(this);window.SimpleToast.requestAvailability();this.__lock=!1;window.addEventListener("hax-save",this._saveFired.bind(this));// open things by default and set state for edit mode
if(this.openDefault){window.HaxStore.write("editMode",!0,this)}// notice ANY change to body and bubble up, only when we are attached though
if(this.syncBody){(0,_flattenedNodesObserver.FlattenedNodesObserver)(window.HaxStore.instance.activeHaxBody,function(info){if(!_this2.__lock){_this2.__lock=!0;_this2.dispatchEvent(new CustomEvent("hax-body-content-changed",{bubbles:!0,cancelable:!0,composed:!0,detail:window.HaxStore.instance.activeHaxBody.haxToContent()}));setTimeout(function(){_this2.__lock=!1},100)}})}}/**
   * Store updated, sync.
   */},{key:"_haxStorePropertyUpdated",value:function _haxStorePropertyUpdated(e){if(e.detail&&babelHelpers.typeof(e.detail.value)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))&&e.detail.property){if("object"===babelHelpers.typeof(e.detail.value)){this.set(e.detail.property,null)}this.set(e.detail.property,e.detail.value);this.notifyPath(e.detail.property)}}/**
   * _saveFired
   */},{key:"_saveFired",value:function _saveFired(e){// generate sanitized content
this.updatePageData=window.HaxStore.instance.activeHaxBody.haxToContent();// send the request
this.$.pageupdateajax.generateRequest()}/**
   * _handleUpdateResponse
   */},{key:"_handleUpdateResponse",value:function _handleUpdateResponse(e){var _this3=this;if(!this.hideMessage){var evt=new CustomEvent("simple-toast-show",{bubbles:!0,cancelable:!0,detail:{text:"Saved!",duration:3e3}});this.dispatchEvent(evt);// support auto redirecting on save if that's been requested
// in the integration point
if(this.redirectOnSave){setTimeout(function(){// toggle so state is correct when we go to save
window.HaxStore.instance.haxPanel.toggle();// trigger redirect
window.location=_this3.redirectLocation},1e3)}}}}]);return CmsHax}(_polymerElement.PolymerElement);_exports.CmsHax=CmsHax;window.customElements.define(CmsHax.tag,CmsHax)});