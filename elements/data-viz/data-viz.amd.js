define(["exports","./node_modules/@polymer/polymer/polymer-element.js"],function(_exports,_polymerElement){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.DataViz=void 0;function _templateObject_a3992bb0825b11e9b1dfd1d57053ccbb(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>\n<div>[[title]]</div>"]);_templateObject_a3992bb0825b11e9b1dfd1d57053ccbb=function _templateObject_a3992bb0825b11e9b1dfd1d57053ccbb(){return data};return data}// register globally so we can make sure there is only one
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
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(DataViz.prototype),"connectedCallback",this).call(this);window.addEventListener("data-viz-hide",this.hideDataViz.bind(this));window.addEventListener("data-viz-show",this.showDataViz.bind(this))}/**
   * life cycle, element is removed from the DOM
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(DataViz.prototype),"connectedCallback",this).call(this);window.removeEventListener("data-viz-hide",this.hideDataViz.bind(this));window.removeEventListener("data-viz-show",this.showDataViz.bind(this))}/**
   * Hide callback
   */},{key:"hideDataViz",value:function hideDataViz(e){}// add your code to run when the singleton hides
/**
   * Show / available callback
   */},{key:"showDataViz",value:function showDataViz(e){// add your code to run when the singleton is called for
}}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_a3992bb0825b11e9b1dfd1d57053ccbb())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{title:{name:"title",type:"String",value:"data-viz-default-value",reflectToAttribute:!1,observer:!1}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"data-viz"}}]);return DataViz}(_polymerElement.PolymerElement);_exports.DataViz=DataViz;window.customElements.define(DataViz.tag,DataViz)});