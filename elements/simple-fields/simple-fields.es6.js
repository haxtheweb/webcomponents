import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";class SimpleFields extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>[[fields]]</div>`}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Simple fields",description:"Uses eco-json-form and HAX wiring to display a series of fields",icon:"icons:android",color:"green",groups:["Fields"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"nikkimk",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[{property:"fields",description:"",inputMethod:"array",required:!1,icon:"icons:android"}],advanced:[]}}}static get properties(){return{fields:{name:"fields",type:"Array",value:"",reflectToAttribute:!1,observer:"_fieldsChanged"}}}static get tag(){return"simple-fields"}connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setup(SimpleFields.haxProperties,SimpleFields.tag,this)}_fieldsChanged(newValue,oldValue){if(typeof newValue!==typeof void 0){console.log(newValue)}}}window.customElements.define(SimpleFields.tag,SimpleFields);export{SimpleFields};