define(["exports","./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js"],function(_exports,_polymerDom){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.MtzFileDownloadBehaviors=void 0;var MtzFileDownloadBehaviors=function MtzFileDownloadBehaviors(SuperClass){return(/*#__PURE__*/function(_SuperClass){babelHelpers.inherits(_class,_SuperClass);function _class(){babelHelpers.classCallCheck(this,_class);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(_class).apply(this,arguments))}babelHelpers.createClass(_class,[{key:"downloadFromData",/**
     * Converts the data to a blob then uses navigator to save blob if it’s available, otherwise
     * creates an <a> with [download] attribute then simulates a click.
     * @param {String} data - data to encode.
     * @param {String} type - type of file to generate (i.e, JSON or CSV).
     * @param {String} [name = 'download'] - file name to save data under.
     * @param {Boolean} [newTab = true] - If false, downloads uri in existing tab. Otherwise,
     * downloads in new tab.
     */value:function downloadFromData(data,type){var name=2<arguments.length&&arguments[2]!==void 0?arguments[2]:"download",newTab=3<arguments.length&&arguments[3]!==void 0?arguments[3]:!0,mimeType=this.fileTypes[type.toUpperCase()],blob=new Blob([decodeURIComponent(encodeURI(data))],{type:mimeType}),filename=name+"."+type.toLowerCase();if(window.navigator&&window.navigator.msSaveOrOpenBlob){window.navigator.msSaveOrOpenBlob(blob,filename)}else{// Link elements have a download attribute which provides cross-platform
// download behavior supporting all but IE 11. This creates new link and then
// clicks it to initiate download.
var link=document.createElement("a");link.href=(window.URL||window.webkitURL).createObjectURL(blob);link.download=filename;link.target=newTab?"_blank":"_self";(0,_polymerDom.dom)(this.root).appendChild(link);link.click();(0,_polymerDom.dom)(this.root).removeChild(link)}}/**
     * Opens a new tab at the URI so that download can be initiated from the page.
     * @param {String} uri - The uri to open.
     * @param {Boolean} [newTab = true] - If false, downloads uri in existing tab. Otherwise,
     * downloads in new tab.
     * @return {Boolean} Returns true.
     */},{key:"downloadFromURI",value:function downloadFromURI(uri){var newTab=1<arguments.length&&arguments[1]!==void 0?arguments[1]:!0;window.open(uri,newTab?"_blank":"_self");return!0;// NOTE: Returning true to prevent error in some browsers during download.
}}],[{key:"properties",get:function get(){if(babelHelpers.get(babelHelpers.getPrototypeOf(_class),"properties",this)){return Object.assign({fileTypes:{type:Object,value:function value(){return{CSV:"text/csv",JSON:"text/json",PDF:"application/pdf",TXT:"text/plain"}}}},babelHelpers.get(babelHelpers.getPrototypeOf(_class),"properties",this))}else{return{fileTypes:{type:Object,value:function value(){return{CSV:"text/csv",JSON:"text/json",PDF:"application/pdf",TXT:"text/plain"}}}}}}}]);return _class}(SuperClass))};/**
 * A behavior for downloading streamed files or creating files based on available data.
 *
 * @polymerBehavior
 * @demo demo/index.html
 */_exports.MtzFileDownloadBehaviors=MtzFileDownloadBehaviors;window.mtz=window.mtz||{};mtz.FileDownloadBehaviors={properties:{/* MIME type lookup for file extensions */fileTypes:{type:Object,value:function value(){return{CSV:"text/csv",JSON:"text/json",PDF:"application/pdf",TXT:"text/plain"}}}},/**
   * Converts the data to a blob then uses navigator to save blob if it’s available, otherwise
   * creates an <a> with [download] attribute then simulates a click.
   * @param {String} data - data to encode.
   * @param {String} type - type of file to generate (i.e, JSON or CSV).
   * @param {String} [name = 'download'] - file name to save data under.
   * @param {Boolean} [newTab = true] - If false, downloads uri in existing tab. Otherwise,
   * downloads in new tab.
   */downloadFromData:function downloadFromData(data,type){var name=2<arguments.length&&arguments[2]!==void 0?arguments[2]:"download",newTab=3<arguments.length&&arguments[3]!==void 0?arguments[3]:!0,mimeType=this.fileTypes[type.toUpperCase()],blob=new Blob([decodeURIComponent(encodeURI(data))],{type:mimeType}),filename=name+"."+type.toLowerCase();if(window.navigator&&window.navigator.msSaveOrOpenBlob){window.navigator.msSaveOrOpenBlob(blob,filename)}else{// Link elements have a download attribute which provides cross-platform
// download behavior supporting all but IE 11. This creates new link and then
// clicks it to initiate download.
var link=document.createElement("a");link.href=(window.URL||window.webkitURL).createObjectURL(blob);link.download=filename;link.target=newTab?"_blank":"_self";(0,_polymerDom.dom)(this.root).appendChild(link);link.click();(0,_polymerDom.dom)(this.root).removeChild(link)}},/**
   * Opens a new tab at the URI so that download can be initiated from the page.
   * @param {String} uri - The uri to open.
   * @param {Boolean} [newTab = true] - If false, downloads uri in existing tab. Otherwise,
   * downloads in new tab.
   * @return {Boolean} Returns true.
   */downloadFromURI:function downloadFromURI(uri){var newTab=1<arguments.length&&arguments[1]!==void 0?arguments[1]:!0;window.open(uri,newTab?"_blank":"_self");return!0;// NOTE: Returning true to prevent error in some browsers during download.
}}});