import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import { updateStyles } from "@polymer/polymer/lib/mixins/element-mixin.js";
import { HAXCMSThemeWiring } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSThemeWiring.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@polymer/app-layout/app-header/app-header.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "@polymer/app-layout/app-drawer/app-drawer.js";
import "@polymer/app-layout/app-drawer-layout/app-drawer-layout.js";
import "@polymer/app-layout/app-header-layout/app-header-layout.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/hax-body/lib/hax-shared-styles.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu-button.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-print-button.js";

/**
 * `outline-player`
 * `A basic outline presentation`
 *
 * @demo demo/index.html
 */
let OutlinePlayer = Polymer({
  _template: html`
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

      site-menu {
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
        padding: 8px 8px 8px 8px;
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
      :host([edit-mode]) #content {
        padding: 32px 8px 8px 8px;
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
      site-menu {
        height: calc(100vh - 64px);
        color: #000000;
        padding: 0;
        background-color: #ffffff;
        --site-menu-active-color: rgba(0, 0, 0, 0.1);
        --site-menu-scrolltrack-bg-color: rgba(0, 0, 0, 0.3);
        --site-menu-bg-shadow: rgba(0, 0, 0, 0.3);
        --site-menu-bg-color: #fafafa;
        --site-menu: {
          padding: 0;
          background-color: #ffffff;
          color: #000000;
        }
        --site-menu-container: {
          padding: 0;
          background-color: #ffffff;
          color: #000000;
        }
        --site-menu-item-active-item: {
          color: #000000;
        }
      }
      site-menu-button {
        --site-menu-button-button: {
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.1);
          height: 40px;
          width: 40px;
        }
        --site-menu-button-button-hover: {
          background-color: rgba(0, 0, 0, 0.2);
        }
      }
    </style>
    <!-- Control the sites query paremeters -->

    <!-- Begin Layout -->
    <app-drawer-layout narrow="{{narrow}}">
      <app-drawer id="drawer" swipe-open="" slot="drawer" opened="{{opened}}">
        <template is="dom-if" if="[[__hasTitle(manifest.title)]]">
          <h2 class="outline-title">[[manifest.title]]</h2>
        </template>
        <site-menu></site-menu>
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
            <site-menu-button
              type="prev"
              position="bottom"
              label="Prev"
              raised
            ></site-menu-button>
            <site-menu-button
              type="next"
              position="bottom"
              label="Next"
              raised
            ></site-menu-button>
            <site-print-button></site-print-button>
          </app-toolbar>
        </app-header>
        <div id="content">
          <div id="contentcontainer">
            <div id="slot"><slot></slot></div>
          </div>
        </div>
      </app-header-layout>
    </app-drawer-layout>
  `,

  is: "outline-player",
  properties: {
    opened: {
      type: Boolean,
      reflectToAttribute: true
    },
    /**
     * editting state for the page
     */
    editMode: {
      type: Boolean,
      reflectToAttribute: true,
      observer: "_editModeChanged"
    },
    /**
     * Active item which is in JSON Outline Schema
     */
    activeItem: {
      type: Object
    },
    /**
     * Manifest from haxcms-site-builder
     */
    manifest: {
      type: Object
    },
    /**
     * DOM node that wraps the slot
     */
    contentContainer: {
      type: Object
    },
    /**
     * Auto call json files
     */
    auto: {
      type: Boolean,
      notify: true,
      value: false
    },
    /**
     * Outline JSON file name
     */
    outlineFile: {
      type: String,
      value: "outline.json",
      notify: true
    },
    /**
     * Outline JSON location
     */
    outlineLocation: {
      type: String,
      notify: true
    },
    /**
     * Closed status for the drawer
     */
    closed: {
      type: Boolean,
      notify: true,
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
     * Set min height of outline player to fill remaining
     * space to the bottom of the browser
     */
    fillRemaining: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    _location: {
      type: Object,
      observer: "_locationChanged"
    },
    activeId: {
      type: String,
      observer: "_activeIdChanged"
    },
    narrow: {
      type: Boolean,
      reflectToAttribute: true
    }
  },
  /**
   * notice edit changed, make sure we fake a resize because of that container flyout
   */
  _editModeChanged: function(newValue) {
    if (typeof newValue !== typeof undefined) {
      async.microTask.run(() => {
        // trick browser into thinking we just reized
        window.dispatchEvent(new Event("resize"));
        // forcibly update styles via css variables
        updateStyles();
      });
    }
  },
  /**
   * created life cycle
   */
  created: function() {
    this.HAXCMSThemeWiring = new HAXCMSThemeWiring(this);
  },
  /**
   * ready life cycle
   */
  ready: function() {
    this.contentContainer = this.$.contentcontainer;
    this.HAXCMSThemeWiring.connect(this, this.contentContainer);
  },
  /**
   * attached life cycle
   */
  attached: function() {
    this.__disposer = autorun(() => {
      this._location = store.location;
    });
    this.__disposer2 = autorun(() => {
      this.activeId = toJS(store.activeId);
    });
    this.__disposer3 = autorun(() => {
      this.activeItem = toJS(store.activeItem);
    });
  },
  /**
   * detatched life cycle
   */
  detached: function() {
    this.HAXCMSThemeWiring.disconnect(this);
    this.__disposer2();
    this.__disposer3();
  },

  _locationChanged: function(newValue) {
    if (!newValue || typeof newValue.route === "undefined") return;
    const location = newValue;
    const name = location.route.name;
    if (name === "home" || name === "404") {
      // if we are on the homepage then load the first item in the manifest
      // and set it active
      const firstItem = this.manifest.items.find(
        i => typeof i.id !== "undefined"
      );
      if (firstItem) {
        store.activeId = firstItem.id;
      }
    }
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
    async.microTask.run(() => {
      // trick browser into thinking we just reized
      window.dispatchEvent(new Event("resize"));
      // forcibly update styles via css variables
      updateStyles();
    });
  },

  /**
   * Wipe slotted content
   */
  wipeSlot: function(element, slot = "*") {
    // 100% clean slate
    if (slot === "*") {
      while (dom(element).firstChild !== null) {
        dom(element).removeChild(dom(element).firstChild);
      }
    } else {
      for (var i in dom(element).childNodes) {
        // test for element nodes to be safe
        if (
          typeof dom(element).childNodes[i] !== typeof undefined &&
          dom(element).childNodes[i].slot === slot
        ) {
          dom(element).removeChild(dom(element).childNodes[i]);
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
        dom(this).appendChild(frag);
      }
    }
  },

  /**
   * active id has changed.
   */
  _activeIdChanged: function(newValue) {
    // close menu if it's narrow and something new is picked
    if (this.opened && this.narrow) {
      this.$.drawer.toggle();
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  },

  /**
   * Determine whether we should show the title
   */
  __hasTitle: function(outlineTitle) {
    return outlineTitle ? true : false;
  }
});
export { OutlinePlayer };
