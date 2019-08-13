define(["exports","./node_modules/lit-element/lit-element.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"],function(_exports,_litElement,_HAXWiring){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.H5PElement=void 0;function _templateObject2_cdf4c740bd8211e985a4f3362e660f91(){var data=babelHelpers.taggedTemplateLiteral(["\n    :host {\n      display: block;\n    }\n  "]);_templateObject2_cdf4c740bd8211e985a4f3362e660f91=function _templateObject2_cdf4c740bd8211e985a4f3362e660f91(){return data};return data}function _templateObject_cdf4c740bd8211e985a4f3362e660f91(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>\n<div>","</div>"]);_templateObject_cdf4c740bd8211e985a4f3362e660f91=function _templateObject_cdf4c740bd8211e985a4f3362e660f91(){return data};return data}/**
 * `h5p-element`
 * `h5p wrapper for loading and presenting .h5p files`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */var H5PElement=/*#__PURE__*/function(_LitElement){babelHelpers.inherits(H5PElement,_LitElement);babelHelpers.createClass(H5PElement,[{key:"render",// render function
value:function render(){return(0,_litElement.html)(_templateObject_cdf4c740bd8211e985a4f3362e660f91(),this.source)}// haxProperty definition
},{key:"tag",/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */value:function tag(){return"h5p-element"}/**
   * Register CSS styles
   */}],[{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"H 5-p-element",description:"h5p wrapper for loading and presenting .h5p files",icon:"icons:android",color:"green",groups:["5"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[{property:"source",description:"",inputMethod:"textfield",required:!0,icon:"icons:link",validationType:"url"}],configure:[{property:"source",description:"",inputMethod:"textfield",required:!0,icon:"icons:link",validationType:"url"}],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){var props={source:{name:"source",type:"String",value:"",reflectToAttribute:!1,observer:!1}};if(babelHelpers.get(babelHelpers.getPrototypeOf(H5PElement),"properties",this)){props=Object.assign(props,babelHelpers.get(babelHelpers.getPrototypeOf(H5PElement),"properties",this))}return props}},{key:"styles",get:function get(){return(0,_litElement.css)(_templateObject2_cdf4c740bd8211e985a4f3362e660f91())}// life cycle
}]);function H5PElement(){babelHelpers.classCallCheck(this,H5PElement);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(H5PElement).call(this))}/**
   * life cycle, element is afixed to the DOM
   */babelHelpers.createClass(H5PElement,[{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(H5PElement.prototype),"connectedCallback",this).call(this);this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(H5PElement.haxProperties,H5PElement.tag,this)}/**
   * life cycle, element removed from DOM
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(H5PElement.prototype),"disconnectedCallback",this).call(this)}// attributeChangedCallback(attr, oldValue, newValue) {}
}]);return H5PElement}(_litElement.LitElement);_exports.H5PElement=H5PElement;customElements.define("h5p-element",H5PElement)});