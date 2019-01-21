import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import{FlattenedNodesObserver}from"./node_modules/@polymer/polymer/lib/utils/flattened-nodes-observer.js";import{dom}from"./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";import*as async from"./node_modules/@polymer/polymer/lib/utils/async.js";import"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";import"./lib/monaco-element/monaco-element.js";import"./lib/code-pen-button.js";let CodeEditor=Polymer({_template:html`
    <custom-style>
      <style>
        :host {
          display: block;
          padding: 16px;
        }
        .code-pen-container {
          width: 100%;
          display: block;
          background-color: var(--code-pen-button-color, #222222);
          height: 40px;
        }
        [hidden] {
          display: none !important;
        }
        code-pen-button {
          float: right;
          height: 40px;
        }
        h3 {
          color: var(--code-pen-title-color, #222222);
        }
      </style>
    </custom-style>
    <h3 hidden$="[[!title]]">[[title]]</h3>
    <monaco-element
      id="codeeditor"
      lib-path="[[__libPath]]"
      value="[[editorValue]]"
      language="[[language]]"
      theme="[[theme]]"
      on-value-changed="_editorDataChanged"
      font-size\$="[[fontSize]]"
      readonly\$="[[readOnly]]"
    >
    </monaco-element>
    <div class="code-pen-container" hidden$="[[!showCodePen]]">
      <code-pen-button data="[[codePenData]]"></code-pen-button>
    </div>
  `,is:"code-editor",behaviors:[HAXBehaviors.PropertiesBehaviors,SchemaBehaviors.Schema],properties:{title:{type:String},showCodePen:{type:Boolean,value:!1,reflectToAttribute:!0},readOnly:{type:Boolean,value:!1,reflectToAttribute:!0},codePenData:{type:Object,computed:"_computeCodePenData(title, value)"},editorValue:{type:String,value:""},value:{type:String,notify:!0},theme:{type:String,value:"vs-dark"},mode:{type:String,observer:"_modeChanged"},language:{type:String,value:"javascript"},fontSize:{type:String,value:"16px"},minLines:{type:Number,value:10},maxLines:{type:Number,value:25}},_computeCodePenData:function(title,editorValue){return{title:title,html:editorValue}},_modeChanged:function(newValue){this.language=this.mode},_editorDataChanged:function(e){this.value=e.detail},updateEditorValue:function(){var content="",children=this.queryEffectiveChildren("template");if(!children){console.warn("code-editor works best with a template tag provided in light dom");children=dom(this).getEffectiveChildNodes();if(0<children.length){for(var j=0,len2=children.length;j<len2;j++){if(typeof children[j].tagName!==typeof void 0){content+=children[j].outerHTML}else{content+=children[j].textContent}}}}else{content=children.innerHTML}this.editorValue=content.trim()},created:function(){this.__libPath=import.meta.url+"/../../../monaco-editor/min/vs"},ready:function(){this._observer=new FlattenedNodesObserver(this,info=>{if(0<info.addedNodes.length){info.addedNodes.map(node=>{this.updateEditorValue()})}if(0<info.removedNodes.length){info.removedNodes.map(node=>{this.updateEditorValue()})}})},attached:function(){async.microTask.run(()=>{this.$.codeeditor.value=this.editorValue;setTimeout(()=>{this.$.codeeditor.initIFrame()},1e3)});let props={canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Code editor",description:"Edit code in the browser with minor HTML validation",icon:"icons:code",color:"blue",groups:["Code","Development"],handles:[{type:"code",code:"editorValue"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"title",title:"Title",description:"The title of the element",inputMethod:"textfield",icon:"editor:title"},{property:"showCodePen",title:"Code pen button",description:"Play with this on code pen",inputMethod:"boolean",icon:"icons:code"}],configure:[{property:"title",title:"Title",description:"The title of the element",inputMethod:"textfield",icon:"editor:title"},{property:"showCodePen",title:"Code pen button",description:"Play with this on code pen",inputMethod:"boolean",icon:"icons:code"},{property:"editorValue",title:"Code",description:"The code to present to the user",inputMethod:"code-editor",icon:"editor:title"}],advanced:[]}};this.setHaxProperties(props)}});export{CodeEditor};