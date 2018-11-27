import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/hax-body-behaviors/hax-body-behaviors.js";import"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";import"./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";Polymer({_template:html`
    <style is="custom-style">
       :host {
        display: block;
        margin: var(--accent-card-margin, 20px) 0;
        --accent-card-color: var(--simple-colors-foreground3, #222);
        --accent-card-background-color: var(--simple-colors-background1, #fff);
        --accent-card-border-color: var(--simple-colors-accent-background5, #ddd);
        --accent-card-heading-color: var(--simple-colors-accent-foreground5, #000);
        --accent-card-footer-border-color: var(--simple-colors-background3, #ddd);
        --accent-card-box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        --accent-card-flat: none;
        @apply --accent-card;
      }
      :host([dark]) {
        --accent-card-color: var(--simple-colors-foreground1, #fff);
        --accent-card-border-color: var(--simple-colors-accent-foreground5, #fff);
        --accent-card-footer-border-color: var(--simple-colors-background5, #666);
      }
      :host([accent-background]) {
        --accent-card-background-color: var(--simple-colors-accent-background1, #fff);
        --accent-card-footer-border-color: var(--accent-card-border-color);
      }
      :host section {
        border-radius: 2px;
        box-sizing: border-box;
        box-shadow: var(--accent-card-box-shadow);
        display: block;
        color: var(--accent-card-color);
        background-color: var(--accent-card-background-color);
        @apply --accent-card-inner;
      }
      :host([horizontal]) section {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
      }
      :host section[aria-role][disabled]{
        opacity: 0.7;
      }
      :host section[aria-role]:not([disabled]):focus,
      :host section[aria-role]:not([disabled]):hover {
        cursor: pointer; 
        border-radius: 0px;
        outline: 1px solid var(--accent-card-border-color);
        @apply --accent-card-focus-heading;
      }
      :host section[aria-role]:not([disabled]):focus,
      :host section[aria-role]:not([disabled]):hover,
      :host([flat]) section {
        box-shadow: var(--accent-card-flat);
      }
      :host([flat]:not([accent-background])) section {
        border: 1px solid var(--accent-card-footer-border-color);
      }
      :host(:not([horizontal]):not([no-border])) section {
        border-top: 4px solid var(--accent-card-border-color);
      }
      :host([horizontal]:not([no-border])) section {
        border-left: 4px solid var(--accent-card-border-color);
      }
      :host .body {
        flex-grow: 1;
        @apply --accent-card-body;
      }
      :host .image {
        background-size: cover; 
        background-position-x: var(--accent-card-image-x, center); 
        background-position-y: var(--accent-card-image-y, center);
      }
      :host(:not([horizontal])) .image {
        height: var(--accent-card-image-height, 100px);
        @apply --accent-card-vertical-image;
      }
      :host([horizontal]) .image {
        width: var(--accent-card-image-width, 100px);;
        @apply --accent-card-horizontal-image;
      }
      :host .heading {
        padding-top: var(--accent-card-margin, 20px);
        padding-left: var(--accent-card-margin, 20px);
        padding-right: var(--accent-card-margin, 20px);
        padding-bottom: 0;
        margin: 0;
        @apply --accent-card-heading;
      }
      :host section[aria-role]:not([disabled]):focus .heading,
      :host section[aria-role]:not([disabled]):hover .heading {
        @apply --accent-card-focus-heading;
      }
      :host([accent-heading][accent-color]) .heading {
        color: var(--accent-card-heading-color);
      }
      :host .subheading {
        font-size: 90%;
        font-style: italic;
        padding-left: var(--accent-card-margin, 20px);
        padding-right: var(--accent-card-margin, 20px);
        @apply --accent-card-subheading;
      }
      :host .content {
        padding: var(--accent-card-margin, 20px);
        @apply --accent-card-content;
      }
      :host .content:not(:last-child) {
        border-bottom: 1px solid var(--accent-card-footer-border-color);
      }
    </style>
    <section id="card" aria-role\$="[[button]]" disabled\$="[[disabled]]" tabindex\$="[[__tabindex]]">
      <div class="image" style\$="[[__backgroundStyle]]"></div>
      <div class="body">
        <template is="dom-if" if="[[__hasHeading]]" restamp="">
          <h1 class="heading">[[heading]]</h1>
        </template>
        <div class="subheading"><slot name="subheading"></slot></div>
        <div class="content"><slot name="content"></slot></div>
        <slot name="footer"></slot>
      </div>
    </section>
    <iron-a11y-keys id="a11y" target\$="[[__target]]" keys="enter space" on-keys-pressed="_handleTap"></iron-a11y-keys>
`,is:"accent-card",behaviors:[HAXBehaviors.PropertiesBehaviors,simpleColorsBehaviors,SchemaBehaviors.Schema],listeners:{tap:"_handleTap"},properties:{accentBackground:{type:Boolean,value:!1,reflectToAttribute:!0},accentHeading:{type:Boolean,value:!1,reflectToAttribute:!0},button:{type:Boolean,value:!1,reflectToAttribute:!0},disabled:{type:Boolean,value:!1,reflectToAttribute:!0},flat:{type:Boolean,value:!1,reflectToAttribute:!0},heading:{type:String,value:null},horizontal:{type:Boolean,value:!1,reflectToAttribute:!0},imageSrc:{type:String,value:null},noBorder:{type:Boolean,value:!1,reflectToAttribute:!0},__backgroundStyle:{type:String,computed:"_getBackgroundStyle(imageSrc)"},__hasHeading:{type:String,computed:"_hasProp(heading)"},__tabindex:{type:Number,computed:"_getTabindex(button)"}},attached:function(){this.__target=this.$.card;let props={canEditSource:!1,gizmo:{title:"Accent Card",description:"A card with optional accent styling.",icon:"image:crop-landscape",color:"grey",groups:["Media","Text"],handles:[{type:"media",url:"source"},{type:"text",url:"source"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"imageSrc",title:"Image",description:"Optional image",inputMethod:"textfield",icon:"editor:insert-photo"},{property:"heading",title:"Heading",description:"Optional heading",inputMethod:"textfield",icon:"editor:title"},{property:"content",title:"Content",description:"content",inputMethod:"textfield",icon:"editor:format-align-left"},{property:"accentColor",title:"Accent Color",description:"Accent Color",inputMethod:"colorpicker",icon:"editor:format-color-fill"},{property:"dark",title:"Dark Theme",description:"Use dark theme?",inputMethod:"toggle"}],configure:[{property:"accentHeading",title:"Heading Accent",description:"Apply the accent color to the heading?",inputMethod:"toggle"},{property:"accentBackground",title:"Background Accent",description:"Apply the accent color to the card background?",inputMethod:"toggle"},{property:"accentBackground",title:"No Border Accent",description:"Remove the border accent?",inputMethod:"toggle"}],advanced:[]}};this.setHaxProperties(props)},ready:function(){this.__target=this.$.card},_handleTap:function(e){let root=this;if(!1!==root.button&&!root.disabled){root.fire("accent-card-tap",root)}},_hasProp:function(prop){return prop!==void 0&&null!==prop},_getTabindex:function(button){if(!1!==button){return 0}else{return null}},_getBackgroundStyle:function(imageSrc){if(this._hasProp(imageSrc)){return"background-image: url("+imageSrc+");"}else{return"display: none;"}}});