define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js","./node_modules/@lrnwebcomponents/responsive-utility/responsive-utility.js","./node_modules/@polymer/paper-button/paper-button.js","./node_modules/@polymer/iron-icons/iron-icons.js","./node_modules/@polymer/paper-tooltip/paper-tooltip.js","./lib/a11y-tab.js"],function(_exports,_polymerElement,_HAXWiring,_responsiveUtility,_paperButton,_ironIcons,_paperTooltip,_a11yTab){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.A11yTabs=void 0;function _templateObject_52e553c0ab1311e9be545109db650333(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n  --a11y-tabs-border-radius: 2px;\n  --a11y-tabs-justify-tabs: flex-start;\n  --ally-tabs-wrap: unset;\n  --a11y-tabs-background: white;\n  --a11y-tabs-border-color: #ddd;\n  --a11y-tabs-color: #222;\n  --a11y-tabs-focus-color: #000;\n  --a11y-tabs-faded-background: #eee;\n  --a11y-tabs-button-padding: 0.7em 0.57em;\n  --a11y-tabs-vertical-button-padding: unset;\n  --a11y-tabs-horizontal-border-radius: unset;\n  --a11y-tabs-vertical-border-radius: unset;\n  --a11y-tabs-horizontal-button-padding: 2px 5px;\n}\n:host([vertical]) {\n  border-radius: var(--a11y-tabs-vertical-border-radius, var(--a11y-tabs-border-radius));\n  display: flex;\n  justify-content: space-between;\n  align-items: stretch;\n  @apply --a11y-tabs-vertical;\n}\n:host(:not([vertical])) {\n  @apply --a11y-tabs-horizontal;\n}\n:host([hidden]) {\n  display: none;\n}\n:host #tabs {\n  align-items: stretch;\n  flex-wrap: var(--ally-tabs-wrap, unset);\n  margin: 0;\n  display: flex;\n  list-style: none;\n  padding: 0;\n  @apply --a11y-tabs-tabs;\n}\n:host([vertical]) #tabs {\n  justify-content: var(--a11y-tabs-vertical-justify-tabs, var(--a11y-tabs-justify-tabs, flex-start));\n  flex-wrap: var(--ally-tabs-vertical-wrap, var(--ally-tabs-wrap, unset));\n  flex: 0 1 auto;\n  flex-direction: column;\n  @apply --a11y-tabs-vertical-tabs;\n}\n:host(:not([vertical])) #tabs {\n  justify-content: var(--a11y-tabs-horizontal-justify-tabs, var(--a11y-tabs-justify-tabs, flex-start));\n  @apply --a11y-tabs-horizontal-tabs;\n}\n:host #tabs .flag-type {\n  position: absolute;\n  left: -99999px;\n  height: 0; \n  overflow: hidden;\n}\n:host #content {\n  background-color: var(--a11y-tabs-background, white);\n  border: 1px solid var(--a11y-tabs-border-color, #ddd);\n  @apply --a11y-tabs-content;\n}\n:host([vertical]) #content {\n  flex: 1 0 auto;\n  border-left: none;\n  @apply --a11y-tabs-vertical-content;\n}\n:host(:not([vertical])) #content {\n  border-radius: var(--a11y-tabs-horizontal-border-radius, var(--a11y-tabs-border-radius));\n  margin-top: -1px;\n  @apply --a11y-tabs-horizontal-content;\n}\n:host paper-button {\n  margin: 0;\n  text-transform: unset;\n  color: var(--a11y-tabs-color, #222);\n  background-color: var(--a11y-tabs-faded-background, #eee);\n  border: 1px solid var(--a11y-tabs-border-color, #ddd);\n  padding: var(--a11y-tabs-button-padding, 0.7em 0.57em);\n  @apply --a11y-tabs-button;\n}\n:host([vertical]) paper-button {\n  border-radius: 0; \n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-right: none;\n  padding: var(--a11y-tabs-vertical-button-padding, var(--a11y-tabs-button-padding));\n  @apply --a11y-tabs-vertical-button;\n}\n:host(:not([vertical])) paper-button {\n  width: 100%;\n  border-bottom: none;\n  border-radius: \n    var(--a11y-tabs-horizontal-border-radius, var(--a11y-tabs-border-radius))\n    var(--a11y-tabs-horizontal-border-radius, var(--a11y-tabs-border-radius))\n    0 \n    0; \n  padding: var(--a11y-tabs-horizontal-button-padding, var(--a11y-tabs-button-padding));\n  @apply --a11y-tabs-horizontal-button;\n}\n:host paper-button:active,\n:host paper-button:focus,\n:host paper-button:hover {\n  color: var(--a11y-tabs-focus-color, #000);\n  background-color: var(--a11y-tabs-faded-background, #eee);\n}\n:host paper-button:focus {\n  @apply --a11y-tabs-button-focus;\n}\n:host paper-button:active {\n  @apply --a11y-tabs-button-active;\n}\n:host paper-button:hover {\n  @apply --a11y-tabs-button-hover;\n}\n:host paper-button[disabled] {\n  color: var(--a11y-tabs-focus-color, #000);\n  background-color: var(--a11y-tabs-background, white);\n  @apply --a11y-tabs-active-button;\n}\n:host([vertical]) paper-button[disabled] {\n  border-right: 1px solid white;\n  @apply --a11y-tabs-vertical-active-button;\n}\n:host(:not([vertical])) paper-button[disabled] {\n  border-bottom: 1px solid var(--a11y-tabs-background, white);\n  @apply --a11y-tabs-horizontal-active-button;\n}\n:host #tabs span.label,\n:host #tabs .flag-icon {\n  margin-right: 8px;\n}\n:host([icons-only]) #tabs paper-button {\n  justify-content: center;\n}\n:host([icons-only]) #tabs span.label {\n  display:none;\n}\n:host(:not([icons-only])) #tabs paper-tooltip {\n  display:none;\n}\n:host #tabs paper-button[flag] {\n  @apply --a11y-tab-flagged-tab;\n}\n:host #tabs .flag-icon {\n  @apply --a11y-tab-flag-icon;\n}\n</style>\n<ul id=\"tabs\">\n  <template is=\"dom-repeat\" items=\"[[__items]]\" as=\"tab\">\n    <li>\n      <paper-button \n        id$=\"[[tab.id]]-button\" \n        flag$=\"[[tab.flag]]\"\n        disabled$=\"[[_isActiveTab(tab.id,activeTab)]]\" \n        controls$=\"[[tab.id]]\" \n        on-tap=\"_handleTab\">\n        <iron-icon \n          class=\"flag-icon\" \n          hidden$=\"[[!tab.flagIcon]]\" \n          icon$=\"[[tab.flagIcon]]\">\n        </iron-icon>\n        <span class=\"label\">[[tab.label]]</span> \n        <span \n          class=\"flag-type\" \n          hidden!=\"[[!tab.flag]]\">\n          [[tab.flag]]\n        </span>\n        <iron-icon \n          class=\"icon\" \n          hidden$=\"[[!tab.icon]]\" \n          icon$=\"[[tab.icon]]\">\n        </iron-icon>\n      </paper-button>\n      <paper-tooltip for=\"[[tab.id]]-button\">[[tab.label]]</paper-tooltip>\n    </li>\n  </template>\n</ul>\n<div id=\"content\">\n  <slot></slot>\n</div>"]);_templateObject_52e553c0ab1311e9be545109db650333=function _templateObject_52e553c0ab1311e9be545109db650333(){return data};return data}/**
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
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(A11yTabs.prototype),"connectedCallback",this).call(this);var root=this,callback=function callback(mutationsList,observer){root.updateItems()};this.updateItems();this.__observer=new MutationObserver(callback);this.__observer.observe(this,{attributes:!1,childList:!0,subtree:!1});this.addEventListener("a11y-tab-changed",function(e){root.updateItems()});this.addEventListener("a11y-tab-previous",function(e){console.log("a11y-tab-previous",e)});window.ResponsiveUtility.requestAvailability();this._breakpointChanged()}/**
   * life cycle, element is removed from the DOM
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){var root=this;this.__observer.disconnect();this.removeEventListener("a11y-tab-changed",function(e){root.updateItems()});window.dispatchEvent(new CustomEvent("responsive-element-deleted",{bubbles:!0,cancelable:!0,composed:!0,detail:root}));babelHelpers.get(babelHelpers.getPrototypeOf(A11yTabs.prototype),"disconnectedCallback",this).call(this)}/**
   * selects a tab
   * @param {string} id the active tab's id
   */},{key:"selectTab",value:function selectTab(id){var tabs=this.querySelectorAll("a11y-tab"),selected=id&&this.querySelector("a11y-tab#".concat(id))?this.querySelector("a11y-tab#".concat(id)):this.querySelector("a11y-tab");if(selected.id!==id){this.activeTab=selected.id;return}else if(tabs&&0<tabs.length){tabs.forEach(function(tab){tab.hidden=tab.id!==id})}}/**
   * updates the list of items based on slotted a11y-tab elements
   */},{key:"updateItems",value:function updateItems(){var _this=this;this.set("__items",[]);var tabs=this.querySelectorAll("a11y-tab"),ctr=1;this.__hasIcons=!0;if(!this.id)this.id=this._generateUUID();if(tabs&&0<tabs.length)tabs.forEach(function(tab){_this.push("__items",{id:tab.id||"tab-".concat(ctr),flag:tab.flag,flagIcon:tab.flagIcon,icon:tab.icon,label:tab.label||"Tab ".concat(ctr)});if(!tab.icon)_this.__hasIcons=!1;tab.__xOfY="".concat(ctr," of ").concat(tabs.length);tab.__toTop=_this.id});this.selectTab(this.activeTab)}/**
   * Observer activeTab for changes
   * @param {string} newValue the new active tab's id
   */},{key:"_activeTabChanged",value:function _activeTabChanged(newValue){this.selectTab(newValue)}/**
   * handles any breakpoint changes
   * @param {event} e the tab change event
   */},{key:"_breakpointChanged",value:function _breakpointChanged(e){var root=this,v=-1<this.layoutBreakpoint?this.layoutBreakpoint:0,i=-1<this.iconBreakpoint?this.iconBreakpoint:0,sm=i>v?v:i,md=i>v?i:v,lg=Math.max(i,v)+1,xl=Math.max(i,v)+2;window.dispatchEvent(new CustomEvent("responsive-element-deleted",{bubbles:!0,cancelable:!0,composed:!0,detail:root}));this.responsiveSize="xs";console.log("_breakpointChanged",this.layoutBreakpoint,this.iconBreakpoint,v,i,sm,md,lg,xl);window.dispatchEvent(new CustomEvent("responsive-element",{detail:{element:root,attribute:"responsive-size",relativeToParent:!0,sm:sm,md:md,lg:lg,xl:xl}}))}/**
   * generates a unique id
   * @returns {string } unique id
   */},{key:"_generateUUID",value:function _generateUUID(){return"ss-s-s-s-sss".replace(/s/g,Math.floor(65536*(1+Math.random())).toString(16).substring(1))}/**
   * handles a tab being tapped and sets the new active tab
   * @param {event} e the tab tap event
   */},{key:"_handleTab",value:function _handleTab(e){if(e.model&&e.model.__data&&e.model.__data.tab)this.activeTab=e.model.__data.tab.id}/**
   * ensures that there is always an id for this tabbed interface so that we can link back to the top of it
   * @param {string} newValue the new id
   * @param {string} oldValue the old id
   */},{key:"_idChanged",value:function _idChanged(newValue,oldValue){if(!newValue)this.id="a11y-tabs"+this._generateUUID()}/**
   * determines if a given tab is active
   * @param {string} id the tab's id
   * @param {string} activeTab the active tab's id
   * @returns {boolean} if a given tab is active
   */},{key:"_isActiveTab",value:function _isActiveTab(id,activeTab){return id===activeTab}/**
   * determines if tabs should be in a vertical layout
   * @param {number} icon breakpoint for icon-only view
   * @param {number} layout breakpoint for vertical layout
   * @param {string} size the responsive size
   * @returns {boolean} if tabs should be in a vertical layout
   */},{key:"_isVertical",value:function _isVertical(icon,layout,size){return-1===layout||icon>layout?"xs"===size:-1<size.indexOf("s")}/**
   * determines if tabs should show icons only
   * @param {boolean} hasIcons does every tab have an icon?
   * @param {number} icon breakpoint for icon-only view
   * @param {number} layout breakpoint for vertical layout
   * @param {string} size the responsive size
   * @returns {boolean} if tabs should be in a vertical layout
   */},{key:"_showIcons",value:function _showIcons(hasIcons,icon,layout,size){return hasIcons&&-1!==icon&&("xs"===size||icon>layout&&"sm"===size)}}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_52e553c0ab1311e9be545109db650333())}// haxProperty definition
},{key:"haxProperties",get:function get(){return}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{/**
   * the id of the active tab
   */activeTab:{name:"activeTab",type:"String",value:null,observer:"selectTab"},/**
   * whether the tabbed interface is disabled
   */disabled:{name:"disabled",type:"Boolean",value:!1,reflectToAttribute:!0},/**
   * whether the tabbed interface is hidden
   */hidden:{name:"hidden",type:"Boolean",value:!1,reflectToAttribute:!0},/**
   * the minimum breakpoint for showing tab text with icons, or
   * - use `0` to always show icons only
   * - use `-1` to always show text with icons
   */iconBreakpoint:{name:"iconBreakpoint",type:"Number",value:400,observer:"_breakpointChanged"},/**
   * whether the tabs show only icons (no text)
   */iconsOnly:{name:"iconsOnly",type:"Boolean",computed:"_showIcons(__hasIcons,iconBreakpoint,layoutBreakpoint,responsiveSize)",reflectToAttribute:!0},/**
   * unique identifier/anchor for the tabbed interface
   */id:{name:"id",type:"String",value:null,reflectToAttribute:!0,observer:"_idChanged"},/**
   * the minimum breakpoint for horizontal layout of tabs, or
   * - use `0` for horizontal-only
   * - use `-1` for vertical-only
   */layoutBreakpoint:{name:"layoutBreakpoint",type:"Number",value:600,observer:"_breakpointChanged"},/**
   * the size of the tabs,
   * where `xs` is the smaller breakpoint
   * and `xs` is the larger breakpoint
   */responsiveSize:{name:"responsiveSize",type:"String",value:"xs"},/**
   * whether the tabbed interface is in vertical layout mode
   */vertical:{name:"vertical",type:"Boolean",computed:"_isVertical(iconBreakpoint,layoutBreakpoint,responsiveSize)",reflectToAttribute:!0},/**
   * whether the tabbed interface has icons for each tab
   */__hasIcons:{name:"__hasIcons",type:"Boolean",value:!1},/**
   * an array of tab data based on slotted `a11y-tab` elements
   */__items:{name:"__items",type:"Array",value:[]},/**
   * a mutation observer to monitor slotted `a11y-tab` elements
   */__observer:{name:"__observer",type:"Object",value:null}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"a11y-tabs"}}]);return A11yTabs}(_polymerElement.PolymerElement);_exports.A11yTabs=A11yTabs;window.customElements.define(A11yTabs.tag,A11yTabs)});