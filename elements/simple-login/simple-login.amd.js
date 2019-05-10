define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/polymer/lib/utils/render-status.js"],function(_exports,_polymerElement,_renderStatus){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.SimpleLogin=void 0;function _templateObject_25763c6072ba11e9bf4f8540eed4e791(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>\n<div>[[title]]</div>"]);_templateObject_25763c6072ba11e9bf4f8540eed4e791=function _templateObject_25763c6072ba11e9bf4f8540eed4e791(){return data};return data}/**
 * `simple-login`
 * `a simple login form`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var SimpleLogin=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(SimpleLogin,_PolymerElement);babelHelpers.createClass(SimpleLogin,null,[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_25763c6072ba11e9bf4f8540eed4e791())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{title:{name:"title",type:"String",value:"",reflectToAttribute:!1,observer:"_titleChanged"}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"simple-login"}/**
   * constructor
   */}]);function SimpleLogin(){babelHelpers.classCallCheck(this,SimpleLogin);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(SimpleLogin).call(this))}/**
   * life cycle, element is afixed to the DOM
   */babelHelpers.createClass(SimpleLogin,[{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(SimpleLogin.prototype),"connectedCallback",this).call(this)}/**
   * life cycle, element is removed from the DOM
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(SimpleLogin.prototype),"disconnectedCallback",this).call(this)}// Observer title for changes
},{key:"_titleChanged",value:function _titleChanged(newValue,oldValue){if(babelHelpers.typeof(newValue)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){console.log(newValue)}}}]);return SimpleLogin}(_polymerElement.PolymerElement);_exports.SimpleLogin=SimpleLogin;window.customElements.define(SimpleLogin.tag,SimpleLogin)});