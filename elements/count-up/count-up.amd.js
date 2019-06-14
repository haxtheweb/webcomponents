define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js","./node_modules/countup.js/dist/countUp.min.js"],function(_exports,_polymerElement,_HAXWiring,_countUpMin){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});Object.defineProperty(_exports,"CountUp",{enumerable:!0,get:function get(){return _countUpMin.CountUp}});_exports.CountUpElement=void 0;function _templateObject_7c98a30081c111e981f08108b7d3c278(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: inline-flex;\n  --count-up-color: #000000;\n}\n\n:host([hidden]) {\n  display: none;\n}\n\n.wrapper {\n  display: block;\n  text-align: center;\n  width: 100%;\n  height: 100%;\n}\n\n#counter {\n  color: var(--count-up-color);\n  @apply --count-up-number;\n}\n</style>\n<div class=\"wrapper\">\n  <slot name=\"prefix\"></slot>\n  <div id=\"counter\"></div>\n  <slot name=\"suffix\"></slot>\n</div>"]);_templateObject_7c98a30081c111e981f08108b7d3c278=function _templateObject_7c98a30081c111e981f08108b7d3c278(){return data};return data}/**
 * `count-up`
 * `count up js wrapper with minimal styling`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */var CountUpElement=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(CountUpElement,_PolymerElement);function CountUpElement(){babelHelpers.classCallCheck(this,CountUpElement);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(CountUpElement).apply(this,arguments))}babelHelpers.createClass(CountUpElement,[{key:"tag",/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */value:function tag(){return"count-up"}/**
   * life cycle, element is afixed to the DOM
   */},{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(CountUpElement.prototype),"connectedCallback",this).call(this);this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(CountUpElement.haxProperties,"count-up",this);// setup the intersection observer
this.observer=new IntersectionObserver(this.handleIntersectionCallback.bind(this),{root:document.rootElement,rootMargin:this.rootMargin,threshold:this.thresholds});this.observer.observe(this);var options={startVal:this.start,decimalPlaces:this.decimalplaces,duration:this.duration,useEasing:!this.noeasing,separator:this.separator,decimal:this.decimal,prefix:this.prefixtext,suffix:this.suffixtext};this._countUp=new _countUpMin.CountUp(this.$.counter,this.end,options)}},{key:"handleIntersectionCallback",value:function handleIntersectionCallback(entries){var _iteratorNormalCompletion=!0,_didIteratorError=!1,_iteratorError=void 0;try{for(var _iterator=entries[Symbol.iterator](),_step,entry;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=!0){entry=_step.value;this._setRatio((+entry.intersectionRatio).toFixed(2));if(this.ratio>=this.visibleLimit){// now we care
this._countUp.start()}}}catch(err){_didIteratorError=!0;_iteratorError=err}finally{try{if(!_iteratorNormalCompletion&&null!=_iterator.return){_iterator.return()}}finally{if(_didIteratorError){throw _iteratorError}}}}// static get observedAttributes() {
//   return [];
// }
// disconnectedCallback() {}
// attributeChangedCallback(attr, oldValue, newValue) {}
}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_7c98a30081c111e981f08108b7d3c278())}// haxProperty definition
},{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Count up",description:"count up js wrapper with minimal styling",icon:"icons:android",color:"green",groups:["Up"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[{property:"start",description:"",inputMethod:"textfield"},{property:"end",description:"",inputMethod:"textfield"},{property:"duration",description:"",inputMethod:"textfield"},{property:"noeasing",description:"",inputMethod:"boolean"},{property:"decimalplaces",description:"",inputMethod:"textfield"},{property:"separator",description:"",inputMethod:"textfield"},{property:"decimal",description:"",inputMethod:"textfield"},{property:"prefix",description:"",inputMethod:"textfield"},{property:"suffix",description:"",inputMethod:"textfield"}],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{/**
   * Starting point for counting
   */start:{name:"start",type:"Number",value:0},/**
   * End point for counting stopping
   */end:{name:"end",type:"Number",value:100},/**
   * Duration to count
   */duration:{name:"duration",type:"Number",value:2.5},/**
   * Disable easing animation
   */noeasing:{name:"noeasing",type:"Boolean",value:!1},/**
   * decimal places to show
   */decimalplaces:{name:"decimalPlaces",type:"Number",value:0},/**
   * separator for 100s groupings
   */separator:{name:"separator",type:"String",value:","},/**
   * decimal point character
   */decimal:{name:"decimal",type:"String",value:"."},/**
   * prefix string before the number counting
   */prefixtext:{name:"prefixtext",type:"String",value:" "},/**
   * suffix string after the number counting
   */suffixtext:{name:"suffixtext",type:"String",value:" "},thresholds:{type:"Array",value:[0,.25,.5,.75,1]},rootMargin:{type:"String",value:"0px"},ratio:{type:"Number",reflectToAttribute:!0,readOnly:!0},visibleLimit:{type:"Number",value:.5,reflectToAttribute:!0}}}}]);return CountUpElement}(_polymerElement.PolymerElement);_exports.CountUpElement=CountUpElement;customElements.define("count-up",CountUpElement)});