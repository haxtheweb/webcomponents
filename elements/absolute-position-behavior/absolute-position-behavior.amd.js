define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./lib/absolute-position-state-manager.js"],function(_exports,_polymerElement,_absolutePositionStateManager){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.AbsolutePositionBehavior=void 0;function _templateObject_7c77ceb06a8211e98dbb453196bb7d63(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"]);_templateObject_7c77ceb06a8211e98dbb453196bb7d63=function _templateObject_7c77ceb06a8211e98dbb453196bb7d63(){return data};return data}/**
 * `absolute-position-behavior`
 * `Abstracting the positioning behavior from paper-tooltip to be resusable in other elements`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var AbsolutePositionBehavior=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(AbsolutePositionBehavior,_PolymerElement);function AbsolutePositionBehavior(){babelHelpers.classCallCheck(this,AbsolutePositionBehavior);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(AbsolutePositionBehavior).apply(this,arguments))}babelHelpers.createClass(AbsolutePositionBehavior,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(AbsolutePositionBehavior.prototype),"connectedCallback",this).call(this)}/**
   * life cycle, element is ready
   */},{key:"ready",value:function ready(){babelHelpers.get(babelHelpers.getPrototypeOf(AbsolutePositionBehavior.prototype),"ready",this).call(this);var root=this;root.__observe=!1;root.__manager=window.AbsolutePositionStateManager.requestAvailability();if(!0===root.auto){root.setPosition()}}},{key:"setPosition",value:function setPosition(){var root=this;root.__observe=!0;root.__manager.loadElement(root)}},{key:"unsetPosition",value:function unsetPosition(){var root=this;root.__observe=!1;root.__manager.unloadElement(root)}},{key:"updatePosition",value:function updatePosition(){var root=this;if(!0===root.__observe){root.__manager.updatePosition(root)}}/**
   * life cycle, element is removed from the DOM
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){this.unsetPosition();babelHelpers.get(babelHelpers.getPrototypeOf(AbsolutePositionBehavior.prototype),"disconnectedCallback",this).call(this)}}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_7c77ceb06a8211e98dbb453196bb7d63())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{/**
   * Element is positioned from connected to disconnected?
   * Otherwise setPosition and unsetPosition must be called manually.
   */auto:{type:Boolean,value:!1},/**
   * If true, no parts of the tooltip will ever be shown offscreen.
   */fitToVisibleBounds:{type:Boolean,value:!1,observer:"updatePosition"},/**
   * The id of the element that the tooltip is anchored to. This element
   * must be a sibling of the tooltip. If this property is not set,
   * then the tooltip will be centered to the parent node containing it.
   */for:{type:String,observer:"updatePosition"},/**
   * The spacing between the top of the tooltip and the element it is
   * anchored to.
   */offset:{type:Number,value:0},/**
   * Positions the tooltip to the top, right, bottom, left of its content.
   */position:{type:String,value:"bottom",observer:"updatePosition",reflectToAttribute:!0},/**
   * The actual target element
   */target:{type:Object,observer:"updatePosition"}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"absolute-position-behavior"}}]);return AbsolutePositionBehavior}(_polymerElement.PolymerElement);_exports.AbsolutePositionBehavior=AbsolutePositionBehavior;window.customElements.define(AbsolutePositionBehavior.tag,AbsolutePositionBehavior)});