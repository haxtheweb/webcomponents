define(["exports","require","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js","./node_modules/@polymer/polymer/lib/elements/dom-if.js"],function(_exports,_require,_polymerElement,_HAXWiring,_domIf){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.MdBlock=void 0;_require=babelHelpers.interopRequireWildcard(_require);function _templateObject_4d5c9700ab1411e9bc1163b2b5374b5f(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<div>\n<marked-element markdown=\"[[markdown]]\">\n    <div slot=\"markdown-html\"></div>\n    <dom-if if=\"[[hasSource]]\">\n      <script type=\"text/markdown\" src$=\"[[source]]\"></script>\n    </dom-if>\n</marked-element>\n</div>"]);_templateObject_4d5c9700ab1411e9bc1163b2b5374b5f=function _templateObject_4d5c9700ab1411e9bc1163b2b5374b5f(){return data};return data}/**
 * `md-block`
 * `a markdown block`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var MdBlock=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(MdBlock,_PolymerElement);babelHelpers.createClass(MdBlock,null,[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_4d5c9700ab1411e9bc1163b2b5374b5f())}// haxProperty definition
},{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Markdown",description:"A block of markdown content directly or remote loaded",icon:"icons:code",color:"yellow",groups:["Block"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[{property:"source",title:"Source",description:"Source file for markdown",inputMethod:"textfield",icon:"icons:link"}],configure:[{property:"markdown",title:"Markdown",description:"Raw markdown",inputMethod:"code-editor"},{property:"source",title:"Source",description:"Source file for markdown",inputMethod:"haxupload"}],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){var props={source:{name:"source",type:String},hasSource:{name:"hasSource",type:Boolean,computed:"_calculateHasSource(source)"},markdown:{name:"markdown",type:String}};if(babelHelpers.get(babelHelpers.getPrototypeOf(MdBlock),"properties",this)){props=Object.assign(props,babelHelpers.get(babelHelpers.getPrototypeOf(MdBlock),"properties",this))}return props}}]);function MdBlock(){var _this;babelHelpers.classCallCheck(this,MdBlock);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(MdBlock).call(this));new Promise(function(res,rej){return _require.default(["./node_modules/@polymer/marked-element/marked-element.js"],res,rej)});return _this}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */babelHelpers.createClass(MdBlock,[{key:"_calculateHasSource",/**
   * Calculate visibility of the source response
   */value:function _calculateHasSource(source){if(source&&""!=source){return!0}this.source=null;return!1}/**
   * life cycle, element is afixed to the DOM
   */},{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(MdBlock.prototype),"connectedCallback",this).call(this);this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(MdBlock.haxProperties,MdBlock.tag,this)}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}],[{key:"tag",get:function get(){return"md-block"}}]);return MdBlock}(_polymerElement.PolymerElement);_exports.MdBlock=MdBlock;window.customElements.define(MdBlock.tag,MdBlock)});