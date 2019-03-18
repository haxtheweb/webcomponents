import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import"./node_modules/@polymer/iron-icon/iron-icon.js";import"./node_modules/@polymer/iron-icons/iron-icons.js";import"./lib/simple-picker-option.js";export{SimplePicker};class SimplePicker extends PolymerElement{static get template(){return html`
<style>:host {
  display: inline-flex;
  align-items: center;
  position: relative;
  --simple-picker-color: black;
  font-size: var(--paper-input-container-label_-_font-size, var(--paper-font-subhead_-_font-size, inherit));
  margin: 8px 0;
  height: 42px;
  @apply --simple-picker;
}

:host([disabled]) {
  cursor: not-allowed;
}

:host([hidden]) {
  display: none;
}

:host label {
  padding-right: 5px;
  color: var(--paper-input-container-label_-_color, var(--paper-input-container-color, var(--secondary-text-color, #000)));
  @apply --simple-picker-label;
}

:host, 
:host #sample, 
:host .rows {
  margin: 0;
  padding: 0;
}

:host #listbox {
  display: flex;
  flex: 1 0 auto;
}

:host #sample {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px;
  border-radius: 2px;
  background-color: var(--simple-picker-background-color,#ddd);
  border: 1px solid var(--simple-picker-border-color, var(--simple-picker-color));
}

:host #icon {
  transform: var(--simple-picker-icon-tranform,rotate(-90deg));
  transition: transform 0.25s;
}

:host([expanded]) #icon {
  transform: var(--simple-picker-expanded-icon-tranform,rotate(0deg));
  transition: transform 0.25s;
}

:host #collapse {
  display: none;
  width: 100%;
  position: absolute;
  top: 35px;
  padding: 1px;
  @apply --simple-picker-collapse;
}

:host([expanded]:not([disabled])) #collapse {
  display: block;
} 

:host .rows {
  display: block;
  position: absolute;
  z-index: 1000;
  outline: 1px solid var(--simple-picker-border-color, var(--simple-picker-color));
  background-color: var(--simple-picker-background-color,#ddd);
  box-shadow: 0px 0px 1px #888;
  @apply --simple-picker-rows;
}

:host .row {
  display: flex; 
  align-items: stretch;
  justify-content: space-between;
  @apply --simple-picker-row;
}

:host simple-picker-option {
  z-index: 1;
  flex: 1 1 auto;
  max-height: unset;
  min-height: var(--simple-picker-option-size, 24px);
  min-width: var(--simple-picker-option-size, 24px);
  line-height: var(--simple-picker-option-size, 24px);
  color: var(--simple-picker-color);
  background-color: var(--simple-picker-option-background-color, white);
  outline: var(--simple-picker-option-outline, none);
  transition: max-height 2s;
  @apply --simple-picker-option;
}

:host(:not([value])) #sample simple-picker-option,
:host([value="null"]) #sample simple-picker-option {
  @apply --simple-picker-sample-null;
  --simple-picker-option-label: {
    @apply --simple-picker-sample-null-label;
  };
}

:host #sample simple-picker-option {
  @apply --simple-picker-sample-option;
}

:host simple-picker-option[selected] {
  z-index: 50;
  color: var(--simple-picker-color);
  background-color: var(--simple-picker-selected-option-background-color, #e8e8e8);
  outline: var(--simple-picker-selected-option-outline, none);
}

:host simple-picker-option[active] {
  z-index: 100;
  cursor: pointer;
  color: var(--simple-picker-color);
  background-color: var(--simple-picker-active-option-background-color, #aaddff);
  outline: var(--simple-picker-active-option-outline, none);
}

:host #sample simple-picker-option {
  color: var(--simple-picker-sample-color,  var(--simple-picker-color));
  background-color: var(--simple-picker-sample-background-color, transparent);
  border: none;
}

:host(:not([expanded])) #collapse simple-picker-option {
  max-height: 0;
  transition: max-height 1.5s;
}

:host #collapse simple-picker-option:not([value]),
:host #collapse simple-picker-option[value=null] {
  @apply --simple-picker-option-null;
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
<label for="listbox" hidden$="[[!hasLabel]]">[[label]]</label>
<div id="listbox"
  aria-activedescendant$="[[__activeDesc]]" 
  aria-labelledby$="[[ariaLabelledby]]" 
  disabled$="[[disabled]]"
  role="listbox" 
  tabindex="0">
  <div id="sample">
    <simple-picker-option 
      aria-hidden="true" 
      hide-option-labels$="[[hideOptionLabels]]"
      icon$="[[__selectedOption.icon]]"
      style$="[[__selectedOption.style]]" 
      title$="[[__selectedOption.alt]]"
      title-as-html$="[[titleAsHtml]]">
    </simple-picker-option>
    <span id="icon"><iron-icon aria-hidden="true" icon="arrow-drop-down"></iron-icon></span>
  </div>
  <div id="collapse">
    <div class="rows">
      <template is="dom-repeat" items="[[options]]" as="row" index-as="rownum">
        <div class="row">
          <template is="dom-repeat" items=[[row]] as="option" index-as="colnum">
            <simple-picker-option 
              active$="[[_isActive(__activeDesc,rownum,colnum)]]"
              aria-selected$="[[_isSelected(value,option.value)]]"
              data$="[[data]]"
              hide-option-labels$="[[hideOptionLabels]]"
              icon$="[[option.icon]]"
              id$="[[_getOptionId(rownum,colnum)]]"
              role="option"
              selected$="[[_isSelected(value,option.value)]]"
              on-option-focus="_handleOptionFocus"
              on-set-selected-option="_handleSetSelectedOption"
              style$="[[option.style]]" 
              tabindex="-1"
              title="[[option.alt]]"
              title-as-html$="[[titleAsHtml]]"
              value="[[option.value]]">
            </simple-picker-option>
          </template>
        </div>
      </template>
    </div>
  </div>
</div>`}static get properties(){return{ariaLabelledby:{name:"ariaLabelledby",type:"String",value:null},disabled:{name:"disabled",type:"Boolean",value:!1},expanded:{name:"expanded",type:"Boolean",value:!1,reflectToAttribute:!0},titleAsHtml:{name:"titleAsHtml",type:"Boolean",value:!1},hideOptionLabels:{name:"hideOptionLabels",type:"Boolean",value:!1},hasLabel:{name:"label",type:"Boolean",computed:"_hasLabel(label)"},label:{name:"label",type:"String",value:null},options:{name:"options",type:"Array",value:[[]],notify:!0,observer:"_setSelectedOption"},value:{name:"value",type:"Object",value:null,notify:!0,observer:"_setSelectedOption",reflectToAttribute:!0},__activeDesc:{name:"__activeDesc",type:"String",value:"option-0-0"},__selectedOption:{name:"_setSelectedOption",type:"Object"}}}static get tag(){return"simple-picker"}_getOption(options,optionId){if(options!==void 0&&optionId!==void 0&&null!==optionId){let coords=optionId.split("-");return options[coords[1]][coords[2]]}return null}_getOptionId(rownum,colnum){return"option-"+rownum+"-"+colnum}_goToOption(rownum,colnum){let targetId=this._getOptionId(rownum,colnum),target=this.shadowRoot.querySelector("#"+targetId),active=this.shadowRoot.querySelector("#"+this.__activeDesc);if(null!==target){target.tabindex=0;target.focus();active.tabindex=-1}}_handleListboxEvent(e,type){this.dispatchEvent(new CustomEvent(type,{detail:this}));if("click"===type)this._toggleListbox(!this.expanded)}_handleListboxKeydown(e){this.dispatchEvent(new CustomEvent("keydown",{detail:this}));let coords=this.__activeDesc.split("-"),rownum=parseInt(coords[1]),colnum=parseInt(coords[2]);if(32===e.keyCode){e.preventDefault();this._toggleListbox(!this.expanded)}else if(this.expanded&&[9,35,36,38,40].includes(e.keyCode)){e.preventDefault();if(35===e.keyCode){let lastrow=this.options.length-1,lastcol=this.options[lastrow].length-1;this._goToOption(lastrow,lastcol)}else if(36===e.keyCode){this._goToOption(0,0)}else if(38===e.keyCode){if(0<colnum){this._goToOption(rownum,colnum-1)}else if(0<rownum){this._goToOption(rownum-1,this.options[rownum-1].length-1)}}else if(40===e.keyCode){if(colnum<this.options[rownum].length-1){this._goToOption(rownum,colnum+1)}else if(rownum<this.options.length-1){this._goToOption(rownum+1,[0])}}}}_handleOptionFocus(e){this._setActiveOption(e.detail.id)}_hasLabel(label){return label!==void 0&&null!==label&&""!==label.trim()}_isActive(active,rownum,colnum){return active===this._getOptionId(rownum,colnum)}_isSelected(value1,value2){return value1===value2}_setActiveOption(id){this.__activeDesc=id;this.dispatchEvent(new CustomEvent("option-focus",{detail:this}))}_setSelectedOption(){let sel=null;if(this.options!==void 0&&null!==this.options){this.__activeDesc="option-0-0";for(var i=0;i<this.options.length;i++){for(var j=0;j<this.options[i].length;j++){if(this.options[i][j].value===this.value){this.__activeDesc="option-"+i+"-"+j;sel=this.options[i][j]}}}}if(null===sel)this.value=null;this.__selectedOption=sel;this.dispatchEvent(new CustomEvent("change",{bubbles:!0,detail:this}))}_toggleListbox(expanded){let active=this.shadowRoot.querySelector("#"+this.__activeDesc);this.expanded=expanded;if(expanded){if(null!==active)active.focus();this.dispatchEvent(new CustomEvent("expand",{detail:this}))}else{if(null!==active)this.value=active.getAttribute("value");this.dispatchEvent(new CustomEvent("collapse",{detail:this}))}}ready(){super.ready();let root=this;if(this.$.listbox!==void 0){this.$.listbox.addEventListener("click",function(e){root._handleListboxEvent(e,"click")});this.$.listbox.addEventListener("mousedown",function(e){root._handleListboxEvent(e,"mousedown")});this.$.listbox.addEventListener("keydown",function(e){root._handleListboxKeydown(e)})}}setOptions(options){this.set("options",[[]]);this.set("options",options)}connectedCallback(){super.connectedCallback()}}window.customElements.define(SimplePicker.tag,SimplePicker);