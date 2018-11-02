import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { updateStyles } from "@polymer/polymer/lib/mixins/element-mixin.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/hardware-icons.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-styles/color.js";
import "paper-search/paper-search-bar.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-slider/paper-slider.js";
import "@polymer/app-layout/app-layout.js";
import "@polymer/app-layout/app-drawer/app-drawer.js";
import "@polymer/app-layout/app-header/app-header.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "@polymer/app-layout/app-scroll-effects/app-scroll-effects.js";
import "@polymer/app-route/app-location.js";
import "@polymer/app-route/app-route.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "@lrnwebcomponents/lrndesign-stepper/lrndesign-stepper.js";
import "@lrnwebcomponents/lrnsys-progress/lrnsys-progress.js";
import "@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
import "@lrnwebcomponents/page-scroll-position/page-scroll-position.js";
import "@lrnwebcomponents/hax-body/hax-body.js";
import "@lrnwebcomponents/material-progress/material-progress.js";
import "@lrnwebcomponents/lrndesign-mapmenu/lrndesign-mapmenu.js";
import "./lib/lrnapp-book-progress-dashboard.js";
/**
`lrnapp-book`
A LRN element

@demo demo/index.html

@microcopy
  node / circle - A progress circle on the line
  nodes / items - the list of items in the progress bar
  bubble - reserved for when events fire out of an element or value is tracking events
  percentage - amount complete either in the bar or the nodes themselves
  bar - the underlayed bar that's tracking overall progression
  author mode - authoring mode
*/
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
      :host([drawer-opened]) .content-nav-buttons paper-icon-button {
        width: 2.5em;
        height: 2.5em;
      }
      :host([edit-mode]) .content-nav-buttons {
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
      :host([full-width]) {
        --app-drawer-width: 0px;
      }
      :host([drawer-opened]) .prev,
      :host([edit-mode]) .prev {
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
      :host([edit-mode]) #editbutton {
        width: 100%;
        z-index: 100;
        right: 0;
        bottom: 0;
        border-radius: 0;
        margin: 0;
        padding: 1em;
        background-color: var(--paper-blue-500) !important;
      }
      :host([edit-mode]) #header {
        background-color: var(--paper-grey-500);
      }
      :host([edit-mode]) #toolbar {
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
    /**
     * Path for getting progress dashboard data
     */
    progressDashboardPath: {
      type: String
    },
    /**
     * Option to display the search bar.
     */
    showSearch: {
      type: Boolean,
      reflectToAttribute: true,
      value: false
    },
    /**
     * Request body parameters for creating a new item.
     */
    createRequestBody: {
      type: Object,
      computed: "_computeCreateRequestBody(currentPageData)"
    },
    /**
     * Data to be shipped off to the update endpoint.
     */
    updatePageData: {
      type: Object,
      value: {
        id: null,
        type: null,
        attributes: {}
      }
    },
    /**
     * Path for updating content.
     */
    pageUpdatePath: {
      type: String,
      computed: "_computePageUpdatePath(data, sourcePath)"
    },
    /**
     * Source path to the 'find one' end point
     */
    sourcePath: {
      type: String
    },
    /**
     * Edit / authoring mode.
     */
    editMode: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
      observer: "_editModeChanged"
    },
    /**
     * Binding so we can style based on drawer status
     * @type {Object}
     */
    drawerOpened: {
      type: Boolean,
      value: true,
      reflectToAttribute: true
    },
    /**
     * App route tracking.
     */
    route: {
      type: Object,
      notify: true
    },
    /**
     * Title for the content
     */
    currentTitle: {
      type: String
    },
    /**
     * Title for the top of the bar
     */
    outlineTitle: {
      type: String
    },
    /**
     * Title for the top of the bar
     */
    bookTitle: {
      type: String,
      value: "Course outline"
    },
    /**
     * If the sound should play on finish.
     */
    soundFinish: {
      type: Boolean,
      value: true
    },
    /**
     * If the sound should play on complete.
     */
    sound: {
      type: Boolean,
      value: true
    },
    /**
     * Completing a step sound.
     */
    completeSound: {
      type: String,
      value: ""
    },
    /**
     * Finished sound file.
     */
    finishedSound: {
      type: String,
      value: ""
    },
    /**
     * Distance through the present document so we can visualize
     */
    scrollPosition: {
      type: Number,
      value: 0,
      observer: "_scrollChanged"
    },
    /**
     * Track the active page exposed from the progress bar.
     */
    activePage: {
      type: Number,
      value: 0,
      observer: "_activePageChanged"
    },
    /**
     * Track the active outline to load data for the progress bar.
     */
    activeOutline: {
      type: Number,
      value: 0,
      observer: "_activeOutlineChanged"
    },
    /**
     * List of items in our outline presently.
     */
    outlineItems: {
      type: Array,
      value: [],
      notify: true,
      observer: "_outlineItemsChanged"
    },
    /**
     * List of items in our book presently.
     */
    bookItems: {
      type: Array,
      value: [],
      notify: true
    },
    /**
     * Item responses.
     */
    itemResponses: {
      type: Array,
      value: []
    },
    /**
     * Params for the request for outline/book to load.
     */
    requestParams: {
      type: Object,
      notify: true,
      value: {
        node: null
      }
    },
    /**
     * Params for the request for content to load.
     */
    pageParams: {
      type: Object,
      notify: true,
      value: {
        load: false
      }
    },
    /**
     * Returned data for processing.
     */
    outlineData: {
      type: Object,
      notify: true
    },
    /**
     * Returned data for processing.
     */
    bookData: {
      type: Object,
      notify: true
    },
    /**
     * Returned data for processing.
     */
    pageData: {
      type: Object,
      notify: true
    },
    /**
     * data pathway that expects the present outline returned.
     */
    outlinePath: {
      type: String
    },
    /**
     * data pathway that expects the book chapters returned.
     */
    bookPath: {
      type: String
    },
    /**
     * data pathway that expects the book chapters returned.
     */
    pagePath: {
      type: String
    },
    /**
     * Simple flag for having the previous button show.
     */
    hasPrevPage: {
      type: Boolean,
      notify: true
    },
    /**
     * Previous page title.
     */
    prevLabel: {
      type: String
    },
    /**
     * Simple flag for having the next button show.
     */
    hasNextPage: {
      type: Boolean,
      notify: true
    },
    /**
     * Next page title.
     */
    nextLabel: {
      type: String
    },
    /**
     * Ensure scrolling doesn't influence during a transition.
     */
    resetScroll: {
      type: Boolean,
      value: false
    },
    /**
     * Store current page data.
     */
    currentPageData: {
      type: Object,
      value: {},
      observer: "_currentPageDataUpdated"
    },
    /**
     * Store current page data.
     */
    responseData: {
      type: Object,
      value: {}
    },
    /**
     * Rebuild outline flag so we know to call it on page build.
     */
    rebuildOutline: {
      type: Boolean,
      value: false
    },
    /**
     * Track if we should go full width or not.
     */
    fullWidth: {
      type: Boolean,
      reflectToAttribute: true,
      value: false,
      observer: "_fullWidthChanged"
    }
  },

  /**
   * Ready event.
   */
  ready: function(e) {
    this.$.bodyloading.hidden = true;
    // fire an outline request to kick things off!
    this.$.outlineajax.generateRequest();

    // scroll top into view
    setTimeout(() => {
      this._resetScroll();
    }, 500);
  },

  /**
   * When element is told to be full width it'll close things.
   */
  _fullWidthChanged: function(newValue, oldValue) {
    updateStyles();
  },

  /**
   * Handle click on dashboard to trigger loading data.
   */
  progressdashboardopen: function(e) {
    this.$.progressdashboard.showProgress = true;
  },

  /**
   * Generate path to point to the right endpoint for updating items.
   */
  _computePageUpdatePath: function(data, sourcePath) {
    return sourcePath.replace("%", data.id);
  },

  /**
   * Hax operation capture and UI routing.
   */
  _haxOperation: function(e) {
    this.$.toast.show(e.detail.eventName);
  },

  /**
   * HAX Content Insert.
   */
  _haxContentInsert: function(e) {
    this.$.toast.show(e.detail.eventName);
    var properties = {};
    // support for properties to be set automatically optionally
    if (typeof e.detail.properties !== typeof undefined) {
      properties = e.detail.properties;
    }
    this.$.haxbody.haxInsert(e.detail.tag, e.detail.content, properties);
  },

  /**
   * Calculate what would happen if we added a page here.
   */
  _computeCreateRequestBody: function(currentPageData) {
    if (typeof currentPageData.page !== typeof undefined) {
      return {
        bid: currentPageData.page.relationships.book.id,
        pid: currentPageData.page.relationships.parent.id
      };
    }
  },

  /**
   * Simple state toggle for edit button being pressed.
   */
  _toggleEditMode: function(e) {
    this.editMode = !this.editMode;
  },

  /**
   * React when state changes for editMode
   */
  _editModeChanged: function(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      if (newValue === true) {
        // update the button to be for saving state
        this.$.editbutton.icon = "save";
        this.$.editbutton.title = "Tap to save content and exit edit mode";
        this.$.fablabel = "save changes";
        // simple way to remember state of opened drawer
        this.__bookdraweropened = this.$.bookdrawer.opened;
        // close the menu to give us more room to work
        if (this.$.bookdrawer.opened) {
          this.$.bookdrawer.opened = false;
        }
        // open the haxpanel
        this.$.haxpanel.opened = true;
        // play things in an editable state and let hax take over from here
        this.$.currenttitle.contentEditable = true;
        this.$.haxbody.editMode = true;
        // block scroll tracking during edit mode
        this.resetScroll = true;
        // notification to user
        this.$.toast.show("Authoring mode active");
      } else {
        // reset visuals
        this.$.editbutton.icon = "editor:mode-edit";
        this.$.editbutton.title = "Tap to place content in edit mode.";
        this.$.fablabel = "edit mode";
        this.$.bookdrawer.opened = this.__bookdraweropened;
        // open the haxpanel
        this.$.haxpanel.opened = false;
        // play things in an editable state and let hax take over from here
        this.$.currenttitle.contentEditable = false;
        this.$.haxbody.editMode = false;
        // allow scrolling to take place now
        this.resetScroll = false;
        // we were in edit mode, now time to save for real
        if (oldValue === true) {
          let updated = false;
          // get computed / cleaned up content area
          let haxcontent = this.$.haxbody.haxToContent();
          // see if title changed
          if (this.$.currenttitle.innerHTML !== this.currentPageData.title) {
            this.currentPageData.title = this.$.currenttitle.innerHTML;
            this.updatePageData.attributes.title = this.currentPageData.title;
          }
          // see if content updated
          if (this.currentPageData.content !== haxcontent) {
            this.currentPageData.content = haxcontent;
            this.updatePageData.attributes.body = this.currentPageData.content;
            updated = true;
          }
          // see if we've changed anything in order to ship off
          if (updated) {
            // set type and id data from routing and ship this off!
            this.updatePageData.type = this.data.type;
            this.updatePageData.id = this.data.id;
            this.$.toast.show("Saving...");
            this.$.pageupdateajax.generateRequest();
          }
        }
      }
    }
  },

  /**
   * Get response back from the server on updating this content.
   */
  _handleUpdateResponse: function(e) {
    // @todo error checking here
    this.$.toast.show("Saved!");
  },

  /**
   * Change the activeOutline
   */
  _bookOutlineTap: function(e) {
    var normalizedEvent = dom(e);
    var local = normalizedEvent.localTarget;
    // support switching if the thing clicked has a book index associated
    if (typeof local.getAttribute("data-book-parent") !== typeof undefined) {
      this.activeOutline = local.getAttribute("data-book-parent");
    }
  },

  /**
   * A book level button was pressed, we need to invoke a change of
   * content as well as outline.
   */
  _activeOutlineChanged: function(newValue, oldValue) {
    if (
      typeof newValue !== typeof undefined &&
      typeof oldValue !== typeof undefined
    ) {
      // trigger loading state
      this.rebuildOutline = true;
    }
  },

  /**
   * If the current route is outside the scope of our app then allow
   * the website to break out of the single page application routing.
   */
  _routeChanged: function(data, route, endPoint) {
    if (typeof route.path === "string") {
      if (typeof endPoint === "string") {
        if (route.path.startsWith(endPoint)) {
          // trigger change if data location changed
          if (
            this.pageParams.load != false &&
            typeof data.type !== typeof undefined &&
            typeof data.id !== typeof undefined
          ) {
            // prime the page request parameters
            this.pageParams[data.type] = data.id;
            // test if we already have this request
            if (
              typeof this.responseData[data.type + data.id] !== typeof undefined
            ) {
              this.set(
                "currentPageData",
                this.responseData[data.type + data.id]
              );
            } else {
              // trigger loading state
              this.$.bodyloading.hidden = false;
              // send request out the door to the actual end point
              this.$.pageajax.generateRequest();
            }
            // support for being told to rebuild the outline
            if (this.rebuildOutline) {
              // dirty rebuild of params
              this.set("requestParams", []);
              // our page params have the current page in scope
              this.set("requestParams", this.pageParams);
              // test if we already have this request
              if (
                typeof this.responseData[
                  data.type + "." + data.id + ".outline"
                ] !== typeof undefined
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
                this.$.outlineloading.hidden = false;
                this.pageParams.load = false;
                // send request out the door to the actual end point
                this.$.outlineajax.generateRequest();
              }
              this.rebuildOutline = false;
            }
          }
          return;
        }
      }
      // reload the page which since route changed will load that page
      window.location.reload();
    }
  },

  /**
   * Reset scroll position visually and internally data wise.
   */
  _resetScroll: function() {
    this.resetScroll = true;
    this.scrollPosition = 0;
    this.$.anchor.scrollIntoView({
      block: "start",
      behavior: "smooth",
      inline: "nearest"
    });
  },

  /**
   * React to active page being changed.
   */
  _activePageChanged: function(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      if (typeof this.outlineItems !== typeof undefined) {
        this.set("route.path", this.outlineItems[newValue].url);
        // ensure that we clear any previously set update data
        this.updatePageData.attributes = {};
        this.updatePageData.id = null;
        this.updatePageData.type = null;
      }
      // scroll into view the container that's about to be swapped out
      if (typeof oldValue !== typeof undefined) {
      }
      // ensure that scrolling percentage doesn't increase the next item
      // while active is being changed
      setTimeout(() => {
        this.resetScroll = false;
      }, 1000);

      // manage the previous page button on the UI
      if (newValue == 0) {
        this.hasPrevPage = false;
      } else {
        this.hasPrevPage = true;
        if (typeof this.outlineItems !== typeof undefined) {
          this.prevLabel = this.outlineItems[newValue - 1].title;
        }
      }
      // manage next page button on the UI
      if (
        typeof this.outlineItems !== typeof undefined &&
        newValue + 1 == this.outlineItems.length
      ) {
        this.hasNextPage = false;
      } else {
        this.hasNextPage = true;
        if (typeof this.outlineItems !== typeof undefined) {
          this.nextLabel = this.outlineItems[newValue + 1].title;
        }
      }
    }
  },

  /**
   * React to items being changed.
   */
  _outlineItemsChanged: function(newValue, oldValue) {
    // these need set immediately
    if (typeof newValue !== typeof undefined && newValue.length != 0) {
      // manage the previous page button on the UI
      if (this.activePage != 0) {
        this.prevLabel = newValue[this.activePage - 1].title;
      }
      // manage next page button on the UI
      if (this.activePage + 1 != newValue.length) {
        this.nextLabel = newValue[this.activePage + 1].title;
      }
    }
  },

  /**
   * Test what milestone has been hit and if we should start to preload
   * items as a result of it!
   */
  testMilestone: function(e) {
    // we should preload the next page
    if (e.detail.percentage == 75) {
      console.log(
        "@todo preload the next page and present grayed out right of UI."
      );
    }
  },

  /**
   * Pass down scroll change to the element for progress visualization.
   */
  _scrollChanged: function(newValue, oldValue) {
    // only evaluate scroll if value is greater then previous
    if (
      typeof this.outlineItems !== typeof undefined &&
      typeof this.outlineItems[this.activePage] !== typeof undefined &&
      newValue > this.outlineItems[this.activePage].value &&
      !this.resetScroll
    ) {
      // once we get 90% of the way through the material consider it finished
      if (newValue >= 75) {
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

  /**
   * Pass down the click to the next page if we have one
   */
  _nextBtn: function(e) {
    // make sure we are able to move forward more
    if (this.activePage < this.outlineItems.length - 1) {
      this.set(
        "outlineItems." + this.activePage + ".value",
        this.outlineItems[this.activePage].max
      );
      this.activePage = this.activePage + 1;
    }
  },

  /**
   * Pass down the click to the prev page if we have one
   */
  _prevBtn: function(e) {
    if (this.activePage > 0) {
      this.activePage = this.activePage - 1;
    }
  },

  /**
   * Toggle the book drawer
   */
  toggleBook: function(e) {
    // if we are in edit mode then we ned to close this
    if (this.editMode) {
      this.$.haxpanel.toggle();
      this.fullWidth = !this.$.haxpanel.opened;
    } else {
      this.$.bookdrawer.toggle();
      this.fullWidth = !this.$.bookdrawer.opened;
    }
  },

  /**
   * Handle the response.
   */
  handleOutlineResponse: function(obj) {
    if (typeof obj !== typeof undefined) {
      const response = obj.detail.response.data;
      const items = this._toArray(obj.detail.response.data.items);
      const outlineTitle = obj.detail.response.data.outlineTitle;
      // set active to 0 because once we update the outlineItems it will try to
      // pick a title and be out of sync for a moment in time
      if (this.activePage !== 0) {
        this.activePage = 0;
      }
      // store the response for the outline object data to skip future calls
      this.set(
        "responseData." + this.data.type + "." + this.data.id + ".outline",
        response
      );
      // set outline items to repaint, aggressively
      this.set("outlineItems", []);
      this.set("outlineItems", items);
      // set title to match new parent title
      this.set("outlineTitle", outlineTitle);
      var activePage = 0;
      // see if we can find a match of routing for an active page
      for (var i in items) {
        // we have a match; usually this would only happen on initial page load
        if (
          this.data.type === items[i].type &&
          this.data.id === items[i].id &&
          i !== 0
        ) {
          activePage = parseInt(i);
        }
      }
      if (activePage !== 0) {
        this.activePage = activePage;
      }
      this.$.outlineloading.hidden = true;
      this.pageParams.load = true;
      // only repopulate the first time
      if (this.bookItems.length === 0) {
        this.$.bookajax.generateRequest();
        // kick off page request to since we paint it into slot early
        // this allows us to do admin user perm checking on initial load
        this.pageParams = this.requestParams;
        this.$.pageajax.generateRequest();
      }
    }
  },

  /**
   * Handle the response.
   */
  handleBookResponse: function(obj) {
    const response = obj.detail.response.data;
    this.set("bookItems", this._toArray(response.items));
    // rip the items into the DOM
    // @todo might need to do the append HTML trick
    this.$.mapmenu.innerHTML = response.render;
  },

  /**
   * Page response callback.
   */
  handlePageResponse: function(obj) {
    if (typeof obj !== typeof undefined) {
      const response = obj.detail.response.data;
      this.set("responseData." + this.data.type + this.data.id, response);
      this.set("currentPageData", response);
    }
  },

  /**
   * Handle page object getting updated. This allows
   * for updating parts of the page either from the localcache
   * or from the ajax call.
   */
  _currentPageDataUpdated: function(newValue, oldValue) {
    if (
      typeof newValue !== typeof undefined &&
      typeof newValue.content !== typeof undefined
    ) {
      // set page title; easiest for sure
      this.set("currentTitle", newValue.title);
      // when updating data we need to clear the slot's content
      // while maintaining the data model correctly
      let slot = dom(this.$.haxbody);
      while (slot.firstChild !== null) {
        slot.removeChild(slot.firstChild);
      }
      // add HTML to a div which makes it's DOM unpack
      var tmp = document.createElement("div");
      let frag = document
        .createRange()
        .createContextualFragment(newValue.content);
      tmp.appendChild(frag);
      // trap for text without wrapping HTML tags
      if (tmp.firstChild == null) {
        var tmp2 = document.createElement("p");
        tmp2.innerHTML = tmp.innerHTML;
        tmp = document.createElement("div");
        tmp.innerHTML = tmp2.outerHTML;
      } else if (typeof tmp.firstChild.length !== typeof undefined) {
        var tmp2 = document.createElement("p");
        tmp2.innerHTML = tmp.innerHTML;
        tmp = document.createElement("div");
        tmp.innerHTML = tmp2.outerHTML;
      }
      // same as above but in reverse; now take stuf from what
      // came across and correctly add it into the slot
      while (tmp.firstChild) {
        dom(this.$.haxbody).appendChild(tmp.firstChild);
      }
      // reset scroll position back to top of this content
      this._resetScroll();
      // hide the loading area
      this.$.bodyloading.hidden = true;
      // manage state associated w/ edit mode if we were in edit mode previously
      if (this.editMode && !newValue.page.meta.canUpdate) {
        this.editMode = false;
      }
    }
  },

  /**
   * Simple way to convert from object to array.
   */
  _toArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
});
