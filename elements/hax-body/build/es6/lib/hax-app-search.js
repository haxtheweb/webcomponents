import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-input/paper-input.js";
import "../node_modules/@polymer/paper-card/paper-card.js";
import "../node_modules/@polymer/paper-styles/paper-styles.js";
import "../node_modules/@polymer/iron-list/iron-list.js";
import "../node_modules/@polymer/iron-ajax/iron-ajax.js";
import "../node_modules/@lrnwebcomponents/elmsln-loading/elmsln-loading.js";
import "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
import "./hax-app-search-inputs.js";
import "./hax-app-search-result.js";
Polymer({
  _template: html`
    <style is="custom-style">
      :host {
        display: block;
      };
      paper-button.item-wrapper {
        margin: 0;
        padding: 0;
      }
      paper-card {
        padding: 0;
        margin: 8px;
        width: 240px;
        font-size: 12px;
        --paper-card-header: {
          max-height: 160px;
        }
      }
      @media screen and (min-width: 800px) {
        paper-card {
          font-size: 14px;
        }
      }
      #loading[hidden] {
        visibility: hidden !important;
        opacity: 0 !important;
        display: block !important;
      }
      .loading {
        width: calc(100% - 32px);
        z-index: 1000;
        opacity: .9;
        text-align: center;
        align-content: space-around;
        justify-content: center;
        position: absolute;
        padding: 0;
        margin: 0;
        display: flex;
        margin: 0 auto;
        visibility: visible;
        transition: visibility .5s, opacity .5s ease;
      }
      .loading elmsln-loading {
        margin: 0 80px;
        display: inline-flex;
      }
      #loading {
        height: 100%;
        display: flex;
        justify-content: center;
      }
      #loading .loading,
      #loading elmsln-loading{
        display: block;
        height: 80px;
      }
      .card-content {
        padding: .16px;
      }
      .card-content p {
        padding: 0;
        margin: 0;
      }
      #itemlist {
        min-height: 150px;
        border: 1px solid #222222;
      }
      hax-app-search-inputs {
        min-height: 150px;
        padding: 16px 16px 0 16px;
        color: #222222;
      }
      hax-app-pagination {
        min-height: 32px;
        font-size: 12.8px;
        display: none;
        justify-content: flex-end;
        justify-content: center;
        color: #222222;
      }
      .loading-text {
        font-size: 32px;
        padding: 16px 0;
        color: var(--simple-colors-light-green-background3);
      }
    </style>

    <iron-ajax auto="[[auto]]" id="request" method="[[method]]" url="[[requestEndPoint]]" handle-as="json" headers="[[headers]]" params="[[requestParams]]" last-response="{{requestData}}" hidden="" loading="{{loading}}" debounce-duration="250"></iron-ajax>
    <hax-app-search-inputs label="[[label]]" schema="{{searchSchema}}" values="{{searchValues}}"></hax-app-search-inputs>
    <hax-app-pagination id="pagerbottom" request-data="[[requestData]]" pagination="[[pagination]]"></hax-app-pagination>
    <div id="loading" class="loading" hidden\$="[[!loading]]">
      <elmsln-loading color="light-green-text text-accent-3" size="large"></elmsln-loading>
      <div class="loading-text">Loading content..</div>
    </div>
    <iron-list grid="" id="itemlist" items="[[media]]" as="resultData">
      <template>
        <hax-app-search-result result-data="[[resultData]]"></hax-app-search-result>
      </template>
    </iron-list>
`,
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
  _searchValuesEvent: function(e) {
    if (typeof e.detail !== typeof void 0) {
      var requestParams = this.requestParams;
      for (var property in e.detail) {
        requestParams[property] = e.detail[property];
      }
      this.set("requestParams", {});
      this.set("requestParams", requestParams);
    }
  },
  _resetAppSearch: function(newValue) {
    if (typeof newValue !== typeof void 0 && null !== newValue) {
      let app = newValue;
      var requestParams = {};
      this.label = app.details.title;
      this.auto = !1;
      this.set("media", []);
      if (typeof app.connection.data !== typeof void 0) {
        requestParams = app.connection.data;
      }
      if (typeof app.connection.operations.browse.data !== typeof void 0) {
        requestParams = Object.assign(
          requestParams,
          app.connection.operations.browse.data
        );
      }
      this.set("method", app.connection.operations.browse.method);
      this.set("headers", {});
      if (typeof app.connection.headers !== typeof void 0) {
        this.set("headers", app.connection.headers);
      }
      this.set("requestParams", {});
      this.set("requestParams", requestParams);
      var requestEndPoint =
        app.connection.protocol + "://" + app.connection.url;
      if ("/" != requestEndPoint.substr(requestEndPoint.length - 1)) {
        requestEndPoint += "/";
      }
      if (typeof app.connection.operations.browse.endPoint !== typeof void 0) {
        requestEndPoint += app.connection.operations.browse.endPoint;
      }
      this.set("requestEndPoint", requestEndPoint);
      this.set("searchSchema", {});
      var searchSchema = { properties: {} };
      if (typeof app.connection.operations.browse.search !== typeof void 0) {
        searchSchema.properties = app.connection.operations.browse.search;
        this.set("searchSchema", searchSchema);
      }
      this.resultMap = app.connection.operations.browse.resultMap;
      this.set("pagination", {});
      if (
        typeof app.connection.operations.browse.pagination !== typeof void 0
      ) {
        this.set("pagination", app.connection.operations.browse.pagination);
      }
      if (typeof app.connection.auto !== typeof void 0) {
        this.auto = app.connection.auto;
      } else {
        this.auto = !0;
      }
    }
  },
  attached: function() {
    document.body.addEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    document.body.addEventListener(
      "hax-app-search-values-changed",
      this._searchValuesEvent.bind(this)
    );
  },
  detached: function() {
    document.body.removeEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    document.body.removeEventListener(
      "hax-app-search-values-changed",
      this._searchValuesEvent.bind(this)
    );
  },
  _haxStorePropertyUpdated: function(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof void 0 &&
      e.detail.property
    ) {
      this.set(e.detail.property, e.detail.value);
    }
  },
  _requestDataChanged: function(newValue, oldValue) {
    if ({} != typeof newValue && typeof oldValue !== typeof void 0) {
      let media = [],
        map = this.resultMap,
        data = [];
      if (
        typeof this._resolveObjectPath(map.items, newValue) !== typeof void 0
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
            typeof media[i].details !== typeof void 0 &&
            null != media[i].details
          ) {
            media[i].details = media[i].details.replace(/(<([^>]+)>)/gi, "");
          }
          if (map.preview.id.constructor === Object) {
            let tmp = this._resolveObjectPath(map.preview.id.property, data[i]);
            if ("split" === map.preview.id.op) {
              tmp = tmp.split(map.preview.id.delimiter);
              media[i].id = tmp[map.preview.id.position];
            }
          } else {
            media[i].id = this._resolveObjectPath(map.preview.id, data[i]);
          }
          if (typeof map.preview.image !== typeof void 0) {
            media[i].image = this._resolveObjectPath(
              map.preview.image,
              data[i]
            );
          } else if (typeof map.image !== typeof void 0) {
            media[i].image = map.image;
          } else {
            media[i].image = "";
          }
          for (var prop in map.gizmo) {
            if ("_url_source" === prop) {
              let _id = "";
              if (typeof media[i].map.__id !== typeof void 0) {
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
                let tmp = this._resolveObjectPath(
                  map.gizmo[prop].property,
                  data[i]
                );
                if ("split" === map.gizmo[prop].op) {
                  tmp = tmp.split(map.gizmo[prop].delimiter);
                  media[i].map[prop] = tmp[map.gizmo[prop].position];
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
            typeof media[i].map.url === typeof void 0 &&
            typeof media[i].map.source !== typeof void 0
          ) {
            media[i].map.url = media[i].map.source;
          }
          if (typeof map.gizmo.type !== typeof void 0) {
            media[i].type = this._resolveObjectPath(map.gizmo.type, data[i]);
          }
        }
        this.set("media", []);
        this.set("media", media);
      }
    }
  },
  _mediaChanged: function(newValue, oldValue) {
    if (typeof oldValue !== typeof void 0) {
      setTimeout(() => {
        this.$.itemlist.fire("iron-resize");
      }, 200);
    }
  },
  _resolveObjectPath: function(path, obj) {
    return path.split(".").reduce(function(prev, curr) {
      return prev ? prev[curr] : null;
    }, obj || self);
  }
});
