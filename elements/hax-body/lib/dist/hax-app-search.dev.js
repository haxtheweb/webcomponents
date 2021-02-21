"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxAppSearch = void 0;

var _litElement = require("lit-element/lit-element.js");

var _haxStore = require("./hax-store.js");

var _mobx = require("mobx");

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _iterableToArray(iter) {
  if (
    Symbol.iterator in Object(iter) ||
    Object.prototype.toString.call(iter) === "[object Arguments]"
  )
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key)
        );
      });
    }
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral([
    '\n            <hax-app-search-result\n              image="',
    '"\n              title="',
    '"\n              details="',
    '"\n              .map="',
    '"\n              type="',
    '"\n            ></hax-app-search-result>\n          ',
  ]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral([
    '\n                  <li>\n                    <a\n                      href="',
    '"\n                      target="_blank"\n                      rel="noopener nofollow noreferrer"\n                      >',
    "</a\n                    >\n                  </li>\n                ",
  ]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '\n            <div class="tos-text">Terms of service:</div>\n            <ul class="tos-text">\n              ',
    "\n            </ul>\n          ",
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    "\n      ",
    '\n      <hax-app-search-inputs\n        id="searchinput"\n        .label="',
    '"\n        .schema="',
    '"\n        @search-values-changed="',
    '"\n      ></hax-app-search-inputs>\n      <hax-app-pagination\n        id="pagerbottom"\n        .request-data="',
    '"\n        .pagination="',
    '"\n      ></hax-app-pagination>\n      <hexagon-loader\n        size="medium"\n        item-count="4"\n        ?loading="',
    '"\n        aria-roledescription="Loading"\n      ></hexagon-loader>\n      <simple-button-grid\n        class="',
    '"\n        always-expanded\n        columns="2"\n      >\n        ',
    "\n      </simple-button-grid>\n    ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();
  _getRequireWildcardCache = function _getRequireWildcardCache() {
    return cache;
  };
  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }
  if (
    obj === null ||
    (_typeof(obj) !== "object" && typeof obj !== "function")
  ) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache();
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj["default"] = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n        :host {\n          display: block;\n        }\n        hexagon-loader {\n          display: none;\n          margin: 0 auto;\n          z-index: 1000;\n          --hexagon-color: var(--hax-tray-accent-color);\n        }\n        hexagon-loader[loading] {\n          display: block;\n          opacity: 0.8;\n        }\n        .card-content {\n          padding: 0;\n        }\n        .card-content p {\n          padding: 0;\n          margin: 0;\n        }\n        #itemlist {\n          min-height: 172px;\n          text-align: center;\n          align-items: center;\n        }\n        hax-app-search-inputs {\n          min-height: 80px;\n          padding: 0;\n        }\n        hax-app-pagination {\n          min-height: 32px;\n          font-size: var(--hax-tray-font-size-sm);\n          display: none;\n          justify-content: flex-end;\n          justify-content: center;\n        }\n        .tos-text {\n          font-size: var(--hax-tray-font-size-sm);\n        }\n        .tos-text ul {\n          padding: 0;\n          margin: 0;\n        }\n        .tos-text a {\n          font-size: var(--hax-tray-font-size-sm);\n          color: var(--hax-tray-accent-color);\n          text-decoration: underline;\n        }\n        .tos-text a:hover,\n        .tos-text a:focus,\n        .tos-text a:active {\n          outline: 2px solid var(--hax-tray-accent-color);\n        }\n      ",
  ]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  return Object.freeze(
    Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })
  );
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true },
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

/**
 * `hax-app-search`
 * `An element that brokers the visual display of a listing of material from an end point. The goal is to normalize data from some location which is media centric. This expects to get at least enough data in order to form a grid of items which are selectable. It's also generically implemented so that anything can be hooked up as a potential source for input (example: youtube API or custom in-house solution). The goal is to return enough info via fired event so that we can tell hax-body that the user selected a tag, properties, slot combination so that hax-body can turn the selection into a custom element / element injected into the hax-body slot.`
 * @microcopy - the mental model for this element
 * - hax-source - a backend that can supply items for selection by the user
 * - hax-body - the text are ultimately we are trying to insert this item into
 * @element hax-app-search
 */
var HaxAppSearch =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(HaxAppSearch, _LitElement);

    _createClass(HaxAppSearch, null, [
      {
        key: "styles",

        /**
         * LitElement constructable styles enhancement
         */
        get: function get() {
          return [(0, _litElement.css)(_templateObject())];
        },
      },
    ]);

    function HaxAppSearch() {
      var _this;

      _classCallCheck(this, HaxAppSearch);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxAppSearch).call(this)
      );
      _this.auto = false;
      _this.headers = {};
      _this.method = "GET";
      _this.loading = false;
      _this.requestData = {};
      _this.media = [];
      _this.tos = [];
      _this.resultMap = {};
      Promise.resolve().then(function () {
        return _interopRequireWildcard(
          require("@lrnwebcomponents/simple-fields/lib/simple-fields-field.js")
        );
      });
      Promise.resolve().then(function () {
        return _interopRequireWildcard(
          require("@lrnwebcomponents/simple-fields/lib/simple-fields-container.js")
        );
      });
      Promise.resolve().then(function () {
        return _interopRequireWildcard(
          require("@lrnwebcomponents/hexagon-loader/hexagon-loader.js")
        );
      });
      Promise.resolve().then(function () {
        return _interopRequireWildcard(
          require("@lrnwebcomponents/hax-body/lib/hax-app-search-inputs.js")
        );
      });
      Promise.resolve().then(function () {
        return _interopRequireWildcard(
          require("@lrnwebcomponents/hax-body/lib/hax-app-search-result.js")
        );
      });
      Promise.resolve().then(function () {
        return _interopRequireWildcard(
          require("@lrnwebcomponents/hax-body/lib/hax-toolbar-item.js")
        );
      });
      Promise.resolve().then(function () {
        return _interopRequireWildcard(
          require("@lrnwebcomponents/simple-toolbar/lib/simple-button-grid.js")
        );
      });
      (0, _mobx.autorun)(function () {
        _this.activeApp = (0, _mobx.toJS)(_haxStore.HAXStore.activeApp);
      });
      return _this;
    }
    /**
     * LitElement life cycle - render callback
     */

    _createClass(
      HaxAppSearch,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(
              _templateObject2(),
              this.tos.length > 0
                ? (0, _litElement.html)(
                    _templateObject3(),
                    this.tos.map(function (item) {
                      return (0,
                      _litElement.html)(_templateObject4(), item.link, item.title);
                    })
                  )
                : "",
              this.label,
              this.searchSchema,
              this._searchValuesChanged,
              this.requestData,
              this.pagination,
              this.loading,
              this.searching ? "collapse-hide" : "",
              this.media.map(function (resultData) {
                return (0,
                _litElement.html)(_templateObject5(), resultData.image, resultData.title, resultData.details, resultData.map, resultData.type);
              })
            );
          },
          /**
           * generate appstore query
           */
        },
        {
          key: "loadAppData",
          value: function loadAppData() {
            var _this2 = this;

            var url;
            return regeneratorRuntime.async(
              function loadAppData$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      this.loading = true;
                      url = this.requestUrl(
                        this.requestEndPoint,
                        this.requestParams
                      );
                      _context.next = 4;
                      return regeneratorRuntime.awrap(
                        fetch(url, {
                          headers: this.headers,
                          method: this.method,
                        })
                          .then(function (response) {
                            if (response.ok) return response.json();
                          })
                          .then(function (json) {
                            _this2._requestDataChanged(json);
                          })
                      );

                    case 4:
                    case "end":
                      return _context.stop();
                  }
                }
              },
              null,
              this
            );
          },
        },
        {
          key: "updated",
          value: function updated(changedProperties) {
            var _this3 = this;

            changedProperties.forEach(function (oldValue, propName) {
              if (
                [
                  "auto",
                  "method",
                  "headers",
                  "requestEndPoint",
                  "requestParams",
                ].includes(propName)
              ) {
                clearTimeout(_this3.__debounce);
                _this3.__debounce = setTimeout(function () {
                  if (_this3.requestEndPoint) {
                    _this3.loadAppData();
                  }
                }, 100);
              }

              if (propName == "activeApp") {
                // ensure we overwrite completely
                _this3.requestParams = {}; // ensure correct wipe of the search area assuming it has a search

                _this3.searchSchema = {};
                setTimeout(function () {
                  _this3.searchSchema = {
                    properties: {},
                  };

                  _this3._resetAppSearch(_this3.activeApp);
                }, 10);
              }
            });
          },
        },
        {
          key: "requestUrl",
          value: function requestUrl() {
            var url =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : "";
            var params =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : {};
            var queryString = ""; // support specialized appending data that is a string
            // to allow devs more flexibility

            if (
              _haxStore.HAXStore.connectionRewrites.appendUploadEndPoint !=
                null &&
              params.__HAXAPPENDUPLOADENDPOINT__
            ) {
              queryString =
                _haxStore.HAXStore.connectionRewrites.appendUploadEndPoint +
                "&";
            } // specialized support for an internal facing path which requires a JWT
            // this is deep in the weeds but is useful in allowing for safely
            // searching internal app paths that leverage JWT for security

            if (
              _haxStore.HAXStore.connectionRewrites.appendJwt != null &&
              params.__HAXJWT__
            ) {
              params[
                _haxStore.HAXStore.connectionRewrites.appendJwt
              ] = localStorage.getItem(
                _haxStore.HAXStore.connectionRewrites.appendJwt
              );
            }

            queryString = queryString + this.queryStringData(params); // look for a specialized param

            if (queryString) {
              var bindingChar = url.indexOf("?") >= 0 ? "&" : "?";
              return url + bindingChar + queryString;
            }

            return url;
          },
          /**
           * from queryString but without encoding param
           */
        },
        {
          key: "queryStringData",
          value: function queryStringData(params) {
            var queryParts = [];
            var param;
            var value;

            for (param in params) {
              value = params[param]; //param = window.encodeURIComponent(param);

              if (
                param == "__HAXJWT__" ||
                param == "__HAXAPPENDUPLOADENDPOINT__"
              ) {
                // do nothing we skip these internal values
              } else if (Array.isArray(value)) {
                for (var i = 0; i < value.length; i++) {
                  queryParts.push(
                    param + "=" + window.encodeURIComponent(value[i])
                  );
                }
              } else if (value !== null) {
                queryParts.push(param + "=" + window.encodeURIComponent(value));
              } else {
                queryParts.push(param);
              }
            }

            return queryParts.join("&");
          },
        },
        {
          key: "_searchValuesChanged",

          /**
           * Search input was added.
           */
          value: function _searchValuesChanged(e) {
            var requestParams = this.requestParams;

            for (var property in e.detail) {
              // dont send empty params in the request
              if (e.detail[property] != "") {
                requestParams[property] = e.detail[property];
              }
            }

            this.requestParams = _objectSpread({}, this.requestParams);
          },
          /**
           * Active app has changed.
           */
        },
        {
          key: "_resetAppSearch",
          value: function _resetAppSearch(newValue) {
            if (newValue && newValue.details) {
              var app = newValue;
              var requestParams = {};
              this.label = app.details.title; // support presenting ToS links for legacy reasons

              if (app.details.tos && app.details.tos.length > 0) {
                this.tos = _toConsumableArray(app.details.tos);
              } else {
                this.tos = [];
              }

              this.label = app.details.title; // disable auto for a moment while we switch inputs

              this.auto = false;
              this.media = []; // see if we have any global settings for connections like api keys

              if (
                _typeof(app.connection.data) !==
                (typeof undefined === "undefined"
                  ? "undefined"
                  : _typeof(undefined))
              ) {
                requestParams = app.connection.data;
              } // see if the browse endpoint has local overrides

              if (
                _typeof(app.connection.operations.browse.data) !==
                (typeof undefined === "undefined"
                  ? "undefined"
                  : _typeof(undefined))
              ) {
                requestParams = Object.assign(
                  requestParams,
                  app.connection.operations.browse.data
                );
              }

              this.method = app.connection.operations.browse.method;
              this.headers = {};

              if (
                _typeof(app.connection.headers) !==
                (typeof undefined === "undefined"
                  ? "undefined"
                  : _typeof(undefined))
              ) {
                this.headers = app.connection.headers;
              }

              this.requestParams = _objectSpread({}, requestParams); // build the request end point

              var requestEndPoint =
                app.connection.protocol + "://" + app.connection.url; // ensure we build a url correctly

              if (requestEndPoint.substr(requestEndPoint.length - 1) != "/") {
                requestEndPoint += "/";
              } // support local end point modification

              if (
                _typeof(app.connection.operations.browse.endPoint) !==
                (typeof undefined === "undefined"
                  ? "undefined"
                  : _typeof(undefined))
              ) {
                requestEndPoint += app.connection.operations.browse.endPoint;
              }

              this.requestEndPoint = requestEndPoint;
              var searchSchema = {
                properties: {},
              };

              if (
                _typeof(app.connection.operations.browse.search) !==
                (typeof undefined === "undefined"
                  ? "undefined"
                  : _typeof(undefined))
              ) {
                searchSchema.properties =
                  app.connection.operations.browse.search;
                this.searchSchema = _objectSpread({}, searchSchema);
              }

              this.resultMap = app.connection.operations.browse.resultMap; // map pagination if it has it (it better..)

              this.pagination = {};

              if (
                _typeof(app.connection.operations.browse.pagination) !==
                (typeof undefined === "undefined"
                  ? "undefined"
                  : _typeof(undefined))
              ) {
                this.pagination = app.connection.operations.browse.pagination;
              } // reset the auto flag

              if (
                _typeof(app.connection.auto) !==
                (typeof undefined === "undefined"
                  ? "undefined"
                  : _typeof(undefined))
              ) {
                this.auto = app.connection.auto;
              } else {
                this.auto = true;
              }
            }
          },
          /**
           * Callback for when media has been updated via the end point
           */
        },
        {
          key: "_requestDataChanged",
          value: function _requestDataChanged(newValue) {
            if (this.resultMap && _typeof(newValue) != {}) {
              var media = [];
              var map = this.resultMap;
              var data = []; // look for the items element to draw our data from at its root
              // while supporting data that's purely direct result without an items
              // list to dig into

              if (this.resultMap.items) {
                if (
                  _typeof(this._resolveObjectPath(map.items, newValue)) !==
                  (typeof undefined === "undefined"
                    ? "undefined"
                    : _typeof(undefined))
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
                    details: this._resolveObjectPath(
                      map.preview.details,
                      data[i]
                    ),
                    type: map.defaultGizmoType,
                    map: {},
                  }; // strip HTML from details since it might contain complex content

                  if (
                    _typeof(media[i].details) !==
                      (typeof undefined === "undefined"
                        ? "undefined"
                        : _typeof(undefined)) &&
                    media[i].details != null
                  ) {
                    media[i].details = media[i].details.replace(
                      /(<([^>]+)>)/gi,
                      ""
                    );
                  } // allow id to use deeper logic to split it back out

                  if (map.preview.id.constructor === Object) {
                    var tmp = this._resolveObjectPath(
                      map.preview.id.property,
                      data[i]
                    );

                    if (map.preview.id.op === "split") {
                      tmp = tmp.split(map.preview.id.delimiter);
                      media[i].id = tmp[map.preview.id.position];
                    }
                  } else {
                    media[i].id = this._resolveObjectPath(
                      map.preview.id,
                      data[i]
                    );
                  } // image, while really useful is not required

                  if (
                    _typeof(map.preview.image) !==
                    (typeof undefined === "undefined"
                      ? "undefined"
                      : _typeof(undefined))
                  ) {
                    media[i].image = this._resolveObjectPath(
                      map.preview.image,
                      data[i]
                    );
                  } else if (
                    _typeof(map.image) !==
                    (typeof undefined === "undefined"
                      ? "undefined"
                      : _typeof(undefined))
                  ) {
                    media[i].image = map.image;
                  } else {
                    media[i].image = "";
                  }

                  for (var prop in map.gizmo) {
                    // check for a _url_source modifier... stupid youtube and others.
                    if (prop === "_url_source") {
                      var _id = "";

                      if (
                        _typeof(media[i].map.__id) !==
                        (typeof undefined === "undefined"
                          ? "undefined"
                          : _typeof(undefined))
                      ) {
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
                        var _tmp = this._resolveObjectPath(
                          map.gizmo[prop].property,
                          data[i]
                        );

                        if (map.gizmo[prop].op === "split") {
                          _tmp = _tmp.split(map.gizmo[prop].delimiter);
                          media[i].map[prop] = _tmp[map.gizmo[prop].position];

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
                  } // another sanity check, if we don't have a url but have a source bind that too

                  if (
                    _typeof(media[i].map.url) ===
                      (typeof undefined === "undefined"
                        ? "undefined"
                        : _typeof(undefined)) &&
                    _typeof(media[i].map.source) !==
                      (typeof undefined === "undefined"
                        ? "undefined"
                        : _typeof(undefined))
                  ) {
                    media[i].map.url = media[i].map.source;
                  } // gizmo type is also supported in the mapping element itself
                  // Think an asset management backend as opposed to a specific
                  // type of asset like video. If the item coming across can
                  // effectively check what kind of gizmo is required for it
                  // to work then we need to support that asset declaring the
                  // gizmo type needed or we can use mimetype or a total guess
                  // based on the file path returned (obviously the least accurate)
                  // and if we dont get a hit then fallback to just the default

                  if (
                    _typeof(map.gizmo.type) !==
                    (typeof undefined === "undefined"
                      ? "undefined"
                      : _typeof(undefined))
                  ) {
                    media[i].type = this._resolveObjectPath(
                      map.gizmo.type,
                      data[i]
                    );
                  } else if (
                    _typeof(map.gizmo.mimetype) !==
                    (typeof undefined === "undefined"
                      ? "undefined"
                      : _typeof(undefined))
                  ) {
                    media[i].type = _haxStore.HAXStore.mimeTypeToGizmoType(
                      this._resolveObjectPath(map.gizmo.mimetype, data[i])
                    );
                  } else if (
                    _haxStore.HAXStore.guessGizmoType(map.gizmo) != "*"
                  ) {
                    // try and guess the type based on file ending
                    media[i].type = _haxStore.HAXStore.guessGizmoType(
                      map.gizmo
                    );
                  }
                } // this will trigger an aggressive repaint of the items

                this.media = [].concat(media);
              }
            }

            this.loading = false;
          },
          /**
           * Helper to take a multi-dimensional object and convert
           * it's reference into the real value. This allows for variable input defined
           * in a string to actually hit the deeper part of an object structure.
           */
        },
        {
          key: "_resolveObjectPath",
          value: function _resolveObjectPath(path, obj) {
            return path.split(".").reduce(function (prev, curr) {
              return prev ? prev[curr] : null;
            }, obj || self);
          },
        },
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "hax-app-search";
          },
        },
        {
          key: "properties",
          get: function get() {
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
          },
        },
      ]
    );

    return HaxAppSearch;
  })(_litElement.LitElement);

exports.HaxAppSearch = HaxAppSearch;
window.customElements.define(HaxAppSearch.tag, HaxAppSearch);
