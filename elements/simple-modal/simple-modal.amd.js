define(["exports","require","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/polymer/lib/utils/render-status.js","./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js","./node_modules/@polymer/polymer/lib/utils/async.js","./node_modules/@polymer/paper-dialog/paper-dialog.js"],function(_exports,_require,_polymerElement,_renderStatus,_polymerDom,_async,_paperDialog){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.SimpleModal=void 0;_require=babelHelpers.interopRequireWildcard(_require);function _templateObject_3e668c5081c111e9b30d716acb81c8b5(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n\npaper-dialog-scrollable:not(:defined) {\n  display: none;\n}\n\n:host paper-dialog ::slotted(*) {\n  font-size: 14px;\n  @apply --simple-modal-content;\n}\n\n#dialog {\n  display: flex;\n  flex-direction: column;\n  margin: 15px auto;\n  z-index: 1000;\n  height: var(--simple-modal-height, auto);\n  width: var(--simple-modal-width, auto);\n  min-width: var(--simple-modal-min-width, unset);\n  max-width: var(--simple-modal-max-width, unset);\n  min-height: var(--simple-modal-min-height, unset);\n  max-height: var(--simple-modal-max-height, unset);\n  border-radius: 3px;\n  @apply --simple-modal-dialog;\n}\n\n#titlebar {\n  margin-top: 0;\n  padding: 0px 16px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  color: var(--simple-modal-titlebar-color,#444);\n  background-color: var(--simple-modal-titlebar-background,#ddd);\n  border-radius: 3px 3px 0 0;\n  height: 64px;\n  line-height: 64px;\n  @apply --simple-modal-top;\n}\n\n#headerbar {\n  margin: 0;\n  padding: 0 16px;\n  color: var(--simple-modal-header-color, #222);\n  background-color: var(--simple-modal-header-background, #ccc);\n  @apply --simple-modal-headerbar;\n}\n\nh2 {\n  margin-right: 8px;\n  padding: 0;\n  flex: auto;\n  font-size: 18px;\n  line-height: 18px;\n  @apply --simple-modal-title;\n}\n\n#close {\n  top: 0;\n  padding: 10px 0;\n  min-width: unset;\n  text-transform: none;\n  color: var(--simple-modal-titlebar-color,#444);\n  background-color: transparent;\n  @apply --simple-modal-close;\n}\n\n#close iron-icon {\n  width: 16px;\n  height: 16px;\n  color: var(--simple-modal-titlebar-color,#444);\n  @apply --simple-modal-close-icon;\n}\n\n#simple-modal-content {\n  flex-grow: 1;\n  padding: 8px 16px;\n  margin: 0;\n  color: var(--simple-modal-content-container-color, #222);\n  background-color: var(--simple-modal-content-container-background, #fff);\n  --paper-dialog-scrollable: {\n    padding: 0;\n  }\n  @apply --simple-modal-content-container;\n}\n.buttons {\n  padding: 0;\n  margin: 0;\n  color: var(--simple-modal-buttons-color, unset);\n  background-color: var(--simple-modal-buttons-background,unset);\n  @apply --simple-modal-buttons;\n}\n.buttons ::slotted(*) {\n  padding: 0;\n  margin: 0;\n  color: var(--simple-modal-button-color,--simple-modal-buttons-color);\n  background-color: var(--simple-modal-button-background,--simple-modal-buttons-background);\n  @apply --simple-modal-button;\n}</style>\n<paper-dialog id=\"dialog\" \n  always-on-top\n  aria-describedby=\"simple-modal-content\"\n  aria-label$=\"[[_getAriaLabel(title)]]\"\n  aria-labelledby$=\"[[_getAriaLabelledby(title)]]\"\n  aria-modal=\"true\"\n  entry-animation=\"scale-up-animation\" \n  exit-animation=\"fade-out-animation\" \n  role=\"dialog\"\n  opened=\"{{opened}}\" \n  modal=\"[[modal]]\"\n  with-backdrop>\n  <div id=\"titlebar\">\n    <h2 id=\"simple-modal-title\" hidden$=\"[[!title]]\">[[title]]</h2>\n    <div></div>\n    <paper-button id=\"close\" dialog-dismiss hidden$=\"[[!opened]]\" label=\"[[closeLabel]]\">\n      <iron-icon aria-hidden=\"true\" icon=\"[[closeIcon]]\"></iron-icon>\n    </paper-button>\n  </div>\n  <div id=\"headerbar\"><slot name=\"header\"></slot></div>\n  <paper-dialog-scrollable id=\"simple-modal-content\">\n    <slot name=\"content\"></slot>\n  </paper-dialog-scrollable>\n  <div class=\"buttons\">\n    <slot name=\"buttons\"></slot>\n  </div>\n</paper-dialog>"]);_templateObject_3e668c5081c111e9b30d716acb81c8b5=function _templateObject_3e668c5081c111e9b30d716acb81c8b5(){return data};return data}// register globally so we can make sure there is only one
window.SimpleModal=window.SimpleModal||{};// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
window.SimpleModal.requestAvailability=function(){if(!window.SimpleModal.instance){window.SimpleModal.instance=document.createElement("simple-modal");document.body.appendChild(window.SimpleModal.instance)}return window.SimpleModal.instance};/**
 * `simple-modal`
 * `A simple modal that ensures accessibility and stack order context appropriately`
 *
 * @microcopy - language worth noting:
 *  -
 * 
 * CSS Variables: ```
--simple-modal-titlebar-color: #444;
--simple-modal-titlebar-background: #ddd;
--simple-modal-header-color: #222;
--simple-modal-header-background: #ccc;
--simple-modal-content-container-color: #222;
--simple-modal-content-container-background: #fff;
--simple-modal-buttons-color: unset;
--simple-modal-buttons-background: unset;
--simple-modal-button-color: var(--simple-modal-buttons-color);
--simple-modal-button-background: var(--simple-modal-buttons-background-color);
```
 *
 * @customElement
 * @polymer
 * @demo demo/index.html demo
 * @demo demo/css.html styling simple-modal via CSS
 * @demo demo/details.html styling simple-modal via event details
 * @demo demo/template.html using simple-modal-template
 */var SimpleModal=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(SimpleModal,_PolymerElement);babelHelpers.createClass(SimpleModal,null,[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_3e668c5081c111e9b30d716acb81c8b5())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{/**
   * heading / label of the modal
   */title:{name:"title",type:String,value:""},/**
   * open state
   */opened:{name:"opened",type:Boolean,value:!1,reflectToAttribute:!0,observer:"_openedChanged"},/**
   * Close label
   */closeLabel:{name:"closeLabel",type:String,value:"Close"},/**
   * Close icon
   */closeIcon:{name:"closeIcon",type:String,value:"close"},/**
   * The element that invoked this. This way we can track our way back accessibly
   */invokedBy:{name:"invokedBy",type:Object},/**
   * support for modal flag
   */modal:{name:"modal",type:Boolean,value:!1}}}}]);function SimpleModal(){var _this;babelHelpers.classCallCheck(this,SimpleModal);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(SimpleModal).call(this));new Promise(function(res,rej){return _require.default(["./node_modules/@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js"],res,rej)});new Promise(function(res,rej){return _require.default(["./node_modules/@polymer/paper-button/paper-button.js"],res,rej)});new Promise(function(res,rej){return _require.default(["./node_modules/@polymer/iron-icons/iron-icons.js"],res,rej)});new Promise(function(res,rej){return _require.default(["./node_modules/@polymer/iron-icon/iron-icon.js"],res,rej)});new Promise(function(res,rej){return _require.default(["./node_modules/@polymer/neon-animation/animations/scale-up-animation.js"],res,rej)});new Promise(function(res,rej){return _require.default(["./node_modules/@polymer/neon-animation/animations/fade-out-animation.js"],res,rej)});return _this}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */babelHelpers.createClass(SimpleModal,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(SimpleModal.prototype),"connectedCallback",this).call(this);(0,_renderStatus.afterNextRender)(this,function(){window.addEventListener("simple-modal-hide",this.close.bind(this));window.addEventListener("simple-modal-show",this.showEvent.bind(this));this.shadowRoot.querySelector("#simple-modal-content").addEventListener("neon-animation-finish",this._ironOverlayClosed.bind(this))})}/**
   * Ensure everything is visible in what's been expanded.
   */},{key:"_resizeContent",value:function _resizeContent(e){// fake a resize event to make contents happy
_async.microTask.run(function(){window.dispatchEvent(new Event("resize"))})}/**
   * show event call to open the modal and display it's content
   *
   */},{key:"showEvent",value:function showEvent(e){var _this2=this;// if we're already opened and we get told to open again....
// swap out the contents
if(this.opened){// wipe the slot of our modal
while(null!==(0,_polymerDom.dom)(this).firstChild){(0,_polymerDom.dom)(this).removeChild((0,_polymerDom.dom)(this).firstChild)}setTimeout(function(){_this2.show(e.detail.title,e.detail.elements,e.detail.invokedBy,e.detail.id,e.detail.modalClass,e.detail.styles,e.detail.clone,e.detail.modal)},100)}else{this.show(e.detail.title,e.detail.elements,e.detail.invokedBy,e.detail.id,e.detail.modalClass,e.detail.styles,e.detail.clone,e.detail.modal)}}/**
   * Show the modal and display the material
   */},{key:"show",value:function show(title,elements,invokedBy){var _this3=this,id=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null,modalClass=4<arguments.length&&arguments[4]!==void 0?arguments[4]:null,styles=5<arguments.length&&arguments[5]!==void 0?arguments[5]:null,clone=6<arguments.length&&arguments[6]!==void 0?arguments[6]:!1,modal=7<arguments.length&&arguments[7]!==void 0?arguments[7]:!1;this.set("invokedBy",invokedBy);this.modal=modal;this.title=title;var element,slots=["header","content","buttons"];// append element areas into the appropriate slots
// ensuring they are set if it wasn't previously
if(id){this.setAttribute("id",id)}else{this.removeAttribute("id")}this.setAttribute("style","");if(styles){["--simple-modal-width","--simple-modal-height","--simple-modal-min-width","--simple-modal-min-height","--simple-modal-max-width","--simple-modal-max-height","--simple-modal-titlebar-color","--simple-modal-titlebar-background","--simple-modal-header-color","--simple-modal-header-background","--simple-modal-content-container-color","--simple-modal-content-container-background","--simple-modal-buttons-color","--simple-modal-buttons-background","--simple-modal-button-color","--simple-modal-button-background"].forEach(function(prop){_this3.style.setProperty(prop,styles[prop]||"unset")})}if(modalClass){this.setAttribute("class",modalClass)}else{this.removeAttribute("class")}for(var i in slots){if(elements[slots[i]]){if(clone){element=elements[slots[i]].cloneNode(!0)}else{element=elements[slots[i]]}element.setAttribute("slot",slots[i]);(0,_polymerDom.dom)(this).appendChild(element)}}// minor delay to help the above happen prior to opening
setTimeout(function(){_this3.opened=!0;_this3._resizeContent()},100)}/**
   * check state and if we should clean up on close.
   * This keeps the DOM tiddy and allows animation to happen gracefully.
   */},{key:"animationEnded",value:function animationEnded(e){var _this4=this;// wipe the slot of our modal
this.title="";while(null!==(0,_polymerDom.dom)(this).firstChild){(0,_polymerDom.dom)(this).removeChild((0,_polymerDom.dom)(this).firstChild)}if(this.invokedBy){_async.microTask.run(function(){setTimeout(function(){_this4.invokedBy.focus()},500)})}}/**
   * Close the modal and do some clean up
   */},{key:"close",value:function close(){this.shadowRoot.querySelector("#dialog").close()}// Observer opened for changes
},{key:"_openedChanged",value:function _openedChanged(newValue,oldValue){if(babelHelpers.typeof(newValue)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))&&!newValue){this.animationEnded();var evt=new CustomEvent("simple-modal-closed",{bubbles:!0,cancelable:!0,detail:{opened:!1,invokedBy:this.invokedBy}});this.dispatchEvent(evt)}else if(newValue){var _evt=new CustomEvent("simple-modal-opened",{bubbles:!0,cancelable:!0,detail:{opened:!0,invokedBy:this.invokedBy}});this.dispatchEvent(_evt)}}/**
   * If there is a title, aria-labelledby should point to #simple-modal-title
   */},{key:"_getAriaLabelledby",value:function _getAriaLabelledby(title){return!title?null:"simple-modal-title"}/**
   * If there is no title, supply a generic aria-label
   */},{key:"_getAriaLabel",value:function _getAriaLabel(title){return!title?"Modal Dialog":null}},{key:"_ironOverlayClosed",value:function _ironOverlayClosed(e){e.preventDefault();e.stopPropagation()}/**
   * life cycle, element is removed from the DOM
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){window.removeEventListener("simple-modal-hide",this.close.bind(this));window.removeEventListener("simple-modal-show",this.showEvent.bind(this));this.shadowRoot.querySelector("#simple-modal-content").removeEventListener("neon-animation-finish",this._ironOverlayClosed.bind(this));babelHelpers.get(babelHelpers.getPrototypeOf(SimpleModal.prototype),"disconnectedCallback",this).call(this)}}],[{key:"tag",get:function get(){return"simple-modal"}}]);return SimpleModal}(_polymerElement.PolymerElement);_exports.SimpleModal=SimpleModal;window.customElements.define(SimpleModal.tag,SimpleModal)});