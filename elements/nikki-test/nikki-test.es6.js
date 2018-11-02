import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";export{NikkiTest};class NikkiTest extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>[[title]]</div>
<div>[[number]]</div>`}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Nikki test",description:"testing 123",icon:"icons:android",color:"green",groups:["Test"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"nikkimk",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[{property:"title",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"},{property:"number",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"}],advanced:[]}}}static get properties(){return{title:{name:"title",type:"String",value:"null",reflectToAttribute:!0,observer:"_titleChanged"},number:{name:"number",type:"Number",value:"0",reflectToAttribute:!0,observer:!1}}}static get tag(){return"nikki-test"}connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setHaxProperties(NikkiTest.haxProperties,NikkiTest.tag,this)}_titleChanged(newValue){if(typeof newValue!==typeof void 0){console.log(newValue)}}}window.customElements.define(NikkiTest.tag,NikkiTest);