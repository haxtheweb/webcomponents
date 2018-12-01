define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-list/iron-list.js",
  "./hax-blox-browser-item.js",
  "./hax-icons.js"
], function(_polymerLegacy, _ironList, _haxBloxBrowserItem, _haxIcons) {
  "use strict";
  function _templateObject_e40ad4b0f51a11e8a8e7334679f4d101() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n      hax-blox-browser-item {\n        margin: 10px;\n        -webkit-transition: .3s all linear;\n        transition: .3s all linear;\n      }\n      #ironlist {\n        min-height: 50vh;\n      }\n    </style>\n    <iron-list id="ironlist" items="[[__bloxList]]" as="blox" grid="">\n      <template>\n        <div class="blox-container">\n          <hax-blox-browser-item index="[[blox.index]]" layout="[[blox.details.layout]]" title="[[blox.details.title]]" tag="[[blox.details.tag]]" icon="[[blox.details.icon]]" author="[[blox.details.author]]" teaser="[[blox.details.teaser]]" description="[[blox.details.description]]" examples="[[blox.details.examples]]" status="[[blox.details.status]]" blox="[[blox.blox]]"></hax-blox-browser-item>\n        </div>\n      </template>\n    </iron-list>\n'
    ]);
    _templateObject_e40ad4b0f51a11e8a8e7334679f4d101 = function _templateObject_e40ad4b0f51a11e8a8e7334679f4d101() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_e40ad4b0f51a11e8a8e7334679f4d101()
    ),
    is: "hax-blox-browser",
    properties: { bloxList: { type: Array, observer: "_bloxListChanged" } },
    ready: function ready() {
      document.body.addEventListener(
        "hax-store-property-updated",
        this._haxStorePropertyUpdated.bind(this)
      );
    },
    attached: function attached() {
      this.resetBrowser();
    },
    detached: function detached() {
      document.body.removeEventListener(
        "hax-store-property-updated",
        this._haxStorePropertyUpdated.bind(this)
      );
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
    _bloxListChanged: function _bloxListChanged(newValue, oldValue) {
      if (
        babelHelpers.typeof(newValue) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        this.set("__bloxList", newValue);
      }
    },
    resetBrowser: function resetBrowser() {
      var _this = this;
      setTimeout(function() {
        _this.$.ironlist.fire("iron-resize");
        window.dispatchEvent(new Event("resize"));
      }, 100);
    }
  });
});
