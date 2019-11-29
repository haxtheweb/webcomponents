define(["exports","./node_modules/lit-element/lit-element.js","./node_modules/@lrnwebcomponents/responsive-utility/responsive-utility.js","./node_modules/@polymer/paper-button/paper-button.js","./node_modules/@polymer/iron-icons/iron-icons.js","./node_modules/@polymer/paper-tooltip/paper-tooltip.js","./lib/a11y-tab.js"],function(_exports,_litElement,_responsiveUtility,_paperButton,_ironIcons,_paperTooltip,_a11yTab){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.A11yTabs=void 0;function _templateObject3_cde4b2f012fb11eab57c45cbe29e58af(){var data=babelHelpers.taggedTemplateLiteral(["\n:host {\n  display: block;\n  --a11y-tabs-border-radius: 2px;\n  --a11y-tabs-justify-tabs: flex-start;\n  --ally-tabs-wrap: unset;\n  --a11y-tabs-background: white;\n  --a11y-tabs-border-color: #ddd;\n  --a11y-tabs-color: #222;\n  --a11y-tabs-focus-color: #000;\n  --a11y-tabs-faded-background: #eee;\n  --a11y-tabs-content-padding: 16px;\n  --a11y-tabs-button-padding: 0.7em 0.57em;\n  --a11y-tabs-vertical-button-padding: unset;\n  --a11y-tabs-horizontal-border-radius: unset;\n  --a11y-tabs-vertical-border-radius: unset;\n  --a11y-tabs-horizontal-button-padding: 2px 5px;\n  height: var(--a11y-tabs-height);\n  overflow: var(--a11y-tabs-overflow);\n}\n:host([vertical]) {\n  border: 1px solid var(--a11y-tabs-border-color);\n  border-radius: var(--a11y-tabs-vertical-border-radius, var(--a11y-tabs-border-radius));\n  display: flex;\n  justify-content: space-between;\n  align-items: stretch;\n}\n:host([hidden]) {\n  display: none;\n}\n:host #tabs {\n  align-items: stretch;\n  flex-wrap: var(--ally-tabs-wrap, unset);\n  margin: 0;\n  display: flex;\n  list-style: none;\n  padding: 0;\n}\n:host([vertical]) #tabs {\n  background-color: var(--a11y-tabs-border-color);\n  justify-content: var(--a11y-tabs-vertical-justify-tabs, var(--a11y-tabs-justify-tabs, flex-start));\n  flex-wrap: var(--ally-tabs-vertical-wrap, var(--ally-tabs-wrap, unset));\n  border-left: none;\n  flex: 0 1 auto;\n  flex-direction: column;\n}\n:host(:not([vertical])) #tabs {\n  justify-content: var(--a11y-tabs-horizontal-justify-tabs, var(--a11y-tabs-justify-tabs, flex-start));\n}\n:host #tabs .flag-type {\n  position: absolute;\n  left: -99999px;\n  height: 0; \n  overflow: hidden;\n}\n:host #content {\n  padding: var(--a11y-tabs-content-padding);\n  background-color: var(--a11y-tabs-background);\n  border: 1px solid var(--a11y-tabs-border-color);\n}\n:host([vertical]) #content {\n  flex: 1 0 auto;\n  border: none;\n}\n:host(:not([vertical])) #content {\n  border-radius: var(--a11y-tabs-horizontal-border-radius, var(--a11y-tabs-border-radius));\n  margin-top: -1px;\n}\n:host #tabs paper-button {\n  margin: 0;\n  text-transform: unset;\n  color: var(--a11y-tabs-color);\n  background-color: var(--a11y-tabs-faded-background);\n  border: 1px solid var(--a11y-tabs-border-color);\n  padding: var(--a11y-tabs-button-padding, 0.7em 0.57em);\n}\n:host([vertical]) #tabs paper-button {\n  border-top: none;\n  border-left: none;\n  border-radius: 0; \n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: var(--a11y-tabs-vertical-button-padding, var(--a11y-tabs-button-padding));\n}\n:host(:not([vertical])) #tabs paper-button {\n  width: 100%;\n  border-bottom: none;\n  border-radius: \n    var(--a11y-tabs-horizontal-border-radius, var(--a11y-tabs-border-radius))\n    var(--a11y-tabs-horizontal-border-radius, var(--a11y-tabs-border-radius))\n    0 \n    0; \n  padding: var(--a11y-tabs-horizontal-button-padding, var(--a11y-tabs-button-padding));\n}\n:host(:not([vertical])) #tabs li:not(:first-of-type) paper-button {\n  border-left: none;\n}\n:host  #tabs paper-button:active,\n:host #tabs paper-button:focus,\n:host #tabs paper-button:hover {\n  color: var(--a11y-tabs-focus-color);\n  background-color: var(--a11y-tabs-faded-background);\n}\n:host #tabs paper-button[disabled] {\n  color: var(--a11y-tabs-focus-color);\n  background-color: var(--a11y-tabs-background);\n}\n:host([vertical]) #tabs paper-button[disabled] {\n  border-right-color: var(--a11y-tabs-background);\n}\n:host(:not([vertical])) #tabs paper-button[disabled] {\n  border-bottom: 1px solid var(--a11y-tabs-background);\n}\n:host #tabs span.label,\n:host #tabs .flag-icon {\n  margin-right: 8px;\n}\n:host #tabs.icons-only paper-button {\n  justify-content: center;\n}\n:host #tabs.icons-only span.label {\n  display:none;\n}\n:host #tabs:not(.icons-only) paper-tooltip {\n  display:none;\n}\n      "]);_templateObject3_cde4b2f012fb11eab57c45cbe29e58af=function _templateObject3_cde4b2f012fb11eab57c45cbe29e58af(){return data};return data}function _templateObject2_cde4b2f012fb11eab57c45cbe29e58af(){var data=babelHelpers.taggedTemplateLiteral(["\n    <li>\n      <paper-button \n        id=\"","-button\" \n        controls=\"","\" \n        @click=\"","\"\n        ?disabled=\"","\" \n        .flag=\"","\">\n        <iron-icon \n          class=\"flag-icon\" \n          ?hidden=\"","\" \n          .icon=\"","\">\n        </iron-icon>\n        <span class=\"label\">","</span> \n        <span \n          class=\"flag-type\" \n          ?hidden=\"","\">\n          ","\n        </span>\n        <iron-icon \n          class=\"icon\" \n          ?hidden=\"","\" \n          .icon=\"","\">\n        </iron-icon>\n      </paper-button>\n      <paper-tooltip for=\"","-button\">","</paper-tooltip>\n    </li>\n  "]);_templateObject2_cde4b2f012fb11eab57c45cbe29e58af=function _templateObject2_cde4b2f012fb11eab57c45cbe29e58af(){return data};return data}function _templateObject_cde4b2f012fb11eab57c45cbe29e58af(){var data=babelHelpers.taggedTemplateLiteral(["\n\n<ul id=\"tabs\" .class=\"","\">\n  ","\n</ul>\n<div id=\"content\">\n  <slot></slot>\n</div>"]);_templateObject_cde4b2f012fb11eab57c45cbe29e58af=function _templateObject_cde4b2f012fb11eab57c45cbe29e58af(){return data};return data}/**
 * `a11y-tabs`
 * @customElement a11y-tabs
 * an accessible and responsive tabbed interface
 * 
### Styling

`<a11y-tabs>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--a11y-tabs-tab-height` | tab height | `--a11y-tabs-height`
 *

 * @polymer
 * @demo ./demo/index.html
 */var A11yTabs=/*#__PURE__*/function(_LitElement){babelHelpers.inherits(A11yTabs,_LitElement);babelHelpers.createClass(A11yTabs,[{key:"render",// render function
value:function render(){var _this2=this;return(0,_litElement.html)(_templateObject_cde4b2f012fb11eab57c45cbe29e58af(),this._showIcons(this.__hasIcons,this.iconBreakpoint,this.layoutBreakpoint,this.responsiveSize),this.__items.map(function(tab){return(0,_litElement.html)(_templateObject2_cde4b2f012fb11eab57c45cbe29e58af(),tab.id,tab.id,function(e){return _this2._handleTab("".concat(tab.id))},tab.id===_this2.activeTab,tab.flag,!tab.flagIcon,tab.flagIcon,tab.label,!tab.flag,tab.flag,!tab.icon,tab.icon,tab.id,tab.label)}))}// haxProperty definition
}],[{key:"styles",//styles function
get:function get(){return[(0,_litElement.css)(_templateObject3_cde4b2f012fb11eab57c45cbe29e58af())]}},{key:"haxProperties",get:function get(){return{}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return babelHelpers.objectSpread({},babelHelpers.get(babelHelpers.getPrototypeOf(A11yTabs),"properties",this),{/**
   * the id of the active tab
   */activeTab:{type:String,attribute:"active-tab"},/**
   * whether the tabbed interface is disabled
   */disabled:{type:Boolean,reflect:!0},/**
   * whether the tabbed interface is hidden
   */hidden:{type:Boolean,reflect:!0},/**
   * the minimum breakpoint for showing tab text with icons, or
   * - use `0` to always show icons only
   * - use `-1` to always show text with icons
   */iconBreakpoint:{type:Number,attribute:"icon-breakpoint"},/**
   * unique identifier/anchor for the tabbed interface
   */id:{type:String,reflect:!0},/**
   * the minimum breakpoint for horizontal layout of tabs, or
   * - use `0` for horizontal-only
   * - use `-1` for vertical-only
   */layoutBreakpoint:{type:Number,attribute:"layout-breakpoint"},/**
   * the size of the tabs,
   * where `xs` is the smaller breakpoint
   * and `xs` is the larger breakpoint
   */responsiveSize:{type:String,reflect:!0,attribute:"responsive-size"},/**
   * whether the tabbed interface is in vertical layout mode
   */vertical:{type:Boolean,reflect:!0},/**
   * whether the tabbed interface has icons for each tab
   */__hasIcons:{type:Boolean},/**
   * an array of tab data based on slotted `a11y-tab` elements
   */__items:{type:Array},/**
   * a mutation observer to monitor slotted `a11y-tab` elements
   */__observer:{type:Object}})}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"a11y-tabs"}}]);function A11yTabs(){var _this;babelHelpers.classCallCheck(this,A11yTabs);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(A11yTabs).call(this));var callback=function callback(mutationsList,observer){return _this.updateItems()};_this.activeTab=null;_this.disabled=!1;_this.hidden=!1;_this.iconBreakpoint=400;_this.id=null;_this.layoutBreakpoint=600;_this.responsiveSize="xs";_this.vertical=!1;_this.__hasIcons=!1;_this.__items=[];_this.updateItems();_this.__observer=new MutationObserver(callback);_this._breakpointChanged();window.ResponsiveUtility.requestAvailability();_this.__observer.observe(babelHelpers.assertThisInitialized(_this),{attributes:!1,childList:!0,subtree:!1});_this.addEventListener("a11y-tab-changed",function(e){return _this.updateItems()});return _this}/**
   * life cycle, element is afixed to the DOM
   */babelHelpers.createClass(A11yTabs,[{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(A11yTabs.prototype),"connectedCallback",this).call(this)}/**
   * life cycle, element is removed from the DOM
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){var _this3=this;if(this.__observer&&this.__observer.disconnect)this.__observer.disconnect();this.removeEventListener("a11y-tab-changed",function(e){return _this3.updateItems()});this._unsetBreakpoints();babelHelpers.get(babelHelpers.getPrototypeOf(A11yTabs.prototype),"disconnectedCallback",this).call(this)}},{key:"updated",value:function updated(changedProperties){var _this4=this;changedProperties.forEach(function(oldValue,propName){if("id"===propName)_this4._idChanged(_this4.id,oldValue);if("activeTab"===propName)_this4.selectTab(_this4.activeTab);if("iconBreakpoint"===propName)_this4._breakpointChanged();if("layoutBreakpoint"===propName)_this4._breakpointChanged();if("responsiveSize"===propName)_this4._setVertical()})}/**
   * selects a tab
   * @param {string} id the active tab's id
   */},{key:"selectTab",value:function selectTab(id){var tabs=this.querySelectorAll("a11y-tab"),selected=id&&this.querySelector("a11y-tab#".concat(id))?this.querySelector("a11y-tab#".concat(id)):this.querySelector("a11y-tab");if(selected&&selected.id!==id){this.activeTab=selected.id;return}else if(tabs&&0<tabs.length){tabs.forEach(function(tab){tab.hidden=tab.id!==id})}}/**
   * updates the list of items based on slotted a11y-tab elements
   */},{key:"updateItems",value:function updateItems(e){var _this5=this;this.__items=[];var tabs=this.querySelectorAll("a11y-tab"),ctr=1;this.__hasIcons=!0;if(!this.id)this.id=this._generateUUID();if(tabs&&0<tabs.length)tabs.forEach(function(tab){_this5.__items.push({id:tab.id||"tab-".concat(ctr),flag:tab.flag,flagIcon:tab.flagIcon,icon:tab.icon,label:tab.label||"Tab ".concat(ctr)});if(!tab.icon)_this5.__hasIcons=!1;tab.__xOfY="".concat(ctr," of ").concat(tabs.length);tab.__toTop=_this5.id});this.selectTab(this.activeTab)}/**
   * Observer activeTab for changes
   * @param {string} newValue the new active tab's id
   */},{key:"_activeTabChanged",value:function _activeTabChanged(newValue){this.selectTab(newValue)}/**
   * handles any breakpoint changes
   * @param {event} e the tab change event
   */},{key:"_breakpointChanged",value:function _breakpointChanged(){this._unsetBreakpoints();this._setBreakpoints();this._setVertical()}/**
   * generates a unique id
   * @returns {string } unique id
   */},{key:"_generateUUID",value:function _generateUUID(){return"ss-s-s-s-sss".replace(/s/g,Math.floor(65536*(1+Math.random())).toString(16).substring(1))}/**
   * handles a tab being tapped and sets the new active tab
   * @param {event} e the tab tap event
   */},{key:"_handleTab",value:function _handleTab(id){this.activeTab=id}/**
   * ensures that there is always an id for this tabbed interface so that we can link back to the top of it
   * @param {string} newValue the new id
   * @param {string} oldValue the old id
   */},{key:"_idChanged",value:function _idChanged(newValue,oldValue){if(!newValue)this.id="a11y-tabs"+this._generateUUID()}/**
   * Fires when element is ready to request  breakpoint tracking from repsonsive  utility.
   *
   * @event responsive-element
   */},{key:"_setBreakpoints",value:function _setBreakpoints(){var v=-1<this.layoutBreakpoint?this.layoutBreakpoint:0,i=-1<this.iconBreakpoint?this.iconBreakpoint:0,sm=i>v?v:i,md=i>v?i:v,lg=Math.max(i,v)+1,xl=Math.max(i,v)+2;window.dispatchEvent(new CustomEvent("responsive-element",{detail:{element:this,attribute:"responsive-size",relativeToParent:!0,sm:sm,md:md,lg:lg,xl:xl}}))}/**
   * determines if tabs should be in a vertical layout
   * @param {number} icon breakpoint for icon-only view
   * @param {number} layout breakpoint for vertical layout
   * @param {string} size the responsive size
   */},{key:"_setVertical",value:function _setVertical(){this.vertical=-1===this.layoutBreakpoint||this.iconBreakpoint>this.layoutBreakpoint?"xs"===this.responsiveSize:-1<this.responsiveSize.indexOf("s")}/**
   * determines if tabs should show icons only
   * @param {boolean} hasIcons does every tab have an icon?
   * @param {number} icon breakpoint for icon-only view
   * @param {number} layout breakpoint for vertical layout
   * @param {string} size the responsive size
   * @returns {boolean} if tabs should be in a vertical layout
   */},{key:"_showIcons",value:function _showIcons(hasIcons,icon,layout,size){return hasIcons&&-1!==icon&&("xs"===size||icon>layout&&"sm"===size)?"icons-only":""}/**
   * Fires when element is rno longer needs specific breakpoints tracked.
   *
   * @event responsive-element-deleted
   */},{key:"_unsetBreakpoints",value:function _unsetBreakpoints(){window.dispatchEvent(new CustomEvent("responsive-element-deleted",{bubbles:!0,cancelable:!0,composed:!0,detail:this}))}}]);return A11yTabs}(_litElement.LitElement);_exports.A11yTabs=A11yTabs;window.customElements.define(A11yTabs.tag,A11yTabs)});