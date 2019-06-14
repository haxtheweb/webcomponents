define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js","./node_modules/@polymer/paper-button/paper-button.js"],function(_exports,_polymerElement,_HAXWiring,_paperButton){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.LayoutBuilder=void 0;function _templateObject_e5affa1081c011e9a303ddd459469fdf(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host paper-button {\n  display: block;\n  margin: 0;\n}\n:host paper-button,\n:host #content-wrapper {\n  border: 1px solid #ddd;\n}\n\n:host #content:not(:empty) {\n  padding: 15px;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<div id=\"content-wrapper\">\n  <div id=\"prepend-child\"><paper-button on-tap=\"_handleAddChild\">Insert into [[type]]</paper-button></div>\n  <div id=\"content\"><slot></slot></div>\n</div>\n<div id=\"insert-sibling-after\">\n  <paper-button on-tap=\"_handleAddSibling\">Add new [[type]]</paper-button>\n</div>"]);_templateObject_e5affa1081c011e9a303ddd459469fdf=function _templateObject_e5affa1081c011e9a303ddd459469fdf(){return data};return data}/**
 * `layout-builder`
 * `A new UI for adding content to layouts`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var LayoutBuilder=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(LayoutBuilder,_PolymerElement);function LayoutBuilder(){babelHelpers.classCallCheck(this,LayoutBuilder);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(LayoutBuilder).apply(this,arguments))}babelHelpers.createClass(LayoutBuilder,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(LayoutBuilder.prototype),"connectedCallback",this).call(this);this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(LayoutBuilder.haxProperties,LayoutBuilder.tag,this);this.id=this._generateUUID()}},{key:"_handleAddChild",value:function _handleAddChild(){var lb=document.createElement("layout-builder");lb.type="sub-"+this.type;lb.innerHTML="I am a ".concat(this.type," of ").concat(this.id,".");this.prepend(lb)}},{key:"_handleAddSibling",value:function _handleAddSibling(){var lb=document.createElement("layout-builder");lb.type=this.type;lb.innerHTML="I am a ".concat(this.type," of ").concat(this.id,".");this.parentNode.insertBefore(lb,this.nextSibling)}/**
   * Generate a UUID
   */},{key:"_generateUUID",value:function _generateUUID(){var hex=Math.floor(65536*(1+Math.random())).toString(16).substring(1);return this.type+"-ss-s-s-s-sss".replace(/s/g,hex)}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_e5affa1081c011e9a303ddd459469fdf())}// haxProperty definition
},{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Layout builder",description:"A new UI for adding content to layouts",icon:"icons:android",color:"green",groups:["Builder"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"nikkimk",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{type:{name:"type",type:"Boolean",value:"layout"},id:{name:"id",type:"String",reflecttoAttribute:!0}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"layout-builder"}}]);return LayoutBuilder}(_polymerElement.PolymerElement);_exports.LayoutBuilder=LayoutBuilder;window.customElements.define(LayoutBuilder.tag,LayoutBuilder)});