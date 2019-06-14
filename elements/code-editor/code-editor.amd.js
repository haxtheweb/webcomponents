define(["exports","meta","require","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/polymer/lib/utils/flattened-nodes-observer.js","./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js","./node_modules/@polymer/polymer/lib/utils/render-status.js","./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js"],function(_exports,meta,_require,_polymerElement,_flattenedNodesObserver,_polymerDom,_renderStatus,_schemaBehaviors){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.CodeEditor=void 0;meta=babelHelpers.interopRequireWildcard(meta);_require=babelHelpers.interopRequireWildcard(_require);function _templateObject_70d7c19081c111e9b8156958af4ebbb2(){var data=babelHelpers.taggedTemplateLiteral(["\n      <style>\n        :host {\n          display: block;\n          padding: 16px;\n        }\n        .code-pen-container {\n          width: 100%;\n          display: flex;\n          background-color: var(--code-pen-button-color, #222222);\n          color: white;\n          height: 40px;\n          justify-content: flex-end;\n          align-items: center;\n        }\n        .code-pen-container span {\n          display: inline-flex;\n          line-height: 16px;\n          font-size: 16px;\n          padding: 12px;\n        }\n        [hidden] {\n          display: none !important;\n        }\n        code-pen-button {\n          float: right;\n          height: 40px;\n        }\n        h3 {\n          color: var(--code-pen-title-color, #222222);\n        }\n        #codeeditor {\n          height: 100%;\n          display: flex;\n        }\n      </style>\n      <h3 hidden$=\"[[!title]]\">[[title]]</h3>\n      <monaco-element\n        id=\"codeeditor\"\n        lib-path=\"[[__libPath]]\"\n        value=\"[[editorValue]]\"\n        language=\"[[language]]\"\n        theme=\"[[theme]]\"\n        on-value-changed=\"_editorDataChanged\"\n        font-size$=\"[[fontSize]]\"\n        read-only$=\"[[readOnly]]\"\n      >\n      </monaco-element>\n      <div class=\"code-pen-container\" hidden$=\"[[!showCodePen]]\">\n        <span>Check it out on code pen: </span\n        ><code-pen-button data=\"[[codePenData]]\"></code-pen-button>\n      </div>\n    "]);_templateObject_70d7c19081c111e9b8156958af4ebbb2=function _templateObject_70d7c19081c111e9b8156958af4ebbb2(){return data};return data}/**
 * `code-editor`
 * `Wrapper on top of a code editor`
 *
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 * - monaco is the VS code editor
 */var CodeEditor=/*#__PURE__*/function(_SchemaBehaviors){babelHelpers.inherits(CodeEditor,_SchemaBehaviors);function CodeEditor(){var _this;babelHelpers.classCallCheck(this,CodeEditor);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(CodeEditor).call(this));_this.__libPath=decodeURIComponent(meta.url)+"/../../../monaco-editor/min/vs";new Promise(function(res,rej){return _require.default(["./node_modules/@lrnwebcomponents/code-editor/lib/monaco-element/monaco-element.js"],res,rej)});new Promise(function(res,rej){return _require.default(["./node_modules/@lrnwebcomponents/code-editor/lib/code-pen-button.js"],res,rej)});return _this}babelHelpers.createClass(CodeEditor,[{key:"_computeCodePenData",/**
   * Update the post data whenever the editor has been updated
   */value:function _computeCodePenData(title,editorValue){return{title:title,html:editorValue}}/**
   * LEGACY: pass down mode to language if that api is used
   */},{key:"_modeChanged",value:function _modeChanged(newValue){this.language=this.mode}/**
   * Notice code editor changes and reflect them into this element
   */},{key:"_editorDataChanged",value:function _editorDataChanged(e){// value coming up off of thiss
this.value=e.detail}/**
   * Calculate what's in slot currently and then inject it into the editor.
   */},{key:"updateEditorValue",value:function updateEditorValue(node){if(node){var content="",children=node;if("TEMPLATE"!==node.tagName){console.warn("code-editor works best with a template tag provided in light dom");children=(0,_polymerDom.dom)(this).getEffectiveChildNodes();if(0<children.length){// loop through everything found in the slotted area and put it back in
for(var j=0,len2=children.length;j<len2;j++){if(babelHelpers.typeof(children[j].tagName)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){content+=children[j].outerHTML}else{content+=children[j].textContent}}}}else{content=children.innerHTML}if(content){this.shadowRoot.querySelector("#codeeditor").value=content.trim()}}}/**
   * Ensure fields don't pass through to HAX if in that context
   */},{key:"preProcessHaxNodeToContent",value:function preProcessHaxNodeToContent(clone){clone.editorValue=null;clone.codePenData=null;clone.value=null;clone.removeAttribute("value");clone.removeAttribute("code-pen-data");return clone}/**
   * attached life cycle
   */},{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(CodeEditor.prototype),"connectedCallback",this).call(this);(0,_renderStatus.afterNextRender)(this,function(){var _this2=this;// mutation observer that ensures state of hax applied correctly
this._observer=new _flattenedNodesObserver.FlattenedNodesObserver(this,function(info){// if we've got new nodes, we have to react to that
if(0<info.addedNodes.length){info.addedNodes.map(function(node){if(node.tagName){_this2.updateEditorValue(node)}})}// if we dropped nodes via the UI (delete event basically)
if(0<info.removedNodes.length){// handle removing items... not sure we need to do anything here
info.removedNodes.map(function(node){if(node.tagName){_this2.updateEditorValue(node)}})}})})}}],[{key:"template",get:function get(){return(0,_polymerElement.html)(_templateObject_70d7c19081c111e9b8156958af4ebbb2())}},{key:"tag",get:function get(){return"code-editor"}},{key:"properties",get:function get(){var props={/**
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
       */fontSize:{type:Number,value:16}};if(babelHelpers.get(babelHelpers.getPrototypeOf(CodeEditor),"properties",this)){props=Object.assign(props,babelHelpers.get(babelHelpers.getPrototypeOf(CodeEditor),"properties",this))}return props}}]);return CodeEditor}((0,_schemaBehaviors.SchemaBehaviors)(_polymerElement.PolymerElement));_exports.CodeEditor=CodeEditor;window.customElements.define(CodeEditor.tag,CodeEditor)});