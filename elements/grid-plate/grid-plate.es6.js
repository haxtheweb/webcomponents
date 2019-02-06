import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import{dom}from"./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";import*as async from"./node_modules/@polymer/polymer/lib/utils/async.js";import"./node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js";import"./node_modules/@polymer/paper-icon-button/paper-icon-button.js";import"./node_modules/@polymer/iron-icons/iron-icons.js";import"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@lrnwebcomponents/responsive-utility/responsive-utility.js";let GridPlate=Polymer({_template:html`
    <custom-style>
      <style is="custom-style" include="simple-colors">
        :host {
          display: block;
          --grid-plate-row-margin: 0px;
          --grid-plate-row-padding: 0px;
          --grid-plate-item-margin: 15px;
          --grid-plate-editable-border-color: #ccc;
          --grid-plate-active-border-color: #6cd;
        }
        :host .row {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: stretch;
          margin: var(--grid-plate-row-margin);
          padding: var(--grid-plate-row-padding);
        }
        :host .column {
          width: 100%;
          flex: 0 0 auto;
          transition: all 0.5s;
        }
        :host([edit-mode]) .column {
          min-height: 150px;
        }

        :host([edit-mode]) .column {
          outline: 1px dotted var(--grid-plate-editable-border-color);
        }
        :host .column[style="min-height: unset"] {
          display: none;
        }
        :host([edit-mode]) .column[style="min-height: unset"]:not(:empty) {
          display: block;
          outline: 1px solid red;
          width: 20%;
          margin-top: var(--grid-plate-item-margin);
        }
        :host([edit-mode])
          .column[style="min-height: unset"]:not(:empty):before {
          content: "Hidden Column (" attr(id) ")";
          color: red;
          margin: var(--grid-plate-item-margin);
          padding: 15px 0;
          min-height: 150px;
        }
        :host ::slotted(*) {
          margin: var(--grid-plate-item-margin);
          padding: 0;
        }
        :host ::slotted(*.mover) {
          outline: 2px dashed var(--grid-plate-editable-border-color);
          outline-offset: 4px;
        }
        :host ::slotted(*.active-item) {
          outline: 2px dashed var(--grid-plate-active-border-color);
          outline-offset: 4px;
        }
        :host ::slotted(*[data-draggable]:focus),
        :host ::slotted(*[data-draggable]:hover),
        :host ::slotted(*[data-draggable]:active) {
          cursor: move;
        }

        :host([edit-mode]) .column.mover {
          background-color: yellow;
        }
        :host .column[data-draggable].mover {
          background-color: pink;
        }

        paper-icon-button {
          display: none;
          position: absolute;
          margin: 0;
          padding: 0;
          outline: none;
          width: 20px;
          height: 20px;
          color: black;
          background-color: #eeeeee;
          border-radius: 50%;
          box-sizing: content-box !important;
          z-index: 1;
          min-width: unset;
        }

        paper-icon-button[disabled] {
          color: #aaa;
          background-color: #ddd;
        }
        paper-icon-button[disabled]:focus,
        paper-icon-button[disabled]:hover {
          cursor: not-allowed;
        }
        paper-icon-button.active {
          display: block;
        }

        .button-holding-pen {
          position: relative;
        }
      </style>
    </custom-style>
    <div class="button-holding-pen">
      <paper-icon-button
        icon="icons:arrow-upward"
        title="move item up"
        id="up"
        on-tap="moveActiveElement"
      >
      </paper-icon-button>
      <paper-icon-button
        icon="icons:arrow-forward"
        title="move item right"
        id="right"
        on-tap="moveActiveElement"
      >
      </paper-icon-button>
      <paper-icon-button
        icon="icons:arrow-downward"
        title="move item down"
        id="down"
        on-tap="moveActiveElement"
      >
      </paper-icon-button>
      <paper-icon-button
        icon="icons:arrow-back"
        title="move item left"
        id="left"
        on-tap="moveActiveElement"
      >
      </paper-icon-button>
    </div>
    <div class="row">
      <div
        class="column"
        id="col1"
        style$="[[_getColumnWidth(0,columnWidths)]]"
      >
        <slot name="col-1"></slot>
      </div>
      <div
        class="column"
        id="col2"
        style$="[[_getColumnWidth(1,columnWidths)]]"
      >
        <slot name="col-2"></slot>
      </div>
      <div
        class="column"
        id="col3"
        style$="[[_getColumnWidth(2,columnWidths)]]"
      >
        <slot name="col-3"></slot>
      </div>
      <div
        class="column"
        id="col4"
        style$="[[_getColumnWidth(3,columnWidths)]]"
      >
        <slot name="col-4"></slot>
      </div>
      <div
        class="column"
        id="col5"
        style$="[[_getColumnWidth(4,columnWidths)]]"
      >
        <slot name="col-5"></slot>
      </div>
      <div
        class="column"
        id="col6"
        style$="[[_getColumnWidth(5,columnWidths)]]"
      >
        <slot name="col-6"></slot>
      </div>
    </div>
    <iron-a11y-keys
      stop-keyboard-event-propagation
      target="[[__activeItem]]"
      keys="enter"
      on-keys-pressed="setActiveElement"
    ></iron-a11y-keys>
    <iron-a11y-keys
      target="[[__activeItem]]"
      keys="esc"
      on-keys-pressed="cancelActive"
    ></iron-a11y-keys>
  `,is:"grid-plate",listeners:{focusin:"_focusIn",focusout:"_focusOut"},behaviors:[HAXBehaviors.PropertiesBehaviors],properties:{columns:{type:Number,computed:"_getColumns(columnWidths)",reflectToAttribute:!0},columnWidths:{type:String,computed:"_getColumnWidths(responsiveSize,layout,layouts)"},editMode:{reflectToAttribute:!0,type:Boolean,value:!1,observer:"_editModeChanged"},layout:{type:String,value:"1-1",reflectToAttribute:!0},layouts:{type:Object,value:{1:{columnLayout:"1: full width",xs:["100%"],sm:["100%"],md:["100%"],lg:["100%"],xl:["100%"]},"1-1":{columnLayout:"2: equal width",xs:["100%","100%"],sm:["50%","50%"],md:["50%","50%"],lg:["50%","50%"],xl:["50%","50%"]},"2-1":{columnLayout:"2: wide & narrow",xs:["100%","100%"],sm:["50%","50%"],md:["66.6666667%","33.3333337%"],lg:["66.6666667%","33.3333337%"],xl:["66.6666667%","33.3333337%"]},"1-2":{columnLayout:"2: narrow & wide",xs:["100%","100%"],sm:["50%","50%"],md:["33.3333333%","66.6666667%"],lg:["33.3333333%","66.6666667%"],xl:["33.3333333%","66.6666667%"]},"3-1":{columnLayout:"2: wider & narrower",xs:["100%","100%"],sm:["50%","50%"],md:["75%","25%"],lg:["75%","25%"],xl:["75%","25%"]},"1-3":{columnLayout:"2: narrower & wider",xs:["100%","100%"],sm:["50%","50%"],md:["25%","75%"],lg:["25%","75%"],xl:["25%","75%"]},"1-1-1":{columnLayout:"3: equal width",xs:["100%","100%","100%"],sm:["100%","100%","100%"],md:["33.3333333%","33.3333333%","33.3333333%"],lg:["33.3333333%","33.3333333%","33.3333333%"],xl:["33.3333333%","33.3333333%","33.3333333%"]},"2-1-1":{columnLayout:"3: wide, narrow, and narrow",xs:["100%","100%","100%"],sm:["100%","50%","50%"],md:["50%","25%","25%"],lg:["50%","25%","25%"],xl:["50%","25%","25%"]},"1-2-1":{columnLayout:"3: narrow, wide, and narrow",xs:["100%","100%","100%"],sm:["100%","100%","100%"],md:["25%","50%","25%"],lg:["25%","50%","25%"],xl:["25%","50%","25%"]},"1-1-2":{columnLayout:"3: narrow, narrow, and wide",xs:["100%","100%","100%"],sm:["50%","50%","100%"],md:["25%","25%","50%"],lg:["25%","25%","50%"],xl:["25%","25%","50%"]},"1-1-1-1":{columnLayout:"4: equal width",xs:["100%","100%","100%","100%"],sm:["50%","50%","50%","50%"],md:["25%","25%","25%","25%"],lg:["25%","25%","25%","25%"],xl:["25%","25%","25%","25%"]},"1-1-1-1-1":{columnLayout:"5: equal width",xs:["100%","100%","100%","100%","100%"],sm:["50%","50%","50%","50%","50%"],md:["20%","20%","20%","20%","20%"],lg:["20%","20%","20%","20%","20%"],xl:["20%","20%","20%","20%","20%"]},"1-1-1-1-1-1":{columnLayout:"6: equal width",xs:["100%","100%","100%","100%","100%","100%"],sm:["50%","50%","50%","50%","50%","50%"],md:["33.3333333%","33.3333333%","33.3333333%","33.3333333%","33.3333333%","33.3333333%"],lg:["16.6666667%","16.6666667%","16.6666667%","16.6666667%","16.6666667%","16.6666667%"],xl:["16.6666667%","16.6666667%","16.6666667%","16.6666667%","16.6666667%","16.6666667%"]}}},responsiveSize:{type:String,value:"xs",reflectToAttribute:!0},__activeItem:{type:Object,observer:"_activeItemChanged"}},cancelActive:function(e){this.__activeItem=null},canMoveSlot:function(item,before){let dir=before?-1:1,max=this.shadowRoot.querySelectorAll(".column").length,col=item.getAttribute("slot").split("-"),dest=parseInt(col[1])+dir;return 1<=dest&&dest<=max},moveSlot:function(item,before){let dir=before?-1:1,col=item.getAttribute("slot").split("-"),dest=parseInt(col[1])+dir;if(this.canMoveSlot(item,dir)){item.setAttribute("slot","col-"+dest)}},canMoveOrder:function(item,before){let target=before?item.previousElementSibling:item.nextElementSibling;return null!==target&&target.getAttribute("slot")===item.getAttribute("slot")},moveOrder:function(item,before=!0){let dir=before?-1:1;if(this.canMoveOrder(item,before)){if(before){dom(this).insertBefore(this.__activeItem,this.__activeItem.previousElementSibling)}else{dom(this).insertBefore(this.__activeItem.nextElementSibling,this.__activeItem)}}},moveActiveElement:function(e){var normalizedEvent=dom(e),local=normalizedEvent.localTarget;switch(local.id){case"up":this.moveOrder(this.__activeItem,!0);break;case"down":this.moveOrder(this.__activeItem,!1);break;case"left":this.moveSlot(this.__activeItem,!0);break;case"right":this.moveSlot(this.__activeItem,!1);break;}setTimeout(()=>{this.positionArrows(this.__activeItem);this.__activeItem.focus()},100)},_activeItemChanged:function(newValue,oldValue){if(typeof newValue!==typeof void 0&&null!=newValue){newValue.classList.add("active-item");this.positionArrows(newValue)}else if(null==newValue){this.positionArrows(newValue)}if(typeof oldValue!==typeof void 0&&null!=oldValue){oldValue.classList.remove("active-item");oldValue.blur()}},setActiveElement:function(e){var normalizedEvent=dom(e),local=normalizedEvent.localTarget;this.$.right.focus();e.preventDefault();e.stopPropagation()},_getColumnWidths(responsiveSize="sm",layout="1-1",layouts){let newl=layouts[layout],oldLayouts={12:"1","8/4":"2-1","6/6":"1-1","4/8":"1-2","4/4/4":"1-1-1","3/3/3/3":"1-1-1-1"},oldl=oldLayouts[layout];if(newl!==void 0&&newl[responsiveSize]!==void 0){return layouts[layout][responsiveSize]}else if(layouts[oldl]!==void 0&&layouts[oldl][responsiveSize]!==void 0){return layouts[oldl][responsiveSize]}else{return layouts["1-1"][responsiveSize]}},_getColumnWidth(column,columnWidths){return columnWidths!==void 0&&columnWidths[column]!==void 0?"width:"+columnWidths[column]:"min-height: unset"},_getColumns(columnWidths){return columnWidths.length},_focusIn:function(e){if(this.editMode){var normalizedEvent=dom(e),local=normalizedEvent.localTarget;if(dom(local).parentNode===this){this.__activeItem=local}}},_focusOut:function(e){if(this.editMode){var normalizedEvent=dom(e),local=normalizedEvent.localTarget;if(local.parentNode===this||document.activeElement.parentNode===this||document.activeElement===this){}else{}}},positionArrows:function(item){if(null==item){this.$.up.classList.remove("active");this.$.down.classList.remove("active");this.$.left.classList.remove("active");this.$.right.classList.remove("active")}else{this.$.up.classList.add("active");this.$.down.classList.add("active");this.$.left.classList.add("active");this.$.right.classList.add("active");this.$.up.disabled=!this.canMoveOrder(item,!0);this.$.down.disabled=!this.canMoveOrder(item,!1);this.$.left.disabled=!this.canMoveSlot(item,!0);this.$.right.disabled=!this.canMoveSlot(item,!1);let bodyRect=this.getBoundingClientRect(),elemRect=item.getBoundingClientRect(),topOffset=elemRect.top-bodyRect.top,leftOffset=elemRect.left-bodyRect.left;this.$.up.style.top=topOffset-20+"px";this.$.down.style.top=topOffset+elemRect.height+"px";this.$.left.style.top=topOffset+elemRect.height/2+"px";this.$.right.style.top=topOffset+elemRect.height/2+"px";this.$.up.style.left=leftOffset+elemRect.width/2-10+"px";this.$.down.style.left=leftOffset+elemRect.width/2-10+"px";this.$.left.style.left=leftOffset-20+"px";this.$.right.style.left=leftOffset+elemRect.width+"px"}},_editModeChanged:function(newValue,oldValue){let children=dom(this).getEffectiveChildNodes();if("object"===typeof children){if(newValue&&!oldValue){for(var i in children){if(typeof children[i].tagName!==typeof void 0){children[i].addEventListener("drop",this.dropEvent.bind(this));children[i].addEventListener("dragstart",this.dragStart.bind(this));children[i].addEventListener("dragend",this.dragEnd.bind(this));children[i].addEventListener("dragover",function(e){e.preventDefault()});children[i].setAttribute("draggable",!0);children[i].setAttribute("data-draggable",!0);children[i].setAttribute("tabindex",0)}}async.microTask.run(()=>{for(var j=1;j<=this.columns.length;j++){if(this.shadowRoot.querySelector("#col"+j)!==void 0){this.shadowRoot.querySelector("#col"+j).addEventListener("drop",this.dropEvent.bind(this));this.shadowRoot.querySelector("#col"+j).addEventListener("dragstart",this.dragStart.bind(this));this.shadowRoot.querySelector("#col"+j).addEventListener("dragend",this.dragEnd.bind(this));this.shadowRoot.querySelector("#col"+j).addEventListener("dragover",function(e){e.preventDefault()});this.shadowRoot.querySelector("#col"+j).setAttribute("data-draggable",!0)}}})}else if(!newValue&&oldValue){for(var i in children){if(typeof children[i].tagName!==typeof void 0){children[i].removeEventListener("drop",this.dropEvent.bind(this));children[i].removeEventListener("dragstart",this.dragStart.bind(this));children[i].removeEventListener("dragend",this.dragEnd.bind(this));children[i].removeEventListener("dragover",function(e){e.preventDefault()});children[i].removeAttribute("draggable");children[i].removeAttribute("data-draggable");children[i].removeAttribute("tabindex")}}async.microTask.run(()=>{for(var j=1;j<=this.columns.length;j++){if(this.shadowRoot.querySelector("#col"+j)!==void 0){this.shadowRoot.querySelector("#col"+j).removeEventListener("drop",this.dropEvent.bind(this));this.shadowRoot.querySelector("#col"+j).removeEventListener("dragstart",this.dragStart.bind(this));this.shadowRoot.querySelector("#col"+j).removeEventListener("dragend",this.dragEnd.bind(this));this.shadowRoot.querySelector("#col"+j).removeEventListener("dragover",function(e){e.preventDefault()});this.shadowRoot.querySelector("#col"+j).removeAttribute("data-draggable")}}})}}},dropEvent:function(e){var normalizedEvent=dom(e),local=normalizedEvent.localTarget;if(typeof this.__activeItem!==typeof void 0&&typeof local!==typeof void 0&&null!=local.getAttribute("slot")&&this.__activeItem!==local){this.__activeItem.setAttribute("slot",local.getAttribute("slot"));dom(this).insertBefore(this.__activeItem,local);e.preventDefault();e.stopPropagation()}else if(".column"===local.tagName){var col=local.id.replace("col","");this.__activeItem.setAttribute("slot","col-"+col);dom(this).appendChild(this.__activeItem);e.preventDefault();e.stopPropagation()}let children=dom(this).children;for(var i in children){if(typeof children[i].classList!==typeof void 0){children[i].classList.remove("mover")}}for(var j=1;j<=this.columns.length;j++){if(this.shadowRoot.querySelector("#col"+j)!==void 0){this.shadowRoot.querySelector("#col"+j).classList.remove("mover")}}setTimeout(()=>{this.positionArrows(this.__activeItem);this.__activeItem.focus()},100)},dragStart:function(e){let children=dom(this).children;for(var i in children){if(typeof children[i].classList!==typeof void 0){children[i].classList.add("mover")}}for(var j=1;j<=this.columns.length;j++){if(this.shadowRoot.querySelector("#col"+j)!==void 0){this.shadowRoot.querySelector("#col"+j).classList.add("mover")}}},dragEnd:function(e){let children=dom(this).children;for(var i in children){if(typeof children[i].classList!==typeof void 0){children[i].classList.remove("mover")}}for(var j=1;j<=this.columns.length;j++){if(this.shadowRoot.querySelector("#col"+j)!==void 0){this.shadowRoot.querySelector("#col"+j).classList.remove("mover")}}},attached:function(){let root=this;document.body.addEventListener("hax-store-property-updated",root._haxStorePropertyUpdated.bind(root));document.body.addEventListener("hax-insert-content",root.haxInsertContent.bind(root));window.ResponsiveUtility.requestAvailability();window.dispatchEvent(new CustomEvent("responsive-element",{detail:{element:root,attribute:"responsive-size",relativeToParent:!0}}));let options={},layouts=Object.keys(root.layouts),getOptions=function(){for(let i=0;i<layouts.length;i++){options[layouts[i]]=root.layouts[layouts[i]].columnLayout}};getOptions();let props={canScale:!0,canPosition:!0,canEditSource:!1,settings:{quick:[],configure:[{property:"layout",title:"Column Layout",description:"Style to present these items (may change for small screens)",inputMethod:"select",options:options}],advanced:[]},saveOptions:{unsetAttributes:["__active-item","edit-mode"]}};root.setHaxProperties(props)},haxInsertContent:function(e){if(this===window.HaxStore.instance.activeContainerNode){this.editMode=!1;setTimeout(()=>{this.editMode=!0;this.positionArrows(this.__activeItem);this.__activeItem.focus()},250)}},_haxStorePropertyUpdated:function(e){if(e.detail&&typeof e.detail.value!==typeof void 0&&e.detail.property){if("object"===typeof e.detail.value){this.set(e.detail.property,null)}this.set(e.detail.property,e.detail.value)}}});export{GridPlate};