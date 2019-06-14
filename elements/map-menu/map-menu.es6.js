/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{afterNextRender}from"./node_modules/@polymer/polymer/lib/utils/render-status.js";import"./node_modules/@lrnwebcomponents/smooth-scroll/smooth-scroll.js";import"./node_modules/@lrnwebcomponents/map-menu/lib/map-menu-builder.js";/**
 * `map-menu`
 * `A series of elements that generate a hierarchical menu`
 *
 * @demo demo/index.html
 */class MapMenu extends PolymerElement{constructor(){super();import("./node_modules/@lrnwebcomponents/map-menu/lib/map-menu-container.js")}static get template(){return html`
      <style>
        :host {
          --map-menu-active-color: rgba(0, 0, 0, 0.1);
          display: block;
          overflow-y: scroll;
          position: relative;
          height: 100%;
        }

        #activeIndicator {
          background: var(--map-menu-active-color);
          transition: all 0.3s ease-in-out;
          position: absolute;
          @apply --map-menu-active-indicator;
        }

        map-menu-container {
          padding: 32px;
          @apply --map-menu-container;
        }

        /* turn default active color if indicator is on */
        :host([active-indicator]) map-menu-builder {
          --map-menu-active-color: transparent;
        }
      </style>
      <div id="itemslist">
        <map-menu-container>
          <div id="activeIndicator"></div>
          <map-menu-builder
            id="builder"
            items="[[items]]"
            selected="[[selected]]"
          ></map-menu-builder>
        </map-menu-container>
      </div>
      <smooth-scroll id="smoothScroll"></smooth-scroll>
    `}static get tag(){return"map-menu"}static get properties(){return{title:{type:String,value:"Content Outline"},data:{type:Array,value:null},/**
       * Support for JSON Outline Schema manifest format
       */manifest:{type:Object,notify:!0,observer:"_manifestChanged"},items:{type:Array,value:null,notify:!0},/**
       * Current selected item.
       */selected:{type:String,notify:!0},/**
       * Auto scroll an active element if not in view
       */autoScroll:{type:Boolean,value:!1},/**
       * Show active indicator animation
       */activeIndicator:{type:Boolean,value:!1}}}connectedCallback(){super.connectedCallback();afterNextRender(this,function(){this.addEventListener("link-clicked",this.__linkClickedHandler.bind(this));this.addEventListener("toggle-updated",this.__toggleUpdated.bind(this));this.addEventListener("active-item",this.__activeItemHandler.bind(this));this.addEventListener("map-meu-item-hidden-check",this._mapMeuItemHiddenCheckHandler.bind(this))})}disconnectedCallback(){this.removeEventListener("link-clicked",this.__linkClickedHandler.bind(this));this.removeEventListener("toggle-updated",this.__toggleUpdated.bind(this));this.removeEventListener("active-item",this.__activeItemHandler.bind(this));this.removeEventListener("map-meu-item-hidden-check",this._mapMeuItemHiddenCheckHandler.bind(this));super.disconnectedCallback()}static get observers(){return["_dataChanged(data)"]}__activeItemHandler(e){const target=e.detail;this.refreshActiveChildren(target)}_mapMeuItemHiddenCheckHandler(e){const action=e.detail.action,target=e.detail.target,hiddenChild=e.detail.hiddenChild;if("closed"===action&&!0===hiddenChild){this.__updateActiveIndicator(this._activeItem,200,!0)}else{this.__updateActiveIndicator(this._activeItem,200,!1)}}/**
   * Set and unset active properties on children
   * @param {string} activeItem
   * @param {number} timeoutTime
   */refreshActiveChildren(activeItem,timeoutTime=200){const oldActiveItem=this._activeItem,newActiveItem=activeItem;if(newActiveItem&&""!==newActiveItem){// set the new active attribute to the item
newActiveItem.setAttribute("active",!0);// move the highlight thingy
if(this.activeIndicator){this.__updateActiveIndicator(newActiveItem,timeoutTime)}// if auto scroll enabled then scroll element into view
if(this.autoScroll){// kick off smooth scroll
this.$.smoothScroll.scroll(newActiveItem,{duration:300,scrollElement:this})}}if(oldActiveItem){oldActiveItem.removeAttribute("active");this.__updateActiveIndicator(newActiveItem,timeoutTime)}this._activeItem=newActiveItem}_manifestChanged(newValue,oldValue){if(newValue){this.set("data",newValue.items)}}/**
   * Set data property
   */setData(data){this.set("data",[]);this.set("data",data)}/**
   * Convert data from a linear array
   * to a nested array for template rendering
   */_dataChanged(data){const items=[];if(!data)return;// find parents
data.forEach(element=>{// find top level parents
if(!element.parent){items.push(element)}});// Recursively find and set children
items.forEach((item,i)=>{this._setChildren(item,data)});// Update items array
this.set("items",[]);this.set("items",items)}/**
   * Recursively search through a data to find children
   * of a specified item.
   * @param {object} item item of an array to search on. Passed by reference.
   * @param {array} data linear array of the data set.
   * @return {void}
   */_setChildren(item,data){// find all children
const children=data.filter(d=>item.id===d.parent);item.children=children;if(0<item.children.length){item.children.forEach(child=>{// recursively call itself
this._setChildren(child,data)})}}/**
   * Determine if a menu item has children
   */__hasChildren(item){return 0<item.children.length}/**
   * asdf
   */__linkClickedHandler(e){this.selected=e.detail.id;this.dispatchEvent(new CustomEvent("selected",{bubbles:!0,cancelable:!0,composed:!0,detail:e.detail.id}))}/**
   * When a user clicks the toggle button to collapse or
   * expand a submenu, this event gets triggered after
   * the animation has been triggered
   */__toggleUpdated(e){const action=e.detail.opened?"opened":"closed",target=e.path[0];if("undefined"!==typeof this._activeItem){this._activeItem.dispatchEvent(new CustomEvent("map-menu-item-hidden-check",{bubbles:!0,cancelable:!0,composed:!0,detail:Object.assign({},{action:action,target:target})}))}}/**
   * Find out if
   */__isInViewport(element){const scrollParent=this.__getScrollParent(element);if(!scrollParent)return!1;var elementTop=element.offsetTop,elementBottom=elementTop+element.offsetHeight,viewportTop=scrollParent.offsetTop,viewportBottom=viewportTop+scrollParent.offsetHeight;return elementBottom>viewportTop&&elementTop<viewportBottom}/**
   * Get scroll parent
   */__getScrollParent(node){if(null==node){return null}if(node.scrollHeight>node.clientHeight){return node}else{return this.__getScrollParent(node.parentNode)}}/**
   * Move the highlight widget over active element
   */__updateActiveIndicator(element,timeoutTime=200,hidden=!1){// run it through to set time just to let stuff set up
setTimeout(()=>{const activeIndicator=this.$.activeIndicator,left=element.offsetLeft,bottom=element.offsetBottom,top=element.offsetTop,width=element.offsetWidth,height=!hidden?element.offsetHeight:0;// if the height is zero then make the timeoutTime faster
timeoutTime=0<height?timeoutTime:10;activeIndicator.setAttribute("style",`width:${width}px;height:${height}px;top:${top}px;left:${left}px`)},timeoutTime)}/**
   * Find out if any parents of the item are collapsed
   */__parentsHidden(node){// get the parent node
const parent=node.parentNode;// bail if we have no node to work with
if(null==parent)return null;// if we found a submenu check if it is hidden
if("MAP-MENU-SUBMENU"===parent.tagName){// if open is set to false then we have
// found a hidden parent
if(!parent.opened)return!0}// wrap up and exit if we came all the way back to map-menu
if("MAP-MENU"===parent.tagName)return!1;// if we got all the way here then we need recursively run this
// against the parent node
return this.__parentsHidden(parent)}}window.customElements.define(MapMenu.tag,MapMenu);export{MapMenu};