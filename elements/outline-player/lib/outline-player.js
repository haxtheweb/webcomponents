import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@lrnwebcomponents/map-menu/map-menu.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/app-layout/app-header/app-header.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "@polymer/app-layout/app-drawer/app-drawer.js";
import "@polymer/app-layout/app-drawer-layout/app-drawer-layout.js";
import "@polymer/app-layout/app-header-layout/app-header-layout.js";
import "@polymer/paper-progress/paper-progress.js";
import "@polymer/iron-media-query/iron-media-query.js";
import "./outline-player-arrow.js";
/**
`outline-player`
A LRN element

@demo demo/index.html

*/
Polymer({
  _template: html`
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

      :host[closed] {
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
`,

  is: "outline-player",

  behaviors: [MaterializeCSSBehaviors.ColorBehaviors, SchemaBehaviors.Schema],

  properties: {
    /**
     * Auto call json files
     */
    auto: {
      type: Boolean,
      value: false
    },
    /**
     * Outline JSON file name
     */
    outlineFile: {
      type: String,
      value: "outline.json"
    },
    /**
     * Outline JSON location
     */
    outlineLocation: {
      type: String
    },
    /**
     * Title of the outline.
     */
    outlineTitle: {
      type: String
    },
    /**
     * acitvely selected item
     */
    selected: {
      type: String,
      observer: "_selectedPageChanged"
    },
    /**
     * Closed status for the drawer
     */
    closed: {
      type: Boolean,
      reflectToAttribute: true,
      value: false
    },
    /**
     * Active item content
     */
    _activeItemContent: {
      type: String,
      observer: "_activeItemContentChanged"
    },
    /**
     * Outline structured via JSON Outline Schema off the wire
     */
    outline: {
      type: Array,
      notify: true,
      observer: "_outlineChanged"
    },
    /**
     * Active item which is in JSON Outline Schema
     */
    activeItem: {
      type: Object,
      notify: true
    },
    /**
     * Autoloader to ensure other components are there to work with
     */
    autoloader: {
      type: Array,
      value: [
        "license-element",
        "grid-plate",
        "q-r",
        "self-check",
        "tab-list",
        "multiple-choice",
        "oer-schema",
        "hero-banner",
        "magazine-cover",
        "task-list",
        "video-player",
        "lrn-table",
        "media-image",
        "lrndesign-blockquote",
        "meme-maker",
        "a11y-gif-player",
        "paper-audio-player",
        "wikipedia-query",
        "wave-player",
        "pdf-element",
        "lrn-vocab",
        "lrn-math",
        "person-testimonial",
        "citation-element",
        "lrn-calendar",
        "code-editor",
        "place-holder",
        "aframe-player"
      ],
      observer: "_autoLoadChanged"
    },
    /**
     * Define desktop breakpoint for adapted navigation
     */
    breakpointDesktop: {
      type: String,
      value: "600px"
    },
    /**
     * Set min height of outline player to fill remaining
     * space to the bottom of the browser
     */
    fillRemaining: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    }
  },

  attached: function() {
    // if the user has fill remaining selected then run it
    this.refreshDynamicPositions();
    // also start listening for future resizing events to
    // re-run the code
    window.addEventListener("resize", e => {
      this.refreshDynamicPositions();
    });
  },

  /**
   * Update calculations for fill-remaining and arrow position
   */
  refreshDynamicPositions() {
    // get bounding rect
    const boundingRect = this.getBoundingClientRect();
    // get windowHeight
    const windowHeight = window.innerHeight;
    // simple subtraction to find out what the remaining space is
    const minHeight = windowHeight - boundingRect.top;
    // now get where the arrows should be, and subtract 20 pixels to
    // account for the height of the button
    const arrowMargin = minHeight / 2 - 20;
    if (this.fillRemaining) {
      this.customStyle["--outline-player-min-height"] = minHeight + "px";
    }
    this.customStyle["--outline-player-arrow-margin-top"] = arrowMargin + "px";
    this.updateStyles();
  },

  /**
   * Link menu button to open and closing the side panel.
   */
  _toggleMenu: function(e) {
    this.$.drawer.toggle();
    // allow styling to trigger based on open status
    this.closed = !this.$.drawer.opened;
    // kind of silly it doesn't just work this way but
    // app-panel doesn't make any assumptions about how
    // to handle the layout when it closes
    this.async(function() {
      // trick browser into thinking we just reized
      window.dispatchEvent(new Event("resize"));
      // forcibly update styles via css variables
      Polymer.updateStyles();
    });
  },

  /**
   * Process only new elements
   */
  _autoLoadChanged: function(newValue, oldValue) {
    if (
      typeof newValue !== typeof undefined &&
      newValue.constructor === Array
    ) {
      if (typeof this.__processedList === typeof undefined) {
        this.__processedList = {};
      }
      // when new nodes show up in the slots then fire the needed pieces
      for (var i in newValue) {
        let tag = newValue[i].toLowerCase();
        // see if we added this before
        if (typeof this.__processedList[tag] === typeof undefined) {
          // attempt a dynamic import with graceful failure / fallback
          try {
            this.__processedList[tag] = tag;
            this.importHref(
              this.resolveUrl(`../${tag}/${tag}.html`),
              e => {
                //e.target.import
              },
              e => {
                //import failed
              }
            );
          } catch (err) {
            // error in the event this is a double registration
          }
        }
      }
    }
  },

  /**
   * Wipe slotted content
   */
  wipeSlot: function(element, slot = "*") {
    // 100% clean slate
    if (slot === "*") {
      while (Polymer.dom(element).firstChild !== null) {
        Polymer.dom(element).removeChild(Polymer.dom(element).firstChild);
      }
    } else {
      for (var i in Polymer.dom(element).childNodes) {
        // test for element nodes to be safe
        if (
          typeof Polymer.dom(element).childNodes[i] !== typeof undefined &&
          Polymer.dom(element).childNodes[i].slot === slot
        ) {
          Polymer.dom(element).removeChild(Polymer.dom(element).childNodes[i]);
        }
      }
    }
  },

  /**
   * active item content changed.
   */
  _activeItemContentChanged: function(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      this.wipeSlot(this, "*");
      if (newValue !== null) {
        let frag = document.createRange().createContextualFragment(newValue);
        Polymer.dom(this).appendChild(frag);
      }
    }
  },

  /**
   * When outline changes let's do this.
   */
  _outlineChanged: function(newValue, oldValue) {
    if (
      typeof newValue !== typeof undefined &&
      typeof oldValue !== typeof undefined &&
      newValue.constructor === Array &&
      typeof newValue[0] !== typeof undefined
    ) {
      this.set("activeItem", newValue[0]);
      this.__activeIndex = 0;
    }
  },

  /**
   * disablePrevPage
   */
  disablePrevPage: function(index) {
    if (index === 0) {
      return true;
    }
    return false;
  },

  /**
   * disableNextPage
   */
  disableNextPage: function(index) {
    if (index === this._outlineData.items.length - 1) {
      return true;
    }
    return false;
  },

  /**
   * Go back a page (if we can)
   */
  prevPage: function(e) {
    this.changePage("previous");
  },

  /**
   * Advance a page
   */
  nextPage: function(e) {
    this.changePage("next");
  },

  /**
   * Go forward a page
   */
  changePage: function(direction) {
    if (
      direction == "next" &&
      this.__activeIndex < this._outlineData.items.length - 1
    ) {
      this.selected = this._outlineData.items[this.__activeIndex + 1].id;
    } else if (direction == "previous" && this.__activeIndex > 0) {
      this.selected = this._outlineData.items[this.__activeIndex - 1].id;
    }
    // tell arrows to reset in case we are jumped around the page
    const arrows = this.querySelectorAll("outline-player-arrow");
    for (let arrow of arrows) {
      arrow.resetPosition();
    }
  },

  /**
   * Selected page has changed.
   */
  _selectedPageChanged: function(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      if (typeof this._outlineData !== typeof undefined) {
        const item = this._outlineData.items
          .filter((d, i) => {
            if (newValue === d.id) {
              this.__activeIndex = i;
              return d;
            }
          })
          .pop();
        this.set("activeItem", item);
      }
    }
  },

  /**
   * Determine whether we should show the title
   */
  __hasTitle: function(outlineTitle) {
    return outlineTitle ? true : false;
  }
});
