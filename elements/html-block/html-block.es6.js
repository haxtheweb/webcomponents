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
<style></style>
<slot></slot>`}// haxProperty definition
static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Html block",description:"A basic HTML block that provides HAXschema wiring",icon:"icons:warning",color:"red",groups:["Block"],handles:[{type:"html",content:"slot"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[{slot:"",title:"HTML",description:"HTML code you want to present in content",inputMethod:"code-editor"}],advanced:[]}}}// properties available to the custom element for data binding
static get properties(){return{}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */static get tag(){return"html-block"}/**
   * life cycle
   */constructor(delayRender=!1){super();// set tag for later use
this.tag=HtmlBlock.tag;// map our imported properties json to real props on the element
// @notice static getter of properties is built via tooling
// to edit modify src/HtmlBlock-properties.json
}/**
   * life cycle, element is afixed to the DOM
   */connectedCallback(){this.HAXWiring=new HAXWiring;this.HAXWiring.setup(HtmlBlock.haxProperties,HtmlBlock.tag,this);// default we block all script unless the user says to do so
// @todo ensure HAX actually respects this down the road, right now it sanitizes it
this.allowscript=!1;this.__ignoreChange=!1;this.style.display="block";// ensure we keep applying sanitization as needed while monitoring the tree
this.__observer=new MutationObserver(this.render.bind(this));this.__observer.observe(this,{attributes:!0,characterData:!0,childList:!0,subtree:!0})}render(){if(!this.__ignoreChange){if(null==this.allowscript||!this.allowscript||typeof this.allowscript===typeof void 0){this.__sanitizeHTML()}}else{this.__ignoreChange=!1}}static get observedAttributes(){return["allowscript"]}get allowscript(){return this.getAttribute("allowscript")}set allowscript(value){if(value){this.setAttribute("allowscript","allowscript")}else{this.removeAttribute("allowscript")}}// disconnectedCallback() {}
attributeChangedCallback(attr,oldValue,newValue){if("allowscript"===attr){if(null==newValue||!newValue||typeof newValue===typeof void 0){// we should sanitize innerHTML but create a holding pen for the rawHTML first
this.__sanitizeHTML()}else{// see if we had anything in the holding pen
if(this.__rawHTML){this.__ignoreChange=!0;this.innerHTML=this.__rawHTML}}}}__sanitizeHTML(){if(!this.__pen){this.__pen=document.createElement("div")}this.__pen.innerHTML=this.innerHTML;this.__rawHTML=this.__pen.cloneNode(!0).innerHTML;// clear it up
if("function"===typeof this.innerHTML){this.innerHTML=this.innerHTML.replace(/<script[\s\S]*?>/gi,"&lt;script&gt;");this.innerHTML=this.innerHTML.replace(/<\/script>/gi,"&lt;/script&gt;")}}}window.customElements.define(HtmlBlock.tag,HtmlBlock);export{HtmlBlock};