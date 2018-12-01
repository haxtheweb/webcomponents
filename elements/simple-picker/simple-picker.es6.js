import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import"./node_modules/@polymer/iron-icon/iron-icon.js";import"./node_modules/@polymer/iron-icons/iron-icons.js";import"./lib/simple-picker-option.js";export{SimplePicker};class SimplePicker extends PolymerElement{static get template(){return html`
<style>:host {
  display: inline-block;
  position: relative;
  @apply --simple-picker;
}
:host, 
:host #sample, 
:host .rows {
  margin: 0;
  padding: 0;
}

:host([disabled]) {
  cursor: not-allowed;
}

:host([hidden]) {
  display: none;
}
:host #sample {
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px;
  border-radius: 2px;
  background-color: var(--simple-picker-background-color,#ddd);
  border: 1px solid var(--simple-picker-border-color,black);
}

:host #icon {
  transform: rotate(-90deg);
  transition: transform 0.25s;
}

:host([expanded]) #icon {
  transform: rotate(0deg);
  transition: transform 0.25s;
}

:host #collapse {
  display: none;
  position: absolute;
  top: calc(var(--simple-picker-swatch-size, 20px)+12px);
  background-color: var(--simple-picker-background-color,#ddd);
}

:host([expanded]:not([disabled])) #collapse {
  display: block;
} 

:host .rows {
  display: table;
  border-collapse: collapse;
  position: absolute;
  z-index: 1000;
  outline: 1px solid var(--simple-picker-border-color,black);
}

:host .row {
  display: table-row;
  align-items: stretch;
}

:host simple-picker-option {
  z-index: 1;
  display: table-cell;
  overflow: hidden;
  max-height: unset;
  height: var(--simple-picker-option-size, 24px);
  min-width: var(--simple-picker-option-size, 24px);
  line-height: var(--simple-picker-option-size, 24px);
  color: var(--simple-picker-option-color, black);
  background-color: var(--simple-picker-option-background-color, white);
  outline: var(--simple-picker-option-outline, none);
  transition: max-height 2s;
}

:host simple-picker-option[selected] {
  z-index: 50;
  color: var(--simple-picker-selected-option-color, white);
  background-color: var(--simple-picker-selected-option-background-color, black);
  outline: var(--simple-picker-selected-option-outline, none);
}

:host simple-picker-option[active] {
  z-index: 100;
  cursor: pointer;
  color: var(--simple-picker-active-option-color, white);
  background-color: var(--simple-picker-active-option-background-color, #0088ff);
  outline: var(--simple-picker-active-option-outline, none);
}

:host #sample simple-picker-option {
  background-color: var(--simple-picker-sample-background-color, transparent);
  border: none;
}

:host(:not([expanded])) #collapse simple-picker-option {
  max-height: 0;
  transition: max-height 1.5s;
}

@media screen and (max-width: 600px) {
  :host {
    position: static;
  }
  :host #collapse {
    top: 0;
    margin-top: 0;
    position: relative;
  } 
  :host .rows {
    position: sticky;
  }  
}
</style>
<div id="listbox"
  aria-activedescendant$="[[__activeDesc]]" 
  aria-labelledby$="[[ariaLabelledby]]" 
  disabled$="[[disabled]]"
  label$="[[label]]" 
  role="listbox" 
  tabindex="0">
  <div id="sample">
    <simple-picker-option 
      aria-hidden="true" 
      hide-option-labels$="[[hideOptionLabels]]"
      icon$="[[__selectedOption.icon]]"
      style$="[[__selectedOption.style]]" 
      title$="[[__selectedOption.alt]]">
    </simple-picker-option>
    <span id="icon"><iron-icon aria-hidden="true" icon="arrow-drop-down"></iron-icon></span>
  </div>
  <div id="collapse">
    <div class="rows">
      <template is="dom-repeat" items="[[options]]" as="row" index-as="rownum">
        <div class="row">
          <template is="dom-repeat" items=[[row]] as="option" index-as="colnum">
            <simple-picker-option 
              active$="[[_isMatch(__activeDesc,rownum,colnum)]]"
              aria-selected$="[[option.selected]]" 
              hide-option-labels$="[[hideOptionLabels]]"
              icon$="[[option.icon]]"
              id$="[[_getOptionId(rownum,colnum)]]"
              role="option"
              selected$="[[_isMatch(__selectedDesc,rownum,colnum)]]"
              on-option-focus="_handleOptionFocus"
              on-set-selected-option="_handleSetSelectedOption"
              style$="[[option.style]]" 
              tabindex="-1"
              title$="[[option.alt]]"
              value$="[[option]]">
            </simple-picker-option>
          </template>
        </div>
      </template>
    </div>
  </div>
</div>`}static get properties(){return{ariaLabelledby:{name:"ariaLabelledby",type:"String",value:null,reflectToAttribute:!1,observer:!1},disabled:{name:"disabled",type:"Boolean",value:!1,reflectToAttribute:!1,observer:!1},expanded:{name:"expanded",type:"Boolean",value:!1,reflectToAttribute:!0,observer:!1},label:{name:"label",type:"String",value:null,reflectToAttribute:!1,observer:!1},options:{name:"options",type:"Array",value:[],reflectToAttribute:!1,observer:!1},hideOptionLabels:{name:"hideOptionLabels",type:"Boolean",value:!1,reflectToAttribute:!1,observer:!1},value:{name:"value",type:"String",value:"_getValue(__selectedDesc)",reflectToAttribute:!1,"read-only":!0,observer:!1},__activeDesc:{name:"__activeDesc",type:"String",value:"option-0-0",reflectToAttribute:!1,observer:!1},__selectedDesc:{name:"__selectedDesc",type:"String",value:"option-0-0",reflectToAttribute:!1,observer:!1},__selectedOption:{name:"__selectedOption",type:"Object",computed:"_getOption(__selectedDesc)",reflectToAttribute:!1,observer:!1}}}static get tag(){return"simple-picker"}_getValue(options){let option=null;for(let i=0,row;i<this.options.length;i++){row=this.options[i];for(let j=0;j<row.length;j++){if(!0===row[j].selected)option=row[j]}}this.$.texture.style.display=null!==option?"none":"block";return null!==option?option.value:null}_getOptionId(rownum,colnum){return"option-"+rownum+"-"+colnum}_getValue(__selectedDesc){return this._getOption(__selectedDesc).value}_getOption(optionId){let coords=this.__selectedDesc.split("-");return this.options[coords[1]][coords[2]]}_isMatch(match,rownum,colnum){return match===this._getOptionId(rownum,colnum)}_handleListboxClick(e){this._toggleListbox(!this.expanded)}_handleListboxKeydown(e){let coords=this.__activeDesc.split("-"),rownum=parseInt(coords[1]),colnum=parseInt(coords[2]);if(32===e.keyCode){e.preventDefault();this._toggleListbox(!this.expanded)}else if(this.expanded&&[9,35,36,38,40].includes(e.keyCode)){e.preventDefault();if(35===e.keyCode){let lastrow=this.options.length-1,lastcol=this.options[lastrow].length-1;this._goToOption(lastrow,lastcol)}else if(36===e.keyCode){this._goToOption(0,0)}else if(38===e.keyCode){if(0<colnum){this._goToOption(rownum,colnum-1)}else if(0<rownum){this._goToOption(rownum-1,this.options[rownum-1].length-1)}}else if(40===e.keyCode){if(colnum<this.options[rownum].length-1){this._goToOption(rownum,colnum+1)}else if(rownum<this.options.length-1){this._goToOption(rownum+1,[0])}}}}_handleOptionFocus(e){this._setActiveOption(e.detail.id)}_goToOption(rownum,colnum){let targetId=this._getOptionId(rownum,colnum),target=this.shadowRoot.querySelector("#"+targetId),active=this.shadowRoot.querySelector("#"+this.__activeDesc);if(null!==target){target.tabindex=0;target.focus();active.tabindex=-1}}_setActiveOption(optionId){this.__activeDesc=optionId}_setSelectedOption(optionId){this.__selectedDesc=optionId}_toggleListbox(expanded){this.expanded=expanded;if(expanded){let active=this.shadowRoot.querySelector("#"+this.__activeDesc);if(null!==active)active.focus()}else{this._setSelectedOption(this.__activeDesc)}}ready(){super.ready();let root=this;for(let i=0;i<this.options.length;i++){for(let j=0,option;j<this.options[i].length;j++){option=this.options[i][j];if(option.selected){this.__activeDesc=this._getOptionId(i,j);this.__selectedDesc=this._getOptionId(i,j)}}}console.log(this.__activeDesc);this.$.listbox.addEventListener("click",function(e){root._handleListboxClick(e)});this.$.listbox.addEventListener("keydown",function(e){root._handleListboxKeydown(e)})}connectedCallback(){super.connectedCallback()}}window.customElements.define(SimplePicker.tag,SimplePicker);