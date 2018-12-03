import{html,Polymer}from"../node_modules/@polymer/polymer/polymer-legacy.js";import{dom}from"../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";import"../node_modules/@polymer/paper-tooltip/paper-tooltip.js";import"../node_modules/@polymer/paper-item/paper-item.js";import"../node_modules/@polymer/neon-animation/neon-animation.js";import"./hax-toolbar-menu.js";Polymer({_template:html`
    <style>
      :host {
        display: inline-flex;
        height: 32px;
        box-sizing: border-box;
      }
      :host hax-toolbar-menu ::slotted(*):hover {
        background-color: #cccccc;
      };
      :host hax-toolbar-menu ::slotted(*) {
        height: 32px;
      };
    </style>
    <hax-toolbar-menu corner="[[corner]]" id="menu" icon="[[icon]]" tooltip="[[label]]" tooltip-direction="[[direction]]" selected="{{selectedValue}}" reset-on-select="[[resetOnSelect]]">
      <slot></slot>
    </hax-toolbar-menu>
`,is:"hax-context-item-menu",properties:{corner:{type:String,value:""},_blockEvent:{type:Boolean,value:!1},resetOnSelect:{type:Boolean,value:!1},selectedValue:{type:Number,reflectToAttribute:!0,notify:!0,value:0,observer:"_selectedUpdated"},direction:{type:String,value:"top"},icon:{type:String,value:"editor:text-fields",reflectToAttribute:!0},iconClass:{type:String,value:"black-text",reflectToAttribute:!0},label:{type:String,value:"editor:text-fields",reflectToAttribute:!0},eventName:{type:String,value:"button",reflectToAttribute:!0}},_selectedUpdated:function(newValue,oldValue){if(typeof null!==typeof newValue&&typeof oldValue!==typeof void 0&&typeof null!==typeof oldValue){let children=dom(this).getDistributedNodes();for(var item={},j=0,i=0,len=children.length;i<len;i++){if("PAPER-ITEM"===children[i].tagName){if(j===newValue){item=children[i];len=i;continue}j++}}if(!this._blockEvent&&typeof item.attributes!==typeof void 0&&typeof item.attributes.value!==typeof void 0&&typeof item.attributes.value.value!==typeof void 0){this.$.menu.hideMenu();this.fire("hax-context-item-selected",{target:item,eventName:item.attributes.value.value})}if(this._blockEvent){this._blockEvent=!1}}}});