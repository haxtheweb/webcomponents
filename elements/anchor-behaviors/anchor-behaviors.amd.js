define(["exports","./node_modules/@polymer/polymer/polymer-element.js"],function(_exports,_polymerElement){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.AnchorBehaviors=void 0;function _templateObject_0e2d2b90f72611e9ae999ba829a9f7c5(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"]);_templateObject_0e2d2b90f72611e9ae999ba829a9f7c5=function _templateObject_0e2d2b90f72611e9ae999ba829a9f7c5(){return data};return data}// register globally so we can make sure there is only one
window.AnchorBehaviors=window.AnchorBehaviors||{};// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same anchor-behaviors element, making it a singleton.
window.AnchorBehaviors.requestAvailability=function(){// if there is no single instance, generate one and append it to end of the document
if(!window.AnchorBehaviors.instance){window.AnchorBehaviors.instance=document.createElement("anchor-behaviors");document.body.appendChild(window.AnchorBehaviors.instance)}return window.AnchorBehaviors.instance};/**
 * `anchor-behaviors`
 * `handles anchors and params in the url`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var AnchorBehaviors=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(AnchorBehaviors,_PolymerElement);function AnchorBehaviors(){babelHelpers.classCallCheck(this,AnchorBehaviors);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(AnchorBehaviors).apply(this,arguments))}babelHelpers.createClass(AnchorBehaviors,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(AnchorBehaviors.prototype),"connectedCallback",this).call(this);window.addEventListener("anchor-behaviors-hide",this.hideAnchorBehaviors.bind(this));window.addEventListener("anchor-behaviors-show",this.showAnchorBehaviors.bind(this))}/**
   * life cycle, element is removed from the DOM
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(AnchorBehaviors.prototype),"connectedCallback",this).call(this);window.removeEventListener("anchor-behaviors-hide",this.hideAnchorBehaviors.bind(this));window.removeEventListener("anchor-behaviors-show",this.showAnchorBehaviors.bind(this))}/**
   * Hide callback
   */},{key:"hideAnchorBehaviors",value:function hideAnchorBehaviors(e){}// add your code to run when the singleton hides
/**
   * Show / available callback
   */},{key:"showAnchorBehaviors",value:function showAnchorBehaviors(e){// add your code to run when the singleton is called for
}}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_0e2d2b90f72611e9ae999ba829a9f7c5())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"anchor-behaviors"}}]);return AnchorBehaviors}(_polymerElement.PolymerElement);_exports.AnchorBehaviors=AnchorBehaviors;window.customElements.define(AnchorBehaviors.tag,AnchorBehaviors)});