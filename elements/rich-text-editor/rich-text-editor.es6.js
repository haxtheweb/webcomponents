import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import{ResponsiveUtility}from"./node_modules/@lrnwebcomponents/responsive-utility/responsive-utility.js";import"./node_modules/@polymer/iron-icons/iron-icons.js";import"./node_modules/@polymer/iron-icons/editor-icons.js";import"./node_modules/@polymer/iron-icons/image-icons.js";import"./node_modules/@lrnwebcomponents/md-extra-icons/md-extra-icons.js";import{RichTextEditorButton}from"./lib/rich-text-editor-button.js";import"./lib/rich-text-editor-styles.js";class RichTextEditor extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  @apply --rich-text-editor;
}
:host([sticky]) {
  position: sticky;
  top: 0;
}
:host([hidden]) {
  display: none;
}
:host #toolbar {
  display: flex;
  opacity: 1;
  margin: 0;
  align-items: stretch;
  flex-wrap: wrap;
  justify-content: flex-start;
  background-color: var(--rich-text-editor-bg);
  border: var(--rich-text-editor-border);
  font-size: 12px;
  transition: all 0.5s;
  @apply --rich-text-editor-toolbar;
} 
:host #toolbar[aria-hidden]{
  visibility: hidden;
  opacity: 0;
  height: 0;
}
:host #toolbar .group {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  align-items: stretch;
  padding: 0 3px;
  @apply --rich-text-editor-toolbar-group;
}
:host #toolbar .group:not(:last-of-type) {
  margin-right: 3px;
  border-right: var(--rich-text-editor-border);
  @apply --rich-text-editor-toolbar-divider;
}
:host #toolbar .more-button {
  flex: 1 0 auto;
  justify-content: flex-end;
}
:host .more-button[display-max="xs"],
:host(:not([responsive-size="xs"])) .more-button[display-max="sm"],
:host(:not([responsive-size*="s"])) .more-button[display-max="md"],
:host([responsive-size*="l"]) .more-button[display-max="lg"],
:host([responsive-size="xl"]) .more-button[display-max="xl"],
:host([responsive-size="xs"]) #toolbar[collapsed] .group:not([minimum-size="xs"]),
:host([responsive-size="sm"]) #toolbar[collapsed] .group:not([minimum-size*="s"]),
:host([responsive-size="md"]) #toolbar[collapsed] .group[minimum-size*="l"],
:host([responsive-size="lg"]) #toolbar[collapsed] .group[minimum-size="xl"] {
  display: none;
}
</style>
<style include="rich-text-editor-styles"></style>
<div id="toolbar" aria-hidden$="[[!controls]]" collapsed$="[[collapsed]]">
  <template is="dom-repeat" items="[[buttons]]" as="size">
    <template is="dom-repeat" items="[[size.groups]]" as="group">
      <div class="group" minimum-size$="[[size.size]]">
        <template is="dom-repeat" items="[[group.buttons]]" as="button">
          <rich-text-editor-button
            controls$="[[controls]]"
            command$="[[button.command]]"
            event$="[[button.event]]"
            icon$="[[button.icon]]"
            label$="[[button.label]]"
            toggled$="[[_toggledButton(button,__trigger)]]"
            on-rich-text-button-tap="_handleTextOperation">
          </rich-text-editor-button> 
        </template>
      </div>
    </template>
  </template>
  <rich-text-editor-button
    class="more-button"
    display-max$="[[_getMax(buttons)]]"
    controls="toolbar"
    icon="more-vert"
    label="Toggle More Buttons"
    toggled$="[[!collapsed]]"
    on-rich-text-button-tap="_toggleMore">
  </rich-text-editor-button>  
</div>`}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Rich text-editor",description:"a standalone rich text editor",icon:"icons:android",color:"green",groups:["Text"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"nikkimk",owner:"Penn State University"}},settings:{quick:[],configure:[{property:"title",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"}],advanced:[]}}}static get properties(){return{buttons:{name:"buttons",type:"Array",computed:"_getButtons(config)"},collapsed:{name:"collapsed",type:"Boolean",value:!0},config:{name:"config",type:"Object",value:{xs:[{group:"History",buttons:[{label:"Undo",icon:"icons:undo",event:"history-undo",command:"undo"},{label:"Redo",icon:"icons:redo",event:"history-redo",command:"redo"}]},{group:"Basic Inline Operations",buttons:[{label:"Bold",icon:"editor:format-bold",event:"text-bold",command:"bold",toggles:!0},{label:"Italics",icon:"editor:format-italic",event:"text-italic",command:"italic",toggles:!0},{label:"Erase Format",icon:"editor:format-clear",event:"text-remove-format",command:"removeFormat"}]},{group:"Links",buttons:[{label:"Link",icon:"link",command:"link",toggles:!0}]},{group:"Clipboard Operations",buttons:[{label:"Cut",icon:"icons:content-cut",event:"clipboard-cut",command:"cut"},{label:"Copy",icon:"icons:content-copy",event:"clipboard-copy",command:"copy"},{label:"Paste",icon:"icons:content-paste",event:"clipboard-paste",command:"paste"}]}],sm:[{group:"Subscript and Superscript",buttons:[{label:"Subscript",icon:"mdextra:subscript",event:"text-subscript",command:"subscript",toggles:!0},{label:"Superscript",icon:"mdextra:superscript",event:"text-superscript",command:"superscript",toggles:!0}]}],md:[{group:"Lists and Indents",buttons:[{label:"Ordered List",icon:"editor:format-list-numbered",event:"text-list-numbered",command:"insertOrderedList",toggles:!0},{label:"Unordered List",icon:"editor:format-list-bulleted",event:"text-list-bulleted",command:"insertUnorderedList",toggles:!0},{label:"Blockquote",icon:"editor:format-quote"},{label:"Increase Indent",icon:"editor:format-indent-increase",event:"text-indent",command:"indent"},{label:"Decrease Indent",icon:"editor:format-indent-decrease",event:"text-outdent",command:"outdent"}]}],lg:[{group:"Insertions",buttons:[{label:"Insert Inline Image",icon:"editor:insert-photo",command:"insertImage"},{label:"Insert Symbol",icon:"editor:functions"},{label:"Insert Emoji",icon:"image:tag-faces"}]}]}},controls:{name:"controls",type:"String",value:null},editableElements:{name:"editableElements",type:"Array",value:[]},editableElement:{name:"editableElement",type:"Object",value:null},responsiveSize:{name:"responsiveSize",type:"String",value:"xs",reflectToAttribute:!0},selection:{name:"selection",type:"Object",value:null},sticky:{name:"sticky",type:"Boolean",value:!1,reflectToAttribute:!0}}}static get tag(){return"rich-text-editor"}connectedCallback(){super.connectedCallback();let root=this;document.designMode="on";window.ResponsiveUtility.requestAvailability();window.dispatchEvent(new CustomEvent("responsive-element",{detail:{element:root,attribute:"responsive-size",relativeToParent:!0}}));document.addEventListener("selectionchange",function(){root._updateToggleButtons()})}disconnectedCallback(){super.disconnectedCallback();let root=this;document.removeEventListener("selectionchange",function(){root._updateToggleButtons()})}editTarget(editableElement){let root=this,test=document.createElement("RichTextEditorButton");console.log(RichTextEditorButton.properties,test);if(editableElement.getAttribute("id")===void 0||null===editableElement.getAttribute("id"))editableElement.setAttribute("id",root._generateUUID());if(root.editableElement!==editableElement){if(null!==root.editableElement){root.editableElement.contentEditable=!1;root.editableElement=null}editableElement.parentNode.insertBefore(root,editableElement);root.editableElement=editableElement;root.editableElement.contentEditable=!0;root._updateToggleButtons();root.controls=editableElement.getAttribute("id")}}removeEditableRegion(editableElement){let root=this;for(let i=0,item;i<this.editableElements.length;i++){item=this.editableElements[i];if(item[0]===editableElement){item[0].removeEventListener("click",function(e){root.editTarget(editableElement)});item[1].disconnect();this.set("editableElements",this.editableElements.splice(i,1))}}}addEditableRegion(editableElement){let root=this,observer=new MutationObserver(function(){root._updateToggleButtons()});editableElement.addEventListener("click",function(e){root.editTarget(editableElement)});observer.observe(editableElement,{attributes:!1,childList:!0,subtree:!0,characterData:!1});root.push("editableElements",[editableElement,observer])}_generateUUID(){return"ss-s-s-s-sss".replace(/s/g,this._uuidPart)}_getButtons(config){let buttons=[],sizes=["xs","sm","md","lg","xl"];sizes.forEach(function(size){if(config[size]!==void 0&&null!==config[size])buttons.push({size:size,groups:config[size]})});return buttons}_getMax(buttons){return buttons!==void 0&&null!==buttons?buttons[buttons.length-1].size:null}_getRange(){let sel=window.getSelection();if(sel.getRangeAt&&sel.rangeCount){return sel.getRangeAt(0)}else if(sel){return sel}else!1}_handleTextOperation(e){this.selection=this.editableElement.getSelection?this.editableElement.getSelection():this._getRange();if(e.detail.command!==void 0&&null!==e.detail.command){document.execCommand(e.detail.command)}else{this.dispatchEvent(new CustomEvent("rich-text-event",{detail:{button:e.detail,selection:this.selection}}))}this._updateToggleButtons()}_toggledButton(button=null,trigger){let sel=window.getSelection(),state=null!==button.command&&!0===button.toggles?document.queryCommandState(button.command):!1;return state}_toggleMore(e){this.collapsed=!this.collapsed}_updateToggleButtons(){this.__trigger=!1===this.__trigger}_uuidPart(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}}window.customElements.define(RichTextEditor.tag,RichTextEditor);export{RichTextEditor};