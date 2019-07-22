/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import{AbsolutePositionBehavior}from"./node_modules/@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js";/**
 * `simple-popover`
 * `A popover alertdialog that is positioned next to a target element`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */class SimplePopover extends AbsolutePositionBehavior{// render function
static get template(){return html`
<style>:host {
  --simple-popover-border-radius: 3px;
  --simple-popover-color: #222;
  --simple-popover-padding: 10px;
  --simple-popover-background-color: white;
  --simple-popover-border-color: #bbb;
  --simple-popover-box-shadow:rgba(60, 64, 67, 0.3) 0px 4px 8px 3px;
}
:host([hidden]) {
  display: none;
}
:host > div {
  display: flex;
  flex-direction: column-reverse;
  justify-content: stretch;
  z-index: 1;
}
:host([position="left"]) > div {
  justify-content: flex-start;
  flex-direction: row;
}
:host([position="right"]) > div {
  justify-content: flex-end;
  flex-direction: row-reverse;
}
:host([position="top"]) > div {
  flex-direction: column;
}
:host > div > * {
  width: 100%;
}
:host([position="left"]) > div > *, 
:host([position="right"]) > div > * {
  width: unset;
}
:host #content {
  margin: 0;
  padding: var(--simple-popover-padding);
  color: var(--simple-popover-color);
  background-color: var(--simple-popover-background-color);
  border: 1px solid var(--simple-popover-border-color);
  min-height: 20px;
  border-radius: var(--simple-popover-border-radius);
  box-shadow: var(--simple-popover-box-shadow);
  @apply --simple-popover-content;
}
:host #pointer-outer {
  margin: -1px;
}
:host #pointer {
  width: 20px;
  height: 20px;
  position: relative;
  overflow: hidden;
  flex: 0 0 20px;
}
:host #pointer:after {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: var(--simple-popover-background-color);
  border: 1px solid var(--simple-popover-border-color);
  transform: rotate(45deg); 
  top: 15px;
  left: 5px;
}
:host([position="top"]) #pointer:after {
  top: -5px;
  left: 5px;
} 
:host([position="right"]) #pointer:after {
  top: 5px;
  left: 15px;
} 
:host([position="left"]) #pointer:after {
  top: 5px;
  left: -5px;
}</style>
<div>
  <div id="content" role="alertdialog">
    <slot></slot>
  </div>
  <div id="pointer-outer">
    <div id="pointer" style$="[[__pointerOffSetStyle]]"></div>
  </div>
</div>`}// haxProperty definition
static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Simple popover",description:"A popover alertdialog that is positioned next to a target element",icon:"icons:android",color:"green",groups:["Popover"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"nikkimk",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[{property:"title",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"}],advanced:[]}}}// properties available to the custom element for data binding
static get properties(){let props={/**
   * Tthe margin styles to offset the pointer
   */__pointerOffSetStyle:{type:Object,computed:"_getMargins(__positions)"}};if(super.properties){props=Object.assign(props,super.properties)}return props}constructor(){super();this.offset=-10;this.fitToVisibleBounds=!0}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */static get tag(){return"simple-popover"}/**
   * life cycle, element is afixed to the DOM
   */connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setup(SimplePopover.haxProperties,SimplePopover.tag,this)}/**
   * sets pointer position based on popover and target middles
   *
   * @param {object} positions object that contains postions for popover and target
   * @returns {string} a string with margin styles to offset pointer
   */_getMargins(positions){//this.fitToVisibleBounds = true;
let self=this.getBoundingClientRect(),h="bottom"===this.position||"top"===this.position,max=h?self.width:self.height,sStart=h?self.left:self.top,tStart=h?positions.target.left:positions.target.top,tHalf=h?positions.target.width/2:positions.target.height/2,center=tStart+tHalf-10,margin=Math.min(max-20,Math.max(0,center-sStart)),style=h?`margin: 0 0 0 ${margin}px;`:`margin: ${margin}px 0 0 0;`;return style}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}window.customElements.define(SimplePopover.tag,SimplePopover);export{SimplePopover};