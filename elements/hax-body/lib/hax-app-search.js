import { html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@polymer/iron-ajax/iron-ajax.js";
import { winEventsElement } from "@lrnwebcomponents/utils/utils.js";
/**
 * `hax-app-search`
 * `An element that brokers the visual display of a listing of material from an end point. The goal is to normalize data from some location which is media centric. This expects to get at least enough data in order to form a grid of items which are selectable. It's also generically implemented so that anything can be hooked up as a potential source for input (example: youtube API or custom in-house solution). The goal is to return enough info via fired event so that we can tell hax-body that the user selected a tag, properties, slot combination so that hax-body can turn the selection into a custom element / element injected into the hax-body slot.`
 * @microcopy - the mental model for this element
 * - hax-source - a backend that can supply items for selection by the user
 * - hax-body - the text are ultimately we are trying to insert this item into
 * @customElement hax-app-search
 */
class HaxAppSearch extends winEventsElement(SimpleColors) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
        }
        paper-button.item-wrapper {
          margin: 0;
          padding: 0;
        }
        hexagon-loader {
          display: none;
          justify-content: center;
          width: 100%;
          z-index: 1000;
          position: absolute;
          --hexagon-color: var(--hax-color-bg-accent, #0085ba);
        }
        hexagon-loader[loading] {
          display: block;
          opacity: 0.8;
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
      `
    ];
  }
  constructor() {
    super();
    // window based events managed in winEventsElement
    this.__winEvents = {
      "hax-store-property-updated": "_haxStorePropertyUpdated"
    };
    this.auto = false;
    this.headers = {};
    this.method = "GET";
    this.loading = false;
    this.requestData = {};
    this.media = [];
    this.resultMap = {};
    import("@polymer/paper-input/paper-input.js");
    import("@lrnwebcomponents/dropdown-select/dropdown-select.js");
    import("@lrnwebcomponents/hexagon-loader/hexagon-loader.js");
    import("@lrnwebcomponents/hax-body/lib/hax-app-search-inputs.js");
    import("@lrnwebcomponents/hax-body/lib/hax-app-search-result.js");
  }
  /**
   * LitElement life cycle - render callback
   */
  render() {
    return html`
      <iron-ajax
        id="request"
        handle-as="json"
        @last-response-changed="${this.requestDataChanged}"
        @loading-changed="${this._loadingChanged}"
        debounce-duration="200"
      ></iron-ajax>
      <hax-app-search-inputs
        id="searchinput"
        .label="${this.label}"
        .schema="${this.searchSchema}"
        @search-values-changed="${this._searchValuesChanged}"
      ></hax-app-search-inputs>
      <hax-app-pagination
        id="pagerbottom"
        .request-data="${this.requestData}"
        .pagination="${this.pagination}"
      ></hax-app-pagination>
      <hexagon-loader
        size="medium"
        item-count="4"
        ?loading="${this.loading}"
        aria-roledescription="Loading"
      ></hexagon-loader>
      <div id="itemlist">
        ${this.media.map(
          resultData => html`
            <hax-app-search-result
              image="${resultData.image}"
              title="${resultData.title}"
              details="${resultData.details}"
              .map="${resultData.map}"
              type="${resultData.type}"
            ></hax-app-search-result>
          `
        )}
      </div>
    `;
  }
  requestDataChanged(e) {
    this.requestData = e.detail.value;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (["auto", "method", "headers"].includes(propName)) {
        this.shadowRoot.querySelector("#request")[propName] = this[propName];
      }
      if (propName == "requestEndPoint") {
        this.shadowRoot.querySelector("#request").url = this[propName];
      }
      if (propName == "requestParams") {
        this.shadowRoot.querySelector("#request").params = this[propName];
      }
      if (propName == "activeApp") {
        this._resetAppSearch(this[propName], oldValue);
      }
      if (propName == "requestData") {
        this._requestDataChanged(this[propName], oldValue);
      }
    });
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
        type: Object
      },
      /**
       * Immediatley perform a request.
       */
      auto: {
        type: Boolean
      },
      /**
       * Search schema for presenting a form of input.
       */
      searchSchema: {
        type: Object
      },
      /**
       * Custom headers for data binding from the App feed.
       */
      headers: {
        type: Object
      },
      /**
       * Custom method for requesting data (almost always will be GET)
       */
      method: {
        type: String
      },
      /**
       * loading
       */
      loading: {
        type: Boolean
      },
      /**
       * Media request data updated
       */
      requestData: {
        type: Object
      },
      /**
       * Media object, normalized.
       */
      media: {
        type: Array
      },
      requestEndPoint: {
        type: String
      },
      requestParams: {
        type: Object
      },
      resultMap: {
        type: Object
      }
    };
  }
  /**
   * Search input was added.
   */
  _searchValuesChanged(e) {
    let requestParams = this.requestParams;
    for (let property in e.detail) {
      requestParams[property] = e.detail[property];
    }
    this.requestParams = { ...this.requestParams };
  }

  /**
   * Active app has changed.
   */
  _resetAppSearch(newValue, oldValue) {
    if (typeof newValue !== typeof undefined && newValue !== null) {
      let app = newValue;
      var requestParams = {};
      this.label = app.details.title;
      // disable auto for a moment while we switch inputs
      this.auto = false;
      this.media = [];
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
      this.method = app.connection.operations.browse.method;
      this.headers = {};
      if (typeof app.connection.headers !== typeof undefined) {
        this.headers = app.connection.headers;
      }
      // ensure we overwrite completely
      this.requestParams = {};
      this.requestParams = requestParams;
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
      this.requestEndPoint = requestEndPoint;
      // ensure correct wipe of the search area assuming it has a search
      this.searchSchema = {};
      var searchSchema = {
        properties: {}
      };
      if (typeof app.connection.operations.browse.search !== typeof undefined) {
        searchSchema.properties = app.connection.operations.browse.search;
        this.searchSchema = searchSchema;
      }
      this.resultMap = app.connection.operations.browse.resultMap;
      // map pagination if it has it (it better..)
      this.pagination = {};
      if (
        typeof app.connection.operations.browse.pagination !== typeof undefined
      ) {
        this.pagination = app.connection.operations.browse.pagination;
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
      this[e.detail.property] = e.detail.value;
    }
  }

  /**
   * Callback for when media has been updated via the end point
   */
  _requestDataChanged(newValue, oldValue) {
    if (
      this.resultMap &&
      this.resultMap.items &&
      typeof newValue != {} &&
      typeof oldValue !== typeof undefined
    ) {
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
        // this will trigger an aggressive repaint of the items
        this.media = [...media];
      }
    }
  }

  _loadingChanged(e) {
    this.loading = e.detail.value;
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
