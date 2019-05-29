define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js","./node_modules/@lrnwebcomponents/absolute-position-behavior/absolute-position-behavior.js"],function(_exports,_polymerElement,_HAXWiring,_absolutePositionBehavior){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.SimplePopover=void 0;function _templateObject_76af9dd081c211e984c74965efc18390(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: flex;\n  flex-direction: column-reverse;\n  justify-content: stretch;\n  --simple-popover-border-radius: 3px;\n  --simple-popover-color: #222;\n  --simple-popover-padding: 10px;\n  --simple-popover-background-color: white;\n  --simple-popover-border-color: #bbb;\n  --simple-popover-box-shadow:rgba(60, 64, 67, 0.3) 0px 4px 8px 3px;\n}\n:host([hidden]) {\n  display: none;\n}\n:host([position=\"left\"]) {\n  justify-content: start;\n  flex-direction: row;\n}\n:host([position=\"right\"]) {\n  justify-content: start;\n  flex-direction: row-reverse;\n}\n:host([position=\"top\"]) {\n  flex-direction: column;\n}\n:host > * {\n  width: 100%;\n}\n:host([position=\"left\"]) > *, \n:host([position=\"right\"]) > * {\n  width: unset;\n}\n:host #content {\n  margin: 0 auto;\n  padding: var(--simple-popover-padding);\n  color: var(--simple-popover-color);\n  background-color: var(--simple-popover-background-color);\n  border: 1px solid var(--simple-popover-border-color);\n  min-height: 20px;\n  border-radius: var(--simple-popover-border-radius);\n  box-shadow: var(--simple-popover-box-shadow);\n  @apply --simple-popover-content;\n}\n:host #pointer-outer {\n  margin: -1px;\n}\n:host #pointer {\n  width: 20px;\n  height: 20px;\n  position: relative;\n  overflow: hidden;\n  flex: 0 0 20px;\n}\n:host #pointer:after {\n  content: \"\";\n  position: absolute;\n  width: 10px;\n  height: 10px;\n  background-color: var(--simple-popover-background-color);\n  border: 1px solid var(--simple-popover-border-color);\n  transform: rotate(45deg); \n  top: 15px;\n  left: 5px;\n}\n:host([position=\"top\"]) #pointer:after {\n  top: -5px;\n  left: 5px;\n} \n:host([position=\"right\"]) #pointer:after {\n  top: 5px;\n  left: 15px;\n} \n:host([position=\"left\"]) #pointer:after {\n  top: 5px;\n  left: -5px;\n}</style>\n<div id=\"content\" role=\"alertdialog\">\n  <slot></slot>\n</div>\n<div id=\"pointer-outer\">\n  <div id=\"pointer\" style$=\"[[__pointerOffSetStyle]]\"></div>\n</div>"]);_templateObject_76af9dd081c211e984c74965efc18390=function _templateObject_76af9dd081c211e984c74965efc18390(){return data};return data}/**
 * `simple-popover`
 * `A popover alertdialog that is positioned next to a target element`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var SimplePopover=/*#__PURE__*/function(_AbsolutePositionBeha){babelHelpers.inherits(SimplePopover,_AbsolutePositionBeha);babelHelpers.createClass(SimplePopover,null,[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_76af9dd081c211e984c74965efc18390())}// haxProperty definition
},{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Simple popover",description:"A popover alertdialog that is positioned next to a target element",icon:"icons:android",color:"green",groups:["Popover"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"nikkimk",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[{property:"title",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"}],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{/**
   * Offset to compensate for the popover pointers.
   * /
  "fitToVisibleBounds": {
    "type": "Boolean",
    "value": true,
    "readOnly": true
  },
  /**
   * Tthe margin styles to offset the pointer
   */__pointerOffSetStyle:{type:"Object",computed:"_getMargins(__positions)"}}}}]);function SimplePopover(){var _this;babelHelpers.classCallCheck(this,SimplePopover);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(SimplePopover).call(this));_this.offset=-10;_this.fitToVisibleBounds=!0;return _this}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */babelHelpers.createClass(SimplePopover,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(SimplePopover.prototype),"connectedCallback",this).call(this);this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(SimplePopover.haxProperties,SimplePopover.tag,this)}/**
   * sets pointer position based on popover and target middles
   *
   * @param {object} positions object that contains postions for popover and target
   * @returns {string} a string with margin styles to offset pointer
   */},{key:"_getMargins",value:function _getMargins(positions){//this.fitToVisibleBounds = true;
var self=this.getBoundingClientRect(),h="bottom"===this.position||"top"===this.position,max=h?self.width:self.height,sStart=h?self.left:self.top,tStart=h?positions.target.left:positions.target.top,tHalf=h?positions.target.width/2:positions.target.height/2,center=tStart+tHalf-10,margin=Math.min(max-20,Math.max(0,center-sStart)),style=h?"margin: 0 0 0 ".concat(margin,"px;"):"margin: ".concat(margin,"px 0 0 0;");return style}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}],[{key:"tag",get:function get(){return"simple-popover"}}]);return SimplePopover}(_absolutePositionBehavior.AbsolutePositionBehavior);_exports.SimplePopover=SimplePopover;window.customElements.define(SimplePopover.tag,SimplePopover)});