import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";class HaxschemaBuilder extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>[[haxSchema]]</div>
<div>[[source]]</div>`}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Haxschema builder",description:"dynamically build and visualize HAXschema",icon:"icons:android",color:"green",groups:["Builder"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[{property:"source",description:"",inputMethod:"textfield",required:!0,icon:"icons:link",validationType:"url"}],configure:[{property:"haxSchema",description:"",inputMethod:"array",required:!1,icon:"icons:android"},{property:"source",description:"",inputMethod:"textfield",required:!0,icon:"icons:link",validationType:"url"}],advanced:[]}}}static get properties(){return{haxSchema:{name:"haxSchema",type:"Object",value:"{}",reflectToAttribute:!1,observer:!1},source:{name:"source",type:"String",value:"",reflectToAttribute:!1,observer:!1}}}static get tag(){return"haxschema-builder"}connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setup(HaxschemaBuilder.haxProperties,HaxschemaBuilder.tag,this)}}window.customElements.define(HaxschemaBuilder.tag,HaxschemaBuilder);export{HaxschemaBuilder};