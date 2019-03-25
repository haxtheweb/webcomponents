import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";export{LrsEmitter};class LrsEmitter extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>[[verb]]</div>`}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Lrs emitter",description:"Emit learning statements occuring in your app.",icon:"icons:android",color:"green",groups:["Emitter"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"heyMP",owner:"PSU"}},settings:{quick:[],configure:[{property:"verb",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"}],advanced:[]}}}static get properties(){return{verb:{name:"verb",type:"String",value:"",reflectToAttribute:!1,observer:!1}}}static get tag(){return"lrs-emitter"}connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setup(LrsEmitter.haxProperties,LrsEmitter.tag,this)}}window.customElements.define(LrsEmitter.tag,LrsEmitter);