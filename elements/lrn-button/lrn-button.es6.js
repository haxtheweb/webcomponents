/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{afterNextRender}from"./node_modules/@polymer/polymer/lib/utils/render-status.js";import"./node_modules/@polymer/iron-icons/iron-icons.js";import"./node_modules/@polymer/iron-icon/iron-icon.js";import"./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";/**
 * `lrn-button`
 * `Simple button wrapper with a few options`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */class LrnButton extends PolymerElement{// render function
static get template(){return html`
<style>  :host {
    display: block;
    @apply --paper-font-common-base;
    @apply --paper-button;
    --lrnsys-button-height: 48px;
  }

  :host(.center) {
    text-align: center;
  }

  a {
    text-decoration: none;
    display: block;
    color: #000000;
  }

  paper-button {
    transition: .3s;
    margin: 0;
    max-width: 50%;
    height: inherit;
    -webkit-justify-content: flex-start;
    justify-content: flex-start;
    align-items: center;
    border-radius: unset;
  }

  paper-button iron-icon {
    height: var(--lrnsys-button-height);
    margin: 0 12px;
  }

  paper-button div.inner {
    height: var(--lrnsys-button-height);
    line-height: var(--lrnsys-button-height);
    padding: 0 12px;
  }

  paper-button span.label {
    height: var(--lrnsys-button-height);
    line-height: var(--lrnsys-button-height);
  }

  .no-margin {
    margin: 0 !important;
  }

  .no-right-padding {
    padding-right: 0 !important;
  }

  .no-left-padding {
    padding-left: 0 !important;
  }

  .center {
    text-align: center;
    margin: 0 auto;
  }</style>
<style include="materializecss-styles-colors"></style>
<a tabindex="-1" id="lrnsys-button-link" href$="[[showHref]]" data-prefetch-hover$="[[prefetch]]" target$="[[target]]">
  <paper-button id="button" raised="[[raised]]" class$="[[class]] [[color]] [[textColor]]" disabled$="[[disabled]]">
    <div class$="inner [[innerClass]]">
      <iron-icon icon$="[[icon]]" id="icon" class$="[[iconClass]]" hidden$="[[!icon]]"></iron-icon>
      <span class="label" hidden$="[[!label]]">
        [[label]]
      </span>
      <slot></slot>
    </div>
  </paper-button>
</a>
<paper-tooltip for="lrnsys-button-link" animation-delay="0">[[alt]]</paper-tooltip>`}// properties available to the custom element for data binding
static get properties(){let props={/**
   * Standard href pass down
   */href:{type:String,value:"#"},/**
   * What to display for the resource
   */showHref:{type:String,value:!1},/**
   * If the button should be visually lifted off the UI.
   */raised:{type:Boolean},/**
   * Label to place in the text area
   */label:{type:String,value:""},target:{type:String,value:""},/**
   * iron-icon to use (with iconset if needed)
   */icon:{type:String,value:!1},/**
   * Classes to add / subtract based on the item being hovered.
   */hoverClass:{type:String},/**
   * Icon class in the event you want it to look different from the text.
   */iconClass:{type:String},/**
   * Inner container classes.
   */innerClass:{type:String},/**
   * materializeCSS color class
   */color:{type:String},/**
   * materializeCSS color class for text
   */textColor:{type:String},/**
   * Allow for prefetch data on hover
   */prefetch:{type:String},/**
   * Alt via tooltip.
   */alt:{type:String},/**
   * Disabled state.
   */disabled:{type:Boolean,value:!1},/**
   * Tracks if focus state is applied
   */focusState:{type:Boolean,value:!1}};if(super.properties){props=Object.assign(props,super.properties)}return props}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */static get tag(){return"lrn-button"}constructor(){super();import("./node_modules/@polymer/paper-button/paper-button.js");import("./node_modules/@polymer/paper-tooltip/paper-tooltip.js")}/**
   * life cycle, element is afixed to the DOM
   */connectedCallback(){super.connectedCallback();afterNextRender(this,function(){this.addEventListener("mousedown",this.tapEventOn);this.addEventListener("mouseover",this.tapEventOn);this.addEventListener("mouseout",this.tapEventOff);this.$.button.addEventListener("focused-changed",this.focusToggle)})}/**
   * life cycle, element is removed from the DOM
   */disconnectedCallback(){this.removeEventListener("mousedown",this.tapEventOn);this.removeEventListener("mouseover",this.tapEventOn);this.removeEventListener("mouseout",this.tapEventOff);this.$.button.removeEventListener("focused-changed",this.focusToggle);super.disconnectedCallback()}/**
   * Go to the href if the button isn't disabled
   */ready(){super.ready();if(!this.disabled){this.showHref=this.href}}/**
   * Class processing on un-tap / hover
   */tapEventOn(e){let root=this;if(typeof root.hoverClass!==typeof void 0&&!root.disabled){// break class into array
var classes=root.hoverClass.split(" ");// run through each and add or remove classes
classes.forEach(function(item,index){if(""!=item){root.$.button.classList.add(item);if(-1!=item.indexOf("-")){root.$.icon.classList.add(item)}}})}}/**
   * Undo class processing on un-tap / hover
   */tapEventOff(e){let root=this;if(typeof root.hoverClass!==typeof void 0&&!root.disabled){// break class into array
var classes=root.hoverClass.split(" ");// run through each and add or remove classes
classes.forEach(function(item,index){if(""!=item){root.$.button.classList.remove(item);if(-1!=item.indexOf("-")){root.$.icon.classList.remove(item)}}})}}/**
   * Handle toggle for mouse class and manage classList array for paper-button.
   */focusToggle(e){let root=this;this.dispatchEvent(new CustomEvent("focus-changed",{bubbles:!0,composed:!0,detail:{focus:root.focusState}}));// see if it has hover classes
if(typeof root.hoverClass!==typeof void 0&&!root.disabled){// break class into array
var classes=root.hoverClass.split(" ");// run through each and add or remove classes
classes.forEach(function(item,index){if(""!=item){if(root.focusState){root.$.button.classList.add(item);if(-1!=item.indexOf("-")){root.$.icon.classList.add(item)}}else{root.$.button.classList.remove(item);if(-1!=item.indexOf("-")){root.$.icon.classList.remove(item)}}}})}root.focusState=!root.focusState}}window.customElements.define(LrnButton.tag,LrnButton);export{LrnButton};