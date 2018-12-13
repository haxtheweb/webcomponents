import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import*as async from"./node_modules/@polymer/polymer/lib/utils/async.js";import"./node_modules/@polymer/paper-input/paper-input.js";import"./node_modules/@polymer/paper-dialog/paper-dialog.js";import"./node_modules/@polymer/paper-icon-button/paper-icon-button.js";import"./lib/lrnsys-outline-item.js";let LrnsysOutline=Polymer({_template:html`
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
    <paper-icon-button
      title="Keyboard directions"
      id="dialogtrigger"
      icon="icons:help"
      on-tap="openDirections"
    ></paper-icon-button>
    <paper-dialog id="modal" with-backdrop="">
      <h2>Keyboard shortcuts</h2>
      <div>
        <paper-icon-button
          title="close directions"
          style="position: absolute;top: 0; right:0;"
          icon="icons:cancel"
          on-tap="closeDirections"
        ></paper-icon-button>
        <ul>
          <li><kbd>Enter</kbd> to <strong>add</strong> an item</li>
          <li>
            <kbd>Backspace</kbd> <em>with entire item selected</em> to
            <strong>delete</strong> an item.
          </li>
          <li>
            <kbd>↑</kbd> / <kbd>↓</kbd> / <kbd>←</kbd> / <kbd>→</kbd> to
            <strong>navigate</strong> through items
          </li>
          <li>
            <kbd>Tab</kbd> / <kbd>Shift+Tab</kbd>
            <em>at the beginning of a line</em> to
            <strong>indent/outdent</strong>
          </li>
          <li><kbd>Shift+↑</kbd> / <kbd>Shift+↓</kbd> to items up/down</li>
        </ul>
      </div>
    </paper-dialog>
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
  `,is:"lrnsys-outline",listeners:{"delete-item":"_handleRemoveItem","indent-item":"_handleIndentItem","focus-item":"_handleFocusItem","add-item":"_handleAddItem","move-item":"_handleMoveItem","change-item":"_handleChangeItem","focus-item":"_handleFocusItem","blur-item":"_handleBlurItem"},properties:{data:{type:Array,value:null},items:{type:Array,value:null,notify:!0},activeItem:{type:Object,notify:!0}},openDirections:function(e){this.$.modal.opened=!0},closeDirections:function(e){this.$.modal.opened=!1;async.microTask.run(()=>{setTimeout(()=>{this.$.dialogtrigger.focus()},50)})},attached:function(){this.__modal=this.$.modal;document.body.addEventListener("iron-overlay-canceled",this._accessibleFocus.bind(this));document.body.appendChild(this.$.modal)},_accessibleFocus:function(e){if(e.detail===this.__modal){async.microTask.run(()=>{setTimeout(()=>{this.$.dialogtrigger.focus()},50)})}},ready:function(){if(null===this.data||1>this.data.length){this.__tempid=this.__tempid===void 0?0:this.__tempid+1;this.data=[{id:"outline-item-"+this.__tempid,title:"",order:0,parent:null}]}this.setData(this.data)},setData:function(data){if(data!==void 0&&0<data.length){let prevIndent=-1;for(var i in data){let indent=parseInt(this._getIndent(data,i));this.__tempid=this.__tempid===void 0?0:this.__tempid+1;data[i].index=parseInt(i);data[i].indent=indent;data[i].prevSibling=this._getSibling(parseInt(i),indent,!0);data[i].nextSibling=this._getSibling(parseInt(i),indent,!1);data[i].disableUp=null===data[i].prevSibling;data[i].disableDown=null===data[i].nextSibling;data[i].disableLeft=0===indent;data[i].disableRight=indent>prevIndent;data[i].id=data[i].id===void 0?"outline-item-"+this.__tempid:data[i].id;prevIndent=indent}}this.set("items",[]);this.set("items",data)},getData:function(){for(var i in this.items){this.items[i].order=this._getOrder(this.items[i]);this.notifyPath(`items.${i}.order`)}return this.items},addItem:function(detail){let item=detail.item,title=detail.new,spliceIndex=this.items.findIndex(j=>j.id===item.id)+1;this.__tempid=this.__tempid+1;this.splice("items",spliceIndex,0,{id:"outline-item-"+this.__tempid,title:title,indent:item.indent,parent:item.parent});this.items[spliceIndex].indentLevel=item.indent;this.notifyPath(`items.${spliceIndex}.indentLevel`);this.setData(this.items);if(this.__focusedItem!==void 0&&null!==this.__focusedItem){async.microTask.run(()=>{setTimeout(()=>{this.__focusedItem=item.nextElementSibling;this.__focusedItem.focus()},50)})}},removeItem:function(item){let i=this.items.findIndex(j=>j.id===item.id),b=document.createElement("paper-button");b.raised=!0;b.addEventListener("click",this._deleteItemConfirm().bind(this));b.appendChild(document.createTextNode("Yes, delete"));const evt=new CustomEvent("simple-modal-show",{bubbles:!0,cancelable:!0,detail:{title:`Do you really want to delete ${this.items[i].title}?`,elements:{buttons:b},invokedBy:item.$.delete,clone:!1}});this.dispatchEvent(evt)},_deleteItemConfirm:function(e){let i=this.items.findIndex(j=>j.id===item.id);this.activeItem.classList.add("collapse-to-remove");setTimeout(()=>{this.__focusedItem=this.activeItem.previousElementSibling;for(var k in this.items){if(this.items[k].parent==this.items[i].id){this.items[k].parent=this.items[i].parent}}this.activeItem.classList.remove("collapse-to-remove");this.splice("items",i,1);if(this.__focusedItem!==void 0&&null!==this.__focusedItem){async.microTask.run(()=>{setTimeout(()=>{this.__focusedItem.focus()},50)})}},300)},moveItem:function(item,moveUp){let sourceStart=item.index,sourceEnd=this._getLastChild(item),sourceCount=sourceEnd-sourceStart+1,target=moveUp?this.items[sourceStart].prevSibling:this._getLastChild(this.items[sourceEnd+1])-sourceCount+1;if(-1<target&&target<this.items.length){if(moveUp&&!item.disableUp||!moveUp&&!item.disableDown){let item2=this.splice("items",sourceStart,sourceCount);this.splice("items",target,0,item2);this.__focusedItem=this.$.itemslist.querySelectorAll("lrnsys-outline-item")[target];this.setData(this.items);if(this.__focusedItem!==void 0&&null!==this.__focusedItem){async.microTask.run(()=>{setTimeout(()=>{this.__focusedItem.focus()},50)})}}}},_adjustIndent:function(item,amount){if(0<amount&&!item.disableRight||0>amount&&!item.disableLeft){let i=parseInt(item.index),oldIndent=item.indent,indent=item.indent+amount,n=i+1,prevParent=null!==item.prevSibling&&typeof item.prevSibling!==typeof void 0?item.prevSibling.id:null,grandParent=this._getItemById(item.parent)&&this._getItemById(item.parent).parent?this._getItemById(item.parent).parent.id:null;item.indent=indent;item.parent=0<amount?prevParent:grandParent;item.prevSibling=this._getSibling(i,indent,!0);item.nextSibling=this._getSibling(i,indent,!1);item.disableUp=null===item.prevSibling;item.disableDown=null===item.nextSibling;item.disableLeft=0===indent;item.disableRight=null===this.items[i-1]||typeof this.items[i-1]===typeof void 0||indent>this.items[i-1].indentLevel;while(null!==this.items[n]&&this.items[n]!==void 0&&oldIndent<this.items[n].indentLevel){this.items[n].indentLevel=this.items[n].indentLevel+amount;this.notifyPath(`items.${n}.indentLevel`);n++;next=this.items[n]}}},_getLastChild:function(item){let next=item!==void 0&&null!==item?this._getSibling(item.index,item.indent,!1):null;if(null!==next&&next!==void 0){return next-1}else if(typeof item!==typeof void 0&&null!==item.parent&&null!==item.parent&&null!==this._getItemById(item.parent)){return this._getLastChild(this._getItemById(item.parent))}else{return this.items.length-1}},_getIndent:function(data,i){if(typeof data[i].parent!==typeof void 0){let k=data.findIndex(j=>j.id===data[i].parent);if(-1!==k&&typeof data[k]!==typeof void 0&&data[k].indent!==void 0){return data[k].indent+1}}return 0},_getOrder:function(item){let ctr=0,order=0;for(var i in this.items){if(this.items[i].parent==item.parent&&this.items[i].id==item.id){order=ctr}else if(this.items[i].parent==item.parent){ctr++}}return order},_getSibling:function(index,indent,prev){let inc=prev?-1:1,i=index+inc,sib=null;if(null!==this.items){while(i<this.items.length&&-1<i){if(null===sib&&typeof this.items[i]!==typeof void 0&&typeof this.items[index]!==typeof void 0&&this.items[i].parent===this.items[index].parent){sib=i}i+=inc}}return sib},_getItemById:function(id,offset){let i=this.items.findIndex(j=>j.id===id);offset=offset===void 0?0:offset;if(this.items[i+offset]!==void 0){return this.items[i+offset]}else{return null}},_handleAddItem:function(e){this.addItem(e.detail)},_handleRemoveItem:function(e){this.activeItem=e.detail.item;this.removeItem(e.detail.item)},_handleMoveItem:function(e){this.activeItem=e.detail.item;this.moveItem(e.detail.item,e.detail.moveUp,e.detail.byGroup)},_handleFocusItem:function(e){let item=e.detail.moveUp?e.detail.item.previousElementSibling:e.detail.item.nextElementSibling;item.setSelection()},_handleIndentItem:function(e){let amt=e.detail.increase?1:-1;this._adjustIndent(this._getItemById(e.detail.item.id),amt);this.setData(this.items)},_handleChangeItem:function(e){if(null!=this._getItemById(e.detail.item.id)){let i=this.items.findIndex(j=>j.id===e.detail.item.id);if(typeof this.items[i]!==typeof void 0){this.items[i].title=e.detail.value;this.notifyPath(`items.${i}.title`)}}},_handleFocusItem:function(e){this.__focusedItem=e.srcElement},_handleBlurItem:function(e){}});export{LrnsysOutline};