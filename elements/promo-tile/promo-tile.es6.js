import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{afterNextRender}from"./node_modules/@polymer/polymer/lib/utils/render-status.js";import{SchemaBehaviors}from"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";/**
 * `promo-tile`
 * @demo demo/index.html
 */class PromoTile extends SchemaBehaviors(PolymerElement){constructor(){super();import("./node_modules/@polymer/paper-button/paper-button.js");import("./node_modules/@polymer/iron-icon/iron-icon.js");import("./node_modules/@polymer/iron-icons/iron-icons.js");afterNextRender(this,function(){this.HAXWiring=new HAXWiring;this.HAXWiring.setup(PromoTile.haxProperties,PromoTile.tag,this)})}static get template(){return html`
      <style>
        :host {
          display: block;
          --tile-image: "";
          --front-title-text-shadow: #363533;
          --title-font-size: 34px;
          --title-font-weight: 400;
          --back-content-font-size: 18px;
          --back-content-font-weight: 100;
          --font-color: #fff;
          --hover-background-color: #e2801e;
          --button-hover-color: #363533;
        }

        a {
          text-decoration: none;
        }

        #container {
          width: 100%;
          height: auto;
        }

        .back_card {
          background-color: var(--hover-background-color);
          height: 460px;
          opacity: 0;
          display: flex;
          flex-direction: column;
        }

        :host([hover]) #container .back_card {
          opacity: 0.9;
          transition: all 0.3s ease-in-out;
        }

        :host([hover]) #container .front_card .front_title {
          opacity: 0;
          transition: all 0.3s ease-in-out;
        }

        .image {
          display: flex;
          justify-content: center;
          background-image: var(--tile-image);
          background-position: top center;
          background-repeat: no-repeat;
          background-size: cover;
          width: 100%;
          height: 100%;
        }

        .front_title {
          opacity: 1;
          position: absolute;
          display: flex;
          align-self: flex-end;
          padding-bottom: 25px;
        }

        .front_title h1 {
          color: var(--font-color);
          font-size: var(--title-font-size);
          font-weight: var(--title-font-weight);
          text-shadow: 1px 1px 3px var(--front-title-text-shadow);
        }

        .back_title {
          opacity: 1;
          display: flex;
          justify-content: center;
          padding: 20px 0 0;
        }

        .back_title h1 {
          color: var(--font-color);
          font-size: var(--title-font-size);
          font-weight: var(--title-font-weight);
        }

        .back_content {
          color: var(--font-color);
          font-size: var(--back-content-font-size);
          font-weight: var(--back-content-font-weight);
          padding: 0 20px;
        }

        paper-button#learn {
          display: flex;
          margin-top: 180px;
          font-size: 16px;
          color: var(--font-color);
          border: solid 1px #fff;
          border-radius: 0;
          width: 50%;
          margin-left: auto;
          margin-right: auto;
        }

        paper-button#learn:hover,
        paper-button#learn:focus {
          background-color: var(--button-hover-color);
        }
      </style>

      <div id="container">
        <div class="front_card">
          <div id="front_image" class="image" alt="[[alt]]">
            <div class="front_title">
              <h1>[[title]]</h1>
            </div>
            <div class="back_card" id="cardBack" on-click="activateBtn">
              <div class="back_title">
                <h1>[[title]]</h1>
              </div>
              <div class="back_content">
                <slot></slot>
              </div>
              <div class="learn_more">
                <a
                  tabindex="-1"
                  href="[[url]]"
                  id="link"
                  target$="[[_urlTarget(url)]]"
                >
                  <paper-button id="learn" no-ink
                    >[[label]]
                    <iron-icon icon="chevron-right"></iron-icon>
                  </paper-button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}static get tag(){return"promo-tile"}static get properties(){let props={/**
       * Image source
       */image:{type:String,value:"",reflectToAttribute:!0},/**
       * Alt text for image
       */alt:{type:String,value:"",reflectToAttribute:!0},/**
       * Label for button
       */label:{type:String,value:"",reflectToAttribute:!0},/**
       * Title of tile
       */title:{type:String,value:"",reflectToAttribute:!0},/**
       * Url for tile
       */url:{type:String,value:"",reflectToAttribute:!0},/**
       * Hover state
       */hover:{type:Boolean,value:!1,reflectToAttribute:!0}};if(super.properties){props=Object.assign(props,super.properties)}return props}static get observers(){return["__updateStyles(image)"]}/**
   * Attached to the DOM, now fire.
   */connectedCallback(){super.connectedCallback();afterNextRender(this,function(){this.addEventListener("mouseover",this.__hoverIn.bind(this));this.addEventListener("mouseout",this.__hoverOut.bind(this));this.addEventListener("focusin",this.__hoverIn.bind(this));this.addEventListener("focusout",this.__hoverOut.bind(this))})}disconnectedCallback(){this.removeEventListener("mouseover",this.__hoverIn.bind(this));this.removeEventListener("mouseout",this.__hoverOut.bind(this));this.removeEventListener("focusin",this.__hoverIn.bind(this));this.removeEventListener("focusout",this.__hoverOut.bind(this));super.disconnectedCallback()}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Promo-Tile",description:"A tile element for promoting content.",icon:"icons:dashboard",color:"orange",groups:["Content","Media"],handles:[{type:"content",source:"image",title:"citation",url:"source"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"title",title:"Title",description:"The title of the tile",inputMethod:"textfield",icon:"editor:title"},{property:"image",title:"Image",description:"The image of the tile",inputMethod:"textfield",icon:"editor:insert-photo"},{property:"url",title:"Link",description:"The link of the tile",inputMethod:"textfield",icon:"editor:insert-link"}],configure:[{property:"title",title:"Title",description:"The title of the tile",inputMethod:"textfield",icon:"editor:title"},{property:"image",title:"Image",description:"The image of the tile",inputMethod:"textfield",icon:"editor:insert-photo"},{property:"alt",title:"Alt",description:"The alt text for the image",inputMethod:"textfield",icon:"editor:mode-edit"},{property:"url",title:"Link",description:"The link of the tile",inputMethod:"textfield",icon:"editor:insert-link"},{property:"label",title:"Label",description:"The label for the button",inputMethod:"textfield",icon:"editor:title"}],advanced:[]}}}__updateStyles(image){this.updateStyles({"--tile-image":`url(${image})`})}/**
   * Internal function to check if a url is external
   */_outsideLink(url){if(0!=url.indexOf("http"))return!1;var loc=location.href,path=location.pathname,root=loc.substring(0,loc.indexOf(path));return 0!=url.indexOf(root)}/**
   * If url is external, open link in new window, otherwise open link in same window.
   */_urlTarget(url){if(url){const external=this._outsideLink(url);if(external){return"_blank"}}return!1}activateBtn(){if(this.hover){const link=this.shadowRoot.querySelector("#link");if(700<window.innerWidth){link.click()}}}__hoverIn(){this.hover=!0}__hoverOut(){this.hover=!1}}window.customElements.define(PromoTile.tag,PromoTile);export{PromoTile};