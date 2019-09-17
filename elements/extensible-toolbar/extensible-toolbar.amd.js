define(["exports","./node_modules/@polymer/polymer/polymer-element.js"],function(_exports,_polymerElement){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.ExtensibleToolbar=void 0;function _templateObject_f4c5c1d0d8b211e9a038b1f048479700(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>\n<div>[[hidden]]</div>\n<div>[[buttons]]</div>"]);_templateObject_f4c5c1d0d8b211e9a038b1f048479700=function _templateObject_f4c5c1d0d8b211e9a038b1f048479700(){return data};return data}/**
 * `extensible-toolbar`
 * `a toolbar UI that can be customized and extended`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var ExtensibleToolbar=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(ExtensibleToolbar,_PolymerElement);function ExtensibleToolbar(){babelHelpers.classCallCheck(this,ExtensibleToolbar);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(ExtensibleToolbar).apply(this,arguments))}babelHelpers.createClass(ExtensibleToolbar,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(ExtensibleToolbar.prototype),"connectedCallback",this).call(this)}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
// Observer buttons for changes
},{key:"_buttonsChanged",value:function _buttonsChanged(newValue,oldValue){if(babelHelpers.typeof(newValue)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){console.log(newValue)}}}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_f4c5c1d0d8b211e9a038b1f048479700())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{hidden:{name:"hidden",type:"Boolean",value:"false",reflectToAttribute:!0,observer:!1},buttons:{name:"buttons",type:"Array",value:"[]",reflectToAttribute:!1,observer:"_buttonsChanged"}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"extensible-toolbar"}}]);return ExtensibleToolbar}(_polymerElement.PolymerElement);_exports.ExtensibleToolbar=ExtensibleToolbar;window.customElements.define(ExtensibleToolbar.tag,ExtensibleToolbar)});