define(["exports","./node_modules/lit-element/lit-element.js"],function(_exports,_litElement){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.SimpleColorsSharedStyles=void 0;function _templateObject_50c0ac60b49211e9aedf21b78b70e69c(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>\n\n\n:host {\n  display: block; }\n\n:host([hidden]) {\n  display: none; }\n</style>\n<slot></slot>"]);_templateObject_50c0ac60b49211e9aedf21b78b70e69c=function _templateObject_50c0ac60b49211e9aedf21b78b70e69c(){return data};return data}/**
 * `simple-colors-shared-styles`
 * `shared styles for simple-colors`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */var SimpleColorsSharedStyles=/*#__PURE__*/function(_LitElement){babelHelpers.inherits(SimpleColorsSharedStyles,_LitElement);babelHelpers.createClass(SimpleColorsSharedStyles,[{key:"render",// render function
value:function render(){return(0,_litElement.html)(_templateObject_50c0ac60b49211e9aedf21b78b70e69c())}// properties available to the custom element for data binding
},{key:"tag",/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */value:function tag(){return"simple-colors-shared-styles"}// life cycle
}],[{key:"properties",get:function get(){return{}}}]);function SimpleColorsSharedStyles(){var _this;babelHelpers.classCallCheck(this,SimpleColorsSharedStyles);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(SimpleColorsSharedStyles).call(this));_this.tag=SimpleColorsSharedStyles.tag;// map our imported properties json to real props on the element
// @notice static getter of properties is built via tooling
// to edit modify src/simple-colors-shared-styles-properties.json
var obj=SimpleColorsSharedStyles.properties;for(var p in obj){if(obj.hasOwnProperty(p)){if(_this.hasAttribute(p)){_this[p]=_this.getAttribute(p)}else{_this.setAttribute(p,obj[p].value);_this[p]=obj[p].value}}}return _this}/**
   * life cycle, element is afixed to the DOM
   */babelHelpers.createClass(SimpleColorsSharedStyles,[{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(SimpleColorsSharedStyles.prototype),"connectedCallback",this).call(this)}// static get observedAttributes() {
//   return [];
// }
// disconnectedCallback() {}
// attributeChangedCallback(attr, oldValue, newValue) {}
}]);return SimpleColorsSharedStyles}(_litElement.LitElement);_exports.SimpleColorsSharedStyles=SimpleColorsSharedStyles;customElements.define("simple-colors-shared-styles",SimpleColorsSharedStyles)});