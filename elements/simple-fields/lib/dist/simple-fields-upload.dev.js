"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleFieldsUpload = void 0;

var _litElement = require("lit-element/lit-element.js");

require("@lrnwebcomponents/simple-fields/lib/simple-fields-field.js");

var _simpleFieldsUi = require("./simple-fields-ui.js");

var _simpleFieldsFieldset = require("./simple-fields-fieldset.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icons.js");

require("@lrnwebcomponents/simple-toolbar/simple-toolbar.js");

require("@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-button.js");

require("@vaadin/vaadin-upload/vaadin-upload.js");

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

function _templateObject3() {
  var data = _taggedTemplateLiteral([" or "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n      <div id="url-browse">\n        <simple-fields-field\n          id="url"\n          value="',
    '"\n          @value-changed="',
    '"\n          label="URL"\n          type="url"\n          auto-validate=""\n          part="url"\n          @click="',
    '"\n          @mousedown="',
    '"\n          @focus="',
    '"\n        >\n          <simple-toolbar-button\n            id="browse"\n            label="Browse..."\n            show-text-label\n            @click="',
    '"\n            controls="fieldset"\n            slot="suffix"\n            part="browse"\n          >\n          </simple-toolbar-button>\n        </simple-fields-field>\n      </div>\n      <div id="upload-options">\n        <vaadin-upload\n          capture\n          class="option-',
    '"\n          form-data-name="file-upload"\n          id="fileupload"\n          @upload-before="',
    '"\n          @upload-response="',
    '"\n          part="upload"\n        >\n          <button id="add-hidden" slot="add-button" hidden></button>\n          <div\n            id="drop-camera"\n            slot="drop-label"\n            part="drop-area"\n            ?hidden="',
    '"\n          >\n            <span id="drop" part="drop-area-text">\n              <simple-icon-lite\n                icon="file-upload"\n                part="drop-area-icon"\n              ></simple-icon-lite>\n              Drop media here ',
    '\n            </span>\n            <simple-toolbar-button\n              icon="image:camera-alt"\n              label="Take photo"\n              show-text-label\n              @mousedown="',
    '"\n              @focus="',
    '"\n              @click="',
    '"\n              controls="fieldset"\n              part="take-photo"\n              ?hidden="',
    '"\n            >\n            </simple-toolbar-button>\n            <simple-toolbar-button\n              icon="image:camera-alt"\n              label="Record Audio"\n              show-text-label\n              @mousedown="',
    '"\n              @focus="',
    '"\n              @click="',
    '"\n              controls="fieldset"\n              part="record-audio"\n              ?hidden="',
    '"\n            >\n            </simple-toolbar-button>\n          </div>\n          <simple-toolbar-button\n            id="cancel-camera"\n            icon="icons:clear"\n            label="Cancel"\n            @mousedown="',
    '"\n            @focus="',
    '"\n            @click="',
    '"\n            controls="fieldset"\n            slot="drop-label"\n            part="cancel-media"\n            ?hidden="',
    '"\n          >\n          </simple-toolbar-button>\n          <div\n            id="camerahole"\n            ?hidden="',
    '"\n            part="camera"\n            slot="drop-label"\n            part="camera-preview"\n          ></div>\n          <div\n            id="voicerecorder"\n            ?hidden="',
    '"\n            slot="drop-label"\n            part="voice-preview"\n          ></div>\n        </vaadin-upload>\n      </div>\n      <div id="description" ?hidden="',
    '" part="field-desc">\n        <div id="description" part="field-desc">\n          <slot name="description"></slot>\n          ',
    "\n        </div>\n      </div>\n    ",
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
    "\n        :host {\n          pointer-events: all;\n          overflow: visible;\n          transition: 0.3s all ease;\n          --simple-login-camera-aspect: 1.777777777777;\n          --simple-camera-snap-color: var(--simple-fields-color, currentColor);\n          --simple-camera-snap-background: var(\n            --simple-fields-background-color,\n            unset\n          );\n          --simple-camera-snap-border-radius: 2px;\n          --lumo-font-family: var(--simple-fields-font-family, sans-serif);\n          --lumo-error-color: var(--simple-fields-error-color, #dd2c00);\n          --lumo-primary-font-color: var(--simple-fields-color, currentColor);\n          --lumo-base-color: var(--simple-fields-background-color, transparent);\n          /*\n          --lumo-primary-contrast-color: var(\n            --simple-fields-background-color,\n            transparent\n          );\n          --lumo-primary-color: var(--simple-fields-color, currentColor);\n          --lumo-dark-primary-color: var(--simple-fields-color, currentColor);\n          --lumo-light-primary-color: var(--simple-fields-color, currentColor);\n          --lumo-primary-text-color: var(--simple-fields-color, currentColor);\n          --lumo-body-text-color: var(--simple-fields-color, currentColor);\n          --lumo-header-text-color: var(--simple-fields-color, currentColor);\n          --lumo-secondary-text-color: var(--simple-fields-color, currentColor);\n          --lumo-contrast-20pct: transparent;\n          --lumo-disabled-text-color: var(--simple-fields-border-color, #999);\n          --lumo-contrast-5pct: rgba(127, 127, 127, 0.2);*/\n        }\n        #url-browse,\n        #drop-camera {\n          width: 100%;\n          font-family: var(--simple-fields-font-family, sans-serif);\n          font-size: var(--simple-fields-detail-font-size, 12px);\n        }\n        #drop-camera {\n          display: flex;\n          align-items: center;\n          flex-wrap: wrap;\n          align-items: center;\n          justify-content: center;\n        }\n        #browse {\n          margin-right: 0;\n        }\n        #url {\n          margin-bottom: var(--simple-fields-margin-small, 8px);\n        }\n        #drop,\n        #photo {\n          white-space: nowrap;\n        }\n        #upload-options {\n          transition: height 0.3s linear;\n        }\n        #cancel-camera {\n          display: block;\n          margin: 0;\n          margin: -12px -12px 0;\n          z-index: 2;\n        }\n        #cancel-camera::part(button) {\n          width: 24px;\n        }\n        simple-toolbar-button {\n          margin: 0 5px;\n        }\n        vaadin-upload {\n          padding: 0 var(--simple-fields-margin-small, 8px)\n            var(--simple-fields-margin-small, 8px);\n          position: relative;\n          overflow: visible;\n        }\n        vaadin-upload::part(drop-label-icon) {\n          display: none;\n        }\n        vaadin-upload::part(add-button) {\n          font-family: var(--simple-fields-font-family, sans-serif);\n          color: var(--simple-fields-color, currentColor);\n        }\n        vaadin-upload::part(drop-label) {\n          font-family: var(--simple-fields-font-family, sans-serif);\n          color: var(--simple-fields-color, currentColor);\n          margin-bottom: 16px;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          padding: 0 calc(1 * var(--simple-fields-margin-small, 8px));\n          width: calc(100% - 2 * var(--simple-fields-margin-small) - 2px);\n        }\n        vaadin-upload.option-selfie::part(drop-label) {\n          display: block;\n        }\n        vaadin-upload.option-selfie #drop-camera {\n          display: none;\n        }\n        vaadin-upload[dragover] {\n          border-color: var(\n            --simple-fields-secondary-accent-color,\n            var(--simple-colors-default-theme-accent-3, #77e2ff)\n          );\n        }\n        vaadin-upload-file {\n          --disabled-text-color: #var(--simple-fields-border-color, #999);\n        }\n        simple-camera-snap {\n          --simple-camera-snap-button-container-bottom: 2px;\n          --simple-camera-snap-button-container-z-index: 5;\n          --simple-camera-snap-button-border-radius: 100%;\n          --simple-camera-snap-button-opacity: 0.7;\n        }\n      ",
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

/**
 * `simple-fields-upload` takes in a JSON schema of type array and builds a form,
 * exposing a `value` property that represents an array described by the schema.
 *
 * @group simple-fields
 * @element simple-fields-upload
 * @extends a11y-tab
 * @extends simple-fields-fieldset
 * @demo ./demo/upload.html
 */
var SimpleFieldsUpload =
  /*#__PURE__*/
  (function (_SimpleFieldsFieldset) {
    _inherits(SimpleFieldsUpload, _SimpleFieldsFieldset);

    _createClass(SimpleFieldsUpload, null, [
      {
        key: "tag",
        get: function get() {
          return "simple-fields-upload";
        },
      },
      {
        key: "styles",
        get: function get() {
          return [].concat(
            _toConsumableArray(
              _get(_getPrototypeOf(SimpleFieldsUpload), "styles", this)
            ),
            _toConsumableArray(_simpleFieldsUi.SimpleFieldsButtonStyles),
            [(0, _litElement.css)(_templateObject())]
          );
        },
        /**
         * HTMLElement life cycle
         */
      },
    ]);

    function SimpleFieldsUpload() {
      var _this;

      _classCallCheck(this, SimpleFieldsUpload);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(SimpleFieldsUpload).call(this)
      );
      _this.noCamera = false; // @todo leave this off until we can do more testing
      // the wiring is all there but the UI pattern is not

      _this.noVoiceRecord = true;
      return _this;
    }
    /**
     * LitElement life cycle - render callback
     */

    _createClass(
      SimpleFieldsUpload,
      [
        {
          key: "_handleCameraOption",

          /**
           * display camera snap
           *
           * @param {event} e
           * @memberof SimpleFieldsUpload
           */
          value: function _handleCameraOption(e) {
            e.preventDefault();
            this.option = "selfie";

            this._takeSelfie(e);
          },
          /**
           * display voice recorder
           *
           * @param {event} e
           * @memberof SimpleFieldsUpload
           */
        },
        {
          key: "_handleAudioOption",
          value: function _handleAudioOption(e) {
            e.preventDefault();
            this.option = "voice";

            this._voiceRecorder(e);
          },
          /**
           * cancel camera and audio / display upload options
           *
           * @param {event} e
           * @memberof SimpleFieldsUpload
           */
        },
        {
          key: "_handleCancel",
          value: function _handleCancel(e) {
            e.preventDefault();
            this.option = "fileupload";
          },
          /**
           * when browse button is clicked trigger the hidden add button in vaadin-upload
           *
           * @param {event} e
           * @memberof SimpleFieldsUpload
           */
        },
        {
          key: "_handleBrowse",
          value: function _handleBrowse(e) {
            e.preventDefault();
            this.shadowRoot
              .querySelector("#add-hidden")
              .dispatchEvent(new CustomEvent("click", e));
          },
          /**
           * update the value
           *
           * @param {*} e
           * @memberof SimpleFieldsUpload
           */
        },
        {
          key: "valueChanged",
          value: function valueChanged(e) {
            this.value = e.detail.value;
            console.log(e.detail.value);
          },
          /**
           * LitElement life cycle - properties changed callback
           */
        },
        {
          key: "updated",
          value: function updated(changedProperties) {
            var _this2 = this;

            if (
              _get(
                _getPrototypeOf(SimpleFieldsUpload.prototype),
                "updated",
                this
              )
            )
              _get(
                _getPrototypeOf(SimpleFieldsUpload.prototype),
                "updated",
                this
              ).call(this, changedProperties);
            changedProperties.forEach(function (oldValue, propName) {
              // notify
              if (propName == "value") {
                _this2.dispatchEvent(
                  new CustomEvent("value-changed", {
                    detail: {
                      value: _this2[propName],
                    },
                  })
                );
              }
            });
          },
          /**
           * LitElement / popular convention
           */
        },
        {
          key: "_fileAboutToUpload",

          /**
           * Respond to uploading a file
           */
          value: function _fileAboutToUpload(e) {
            this.dispatchEvent(
              new CustomEvent("upload-before", {
                bubbles: true,
                cancelable: true,
                composed: false,
                detail: e.detail,
              })
            );
          },
          /**
           * Respond to successful file upload, now inject url into url field and
           * do a gizmo guess from there!
           */
        },
        {
          key: "_fileUploadResponse",
          value: function _fileUploadResponse(e) {
            // set the value of the url which will update our URL and notify
            this.shadowRoot.querySelector("#url").value = item.url;
            this.dispatchEvent(
              new CustomEvent("upload-response", {
                bubbles: true,
                cancelable: true,
                composed: false,
                detail: e.detail,
              })
            );
          },
          /**
           * LitElement
           */
        },
        {
          key: "firstUpdated",
          value: function firstUpdated(changedProperties) {
            if (
              _get(
                _getPrototypeOf(SimpleFieldsUpload.prototype),
                "firstUpdated",
                this
              )
            ) {
              _get(
                _getPrototypeOf(SimpleFieldsUpload.prototype),
                "firstUpdated",
                this
              ).call(this, changedProperties);
            } // test on load for if we have a media device
            // default to URL if we have a value of any kind

            if (this.value) {
              this.option = "url";
            } else {
              this.option = "fileupload";
            }
          },
          /**
           * We got a new photo
           */
        },
        {
          key: "__newPhotoShowedUp",
          value: function __newPhotoShowedUp(e) {
            var file = new File(
              [e.detail.raw],
              "headshot" + e.timeStamp + ".jpg"
            );

            this.shadowRoot.querySelector("#fileupload")._addFile(file);
          },
          /**
           * We got a new photo
           */
        },
        {
          key: "__newAudioShowedUp",
          value: function __newAudioShowedUp(e) {
            var file = new File(
              [e.detail.value],
              "voice-memo" + e.timeStamp + ".mp3"
            );

            this.shadowRoot.querySelector("#fileupload")._addFile(file);
          },
          /**
           * Invoke the camera to set itself up
           */
        },
        {
          key: "_takeSelfie",
          value: function _takeSelfie(e) {
            if (!this.camera) {
              Promise.resolve().then(function () {
                return _interopRequireWildcard(
                  require("@lrnwebcomponents/simple-login/lib/simple-camera-snap.js")
                );
              });
              this.camera = document.createElement("simple-camera-snap");
              this.camera.autoplay = true;
              this.camera.addEventListener(
                "simple-camera-snap-image",
                this.__newPhotoShowedUp.bind(this)
              );
              this.shadowRoot
                .querySelector("#camerahole")
                .appendChild(this.camera);
            }
          },
        },
        {
          key: "_voiceRecorder",
          value: function _voiceRecorder(e) {
            if (!this.voice) {
              Promise.resolve().then(function () {
                return _interopRequireWildcard(
                  require("@lrnwebcomponents/voice-recorder/voice-recorder.js")
                );
              });
              this.voice = document.createElement("voice-recorder");
              this.voice.addEventListener(
                "voice-recorder-recording",
                this.__newAudioShowedUp.bind(this)
              );
              this.shadowRoot
                .querySelector("#voicerecorder")
                .appendChild(this.voice);
            }
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
        {
          key: "fields",
          get: function get() {
            return (0, _litElement.html)(
              _templateObject2(),
              this.value || "",
              this.valueChanged,
              function (e) {
                return e.preventDefault();
              },
              function (e) {
                return e.preventDefault();
              },
              function (e) {
                return e.preventDefault();
              },
              this._handleBrowse,
              this.option,
              this._fileAboutToUpload,
              this._fileUploadResponse,
              this.option == "selfie" || this.option == "audio",
              !navigator.mediaDevices
                ? ""
                : (0, _litElement.html)(_templateObject3()),
              function (e) {
                return e.preventDefault();
              },
              function (e) {
                return e.preventDefault();
              },
              this._handleCameraOption,
              !navigator.mediaDevices || this.noCamera,
              function (e) {
                return e.preventDefault();
              },
              function (e) {
                return e.preventDefault();
              },
              this._handleAudioOption,
              !navigator.mediaDevices || this.noVoiceRecord,
              function (e) {
                return e.preventDefault();
              },
              function (e) {
                return e.preventDefault();
              },
              this._handleCancel,
              this.option !== "selfie" && this.option !== "audio",
              this.option !== "selfie",
              this.option !== "audio",
              !this.description,
              this.description
            );
          },
        },
      ],
      [
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(_getPrototypeOf(SimpleFieldsUpload), "properties", this),
              {
                value: {
                  type: String,
                },
                option: {
                  type: String,
                },

                /**
                 * Used when we want to ensure there is not a web cam option like video upload.
                 */
                noCamera: {
                  type: Boolean,
                  attribute: "no-camera",
                },

                /**
                 * No Voice Recording
                 */
                noVoiceRecord: {
                  type: Boolean,
                  attribute: "no-voice-record",
                },
              }
            );
          },
        },
      ]
    );

    return SimpleFieldsUpload;
  })(_simpleFieldsFieldset.SimpleFieldsFieldset);

exports.SimpleFieldsUpload = SimpleFieldsUpload;
window.customElements.define(SimpleFieldsUpload.tag, SimpleFieldsUpload);
