/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{LitElement,html,css}from"./node_modules/lit-element/lit-element.js";import{RichTextEditorStyles}from"./lib/rich-text-editor-styles.js";import"./node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js";import"./lib/toolbars/rich-text-editor-toolbar.js";import"./lib/toolbars/rich-text-editor-toolbar-mini.js";import"./lib/toolbars/rich-text-editor-toolbar-full.js";/**
 * `rich-text-editor`
 * @element rich-text-editor
 * `a standalone rich text editor`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @polymer
 * @demo ./demo/index.html demo
 * @demo ./demo/mini.html mini floating toolbar
 * @demo ./demo/full.html toolbar with breadcrumb
 * @demo ./demo/config.html custom configuration
 */class RichTextEditor extends RichTextEditorStyles(LitElement){//styles function
static get styles(){return[...super.styles,css`
:host([hidden]) {
  display: none;
}

:host {
  display: block;
  min-height: 20px;
  cursor: pointer;
}

:host([contenteditable="true"]) {
  border: var(--rich-text-editor-border);
  overflow: auto;
}

:host([contenteditable="true"]):focus-within,
:host([contenteditable="true"]):focus {
  padding: 2px;
  margin-bottom: 2px;
}

:host(.heightmax[contenteditable="true"]) {
  max-height: calc(100vh - 200px);
  overflow-y: scroll;
}

:host(:empty) {
  border: 1px dashed var(--rich-text-editor-border-color);
}

:host(:not([contenteditable="true"]):empty):before {
  content: attr(placeholder);
  padding: 0 5px;
  display: block;
  color: var(--rich-text-editor-button-disabled-color);
}
      `]}// render function
render(){return html`

<slot></slot>`}// haxProperty definition
static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Rich text-editor",description:"a standalone rich text editor",icon:"icons:android",color:"green",groups:["Text"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"nikkimk",owner:"Penn State University"}},settings:{quick:[],configure:[{property:"title",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"}],advanced:[]}}}// properties available to the custom element for data binding
static get properties(){return{...super.properties,/**
   * The editor's unique id
   */id:{name:"id",type:String,reflect:!0,attribute:"id"},/**
   * Placeholder text for empty editable regions
   */placeholder:{name:"placeholder",type:String,reflect:!0,attribute:"placeholder"},/**
   * The id for the toolbar
   */toolbar:{name:"toolbar",type:String,reflect:!0,attribute:"toolbar"},/**
   * The type of editor toolbar, i.e.
   * full - full for full toolbar with breadcrumb,
   * mini - mini for mini floating toolbar, or
   * the default toolbar if neither.
   */type:{name:"type",type:String,reflect:!0,attribute:"type"}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */static get tag(){return"rich-text-editor"}constructor(){super();this.placeholder="Click to edit";this.toolbar="";this.type="rich-text-editor-toolbar";this.id=""}/**
   * life cycle, element is afixed to the DOM
   * @returns {void}
   */connectedCallback(){super.connectedCallback();if(!this.id)this.id=this._generateUUID();this.getEditor();window.RichTextEditorStyleManager.requestAvailability()}/**
   * connects the mini-toolbar to a mini editor
   * @returns {void}
   */getEditor(){let id=this.toolbar?"#"+this.toolbar:"",both=document.querySelector(this.type+id),idOnly=id?document.querySelector(id):null,typeOnly=document.querySelector(this.type),//try to match both id and type, if no match try id only, and then type only
toolbar=both||idOnly||typeOnly;//if still no match, create a region of type
if(!this.toolbar)this.toolbar=this._generateUUID();if(!toolbar||!toolbar.addEditableRegion){toolbar=document.createElement(this.type);toolbar.id=this.toolbar;this.parentNode.appendChild(toolbar)}toolbar.addEditableRegion(this)}/**
   * Normalizes selected range data.
   *
   * @returns {object} the selected range
   */_getRange(){let sel=window.getSelection();if(sel.getRangeAt&&sel.rangeCount){return sel.getRangeAt(0)}else if(sel){return sel}else!1}/**
   * Generate a UUID
   * @returns {string} a unique id
   */_generateUUID(){let hex=Math.floor(65536*(1+Math.random())).toString(16).substring(1);return"rte-"+"ss-s-s-s-sss".replace(/s/g,hex)}}window.customElements.define(RichTextEditor.tag,RichTextEditor);export{RichTextEditor};