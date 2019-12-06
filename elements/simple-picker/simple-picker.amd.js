define(["exports","require","./node_modules/lit-element/lit-element.js"],function(_exports,_require,_litElement){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.SimplePicker=void 0;_require=babelHelpers.interopRequireWildcard(_require);function _templateObject5_a0a8cc60186211ea8cb9476bbdacaed6(){var data=babelHelpers.taggedTemplateLiteral(["\n        option-","-","\n      "]);_templateObject5_a0a8cc60186211ea8cb9476bbdacaed6=function _templateObject5_a0a8cc60186211ea8cb9476bbdacaed6(){return data};return data}function _templateObject4_a0a8cc60186211ea8cb9476bbdacaed6(){var data=babelHelpers.taggedTemplateLiteral(["\n:host {\n  display: inline-flex;\n  align-items: center;\n  color: var(--simple-picker-color, black);\n  font-family: var(--simple-picker-font-family, inherit);\n  font-size: var(--simple-picker-font-size, inherit);\n  --simple-picker-height: calc(var(--simple-picker-option-size, 24px) + var(--simple-picker-sample-padding, 2px) * 2 + var(--simple-picker-border-width, 1px) * 2);\n  min-height: var(--simple-picker-height);\n  max-height: var(--simple-picker-height);\n}\n\n:host([block-label]) {\n  display: block;\n  margin: 0 0 15px;\n  max-height: unset;\n}\n\n:host([disabled]) {\n  --simple-picker-color: var(--simple-picker-color-disabled, #888);\n  --simple-picker-background-color: var(--simple-picker-background-color-disabled, #e8e8e8);\n  cursor: not-allowed;\n}\n\n:host([hidden]) {\n  display: none;\n}\n\ndiv {\n  margin: unset;\n  padding: unset;\n}\n\nlabel:not([hidden]) {\n  display: flex;\n  align-items: center;\n  padding-right: 5px;\n  font-family: var(--simple-picker-font-family, inherit);\n  color: var(--simple-picker-label-color, var(--simple-picker-color, black));\n}\n\n:host([block-label]) label:not([hidden]) {\n  display: block;\n  padding-right: 0px;\n  color: var(--simple-picker-float-label-color, var(--simple-picker-color-disabled, #888));\n  transition: all 0.5s;\n  max-height: unset;\n}\n\n:host([block-label]:focus-within) label,\n:host([block-label]:hover) label {\n  color: var(--simple-picker-float-label-active-color, var(--simple-picker-color, black));\n  transition: all 0.5s;\n}\n\n#sample, \n.rows {\n  margin: 0;\n  padding: 0;\n}\n\n#listbox {\n  cursor: pointer;\n  position: relative;\n  flex: 1 0 auto;\n  min-height: var(--simple-picker-height);\n  max-height: var(--simple-picker-height);\n}\n\n#sample {\n  display: flex;\n  flex: 1 0 auto;\n  justify-content: space-between;\n  align-items: center;\n  padding: var(--simple-picker-sample-padding, 2px);\n  border-radius: var(--simple-picker-border-radius, 2px);\n  color: var(--simple-picker-sample-color, black);\n  background-color: var(--simple-picker-background-color, #f0f0f0);\n  border-width: var(--simple-picker-border-width, 1px);\n  border-style: var(--simple-picker-border-style, solid);\n  border-color: var(--simple-picker-border-color, var(--simple-picker-color-disabled, #888));  \n}\n\n:host([hide-sample]) #sample {\n  width: var(--simple-picker-option-size);\n  overflow: visible;\n}\n\n:host(:focus-within) #sample {\n  border-width: var(--simple-picker-focus-border-width, var(--simple-picker-border-width, 1px));\n  border-style: var(--simple-picker-focus-border-style, var(--simple-picker-border-style, solid));\n  border-color: var(--simple-picker-focus-border-color, var(--simple-picker-border-color, var(--simple-picker-color-disabled, #888)));\n  transition: all 0.5s;\n}\n\n#icon {\n  transform: var(--simple-picker-icon-transform, rotate(0deg));\n  transition: transform 0.25s;\n}\n\n:host([expanded]) #icon {\n  transform: var(--simple-picker-expanded-icon-transform, rotate(0deg));\n  transition: transform 0.25s;\n}\n\n#collapse {\n  display: none;\n  width: 100%;\n  position: absolute;  \n  padding: var(--simple-picker-options-border-width, var(--simple-picker-border-width, 1px));\n  z-index: 2;\n}\n\n:host([expanded]:not([disabled])) #collapse {\n  display: block;\n} \n\n.rows {\n  display: block;\n  position: absolute;\n  z-index: 1000;  \n  left: calc(var(--simple-picker-options-border-width, var(--simple-picker-border-width, 1px)));  \n  top: calc(0px - var(--simple-picker-options-border-width, var(--simple-picker-border-width, 1px)));\n  border-width: var(--simple-picker-options-border-width, var(--simple-picker-border-width, 1px));\n  border-style: var(--simple-picker-options-border-style, var(--simple-picker-border-style, solid));\n  border-color: var(--simple-picker-options-border-color, var(--simple-picker-border-color, var(--simple-picker-color-disabled, #888)));\n  background-color: var(--simple-picker-options-background-color, #fff);\n  max-height: var(--simple-picker-options-max-height, 250px);\n  overflow-y: auto; \n}\n:host([align-right]) #collapse .rows {\n  left: unset;\n  right: calc(var(--simple-picker-options-border-width, var(--simple-picker-border-width, 1px)) *2);\n}\n\n.row {\n  display: flex; \n  align-items: stretch;\n  justify-content: space-between;\n}\n\nsimple-picker-option {\n  z-index: 1;\n  flex: 1 1 auto;\n  justify-content: flex-start;\n  max-height: unset;\n  min-height: var(--simple-picker-option-size, 24px);\n  min-width: var(--simple-picker-option-size, 24px);\n  line-height: var(--simple-picker-option-size, 24px);\n  color: var(--simple-picker-color, black);\n  background-color: var(--simple-picker-options-background-color, #fff);\n  transition: max-height 2s;\n}\n\nsimple-picker-option[selected] {\n  z-index: 50;\n  color: var(--simple-picker-color, black);\n  background-color: var(--simple-picker-option-selected-background-color, var(--simple-picker-options-background-color, #fff));\n}\n\nsimple-picker-option[active] {\n  z-index: 100;\n  cursor: pointer;\n  color: var(--simple-picker-color, black);\n  background-color: var(--simple-picker-option-active-background-color, #aaddff);\n}\n\n#sample simple-picker-option {\n  color: var(--simple-picker-color, black);\n  background-color: var(--simple-picker-sample-background-color, transparent);\n  --simple-picker-option-padding: var(--simple-picker-sample-padding, 2px) 0;\n  border: none;\n}\n\n:host([hide-sample]) #sample simple-picker-option {\n  position: absolute;\n  left: -9999px;\n  overflow: hidden;\n  width: 0;\n  height: 0;\n}\n\n:host(:focus-within) #sample simple-picker-option,\n:host(:hover) #sample simple-picker-option {\n  --simple-picker-color: var(--simple-picker-color-active, var(--simple-picker-color, black));\n}\n\n:host(:not([expanded])) #collapse simple-picker-option {\n  max-height: 0;\n  transition: max-height 1.5s;\n}\n\n@media screen and (max-width: 600px) {\n  :host {\n    position: static;\n  }\n  #collapse {\n    top: 0;\n    margin-top: 0;\n    position: relative;\n  } \n  .rows {\n    position: absolute;\n  }  \n}\n      "]);_templateObject4_a0a8cc60186211ea8cb9476bbdacaed6=function _templateObject4_a0a8cc60186211ea8cb9476bbdacaed6(){return data};return data}function _templateObject3_a0a8cc60186211ea8cb9476bbdacaed6(){var data=babelHelpers.taggedTemplateLiteral(["\n              <simple-picker-option\n                @option-focus=\"","\"\n                @set-selected-option=\"","\"\n                ?active=\"","\"\n                ?hide-option-labels=\"","\"\n                ?hidden=\"","\"\n                ?selected=\"","\"\n                ?title-as-html=\"","\" \n                .data=\"","\"\n                .icon=\"","\"\n                .id=\"option-","-","\"\n                .label=\"","\"\n                .style=","\n                aria-selected=\"","\"\n                role=\"option\"\n                tabindex=\"-1\"\n                value=\"","\">\n              </simple-picker-option>\n            "]);_templateObject3_a0a8cc60186211ea8cb9476bbdacaed6=function _templateObject3_a0a8cc60186211ea8cb9476bbdacaed6(){return data};return data}function _templateObject2_a0a8cc60186211ea8cb9476bbdacaed6(){var data=babelHelpers.taggedTemplateLiteral(["\n          <div class=\"row\">\n            ","\n          </div>\n        "]);_templateObject2_a0a8cc60186211ea8cb9476bbdacaed6=function _templateObject2_a0a8cc60186211ea8cb9476bbdacaed6(){return data};return data}function _templateObject_a0a8cc60186211ea8cb9476bbdacaed6(){var data=babelHelpers.taggedTemplateLiteral(["\n\n<label id=\"listLabel\" for=\"listbox\" .hidden=\"","\">\n  ","\n</label>\n<div id=\"listbox\"\n  .aria-activedescendant=\"","\" \n  .aria-labelledby=\"","\" \n  .disabled=\"","\"\n  role=\"listbox\" \n  tabindex=\"0\"\n  @click=\"","\"\n  @mousedown=\"","\"\n  @keydown=\"","\">\n  <div id=\"sample\">\n    <simple-picker-option \n      ?hide-option-labels=\"","\"\n      ?title-as-html=\"","\"\n      .icon=\"","\"\n      .label=\"","\"\n      .style=","\n      aria-hidden=\"true\">\n    </simple-picker-option>\n    <span id=\"icon\"><iron-icon aria-hidden=\"true\" icon=\"arrow-drop-down\"></iron-icon></span>\n  </div>\n  <div id=\"collapse\">\n    <div class=\"rows\">\n        ","\n    </div>\n  </div>\n</div>"]);_templateObject_a0a8cc60186211ea8cb9476bbdacaed6=function _templateObject_a0a8cc60186211ea8cb9476bbdacaed6(){return data};return data}/**
 * `simple-picker`
 * @customElement simple-picker
 * a simple picker for options, icons, etc.
 *
### Styling

`<simple-picker>` provides the following custom properties and mixins
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--simple-picker-font-family` | Main font-family. | inherit
`--simple-picker-font-size` | Main font-size. | inherit
`--simple-picker-color` | Main text color. | black
`--simple-picker-color-active` | Color of sample text when button is focused within or hovered. | --simple-picker-color
`--simple-picker-color-disabled` | Disabled text color. | #888
`--simple-picker-background-color` | Background color for button. | #f0f0f0
`--simple-picker-background-color-disabled` | Background color for button when picker is disabled. | #e8e8e8
`--simple-picker-border-radius` | Main border-radius. | 2px
`--simple-picker-border-width` | Default border width. | 1px
`--simple-picker-border-style` | Default border style. | solid
`--simple-picker-border-color` | Default border color. | --simple-picker-color-disabled
`--simple-picker-focus-border-width` | Border width when focused within or hovered. | --simple-picker-border-width
`--simple-picker-focus-border-style` | Border style when focused within or hovered. | --simple-picker-border-style
`--simple-picker-focus-border-color` | Border color when focused within or hovered. | --simple-picker-border-color
`--simple-picker-label-color` | Label text color. | --simple-picker-color
`--simple-picker-float-label-color` | Floating label text color. | --simple-picker-color-disabled
`--simple-picker-float-label-active-color` | Floating label text color when picker is focused or hovered. | --simple-picker-color-disabled
`--simple-picker-icon-transform` | Rotation of arrow icon by default. | rotate(0deg)
`--simple-picker-expanded-icon-transform` | Rotation of arrow icon when picker is expanded. | rotate(0deg)
`--simple-picker-sample-color` | Sample option text color. | --simple-picker-color
`--simple-picker-sample-padding` | Sample option padding. | 2px
`--simple-picker-sample-background-color` | Sample option background-color. | transparent
`--simple-picker-option-size` | Height of option. | 24px
`--simple-picker-option-selected-background-color` | Outline for currently sselected option. | --simple-picker-options-background-color
`--simple-picker-option-active-background-color` | Outline for currently active option. | #aaddff
`--simple-picker-option-padding` | padding within each simple picker option | 2px 10px
`--simple-picker-option-label-padding` | adding within each simple picker option's label | --simple-picker-option-padding
`--simple-picker-options-max-height` | Maximum amount of space listbox can use before scrolling. Use `unset` for now vertical scroll. | 250px
`--simple-picker-options-border-width` | Border width of listbox. | --simple-picker-border-width
`--simple-picker-options-border-style` | Border style of listbox. | --simple-picker-border-style
`--simple-picker-options-border-color` | Border color of listbox. | --simple-picker-border-color
`--simple-picker-options-background-color` | Background color for listbox. | #fff
`--simple-picker-height` | Calculation based on option size, padding, and border. DO NOT EDIT. | --simple-picker-option-size - --simple-picker-sample-padding * 2 - --simple-picker-border-width * 2
*

 * @demo ./demo/index.html
 */var SimplePicker=/*#__PURE__*/function(_LitElement){babelHelpers.inherits(SimplePicker,_LitElement);babelHelpers.createClass(SimplePicker,[{key:"render",// render function
value:function render(){var _this2=this;return(0,_litElement.html)(_templateObject_a0a8cc60186211ea8cb9476bbdacaed6(),!this.label||""===this.label.trim(),this.label&&""!==this.label.trim()?this.label.trim():"",this.__activeDesc,this.ariaLabelledby,this.disabled,this._handleListboxClick,this._handleListboxMousedown,this._handleListboxKeydown,this.hideOptionLabels,this.titleAsHtml,this.__selectedOption?this.__selectedOption.icon:!1,this.__selectedOption?this.__selectedOption.alt:!1,this.__selectedOption?this.__selectedOption.style:!1,this.__options?this.__options.map(function(row,rownum){return(0,_litElement.html)(_templateObject2_a0a8cc60186211ea8cb9476bbdacaed6(),row?row.map(function(option,colnum){return(0,_litElement.html)(_templateObject3_a0a8cc60186211ea8cb9476bbdacaed6(),_this2._handleOptionFocus,_this2._handleSetSelectedOption,"".concat(_this2.__activeDesc)==="option-".concat(rownum,"-").concat(colnum),_this2.hideOptionLabels,!_this2.allowNull&&!option.value,_this2.value===option.value,_this2.titleAsHtml,_this2.data,option.icon,rownum,colnum,option.alt,option.style,_this2.value===option.value?"true":"false",option.value)}):"")}):"")}// properties available to the custom element for data binding
}],[{key:"styles",//styles function
get:function get(){return[(0,_litElement.css)(_templateObject4_a0a8cc60186211ea8cb9476bbdacaed6())]}},{key:"properties",get:function get(){return babelHelpers.objectSpread({},babelHelpers.get(babelHelpers.getPrototypeOf(SimplePicker),"properties",this),{/**
   * llow a null value?
   * Default behavior/false will select first option and set value accordingly.
   */allowNull:{type:Boolean,reflect:!0,attribute:"allow-null"},/**
   * Align right edges of listbox and button?
   * Default behavior/false aligns to left edges.
   */alignRight:{type:Boolean,reflect:!0,attribute:"align-right"},/**
   * Optional. Sets aria-labelledby attribute
   */ariaLabelledby:{type:String,attribute:"aria-labelledby"},/**
   * Position label above select dropdown?
   */blockLabel:{type:Boolean,reflect:!0,attribute:"block-label"},/**
   * Is picker disabled?
   */disabled:{type:Boolean,reflect:!0},/**
   * Is it expanded?
   */expanded:{type:Boolean,reflect:!0,attribute:"expanded"},/**
   * Hide option labels? As color-picker or icon-picker, labels may be redundant.
   * This option would move labels off-screen so that only screen-readers will have them.
   */hideOptionLabels:{type:Boolean,reflect:!0,attribute:"hide-option-labels"},/**
   * Hide selected item sample?
   * Default behavior/false shows a sample without expanding menu.
   */hideSample:{type:Boolean,reflect:!0,attribute:"hide-sample"},/**
   * Optional. Label for picker input
   */label:{type:String},/**
   * An array of options for picker, eg.: 
[
  [
    {
      "icon": "editor:format-paint",      //Optional. Used if picker is used as an icon picker.
      "alt": "Blue",                      //Required for accessibility. Alt text description of choice.
      "style": "background-color: blue;", //Optional. Used to set an option's style.
      ...                                 //Optional. Any other properties that should be captured as part of selected option's value
    },...
  ]
]
   */options:{type:Array},/**
   * Renders html as title. (Good for titles with HTML in them.)
   */titleAsHtml:{type:Boolean,attribute:"title-as-html"},/**
   * An string that stores current value for picker
   */value:{type:String,reflect:!0},/**
   * Aria-activedescendant attribute (active option's ID)
   */__activeDesc:{type:String},/**
   * An array of options for picker, eg.: `
[
  [
    {
      "icon": "editor:format-paint",      //Optional. Used if picker is used as an icon picker.
      "alt": "Blue",                      //Required for accessibility. Alt text description of choice.
      "style": "background-color: blue;", //Optional. Used to set an option's style.
      ...                                 //Optional. Any other properties that should be captured as part of selected option's value
    },...
  ]
]`
   */__options:{type:Array},/**
   * Selected option based on value of picker
   */__selectedOption:{type:Object}})}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"simple-picker"}// life cycle
}]);function SimplePicker(){var _this;babelHelpers.classCallCheck(this,SimplePicker);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(SimplePicker).call(this));new Promise(function(res,rej){return _require.default(["./node_modules/@polymer/iron-icon/iron-icon.js"],res,rej)});new Promise(function(res,rej){return _require.default(["./node_modules/@polymer/iron-icons/iron-icons.js"],res,rej)});new Promise(function(res,rej){return _require.default(["./lib/simple-picker-option.js"],res,rej)});_this.tag=SimplePicker.tag;_this.allowNull=!1;_this.alignRight=!1;_this.ariaLabelledby=null;_this.blockLabel=!1;_this.disabled=!1;_this.expanded=!1;_this.hideOptionLabels=!1;_this.hideSample=!1;_this.label=null;_this.__options=[[]];_this.options=[[{icon:null,style:null,alt:null,value:null}]];_this.titleAsHtml=!1;_this.value=null;_this.__activeDesc="option-0-0";_this.__hasLabel=!0;_this.__selectedOption={};_this.addEventListener("blur",function(e){this.expanded=!1});// map our imported properties json to real props on the element
// @notice static getter of properties is built via tooling
// to edit modify src/test-lit-properties.json
var obj=SimplePicker.properties;for(var p in obj){if(obj.hasOwnProperty(p)){if(_this.hasAttribute(p)){_this[p]=_this.getAttribute(p)}else{if(p.reflect)_this.setAttribute(p,obj[p].value);_this[p]=obj[p].value}}}return _this}babelHelpers.createClass(SimplePicker,[{key:"updated",value:function updated(changedProperties){var _this3=this;changedProperties.forEach(function(oldValue,propName){if("value"===propName)_this3._valueChanged(_this3.value,oldValue);if("options"===propName)_this3._optionsChanged(_this3.value,oldValue)});/**
     * Fires when properties change
     * @event changed
     */this.dispatchEvent(new CustomEvent("changed",{detail:this}))}/**
   * returns value of selected option.
   *
   * @param {array} options array of options
   * @param {string} optionId selected option's id
   * @returns {object} selected option
   */},{key:"_getOption",value:function _getOption(options,optionId){if(options!==void 0&&optionId!==void 0&&null!==optionId){var coords=optionId.split("-");return options[coords[1]][coords[2]]}return null}/**
   * sets a new active descendant and sets focus on it
   *
   * @param {number} rownum row number to be tested
   * @param {number} colnum column number to be tested
   * @returns {void}
   */},{key:"_goToOption",value:function _goToOption(rownum,colnum){var targetId=(0,_litElement.html)(_templateObject5_a0a8cc60186211ea8cb9476bbdacaed6(),rownum,colnum),target=this.shadowRoot.querySelector("#"+targetId),active=this.shadowRoot.querySelector("#"+this.__activeDesc);if(null!==target){target.tabindex=0;//allow item to be focusable.
target.focus();active.tabindex=-1;//prevent tabbing between options.
}}/**
   * handles listbox click event
   * @param {event} e event
   * @returns {void}
   */},{key:"_handleListboxClick",value:function _handleListboxClick(e){/**
     * handles listbox click event
     * @event click
     */this.dispatchEvent(new CustomEvent("click",{detail:this}));this._toggleListbox()}/**
   * handles listbox mousedown event
   * @param {event} e event
   * @returns {void}
   */},{key:"_handleListboxMousedown",value:function _handleListboxMousedown(e){/**
     * fires with listbox mousedown event
     * @event mousedown
     */this.dispatchEvent(new CustomEvent("mousedown",{detail:this}))}/**
   * handles listbox keyboard events
   * @param {event} e event
   * @returns {void}
   */},{key:"_handleListboxKeydown",value:function _handleListboxKeydown(e){/**
     * fires with listbox keyboard events
     * @event keydown
     */this.dispatchEvent(new CustomEvent("keydown",{detail:this}));var coords=this.__activeDesc.split("-"),rownum=parseInt(coords[1]),colnum=parseInt(coords[2]);if(32===e.keyCode){//spacebar
e.preventDefault();this._toggleListbox()}else if(this.expanded&&[9,35,36,38,40].includes(e.keyCode)){e.preventDefault();if(35===e.keyCode){//end
var lastrow=this.options.length-1,lastcol=this.options[lastrow].length-1;this._goToOption(lastrow,lastcol);//move to last option
}else if(36===e.keyCode){//home
this._goToOption(0,0);//move to first option
}else if(38===e.keyCode){//previous (up arrow)
if(0<colnum){this._goToOption(rownum,colnum-1);//move up to previous column
}else if(0<rownum){this._goToOption(rownum-1,this.options[rownum-1].length-1);//move up to end of previous row
}}else if(40===e.keyCode){//next (down arrow)
if(colnum<this.options[rownum].length-1){//move down to next column
this._goToOption(rownum,colnum+1)}else if(rownum<this.options.length-1){//move down to beginning of next row
this._goToOption(rownum+1,[0])}}}}/**
   * handles option focus event and sets active descendant
   * @param {event} e event
   * @returns {void}
   */},{key:"_handleOptionFocus",value:function _handleOptionFocus(e){this._setActiveOption(e.detail.id)}/**
   * sets  active descendant to a given option's id
   * @param {string} id option id
   * @returns {void}
   */},{key:"_setActiveOption",value:function _setActiveOption(id){this.__activeDesc=id;/**
     * fires when active descendant changes
     * @event option-focus
     */this.dispatchEvent(new CustomEvent("option-focus",{detail:this}))}/**
   * handles change in value
   *
   * @param {object} newValue new value for picker
   * @param {object} oldValue old value for picker
   * @returns {void}
   */},{key:"_valueChanged",value:function _valueChanged(newValue,oldValue){this._setSelectedOption(newValue,oldValue);/**
     * fires when value changes
     * @event value-changed
     */this.dispatchEvent(new CustomEvent("value-changed",{detail:this}))}/**
   * handles change in options
   * @param {object} newValue new options for picker
   * @param {object} oldValue old options for picker
   * @returns {void}
   */},{key:"_optionsChanged",value:function _optionsChanged(newValue,oldValue){this._setSelectedOption(newValue,oldValue)}/**
   * sets selected option to a given option's id
   * @returns {void}
   */},{key:"_setSelectedOption",value:function _setSelectedOption(newVal,oldVal){var sel=!this.allowNull&&0<this.options.length&&0<this.options[0].length?this.options[0][0].value:null;if(this.options){this.__options="string"===typeof this.options?JSON.parse(this.options):this.options.slice();//if nulls are allowed, set active descendant to first not null option
this.__activeDesc=this.allowNull?"option-0-0":null;for(var i=0;i<this.__options.length;i++){for(var j=0;j<this.__options[i].length;j++){//if unset, set active descendant to first not null option
if(null!==this.value&&null===this.__activeDesc)this.__activeDesc="option-".concat(i,"-").concat(j);if("".concat(this.__options[i][j].value)==="".concat(this.value)){//set active descendant to option that matches value
this.__activeDesc="option-".concat(i,"-").concat(j);sel=this.__options[i][j]}}}}if(null===sel)this.value=null;this.__selectedOption=sel;/**
     * fires when options or value changes
     * @event change
     */this.dispatchEvent(new CustomEvent("change",{bubbles:!0,detail:this}))}/**
   * toggles listbox
   *
   * @param {boolean} open whether to open
   * @returns {void}
   */},{key:"_toggleListbox",value:function _toggleListbox(){var open=0<arguments.length&&arguments[0]!==void 0?arguments[0]:!this.expanded;if(this.disabled)return;var active=this.shadowRoot.querySelector("#"+this.__activeDesc);this.expanded=open;if(open){if(null!==active)active.focus();/**
       * fires when listbox is expanded
       * @event expand
       */this.dispatchEvent(new CustomEvent("expand",{detail:this}))}else{if(null!==active)this.value=active.getAttribute("value");/**
       * fires when listbox is collapsed
       * @event collapse
       */this.dispatchEvent(new CustomEvent("collapse",{detail:this}))}}/**
   * sets options for picker
   *
   * @param {array} options nested array of options
   * @returns {void}
   */},{key:"setOptions",value:function setOptions(options){this.set("options",[[]]);this.set("options",options)}/**
   * life cycle, element is removed from DOM
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){this.removeEventListener("blur",function(e){this.expanded=!1});babelHelpers.get(babelHelpers.getPrototypeOf(SimplePicker.prototype),"disconnectedCallback",this).call(this)}}]);return SimplePicker}(_litElement.LitElement);_exports.SimplePicker=SimplePicker;window.customElements.define(SimplePicker.tag,SimplePicker)});