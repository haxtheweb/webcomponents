import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import{dom}from"./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";import*as async from"./node_modules/@polymer/polymer/lib/utils/async.js";import{updateStyles}from"./node_modules/@polymer/polymer/lib/mixins/element-mixin.js";import"./node_modules/@polymer/app-layout/app-header/app-header.js";import"./node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js";import"./node_modules/@polymer/app-layout/app-drawer/app-drawer.js";import"./node_modules/@polymer/app-layout/app-drawer-layout/app-drawer-layout.js";import"./node_modules/@polymer/app-layout/app-header-layout/app-header-layout.js";import"./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";import"./node_modules/@lrnwebcomponents/haxcms-elements/lib/haxcms-theme-behavior.js";import"./node_modules/@lrnwebcomponents/hax-body/lib/hax-shared-styles.js";import"./node_modules/@lrnwebcomponents/map-menu/map-menu.js";import{store as routerStore}from"./node_modules/@lrnwebcomponents/haxcms-elements/lib/haxcms-site-router.js";import{autorun,toJS}from"./node_modules/mobx/lib/mobx.module.js";import"./lib/outline-player-arrow.js";let OutlinePlayer=Polymer({_template:html`
    <style include="simple-colors hax-shared-styles">
      :host {
        display: block;
        font-family: libre baskerville;
        position: relative;
        overflow: hidden;
        --outline-player-min-height: 100vh;
        --app-drawer-width: 300px;
        --outline-player-dark: #222222;
        --outline-player-light: #f8f8f8;
        --outline-player-arrow-margin-top: 50px;
      }

      :host([closed]) {
        --app-drawer-width: 0px;
      }

      h1 {
        font-size: 48px;
        line-height: 16px;
      }

      h2 {
        font-size: 32px;
      }

      h3 {
        font-size: 28px;
      }

      p {
        line-height: 26px;
        min-height: 26px;
      }

      a,
      a:visited,
      a:active {
        color: #000;
      }

      a:hover {
        color: #2196f3;
      }

      ul li {
        padding-bottom: 24px;
        line-height: 1.5;
        color: #424242;
        max-width: 448px;
      }

      ul li:last-child {
        padding-bottom: 16px;
      }

      app-drawer-layout {
        min-height: 100vh;
        min-height: -moz-available; /* WebKit-based browsers will ignore this. */
        min-height: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
        min-height: fill-available;
        /* if the user has set a specific value then override the defaults */
        min-height: var(--outline-player-min-height);
      }

      .outline-title {
        font-size: 24px;
        font-weight: normal;
        line-height: 32px;
        vertical-align: middle;
        padding: 16px;
        height: 32px;
        margin: 0;
        text-align: center;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-word;
        border-bottom: 1px solid #eeeeee;
        position: sticky;
      }

      #menu {
        padding: 8px;
      }

      outline-player-navigation {
        --outline-player-dark: var(--outline-player-dark);
      }

      div[main-title] {
        margin-left: 16px;
        font-size: 20px;
        line-height: 20px;
        overflow-wrap: break-word;
        text-overflow: ellipsis;
        display: inline-block;
        word-break: break-word;
      }

      paper-progress {
        display: block;
        width: 100%;
        --paper-progress-active-color: rgba(255, 255, 255, 0.5);
        --paper-progress-container-color: transparent;
      }

      app-header {
        color: var(--outline-player-dark);
        /* Enable outline to be placed anywhere in the dom */
        /* This will override the app-header-layout forcing fixed mode */
        /*position: absolute !important;
        left: 0 !important;*/
        --app-header-background-rear-layer: {
          /* app-header-layout will force fixed */
          background-color: var(--outline-player-light);
        }
      }

      app-toolbar {
        border-bottom: none;
        background-color: #ffffff;
        box-shadow: 0 0 6px -3px var(--outline-player-dark);
      }
      app-drawer {
        box-shadow: 0 0 6px -3px var(--outline-player-dark);
        overflow: hidden;
        --app-drawer-scrim-background: rgba(80, 80, 80, 0.8);
        --app-drawer-content-container: {
          overflow: hidden;
          background-color: var(--outline-player-light);
        }
      }
      app-drawer-layout[narrow] app-toolbar {
        position: fixed !important;
        left: 0;
        right: 0;
      }
      app-drawer-layout[narrow] #contentcontainer {
        padding-top: 64px;
      }
      #content {
        justify-content: center;
        padding: 0 8px 8px 8px;
      }

      #content > * {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      /* Required for HAX */
      :host([edit-mode]) #slot {
        display: none !important;
      }
      #contentcontainer {
        max-width: 840px;
        margin: 0 auto;
        padding: 0 16px 16px 16px;
        flex: 1 1 auto;
        order: 1;
        display: flex;
      }
      #contentcontainer > * {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        width: 100%;
      }
      #contentcontainer h-a-x {
        margin: 0;
      }
      map-menu {
        height: calc(100vh - 80px);
        --map-menu-container: {
          padding: 0;
        }
      }
      map-menu::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.3);
        border-radius: 0;
        background-color: #fafafa;
      }
      map-menu::-webkit-scrollbar {
        width: 4px;
        background-color: #fafafa;
      }
      map-menu::-webkit-scrollbar-thumb {
        border-radius: 2px;
        -webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.3);
        background-color: #444444;
      }
    </style>
    <!-- Control the sites query paremeters -->

    <!-- Begin Layout -->
    <app-drawer-layout>
      <app-drawer id="drawer" swipe-open="" slot="drawer">
        <template is="dom-if" if="[[__hasTitle(manifest.title)]]">
          <h2 class="outline-title">[[manifest.title]]</h2>
        </template>
        <map-menu
          id="menu"
          selected="[[selected]]"
          manifest="[[_routerManifest]]"
          active-indicator
          auto-scroll
        ></map-menu>
      </app-drawer>
      <app-header-layout>
        <app-header slot="header" reveals>
          <app-toolbar>
            <paper-icon-button
              icon="menu"
              on-click="_toggleMenu"
            ></paper-icon-button>
            <div main-title>
              [[activeItem.title]]
              <div id="slotTitle"><slot name="title"></slot></div>
            </div>
            <outline-player-arrow
              id="prevpage"
              disabled="[[disablePrevPage(__activeIndex)]]"
              icon="icons:arrow-back"
              on-click="prevPage"
              >Previous
            </outline-player-arrow>
            <outline-player-arrow
              id="nextpage"
              disabled="[[disableNextPage(__activeIndex)]]"
              icon="icons:arrow-forward"
              on-click="nextPage"
              >Next
            </outline-player-arrow>
          </app-toolbar>
        </app-header>
        <div id="content">
          <div id="contentcontainer">
            <div id="slot"><slot></slot></div>
          </div>
        </div>
      </app-header-layout>
    </app-drawer-layout>
  `,is:"outline-player",behaviors:[HAXCMSBehaviors.Theme],properties:{manifest:{type:Object},auto:{type:Boolean,notify:!0,value:!1},outlineFile:{type:String,value:"outline.json",notify:!0},outlineLocation:{type:String,notify:!0},selected:{type:String,notify:!0,observer:"_selectedPageChanged"},closed:{type:Boolean,notify:!0,reflectToAttribute:!0,value:!1},_activeItemContent:{type:String,observer:"_activeItemContentChanged"},outline:{type:Array,notify:!0,observer:"_outlineChanged"},activeItem:{type:Object,notify:!0},fillRemaining:{type:Boolean,value:!1,reflectToAttribute:!0},_routerManifest:{type:Object,value:{}},_location:{type:Object,observer:"_locationChanged"},editMode:{type:Boolean,reflectToAttribute:!0,observer:"_editModeChanged"}},_editModeChanged:function(newValue){if(typeof newValue!==typeof void 0){async.microTask.run(()=>{window.dispatchEvent(new Event("resize"));updateStyles()})}},ready:function(){this.setupHAXTheme(!0,this.$.contentcontainer);autorun(()=>{this._routerManifest=toJS(routerStore.manifest)});autorun(()=>{this._location=routerStore.location});autorun(()=>{if(routerStore.activeItem&&"undefined"!==typeof routerStore.activeItem){this.selected=routerStore.activeItem.id}})},attached:function(){},_locationChanged:function(newValue){if(!newValue||"undefined"===typeof newValue.route)return;const location=newValue,name=location.route.name;if("home"===name||"404"===name){const firstItem=this.manifest.items.find(i=>"undefined"!==typeof i.id);if(firstItem){setTimeout(()=>{this.selected=firstItem.id},500);window.dispatchEvent(new CustomEvent("json-outline-schema-active-item-changed",{detail:firstItem}))}}},_toggleMenu:function(e){this.$.drawer.toggle();this.closed=!this.$.drawer.opened;async.microTask.run(()=>{window.dispatchEvent(new Event("resize"));updateStyles()})},wipeSlot:function(element,slot="*"){if("*"===slot){while(null!==dom(element).firstChild){dom(element).removeChild(dom(element).firstChild)}}else{for(var i in dom(element).childNodes){if(typeof dom(element).childNodes[i]!==typeof void 0&&dom(element).childNodes[i].slot===slot){dom(element).removeChild(dom(element).childNodes[i])}}}},_activeItemContentChanged:function(newValue,oldValue){if(typeof newValue!==typeof void 0){this.wipeSlot(this,"*");if(null!==newValue){let frag=document.createRange().createContextualFragment(newValue);dom(this).appendChild(frag)}}},disablePrevPage:function(index){if(0===index){return!0}return!1},disableNextPage:function(index){if(index===this.manifest.items.length-1){return!0}return!1},prevPage:function(e){this.changePage("previous")},nextPage:function(e){this.changePage("next")},changePage:function(direction){if("next"==direction&&this.__activeIndex<this.manifest.items.length-1){window.history.pushState({},null,this._routerManifest.items[this.__activeIndex+1].location);window.dispatchEvent(new PopStateEvent("popstate"))}else if("previous"==direction&&0<this.__activeIndex){window.history.pushState({},null,this._routerManifest.items[this.__activeIndex-1].location);window.dispatchEvent(new PopStateEvent("popstate"))}},_selectedPageChanged:function(newValue,oldValue){if(typeof newValue!==typeof void 0){if(typeof this.manifest!==typeof void 0){const item=this.manifest.items.filter((d,i)=>{if(newValue===d.id){this.__activeIndex=i;return d}}).pop();this.set("activeItem",item);window.scrollTo({top:0,left:0,behavior:"smooth"})}}},__hasTitle:function(outlineTitle){return outlineTitle?!0:!1}});export{OutlinePlayer};