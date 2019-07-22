define(["exports","meta","require","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/polymer/lib/utils/flattened-nodes-observer.js","./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js","./node_modules/@polymer/polymer/lib/utils/render-status.js","./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js"],function(_exports,meta,_require,_polymerElement,_flattenedNodesObserver,_polymerDom,_renderStatus,_schemaBehaviors){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.CodeEditor=void 0;meta=babelHelpers.interopRequireWildcard(meta);_require=babelHelpers.interopRequireWildcard(_require);function _templateObject_75e45f60ab1311e9acdc7d0181783c2c(){var data=babelHelpers.taggedTemplateLiteral(["\n      <style>\n        :host {\n          display: block;\n          padding: 16px;\n          font-family: unset;\n        }\n        :host([hidden]) {\n          display: none !important;\n        }\n        .code-pen-container:not([hidden]) {\n          width: 100%;\n          display: flex;\n          background-color: var(--code-pen-button-color, #222222);\n          color: white;\n          height: 40px;\n          justify-content: flex-end;\n          align-items: center;\n        }\n        .code-pen-container span {\n          display: inline-flex;\n          line-height: 16px;\n          font-size: 16px;\n          padding: 12px;\n        }\n        code-pen-button {\n          float: right;\n          height: 40px;\n        }\n        label {\n          color: var(--code-editor-label-color, #888);\n          transition: all 0.5s;\n          @apply --code-editor-label;\n        }\n\n        :host([focused]) label {\n          color: var(\n            --code-editor-float-label-active-color,\n            var(--code-editor-label-color, #000)\n          );\n          @apply --code-editor-focus-label;\n        }\n\n        #codeeditor {\n          height: 100%;\n          display: flex;\n          @apply --code-editor-code;\n        }\n\n        :host([focused]) #codeeditor {\n          @apply --code-editor-focus-code;\n        }\n      </style>\n      <label for=\"codeeditor\" hidden$=\"[[!title]]\">[[title]]</label>\n      <monaco-element\n        id=\"codeeditor\"\n        autofocus$=\"[[autofocus]]\"\n        hide-line-numbers$=\"[[hideLineNumbers]]\"\n        lib-path=\"[[__libPath]]\"\n        language=\"[[language]]\"\n        theme=\"[[theme]]\"\n        on-value-changed=\"_editorDataChanged\"\n        font-size$=\"[[fontSize]]\"\n        read-only$=\"[[readOnly]]\"\n        on-code-editor-focus=\"_handleFocus\"\n        on-code-editor-blur=\"_handleBlur\"\n      >\n      </monaco-element>\n      <div class=\"code-pen-container\" hidden$=\"[[!showCodePen]]\">\n        <span>Check it out on code pen: </span\n        ><code-pen-button data=\"[[codePenData]]\"></code-pen-button>\n      </div>\n    "]);_templateObject_75e45f60ab1311e9acdc7d0181783c2c=function _templateObject_75e45f60ab1311e9acdc7d0181783c2c(){return data};return data}/**
 * `code-editor`
 * `Wrapper on top of a code editor`
 *
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 * - monaco is the VS code editor
 */var CodeEditor=/*#__PURE__*/function(_SchemaBehaviors){babelHelpers.inherits(CodeEditor,_SchemaBehaviors);function CodeEditor(){var _this;babelHelpers.classCallCheck(this,CodeEditor);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(CodeEditor).call(this));_this.__libPath=decodeURIComponent(meta.url)+"/../../../monaco-editor/min/vs";new Promise(function(res,rej){return _require.default(["./node_modules/@lrnwebcomponents/code-editor/lib/monaco-element/monaco-element.js"],res,rej)});new Promise(function(res,rej){return _require.default(["./node_modules/@lrnwebcomponents/code-editor/lib/code-pen-button.js"],res,rej)});_this.addEventListener("monaco-element-ready",_this.editorReady.bind(babelHelpers.assertThisInitialized(_this)));return _this}babelHelpers.createClass(CodeEditor,[{key:"_computeCodePenData",/**
   * Update the post data whenever the editor has been updated
   */value:function _computeCodePenData(title,editorValue){return{title:title,html:editorValue}}/**
   * sets focused attribute when monaco-elements's focus event fires
   * @param {event} e the monaco-elements's focus event
   */},{key:"_handleFocus",value:function _handleFocus(e){this.focused=!0}/**
   * unsets focused attribute when monaco-elements's blur event fires
   * @param {event} e the monaco-elements's blur event
   */},{key:"_handleBlur",value:function _handleBlur(e){this.focused=!1}/**
   * LEGACY: pass down mode to language if that api is used
   */},{key:"_modeChanged",value:function _modeChanged(newValue){this.language=this.mode}/**
   * Notice code editor changes and reflect them into this element
   */},{key:"_editorDataChanged",value:function _editorDataChanged(e){// value coming up off of thiss
this.value=e.detail}/**
   * Calculate what's in slot currently and then inject it into the editor.
   */},{key:"updateEditorValue",value:function updateEditorValue(node){if(node){var content="",children=node;if("TEMPLATE"!==node.tagName){console.warn("code-editor works best with a template tag provided in light dom");children=(0,_polymerDom.dom)(this).getEffectiveChildNodes();if(0<children.length){// loop through everything found in the slotted area and put it back in
for(var j=0,len2=children.length;j<len2;j++){if(babelHelpers.typeof(children[j].tagName)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){content+=children[j].outerHTML}else{content+=children[j].textContent}}}}else{content=children.innerHTML}if(content){this.shadowRoot.querySelector("#codeeditor").value=content.trim()}}}},{key:"_editorValueChanged",value:function _editorValueChanged(newValue){if(newValue){this.shadowRoot.querySelector("#codeeditor").value=newValue}}/**
   * Ensure fields don't pass through to HAX if in that context
   */},{key:"preProcessHaxNodeToContent",value:function preProcessHaxNodeToContent(clone){clone.editorValue=null;clone.codePenData=null;clone.value=null;clone.removeAttribute("value");clone.removeAttribute("code-pen-data");return clone}/**
   * attached life cycle
   */},{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(CodeEditor.prototype),"connectedCallback",this).call(this);var root=this;(0,_renderStatus.afterNextRender)(this,function(){var _this2=this;// mutation observer that ensures state of hax applied correctly
this._observer=new _flattenedNodesObserver.FlattenedNodesObserver(this,function(info){// if we've got new nodes, we have to react to that
if(0<info.addedNodes.length){info.addedNodes.map(function(node){if(node.tagName){_this2.updateEditorValue(node)}})}// if we dropped nodes via the UI (delete event basically)
if(0<info.removedNodes.length){// handle removing items... not sure we need to do anything here
info.removedNodes.map(function(node){if(node.tagName){_this2.updateEditorValue(node)}})}})})}},{key:"disconnectedCallback",value:function disconnectedCallback(){this.removeEventListener("monaco-element-ready",this.editorReady.bind(this));babelHelpers.get(babelHelpers.getPrototypeOf(CodeEditor.prototype),"disconnectedCallback",this).call(this)}},{key:"editorReady",value:function editorReady(e){if(this.editorValue){this.shadowRoot.querySelector("#codeeditor").value=this.editorValue}}}],[{key:"template",get:function get(){return(0,_polymerElement.html)(_templateObject_75e45f60ab1311e9acdc7d0181783c2c())}},{key:"tag",get:function get(){return"code-editor"}},{key:"properties",get:function get(){var props={/**
       * Title
       */title:{type:String},/**
       * Show codePen button to fork it to there to run
       */showCodePen:{type:Boolean,value:!1,reflectToAttribute:!0},/**
       * Readonly setting for the editor
       */readOnly:{type:Boolean,value:!1,reflectToAttribute:!0},/**
       * Code pen data, computed based on the HTML editor
       */codePenData:{type:Object,computed:"_computeCodePenData(title, value)"},/**
       * contents of the editor
       */editorValue:{type:String,observer:"_editorValueChanged"},/**
       * value of the editor after the fact
       */value:{type:String,notify:!0},/**
       * Theme for the Ace editor.
       */theme:{type:String,value:"vs-dark"},/**
       * Mode / language for editor
       */mode:{type:String,observer:"_modeChanged"},/**
       * Language to present color coding for
       */language:{type:String,value:"javascript"},/**
       * font size for the editor
       */fontSize:{type:Number,value:16},/**
       * automatically set focus on the editor
       */autofocus:{type:Boolean,value:!1,reflectToAttribute:!0},/**
       * hide the line numbers
       */hideLineNumbers:{type:Boolean,value:!1},/**
       * does the monaco-editor have focus
       */focused:{type:Boolean,value:!1,reflectToAttribute:!0}};if(babelHelpers.get(babelHelpers.getPrototypeOf(CodeEditor),"properties",this)){props=Object.assign(props,babelHelpers.get(babelHelpers.getPrototypeOf(CodeEditor),"properties",this))}return props}}]);return CodeEditor}((0,_schemaBehaviors.SchemaBehaviors)(_polymerElement.PolymerElement));_exports.CodeEditor=CodeEditor;window.customElements.define(CodeEditor.tag,CodeEditor)});