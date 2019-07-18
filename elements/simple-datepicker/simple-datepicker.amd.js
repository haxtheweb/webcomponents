define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"],function(_exports,_polymerElement,_HAXWiring){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.SimpleDatepicker=void 0;function _templateObject_3de43c109d9011e99676e9f57033e220(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"]);_templateObject_3de43c109d9011e99676e9f57033e220=function _templateObject_3de43c109d9011e99676e9f57033e220(){return data};return data}/**
 * `simple-datepicker`
 * `a simple datepicker field`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var SimpleDatepicker=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(SimpleDatepicker,_PolymerElement);function SimpleDatepicker(){babelHelpers.classCallCheck(this,SimpleDatepicker);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(SimpleDatepicker).apply(this,arguments))}babelHelpers.createClass(SimpleDatepicker,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(SimpleDatepicker.prototype),"connectedCallback",this).call(this);this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(SimpleDatepicker.haxProperties,SimpleDatepicker.tag,this)}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_3de43c109d9011e99676e9f57033e220())}// haxProperty definition
},{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Simple datepicker",description:"a simple datepicker field",icon:"icons:android",color:"green",groups:["Datepicker"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"nikkimk",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"simple-datepicker"}}]);return SimpleDatepicker}(_polymerElement.PolymerElement);_exports.SimpleDatepicker=SimpleDatepicker;window.customElements.define(SimpleDatepicker.tag,SimpleDatepicker)});