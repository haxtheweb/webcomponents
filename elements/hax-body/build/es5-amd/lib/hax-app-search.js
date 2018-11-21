define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-input/paper-input.js",
  "../node_modules/@polymer/paper-card/paper-card.js",
  "../node_modules/@polymer/paper-styles/paper-styles.js",
  "../node_modules/@polymer/iron-list/iron-list.js",
  "../node_modules/@polymer/iron-ajax/iron-ajax.js",
  "../node_modules/@lrnwebcomponents/elmsln-loading/elmsln-loading.js",
  "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js",
  "./hax-app-search-inputs.js",
  "./hax-app-search-result.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_7a585aa0edbe11e883a5d91bd26efb3f() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style is="custom-style">\n      :host {\n        display: block;\n      };\n      paper-button.item-wrapper {\n        margin: 0;\n        padding: 0;\n      }\n      paper-card {\n        padding: 0;\n        margin: 8px;\n        width: 240px;\n        font-size: 12px;\n        --paper-card-header: {\n          max-height: 160px;\n        }\n      }\n      @media screen and (min-width: 800px) {\n        paper-card {\n          font-size: 14px;\n        }\n      }\n      #loading[hidden] {\n        visibility: hidden !important;\n        opacity: 0 !important;\n        display: block !important;\n      }\n      .loading {\n        width: calc(100% - 32px);\n        z-index: 1000;\n        opacity: .9;\n        text-align: center;\n        align-content: space-around;\n        justify-content: center;\n        position: absolute;\n        padding: 0;\n        margin: 0;\n        display: flex;\n        margin: 0 auto;\n        visibility: visible;\n        transition: visibility .5s, opacity .5s ease;\n      }\n      .loading elmsln-loading {\n        margin: 0 80px;\n        display: inline-flex;\n      }\n      #loading {\n        height: 100%;\n        display: flex;\n        justify-content: center;\n      }\n      #loading .loading,\n      #loading elmsln-loading{\n        display: block;\n        height: 80px;\n      }\n      .card-content {\n        padding: .16px;\n      }\n      .card-content p {\n        padding: 0;\n        margin: 0;\n      }\n      #itemlist {\n        min-height: 150px;\n        border: 1px solid #222222;\n      }\n      hax-app-search-inputs {\n        min-height: 150px;\n        padding: 16px 16px 0 16px;\n        color: #222222;\n      }\n      hax-app-pagination {\n        min-height: 32px;\n        font-size: 12.8px;\n        display: none;\n        justify-content: flex-end;\n        justify-content: center;\n        color: #222222;\n      }\n      .loading-text {\n        font-size: 32px;\n        padding: 16px 0;\n        color: var(--simple-colors-light-green-background3);\n      }\n    </style>\n\n    <iron-ajax auto="[[auto]]" id="request" method="[[method]]" url="[[requestEndPoint]]" handle-as="json" headers="[[headers]]" params="[[requestParams]]" last-response="{{requestData}}" hidden="" loading="{{loading}}" debounce-duration="250"></iron-ajax>\n    <hax-app-search-inputs label="[[label]]" schema="{{searchSchema}}" values="{{searchValues}}"></hax-app-search-inputs>\n    <hax-app-pagination id="pagerbottom" request-data="[[requestData]]" pagination="[[pagination]]"></hax-app-pagination>\n    <div id="loading" class="loading" hidden$="[[!loading]]">\n      <elmsln-loading color="light-green-text text-accent-3" size="large"></elmsln-loading>\n      <div class="loading-text">Loading content..</div>\n    </div>\n    <iron-list grid="" id="itemlist" items="[[media]]" as="resultData">\n      <template>\n        <hax-app-search-result result-data="[[resultData]]"></hax-app-search-result>\n      </template>\n    </iron-list>\n'
      ],
      [
        '\n    <style is="custom-style">\n      :host {\n        display: block;\n      };\n      paper-button.item-wrapper {\n        margin: 0;\n        padding: 0;\n      }\n      paper-card {\n        padding: 0;\n        margin: 8px;\n        width: 240px;\n        font-size: 12px;\n        --paper-card-header: {\n          max-height: 160px;\n        }\n      }\n      @media screen and (min-width: 800px) {\n        paper-card {\n          font-size: 14px;\n        }\n      }\n      #loading[hidden] {\n        visibility: hidden !important;\n        opacity: 0 !important;\n        display: block !important;\n      }\n      .loading {\n        width: calc(100% - 32px);\n        z-index: 1000;\n        opacity: .9;\n        text-align: center;\n        align-content: space-around;\n        justify-content: center;\n        position: absolute;\n        padding: 0;\n        margin: 0;\n        display: flex;\n        margin: 0 auto;\n        visibility: visible;\n        transition: visibility .5s, opacity .5s ease;\n      }\n      .loading elmsln-loading {\n        margin: 0 80px;\n        display: inline-flex;\n      }\n      #loading {\n        height: 100%;\n        display: flex;\n        justify-content: center;\n      }\n      #loading .loading,\n      #loading elmsln-loading{\n        display: block;\n        height: 80px;\n      }\n      .card-content {\n        padding: .16px;\n      }\n      .card-content p {\n        padding: 0;\n        margin: 0;\n      }\n      #itemlist {\n        min-height: 150px;\n        border: 1px solid #222222;\n      }\n      hax-app-search-inputs {\n        min-height: 150px;\n        padding: 16px 16px 0 16px;\n        color: #222222;\n      }\n      hax-app-pagination {\n        min-height: 32px;\n        font-size: 12.8px;\n        display: none;\n        justify-content: flex-end;\n        justify-content: center;\n        color: #222222;\n      }\n      .loading-text {\n        font-size: 32px;\n        padding: 16px 0;\n        color: var(--simple-colors-light-green-background3);\n      }\n    </style>\n\n    <iron-ajax auto="[[auto]]" id="request" method="[[method]]" url="[[requestEndPoint]]" handle-as="json" headers="[[headers]]" params="[[requestParams]]" last-response="{{requestData}}" hidden="" loading="{{loading}}" debounce-duration="250"></iron-ajax>\n    <hax-app-search-inputs label="[[label]]" schema="{{searchSchema}}" values="{{searchValues}}"></hax-app-search-inputs>\n    <hax-app-pagination id="pagerbottom" request-data="[[requestData]]" pagination="[[pagination]]"></hax-app-pagination>\n    <div id="loading" class="loading" hidden\\$="[[!loading]]">\n      <elmsln-loading color="light-green-text text-accent-3" size="large"></elmsln-loading>\n      <div class="loading-text">Loading content..</div>\n    </div>\n    <iron-list grid="" id="itemlist" items="[[media]]" as="resultData">\n      <template>\n        <hax-app-search-result result-data="[[resultData]]"></hax-app-search-result>\n      </template>\n    </iron-list>\n'
      ]
    );
    _templateObject_7a585aa0edbe11e883a5d91bd26efb3f = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_7a585aa0edbe11e883a5d91bd26efb3f()
    ),
    is: "hax-app-search",
    properties: {
      activeApp: { type: Object, observer: "_resetAppSearch" },
      auto: { type: Boolean, value: !1 },
      searchSchema: { type: Object, value: {} },
      searchValues: { type: Object, value: {} },
      headers: { type: Object, value: {} },
      method: { type: String, value: "GET" },
      loading: { type: Boolean, value: !1 },
      requestData: { type: Object, value: {}, observer: "_requestDataChanged" },
      media: { type: Array, value: [], observer: "_mediaChanged" }
    },
    _searchValuesEvent: function _searchValuesEvent(e) {
      if (babelHelpers.typeof(e.detail) !== "undefined") {
        var requestParams = this.requestParams;
        for (var property in e.detail) {
          requestParams[property] = e.detail[property];
        }
        this.set("requestParams", {});
        this.set("requestParams", requestParams);
      }
    },
    _resetAppSearch: function _resetAppSearch(newValue) {
      if (babelHelpers.typeof(newValue) !== "undefined" && null !== newValue) {
        var app = newValue,
          requestParams = {};
        this.label = app.details.title;
        this.auto = !1;
        this.set("media", []);
        if (babelHelpers.typeof(app.connection.data) !== "undefined") {
          requestParams = app.connection.data;
        }
        if (
          babelHelpers.typeof(app.connection.operations.browse.data) !==
          "undefined"
        ) {
          requestParams = Object.assign(
            requestParams,
            app.connection.operations.browse.data
          );
        }
        this.set("method", app.connection.operations.browse.method);
        this.set("headers", {});
        if (babelHelpers.typeof(app.connection.headers) !== "undefined") {
          this.set("headers", app.connection.headers);
        }
        this.set("requestParams", {});
        this.set("requestParams", requestParams);
        var requestEndPoint =
          app.connection.protocol + "://" + app.connection.url;
        if ("/" != requestEndPoint.substr(requestEndPoint.length - 1)) {
          requestEndPoint += "/";
        }
        if (
          babelHelpers.typeof(app.connection.operations.browse.endPoint) !==
          "undefined"
        ) {
          requestEndPoint += app.connection.operations.browse.endPoint;
        }
        this.set("requestEndPoint", requestEndPoint);
        this.set("searchSchema", {});
        var searchSchema = { properties: {} };
        if (
          babelHelpers.typeof(app.connection.operations.browse.search) !==
          "undefined"
        ) {
          searchSchema.properties = app.connection.operations.browse.search;
          this.set("searchSchema", searchSchema);
        }
        this.resultMap = app.connection.operations.browse.resultMap;
        this.set("pagination", {});
        if (
          babelHelpers.typeof(app.connection.operations.browse.pagination) !==
          "undefined"
        ) {
          this.set("pagination", app.connection.operations.browse.pagination);
        }
        if (babelHelpers.typeof(app.connection.auto) !== "undefined") {
          this.auto = app.connection.auto;
        } else {
          this.auto = !0;
        }
      }
    },
    attached: function attached() {
      document.body.addEventListener(
        "hax-store-property-updated",
        this._haxStorePropertyUpdated.bind(this)
      );
      document.body.addEventListener(
        "hax-app-search-values-changed",
        this._searchValuesEvent.bind(this)
      );
    },
    detached: function detached() {
      document.body.removeEventListener(
        "hax-store-property-updated",
        this._haxStorePropertyUpdated.bind(this)
      );
      document.body.removeEventListener(
        "hax-app-search-values-changed",
        this._searchValuesEvent.bind(this)
      );
    },
    _haxStorePropertyUpdated: function _haxStorePropertyUpdated(e) {
      if (
        e.detail &&
        babelHelpers.typeof(e.detail.value) !== "undefined" &&
        e.detail.property
      ) {
        this.set(e.detail.property, e.detail.value);
      }
    },
    _requestDataChanged: function _requestDataChanged(newValue, oldValue) {
      if (
        {} != babelHelpers.typeof(newValue) &&
        babelHelpers.typeof(oldValue) !== "undefined"
      ) {
        var media = [],
          map = this.resultMap,
          data = [];
        if (
          babelHelpers.typeof(this._resolveObjectPath(map.items, newValue)) !==
          "undefined"
        ) {
          data = this._resolveObjectPath(map.items, newValue);
        } else {
          if (null != newValue) {
            data = newValue;
          }
        }
        if (null != data) {
          for (var i = 0; i < data.length; i++) {
            media[i] = {
              title: this._resolveObjectPath(map.preview.title, data[i]),
              details: this._resolveObjectPath(map.preview.details, data[i]),
              type: map.defaultGizmoType,
              map: {}
            };
            if (
              babelHelpers.typeof(media[i].details) !== "undefined" &&
              null != media[i].details
            ) {
              media[i].details = media[i].details.replace(/(<([^>]+)>)/gi, "");
            }
            if (map.preview.id.constructor === Object) {
              var tmp = this._resolveObjectPath(
                map.preview.id.property,
                data[i]
              );
              if ("split" === map.preview.id.op) {
                tmp = tmp.split(map.preview.id.delimiter);
                media[i].id = tmp[map.preview.id.position];
              }
            } else {
              media[i].id = this._resolveObjectPath(map.preview.id, data[i]);
            }
            if (babelHelpers.typeof(map.preview.image) !== "undefined") {
              media[i].image = this._resolveObjectPath(
                map.preview.image,
                data[i]
              );
            } else if (babelHelpers.typeof(map.image) !== "undefined") {
              media[i].image = map.image;
            } else {
              media[i].image = "";
            }
            for (var prop in map.gizmo) {
              if ("_url_source" === prop) {
                var _id = "";
                if (babelHelpers.typeof(media[i].map.__id) !== "undefined") {
                  _id = media[i].map.__id;
                } else {
                  _id = this._resolveObjectPath(map.gizmo.id, data[i]);
                }
                media[i].map.source = map.gizmo._url_source.replace(
                  "<%= id %>",
                  _id
                );
              } else {
                if (map.gizmo[prop].constructor === Object) {
                  var _tmp = this._resolveObjectPath(
                    map.gizmo[prop].property,
                    data[i]
                  );
                  if ("split" === map.gizmo[prop].op) {
                    _tmp = _tmp.split(map.gizmo[prop].delimiter);
                    media[i].map[prop] = _tmp[map.gizmo[prop].position];
                    if ("id" === prop) {
                      media[i].map.__id = media[i].map[prop];
                    }
                  }
                } else {
                  media[i].map[prop] = this._resolveObjectPath(
                    map.gizmo[prop],
                    data[i]
                  );
                }
              }
            }
            if (
              babelHelpers.typeof(media[i].map.url) === "undefined" &&
              babelHelpers.typeof(media[i].map.source) !== "undefined"
            ) {
              media[i].map.url = media[i].map.source;
            }
            if (babelHelpers.typeof(map.gizmo.type) !== "undefined") {
              media[i].type = this._resolveObjectPath(map.gizmo.type, data[i]);
            }
          }
          this.set("media", []);
          this.set("media", media);
        }
      }
    },
    _mediaChanged: function _mediaChanged(newValue, oldValue) {
      var _this = this;
      if (babelHelpers.typeof(oldValue) !== "undefined") {
        setTimeout(function() {
          _this.$.itemlist.fire("iron-resize");
        }, 200);
      }
    },
    _resolveObjectPath: function _resolveObjectPath(path, obj) {
      return path.split(".").reduce(function(prev, curr) {
        return prev ? prev[curr] : null;
      }, obj || self);
    }
  });
});
