import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/iron-list/iron-list.js";
/**
 * `hax-app-search`
 * `An element that brokers the visual display of a listing of material from an end point. The goal is to normalize data from some location which is media centric. This expects to get at least enough data in order to form a grid of items which are selectable. It's also generically implemented so that anything can be hooked up as a potential source for input (example: youtube API or custom in-house solution). The goal is to return enough info via fired event so that hax-manager can tell hax-body that the user selected a tag, properties, slot combination so that hax-body can turn the selection into a custom element / element injected into the hax-body slot.`
 * @microcopy - the mental model for this element
 * - hax-source - a backend that can supply items for selection by the user
 * - hax-manager - controlling the UI for selection of something
 * - hax-body - the text are ultimately we are trying to insert this item into
 */
class HaxAppSearch extends PolymerElement {
  constructor() {
    super();
    import("@polymer/paper-input/paper-input.js");
    import("@polymer/paper-card/paper-card.js");
    import("@polymer/paper-styles/paper-styles.js");
    import("@lrnwebcomponents/hexagon-loader/hexagon-loader.js");
    import("@lrnwebcomponents/hax-body/lib/hax-app-search-inputs.js");
    import("@lrnwebcomponents/hax-body/lib/hax-app-search-result.js");
    document.body.addEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    document.body.addEventListener(
      "hax-app-search-values-changed",
      this._searchValuesEvent.bind(this)
    );
  }
  static get template() {
    return html`
      <style include="simple-colors-shared-styles">
        :host {
          display: block;
        }
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
        hexagon-loader {
          height: 100%;
          justify-content: center;
          margin: 0 auto -200px;
          z-index: 1000;
          position: relative;
          transition: 0.3s linear opacity, 0.3s linear visibility;
          width: calc(100% - 32px);
          opacity: 0;
          visibility: visible;
        }
        hexagon-loader[loading] {
          opacity: 1;
        }
        .card-content {
          padding: 16px;
        }
        .card-content p {
          padding: 0;
          margin: 0;
        }
        #itemlist {
          min-height: 172px;
          border: 1px solid #222222;
        }
        hax-app-search-inputs {
          min-height: 150px;
          padding: 0 16px;
        }
        hax-app-pagination {
          min-height: 32px;
          font-size: 12.8px;
          display: none;
          justify-content: flex-end;
          justify-content: center;
        }
      </style>

      <iron-ajax
        auto="[[auto]]"
        id="request"
        method="[[method]]"
        url="[[requestEndPoint]]"
        handle-as="json"
        headers="[[headers]]"
        params="[[requestParams]]"
        last-response="{{requestData}}"
        hidden=""
        loading="{{loading}}"
        debounce-duration="300"
      ></iron-ajax>
      <hax-app-search-inputs
        id="searchinput"
        label="[[label]]"
        schema="{{searchSchema}}"
        values="{{searchValues}}"
      ></hax-app-search-inputs>
      <hax-app-pagination
        id="pagerbottom"
        request-data="[[requestData]]"
        pagination="[[pagination]]"
      ></hax-app-pagination>
      <hexagon-loader
        size="small"
        item-count="4"
        loading$="[[loading]]"
        color="#0085ba"
        aria-roledescription="Loading"
      ></hexagon-loader>
      <iron-list
        grid
        id="itemlist"
        items="[[media]]"
        as="resultData"
        hidden$="[[loading]]"
      >
        <template>
          <hax-app-search-result
            result-data="[[resultData]]"
          ></hax-app-search-result>
        </template>
      </iron-list>
    `;
  }

  static get tag() {
    return "hax-app-search";
  }
  static get properties() {
    return {
      /**
       * Active app globally bound based on previous selection.
       */
      activeApp: {
        type: Object,
        observer: "_resetAppSearch"
      },
      /**
       * Immediatley perform a request.
       */
      auto: {
        type: Boolean,
        value: false
      },
      /**
       * Search schema for presenting a form of input.
       */
      searchSchema: {
        type: Object
      },
      /**
       * Search values for data binding between search input
       * and actually rebuilding the search request query
       */
      searchValues: {
        type: Object,
        value: {}
      },
      /**
       * Custom headers for data binding from the App feed.
       */
      headers: {
        type: Object,
        value: {}
      },
      /**
       * Custom method for requesting data (almost always will be GET)
       */
      method: {
        type: String,
        value: "GET"
      },
      /**
       * loading
       */
      loading: {
        type: Boolean,
        value: false,
        observer: "_loadingChanged"
      },
      /**
       * Media request data updated
       */
      requestData: {
        type: Object,
        value: {},
        observer: "_requestDataChanged"
      },
      /**
       * Media object, normalized.
       */
      media: {
        type: Array,
        value: [],
        observer: "_mediaChanged"
      }
    };
  }
  /**
   * Search input was added.
   */
  _searchValuesEvent(e) {
    if (typeof e.detail !== typeof undefined) {
      var requestParams = this.requestParams;
      for (var property in e.detail) {
        requestParams[property] = e.detail[property];
      }
      this.set("requestParams", {});
      this.set("requestParams", requestParams);
    }
  }

  /**
   * Active app has changed.
   */
  _resetAppSearch(newValue, oldValue) {
    if (typeof newValue !== typeof undefined && newValue !== null) {
      let app = newValue;
      var requestParams = {};
      this.label = app.details.title;
      // disasble auto for a moment while we switch inputs
      this.auto = false;
      this.set("media", []);
      // see if we have any global settings for connections like api keys
      if (typeof app.connection.data !== typeof undefined) {
        requestParams = app.connection.data;
      }
      // see if the browse endpoint has local overrides
      if (typeof app.connection.operations.browse.data !== typeof undefined) {
        requestParams = Object.assign(
          requestParams,
          app.connection.operations.browse.data
        );
      }
      this.set("method", app.connection.operations.browse.method);
      this.set("headers", {});
      if (typeof app.connection.headers !== typeof undefined) {
        this.set("headers", app.connection.headers);
      }
      // ensure we overwrite completely
      this.set("requestParams", {});
      this.set("requestParams", requestParams);
      // build the request end point
      var requestEndPoint =
        app.connection.protocol + "://" + app.connection.url;
      // ensure we build a url correctly
      if (requestEndPoint.substr(requestEndPoint.length - 1) != "/") {
        requestEndPoint += "/";
      }
      // support local end point modification
      if (
        typeof app.connection.operations.browse.endPoint !== typeof undefined
      ) {
        requestEndPoint += app.connection.operations.browse.endPoint;
      }
      this.set("requestEndPoint", requestEndPoint);
      // ensure correct wipe of the search area assuming it has a search
      this.set("searchSchema", {});
      var searchSchema = {
        properties: {}
      };
      if (typeof app.connection.operations.browse.search !== typeof undefined) {
        searchSchema.properties = app.connection.operations.browse.search;
        this.set("searchSchema", searchSchema);
      }
      this.resultMap = app.connection.operations.browse.resultMap;
      // map pagination if it has it (it better..)
      this.set("pagination", {});
      if (
        typeof app.connection.operations.browse.pagination !== typeof undefined
      ) {
        this.set("pagination", app.connection.operations.browse.pagination);
      }
      // reset the auto flag
      if (typeof app.connection.auto !== typeof undefined) {
        this.auto = app.connection.auto;
      } else {
        this.auto = true;
      }
    }
  }

  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof undefined &&
      e.detail.property
    ) {
      this.set(e.detail.property, e.detail.value);
    }
  }

  /**
   * Callback for when media has been updated via the end point
   */
  _requestDataChanged(newValue, oldValue) {
    if (typeof newValue != {} && typeof oldValue !== typeof undefined) {
      let media = [];
      let map = this.resultMap;
      let data = [];
      // look for the items element to draw our data from at its root
      if (
        typeof this._resolveObjectPath(map.items, newValue) !== typeof undefined
      ) {
        data = this._resolveObjectPath(map.items, newValue);
      } else {
        if (newValue != null) {
          data = newValue;
        }
      }
      if (data != null) {
        // step through and translate response data into a form we can easily
        // understand when stamping out our cards above.
        for (var i = 0; i < data.length; i++) {
          media[i] = {
            title: this._resolveObjectPath(map.preview.title, data[i]),
            details: this._resolveObjectPath(map.preview.details, data[i]),
            type: map.defaultGizmoType,
            map: {}
          };
          // strip HTML from details since it might contain complex content
          if (
            typeof media[i].details !== typeof undefined &&
            media[i].details != null
          ) {
            media[i].details = media[i].details.replace(/(<([^>]+)>)/gi, "");
          }
          // allow id to use deeper logic to split it back out
          if (map.preview.id.constructor === Object) {
            let tmp = this._resolveObjectPath(map.preview.id.property, data[i]);
            if (map.preview.id.op === "split") {
              tmp = tmp.split(map.preview.id.delimiter);
              media[i].id = tmp[map.preview.id.position];
            }
          } else {
            media[i].id = this._resolveObjectPath(map.preview.id, data[i]);
          }
          // image, while really useful is not required
          if (typeof map.preview.image !== typeof undefined) {
            media[i].image = this._resolveObjectPath(
              map.preview.image,
              data[i]
            );
          } else if (typeof map.image !== typeof undefined) {
            media[i].image = map.image;
          } else {
            media[i].image = "";
          }
          for (var prop in map.gizmo) {
            // check for a _url_source modifier... stupid youtube and others.
            if (prop === "_url_source") {
              let _id = "";
              if (typeof media[i].map.__id !== typeof undefined) {
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
                if (map.gizmo[prop].op === "split") {
                  tmp = tmp.split(map.gizmo[prop].delimiter);
                  media[i].map[prop] = tmp[map.gizmo[prop].position];
                  if (prop === "id") {
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
          // another sanity check, if we don't have a url but have a source bind that too
          if (
            typeof media[i].map.url === typeof undefined &&
            typeof media[i].map.source !== typeof undefined
          ) {
            media[i].map.url = media[i].map.source;
          }
          // gizmo type is also supported in the mapping element itself
          // Think an asset management backend as opposed to a specific
          // type of asset like video. If the item coming across can
          // effectively check what kind of gizmo is required for it
          // to work then we need to support that asset declaring the
          // gizmo type needed
          if (typeof map.gizmo.type !== typeof undefined) {
            media[i].type = this._resolveObjectPath(map.gizmo.type, data[i]);
          }
        }
        // this will trigger an aggressive repaint of the cards
        this.set("media", []);
        this.set("media", media);
      }
    }
  }

  _loadingChanged(newValue, oldValue) {
    if (newValue) {
      this.set("media", []);
      this.notifyPath("media.*");
      setTimeout(() => {
        this.shadowRoot.querySelector("#itemlist").dispatchEvent(
          new CustomEvent("iron-resize", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: true
          })
        );
      }, 1000);
    }
  }
  /**
   * Callback for when media has been processed for display
   */
  _mediaChanged(newValue, oldValue) {
    if (typeof oldValue !== typeof undefined) {
      setTimeout(() => {
        this.shadowRoot.querySelector("#itemlist").dispatchEvent(
          new CustomEvent("iron-resize", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: true
          })
        );
      }, 325);
    }
  }

  /**
   * Helper to take a multi-dimensional object and convert
   * it's reference into the real value. This allows for variable input defined
   * in a string to actually hit the deeper part of an object structure.
   */
  _resolveObjectPath(path, obj) {
    return path.split(".").reduce(function(prev, curr) {
      return prev ? prev[curr] : null;
    }, obj || self);
  }
}
window.customElements.define(HaxAppSearch.tag, HaxAppSearch);
export { HaxAppSearch };
