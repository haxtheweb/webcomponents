define(["exports"],function(_exports){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.ToElement=void 0;/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */ /**
 * `to-element`
 * `Replicate any DOM node passed in and turn it into a web component`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @demo demo/index.html
 */var ToElement=/*#__PURE__*/function(_HTMLElement){babelHelpers.inherits(ToElement,_HTMLElement);babelHelpers.createClass(ToElement,[{key:"html",// render function
get:function get(){return"\n<style></style>\n<slot></slot>"}// properties available to the custom element for data binding
}],[{key:"properties",get:function get(){var props={/**
   * object in question to clone and turn into a custom element
   */element:{name:"element",type:Object,value:{}},/**
   * valid custom element name of the new element to create
   */name:{name:"name",type:String,value:"new-element"},/**
   * optional original location that this came from
   */sourceUrl:{name:"sourceUrl",type:String,value:""},/**
   * MIME type lookup for file extensions
   */fileTypes:{type:Object,value:function value(){return{CSV:"text/csv",JSON:"text/json",PDF:"application/pdf",TXT:"text/plain"}}}};if(babelHelpers.get(babelHelpers.getPrototypeOf(ToElement),"properties",this)){props=Object.assign(props,babelHelpers.get(babelHelpers.getPrototypeOf(ToElement),"properties",this))}return props}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"to-element"}/**
   * life cycle
   */}]);function ToElement(){var _this,delayRender=0<arguments.length&&arguments[0]!==void 0?arguments[0]:!1;babelHelpers.classCallCheck(this,ToElement);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(ToElement).call(this));// set tag for later use
_this.tag=ToElement.tag;// map our imported properties json to real props on the element
// @notice static getter of properties is built via tooling
// to edit modify src/ToElement-properties.json
var obj=ToElement.properties;for(var p in obj){if(obj.hasOwnProperty(p)){if(_this.hasAttribute(p)){_this[p]=_this.getAttribute(p)}else{_this.setAttribute(p,obj[p].value);_this[p]=obj[p].value}}}// optional queue for future use
_this._queue=[];_this.template=document.createElement("template");_this.attachShadow({mode:"open"});if(!delayRender){_this.render()}return _this}/**
   * life cycle, element is afixed to the DOM
   */babelHelpers.createClass(ToElement,[{key:"connectedCallback",value:function connectedCallback(){if(window.ShadyCSS){window.ShadyCSS.styleElement(this)}if(this._queue.length){this._processQueue()}}},{key:"_copyAttribute",value:function _copyAttribute(name,to){var recipients=this.shadowRoot.querySelectorAll(to),value=this.getAttribute(name),fname=null==value?"removeAttribute":"setAttribute",_iteratorNormalCompletion=!0,_didIteratorError=!1,_iteratorError=void 0;try{for(var _iterator=recipients[Symbol.iterator](),_step,node;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=!0){node=_step.value;node[fname](name,value)}}catch(err){_didIteratorError=!0;_iteratorError=err}finally{try{if(!_iteratorNormalCompletion&&null!=_iterator.return){_iterator.return()}}finally{if(_didIteratorError){throw _iteratorError}}}}},{key:"_queueAction",value:function _queueAction(action){this._queue.push(action)}},{key:"_processQueue",value:function _processQueue(){var _this2=this;this._queue.forEach(function(action){_this2["_".concat(action.type)](action.data)});this._queue=[]}},{key:"_setProperty",value:function _setProperty(_ref){var name=_ref.name,value=_ref.value;this[name]=value}},{key:"render",value:function render(){this.shadowRoot.innerHTML=null;this.template.innerHTML=this.html;if(window.ShadyCSS){window.ShadyCSS.prepareTemplate(this.template,this.tag)}this.shadowRoot.appendChild(this.template.content.cloneNode(!0))}/**
   * Take the element in scope and calculate it's styling
   */},{key:"createNewElement",value:function createNewElement(){this._tmp=this.element;var css=this.extractCSS(this._tmp).stylesheet,html=this._tmp.outerHTML;return{html:html,css:css}}/**
   * Generate a UUID
   */},{key:"generateUUID",value:function generateUUID(){return"item-sss-ss-ss".replace(/s/g,this._uuidPart)}},{key:"_uuidPart",value:function _uuidPart(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}// based on https://stackoverflow.com/questions/22907735/get-the-computed-style-and-omit-defaults
/**
   * get computed style for an element, excluding any default styles
   */},{key:"getDefaultStyling",value:function getDefaultStyling(element){var part=1<arguments.length&&arguments[1]!==void 0?arguments[1]:null,tagName=element.tagName,iframe=document.createElement("iframe");this.shadowRoot.appendChild(iframe);//  Create element within the iframe's document
var iframeDocument=iframe.contentDocument,targetElement=iframeDocument.createElement(tagName);iframeDocument.body.appendChild(targetElement);//  Grab styling (CSSStyleDeclaration is live, and all values become "" after element removal)
for(var styling=iframe.contentWindow.getComputedStyle(targetElement),clonedStyling={},i=0,len=styling.length,property;i<len;i++){property=styling[i];clonedStyling[i]=property;clonedStyling[property]=styling[property]}//  Remove iframe
this.shadowRoot.removeChild(iframe);//  Return cloned styling
return clonedStyling}},{key:"getStylesWithoutDefaults",value:function getStylesWithoutDefaults(element){for(var part=1<arguments.length&&arguments[1]!==void 0?arguments[1]:null,allStyling=window.getComputedStyle(element,part),defaultStyling=this.getDefaultStyling(element.tagName),userStyling={},i=0,len=allStyling.length;i<len;i++){var property=allStyling[i],value=allStyling[property],defaultValue=defaultStyling[property];if(value!=defaultValue&&"transform-origin"!==property&&"perspective-origin"!==property){userStyling[property]=value}}return userStyling}// based on https://stackoverflow.com/questions/53613045/how-get-all-computed-css-properties-of-element-and-its-children-in-javascript
// Flatten an array
// https://stackoverflow.com/a/15030117/2054072
},{key:"flatten",value:function flatten(arr){var _this3=this;return arr.reduce(function(flat,toFlatten){return flat.concat(Array.isArray(toFlatten)?_this3.flatten(toFlatten):toFlatten)},[])}},{key:"recursiveExtract",value:function recursiveExtract(element){var id=this.generateUUID(),styles=this.getStylesWithoutDefaults(element);/*
    // keep these later if we're able to figure out they work
    const before = this.getStylesWithoutDefaults(element, ":before");
    const after = this.getStylesWithoutDefaults(element, ":after");
    const hover = this.getStylesWithoutDefaults(element, ":hover");
    const focus = this.getStylesWithoutDefaults(element, ":focus");
    */ // Now that we get the style, we can swap the id
element.setAttribute("id",id);var css="";for(var i in styles){css+="      ".concat(i,": ").concat(styles[i],";\n")}// The children are not a real array but a NodeList, we need to convert them
// so we can map over them easily
var children=Array.prototype.slice.call(element.children);return[{id:id,style:css}].concat(children.map(this.recursiveExtract.bind(this)))}},{key:"extractCSS",value:function extractCSS(element){if(!element){return{elements:[],stylesheet:""}}var raw=this.recursiveExtract(element),flat=this.flatten(raw);return{elements:flat,stylesheet:flat.reduce(function(acc,cur){var style="    #"+cur.id+" {\n"+cur.style+"    }\n";return acc+style},"")}}/**
   * convert dashed case to camel case
   */},{key:"dashToCamel",value:function dashToCamel(str){return str.replace(/-([a-z])/g,function(g){return g[1].toUpperCase()})}/**
   * Output entire thing as a file.
   */},{key:"contentToFile",value:function contentToFile(html){return"\n/**\n * Copyright 2019 {Your compay}\n * @license Apache-2.0, see License.md for full text.\n */\nimport { html, PolymerElement } from \"@polymer/polymer/polymer-element.js\";\n/**\n * `".concat(this.name,"`\n * `An auto generated element via to-element`\n *\n * @microcopy - language worth noting:\n *  - This element was made by someone else and then forked from their site\n *  - The point is not perfection but to rapidly generate boilerplate\n *\n * @originalSite - This code is based on work originally found on\n *   - ").concat(this.sourceUrl,"\n * @customElement\n * @polymer\n */\nclass ").concat(this.dashToCamel(this.name)," extends PolymerElement {\n  \n  // render function\n  static get template() {\n    return html`\n    ").concat(html,"\n    `;\n  }\n\n  // properties available to the custom element for data binding\n  static get properties() {\n    return {\n      \"title\": {\n        \"name\": \"title\",\n        \"type\": \"String\",\n        \"value\": \"\",\n      }\n    };\n  }\n\n  /**\n   * Store the tag name to make it easier to obtain directly.\n   */\n  static get tag() {\n    return \"").concat(this.name,"\";\n  }\n  /**\n   * life cycle, element is afixed to the DOM\n   */\n  //connectedCallback() { super.connectedCallback(); }\n  /**\n   * life cycle, element is removed from the DOM\n   */\n  //disconnectedCallback() {super.disconnectedCallback();}\n}\nwindow.customElements.define(").concat(this.dashToCamel(this.name),".tag, ").concat(this.dashToCamel(this.name),");\nexport { ").concat(this.dashToCamel(this.name)," };\n    ")}/**
   * Download a new component based on the selected element
   */},{key:"downloadNewComponent",value:function downloadNewComponent(element,name){if(element){this.element=element}if(name){this.name=name}var tmp=this.createNewElement(),html="<style>\n".concat(tmp.css,"</style>\n    ").concat(tmp.html),data=this.contentToFile(html);this.downloadFromData(data,"js",this.name)}/**
   * Converts the data to a blob then uses navigator to save blob if it’s available, otherwise
   * creates an <a> with [download] attribute then simulates a click.
   * @param {String} data - data to encode.
   * @param {String} type - type of file to generate (i.e, JSON or CSV).
   * @param {String} [name = 'download'] - file name to save data under.
   * @param {Boolean} [newTab = true] - If false, downloads uri in existing tab. Otherwise,
   * downloads in new tab.
   */},{key:"downloadFromData",value:function downloadFromData(data,type){var name=2<arguments.length&&arguments[2]!==void 0?arguments[2]:"download",newTab=3<arguments.length&&arguments[3]!==void 0?arguments[3]:!0,mimeType=this.fileTypes[type.toUpperCase()],blob=new Blob([decodeURIComponent(encodeURI(data))],{type:mimeType}),filename=name+"."+type.toLowerCase();if(window.navigator&&window.navigator.msSaveOrOpenBlob){window.navigator.msSaveOrOpenBlob(blob,filename)}else{// Link elements have a download attribute which provides cross-platform
// download behavior supporting all but IE 11. This creates new link and then
// clicks it to initiate download.
var link=document.createElement("a");link.href=(window.URL||window.webkitURL).createObjectURL(blob);link.download=filename;link.target=newTab?"_blank":"_self";this.shadowRoot.appendChild(link);link.click();this.shadowRoot.removeChild(link)}}/**
   * Opens a new tab at the URI so that download can be initiated from the page.
   * @param {String} uri - The uri to open.
   * @param {Boolean} [newTab = true] - If false, downloads uri in existing tab. Otherwise,
   * downloads in new tab.
   * @return {Boolean} Returns true.
   */},{key:"downloadFromURI",value:function downloadFromURI(uri){var newTab=1<arguments.length&&arguments[1]!==void 0?arguments[1]:!0;window.open(uri,newTab?"_blank":"_self");return!0;// NOTE: Returning true to prevent error in some browsers during download.
}//static get observedAttributes() {
//  return [];
//}
// disconnectedCallback() {}
// attributeChangedCallback(attr, oldValue, newValue) {}
}]);return ToElement}(babelHelpers.wrapNativeSuper(HTMLElement));_exports.ToElement=ToElement;window.customElements.define(ToElement.tag,ToElement)});