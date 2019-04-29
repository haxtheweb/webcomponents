define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./lib/shadows-safari.js","./node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js","./node_modules/@polymer/iron-icon/iron-icon.js","./node_modules/@polymer/iron-icons/iron-icons.js","./node_modules/@polymer/iron-icons/editor-icons.js","./node_modules/@lrnwebcomponents/json-outline-schema/json-outline-schema.js"],function(_exports,_polymerElement,_shadowsSafari,_ironA11yKeys,_ironIcon,_ironIcons,_editorIcons,_jsonOutlineSchema){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.EditableOutline=void 0;function _templateObject_d12650c06a8311e99fb0f73d4db8eb88(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n  font-family: 'Noto Serif', serif;\n}\n\n:host([hidden]) {\n  display: none;\n}\n\n.button-wrapper {\n  background-color: white;\n  position: absolute;\n  display: block;\n  justify-content: space-evenly;\n  @apply --editable-outline-button-wrapper;\n}\n@media (max-width: 1000px) {\n  .button-wrapper {\n    position: relative;\n    @apply --editable-outline-button-wrapper-mobile;\n  }\n}\nbutton {\n  height: 32px;\n  font-size: 10px;\n  margin: 0;\n  padding: 0 8px;\n}\n\n#outline {\n  padding-top: 44px;\n  margin: 0;\n}\nul, ol {\n  font-size: 16px;\n  line-height: 32px;\n  padding-left: 32px;\n  @apply --editable-outline-button-list;\n}\nli {\n  font-size: 16px;\n  line-height: 32px;\n  padding: 4px;\n  @apply --editable-outline-button-list-item;\n}\n\nli:focus,\nli:active,\nli:hover {\n  background-color: #EEEEEE;\n  outline: 1px solid #CCCCCC;\n  @apply --editable-outline-button-list-item-active;\n}\n\niron-icon {\n  pointer-events: none;\n}</style>\n<div class=\"button-wrapper\">\n<button on-click=\"buttonEvents\" id=\"down\">\n  <iron-icon icon=\"icons:arrow-downward\"></iron-icon> Move down\n</button>\n<button on-click=\"buttonEvents\" id=\"up\">\n  <iron-icon icon=\"icons:arrow-upward\"></iron-icon> Move up\n</button>\n<button on-click=\"buttonEvents\" id=\"outdent\">\n  <iron-icon icon=\"editor:format-indent-decrease\"></iron-icon> Outdent\n</button>\n<button on-click=\"buttonEvents\" id=\"indent\">\n  <iron-icon icon=\"editor:format-indent-increase\"></iron-icon> Indent\n</button>\n<button on-click=\"buttonEvents\" id=\"duplicate\">\n  <iron-icon icon=\"icons:content-copy\"></iron-icon> Duplicate\n</button>\n</div>\n<ul id=\"outline\" contenteditable$=\"[[editMode]]\">\n  <li contenteditable=\"true\"></li>\n</ul>\n\n<iron-a11y-keys target=\"[[__outlineNode]]\" keys=\"shift+tab\" on-keys-pressed=\"_tabBackKeyPressed\"\n  stop-keyboard-event-propagation></iron-a11y-keys>\n<iron-a11y-keys target=\"[[__outlineNode]]\" keys=\"tab\" on-keys-pressed=\"_tabKeyPressed\"\n  stop-keyboard-event-propagation></iron-a11y-keys>"]);_templateObject_d12650c06a8311e99fb0f73d4db8eb88=function _templateObject_d12650c06a8311e99fb0f73d4db8eb88(){return data};return data}/**
 * `editable-outline`
 * `a simple outline thats contenteditable in nature`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var EditableOutline=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(EditableOutline,_PolymerElement);babelHelpers.createClass(EditableOutline,null,[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_d12650c06a8311e99fb0f73d4db8eb88())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{/**
   * A items list of JSON Outline Schema Items
   */items:{name:"items",type:"Array",value:[],notify:!0},/**
   * Edit mode
   */editMode:{name:"editMode",type:"Boolean",notify:!0,observer:"_editModeChanged"},/**
   * Outline node for keyboard key binding
   */__outlineNode:{name:"__outlineNode",type:"Object"}}}}]);function EditableOutline(){var _this;babelHelpers.classCallCheck(this,EditableOutline);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(EditableOutline).call(this));_this.polyfillSafe=_this.__computePolyfillSafe();window.JSONOutlineSchema.requestAvailability();return _this}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */babelHelpers.createClass(EditableOutline,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(EditableOutline.prototype),"connectedCallback",this).call(this);this.__outlineNode=this.$.outline;this._observer=new MutationObserver(this._observer.bind(this));this._observer.observe(this.__outlineNode,{childList:!0,subtree:!0})}/**
   * Mutation observer callback
   * @todo current issue if you copy and paste into the same node
   */},{key:"_observer",value:function _observer(record){var _this2=this,reference;for(var index in record){var info=record[index];if(0<info.removedNodes.length&&this.__outdent){for(var i in info.removedNodes){if(reference&&info.removedNodes[i].tagName&&"LI"===info.removedNodes[i].tagName&&null!==info.removedNodes[i].getAttribute("data-jos-id")){reference.setAttribute("data-jos-id",info.removedNodes[i].getAttribute("data-jos-id"));if(null!==info.removedNodes[i].getAttribute("data-jos-location")){reference.setAttribute("data-jos-location",info.removedNodes[i].getAttribute("data-jos-location"))}reference=null}else if("UL"===info.removedNodes[i].tagName&&info.removedNodes[i].firstChild&&"LI"===info.removedNodes[i].firstChild.tagName&&null!==info.removedNodes[i].firstChild.getAttribute("data-jos-id")){reference.setAttribute("data-jos-id",info.removedNodes[i].firstChild.getAttribute("data-jos-id"));if(null!==info.removedNodes[i].firstChild.getAttribute("data-jos-location")){reference.setAttribute("data-jos-location",info.removedNodes[i].firstChild.getAttribute("data-jos-location"))}reference=null}}// ensure there's always a first child node present
// this way people can't break the interact via mass deleting
if(!this.$.outline.firstChild){this.$.outline.appendChild(document.createElement("li"))}}// if we've got new nodes to react to that were not imported
if(0<info.addedNodes.length){// special rules for an outdent event
if(this.__outdent){for(var _i in info.addedNodes){if(info.addedNodes[_i].tagName&&"LI"===info.addedNodes[_i].tagName){reference=info.addedNodes[_i]}}}else if(!this.__blockScrub){for(var _i2 in info.addedNodes){if(info.addedNodes[_i2].tagName){// @todo need to ensure that this isn't the same exact item in the same exact position
window.JSONOutlineSchema.requestAvailability().scrubElementJOSData(info.addedNodes[_i2])}}}}}setTimeout(function(){_this2.__blockScrub=!1;_this2.__outdent=!1;_this2.__indent=!1},100)}/**
   * Disconnected life cycle
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(EditableOutline.prototype),"disconnectedCallback",this).call(this)}// Observer editMode for changes
},{key:"_editModeChanged",value:function _editModeChanged(newValue,oldValue){if(babelHelpers.typeof(newValue)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){}}/**
   * Button events internally
   */},{key:"buttonEvents",value:function buttonEvents(e){switch(e.target.id){case"indent":this._indent();break;case"outdent":this._outdent();break;case"up":this._move("up");break;case"down":this._move("down");break;case"duplicate":this._duplicate();break;}}/**
   * Duplicate whatever has selection
   */},{key:"_duplicate",value:function _duplicate(){// get active item from where cursor is
try{var range=this.getDeepRange();if(babelHelpers.typeof(range.commonAncestorContainer)===("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){return}var activeItem=range.commonAncestorContainer;if(null===activeItem||babelHelpers.typeof(activeItem)===("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))||babelHelpers.typeof(activeItem.tagName)===("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){activeItem=activeItem.parentNode}if(activeItem){// clone the item's hierarchy as well
if(null!==activeItem.nextElementSibling&&"UL"===activeItem.nextElementSibling.tagName){// copy the UL and all children and insert it after the UL it's duplicating
var clone2=activeItem.nextElementSibling.cloneNode(!0);activeItem.parentNode.insertBefore(clone2,activeItem.nextElementSibling.nextElementSibling);// clone the LI, placing it before the UL we just made
var clone=activeItem.cloneNode(!0);activeItem.parentNode.insertBefore(clone,activeItem.nextElementSibling.nextElementSibling)}else{var _clone=activeItem.cloneNode(!0);// insert the clone AFTER the current selection
activeItem.parentNode.insertBefore(_clone,activeItem.nextElementSibling)}}}catch(e){console.log(e)}}/**
   * Move whatever has selection up or down
   */},{key:"_move",value:function _move(direction){// get active item from where cursor is
try{var range=this.getDeepRange();if(babelHelpers.typeof(range.commonAncestorContainer)===("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){return}var activeItem=range.commonAncestorContainer;if(null===activeItem||babelHelpers.typeof(activeItem)===("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))||babelHelpers.typeof(activeItem.tagName)===("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){activeItem=activeItem.parentNode}var test=activeItem,valid=!1;// ensure this operation is executed in scope
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
   */},{key:"importJsonOutlineSchemaItems",value:function importJsonOutlineSchemaItems(){this.__blockScrub=!0;// wipe out the outline
while(null!==this.$.outline.firstChild){this.$.outline.removeChild(this.$.outline.firstChild)}if(0===this.items.length){// get from JOS items if we have none currently
this.set("items",window.JSONOutlineSchema.requestAvailability().items)}var outline=window.JSONOutlineSchema.requestAvailability().itemsToNodes(this.items);// rebuild the outline w/ children we just found
while(null!==outline.firstChild){this.__blockScrub=!0;this.$.outline.appendChild(outline.firstChild)}return outline}/**
   * Take what's currently in the area and get JSON Outline Schema; optionally save
   */},{key:"exportJsonOutlineSchemaItems",value:function exportJsonOutlineSchemaItems(){var save=0<arguments.length&&arguments[0]!==void 0?arguments[0]:!1;return window.JSONOutlineSchema.requestAvailability().nodesToItems(this.$.outline,save)}/**
   * Find the next thing to tab forward to.
   */},{key:"_tabKeyPressed",value:function _tabKeyPressed(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();if(e.detail.keyboardEvent){e.detail.keyboardEvent.preventDefault();e.detail.keyboardEvent.stopPropagation();e.detail.keyboardEvent.stopImmediatePropagation()}try{this._indent()}catch(e){}}},{key:"_indent",value:function _indent(){if(this.polyfillSafe){this.__indent=!0;this.__blockScrub=!0;document.execCommand("indent")}}/**
   * Move back through things when tab back pressed
   */},{key:"_tabBackKeyPressed",value:function _tabBackKeyPressed(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();if(e.detail.keyboardEvent){e.detail.keyboardEvent.preventDefault();e.detail.keyboardEvent.stopPropagation();e.detail.keyboardEvent.stopImmediatePropagation()}// try selection / tab block since range can cause issues
try{this._outdent()}catch(e){}}},{key:"_outdent",value:function _outdent(){if(this.polyfillSafe){this.__outdent=!0;this.__blockScrub=!0;document.execCommand("outdent")}}/**
   * Selection normalizer
   */},{key:"getDeepSelection",value:function getDeepSelection(){// try and obtain the selection from the nearest shadow
// which would give us the selection object when running native ShadowDOM
// with fallback support for the entire window which would imply Shady
// native API
if(this.shadowRoot.getSelection){return this.shadowRoot.getSelection()}// ponyfill from google
else if((0,_shadowsSafari.getRange)(this.$.outline.parentNode)){return(0,_shadowsSafari.getRange)(this.$.outline.parentNode)}// missed on both, hope the normal one will work
return window.getSelection()}/**
   * Get a normalized range based on current selection
   */},{key:"getDeepRange",value:function getDeepRange(){var sel=this.getDeepSelection();if(sel.getRangeAt&&sel.rangeCount){return sel.getRangeAt(0)}else if(sel){return sel}else!1}/**
   * These are our bad actors in polyfill'ed browsers.
   * This means that https://github.com/webcomponents/webcomponentsjs/commit/ce464bb533bf39b544c312906499a6044ee0d30d
   * explains things but basically if shadow-dom is polyfilled
   * then we can't safely execute a DOM manipulating execCommand.
   * This
   */},{key:"__computePolyfillSafe",value:function __computePolyfillSafe(){if(document.head.createShadowRoot||document.head.attachShadow){return!0}else{console.log("Shadow DOM missing, certain operations hidden");return!1}}}],[{key:"tag",get:function get(){return"editable-outline"}}]);return EditableOutline}(_polymerElement.PolymerElement);_exports.EditableOutline=EditableOutline;window.customElements.define(EditableOutline.tag,EditableOutline)});