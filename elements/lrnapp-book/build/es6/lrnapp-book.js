import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import { updateStyles } from "./node_modules/@polymer/polymer/lib/mixins/element-mixin.js";
import "./node_modules/@polymer/iron-icons/iron-icons.js";
import "./node_modules/@polymer/iron-icons/hardware-icons.js";
import "./node_modules/@polymer/iron-ajax/iron-ajax.js";
import "./node_modules/@polymer/paper-icon-button/paper-icon-button.js";
import "./node_modules/@polymer/paper-styles/color.js";
import "paper-search/paper-search-bar.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "./node_modules/@polymer/paper-slider/paper-slider.js";
import "./node_modules/@polymer/app-layout/app-layout.js";
import "./node_modules/@polymer/app-layout/app-drawer/app-drawer.js";
import "./node_modules/@polymer/app-layout/app-header/app-header.js";
import "./node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js";
import "./node_modules/@polymer/app-layout/app-scroll-effects/app-scroll-effects.js";
import "./node_modules/@polymer/app-route/app-location.js";
import "./node_modules/@polymer/app-route/app-route.js";
import "./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "./node_modules/@lrnwebcomponents/lrndesign-stepper/lrndesign-stepper.js";
import "./node_modules/@lrnwebcomponents/lrnsys-progress/lrnsys-progress.js";
import "./node_modules/@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
import "./node_modules/@lrnwebcomponents/page-scroll-position/page-scroll-position.js";
import "./node_modules/@lrnwebcomponents/hax-body/hax-body.js";
import "./node_modules/@lrnwebcomponents/material-progress/material-progress.js";
import "./node_modules/@lrnwebcomponents/lrndesign-mapmenu/lrndesign-mapmenu.js";
import "./lib/lrnapp-book-progress-dashboard.js";
Polymer({
  _template: html`
    <style include="materializecss-styles"></style>
    <style>
      :host {
        display: block;
        font-size: 1em;
        box-sizing: content-box;
      }
      #toolbar {
        color: gray;
        background-color: white;
        padding: 0 .5em;
        margin: 0;
        height: auto;
        box-sizing: content-box;
        transition: all .4s ease;
      }
      paper-button {
        padding: 0;
        margin: 0;
        min-width: 1rem;
      }

      hax-panel ::shadow app-drawer {
        padding: 0;
        top: 0;
        bottom: 0;
        position: absolute;
        box-sizing: content-box;
        margin-left: -300px;
        --app-drawer-content-container: {
          background-color: #fafafa;
          padding: 0;
          border-right: 1px solid #c8c8c8;
          overflow: inherit;
          width: 300px !important;
        }
      }
      app-drawer {
        padding: 0;
        top: 0;
        bottom: 0;
        z-index: 1;
        position: absolute;
        box-sizing: content-box;
        --app-drawer-content-container: {
          background-color: #fafafa;
          padding: 0;
          border-right: 1px solid #c8c8c8;
          overflow-y: scroll;
          width: 300px !important;
          box-shadow: 0 76px 8px 0 rgba(0, 0, 0, 0.4);
          height: 100vh;
          top: 0;
          position: sticky;
        }
      }
      hax-panel {
        font-size: .8rem;
      }
      hax-panel {
      --app-drawer-content-container: {
          background-color: #fafafa;
          padding: 0;
          border-right: 1px solid #c8c8c8;
          overflow-y: scroll;
          width: 300px !important;
          box-shadow: 0 76px 8px 0 rgba(0, 0, 0, 0.4);
          height: 100vh;
          top: 0;
          position: sticky;
        }
      }

      lrndesign-stepper-button {
        --lrndesign-stepper-btn-active: #f6f7f7;
      }
      lrndesign-stepper-button ::shadow paper-button {
        margin: 0;
        height: 3em;
      }
      lrndesign-stepper-button ::shadow .title-container.lrndesign-stepper-button {
        padding: 0;
        width: 100%;
        right: unset;
      }
      lrndesign-stepper-button ::shadow .node-title.lrndesign-stepper-button {
        font-size: .9em;
        line-height: 1.5em;
      }

      .loading {
        width: 100%;
        z-index: 1000;
        opacity: .9;
        text-align: center;
        align-content: space-around;
        justify-content: center;
        position: absolute;
        background-color: white;
        padding: 0;
        margin: 0;
        display: flex;
        margin: 0 auto;
        visibility: visible;
        transition: visibility 1s, opacity 1s ease;
      }
      .loading elmsln-loading {
        margin: 0 5em;
        display: inline-flex;
      }
      #bodyloading {
        height: 100%;
        display: flex;
        justify-content: center;
      }
      #bodyloading .loading,
      #bodyloading elmsln-loading{
        display: block;
        height: 5em;
      }
      .outline-title {
        margin-left: .5em;
        max-width: 50%;
      }
      .content-nav-buttons {
        top: 60%;
        position: fixed;
        opacity: .8;
        padding: 0 .25em;
        height: 40%;
        padding-top: 15%;
        margin-top: -15%;
      }
      .content-nav-buttons:hover {
        opacity: 1;
      }
      .prev {
        left: 0;
        order: 1;
      }
      .next {
        right: 0;
        transition: right .2s ease;
        order: 2;
      }
      app-header {
        width: 100%;
        left: 0 !important;
        z-index: 2 !important;
        position: sticky !important;
      }
      app-header-layout {
        margin: 0;
        padding: 0;
        width: 100%;
      }
      .content-body {
        position: relative;
        padding: 0;
        margin: -3em 4em 5em 4em;
        font-size: 1.1em;
        transition:
          margin .4s ease,
          width .4s ease;
      }

      .content-nav-buttons paper-icon-button {
        width: 4em;
        height: 4em;
        opacity: .4;
        display: block;
        visibility: visible;
        transition:
          opacity .4s linear,
          visibility 1s linear,
          height .4s ease,
          width .4s ease;
      }
      .content-nav-buttons paper-icon-button:hover {
        opacity: 1;
      }
      paper-tooltip {
        --paper-tooltip-opacity: .96;
      }
      :host[drawer-opened] .content-nav-buttons paper-icon-button {
        width: 2.5em;
        height: 2.5em;
      }
      :host[edit-mode] .content-nav-buttons {
        opacity: 0;
        pointer-events: none;
        visibility: hidden;
      }
      .content-title {
        font-size: 1.4em;
        margin: 0;
        padding: .25em 0;
        background-color: white;
        top: 70px;
        position: sticky;
      }
      .content-current {
        min-height: 100vh;
      }
      .content-next {
        background-color: grey;
        opacity: .8;
      }
      #header {
        position: sticky;
        top: 0;
        left: 0;
        width: 100%;
        color: black;
        background-color: white;
        z-index: 2;
        padding: 0;
        margin: 0;
        opacity: 1;
        box-sizing: content-box;
        transition: all .4s ease;
      }
      app-drawer-layout {
        font-family: sans-serif;
      }
      :host {
        --app-drawer-width: 300px;
      }
      :host[full-width] {
        --app-drawer-width: 0px;
      }
      :host[drawer-opened] .prev,
      :host[edit-mode] .prev {
        left: 17em;
      }
      .progress-container {
        width: 90%;
        padding: 0;
        margin: 0 0 0 1em;
        overflow: visible;
      }

      [main-title] {
        font-weight: lighter;
        padding: .6em 0 0 0;
        margin: 0;
        height: 3em;
        overflow-y: scroll;
      }
      [hidden] {
        visibility: hidden !important;
        opacity: 0 !important;
        display: block !important;
      }
      paper-search-bar[hidden] {
        display: none !important;
      }
      lrnsys-progress {
        margin-top: .5em;
        padding: .2em 0 0 0;
        box-sizing: content-box;
      }
      lrnsys-progress lrnsys-progress-circle {
        list-style-type: none;
        box-sizing: content-box;
      }

      #bookdrawercontent {
        overflow: scroll;
        visibility: visible;
        display: block;
        opacity: 1;
        transition: visibility 1s linear, opacity 1s linear;
      }
      @media (max-width: 1200px) {
        :host .content-body {
          font-size: .94em;
        }
      }
      @media (max-width: 960px) {
        :host .content-body {
          font-size: .92em;
        }
      }
      @media (max-width: 820px) {
        :host .content-body {
          font-size: .9em;
        }
      }
      @media (max-width: 700px) {
        :host .content-body {
          font-size: .9em;
        }
      }
      @media (max-width: 639px) {
        app-drawer-layout {
          top: 0;
        }
        [main-title] {
          font-size: .8em;
        }
        .content-title {
          font-size: 1.1em;
        }
        .outline-title {
          position: absolute !important;
          clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
          clip: rect(1px, 1px, 1px, 1px);
          overflow: hidden;
          height: 1px;
        }
        :host .content-body {
          margin: 0 .5em;
          font-size: .9em;
          width: 85%;
        }
        .content-nav-buttons {
          position: relative;
          display: flex;
          top: unset;
          padding: 0;
          opacity: .8;
          height: unset;
          margin: 0;
        }
        .content-nav {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          vertical-align: middle;
        }
        .next {
          right: unset;
        }
      }
      @media (max-width: 500px) {
        [main-title] {
          font-size: .7em;
        }
      }
      /**
       * Authoring section
       */
      #editbutton {
        position: fixed;
        bottom: 0;
        right: 0;
        margin: 2em;
        padding: .5em;
        width: 1.6em;
        height: 1.6em;
        visibility: visible;
        opacity: 1;
        transition: all .4s ease;
      }
      :host[edit-mode] #editbutton {
        width: 100%;
        z-index: 100;
        right: 0;
        bottom: 0;
        border-radius: 0;
        margin: 0;
        padding: 1em;
        background-color: var(--paper-blue-500) !important;
      }
      :host[edit-mode] #header {
        background-color: var(--paper-grey-500);
      }
      :host[edit-mode] #toolbar {
        opacity: .5;
      }
      .your-progress-button {
        padding-right: 1em;
      }
      #mapmenu {
        padding: 1em 0;
        overflow-x: hidden;
      }
      .course-title-drawer {
        font-size: 1.2em;
      }
    </style>
    <page-scroll-position value="{{scrollPosition}}"></page-scroll-position>
    <div id="anchor"></div>
    <iron-ajax id="outlineajax" params="[[requestParams]]" url="[[outlinePath]]" handle-as="json" on-response="handleOutlineResponse" last-response="{{outlineData}}"></iron-ajax>
    <iron-ajax id="bookajax" params="[[requestParams]]" url="[[bookPath]]" handle-as="json" on-response="handleBookResponse" last-response="{{bookData}}"></iron-ajax>
    <iron-ajax id="pageajax" url="[[pagePath]]" params="[[pageParams]]" handle-as="json" on-response="handlePageResponse" last-response="{{pageData}}"></iron-ajax>
    <iron-ajax id="pageupdateajax" url="[[pageUpdatePath]]" params="[[pageParams]]" method="PUT" body="[[updatePageData]]" content-type="application/json" handle-as="json" on-response="_handleUpdateResponse"></iron-ajax>
    <iron-ajax id="pagedeleteajax" url="[[pageDeletePath]]" params="[[pageParams]]" method="DELETE" content-type="application/json" handle-as="json" on-response="_handleDeleteResponse"></iron-ajax>
    <iron-ajax id="pagecreateajax" url="[[pageCreatePath]]" method="POST" body="[[createRequestBody]]" handle-as="json" on-response="_ajaxCreateStubHandler"></iron-ajax>

    <app-location route="{{route}}" query-params="{{queryParams}}"></app-location>
    <app-route route="{{route}}" pattern="[[endPoint]]/:type/:id" data="{{data}}" tail="{{tail}}" query-params="{{queryParams}}">
    </app-route>
  <!-- body where most of the heavy lifting happens -->
    <app-drawer-layout>
      <hax-panel id="haxpanel">
        <span slot="post">
          <lrnsys-collapselist-item>
          <span slot="label"><div class="label">Engagements</div></span>
          <span slot="content">
            <hax-panel-item icon="touch-app" icon-class="blue-text" label="Interactive video" event-name="h5p-interactive-video" voice-command="insert interactive video"></hax-panel-item>
            <hax-panel-item icon="hardware:videogame-asset" icon-class="red-text" label="Self-check" event-name="h5p-multiple-choice" voice-command="insert self check"></hax-panel-item>
            <hax-panel-item icon="timeline" icon-class="yellow-text text-darken-4" label="Timeline" event-name="timeline" voice-command="insert timeline"></hax-panel-item>
            <hax-panel-item icon="maps:place" icon-class="green-text" label="Map" event-name="map" voice-command="insert map"></hax-panel-item>
            <hax-panel-item icon="social:share" icon-class="pink-text" label="JMOL" event-name="jmol" voice-command="insert molecule"></hax-panel-item>
            <hax-panel-item icon="social:poll" icon-class="orange-text" label="Poll" event-name="poll" voice-command="insert poll"></hax-panel-item>
          </span>
        </lrnsys-collapselist-item>
        <lrnsys-collapselist-item>
          <span slot="label"><div class="label">Assessments</div></span>
          <span slot="content">
            <hax-panel-item icon="assignment" icon-class="yellow-text text-darken-2" label="Assignment" event-name="assignment" voice-command="insert assignment"></hax-panel-item>
            <hax-panel-item icon="assessment" icon-class="purple-text text-darken-2" label="Quiz" event-name="quiz" voice-command="insert quiz"></hax-panel-item>
          </span>
        </lrnsys-collapselist-item>
      </span>
      </hax-panel>
      <app-drawer slot="drawer" id="bookdrawer" opened="{{drawerOpened}}" swipe-open="" transition-duration="150">
        <div id="bookdrawercontent" style="height: 100%; overflow: auto;" hidden\$="[[!bookItems]]">
          <paper-search-bar hide-filter-button="" hidden\$="[[!showSearch]]"></paper-search-bar>
          <lrndesign-mapmenu id="mapmenu" on-tap="_bookOutlineTap">
            <!-- Server response will populate this -->
          </lrndesign-mapmenu>
        </div>
      </app-drawer>
      <app-header-layout>
        <app-header slot="header" id="header" shadow="" fixed="">
          <div id="outlineloading" class="loading">
            <elmsln-loading color="grey-text" size="medium"></elmsln-loading>
            <elmsln-loading color="grey-text" size="medium"></elmsln-loading>
            <elmsln-loading color="grey-text" size="medium"></elmsln-loading>
          </div>
          <app-toolbar id="toolbar" sticky="" class="tall">
            <div style="pointer-events: auto;" class="menu-btn-wrap">
              <paper-icon-button style="pointer-events: auto;" title="Content outline" id="menubutton" icon="menu"></paper-icon-button>
            </div>
            <div spacer="" class="outline-title">[[outlineTitle]]</div>
            <div spacer="" main-title="" style="pointer-events: auto;">
              <div class="progress-container">
                <lrnsys-progress sound-finish="[[soundFinish]]" sound="[[sound]]" complete-sound="[[completeSound]]" finished-sound="[[finishedSound]]" title="The steps to complete this lesson" id="progress" active="{{activePage}}" items="{{outlineItems}}" progressive-unlock="" size="small"></lrnsys-progress>
              </div>
            </div>
            <div class="your-progress-button">
              <lrnsys-dialog body-append="" modal="" on-tap="progressdashboardopen" header="Your progress" alt="Your progress">
                <span slot="button"><iron-icon icon="av:equalizer"></iron-icon></span>
                <div>
                  <lrnapp-book-progress-dashboard id="progressdashboard" source-path="[[progressDashboardPath]]" route-data="[[data]]"></lrnapp-book-progress-dashboard>
                </div>
              </lrnsys-dialog>
            </div>
          </app-toolbar>
        </app-header>
        <div class="content-body">
          <div id="current" class="content-current">
            <h2 id="currenttitle" class="content-title">[[currentTitle]]</h2>
            <div id="bodyloading" class="loading">
              <elmsln-loading color="grey-text" size="large"></elmsln-loading>
              <h3 class="loading-text">Loading content..</h3>
            </div>
            <div>
              <hax-body id="haxbody">
                <slot id="slottedarea"></slot>
              </hax-body>
            </div>
          </div>
        </div>
        <div class="content-nav">
          <div class="content-nav-buttons next">
            <paper-icon-button id="next" title="[[nextLabel]]" on-tap="_nextBtn" icon="hardware:keyboard-arrow-right" data-voicecommand="next page" hidden\$="[[!hasNextPage]]"></paper-icon-button>
            <paper-tooltip for="next" position="left" offset="0" animation-delay="100">
              [[nextLabel]]
            </paper-tooltip>
          </div>
          <div class="content-nav-buttons prev">
            <paper-icon-button id="prev" title="[[prevLabel]]" on-tap="_prevBtn" icon="hardware:keyboard-arrow-left" data-voicecommand="previous page" hidden\$="[[!hasPrevPage]]"></paper-icon-button>
            <paper-tooltip for="prev" position="right" offset="0" animation-delay="100">
              [[prevLabel]]
            </paper-tooltip>
          </div>
        </div>
      </app-header-layout>
    </app-drawer-layout>
    <!-- edit mode if they have permissions -->
    <paper-fab id="editbutton" icon="editor:mode-edit" class="red white-text" hidden\$="[[!currentPageData.page.meta.canUpdate]]" data-voicecommand="Edit content" on-tap="_toggleEditMode" title="Tap to place content in edit mode."></paper-fab>
    <paper-tooltip for="editbutton" position="bottom" offset="8" animation-delay="100">
      <span id="fablabel">edit mode</span>
    </paper-tooltip>
    <paper-toast id="toast" horizontal-align="left"></paper-toast>
`,
  is: "lrnapp-book",
  listeners: {
    "menubutton.tap": "toggleBook",
    "progress.node-percent-milestone": "testMilestone",
    "route-change": "_routeChange",
    "haxpanel.hax-item-selected": "_haxOperation",
    "haxpanel.hax-content-insert": "_haxContentInsert"
  },
  observers: ["_routeChanged(data, route, endPoint)"],
  properties: {
    progressDashboardPath: { type: String },
    showSearch: { type: Boolean, reflectToAttribute: !0, value: !1 },
    createRequestBody: {
      type: Object,
      computed: "_computeCreateRequestBody(currentPageData)"
    },
    updatePageData: {
      type: Object,
      value: { id: null, type: null, attributes: {} }
    },
    pageUpdatePath: {
      type: String,
      computed: "_computePageUpdatePath(data, sourcePath)"
    },
    sourcePath: { type: String },
    editMode: {
      type: Boolean,
      value: !1,
      reflectToAttribute: !0,
      observer: "_editModeChanged"
    },
    drawerOpened: { type: Boolean, value: !0, reflectToAttribute: !0 },
    route: { type: Object, notify: !0 },
    currentTitle: { type: String },
    outlineTitle: { type: String },
    bookTitle: { type: String, value: "Course outline" },
    soundFinish: { type: Boolean, value: !0 },
    sound: { type: Boolean, value: !0 },
    completeSound: { type: String, value: "" },
    finishedSound: { type: String, value: "" },
    scrollPosition: { type: Number, value: 0, observer: "_scrollChanged" },
    activePage: { type: Number, value: 0, observer: "_activePageChanged" },
    activeOutline: {
      type: Number,
      value: 0,
      observer: "_activeOutlineChanged"
    },
    outlineItems: {
      type: Array,
      value: [],
      notify: !0,
      observer: "_outlineItemsChanged"
    },
    bookItems: { type: Array, value: [], notify: !0 },
    itemResponses: { type: Array, value: [] },
    requestParams: { type: Object, notify: !0, value: { node: null } },
    pageParams: { type: Object, notify: !0, value: { load: !1 } },
    outlineData: { type: Object, notify: !0 },
    bookData: { type: Object, notify: !0 },
    pageData: { type: Object, notify: !0 },
    outlinePath: { type: String },
    bookPath: { type: String },
    pagePath: { type: String },
    hasPrevPage: { type: Boolean, notify: !0 },
    prevLabel: { type: String },
    hasNextPage: { type: Boolean, notify: !0 },
    nextLabel: { type: String },
    resetScroll: { type: Boolean, value: !1 },
    currentPageData: {
      type: Object,
      value: {},
      observer: "_currentPageDataUpdated"
    },
    responseData: { type: Object, value: {} },
    rebuildOutline: { type: Boolean, value: !1 },
    fullWidth: {
      type: Boolean,
      reflectToAttribute: !0,
      value: !1,
      observer: "_fullWidthChanged"
    }
  },
  ready: function() {
    this.$.bodyloading.hidden = !0;
    this.$.outlineajax.generateRequest();
    setTimeout(() => {
      this._resetScroll();
    }, 500);
  },
  _fullWidthChanged: function() {
    updateStyles();
  },
  progressdashboardopen: function() {
    this.$.progressdashboard.showProgress = !0;
  },
  _computePageUpdatePath: function(data, sourcePath) {
    return sourcePath.replace("%", data.id);
  },
  _haxOperation: function(e) {
    this.$.toast.show(e.detail.eventName);
  },
  _haxContentInsert: function(e) {
    this.$.toast.show(e.detail.eventName);
    var properties = {};
    if (typeof e.detail.properties !== typeof void 0) {
      properties = e.detail.properties;
    }
    this.$.haxbody.haxInsert(e.detail.tag, e.detail.content, properties);
  },
  _computeCreateRequestBody: function(currentPageData) {
    if (typeof currentPageData.page !== typeof void 0) {
      return {
        bid: currentPageData.page.relationships.book.id,
        pid: currentPageData.page.relationships.parent.id
      };
    }
  },
  _toggleEditMode: function() {
    this.editMode = !this.editMode;
  },
  _editModeChanged: function(newValue, oldValue) {
    if (typeof newValue !== typeof void 0) {
      if (!0 === newValue) {
        this.$.editbutton.icon = "save";
        this.$.editbutton.title = "Tap to save content and exit edit mode";
        this.$.fablabel = "save changes";
        this.__bookdraweropened = this.$.bookdrawer.opened;
        if (this.$.bookdrawer.opened) {
          this.$.bookdrawer.opened = !1;
        }
        this.$.haxpanel.opened = !0;
        this.$.currenttitle.contentEditable = !0;
        this.$.haxbody.editMode = !0;
        this.resetScroll = !0;
        this.$.toast.show("Authoring mode active");
      } else {
        this.$.editbutton.icon = "editor:mode-edit";
        this.$.editbutton.title = "Tap to place content in edit mode.";
        this.$.fablabel = "edit mode";
        this.$.bookdrawer.opened = this.__bookdraweropened;
        this.$.haxpanel.opened = !1;
        this.$.currenttitle.contentEditable = !1;
        this.$.haxbody.editMode = !1;
        this.resetScroll = !1;
        if (!0 === oldValue) {
          let updated = !1,
            haxcontent = this.$.haxbody.haxToContent();
          if (this.$.currenttitle.innerHTML !== this.currentPageData.title) {
            this.currentPageData.title = this.$.currenttitle.innerHTML;
            this.updatePageData.attributes.title = this.currentPageData.title;
          }
          if (this.currentPageData.content !== haxcontent) {
            this.currentPageData.content = haxcontent;
            this.updatePageData.attributes.body = this.currentPageData.content;
            updated = !0;
          }
          if (updated) {
            this.updatePageData.type = this.data.type;
            this.updatePageData.id = this.data.id;
            this.$.toast.show("Saving...");
            this.$.pageupdateajax.generateRequest();
          }
        }
      }
    }
  },
  _handleUpdateResponse: function() {
    this.$.toast.show("Saved!");
  },
  _bookOutlineTap: function(e) {
    var normalizedEvent = dom(e),
      local = normalizedEvent.localTarget;
    if (typeof local.getAttribute("data-book-parent") !== typeof void 0) {
      this.activeOutline = local.getAttribute("data-book-parent");
    }
  },
  _activeOutlineChanged: function(newValue, oldValue) {
    if (
      typeof newValue !== typeof void 0 &&
      typeof oldValue !== typeof void 0
    ) {
      this.rebuildOutline = !0;
    }
  },
  _routeChanged: function(data, route, endPoint) {
    if ("string" === typeof route.path) {
      if ("string" === typeof endPoint) {
        if (route.path.startsWith(endPoint)) {
          if (
            !1 != this.pageParams.load &&
            typeof data.type !== typeof void 0 &&
            typeof data.id !== typeof void 0
          ) {
            this.pageParams[data.type] = data.id;
            if (
              typeof this.responseData[data.type + data.id] !== typeof void 0
            ) {
              this.set(
                "currentPageData",
                this.responseData[data.type + data.id]
              );
            } else {
              this.$.bodyloading.hidden = !1;
              this.$.pageajax.generateRequest();
            }
            if (this.rebuildOutline) {
              this.set("requestParams", []);
              this.set("requestParams", this.pageParams);
              if (
                typeof this.responseData[
                  data.type + "." + data.id + ".outline"
                ] !== typeof void 0
              ) {
                this.activePage = 0;
                this.set("outlineItems", []);
                this.set(
                  "outlineItems",
                  this._toArray(
                    this.responseData[data.type + "." + data.id + ".outline"]
                      .items
                  )
                );
                this.set(
                  "outlineTitle",
                  this.responseData[data.type + "." + data.id + ".outline"]
                    .items.outlineTitle
                );
              } else {
                this.$.outlineloading.hidden = !1;
                this.pageParams.load = !1;
                this.$.outlineajax.generateRequest();
              }
              this.rebuildOutline = !1;
            }
          }
          return;
        }
      }
      window.location.reload();
    }
  },
  _resetScroll: function() {
    this.resetScroll = !0;
    this.scrollPosition = 0;
    this.$.anchor.scrollIntoView({
      block: "start",
      behavior: "smooth",
      inline: "nearest"
    });
  },
  _activePageChanged: function(newValue, oldValue) {
    if (typeof newValue !== typeof void 0) {
      if (typeof this.outlineItems !== typeof void 0) {
        this.set("route.path", this.outlineItems[newValue].url);
        this.updatePageData.attributes = {};
        this.updatePageData.id = null;
        this.updatePageData.type = null;
      }
      if (typeof oldValue !== typeof void 0) {
      }
      setTimeout(() => {
        this.resetScroll = !1;
      }, 1e3);
      if (0 == newValue) {
        this.hasPrevPage = !1;
      } else {
        this.hasPrevPage = !0;
        if (typeof this.outlineItems !== typeof void 0) {
          this.prevLabel = this.outlineItems[newValue - 1].title;
        }
      }
      if (
        typeof this.outlineItems !== typeof void 0 &&
        newValue + 1 == this.outlineItems.length
      ) {
        this.hasNextPage = !1;
      } else {
        this.hasNextPage = !0;
        if (typeof this.outlineItems !== typeof void 0) {
          this.nextLabel = this.outlineItems[newValue + 1].title;
        }
      }
    }
  },
  _outlineItemsChanged: function(newValue) {
    if (typeof newValue !== typeof void 0 && 0 != newValue.length) {
      if (0 != this.activePage) {
        this.prevLabel = newValue[this.activePage - 1].title;
      }
      if (this.activePage + 1 != newValue.length) {
        this.nextLabel = newValue[this.activePage + 1].title;
      }
    }
  },
  testMilestone: function(e) {
    if (75 == e.detail.percentage) {
      console.log(
        "@todo preload the next page and present grayed out right of UI."
      );
    }
  },
  _scrollChanged: function(newValue) {
    if (
      typeof this.outlineItems !== typeof void 0 &&
      typeof this.outlineItems[this.activePage] !== typeof void 0 &&
      newValue > this.outlineItems[this.activePage].value &&
      !this.resetScroll
    ) {
      if (75 <= newValue) {
        this.outlineItems[this.activePage].value = this.outlineItems[
          this.activePage
        ].max;
        this.set(
          "outlineItems." + this.activePage + ".value",
          this.outlineItems[this.activePage].max
        );
      } else {
        this.outlineItems[this.activePage].value = newValue;
        this.set("outlineItems." + this.activePage + ".value", newValue);
      }
    }
  },
  _nextBtn: function() {
    if (this.activePage < this.outlineItems.length - 1) {
      this.set(
        "outlineItems." + this.activePage + ".value",
        this.outlineItems[this.activePage].max
      );
      this.activePage = this.activePage + 1;
    }
  },
  _prevBtn: function() {
    if (0 < this.activePage) {
      this.activePage = this.activePage - 1;
    }
  },
  toggleBook: function() {
    if (this.editMode) {
      this.$.haxpanel.toggle();
      this.fullWidth = !this.$.haxpanel.opened;
    } else {
      this.$.bookdrawer.toggle();
      this.fullWidth = !this.$.bookdrawer.opened;
    }
  },
  handleOutlineResponse: function(obj) {
    if (typeof obj !== typeof void 0) {
      const response = obj.detail.response.data,
        items = this._toArray(obj.detail.response.data.items),
        outlineTitle = obj.detail.response.data.outlineTitle;
      if (0 !== this.activePage) {
        this.activePage = 0;
      }
      this.set(
        "responseData." + this.data.type + "." + this.data.id + ".outline",
        response
      );
      this.set("outlineItems", []);
      this.set("outlineItems", items);
      this.set("outlineTitle", outlineTitle);
      var activePage = 0;
      for (var i in items) {
        if (
          this.data.type === items[i].type &&
          this.data.id === items[i].id &&
          0 !== i
        ) {
          activePage = parseInt(i);
        }
      }
      if (0 !== activePage) {
        this.activePage = activePage;
      }
      this.$.outlineloading.hidden = !0;
      this.pageParams.load = !0;
      if (0 === this.bookItems.length) {
        this.$.bookajax.generateRequest();
        this.pageParams = this.requestParams;
        this.$.pageajax.generateRequest();
      }
    }
  },
  handleBookResponse: function(obj) {
    const response = obj.detail.response.data;
    this.set("bookItems", this._toArray(response.items));
    this.$.mapmenu.innerHTML = response.render;
  },
  handlePageResponse: function(obj) {
    if (typeof obj !== typeof void 0) {
      const response = obj.detail.response.data;
      this.set("responseData." + this.data.type + this.data.id, response);
      this.set("currentPageData", response);
    }
  },
  _currentPageDataUpdated: function(newValue) {
    if (
      typeof newValue !== typeof void 0 &&
      typeof newValue.content !== typeof void 0
    ) {
      this.set("currentTitle", newValue.title);
      let slot = dom(this.$.haxbody);
      while (null !== slot.firstChild) {
        slot.removeChild(slot.firstChild);
      }
      var tmp = document.createElement("div");
      let frag = document
        .createRange()
        .createContextualFragment(newValue.content);
      tmp.appendChild(frag);
      if (null == tmp.firstChild) {
        var tmp2 = document.createElement("p");
        tmp2.innerHTML = tmp.innerHTML;
        tmp = document.createElement("div");
        tmp.innerHTML = tmp2.outerHTML;
      } else if (typeof tmp.firstChild.length !== typeof void 0) {
        var tmp2 = document.createElement("p");
        tmp2.innerHTML = tmp.innerHTML;
        tmp = document.createElement("div");
        tmp.innerHTML = tmp2.outerHTML;
      }
      while (tmp.firstChild) {
        dom(this.$.haxbody).appendChild(tmp.firstChild);
      }
      this._resetScroll();
      this.$.bodyloading.hidden = !0;
      if (this.editMode && !newValue.page.meta.canUpdate) {
        this.editMode = !1;
      }
    }
  },
  _toArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
});
