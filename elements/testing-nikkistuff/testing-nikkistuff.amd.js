define(["exports","./node_modules/@polymer/polymer/polymer-element.js"],function(_exports,_polymerElement){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.TestingNikkistuff=void 0;function _templateObject_9ef58820b2ca11e9a9fb651463ba2ada(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>\n\n\n:host {\n  display: block; }\n\n:host([hidden]) {\n  display: none; }\n</style>\n<slot></slot>"]);_templateObject_9ef58820b2ca11e9a9fb651463ba2ada=function _templateObject_9ef58820b2ca11e9a9fb651463ba2ada(){return data};return data}/**
 * `testing-nikkistuff`
 * `...`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var TestingNikkistuff=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(TestingNikkistuff,_PolymerElement);function TestingNikkistuff(){babelHelpers.classCallCheck(this,TestingNikkistuff);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(TestingNikkistuff).apply(this,arguments))}babelHelpers.createClass(TestingNikkistuff,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(TestingNikkistuff.prototype),"connectedCallback",this).call(this)}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_9ef58820b2ca11e9a9fb651463ba2ada())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"testing-nikkistuff"}}]);return TestingNikkistuff}(_polymerElement.PolymerElement);_exports.TestingNikkistuff=TestingNikkistuff;window.customElements.define(TestingNikkistuff.tag,TestingNikkistuff)});