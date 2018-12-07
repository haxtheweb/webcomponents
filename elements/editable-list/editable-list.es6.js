import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import"./node_modules/@lrnwebcomponents/simple-modal/simple-modal.js";import"./node_modules/@polymer/iron-list/iron-list.js";import"./lib/editable-list-item.js";class EditableList extends PolymerElement{static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}

iron-list {
  height: 100%;
}</style>
<iron-list id="list" items="[[items]]" as="item" mutable-data>
  <template>
    <editable-list-item edit-mode="[[item.metadata.canEdit]]" can-edit="[[item.metadata.canEdit]]" can-delete="[[item.metadata.canDelete]]" value="[[item.title]]"></editable-list-item>
  </template>
</iron-list>`}static get properties(){return{editMode:{name:"editMode",type:"Boolean",value:!1,notify:!0,observer:"_editModeChanged"},items:{name:"items",type:"Array",value:[],reflectToAttribute:!1,observer:"_itemsChanged"},activeElement:{name:"activeElement",type:"Object"}}}static get tag(){return"editable-list"}connectedCallback(){super.connectedCallback();const modal=window.simpleModal.requestAvailability();this.$.list.addEventListener("editable-list-item-delete",this.triggerDeleteModal.bind(this))}disconnectedCallback(){this.$.list.removeEventListener("editable-list-item-delete",this.triggerDeleteModal.bind(this))}triggerDeleteModal(e){this.activeElement=e.detail.element;let c=document.createElement("div");c.innerHTML=`<div>Are you sure you want to delete <strong>${e.detail.element.value}</strong>?</div>`;let button1=document.createElement("paper-button");button1.raised=!0;button1.addEventListener("click",this._deleteItemConfirm.bind(this));button1.appendChild(document.createTextNode("Delete"));let button2=document.createElement("paper-button");button2.raised=!0;button2.setAttribute("dialog-dismiss","dialog-dismiss");button2.appendChild(document.createTextNode("cancel"));let b=document.createElement("div");b.appendChild(button1);b.appendChild(button2);const evt=new CustomEvent("simple-modal-show",{bubbles:!0,cancelable:!0,detail:{title:`Delete ${e.detail.element.value}`,elements:{content:c,buttons:b},invokedBy:e.detail.element.$.delete,clone:!1}});this.dispatchEvent(evt)}_deleteItemConfirm(e){const evt=new CustomEvent("simple-modal-hide",{bubbles:!0,cancelable:!0,detail:{}});this.dispatchEvent(evt)}_editModeChanged(newValue,oldValue){if(typeof newValue!==typeof void 0){this._itemsChanged(this.items);for(var i in this.items){this.items[i].metadata.canEdit=newValue;this.notifyPath(`items.${i}.metadata.canEdit`)}}}_itemsChanged(newValue,oldValue){if(typeof newValue!==typeof void 0&&"string"===typeof newValue){this.set("items",JSON.parse(newValue))}}}window.customElements.define(EditableList.tag,EditableList);export{EditableList};