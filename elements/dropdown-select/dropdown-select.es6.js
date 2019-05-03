import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{afterNextRender}from"./node_modules/@polymer/polymer/lib/utils/render-status.js";import{dom}from"./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";/**
`dropdown-select`
An easy to use, works as expected dropdown menu. Add slotted items like follows:

<dropdown-select
  allow-outside-scroll
  always-float-label
  dynamic-align
  error-message="Required."
  horizontal-align="left"
  label="Select an item." 
  no-animations
  no-label-float
  placeholder="none" 
  restore-focus-on-close 
  vertical-align="bottom" 
  vertical-offset="10">
  <paper-item value="100">100 things</paper-item>
  <paper-item value="1000">Another value</paper-item>
  <paper-item value="10">Value is 10, but you will see this text</paper-item>
</dropdown-select>

* @demo demo/index.html

*/class DropdownSelect extends PolymerElement{constructor(){super();import("./node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu.js");import("./node_modules/@polymer/paper-item/paper-item.js");import("./node_modules/@polymer/paper-listbox/paper-listbox.js")}static get template(){return html`
    <style>
      :host {
        display: block;
      }
      paper-listbox ::slotted(paper-item) {
        display: block;
        width: calc(100% - 32px);
        padding: 0 16px;
        min-height: 32px;
        vertical-align: text-top;
        line-height: 32px;
        @apply --dropdown-select-items;
      }
      paper-listbox paper-listbox {
        @apply --dropdown-listbox;
      }
    </style>
    <paper-dropdown-menu
      id="menu"
      allow-outside-scroll\$="[[allowOutsideScroll]]"
      always-float-label\$="[[alwaysFloatLabel]]"
      dynamic-align\$="[[dynamicAlign]]"
      error-message\$="[[errorMessage]]"
      horizontal-align\$="[[horizontalAlign]]"
      label\$="[[label]]"
      no-animations\$="[[noAnimations]]"
      no-label-float\$="[[noLabelFloat]]"
      on-selected-item-changed="_getSelectedValue"
      placeholder\$="[[placeholder]]"
      restore-focus-on-close\$="[[restoreFocusOnClose]]"
      vertical-align\$="[[verticalAlign]]"
      vertical-offset\$="[[verticalOffset]]"
    >
      <paper-listbox
        id="listbox"
        slot="dropdown-content"
        class="dropdown-content"
      >
        <slot id="content"></slot>
      </paper-listbox>
    </paper-dropdown-menu>
  `}static get tag(){return"dropdown-select"}connectedCallback(){super.connectedCallback();afterNextRender(this,function(){this._valueChanged(this.value);this.addEventListener("paper-dropdown-open",this._onOpen.bind(this));this.addEventListener("paper-dropdown-close",this._onClose.bind(this))})}disconnectedCallback(){this.removeEventListener("paper-dropdown-open",this._onOpen.bind(this));this.removeEventListener("paper-dropdown-close",this._onClose.bind(this));super.disconnectedCallback()}static get properties(){return{/**
     * Set to true in order to prevent scroll from being constrained
     * to the dropdown when it opens.
     */allowOutsideScroll:{type:Boolean,value:!1},/**
     * Set to true to always float the label.
     */alwaysFloatLabel:{type:Boolean,value:!1},/**
     * If true, the `horizontalAlign` and `verticalAlign` properties will
     * be considered preferences instead of strict requirements when
     * positioning the dropdown and may be changed if doing so reduces
     * the area of the dropdown falling outside of `fitInto`.
     */dynamicAlign:{type:Boolean},/**
     * The error message to display when invalid.
     */errorMessage:{type:String},/**
     * The orientation against which to align the menu dropdown
     * horizontally relative to the dropdown trigger.
     */horizontalAlign:{type:String,value:"right"},/**
     * The label of the select menu
     */label:{type:String,value:"Select an option."},/**
     * Set to true to disable animations when opening and closing the
     * dropdown.
     */noAnimations:{type:Boolean,value:!1},/**
     * Set to true to disable the floating label.
     */noLabelFloat:{type:Boolean,value:!1},/**
     * True if the dropdown is open. Otherwise, false.
     */opened:{type:Boolean,value:!1},/**
     * The placeholder for the dropdown.
     */placeholder:{type:String},/**
     * Whether focus should be restored to the dropdown when the menu closes.
     */restoreFocusOnClose:{type:Boolean,value:!0},/**
     * The last selected item.
     */selectedItem:{type:Object},/**
     * The index of the selected item
     */selectedItemIndex:{type:Number,value:null},/**
     * The label of the selected item
     */selectedItemLabel:{type:String,value:null},/**
     * The default value
     */value:{type:String,value:null,notify:!0,reflectToAttribute:!0,observer:"_valueChanged"},/**
     * The orientation against which to align the menu dropdown
     * vertically relative to the dropdown trigger.
     */verticalAlign:{type:String,value:"top"},/**
     * Overrides the vertical offset computed in
     * _computeMenuVerticalOffset.
     */verticalOffset:{type:Number}}}/**
   * Get the value of the selected item.
   */_getSelectedValue(e){if(null!==e.detail.value){this.value=e.detail.value.getAttribute("value");this._setSelectedValues();this.dispatchEvent(new CustomEvent("change",{bubbles:!0,cancelable:!0,composed:!0,detail:{value:this.value}}));//support for old version
this.dispatchEvent(new CustomEvent("dropdown-select-changed",{bubbles:!0,cancelable:!0,composed:!0,detail:this}))}}/**
   * Sets the opened property to true
   */_onOpen(e){this.opened=!0}/**
   * Sets the opened property to false
   */_onClose(e){this.opened=!1}/**
   * Get the value of the selected item.
   */_setSelectedValues(){this.selectedItem=this.shadowRoot.querySelector("#menu").selectedItem;this.selectedItemLabel=this.shadowRoot.querySelector("#menu").selectedItemLabel;this.selectedItemIndex=this.shadowRoot.querySelector("#listbox").selected}/**
   * Notice value has changed and ensure data model is accurate
   */_valueChanged(newValue,oldValue){let children=dom(this).querySelectorAll("paper-item");if(children!==void 0&&null!==children){for(let i=0;i<children.length;i++){if(this.value===children[i].getAttribute("value")){this.shadowRoot.querySelector("#listbox").selected=i;this._setSelectedValues()}}}}}window.customElements.define(DropdownSelect.tag,DropdownSelect);export{DropdownSelect};