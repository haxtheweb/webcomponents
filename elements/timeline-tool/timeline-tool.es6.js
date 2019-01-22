import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";export{TimelineTool};class TimelineTool extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Timeline tool",description:"Makes a HAX-wired timeline",icon:"icons:android",color:"green",groups:["Tool"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"nikkimk",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[],advanced:[]}}}static get properties(){return{}}static get tag(){return"timeline-tool"}connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setHaxProperties(TimelineTool.haxProperties,TimelineTool.tag,this)}}window.customElements.define(TimelineTool.tag,TimelineTool);