/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{afterNextRender}from"./node_modules/@polymer/polymer/lib/utils/render-status.js";import*as async from"./node_modules/@polymer/polymer/lib/utils/async.js";import"./node_modules/@lrnwebcomponents/simple-modal/simple-modal.js";/**
 * `lrnsys-outline`
 * `Outline that items can be shuffled around in`
 *
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 *  -
 */class LrnsysOutline extends PolymerElement{constructor(){super();import("./node_modules/@polymer/paper-input/paper-input.js");import("./node_modules/@polymer/paper-icon-button/paper-icon-button.js");import("./node_modules/@polymer/paper-button/paper-button.js");import("./node_modules/@lrnwebcomponents/lrnsys-outline/lib/lrnsys-outline-item.js")}static get template(){return html`
      <style>
        :host {
          display: block;
        }
        :host kbd {
          display: inline-block;
          background: #333;
          color: white;
          border-radius: 4px;
          margin: 4px 4px 4px 0;
          padding: 8px;
          font-family: Verdana, Geneva, Tahoma, sans-serif;
          font-size: 85%;
        }
      </style>
      <div id="itemslist">
        <template is="dom-repeat" items="{{items}}" as="item">
          <lrnsys-outline-item
            disable-down="[[item.disableDown]]"
            disable-left="[[item.disableLeft]]"
            disable-right="[[item.disableRight]]"
            disable-up="[[item.disableUp]]"
            id$="[[item.id]]"
            index$="[[item.index]]"
            indent-level="{{item.indent}}"
            parent="{{item.parent}}"
            title="{{item.title}}"
          >
          </lrnsys-outline-item>
        </template>
      </div>
    `}static get tag(){return"lrnsys-outline"}static get properties(){return{data:{type:Array,value:null},items:{type:Array,value:null,notify:!0},activeItem:{type:Object,notify:!0}}}/**
   * Attached lifecycle
   */connectedCallback(){super.connectedCallback();window.SimpleModal.requestAvailability();// fix stack order
afterNextRender(this,function(){this.addEventListener("delete-item",this._handleRemoveItem.bind(this));this.addEventListener("indent-item",this._handleIndentItem.bind(this));this.addEventListener("add-item",this._handleAddItem.bind(this));this.addEventListener("move-item",this._handleMoveItem.bind(this));this.addEventListener("change-item",this._handleChangeItem.bind(this));this.addEventListener("focus-item",this._handleFocusItem.bind(this));this.addEventListener("blur-item",this._handleBlurItem.bind(this))})}disconnectedCallback(){this.removeEventListener("delete-item",this._handleRemoveItem.bind(this));this.removeEventListener("indent-item",this._handleIndentItem.bind(this));this.removeEventListener("add-item",this._handleAddItem.bind(this));this.removeEventListener("move-item",this._handleMoveItem.bind(this));this.removeEventListener("change-item",this._handleChangeItem.bind(this));this.removeEventListener("focus-item",this._handleFocusItem.bind(this));this.removeEventListener("blur-item",this._handleBlurItem.bind(this));super.disconnectedCallback()}ready(){super.ready();if(null===this.data||1>this.data.length){this.__tempid=this.__tempid===void 0?0:this.__tempid+1;this.data=[{id:"outline-item-"+this.__tempid,title:"",order:0,parent:null}]}this.setData(this.data)}/**
   * gets a nested array of items to convert & updates the dom-repeat
   */setData(data){if(data!==void 0&&0<data.length){let prevIndent=-1;for(var i in data){let indent=parseInt(this._getIndent(data,i));this.__tempid=this.__tempid===void 0?0:this.__tempid+1;data[i].index=parseInt(i);data[i].indent=indent;data[i].prevSibling=this._getSibling(parseInt(i),indent,!0);data[i].nextSibling=this._getSibling(parseInt(i),indent,!1);data[i].disableUp=null===data[i].prevSibling;data[i].disableDown=null===data[i].nextSibling;data[i].disableLeft=0===indent;data[i].disableRight=indent>prevIndent;data[i].id=data[i].id===void 0?"outline-item-"+this.__tempid:data[i].id;prevIndent=indent}}this.set("items",[]);this.set("items",data)}/**
   * gets a flat array of items to convert & updates it to a nested array
   */getData(){for(var i in this.items){this.items[i].order=this._getOrder(this.items[i]);this.notifyPath(`items.${i}.order`)}return this.items}/**
   * adds a new item
   */addItem(detail){let item=detail.item,title=detail.new,spliceIndex=this.items.findIndex(j=>j.id===item.id)+1;this.__tempid=this.__tempid+1;this.splice("items",spliceIndex,0,{id:"outline-item-"+this.__tempid,title:title,indent:item.indent,parent:item.parent});this.items[spliceIndex].indentLevel=item.indent;this.notifyPath(`items.${spliceIndex}.indentLevel`);this.setData(this.items);if(this.__focusedItem!==void 0&&null!==this.__focusedItem){async.microTask.run(()=>{setTimeout(()=>{this.__focusedItem=item.nextElementSibling;this.__focusedItem.focus()},50)})}}/**
   * removes an item
   */removeItem(item){let i=this.items.findIndex(j=>j.id===item.id),b=document.createElement("paper-button");b.raised=!0;b.addEventListener("click",this._deleteItemConfirm.bind(this));b.appendChild(document.createTextNode("Yes, delete"));const evt=new CustomEvent("simple-modal-show",{bubbles:!0,cancelable:!0,detail:{title:`Do you really want to delete ${this.items[i].title}?`,elements:{buttons:b},invokedBy:item.$.delete,clone:!1}});this.dispatchEvent(evt)}/**
   * Delete item confirmation
   */_deleteItemConfirm(e){let i=this.items.findIndex(j=>j.id===this.activeItem.id);this.activeItem.classList.add("collapse-to-remove");const evt=new CustomEvent("simple-modal-hide",{bubbles:!0,cancelable:!0,detail:{}});this.dispatchEvent(evt);setTimeout(()=>{this.__focusedItem=this.activeItem.previousElementSibling;for(var k in this.items){if(this.items[k].parent==this.items[i].id){this.items[k].parent=this.items[i].parent}}this.activeItem.classList.remove("collapse-to-remove");this.splice("items",i,1);if(this.__focusedItem!==void 0&&null!==this.__focusedItem){async.microTask.run(()=>{setTimeout(()=>{this.__focusedItem.focus()},50)})}},300)}/**
   * moves an grop of items down
   */moveItem(item,moveUp){let sourceStart=item.index,sourceEnd=this._getLastChild(item),sourceCount=sourceEnd-sourceStart+1,target=moveUp?this.items[sourceStart].prevSibling:this._getLastChild(this.items[sourceEnd+1])-sourceCount+1;if(-1<target&&target<this.items.length){if(moveUp&&!item.disableUp||!moveUp&&!item.disableDown){let item2=this.splice("items",sourceStart,sourceCount);this.splice("items",target,0,item2);this.__focusedItem=this.$.itemslist.querySelectorAll("lrnsys-outline-item")[target];this.setData(this.items);if(this.__focusedItem!==void 0&&null!==this.__focusedItem){async.microTask.run(()=>{setTimeout(()=>{this.__focusedItem.focus()},50)})}}}}/**
   * adjust indent
   */_adjustIndent(item,amount){if(0<amount&&!item.disableRight||0>amount&&!item.disableLeft){let i=parseInt(item.index),oldIndent=item.indent,indent=item.indent+amount,n=i+1,prevParent=null!==item.prevSibling&&typeof item.prevSibling!==typeof void 0?item.prevSibling.id:null,grandParent=this._getItemById(item.parent)&&this._getItemById(item.parent).parent?this._getItemById(item.parent).parent.id:null;item.indent=indent;item.parent=0<amount?prevParent:grandParent;item.prevSibling=this._getSibling(i,indent,!0);item.nextSibling=this._getSibling(i,indent,!1);item.disableUp=null===item.prevSibling;item.disableDown=null===item.nextSibling;item.disableLeft=0===indent;item.disableRight=null===this.items[i-1]||typeof this.items[i-1]===typeof void 0||indent>this.items[i-1].indentLevel;this.set(`items.${i}`,item);this.notifyPath(`items.${i}.*`);while(null!==this.items[n]&&this.items[n]!==void 0&&oldIndent<this.items[n].indentLevel){this.items[n].indentLevel=this.items[n].indentLevel+amount;this.notifyPath(`items.${n}.indentLevel`);n++;next=this.items[n]}}}/**
   * gets all children of an item
   */_getLastChild(item){let next=item!==void 0&&null!==item?this._getSibling(item.index,item.indent,!1):null;if(null!==next&&next!==void 0){return next-1}else if(typeof item!==typeof void 0&&null!==item.parent&&null!==item.parent&&null!==this._getItemById(item.parent)){return this._getLastChild(this._getItemById(item.parent))}else{return this.items.length-1}}/**
   * converts a nested array of items and returns a flat list with indents
   */_getIndent(data,i){if(typeof data[i].parent!==typeof void 0){let k=data.findIndex(j=>j.id===data[i].parent);if(-1!==k&&typeof data[k]!==typeof void 0&&data[k].indent!==void 0){return data[k].indent+1}}return 0}/**
   * returns order relative to siblings
   */_getOrder(item){let ctr=0,order=0;for(var i in this.items){if(this.items[i].parent==item.parent&&this.items[i].id==item.id){order=ctr}else if(this.items[i].parent==item.parent){ctr++}}return order}/**
   * returns previous or next sibling
   */_getSibling(index,indent,prev){let inc=prev?-1:1,i=index+inc,sib=null;if(null!==this.items){while(i<this.items.length&&-1<i){if(null===sib&&typeof this.items[i]!==typeof void 0&&typeof this.items[index]!==typeof void 0&&this.items[i].parent===this.items[index].parent){sib=i}i+=inc}}return sib}/**
   * get an item by item id
   */_getItemById(id,offset){let i=this.items.findIndex(j=>j.id===id);offset=offset===void 0?0:offset;if(this.items[i+offset]!==void 0){return this.items[i+offset]}else{return null}}/**
   * listener to add an item
   */_handleAddItem(e){this.addItem(e.detail)}/**
   * listener to delete an item
   */_handleRemoveItem(e){this.activeItem=e.detail.item;this.removeItem(e.detail.item)}/**
   * listener to move an item
   */_handleMoveItem(e){this.activeItem=e.detail.item;this.moveItem(e.detail.item,e.detail.moveUp,e.detail.byGroup)}/**
   * listener to move focus up or down
   */_handleFocusItem(e){let item=e.detail.moveUp?e.detail.item.previousElementSibling:e.detail.item.nextElementSibling;item.setSelection()}/**
   * listener to increase or decrease indent
   */_handleIndentItem(e){let amt=e.detail.increase?1:-1;this._adjustIndent(this._getItemById(e.detail.item.id),amt);this.setData(this.items)}/**
   * listener to handle changes to text inputs
   */_handleChangeItem(e){if(null!=this._getItemById(e.detail.item.id)){let i=this.items.findIndex(j=>j.id===e.detail.item.id);if(typeof this.items[i]!==typeof void 0){this.items[i].title=e.detail.value;this.notifyPath(`items.${i}.title`)}}}/**
   * listener for focus or mouseover
   */_handleFocusItem(e){this.__focusedItem=e.srcElement}/**
   * listener for blur or mouseout
   */_handleBlurItem(e){}}window.customElements.define(LrnsysOutline.tag,LrnsysOutline);export{LrnsysOutline};