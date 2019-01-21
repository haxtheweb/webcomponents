import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import{dom}from"./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";import"./node_modules/@polymer/iron-ajax/iron-ajax.js";import"./node_modules/@polymer/iron-list/iron-list.js";import"./node_modules/@polymer/paper-button/paper-button.js";import"./node_modules/@lrnwebcomponents/elmsln-loading/elmsln-loading.js";import"./lib/site-card.js";let SitesListing=Polymer({_template:html`
    <style>
      :host {
        height: 100vh;
        display: flex;
        flex-direction: column;
      }
      iron-list {
        flex: 1 1 auto;
      }
      #loading {
        width: 100%;
        z-index: 1000;
        opacity: 0.8;
        padding: 16px;
        text-align: center;
        align-content: center;
        justify-content: center;
        height: 100vh;
        position: absolute;
        background-color: rgba(250, 250, 250, 0.8);
        transition: all linear 0.8s;
        visibility: visible;
      }
      #loading div {
        font-size: 32px;
        font-weight: bold;
        padding: 16px;
      }
      #loading[data-loading] {
        background-color: rgba(0, 0, 0, 0);
        opacity: 0;
        visibility: hidden;
      }
      site-card {
        padding: 16px;
        font-size: 16px;
      }
      paper-button.site-card-wrapper {
        margin: 0;
        padding: 0;
      }
    </style>
    <iron-ajax
      id="loaddata"
      auto=""
      loading="{{__loading}}"
      url="[[dataSource]]"
      handle-as="json"
      debounce-duration="250"
      last-response="{{sitesResponse}}"
    ></iron-ajax>
    <div id="loading" data-loading\$="[[!__loading]]">
      <elmsln-loading size="large"></elmsln-loading>
      <div>Loading..</div>
    </div>
    <iron-list id="list" items="[[sites]]" as="site" grid="">
      <template>
        <paper-button
          on-focusin="_mouseEnter"
          on-focusout="_mouseLeave"
          data-site-id\$="[[site.id]]"
          class="site-card-wrapper"
          on-tap="_siteClicked"
        >
          <site-card
            data-site-id\$="[[site.id]]"
            size="[[size]]"
            image="[[site.metadata.image]]"
            icon="[[site.metadata.icon]]"
            name="[[site.title]]"
            title="[[site.description]]"
            elevation="2"
          ></site-card>
        </paper-button>
      </template>
    </iron-list>
  `,is:"sites-listing",properties:{sitesResponse:{type:Object,notify:!0,observer:"_sitesResponseChanged"},sites:{type:Array,notify:!0},size:{type:String,value:"large"},dataSource:{type:String},loadLocation:{type:Boolean,value:!1}},attached:function(){window.addEventListener("sites-listing-refresh-data",this.refreshData.bind(this))},detached:function(){window.removeEventListener("sites-listing-refresh-data",this.refreshData.bind(this))},refreshData:function(e){this.$.loaddata.generateRequest()},_sitesResponseChanged:function(newValue,oldValue){if(newValue){if(typeof newValue.items!==typeof void 0){this.set("sites",[]);this.set("sites",newValue.items);this.notifyPath("sites.*")}}},_siteClicked:function(e){var normalizedEvent=dom(e),local=normalizedEvent.localTarget,active=local.getAttribute("data-site-id");let findSite=this.sites.filter(site=>{if(site.id!==active){return!1}return!0});if(0<findSite.length){findSite=findSite.pop()}if(this.loadLocation&&typeof findSite.location!==typeof void 0){window.location.href=findSite.location}this.fire("sites-listing-item-selected",findSite)},_mouseEnter:function(e){let card=dom(e.target).querySelectorAll("site-card")[0];card.__oldElevation=card.elevation;if(5<card.elevation+2){card.elevation=5}else{card.elevation+=2}},_mouseLeave:function(e){let card=dom(e.target).querySelectorAll("site-card")[0];card.elevation=card.__oldElevation}});export{SitesListing};