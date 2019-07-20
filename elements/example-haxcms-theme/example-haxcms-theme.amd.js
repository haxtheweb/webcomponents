define(["exports","require","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/polymer/lib/utils/render-status.js","./node_modules/@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSThemeWiring.js","./node_modules/@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js","./node_modules/mobx/lib/mobx.module.js"],function(_exports,_require,_polymerElement,_renderStatus,_HAXCMSThemeWiring,_haxcmsSiteStore,_mobxModule){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.ExampleHaxcmsTheme=void 0;_require=babelHelpers.interopRequireWildcard(_require);function _templateObject_e39f0d80ab1711e98b8c49f68b0bce2a(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>\n:host {\n  display: block;\n  \n  --example-haxcms-theme-color: #222222;\n}\n\n:host([hidden]) {\n  display: none;\n}\n\n:host([edit-mode]) #slot {\n  display: none;\n}\n\n:host #slot ::slotted(*) {\n  color: var(--example-haxcms-theme-color);\n}</style>\n<site-top-menu noink indicator=\"arrow\" arrow-size=\"8\">\n  <site-title slot=\"prefix\" class=\"spacing\"></site-title>\n  <site-modal slot=\"suffix\" icon=\"icons:search\" title=\"Search site\" button-label=\"Search\">\n    <site-search></site-search>\n  </site-modal>\n</site-top-menu>\n<site-breadcrumb></site-breadcrumb>\n<div id=\"contentcontainer\">\n  <div id=\"slot\">\n    <slot></slot>\n  </div>\n</div>\n<site-menu-button type=\"prev\" position=\"top\"></site-menu-button>\n<site-menu-button type=\"next\" position=\"top\"></site-menu-button>"]);_templateObject_e39f0d80ab1711e98b8c49f68b0bce2a=function _templateObject_e39f0d80ab1711e98b8c49f68b0bce2a(){return data};return data}/**
 * `example-haxcms-theme`
 * `A basic, well documented example theme for HAXcms`
 *
 * @microcopy - language worth noting:
 *  - HAXcms - A content management system that builds state of the art one page apps via GUI
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var ExampleHaxcmsTheme=/*#__PURE__*/function(_HAXCMSTheme){babelHelpers.inherits(ExampleHaxcmsTheme,_HAXCMSTheme);babelHelpers.createClass(ExampleHaxcmsTheme,null,[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_e39f0d80ab1711e98b8c49f68b0bce2a())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){var props={/**
   * Edit mode which will be updated whenever HAXcms store
   * has been updated. It's also reflected to attribute which
   * is a Polymer convention to allow it to be leveraged in
   * CSS styling.
   */editMode:{name:"editMode",type:Boolean,reflectToAttribute:!0},/**
   * Current array index of the active page that's been loaded.
   */activeManifestIndex:{name:"activeManifestIndex",type:Number}};if(babelHelpers.get(babelHelpers.getPrototypeOf(ExampleHaxcmsTheme),"properties",this)){props=Object.assign(props,babelHelpers.get(babelHelpers.getPrototypeOf(ExampleHaxcmsTheme),"properties",this))}return props}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"example-haxcms-theme"}/**
   * life cycle, constructor
   */}]);function ExampleHaxcmsTheme(){var _this;babelHelpers.classCallCheck(this,ExampleHaxcmsTheme);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(ExampleHaxcmsTheme).call(this));// dynamic import ensures that your theme will end users a better experience
// by reducing the time to first paint. JS Modules block the tree until all imports
// at the top of the document have been resolved. Dynamic imports ike these
// can be used to ensure that they still load but that the user starts to see
// content prior to all assets loading.
new Promise(function(res,rej){return _require.default(["./node_modules/@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-top-menu.js"],res,rej)});new Promise(function(res,rej){return _require.default(["./node_modules/@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js"],res,rej)});new Promise(function(res,rej){return _require.default(["./node_modules/@lrnwebcomponents/haxcms-elements/lib/ui-components/layout/site-modal.js"],res,rej)});// create a blank array to store mobx reactions
// this allows us to nicely clean up state after the theme
// has been disconnected from the DOM
_this.__disposer=[];// afterNextRender is a life cycle event specific to Polymer but ensures that
// these items don't fire until after the element has been rendered to the screen
// This happens AFTER DOM connection and visibility of the element meaning it's
// very late in the life cycle. This is useful for things that are not critical to the
// initial UI / UX of the site. In this example, the menu buttons to navigate back and forth
// as well as the search engine. These WILL load but might not be available until a few seconds
// after the page loads (the first time). Again, this helps unblock the render tree
// to deliver the page to users faster
(0,_renderStatus.afterNextRender)(babelHelpers.assertThisInitialized(_this),function(){new Promise(function(res,rej){return _require.default(["./node_modules/@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu-button.js"],res,rej)});new Promise(function(res,rej){return _require.default(["./node_modules/@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-search.js"],res,rej)})});return _this}/**
   * life cycle, element is afixed to the DOM
   */babelHelpers.createClass(ExampleHaxcmsTheme,[{key:"connectedCallback",value:function connectedCallback(){var _this2=this;babelHelpers.get(babelHelpers.getPrototypeOf(ExampleHaxcmsTheme.prototype),"connectedCallback",this).call(this);// HAXcms's theme layer uses Mobx to ensure state is simple and maintained
// accurately across theme changes and the many site- elements.
// This example will maintain the active manifest index in this theme
// meaning the array position of the currently active page. This is
// useful when creating in theme pagination or reacting to specific
// indexes like 1st and last.
(0,_mobxModule.autorun)(function(reaction){_this2.activeManifestIndex=(0,_mobxModule.toJS)(_haxcmsSiteStore.store.activeManifestIndex);_this2.__disposer.push(reaction)});// editMode is the global state of the HAXeditor as reflected in HAXcms
(0,_mobxModule.autorun)(function(reaction){_this2.editMode=(0,_mobxModule.toJS)(_haxcmsSiteStore.store.editMode);_this2.__disposer.push(reaction)})}/**
   * life cycle, element is removed from the DOM
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){// this ensures that we clean up the listeners on mobx after the theme
// has been disconnected. This happens when we have multiple theme tags or
// the user has defined that specific nodes should have different designs
// which then disconnects this theme and connects the new one.
for(var i in this.__disposer){this.__disposer[i].dispose()}babelHelpers.get(babelHelpers.getPrototypeOf(ExampleHaxcmsTheme.prototype),"disconnectedCallback",this).call(this)}}]);return ExampleHaxcmsTheme}((0,_HAXCMSThemeWiring.HAXCMSTheme)(_polymerElement.PolymerElement));_exports.ExampleHaxcmsTheme=ExampleHaxcmsTheme;window.customElements.define(ExampleHaxcmsTheme.tag,ExampleHaxcmsTheme)});