/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";/**
 * `lunr-search`
 * `LunrJS search element`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */class LunrSearch extends PolymerElement{// render function
static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>
<div>[[dataSource]]</div>
<div>[[results]]</div>`}// properties available to the custom element for data binding
static get properties(){return{dataSource:{name:"dataSource",type:"String",value:"",reflectToAttribute:!1,observer:"_dataSourceChanged"},results:{name:"results",type:"Array",value:"",reflectToAttribute:!1,observer:"_resultsChanged"}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */static get tag(){return"lunr-search"}/**
   * life cycle, element is afixed to the DOM
   */connectedCallback(){super.connectedCallback()}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
// Observer dataSource for changes
_dataSourceChanged(newValue,oldValue){if(typeof newValue!==typeof void 0){console.log(newValue)}}// Observer results for changes
_resultsChanged(newValue,oldValue){if(typeof newValue!==typeof void 0){console.log(newValue)}}}window.customElements.define(LunrSearch.tag,LunrSearch);export{LunrSearch};