import{LitElement,html,css,customElement,property}from"./node_modules/lit-element/lit-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";class MicroCopyHeading extends LitElement{render(){return html`
<style>:host {
  display: block;
  margin: 16px 0;
}

:host([hidden]) {
  display: none;
}
span {
  margin-left:8px;
}
h2 {
  display: inline-flex;
  margin: unset;
  padding: unset;
  font-size: 0.750em;
  color: var(--simple-colors-default-theme-red-5, #DE2654);
  border: 2px solid var(--simple-colors-default-theme-red-5, #DE2654);
  line-height: 12px;
  margin-right: 10px;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.09em;
  padding: 6px 16px;
}</style>
<h2>${this.heading}<span aria-hidden="true">${this.endcap}</span></h2>`}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Micro copy-heading",description:"small call to action / attention that acts as a heading too",icon:"icons:android",color:"green",groups:["Copy"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[{property:"heading",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"},{property:"endCap",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"}],configure:[{property:"heading",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"},{property:"endCap",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"}],advanced:[]}}}static get properties(){return{heading:{name:"heading",type:"String",value:"Telling our story"},endcap:{name:"endcap",type:"String",value:"//"}}}tag(){return"micro-copy-heading"}constructor(){super();this.tag=MicroCopyHeading.tag;let obj=MicroCopyHeading.properties;for(let p in obj){if(obj.hasOwnProperty(p)){if(this.hasAttribute(p)){this[p]=this.getAttribute(p)}else{this.setAttribute(p,obj[p].value);this[p]=obj[p].value}}}}connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setup(MicroCopyHeading.haxProperties,MicroCopyHeading.tag,this)}}customElements.define("micro-copy-heading",MicroCopyHeading);export{MicroCopyHeading};