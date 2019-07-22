define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/chartist-render/chartist-render.js"],function(_exports,_polymerElement,_chartistRender){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.DataViz=void 0;function _templateObject_4728d490ab1211e9a66de3f2d1f3037e(){var data=babelHelpers.taggedTemplateLiteral(["\n      <chartist-render\n        id=\"barChart\"\n        type=\"bar\"\n        scale=\"ct-major-twelfth\"\n        chart-title=\"Quiz Distribution\"\n        chart-desc=\"A bar graph of quizzes completed by student\"\n      >\n      </chartist-render>\n    "]);_templateObject_4728d490ab1211e9a66de3f2d1f3037e=function _templateObject_4728d490ab1211e9a66de3f2d1f3037e(){return data};return data}// register globally so we can make sure there is only one
window.DataViz=window.DataViz||{};// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same data-viz element, making it a singleton.
window.DataViz.requestAvailability=function(){// if there is no single instance, generate one and append it to end of the document
if(!window.DataViz.instance){window.DataViz.instance=document.createElement("data-viz");document.body.appendChild(window.DataViz.instance)}return window.DataViz.instance};/**
 * `data-viz`
 * `display pouch-db data using graphs`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var DataViz=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(DataViz,_PolymerElement);function DataViz(){babelHelpers.classCallCheck(this,DataViz);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(DataViz).apply(this,arguments))}babelHelpers.createClass(DataViz,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(DataViz.prototype),"connectedCallback",this).call(this);window.addEventListener("show-data",this.showDataFunction.bind(this))}/**
   * Show the data based on user selecting the view and
   * that they want to see how they did.
   */},{key:"showDataFunction",value:function showDataFunction(e){var queryData=e.detail,whatEvent=event.target.tagName,bardata={labels:queryData.labels,series:queryData.series};this.$.barChart.data=bardata}/**
   * life cycle, element is removed from the DOM
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(DataViz.prototype),"disconnectedCallback",this).call(this);window.removeEventListener("show-data",this.showDataFunction.bind(this))}/**
   * Hide callback
   */},{key:"hideDataViz",value:function hideDataViz(e){}// add your code to run when the singleton hides
/**
   * Show / available callback
   */},{key:"showDataViz",value:function showDataViz(e){// add your code to run when the singleton is called for
}}],[{key:"template",get:function get(){return(0,_polymerElement.html)(_templateObject_4728d490ab1211e9a66de3f2d1f3037e())}},{key:"properties",// properties available to the custom element for data binding
get:function get(){return{title:{name:"title",type:"String",value:"data-viz-default-value",reflectToAttribute:!1,observer:!1}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"data-viz"}}]);return DataViz}(_polymerElement.PolymerElement);_exports.DataViz=DataViz;window.customElements.define(DataViz.tag,DataViz)});