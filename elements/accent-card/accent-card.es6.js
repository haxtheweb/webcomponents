import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";import{SimpleColors}from"./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";class AccentCard extends SimpleColors{static get tag(){return"accent-card"}static get behaviors(){return[SimpleColors]}static get template(){return html`
      <style is="custom-style" include="simple-colors">
        :host {
          display: block;
          border-radius: 2px;
          margin: 0 0 15px;
          box-shadow: var(
            --accent-card-box-shadow,
            0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12),
            0 3px 1px -2px rgba(0, 0, 0, 0.2)
          );
          color: var(
            --accent-card-color,
            var(--simple-colors-default-theme-grey-9, #222)
          );
          background-color: var(
            --accent-card-background-color,
            var(--simple-colors-default-theme-grey-1, #fff)
          );
          --accent-card-image-width: 30%;
          --accent-card-image-height: 10%;
          --accent-card-border-color: var(
            --simple-colors-default-theme-accent-6,
            #ddd
          );
          --accent-card-heading-color: var(
            --simple-colors-default-theme-accent-7,
            #000
          );
          --accent-card-footer-border-color: var(
            --simple-colors-default-theme-grey-3,
            #ddd
          );
          @apply --accent-card;
        }
        :host([dark]) {
          color: var(
            --accent-card-color,
            var(--simple-colors-default-theme-grey-12, #fff)
          );
          --accent-card-border-color: var(
            --simple-colors-default-theme-accent-7,
            #fff
          );
          --accent-card-footer-border-color: var(
            --simple-colors-default-theme-grey-6,
            #666
          );
        }
        :host([accent-background]) {
          background-color: var(
            --accent-card-background-color,
            var(--simple-colors-default-theme-accent-1, #fff)
          );
          --accent-card-footer-border-color: var(--accent-card-border-color);
        }
        :host section {
          width: 100%;
          box-sizing: border-box;
        }
        :host([horizontal]) section {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
        }
        :host([flat]) {
          box-shadow: none;
        }
        :host([flat]:not([accent-background])) {
          border: 1px solid var(--accent-card-footer-border-color);
        }
        :host(:not([horizontal]):not([no-border])) section {
          border-top: 4px solid var(--accent-card-border-color);
        }
        :host([horizontal]:not([no-border])) section {
          border-left: 4px solid var(--accent-card-border-color);
        }
        :host .image-outer {
          box-sizing: border-box;
          position: relative;
          overflow: visible;
        }
        :host([horizontal]) .image-outer {
          height: auto;
          width: var(--accent-card-image-width);
        }
        :host(:not([horizontal])) .image-outer {
          height: auto;
          width: 100%;
        }
        :host .image {
          height: 100%;
          width: 100%;
          background-size: cover;
          background-position-x: var(--accent-card-image-x, center);
          background-position-y: var(--accent-card-image-y, center);
          @apply --accent-card-image;
        }
        :host([horizontal]) .image {
          @apply --accent-card-image-horizontal;
        }
        :host(:not([horizontal])) .image {
          height: 0;
          padding-top: var(--accent-card-image-height);
          @apply --accent-card-image-vertical;
        }
        :host .body {
          flex-grow: 1;
          overflow: visible;
          @apply --accent-card-body;
        }
        :host #heading {
          padding-top: var(--accent-card-padding, 20px);
          padding-left: var(--accent-card-padding, 20px);
          padding-right: var(--accent-card-padding, 20px);
          padding-bottom: 0;
          margin: 0;
          @apply --accent-card-heading;
        }
        :host([accent-heading][accent-color]) #heading {
          color: var(--accent-card-heading-color);
        }
        :host #subheading {
          font-size: 90%;
          font-style: italic;
          padding-left: var(--accent-card-padding, 20px);
          padding-right: var(--accent-card-padding, 20px);
          @apply --accent-card-subheading;
        }
        :host #content {
          font-size: 100%;
          padding: var(--accent-card-padding, 20px);
          @apply --accent-card-content;
        }
        :host #content:not(:last-child) {
          border-bottom: 1px solid var(--accent-card-footer-border-color);
        }
        :host #footer {
          padding-left: var(--accent-card-padding, 20px);
          padding-right: var(--accent-card-padding, 20px);
          @apply --accent-card-footer;
        }
      </style>
      <section id="card">
        <div class="image-outer" hidden$="[[!_hasProp(imageSrc)]]">
          <div class="image" style$="[[__backgroundStyle]]"></div>
        </div>
        <div class="body">
          <h1 id="heading"><slot name="heading"></slot></h1>
          <div id="subheading"><slot name="subheading"></slot></div>
          <div id="content"><slot name="content"></slot></div>
          <div id="footer"><slot name="footer"></slot></div>
        </div>
      </section>
    `}static get haxProperties(){return{canEditSource:!1,canPosition:!1,canEditSource:!1,gizmo:{title:"Accent Card",description:"A card with optional accent styling.",icon:"chrome-reader-mode",color:"light-blue",groups:["Media","Text"],handles:[{type:"media",url:"source"},{type:"text",url:"source"}],meta:{author:"nikkimk",owner:"The Pennsylvania State University"}},settings:{quick:[{property:"accentColor",title:"Accent Color",description:"An optional accent color.",inputMethod:"colorpicker",icon:"editor:format-color-fill"},{property:"dark",title:"Dark Theme",description:"Enable Dark Theme",inputMethod:"boolean",icon:"icons:invert-colors"},{property:"horizontal",title:"Horizontal",description:"Horizontal orientation?",inputMethod:"boolean"}],configure:[{slot:"heading",title:"Heading",description:"A heading for the card.",inputMethod:"textfield"},{slot:"subheading",title:"Subheading",description:"An optional subheading for the card.",inputMethod:"textfield"},{slot:"content",title:"Content",description:"Content for the card.",inputMethod:"textfield"},{slot:"footer",title:"Footer",description:"An optional footer for the card.",inputMethod:"textfield"},{property:"imageSrc",title:"Image",description:"Optional image",inputMethod:"textfield",icon:"editor:insert-photo"},{property:"accentColor",title:"Accent Color",description:"An optional accent color.",inputMethod:"colorpicker",icon:"editor:format-color-fill"},{property:"dark",title:"Dark Theme",description:"Enable Dark Theme",inputMethod:"boolean",icon:"icons:invert-colors"},{property:"horizontal",title:"Horizontal",description:"Horizontal orientation?",inputMethod:"boolean"},{property:"accentHeading",title:"Heading Accent",description:"Apply the accent color to the heading?",inputMethod:"boolean"},{property:"accentBackground",title:"Background Accent",description:"Apply the accent color to the card background?",inputMethod:"boolean"},{property:"noBorder",title:"No Border Accent",description:"Remove the border accent?",inputMethod:"boolean"},{property:"flat",title:"Flat",description:"Remove the box shadow?",inputMethod:"boolean"}],advanced:[]}}}static get properties(){return{accentBackground:{type:Boolean,value:!1,reflectToAttribute:!0},accentHeading:{type:Boolean,value:!1,reflectToAttribute:!0},flat:{type:Boolean,value:!1,reflectToAttribute:!0},horizontal:{type:Boolean,value:!1,reflectToAttribute:!0},imageSrc:{type:String,value:null},noBorder:{type:Boolean,value:!1,reflectToAttribute:!0},__backgroundStyle:{type:String,computed:"_getBackgroundStyle(imageSrc)"}}}connectedCallback(){super.connectedCallback();this.HAXWiring=new HAXWiring;this.HAXWiring.setup(AccentCard.haxProperties,AccentCard.tag,this)}ready(){super.ready()}_hasProp(prop){return prop!==void 0&&null!==prop}_getBackgroundStyle(imageSrc){if(this._hasProp(imageSrc)){return"background-image: url("+imageSrc+");"}else{return"display: none;"}}}window.customElements.define(AccentCard.tag,AccentCard);export{AccentCard};