import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/iron-pages/iron-pages.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import { HAXCMSThemeWiring } from "@lrnwebcomponents/haxcms-elements/lib/HAXCMSThemeWiring.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "./lib/simple-blog-listing.js";
import "./lib/simple-blog-header.js";
import "./lib/simple-blog-footer.js";
import "./lib/simple-blog-post.js";
/**
`simple-blog`
A simple blog and associated elements

* @demo demo/index.html

@microcopy - the mental model for this element
 -
 -

*/
let SimpleBlog = Polymer({
  _template: html`
    <style include="simple-colors">
      :host {
        display: block;
        font-family: "Roboto", "Noto", sans-serif;
        -webkit-font-smoothing: antialiased;
        font-size: 14px;
        margin: 0;
        padding: 24px;
        background-color: #fafafa;
        font-family: "Open Sans", "MundoSans", helvetica neue, Arial, Helvetica,
          sans-serif;
        margin: 0;
        padding: 0;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-font-feature-settings: "liga=1, dlig=1";
        -ms-font-feature-settings: "liga", "dlig";
        -webkit-font-feature-settings: "liga", "dlig";
        -o-font-feature-settings: "liga", "dlig";
        font-feature-settings: "liga", "dlig";
      }
      #backbutton {
        position: fixed;
        top: 0px;
        left: 0px;
        padding: 2px;
        width: 40px;
        height: 40px;
        margin: 8px;
        z-index: 1000;
        color: black;
        background-color: rgba(250, 250, 250, 0.5);
        opacity: 0.5;
        border-radius: 50%;
        transition: all 0.6s linear;
      }
      #backbutton:focus,
      #backbutton:hover {
        opacity: 1;
        color: white;
        background-color: var(--haxcms-color, black);
      }
      iron-pages,
      iron-pages section {
        width: 100vw;
        height: 100vh;
      }
      #post {
        transition: all 0.6s ease-in-out;
        visibility: hidden;
      }
      :host([selected-page="0"]) #post {
        visibility: visible;
        opacity: 0;
        visibility: hidden;
      }
      :host([selected-page="1"]) #post {
        visibility: visible;
        opacity: 1;
      }
      a, a:* {
        color: inherit;
      }
    </style>
    <iron-pages selected="[[selectedPage]]">
      <section>
        <simple-blog-header manifest="[[manifest]]"></simple-blog-header>
        <simple-blog-listing
          id="listing"
          items="[[manifest.items]]"
        ></simple-blog-listing>
      </section>
      <section>
        <paper-icon-button
          id="backbutton"
          icon="icons:arrow-back"
          on-tap="_goBack"
        ></paper-icon-button>
        <paper-tooltip
          for="backbutton"
          position="right"
          offset="14"
          animation-delay="100"
          >Back to listing
        </paper-tooltip>
        <simple-blog-post
          id="post"
          active-item="[[activeItem]]"
          edit-mode="[[editMode]]"
          ><slot></slot
        ></simple-blog-post>
        <simple-blog-footer
          id="footer"
          manifest="[[manifest]]"
        ></simple-blog-footer>
      </section>
    </iron-pages>
  `,

  is: "simple-blog",

  behaviors: [SchemaBehaviors.Schema],

  properties: {
    /**
     * The "page" to show (overview or blog post itself).
     */
    selectedPage: {
      type: Number,
      reflectToAttribute: true,
      value: 0
    },
    /**
     * editting state for the page
     */
    editMode: {
      type: Boolean,
      reflectToAttribute: true
    },
    /**
     * Active item which is in JSON Outline Schema
     */
    activeItem: {
      type: Object
    },
    activeItemId: {
      type: String
    },
    /**
     * a manifest json file decoded, in JSON Outline Schema format
     */
    manifest: {
      type: Object
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
    this.HAXCMSThemeWiring.connect(this, this.$.post.$.contentcontainer);
  },
  /**
   * attached life cycle
   */
  attached: function() {
    // subscribe to manifest changes
    this.__disposer = autorun(() => {
      this.manifest = toJS(store.routerManifest);
      this.activeItemId = toJS(store.activeItem);
      this._locationChanged(store.location);
    });
  },
  /**
   * detatched life cycle
   */
  detached: function() {
    this.HAXCMSThemeWiring.disconnect(this);
    this.__disposer();
  },
  /**
   * Listen for router location changes
   * @param {event} e
   */
  _locationChanged: function(location) {
    if (!location || typeof location.route === "undefined") return;
    const name = location.route.name;
    if (name === "home" || name === "404") {
      this.selectedPage = 0;
    } else {
      this.selectedPage = 1;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    }
  },
  /**
   * Reset the active item to reset state
   */
  _goBack: function(e) {
    const prevActiveItemId = this.activeItemId;
    window.history.pushState(null, null, store.location.baseUrl);
    window.dispatchEvent(new PopStateEvent("popstate"));
    // should help account for starting on a page where popstate isn't set
    // and also generate data model mirroring
    if (prevActiveItemId) {
      setTimeout(() => {
        let active = this.$.listing.shadowRoot.querySelector(
          'simple-blog-overview[item-id="' + prevActiveItemId + '"]'
        );
        active.scrollIntoView(true);
        active.focus();
      }, 100);
    } else {
      window.scrollTo({
        top: 0,
        left: 0
      });
    }
    this.fire("json-outline-schema-active-item-changed", {});
    this.selectedPage = 0;
  }
});
export { SimpleBlog };
