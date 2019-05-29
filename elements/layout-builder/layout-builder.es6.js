/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@polymer/paper-button/paper-button.js";/**
 * `layout-builder`
 * `A new UI for adding content to layouts`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */class LayoutBuilder extends PolymerElement{// render function
static get template(){return html`
<style>:host {
  display: block;
}

:host paper-button {
  display: block;
  margin: 0;
}
:host paper-button,
:host #content-wrapper {
  border: 1px solid #ddd;
}

:host #content:not(:empty) {
  padding: 15px;
}

:host([hidden]) {
  display: none;
}
</style>
<div id="content-wrapper">
  <div id="prepend-child"><paper-button on-tap="_handleAddChild">Insert into [[type]]</paper-button></div>
  <div id="content"><slot></slot></div>
</div>
<div id="insert-sibling-after">
  <paper-button on-tap="_handleAddSibling">Add new [[type]]</paper-button>
</div>`}// haxProperty definition
static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Layout builder",description:"A new UI for adding content to layouts",icon:"icons:android",color:"green",groups:["Builder"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"nikkimk",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[],advanced:[]}}}// properties available to the custom element for data binding
static get properties(){return{type:{name:"type",type:"Boolean",value:"layout"},id:{name:"id",type:"String",reflecttoAttribute:!0}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */static get tag(){return"layout-builder"}/**
   * life cycle, element is afixed to the DOM
   */connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setup(LayoutBuilder.haxProperties,LayoutBuilder.tag,this);this.id=this._generateUUID()}_handleAddChild(){let lb=document.createElement("layout-builder");lb.type="sub-"+this.type;lb.innerHTML=`I am a ${this.type} of ${this.id}.`;this.prepend(lb)}_handleAddSibling(){let lb=document.createElement("layout-builder");lb.type=this.type;lb.innerHTML=`I am a ${this.type} of ${this.id}.`;this.parentNode.insertBefore(lb,this.nextSibling)}/**
   * Generate a UUID
   */_generateUUID(){let hex=Math.floor(65536*(1+Math.random())).toString(16).substring(1);return this.type+"-ss-s-s-s-sss".replace(/s/g,hex)}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}window.customElements.define(LayoutBuilder.tag,LayoutBuilder);export{LayoutBuilder};