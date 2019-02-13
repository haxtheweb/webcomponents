import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";export{GlossaryTerm};class GlossaryTerm extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>[[name]]</div>`}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Glossary term",description:"Glossary element that connects to the glossary service.",icon:"icons:android",color:"green",groups:["Term"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"heyMP",owner:"PSU"}},settings:{quick:[],configure:[{property:"name",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"}],advanced:[]}}}static get properties(){return{name:{name:"name",type:"String",value:"",reflectToAttribute:!1,observer:!1}}}static get tag(){return"glossary-term"}connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setup(GlossaryTerm.haxProperties,GlossaryTerm.tag,this)}}window.customElements.define(GlossaryTerm.tag,GlossaryTerm);