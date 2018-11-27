import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import{dom}from"./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";import{FlattenedNodesObserver}from"./node_modules/@polymer/polymer/lib/utils/flattened-nodes-observer.js";import"./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";import"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";import"./lib/juicy-ace-editor.js";import"./lib/code-pen-button.js";Polymer({_template:html`
    <style>
      :host {
        display: block;
        padding: 16px;
        --code-pen-button-color: #222222;
        --code-pen-title-color: #222222;
      }
      .code-pen-container {
        width: 100%;
        display: block;
        background-color: var(--code-pen-button-color);
        height: 40px;
      }
      code-pen-button {
        float: right;
        height: 40px;
      }
      h3 {
        color: var(--code-pen-title-color);
      }
    </style>
    <h3>[[title]]</h3>
    <juicy-ace-editor id="codeeditor" theme\$="[[theme]]" mode\$="[[mode]]" font-size\$="[[fontSize]]" readonly\$="[[readOnly]]"></juicy-ace-editor>
    <div class="code-pen-container" hidden\$="[[!showCodePen]]">
      <code-pen-button data="[[codePenData]]"></code-pen-button>
    </div>
`,is:"code-editor",behaviors:[HAXBehaviors.PropertiesBehaviors,MaterializeCSSBehaviors.ColorBehaviors,SchemaBehaviors.Schema],listeners:{change:"_editorDataChanged","editor-ready":"_editorReady"},properties:{title:{type:String,value:"Code sample"},showCodePen:{type:Boolean,value:!1,reflectToAttribute:!0},readOnly:{type:Boolean,value:!0,reflectToAttribute:!0},codePenData:{type:Object,computed:"_computeCodePenData(title, editorValue)"},editorValue:{type:String,value:"",notify:!0},theme:{type:String,value:"ace/theme/monokai"},mode:{type:String,value:"ace/mode/html"},fontSize:{type:String,value:"16px"},minLines:{type:Number,value:10},maxLines:{type:Number,value:25}},_computeCodePenData:function(title,editorValue){return{title:title,html:editorValue}},_editorReady:function(e){this.__editorReady=!0;setTimeout(()=>{this.$.codeeditor.editor.setOptions({maxLines:this.maxLines,minLines:this.minLines});this.updateEditorValue()},200)},_editorDataChanged:function(e){this.editorValue=this.$.codeeditor.value},updateEditorValue:function(){let children=this.queryEffectiveChildren("template");if(!children){console.warn("code-editor requires a template to be provided in light-dom")}else{this.$.codeeditor.value=children.innerHTML}},ready:function(){this._observer=new FlattenedNodesObserver(this,info=>{if(0<info.addedNodes.length){info.addedNodes.map(node=>{this.updateEditorValue()})}if(0<info.removedNodes.length){info.removedNodes.map(node=>{this.updateEditorValue()})}})},attached:function(){let props={canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Code editor",description:"Edit code in the browser with minor HTML validation",icon:"icons:code",color:"blue",groups:["Code","Development"],handles:[{type:"code",code:"contents"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"title",title:"Title",description:"The title of the element",inputMethod:"textfield",icon:"editor:title"},{property:"showCodePen",title:"Code pen button",description:"Play with this on code pen",inputMethod:"boolean",icon:"icons:code"}],configure:[{property:"title",title:"Title",description:"The title of the element",inputMethod:"textfield",icon:"editor:title"},{property:"showCodePen",title:"Code pen button",description:"Play with this on code pen",inputMethod:"boolean",icon:"icons:code"},{slot:"",title:"Code",description:"The code to present to the user",inputMethod:"code-editor",icon:"editor:title"}],advanced:[]}};this.setHaxProperties(props)}});