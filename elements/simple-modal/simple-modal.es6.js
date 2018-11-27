import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{dom}from"./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";import"./node_modules/@polymer/paper-dialog/paper-dialog.js";import"./node_modules/@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";import"./node_modules/@polymer/paper-button/paper-button.js";import"./node_modules/@polymer/iron-icons/iron-icons.js";import"./node_modules/@polymer/iron-icon/iron-icon.js";import"./node_modules/@polymer/neon-animation/animations/scale-up-animation.js";import"./node_modules/@polymer/neon-animation/animations/scale-down-animation.js";export{SimpleModal};class SimpleModal extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}

#close {
  float: right;
  top: 0;
  font-size: 12px;
  text-transform: none;
  right: 0;
  position: absolute;
  padding: 4px;
  margin: 0;
  color: var(--simple-modal-color, black);
  background-color: transparent;
  min-width: unset;
}

#close iron-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 2px;
}</style>
<paper-dialog id="dialog" entry-animation="scale-up-animation"
exit-animation="fade-out-animation" opened="{{opened}}" with-backdrop always-on-top>
  <h2 hidden$="[[!title]]">[[title]]</h2>
  <slot name="header"></slot>
  <paper-dialog-scrollable>
    <slot name="content"></slot>
  </paper-dialog-scrollable>
  <div class="buttons">
    <slot name="buttons"></slot>
  </div>
  <paper-button id="close" on-tap="close" hidden$="[[!opened]]"><iron-icon icon="[[closeIcon]]"></iron-icon> [[closeLabel]]</paper-button>
</paper-dialog>`}static get properties(){return{title:{name:"title",type:String,value:""},opened:{name:"opened",type:Boolean,value:!1,reflectToAttribute:!0,observer:"_openedChanged"},closeLabel:{name:"closeLabel",type:String,value:"Close"},closeIcon:{name:"closeIcon",type:String,value:"cancel"},invokedBy:{name:"invokedBy",type:Object}}}static get tag(){return"simple-modal"}connectedCallback(){super.connectedCallback();window.addEventListener("simple-modal-show",this.showEvent.bind(this))}showEvent(e){if(this.opened){while(null!==dom(this).firstChild){dom(this).removeChild(dom(this).firstChild)}setTimeout(()=>{this.show(e.detail.title,e.detail.elements,e.detail.invokedBy)},100)}else{this.show(e.detail.title,e.detail.elements,e.detail.invokedBy)}}show(title,elements,invokedBy){this.set("invokedBy",invokedBy);this.title=title;let slots=["header","content","buttons"];for(var i in slots){if(elements[slots[i]]){let element=elements[slots[i]].cloneNode(!0);element.setAttribute("slot",slots[i]);dom(this).appendChild(element)}}setTimeout(()=>{this.opened=!0},100)}animationEnded(e){if(!this.opened){if(this.invokedBy){setTimeout(()=>{this.invokedBy.focus();this.title="";while(null!==dom(this).firstChild){dom(this).removeChild(dom(this).firstChild)}},100)}}}close(){this.$.dialog.close()}_openedChanged(newValue,oldValue){if(typeof newValue!==typeof void 0&&!newValue){this.animationEnded()}}disconnectedCallback(){super.disconnectedCallback();window.removeEventListener("simple-modal-show",this.showEvent.bind(this))}}window.customElements.define(SimpleModal.tag,SimpleModal);window.simpleModal=window.simpleModal||{};window.simpleModal.requestAvailability=()=>{if(!window.simpleModal.instance){window.simpleModal.instance=document.createElement("simple-modal");document.body.appendChild(window.simpleModal.instance)}return window.simpleModal.instance};