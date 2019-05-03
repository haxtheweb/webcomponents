define(["exports","meta","./node_modules/@polymer/polymer/polymer-legacy.js","./node_modules/@polymer/polymer/lib/utils/flattened-nodes-observer.js","./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js","./node_modules/@polymer/polymer/lib/utils/render-status.js","./node_modules/@polymer/polymer/lib/utils/async.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js","./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js","./lib/monaco-element/monaco-element.js","./lib/code-pen-button.js"],function(_exports,meta,_polymerLegacy,_flattenedNodesObserver,_polymerDom,_renderStatus,async,_HAXWiring,_schemaBehaviors,_monacoElement,_codePenButton){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.CodeEditor=void 0;meta=babelHelpers.interopRequireWildcard(meta);async=babelHelpers.interopRequireWildcard(async);function _templateObject_a8e794c06a8311e98398db50d90173e1(){var data=babelHelpers.taggedTemplateLiteral(["\n    <custom-style>\n      <style>\n        :host {\n          display: block;\n          padding: 16px;\n        }\n        .code-pen-container {\n          width: 100%;\n          display: flex;\n          background-color: var(--code-pen-button-color, #222222);\n          color: white;\n          height: 40px;\n          justify-content: flex-end;\n          align-items: center;\n        }\n        .code-pen-container span {\n          display: inline-flex;\n          line-height: 16px;\n          font-size: 16px;\n          padding: 12px;\n        }\n        [hidden] {\n          display: none !important;\n        }\n        code-pen-button {\n          float: right;\n          height: 40px;\n        }\n        h3 {\n          color: var(--code-pen-title-color, #222222);\n        }\n        #codeeditor {\n          height: 100%;\n          display: flex;\n        }\n      </style>\n    </custom-style>\n    <h3 hidden$=\"[[!title]]\">[[title]]</h3>\n    <monaco-element\n      id=\"codeeditor\"\n      lib-path=\"[[__libPath]]\"\n      value=\"[[editorValue]]\"\n      language=\"[[language]]\"\n      theme=\"[[theme]]\"\n      on-value-changed=\"_editorDataChanged\"\n      font-size$=\"[[fontSize]]\"\n      read-only$=\"[[readOnly]]\"\n    >\n    </monaco-element>\n    <div class=\"code-pen-container\" hidden$=\"[[!showCodePen]]\">\n      <span>Check it out on code pen: </span\n      ><code-pen-button data=\"[[codePenData]]\"></code-pen-button>\n    </div>\n  "]);_templateObject_a8e794c06a8311e98398db50d90173e1=function _templateObject_a8e794c06a8311e98398db50d90173e1(){return data};return data}/**
 * `code-editor`
 * `Wrapper on top of a code editor`
 *
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 * - monaco is the VS code editor
 */var CodeEditor=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_a8e794c06a8311e98398db50d90173e1()),is:"code-editor",behaviors:[HAXBehaviors.PropertiesBehaviors,SchemaBehaviors.Schema],properties:{/**
     * Title
     */title:{type:String},/**
     * Show codePen button to fork it to there to run
     */showCodePen:{type:Boolean,value:!1,reflectToAttribute:!0},/**
     * Readonly setting for the editor
     */readOnly:{type:Boolean,value:!1,reflectToAttribute:!0},/**
     * Code pen data, computed based on the HTML editor
     */codePenData:{type:Object,computed:"_computeCodePenData(title, value)"},/**
     * contents of the editor
     */editorValue:{type:String},/**
     * value of the editor after the fact
     */value:{type:String,notify:!0},/**
     * Theme for the Ace editor.
     */theme:{type:String,value:"vs-dark"},/**
     * Mode / language for editor
     */mode:{type:String,observer:"_modeChanged"},/**
     * Language to present color coding for
     */language:{type:String,value:"javascript"},/**
     * font size for the editor
     */fontSize:{type:Number,value:16}},/**
   * Update the post data whenever the editor has been updated
   */_computeCodePenData:function _computeCodePenData(title,editorValue){return{title:title,html:editorValue}},/**
   * LEGACY: pass down mode to language if that api is used
   */_modeChanged:function _modeChanged(newValue){this.language=this.mode},/**
   * Notice code editor changes and reflect them into this element
   */_editorDataChanged:function _editorDataChanged(e){// value coming up off of thiss
this.value=e.detail},/**
   * Calculate what's in slot currently and then inject it into the editor.
   */updateEditorValue:function updateEditorValue(){var content="",children=this.queryEffectiveChildren("template");// 1st look for a template tag
if(!children){console.warn("code-editor works best with a template tag provided in light dom");children=(0,_polymerDom.dom)(this).getEffectiveChildNodes();if(0<children.length){// loop through everything found in the slotted area and put it back in
for(var j=0,len2=children.length;j<len2;j++){if(babelHelpers.typeof(children[j].tagName)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){content+=children[j].outerHTML}else{content+=children[j].textContent}}}}else{content=children.innerHTML}this.$.codeeditor.value=content.trim()},/**
   * Ensure fields don't pass through to HAX if in that context
   */preProcessHaxNodeToContent:function preProcessHaxNodeToContent(clone){clone.editorValue=null;clone.codePenData=null;clone.value=null;clone.removeAttribute("value");clone.removeAttribute("code-pen-data");return clone},/**
   * created callback
   */created:function created(){// set this ahead of it being painted into the dom
this.__libPath=decodeURIComponent(meta.url)+"/../../../monaco-editor/min/vs"},/**
   * attached life cycle
   */attached:function attached(){(0,_renderStatus.afterNextRender)(this,function(){var _this=this;// mutation observer that ensures state of hax applied correctly
this._observer=new _flattenedNodesObserver.FlattenedNodesObserver(this,function(info){// if we've got new nodes, we have to react to that
if(0<info.addedNodes.length){info.addedNodes.map(function(node){_this.updateEditorValue()})}// if we dropped nodes via the UI (delete event basically)
if(0<info.removedNodes.length){// handle removing items... not sure we need to do anything here
info.removedNodes.map(function(node){_this.updateEditorValue()})}})})}});_exports.CodeEditor=CodeEditor});