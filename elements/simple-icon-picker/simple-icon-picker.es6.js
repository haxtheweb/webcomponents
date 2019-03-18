import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{SimplePicker}from"./node_modules/@lrnwebcomponents/simple-picker/simple-picker.js";import{IronMeta}from"./node_modules/@polymer/iron-meta/iron-meta.js";class SimpleIconPicker extends SimplePicker{static get template(){return html`
<style>:host {
  display: flex;
  --simple-picker-option-size: 24px;
  --simple-picker-collapse: {
    width: 360px;
    height: 300px;
    max-height: 300px;
    overflow: scroll;
  }
  --simple-picker-row: {
    justify-content: flex-start;
  }
  --simple-picker-option: {
    flex: 0 0 auto;
  }
}

:host([hidden]) {
  display: none;
}
</style>
<simple-picker 
  aria-labelledby$="[[ariaLabelledby]]"
  disabled$="[[disabled]]"
  expanded$="[[expanded]]"
  hide-option-labels
  label$="[[label]]"
  on-change="_handleChange"
  on-collapse="_handleCollapse"
  on-expand="_handleExpand"
  on-option-focus="_handleOptionFocus"
  options="[[options]]"
  value$="{{value}}">
</simple-picker>`}static get properties(){return{allowNull:{name:"allowNull",type:"Boolean",value:!1},hideOptionLabels:{name:"hideOptionLabels",type:"Boolean",value:!0,"read-only":!0},icons:{name:"icons",type:"Array",value:[]},options:{name:"options",type:"Array",computed:"_getOptions(icons,__iconList,allowNull)"},value:{name:"label",type:"String",value:null,reflectToAttribute:!0,notify:!0},__iconList:{name:"__iconList",type:"Array","read-only":!0}}}static get tag(){return"simple-icon-picker"}connectedCallback(){super.connectedCallback();const iconSets=new IronMeta({type:"iconset"});if(0===this.icons.length&&typeof iconSets!==typeof void 0&&iconSets.list&&iconSets.list.length){var iconList=[];iconSets.list.forEach(function(item){item.getIconNames().forEach(icon=>{iconList.push(icon)})});this.__iconList=iconList}}_getOptions(icons=[],__iconList=[],allowNull=!1){var _Mathsqrt=Math.sqrt;if(0===icons.length)icons=__iconList;let options=!1===allowNull?[]:[[{alt:"null",value:null}]],h=!1===allowNull?0:1,cols=16>_Mathsqrt(icons.length+h)?Math.ceil(_Mathsqrt(icons.length+h)):15;for(let i=0;i<icons.length;i++){let j=h+i,row=Math.floor(j/cols),col=j-row*cols;if(options[row]===void 0||null===options[row])options[row]=[];options[row][col]={alt:icons[i],icon:icons[i],value:icons[i]}}return options}_handleChange(e){this.value=e.detail.value;this.dispatchEvent(new CustomEvent("change",{bubbles:!0,detail:this}))}_handleCollapse(e){this.dispatchEvent(new CustomEvent("collapse",{detail:this}))}_handleExpand(e){this.dispatchEvent(new CustomEvent("expand",{detail:this}))}_handleOptionFocus(e){this.dispatchEvent(new CustomEvent("option-focus",{detail:this}))}}window.customElements.define(SimpleIconPicker.tag,SimpleIconPicker);export{SimpleIconPicker};