define(["exports","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"],function(_exports,_HAXWiring){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.HtmlBlock=void 0;/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */ /**
 * `html-block`
 * `A basic HTML block that provides HAXschema wiring`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @demo demo/index.html
 */var HtmlBlock=/*#__PURE__*/function(_HTMLElement){babelHelpers.inherits(HtmlBlock,_HTMLElement);babelHelpers.createClass(HtmlBlock,[{key:"html",// render function
get:function get(){return"\n<style></style>\n<slot></slot>"}// haxProperty definition
}],[{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Html block",description:"A basic HTML block that provides HAXschema wiring",icon:"icons:warning",color:"red",groups:["Block"],handles:[{type:"html",content:"slot"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[{slot:"",title:"HTML",description:"HTML code you want to present in content",inputMethod:"code-editor"}],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"html-block"}/**
   * life cycle
   */}]);function HtmlBlock(){var _this,delayRender=0<arguments.length&&arguments[0]!==void 0?arguments[0]:!1;babelHelpers.classCallCheck(this,HtmlBlock);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(HtmlBlock).call(this));// set tag for later use
_this.tag=HtmlBlock.tag;// map our imported properties json to real props on the element
// @notice static getter of properties is built via tooling
// to edit modify src/HtmlBlock-properties.json
return _this}/**
   * life cycle, element is afixed to the DOM
   */babelHelpers.createClass(HtmlBlock,[{key:"connectedCallback",value:function connectedCallback(){this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(HtmlBlock.haxProperties,HtmlBlock.tag,this);// default we block all script unless the user says to do so
// @todo ensure HAX actually respects this down the road, right now it sanitizes it
this.allowscript=!1;this.__ignoreChange=!1;this.style.display="block";// ensure we keep applying sanitization as needed while monitoring the tree
this.__observer=new MutationObserver(this.render.bind(this));this.__observer.observe(this,{attributes:!0,characterData:!0,childList:!0,subtree:!0})}},{key:"render",value:function render(){if(!this.__ignoreChange){if(null==this.allowscript||!this.allowscript||babelHelpers.typeof(this.allowscript)===("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){this.__sanitizeHTML()}}else{this.__ignoreChange=!1}}},{key:"attributeChangedCallback",// disconnectedCallback() {}
value:function attributeChangedCallback(attr,oldValue,newValue){if("allowscript"===attr){if(null==newValue||!newValue||babelHelpers.typeof(newValue)===("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){// we should sanitize innerHTML but create a holding pen for the rawHTML first
this.__sanitizeHTML()}else{// see if we had anything in the holding pen
if(this.__rawHTML){this.__ignoreChange=!0;this.innerHTML=this.__rawHTML}}}}},{key:"__sanitizeHTML",value:function __sanitizeHTML(){if(!this.__pen){this.__pen=document.createElement("div")}this.__pen.innerHTML=this.innerHTML;this.__rawHTML=this.__pen.cloneNode(!0).innerHTML;// clear it up
if("function"===typeof this.innerHTML){this.innerHTML=this.innerHTML.replace(/<script[\s\S]*?>/gi,"&lt;script&gt;");this.innerHTML=this.innerHTML.replace(/<\/script>/gi,"&lt;/script&gt;")}}},{key:"allowscript",get:function get(){return this.getAttribute("allowscript")},set:function set(value){if(value){this.setAttribute("allowscript","allowscript")}else{this.removeAttribute("allowscript")}}}],[{key:"observedAttributes",get:function get(){return["allowscript"]}}]);return HtmlBlock}(babelHelpers.wrapNativeSuper(HTMLElement));_exports.HtmlBlock=HtmlBlock;window.customElements.define(HtmlBlock.tag,HtmlBlock)});