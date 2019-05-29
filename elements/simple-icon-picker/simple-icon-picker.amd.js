define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/polymer/lib/utils/render-status.js","./node_modules/@lrnwebcomponents/simple-picker/simple-picker.js","./node_modules/@polymer/iron-meta/iron-meta.js"],function(_exports,_polymerElement,_renderStatus,_simplePicker,_ironMeta){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.SimpleIconPicker=void 0;function _templateObject_e198b23081c211e9a5eb5971985be23a(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: inline-flex;\n  --simple-picker-option-size: 24px;\n  --simple-picker-collapse: {\n    width: 360px;\n    height: 300px;\n    max-height: 300px;\n    overflow: scroll;\n  }\n  --simple-picker-row: {\n    justify-content: flex-start;\n  }\n  --simple-picker-option: {\n    flex: 0 0 auto;\n  }\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<simple-picker \n  aria-labelledby$=\"[[ariaLabelledby]]\"\n  disabled$=\"[[disabled]]\"\n  expanded$=\"[[expanded]]\"\n  hide-option-labels\n  label$=\"[[label]]\"\n  on-change=\"_handleChange\"\n  on-collapse=\"_handleCollapse\"\n  on-expand=\"_handleExpand\"\n  on-option-focus=\"_handleOptionFocus\"\n  options=\"[[options]]\"\n  value$=\"{{value}}\">\n</simple-picker>"]);_templateObject_e198b23081c211e9a5eb5971985be23a=function _templateObject_e198b23081c211e9a5eb5971985be23a(){return data};return data}/**
 * `simple-icon-picker`
 * `Uses simple-picker to create an icon picker`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var SimpleIconPicker=/*#__PURE__*/function(_SimplePicker){babelHelpers.inherits(SimpleIconPicker,_SimplePicker);function SimpleIconPicker(){babelHelpers.classCallCheck(this,SimpleIconPicker);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(SimpleIconPicker).apply(this,arguments))}babelHelpers.createClass(SimpleIconPicker,[{key:"ready",/**
   * life cycle, element is afixed to the DOM
   */value:function ready(){babelHelpers.get(babelHelpers.getPrototypeOf(SimpleIconPicker.prototype),"ready",this).call(this);(0,_renderStatus.afterNextRender)(this,function(){var iconSets=new _ironMeta.IronMeta({type:"iconset"});if(0===this.icons.length&&babelHelpers.typeof(iconSets)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))&&iconSets.list&&iconSets.list.length){var iconList=[];iconSets.list.forEach(function(item){item.getIconNames().forEach(function(icon){iconList.push(icon)})});this.__iconList=iconList}})}/**
   * gets a list of icons and load them in a format
   * that the simple-picker can take;
   * if no icons are provided, loads a list from iron-meta
   *
   * @param {array} a list of custom icons for the picker
   * @param {array} default list of icons for the picker
   * @param {boolean} allow a null value for the picker
   *
   */},{key:"_getOptions",value:function _getOptions(){var icons=0<arguments.length&&arguments[0]!==void 0?arguments[0]:[],__iconList=1<arguments.length&&arguments[1]!==void 0?arguments[1]:[],allowNull=2<arguments.length&&arguments[2]!==void 0?arguments[2]:!1;if("string"===typeof icons)icons=JSON.parse(icons);if(0===icons.length)icons=__iconList;for(var options=!1===allowNull?[]:[[{alt:"null",value:null}]],h=!1===allowNull?0:1,cols=16>Math.sqrt(icons.length+h)?Math.ceil(Math.sqrt(icons.length+h)):15,i=0;i<icons.length;i++){var j=h+i,row=Math.floor(j/cols),col=j-row*cols;if(options[row]===void 0||null===options[row])options[row]=[];options[row][col]={alt:icons[i],icon:icons[i],value:icons[i]}}return options}/**
   * handles when the picker's value changes
   */},{key:"_handleChange",value:function _handleChange(e){this.value=e.detail.value;this.dispatchEvent(new CustomEvent("change",{bubbles:!0,detail:this}))}/**
   * handles when the picker collapses
   */},{key:"_handleCollapse",value:function _handleCollapse(e){this.dispatchEvent(new CustomEvent("collapse",{detail:this}))}/**
   * handles when the picker expands
   */},{key:"_handleExpand",value:function _handleExpand(e){this.dispatchEvent(new CustomEvent("expand",{detail:this}))}/**
   * handles when the picker's focus changes
   */},{key:"_handleOptionFocus",value:function _handleOptionFocus(e){this.dispatchEvent(new CustomEvent("option-focus",{detail:this}))}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_e198b23081c211e9a5eb5971985be23a())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{/**
   * Allow a null option to be selected?
   */allowNull:{name:"allowNull",type:"Boolean",value:!1},/**
   * Icon picker should not have visible icon labels.
   */hideOptionLabels:{name:"hideOptionLabels",type:"Boolean",value:!0,readOnly:!0},/**
    * An array of icons by name: ```
[
  "editor:format-paint",
  "content-copy",
  "av:volume-off"
  
]```
  */icons:{name:"icons",type:"Array",value:[]},/**
    * An array of options for the picker, eg.: ```
[
  {
    "icon": "editor:format-paint",      //Optional. Used if the picker is used as an icon picker.
    "alt": "Blue",                      //Required for accessibility. Alt text description of the choice.
    "style": "background-color: blue;", //Optional. Used to set an option's style.
    ...                                 //Optional. Any other properties that should be captured as part of the selected option's value
  },...
]```
    */options:{name:"options",type:"Array",computed:"_getOptions(icons,__iconList,allowNull)"},/**
   * The value of the option.
   */value:{name:"label",type:"String",value:null,reflectToAttribute:!0,notify:!0},/**
    * An array of icons by name: ```
[
  "editor:format-paint",
  "content-copy",
  "av:volume-off"
  
]```
  */__iconList:{name:"__iconList",type:"Array","read-only":!0}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"simple-icon-picker"}}]);return SimpleIconPicker}(_simplePicker.SimplePicker);_exports.SimpleIconPicker=SimpleIconPicker;window.customElements.define(SimpleIconPicker.tag,SimpleIconPicker)});