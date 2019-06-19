define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js","./node_modules/@lrnwebcomponents/lrn-vocab/lrn-vocab.js"],function(_exports,_polymerElement,_HAXWiring,_lrnVocab){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.GlossaryTerm=void 0;function _templateObject_4a8b27a08eb111e9a8e6f30d5dce949c(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: inline-block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n\nlrn-vocab {\n  display: inline;\n}</style>\n<template is=\"dom-if\" if=\"[[!_fallback]]\">\n  <lrn-vocab term=\"[[display]]\">\n    <div>[[definition]]</div>\n  </lrn-vocab>\n</template>\n<template is=\"dom-if\" if=\"[[_fallback]]\">\n  <slot></slot>\n</template>"]);_templateObject_4a8b27a08eb111e9a8e6f30d5dce949c=function _templateObject_4a8b27a08eb111e9a8e6f30d5dce949c(){return data};return data}/**
 * `glossary-term`
 * ``
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var GlossaryTerm=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(GlossaryTerm,_PolymerElement);function GlossaryTerm(){babelHelpers.classCallCheck(this,GlossaryTerm);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(GlossaryTerm).apply(this,arguments))}babelHelpers.createClass(GlossaryTerm,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){var _this=this;babelHelpers.get(babelHelpers.getPrototypeOf(GlossaryTerm.prototype),"connectedCallback",this).call(this);this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(GlossaryTerm.haxProperties,GlossaryTerm.tag,this);// fetch definition
fetch("http://localhost:4000",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:"{ term(name: \"".concat(this.name,"\") { name definition } }")})}).then(function(r){return r.json()}).then(function(r){try{_this.definition=r.data.term.definition;_this._fallback=!1}catch(error){}})}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_4a8b27a08eb111e9a8e6f30d5dce949c())}// haxProperty definition
},{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Glossary term",description:"",icon:"icons:android",color:"green",groups:["Term"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"heyMP",owner:"PSU"}},settings:{quick:[],configure:[{property:"name",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"},{property:"definition",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"},{property:"display",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"}],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{name:{name:"name",type:"String",value:"",reflectToAttribute:!1,observer:!1},definition:{name:"display",type:"String",value:"",reflectToAttribute:!1,observer:!1},display:{name:"display",type:"String",value:"",reflectToAttribute:!1,observer:!1},_fallback:{name:"fallback",type:"Boolean",value:!0,reflectToAttribute:!1,observer:!1}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"glossary-term"}}]);return GlossaryTerm}(_polymerElement.PolymerElement);_exports.GlossaryTerm=GlossaryTerm;window.customElements.define(GlossaryTerm.tag,GlossaryTerm)});