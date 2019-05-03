/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import{CountUp}from"./node_modules/countup.js/dist/countUp.min.js";/**
 * `count-up`
 * `count up js wrapper with minimal styling`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */class CountUpElement extends PolymerElement{// render function
static get template(){return html`
<style>:host {
  display: inline-flex;
  --count-up-color: #000000;
}

:host([hidden]) {
  display: none;
}

.wrapper {
  display: block;
  text-align: center;
  width: 100%;
  height: 100%;
}

#counter {
  color: var(--count-up-color);
  @apply --count-up-number;
}
</style>
<div class="wrapper">
  <slot name="prefix"></slot>
  <div id="counter"></div>
  <slot name="suffix"></slot>
</div>`}// haxProperty definition
static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Count up",description:"count up js wrapper with minimal styling",icon:"icons:android",color:"green",groups:["Up"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[{property:"start",description:"",inputMethod:"textfield"},{property:"end",description:"",inputMethod:"textfield"},{property:"duration",description:"",inputMethod:"textfield"},{property:"noeasing",description:"",inputMethod:"boolean"},{property:"decimalplaces",description:"",inputMethod:"textfield"},{property:"separator",description:"",inputMethod:"textfield"},{property:"decimal",description:"",inputMethod:"textfield"},{property:"prefix",description:"",inputMethod:"textfield"},{property:"suffix",description:"",inputMethod:"textfield"}],advanced:[]}}}// properties available to the custom element for data binding
static get properties(){return{/**
   * Starting point for counting
   */start:{name:"start",type:"Number",value:0},/**
   * End point for counting stopping
   */end:{name:"end",type:"Number",value:100},/**
   * Duration to count
   */duration:{name:"duration",type:"Number",value:2.5},/**
   * Disable easing animation
   */noeasing:{name:"noeasing",type:"Boolean",value:!1},/**
   * decimal places to show
   */decimalplaces:{name:"decimalPlaces",type:"Number",value:0},/**
   * separator for 100s groupings
   */separator:{name:"separator",type:"String",value:","},/**
   * decimal point character
   */decimal:{name:"decimal",type:"String",value:"."},/**
   * prefix string before the number counting
   */prefixtext:{name:"prefixtext",type:"String",value:" "},/**
   * suffix string after the number counting
   */suffixtext:{name:"suffixtext",type:"String",value:" "},thresholds:{type:"Array",value:[0,.25,.5,.75,1]},rootMargin:{type:"String",value:"0px"},ratio:{type:"Number",reflectToAttribute:!0,readOnly:!0},visibleLimit:{type:"Number",value:.5,reflectToAttribute:!0}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */tag(){return"count-up"}/**
   * life cycle, element is afixed to the DOM
   */connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setup(CountUpElement.haxProperties,"count-up",this);// setup the intersection observer
this.observer=new IntersectionObserver(this.handleIntersectionCallback.bind(this),{root:document.rootElement,rootMargin:this.rootMargin,threshold:this.thresholds});this.observer.observe(this);const options={startVal:this.start,decimalPlaces:this.decimalplaces,duration:this.duration,useEasing:!this.noeasing,separator:this.separator,decimal:this.decimal,prefix:this.prefixtext,suffix:this.suffixtext};this._countUp=new CountUp(this.$.counter,this.end,options)}handleIntersectionCallback(entries){for(let entry of entries){this._setRatio((+entry.intersectionRatio).toFixed(2));if(this.ratio>=this.visibleLimit){// now we care
this._countUp.start()}}}// static get observedAttributes() {
//   return [];
// }
// disconnectedCallback() {}
// attributeChangedCallback(attr, oldValue, newValue) {}
}customElements.define("count-up",CountUpElement);export{CountUpElement,CountUp};