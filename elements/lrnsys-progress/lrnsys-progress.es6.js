import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@polymer/paper-progress/paper-progress.js";import"./lib/lrnsys-progress-circle.js";Polymer({_template:html`
    <style>
      :host {
        display: block;
        margin-top: 24px;
      }
      :host([size="tiny"]) {
        font-size: 12.8px;
      }
      :host([size="small"]) {
        font-size: 19.2px;
      }
      :host([size="medium"]) {
        font-size: 25.6px;
      }
      :host([size="large"]) {
        font-size: 44.8px;
      }
      :host([size="x-large"]) {
        font-size: 64px;
      }
      :host([size="epic"]) {
        font-size: 96px;
      }
      #circle-container {
        display: flex;
        justify-content:space-between;
        margin: -24px 0 0 0;
        padding: 0;
        list-style: none;
      }
      .progress-title {
        position: absolute !important;
        clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
        clip: rect(1px, 1px, 1px, 1px);
        overflow: hidden;
        height: 1px;
      }
      paper-progress {
        --paper-progress-height: 8px;
        --paper-progress-transition-duration: 0.5s;
        --paper-progress-transition-timing-function: ease;
        --paper-progress-transition-delay: .4s;
        width: 100%;
      }
      /* required to get the box shadow above the progress bar */
      .circle-node {
        z-index: 1;
      }
      ul#circle-container li.circle-node {
        list-style-type: none;
      }

      :host([vertical]) {
        width: max-content;
      }
      :host([vertical]) #circle-container {
        display: block;
      }
      :host([vertical]) paper-progress {
        display: none !important;
      }
      :host([vertical]) lrnsys-progress-circle {
        margin: 16px 0;
        padding: 0;
        width: 100%;
      }

      lrnsys-progress-circle {
        width: 40px;
        height: 40px;
        --lrnsys-progress-circle-size: 40px;
        --lrnsys-progress-spinner-size: 32px;
        --lrnsys-progress-icon-size: 24px;
        --paper-spinner-stroke-width: 1.2px;
      }

    </style>
    <iron-ajax id="ajax" url="[[activeNodeURL]]" handle-as="json" last-response="{{nodeData}}" last-error="{{nodeDataError}}" on-response="handleNodeResponse"></iron-ajax>
    <h3 class="progress-title">[[title]]</h3>
    <paper-progress id="progress" value="[[overallPercentage]]"></paper-progress>
    <ul id="circle-container">
      <template is="dom-repeat" items="[[items]]" as="item">
        <li class="circle-node">
          <lrnsys-progress-circle play-finish-sound="[[soundFinish]]" play-sound="[[sound]]" complete-sound="[[completeSound]]" finished-sound="[[finishedSound]]" active="[[_isActive(index, active)]]" step="[[index]]" label="[[item.title]]" icon="[[item.icon]]" icon-complete="[[item.iconComplete]]" data-url="[[item.dataUrl]]" url="[[item.url]]" status="[[item.status]]" value="[[item.value]]" max="[[item.max]]" stroke-width="[[strokeWidth]]" tool-tip="[[!vertical]]" list-view="[[vertical]]" class\$="[[size]]">
            <span slot="description">[[item.description]]</span>
          </lrnsys-progress-circle>
        </li>
      </template>
    </ul>
`,is:"lrnsys-progress",listeners:{"node-is-active":"_bubbleUpChangeActive","node-status-change":"_statusChanged"},properties:{disableAjaxCalls:{type:Boolean,value:!1,reflectToAttribute:!0},items:{type:Array,value:[],notify:!0,observer:"_itemsChanged"},sound:{type:Boolean,value:!1,reflectToAttribute:!0},soundFinish:{type:Boolean,value:!1,reflectToAttribute:!0},completeSound:{type:String,value:"assets/complete.mp3",reflectToAttribute:!0},finishedSound:{type:String,value:"assets/finished.mp3",reflectToAttribute:!0},title:{type:String,value:"Steps to completion",reflectToAttribute:!0},keyItems:{type:Array,value:[],notify:!0},active:{type:Number,value:0,notify:!0,reflectToAttribute:!0,observer:"_activeChanged"},progressiveUnlock:{type:Boolean,value:!0,reflectToAttribute:!0,notify:!0},state:{type:String,value:null,reflectToAttribute:!0,observer:"_reportState"},overallPercentage:{type:Number,computed:"_overallPercentageCompute(items, active)",reflectToAttribute:!0},_responseList:{type:Array,value:[]},activeNodeResponse:{type:String,value:"",observer:"_activeResponseChange"},nodeData:{type:Object,value:[]},nodeDataError:{type:Object,value:[],observer:"_handleNodeError"},vertical:{type:Boolean,value:!1},size:{type:String,value:"medium",notify:!0,reflectToAttribute:!0},strokeWidth:{type:Number,computed:"_getStrokeWidth(size)"}},_getStrokeWidth:function(size){var width=4;if("tiny"==size){width=3}else if("small"==size){width=4}else if("medium"==size){width=5}else if("large"==size){width=6}else if("x-large"==size){width=7}else if("epic"==size){width=8}return width},_reportState:function(newValue){if(typeof null!==typeof newValue){this.fire("progress-state-change",{state:this.state,active:this.items[this.active]})}},_itemsChanged:function(newValue,oldValue){if(typeof oldValue!==typeof void 0&&newValue.length!=oldValue.length&&typeof this._responseList[this.active]===typeof void 0){newValue[this.active].status="loading";this.set("items."+this.active+".status","loading");if(typeof newValue[this.active].dataUrl!==typeof void 0&&!this.disableAjaxCalls){this.$.ajax.url=newValue[this.active].dataUrl;this.$.ajax.generateRequest()}else{setTimeout(()=>{newValue[this.active].status="available";this.set("items."+this.active+".status","available");this._responseList[this.active]={};this.activeNodeResponse=this._responseList[this.active]},1200)}}},_isActive:function(index,active){return index===active},_activeResponseChange:function(value){this.fire("progress-response-loaded",{response:value})},_bubbleUpChangeActive:function(e){this.active=e.target.step},_activeChanged:function(){this.state="active item is "+this.active;this.items.forEach((element,index)=>{if("disabled"==this.items[index].status){if(0!=index&&this.progressiveUnlock&&"complete"==this.items[index-1].status){this.items[index].status="loading";this.set("items."+index+".status","loading")}}else if(this.items[index].value>=this.items[index].max&&index==this.items.length-1){this.items[index].status="finished";this.set("items."+index+".status","finished")}else if(this.items[index].value>=this.items[index].max){this.items[index].status="complete";this.set("items."+index+".status","complete")}else if(index==this.active){if(typeof this._responseList[index]===typeof void 0){this.items[index].status="loading";this.set("items."+index+".status","loading")}else{this.activeNodeResponse=this._responseList[index];this.items[index].status="available";this.set("items."+index+".status","available")}}else{this.items[index].status="available";this.set("items."+index+".status","available")}})},_statusChanged:function(e){if("loading"==e.target.status){if(typeof this.items[this.active].dataUrl!==typeof void 0&&!this.disableAjaxCalls){this.$.ajax.url=this.items[this.active].dataUrl;this.$.ajax.generateRequest()}else{setTimeout(()=>{this.items[this.active].status="available";this.set("items."+this.active+".status","available");this._responseList[this.active]={};this.activeNodeResponse=this._responseList[this.active]},1500)}}else if("complete"==e.target.status&&this.items.length===this.active+1){setTimeout(()=>{this.items[this.active].status="finished";this.set("items."+this.active+".status","finished")},100)}},handleNodeResponse:function(e){const detail=e.detail;if(typeof null===typeof detail.response){setTimeout(()=>{this.items[this.active].status="available";this.set("items."+this.active+".status","available");this._responseList[this.active]=detail.response;this.activeNodeResponse=this._responseList[this.active]},1500)}else{this.items[this.active].status="available";this.set("items."+this.active+".status","available");this._responseList[this.active]=detail.response;this.activeNodeResponse=this._responseList[this.active]}},_handleNodeError:function(newValue,oldValue){if(typeof oldValue!==typeof void 0&&null!=newValue&&0!=newValue.length){this._responseList[this.active]=newValue;this.activeNodeResponse=this._responseList[this.active];this.items[this.active].status="available";this.set("items."+this.active+".status","available");this.fire("node-load-failed",{message:newValue,node:this.items[this.active]})}},_overallPercentageCompute:function(items,active){this.$.progress.classList.add("transiting");return 100*(active/(items.length-1))},changePercentage:function(percentage,mode){var newp=0;if("add"==mode){newp=this.items[this.active].value+percentage}else if("subtract"==mode){newp=this.items[this.active].value-percentage}else{newp=percentage}if(newp>=this.items[this.active].max){if(this.items.length==this.active+1){this.state="finished";this.items[this.active].status="finished";this.set("items."+this.active+".status","finished");this.items[this.active].value=this.items[this.active].max;this.set("items."+this.active+".value",this.items[this.active].max)}else{this.items[this.active].value=this.items[this.active].max;this.set("items."+this.active+".value",this.items[this.active].max)}if(this.items.length>this.active+1){if(this.progressiveUnlock&&"complete"==this.items[this.active].status&&"disabled"==this.items[this.active+1].status||typeof this._responseList[this.active+1]===typeof void 0){this.items[this.active+1].status="loading";this.set("items."+(this.active+1)+".status","loading")}this.state="active item is "+(this.active+1);this.active=this.active+1}}else{this.items[this.active].value=newp;this.set("items."+this.active+".value",newp)}},updateItems:function(op,item){var response=!1;if("push"==op){this.push("items",item);response=!0}else if("pop"==op){response=this.pop("items")}else if("splice"==op){this.splice("items",this.items.length,0,item);response=!0}const active=this.active;this.set("active",0);this.set("active",active);return response}});