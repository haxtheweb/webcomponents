/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";/**
 * `a11y-tabs`
 * `accessible and responsive tabbed interface`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */class A11yTabs extends PolymerElement{// render function
static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>[[alwaysVertical]]</div>
<div>[[disabled]]</div>
<div>[[activeTab]]</div>`}// haxProperty definition
static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"A 11-y-tabs",description:"accessible and responsive tabbed interface",icon:"icons:android",color:"green",groups:["11"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"nikkimk",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[{property:"alwaysVertical",description:"",inputMethod:"boolean",required:!1,icon:"icons:android"},{property:"disabled",description:"",inputMethod:"boolean",required:!1,icon:"icons:android"},{property:"activeTab",description:"",inputMethod:"array",required:!1,icon:"icons:android"}],advanced:[]}}}// properties available to the custom element for data binding
static get properties(){return{alwaysVertical:{name:"alwaysVertical",type:"Boolean",value:"false",reflectToAttribute:!0,observer:"_alwaysVerticalChanged"},disabled:{name:"disabled",type:"Boolean",value:"false",reflectToAttribute:!0,observer:"_disabledChanged"},activeTab:{name:"activeTab",type:"Object",value:"",reflectToAttribute:!1,observer:"_activeTabChanged"}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */static get tag(){return"a11y-tabs"}/**
   * life cycle, element is afixed to the DOM
   */connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setup(A11yTabs.haxProperties,A11yTabs.tag,this)}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
// Observer alwaysVertical for changes
_alwaysVerticalChanged(newValue,oldValue){if(typeof newValue!==typeof void 0){console.log(newValue)}}// Observer disabled for changes
_disabledChanged(newValue,oldValue){if(typeof newValue!==typeof void 0){console.log(newValue)}}// Observer activeTab for changes
_activeTabChanged(newValue,oldValue){if(typeof newValue!==typeof void 0){console.log(newValue)}}}window.customElements.define(A11yTabs.tag,A11yTabs);export{A11yTabs};