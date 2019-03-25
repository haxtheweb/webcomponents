import{LitElement,html}from"./node_modules/lit-element/lit-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";class CountUp extends LitElement{render(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>${this.start}</div>
<div>${this.end}</div>
<div>${this.duration}</div>
<div>${this.noEasing}</div>`}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Count up",description:"count up js wrapper with minimal styling",icon:"icons:android",color:"green",groups:["Up"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[{property:"start",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"},{property:"end",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"},{property:"duration",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"},{property:"noEasing",description:"",inputMethod:"boolean",required:!1,icon:"icons:android"}],advanced:[]}}}static get properties(){return{start:{name:"start",type:"Number",value:"0",reflectToAttribute:!1,observer:!1},end:{name:"end",type:"Number",value:"",reflectToAttribute:!1,observer:!1},duration:{name:"duration",type:"Number",value:"2.5",reflectToAttribute:!1,observer:!1},noEasing:{name:"noEasing",type:"Boolean",value:"",reflectToAttribute:!1,observer:!1}}}tag(){return"count-up"}constructor(){super()}connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setup(CountUp.haxProperties,CountUp.tag,this)}}customElements.define("count-up",CountUp);export{CountUp};