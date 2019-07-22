define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js","./node_modules/@polymer/polymer/lib/utils/async.js","./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js","./node_modules/@polymer/app-layout/app-drawer/app-drawer.js","./node_modules/@polymer/neon-animation/neon-animation.js","./node_modules/@polymer/paper-button/paper-button.js","./node_modules/@polymer/iron-icons/iron-icons.js","./node_modules/@polymer/iron-icon/iron-icon.js"],function(_exports,_polymerElement,_polymerDom,async,_simpleColors,_appDrawer,_neonAnimation,_paperButton,_ironIcons,_ironIcon){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.SimpleDrawer=void 0;async=babelHelpers.interopRequireWildcard(async);function _templateObject_8af0fc30ab1611e9a734299c7b540874(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n  z-index: 1000;\n}\n:host([hidden]) {\n  display: none;\n}\n\napp-drawer {\n  --app-drawer-width: var(--simple-drawer-width, 256px);\n  --app-drawer-content-container: {\n    padding: 0;\n    overflow-y: scroll;\n    position: fixed;\n    color: var(--simple-drawer-color, #222222);\n    background-color: var(--simple-drawer-background-color, #FFFFFF);\n  }\n}\n:host ::slotted(*) {\n  font-size: 14px;\n  @apply --simple-drawer-content;\n}\n\n.content {\n  text-align: left;\n  padding: 8px 24px;\n  @apply --simple-drawer-content-container;\n}\n\n.top ::slotted(*) {\n  font-size: 24px;\n  margin: 0;\n  padding: 0 15px;\n  height: 40px;\n  line-height: 48px;\n}\n\n#close {\n  position: absolute;\n  right: 8px;\n  top: 8px;\n  padding: 4px;\n  margin: 0;\n  text-transform: none;\n  float: right;\n  font-size: 12px;\n  color: var(--simple-drawer-header-color, #ffffff);\n  background-color: transparent;\n  min-width: unset;\n}\n\n#close iron-icon {\n  display: inline-block;\n  width: 16px;\n  height: 16px;\n  margin-right: 2px;\n}\n\n.top {\n  font-size: 24px;\n  margin: 0 0 8px 0;\n  padding: 0 16px;\n  height: 64px;\n  line-height: 64px;\n  display: flex;\n  text-align: left;\n  justify-content: space-between;\n  background-color: var(--simple-drawer-header-background, #20427b);\n  color: var(--simple-drawer-header-color, #ffffff);\n  @apply --simple-drawer-header;\n}\n\n.top h2 {\n  flex: auto;\n  color: var(--simple-drawer-header-color, #ffffff);\n  font-size: 24px;\n  padding: 0;\n  line-height: 32px;\n  margin: 8px;\n  @apply --simple-drawer-heading;\n}</style>\n<app-drawer tabindex=\"0\" id=\"drawer\" opened=\"{{opened}}\" align=\"[[align]]\" role=\"dialog\">\n  <div class=\"wrapper\">\n    <div class=\"top\">\n      <h2 hidden$=\"[[!title]]\">[[title]]</h2>\n      <slot name=\"header\"></slot>\n    </div>\n    <div class=\"content\">\n      <slot name=\"content\"></slot>\n    </div>\n    <paper-button id=\"close\" on-click=\"close\">\n      <iron-icon icon=\"[[closeIcon]]\"></iron-icon> [[closeLabel]]\n    </paper-button>\n  </div>\n</app-drawer>"]);_templateObject_8af0fc30ab1611e9a734299c7b540874=function _templateObject_8af0fc30ab1611e9a734299c7b540874(){return data};return data}// register globally so we can make sure there is only one
window.SimpleDrawer=window.SimpleDrawer||{};// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same drawer
window.SimpleDrawer.requestAvailability=function(){if(!window.SimpleDrawer.instance){window.SimpleDrawer.instance=document.createElement("simple-drawer");document.body.appendChild(window.SimpleDrawer.instance)}return window.SimpleDrawer.instance};/**
 * `simple-drawer`
 * `a singleton drawer element`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var SimpleDrawer=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(SimpleDrawer,_PolymerElement);function SimpleDrawer(){babelHelpers.classCallCheck(this,SimpleDrawer);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(SimpleDrawer).apply(this,arguments))}babelHelpers.createClass(SimpleDrawer,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(SimpleDrawer.prototype),"connectedCallback",this).call(this);window.addEventListener("simple-drawer-hide",this.close.bind(this));window.addEventListener("simple-drawer-show",this.showEvent.bind(this))}/**
   * Ensure everything is visible in what's been expanded.
   */},{key:"_resizeContent",value:function _resizeContent(e){// fake a resize event to make contents happy
async.microTask.run(function(){window.dispatchEvent(new Event("resize"))})}/**
   * show event call to open the drawer and display it's content
   */},{key:"showEvent",value:function showEvent(e){var _this=this;// if we're already opened and we get told to open again....
// swap out the contents
if(this.opened){// wipe the slot of our drawer
while(null!==(0,_polymerDom.dom)(this).firstChild){(0,_polymerDom.dom)(this).removeChild((0,_polymerDom.dom)(this).firstChild)}setTimeout(function(){_this.show(e.detail.title,e.detail.elements,e.detail.invokedBy,e.detail.align,e.detail.clone)},100)}else{this.show(e.detail.title,e.detail.elements,e.detail.invokedBy,e.detail.align,e.detail.size,e.detail.clone)}}/**
   * Show the drawer and display the material
   */},{key:"show",value:function show(title,elements,invokedBy){var _this2=this,align=3<arguments.length&&arguments[3]!==void 0?arguments[3]:"left",size=4<arguments.length&&arguments[4]!==void 0?arguments[4]:"256px",clone=5<arguments.length&&arguments[5]!==void 0?arguments[5]:!1;this.set("invokedBy",invokedBy);this.title=title;this.align=align;this.updateStyles({"--simple-drawer-width":size});var element,slots=["header","content"];// append element areas into the appropriate slots
// ensuring they are set if it wasn't previously
for(var i in slots){if(elements[slots[i]]){if(clone){element=elements[slots[i]].cloneNode(!0)}else{element=elements[slots[i]]}element.setAttribute("slot",slots[i]);(0,_polymerDom.dom)(this).appendChild(element)}}// minor delay to help the above happen prior to opening
setTimeout(function(){_this2.opened=!0;_this2._resizeContent()},100)}/**
   * check state and if we should clean up on close.
   * This keeps the DOM tiddy and allows animation to happen gracefully.
   */},{key:"animationEnded",value:function animationEnded(e){var _this3=this;// wipe the slot of our drawer
this.title="";while(null!==(0,_polymerDom.dom)(this).firstChild){(0,_polymerDom.dom)(this).removeChild((0,_polymerDom.dom)(this).firstChild)}if(this.invokedBy){async.microTask.run(function(){setTimeout(function(){_this3.invokedBy.focus()},500)})}}/**
   * Close the drawer and do some clean up
   */},{key:"close",value:function close(){this.$.drawer.close()}// Observer opened for changes
},{key:"_openedChanged",value:function _openedChanged(newValue,oldValue){if(babelHelpers.typeof(newValue)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))&&!newValue){this.animationEnded();var evt=new CustomEvent("simple-drawer-closed",{bubbles:!0,cancelable:!0,detail:{opened:!1,invokedBy:this.invokedBy}});this.dispatchEvent(evt)}else if(newValue){var _evt=new CustomEvent("simple-drawer-opened",{bubbles:!0,cancelable:!0,detail:{opened:!0,invokedBy:this.invokedBy}});this.dispatchEvent(_evt)}}/**
   * life cycle, element is removed from the DOM
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(SimpleDrawer.prototype),"disconnectedCallback",this).call(this);window.removeEventListener("simple-drawer-hide",this.close.bind(this));window.removeEventListener("simple-drawer-show",this.showEvent.bind(this))}}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_8af0fc30ab1611e9a734299c7b540874())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){var props={/**
   * heading / label of the modal
   */title:{name:"title",type:String,value:""},/**
   * alignment of the drawer
   */align:{name:"align",type:String,value:"left"},/**
   * open state
   */opened:{name:"opened",type:Boolean,value:!1,reflectToAttribute:!0,observer:"_openedChanged"},/**
   * Close label
   */closeLabel:{name:"closeLabel",type:String,value:"Close"},/**
   * Close icon
   */closeIcon:{name:"closeIcon",type:String,value:"cancel"},/**
   * The element that invoked this. This way we can track our way back accessibly
   */invokedBy:{name:"invokedBy",type:Object}};if(babelHelpers.get(babelHelpers.getPrototypeOf(SimpleDrawer),"properties",this)){props=Object.assign(props,babelHelpers.get(babelHelpers.getPrototypeOf(SimpleDrawer),"properties",this))}return props}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"simple-drawer"}}]);return SimpleDrawer}(_polymerElement.PolymerElement);_exports.SimpleDrawer=SimpleDrawer;window.customElements.define(SimpleDrawer.tag,SimpleDrawer)});