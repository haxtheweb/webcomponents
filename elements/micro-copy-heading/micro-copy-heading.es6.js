import{LitElement,html}from"./node_modules/@polymer/lit-element/lit-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";class MicroCopyHeading extends LitElement{render(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>${this.heading}</div>
<div>${this.endCap}</div>`}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Micro copy-heading",description:"small call to action / attention that acts as a heading too",icon:"icons:android",color:"green",groups:["Copy"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[{property:"heading",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"},{property:"endCap",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"}],advanced:[]}}}static get properties(){return{heading:{name:"heading",type:"String",value:"Tell your story",reflectToAttribute:!1,observer:!1},endCap:{name:"endCap",type:"String",value:"//",reflectToAttribute:!1,observer:!1}}}tag(){return"micro-copy-heading"}constructor(){super()}connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setup(MicroCopyHeading.haxProperties,MicroCopyHeading.tag,this)}}customElements.define("micro-copy-heading",MicroCopyHeading);export{MicroCopyHeading};