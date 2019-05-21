define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/polymer/lib/utils/render-status.js"],function(_exports,_polymerElement,_renderStatus){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.ExampleHaxcmsTheme=void 0;function _templateObject_83dba2507bbf11e9a216ff39fdfe14ee(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>\n<div>[[editMode]]</div>"]);_templateObject_83dba2507bbf11e9a216ff39fdfe14ee=function _templateObject_83dba2507bbf11e9a216ff39fdfe14ee(){return data};return data}/**
 * `example-haxcms-theme`
 * `A basic, well documented example theme for HAXcms`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var ExampleHaxcmsTheme=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(ExampleHaxcmsTheme,_PolymerElement);babelHelpers.createClass(ExampleHaxcmsTheme,null,[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_83dba2507bbf11e9a216ff39fdfe14ee())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{editMode:{name:"editMode",type:"Boolean",value:"",reflectToAttribute:!0,observer:!1}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"example-haxcms-theme"}/**
   * constructor
   */}]);function ExampleHaxcmsTheme(){babelHelpers.classCallCheck(this,ExampleHaxcmsTheme);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(ExampleHaxcmsTheme).call(this))}/**
   * life cycle, element is afixed to the DOM
   */babelHelpers.createClass(ExampleHaxcmsTheme,[{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(ExampleHaxcmsTheme.prototype),"connectedCallback",this).call(this)}/**
   * life cycle, element is removed from the DOM
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(ExampleHaxcmsTheme.prototype),"disconnectedCallback",this).call(this)}}]);return ExampleHaxcmsTheme}(_polymerElement.PolymerElement);_exports.ExampleHaxcmsTheme=ExampleHaxcmsTheme;window.customElements.define(ExampleHaxcmsTheme.tag,ExampleHaxcmsTheme)});