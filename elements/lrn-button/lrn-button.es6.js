import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import"./node_modules/@polymer/paper-button/paper-button.js";import"./node_modules/@polymer/iron-icons/iron-icons.js";import"./node_modules/@polymer/iron-icon/iron-icon.js";import"./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";import"./node_modules/@polymer/paper-tooltip/paper-tooltip.js";class LrnButton extends PolymerElement{static get template(){return html`
<style>
:host {
    display: block;
    @apply --paper-font-common-base;
    @apply --paper-button;
    --lrnsys-button-height: 3em;
  }

  :host.center {
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
    margin: 0 .75em;
  }

  paper-button div.inner {
    height: var(--lrnsys-button-height);
    line-height: var(--lrnsys-button-height);
    padding: 0 .75em;
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
  }
</style>
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
<paper-tooltip for="lrnsys-button-link" animation-delay="0">[[alt]]</paper-tooltip>`}static get properties(){return{href:{type:String,value:"#"},showHref:{type:String,value:!1},raised:{type:Boolean},label:{type:String,value:""},target:{type:String,value:""},icon:{type:String,value:!1},hoverClass:{type:String},iconClass:{type:String},innerClass:{type:String},color:{type:String},textColor:{type:String},prefetch:{type:String},alt:{type:String},disabled:{type:Boolean,value:!1},focusState:{type:Boolean,value:!1}}}static get tag(){return"lrn-button"}get templateUrl(){return"lrn-button.html"}get propertiesUrl(){return"lrn-button-properties.json"}get HAXPropertiesUrl(){return"lrn-button-hax.json"}get styleUrl(){return"lrn-button.css"}connectedCallback(){super.connectedCallback();this.addEventListener("mousedown",this.tapEventOn);this.addEventListener("mouseover",this.tapEventOn);this.addEventListener("mouseout",this.tapEventOff)}disconnectedCallback(){super.disconnectedCallback();this.removeEventListener("mousedown",this.tapEventOn);this.removeEventListener("mouseover",this.tapEventOn);this.removeEventListener("mouseout",this.tapEventOff);this.$.button.removeEventListener("focused-changed",this.focusToggle)}ready(){super.ready();if(!this.disabled){this.showHref=this.href}this.$.button.addEventListener("focused-changed",this.focusToggle)}tapEventOn(){let root=this;if(typeof root.hoverClass!==typeof void 0&&!root.disabled){var classes=root.hoverClass.split(" ");classes.forEach(function(item){if(""!=item){root.$.button.classList.add(item);if(-1!=item.indexOf("-")){root.$.icon.classList.add(item)}}})}}tapEventOff(){let root=this;if(typeof root.hoverClass!==typeof void 0&&!root.disabled){var classes=root.hoverClass.split(" ");classes.forEach(function(item){if(""!=item){root.$.button.classList.remove(item);if(-1!=item.indexOf("-")){root.$.icon.classList.remove(item)}}})}}focusToggle(){let root=this;this.dispatchEvent(new CustomEvent("focus-changed",{bubbles:!0,composed:!0,detail:{focus:root.focusState}}));if(typeof root.hoverClass!==typeof void 0&&!root.disabled){var classes=root.hoverClass.split(" ");classes.forEach(function(item){if(""!=item){if(root.focusState){root.$.button.classList.add(item);if(-1!=item.indexOf("-")){root.$.icon.classList.add(item)}}else{root.$.button.classList.remove(item);if(-1!=item.indexOf("-")){root.$.icon.classList.remove(item)}}}})}root.focusState=!root.focusState}}window.customElements.define(LrnButton.tag,LrnButton);