define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"],function(_exports,_polymerElement,_HAXWiring){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.A11yTabs=void 0;function _templateObject_50814d20a7d311e98d2a27ebe33705ef(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>\n<div>[[alwaysVertical]]</div>\n<div>[[disabled]]</div>\n<div>[[activeTab]]</div>"]);_templateObject_50814d20a7d311e98d2a27ebe33705ef=function _templateObject_50814d20a7d311e98d2a27ebe33705ef(){return data};return data}/**
 * `a11y-tabs`
 * `accessible and responsive tabbed interface`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var A11yTabs=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(A11yTabs,_PolymerElement);function A11yTabs(){babelHelpers.classCallCheck(this,A11yTabs);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(A11yTabs).apply(this,arguments))}babelHelpers.createClass(A11yTabs,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(A11yTabs.prototype),"connectedCallback",this).call(this);this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(A11yTabs.haxProperties,A11yTabs.tag,this)}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
// Observer alwaysVertical for changes
},{key:"_alwaysVerticalChanged",value:function _alwaysVerticalChanged(newValue,oldValue){if(babelHelpers.typeof(newValue)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){console.log(newValue)}}// Observer disabled for changes
},{key:"_disabledChanged",value:function _disabledChanged(newValue,oldValue){if(babelHelpers.typeof(newValue)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){console.log(newValue)}}// Observer activeTab for changes
},{key:"_activeTabChanged",value:function _activeTabChanged(newValue,oldValue){if(babelHelpers.typeof(newValue)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){console.log(newValue)}}}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_50814d20a7d311e98d2a27ebe33705ef())}// haxProperty definition
},{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"A 11-y-tabs",description:"accessible and responsive tabbed interface",icon:"icons:android",color:"green",groups:["11"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"nikkimk",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[{property:"alwaysVertical",description:"",inputMethod:"boolean",required:!1,icon:"icons:android"},{property:"disabled",description:"",inputMethod:"boolean",required:!1,icon:"icons:android"},{property:"activeTab",description:"",inputMethod:"array",required:!1,icon:"icons:android"}],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{alwaysVertical:{name:"alwaysVertical",type:"Boolean",value:"false",reflectToAttribute:!0,observer:"_alwaysVerticalChanged"},disabled:{name:"disabled",type:"Boolean",value:"false",reflectToAttribute:!0,observer:"_disabledChanged"},activeTab:{name:"activeTab",type:"Object",value:"",reflectToAttribute:!1,observer:"_activeTabChanged"}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"a11y-tabs"}}]);return A11yTabs}(_polymerElement.PolymerElement);_exports.A11yTabs=A11yTabs;window.customElements.define(A11yTabs.tag,A11yTabs)});