define(["exports","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js","./lib/UserActionBroker.js"],function(_exports,_HAXWiring,_UserActionBroker){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.UserAction=void 0;/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */ /**
 * `user-action`
 * `track user actions and allow them to talk to xAPI stores easily`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @demo demo/index.html
 */var UserAction=/*#__PURE__*/function(_HTMLElement){babelHelpers.inherits(UserAction,_HTMLElement);babelHelpers.createClass(UserAction,[{key:"html",// render function
get:function get(){return"\n<style></style>\n<slot></slot>"}// haxProperty definition
}],[{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"User action",description:"track user actions and allow them to talk to xAPI stores easily",icon:"icons:touch-app",color:"green",groups:["Action"],handles:[{type:"inline",text:""}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[{attribute:"track",title:"Track when the user: ",description:"What event to react to",inputMethod:"select",options:{visibility:"Can see this",keypress:"Presses a key here",click:"Clicks this"},required:!0,icon:"icons:android"},{attribute:"every",title:"Track every event",description:"Default behavior is just to track the first occurance",inputMethod:"boolean",required:!1,icon:"icons:android"},{slot:"",title:"Content",description:"Content that can emit events",inputMethod:"code-editor",required:!1,icon:"icons:android"}],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){var props={track:{name:"track",type:"String",value:"visibility"},every:{name:"every",type:"Boolean",value:!1},visiblelimit:{name:"visiblelimit",type:"Number",value:.5}};if(babelHelpers.get(babelHelpers.getPrototypeOf(UserAction),"properties",this)){props=Object.assign(props,babelHelpers.get(babelHelpers.getPrototypeOf(UserAction),"properties",this))}return props}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"user-action"}/**
   * life cycle
   */}]);function UserAction(){var _this,delayRender=0<arguments.length&&arguments[0]!==void 0?arguments[0]:!1;babelHelpers.classCallCheck(this,UserAction);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(UserAction).call(this));// set tag for later use
_this.tag=UserAction.tag;// map our imported properties json to real props on the element
// @notice static getter of properties is built via tooling
// to edit modify src/user-action-properties.json
var obj=UserAction.properties;for(var p in obj){if(obj.hasOwnProperty(p)){if(_this.hasAttribute(p)){var val=_this.getAttribute(p);if("Boolean"===obj[p].type){val=!0}_this[p]=val}else{_this[p]=obj[p].value}}}_this.UserActionBroker=new _UserActionBroker.UserActionBroker;return _this}/**
   * life cycle, element is afixed to the DOM
   */babelHelpers.createClass(UserAction,[{key:"connectedCallback",value:function connectedCallback(){this.__ready=!0;this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(UserAction.haxProperties,UserAction.tag,this)}},{key:"attributeChangedCallback",value:function attributeChangedCallback(attr,oldValue,newValue){if("track"===attr&&newValue){switch(newValue){// visibility isn't a real event and needs a complex solution
case"visibility":// set an interaction observer
this.observer=new IntersectionObserver(this.handleIntersectionCallback.bind(this),{root:document.rootElement,rootMargin:"0px",threshold:[0,.25,.5,.75,1]});this.observer.observe(this);break;default:this.addEventListener(newValue,this.userActionEvent.bind(this));break;}}}/**
   * Handle this being visible
   */},{key:"handleIntersectionCallback",value:function handleIntersectionCallback(entries){var _iteratorNormalCompletion=!0,_didIteratorError=!1,_iteratorError=void 0;try{for(var _iterator=entries[Symbol.iterator](),_step,entry;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=!0){entry=_step.value;if((+entry.intersectionRatio).toFixed(2)>=this.visiblelimit){if(this.__ready){this.userActionEvent({detail:"visible"})}}}}catch(err){_didIteratorError=!0;_iteratorError=err}finally{try{if(!_iteratorNormalCompletion&&null!=_iterator.return){_iterator.return()}}finally{if(_didIteratorError){throw _iteratorError}}}}/**
   * Redirect event we were monitoring into a trackable event
   */},{key:"userActionEvent",value:function userActionEvent(e){if((!this.fired||this.every)&&this.UserActionBroker.valid(this.track)){this.UserActionBroker.fireAction(this.track,e,this);this.fired=!0}else if(!this.UserActionBroker.valid(this.track)){console.warn(this.track+" was not valid")}}}],[{key:"observedAttributes",get:function get(){return["track"]}}]);return UserAction}(babelHelpers.wrapNativeSuper(HTMLElement));_exports.UserAction=UserAction;window.customElements.define(UserAction.tag,UserAction)});