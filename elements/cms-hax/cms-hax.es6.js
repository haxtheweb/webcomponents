import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import{FlattenedNodesObserver}from"./node_modules/@polymer/polymer/lib/utils/flattened-nodes-observer.js";import"./node_modules/@polymer/iron-ajax/iron-ajax.js";import"./node_modules/@lrnwebcomponents/h-a-x/h-a-x.js";import"./node_modules/@lrnwebcomponents/simple-toast/simple-toast.js";import"./lib/cms-token.js";import"./lib/cms-block.js";import"./lib/cms-views.js";import"./lib/cms-entity.js";/**
`cms-hax`
A LRN polymer app

@demo ../../demo/index.html

@microcopy - the mental model for this app
 -
 -

*/let CmsHax=Polymer({_template:html`
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
    <h-a-x app-store$="[[appStoreConnection]]"></h-a-x>
  `,is:"cms-hax",observers:["_noticeTagChanges(allowedTags, hideExportButton, hidePanelOps, hidePreferencesButton, align, bodyOffsetLeft)"],properties:{/**
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
     */activeHaxBody:{type:Object,observer:"_activeHaxBodyUpdated"},__imported:{type:Boolean,value:!1}},/**
   * Ensure we've imported our content on initial setup
   */_activeHaxBodyUpdated:function(newValue,oldValue){// ensure we import our content once we get an initial registration of active body
if(null!=newValue&&!this.__imported){this.__imported=!0;// see what's inside of this, in a template tag
let children=this.queryEffectiveChildren("template");// convert this template content into the real thing
// this helps with correctly preserving everything on the way down
if(typeof children!==typeof void 0){newValue.importContent(children.innerHTML)}}},/**
   * Calculate if we have anywhere to redirect to.
   */_computeRedirectOnSave:function(redirectLocation){if(typeof redirectLocation!==typeof void 0){return!0}return!1},/**
   * Break the shadow root for this element (by design)
   */_attachDom(dom){this.appendChild(dom)},/**
   * Set certain data bound values to the store once it's ready
   */_noticeTagChanges:function(allowedTags,hideExportButton,hidePanelOps,hidePreferencesButton,align,bodyOffsetLeft){if(window.HaxStore.ready){// double check because this can cause issues
if(allowedTags){window.HaxStore.instance.validTagList=allowedTags}window.HaxStore.instance.haxPanel.hideExportButton=hideExportButton;window.HaxStore.instance.haxPanel.hidePanelOps=hidePanelOps;window.HaxStore.instance.haxPanel.hidePreferencesButton=hidePreferencesButton;window.HaxStore.instance.haxPanel.align=align;window.HaxStore.instance.activeHaxBody.contextOffsetLeft=bodyOffsetLeft}},/**
   * Set certain data bound values to the store once it's ready
   */_storeReady:function(e){// trigger the update of different parts of the global state
this._noticeTagChanges(this.allowedTags,this.hideExportButton,this.hidePanelOps,this.hidePreferencesButton,this.align,this.bodyOffsetLeft)},/**
   * Created life cycle
   */created:function(){window.addEventListener("hax-store-property-updated",this._haxStorePropertyUpdated.bind(this));window.addEventListener("hax-store-ready",this._storeReady.bind(this))},/**
   * detached life cycle
   */detached:function(){window.removeEventListener("hax-store-ready",this._storeReady.bind(this));window.removeEventListener("hax-save",this._saveFired.bind(this))},/**
   * Attached to the DOM; now we can fire event to the store that
   * we exist and are the thing being edited.
   */attached:function(){window.SimpleToast.requestAvailability();this.__lock=!1;window.addEventListener("hax-save",this._saveFired.bind(this));// open things by default and set state for edit mode
if(this.openDefault){window.HaxStore.write("editMode",!0,this)}// notice ANY change to body and bubble up, only when we are attached though
if(this.syncBody){FlattenedNodesObserver(window.HaxStore.instance.activeHaxBody,info=>{if(!this.__lock){this.__lock=!0;this.fire("hax-body-content-changed",window.HaxStore.instance.activeHaxBody.haxToContent());setTimeout(()=>{this.__lock=!1},100)}})}},/**
   * Store updated, sync.
   */_haxStorePropertyUpdated:function(e){if(e.detail&&typeof e.detail.value!==typeof void 0&&e.detail.property){if("object"===typeof e.detail.value){this.set(e.detail.property,null)}this.set(e.detail.property,e.detail.value);this.notifyPath(e.detail.property)}},/**
   * _saveFired
   */_saveFired:function(e){// generate sanitized content
this.updatePageData=window.HaxStore.instance.activeHaxBody.haxToContent();// send the request
this.$.pageupdateajax.generateRequest()},/**
   * _handleUpdateResponse
   */_handleUpdateResponse:function(e){if(!this.hideMessage){const evt=new CustomEvent("simple-toast-show",{bubbles:!0,cancelable:!0,detail:{text:"Saved!",duration:3e3}});this.dispatchEvent(evt);// support auto redirecting on save if that's been requested
// in the integration point
if(this.redirectOnSave){setTimeout(()=>{// toggle so state is correct when we go to save
window.HaxStore.instance.haxPanel.toggle();// trigger redirect
window.location=this.redirectLocation},1e3)}}}});export{CmsHax};