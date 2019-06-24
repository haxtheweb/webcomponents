define(["exports","./node_modules/@polymer/polymer/polymer-element.js"],function(_exports,_polymerElement){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.HaxIconset=void 0;function _templateObject_fd6c06b07e6611e9843895af6dcbc08e(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"]);_templateObject_fd6c06b07e6611e9843895af6dcbc08e=function _templateObject_fd6c06b07e6611e9843895af6dcbc08e(){return data};return data}// register globally so we can make sure there is only one
window.HaxIconset=window.HaxIconset||{};// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same hax-iconset element, making it a singleton.
window.HaxIconset.requestAvailability=function(){// if there is no single instance, generate one and append it to end of the document
if(!window.HaxIconset.instance){window.HaxIconset.instance=document.createElement("hax-iconset");document.body.appendChild(window.HaxIconset.instance)}return window.HaxIconset.instance};/**
 * `hax-iconset`
 * `HAX-specific icons`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var HaxIconset=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(HaxIconset,_PolymerElement);function HaxIconset(){babelHelpers.classCallCheck(this,HaxIconset);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(HaxIconset).apply(this,arguments))}babelHelpers.createClass(HaxIconset,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(HaxIconset.prototype),"connectedCallback",this).call(this);window.addEventListener("hax-iconset-hide",this.hideHaxIconset.bind(this));window.addEventListener("hax-iconset-show",this.showHaxIconset.bind(this))}/**
   * life cycle, element is removed from the DOM
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(HaxIconset.prototype),"connectedCallback",this).call(this);window.removeEventListener("hax-iconset-hide",this.hideHaxIconset.bind(this));window.removeEventListener("hax-iconset-show",this.showHaxIconset.bind(this))}/**
   * Hide callback
   */},{key:"hideHaxIconset",value:function hideHaxIconset(e){}// add your code to run when the singleton hides
/**
   * Show / available callback
   */},{key:"showHaxIconset",value:function showHaxIconset(e){// add your code to run when the singleton is called for
}}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_fd6c06b07e6611e9843895af6dcbc08e())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"hax-iconset"}}]);return HaxIconset}(_polymerElement.PolymerElement);_exports.HaxIconset=HaxIconset;window.customElements.define(HaxIconset.tag,HaxIconset)});