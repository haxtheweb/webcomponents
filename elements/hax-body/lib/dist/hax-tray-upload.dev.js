"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxTrayUpload = void 0;

var _litElement = require("lit-element/lit-element.js");

var _utils = require("@lrnwebcomponents/utils/utils.js");

var _haxStore = require("./hax-store.js");

var _haxUploadField = require("./hax-upload-field.js");

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

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(receiver);
      }
      return desc.value;
    };
  }
  return _get(target, property, receiver || target);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

var HaxTrayUpload =
  /*#__PURE__*/
  (function (_HaxUploadField) {
    _inherits(HaxTrayUpload, _HaxUploadField);

    _createClass(HaxTrayUpload, null, [
      {
        key: "tag",

        /**
         * Convention we use
         */
        get: function get() {
          return "hax-tray-upload";
        },
        /**
         * HTMLElement
         */
      },
    ]);

    function HaxTrayUpload() {
      var _this;

      _classCallCheck(this, HaxTrayUpload);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxTrayUpload).call(this)
      );
      _this.t = _objectSpread(
        {},
        _get(
          _getPrototypeOf(HaxTrayUpload.prototype),
          "t",
          _assertThisInitialized(_this)
        ),
        {
          uploadMedia: "Upload Media",
        }
      );

      _this.registerLocalization({
        context: _assertThisInitialized(_this),
        namespace: "hax",
      });

      _this.__winEvents = {
        "hax-app-picker-selection": "_haxAppPickerSelection",
        "place-holder-file-drop": "_placeHolderFileDrop",
      };
      return _this;
    }

    _createClass(HaxTrayUpload, [
      {
        key: "updated",
        value: function updated(changedProperties) {
          var _this2 = this;

          if (_get(_getPrototypeOf(HaxTrayUpload.prototype), "updated", this))
            _get(
              _getPrototypeOf(HaxTrayUpload.prototype),
              "updated",
              this
            ).call(this, changedProperties);
          changedProperties.forEach(function (oldValue, propName) {
            if (propName == "t") _this2.label = _this2.t.uploadMedia;
          });
        },
        /**
         * Respond to successful file upload, now inject url into url field and
         * do a gizmo guess from there!
         */
      },
      {
        key: "_fileUploadResponse",
        value: function _fileUploadResponse(e) {
          _get(
            _getPrototypeOf(HaxTrayUpload.prototype),
            "_fileUploadResponse",
            this
          ).call(this, e); // @todo put in logic to support the response actually
          // just outright returning a haxElement. This is rare
          // but if the HAX developer has control over the endpoint
          // then they could get HAX to streamline some workflows
          // or by-pass the gizmo selection step to improve UX
          // for end users even further. Examples could be a media
          // management system that has remote rendering (cms-token)
          // or a highly specific endpoint that we know we can only
          // present in one way effectively Box / Google doc viewer.

          this.newAssetConfigure();
        },
      },
      {
        key: "_canUpload",
        value: function _canUpload() {
          return !this.__allowUpload;
        },
        /**
         * Configure asset after upload or URL passed in.
         */
      },
      {
        key: "newAssetConfigure",
        value: function newAssetConfigure() {
          var values = {
            source: this.shadowRoot.querySelector("#url").value,
            title: this.shadowRoot.querySelector("#url").value,
          };

          _haxStore.HAXStore.insertLogicFromValues(values, this);
        },
        /**
         * A file event was detected from a drag and drop in the interface, most likely
         * from a place-holder tag
         */
      },
      {
        key: "_placeHolderFileDrop",
        value: function _placeHolderFileDrop(e) {
          // reference the active place holder element since place holders are
          // the only things possible for seeing these
          _haxStore.HAXStore.activePlaceHolder = e.detail.placeHolderElement; // ! I can't believe this actually works. This takes the event
          // ! that was a drop event else where on the page and then repoints
          // ! it to simulate the drop event using the same event structure that
          // ! would have happened if they had used this element in the first place

          this.shadowRoot.querySelector("#fileupload")._onDrop(e.detail);
        },
      },
    ]);

    return HaxTrayUpload;
  })(_haxUploadField.HaxUploadField);

exports.HaxTrayUpload = HaxTrayUpload;
window.customElements.define(HaxTrayUpload.tag, HaxTrayUpload);
