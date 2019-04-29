/**
 * Inspired by https://github.com/olivernn/lunr.js
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{pathFromUrl}from"./node_modules/@polymer/polymer/lib/utils/resolve-url.js";import{ESGlobalBridge}from"./node_modules/@lrnwebcomponents/es-global-bridge/es-global-bridge.js";import"./node_modules/@polymer/iron-ajax/iron-ajax.js";/**
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
<iron-ajax
  auto
  url="[[dataSource]]"
  method="[[method]]"
  handle-as="json"
  on-response="_dataResponse"
></iron-ajax>`}// properties available to the custom element for data binding
static get properties(){return{dataSource:{name:"dataSource",type:"String"},data:{name:"data",type:"Array",notify:!0},method:{name:"method",type:"String",value:"GET"},search:{type:"String",notify:!0},results:{type:"Array",computed:"searched(data, search, index, minScore, limit)",notify:!0},noStopWords:{type:"Boolean",value:!1,notify:!0},fields:{type:"Array",value:[]},indexNoStopWords:{type:"Object"},index:{type:"Object",computed:"_createIndex(data, fields, noStopWords, __lunrLoaded)"},__lunrLoaded:{type:"Boolean"},limit:{type:"Number",value:500},minScore:{type:"Number",value:0},log:{type:"Boolean",value:!1}}}constructor(){super();const name="lunr",basePath=pathFromUrl(import.meta.url),location=`${basePath}../../lunr/lunr.js`;window.addEventListener(`es-bridge-${name}-loaded`,this._lunrLoaded.bind(this));window.ESGlobalBridge.requestAvailability();window.ESGlobalBridge.instance.load(name,location);if(window.ESGlobalBridge.imports&&window.ESGlobalBridge.imports[name]){this.__lunrLoaded=!0}}_lunrLoaded(e){// callback when loaded
this.__lunrLoaded=!0}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */static get tag(){return"lunr-search"}_dataResponse(e){this.set("data",e.detail.response);this.notifyPath("data.*")}/**
    Filters your input data
    
    @param {Array} data Array of Objects with common properties.
    @param {String} search The search term that filters results.
    @param {Object} index The lunr Index..
    @param {Number} minScore The minimum score of your results.
    @param {Number} limit The maximum number of results you'd like your results.
    
    @return {Array} The filtered data.
   */searched(data,search,index,minScore,limit){if(data&&index&&search){var results=[];if(""!==""+search){for(var searched=index.search(search),i=0;i<searched.length;i++){if(i===limit||searched[i].score<minScore){break}// match on the id within the array of options
let tmpItem=data.find(j=>j.id==searched[i].ref);results.push(tmpItem)}}if(0===results.length&&!this.noStopWords&&""!==""+search){if(!this.indexNoStopWords){this.indexNoStopWords=this._createIndex(data,this.fields,!0,index)}searched=this.indexNoStopWords.search(search);for(var results=[],i=0;i<searched.length;i++){if(i===limit||searched[i].score<minScore){break}let tmpItem=data.find(j=>j.id==searched[i].ref);results.push(tmpItem)}}return results}}_createIndex(data,fields,noStopWords,ready){if(ready){let root=this;if(Array.isArray(data)&&0<data.length){if(Array.isArray(fields)&&0<fields.length){return lunr(function(){for(var i=0;i<fields.length;i++){if(fields[i].charAt(0)===fields[i].charAt(0).toUpperCase()){this.field(fields[i],{boost:10})}else{this.field(fields[i])}}for(var i=0,toIndex;i<data.length;i++){toIndex={id:i};for(var f=0;f<fields.length;f++){if(data[i].hasOwnProperty(fields[f])&&null!==data[i][fields[f]]&&"function"==typeof data[i][fields[f]].toString&&(2<data[i][fields[f]].toString().split(" ").length||30>data[i][fields[f]].toString().length)){//indicate that they might be words in it
toIndex[fields[f]]=data[i][fields[f]].toString()}else{toIndex[fields[f]]=""}}this.add(toIndex)}if(noStopWords){this.pipeline.remove(lunr.stopWordFilter)}})}else{// find fields
// TODO only word best fields.
var fields=[],ddup={};return lunr(function(){for(var indexOfData=0;indexOfData<data.length;indexOfData++){for(var prop in data[indexOfData]){if("_"!==prop.charAt(0)&&!ddup.hasOwnProperty(prop)&&(2<prop.toString().split(" ").length||30>prop.toString().length)){fields.push(prop);if(prop.charAt(0)===prop.charAt(0).toUpperCase()){this.field(prop,{boost:10})}else{this.field(prop)}ddup[prop]=1}}}if(0<fields.length){root.fields=fields}for(var i=0,toIndex;i<data.length;i++){toIndex={id:i};for(var f=0;f<fields.length;f++){if(data[i].hasOwnProperty(fields[f])&&null!==data[i][fields[f]]&&"function"==typeof data[i][fields[f]].toString&&(2<data[i][fields[f]].toString().split(" ").length||30>data[i][fields[f]].toString().length)){//indicate that they might be words in it
toIndex[fields[f]]=data[i][fields[f]].toString()}else{toIndex[fields[f]]=""}}this.add(toIndex)}if(noStopWords){this.pipeline.remove(lunr.stopWordFilter)}})}}}}}window.customElements.define(LunrSearch.tag,LunrSearch);export{LunrSearch};