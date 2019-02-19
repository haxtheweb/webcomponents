import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import{ResponsiveUtility}from"./node_modules/@lrnwebcomponents/responsive-utility/responsive-utility.js";import"./lib/rich-text-editor-button.js";import"./lib/rich-text-editor-more-button.js";import"./lib/rich-text-editor-block-picker.js";import"./node_modules/@polymer/iron-icons/iron-icons.js";import"./node_modules/@polymer/iron-icons/editor-icons.js";import"./node_modules/@polymer/iron-icons/image-icons.js";import"./node_modules/@lrnwebcomponents/md-extra-icons/md-extra-icons.js";class RichTextEditor extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  --rich-text-editor-bg: #fafafa;
  --rich-text-editor-button-color: #444;
  --rich-text-editor-border: 1px solid #ddd;
  --rich-text-editor-button-border: transparent;
  --rich-text-editor-button-disabled-color: #666;
  --rich-text-editor-button-disabled-bg: transparent;
  --rich-text-editor-button-toggled-color: #222;
  --rich-text-editor-button-toggled-bg: #d8d8d8;
  --rich-text-editor-button-hover-color: #000;
  --rich-text-editor-button-hover-bg: #f0f0f0;
  @apply --rich-text-editor;
}
:host([sticky]) {
  position: sticky;
  top: 0;
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
:host #toolbar .button {
  display: flex;
  flex: 0 0 auto;
  align-items: stretch;
  margin: 3px;
}
:host #toolbar #morebutton {
  flex: 1 0 auto;
  justify-content: flex-end;
}

:host([responsive-size="xs"]) #morebutton[collapse-max="xs"],
:host([responsive-size="sm"]) #morebutton[collapse-max*="s"],
:host([responsive-size="md"]) #morebutton:not([collapse-max*="l"]),
:host([responsive-size="lg"]) #morebutton:not([collapse-max="xl"]),
:host([responsive-size="xl"]) #morebutton,

:host([responsive-size="xs"]) #toolbar[collapsed] *[collapsed-until*="m"],
:host([responsive-size="xs"]) #toolbar[collapsed] *[collapsed-until*="l"],
:host([responsive-size="sm"]) #toolbar[collapsed] *[collapsed-until="md"],
:host([responsive-size="sm"]) #toolbar[collapsed] *[collapsed-until*="l"],
:host([responsive-size="md"]) #toolbar[collapsed] *[collapsed-until*="l"],
:host([responsive-size="lg"]) #toolbar[collapsed] *[collapsed-until="xl"] {
  display: none;
}</style>
<div id="toolbar" aria-hidden$="[[!controls]]" collapsed$="[[collapsed]]">
  <rich-text-editor-more-button
    id="morebutton"
    class="button"
    controls="toolbar"
    icon="more-vert"
    label="More buttons"
    label-toggled="Fewer buttons"
    toggled$="[[!collapsed]]"
    on-tap="_toggleMore">
  </rich-text-editor-more-button>  
</div>`}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Rich text-editor",description:"a standalone rich text editor",icon:"icons:android",color:"green",groups:["Text"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"nikkimk",owner:"Penn State University"}},settings:{quick:[],configure:[{property:"title",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"}],advanced:[]}}}static get properties(){return{buttons:{name:"buttons",type:"Array",computed:"_getButtons(config)"},canceled:{name:"canceled",type:"Object",value:!0},collapsed:{name:"collapsed",type:"Boolean",value:!0},config:{name:"config",type:"Object",value:[{label:"History",type:"button-group",buttons:[{command:"undo",icon:"undo",label:"Undo",type:"rich-text-editor-button"},{command:"redo",icon:"redo",label:"Redo",type:"rich-text-editor-button"}]},{label:"Basic Inline Operations",type:"button-group",buttons:[{label:"Heading",type:"rich-text-editor-block-picker",blocks:[{label:"<p>",tag:"p"},{label:"<h1>",tag:"h1"},{label:"<h2>",tag:"h2"},{label:"<h3>",tag:"h3"},{label:"<h4>",tag:"h4"},{label:"<h5>",tag:"h5"},{label:"<h6>",tag:"h6"}]},{command:"bold",icon:"editor:format-bold",label:"Bold",toggles:!0,type:"rich-text-editor-button"},{command:"italic",icon:"editor:format-italic",label:"Italics",toggles:!0,type:"rich-text-editor-button"},{command:"removeFormat",icon:"editor:format-clear",label:"Erase Format",type:"rich-text-editor-button"}]},{label:"Links",type:"button-group",buttons:[{command:"link",icon:"link",label:"Link",toggledCommand:"unlink",toggledIcon:"mdextra:unlink",toggledLabel:"Unink",toggles:!0,type:"rich-text-editor-button"}]},{label:"Clipboard Operations",type:"button-group",buttons:[{command:"cut",icon:"content-cut",label:"Cut",type:"rich-text-editor-button"},{command:"copy",icon:"content-copy",label:"Copy",type:"rich-text-editor-button"},{command:"paste",icon:"content-paste",label:"Paste",type:"rich-text-editor-button"}]},{collapsedUntil:"md",label:"Subscript and Superscript",type:"button-group",buttons:[{command:"subscript",icon:"mdextra:subscript",label:"Subscript",toggles:!0,type:"rich-text-editor-button"},{command:"superscript",icon:"mdextra:superscript",label:"Superscript",toggles:!0,type:"rich-text-editor-button"}]},{collapsedUntil:"sm",label:"Lists and Indents",type:"button-group",buttons:[{command:"insertOrderedList",icon:"editor:format-list-numbered",label:"Ordered List",toggles:!0,type:"rich-text-editor-button"},{command:"insertUnorderedList",icon:"editor:format-list-bulleted",label:"Unordered List",toggles:!0,type:"rich-text-editor-button"},{collapsedUntil:"lg",command:"formatBlock",commandVal:"blockquote",label:"Blockquote",icon:"editor:format-quote",type:"rich-text-editor-button"},{label:"Increase Indent",icon:"editor:format-indent-increase",event:"text-indent",command:"indent",type:"rich-text-editor-button"},{label:"Decrease Indent",icon:"editor:format-indent-decrease",event:"text-outdent",command:"outdent",type:"rich-text-editor-button"}]}]},controls:{name:"controls",type:"String",value:null},editableElements:{name:"editableElements",type:"Array",value:[]},editableElement:{name:"editableElement",type:"Object",value:null},responsiveSize:{name:"responsiveSize",type:"String",value:"xs",reflectToAttribute:!0},savedSelection:{name:"savedSelection",type:"Object",value:null},selection:{name:"selection",type:"Object",value:null},sticky:{name:"sticky",type:"Boolean",value:!1,reflectToAttribute:!0}}}static get tag(){return"rich-text-editor"}connectedCallback(){super.connectedCallback();let root=this;window.ResponsiveUtility.requestAvailability();window.dispatchEvent(new CustomEvent("responsive-element",{detail:{element:root,attribute:"responsive-size",relativeToParent:!0}}));document.designMode="on";document.addEventListener("selectionchange",function(e){root.getUpdatedSelection()})}disconnectedCallback(){super.disconnectedCallback();let root=this;document.removeEventListener("selectionchange",function(e){root.getUpdatedSelection()})}cancel(){this.editableElement.innerHTML=this.canceled;this.editTarget(null)}editTarget(editableElement){let root=this;if(editableElement.getAttribute("id")===void 0||null===editableElement.getAttribute("id"))editableElement.setAttribute("id",root._generateUUID());if(root.editableElement!==editableElement){if(null!==root.editableElement){root.editableElement.contentEditable=!1;root.editableElement=null}editableElement.parentNode.insertBefore(root,editableElement);root.editableElement=editableElement;root.canceled=editableElement.innerHTML;root.editableElement.contentEditable=!0;root.controls=editableElement.getAttribute("id")}}getUpdatedSelection(){let root=this;root.selection=root.editableElement===void 0||null===root.editableElement?null:root.editableElement.getSelection?root.editableElement.getSelection():root._getRange();this.buttons.forEach(function(button){button.selection=null;button.selection=root.selection})}removeEditableRegion(editableElement){let root=this;for(let i=0,item;i<this.editableElements.length;i++){item=this.editableElements[i];if(item[0]===editableElement){item[0].removeEventListener("click",function(e){root.editTarget(editableElement)});editableElement.removeEventListener("blur",function(e){root.getUpdatedSelection()});editableElement.removeEventListener("mouseout",function(e){root.getUpdatedSelection()});item[1].disconnect();this.set("editableElements",this.editableElements.splice(i,1))}}}addEditableRegion(editableElement){let root=this,observer=new MutationObserver(function(e){root.getUpdatedSelection()});editableElement.addEventListener("click",function(e){root.editTarget(editableElement)});editableElement.addEventListener("blur",function(e){root.getUpdatedSelection()});editableElement.addEventListener("mouseout",function(e){root.getUpdatedSelection()});observer.observe(editableElement,{attributes:!1,childList:!0,subtree:!0,characterData:!1});console.log(this.editableElements,editableElement);root.push("editableElements",[editableElement,observer])}_addButton(child,parent){let root=this,button=document.createElement(child.type);for(var key in child){button[key]=child[key]}button.setAttribute("class","button");button.addEventListener("mousedown",function(e){e.preventDefault();root._preserveSelection(button)});button.addEventListener("keydown",function(e){e.preventDefault();root._preserveSelection(button)});button.addEventListener("deselect",function(e){root._getRange().collapse(!1)});parent.appendChild(button);return button}_generateUUID(){return"ss-s-s-s-sss".replace(/s/g,this._uuidPart)}_getButtons(config){let root=this,toolbar=root.$.toolbar,more=this.$.morebutton,max=0,sizes=["xs","sm","md","lg","xl"],temp=[];toolbar.innerHTML="";config.forEach(function(item){var _Mathmax=Math.max;if("button-group"===item.type){let group=document.createElement("div");group.setAttribute("class","group");if(item.collapsedUntil!==void 0&&null!==item.collapsedUntil)group.setAttribute("collapsed-until",item.collapsedUntil);max=_Mathmax(max,sizes.indexOf(item.collapsedUntil));item.buttons.forEach(function(button){max=_Mathmax(max,sizes.indexOf(button.collapsedUntil));temp.push(root._addButton(button,group))});toolbar.appendChild(group)}else{max=_Mathmax(max,sizes.indexOf(item.collapsedUntil));temp.push(root._addButton(item,toolbar))}toolbar.appendChild(more);more.collapseMax=sizes[max]});return temp}_getRange(){let sel=window.getSelection();if(sel.getRangeAt&&sel.rangeCount){return sel.getRangeAt(0)}else if(sel){return sel}else!1}_preserveSelection(){let sel=window.getSelection(),temp=this.selection;this.buttons.forEach(function(button){button.selection=temp});sel.removeAllRanges();sel.addRange(temp)}_toggleMore(e){this.collapsed=!this.collapsed}_uuidPart(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}}export{RichTextEditor};window.customElements.define(RichTextEditor.tag,RichTextEditor);