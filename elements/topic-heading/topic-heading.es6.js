import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";class TopicHeading extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>[[icon]]</div>
<div>[[title]]</div>`}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Topic heading",description:"Semantic and visual meaning behind a heading break",icon:"icons:android",color:"green",groups:["Heading"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[{property:"icon",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"},{property:"title",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"}],advanced:[]}}}static get properties(){return{icon:{name:"icon",type:"String",value:"",reflectToAttribute:!1,observer:!1},title:{name:"title",type:"String",value:"Heading",reflectToAttribute:!1,observer:!1}}}static get tag(){return"topic-heading"}connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setup(TopicHeading.haxProperties,TopicHeading.tag,this)}}window.customElements.define(TopicHeading.tag,TopicHeading);export{TopicHeading};