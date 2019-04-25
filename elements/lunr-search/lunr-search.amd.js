define(["exports","./node_modules/@polymer/polymer/polymer-element.js"],function(_exports,_polymerElement){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.LunrSearch=void 0;function _templateObject_4c3e5380676d11e98fc63f609183fa84(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>\n<div>[[dataSource]]</div>\n<div>[[results]]</div>"]);_templateObject_4c3e5380676d11e98fc63f609183fa84=function _templateObject_4c3e5380676d11e98fc63f609183fa84(){return data};return data}/**
 * `lunr-search`
 * `LunrJS search element`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var LunrSearch=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(LunrSearch,_PolymerElement);function LunrSearch(){babelHelpers.classCallCheck(this,LunrSearch);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(LunrSearch).apply(this,arguments))}babelHelpers.createClass(LunrSearch,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(LunrSearch.prototype),"connectedCallback",this).call(this)}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
// Observer dataSource for changes
},{key:"_dataSourceChanged",value:function _dataSourceChanged(newValue,oldValue){if(babelHelpers.typeof(newValue)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){console.log(newValue)}}// Observer results for changes
},{key:"_resultsChanged",value:function _resultsChanged(newValue,oldValue){if(babelHelpers.typeof(newValue)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){console.log(newValue)}}}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_4c3e5380676d11e98fc63f609183fa84())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{dataSource:{name:"dataSource",type:"String",value:"",reflectToAttribute:!1,observer:"_dataSourceChanged"},results:{name:"results",type:"Array",value:"",reflectToAttribute:!1,observer:"_resultsChanged"}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"lunr-search"}}]);return LunrSearch}(_polymerElement.PolymerElement);_exports.LunrSearch=LunrSearch;window.customElements.define(LunrSearch.tag,LunrSearch)});