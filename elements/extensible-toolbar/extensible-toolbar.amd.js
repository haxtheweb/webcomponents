define(["exports","./node_modules/lit-element/lit-element.js"],function(_exports,_litElement){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.ExtensibleToolbar=void 0;function _templateObject_204c41b01a9111ea8e33d572942cb4df(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"]);_templateObject_204c41b01a9111ea8e33d572942cb4df=function _templateObject_204c41b01a9111ea8e33d572942cb4df(){return data};return data}/**
 * `extensible-toolbar`
 * `a toolbar that can be customised with with mixins and json`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */var ExtensibleToolbar=/*#__PURE__*/function(_LitElement){babelHelpers.inherits(ExtensibleToolbar,_LitElement);babelHelpers.createClass(ExtensibleToolbar,[{key:"render",// render function
value:function render(){return(0,_litElement.html)(_templateObject_204c41b01a9111ea8e33d572942cb4df())}// properties available to the custom element for data binding
},{key:"tag",/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */value:function tag(){return"extensible-toolbar"}// life cycle
}],[{key:"properties",get:function get(){return{}}}]);function ExtensibleToolbar(){var _this;babelHelpers.classCallCheck(this,ExtensibleToolbar);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(ExtensibleToolbar).call(this));_this.tag=ExtensibleToolbar.tag;// map our imported properties json to real props on the element
// @notice static getter of properties is built via tooling
// to edit modify src/extensible-toolbar-properties.json
var obj=ExtensibleToolbar.properties;for(var p in obj){if(obj.hasOwnProperty(p)){if(_this.hasAttribute(p)){_this[p]=_this.getAttribute(p)}else{_this.setAttribute(p,obj[p].value);_this[p]=obj[p].value}}}return _this}/**
   * life cycle, element is afixed to the DOM
   */babelHelpers.createClass(ExtensibleToolbar,[{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(ExtensibleToolbar.prototype),"connectedCallback",this).call(this)}// static get observedAttributes() {
//   return [];
// }
// disconnectedCallback() {}
// attributeChangedCallback(attr, oldValue, newValue) {}
}]);return ExtensibleToolbar}(_litElement.LitElement);_exports.ExtensibleToolbar=ExtensibleToolbar;customElements.define("extensible-toolbar",ExtensibleToolbar)});