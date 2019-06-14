define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"],function(_exports,_polymerElement,_HAXWiring){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.RelativeHeading=void 0;function _templateObject_5ac10af081c211e9bc162b1d237a0db2(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n:host([hidden]) {\n  display: none;\n}\n:host h1,\n:host h2,\n:host h3,\n:host h4,\n:host h5,\n:host h6 {\n  \n  @apply --relative-heading-style;\n}\n:host h1 {\n  @apply --relative-heading-h1;\n}\n:host h2 {\n  @apply --relative-heading-h2;\n}\n:host h3 {\n  @apply --relative-heading-h3;\n}\n:host h4 {\n  @apply --relative-heading-h4;\n}\n:host h5 {\n  @apply --relative-heading-h5;\n}\n:host h6 {\n  @apply --relative-heading-h6;\n}</style>\n<h1 aria-live=\"polite\" hidden=\"[[!__isLevel1]]\">[[text]]</h1>\n<h2 aria-live=\"polite\" hidden=\"[[!__isLevel2]]\">[[text]]</h2>\n<h3 aria-live=\"polite\" hidden=\"[[!__isLevel3]]\">[[text]]</h3>\n<h4 aria-live=\"polite\" hidden=\"[[!__isLevel4]]\">[[text]]</h4>\n<h5 aria-live=\"polite\" hidden=\"[[!__isLevel5]]\">[[text]]</h5>\n<h6 aria-live=\"polite\" hidden=\"[[!__isLevel6]]\">[[text]]</h6>"]);_templateObject_5ac10af081c211e9bc162b1d237a0db2=function _templateObject_5ac10af081c211e9bc162b1d237a0db2(){return data};return data}/**
 * `relative-heading`
 * `outputs the correct heading hierarchy based on parent&#39;s heading`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var RelativeHeading=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(RelativeHeading,_PolymerElement);function RelativeHeading(){babelHelpers.classCallCheck(this,RelativeHeading);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(RelativeHeading).apply(this,arguments))}babelHelpers.createClass(RelativeHeading,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(RelativeHeading.prototype),"connectedCallback",this).call(this);this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(RelativeHeading.haxProperties,RelativeHeading.tag,this)}/**
   * update this level when the parent id changes
   */},{key:"_getLevel",value:function _getLevel(parentId,defaultLevel){var root=this,parent=document.querySelector("#"+parentId),parentLvl=null!==parent&&parent.level!==void 0?parent.level:defaultLevel-1,level=6>parentLvl?parentLvl+1:6;return level}},{key:"_updateChildren",value:function _updateChildren(){var _this=this;document.querySelectorAll("relative-heading[parent-id=\""+this.id+"\"]").forEach(function(child){child.parentId=null;child.parentId=_this.id})}/**
   * determines if the level matches a specific level
   *
   * @param {number} the heading level
   * @param {number} the level it might match
   * @returns {boolean} whether or not they match
   */},{key:"_isLevel",value:function _isLevel(level,testLevel){return level===testLevel}/**
   * life cycle, element is removed from the DOM
   * /
  disconnectedCallback() {
  }*/}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_5ac10af081c211e9bc162b1d237a0db2())}// haxProperty definition
},{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Relative heading",description:"outputs the correct heading hierarchy based on parent's heading",icon:"icons:android",color:"green",groups:["Heading"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"nikkimk",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[{property:"parentHeading",description:"",inputMethod:"array",required:!1,icon:"icons:android"},{property:"tag",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"}],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{/**
   * The default heading level (1-6), eg., 1 for <h1>, if there  is no parent.
   */defaultLevel:{name:"defaultLevel",type:"Number",value:1},/**
   * The relative-heading's UUID.
   */id:{name:"id",type:"String",value:null,observer:"_updateChildren"},/**
   * The parent relative-heading's UUID.
   */parentId:{name:"parentId",type:"String",value:null},/**
   * The heading text.
   */text:{name:"text",type:"String",value:null},/**
   * The heading level (1-6), eg., 1 for <h1>
   */level:{name:"level",type:"Number",reflectToAttribute:!0,computed:"_getLevel(parentId,defaultLevel)",observer:"_updateChildren"},/**
   * Is the heading an h1?
   */__isLevel1:{name:"__isLevel1",type:"Boolean",computed:"_isLevel(level,1)"},/**
   * Is the heading an h2?
   */__isLevel2:{name:"__isLevel2",type:"Boolean",computed:"_isLevel(level,2)"},/**
   * Is the heading an h3?
   */__isLevel3:{name:"__isLevel3",type:"Boolean",computed:"_isLevel(level,3)"},/**
   * Is the heading an h4?
   */__isLevel4:{name:"__isLevel4",type:"Boolean",computed:"_isLevel(level,4)"},/**
   * Is the heading an h5?
   */__isLevel5:{name:"__isLevel5",type:"Boolean",computed:"_isLevel(level,5)"},/**
   * Is the heading an h6?
   */__isLevel6:{name:"__isLevel6",type:"Boolean",computed:"_isLevel(level,6)"}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"relative-heading"}}]);return RelativeHeading}(_polymerElement.PolymerElement);_exports.RelativeHeading=RelativeHeading;window.customElements.define(RelativeHeading.tag,RelativeHeading)});