define(["exports"],function(_exports){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.LazyImportDiscover=void 0;/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */ /**
 * `lazy-import-discover`
 * `Break peoples' brains on simplifying webcomponent integrations`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @demo demo/index.html
 */var LazyImportDiscover=/*#__PURE__*/function(_HTMLElement){babelHelpers.inherits(LazyImportDiscover,_HTMLElement);babelHelpers.createClass(LazyImportDiscover,null,[{key:"tag",/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */get:function get(){return"lazy-import-discover"}/**
   * life cycle
   */}]);function LazyImportDiscover(){var _this,delayRender=0<arguments.length&&arguments[0]!==void 0?arguments[0]:!1;babelHelpers.classCallCheck(this,LazyImportDiscover);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(LazyImportDiscover).call(this));// set tag for later use
_this.tag=LazyImportDiscover.tag;return _this}babelHelpers.createClass(LazyImportDiscover,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){var _this2=this;this.__ready=!0;var dyn="";if(null==this.base){this.base="../node_modules"}document.querySelectorAll(":not(:defined)").forEach(function(el,index){var t=el.tagName.toLowerCase(),path="@lrnwebcomponents/".concat(t,"/").concat(t,".js");if(null!=el.getAttribute("data-wc-def")){path=el.getAttribute("data-wc-def")}if("style"!==t){dyn+="import('".concat(_this2.base,"/").concat(path,"');\n")}});var s=document.createElement("script");s.type="module";s.innerText=dyn;document.head.appendChild(s)}},{key:"attributeChangedCallback",value:function attributeChangedCallback(attr,oldValue,newValue){if("base"===attr&&newValue){console.log("base changed")}}},{key:"base",get:function get(){return this.getAttribute("base")},set:function set(value){if(null!=value&&this.__ready){this.setAttribute("base",value)}}}],[{key:"observedAttributes",get:function get(){return["base"]}}]);return LazyImportDiscover}(babelHelpers.wrapNativeSuper(HTMLElement));_exports.LazyImportDiscover=LazyImportDiscover;window.customElements.define(LazyImportDiscover.tag,LazyImportDiscover);// self append. this is beyond trippy but the window loading will actually self invoke
window.addEventListener("DOMContentLoaded",function(event){var el=document.createElement(LazyImportDiscover.tag);if(window.LazyImportBase){el.setAttribute("base",window.LazyImportBase)}document.body.appendChild(el)})});