/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";// register globally so we can make sure there is only one
window.HaxIconset=window.HaxIconset||{};// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same hax-iconset element, making it a singleton.
window.HaxIconset.requestAvailability=()=>{// if there is no single instance, generate one and append it to end of the document
if(!window.HaxIconset.instance){window.HaxIconset.instance=document.createElement("hax-iconset");document.body.appendChild(window.HaxIconset.instance)}return window.HaxIconset.instance};/**
 * `hax-iconset`
 * `HAX-specific icons`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */class HaxIconset extends PolymerElement{// render function
static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`}// properties available to the custom element for data binding
static get properties(){return{}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */static get tag(){return"hax-iconset"}/**
   * life cycle, element is afixed to the DOM
   */connectedCallback(){super.connectedCallback();window.addEventListener("hax-iconset-hide",this.hideHaxIconset.bind(this));window.addEventListener("hax-iconset-show",this.showHaxIconset.bind(this))}/**
   * life cycle, element is removed from the DOM
   */disconnectedCallback(){super.connectedCallback();window.removeEventListener("hax-iconset-hide",this.hideHaxIconset.bind(this));window.removeEventListener("hax-iconset-show",this.showHaxIconset.bind(this))}/**
   * Hide callback
   */hideHaxIconset(e){}// add your code to run when the singleton hides
/**
   * Show / available callback
   */showHaxIconset(e){// add your code to run when the singleton is called for
}}window.customElements.define(HaxIconset.tag,HaxIconset);export{HaxIconset};