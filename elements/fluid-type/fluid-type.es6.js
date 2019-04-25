/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */ /**
 * `fluid-type`
 * `A simple fluid-type sizing wrapper element to apply to anything`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @demo demo/index.html
 */class FluidType extends HTMLElement{// render function
get html(){return`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`}// properties available to the custom element for data binding
static get properties(){return{"min-size":{name:"min-size",type:"Number",value:"",reflectToAttribute:!1,observer:!1},"max-size":{name:"max-size",type:"Number",value:"",reflectToAttribute:!1,observer:!1},"min-screen":{name:"min-screen",type:"Number",value:"",reflectToAttribute:!1,observer:!1},"max-screen":{name:"max-screen",type:"Number",value:"",reflectToAttribute:!1,observer:!1}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */static get tag(){return"fluid-type"}/**
   * life cycle
   */constructor(delayRender=!1){super();// set tag for later use
this.tag=FluidType.tag;// map our imported properties json to real props on the element
// @notice static getter of properties is built via tooling
// to edit modify src/FluidType-properties.json
let obj=FluidType.properties;for(let p in obj){if(obj.hasOwnProperty(p)){if(this.hasAttribute(p)){this[p]=this.getAttribute(p)}else{this.setAttribute(p,obj[p].value);this[p]=obj[p].value}}}// optional queue for future use
this._queue=[];this.template=document.createElement("template");this.attachShadow({mode:"open"});if(!delayRender){this.render()}}/**
   * life cycle, element is afixed to the DOM
   */connectedCallback(){if(window.ShadyCSS){window.ShadyCSS.styleElement(this)}if(this._queue.length){this._processQueue()}}_copyAttribute(name,to){const recipients=this.shadowRoot.querySelectorAll(to),value=this.getAttribute(name),fname=null==value?"removeAttribute":"setAttribute";for(const node of recipients){node[fname](name,value)}}_queueAction(action){this._queue.push(action)}_processQueue(){this._queue.forEach(action=>{this[`_${action.type}`](action.data)});this._queue=[]}_setProperty({name,value}){this[name]=value}render(){this.shadowRoot.innerHTML=null;this.template.innerHTML=this.html;if(window.ShadyCSS){window.ShadyCSS.prepareTemplate(this.template,this.tag)}this.shadowRoot.appendChild(this.template.content.cloneNode(!0))}//static get observedAttributes() {
//  return [];
//}
// disconnectedCallback() {}
// attributeChangedCallback(attr, oldValue, newValue) {}
}window.customElements.define(FluidType.tag,FluidType);export{FluidType};