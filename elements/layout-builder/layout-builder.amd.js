define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"],function(_exports,_polymerElement,_HAXWiring){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.LayoutBuilder=void 0;function _templateObject_2471c0e07ccf11e9941eeb7fe1ad970a(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"]);_templateObject_2471c0e07ccf11e9941eeb7fe1ad970a=function _templateObject_2471c0e07ccf11e9941eeb7fe1ad970a(){return data};return data}/**
 * `layout-builder`
 * `A new UI for adding content to layouts`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var LayoutBuilder=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(LayoutBuilder,_PolymerElement);function LayoutBuilder(){babelHelpers.classCallCheck(this,LayoutBuilder);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(LayoutBuilder).apply(this,arguments))}babelHelpers.createClass(LayoutBuilder,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(LayoutBuilder.prototype),"connectedCallback",this).call(this);this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(LayoutBuilder.haxProperties,LayoutBuilder.tag,this)}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_2471c0e07ccf11e9941eeb7fe1ad970a())}// haxProperty definition
},{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Layout builder",description:"A new UI for adding content to layouts",icon:"icons:android",color:"green",groups:["Builder"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"nikkimk",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"layout-builder"}}]);return LayoutBuilder}(_polymerElement.PolymerElement);_exports.LayoutBuilder=LayoutBuilder;window.customElements.define(LayoutBuilder.tag,LayoutBuilder)});