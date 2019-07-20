define(["exports","require","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/polymer/lib/utils/render-status.js","./node_modules/@polymer/iron-icons/iron-icons.js","./node_modules/@polymer/iron-icon/iron-icon.js","./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js"],function(_exports,_require,_polymerElement,_renderStatus,_ironIcons,_ironIcon,_materializecssStyles){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.LrnButton=void 0;_require=babelHelpers.interopRequireWildcard(_require);function _templateObject_ea339c50ab1311e995f71dd79bf0d6bd(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>  :host {\n    display: block;\n    @apply --paper-font-common-base;\n    @apply --paper-button;\n    --lrnsys-button-height: 48px;\n  }\n\n  :host(.center) {\n    text-align: center;\n  }\n\n  a {\n    text-decoration: none;\n    display: block;\n    color: #000000;\n  }\n\n  paper-button {\n    transition: .3s;\n    margin: 0;\n    max-width: 50%;\n    height: inherit;\n    -webkit-justify-content: flex-start;\n    justify-content: flex-start;\n    align-items: center;\n    border-radius: unset;\n  }\n\n  paper-button iron-icon {\n    height: var(--lrnsys-button-height);\n    margin: 0 12px;\n  }\n\n  paper-button div.inner {\n    height: var(--lrnsys-button-height);\n    line-height: var(--lrnsys-button-height);\n    padding: 0 12px;\n  }\n\n  paper-button span.label {\n    height: var(--lrnsys-button-height);\n    line-height: var(--lrnsys-button-height);\n  }\n\n  .no-margin {\n    margin: 0 !important;\n  }\n\n  .no-right-padding {\n    padding-right: 0 !important;\n  }\n\n  .no-left-padding {\n    padding-left: 0 !important;\n  }\n\n  .center {\n    text-align: center;\n    margin: 0 auto;\n  }</style>\n<style include=\"materializecss-styles-colors\"></style>\n<a tabindex=\"-1\" id=\"lrnsys-button-link\" href$=\"[[showHref]]\" data-prefetch-hover$=\"[[prefetch]]\" target$=\"[[target]]\">\n  <paper-button id=\"button\" raised=\"[[raised]]\" class$=\"[[class]] [[color]] [[textColor]]\" disabled$=\"[[disabled]]\">\n    <div class$=\"inner [[innerClass]]\">\n      <iron-icon icon$=\"[[icon]]\" id=\"icon\" class$=\"[[iconClass]]\" hidden$=\"[[!icon]]\"></iron-icon>\n      <span class=\"label\" hidden$=\"[[!label]]\">\n        [[label]]\n      </span>\n      <slot></slot>\n    </div>\n  </paper-button>\n</a>\n<paper-tooltip for=\"lrnsys-button-link\" animation-delay=\"0\">[[alt]]</paper-tooltip>"]);_templateObject_ea339c50ab1311e995f71dd79bf0d6bd=function _templateObject_ea339c50ab1311e995f71dd79bf0d6bd(){return data};return data}/**
 * `lrn-button`
 * `Simple button wrapper with a few options`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var LrnButton=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(LrnButton,_PolymerElement);babelHelpers.createClass(LrnButton,null,[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_ea339c50ab1311e995f71dd79bf0d6bd())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){var props={/**
   * Standard href pass down
   */href:{type:String,value:"#"},/**
   * What to display for the resource
   */showHref:{type:String,value:!1},/**
   * If the button should be visually lifted off the UI.
   */raised:{type:Boolean},/**
   * Label to place in the text area
   */label:{type:String,value:""},target:{type:String,value:""},/**
   * iron-icon to use (with iconset if needed)
   */icon:{type:String,value:!1},/**
   * Classes to add / subtract based on the item being hovered.
   */hoverClass:{type:String},/**
   * Icon class in the event you want it to look different from the text.
   */iconClass:{type:String},/**
   * Inner container classes.
   */innerClass:{type:String},/**
   * materializeCSS color class
   */color:{type:String},/**
   * materializeCSS color class for text
   */textColor:{type:String},/**
   * Allow for prefetch data on hover
   */prefetch:{type:String},/**
   * Alt via tooltip.
   */alt:{type:String},/**
   * Disabled state.
   */disabled:{type:Boolean,value:!1},/**
   * Tracks if focus state is applied
   */focusState:{type:Boolean,value:!1}};if(babelHelpers.get(babelHelpers.getPrototypeOf(LrnButton),"properties",this)){props=Object.assign(props,babelHelpers.get(babelHelpers.getPrototypeOf(LrnButton),"properties",this))}return props}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"lrn-button"}}]);function LrnButton(){var _this;babelHelpers.classCallCheck(this,LrnButton);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(LrnButton).call(this));new Promise(function(res,rej){return _require.default(["./node_modules/@polymer/paper-button/paper-button.js"],res,rej)});new Promise(function(res,rej){return _require.default(["./node_modules/@polymer/paper-tooltip/paper-tooltip.js"],res,rej)});return _this}/**
   * life cycle, element is afixed to the DOM
   */babelHelpers.createClass(LrnButton,[{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(LrnButton.prototype),"connectedCallback",this).call(this);(0,_renderStatus.afterNextRender)(this,function(){this.addEventListener("mousedown",this.tapEventOn);this.addEventListener("mouseover",this.tapEventOn);this.addEventListener("mouseout",this.tapEventOff);this.$.button.addEventListener("focused-changed",this.focusToggle)})}/**
   * life cycle, element is removed from the DOM
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){this.removeEventListener("mousedown",this.tapEventOn);this.removeEventListener("mouseover",this.tapEventOn);this.removeEventListener("mouseout",this.tapEventOff);this.$.button.removeEventListener("focused-changed",this.focusToggle);babelHelpers.get(babelHelpers.getPrototypeOf(LrnButton.prototype),"disconnectedCallback",this).call(this)}/**
   * Go to the href if the button isn't disabled
   */},{key:"ready",value:function ready(){babelHelpers.get(babelHelpers.getPrototypeOf(LrnButton.prototype),"ready",this).call(this);if(!this.disabled){this.showHref=this.href}}/**
   * Class processing on un-tap / hover
   */},{key:"tapEventOn",value:function tapEventOn(e){var root=this;if(babelHelpers.typeof(root.hoverClass)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))&&!root.disabled){// break class into array
var classes=root.hoverClass.split(" ");// run through each and add or remove classes
classes.forEach(function(item,index){if(""!=item){root.$.button.classList.add(item);if(-1!=item.indexOf("-")){root.$.icon.classList.add(item)}}})}}/**
   * Undo class processing on un-tap / hover
   */},{key:"tapEventOff",value:function tapEventOff(e){var root=this;if(babelHelpers.typeof(root.hoverClass)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))&&!root.disabled){// break class into array
var classes=root.hoverClass.split(" ");// run through each and add or remove classes
classes.forEach(function(item,index){if(""!=item){root.$.button.classList.remove(item);if(-1!=item.indexOf("-")){root.$.icon.classList.remove(item)}}})}}/**
   * Handle toggle for mouse class and manage classList array for paper-button.
   */},{key:"focusToggle",value:function focusToggle(e){var root=this;this.dispatchEvent(new CustomEvent("focus-changed",{bubbles:!0,composed:!0,detail:{focus:root.focusState}}));// see if it has hover classes
if(babelHelpers.typeof(root.hoverClass)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))&&!root.disabled){// break class into array
var classes=root.hoverClass.split(" ");// run through each and add or remove classes
classes.forEach(function(item,index){if(""!=item){if(root.focusState){root.$.button.classList.add(item);if(-1!=item.indexOf("-")){root.$.icon.classList.add(item)}}else{root.$.button.classList.remove(item);if(-1!=item.indexOf("-")){root.$.icon.classList.remove(item)}}}})}root.focusState=!root.focusState}}]);return LrnButton}(_polymerElement.PolymerElement);_exports.LrnButton=LrnButton;window.customElements.define(LrnButton.tag,LrnButton)});