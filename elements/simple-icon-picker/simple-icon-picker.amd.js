define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/polymer/lib/utils/render-status.js","./node_modules/@lrnwebcomponents/simple-picker/simple-picker.js","./node_modules/@polymer/iron-meta/iron-meta.js"],function(_exports,_polymerElement,_renderStatus,_simplePicker,_ironMeta){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.SimpleIconPicker=void 0;function _templateObject_ac8ee6a0ab1511e9b1727b856a16c864(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host(simple-icon-picker) #collapse {\n  width: 300px;\n  height: 300px;\n  max-height: 300px;\n  overflow: auto;\n}\n:host(simple-icon-picker) .row {\n  justify-content: flex-start;\n}\n:host(simple-icon-picker) simple-picker-option {\n  flex: 0 0 auto;\n}\n</style>\n",""]);_templateObject_ac8ee6a0ab1511e9b1727b856a16c864=function _templateObject_ac8ee6a0ab1511e9b1727b856a16c864(){return data};return data}/**
 * `simple-icon-picker`
 * `Uses simple-picker to create an icon picker`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var SimpleIconPicker=/*#__PURE__*/function(_SimplePicker){babelHelpers.inherits(SimpleIconPicker,_SimplePicker);babelHelpers.createClass(SimpleIconPicker,null,[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_ac8ee6a0ab1511e9b1727b856a16c864(),babelHelpers.get(babelHelpers.getPrototypeOf(SimpleIconPicker),"template",this))}// properties available to the custom element for data binding
},{key:"properties",get:function get(){var props={/**
   * Allow a null option to be selected?
   */allowNull:{name:"allowNull",type:Boolean,value:!1,observer:"_getOptions"},/**
    * An array of icons by name: ```
[
  "editor:format-paint",
  "content-copy",
  "av:volume-off"
  
]```
  */icons:{name:"icons",type:Array,value:[],observer:"_getOptions"},/**
   * The value of the option.
   */value:{name:"value",type:String,value:null,reflectToAttribute:!0,notify:!0},/**
   * the maximum number of options per row
   */optionsPerRow:{optionSize:"optionsPerRow",type:Number,value:10,observer:"_getOptions"},/**
    * An array of icons by name: ```
[
  "editor:format-paint",
  "content-copy",
  "av:volume-off"
  
]```
  */__iconList:{name:"__iconList",type:Array,"read-only":!0,observer:"_getOptions"}};if(babelHelpers.get(babelHelpers.getPrototypeOf(SimpleIconPicker),"properties",this)){props=Object.assign(props,babelHelpers.get(babelHelpers.getPrototypeOf(SimpleIconPicker),"properties",this))}return props}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"simple-icon-picker"}}]);function SimpleIconPicker(){var _this;babelHelpers.classCallCheck(this,SimpleIconPicker);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(SimpleIconPicker).call(this));_this.hideOptionLabels=!0;return _this}/**
   * life cycle, element is afixed to the DOM
   */babelHelpers.createClass(SimpleIconPicker,[{key:"ready",value:function ready(){babelHelpers.get(babelHelpers.getPrototypeOf(SimpleIconPicker.prototype),"ready",this).call(this);(0,_renderStatus.afterNextRender)(this,function(){var iconSets=new _ironMeta.IronMeta({type:"iconset"});if(0===this.icons.length&&babelHelpers.typeof(iconSets)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))&&iconSets.list&&iconSets.list.length){var iconList=[];iconSets.list.forEach(function(item){item.getIconNames().forEach(function(icon){iconList.push(icon)})});this.__iconList=iconList;this._setSelectedOption()}})}/**
   * gets a list of icons and load them in a format
   * that the simple-picker can take;
   * if no icons are provided, loads a list from iron-meta
   *
   * @param {array} a list of custom icons for the picker
   * @param {array} default list of icons for the picker
   * @param {boolean} allow a null value for the picker
   *
   */},{key:"_getOptions",value:function _getOptions(){var icons="string"===typeof this.icons?JSON.parse(this.icons):this.icons,collapse=this.shadowRoot.querySelector("#collapse"),cols=this.optionsPerRow;if(0===icons.length&&this.__iconList&&0<this.__iconList.length)icons=this.__iconList;var options=!1===this.allowNull?[]:[[{alt:"null",value:null}]],h=!1===this.allowNull?0:1;cols=Math.sqrt(icons.length+h)<=this.optionsPerRow?Math.ceil(Math.sqrt(icons.length+h)):this.optionsPerRow;for(var i=0;i<icons.length;i++){var j=h+i,row=Math.floor(j/cols),col=j-row*cols;if(options[row]===void 0||null===options[row])options[row]=[];options[row][col]={alt:icons[i],icon:icons[i],value:icons[i]}}this.set("options",options);var option=this.shadowRoot.querySelector("simple-picker-option");if(collapse&&option)collapse.style.width=cols*option.offsetWidth+15+"px"}/**
   * Don't set the selection option until there are options rendered
   */},{key:"_setSelectedOption",value:function _setSelectedOption(){if(1<this.options.length)babelHelpers.get(babelHelpers.getPrototypeOf(SimpleIconPicker.prototype),"_setSelectedOption",this).call(this)}}]);return SimpleIconPicker}(_simplePicker.SimplePicker);_exports.SimpleIconPicker=SimpleIconPicker;window.customElements.define(SimpleIconPicker.tag,SimpleIconPicker)});