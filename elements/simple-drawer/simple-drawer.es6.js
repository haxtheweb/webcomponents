import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{dom}from"./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";import*as async from"./node_modules/@polymer/polymer/lib/utils/async.js";import"./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";import"./node_modules/@polymer/app-layout/app-drawer/app-drawer.js";import"./node_modules/@polymer/neon-animation/neon-animation.js";import"./node_modules/@polymer/paper-button/paper-button.js";import"./node_modules/@polymer/iron-icons/iron-icons.js";import"./node_modules/@polymer/iron-icon/iron-icon.js";window.simpleDrawer=window.simpleDrawer||{};window.simpleDrawer.requestAvailability=()=>{if(!window.simpleDrawer.instance){window.simpleDrawer.instance=document.createElement("simple-drawer");document.body.appendChild(window.simpleDrawer.instance)}return window.simpleDrawer.instance};class SimpleDrawer extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
  z-index: 1000;
}
:host([hidden]) {
  display: none;
}

app-drawer {
  --app-drawer-width: var(--simple-drawer-width, 256px);
  --app-drawer-content-container: {
    padding: 0;
    overflow-y: scroll;
    position: fixed;
    color: var(--simple-drawer-color, #222222);
    background-color: var(--simple-drawer-background-color, #FFFFFF);
  }
}
:host ::slotted(*) {
  font-size: 14px;
  @apply --simple-drawer-content;
}

.content {
  text-align: left;
  padding: 8px 24px;
  @apply --simple-drawer-content-container;
}

.top ::slotted(*) {
  font-size: 24px;
  margin: 0;
  padding: 0 15px;
  height: 40px;
  line-height: 48px;
}

#close {
  position: absolute;
  right: 8px;
  top: 8px;
  padding: 4px;
  margin: 0;
  text-transform: none;
  float: right;
  font-size: 12px;
  color: var(--simple-drawer-header-color, #ffffff);
  background-color: transparent;
  min-width: unset;
}

#close iron-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 2px;
}

.top {
  font-size: 24px;
  margin: 0 0 8px 0;
  padding: 0 16px;
  height: 40px;
  line-height: 48px;
  display: flex;
  text-align: left;
  justify-content: space-between;
  background-color: var(--simple-drawer-header-background, #20427b);
  color: var(--simple-drawer-header-color, #ffffff);
  @apply --simple-drawer-header;
}

.top h2 {
  flex: auto;
  color: var(--simple-drawer-header-color, #ffffff);
  font-size: 24px;
  padding: 0;
  line-height: 32px;
  margin: 8px;
  @apply --simple-drawer-heading;
}</style>
<style is="custom-style" include="simple-colors"></style>
<app-drawer tabindex="0" id="drawer" opened="{{opened}}" align="[[align]]" role="dialog">
  <div class="wrapper">
    <div class="top">
      <h2 hidden$="[[!title]]">[[title]]</h2>
      <slot name="header"></slot>
    </div>
    <div class="content">
      <slot name="content"></slot>
    </div>
    <paper-button id="close" on-tap="close">
      <iron-icon icon="[[closeIcon]]"></iron-icon> [[closeLabel]]
    </paper-button>
  </div>
</app-drawer>`}static get properties(){return{title:{name:"title",type:String,value:""},align:{name:"align",type:String,value:"left"},opened:{name:"opened",type:Boolean,value:!1,reflectToAttribute:!0,observer:"_openedChanged"},closeLabel:{name:"closeLabel",type:String,value:"Close"},closeIcon:{name:"closeIcon",type:String,value:"cancel"},invokedBy:{name:"invokedBy",type:Object}}}static get tag(){return"simple-drawer"}connectedCallback(){super.connectedCallback();window.addEventListener("simple-drawer-hide",this.close.bind(this));window.addEventListener("simple-drawer-show",this.showEvent.bind(this))}_resizeContent(e){async.microTask.run(()=>{window.dispatchEvent(new Event("resize"))})}showEvent(e){if(this.opened){while(null!==dom(this).firstChild){dom(this).removeChild(dom(this).firstChild)}setTimeout(()=>{this.show(e.detail.title,e.detail.elements,e.detail.invokedBy,e.detail.align,e.detail.clone)},100)}else{this.show(e.detail.title,e.detail.elements,e.detail.invokedBy,e.detail.align,e.detail.size,e.detail.clone)}}show(title,elements,invokedBy,align="left",size="256px",clone=!1){this.set("invokedBy",invokedBy);this.title=title;this.align=align;this.updateStyles({"--simple-drawer-width":size});let element,slots=["header","content"];for(var i in slots){if(elements[slots[i]]){if(clone){element=elements[slots[i]].cloneNode(!0)}else{element=elements[slots[i]]}element.setAttribute("slot",slots[i]);dom(this).appendChild(element)}}setTimeout(()=>{this.opened=!0;this._resizeContent()},100)}animationEnded(e){this.title="";while(null!==dom(this).firstChild){dom(this).removeChild(dom(this).firstChild)}if(this.invokedBy){async.microTask.run(()=>{setTimeout(()=>{this.invokedBy.focus()},500)})}}close(){this.$.drawer.close()}_openedChanged(newValue,oldValue){if(typeof newValue!==typeof void 0&&!newValue){this.animationEnded();const evt=new CustomEvent("simple-drawer-closed",{bubbles:!0,cancelable:!0,detail:{opened:!1,invokedBy:this.invokedBy}});this.dispatchEvent(evt)}else if(newValue){const evt=new CustomEvent("simple-drawer-opened",{bubbles:!0,cancelable:!0,detail:{opened:!0,invokedBy:this.invokedBy}});this.dispatchEvent(evt)}}disconnectedCallback(){super.disconnectedCallback();window.removeEventListener("simple-drawer-hide",this.close.bind(this));window.removeEventListener("simple-drawer-show",this.showEvent.bind(this))}}window.customElements.define(SimpleDrawer.tag,SimpleDrawer);export{SimpleDrawer};