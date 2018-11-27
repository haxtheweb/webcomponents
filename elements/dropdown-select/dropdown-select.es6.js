import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js";import"./node_modules/@polymer/paper-item/paper-item.js";import"./node_modules/@polymer/paper-listbox/paper-listbox.js";Polymer({_template:html`
    <style>
      :host {
        display: block;
      }
      paper-listbox ::slotted(paper-item) {
        display: block;
        width: 100%;
        min-height: 32px;
        vertical-align: text-top;
        line-height: 32px;
        @apply --dropdown-select-items;
      }
      paper-listbox paper-listbox {
        @apply --dropdown-listbox;
      }
    </style>
    <paper-dropdown-menu id="menu" allow-outside-scroll\$="[[allowOutsideScroll]]" always-float-label\$="[[alwaysFloatLabel]]" dynamic-align\$="[[dynamicAlign]]" error-message\$="[[errorMessage]]" horizontal-align\$="[[horizontalAlign]]" label\$="[[label]]" no-animations\$="[[noAnimations]]" no-label-float\$="[[noLabelFloat]]" on-selected-item-changed="_getSelectedValue" placeholder\$="[[placeholder]]" restore-focus-on-close\$="[[restoreFocusOnClose]]" vertical-align\$="[[verticalAlign]]" vertical-offset\$="[[verticalOffset]]">
      <paper-listbox id="listbox" slot="dropdown-content" class="dropdown-content">
        <slot id="content"></slot>
      </paper-listbox>
    </paper-dropdown-menu>
`,is:"dropdown-select",listeners:{"paper-dropdown-open":"_onOpen","paper-dropdown-close":"_onClose"},properties:{allowOutsideScroll:{type:Boolean,value:!1},alwaysFloatLabel:{type:Boolean,value:!1},dynamicAlign:{type:Boolean},errorMessage:{type:String},horizontalAlign:{type:String,value:"right"},label:{type:String,value:"Select an option."},noAnimations:{type:Boolean,value:!1},noLabelFloat:{type:Boolean,value:!1},opened:{type:Boolean,value:!1},placeholder:{type:String},restoreFocusOnClose:{type:Boolean,value:!0},selectedItem:{type:Object},selectedItemIndex:{type:Number,value:null},selectedItemLabel:{type:String,value:null},value:{type:String,value:null},verticalAlign:{type:String,value:"top"},verticalOffset:{type:Number}},_getSelectedValue:function(e){if(null!==e.detail.value){this.value=e.detail.value.getAttribute("value");this._setSelectedValues();this.fire("change",{value:this.value});this.fire("dropdown-select-changed",this)}},_onOpen:function(e){this.opened=!0},_onClose:function(e){this.opened=!1},_setSelectedValues:function(){this.selectedItem=this.$.menu.selectedItem;this.selectedItemLabel=this.$.menu.selectedItemLabel;this.selectedItemIndex=this.$.listbox.selected},attached:function(){let children=this.$.listbox.querySelectorAll("paper-item");if(children!==void 0&&null!==children){for(let i=0;i<children.length;i++){if(this.value===children[i].getAttribute("value")){this.$.listbox.selected=i;this._setSelectedValues()}}}}});