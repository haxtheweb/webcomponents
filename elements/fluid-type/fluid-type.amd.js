define(["exports"],function(_exports){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.FluidType=void 0;/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */ /**
 * `fluid-type`
 * `A simple fluid-type sizing wrapper element to apply to anything`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @demo demo/index.html
 */var FluidType=/*#__PURE__*/function(_HTMLElement){babelHelpers.inherits(FluidType,_HTMLElement);babelHelpers.createClass(FluidType,[{key:"html",// render function
get:function get(){return"\n<style>:host {\n  --fluid-type-min-size: 1;\n  --fluid-type-max-size: 2;\n  --fluid-type-min-screen: 20;\n  --fluid-type-max-screen: 88;\n\n  font-size: calc(\n    (var(--fluid-type-min-size) * 1rem) + (var(--fluid-type-max-size) - var(--fluid-type-min-size)) * (100vw - (var(--fluid-type-min-screen) * 1rem)) /\n      (var(--fluid-type-max-screen) - var(--fluid-type-min-screen))\n  );\n}</style>\n<slot></slot>"}// properties available to the custom element for data binding
}],[{key:"properties",get:function get(){return{}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"fluid-type"}/**
   * life cycle
   */}]);function FluidType(){var _this,delayRender=0<arguments.length&&arguments[0]!==void 0?arguments[0]:!1;babelHelpers.classCallCheck(this,FluidType);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(FluidType).call(this));// set tag for later use
_this.tag=FluidType.tag;_this.template=document.createElement("template");_this.attachShadow({mode:"open"});if(!delayRender){_this.render()}return _this}/**
   * life cycle, element is afixed to the DOM
   */babelHelpers.createClass(FluidType,[{key:"connectedCallback",value:function connectedCallback(){if(window.ShadyCSS){window.ShadyCSS.styleElement(this)}}},{key:"render",value:function render(){this.shadowRoot.innerHTML=null;this.template.innerHTML=this.html;if(window.ShadyCSS){window.ShadyCSS.prepareTemplate(this.template,this.tag)}this.shadowRoot.appendChild(this.template.content.cloneNode(!0))}}]);return FluidType}(babelHelpers.wrapNativeSuper(HTMLElement));_exports.FluidType=FluidType;window.customElements.define(FluidType.tag,FluidType)});