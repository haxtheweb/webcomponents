import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
import "./node_modules/@polymer/iron-pages/iron-pages.js";
import "./node_modules/@polymer/paper-icon-button/paper-icon-button.js";
import "./node_modules/@lrnwebcomponents/haxcms-elements/lib/haxcms-theme-behavior.js";
import "./lib/simple-blog-listing.js";
import "./lib/simple-blog-header.js";
import "./lib/simple-blog-footer.js";
import "./lib/simple-blog-post.js";
Polymer({
  _template: html`
    <style is="custom-style">
      :host {
        display: block;
        font-family: 'Roboto', 'Noto', sans-serif;
        -webkit-font-smoothing: antialiased;
        font-size: 14px;
        margin: 0;
        padding: 24px;
        background-color: #fafafa;
        font-family: Open Sans,MundoSans,helvetica neue,Arial,Helvetica,sans-serif;
        margin: 0;
        padding: 0;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-font-feature-settings: "liga=1, dlig=1";
        -ms-font-feature-settings: "liga","dlig";
        -webkit-font-feature-settings: "liga","dlig";
        -o-font-feature-settings: "liga","dlig";
        font-feature-settings: "liga","dlig";
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
        background-color: rgba( 250, 250, 250, .5);
        opacity: .5;
        border-radius: 50%;
        transition: all .6s linear;
      }
      #backbutton:focus,
      #backbutton:hover {
        opacity: 1;
        color: white;
        background-color: var(--haxcms-color, black);
      }
      iron-pages, iron-pages section {
        width: 100vw;
        height: 100vh;
      }
      #post {
        transition: all .6s ease-in-out;
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
        <simple-blog-listing id="listing" items="[[manifest.items]]"></simple-blog-listing>
      </section>
      <section>
        <paper-icon-button id="backbutton" icon="icons:arrow-back" on-tap="_resetActiveItem"></paper-icon-button>
        <paper-tooltip for="backbutton" position="right" offset="14" animation-delay="100">
        Back to main site
        </paper-tooltip>
        <simple-blog-post id="post" active-item="[[activeItem]]" edit-mode="[[editMode]]"><slot></slot></simple-blog-post>
        <simple-blog-footer id="footer" manifest="[[manifest]]"></simple-blog-footer>
      </section>
    </iron-pages>
`,
  is: "simple-blog",
  behaviors: [
    SchemaBehaviors.Schema,
    window.simpleColorsBehaviors,
    HAXCMSBehaviors.Theme
  ],
  listeners: {
    "active-item-selected": "_itemSelected",
    "active-item-reset": "_resetActiveItem"
  },
  properties: {
    selectedPage: { type: Number, reflectToAttribute: !0, value: 0 }
  },
  ready: function() {
    this.setupHAXTheme(!0, this.$.post.$.contentcontainer);
    document.body.addEventListener(
      "haxcms-trigger-update",
      this._dataRefreshed.bind(this)
    );
    document.body.addEventListener(
      "json-outline-schema-active-item-changed",
      this._activeItemEvent.bind(this)
    );
  },
  detached: function() {
    this.setupHAXTheme(!1);
    document.body.removeEventListener(
      "haxcms-trigger-update",
      this._dataRefreshed.bind(this)
    );
    document.body.removeEventListener(
      "json-outline-schema-active-item-changed",
      this._activeItemEvent.bind(this)
    );
  },
  _itemSelected: function(e) {
    var id = e.detail;
    let find = this.manifest.items.filter(item => {
      if (item.id !== id) {
        return !1;
      }
      return !0;
    });
    if (0 < find.length) {
      this.fire("json-outline-schema-active-item-changed", find.pop());
    }
  },
  _activeItemEvent: function(e) {
    if (typeof e.detail.id !== typeof void 0) {
      this.selectedPage = 1;
      window.scrollTo(0, 0);
      this.$.post.set("activeItem", e.detail);
    } else {
      this.selectedPage = 0;
    }
  },
  _resetActiveItem: function(e) {
    this.fire("json-outline-schema-active-item-changed", {});
  },
  _dataRefreshed: function(e) {
    this.fire("json-outline-schema-active-item-changed", {});
  }
});
