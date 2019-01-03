import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{dom}from"./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";import*as async from"./node_modules/@polymer/polymer/lib/utils/async.js";import"./node_modules/@polymer/paper-dialog/paper-dialog.js";import"./node_modules/@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";import"./node_modules/@polymer/paper-button/paper-button.js";import"./node_modules/@polymer/iron-icons/iron-icons.js";import"./node_modules/@polymer/iron-icon/iron-icon.js";import"./node_modules/@polymer/neon-animation/animations/scale-up-animation.js";import"./node_modules/@polymer/neon-animation/animations/fade-out-animation.js";window.SimpleModal=window.SimpleModal||{};window.SimpleModal.requestAvailability=()=>{if(!window.SimpleModal.instance){window.SimpleModal.instance=document.createElement("simple-modal");document.body.appendChild(window.SimpleModal.instance)}return window.SimpleModal.instance};class SimpleModal extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}

:host ::slotted(*) {
  font-size: 14px;
  @apply --simple-modal-content;
}

:host #dialog {
  display: block;
  margin: auto;
  width: auto;
  height: auto;
  z-index: 1000;
  min-width: var(--simple-modal-width, 50vw);
  min-height: var(--simple-modal-height, 50vh);
  border-radius: 3px;
  @apply --simple-modal-dialog;
}

:host #titlebar {
  margin-top: 0;
  padding: 0px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--simple-modal-titlebar-color,#444);
  background-color: var(--simple-modal-titlebar-background,#ddd);
  border-radius: 3px 3px 0 0;
  @apply --simple-modal-top;
}

:host #headerbar {
  margin: 0;
  padding: 0 16px;
  color: var(--simple-modal-header-color, #222);
  background-color: var(--simple-modal-header-background, #ccc);
  @apply --simple-modal-headerbar;
}

:host h2 {
  margin-right: 8px;
  padding: 0;
  flex: auto;
  font-size: 18px;
  line-height: 18px;
  @apply --simple-modal-title;
}

:host #close {
  top: 0;
  padding: 10px 0;
  min-width: unset;
  text-transform: none;
  color: var(--simple-modal-titlebar-color,#444);
  background-color: transparent;
  @apply --simple-modal-close;
}

:host #close iron-icon {
  width: 16px;
  height: 16px;
  color: var(--simple-modal-titlebar-color,#444);
  @apply --simple-modal-close-icon;
}

#simple-modal-content {
  padding: 8px 16px;
  margin: 0;
  color: var(--simple-modal-content-container-color, #222);
  background-color: var(--simple-modal-content-container-background, #fff);
  --paper-dialog-scrollable: {
    padding: 0;
  }
  @apply --simple-modal-content-container;
}
.buttons {
  padding: 0;
  margin: 0;
  color: var(--simple-modal-buttons-color, unset);
  background-color: var(--simple-modal-buttons-background,unset);
  @apply --simple-modal-buttons;
}
.buttons ::slotted(*) {
  padding: 0;
  margin: 0;
  color: var(--simple-modal-button-color,--simple-modal-buttons-color);
  background-color: var(--simple-modal-button-background,--simple-modal-buttons-background);
  @apply --simple-modal-button;
}</style>
<paper-dialog id="dialog" 
  always-on-top
  aria-describedby="simple-modal-content"
  aria-label$="[[_getAriaLabel(title)]]"
  aria-labelledby$="[[_getAriaLabelledby(title)]]"
  aria-modal="true"
  entry-animation="scale-up-animation" 
  exit-animation="fade-out-animation" 
  role="dialog"
  opened="{{opened}}" 
  with-backdrop>
  <div id="titlebar">
    <h2 id="simple-modal-title" hidden$="[[!title]]">[[title]]</h2>
    <div></div>
    <paper-button id="close" dialog-dismiss hidden$="[[!opened]]" label="[[closeLabel]]">
      <iron-icon aria-hidden="true" icon="[[closeIcon]]"></iron-icon>
    </paper-button>
  </div>
  <div id="headerbar"><slot name="header"></slot></div>
  <paper-dialog-scrollable id="simple-modal-content">
    <slot name="content"></slot>
  </paper-dialog-scrollable>
  <div class="buttons">
    <slot name="buttons"></slot>
  </div>
</paper-dialog>`}static get properties(){return{title:{name:"title",type:String,value:""},opened:{name:"opened",type:Boolean,value:!1,reflectToAttribute:!0,observer:"_openedChanged"},closeLabel:{name:"closeLabel",type:String,value:"Close"},closeIcon:{name:"closeIcon",type:String,value:"close"},invokedBy:{name:"invokedBy",type:Object}}}static get tag(){return"simple-modal"}connectedCallback(){super.connectedCallback();window.addEventListener("simple-modal-hide",this.close.bind(this));window.addEventListener("simple-modal-show",this.showEvent.bind(this));this.shadowRoot.querySelector("#simple-modal-content").addEventListener("neon-animation-finish",this._ironOverlayClosed.bind(this))}_resizeContent(e){async.microTask.run(()=>{window.dispatchEvent(new Event("resize"))})}showEvent(e){if(this.opened){while(null!==dom(this).firstChild){dom(this).removeChild(dom(this).firstChild)}setTimeout(()=>{this.show(e.detail.title,e.detail.elements,e.detail.invokedBy,e.detail.clone)},100)}else{this.show(e.detail.title,e.detail.elements,e.detail.invokedBy,e.detail.clone)}}show(title,elements,invokedBy,clone=!1){this.set("invokedBy",invokedBy);this.title=title;let element,slots=["header","content","buttons"];for(var i in slots){if(elements[slots[i]]){if(clone){element=elements[slots[i]].cloneNode(!0)}else{element=elements[slots[i]]}element.setAttribute("slot",slots[i]);dom(this).appendChild(element)}}setTimeout(()=>{this.opened=!0;this._resizeContent()},100)}animationEnded(e){this.title="";while(null!==dom(this).firstChild){dom(this).removeChild(dom(this).firstChild)}if(this.invokedBy){async.microTask.run(()=>{setTimeout(()=>{this.invokedBy.focus()},500)})}}close(){this.$.dialog.close()}_openedChanged(newValue,oldValue){if(typeof newValue!==typeof void 0&&!newValue){this.animationEnded();const evt=new CustomEvent("simple-modal-closed",{bubbles:!0,cancelable:!0,detail:{opened:!1,invokedBy:this.invokedBy}});this.dispatchEvent(evt)}else if(newValue){const evt=new CustomEvent("simple-modal-opened",{bubbles:!0,cancelable:!0,detail:{opened:!0,invokedBy:this.invokedBy}});this.dispatchEvent(evt)}}_getAriaLabelledby(title){return!title?null:"simple-modal-title"}_getAriaLabel(title){return!title?"Modal Dialog":null}_ironOverlayClosed(e){console.log("i got here..");e.preventDefault();e.stopPropagation()}disconnectedCallback(){super.disconnectedCallback();window.removeEventListener("simple-modal-hide",this.close.bind(this));window.removeEventListener("simple-modal-show",this.showEvent.bind(this));this.shadowRoot.querySelector("#simple-modal-content").removeEventListener("neon-animation-finish",this._ironOverlayClosed.bind(this))}}window.customElements.define(SimpleModal.tag,SimpleModal);export{SimpleModal};