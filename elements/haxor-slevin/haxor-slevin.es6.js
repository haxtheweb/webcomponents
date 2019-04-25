/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";/**
 * `haxor-slevin`
 * `Tech blogger theme`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */class HaxorSlevin extends PolymerElement{// render function
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
   */static get tag(){return"haxor-slevin"}/**
   * life cycle, element is afixed to the DOM
   */connectedCallback(){super.connectedCallback()}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}window.customElements.define(HaxorSlevin.tag,HaxorSlevin);export{HaxorSlevin};