"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxUploadField = void 0;

var _litElement = require("lit-element/lit-element.js");

var _simpleFieldsUpload = require("@lrnwebcomponents/simple-fields/lib/simple-fields-upload.js");

var _utils = require("@lrnwebcomponents/utils/utils.js");

var _haxStore = require("./hax-store.js");

var _I18NMixin = require("@lrnwebcomponents/i18n-manager/lib/I18NMixin.js");

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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
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

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
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

var HaxUploadField =
  /*#__PURE__*/
  (function (_winEventsElement) {
    _inherits(HaxUploadField, _winEventsElement);

    /**
     * HTMLElement life cycle
     */
    function HaxUploadField() {
      var _this;

      _classCallCheck(this, HaxUploadField);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxUploadField).call(this)
      );
      _this.__winEvents = {
        "hax-app-picker-selection": "_haxAppPickerSelection", //TODO
      };
      _this.t = {
        whereUpload: "Where would you like to upload this",
        cantHandle: "Sorry, you don't have a storage location that can handle",
        uploads: "uploads",
      };

      _this.registerLocalization({
        context: _assertThisInitialized(_this),
        namespace: "hax",
      });

      return _this;
    }

    _createClass(HaxUploadField, [
      {
        key: "_canUpload",
        value: function _canUpload() {
          return !this.__allowUpload && _haxStore.HAXStore;
        },
        /**
         * Respond to uploading a file
         */
      },
      {
        key: "_fileAboutToUpload",
        value: function _fileAboutToUpload(e) {
          if (this._canUpload()) {
            // cancel the event so we can jump in
            e.preventDefault();
            e.stopPropagation(); // look for a match as to what gizmo types it supports

            var values = {
              source: e.detail.file.name,
              type: e.detail.file.type,
            }; // we have no clue what this is.. let's try and guess..

            var type = _haxStore.HAXStore.guessGizmoType(values); // find targets that support this type

            var targets = _haxStore.HAXStore.getHaxAppStoreTargets(type); // make sure we have targets

            if (targets.length === 1) {
              this._haxAppPickerSelection({
                detail: targets[0],
              });
            } else if (targets.length !== 0) {
              _haxStore.HAXStore.haxAppPicker.presentOptions(
                targets,
                type,
                "".concat(this.t.whereUpload, " ").concat(type, "?"),
                "app"
              );
            } else {
              _haxStore.HAXStore.toast(
                ""
                  .concat(this.t.cantHandle, " ")
                  .concat(type, " ")
                  .concat(this.t.uploads, "!"),
                5000
              );
            }
          } else {
            this.__allowUpload = false;
          }
        },
        /**
         * Event for an app being selected from a picker
         * This happens when multiple upload targets support the given type
         */
      },
      {
        key: "_haxAppPickerSelection",
        value: function _haxAppPickerSelection(e) {
          // details for where to upload the file
          var connection = e.detail.connection;
          this.__appUsed = e.detail;
          this.shadowRoot.querySelector("#fileupload").method =
            connection.operations.add.method;
          var requestEndPoint = connection.protocol + "://" + connection.url; // ensure we build a url correctly

          if (requestEndPoint.substr(requestEndPoint.length - 1) != "/") {
            requestEndPoint += "/";
          } // support local end point modification

          if (
            _typeof(connection.operations.add.endPoint) !==
            (typeof undefined === "undefined"
              ? "undefined"
              : _typeof(undefined))
          ) {
            requestEndPoint += connection.operations.add.endPoint;
          } // implementation specific tweaks to talk to things like HAXcms and other CMSs
          // that have per load token based authentication

          if (
            _haxStore.HAXStore.connectionRewrites.appendUploadEndPoint != null
          ) {
            requestEndPoint +=
              "?" + _haxStore.HAXStore.connectionRewrites.appendUploadEndPoint;
          }

          if (_haxStore.HAXStore.connectionRewrites.appendJwt != null) {
            requestEndPoint +=
              "&" +
              _haxStore.HAXStore.connectionRewrites.appendJwt +
              "=" +
              localStorage.getItem(
                _haxStore.HAXStore.connectionRewrites.appendJwt
              );
          }

          this.shadowRoot.querySelector("#fileupload").headers =
            connection.headers;
          this.shadowRoot.querySelector("#fileupload").target = requestEndPoint; // invoke file uploading...

          this.__allowUpload = true;
          this.shadowRoot.querySelector("#fileupload").uploadFiles();
        },
        /**
         * Respond to successful file upload, now inject url into url field and
         * do a gizmo guess from there!
         */
      },
      {
        key: "_fileUploadResponse",
        value: function _fileUploadResponse(e) {
          // convert response to object
          var response = JSON.parse(e.detail.xhr.response); // access the app that did the upload

          var map = this.__appUsed.connection.operations.add.resultMap;
          var data = {};
          var item = {}; // look for the items element to draw our data from at its root

          if (
            _typeof(this._resolveObjectPath(map.item, response)) !==
            (typeof undefined === "undefined"
              ? "undefined"
              : _typeof(undefined))
          ) {
            data = this._resolveObjectPath(map.item, response);
          }

          item.type = map.defaultGizmoType; // pull in prop matches

          for (var prop in map.gizmo) {
            item[prop] = this._resolveObjectPath(map.gizmo[prop], data);
          } // another sanity check, if we don't have a url but have a source bind that too

          if (
            _typeof(item.url) ===
              (typeof undefined === "undefined"
                ? "undefined"
                : _typeof(undefined)) &&
            _typeof(item.source) !==
              (typeof undefined === "undefined"
                ? "undefined"
                : _typeof(undefined))
          ) {
            item.url = item.source;
          } // gizmo type is also supported in the mapping element itself
          // Think an asset management backend as opposed to a specific
          // type of asset like video. If the item coming across can
          // effectively check what kind of gizmo is required for it
          // to work then we need to support that asset declaring the
          // gizmo type needed

          if (
            _typeof(map.gizmo.type) !==
            (typeof undefined === "undefined"
              ? "undefined"
              : _typeof(undefined))
          ) {
            item.type = this._resolveObjectPath(map.gizmo.type, data);
          } // set the value of the url which will update our URL and notify

          this.shadowRoot.querySelector("#url").value = item.url;
        },
      },
    ]);

    return HaxUploadField;
  })(
    (0, _utils.winEventsElement)(
      (0, _I18NMixin.I18NMixin)(_simpleFieldsUpload.SimpleFieldsUpload)
    )
  );

exports.HaxUploadField = HaxUploadField;
window.customElements.define("hax-upload-field", HaxUploadField);
