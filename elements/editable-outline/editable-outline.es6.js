import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{getRange}from"./lib/shadows-safari.js";import"./node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js";import"./node_modules/@polymer/iron-icon/iron-icon.js";import"./node_modules/@polymer/iron-icons/iron-icons.js";import"./node_modules/@polymer/iron-icons/editor-icons.js";import"./node_modules/@lrnwebcomponents/json-outline-schema/json-outline-schema.js";class EditableOutline extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
  font-family: 'Noto Serif', serif;
}

:host([hidden]) {
  display: none;
}

ul, ol {
  font-size: 16px;
  line-height: 32px;
  padding-left: 32px;
}
li {
  font-size: 16px;
  line-height: 32px;
  padding: 4px;
}

li:focus,
li:active,
li:hover {
  background-color: #EEEEEE;
  outline: 1px solid #CCCCCC;
}

iron-icon {
  pointer-events: none;
}</style>
<button on-click="buttonEvents" id="down">
  <iron-icon icon="icons:arrow-downward"></iron-icon> Move down
</button>
<button on-click="buttonEvents" id="up">
  <iron-icon icon="icons:arrow-upward"></iron-icon> Move up
</button>
<button on-click="buttonEvents" id="outdent">
  <iron-icon icon="editor:format-indent-decrease"></iron-icon> Outdent
</button>
<button on-click="buttonEvents" id="indent">
  <iron-icon icon="editor:format-indent-increase"></iron-icon> Indent
</button>
<button on-click="buttonEvents" id="duplicate">
  <iron-icon icon="icons:content-copy"></iron-icon> Duplicate structure
</button>

<ul id="outline" contenteditable$="[[editMode]]">
  <li contenteditable="true"></li>
</ul>

<iron-a11y-keys target="[[__outlineNode]]" keys="shift+tab" on-keys-pressed="_tabBackKeyPressed"
  stop-keyboard-event-propagation></iron-a11y-keys>
<iron-a11y-keys target="[[__outlineNode]]" keys="tab" on-keys-pressed="_tabKeyPressed"
  stop-keyboard-event-propagation></iron-a11y-keys>`}static get properties(){return{items:{name:"items",type:"Array",value:[],notify:!0},editMode:{name:"editMode",type:"Boolean",notify:!0,observer:"_editModeChanged"},__outlineNode:{name:"__outlineNode",type:"Object"}}}constructor(){super();this.polyfillSafe=this.__computePolyfillSafe();window.JSONOutlineSchema.requestAvailability()}static get tag(){return"editable-outline"}connectedCallback(){super.connectedCallback();this.__outlineNode=this.$.outline;this._observer=new MutationObserver(this._observer.bind(this));this._observer.observe(this.__outlineNode,{childList:!0,subtree:!0})}_observer(record){let reference;for(var index in record){let info=record[index];if(0<info.removedNodes.length&&this.__outdent){for(let i in info.removedNodes){if(info.removedNodes[i].tagName&&"LI"===info.removedNodes[i].tagName&&null!==info.removedNodes[i].getAttribute("data-jos-id")){reference.setAttribute("data-jos-id",info.removedNodes[i].getAttribute("data-jos-id"));if(null!==info.removedNodes[i].getAttribute("data-jos-location")){reference.setAttribute("data-jos-location",info.removedNodes[i].getAttribute("data-jos-location"))}reference=null}else if("UL"===info.removedNodes[i].tagName&&info.removedNodes[i].firstChild&&"LI"===info.removedNodes[i].firstChild.tagName&&null!==info.removedNodes[i].firstChild.getAttribute("data-jos-id")){reference.setAttribute("data-jos-id",info.removedNodes[i].firstChild.getAttribute("data-jos-id"));if(null!==info.removedNodes[i].firstChild.getAttribute("data-jos-location")){reference.setAttribute("data-jos-location",info.removedNodes[i].firstChild.getAttribute("data-jos-location"))}reference=null}}if(!this.$.outline.firstChild){this.$.outline.appendChild(document.createElement("li"))}}if(0<info.addedNodes.length){if(this.__outdent){for(let i in info.addedNodes){if(info.addedNodes[i].tagName&&"LI"===info.addedNodes[i].tagName){reference=info.addedNodes[i]}}}else if(!this.__blockScrub){for(let i in info.addedNodes){if(info.addedNodes[i].tagName){window.JSONOutlineSchema.requestAvailability().scrubElementJOSData(info.addedNodes[i])}}}}}setTimeout(()=>{this.__blockScrub=!1;this.__outdent=!1;this.__indent=!1},100)}disconnectedCallback(){super.disconnectedCallback()}_editModeChanged(newValue,oldValue){if(typeof newValue!==typeof void 0){}}buttonEvents(e){switch(e.target.id){case"indent":this._indent();break;case"outdent":this._outdent();break;case"up":this._move("up");break;case"down":this._move("down");break;case"duplicate":this._duplicate();break;}}_duplicate(){try{let range=this.getDeepRange();if(typeof range.commonAncestorContainer===typeof void 0){return}let activeItem=range.commonAncestorContainer;if(null===activeItem||typeof activeItem===typeof void 0||typeof activeItem.tagName===typeof void 0){activeItem=activeItem.parentNode}if(activeItem){if(null!==activeItem.nextElementSibling&&"UL"===activeItem.nextElementSibling.tagName){const clone2=activeItem.nextElementSibling.cloneNode(!0);activeItem.parentNode.insertBefore(clone2,activeItem.nextElementSibling.nextElementSibling);const clone=activeItem.cloneNode(!0);activeItem.parentNode.insertBefore(clone,activeItem.nextElementSibling.nextElementSibling)}else{const clone=activeItem.cloneNode(!0);activeItem.parentNode.insertBefore(clone,activeItem.nextElementSibling)}}}catch(e){console.log(e)}}_move(direction){try{let range=this.getDeepRange();if(typeof range.commonAncestorContainer===typeof void 0){return}let activeItem=range.commonAncestorContainer;if(null===activeItem||typeof activeItem===typeof void 0||typeof activeItem.tagName===typeof void 0){activeItem=activeItem.parentNode}let test=activeItem,valid=!1;while(!valid&&test.parentNode){if("outline"===test.id){valid=!0}test=test.parentNode}if(valid&&activeItem){if("up"===direction){if(null!==activeItem.previousElementSibling){if(activeItem.nextElementSibling&&"UL"===activeItem.nextElementSibling.tagName){if("UL"===activeItem.previousElementSibling.tagName){this.__blockScrub=!0;activeItem.parentNode.insertBefore(activeItem.previousElementSibling,activeItem.nextElementSibling.nextElementSibling)}this.__blockScrub=!0;activeItem.parentNode.insertBefore(activeItem.previousElementSibling,activeItem.nextElementSibling.nextElementSibling);activeItem.focus()}else{if("UL"===activeItem.previousElementSibling.tagName){this.__blockScrub=!0;activeItem.parentNode.insertBefore(activeItem.previousElementSibling,activeItem.nextElementSibling)}this.__blockScrub=!0;activeItem.parentNode.insertBefore(activeItem.previousElementSibling,activeItem.nextElementSibling);activeItem.focus()}}}else if("down"===direction){if(null!==activeItem.nextElementSibling){if(activeItem.nextElementSibling&&"UL"===activeItem.nextElementSibling.tagName&&null!==activeItem.nextElementSibling.nextElementSibling){if("LI"===activeItem.nextElementSibling.nextElementSibling.tagName&&null!==activeItem.nextElementSibling.nextElementSibling.nextElementSibling&&"UL"===activeItem.nextElementSibling.nextElementSibling.nextElementSibling.tagName){this.__blockScrub=!0;activeItem.parentNode.insertBefore(activeItem.nextElementSibling.nextElementSibling,activeItem)}this.__blockScrub=!0;activeItem.parentNode.insertBefore(activeItem.nextElementSibling.nextElementSibling,activeItem);activeItem.focus()}else if("LI"===activeItem.nextElementSibling.tagName){if(null!==activeItem.nextElementSibling.nextElementSibling&&"UL"===activeItem.nextElementSibling.nextElementSibling.tagName){this.__blockScrub=!0;activeItem.parentNode.insertBefore(activeItem.nextElementSibling,activeItem)}this.__blockScrub=!0;activeItem.parentNode.insertBefore(activeItem.nextElementSibling,activeItem);activeItem.focus()}}}}}catch(e){console.log(e)}}importJsonOutlineSchemaItems(){this.__blockScrub=!0;while(null!==this.$.outline.firstChild){this.$.outline.removeChild(this.$.outline.firstChild)}if(0===this.items.length){this.set("items",window.JSONOutlineSchema.requestAvailability().items)}let outline=window.JSONOutlineSchema.requestAvailability().itemsToNodes(this.items);while(null!==outline.firstChild){this.__blockScrub=!0;this.$.outline.appendChild(outline.firstChild)}return outline}exportJsonOutlineSchemaItems(save=!1){return window.JSONOutlineSchema.requestAvailability().nodesToItems(this.$.outline,save)}_tabKeyPressed(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();if(e.detail.keyboardEvent){e.detail.keyboardEvent.preventDefault();e.detail.keyboardEvent.stopPropagation();e.detail.keyboardEvent.stopImmediatePropagation()}try{this._indent()}catch(e){}}_indent(){if(this.polyfillSafe){this.__indent=!0;this.__blockScrub=!0;document.execCommand("indent")}}_tabBackKeyPressed(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();if(e.detail.keyboardEvent){e.detail.keyboardEvent.preventDefault();e.detail.keyboardEvent.stopPropagation();e.detail.keyboardEvent.stopImmediatePropagation()}try{this._outdent()}catch(e){}}_outdent(){if(this.polyfillSafe){this.__outdent=!0;this.__blockScrub=!0;document.execCommand("outdent")}}getDeepSelection(){if(this.shadowRoot.getSelection){return this.shadowRoot.getSelection()}else if(getRange(this.$.outline.parentNode)){return getRange(this.$.outline.parentNode)}return window.getSelection()}getDeepRange(){let sel=this.getDeepSelection();if(sel.getRangeAt&&sel.rangeCount){return sel.getRangeAt(0)}else if(sel){return sel}else!1}__computePolyfillSafe(){if(document.head.createShadowRoot||document.head.attachShadow){return!0}else{console.log("Shadow DOM missing, certain operations hidden");return!1}}}window.customElements.define(EditableOutline.tag,EditableOutline);export{EditableOutline};