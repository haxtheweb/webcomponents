import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";class FullWidthImage extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>[[source]]</div>
<div>[[caption]]</div>
<div>[[alt]]</div>`}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Full width-image",description:"full width image that flows beyond boundaries",icon:"icons:android",color:"green",groups:["Width"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[{property:"source",description:"",inputMethod:"textfield",required:!0,icon:"icons:link",validationType:"url"},{property:"alt",description:"",inputMethod:"alt",required:!0,icon:"icons:accessibility"}],configure:[{property:"source",description:"",inputMethod:"textfield",required:!0,icon:"icons:link",validationType:"url"},{property:"caption",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"},{property:"alt",description:"",inputMethod:"alt",required:!0,icon:"icons:accessibility"}],advanced:[]}}}static get properties(){return{source:{name:"source",type:"String",value:"",reflectToAttribute:!1,observer:"_sourceChanged"},caption:{name:"caption",type:"String",value:"",reflectToAttribute:!1,observer:!1},alt:{name:"alt",type:"String",value:"",reflectToAttribute:!1,observer:!1}}}static get tag(){return"full-width-image"}connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setup(FullWidthImage.haxProperties,FullWidthImage.tag,this)}_sourceChanged(newValue,oldValue){if(typeof newValue!==typeof void 0){console.log(newValue)}}}window.customElements.define(FullWidthImage.tag,FullWidthImage);export{FullWidthImage};