import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import{dom}from"./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";import*as async from"./node_modules/@polymer/polymer/lib/utils/async.js";import"./node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js";import"./node_modules/@polymer/paper-button/paper-button.js";import"./node_modules/@polymer/iron-icons/iron-icons.js";import"./node_modules/@polymer/iron-icon/iron-icon.js";import"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";import"./node_modules/@lrnwebcomponents/responsive-grid/lib/responsive-grid-row.js";import"./node_modules/@lrnwebcomponents/responsive-grid/lib/responsive-grid-col.js";Polymer({_template:html`
    <style>
      :host {
        display: block;
      }

      responsive-grid-col {
        --responsive-grid-col-inner: {
          padding-left: 0;
          padding-right: 0;
        }
      }

      responsive-grid-row {
        --responsive-grid-row-inner: {
          margin-left: 0;
          margin-right: 0;
        }
      }

      :host([edit-mode]) responsive-grid-col.mover {
        min-height: 150px;
        background-color: #d1d1d1;
      }

      :host ::slotted(*) .mover,
      :host responsive-grid-col[data-draggable].mover {
        outline: 2px dotted #d1d1d1;
        outline-offset: 2px;
        background-color: rgba(240, 240, 240, .2);
      }

      :host ::slotted(*) .active-item {
        outline: 2px dashed #aaaaaa !important;
        outline-offset: 2px;
        background-color: rgba(220, 220, 220, .6) !important;
      }

      :host ::slotted(*) [data-draggable]:focus,
      :host ::slotted(*) [data-draggable]:hover,
      :host ::slotted(*) [data-draggable]:active {
        outline: 2px dotted #d1d1d1;
        outline-offset: 2px;
        background-color: rgba(240, 240, 240, .2);
        cursor: move !important;
      }

      paper-button {
        display: none;
        position: absolute;
        margin: 0;
        padding: 0;
        outline: none;
        width: 20px;
        height: 20px;
        color: black;
        background-color: #EEEEEE;
        border-radius: 50%;
        box-sizing: content-box !important;
        z-index: 1;
        min-width: unset;
      }

      paper-button.active {
        display: block;
      }
      paper-button iron-icon {
        display: block;
      }

      .button-holding-pen {
        position: relative;
      }
    </style>
    <div class="button-holding-pen">
      <paper-button title="move item up" id="up" on-tap="moveActiveElement">
        <iron-icon icon="icons:arrow-upward"></iron-icon>
      </paper-button>
      <paper-button title="move item right" id="right" on-tap="moveActiveElement">
        <iron-icon icon="icons:arrow-forward"></iron-icon>
      </paper-button>
      <paper-button title="move item down" id="down" on-tap="moveActiveElement">
        <iron-icon icon="icons:arrow-downward"></iron-icon>
      </paper-button>
      <paper-button title="move item left" id="left" on-tap="moveActiveElement">
        <iron-icon icon="icons:arrow-back"></iron-icon>
      </paper-button>
    </div>
    <responsive-grid-row gutter="0">
      <template is="dom-if" if="[[!hideCol1]]" strip-whitespace>
        <responsive-grid-col id="col1" style\$="background-color:[[__col1Color]];" xl\$="[[col1_xl]]" lg\$="[[col1_lg]]" md\$="[[col1_md]]" sm\$="[[col1_sm]]" xs\$="[[col1_xs]]">
          <slot name="col-1"></slot>
        </responsive-grid-col>
      </template>
      <template is="dom-if" if="[[!hideCol2]]" strip-whitespace>
        <responsive-grid-col id="col2" style\$="background-color:[[__col2Color]];" xl\$="[[col2_xl]]" lg\$="[[col2_lg]]" md\$="[[col2_md]]" sm\$="[[col2_sm]]" xs\$="[[col2_xs]]">
          <slot name="col-2"></slot>
        </responsive-grid-col>
      </template>
      <template is="dom-if" if="[[!hideCol3]]" strip-whitespace>
        <responsive-grid-col id="col3" style\$="background-color:[[__col3Color]];" xl\$="[[col3_xl]]" lg\$="[[col3_lg]]" md\$="[[col3_md]]" sm\$="[[col3_sm]]" xs\$="[[col3_xs]]">
          <slot name="col-3"></slot>
        </responsive-grid-col>
      </template>
      <template is="dom-if" if="[[!hideCol4]]" strip-whitespace>
        <responsive-grid-col id="col4" style\$="background-color:[[__col4Color]];" xl\$="[[col4_xl]]" lg\$="[[col4_lg]]" md\$="[[col4_md]]" sm\$="[[col4_sm]]" xs\$="[[col4_xs]]">
          <slot name="col-4"></slot>
        </responsive-grid-col>
      </template>
      <responsive-grid-col xl="12" lg="12" md="12" sm="12" xs="12">
        <slot></slot>
      </responsive-grid-col>
    </responsive-grid-row>
    <iron-a11y-keys stop-keyboard-event-propagation target="[[__activeItem]]" keys="enter" on-keys-pressed="setActiveElement"></iron-a11y-keys>
    <iron-a11y-keys target="[[__activeItem]]" keys="esc" on-keys-pressed="cancelActive"></iron-a11y-keys>
`,is:"grid-plate",listeners:{focusin:"_focusIn"},behaviors:[HAXBehaviors.PropertiesBehaviors,window.simpleColorsBehaviors],properties:{layout:{type:String,value:"12",observer:"_layoutChanged"},editMode:{reflectToAttribute:!0,type:Boolean,value:!1,observer:"_editModeChanged"},colors:{type:String,value:""},col1Color:{type:String,value:""},col2Color:{type:String,value:""},col3Color:{type:String,value:""},col4Color:{type:String,value:""},_colors:{type:String,computed:"_colorCreation(colors, col1Color, col2Color, col3Color, col4Color)",observer:"_colColors"},__activeItem:{type:Object,observer:"_activeItemChanged"}},cancelActive:function(e){this.__activeItem=null},moveActiveElement:function(e){var normalizedEvent=dom(e),local=normalizedEvent.localTarget;let col=this.__activeItem.getAttribute("slot").split("-"),max=1,cols=[1,2,3,4];for(var j in cols){if(!this["hideCol"+cols[j]]){max=cols[j]}}switch(local.id){case"up":if(null!==this.__activeItem.previousElementSibling){dom(this).insertBefore(this.__activeItem,this.__activeItem.previousElementSibling)}break;case"down":if(null!==this.__activeItem.nextElementSibling){dom(this).insertBefore(this.__activeItem.nextElementSibling,this.__activeItem)}break;case"left":if(1<parseInt(col[1])){this.__activeItem.setAttribute("slot","col-"+(parseInt(col[1])-1));dom(this).appendChild(this.__activeItem)}break;case"right":if(parseInt(col[1])<max){this.__activeItem.setAttribute("slot","col-"+(parseInt(col[1])+1));dom(this).appendChild(this.__activeItem)}break;}setTimeout(()=>{this.positionArrows(this.__activeItem);this.__activeItem.focus()},100)},_activeItemChanged:function(newValue,oldValue){if(typeof newValue!==typeof void 0&&null!=newValue){newValue.classList.add("active-item");this.positionArrows(newValue)}else if(null==newValue){this.positionArrows(newValue)}if(typeof oldValue!==typeof void 0&&null!=oldValue){oldValue.classList.remove("active-item");oldValue.blur()}},setActiveElement:function(e){var normalizedEvent=dom(e),local=normalizedEvent.localTarget;this.$.up.focus();e.preventDefault();e.stopPropagation()},_focusIn:function(e){if(this.editMode){var normalizedEvent=dom(e),local=normalizedEvent.localTarget;if(dom(local).parentNode===this){this.__activeItem=local}}},positionArrows:function(item){if(null==item){this.$.up.classList.remove("active");this.$.down.classList.remove("active");this.$.left.classList.remove("active");this.$.right.classList.remove("active")}else{this.$.up.classList.add("active");this.$.down.classList.add("active");this.$.left.classList.add("active");this.$.right.classList.add("active");this.$.up.disabled=!1;this.$.down.disabled=!1;this.$.left.disabled=!1;this.$.right.disabled=!1;let bodyRect=this.getBoundingClientRect(),elemRect=item.getBoundingClientRect(),topOffset=elemRect.top-bodyRect.top,leftOffset=elemRect.left-bodyRect.left;this.$.up.style.top=topOffset-20+"px";this.$.down.style.top=topOffset+elemRect.height+"px";this.$.left.style.top=topOffset+elemRect.height/2+"px";this.$.right.style.top=topOffset+elemRect.height/2+"px";this.$.up.style.left=leftOffset+elemRect.width/2-10+"px";this.$.down.style.left=leftOffset+elemRect.width/2-10+"px";this.$.left.style.left=leftOffset-20+"px";this.$.right.style.left=leftOffset+elemRect.width+"px";let col=item.getAttribute("slot").split("-"),max=1,cols=[1,2,3,4];for(var j in cols){if(!this["hideCol"+cols[j]]){max=cols[j]}}if(null===item.previousElementSibling){this.$.up.disabled=!0}if(null===item.nextElementSibling){this.$.down.disabled=!0}if(1===parseInt(col[1])){this.$.left.disabled=!0}if(parseInt(col[1])===max){this.$.right.disabled=!0}}},_editModeChanged:function(newValue,oldValue){let children=dom(this).getEffectiveChildNodes();if("object"===typeof children){if(newValue&&!oldValue){for(var i in children){if(typeof children[i].tagName!==typeof void 0){children[i].addEventListener("drop",this.dropEvent.bind(this));children[i].addEventListener("dragstart",this.dragStart.bind(this));children[i].addEventListener("dragend",this.dragEnd.bind(this));children[i].addEventListener("dragover",function(e){e.preventDefault()});children[i].setAttribute("draggable",!0);children[i].setAttribute("data-draggable",!0);children[i].setAttribute("tabindex",0)}}async.microTask.run(()=>{let cols=[1,2,3,4];for(var j in cols){if(!this["hideCol"+cols[j]]){this.shadowRoot.querySelector("#col"+cols[j]).addEventListener("drop",this.dropEvent.bind(this));this.shadowRoot.querySelector("#col"+cols[j]).addEventListener("dragstart",this.dragStart.bind(this));this.shadowRoot.querySelector("#col"+cols[j]).addEventListener("dragend",this.dragEnd.bind(this));this.shadowRoot.querySelector("#col"+cols[j]).addEventListener("dragover",function(e){e.preventDefault()});this.shadowRoot.querySelector("#col"+cols[j]).setAttribute("data-draggable",!0)}}})}else if(!newValue&&oldValue){for(var i in children){if(typeof children[i].tagName!==typeof void 0){children[i].removeEventListener("drop",this.dropEvent.bind(this));children[i].removeEventListener("dragstart",this.dragStart.bind(this));children[i].removeEventListener("dragend",this.dragEnd.bind(this));children[i].removeEventListener("dragover",function(e){e.preventDefault()});children[i].removeAttribute("draggable");children[i].removeAttribute("data-draggable");children[i].removeAttribute("tabindex")}}async.microTask.run(()=>{let cols=[1,2,3,4];for(var j in cols){if(!this["hideCol"+cols[j]]){this.shadowRoot.querySelector("#col"+cols[j]).removeEventListener("drop",this.dropEvent.bind(this));this.shadowRoot.querySelector("#col"+cols[j]).removeEventListener("dragstart",this.dragStart.bind(this));this.shadowRoot.querySelector("#col"+cols[j]).removeEventListener("dragend",this.dragEnd.bind(this));this.shadowRoot.querySelector("#col"+cols[j]).removeEventListener("dragover",function(e){e.preventDefault()});this.shadowRoot.querySelector("#col"+cols[j]).removeAttribute("data-draggable")}}})}}},dropEvent:function(e){var normalizedEvent=dom(e),local=normalizedEvent.localTarget;if(typeof this.__activeItem!==typeof void 0&&typeof local!==typeof void 0&&null!=local.getAttribute("slot")&&this.__activeItem!==local){this.__activeItem.setAttribute("slot",local.getAttribute("slot"));dom(this).insertBefore(this.__activeItem,local);e.preventDefault();e.stopPropagation()}else if("RESPONSIVE-GRID-COL"===local.tagName){var col=local.id.replace("col","");this.__activeItem.setAttribute("slot","col-"+col);dom(this).appendChild(this.__activeItem);e.preventDefault();e.stopPropagation()}let children=dom(this).children;for(var i in children){if(typeof children[i].classList!==typeof void 0){children[i].classList.remove("mover")}}let cols=[1,2,3,4];for(var j in cols){if(!this["hideCol"+cols[j]]){this.shadowRoot.querySelector("#col"+cols[j]).classList.remove("mover")}}setTimeout(()=>{this.positionArrows(this.__activeItem);this.__activeItem.focus()},100)},_colorCreation:function(colors,col1,col2,col3,col4){let items=colors.split("/"),cols=[col1,col2,col3,col4];for(var i in cols){if(""!=cols[i]){items[i]=cols[i]}}return items},dragStart:function(e){let children=dom(this).children;for(var i in children){if(typeof children[i].classList!==typeof void 0){children[i].classList.add("mover")}}let cols=[1,2,3,4];for(var j in cols){if(!this["hideCol"+cols[j]]){this.shadowRoot.querySelector("#col"+cols[j]).classList.add("mover")}}},dragEnd:function(e){let children=dom(this).children;for(var i in children){if(typeof children[i].classList!==typeof void 0){children[i].classList.remove("mover")}}let cols=[1,2,3,4];for(var j in cols){if(!this["hideCol"+cols[j]]){this.shadowRoot.querySelector("#col"+cols[j]).classList.remove("mover")}}},splitColor:function(value){if(""!=value&&typeof this.__hexCodes[value]!==typeof void 0){return this.__hexCodes[value][this.__hexCodes[value].length-1]}return value},_colColors:function(newValue,oldValue){if(""!=newValue){for(var i in newValue){this["__col"+(parseInt(i)+1)+"Color"]=this.splitColor(newValue[i])}}},_layoutChanged:function(layout){let items=layout.split("/");this.__colCount=items.length;switch(items.length){case 1:this.hideCol1=!1;this.hideCol2=!0;this.hideCol3=!0;this.hideCol4=!0;break;case 2:this.hideCol1=!1;this.hideCol2=!1;this.hideCol3=!0;this.hideCol4=!0;break;case 3:this.hideCol1=!1;this.hideCol2=!1;this.hideCol3=!1;this.hideCol4=!0;break;case 4:this.hideCol1=!1;this.hideCol2=!1;this.hideCol3=!1;this.hideCol4=!1;break;}for(var i in items){let col=+i+1;this["col"+col+"_xl"]=items[i];this["col"+col+"_lg"]=items[i];this["col"+col+"_md"]=items[i];this["col"+col+"_sm"]=items[i];this["col"+col+"_xs"]=items[i]}},attached:function(){document.body.addEventListener("hax-store-property-updated",this._haxStorePropertyUpdated.bind(this));document.body.addEventListener("hax-insert-content",this.haxInsertContent.bind(this));var colorOptions=[];for(var i in this.__hexCodes){colorOptions[i]=i}let props={canScale:!0,canPosition:!0,canEditSource:!1,settings:{quick:[],configure:[{property:"layout",title:"Layout",description:"Style to present these items",inputMethod:"select",options:{12:"1 col, full width","8/4":"2 cols, 66% / 33% split","6/6":"2 cols, 50% split","4/8":"2 cols, 33% / 66% split","4/4/4":"3 cols, 33% each","3/3/3/3":"4 cols, 25% each"}},{property:"col1Color",title:"Col 1 color",description:"Color for the 1st column",inputMethod:"select",options:colorOptions},{property:"col2Color",title:"Col 2 color",description:"Color for the 1st column",inputMethod:"select",options:colorOptions},{property:"col3Color",title:"Col 3 color",description:"Color for the 1st column",inputMethod:"select",options:colorOptions},{property:"col4Color",title:"Col 4 color",description:"Color for the 1st column",inputMethod:"select",options:colorOptions}],advanced:[]},saveOptions:{unsetAttributes:["__active-item","_colors","edit-mode"]}};this.setHaxProperties(props)},haxInsertContent:function(e){if(this===window.HaxStore.instance.activeContainerNode){this.editMode=!1;setTimeout(()=>{this.editMode=!0;this.positionArrows(this.__activeItem);this.__activeItem.focus()},250)}},_haxStorePropertyUpdated:function(e){if(e.detail&&typeof e.detail.value!==typeof void 0&&e.detail.property){if("object"===typeof e.detail.value){this.set(e.detail.property,null)}this.set(e.detail.property,e.detail.value)}}});