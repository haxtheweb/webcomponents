import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@polymer/paper-button/paper-button.js";import"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";import"./lib/lrn-vocab-dialog.js";Polymer({_template:html`
    <style>
      :host {
        display: inline-flex;
        --lrn-vocab-border: 1px dashed #ccc;
      }
      paper-button {
        text-transform: none;
        padding: 0;
        margin: 0;
        position: relative;
        top:0px;
        border-radius:0;
        border-bottom: var(--lrn-vocab-border);
        background:#f5f5f5;
        @apply --lrn-vocab-button
      }
      paper-button:hover {
        background:#bbdefb;
        border-bottom: 1px dashed #2196f3;
        @apply --lrn-vocab-button-hover
      }
    </style>

    <div>
      <paper-button id="button" noink="">[[term]]</paper-button>
    </div>
    <lrn-vocab-dialog id="dialog" opened="{{opened}}" term="[[term]]">
      <slot></slot>
    </lrn-vocab-dialog>
`,is:"lrn-vocab",behaviors:[HAXBehaviors.PropertiesBehaviors,SchemaBehaviors.Schema],properties:{term:{type:String,reflectToAttribute:!0},opened:{type:Boolean,value:!1}},ready:function(){this.$.button.addEventListener("click",()=>{this.opened=!this.opened});this.__modal=this.$.dialog},attached:function(){document.body.addEventListener("lrn-vocab-dialog-closed",this._accessibleFocus.bind(this));this.setHaxProperties({canScale:!1,canPosition:!1,canEditSource:!1,gizmo:{title:"Vocab",description:"Vocabulary term",icon:"image:details",color:"red",groups:["Vocab"],handles:[{type:"inline",text:"term"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"term",title:"Term",description:"The word or words to make clickable for more detail.",inputMethod:"textfield",icon:"editor:title",required:!0}],configure:[{property:"term",title:"Term",description:"The word or words to make clickable for more detail.",inputMethod:"textfield",icon:"editor:title",required:!0},{slot:"",title:"Contents",description:"Contents to display in the pop up.",inputMethod:"code-editor",required:!0}],advanced:[]}})},_accessibleFocus:function(e){if(e.detail===this.__modal){this.$.button.focus()}}});