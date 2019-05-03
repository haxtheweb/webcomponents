define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js","./node_modules/@lrnwebcomponents/responsive-utility/responsive-utility.js","./lib/rich-text-editor-button.js","./lib/rich-text-editor-more-button.js","./lib/rich-text-editor-heading-picker.js","./lib/rich-text-editor-symbol-picker.js","./lib/rich-text-editor-link.js","./lib/rich-text-editor-styles.js","./node_modules/@polymer/iron-icons/iron-icons.js","./node_modules/@polymer/iron-icons/editor-icons.js","./node_modules/@polymer/iron-icons/image-icons.js","./node_modules/@lrnwebcomponents/md-extra-icons/md-extra-icons.js"],function(_exports,_polymerElement,_HAXWiring,_responsiveUtility,_richTextEditorButton,_richTextEditorMoreButton,_richTextEditorHeadingPicker,_richTextEditorSymbolPicker,_richTextEditorLink,_richTextEditorStyles,_ironIcons,_editorIcons,_imageIcons,_mdExtraIcons){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.RichTextEditor=void 0;function _templateObject_93ae02406a8511e9b5770747fdec325a(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n  width: 100%;\n  margin: 0;\n  padding: 0;\n  z-index: 9999;\n  @apply --rich-text-editor;\n}\n:host([sticky]) {\n  position: sticky;\n  top: 0;\n}\n:host #toolbar {\n  display: flex;\n  opacity: 1;\n  margin: 0;\n  align-items: stretch;\n  flex-wrap: wrap;\n  justify-content: flex-start;\n  background-color: var(--rich-text-editor-bg);\n  border: var(--rich-text-editor-border);\n  font-size: 12px;\n  transition: all 0.5s;\n  @apply --rich-text-editor-toolbar;\n} \n:host #toolbar[aria-hidden]{\n  visibility: hidden;\n  opacity: 0;\n  height: 0;\n}\n:host #toolbar .group {\n  display: flex;\n  flex-wrap: nowrap;\n  justify-content: space-evenly;\n  align-items: stretch;\n  padding: 0 3px;\n  @apply --rich-text-editor-toolbar-group;\n}\n:host #toolbar .group:not(:last-of-type) {\n  margin-right: 3px;\n  border-right: var(--rich-text-editor-border);\n  @apply --rich-text-editor-toolbar-divider;\n}\n:host #toolbar .button {\n  display: flex;\n  flex: 0 0 auto;\n  align-items: stretch;\n  margin: 3px;\n}\n:host #toolbar #morebutton {\n  flex: 1 0 auto;\n  justify-content: flex-end;\n}\n\n:host([responsive-size=\"xs\"]) #morebutton[collapse-max=\"xs\"],\n:host([responsive-size=\"sm\"]) #morebutton[collapse-max*=\"s\"],\n:host([responsive-size=\"md\"]) #morebutton:not([collapse-max*=\"l\"]),\n:host([responsive-size=\"lg\"]) #morebutton:not([collapse-max=\"xl\"]),\n:host([responsive-size=\"xl\"]) #morebutton,\n\n:host([responsive-size=\"xs\"]) #toolbar[collapsed] *[collapsed-until*=\"m\"],\n:host([responsive-size=\"xs\"]) #toolbar[collapsed] *[collapsed-until*=\"l\"],\n:host([responsive-size=\"sm\"]) #toolbar[collapsed] *[collapsed-until=\"md\"],\n:host([responsive-size=\"sm\"]) #toolbar[collapsed] *[collapsed-until*=\"l\"],\n:host([responsive-size=\"md\"]) #toolbar[collapsed] *[collapsed-until*=\"l\"],\n:host([responsive-size=\"lg\"]) #toolbar[collapsed] *[collapsed-until=\"xl\"] {\n  display: none;\n}</style>\n<style include=\"rich-text-editor-styles\"></style>\n<div id=\"toolbar\" aria-hidden$=\"[[!controls]]\" collapsed$=\"[[collapsed]]\">\n  <rich-text-editor-more-button\n    id=\"morebutton\"\n    class=\"button\"\n    controls=\"toolbar\"\n    icon=\"more-vert\"\n    label=\"More buttons\"\n    label-toggled=\"Fewer buttons\"\n    toggled$=\"[[!collapsed]]\"\n    on-tap=\"_toggleMore\">\n  </rich-text-editor-more-button>  \n</div>"]);_templateObject_93ae02406a8511e9b5770747fdec325a=function _templateObject_93ae02406a8511e9b5770747fdec325a(){return data};return data}/**
 * `rich-text-editor`
 * `a standalone rich text editor`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html demo
 * @demo demo/content.html easy implementation
 * @demo demo/config.html custom configuration
 */var RichTextEditor=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(RichTextEditor,_PolymerElement);function RichTextEditor(){babelHelpers.classCallCheck(this,RichTextEditor);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(RichTextEditor).apply(this,arguments))}babelHelpers.createClass(RichTextEditor,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(RichTextEditor.prototype),"connectedCallback",this).call(this);var root=this;window.ResponsiveUtility.requestAvailability();window.dispatchEvent(new CustomEvent("responsive-element",{detail:{element:root,attribute:"responsive-size",relativeToParent:!0}}));document.designMode="on";document.addEventListener("selectionchange",function(e){root.getUpdatedSelection()})}/**
   * life cycle, element is disconnected
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(RichTextEditor.prototype),"disconnectedCallback",this).call(this);var root=this;document.removeEventListener("selectionchange",function(e){root.getUpdatedSelection()})}/**
   * cancels edits to the active editableElement
   */},{key:"cancel",value:function cancel(){this.editableElement.innerHTML=this.canceled;this.editTarget(null)}/**
   * makes a editableElement editable
   *
   * @param {object} an HTML object that can be edited
   */},{key:"editTarget",value:function editTarget(editableElement){var root=this;if(editableElement.getAttribute("id")===void 0||null===editableElement.getAttribute("id"))editableElement.setAttribute("id",root._generateUUID());if(root.editableElement!==editableElement){//save changes to previous editableElement
if(null!==root.editableElement){root.editableElement.contentEditable=!1;root.editableElement=null}//activate the editableElement
editableElement.parentNode.insertBefore(root,editableElement);root.editableElement=editableElement;root.canceled=editableElement.innerHTML;root.editableElement.contentEditable=!0;root.controls=editableElement.getAttribute("id")}}/**
   * Gets the updated selection.
   */},{key:"getUpdatedSelection",value:function getUpdatedSelection(){console.log("selectionchange");var root=this;root.selection=root.editableElement===void 0||null===root.editableElement?null:root.editableElement.getSelection?root.editableElement.getSelection():root._getRange();this.buttons.forEach(function(button){button.selection=null;button.selection=root.selection})}/**
   * removes an editable region to the list of editableElements
   *
   * @param {object} an HTML object that can be edited
   */},{key:"removeEditableRegion",value:function removeEditableRegion(editableElement){for(var root=this,i=0,item;i<this.editableElements.length;i++){item=this.editableElements[i];if(item[0]===editableElement){item[0].removeEventListener("click",function(e){root.editTarget(editableElement)});editableElement.removeEventListener("blur",function(e){root.getUpdatedSelection()});editableElement.removeEventListener("mouseout",function(e){root.getUpdatedSelection()});item[1].disconnect();this.set("editableElements",this.editableElements.splice(i,1))}}}/**
   * adds an editable region to the list of editableElements
   *
   * @param {object} an HTML object that can be edited
   */},{key:"addEditableRegion",value:function addEditableRegion(editableElement){var root=this,observer=new MutationObserver(function(e){root.getUpdatedSelection()});editableElement.addEventListener("click",function(e){root.editTarget(editableElement)});editableElement.addEventListener("blur",function(e){root.getUpdatedSelection()});editableElement.addEventListener("mouseout",function(e){root.getUpdatedSelection()});observer.observe(editableElement,{attributes:!1,childList:!0,subtree:!0,characterData:!1});root.push("editableElements",[editableElement,observer])}/**
   * Adds a button to the toolbar
   *
   * @param {object} the child object in the config object
   * @param {object} the parent object in the config object
   */},{key:"_addButton",value:function _addButton(child,parent){var root=this,button=document.createElement(child.type);for(var key in child){button[key]=child[key]}button.setAttribute("class","button");/*button.addEventListener("mousedown", (e) => {
      e.preventDefault();
      root._preserveSelection(button);
    });
    button.addEventListener("keydown", (e) => {
      e.preventDefault();
      root._preserveSelection(button);
    });*/button.addEventListener("deselect",function(e){console.log("deselect");root._getRange().collapse(!1)});parent.appendChild(button);return button}/**
   * Generate a UUID
   */},{key:"_generateUUID",value:function _generateUUID(){return"ss-s-s-s-sss".replace(/s/g,this._uuidPart)}/**
   * Gets the groups array for the dom-repeat.
   *
   * @param {object} the toolbar buttons config object
   * @param {array} an array the buttons grouped by size
   */},{key:"_getButtons",value:function _getButtons(config){var root=this,toolbar=root.$.toolbar,more=this.$.morebutton,max=0,sizes=["xs","sm","md","lg","xl"],temp=[];toolbar.innerHTML="";config.forEach(function(item){if("button-group"===item.type){var group=document.createElement("div");group.setAttribute("class","group");if(item.collapsedUntil!==void 0&&null!==item.collapsedUntil)group.setAttribute("collapsed-until",item.collapsedUntil);max=Math.max(max,sizes.indexOf(item.collapsedUntil));item.buttons.forEach(function(button){max=Math.max(max,sizes.indexOf(button.collapsedUntil));temp.push(root._addButton(button,group))});toolbar.appendChild(group)}else{max=Math.max(max,sizes.indexOf(item.collapsedUntil));temp.push(root._addButton(item,toolbar))}toolbar.appendChild(more);more.collapseMax=sizes[max]});return temp}/**
   * Normalizes selection data.
   *
   * @returns {object} the selection
   */},{key:"_getRange",value:function _getRange(){var sel=window.getSelection();if(sel.getRangeAt&&sel.rangeCount){return sel.getRangeAt(0)}else if(sel){return sel}else!1}/**
   * Preserves the selection when a button is pressed
   *
   * @param {object} the button
   */},{key:"_preserveSelection",value:function _preserveSelection(){var sel=window.getSelection(),temp=this.selection;this.buttons.forEach(function(button){button.selection=temp});sel.removeAllRanges();sel.addRange(temp)}/**
   * Toggles collapsed mode
   */},{key:"_toggleMore",value:function _toggleMore(e){this.collapsed=!this.collapsed}/**
   * Generate UUID
   */},{key:"_uuidPart",value:function _uuidPart(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_93ae02406a8511e9b5770747fdec325a())}// haxProperty definition
},{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Rich text-editor",description:"a standalone rich text editor",icon:"icons:android",color:"green",groups:["Text"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"nikkimk",owner:"Penn State University"}},settings:{quick:[],configure:[{property:"title",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"}],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{/**
   * The editor buttons.
   */buttons:{name:"buttons",type:"Array",computed:"_getButtons(config)"},/**
   * The editable content, if edits are canceled.
   */canceled:{name:"canceled",type:"Object",value:!0},/**
   * Is the menu collapsed.
   */collapsed:{name:"collapsed",type:"Boolean",value:!0},/**
   * The button config on the toolbar.
   */config:{name:"config",type:"Object",value:[{label:"History",type:"button-group",buttons:[{command:"undo",icon:"undo",label:"Undo",type:"rich-text-editor-button"},{command:"redo",icon:"redo",label:"Redo",type:"rich-text-editor-button"}]},{label:"Basic Inline Operations",type:"button-group",buttons:[{label:"Heading",type:"rich-text-editor-heading-picker"},{command:"bold",icon:"editor:format-bold",label:"Bold",toggles:!0,type:"rich-text-editor-button"},{command:"italic",icon:"editor:format-italic",label:"Italics",toggles:!0,type:"rich-text-editor-button"},{command:"removeFormat",icon:"editor:format-clear",label:"Erase Format",type:"rich-text-editor-button"}]},{label:"Links",type:"button-group",buttons:[{command:"link",icon:"link",label:"Link",prompt:"href",toggledCommand:"unlink",toggledIcon:"mdextra:unlink",toggledLabel:"Unink",toggles:!0,type:"rich-text-editor-link"}]},{label:"Clipboard Operations",type:"button-group",buttons:[{command:"cut",icon:"content-cut",label:"Cut",type:"rich-text-editor-button"},{command:"copy",icon:"content-copy",label:"Copy",type:"rich-text-editor-button"},{command:"paste",icon:"content-paste",label:"Paste",type:"rich-text-editor-button"}]},{collapsedUntil:"md",label:"Subscript and Superscript",type:"button-group",buttons:[{command:"subscript",icon:"mdextra:subscript",label:"Subscript",toggles:!0,type:"rich-text-editor-button"},{command:"superscript",icon:"mdextra:superscript",label:"Superscript",toggles:!0,type:"rich-text-editor-button"}]},{collapsedUntil:"sm",icon:"editor:functions",label:"Insert Symbol",symbolTypes:["symbols"],type:"rich-text-editor-symbol-picker"},{collapsedUntil:"sm",label:"Lists and Indents",type:"button-group",buttons:[{command:"insertOrderedList",icon:"editor:format-list-numbered",label:"Ordered List",toggles:!0,type:"rich-text-editor-button"},{command:"insertUnorderedList",icon:"editor:format-list-bulleted",label:"Unordered List",toggles:!0,type:"rich-text-editor-button"},{collapsedUntil:"lg",command:"formatBlock",commandVal:"blockquote",label:"Blockquote",icon:"editor:format-quote",type:"rich-text-editor-button"},{label:"Increase Indent",icon:"editor:format-indent-increase",event:"text-indent",command:"indent",type:"rich-text-editor-button"},{label:"Decrease Indent",icon:"editor:format-indent-decrease",event:"text-outdent",command:"outdent",type:"rich-text-editor-button"}]}]},/**
   * The target element's id attribute.
   */controls:{name:"controls",type:"String",value:null},/**
   * The editableElement element for the editor.
   */editableElements:{name:"editableElements",type:"Array",value:[]},/**
   * The editableElement element for the editor.
   */editableElement:{name:"editableElement",type:"Object",value:null},/**
   * The the size of the editor.
   */responsiveSize:{name:"responsiveSize",type:"String",value:"xs",reflectToAttribute:!0},/**
   * The current text selection.
   */savedSelection:{name:"savedSelection",type:"Object",value:null},/**
   * The current text selection.
   */selection:{name:"selection",type:"Object",value:null},/**
   * Should the toolbar stick to the top so that it is always visible.
   */sticky:{name:"sticky",type:"Boolean",value:!1,reflectToAttribute:!0}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"rich-text-editor"}}]);return RichTextEditor}(_polymerElement.PolymerElement);_exports.RichTextEditor=RichTextEditor;window.customElements.define(RichTextEditor.tag,RichTextEditor)});