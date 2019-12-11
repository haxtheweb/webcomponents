/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{LitElement,html}from"./node_modules/lit-element/lit-element.js";/**
 * `extensible-toolbar`
 * `a toolbar that can be customised with with mixins and json`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */class ExtensibleToolbar extends LitElement{// render function
render(){return html`
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
   */tag(){return"extensible-toolbar"}// life cycle
constructor(){super();this.tag=ExtensibleToolbar.tag;// map our imported properties json to real props on the element
// @notice static getter of properties is built via tooling
// to edit modify src/extensible-toolbar-properties.json
let obj=ExtensibleToolbar.properties;for(let p in obj){if(obj.hasOwnProperty(p)){if(this.hasAttribute(p)){this[p]=this.getAttribute(p)}else{this.setAttribute(p,obj[p].value);this[p]=obj[p].value}}}}/**
   * life cycle, element is afixed to the DOM
   */connectedCallback(){super.connectedCallback()}// static get observedAttributes() {
//   return [];
// }
// disconnectedCallback() {}
// attributeChangedCallback(attr, oldValue, newValue) {}
}customElements.define("extensible-toolbar",ExtensibleToolbar);export{ExtensibleToolbar};