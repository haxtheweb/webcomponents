/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{afterNextRender}from"./node_modules/@polymer/polymer/lib/utils/render-status.js";/**
 * `simple-login`
 * `a simple login form`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */class SimpleLogin extends PolymerElement{// render function
static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>[[title]]</div>`}// properties available to the custom element for data binding
static get properties(){return{title:{name:"title",type:"String",value:"",reflectToAttribute:!1,observer:"_titleChanged"}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */static get tag(){return"simple-login"}/**
   * constructor
   */constructor(){super()}/**
   * life cycle, element is afixed to the DOM
   */connectedCallback(){super.connectedCallback()}/**
   * life cycle, element is removed from the DOM
   */disconnectedCallback(){super.disconnectedCallback()}// Observer title for changes
_titleChanged(newValue,oldValue){if(typeof newValue!==typeof void 0){console.log(newValue)}}}window.customElements.define(SimpleLogin.tag,SimpleLogin);export{SimpleLogin};