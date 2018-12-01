define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/utils/async.js",
  "../node_modules/@polymer/iron-list/iron-list.js",
  "./hax-stax-browser-item.js"
], function(_polymerLegacy, async, _ironList, _haxStaxBrowserItem) {
  "use strict";
  async = babelHelpers.interopRequireWildcard(async);
  function _templateObject_e4033390f51a11e8a8e7334679f4d101() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n      hax-stax-browser-item {\n        margin: 10px;\n        -webkit-transition: .3s all linear;\n        transition: .3s all linear;\n      }\n      #ironlist {\n        min-height: 50vh;\n      }\n    </style>\n    <iron-list id="ironlist" items="[[__staxList]]" as="stax" grid="">\n      <template>\n        <div class="stax-container">\n          <hax-stax-browser-item index="[[stax.index]]" title="[[stax.details.title]]" tag="[[stax.details.tag]]" image="[[stax.details.image]]" author="[[stax.details.author]]" teaser="[[stax.details.teaser]]" description="[[stax.details.description]]" examples="[[stax.details.examples]]" status="[[stax.details.status]]" stax="[[stax.stax]]"></hax-stax-browser-item>\n        </div>\n      </template>\n    </iron-list>\n'
    ]);
    _templateObject_e4033390f51a11e8a8e7334679f4d101 = function _templateObject_e4033390f51a11e8a8e7334679f4d101() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_e4033390f51a11e8a8e7334679f4d101()
    ),
    is: "hax-stax-browser",
    properties: { staxList: { type: Array, observer: "_staxListChanged" } },
    ready: function ready() {
      document.body.addEventListener(
        "hax-store-property-updated",
        this._haxStorePropertyUpdated.bind(this)
      );
    },
    detached: function detached() {
      document.body.removeEventListener(
        "hax-store-property-updated",
        this._haxStorePropertyUpdated.bind(this)
      );
    },
    attached: function attached() {
      this.resetBrowser();
    },
    _haxStorePropertyUpdated: function _haxStorePropertyUpdated(e) {
      if (
        e.detail &&
        babelHelpers.typeof(e.detail.value) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        e.detail.property
      ) {
        if (
          babelHelpers.typeof(this[e.detail.property]) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0)) &&
          null != this[e.detail.property] &&
          babelHelpers.typeof(this[e.detail.property].length) !==
            ("undefined" === typeof void 0
              ? "undefined"
              : babelHelpers.typeof(void 0))
        ) {
          this.set(e.detail.property, []);
        }
        this.set(e.detail.property, e.detail.value);
      }
    },
    _staxListChanged: function _staxListChanged(newValue, oldValue) {
      if (
        babelHelpers.typeof(newValue) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        this.set("__staxList", newValue);
      }
    },
    resetBrowser: function resetBrowser() {
      var _this = this;
      async.microTask.run(function() {
        setTimeout(function() {
          _this.$.ironlist.fire("iron-resize");
          window.dispatchEvent(new Event("resize"));
        }, 100);
      });
    }
  });
});
