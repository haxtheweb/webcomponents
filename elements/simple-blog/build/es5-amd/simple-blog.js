define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js",
  "./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js",
  "./node_modules/@polymer/iron-pages/iron-pages.js",
  "./node_modules/@polymer/paper-icon-button/paper-icon-button.js",
  "@lrnwebcomponents/haxcms-elements/haxcms-theme-behavior.js",
  "./lib/simple-blog-listing.js",
  "./lib/simple-blog-header.js",
  "./lib/simple-blog-footer.js",
  "./lib/simple-blog-post.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_c2b21160e5f811e8a4bb43db21bfc380() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style is="custom-style">\n      :host {\n        display: block;\n        font-family: \'Roboto\', \'Noto\', sans-serif;\n        -webkit-font-smoothing: antialiased;\n        font-size: 14px;\n        margin: 0;\n        padding: 24px;\n        background-color: #fafafa;\n        font-family: Open Sans,MundoSans,helvetica neue,Arial,Helvetica,sans-serif;\n        margin: 0;\n        padding: 0;\n        text-rendering: optimizeLegibility;\n        -webkit-font-smoothing: antialiased;\n        -moz-font-feature-settings: "liga=1, dlig=1";\n        -ms-font-feature-settings: "liga","dlig";\n        -webkit-font-feature-settings: "liga","dlig";\n        -o-font-feature-settings: "liga","dlig";\n        font-feature-settings: "liga","dlig";\n      }\n      #backbutton {\n        position: fixed;\n        top: 0px;\n        left: 0px;\n        padding: 2px;\n        width: 40px;\n        height: 40px;\n        margin: 8px;\n        z-index: 1000;\n        color: black;\n        background-color: rgba( 250, 250, 250, .5);\n        opacity: .5;\n        border-radius: 50%;\n        transition: all .6s linear;\n      }\n      #backbutton:focus,\n      #backbutton:hover {\n        opacity: 1;\n        color: white;\n        background-color: var(--haxcms-color, black);\n      }\n      iron-pages, iron-pages section {\n        width: 100vw;\n        height: 100vh;\n      }\n      #post {\n        transition: all .6s ease-in-out;\n        visibility: hidden;\n      }\n      :host([selected-page="0"]) #post {\n        visibility: visible;\n        opacity: 0;\n        visibility: hidden;\n      }\n      :host([selected-page="1"]) #post {\n        visibility: visible;\n        opacity: 1;\n      }\n    </style>\n    <iron-pages selected="[[selectedPage]]">\n      <section>\n        <simple-blog-header manifest="[[manifest]]"></simple-blog-header>\n        <simple-blog-listing id="listing" items="[[manifest.items]]"></simple-blog-listing>\n      </section>\n      <section>\n        <paper-icon-button id="backbutton" icon="icons:arrow-back" on-tap="_resetActiveItem"></paper-icon-button>\n        <paper-tooltip for="backbutton" position="right" offset="14" animation-delay="100">\n        Back to main site\n        </paper-tooltip>\n        <simple-blog-post id="post" active-item="[[activeItem]]" edit-mode="[[editMode]]"><slot></slot></simple-blog-post>\n        <simple-blog-footer id="footer" manifest="[[manifest]]"></simple-blog-footer>\n      </section>\n    </iron-pages>\n'
    ]);
    _templateObject_c2b21160e5f811e8a4bb43db21bfc380 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_c2b21160e5f811e8a4bb43db21bfc380()
    ),
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
    ready: function ready() {
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
    detached: function detached() {
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
    _itemSelected: function _itemSelected(e) {
      var id = e.detail,
        find = this.manifest.items.filter(function(item) {
          if (item.id !== id) {
            return !1;
          }
          return !0;
        });
      if (0 < find.length) {
        this.fire("json-outline-schema-active-item-changed", find.pop());
      }
    },
    _activeItemEvent: function _activeItemEvent(e) {
      if (babelHelpers.typeof(e.detail.id) !== "undefined") {
        this.selectedPage = 1;
        window.scrollTo(0, 0);
        this.$.post.set("activeItem", e.detail);
      } else {
        this.selectedPage = 0;
      }
    },
    _resetActiveItem: function _resetActiveItem() {
      this.fire("json-outline-schema-active-item-changed", {});
    },
    _dataRefreshed: function _dataRefreshed() {
      this.fire("json-outline-schema-active-item-changed", {});
    }
  });
});
