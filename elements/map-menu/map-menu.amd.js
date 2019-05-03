define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js","./node_modules/@lrnwebcomponents/smooth-scroll/smooth-scroll.js","./lib/map-menu-container.js","./lib/map-menu-builder.js"],function(_exports,_polymerLegacy,_smoothScroll,_mapMenuContainer,_mapMenuBuilder){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.MapMenu=void 0;function _templateObject_17ab87706a8611e9a41f837bef90b21f(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        --map-menu-active-color: rgba(0, 0, 0, 0.1);\n        display: block;\n        overflow-y: scroll;\n        position: relative;\n        height: 100%;\n      }\n\n      #activeIndicator {\n        background: var(--map-menu-active-color);\n        transition: all 0.3s ease-in-out;\n        position: absolute;\n        @apply --map-menu-active-indicator;\n      }\n\n      map-menu-container {\n        padding: 32px;\n        @apply --map-menu-container;\n      }\n\n      /* turn default active color if indicator is on */\n      :host([active-indicator]) map-menu-builder {\n        --map-menu-active-color: transparent;\n      }\n    </style>\n    <div id=\"itemslist\">\n      <map-menu-container>\n        <div id=\"activeIndicator\"></div>\n        <map-menu-builder\n          id=\"builder\"\n          items=\"[[items]]\"\n          selected=\"[[selected]]\"\n        ></map-menu-builder>\n      </map-menu-container>\n    </div>\n    <smooth-scroll id=\"smoothScroll\"></smooth-scroll>\n  "]);_templateObject_17ab87706a8611e9a41f837bef90b21f=function _templateObject_17ab87706a8611e9a41f837bef90b21f(){return data};return data}/**
 * `map-menu`
 * `A series of elements that generate a hierarchical menu`
 *
 * @demo demo/index.html
 */var MapMenu=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_17ab87706a8611e9a41f837bef90b21f()),is:"map-menu",properties:{title:{type:String,value:"Content Outline"},data:{type:Array,value:null},/**
     * Support for JSON Outline Schema manifest format
     */manifest:{type:Object,notify:!0,observer:"_manifestChanged"},items:{type:Array,value:null,notify:!0},/**
     * Current selected item.
     */selected:{type:String,notify:!0},/**
     * Auto scroll an active element if not in view
     */autoScroll:{type:Boolean,value:!1},/**
     * Show active indicator animation
     */activeIndicator:{type:Boolean,value:!1}},observers:["_dataChanged(data)"],listeners:{"link-clicked":"__linkClickedHandler","toggle-updated":"__toggleUpdated","active-item":"__activeItemHandler","map-meu-item-hidden-check":"_mapMeuItemHiddenCheckHandler"},__activeItemHandler:function __activeItemHandler(e){var target=e.detail;this.refreshActiveChildren(target)},_mapMeuItemHiddenCheckHandler:function _mapMeuItemHiddenCheckHandler(e){var action=e.detail.action,target=e.detail.target,hiddenChild=e.detail.hiddenChild;if("closed"===action&&!0===hiddenChild){this.__updateActiveIndicator(this._activeItem,200,!0)}else{this.__updateActiveIndicator(this._activeItem,200,!1)}},/**
   * Set and unset active properties on children
   * @param {string} activeItem
   * @param {number} timeoutTime
   */refreshActiveChildren:function refreshActiveChildren(activeItem){var timeoutTime=1<arguments.length&&arguments[1]!==void 0?arguments[1]:200,oldActiveItem=this._activeItem,newActiveItem=activeItem;if(newActiveItem&&""!==newActiveItem){// set the new active attribute to the item
newActiveItem.setAttribute("active",!0);// move the highlight thingy
if(this.activeIndicator){this.__updateActiveIndicator(newActiveItem,timeoutTime)}// if auto scroll enabled then scroll element into view
if(this.autoScroll){// kick off smooth scroll
this.$.smoothScroll.scroll(newActiveItem,{duration:300,scrollElement:this})}}if(oldActiveItem){oldActiveItem.removeAttribute("active");this.__updateActiveIndicator(newActiveItem,timeoutTime)}this._activeItem=newActiveItem},_manifestChanged:function _manifestChanged(newValue,oldValue){if(newValue){this.set("data",newValue.items)}},/**
   * Set data property
   */setData:function setData(data){this.set("data",[]);this.set("data",data)},/**
   * Convert data from a linear array
   * to a nested array for template rendering
   */_dataChanged:function _dataChanged(data){var _this=this,items=[];if(!data)return;// find parents
data.forEach(function(element){// find top level parents
if(!element.parent){items.push(element)}});// Recursively find and set children
items.forEach(function(item,i){_this._setChildren(item,data)});// Update items array
this.set("items",[]);this.set("items",items)},/**
   * Recursively search through a data to find children
   * of a specified item.
   * @param {object} item item of an array to search on. Passed by reference.
   * @param {array} data linear array of the data set.
   * @return {void}
   */_setChildren:function _setChildren(item,data){var _this2=this,children=data.filter(function(d){return item.id===d.parent});item.children=children;if(0<item.children.length){item.children.forEach(function(child){// recursively call itself
_this2._setChildren(child,data)})}},/**
   * Determine if a menu item has children
   */__hasChildren:function __hasChildren(item){return 0<item.children.length},/**
   * asdf
   */__linkClickedHandler:function __linkClickedHandler(e){this.selected=e.detail.id;this.fire("selected",e.detail.id)},/**
   * When a user clicks the toggle button to collapse or
   * expand a submenu, this event gets triggered after
   * the animation has been triggered
   */__toggleUpdated:function __toggleUpdated(e){var action=e.detail.opened?"opened":"closed",target=e.path[0];if("undefined"!==typeof this._activeItem){this._activeItem.fire("map-menu-item-hidden-check",Object.assign({},{action:action,target:target}))}},/**
   * Find out if
   */__isInViewport:function __isInViewport(element){var scrollParent=this.__getScrollParent(element);if(!scrollParent)return!1;var elementTop=element.offsetTop,elementBottom=elementTop+element.offsetHeight,viewportTop=scrollParent.offsetTop,viewportBottom=viewportTop+scrollParent.offsetHeight;return elementBottom>viewportTop&&elementTop<viewportBottom},/**
   * Get scroll parent
   */__getScrollParent:function __getScrollParent(node){if(null==node){return null}if(node.scrollHeight>node.clientHeight){return node}else{return this.__getScrollParent(node.parentNode)}},/**
   * Move the highlight widget over active element
   */__updateActiveIndicator:function __updateActiveIndicator(element){var _this3=this,timeoutTime=1<arguments.length&&arguments[1]!==void 0?arguments[1]:200,hidden=2<arguments.length&&arguments[2]!==void 0?arguments[2]:!1;// run it through to set time just to let stuff set up
setTimeout(function(){var activeIndicator=_this3.$.activeIndicator,left=element.offsetLeft,bottom=element.offsetBottom,top=element.offsetTop,width=element.offsetWidth,height=!hidden?element.offsetHeight:0;// if the height is zero then make the timeoutTime faster
timeoutTime=0<height?timeoutTime:10;activeIndicator.setAttribute("style","width:".concat(width,"px;height:").concat(height,"px;top:").concat(top,"px;left:").concat(left,"px"))},timeoutTime)},/**
   * Find out if any parents of the item are collapsed
   */__parentsHidden:function __parentsHidden(node){// get the parent node
var parent=node.parentNode;// bail if we have no node to work with
if(null==parent)return null;// if we found a submenu check if it is hidden
if("MAP-MENU-SUBMENU"===parent.tagName){// if open is set to false then we have
// found a hidden parent
if(!parent.opened)return!0}// wrap up and exit if we came all the way back to map-menu
if("MAP-MENU"===parent.tagName)return!1;// if we got all the way here then we need recursively run this
// against the parent node
return this.__parentsHidden(parent)}});_exports.MapMenu=MapMenu});