/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{afterNextRender}from"./node_modules/@polymer/polymer/lib/utils/render-status.js";/**
 * `example-haxcms-theme`
 * `A basic, well documented example theme for HAXcms`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */class ExampleHaxcmsTheme extends PolymerElement{// render function
static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>[[editMode]]</div>`}// properties available to the custom element for data binding
static get properties(){return{editMode:{name:"editMode",type:"Boolean",value:"",reflectToAttribute:!0,observer:!1}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */static get tag(){return"example-haxcms-theme"}/**
   * constructor
   */constructor(){super()}/**
   * life cycle, element is afixed to the DOM
   */connectedCallback(){super.connectedCallback()}/**
   * life cycle, element is removed from the DOM
   */disconnectedCallback(){super.disconnectedCallback()}}window.customElements.define(ExampleHaxcmsTheme.tag,ExampleHaxcmsTheme);export{ExampleHaxcmsTheme};