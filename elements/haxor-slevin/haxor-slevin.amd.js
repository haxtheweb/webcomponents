define(["exports","./node_modules/@polymer/polymer/polymer-element.js"],function(_exports,_polymerElement){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.HaxorSlevin=void 0;function _templateObject_5d9661c0668911e9afc3d1e48c484006(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"]);_templateObject_5d9661c0668911e9afc3d1e48c484006=function _templateObject_5d9661c0668911e9afc3d1e48c484006(){return data};return data}/**
 * `haxor-slevin`
 * `Tech blogger theme`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var HaxorSlevin=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(HaxorSlevin,_PolymerElement);function HaxorSlevin(){babelHelpers.classCallCheck(this,HaxorSlevin);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(HaxorSlevin).apply(this,arguments))}babelHelpers.createClass(HaxorSlevin,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(HaxorSlevin.prototype),"connectedCallback",this).call(this)}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_5d9661c0668911e9afc3d1e48c484006())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"haxor-slevin"}}]);return HaxorSlevin}(_polymerElement.PolymerElement);_exports.HaxorSlevin=HaxorSlevin;window.customElements.define(HaxorSlevin.tag,HaxorSlevin)});