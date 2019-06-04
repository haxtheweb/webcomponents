define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/polymer/lib/utils/render-status.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"],function(_exports,_polymerElement,_renderStatus,_HAXWiring){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.RssItems=void 0;function _templateObject_8d5d5bc0868c11e9b595055eb59c0ac6(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"]);_templateObject_8d5d5bc0868c11e9b595055eb59c0ac6=function _templateObject_8d5d5bc0868c11e9b595055eb59c0ac6(){return data};return data}/**
 * `rss-items`
 * `visualize RSS items`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var RssItems=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(RssItems,_PolymerElement);babelHelpers.createClass(RssItems,null,[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_8d5d5bc0868c11e9b595055eb59c0ac6())}// haxProperty definition
},{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Rss items",description:"visualize RSS items",icon:"icons:android",color:"green",groups:["Items"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){var props={};if(babelHelpers.get(babelHelpers.getPrototypeOf(RssItems),"properties",this)){props=Object.assign(props,babelHelpers.get(babelHelpers.getPrototypeOf(RssItems),"properties",this))}return props}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"rss-items"}/**
   * constructor
   */}]);function RssItems(){babelHelpers.classCallCheck(this,RssItems);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(RssItems).call(this))}/**
   * life cycle, element is afixed to the DOM
   */babelHelpers.createClass(RssItems,[{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(RssItems.prototype),"connectedCallback",this).call(this);this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(RssItems.haxProperties,RssItems.tag,this)}/**
   * life cycle, element is removed from the DOM
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(RssItems.prototype),"disconnectedCallback",this).call(this)}}]);return RssItems}(_polymerElement.PolymerElement);_exports.RssItems=RssItems;window.customElements.define(RssItems.tag,RssItems)});