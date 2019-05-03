define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js","./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js","./node_modules/@polymer/iron-form-element-behavior/iron-form-element-behavior.js","./node_modules/@polymer/iron-validatable-behavior/iron-validatable-behavior.js"],function(_exports,_polymerLegacy,_polymerDom,_ironFormElementBehavior,_ironValidatableBehavior){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.MtzMarkedEditor=void 0;function _templateObject_0c0254106a8311e98b8f632f91931d2f(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n\n    <slot name=\"controls\"></slot> <slot name=\"textarea\"></slot>\n    <slot name=\"footer\"></slot>\n  "]);_templateObject_0c0254106a8311e98b8f632f91931d2f=function _templateObject_0c0254106a8311e98b8f632f91931d2f(){return data};return data}/**
`mtz-marked-editor`
Creates a textarea with common editor logic and can be controlled by UI elements

* @demo demo/index.html
*/var MtzMarkedEditor=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_0c0254106a8311e98b8f632f91931d2f()),is:"mtz-marked-editor",properties:{autofocus:Boolean,readonly:Boolean,textareaSelector:{type:String,value:"textarea"},__textarea:Object},ready:function ready(){this.__bindControlToEditor=this.__bindControlToEditor.bind(this)},attached:function attached(){this.addEventListener("register-control",this.__bindControlToEditor);this.__textarea=(0,_polymerDom.dom)(this).queryDistributedElements("[slot=\"textarea\"]")[0]},detached:function detached(){this.removeEventListener("register-control",this.__bindControlToEditor)},/**
   * Returns the instance of textarea
   * @return {HTMLTextAreaElement}
   */getTextarea:function getTextarea(){return this.__textarea},/**
   * Returns the number of lines in the textarea
   * @return {Number}
   */getLines:function getLines(){return this.getContent().split(/(?=\n|\r\n)$/gm)},/**
   * Gets the content of the textarea
   * @return {String}
   */getContent:function getContent(){if(babelHelpers.typeof(this.getTextarea())!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){return this.getTextarea().value}return""},/**
   * Sets the content of the textarea
   * @param {String} content
   */setContent:function setContent(content){this.getTextarea().value=content},/**
   * Gets the selection information from the textarea and puts it into
   * a useful object.
   * @param {HTMLTextAreaElement} [textarea=this.getTextarea()]
   * @return {Object} Containing selection information, start, end, text, and length.
   */getSelection:function getSelection(){var textarea=0<arguments.length&&arguments[0]!==void 0?arguments[0]:this.getTextarea(),start=textarea.selectionStart,end=textarea.selectionEnd;return{start:start,end:end,length:end-start,text:textarea.value.substring(start,end)}},/**
   * Updates the selection of the textarea
   * @param {Number} start - Starting index of selection
   * @param {Number} end - Ending index of selection
   * @param {HTMLTextAreaElement} [textarea=this.getTextarea()]
   */setSelection:function setSelection(start,end){var textarea=2<arguments.length&&arguments[2]!==void 0?arguments[2]:this.getTextarea();textarea.selectionStart=start;textarea.selectionEnd=end},/**
   * Replaces the current selection with the passed in text
   * @param {String} text
   * @param {HTMLTextAreaElement} [textarea=this.getTextarea()]
   * @param {Object} [selection=this.getSelection()]
   */replaceSelection:function replaceSelection(text){var textarea=1<arguments.length&&arguments[1]!==void 0?arguments[1]:this.getTextarea(),selection=2<arguments.length&&arguments[2]!==void 0?arguments[2]:this.getSelection(),val=textarea.value;textarea.value="".concat(val.substr(0,selection.start)).concat(text).concat(val.substr(selection.end,val.length))},/**
   * Adds a reference of editor to the control
   * @param {CustomEvent} event
   * @private
   */__bindControlToEditor:function __bindControlToEditor(event){event.stopPropagation();// TODO: Update this in 2.0 to use updated API.
// dom(event).rootTarget => event.composedPath()[0]
(0,_polymerDom.dom)(event).rootTarget.__editor=this}});_exports.MtzMarkedEditor=MtzMarkedEditor});