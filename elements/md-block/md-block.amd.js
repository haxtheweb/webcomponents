define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js","./node_modules/@polymer/marked-element/marked-element.js"],function(_exports,_polymerElement,_HAXWiring,_markedElement){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.MdBlock=void 0;function _templateObject_12cdb36081c211e981c0533ff5701197(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<div>\n<marked-element markdown=\"[[markdown]]\">\n    <div slot=\"markdown-html\"></div>\n    <script type=\"text/markdown\" src$=\"[[source]]\"></script>\n</marked-element>\n</div>"]);_templateObject_12cdb36081c211e981c0533ff5701197=function _templateObject_12cdb36081c211e981c0533ff5701197(){return data};return data}/**
 * `md-block`
 * `a markdown block`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var MdBlock=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(MdBlock,_PolymerElement);function MdBlock(){babelHelpers.classCallCheck(this,MdBlock);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(MdBlock).apply(this,arguments))}babelHelpers.createClass(MdBlock,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(MdBlock.prototype),"connectedCallback",this).call(this);this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(MdBlock.haxProperties,MdBlock.tag,this)}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_12cdb36081c211e981c0533ff5701197())}// haxProperty definition
},{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Markdown",description:"A block of markdown content directly or remote loaded",icon:"icons:code",color:"yellow",groups:["Block"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[{property:"source",title:"Source",description:"Source file for markdown",inputMethod:"textfield",icon:"icons:link"}],configure:[{property:"markdown",title:"Markdown",description:"Raw markdown",inputMethod:"code-editor"},{property:"source",title:"Source",description:"Source file for markdown",inputMethod:"haxupload"}],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{source:{name:"source",type:"String"},markdown:{name:"markdown",type:"String"}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"md-block"}}]);return MdBlock}(_polymerElement.PolymerElement);_exports.MdBlock=MdBlock;window.customElements.define(MdBlock.tag,MdBlock)});