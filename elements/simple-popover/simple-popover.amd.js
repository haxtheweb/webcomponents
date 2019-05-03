define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js","./node_modules/@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js"],function(_exports,_polymerElement,_HAXWiring,_absolutePositionBehavior){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.SimplePopover=void 0;function _templateObject_0f8f39706a8511e9b2e5fb36ca546f34(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: flex;\n  align-items: center;\n  flex-direction: column-reverse;\n  --simple-popover-border-radius: 3px;\n  --simple-popover-color: #222;\n  --simple-popover-padding: 10px;\n  --simple-popover-background-color: white;\n  --simple-popover-border-color: #bbb;\n  --simple-popover-box-shadow:rgba(60, 64, 67, 0.3) 0px 4px 8px 3px;\n}\n:host([hidden]) {\n  display: none;\n}\n:host([position=\"left\"]) {\n  flex-direction: row;\n}\n:host([position=\"right\"]) {\n  flex-direction: row-reverse;\n}\n:host([position=\"top\"]) {\n  flex-direction: column;\n}\n:host #content {\n  margin: 0 auto;\n  padding: var(--simple-popover-padding);\n  color: var(--simple-popover-color);\n  background-color: var(--simple-popover-background-color);\n  border: 1px solid var(--simple-popover-border-color);\n  min-height: 20px;\n  border-radius: var(--simple-popover-border-radius);\n  box-shadow: var(--simple-popover-box-shadow);\n  @apply --simple-popover-content;\n}\n:host #pointer {\n  margin: 0 auto;\n  width: 20px;\n  height: 20px;\n  position: relative;\n  overflow: hidden;\n  flex: 0 0 20px;\n  margin: 0 0 -1px;\n}\n:host([position=\"top\"]) #pointer {\n  margin: -0.5px 0 0;\n} \n:host([position=\"left\"]) #pointer {\n  margin: 0 0 0 -1px;\n} \n:host([position=\"right\"]) #pointer {\n  margin: 0 -1px 0 0;\n} \n:host #pointer:after {\n  content: \"\";\n  position: absolute;\n  width: 10px;\n  height: 10px;\n  background-color: var(--simple-popover-background-color);\n  border: 1px solid var(--simple-popover-border-color);\n  transform: rotate(45deg); \n  top: 15px;\n  left: 5px;\n}\n:host([position=\"top\"]) #pointer:after {\n  top: -6px;\n  left: 5px;\n} \n:host([position=\"right\"]) #pointer:after {\n  top: 5px;\n  left: 15px;\n} \n:host([position=\"left\"]) #pointer:after {\n  top: 5px;\n  left: -6px;\n} </style>\n<div id=\"content\" role=\"alertdialog\">\n  <slot></slot>\n</div>\n<div id=\"pointer\"></div>"]);_templateObject_0f8f39706a8511e9b2e5fb36ca546f34=function _templateObject_0f8f39706a8511e9b2e5fb36ca546f34(){return data};return data}/**
 * `simple-popover`
 * `A popover alertdialog that is positioned next to a target element`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var SimplePopover=/*#__PURE__*/function(_AbsolutePositionBeha){babelHelpers.inherits(SimplePopover,_AbsolutePositionBeha);function SimplePopover(){babelHelpers.classCallCheck(this,SimplePopover);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(SimplePopover).apply(this,arguments))}babelHelpers.createClass(SimplePopover,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(SimplePopover.prototype),"connectedCallback",this).call(this);this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(SimplePopover.haxProperties,SimplePopover.tag,this)}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_0f8f39706a8511e9b2e5fb36ca546f34())}// haxProperty definition
},{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Simple popover",description:"A popover alertdialog that is positioned next to a target element",icon:"icons:android",color:"green",groups:["Popover"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"nikkimk",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[{property:"title",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"}],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{/**
   * Offset to compensate for the popover pointers.
   */offset:{type:Number,value:-10,readOnly:!0},/**
   * The actual target element
   */target:{type:Object,observer:"updatePosition"}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"simple-popover"}}]);return SimplePopover}(_absolutePositionBehavior.AbsolutePositionBehavior);_exports.SimplePopover=SimplePopover;window.customElements.define(SimplePopover.tag,SimplePopover)});