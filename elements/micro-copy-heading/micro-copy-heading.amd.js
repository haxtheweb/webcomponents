define(["exports","./node_modules/lit-element/lit-element.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"],function(_exports,_litElement,_HAXWiring){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.MicroCopyHeading=void 0;function _templateObject_228dd7006d6b11e9956c25d51495a924(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n  margin: 16px 0;\n}\n\n:host([hidden]) {\n  display: none;\n}\nspan {\n  margin-left:8px;\n}\nh2 {\n  display: inline-flex;\n  margin: unset;\n  padding: unset;\n  font-size: 0.750em;\n  color: var(--simple-colors-default-theme-red-5, #DE2654);\n  border: 2px solid var(--simple-colors-default-theme-red-5, #DE2654);\n  line-height: 12px;\n  margin-right: 10px;\n  text-transform: uppercase;\n  font-weight: 500;\n  letter-spacing: 0.09em;\n  padding: 6px 16px;\n}</style>\n<h2>","<span aria-hidden=\"true\">","</span></h2>"]);_templateObject_228dd7006d6b11e9956c25d51495a924=function _templateObject_228dd7006d6b11e9956c25d51495a924(){return data};return data}/**
 * `micro-copy-heading`
 * `small call to action / attention that acts as a heading too`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */var MicroCopyHeading=/*#__PURE__*/function(_LitElement){babelHelpers.inherits(MicroCopyHeading,_LitElement);babelHelpers.createClass(MicroCopyHeading,[{key:"render",// render function
value:function render(){return(0,_litElement.html)(_templateObject_228dd7006d6b11e9956c25d51495a924(),this.heading,this.endcap)}// haxProperty definition
},{key:"tag",/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */value:function tag(){return"micro-copy-heading"}// life cycle
}],[{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Micro copy-heading",description:"small call to action / attention that acts as a heading too",icon:"icons:android",color:"green",groups:["Copy"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[{property:"heading",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"},{property:"endCap",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"}],configure:[{property:"heading",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"},{property:"endCap",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"}],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{/**
   * Heading / call to action to display
   */heading:{name:"heading",type:"String",value:"Telling our story"},/**
   * ending cap to the statement, possibly a character, icon, etc
   */endcap:{name:"endcap",type:"String",value:"//"}}}}]);function MicroCopyHeading(){var _this;babelHelpers.classCallCheck(this,MicroCopyHeading);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(MicroCopyHeading).call(this));_this.tag=MicroCopyHeading.tag;// map our imported properties json to real props on the element
// @notice static getter of properties is built via tooling
// to edit modify src/micro-copy-heading-properties.json
var obj=MicroCopyHeading.properties;for(var p in obj){if(obj.hasOwnProperty(p)){if(_this.hasAttribute(p)){_this[p]=_this.getAttribute(p)}else{_this.setAttribute(p,obj[p].value);_this[p]=obj[p].value}}}return _this}/**
   * life cycle, element is afixed to the DOM
   */babelHelpers.createClass(MicroCopyHeading,[{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(MicroCopyHeading.prototype),"connectedCallback",this).call(this);this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(MicroCopyHeading.haxProperties,MicroCopyHeading.tag,this)}// static get observedAttributes() {
//   return [];
// }
// disconnectedCallback() {}
// attributeChangedCallback(attr, oldValue, newValue) {}
}]);return MicroCopyHeading}(_litElement.LitElement);_exports.MicroCopyHeading=MicroCopyHeading;customElements.define("micro-copy-heading",MicroCopyHeading)});