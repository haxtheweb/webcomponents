import { html, css, LitElement } from "lit-element/lit-element.js";
import { HAXStore } from "./hax-store.js";
import { autorun, toJS } from "mobx";

/**
 * `hax-app-search`
 * `An element that brokers the visual display of a listing of material from an end point. The goal is to normalize data from some location which is media centric. This expects to get at least enough data in order to form a grid of items which are selectable. It's also generically implemented so that anything can be hooked up as a potential source for input (example: youtube API or custom in-house solution). The goal is to return enough info via fired event so that we can tell hax-body that the user selected a tag, properties, slot combination so that hax-body can turn the selection into a custom element / element injected into the hax-body slot.`
 * @microcopy - the mental model for this element
 * - hax-source - a backend that can supply items for selection by the user
 * - hax-body - the text are ultimately we are trying to insert this item into
 * @element hax-app-search
 */
class HaxAppSearch extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        hexagon-loader {
          display: none;
          margin: 0 auto;
          z-index: 1000;
          --hexagon-color: var(--hax-tray-accent-color);
        }
        hexagon-loader[loading] {
          display: block;
          opacity: 0.8;
        }
        .card-content {
          padding: 0;
        }
        .card-content p {
          padding: 0;
          margin: 0;
        }
        #itemlist {
          min-height: 172px;
          text-align: center;
          align-items: center;
        }
        hax-app-search-inputs {
          min-height: 80px;
          padding: 0;
        }
        hax-app-pagination {
          min-height: 32px;
          font-size: var(--hax-tray-font-size-sm);
          display: none;
          justify-content: flex-end;
          justify-content: center;
        }
        .tos-text {
          font-size: var(--hax-tray-font-size-sm);
        }
        .tos-text ul {
          padding: 0;
          margin: 0;
        }
        .tos-text a {
          font-size: var(--hax-tray-font-size-sm);
          color: var(--hax-tray-accent-color);
          text-decoration: underline;
        }
        .tos-text a:hover,
        .tos-text a:focus,
        .tos-text a:active {
          outline: 2px solid var(--hax-tray-accent-color);
        }
      `,
    ];
  }
  constructor() {
    super();
    this.auto = false;
    this.headers = {};
    this.method = "GET";
    this.loading = false;
    this.requestData = {};
    this.media = [];
    this.tos = [];
    this.resultMap = {};
    import("@lrnwebcomponents/simple-fields/lib/simple-fields-field.js");
    import("@lrnwebcomponents/simple-fields/lib/simple-fields-container.js");
    import("@lrnwebcomponents/hexagon-loader/hexagon-loader.js");
    import("@lrnwebcomponents/hax-body/lib/hax-app-search-inputs.js");
    import("@lrnwebcomponents/hax-body/lib/hax-app-search-result.js");
    import("@lrnwebcomponents/hax-body/lib/hax-toolbar-item.js");
    import("@lrnwebcomponents/simple-toolbar/lib/simple-button-grid.js");
    autorun(() => {
      this.activeApp = toJS(HAXStore.activeApp);
    });
  }
  /**
   * LitElement life cycle - render callback
   */
  render() {
    return html`
      ${this.tos.length > 0
        ? html`
            <div class="tos-text">Terms of service:</div>
            <ul class="tos-text">
              ${this.tos.map((item) => {
                return html`
                  <li>
                    <a
                      href="${item.link}"
                      target="_blank"
                      rel="noopener nofollow noreferrer"
                      >${item.title}</a
                    >
                  </li>
                `;
              })}
            </ul>
          `
        : ``}
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
      <simple-button-grid
        class="${this.searching ? "collapse-hide" : ""}"
        always-expanded
        columns="2"
      >
        ${this.media.map(
          (resultData) => html`
            <hax-app-search-result
              image="${resultData.image}"
              title="${resultData.title}"
              details="${resultData.details}"
              .map="${resultData.map}"
              type="${resultData.type}"
            ></hax-app-search-result>
          `
        )}
      </simple-button-grid>
    `;
  }
  /**
   * generate appstore query
   */
  async loadAppData() {
    this.loading = true;
    let url = this.requestUrl(this.requestEndPoint, this.requestParams);
    await fetch(url, {
      headers: this.headers,
      method: this.method,
    })
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((json) => {
        this._requestDataChanged(json);
      });
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (
        [
          "auto",
          "method",
          "headers",
          "requestEndPoint",
          "requestParams",
        ].includes(propName)
      ) {
        clearTimeout(this.__debounce);
        this.__debounce = setTimeout(() => {
          if (this.requestEndPoint) {
            this.loadAppData();
          }
        }, 100);
      }
      if (propName == "activeApp") {
        // ensure we overwrite completely
        this.requestParams = {};
        // ensure correct wipe of the search area assuming it has a search
        this.searchSchema = {};
        setTimeout(() => {
          this.searchSchema = {
            properties: {},
          };
          this._resetAppSearch(this.activeApp);
        }, 10);
      }
    });
  }
  requestUrl(url = "", params = {}) {
    var queryString = "";
    // support specialized appending data that is a string
    // to allow devs more flexibility
    if (
      HAXStore.connectionRewrites.appendUploadEndPoint != null &&
      params.__HAXAPPENDUPLOADENDPOINT__
    ) {
      queryString = HAXStore.connectionRewrites.appendUploadEndPoint + "&";
    }
    // specialized support for an internal facing path which requires a JWT
    // this is deep in the weeds but is useful in allowing for safely
    // searching internal app paths that leverage JWT for security
    if (HAXStore.connectionRewrites.appendJwt != null && params.__HAXJWT__) {
      params[HAXStore.connectionRewrites.appendJwt] = localStorage.getItem(
        HAXStore.connectionRewrites.appendJwt
      );
    }
    queryString = queryString + this.queryStringData(params);
    // look for a specialized param
    if (queryString) {
      var bindingChar = url.indexOf("?") >= 0 ? "&" : "?";
      return url + bindingChar + queryString;
    }
    return url;
  }
  /**
   * from queryString but without encoding param
   */
  queryStringData(params) {
    var queryParts = [];
    var param;
    var value;

    for (param in params) {
      value = params[param];
      //param = window.encodeURIComponent(param);
      if (param == "__HAXJWT__" || param == "__HAXAPPENDUPLOADENDPOINT__") {
        // do nothing we skip these internal values
      } else if (Array.isArray(value)) {
        for (var i = 0; i < value.length; i++) {
          queryParts.push(param + "=" + window.encodeURIComponent(value[i]));
        }
      } else if (value !== null) {
        queryParts.push(param + "=" + window.encodeURIComponent(value));
      } else {
        queryParts.push(param);
      }
    }

    return queryParts.join("&");
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
      },
      /**
       * Terms of service object
       */
      tos: {
        type: Array,
      },
      /**
       * Immediatley perform a request.
       */
      auto: {
        type: Boolean,
      },
      /**
       * Search schema for presenting a form of input.
       */
      searchSchema: {
        type: Object,
      },
      /**
       * Custom headers for data binding from the App feed.
       */
      headers: {
        type: Object,
      },
      /**
       * Custom method for requesting data (almost always will be GET)
       */
      method: {
        type: String,
      },
      /**
       * loading
       */
      loading: {
        type: Boolean,
      },
      /**
       * Media request data updated
       */
      requestData: {
        type: Object,
      },
      /**
       * Media object, normalized.
       */
      media: {
        type: Array,
      },
      requestEndPoint: {
        type: String,
      },
      requestParams: {
        type: Object,
      },
      resultMap: {
        type: Object,
      },
    };
  }
  /**
   * Search input was added.
   */
  _searchValuesChanged(e) {
    let requestParams = this.requestParams;
    for (let property in e.detail) {
      // dont send empty params in the request
      if (e.detail[property] != "") {
        requestParams[property] = e.detail[property];
      }
    }
    this.requestParams = { ...this.requestParams };
  }

  /**
   * Active app has changed.
   */
  _resetAppSearch(newValue) {
    if (newValue && newValue.details) {
      let app = newValue;
      var requestParams = {};
      this.label = app.details.title;
      // support presenting ToS links for legacy reasons
      if (app.details.tos && app.details.tos.length > 0) {
        this.tos = [...app.details.tos];
      } else {
        this.tos = [];
      }
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
      this.requestParams = { ...requestParams };
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
      var searchSchema = {
        properties: {},
      };
      if (typeof app.connection.operations.browse.search !== typeof undefined) {
        searchSchema.properties = app.connection.operations.browse.search;
        this.searchSchema = { ...searchSchema };
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
   * Callback for when media has been updated via the end point
   */
  _requestDataChanged(newValue) {
    if (this.resultMap && typeof newValue != {}) {
      let media = [];
      let map = this.resultMap;
      let data = [];
      // look for the items element to draw our data from at its root
      // while supporting data that's purely direct result without an items
      // list to dig into
      if (this.resultMap.items) {
        if (
          typeof this._resolveObjectPath(map.items, newValue) !==
          typeof undefined
        ) {
          data = this._resolveObjectPath(map.items, newValue);
        } else {
          if (newValue != null) {
            data = newValue;
          }
        }
      } else {
        data = newValue;
      }
      if (data != null) {
        // step through and translate response data into a form we can easily
        // understand when stamping out our cards above.
        for (var i = 0; i < data.length; i++) {
          media[i] = {
            title: this._resolveObjectPath(map.preview.title, data[i]),
            details: this._resolveObjectPath(map.preview.details, data[i]),
            type: map.defaultGizmoType,
            map: {},
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
              media[i].map.url = media[i].map.source;
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
          // gizmo type needed or we can use mimetype or a total guess
          // based on the file path returned (obviously the least accurate)
          // and if we dont get a hit then fallback to just the default
          if (typeof map.gizmo.type !== typeof undefined) {
            media[i].type = this._resolveObjectPath(map.gizmo.type, data[i]);
          } else if (typeof map.gizmo.mimetype !== typeof undefined) {
            media[i].type = HAXStore.mimeTypeToGizmoType(
              this._resolveObjectPath(map.gizmo.mimetype, data[i])
            );
          } else if (HAXStore.guessGizmoType(map.gizmo) != "*") {
            // try and guess the type based on file ending
            media[i].type = HAXStore.guessGizmoType(map.gizmo);
          }
        }
        // this will trigger an aggressive repaint of the items
        this.media = [...media];
      }
    }
    this.loading = false;
  }

  /**
   * Helper to take a multi-dimensional object and convert
   * it's reference into the real value. This allows for variable input defined
   * in a string to actually hit the deeper part of an object structure.
   */
  _resolveObjectPath(path, obj) {
    return path.split(".").reduce(function (prev, curr) {
      return prev ? prev[curr] : null;
    }, obj || self);
  }
}
window.customElements.define(HaxAppSearch.tag, HaxAppSearch);
export { HaxAppSearch };
