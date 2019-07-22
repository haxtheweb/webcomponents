define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/iron-icon/iron-icon.js","./node_modules/@polymer/iron-icons/iron-icons.js","./lib/simple-picker-option.js"],function(_exports,_polymerElement,_ironIcon,_ironIcons,_simplePickerOption){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.SimplePicker=void 0;function _templateObject_e2993da0ab1411e9888cc36fe13239be(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: inline-flex;\n  align-items: center;\n  color: var(--simple-picker-color, black);\n  font-family: var(--simple-picker-font-family, inherit);\n  font-size: var(--simple-picker-font-size, inherit);\n  max-height: calc(var(--simple-picker-option-size, 24px) + 18px);\n  @apply --simple-picker;\n}\n\n:host([block-label]) {\n  display: block;\n  margin: 0 0 15px;\n  max-height: unset;\n}\n\n:host([disabled]) {\n  cursor: not-allowed;\n}\n\n:host([hidden]) {\n  display: none;\n}\n\n:host label:not([hidden]) {\n  padding-right: 5px;\n  font-family: var(--simple-picker-font-family, inherit);\n  color: var(--simple-picker-label-color, var(--simple-picker-color, black));\n  max-height: calc(var(--simple-picker-option-size, 24px) + 4px);\n  @apply --simple-picker-label;\n}\n\n:host([block-label]) label:not([hidden]) {\n  display: block;\n  padding-right: 0px;\n  color: var(--simple-picker-float-label-color, #888);\n  transition: all 0.5s;\n  max-height: unset;\n}\n\n:host([block-label]:focus) label,\n:host([block-label]:hover) label {\n  color: var(--simple-picker-float-label-active-color, var(--simple-picker-color, black));\n}\n\n:host #sample, \n:host .rows {\n  margin: 0;\n  padding: 0;\n}\n\n:host #listbox {\n  cursor: pointer;\n  display: flex;\n  position: relative;\n  flex: 1 0 auto;\n  max-height: calc(var(--simple-picker-option-size, 24px) + 4px);\n}\n\n:host #sample {\n  display: flex;\n  flex: 1 0 auto;\n  justify-content: space-between;\n  align-items: center;\n  padding: 2px;\n  border-radius: 2px;\n  background-color: var(--simple-picker-background-color,#f0f0f0);\n  border: 1px solid var(--simple-picker-border-color, var(--simple-picker-color, black));\n  @apply --simple-picker-sample;\n}\n:host(:focus) #sample,\n:host #listbox:focus #sample,\n:host #sample:focus {\n  border: 2px solid var(--simple-picker-focus-border-color, var(--simple-picker-color, black));\n  @apply --simple-picker-sample-focus;\n}\n\n:host #listbox:focus {\n  outline: none;\n}\n\n:host #icon {\n  transform: var(--simple-picker-icon-tranform, rotate(0deg));\n  transition: transform 0.25s;\n}\n\n:host([expanded]) #icon {\n  transform: var(--simple-picker-expanded-icon-tranform, rotate(0deg));\n  transition: transform 0.25s;\n}\n\n:host #collapse {\n  display: none;\n  width: 100%;\n  position: absolute;\n  top: calc(var(--simple-picker-option-size, 24px) + 4px);\n  padding: 0 1px;\n  z-index: 2;\n  @apply --simple-picker-collapse;\n}\n\n:host([expanded]:not([disabled])) #collapse {\n  display: block;\n} \n\n:host .rows {\n  display: block;\n  position: absolute;\n  z-index: 1000;\n  outline: 1px solid var(--simple-picker-border-color, var(--simple-picker-color, black));;\n  background-color: var(--simple-picker-background-color,#f0f0f0);\n  box-shadow: 0px 0px 1px #888;\n  @apply --simple-picker-rows;\n}\n\n:host .row {\n  display: flex; \n  align-items: stretch;\n  justify-content: space-between;\n  @apply --simple-picker-row;\n}\n\n:host simple-picker-option {\n  z-index: 1;\n  flex: 1 1 auto;\n  justify-content: flex-start;\n  max-height: unset;\n  min-height: var(--simple-picker-option-size, 24px);\n  min-width: var(--simple-picker-option-size, 24px);\n  line-height: var(--simple-picker-option-size, 24px);\n  color: var(--simple-picker-color);\n  background-color: var(--simple-picker-option-background-color, #ffffff);\n  outline: var(--simple-picker-option-outline, none);\n  transition: max-height 2s;\n  @apply --simple-picker-option;\n}\n\n:host(:not([value])) #sample simple-picker-option,\n:host([value=\"null\"]) #sample simple-picker-option {\n  @apply --simple-picker-sample-null;\n  --simple-picker-option-label: {\n    @apply --simple-picker-sample-null-label;\n  };\n}\n\n:host simple-picker-option[selected] {\n  z-index: 50;\n  color: var(--simple-picker-color);\n  background-color: var(--simple-picker-selected-option-background-color, #e8e8e8);\n  outline: var(--simple-picker-selected-option-outline, none);\n}\n\n:host simple-picker-option[active] {\n  z-index: 100;\n  cursor: pointer;\n  color: var(--simple-picker-color);\n  background-color: var(--simple-picker-active-option-background-color, #aaddff);\n  outline: var(--simple-picker-active-option-outline, none);\n}\n\n:host #sample simple-picker-option {\n  color: var(--simple-picker-sample-color,  var(--simple-picker-color));\n  background-color: var(--simple-picker-sample-background-color, transparent);\n  --simple-picker-option-padding: 2px 0;\n  --simple-picker-option-label: {\n    @apply --simple-picker-sample-label;\n  }\n  @apply --simple-picker-sample-option;\n  border: none;\n}\n\n:host(:not([expanded])) #collapse simple-picker-option {\n  max-height: 0;\n  transition: max-height 1.5s;\n}\n\n:host #collapse simple-picker-option:not([value]),\n:host #collapse simple-picker-option[value=null] {\n  @apply --simple-picker-option-null;\n}\n\n@media screen and (max-width: 600px) {\n  :host {\n    position: static;\n  }\n  :host #collapse {\n    top: 0;\n    margin-top: 0;\n    position: relative;\n  } \n  :host .rows {\n    position: sticky;\n  }  \n}\n</style>\n<label id=\"listLabel\" for=\"listbox\" hidden$=\"[[!hasLabel]]\">[[label]]</label>\n<div id=\"listbox\"\n  aria-activedescendant$=\"[[__activeDesc]]\" \n  aria-labelledby$=\"[[ariaLabelledby]]\" \n  disabled$=\"[[disabled]]\"\n  role=\"listbox\" \n  tabindex=\"0\">\n  <div id=\"sample\">\n    <simple-picker-option \n      aria-hidden=\"true\" \n      hide-option-labels$=\"[[hideOptionLabels]]\"\n      icon$=\"[[__selectedOption.icon]]\"\n      label$=\"[[__selectedOption.alt]]\"\n      style$=\"[[__selectedOption.style]]\" \n      title-as-html$=\"[[titleAsHtml]]\">\n    </simple-picker-option>\n    <span id=\"icon\"><iron-icon aria-hidden=\"true\" icon=\"arrow-drop-down\"></iron-icon></span>\n  </div>\n  <div id=\"collapse\">\n    <div class=\"rows\">\n      <template is=\"dom-repeat\" items=\"[[__options]]\" as=\"row\" index-as=\"rownum\" restamp>\n        <div class=\"row\">\n          <template is=\"dom-repeat\" items=[[row]] as=\"option\" index-as=\"colnum\" restamp>\n            <simple-picker-option \n              active$=\"[[_isActive(__activeDesc,rownum,colnum)]]\"\n              aria-selected$=\"[[_isSelected(value,option.value)]]\"\n              data$=\"[[data]]\"\n              hide-option-labels$=\"[[hideOptionLabels]]\"\n              hidden$=\"[[_hideNullOption(option.value,allowNull)]]\"\n              icon$=\"[[option.icon]]\"\n              id$=\"[[_getOptionId(rownum,colnum)]]\"\n              label$=\"[[option.alt]]\"\n              role=\"option\"\n              selected$=\"[[_isSelected(value,option.value)]]\"\n              on-option-focus=\"_handleOptionFocus\"\n              on-set-selected-option=\"_handleSetSelectedOption\"\n              style$=\"[[option.style]]\" \n              tabindex=\"-1\"\n              title-as-html$=\"[[titleAsHtml]]\"\n              value=\"[[option.value]]\">\n            </simple-picker-option>\n          </template>\n        </div>\n      </template>\n    </div>\n  </div>\n</div>"]);_templateObject_e2993da0ab1411e9888cc36fe13239be=function _templateObject_e2993da0ab1411e9888cc36fe13239be(){return data};return data}/**
 * `simple-picker`
 * `a simple picker for options, icons, etc.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var SimplePicker=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(SimplePicker,_PolymerElement);function SimplePicker(){babelHelpers.classCallCheck(this,SimplePicker);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(SimplePicker).apply(this,arguments))}babelHelpers.createClass(SimplePicker,[{key:"_getOption",/**
   * returns the value of the selected option.
   *
   * @param {string} options the options
   * @param {string} optionId the selected option's id
   * @returns {object} the selected option
   */value:function _getOption(options,optionId){if(options!==void 0&&optionId!==void 0&&null!==optionId){var coords=optionId.split("-");return options[coords[1]][coords[2]]}return null}/**
   * returns a unique id for the option based on its row and column.
   *
   * @param {number} rownum the row number
   * @param {number} colnum the column number
   * @returns {string} a unique id
   */},{key:"_getOptionId",value:function _getOptionId(rownum,colnum){return"option-"+rownum+"-"+colnum}/**
   * sets a new active descendant and sets focus on it
   *
   * @param {number} rownum the row number to be tested
   * @param {number} colnum the column number to be tested
   * @returns {void}
   */},{key:"_goToOption",value:function _goToOption(rownum,colnum){var targetId=this._getOptionId(rownum,colnum),target=this.shadowRoot.querySelector("#"+targetId),active=this.shadowRoot.querySelector("#"+this.__activeDesc);if(null!==target){target.tabindex=0;//allow the item to be focusable.
target.focus();active.tabindex=-1;//prevent tabbing between options.
}}/**
   * handles listbox click event
   *
   * @param {event} e the event
   * @param {string} type the type of event
   * @returns {void}
   */},{key:"_handleListboxEvent",value:function _handleListboxEvent(e,type){this.dispatchEvent(new CustomEvent(type,{detail:this}));if("click"===type)this._toggleListbox(!this.expanded)}/**
   * handles listbox keyboard events
   *
   * @param {event} e the event
   * @returns {void}
   */},{key:"_handleListboxKeydown",value:function _handleListboxKeydown(e){this.dispatchEvent(new CustomEvent("keydown",{detail:this}));var coords=this.__activeDesc.split("-"),rownum=parseInt(coords[1]),colnum=parseInt(coords[2]);if(32===e.keyCode){//spacebar
e.preventDefault();this._toggleListbox(!this.expanded)}else if(this.expanded&&[9,35,36,38,40].includes(e.keyCode)){e.preventDefault();if(35===e.keyCode){//end
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
   * handles option focus event and sets the active descendant
   *
   * @param {event} e the event
   * @returns {void}
   */},{key:"_handleOptionFocus",value:function _handleOptionFocus(e){this._setActiveOption(e.detail.id)}/**
   * Determines if a label should be added
   *
   * @param {string} label
   * @returns {boolean} if there is a label
   */},{key:"_setLabel",value:function _setLabel(){var label=this.shadowRoot.querySelector("#listLabel");this.hasLabel=this.label!==void 0&&null!==this.label&&""!==this.label.trim();label.innerHTML=this.label!==void 0&&null!==this.label&&""!==this.label.trim()?this.label.trim():""}/**
   * determines if an option is hidden a d can't be selected
   *
   * @param {string} val option value
   * @param {boolean} allowNull whether or not null option can be selected
   * @returns {boolean} whether or not the option should be hidden
   */},{key:"_hideNullOption",value:function _hideNullOption(val,allowNull){return!allowNull&&(val===void 0||null===val)}/**
   * gets sets active option based on a row and column
   *
   * @param {string} active active option's id
   * @param {number} rownum the row number to be tested
   * @param {number} colnum the column number to be tested
   * @returns {boolean} whether or not the option is at the given row and column
   */},{key:"_isActive",value:function _isActive(active,rownum,colnum){return active===this._getOptionId(rownum,colnum)}/**
   * determines if an option is at a given row and column
   *
   * @param {string} value1 current value
   * @param {string} value2 an option's value
   * @returns {boolean} whether or not the option is selected
   */},{key:"_isSelected",value:function _isSelected(value1,value2){return value1===value2}/**
   * sets the  active descendant to a given option's id
   *
   * @param {string} id the option id
   * @returns {void}
   */},{key:"_setActiveOption",value:function _setActiveOption(id){this.__activeDesc=id;this.dispatchEvent(new CustomEvent("option-focus",{detail:this}))}/**
   * sets the selected option to a given option's id
   * @returns {void}
   */},{key:"_setSelectedOption",value:function _setSelectedOption(){var sel=null;if(this.options!==void 0&&null!==this.options){this.set("__options","string"===typeof this.options?JSON.parse(this.options):this.options.slice());//if nulls are allowed, set the active descendant to the first not null option
this.__activeDesc=this.allowNull?"option-0-0":null;for(var i=0;i<this.__options.length;i++){for(var j=0;j<this.__options[i].length;j++){//if unset, set the active descendant to the first not null option
if(null!==this.value&&null===this.__activeDesc)this.__activeDesc="option-"+i+"-"+j;if(this.__options[i][j].value===this.value){//set the active descendant to the option that matches the value
this.__activeDesc="option-"+i+"-"+j;sel=this.__options[i][j]}}}}if(null===sel)this.value=null;this.__selectedOption=sel;this.dispatchEvent(new CustomEvent("change",{bubbles:!0,detail:this}))}/**
   * toggles the listbox
   *
   * @param {boolean} expanded is the listbox expanded?
   * @returns {void}
   */},{key:"_toggleListbox",value:function _toggleListbox(expanded){var active=this.shadowRoot.querySelector("#"+this.__activeDesc);this.expanded=expanded;if(expanded){if(null!==active)active.focus();this.dispatchEvent(new CustomEvent("expand",{detail:this}))}else{if(null!==active)this.value=active.getAttribute("value");this.dispatchEvent(new CustomEvent("collapse",{detail:this}))}}/**
   * Set event listeners
   * @returns {void}
   */},{key:"ready",value:function ready(){babelHelpers.get(babelHelpers.getPrototypeOf(SimplePicker.prototype),"ready",this).call(this);var root=this;if(this.$.listbox!==void 0){this.$.listbox.addEventListener("click",function(e){root._handleListboxEvent(e,"click")});this.$.listbox.addEventListener("mousedown",function(e){root._handleListboxEvent(e,"mousedown")});this.$.listbox.addEventListener("keydown",function(e){root._handleListboxKeydown(e)});this.addEventListener("blur",function(e){this.expanded=!1})}}/**
   * sets the options for the picker
   *
   * @param {array} options the nested array of options
   * @returns {void}
   */},{key:"setOptions",value:function setOptions(options){this.set("options",[[]]);this.set("options",options)}/**
   * life cycle, element is afixed to the DOM
   * @returns {void}
   */},{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(SimplePicker.prototype),"connectedCallback",this).call(this)}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_e2993da0ab1411e9888cc36fe13239be())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){var props={allowNull:{name:"allowNull",type:Boolean,value:!1,reflectToAttribute:!0},/**
   * Optional. Sets the aria-labelledby attribute
   */ariaLabelledby:{name:"ariaLabelledby",type:String,value:null},/**
   * Position label above select dropdown?
   */blockLabel:{name:"blockLabel",type:Boolean,value:!1,reflectToAttribute:!0},/**
   * Is the picker disabled?
   */disabled:{name:"disabled",type:Boolean,value:!1},/**
   * Is it expanded?
   */expanded:{name:"expanded",type:Boolean,value:!1,reflectToAttribute:!0},/**
   * Hide option labels? As color-picker or icon-picker, labels may be redundant.
   * This option would move the labels off-screen so that only screen-readers will have them.
   */hideOptionLabels:{name:"hideOptionLabels",type:Boolean,value:!1},/**
   * Optional. The label for the picker input
   */label:{name:"label",type:String,value:null,observer:"_setLabel"},/**
   * An array of options for the picker, eg.: `
[
  [
    {
      "icon": "editor:format-paint",      //Optional. Used if the picker is used as an icon picker.
      "alt": "Blue",                      //Required for accessibility. Alt text description of the choice.
      "style": "background-color: blue;", //Optional. Used to set an option's style.
      ...                                 //Optional. Any other properties that should be captured as part of the selected option's value
    },...
  ]
]`
   */options:{name:"options",type:Array,value:[[{icon:null,style:null,alt:null,value:null}]],observer:"_setSelectedOption"},/**
   * position the swatches relative to the picker, where:
   * `left` aligns the swatches to the picker's left edge
   * `right` aligns the swatches to the picker's right edge
   * `center` aligns the swatches to the picker's center
  "position": {
    "name": "position",
    "type": Boolean,
    "value": "left",
    "reflectToAttribute": false,
    "observer": false
  },
   */ /**
   * Renders html as title. (Good for titles with HTML in them.)
   */titleAsHtml:{name:"titleAsHtml",type:Boolean,value:!1},/**
   * An string that stores the current value for the picker
   */value:{name:"value",type:Object,value:null,notify:!0,observer:"_setSelectedOption",reflectToAttribute:!0},/**
   * The aria-activedescendant attribute (active option's ID)
   */__activeDesc:{name:"__activeDesc",type:String,value:"option-0-0"},/**
   * Whether or not a label should be added
   */__hasLabel:{name:"__hasLabel",type:Boolean,value:!0},/**
   * The selected option based on the value of the picker
   */__selectedOption:{name:"_setSelectedOption",type:Object}};if(babelHelpers.get(babelHelpers.getPrototypeOf(SimplePicker),"properties",this)){props=Object.assign(props,babelHelpers.get(babelHelpers.getPrototypeOf(SimplePicker),"properties",this))}return props}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"simple-picker"}}]);return SimplePicker}(_polymerElement.PolymerElement);_exports.SimplePicker=SimplePicker;window.customElements.define(SimplePicker.tag,SimplePicker)});