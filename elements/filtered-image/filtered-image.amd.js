define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"],function(_exports,_polymerElement,_HAXWiring){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.FilteredImage=void 0;function _templateObject_173bd880719311e9b7a5f5858924fb06(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>\n<div>[[src]]</div>\n<div>[[alt]]</div>"]);_templateObject_173bd880719311e9b7a5f5858924fb06=function _templateObject_173bd880719311e9b7a5f5858924fb06(){return data};return data}/**
 * `filtered-image`
 * `An image using an SVG filter. Can be used to make background images have more contrast with text.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var FilteredImage=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(FilteredImage,_PolymerElement);function FilteredImage(){babelHelpers.classCallCheck(this,FilteredImage);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(FilteredImage).apply(this,arguments))}babelHelpers.createClass(FilteredImage,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(FilteredImage.prototype),"connectedCallback",this).call(this);this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(FilteredImage.haxProperties,FilteredImage.tag,this)}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_173bd880719311e9b7a5f5858924fb06())}// haxProperty definition
},{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Filtered image",description:"An image using an SVG filter. Can be used to make background images have more contrast with text.",icon:"icons:android",color:"green",groups:["Image"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"nikkimk",owner:"The Pennsylvania State University"}},settings:{quick:[{property:"src",description:"",inputMethod:"textfield",required:!0,icon:"icons:link",validationType:"url"},{property:"alt",description:"",inputMethod:"alt",required:!0,icon:"icons:accessibility"}],configure:[{property:"src",description:"",inputMethod:"textfield",required:!0,icon:"icons:link",validationType:"url"},{property:"alt",description:"",inputMethod:"alt",required:!0,icon:"icons:accessibility"}],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{src:{name:"src",type:"String",value:"",reflectToAttribute:!1,observer:!1},alt:{name:"alt",type:"String",value:"",reflectToAttribute:!1,observer:!1}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"filtered-image"}}]);return FilteredImage}(_polymerElement.PolymerElement);_exports.FilteredImage=FilteredImage;window.customElements.define(FilteredImage.tag,FilteredImage)});