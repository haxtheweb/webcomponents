define(["exports","meta","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"],function(_exports,meta,_HAXWiring){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.AirHorn=void 0;meta=babelHelpers.interopRequireWildcard(meta);/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */ /**
 * `air-horn`
 * `demonstrative purposes via meme`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @demo demo/index.html
 */var AirHorn=/*#__PURE__*/function(_HTMLElement){babelHelpers.inherits(AirHorn,_HTMLElement);babelHelpers.createClass(AirHorn,[{key:"html",// render function
get:function get(){return"\n<style>:host {\n  display: inline-flex;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"}// haxProperty definition
}],[{key:"haxProperties",get:function get(){return{}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){var props={};if(babelHelpers.get(babelHelpers.getPrototypeOf(AirHorn),"properties",this)){props=Object.assign(props,babelHelpers.get(babelHelpers.getPrototypeOf(AirHorn),"properties",this))}return props}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"air-horn"}/**
   * life cycle
   */}]);function AirHorn(){var _this,delayRender=0<arguments.length&&arguments[0]!==void 0?arguments[0]:!1;babelHelpers.classCallCheck(this,AirHorn);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(AirHorn).call(this));// set tag for later use
_this.tag=AirHorn.tag;_this.template=document.createElement("template");_this.attachShadow({mode:"open"});if(!delayRender){_this.render()}return _this}/**
   * life cycle, element is afixed to the DOM
   */babelHelpers.createClass(AirHorn,[{key:"connectedCallback",value:function connectedCallback(){this.addEventListener("click",this._playSound.bind(this))}/**
   * Play the sound effect.
   */},{key:"_playSound",value:function _playSound(e){var audio=new Audio(decodeURIComponent(meta.url)+"/../lib/airhorn.mp3");audio.play()}},{key:"render",value:function render(){this.shadowRoot.innerHTML=null;this.template.innerHTML=this.html;if(window.ShadyCSS){window.ShadyCSS.prepareTemplate(this.template,this.tag)}this.shadowRoot.appendChild(this.template.content.cloneNode(!0))}}]);return AirHorn}(babelHelpers.wrapNativeSuper(HTMLElement));_exports.AirHorn=AirHorn;window.customElements.define(AirHorn.tag,AirHorn)});