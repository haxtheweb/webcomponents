define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/paper-toast/paper-toast.js","./node_modules/@polymer/paper-button/paper-button.js","./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js","./node_modules/@polymer/polymer/lib/utils/async.js"],function(_exports,_polymerElement,_paperToast,_paperButton,_polymerDom,async){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.SimpleToast=void 0;async=babelHelpers.interopRequireWildcard(async);function _templateObject_4e0cbe4081c111e98fa00f47d54ac77c(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n\npaper-toast {\n  @apply --simple-toast-toast;\n}</style>\n<paper-toast id=\"toast\" text=\"[[text]]\" duration$=\"[[duration]]\" opened=\"{{opened}}\" class$=\"[[classStyle]]\">\n  <slot></slot>\n  <paper-button hidden$=\"[[!closeButton]]\" on-click=\"hide\">[[closeText]]</paper-button>\n</paper-toast>"]);_templateObject_4e0cbe4081c111e98fa00f47d54ac77c=function _templateObject_4e0cbe4081c111e98fa00f47d54ac77c(){return data};return data}// register globally so we can make sure there is only one
window.SimpleToast=window.SimpleToast||{};// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same simple-toast element, making it a singleton.
window.SimpleToast.requestAvailability=function(){// if there is no single instance, generate one and append it to end of the document
if(!window.SimpleToast.instance){window.SimpleToast.instance=document.createElement("simple-toast");document.body.appendChild(window.SimpleToast.instance)}return window.SimpleToast.instance};/**
 * `simple-toast`
 * `A singular toast / message for conistency`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var SimpleToast=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(SimpleToast,_PolymerElement);function SimpleToast(){babelHelpers.classCallCheck(this,SimpleToast);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(SimpleToast).apply(this,arguments))}babelHelpers.createClass(SimpleToast,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(SimpleToast.prototype),"connectedCallback",this).call(this);window.addEventListener("simple-toast-hide",this.hideSimpleToast.bind(this));window.addEventListener("simple-toast-show",this.showSimpleToast.bind(this))}/**
   * life cycle, element is removed from the DOM
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(SimpleToast.prototype),"connectedCallback",this).call(this);window.removeEventListener("simple-toast-hide",this.hideSimpleToast.bind(this));window.removeEventListener("simple-toast-show",this.showSimpleToast.bind(this))}/**
   * Hide callback
   */},{key:"hideSimpleToast",value:function hideSimpleToast(e){this.hide()}/**
   * Show / available callback
   */},{key:"showSimpleToast",value:function showSimpleToast(e){var _this=this;// add your code to run when the singleton is called for
if(e.detail.duration){this.duration=e.detail.duration}if(e.detail.text){this.text=e.detail.text}if(e.detail.classStyle){this.classStyle=e.detail.classStyle}if(e.detail.closeText){this.closeText=e.detail.closeText}if(e.detail.closeButton){this.closeButton=e.detail.closeButton}if(e.detail.eventCallback){this.eventCallback=e.detail.eventCallback}while(null!==(0,_polymerDom.dom)(this).firstChild){(0,_polymerDom.dom)(this).removeChild((0,_polymerDom.dom)(this).firstChild)}if(e.detail.slot){(0,_polymerDom.dom)(this).appendChild(e.detail.slot)}async.microTask.run(function(){setTimeout(function(){_this.show()},50)})}},{key:"show",value:function show(){this.$.toast.show()}},{key:"hide",value:function hide(){if(this.eventCallback){var evt=new CustomEvent(this.eventCallback,{bubbles:!0,cancelable:!0,detail:!0});this.dispatchEvent(evt)}this.$.toast.hide()}}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_4e0cbe4081c111e98fa00f47d54ac77c())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{/**
   * Opened state of the toast, use event to change
   */opened:{name:"opened",type:"Boolean",value:!1,reflectToAttribute:!0},/**
   * Plain text based message to display
   */text:{name:"text",type:"String",value:"Saved"},/**
   * Class name, fit-bottom being a useful one
   */classStyle:{name:"classStyle",type:"String",value:""},/**
   * Text for the close button
   */closeText:{name:"closeText",type:"String",value:"Close"},/**
   * How long the toast message should be displayed
   */duration:{name:"duration",type:"Number",value:4e3},/**
   * Event callback when hide is called
   */eventCallback:{name:"eventCallback",type:"String"},/**
   * If there should be a close button shown
   */closeButton:{name:"closeButton",type:"Boolean",value:!0,reflectToAttribute:!0}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"simple-toast"}}]);return SimpleToast}(_polymerElement.PolymerElement);_exports.SimpleToast=SimpleToast;window.customElements.define(SimpleToast.tag,SimpleToast)});