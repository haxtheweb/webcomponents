import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";import"./node_modules/@lrnwebcomponents/hax-body-behaviors/hax-body-behaviors.js";import"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";import"./node_modules/@polymer/paper-button/paper-button.js";import"./node_modules/@polymer/iron-icon/iron-icon.js";import"./node_modules/@polymer/iron-icons/iron-icons.js";let PromoTile=Polymer({_template:html`
    <style>
      :host {
        display: block;
        --tile-image: "";
        --font-color: #fff;
        --hover-background-color: #e2801e;
        --hover-link: #e0e0e0;
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
        background-image: var(--tile-image);
        background-position: top center;
        background-repeat: no-repeat;
        background-size: cover;
        width: 100%;
        height: 100%;
        justify-content: center;
      }

      .front_title {
        opacity: 1;
        float: left;
        margin: 375px 0 0 25px;
        font-size: 40px;
        color: var(--font-color);
        border-bottom: solid 5px #fff;
        border-radius: 5px;
        padding-bottom: 5px;
      }

      .back_title {
        opacity: 1;
        font-size: 40px;
        color: var(--font-color);
        float: left;
        margin: -390px 0 0 25px;
        border-bottom: solid 5px #fff;
        border-radius: 5px;
        padding-bottom: 5px;
      }

      .back_content {
        color: var(--font-color);
        font-size: 16px;
        clear: left;
        position: relative;
        bottom: 334px;
        width: 85%;
        margin-left: auto;
        margin-right: auto;
        padding-top: 10px;
      }
      .learn_more {
        float: right;
        margin-top: -75px;
        font-size: 16px;
        color: var(--font-color);
        margin-right: 10px;
      }
      :host([hover]) .learn_more paper-button {
        color: var(--hover-link);
      }
    </style>

    <div id="container">
      <div class="front_card">
        <div class="front_title">[[title]]</div>
        <div id="front_image" class="image" alt="[[alt]]">
          <div class="back_card" id="cardBack" on-click="activateBtn">
            <div class="back_title">[[title]]</div>
            <div class="back_content"><slot></slot></div>
            <div class="learn_more">
              <a
                tabindex="-1"
                href="[[url]]"
                id="link"
                target$="[[_urlTarget(url)]]"
              >
                <paper-button no-ink
                  >Learn More
                  <iron-icon icon="chevron-right"></iron-icon>
                </paper-button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,is:"promo-tile",behaviors:[HAXBehaviors.PropertiesBehaviors,MaterializeCSSBehaviors.ColorBehaviors,SchemaBehaviors.Schema],properties:{image:{type:String,value:"",reflectToAttribute:!0},alt:{type:String,value:"",reflectToAttribute:!0},title:{type:String,value:"",reflectToAttribute:!0},url:{type:String,value:"",reflectToAttribute:!0},hover:{type:Boolean,value:!1,reflectToAttribute:!0}},observers:["__updateStyles(image)"],listeners:{mouseover:"__hoverIn",mouseout:"__hoverOut",focusin:"__hoverIn",focusout:"__hoverOut"},attached:function(){let props={canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Promo-Tile",description:"A tile element for promoting content.",icon:"icons:dashboard",color:"orange",groups:["Content","Media"],handles:[{type:"content",source:"image",title:"citation",url:"source"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"title",title:"Title",description:"The title of the tile",inputMethod:"textfield",icon:"editor:title"},{property:"image",title:"Image",description:"The image of the tile",inputMethod:"textfield",icon:"editor:insert-photo"},{property:"url",title:"Link",description:"The link of the tile",inputMethod:"textfield",icon:"editor:insert-link"}],configure:[{property:"title",title:"Title",description:"The title of the tile",inputMethod:"textfield",icon:"editor:title"},{property:"image",title:"Image",description:"The image of the tile",inputMethod:"textfield",icon:"editor:insert-photo"},{property:"alt",title:"Alt",description:"The alt text for the image",inputMethod:"textfield",icon:"editor:mode-edit"},{property:"url",title:"Link",description:"The link of the tile",inputMethod:"textfield",icon:"editor:insert-link"}],advanced:[]}};this.setHaxProperties(props)},__updateStyles:function(image){this.updateStyles({"--tile-image":`url(${image})`})},_outsideLink:function(url){if(0!=url.indexOf("http"))return!1;var loc=location.href,path=location.pathname,root=loc.substring(0,loc.indexOf(path));return 0!=url.indexOf(root)},_urlTarget:function(url){if(url){const external=this._outsideLink(url);if(external){return"_blank"}}return!1},activateBtn:function(){if(this.hover){const link=this.$.link;if(700<window.innerWidth){link.click()}}},__hoverIn:function(){this.hover=!0},__hoverOut:function(){this.hover=!1}});export{PromoTile};