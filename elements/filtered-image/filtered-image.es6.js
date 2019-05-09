/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";/**
 * `filtered-image`
 * `An image using an SVG filter. Can be used to make background images have more contrast with text.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */class FilteredImage extends PolymerElement{// render function
static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>[[src]]</div>
<div>[[alt]]</div>`}// haxProperty definition
static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Filtered image",description:"An image using an SVG filter. Can be used to make background images have more contrast with text.",icon:"icons:android",color:"green",groups:["Image"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"nikkimk",owner:"The Pennsylvania State University"}},settings:{quick:[{property:"src",description:"",inputMethod:"textfield",required:!0,icon:"icons:link",validationType:"url"},{property:"alt",description:"",inputMethod:"alt",required:!0,icon:"icons:accessibility"}],configure:[{property:"src",description:"",inputMethod:"textfield",required:!0,icon:"icons:link",validationType:"url"},{property:"alt",description:"",inputMethod:"alt",required:!0,icon:"icons:accessibility"}],advanced:[]}}}// properties available to the custom element for data binding
static get properties(){return{src:{name:"src",type:"String",value:"",reflectToAttribute:!1,observer:!1},alt:{name:"alt",type:"String",value:"",reflectToAttribute:!1,observer:!1}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */static get tag(){return"filtered-image"}/**
   * life cycle, element is afixed to the DOM
   */connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setup(FilteredImage.haxProperties,FilteredImage.tag,this)}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}window.customElements.define(FilteredImage.tag,FilteredImage);export{FilteredImage};