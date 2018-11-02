import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import{dom}from"./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";import*as async from"./node_modules/@polymer/polymer/lib/utils/async.js";import{updateStyles}from"./node_modules/@polymer/polymer/lib/mixins/element-mixin.js";import"./node_modules/@polymer/iron-ajax/iron-ajax.js";import"./node_modules/@polymer/app-layout/app-header/app-header.js";import"./node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js";import"./node_modules/@polymer/app-layout/app-drawer/app-drawer.js";import"./node_modules/@polymer/app-layout/app-drawer-layout/app-drawer-layout.js";import"./node_modules/@polymer/app-layout/app-header-layout/app-header-layout.js";import"./node_modules/@polymer/paper-progress/paper-progress.js";import"./node_modules/@polymer/iron-media-query/iron-media-query.js";import"./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";import"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";import"./node_modules/@lrnwebcomponents/map-menu/map-menu.js";import"./lib/outline-player-arrow.js";Polymer({_template:html`
    <style include="materializecss-styles">
      :host {
        display: block;
        font-family: libre baskerville;
        position: relative;
        overflow: hidden;
        --outline-player-min-height: '';
        --app-drawer-width: 300px;
        --outline-player-dark: #222222;
        --outline-player-light: #F8F8F8;
        --outline-player-arrow-margin-top: 50px;
      }

      :host([closed]) {
        --app-drawer-width: 0px;
      }

      h1 {
        font-size: 3em;
        line-height: 1em;
      }

      h2 {
        font-size: 2em;
      }

      h3 {
        font-size: 1.75em;
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
        padding-bottom: 1.5em;
        line-height: 1.5;
        color: #424242;
        max-width: 28em;
      }

      ul li:last-child {
        padding-bottom: 1em;
      }

      app-toolbar {
        background-color: var(--outline-player-light);
        color: var(--outline-player-dark);
        font-weight: bold;
        border-bottom: solid 1px var(--outline-player-dark);
        -webkit-box-shadow: 0 0 6px -1px var(--outline-player-dark);
        box-shadow: 0 0 6px -1px var(--outline-player-dark);
      }

      app-drawer-layout {
        min-height: 100%;
        min-height: -moz-available;          /* WebKit-based browsers will ignore this. */
        min-height: -webkit-fill-available;  /* Mozilla-based browsers will ignore this. */
        min-height: fill-available;
        /* if the user has set a specific value then override the defaults */
        min-height: var(--outline-player-min-height);
      }

      .outline-title {
        font-size: 24px;
        height: 64px;
        padding: 16px;
        margin: 0;
      }

      #menu {
        padding: 8px;
      }

      outline-player-navigation {
        --outline-player-dark: var(--outline-player-dark);
      }

      paper-icon-button+[main-title] {
        margin-left: 24px;
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
        position: absolute !important;
        left: 0 !important;
        --app-header-background-rear-layer: {
          /* app-header-layout will force fixed */
          background-color: var(--outline-player-light);
        }
      }

      app-toolbar {
        box-shadow: none;
        border-bottom: none;
        background: none;
      }

      app-drawer {
        border-bottom: solid 1px var(--outline-player-dark);
        -webkit-box-shadow: 0 0 6px -3px var(--outline-player-dark);
        box-shadow: 0 0 6px -3px var(--outline-player-dark);
        position: absolute;
        min-height: var(--outline-play-min-height);
        --app-drawer-scrim-background: rgba(80, 80, 80, 0.8);
        --app-drawer-content-container: {
          overflow: scroll;
          background-color: var(--outline-player-light);
        }
      }

      #content {
        display: flex;
        justify-content: center;
      }

      #content>* {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      #slot {
        padding: 1em;
        max-width: 65em;
        flex: 1 1 auto;
        order: 1;
      }

      .desktopNav {
        margin-left: 2%;
        margin-right: 2%;
        position: relative;
        margin-top: var(--outline-player-arrow-margin-top);
      }

      #desktopNavLeft {
        order: 0
      }

      #desktopNavRight {
        order: 2
      }
    </style>
    <iron-ajax auto="[[auto]]" url="[[outlineLocation]][[outlineFile]]" handle-as="json" last-response="{{_outlineData}}"></iron-ajax>
    <iron-ajax auto="[[auto]]" url="[[outlineLocation]][[activeItem.location]]" handle-as="text" loading="{{__loadingContent}}" last-response="{{_activeItemContent}}"></iron-ajax>
    <app-drawer-layout>
      <app-drawer id="drawer" swipe-open="" slot="drawer">
        <template is="dom-if" if="[[__hasTitle(outlineTitle)]]">
          <h2 class="outline-title">[[outlineTitle]]</h2>
        </template>
        <map-menu id="menu" items="{{outline}}" data="[[_outlineData.items]]" selected="{{selected}}" active-indicator="" auto-scroll=""></map-menu>
      </app-drawer>
      <app-header-layout>
        <app-header reveals="" slot="header">
          <app-toolbar>
            <paper-icon-button icon="menu" on-click="_toggleMenu"></paper-icon-button>
            <div main-title="">
              [[activeItem.title]]
              <div id="slotTitle">
                <slot name="title"></slot>
              </div>
            </div>
            <template is="dom-if" if="[[!breakpointDesktop]]">
              <outline-player-arrow id="prevpage" disabled="[[disablePrevPage(__activeIndex)]]" icon="icons:arrow-back" on-click="prevPage">
                Previous page
              </outline-player-arrow>
              <outline-player-arrow id="nextpage" disabled="[[disableNextPage(__activeIndex)]]" icon="icons:arrow-forward" on-click="nextPage">
                Next page
              </outline-player-arrow>
            </template>
            <paper-progress hidden\$="[[!__loadingContent]]" value="10" indeterminate="" bottom-item=""></paper-progress>
          </app-toolbar>
        </app-header>
        <div id="content">
          <div id="slot">
            <slot></slot>
          </div>
          <template is="dom-if" if="[[breakpointDesktop]]">
            <div class="desktopNav" id="desktopNavLeft">
              <outline-player-arrow sticky="" id="prevpage" disabled="[[disablePrevPage(__activeIndex)]]" icon="icons:arrow-back" on-click="prevPage">
                Previous page
              </outline-player-arrow>
            </div>
            <div class="desktopNav" id="desktopNavRight">
              <outline-player-arrow sticky="" id="nextpage" disabled="[[disableNextPage(__activeIndex)]]" icon="icons:arrow-forward" on-click="nextPage">
                Next page
              </outline-player-arrow>
            </div>
          </template>
        </div>
      </app-header-layout>
    </app-drawer-layout>
    <iron-media-query query="(min-width: 700px)" query-matches="{{breakpointDesktop}}"></iron-media-query>
`,is:"outline-player",behaviors:[MaterializeCSSBehaviors.ColorBehaviors,SchemaBehaviors.Schema],properties:{auto:{type:Boolean,value:!1},outlineFile:{type:String,value:"outline.json"},outlineLocation:{type:String},outlineTitle:{type:String},selected:{type:String,observer:"_selectedPageChanged"},closed:{type:Boolean,reflectToAttribute:!0,value:!1},_activeItemContent:{type:String,observer:"_activeItemContentChanged"},outline:{type:Array,notify:!0,observer:"_outlineChanged"},activeItem:{type:Object,notify:!0},autoloader:{type:Array,value:["license-element","grid-plate","q-r","self-check","tab-list","multiple-choice","oer-schema","hero-banner","magazine-cover","task-list","video-player","lrn-table","media-image","lrndesign-blockquote","meme-maker","a11y-gif-player","paper-audio-player","wikipedia-query","wave-player","pdf-element","lrn-vocab","lrn-math","person-testimonial","citation-element","lrn-calendar","code-editor","place-holder","aframe-player"],observer:"_autoLoadChanged"},breakpointDesktop:{type:String,value:"600px"},fillRemaining:{type:Boolean,value:!1,reflectToAttribute:!0}},attached:function(){this.refreshDynamicPositions();window.addEventListener("resize",()=>{this.refreshDynamicPositions()})},refreshDynamicPositions(){const boundingRect=this.getBoundingClientRect(),windowHeight=window.innerHeight,minHeight=windowHeight-boundingRect.top;let styleChanges={};if(this.fillRemaining){styleChanges["--outline-player-min-height"]=minHeight+"px"}styleChanges["--outline-player-arrow-margin-top"]=minHeight/2-20+"px";this.updateStyles(styleChanges)},_toggleMenu:function(){this.$.drawer.toggle();this.closed=!this.$.drawer.opened;async.microTask.run(()=>{window.dispatchEvent(new Event("resize"));updateStyles()})},_autoLoadChanged:function(newValue){if(typeof newValue!==typeof void 0&&newValue.constructor===Array){if(typeof this.__processedList===typeof void 0){this.__processedList={}}for(var i in newValue){let tag=newValue[i].toLowerCase();if(typeof this.__processedList[tag]===typeof void 0){try{this.__processedList[tag]=tag;this.importHref(this.resolveUrl(`../${tag}/${tag}.html`),()=>{},()=>{})}catch(err){}}}}},wipeSlot:function(element,slot="*"){if("*"===slot){while(null!==dom(element).firstChild){dom(element).removeChild(dom(element).firstChild)}}else{for(var i in dom(element).childNodes){if(typeof dom(element).childNodes[i]!==typeof void 0&&dom(element).childNodes[i].slot===slot){dom(element).removeChild(dom(element).childNodes[i])}}}},_activeItemContentChanged:function(newValue){if(typeof newValue!==typeof void 0){this.wipeSlot(this,"*");if(null!==newValue){let frag=document.createRange().createContextualFragment(newValue);dom(this).appendChild(frag)}}},_outlineChanged:function(newValue,oldValue){if(typeof newValue!==typeof void 0&&typeof oldValue!==typeof void 0&&newValue.constructor===Array&&typeof newValue[0]!==typeof void 0){this.set("activeItem",newValue[0]);this.__activeIndex=0}},disablePrevPage:function(index){if(0===index){return!0}return!1},disableNextPage:function(index){if(index===this._outlineData.items.length-1){return!0}return!1},prevPage:function(){this.changePage("previous")},nextPage:function(){this.changePage("next")},changePage:function(direction){if("next"==direction&&this.__activeIndex<this._outlineData.items.length-1){this.selected=this._outlineData.items[this.__activeIndex+1].id}else if("previous"==direction&&0<this.__activeIndex){this.selected=this._outlineData.items[this.__activeIndex-1].id}const arrows=this.querySelectorAll("outline-player-arrow");for(let arrow of arrows){arrow.resetPosition()}},_selectedPageChanged:function(newValue){if(typeof newValue!==typeof void 0){if(typeof this._outlineData!==typeof void 0){const item=this._outlineData.items.filter((d,i)=>{if(newValue===d.id){this.__activeIndex=i;return d}}).pop();this.set("activeItem",item)}}},__hasTitle:function(outlineTitle){return outlineTitle?!0:!1}});