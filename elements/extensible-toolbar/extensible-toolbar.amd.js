define(["exports","./node_modules/lit-element/lit-element.js","./node_modules/@lrnwebcomponents/responsive-utility/responsive-utility.js"],function(_exports,_litElement,_responsiveUtility){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.ExtensibleToolbar=void 0;function _templateObject_9160f37037e511eab793059ea7b5b899(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: flex;\n  opacity: 1;\n  z-index: 1;\n  margin: 0;\n  align-items: stretch;\n  flex-wrap: wrap;\n  justify-content: flex-start;\n  transition: all 0.5s;\n  --extensible-toolbar-visible-until-sm: unset;\n  --extensible-toolbar-visible-until-md: unset;\n  --extensible-toolbar-visible-until-lg: unset;\n  --extensible-toolbar-visible-until-xl: unset;\n  --extensible-toolbar-hidden-until-sm: none;\n  --extensible-toolbar-hidden-until-md: none;\n  --extensible-toolbar-hidden-until-lg: none;\n  --extensible-toolbar-hidden-until-xl: none;\n}\n:host([hidden]) {\n  display: none;\n}\n:host([aria-hidden]) {\n  visibility: hidden;\n  opacity: 0;\n  height: 0;\n}\n:host([sticky]) {\n  position: sticky;\n  top: 0;\n}\n:host([collapsed]:not([responsive-size=\"xs\"])){\n  --extensible-toolbar-visible-until-sm: none;\n  --extensible-toolbar-hidden-until-sm: unset;\n}\n:host([collapsed]:not([responsive-size*=\"s\"])){\n  --extensible-toolbar-visible-until-md: none;\n  --extensible-toolbar-hidden-until-md: none;\n}\n:host([collapsed][responsive-size*=\"l\"]){\n  --extensible-toolbar-visible-until-lg: none;\n  --extensible-toolbar-hidden-until-lg: none;\n}\n:host([collapsed][responsive-size=\"xl\"]){\n  --extensible-toolbar-visible-until-xl: none;\n  --extensible-toolbar-hidden-until-xl: none;\n}</style>\n<slot></slot>"]);_templateObject_9160f37037e511eab793059ea7b5b899=function _templateObject_9160f37037e511eab793059ea7b5b899(){return data};return data}/**
 * `extensible-toolbar`
 * `a toolbar that can be customised with with mixins and json`
 *
### Styling

`<extensible-toolbar>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--extensible-toolbar-visible-until-sm` | display for items that should only be visible when `responsiveSize` < `sm` | unset
`--extensible-toolbar-visible-until-md` | display for items that should only be visible when `responsiveSize` < `md` | unset
`--extensible-toolbar-visible-until-lg` | display for items that should only be visible when `responsiveSize` < `lg` | unset
`--extensible-toolbar-visible-until-xl` | display for items that should only be visible when `responsiveSize` < `xl` | unset
`--extensible-toolbar-hidden-until-sm` | display for items that should only be hidden when `responsiveSize` < `sm` | none
`--extensible-toolbar-hidden-until-md` | display for items that should only be hidden when `responsiveSize` < `md` | none
`--extensible-toolbar-hidden-until-lg` | display for items that should only be hidden when `responsiveSize` < `lg` | none
`--extensible-toolbar-hidden-until-xl` | display for items that should only be hidden when `responsiveSize` < `xl` | none
 * 
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */var ExtensibleToolbar=/*#__PURE__*/function(_LitElement){babelHelpers.inherits(ExtensibleToolbar,_LitElement);babelHelpers.createClass(ExtensibleToolbar,[{key:"render",// render function
value:function render(){return(0,_litElement.html)(_templateObject_9160f37037e511eab793059ea7b5b899())}// properties available to the custom element for data binding
},{key:"tag",/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */value:function tag(){return"extensible-toolbar"}// life cycle
}],[{key:"properties",get:function get(){return{/**
   * Is the toolbar collapsed?
   */collapsed:{attribute:"collapsed",reflect:!0,type:"Boolean"},/**
   * Size of the toolbar, as `xs`, `sm`, `md`, `lg`, or `xl`.
   */responsiveSize:{attribute:"responsive-size",type:"String"},/**
   * Should the toolbar stick to top so that it's always visible?
   */sticky:{attribute:"sticky",type:"Boolean",reflectToAttribute:!0}}}}]);function ExtensibleToolbar(){var _this;babelHelpers.classCallCheck(this,ExtensibleToolbar);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(ExtensibleToolbar).call(this));_this.tag=ExtensibleToolbar.tag;_this.collapsed=!1;_this.responsiveSize="xs";_this.gte="xs sm md lg xl";_this.lte="xs";_this.sticky=!1;return _this}/**
   * Connects to responsive utility.
   * Override if element will inherit parent's responsive size.
   */babelHelpers.createClass(ExtensibleToolbar,[{key:"initResponsive",value:function initResponsive(){var root=this;window.ResponsiveUtility.requestAvailability();window.dispatchEvent(new CustomEvent("responsive-element",{detail:{element:root,attribute:"responsive-size",relativeToParent:!0}}))}/**
   * life cycle, element is afixed to the DOM
   */},{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(ExtensibleToolbar.prototype),"connectedCallback",this).call(this);initResponsive()}},{key:"updated",value:function updated(changedProperties){var _this2=this;changedProperties.forEach(function(oldValue,propName){return(/**
       * Fires when collapsed property changes
       * @event collapsed-changed
       */ /**
       * Fires when responsiveSize property changes
       * @event responsive-size-changed
       */ /**
       * Fires when sticky property changes
       * @event sticky-changed
       */_this2.dispatchEvent(new CustomEvent("".concat(propName.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g,"$1-$2").toLowerCase(),"-changed"),{bubbles:!0,cancelable:!0,composed:!0,detail:_this2})))})}}]);return ExtensibleToolbar}(_litElement.LitElement);_exports.ExtensibleToolbar=ExtensibleToolbar;customElements.define("extensible-toolbar",ExtensibleToolbar)});