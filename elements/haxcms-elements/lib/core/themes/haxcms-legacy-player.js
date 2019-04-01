/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { Router } from "@vaadin/router";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { microTask } from "@polymer/polymer/lib/utils/async.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import {
  encapScript,
  findTagsInHTML,
  wipeSlot
} from "@lrnwebcomponents/hax-body/lib/haxutils.js";
import "@polymer/app-layout/app-header/app-header.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "@polymer/app-layout/app-drawer/app-drawer.js";
import "@polymer/app-layout/app-drawer-layout/app-drawer-layout.js";
import "@polymer/app-layout/app-header-layout/app-header-layout.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/hax-body/lib/hax-shared-styles.js";
import "@lrnwebcomponents/map-menu/map-menu.js";
/**
 * `haxcms-legacy-player`
 * `A simple slide playing theme`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class HAXCMSLegacyPlayer extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "haxcms-legacy-player";
  }
  static get properties() {
    return {
      /**
       * Location of the site.json file
       */
      file: {
        type: String,
        observer: "_fileChanged"
      },
      /**
       * Active item content
       */
      activeItemContent: {
        type: String,
        notify: true,
        observer: "_activeItemContentChanged"
      },
      activeItemLocation: {
        type: String,
        computed: "computeActiveItemLocation(activeItem)",
        observer: "_activeItemLocationChanged"
      },
      activeItem: {
        type: Object
      },
      manifest: {
        type: Object
      },
      routerManifest: {
        type: Object,
        computed: "computeRouterManifest(manifest)",
        observer: "_updateRouter"
      }
    };
  }
  _activeItemLocationChanged(newValue) {
    if (newValue) {
      this.$.activecontent.generateRequest();
    }
  }
  /**
   * File changed so let's pull from the location
   */
  _fileChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      this.$.manifest.generateRequest();
    }
  }
  // render function
  static get template() {
    return html`
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
          background-color: var(--outline-player-light);
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
      <iron-ajax
        id="manifest"
        url="[[outlineLocation]][[file]]"
        handle-as="json"
        debounce-duration="250"
        last-response="{{manifest}}"
      ></iron-ajax>
      <iron-ajax
        id="activecontent"
        url="[[outlineLocation]][[activeItemLocation]]"
        handle-as="text"
        loading="{{loading}}"
        debounce-duration="250"
        last-response="{{activeItemContent}}"
      ></iron-ajax>
      <!-- Begin Layout -->
      <app-drawer-layout narrow="{{narrow}}">
        <app-drawer id="drawer" swipe-open slot="drawer" opened="{{opened}}">
          <h2 class="outline-title">[[manifest.title]]</h2>
          <map-menu
            id="menu"
            selected="[[activeItem.id]]"
            manifest="[[routerManifest]]"
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
    `;
  }
  constructor() {
    super();
    // create router
    let options = {};
    if (this.baseURI) {
      options.baseUrl = this.baseURI;
    }
    this.router = new Router(this, options);
    window.addEventListener(
      "vaadin-router-location-changed",
      this._routerLocationChanged.bind(this)
    );
  }
  /**
   * React to content being loaded from a page.
   */
  _activeItemContentChanged(newValue, oldValue) {
    if (newValue) {
      var html = newValue;
      // only append if not empty
      if (html !== null) {
        wipeSlot(this, "*");
        html = encapScript(newValue);
        // insert the content as quickly as possible, then work on the dynamic imports
        microTask.run(() => {
          setTimeout(() => {
            let frag = document.createRange().createContextualFragment(html);
            dom(this).appendChild(frag);
            const evt = new CustomEvent(
              "json-outline-schema-active-body-changed",
              {
                bubbles: true,
                composed: true,
                cancelable: false,
                detail: { html }
              }
            );
          }, 5);
        });
        // if there are, dynamically import them
        if (this.manifest.metadata.dynamicElementLoader) {
          let tagsFound = findTagsInHTML(html);
          const basePath = pathFromUrl(decodeURIComponent(import.meta.url));
          for (var i in tagsFound) {
            const tagName = tagsFound[i];
            if (
              this.manifest.metadata.dynamicElementLoader[tagName] &&
              !window.customElements.get(tagName)
            ) {
              import(`${basePath}../../../../../${
                this.manifest.metadata.dynamicElementLoader[tagName]
              }`)
                .then(response => {
                  //console.log(tagName + ' dynamic import');
                })
                .catch(error => {
                  /* Error handling */
                  console.log(error);
                });
            }
          }
        }
      }
    }
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      // tidy up the dom if this is there
      if (document.getElementById("haxcmsoutdatedfallbacksuperold")) {
        document
          .getElementById("haxcmsoutdatedfallback")
          .removeChild(
            document.getElementById("haxcmsoutdatedfallbacksuperold")
          );
      }
    });
  }
  disconnectedCallback() {
    window.removeEventListener(
      "vaadin-router-location-changed",
      this._routerLocationChanged.bind(this)
    );
    super.disconnectedCallback();
  }
  computeActiveItemLocation(activeItem) {
    return "pages/" + activeItem.location + "/index.html";
  }
  /**
   * The manifest but with routing mixed in
   */
  computeRouterManifest(manifest) {
    document.body.dispatchEvent(
      new CustomEvent("json-outline-schema-changed", {
        bubbles: true,
        detail: manifest
      })
    );
    if (manifest && typeof manifest.items !== "undefined") {
      const manifestItems = manifest.items.map(i => {
        // get local storage and look for data from this to mesh up
        let location = i.location
          .replace("pages/", "")
          .replace("/index.html", "");
        return Object.assign({}, i, {
          location: location
        });
      });
      return Object.assign({}, manifest, {
        items: manifestItems
      });
    }
  }
  /**
   * Update the router based on a manifest.
   * This should not be called directly. Use the
   * 'haxcms-router-manifest-changed' event
   *
   * @param {object} manifest
   */
  _updateRouter(routerManifest) {
    if (!routerManifest || typeof routerManifest.items === "undefined") return;
    const routerItems = routerManifest.items.map(i => {
      return {
        path: i.location,
        name: i.id,
        component: `fake-${i.id}-e`
      };
    });
    this.router.setRoutes([
      ...routerItems,
      { path: "/", component: "fake-home-e", name: "home" },
      { path: "/(.*)", component: "fake-404-e", name: "404" }
    ]);
  }

  /**
   * React to page changes in the vaadin router and convert it
   * to a change in the mobx store.
   * @param {event} e
   */
  _routerLocationChanged(e) {
    // micro delay for map menu to open
    setTimeout(() => {
      if (this.routerManifest.items.find) {
        var tmpItem = this.routerManifest.items.find(
          i => i.location == e.detail.location.route.path
        );
        if (tmpItem) {
          this.set("activeItem", tmpItem);
        }
      }
    }, 100);
  }
}
window.customElements.define(HAXCMSLegacyPlayer.tag, HAXCMSLegacyPlayer);
export { HAXCMSLegacyPlayer };
