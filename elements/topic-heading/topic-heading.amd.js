define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js","./node_modules/@polymer/iron-icons/iron-icons.js","./node_modules/@polymer/iron-icon/iron-icon.js","./node_modules/@lrnwebcomponents/relative-heading/relative-heading.js"],function(_exports,_polymerElement,_HAXWiring,_ironIcons,_ironIcon,_relativeHeading){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.TopicHeading=void 0;function _templateObject_cdaa77606d6b11e996d9d544c789fe03(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n\nrelative-heading {\n  color: var(--topic-heading-heading-color);\n  display: inline-flex;\n  --relative-heading-heading: {\n    padding: 0;\n    margin: 0 0 16px 0;\n    @apply --topic-heading-heading;\n  }\n}\niron-icon {\n  color: var(--topic-heading-icon-color);\n  display: inline-flex;\n  font-size: 16px;\n  height: 32px;\n  width: 32px;\n  padding: 16px;\n  line-height: 16px;\n  vertical-align: bottom;\n  @apply --topic-heading-icon;\n}</style>\n<iron-icon icon=\"[[icon]]\"></iron-icon><relative-heading text=\"[[title]]\"></relative-heading>"]);_templateObject_cdaa77606d6b11e996d9d544c789fe03=function _templateObject_cdaa77606d6b11e996d9d544c789fe03(){return data};return data}/**
 * `topic-heading`
 * `Semantic and visual meaning behind a heading break`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var TopicHeading=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(TopicHeading,_PolymerElement);function TopicHeading(){babelHelpers.classCallCheck(this,TopicHeading);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(TopicHeading).apply(this,arguments))}babelHelpers.createClass(TopicHeading,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(TopicHeading.prototype),"connectedCallback",this).call(this);this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(TopicHeading.haxProperties,TopicHeading.tag,this)}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_cdaa77606d6b11e996d9d544c789fe03())}// haxProperty definition
},{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Topic heading",description:"Semantic and visual meaning behind a heading break",icon:"icons:android",color:"green",groups:["Heading"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[{property:"icon",description:"",inputMethod:"iconpicker",required:!1,icon:"icons:code"},{property:"title",description:"",inputMethod:"textfield",required:!1,icon:"icons:heading"}],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{icon:{name:"icon",type:"String",value:""},title:{name:"title",type:"String",value:"Heading"}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"topic-heading"}}]);return TopicHeading}(_polymerElement.PolymerElement);_exports.TopicHeading=TopicHeading;window.customElements.define(TopicHeading.tag,TopicHeading)});