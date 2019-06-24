define(["exports","./node_modules/@polymer/polymer/polymer-element.js"],function(_exports,_polymerElement){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.HaxTextEditor=void 0;function _templateObject_db8118407e6811e98fbd0f8a2880d585(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"]);_templateObject_db8118407e6811e98fbd0f8a2880d585=function _templateObject_db8118407e6811e98fbd0f8a2880d585(){return data};return data}/**
 * `hax-text-editor`
 * `rich-text-editor configured for HAX`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var HaxTextEditor=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(HaxTextEditor,_PolymerElement);function HaxTextEditor(){babelHelpers.classCallCheck(this,HaxTextEditor);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(HaxTextEditor).apply(this,arguments))}babelHelpers.createClass(HaxTextEditor,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(HaxTextEditor.prototype),"connectedCallback",this).call(this)}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_db8118407e6811e98fbd0f8a2880d585())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"hax-text-editor"}}]);return HaxTextEditor}(_polymerElement.PolymerElement);_exports.HaxTextEditor=HaxTextEditor;window.customElements.define(HaxTextEditor.tag,HaxTextEditor)});