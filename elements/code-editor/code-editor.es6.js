/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{FlattenedNodesObserver}from"./node_modules/@polymer/polymer/lib/utils/flattened-nodes-observer.js";import{dom}from"./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";import{afterNextRender}from"./node_modules/@polymer/polymer/lib/utils/render-status.js";import{SchemaBehaviors}from"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";/**
 * `code-editor`
 * `Wrapper on top of a code editor`
 *
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 * - monaco is the VS code editor
 */class CodeEditor extends SchemaBehaviors(PolymerElement){constructor(){super();this.__libPath=decodeURIComponent(import.meta.url)+"/../../../monaco-editor/min/vs";import("./node_modules/@lrnwebcomponents/code-editor/lib/monaco-element/monaco-element.js");import("./node_modules/@lrnwebcomponents/code-editor/lib/code-pen-button.js");this.addEventListener("monaco-element-ready",this.editorReady.bind(this))}static get template(){return html`
      <style>
        :host {
          display: block;
          padding: 16px;
          font-family: unset;
        }
        :host([hidden]) {
          display: none !important;
        }
        .code-pen-container:not([hidden]) {
          width: 100%;
          display: flex;
          background-color: var(--code-pen-button-color, #222222);
          color: white;
          height: 40px;
          justify-content: flex-end;
          align-items: center;
        }
        .code-pen-container span {
          display: inline-flex;
          line-height: 16px;
          font-size: 16px;
          padding: 12px;
        }
        code-pen-button {
          float: right;
          height: 40px;
        }
        label {
          color: var(--code-editor-label-color, #888);
          transition: all 0.5s;
          @apply --code-editor-label;
        }

        :host([focused]) label {
          color: var(
            --code-editor-float-label-active-color,
            var(--code-editor-label-color, #000)
          );
          @apply --code-editor-focus-label;
        }

        #codeeditor {
          height: 100%;
          display: flex;
          @apply --code-editor-code;
        }

        :host([focused]) #codeeditor {
          @apply --code-editor-focus-code;
        }
      </style>
      <label for="codeeditor" hidden$="[[!title]]">[[title]]</label>
      <monaco-element
        id="codeeditor"
        autofocus$="[[autofocus]]"
        hide-line-numbers$="[[hideLineNumbers]]"
        lib-path="[[__libPath]]"
        language="[[language]]"
        theme="[[theme]]"
        on-value-changed="_editorDataChanged"
        font-size$="[[fontSize]]"
        read-only$="[[readOnly]]"
        on-code-editor-focus="_handleFocus"
        on-code-editor-blur="_handleBlur"
      >
      </monaco-element>
      <div class="code-pen-container" hidden$="[[!showCodePen]]">
        <span>Check it out on code pen: </span
        ><code-pen-button data="[[codePenData]]"></code-pen-button>
      </div>
    `}static get tag(){return"code-editor"}static get properties(){let props={/**
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
       */focused:{type:Boolean,value:!1,reflectToAttribute:!0}};if(super.properties){props=Object.assign(props,super.properties)}return props}/**
   * Update the post data whenever the editor has been updated
   */_computeCodePenData(title,editorValue){return{title:title,html:editorValue}}/**
   * sets focused attribute when monaco-elements's focus event fires
   * @param {event} e the monaco-elements's focus event
   */_handleFocus(e){this.focused=!0}/**
   * unsets focused attribute when monaco-elements's blur event fires
   * @param {event} e the monaco-elements's blur event
   */_handleBlur(e){this.focused=!1}/**
   * LEGACY: pass down mode to language if that api is used
   */_modeChanged(newValue){this.language=this.mode}/**
   * Notice code editor changes and reflect them into this element
   */_editorDataChanged(e){// value coming up off of thiss
this.value=e.detail}/**
   * Calculate what's in slot currently and then inject it into the editor.
   */updateEditorValue(node){if(node){var content="",children=node;if("TEMPLATE"!==node.tagName){console.warn("code-editor works best with a template tag provided in light dom");children=dom(this).getEffectiveChildNodes();if(0<children.length){// loop through everything found in the slotted area and put it back in
for(var j=0,len2=children.length;j<len2;j++){if(typeof children[j].tagName!==typeof void 0){content+=children[j].outerHTML}else{content+=children[j].textContent}}}}else{content=children.innerHTML}if(content){this.shadowRoot.querySelector("#codeeditor").value=content.trim()}}}_editorValueChanged(newValue){if(newValue){this.shadowRoot.querySelector("#codeeditor").value=newValue}}/**
   * Ensure fields don't pass through to HAX if in that context
   */preProcessHaxNodeToContent(clone){clone.editorValue=null;clone.codePenData=null;clone.value=null;clone.removeAttribute("value");clone.removeAttribute("code-pen-data");return clone}/**
   * attached life cycle
   */connectedCallback(){super.connectedCallback();let root=this;afterNextRender(this,function(){// mutation observer that ensures state of hax applied correctly
this._observer=new FlattenedNodesObserver(this,info=>{// if we've got new nodes, we have to react to that
if(0<info.addedNodes.length){info.addedNodes.map(node=>{if(node.tagName){this.updateEditorValue(node)}})}// if we dropped nodes via the UI (delete event basically)
if(0<info.removedNodes.length){// handle removing items... not sure we need to do anything here
info.removedNodes.map(node=>{if(node.tagName){this.updateEditorValue(node)}})}})})}disconnectedCallback(){this.removeEventListener("monaco-element-ready",this.editorReady.bind(this));super.disconnectedCallback()}editorReady(e){if(this.editorValue){this.shadowRoot.querySelector("#codeeditor").value=this.editorValue}}}window.customElements.define(CodeEditor.tag,CodeEditor);export{CodeEditor};