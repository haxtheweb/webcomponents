define(["exports","meta","./node_modules/@polymer/polymer/polymer-legacy.js","./node_modules/@polymer/polymer/lib/utils/resolve-url.js","./node_modules/@polymer/paper-progress/paper-progress.js","./lib/lrnsys-progress-circle.js"],function(_exports,meta,_polymerLegacy,_resolveUrl,_paperProgress,_lrnsysProgressCircle){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.LrnsysProgress=void 0;meta=babelHelpers.interopRequireWildcard(meta);function _templateObject_71b5adb06a8411e982bf194edae7e572(){var data=babelHelpers.taggedTemplateLiteral(["\n    <custom-style>\n      <style is=\"custom-style\" include=\"paper-material-styles\">\n        :host {\n          display: block;\n          margin-top: 24px;\n        }\n        :host([size=\"tiny\"]) {\n          font-size: 12.8px;\n        }\n        :host([size=\"small\"]) {\n          font-size: 19.2px;\n        }\n        :host([size=\"medium\"]) {\n          font-size: 25.6px;\n        }\n        :host([size=\"large\"]) {\n          font-size: 44.8px;\n        }\n        :host([size=\"x-large\"]) {\n          font-size: 64px;\n        }\n        :host([size=\"epic\"]) {\n          font-size: 96px;\n        }\n        #circle-container {\n          display: flex;\n          justify-content: space-between;\n          margin: -24px 0 0 0;\n          padding: 0;\n          list-style: none;\n        }\n        .progress-title {\n          position: absolute !important;\n          clip: rect(1px 1px 1px 1px); /* IE6, IE7 */\n          clip: rect(1px, 1px, 1px, 1px);\n          overflow: hidden;\n          height: 1px;\n        }\n        paper-progress {\n          --paper-progress-height: 8px;\n          --paper-progress-transition-duration: 0.5s;\n          --paper-progress-transition-timing-function: ease;\n          --paper-progress-transition-delay: 0.4s;\n          width: 100%;\n        }\n        /* required to get the box shadow above the progress bar */\n        .circle-node {\n          z-index: 1;\n        }\n        ul#circle-container li.circle-node {\n          list-style-type: none;\n        }\n\n        :host([vertical]) {\n          width: max-content;\n        }\n        :host([vertical]) #circle-container {\n          display: block;\n        }\n        :host([vertical]) paper-progress {\n          display: none !important;\n        }\n        :host([vertical]) lrnsys-progress-circle {\n          margin: 16px 0;\n          padding: 0;\n          width: 100%;\n        }\n\n        lrnsys-progress-circle {\n          width: 40px;\n          height: 40px;\n          --lrnsys-progress-circle-size: 40px;\n          --lrnsys-progress-spinner-size: 32px;\n          --lrnsys-progress-icon-size: 24px;\n          --paper-spinner-stroke-width: 1.2px;\n        }\n      </style>\n    </custom-style>\n    <iron-ajax\n      id=\"ajax\"\n      url=\"[[activeNodeURL]]\"\n      handle-as=\"json\"\n      last-error=\"{{nodeDataError}}\"\n      on-response=\"handleNodeResponse\"\n    ></iron-ajax>\n    <h3 class=\"progress-title\">[[title]]</h3>\n    <paper-progress\n      id=\"progress\"\n      value=\"[[overallPercentage]]\"\n    ></paper-progress>\n    <ul id=\"circle-container\">\n      <template is=\"dom-repeat\" items=\"[[items]]\" as=\"item\">\n        <li class=\"circle-node\">\n          <lrnsys-progress-circle\n            play-finish-sound=\"[[soundFinish]]\"\n            play-sound=\"[[sound]]\"\n            complete-sound=\"[[completeSound]]\"\n            finished-sound=\"[[finishedSound]]\"\n            active=\"[[_isActive(index, active)]]\"\n            step=\"[[index]]\"\n            label=\"[[item.title]]\"\n            icon=\"[[item.metadata.icon]]\"\n            icon-complete=\"[[item.metadata.iconComplete]]\"\n            data-url=\"[[item.metadata.dataUrl]]\"\n            url=\"[[item.location]]\"\n            status=\"[[item.metadata.status]]\"\n            value=\"[[item.metadata.value]]\"\n            max=\"[[item.metadata.max]]\"\n            stroke-width=\"[[strokeWidth]]\"\n            tool-tip=\"[[!vertical]]\"\n            list-view=\"[[vertical]]\"\n            class$=\"[[size]]\"\n          >\n            <span slot=\"description\">[[item.description]]</span>\n          </lrnsys-progress-circle>\n        </li>\n      </template>\n    </ul>\n  "],["\n    <custom-style>\n      <style is=\"custom-style\" include=\"paper-material-styles\">\n        :host {\n          display: block;\n          margin-top: 24px;\n        }\n        :host([size=\"tiny\"]) {\n          font-size: 12.8px;\n        }\n        :host([size=\"small\"]) {\n          font-size: 19.2px;\n        }\n        :host([size=\"medium\"]) {\n          font-size: 25.6px;\n        }\n        :host([size=\"large\"]) {\n          font-size: 44.8px;\n        }\n        :host([size=\"x-large\"]) {\n          font-size: 64px;\n        }\n        :host([size=\"epic\"]) {\n          font-size: 96px;\n        }\n        #circle-container {\n          display: flex;\n          justify-content: space-between;\n          margin: -24px 0 0 0;\n          padding: 0;\n          list-style: none;\n        }\n        .progress-title {\n          position: absolute !important;\n          clip: rect(1px 1px 1px 1px); /* IE6, IE7 */\n          clip: rect(1px, 1px, 1px, 1px);\n          overflow: hidden;\n          height: 1px;\n        }\n        paper-progress {\n          --paper-progress-height: 8px;\n          --paper-progress-transition-duration: 0.5s;\n          --paper-progress-transition-timing-function: ease;\n          --paper-progress-transition-delay: 0.4s;\n          width: 100%;\n        }\n        /* required to get the box shadow above the progress bar */\n        .circle-node {\n          z-index: 1;\n        }\n        ul#circle-container li.circle-node {\n          list-style-type: none;\n        }\n\n        :host([vertical]) {\n          width: max-content;\n        }\n        :host([vertical]) #circle-container {\n          display: block;\n        }\n        :host([vertical]) paper-progress {\n          display: none !important;\n        }\n        :host([vertical]) lrnsys-progress-circle {\n          margin: 16px 0;\n          padding: 0;\n          width: 100%;\n        }\n\n        lrnsys-progress-circle {\n          width: 40px;\n          height: 40px;\n          --lrnsys-progress-circle-size: 40px;\n          --lrnsys-progress-spinner-size: 32px;\n          --lrnsys-progress-icon-size: 24px;\n          --paper-spinner-stroke-width: 1.2px;\n        }\n      </style>\n    </custom-style>\n    <iron-ajax\n      id=\"ajax\"\n      url=\"[[activeNodeURL]]\"\n      handle-as=\"json\"\n      last-error=\"{{nodeDataError}}\"\n      on-response=\"handleNodeResponse\"\n    ></iron-ajax>\n    <h3 class=\"progress-title\">[[title]]</h3>\n    <paper-progress\n      id=\"progress\"\n      value=\"[[overallPercentage]]\"\n    ></paper-progress>\n    <ul id=\"circle-container\">\n      <template is=\"dom-repeat\" items=\"[[items]]\" as=\"item\">\n        <li class=\"circle-node\">\n          <lrnsys-progress-circle\n            play-finish-sound=\"[[soundFinish]]\"\n            play-sound=\"[[sound]]\"\n            complete-sound=\"[[completeSound]]\"\n            finished-sound=\"[[finishedSound]]\"\n            active=\"[[_isActive(index, active)]]\"\n            step=\"[[index]]\"\n            label=\"[[item.title]]\"\n            icon=\"[[item.metadata.icon]]\"\n            icon-complete=\"[[item.metadata.iconComplete]]\"\n            data-url=\"[[item.metadata.dataUrl]]\"\n            url=\"[[item.location]]\"\n            status=\"[[item.metadata.status]]\"\n            value=\"[[item.metadata.value]]\"\n            max=\"[[item.metadata.max]]\"\n            stroke-width=\"[[strokeWidth]]\"\n            tool-tip=\"[[!vertical]]\"\n            list-view=\"[[vertical]]\"\n            class\\$=\"[[size]]\"\n          >\n            <span slot=\"description\">[[item.description]]</span>\n          </lrnsys-progress-circle>\n        </li>\n      </template>\n    </ul>\n  "]);_templateObject_71b5adb06a8411e982bf194edae7e572=function _templateObject_71b5adb06a8411e982bf194edae7e572(){return data};return data}/**
 * `lrnsys-progress`
 * `track progression as a circle and series of circles`
 *
 * @demo demo/index.html
 * @microcopy
 *  - node / circle - A progress circle on the line
 *  - nodes / items - the list of items in the progress bar
 *  - bubble - reserved for when events fire out of an element or value is tracking events
 *  - percentage - amount complete either in the bar or the nodes themselves
 *  - bar - the underlayed bar that's tracking overall progression
 */var LrnsysProgress=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_71b5adb06a8411e982bf194edae7e572()),is:"lrnsys-progress",listeners:{"node-is-active":"_bubbleUpChangeActive","node-status-change":"_statusChanged"},properties:{/**
     * Disable internal ajax calls as something is handling them above.
     */disableAjaxCalls:{type:Boolean,value:!1,reflectToAttribute:!0},/**
     * Items to display to visualize the progression.
     */items:{type:Array,value:[],notify:!0,observer:"_itemsChanged"},/**
     * Play sounds whenever an item is complete.
     * This can get pretty annoying though unless the items
     * won't be completed for awhile.
     */sound:{type:Boolean,value:!1,reflectToAttribute:!0},/**
     * Play sound when the user finishes the progression. This
     * could also be annoying but far less so :)
     */soundFinish:{type:Boolean,value:!1,reflectToAttribute:!0},/**
     * Play sound on complete.
     */completeSound:{type:String,value:(0,_resolveUrl.pathFromUrl)(decodeURIComponent(meta.url))+"lib/assets/complete.mp3",reflectToAttribute:!0},/**
     * Play sound on complete.
     */finishedSound:{type:String,value:(0,_resolveUrl.pathFromUrl)(decodeURIComponent(meta.url))+"lib/assets/finished.mp3",reflectToAttribute:!0},/**
     * Title of this progression, primarily for accessibility.
     */title:{type:String,value:"Steps to completion",reflectToAttribute:!0},/**
     * Items displayed at specific points on the progression.
     * These aren't filled up but place points along the progression
     * which can help people see where they are relative to other
     * factors such as % complete as a tick mark or icon.
     */keyItems:{type:Array,value:[],notify:!0},/**
     * ID of the active item.
     */active:{type:Number,value:0,notify:!0,reflectToAttribute:!0,observer:"_activeChanged"},/**
     * Whether to automatically make disabled items available
     * or not when the previous one was just complete.
     */progressiveUnlock:{type:Boolean,value:!0,reflectToAttribute:!0,notify:!0},/**
     * State of progress in the current progression
     */state:{type:String,value:null,reflectToAttribute:!0,observer:"_reportState"},/**
     * How far is the user through this series of items.
     */overallPercentage:{type:Number,computed:"_overallPercentageCompute(items, active)",reflectToAttribute:!0},/**
     * Responses for each item.
     */_responseList:{type:Array,value:[]},/**
     * Active response from the node selected.
     */activeNodeResponse:{type:String,value:"",observer:"_activeResponseChanged"},/**
     * Active response from the node selected.
     */manifest:{type:Object,value:{},notify:!0,observer:"_manifestChanged"},/**
     * Error.
     */nodeDataError:{type:Object,value:[],observer:"_handleNodeError"},/**
     * Flag to be vertical instead of horizontal.
     */vertical:{type:Boolean,value:!1},/**
     * Size to make everything, small, medium, large, and epic
     * are available class names; default medium.
     */size:{type:String,value:"medium",notify:!0,reflectToAttribute:!0},/**
     * Calculate width based on the size since we have to convert em to px.
     */strokeWidth:{type:Number,computed:"_getStrokeWidth(size)"}},/**
   * Set an appropriate stroke width based on size of the element.
   * This is because it's a hard pixel value when the rest of our
   * sizing is based on em's
   */_getStrokeWidth:function _getStrokeWidth(size){var width=4;if("tiny"==size){width=3}else if("small"==size){width=4}else if("medium"==size){width=5}else if("large"==size){width=6}else if("x-large"==size){width=7}else if("epic"==size){width=8}return width},/**
   * Fire event that state has changed with what the statement is.
   * This gives a readable name to what the state is of the progress bar
   * as well as access to the full item that triggered the state change.
   */_reportState:function _reportState(newValue,oldValue){// help avoid initial ready state being null
if(null!=newValue&&0<this.items.length){this.fire("progress-state-change",{state:this.state,active:this.items[this.active]})}},/**
   * Notice items have changed; only worry about if the count changes
   * though since other oberservers handle downstream mutation
   */_itemsChanged:function _itemsChanged(newValue,oldValue){var _this=this;// strange but this is effectively the same as "ready" except the ready
// state invokes potentially without items while this one will only
// match a case where there was no values and now we have one
if(babelHelpers.typeof(oldValue)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))&&babelHelpers.typeof(newValue)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))&&newValue.length!=oldValue.length&&babelHelpers.typeof(this._responseList[this.active])===("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){newValue[this.active].metadata.status="loading";this.set("items."+this.active+".metadata.status","loading");this.notifyPath("items."+this.active+".metadata.status");// becasue this is so early in bootstrap of the element we
// won't be able to detect the initial loading event
if(babelHelpers.typeof(newValue[this.active].dataUrl)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))&&!this.disableAjaxCalls){this.$.ajax.url=newValue[this.active].dataUrl;this.$.ajax.generateRequest()}else{setTimeout(function(){newValue[_this.active].metadata.status="available";_this.set("items."+_this.active+".metadata.status","available");_this.notifyPath("items."+_this.active+".metadata.status");_this._responseList[_this.active]={};_this.activeNodeResponse=_this._responseList[_this.active]},1200)}}},/**
   * Simple boolean for whatever is active currently.
   */_isActive:function _isActive(index,active){return index===active},/**
   * Active Response changed; bubble it up.
   */_activeResponseChanged:function _activeResponseChanged(value){this.fire("progress-response-loaded",{response:value})},/**
   * Notice event from the nodes themselves
   * and set active based on a node bubbling up an event
   * that says "Hey I am active now!"
   */_bubbleUpChangeActive:function _bubbleUpChangeActive(e){// changing active will kick off events internally
this.active=e.detail.target.step;this.fire("json-outline-schema-active-item-changed",this.items[this.active])},/**
   * Allow for JSON Outline Schema manifest structure changes
   */_manifestChanged:function _manifestChanged(newValue,oldValue){if(newValue){this.set("items",newValue.items);this.notifyPath("items.*")}},/**
   * Active item has changed, set the rest of the data to match.
   */_activeChanged:function _activeChanged(newValue,oldValue){var _this2=this;// bubble up event from state being set
this.state="active item is "+this.active;this.items.forEach(function(element,index,array){// if the current item is disabled, check the 1 prior to it if we can
if("disabled"==_this2.items[index].metadata.status){// do nothing, it's disabled unless....
if(0!=index&&_this2.progressiveUnlock&&"complete"==_this2.items[index-1].metadata.status){_this2.items[index].metadata.status="loading";_this2.set("items."+index+".metadata.status","loading");_this2.notifyPath("items."+index+".metadata.status")}}// or if our value is at max AND it's the last item in the list
else if(_this2.items[index].metadata.value>=_this2.items[index].metadata.max&&index==_this2.items.length-1){_this2.items[index].metadata.status="finished";_this2.set("items."+index+".metadata.status","finished");_this2.notifyPath("items."+index+".metadata.status")}// or if we're just at max then mark us complete
else if(_this2.items[index].metadata.value>=_this2.items[index].metadata.max){_this2.items[index].metadata.status="complete";_this2.set("items."+index+".metadata.status","complete");_this2.notifyPath("items."+index+".metadata.status")}// or if the index is the currently active item
else if(index==_this2.active){// see if we have the data for it already otherwise trigger loading
if(babelHelpers.typeof(_this2._responseList[index])===("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){_this2.items[index].metadata.status="loading";_this2.set("items."+index+".metadata.status","loading");_this2.notifyPath("items."+index+".metadata.status")}// if we already had a response, then mark available
else{_this2.activeNodeResponse=_this2._responseList[index];_this2.items[index].metadata.status="available";_this2.set("items."+index+".metadata.status","available");_this2.notifyPath("items."+index+".metadata.status")}}else{// we didn't match any cases, just leave it active
_this2.items[index].metadata.status="available";_this2.set("items."+index+".metadata.status","available");_this2.notifyPath("items."+index+".metadata.status")}})},/**
   * Listen for the state of anything below to change.
   */_statusChanged:function _statusChanged(e){var _this3=this;// we are in loading state so go load data and let the response
// dictate what state we reach after that
if("loading"==e.target.status){if(babelHelpers.typeof(this.items[this.active].metadata.dataUrl)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))&&!this.disableAjaxCalls){this.$.ajax.url=this.items[this.active].metadata.dataUrl;this.$.ajax.generateRequest()}else{setTimeout(function(){_this3.items[_this3.active].metadata.status="available";_this3.set("items."+_this3.active+".metadata.status","available");_this3.notifyPath("items."+_this3.active+".metadata.status");_this3._responseList[_this3.active]={};_this3.activeNodeResponse=_this3._responseList[_this3.active]},1500)}}else if("complete"==e.target.status&&this.items.length===this.active+1){setTimeout(function(){_this3.items[_this3.active].metadata.status="finished";_this3.set("items."+_this3.active+".metadata.status","finished");_this3.notifyPath("items."+_this3.active+".metadata.status")},100)}},/**
   * Response returned from triggering the Node's URL to fire to get a response.
   */handleNodeResponse:function handleNodeResponse(e){var _this4=this,detail=e.detail;// this means that it was an internal path, fake "loading"
if(babelHelpers.typeof(detail.response)===babelHelpers.typeof(null)){setTimeout(function(){_this4.items[_this4.active].metadata.status="available";_this4.set("items."+_this4.active+".metadata.status","available");_this4.notifyPath("items."+_this4.active+".metadata.status");_this4._responseList[_this4.active]=detail.response;_this4.activeNodeResponse=_this4._responseList[_this4.active]},1500)}// valid response, pass it along for other things to use
else{this.items[this.active].metadata.status="available";this.set("items."+this.active+".metadata.status","available");this.notifyPath("items."+this.active+".metadata.status");this._responseList[this.active]=detail.response;this.activeNodeResponse=this._responseList[this.active]}},/**
   * Weak support for error code being found
   */_handleNodeError:function _handleNodeError(newValue,oldValue){if(babelHelpers.typeof(oldValue)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))&&null!=newValue&&0!=newValue.length){// @todo, need support for a failed to load state; could be useful
// if we go into an offline capability in the future
this._responseList[this.active]=newValue;this.activeNodeResponse=this._responseList[this.active];// set available because we don't have a failed state
this.items[this.active].metadata.status="available";this.set("items."+this.active+".metadata.status","available");this.notifyPath("items."+this.active+".metadata.status");// fire an event that this isn't really available so we know an issue occured
this.fire("node-load-failed",{message:newValue,node:this.items[this.active]})}},/**
   * Calculate the overall percentage competed.
   * This forms the line that's connecting the steps.
   */_overallPercentageCompute:function _overallPercentageCompute(items,active){if(babelHelpers.typeof(items)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){this.$.progress.classList.add("transiting");return 100*(active/(items.length-1))}return 0},/**
   * Change the percentage for the active item.
   */changePercentage:function changePercentage(percentage,mode){var newp=0;// support for adding and removing percentage as well as setting
if("add"==mode){newp=this.items[this.active].metadata.value+percentage}else if("subtract"==mode){newp=this.items[this.active].metadata.value-percentage}else{newp=percentage}// after establishing the new percentage, make sure it's less then max
// if it's at or over max then we need to trigger events and state to change
if(newp>=this.items[this.active].metadata.max){if(this.items.length==this.active+1){// fire an event change to indicate that this happened
this.state="finished";this.items[this.active].metadata.status="finished";this.set("items."+this.active+".metadata.status","finished");this.notifyPath("items."+this.active+".metadata.status");// need to make sure finished happens prior to value set to 100
// otherwise this will kick off the circle to complete itself
this.items[this.active].metadata.value=this.items[this.active].metadata.max;this.set("items."+this.active+".metadata.value",this.items[this.active].metadata.max);this.notifyPath("items."+this.active+".metadata.value")}else{// set value = max which will automatically trigger complete in the circle
this.items[this.active].metadata.value=this.items[this.active].metadata.max;this.set("items."+this.active+".metadata.value",this.items[this.active].metadata.max);this.notifyPath("items."+this.active+".metadata.value")}// ensure we still have more items to go in the list
if(this.items.length>this.active+1){// if we have progressive unlocking then set the next thing available
// assuming that the next thing is currently disabled and that we're not
// on the first item. OR, if we don't have a response for the current
// item in local storage then let's mark loading to kick off the calls
if(this.progressiveUnlock&&"complete"==this.items[this.active].metadata.status&&"disabled"==this.items[this.active+1].metadata.status||babelHelpers.typeof(this._responseList[this.active+1])===("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){this.items[this.active+1].metadata.status="loading";this.set("items."+(this.active+1)+".metadata.status","loading");this.notifyPath("items."+(this.active+1)+".metadata.status")}// set state so it gets reported upstream in events
this.state="active item is "+(this.active+1);// bump active ahead 1 because we still have more items in the list
this.active=this.active+1}}else{this.items[this.active].metadata.value=newp;this.set("items."+this.active+".metadata.value",newp);this.notifyPath("items."+this.active+".metadata.value")}},/**
   * Modify items and update template binding correctly.
   */updateItems:function updateItems(op,item){var response=!1;if("push"==op){this.push("items",item);response=!0}else if("pop"==op){response=this.pop("items")}else if("splice"==op){this.splice("items",this.items.length,0,item);response=!0}// force active to reprocess
var active=this.active;this.set("active",0);this.set("active",active);this.notifyPath("active");return response}});_exports.LrnsysProgress=LrnsysProgress});