define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/polymer/lib/utils/async.js",
  "../node_modules/@polymer/iron-list/iron-list.js",
  "../node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js",
  "../node_modules/@polymer/paper-input/paper-input.js",
  "../node_modules/@polymer/paper-item/paper-item.js",
  "../node_modules/@polymer/iron-pages/iron-pages.js",
  "../node_modules/@lrnwebcomponents/grafitto-filter/grafitto-filter.js",
  "../node_modules/@lrnwebcomponents/dropdown-select/dropdown-select.js",
  "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js",
  "./hax-app-browser-item.js",
  "./hax-app-search.js"
], function(
  _polymerLegacy,
  async,
  _ironList,
  _appToolbar,
  _paperInput,
  _paperItem,
  _ironPages,
  _grafittoFilter,
  _dropdownSelect,
  _simpleColors,
  _haxAppBrowserItem,
  _haxAppSearch
) {
  "use strict";
  async = babelHelpers.interopRequireWildcard(async);
  function _templateObject_f572d970f32e11e8a4700dcc21fbc61a() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style is="custom-style">\n      :host {\n        display: block;\n        --hax-accent: #34e79a;\n      }\n      #ironlist {\n        min-height: 72px;\n        margin: 0;\n      }\n      hax-app-browser-item {\n        margin: 10px;\n        -webkit-transition: .3s all linear;\n        transition: .3s all linear;\n      }\n      .title {\n        text-align: center;\n        padding: 16px 0;\n        margin: 0 64px 0 0;\n        font-size: 32px;\n        font-weight: bold;\n        color:var(--simple-colors-light-green-background1);\n        font-family: sans-serif;\n        text-transform: uppercase;\n        display: inline-flex;\n      }\n      dropdown-select {\n        color: #FFFFFF;\n        --paper-input-container-invalid-color: var(--simple-colors-red-foreground3);\n        --paper-input-container-input-color: #FFFFFF;\n        --paper-input-container-color: #FFFFFF;\n        --paper-input-container-focus-color: var(--simple-colors-light-green-background1);\n        --paper-listbox-color: #000000;\n      }\n      paper-item {\n        --secondary-text-color: #000000;\n        --primary-text-color: #000000;\n      }\n      paper-input {\n        color: #FFFFFF;\n        --paper-input-container-invalid-color: var(--simple-colors-red-foreground3);\n        --secondary-text-color: #FFFFFF;\n        --primary-text-color: #FFFFFF;\n        --paper-input-container-input-color: #FFFFFF;\n        --paper-input-container-color: #FFFFFF;\n        --paper-input-container-focus-color: var(--simple-colors-light-green-background1);\n      }\n      app-toolbar {\n        background-color: rgba(0,0,0,.5);\n      }\n      .toolbar-inner {\n        width: 100%;\n        display: inline-flex;\n      }\n    </style>\n    <app-toolbar>\n      <div class="toolbar-inner">\n      <h3 class="title">[[title]]</h3>\n      <dropdown-select id="filtertype" label="Filter by" value="details.title">\n        <paper-item value="details.title">Title</paper-item>\n      </dropdown-select>\n      <paper-input label="Filter" id="inputfilter" aria-controls="filter" value="" always-float-label=""></paper-input>\n      </div>\n    </app-toolbar>\n    <grafitto-filter id="filter" items="[[__appList]]" like="" where="details.title" as="filtered">\n      <template>\n        <iron-list id="ironlist" items="[[filtered]]" as="app" grid="">\n          <template>\n            <div class="app-container">\n              <hax-app-browser-item index="[[app.index]]" title="[[app.details.title]]" icon="[[app.details.icon]]" image="[[app.details.tag]]" color="[[app.details.color]]" meta="[[app.details.meta]]" groups="[[app.details.groups]]" handles="[[app.details.handles]]" description="[[app.details.description]]" rating="[[app.details.rating]]" tags="[[app.details.tags]]"></hax-app-browser-item>\n            </div>\n          </template>\n        </iron-list>\n      </template>\n    </grafitto-filter>\n    <hax-app-search id="haxappsearch" hidden$="[[!searching]]"></hax-app-search>\n    <slot></slot>\n'
    ]);
    _templateObject_f572d970f32e11e8a4700dcc21fbc61a = function _templateObject_f572d970f32e11e8a4700dcc21fbc61a() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_f572d970f32e11e8a4700dcc21fbc61a()
    ),
    is: "hax-app-browser",
    behaviors: [simpleColorsBehaviors],
    properties: {
      search: { type: String },
      title: { type: String, value: "Find" },
      searching: { type: Boolean, reflectToAttribute: !0, value: !1 },
      activeApp: { type: Object, value: null, observer: "_activeAppChanged" }
    },
    attached: function attached() {
      var _this = this;
      this.resetBrowser();
      this.$.inputfilter.addEventListener("value-changed", function(e) {
        _this.$.filter.like = e.target.value;
      });
      this.$.filtertype.addEventListener("change", function(e) {
        _this.$.inputfilter.value = "";
        _this.$.filter.where = e.detail.value;
        _this.$.filter.like = "";
      });
      document.body.addEventListener(
        "hax-app-selected",
        this._appSelected.bind(this)
      );
      document.body.addEventListener(
        "hax-store-property-updated",
        this._haxStorePropertyUpdated.bind(this)
      );
    },
    detached: function detached() {
      document.body.removeEventListener(
        "hax-app-selected",
        this._appSelected.bind(this)
      );
      document.body.removeEventListener(
        "hax-store-property-updated",
        this._haxStorePropertyUpdated.bind(this)
      );
    },
    _appSelected: function _appSelected(e) {
      if (
        babelHelpers.typeof(e.detail) !==
        ("undefined" === typeof void 0
          ? "undefined"
          : babelHelpers.typeof(void 0))
      ) {
        this.set("__activeApp", e.detail);
        this.searching = !0;
        window.HaxStore.write("activeApp", this.__appList[e.detail], this);
      }
    },
    _activeAppChanged: function _activeAppChanged(newValue, oldValue) {
      if (
        babelHelpers.typeof(oldValue) !==
          ("undefined" === typeof void 0
            ? "undefined"
            : babelHelpers.typeof(void 0)) &&
        null != newValue
      ) {
        window.HaxStore.instance.haxManager.searching = !0;
        setTimeout(function() {
          window.HaxStore.instance.haxManager.updateStyles();
          window.dispatchEvent(new Event("resize"));
        }, 100);
      }
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
        this.set(e.detail.property, e.detail.value);
      }
    },
    resetBrowser: function resetBrowser() {
      var _this2 = this;
      async.microTask.run(function() {
        _this2.searching = !1;
        _this2.set("__appList", window.HaxStore.instance.appList);
        if (_this2.$.filter.shadowRoot.querySelector("#ironlist")) {
          _this2.$.filter.shadowRoot.querySelector("#ironlist").filtered =
            _this2.__appList;
        }
        _this2.$.inputfilter.value = "";
        _this2.$.filtertype.value = "details.title";
        _this2.$.filter.value = "";
        _this2.$.filter.filter();
        _this2.$.filter.where = "details.title";
        _this2.$.filter.like = "";
        setTimeout(function() {
          if (_this2.$.filter.shadowRoot.querySelector("#ironlist")) {
            _this2.$.filter.shadowRoot
              .querySelector("#ironlist")
              .fire("iron-resize");
            window.dispatchEvent(new Event("resize"));
          }
        }, 100);
      });
    }
  });
});
