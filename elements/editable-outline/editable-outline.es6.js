/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{getRange}from"./lib/shadows-safari.js";import"./node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js";import"./node_modules/@polymer/iron-icon/iron-icon.js";import"./node_modules/@polymer/iron-icons/iron-icons.js";import"./node_modules/@polymer/iron-icons/editor-icons.js";import"./node_modules/@lrnwebcomponents/json-outline-schema/json-outline-schema.js";/**
 * `editable-outline`
 * `a simple outline thats contenteditable in nature`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */class EditableOutline extends PolymerElement{// render function
static get template(){return html`
<style>:host {
  display: block;
  font-family: 'Noto Serif', serif;
}

:host([hidden]) {
  display: none;
}

.button-wrapper {
  background-color: white;
  position: absolute;
  display: block;
  justify-content: space-evenly;
  @apply --editable-outline-button-wrapper;
}
@media (max-width: 1000px) {
  .button-wrapper {
    position: relative;
    @apply --editable-outline-button-wrapper-mobile;
  }
}
button {
  height: 32px;
  font-size: 10px;
  margin: 0;
  padding: 0 8px;
}

#outline {
  padding-top: 44px;
  margin: 0;
}
ul, ol {
  font-size: 16px;
  line-height: 32px;
  padding-left: 32px;
  @apply --editable-outline-button-list;
}
li {
  font-size: 16px;
  line-height: 32px;
  padding: 4px;
  @apply --editable-outline-button-list-item;
}

li:focus,
li:active,
li:hover {
  background-color: #EEEEEE;
  outline: 1px solid #CCCCCC;
  @apply --editable-outline-button-list-item-active;
}

iron-icon {
  pointer-events: none;
}</style>
<div class="button-wrapper">
<button on-click="buttonEvents" id="down">
  <iron-icon icon="icons:arrow-downward"></iron-icon> Move down
</button>
<button on-click="buttonEvents" id="up">
  <iron-icon icon="icons:arrow-upward"></iron-icon> Move up
</button>
<button on-click="buttonEvents" id="outdent">
  <iron-icon icon="editor:format-indent-decrease"></iron-icon> Outdent
</button>
<button on-click="buttonEvents" id="indent">
  <iron-icon icon="editor:format-indent-increase"></iron-icon> Indent
</button>
<button on-click="buttonEvents" id="duplicate">
  <iron-icon icon="icons:content-copy"></iron-icon> Duplicate
</button>
</div>
<ul id="outline" contenteditable$="[[editMode]]">
  <li contenteditable="true"></li>
</ul>

<iron-a11y-keys target="[[__outlineNode]]" keys="shift+tab" on-keys-pressed="_tabBackKeyPressed"
  stop-keyboard-event-propagation></iron-a11y-keys>
<iron-a11y-keys target="[[__outlineNode]]" keys="tab" on-keys-pressed="_tabKeyPressed"
  stop-keyboard-event-propagation></iron-a11y-keys>`}// properties available to the custom element for data binding
static get properties(){let props={/**
   * A items list of JSON Outline Schema Items
   */items:{name:"items",type:Array,value:[],notify:!0},/**
   * Edit mode
   */editMode:{name:"editMode",type:Boolean,notify:!0,observer:"_editModeChanged"},/**
   * Outline node for keyboard key binding
   */__outlineNode:{name:"__outlineNode",type:Object}};if(super.properties){props=Object.assign(props,super.properties)}return props}constructor(){super();this.polyfillSafe=this.__computePolyfillSafe();window.JSONOutlineSchema.requestAvailability()}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */static get tag(){return"editable-outline"}/**
   * life cycle, element is afixed to the DOM
   */connectedCallback(){super.connectedCallback();this.__outlineNode=this.$.outline;this._observer=new MutationObserver(this._observer.bind(this));this._observer.observe(this.__outlineNode,{childList:!0,subtree:!0})}/**
   * Mutation observer callback
   * @todo current issue if you copy and paste into the same node
   */_observer(record){let reference;for(var index in record){let info=record[index];if(0<info.removedNodes.length&&this.__outdent){for(let i in info.removedNodes){if(reference&&info.removedNodes[i].tagName&&"LI"===info.removedNodes[i].tagName&&null!==info.removedNodes[i].getAttribute("data-jos-id")){reference.setAttribute("data-jos-id",info.removedNodes[i].getAttribute("data-jos-id"));if(null!==info.removedNodes[i].getAttribute("data-jos-location")){reference.setAttribute("data-jos-location",info.removedNodes[i].getAttribute("data-jos-location"))}reference=null}else if("UL"===info.removedNodes[i].tagName&&info.removedNodes[i].firstChild&&"LI"===info.removedNodes[i].firstChild.tagName&&null!==info.removedNodes[i].firstChild.getAttribute("data-jos-id")){reference.setAttribute("data-jos-id",info.removedNodes[i].firstChild.getAttribute("data-jos-id"));if(null!==info.removedNodes[i].firstChild.getAttribute("data-jos-location")){reference.setAttribute("data-jos-location",info.removedNodes[i].firstChild.getAttribute("data-jos-location"))}reference=null}}// ensure there's always a first child node present
// this way people can't break the interact via mass deleting
if(!this.$.outline.firstChild){this.$.outline.appendChild(document.createElement("li"))}}// if we've got new nodes to react to that were not imported
if(0<info.addedNodes.length){// special rules for an outdent event
if(this.__outdent){for(let i in info.addedNodes){if(info.addedNodes[i].tagName&&"LI"===info.addedNodes[i].tagName){reference=info.addedNodes[i]}}}else if(!this.__blockScrub){for(let i in info.addedNodes){if(info.addedNodes[i].tagName){// @todo need to ensure that this isn't the same exact item in the same exact position
window.JSONOutlineSchema.requestAvailability().scrubElementJOSData(info.addedNodes[i])}}}}}setTimeout(()=>{this.__blockScrub=!1;this.__outdent=!1;this.__indent=!1},100)}/**
   * Disconnected life cycle
   */disconnectedCallback(){super.disconnectedCallback()}// Observer editMode for changes
_editModeChanged(newValue,oldValue){if(typeof newValue!==typeof void 0){}}/**
   * Button events internally
   */buttonEvents(e){switch(e.target.id){case"indent":this._indent();break;case"outdent":this._outdent();break;case"up":this._move("up");break;case"down":this._move("down");break;case"duplicate":this._duplicate();break;}}/**
   * Duplicate whatever has selection
   */_duplicate(){// get active item from where cursor is
try{let range=this.getDeepRange();if(typeof range.commonAncestorContainer===typeof void 0){return}let activeItem=range.commonAncestorContainer;if(null===activeItem||typeof activeItem===typeof void 0||typeof activeItem.tagName===typeof void 0){activeItem=activeItem.parentNode}if(activeItem){// clone the item's hierarchy as well
if(null!==activeItem.nextElementSibling&&"UL"===activeItem.nextElementSibling.tagName){// copy the UL and all children and insert it after the UL it's duplicating
const clone2=activeItem.nextElementSibling.cloneNode(!0);activeItem.parentNode.insertBefore(clone2,activeItem.nextElementSibling.nextElementSibling);// clone the LI, placing it before the UL we just made
const clone=activeItem.cloneNode(!0);activeItem.parentNode.insertBefore(clone,activeItem.nextElementSibling.nextElementSibling)}else{const clone=activeItem.cloneNode(!0);// insert the clone AFTER the current selection
activeItem.parentNode.insertBefore(clone,activeItem.nextElementSibling)}}}catch(e){console.log(e)}}/**
   * Move whatever has selection up or down
   */_move(direction){// get active item from where cursor is
try{let range=this.getDeepRange();if(typeof range.commonAncestorContainer===typeof void 0){return}let activeItem=range.commonAncestorContainer;if(null===activeItem||typeof activeItem===typeof void 0||typeof activeItem.tagName===typeof void 0){activeItem=activeItem.parentNode}let test=activeItem,valid=!1;// ensure this operation is executed in scope
while(!valid&&test.parentNode){if("outline"===test.id){valid=!0}test=test.parentNode}// ensure from all that, we have something
if(valid&&activeItem){// move the things above us, below us
if("up"===direction){// ensure there's something above us
if(null!==activeItem.previousElementSibling){// see if we are moving us, or us and the hierarchy
if(activeItem.nextElementSibling&&"UL"===activeItem.nextElementSibling.tagName){// see if the thing we have to move above has it's own structure
if("UL"===activeItem.previousElementSibling.tagName){// ensure we don't lose our metadata
this.__blockScrub=!0;// insert the element currently above us, just before 2 places back; so behind our UL
activeItem.parentNode.insertBefore(activeItem.previousElementSibling,activeItem.nextElementSibling.nextElementSibling)}this.__blockScrub=!0;// now insert the LI above us, 2 places back so it is in front of the UL
activeItem.parentNode.insertBefore(activeItem.previousElementSibling,activeItem.nextElementSibling.nextElementSibling);activeItem.focus()}else{// easier use case, we are moving ourselves only but above us is a UL
if("UL"===activeItem.previousElementSibling.tagName){this.__blockScrub=!0;// move the UL after us
activeItem.parentNode.insertBefore(activeItem.previousElementSibling,activeItem.nextElementSibling)}this.__blockScrub=!0;// now move the LI after us
activeItem.parentNode.insertBefore(activeItem.previousElementSibling,activeItem.nextElementSibling);activeItem.focus()}}}else if("down"===direction){// if nothing after us, we can't move
if(null!==activeItem.nextElementSibling){// account for having to hop over children
if(activeItem.nextElementSibling&&"UL"===activeItem.nextElementSibling.tagName&&null!==activeItem.nextElementSibling.nextElementSibling){// an outline is just below us
if("LI"===activeItem.nextElementSibling.nextElementSibling.tagName&&null!==activeItem.nextElementSibling.nextElementSibling.nextElementSibling&&"UL"===activeItem.nextElementSibling.nextElementSibling.nextElementSibling.tagName){this.__blockScrub=!0;// move the thing 2 down to just before us; so the UL
activeItem.parentNode.insertBefore(activeItem.nextElementSibling.nextElementSibling,activeItem)}this.__blockScrub=!0;// now move the LI that is 2 below us just above us
activeItem.parentNode.insertBefore(activeItem.nextElementSibling.nextElementSibling,activeItem);activeItem.focus()}else if("LI"===activeItem.nextElementSibling.tagName){// just moving 1 tag, see if we need to move 2 things about us or 1
if(null!==activeItem.nextElementSibling.nextElementSibling&&"UL"===activeItem.nextElementSibling.nextElementSibling.tagName){this.__blockScrub=!0;activeItem.parentNode.insertBefore(activeItem.nextElementSibling,activeItem)}this.__blockScrub=!0;// work on the LI
activeItem.parentNode.insertBefore(activeItem.nextElementSibling,activeItem);activeItem.focus()}}}}}catch(e){console.log(e)}}/**
   * Take the current manifest and import it into an HTML outline
   */importJsonOutlineSchemaItems(){this.__blockScrub=!0;// wipe out the outline
while(null!==this.$.outline.firstChild){this.$.outline.removeChild(this.$.outline.firstChild)}if(0===this.items.length){// get from JOS items if we have none currently
this.set("items",window.JSONOutlineSchema.requestAvailability().items)}let outline=window.JSONOutlineSchema.requestAvailability().itemsToNodes(this.items);// rebuild the outline w/ children we just found
while(null!==outline.firstChild){this.__blockScrub=!0;this.$.outline.appendChild(outline.firstChild)}return outline}/**
   * Take what's currently in the area and get JSON Outline Schema; optionally save
   */exportJsonOutlineSchemaItems(save=!1){return window.JSONOutlineSchema.requestAvailability().nodesToItems(this.$.outline,save)}/**
   * Find the next thing to tab forward to.
   */_tabKeyPressed(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();if(e.detail.keyboardEvent){e.detail.keyboardEvent.preventDefault();e.detail.keyboardEvent.stopPropagation();e.detail.keyboardEvent.stopImmediatePropagation()}try{this._indent()}catch(e){}}_indent(){if(this.polyfillSafe){this.__indent=!0;this.__blockScrub=!0;document.execCommand("indent")}}/**
   * Move back through things when tab back pressed
   */_tabBackKeyPressed(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();if(e.detail.keyboardEvent){e.detail.keyboardEvent.preventDefault();e.detail.keyboardEvent.stopPropagation();e.detail.keyboardEvent.stopImmediatePropagation()}// try selection / tab block since range can cause issues
try{this._outdent()}catch(e){}}_outdent(){if(this.polyfillSafe){this.__outdent=!0;this.__blockScrub=!0;document.execCommand("outdent")}}/**
   * Selection normalizer
   */getDeepSelection(){// try and obtain the selection from the nearest shadow
// which would give us the selection object when running native ShadowDOM
// with fallback support for the entire window which would imply Shady
// native API
if(this.shadowRoot.getSelection){return this.shadowRoot.getSelection()}// ponyfill from google
else if(getRange(this.$.outline.parentNode)){return getRange(this.$.outline.parentNode)}// missed on both, hope the normal one will work
return window.getSelection()}/**
   * Get a normalized range based on current selection
   */getDeepRange(){let sel=this.getDeepSelection();if(sel.getRangeAt&&sel.rangeCount){return sel.getRangeAt(0)}else if(sel){return sel}else!1}/**
   * These are our bad actors in polyfill'ed browsers.
   * This means that https://github.com/webcomponents/webcomponentsjs/commit/ce464bb533bf39b544c312906499a6044ee0d30d
   * explains things but basically if shadow-dom is polyfilled
   * then we can't safely execute a DOM manipulating execCommand.
   * This
   */__computePolyfillSafe(){if(document.head.createShadowRoot||document.head.attachShadow){return!0}else{console.log("Shadow DOM missing, certain operations hidden");return!1}}}window.customElements.define(EditableOutline.tag,EditableOutline);export{EditableOutline};