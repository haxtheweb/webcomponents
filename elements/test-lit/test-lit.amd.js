define(["exports","./node_modules/lit-element/lit-element.js"],function(_exports,_litElement){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.TestLit=void 0;function _templateObject_bad160c0fb2011e9a85651a89a4b9df7(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>\n<div>","</div>"]);_templateObject_bad160c0fb2011e9a85651a89a4b9df7=function _templateObject_bad160c0fb2011e9a85651a89a4b9df7(){return data};return data}/**
 * `test-lit`
 * `ebbteb`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */var TestLit=/*#__PURE__*/function(_LitElement){babelHelpers.inherits(TestLit,_LitElement);babelHelpers.createClass(TestLit,[{key:"render",// render function
value:function render(){return(0,_litElement.html)(_templateObject_bad160c0fb2011e9a85651a89a4b9df7(),this.tth)}// properties available to the custom element for data binding
},{key:"tag",/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */value:function tag(){return"test-lit"}// life cycle
}],[{key:"properties",get:function get(){return{tth:{name:"tth",type:"String",value:"",reflectToAttribute:!1,observer:"_tthChanged"}}}}]);function TestLit(){var _this;babelHelpers.classCallCheck(this,TestLit);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(TestLit).call(this));_this.tag=TestLit.tag;// map our imported properties json to real props on the element
// @notice static getter of properties is built via tooling
// to edit modify src/test-lit-properties.json
var obj=TestLit.properties;for(var p in obj){if(obj.hasOwnProperty(p)){if(_this.hasAttribute(p)){_this[p]=_this.getAttribute(p)}else{_this.setAttribute(p,obj[p].value);_this[p]=obj[p].value}}}return _this}/**
   * life cycle, element is afixed to the DOM
   */babelHelpers.createClass(TestLit,[{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(TestLit.prototype),"connectedCallback",this).call(this)}// static get observedAttributes() {
//   return [];
// }
// disconnectedCallback() {}
// attributeChangedCallback(attr, oldValue, newValue) {}
// Observer tth for changes
},{key:"_tthChanged",value:function _tthChanged(newValue,oldValue){if(babelHelpers.typeof(newValue)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){console.log(newValue)}}}]);return TestLit}(_litElement.LitElement);_exports.TestLit=TestLit;customElements.define("test-lit",TestLit)});