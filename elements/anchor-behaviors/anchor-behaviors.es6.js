/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";// register globally so we can make sure there is only one
window.AnchorBehaviors=window.AnchorBehaviors||{};// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same anchor-behaviors element, making it a singleton.
window.AnchorBehaviors.requestAvailability=()=>{// if there is no single instance, generate one and append it to end of the document
if(!window.AnchorBehaviors.instance){window.AnchorBehaviors.instance=document.createElement("anchor-behaviors");document.body.appendChild(window.AnchorBehaviors.instance)}return window.AnchorBehaviors.instance};/**
 * `anchor-behaviors`
 * `handles anchors and params in the url`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */class AnchorBehaviors extends PolymerElement{// render function
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
   */static get tag(){return"anchor-behaviors"}/**
   * life cycle, element is afixed to the DOM
   */connectedCallback(){super.connectedCallback();window.addEventListener("anchor-behaviors-hide",this.hideAnchorBehaviors.bind(this));window.addEventListener("anchor-behaviors-show",this.showAnchorBehaviors.bind(this))}/**
   * life cycle, element is removed from the DOM
   */disconnectedCallback(){super.connectedCallback();window.removeEventListener("anchor-behaviors-hide",this.hideAnchorBehaviors.bind(this));window.removeEventListener("anchor-behaviors-show",this.showAnchorBehaviors.bind(this))}/**
   * Hide callback
   */hideAnchorBehaviors(e){}// add your code to run when the singleton hides
/**
   * Show / available callback
   */showAnchorBehaviors(e){// add your code to run when the singleton is called for
}}window.customElements.define(AnchorBehaviors.tag,AnchorBehaviors);export{AnchorBehaviors};