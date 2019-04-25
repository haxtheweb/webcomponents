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
get:function get(){return"\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"}// properties available to the custom element for data binding
}],[{key:"properties",get:function get(){return{"min-size":{name:"min-size",type:"Number",value:"",reflectToAttribute:!1,observer:!1},"max-size":{name:"max-size",type:"Number",value:"",reflectToAttribute:!1,observer:!1},"min-screen":{name:"min-screen",type:"Number",value:"",reflectToAttribute:!1,observer:!1},"max-screen":{name:"max-screen",type:"Number",value:"",reflectToAttribute:!1,observer:!1}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"fluid-type"}/**
   * life cycle
   */}]);function FluidType(){var _this,delayRender=0<arguments.length&&arguments[0]!==void 0?arguments[0]:!1;babelHelpers.classCallCheck(this,FluidType);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(FluidType).call(this));// set tag for later use
_this.tag=FluidType.tag;// map our imported properties json to real props on the element
// @notice static getter of properties is built via tooling
// to edit modify src/FluidType-properties.json
var obj=FluidType.properties;for(var p in obj){if(obj.hasOwnProperty(p)){if(_this.hasAttribute(p)){_this[p]=_this.getAttribute(p)}else{_this.setAttribute(p,obj[p].value);_this[p]=obj[p].value}}}// optional queue for future use
_this._queue=[];_this.template=document.createElement("template");_this.attachShadow({mode:"open"});if(!delayRender){_this.render()}return _this}/**
   * life cycle, element is afixed to the DOM
   */babelHelpers.createClass(FluidType,[{key:"connectedCallback",value:function connectedCallback(){if(window.ShadyCSS){window.ShadyCSS.styleElement(this)}if(this._queue.length){this._processQueue()}}},{key:"_copyAttribute",value:function _copyAttribute(name,to){var recipients=this.shadowRoot.querySelectorAll(to),value=this.getAttribute(name),fname=null==value?"removeAttribute":"setAttribute",_iteratorNormalCompletion=!0,_didIteratorError=!1,_iteratorError=void 0;try{for(var _iterator=recipients[Symbol.iterator](),_step,node;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=!0){node=_step.value;node[fname](name,value)}}catch(err){_didIteratorError=!0;_iteratorError=err}finally{try{if(!_iteratorNormalCompletion&&null!=_iterator.return){_iterator.return()}}finally{if(_didIteratorError){throw _iteratorError}}}}},{key:"_queueAction",value:function _queueAction(action){this._queue.push(action)}},{key:"_processQueue",value:function _processQueue(){var _this2=this;this._queue.forEach(function(action){_this2["_".concat(action.type)](action.data)});this._queue=[]}},{key:"_setProperty",value:function _setProperty(_ref){var name=_ref.name,value=_ref.value;this[name]=value}},{key:"render",value:function render(){this.shadowRoot.innerHTML=null;this.template.innerHTML=this.html;if(window.ShadyCSS){window.ShadyCSS.prepareTemplate(this.template,this.tag)}this.shadowRoot.appendChild(this.template.content.cloneNode(!0))}//static get observedAttributes() {
//  return [];
//}
// disconnectedCallback() {}
// attributeChangedCallback(attr, oldValue, newValue) {}
}]);return FluidType}(babelHelpers.wrapNativeSuper(HTMLElement));_exports.FluidType=FluidType;window.customElements.define(FluidType.tag,FluidType)});