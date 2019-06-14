define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/polymer/lib/utils/render-status.js","./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js","./node_modules/@polymer/iron-form-element-behavior/iron-form-element-behavior.js","./node_modules/@polymer/iron-validatable-behavior/iron-validatable-behavior.js","./node_modules/@polymer/polymer/lib/legacy/class.js"],function(_exports,_polymerElement,_renderStatus,_polymerDom,_ironFormElementBehavior,_ironValidatableBehavior,_class){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.MtzMarkedEditor=void 0;function _templateObject_1108a04081c111e992120788531f11b8(){var data=babelHelpers.taggedTemplateLiteral(["\n      <style>\n        :host {\n          display: block;\n        }\n      </style>\n      <slot name=\"controls\"></slot> <slot name=\"textarea\"></slot>\n      <slot name=\"footer\"></slot>\n    "]);_templateObject_1108a04081c111e992120788531f11b8=function _templateObject_1108a04081c111e992120788531f11b8(){return data};return data}/**
 * `mtz-marked-editor`
 * `Creates a textarea with common editor logic and can be controlled by UI elements`
 * @demo demo/index.html
 */var MtzMarkedEditor=/*#__PURE__*/function(_mixinBehaviors){babelHelpers.inherits(MtzMarkedEditor,_mixinBehaviors);babelHelpers.createClass(MtzMarkedEditor,null,[{key:"template",get:function get(){return(0,_polymerElement.html)(_templateObject_1108a04081c111e992120788531f11b8())}},{key:"tag",get:function get(){return"mtz-marked-editor"}},{key:"properties",get:function get(){var props={autofocus:Boolean,readonly:Boolean,textareaSelector:{type:String,value:"textarea"},__textarea:Object};if(babelHelpers.get(babelHelpers.getPrototypeOf(MtzMarkedEditor),"properties",this)){props=Object.assign(props,babelHelpers.get(babelHelpers.getPrototypeOf(MtzMarkedEditor),"properties",this))}return props}}]);function MtzMarkedEditor(){var _this;babelHelpers.classCallCheck(this,MtzMarkedEditor);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(MtzMarkedEditor).call(this));_this.addEventListener("register-control",_this.__bindControlToEditor.bind(babelHelpers.assertThisInitialized(_this)));return _this}babelHelpers.createClass(MtzMarkedEditor,[{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(MtzMarkedEditor.prototype),"connectedCallback",this).call(this);this.__textarea=(0,_polymerDom.dom)(this).queryDistributedElements("[slot=\"textarea\"]")[0]}},{key:"disconnectedCallback",value:function disconnectedCallback(){this.removeEventListener("register-control",this.__bindControlToEditor);this.disconnectedCallback()}/**
   * Returns the instance of textarea
   * @return {HTMLTextAreaElement}
   */},{key:"getTextarea",value:function getTextarea(){return this.__textarea}/**
   * Returns the number of lines in the textarea
   * @return {Number}
   */},{key:"getLines",value:function getLines(){return this.getContent().split(/(?=\n|\r\n)$/gm)}/**
   * Gets the content of the textarea
   * @return {String}
   */},{key:"getContent",value:function getContent(){if(babelHelpers.typeof(this.getTextarea())!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){return this.getTextarea().value}return""}/**
   * Sets the content of the textarea
   * @param {String} content
   */},{key:"setContent",value:function setContent(content){this.getTextarea().value=content}/**
   * Gets the selection information from the textarea and puts it into
   * a useful object.
   * @param {HTMLTextAreaElement} [textarea=this.getTextarea()]
   * @return {Object} Containing selection information, start, end, text, and length.
   */},{key:"getSelection",value:function getSelection(){var textarea=0<arguments.length&&arguments[0]!==void 0?arguments[0]:this.getTextarea(),start=textarea.selectionStart,end=textarea.selectionEnd;return{start:start,end:end,length:end-start,text:textarea.value.substring(start,end)}}/**
   * Updates the selection of the textarea
   * @param {Number} start - Starting index of selection
   * @param {Number} end - Ending index of selection
   * @param {HTMLTextAreaElement} [textarea=this.getTextarea()]
   */},{key:"setSelection",value:function setSelection(start,end){var textarea=2<arguments.length&&arguments[2]!==void 0?arguments[2]:this.getTextarea();textarea.selectionStart=start;textarea.selectionEnd=end}/**
   * Replaces the current selection with the passed in text
   * @param {String} text
   * @param {HTMLTextAreaElement} [textarea=this.getTextarea()]
   * @param {Object} [selection=this.getSelection()]
   */},{key:"replaceSelection",value:function replaceSelection(text){var textarea=1<arguments.length&&arguments[1]!==void 0?arguments[1]:this.getTextarea(),selection=2<arguments.length&&arguments[2]!==void 0?arguments[2]:this.getSelection(),val=textarea.value;textarea.value="".concat(val.substr(0,selection.start)).concat(text).concat(val.substr(selection.end,val.length))}/**
   * Adds a reference of editor to the control
   * @param {CustomEvent} event
   * @private
   */},{key:"__bindControlToEditor",value:function __bindControlToEditor(e){e.stopPropagation();e.target.__editor=this}}]);return MtzMarkedEditor}((0,_class.mixinBehaviors)([_ironFormElementBehavior.IronFormElementBehavior,_ironValidatableBehavior.IronValidatableBehavior],_polymerElement.PolymerElement));_exports.MtzMarkedEditor=MtzMarkedEditor;window.customElements.define(MtzMarkedEditor.tag,MtzMarkedEditor)});