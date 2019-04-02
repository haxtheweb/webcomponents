import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";class SimplePopover extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>[[title]]</div>`}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Simple popover",description:"A popover alertdialog that is positioned next to a target element",icon:"icons:android",color:"green",groups:["Popover"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"nikkimk",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[{property:"title",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"}],advanced:[]}}}static get properties(){return{title:{name:"title",type:"String",value:"null",reflectToAttribute:!1,observer:!1}}}static get tag(){return"simple-popover"}connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setup(SimplePopover.haxProperties,SimplePopover.tag,this)}}window.customElements.define(SimplePopover.tag,SimplePopover);export{SimplePopover};