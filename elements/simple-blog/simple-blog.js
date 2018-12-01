import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/iron-pages/iron-pages.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@lrnwebcomponents/haxcms-elements/lib/haxcms-theme-behavior.js";
import "./lib/simple-blog-listing.js";
import "./lib/simple-blog-header.js";
import "./lib/simple-blog-footer.js";
import "./lib/simple-blog-post.js";
/**
`simple-blog`
A simple blog and associated elements

@demo demo/index.html

@microcopy - the mental model for this element
 -
 -

*/
let SimpleBlog = Polymer({
  _template: html`
    <style is="custom-style" include="simple-colors">
      :host {
        display: block;
        font-family: "Roboto", "Noto", sans-serif;
        -webkit-font-smoothing: antialiased;
        font-size: 14px;
        margin: 0;
        padding: 24px;
        background-color: #fafafa;
        font-family: Open Sans, MundoSans, helvetica neue, Arial, Helvetica,
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
          on-tap="_resetActiveItem"
        ></paper-icon-button>
        <paper-tooltip
          for="backbutton"
          position="right"
          offset="14"
          animation-delay="100"
        >
          Back to main site
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

  behaviors: [SchemaBehaviors.Schema, HAXCMSBehaviors.Theme],

  listeners: {
    "active-item-selected": "_itemSelected",
    "active-item-reset": "_resetActiveItem"
  },

  properties: {
    /**
     * The "page" to show (overview or blog post itself).
     */
    selectedPage: {
      type: Number,
      reflectToAttribute: true,
      value: 0
    }
  },

  /**
   * Ready life cycle
   */
  ready: function() {
    this.setupHAXTheme(true, this.$.post.$.contentcontainer);
    document.body.addEventListener(
      "haxcms-trigger-update",
      this._dataRefreshed.bind(this)
    );
    document.body.addEventListener(
      "json-outline-schema-active-item-changed",
      this._activeItemEvent.bind(this)
    );
  },

  /**
   * Detatched life cycle
   */
  detached: function() {
    this.setupHAXTheme(false);
    document.body.removeEventListener(
      "haxcms-trigger-update",
      this._dataRefreshed.bind(this)
    );
    document.body.removeEventListener(
      "json-outline-schema-active-item-changed",
      this._activeItemEvent.bind(this)
    );
  },

  /**
   * An event has indicated the active item needs changed.
   */
  _itemSelected: function(e) {
    var id = e.detail;
    let find = this.manifest.items.filter(item => {
      if (item.id !== id) {
        return false;
      }
      return true;
    });
    // if we found one, make it the top level item
    if (find.length > 0) {
      this.fire("json-outline-schema-active-item-changed", find.pop());
    }
  },

  /**
   * Notice active item changed state
   */
  _activeItemEvent: function(e) {
    if (typeof e.detail.id !== typeof undefined) {
      this.selectedPage = 1;
      window.scrollTo(0, 0);
      this.$.post.set("activeItem", e.detail);
    } else {
      this.selectedPage = 0;
    }
  },

  /**
   * Reset the active item to reset state
   */
  _resetActiveItem: function(e) {
    this.fire("json-outline-schema-active-item-changed", {});
  },

  /**
   * refreshed data call
   */
  _dataRefreshed: function(e) {
    this.fire("json-outline-schema-active-item-changed", {});
  }
});
export { SimpleBlog };
