define(["exports","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"],function(_exports,_HAXWiring){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.HaxLogo=void 0;/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */ /**
 * `hax-logo`
 * `logo element for hax, obviously as a hax capable element.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @demo demo/index.html
 */var HaxLogo=/*#__PURE__*/function(_HTMLElement){babelHelpers.inherits(HaxLogo,_HTMLElement);babelHelpers.createClass(HaxLogo,[{key:"html",// render function
get:function get(){return"\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"}// haxProperty definition
}],[{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Hax logo",description:"logo element for hax, obviously as a hax capable element.",icon:"icons:android",color:"green",groups:["Logo"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[{property:"size",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"}],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){var props={size:{name:"size",type:"String",value:"normal",reflectToAttribute:!0,observer:"_sizeChanged"}};if(babelHelpers.get(babelHelpers.getPrototypeOf(HaxLogo),"properties",this)){props=Object.assign(props,babelHelpers.get(babelHelpers.getPrototypeOf(HaxLogo),"properties",this))}return props}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"hax-logo"}/**
   * life cycle
   */}]);function HaxLogo(){var _this,delayRender=0<arguments.length&&arguments[0]!==void 0?arguments[0]:!1;babelHelpers.classCallCheck(this,HaxLogo);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(HaxLogo).call(this));// set tag for later use
_this.tag=HaxLogo.tag;// map our imported properties json to real props on the element
// @notice static getter of properties is built via tooling
// to edit modify src/HaxLogo-properties.json
var obj=HaxLogo.properties;for(var p in obj){if(obj.hasOwnProperty(p)){if(_this.hasAttribute(p)){_this[p]=_this.getAttribute(p)}else{_this.setAttribute(p,obj[p].value);_this[p]=obj[p].value}}}// optional queue for future use
_this._queue=[];_this.template=document.createElement("template");_this.attachShadow({mode:"open"});if(!delayRender){_this.render()}return _this}/**
   * life cycle, element is afixed to the DOM
   */babelHelpers.createClass(HaxLogo,[{key:"connectedCallback",value:function connectedCallback(){if(window.ShadyCSS){window.ShadyCSS.styleElement(this)}this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(HaxLogo.haxProperties,HaxLogo.tag,this)}},{key:"_copyAttribute",value:function _copyAttribute(name,to){var recipients=this.shadowRoot.querySelectorAll(to),value=this.getAttribute(name),fname=null==value?"removeAttribute":"setAttribute",_iteratorNormalCompletion=!0,_didIteratorError=!1,_iteratorError=void 0;try{for(var _iterator=recipients[Symbol.iterator](),_step,node;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=!0){node=_step.value;node[fname](name,value)}}catch(err){_didIteratorError=!0;_iteratorError=err}finally{try{if(!_iteratorNormalCompletion&&null!=_iterator.return){_iterator.return()}}finally{if(_didIteratorError){throw _iteratorError}}}}},{key:"_setProperty",value:function _setProperty(_ref){var name=_ref.name,value=_ref.value;this[name]=value}},{key:"render",value:function render(){this.shadowRoot.innerHTML=null;this.template.innerHTML=this.html;if(window.ShadyCSS){window.ShadyCSS.prepareTemplate(this.template,this.tag)}this.shadowRoot.appendChild(this.template.content.cloneNode(!0))}//static get observedAttributes() {
//  return [];
//}
// disconnectedCallback() {}
// attributeChangedCallback(attr, oldValue, newValue) {}
// Observer size for changes
},{key:"_sizeChanged",value:function _sizeChanged(newValue,oldValue){if(babelHelpers.typeof(newValue)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){console.log(newValue)}}}]);return HaxLogo}(babelHelpers.wrapNativeSuper(HTMLElement));_exports.HaxLogo=HaxLogo;window.customElements.define(HaxLogo.tag,HaxLogo)});