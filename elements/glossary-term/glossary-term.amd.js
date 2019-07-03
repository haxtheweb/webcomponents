define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js","./node_modules/@lrnwebcomponents/lrn-vocab/lrn-vocab.js"],function(_exports,_polymerElement,_HAXWiring,_lrnVocab){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.GlossaryTerm=void 0;function _templateObject_dfb38ad09c1611e9b169d9b24f90bf88(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: inline-block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n\nlrn-vocab {\n  display: inline;\n}</style>\n<template is=\"dom-if\" if=\"[[!_fallback]]\">\n  <lrn-vocab term=\"[[display]]\">\n    <div>[[definition]]</div>\n  </lrn-vocab>\n</template>\n<template is=\"dom-if\" if=\"[[_fallback]]\">\n  <slot></slot>\n</template>"]);_templateObject_dfb38ad09c1611e9b169d9b24f90bf88=function _templateObject_dfb38ad09c1611e9b169d9b24f90bf88(){return data};return data}/**
 * `glossary-term`
 * ``
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var GlossaryTerm=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(GlossaryTerm,_PolymerElement);babelHelpers.createClass(GlossaryTerm,null,[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_dfb38ad09c1611e9b169d9b24f90bf88())}// haxProperty definition
},{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Glossary term",description:"",icon:"icons:android",color:"green",groups:["Term"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"heyMP",owner:"PSU"}},settings:{quick:[],configure:[{property:"name",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"},{property:"definition",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"},{property:"display",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"}],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{name:{name:"name",type:"String",value:"",reflectToAttribute:!1},definition:{name:"display",type:"String",value:"",reflectToAttribute:!1},display:{name:"display",type:"String",value:"",reflectToAttribute:!1},serviceType:{name:"serviceType",type:"String",value:"file"},endpoint:{name:"endpoint",type:"String",value:""},_fallback:{name:"_fallback",type:"Boolean",value:!0,reflectToAttribute:!1,observer:!1}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"glossary-term"}},{key:"observers",get:function get(){return[// Observer method name, followed by a list of dependencies, in parenthesis
"__endpointMethodChanged(endpoint, serviceType)"]}/**
   * life cycle, element is afixed to the DOM
   */}]);function GlossaryTerm(){var _this;babelHelpers.classCallCheck(this,GlossaryTerm);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(GlossaryTerm).call(this));_this.HAXWiring=new _HAXWiring.HAXWiring;_this.HAXWiring.setup(GlossaryTerm.haxProperties,GlossaryTerm.tag,babelHelpers.assertThisInitialized(babelHelpers.assertThisInitialized(_this)));return _this}babelHelpers.createClass(GlossaryTerm,[{key:"__endpointMethodChanged",value:function __endpointMethodChanged(endpoint,serviceType){var _this2=this;// fetch definition
if(endpoint){if("file"===serviceType){fetch(endpoint,{method:"GET",headers:{"Content-Type":"application/json"}}).then(function(r){return r.json()}).then(function(r){var foundterm=r.terms.find(function(i){return i.name===_this2.name});if(foundterm){_this2.definition=foundterm.definition;_this2._fallback=!1}else{_this2._fallback=!0}})}else if("graphql"===serviceType){fetch(this.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:"{ term(name: \"".concat(this.name,"\") { name definition } }")})}).then(function(r){return r.json()}).then(function(r){try{_this2.definition=r.data.term.definition;_this2._fallback=!1}catch(error){}})}}}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}]);return GlossaryTerm}(_polymerElement.PolymerElement);_exports.GlossaryTerm=GlossaryTerm;window.customElements.define(GlossaryTerm.tag,GlossaryTerm)});