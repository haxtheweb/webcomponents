/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";/**
 * `html-block`
 * `A basic HTML block that provides HAXschema wiring`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @demo demo/index.html
 */class HtmlBlock extends HTMLElement{// render function
get html(){return`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`}// haxProperty definition
static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Html block",description:"A basic HTML block that provides HAXschema wiring",icon:"icons:android",color:"green",groups:["Block"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[{property:"allowscript",description:"",inputMethod:"boolean",required:!1,icon:"icons:android"}],advanced:[]}}}// properties available to the custom element for data binding
static get properties(){return{allowscript:{name:"allowscript",type:"Boolean",value:"false",reflectToAttribute:!1,observer:!1}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */static get tag(){return"html-block"}/**
   * life cycle
   */constructor(delayRender=!1){super();// set tag for later use
this.tag=HtmlBlock.tag;// map our imported properties json to real props on the element
// @notice static getter of properties is built via tooling
// to edit modify src/HtmlBlock-properties.json
let obj=HtmlBlock.properties;for(let p in obj){if(obj.hasOwnProperty(p)){if(this.hasAttribute(p)){this[p]=this.getAttribute(p)}else{this.setAttribute(p,obj[p].value);this[p]=obj[p].value}}}// optional queue for future use
this._queue=[];this.template=document.createElement("template");this.attachShadow({mode:"open"});if(!delayRender){this.render()}}/**
   * life cycle, element is afixed to the DOM
   */connectedCallback(){if(window.ShadyCSS){window.ShadyCSS.styleElement(this)}this.HAXWiring=new HAXWiring;this.HAXWiring.setup(HtmlBlock.haxProperties,HtmlBlock.tag,this)}_copyAttribute(name,to){const recipients=this.shadowRoot.querySelectorAll(to),value=this.getAttribute(name),fname=null==value?"removeAttribute":"setAttribute";for(const node of recipients){node[fname](name,value)}}_setProperty({name,value}){this[name]=value}render(){this.shadowRoot.innerHTML=null;this.template.innerHTML=this.html;if(window.ShadyCSS){window.ShadyCSS.prepareTemplate(this.template,this.tag)}this.shadowRoot.appendChild(this.template.content.cloneNode(!0))}//static get observedAttributes() {
//  return [];
//}
// disconnectedCallback() {}
// attributeChangedCallback(attr, oldValue, newValue) {}
}window.customElements.define(HtmlBlock.tag,HtmlBlock);export{HtmlBlock};