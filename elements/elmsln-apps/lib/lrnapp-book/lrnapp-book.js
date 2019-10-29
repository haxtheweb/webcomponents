/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html } from "@polymer/polymer/polymer-element.js";
import { HAXCMSPolymerElementTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSPolymerElementTheme.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/hardware-icons.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-styles/color.js";
import "@lrnwebcomponents/paper-search/lib/paper-search-bar.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-slider/paper-slider.js";
import "@lrnwebcomponents/simple-toast/simple-toast.js";
import "@polymer/app-layout/app-layout.js";
import "@polymer/app-layout/app-drawer/app-drawer.js";
import "@polymer/app-layout/app-header/app-header.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "@polymer/app-layout/app-scroll-effects/app-scroll-effects.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "@lrnwebcomponents/lrndesign-stepper/lrndesign-stepper.js";
import "@lrnwebcomponents/lrnsys-progress/lrnsys-progress.js";
import "@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
import "@lrnwebcomponents/page-scroll-position/page-scroll-position.js";
import "@lrnwebcomponents/material-progress/material-progress.js";
import "@lrnwebcomponents/map-menu/map-menu.js";
import "./lrnapp-book-progress-dashboard.js";
/**
`lrnapp-book`
A LRN element

* @demo demo/index.html

@microcopy
  node / circle - A progress circle on the line
  nodes / items - the list of items in the progress bar
  bubble - reserved for when events fire out of an element or value is tracking events
  percentage - amount complete either in the bar or the nodes themselves
  bar - the underlayed bar that's tracking overall progression
  author mode - authoring mode
*/
class LrnappBook extends HAXCMSPolymerElementTheme {
  static get template() {
    return html`
      <style include="materializecss-styles">
        :host {
          display: block;
          font-size: 16px;
          box-sizing: content-box;
        }
        #toolbar {
          color: gray;
          background-color: white;
          padding: 0 8px;
          margin: 0;
          height: auto;
          box-sizing: content-box;
          transition: all 0.4s ease;
        }
        paper-button {
          padding: 0;
          margin: 0;
          min-width: 16px;
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
        lrndesign-stepper-button {
          --lrndesign-stepper-btn-active: #f6f7f7;
        }
        lrndesign-stepper-button ::slotted(paper-button) {
          margin: 0;
          height: 48px;
        }
        lrndesign-stepper-button ::slotted(.title-container) {
          padding: 0;
          width: 100%;
          right: unset;
        }
        lrndesign-stepper-button ::slotted(.node-title) {
          font-size: 15px;
          line-height: 24px;
        }

        .loading {
          width: 100%;
          z-index: 1000;
          opacity: 0.9;
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
        #bodyloading elmsln-loading {
          display: block;
          height: 5em;
        }
        .outline-title {
          margin-left: 0.5em;
          max-width: 50%;
        }
        .content-nav-buttons {
          top: 60%;
          position: fixed;
          opacity: 0.8;
          padding: 0 0.25em;
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
          transition: right 0.2s ease;
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
          transition: margin 0.4s ease, width 0.4s ease;
        }

        .content-nav-buttons paper-icon-button {
          width: 4em;
          height: 4em;
          opacity: 0.4;
          display: block;
          visibility: visible;
          transition: opacity 0.4s linear, visibility 1s linear,
            height 0.4s ease, width 0.4s ease;
        }
        .content-nav-buttons paper-icon-button:hover {
          opacity: 1;
        }
        paper-tooltip {
          --paper-tooltip-opacity: 0.96;
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
          padding: 0.25em 0;
          background-color: white;
          top: 70px;
          position: sticky;
        }
        .content-current {
          min-height: 100vh;
        }
        .content-next {
          background-color: grey;
          opacity: 0.8;
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
          transition: all 0.4s ease;
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
          left: 19em;
        }
        .progress-container {
          width: 90%;
          padding: 0;
          margin: 0 0 0 1em;
          overflow: visible;
        }

        [main-title] {
          font-weight: lighter;
          padding: 0.6em 0 0 0;
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
          margin-top: 0.5em;
          padding: 0.2em 0 0 0;
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
            font-size: 0.94em;
          }
        }
        @media (max-width: 960px) {
          :host .content-body {
            font-size: 0.92em;
          }
        }
        @media (max-width: 820px) {
          :host .content-body {
            font-size: 0.9em;
          }
        }
        @media (max-width: 700px) {
          :host .content-body {
            font-size: 0.9em;
          }
        }
        @media (max-width: 639px) {
          app-drawer-layout {
            top: 0;
          }
          [main-title] {
            font-size: 0.8em;
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
            margin: 0 0.5em;
            font-size: 0.9em;
            width: 85%;
          }
          .content-nav-buttons {
            position: relative;
            display: flex;
            top: unset;
            padding: 0;
            opacity: 0.8;
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
            font-size: 0.7em;
          }
        }

        :host([edit-mode]) #header {
          background-color: var(--paper-grey-500);
        }
        :host([edit-mode]) #toolbar {
          opacity: 0.5;
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
        /**
        * Hide the slotted content during edit mode. This must be here to work.
        */
        :host([edit-mode]) #slot {
          display: none;
        }
      </style>
      <page-scroll-position value="{{scrollPosition}}"></page-scroll-position>
      <div id="anchor"></div>
      <!-- body where most of the heavy lifting happens -->
      <app-drawer-layout>
        <!-- LRNApp book we expect to navigate -->
        <app-drawer
          slot="drawer"
          id="bookdrawer"
          opened="{{drawerOpened}}"
          swipe-open=""
          transition-duration="300"
        >
          <div
            id="bookdrawercontent"
            style="height: 100%; overflow: auto;"
            hidden\$="[[!bookItems]]"
          >
            <paper-search-bar
              hide-filter-button=""
              hidden\$="[[!showSearch]]"
            ></paper-search-bar>
            <map-menu id="mapmenu" manifest="[[_routerManifest]]">
              <!-- Server response will populate this -->
            </map-menu>
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
                <paper-icon-button
                  style="pointer-events: auto;"
                  title="Content outline"
                  id="menubutton"
                  icon="menu"
                  on-click="toggleBook"
                ></paper-icon-button>
              </div>
              <div spacer="" class="outline-title">[[outlineTitle]]</div>
              <div spacer="" main-title="" style="pointer-events: auto;">
                <div class="progress-container">
                  <lrnsys-progress
                    sound-finish="[[soundFinish]]"
                    sound="[[sound]]"
                    complete-sound="[[completeSound]]"
                    finished-sound="[[finishedSound]]"
                    title="The steps to complete this lesson"
                    id="progress"
                    active="{{activePage}}"
                    manifest="{{manifest}}"
                    progressive-unlock=""
                    size="small"
                  ></lrnsys-progress>
                </div>
              </div>
              <!--
              <div class="your-progress-button">
                <lrnsys-dialog body-append modal on-click="progressdashboardopen" header="Your progress" alt="Your progress">
                  <span slot="button"><iron-icon icon="av:equalizer"></iron-icon></span>
                  <div>
                    <lrnapp-book-progress-dashboard id="progressdashboard" source-path="[[progressDashboardPath]]" route-data="[[data]]"></lrnapp-book-progress-dashboard>
                  </div>
                </lrnsys-dialog>
              </div>
            -->
            </app-toolbar>
          </app-header>
          <div class="content-body">
            <div id="current" class="content-current">
              <h2 id="currenttitle" class="content-title">[[currentTitle]]</h2>
              <div id="bodyloading" class="loading">
                <elmsln-loading color="grey-text" size="large"></elmsln-loading>
                <h3 class="loading-text">Loading content..</h3>
              </div>
              <div id="contentcontainer">
                <div id="slot"><slot></slot></div>
              </div>
            </div>
          </div>
          <div class="content-nav">
            <div class="content-nav-buttons next">
              <paper-icon-button
                id="next"
                title="[[nextLabel]]"
                on-click="_nextBtn"
                icon="hardware:keyboard-arrow-right"
                data-voicecommand="next page"
                hidden\$="[[!hasNextPage]]"
              ></paper-icon-button>
              <paper-tooltip
                for="next"
                position="left"
                offset="0"
                animation-delay="100"
              >
                [[nextLabel]]
              </paper-tooltip>
            </div>
            <div class="content-nav-buttons prev">
              <paper-icon-button
                id="prev"
                title="[[prevLabel]]"
                on-click="_prevBtn"
                icon="hardware:keyboard-arrow-left"
                data-voicecommand="previous page"
                hidden\$="[[!hasPrevPage]]"
              ></paper-icon-button>
              <paper-tooltip
                for="prev"
                position="right"
                offset="0"
                animation-delay="100"
              >
                [[prevLabel]]
              </paper-tooltip>
            </div>
          </div>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }

  static get tag() {
    return "lrnapp-book";
  }
  static get properties() {
    return {
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
        reflectToAttribute: true,
        value: false,
        notify: true,
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
      manifest: {
        type: Object,
        value: {},
        observer: "_manifestChanged"
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
      },
      /**
       * Private state for _routerManifest
       */
      _routerManifest: {
        type: Object,
        value: {}
      }
    };
  }

  /**
   * Ready event.
   */
  ready() {
    super.ready();
    window.dispatchEvent(
      new CustomEvent("haxcms-router-manifest-subscribe", {
        detail: {
          callback: "_haxcmsRouterManifestSubscribeHandler",
          scope: this,
          setup: true
        }
      })
    );
    window.SimpleToast.requestAvailability();
    this.shadowRoot.querySelector("#bodyloading").hidden = true;
    // scroll top into view
    setTimeout(() => {
      this._resetScroll();
    }, 500);
  }
  /**
   * attached life cycle
   */
  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot
      .querySelector("#progress")
      .addEventListener(
        "node-percent-milestone",
        this.testMilestone.bind(this)
      );
    this.shadowRoot
      .querySelector("#mapmenu")
      .addEventListener("link-clicked", this._menuItemClicked.bind(this));
  }
  /**
   * detached life cycle
   */
  disconnectedCallback() {
    this.shadowRoot
      .querySelector("#progress")
      .removeEventListener(
        "node-percent-milestone",
        this.testMilestone.bind(this)
      );
    this.shadowRoot
      .querySelector("#mapmenu")
      .removeEventListener("link-clicked", this._menuItemClicked.bind(this));
    super.disconnectedCallback();
  }
  _haxcmsRouterManifestSubscribeHandler(e) {
    this._routerManifest = {};
    this._routerManifest = e.detail;
  }
  _menuItemClicked(e) {
    let i = this.manifest.items.findIndex(j => j.id === e.detail.id);
    this.activePage = i;
  }
  /**
   * When element is told to be full width it'll close things.
   */
  _fullWidthChanged(newValue, oldValue) {
    this.updateStyles();
  }
  /**
   * Handle click on dashboard to trigger loading data.
   */
  progressdashboardopen(e) {
    this.shadowRoot.querySelector("#progressdashboard").showProgress = true;
  }

  /**
   * Generate path to point to the right endpoint for updating items.
   */
  _computePageUpdatePath(data, sourcePath) {
    return sourcePath.replace("%", data.id);
  }

  /**
   * React when state changes for editMode
   */
  _editModeChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      if (newValue === true) {
        this.shadowRoot.querySelector("#currenttitle").contentEditable = true;
        // block scroll tracking during edit mode
        this.resetScroll = true;
        // notification to user
        const evt = new CustomEvent("simple-toast-show", {
          bubbles: true,
          cancelable: true,
          detail: {
            text: "Editor mode active",
            duration: 5000
          }
        });
      } else {
        this.shadowRoot.querySelector("#currenttitle").contentEditable = false;
        // allow scrolling to take place now
        this.resetScroll = false;
        // we were in edit mode, now time to save for real
        if (oldValue === true) {
          // see if title changed
          if (
            this.shadowRoot.querySelector("#currenttitle").innerHTML !==
            this.currentPageData.title
          ) {
            this.currentPageData.title = this.shadowRoot.querySelector(
              "#currenttitle"
            ).innerHTML;
          }
          const evt = new CustomEvent("simple-toast-show", {
            bubbles: true,
            cancelable: true,
            detail: {
              text: "Saved",
              duration: 0
            }
          });
          this.dispatchEvent(evt);
        }
      }
    }
  }

  /**
   * A book level button was pressed, we need to invoke a change of
   * content as well as outline.
   */
  _activeOutlineChanged(newValue, oldValue) {
    if (
      typeof newValue !== typeof undefined &&
      typeof oldValue !== typeof undefined
    ) {
      // trigger loading state
      this.rebuildOutline = true;
    }
  }

  /**
   * Reset scroll position visually and internally data wise.
   */
  _resetScroll() {
    this.resetScroll = true;
    this.scrollPosition = 0;
    this.shadowRoot.querySelector("#anchor").scrollIntoView({
      block: "start",
      behavior: "smooth",
      inline: "nearest"
    });
  }

  /**
   * React to active page being changed.
   */
  _activePageChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      if (
        typeof this.outlineItems !== typeof undefined &&
        this.outlineItems.length > 0
      ) {
        this.dispatchEvent(
          new CustomEvent("json-outline-schema-active-item-changed", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this.outlineItems[newValue]
          })
        );
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
  }

  /**
   * React to items being changed.
   */
  _outlineItemsChanged(newValue, oldValue) {
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
  }

  /**
   * Test what milestone has been hit and if we should start to preload
   * items as a result of it!
   */
  testMilestone(e) {
    // we should preload the next page
    if (e.detail.percentage == 75) {
      console.log(
        "@todo preload the next page and present grayed out right of UI."
      );
    }
  }

  /**
   * Pass down scroll change to the element for progress visualization.
   */
  _scrollChanged(newValue, oldValue) {
    // only evaluate scroll if value is greater then previous
    if (
      typeof this.outlineItems !== typeof undefined &&
      typeof this.outlineItems[this.activePage] !== typeof undefined &&
      newValue > this.outlineItems[this.activePage].metadata.value &&
      !this.resetScroll
    ) {
      // once we get 90% of the way through the material consider it finished
      if (newValue >= 75) {
        this.outlineItems[this.activePage].metadata.value = this.outlineItems[
          this.activePage
        ].metadata.max;
        this.set(
          "outlineItems." + this.activePage + ".metadata.value",
          this.outlineItems[this.activePage].metadata.max
        );
      } else {
        this.outlineItems[this.activePage].metadata.value = newValue;
        this.set(
          "outlineItems." + this.activePage + ".metadata.value",
          newValue
        );
      }
    }
  }

  /**
   * Pass down the click to the next page if we have one
   */
  _nextBtn(e) {
    // make sure we are able to move forward more
    if (this.activePage < this.outlineItems.length - 1) {
      this.set(
        "outlineItems." + this.activePage + ".metadata.value",
        this.outlineItems[this.activePage].metadata.max
      );
      this.activePage = this.activePage + 1;
    }
  }

  /**
   * Pass down the click to the prev page if we have one
   */
  _prevBtn(e) {
    if (this.activePage > 0) {
      this.activePage = this.activePage - 1;
    }
  }

  /**
   * Toggle the book drawer
   */
  toggleBook(e) {
    // if we are in edit mode then we ned to close this
    this.shadowRoot.querySelector("#bookdrawer").toggle();
    this.fullWidth = !this.shadowRoot.querySelector("#bookdrawer").opened;
  }

  /**
   * Handle the response.
   */
  _manifestChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      const items = newValue.items;
      const outlineTitle = newValue.title;
      // set active to 0 because once we update the outlineItems it will try to
      // pick a title and be out of sync for a moment in time
      if (this.activePage !== 0) {
        this.activePage = 0;
      }
      // set outline items to repaint, aggressively
      this.set("outlineItems", []);
      this.set("outlineItems", items);
      this.notifyPath("outlineItems.*");
      this.set("bookItems", []);
      this.set("bookItems", items);
      this.notifyPath("bookItems.*");
      // set title to match new parent title
      this.outlineTitle = outlineTitle;
      this.shadowRoot.querySelector("#outlineloading").hidden = true;
      this.pageParams.load = true;
    }
  }
  /**
   * Handle page object getting updated. This allows
   * for updating parts of the page either from the localcache
   * or from the ajax call.
   */
  _currentPageDataUpdated(newValue, oldValue) {
    if (
      typeof newValue !== typeof undefined &&
      typeof newValue.content !== typeof undefined
    ) {
      // set page title; easiest for sure
      this.currentTitle = newValue.title;
      // reset scroll position back to top of this content
      this._resetScroll();
      // hide the loading area
      this.shadowRoot.querySelector("#bodyloading").hidden = true;
      // manage state associated w/ edit mode if we were in edit mode previously
      if (this.editMode && !newValue.page.meta.canUpdate) {
        this.editMode = false;
      }
    }
  }

  /**
   * Simple way to convert from object to array.
   */
  _toArray(obj) {
    if (obj == null) {
      return [];
    }
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
}
window.customElements.define(LrnappBook.tag, LrnappBook);
export { LrnappBook };
