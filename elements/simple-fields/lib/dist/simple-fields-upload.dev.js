"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.SimpleFieldsUpload = void 0;

var _litElement = require("lit-element/lit-element.js");

var _simpleColors = require("@lrnwebcomponents/simple-colors/simple-colors.js");

require("@lrnwebcomponents/simple-fields/lib/simple-fields-field.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icons.js");

require("@lrnwebcomponents/simple-toolbar/simple-toolbar.js");

require("@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-button.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js");

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

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '\n                        <simple-toolbar-button\n                          icon="',
    '"\n                          label="',
    '"\n                          show-text-label\n                          toggles\n                          toggled="',
    '"\n                          @click="',
    '"\n                          controls="',
    '"\n                          part="',
    '"\n                        >\n                        </simple-toolbar-button>\n                      ',
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n      <fieldset id="fieldset" part="fieldset">\n        <legend id="label" ?hidden="',
    '" part="legend">\n          ',
    ':\n        </legend>\n        <simple-toolbar part="toolbar" always-expanded>\n          <div id="options" class="group" part="options">\n            ',
    '\n\n          </div>\n        </simple-toolbar>\n        <div id="uploads" part="fields">\n          <simple-fields-field\n            id="url"\n            ?hidden="',
    '"\n            value="',
    '"\n            @value-changed="',
    '"\n            label="URL"\n            type="url"\n            auto-validate=""\n            part="url"\n          ></simple-fields-field>\n          <vaadin-upload\n            capture\n            form-data-name="file-upload"\n            ?hidden="',
    '"\n            id="fileupload"\n            @upload-before="',
    '"\n            @upload-response="',
    '"\n            part="upload"\n          ></vaadin-upload>\n          <div\n            id="camerahole"\n            ?hidden="',
    '"\n            part="camera"\n          ></div>\n          <div\n            id="voicerecorder"\n            ?hidden="',
    '"\n            part="voice"\n          ></div>\n          <div\n            id="description"\n            ?hidden="',
    '"\n            part="description"\n          >\n            ',
    "\n          </div>\n        </div>\n      </fieldset>\n    ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n        :host {\n          display: block;\n          visibility: visible;\n          transition: 0.3s all ease;\n          box-sizing: border-box;\n          pointer-events: all;\n          overflow: visible;\n          font-family: var(--simple-fields-font-family, sans-serif);\n          --simple-login-camera-aspect: 1.777777777777;\n          --simple-camera-snap-color: var(--simple-fields-color, currentColor);\n          --simple-camera-snap-background: var(\n            --simple-fields-background-color,\n            unset\n          );\n          --simple-camera-snap-border-radius: 2px;\n          --lumo-font-family: var(--simple-fields-font-family, sans-serif);\n          --lumo-error-color: var(--simple-fields-error-color, #dd2c00);\n          --lumo-primary-font-color: var(--simple-fields-color, currentColor);\n          --lumo-base-color: var(--simple-fields-background-color, transparent);\n          --lumo-primary-contrast-color: var(\n            --simple-fields-background-color,\n            transparent\n          );\n          --lumo-primary-color: var(--simple-fields-color, currentColor);\n          --lumo-dark-primary-color: var(--simple-fields-color, currentColor);\n          --lumo-light-primary-color: var(--simple-fields-color, currentColor);\n          --lumo-primary-text-color: var(--simple-fields-color, currentColor);\n          --lumo-body-text-color: var(--simple-fields-color, currentColor);\n          --lumo-header-text-color: var(--simple-fields-color, currentColor);\n          --lumo-secondary-text-color: var(--simple-fields-color, currentColor);\n          --lumo-contrast-20pct: transparent;\n          --lumo-disabled-text-color: var(--simple-fields-border-color, #999);\n          --lumo-contrast-5pct: rgba(127, 127, 127, 0.2);\n          color: var(--simple-fields-color, currentColor);\n          background-color: var(--simple-fields-background-color, transparent);\n        }\n        vaadin-upload[dragover] {\n          border-color: var(\n            --simple-fields-secondary-accent-color,\n            var(--simple-colors-default-theme-accent-3, #77e2ff)\n          );\n        }\n        vaadin-upload-file {\n          --disabled-text-color: #var(--simple-fields-border-color, #999);\n        }\n        :host(:last-of-type) {\n          margin-bottom: 0;\n        }\n        #description {\n          font-family: var(--simple-fields-detail-font-family, sans-serif);\n          font-size: var(--simple-fields-detail-font-size, 12px);\n          line-height: var(--simple-fields-detail-line-height, 22px);\n        }\n        fieldset {\n          padding: 0;\n          margin: var(--simple-fields-margin-small, 8px) 0\n            var(--simple-fields-margin, 16px);\n          border: 1px solid var(--simple-fields-border-color-light, #ccc);\n          border-radius: var(--simple-fields-border-radius, 2px);\n          transition: all 0.3s ease-in-out;\n        }\n        #label {\n          font-family: var(--simple-fields-font-family, sans-serif);\n          font-size: var(--simple-fields-font-size, 16px);\n          line-height: var(--simple-fields-line-height, 22px);\n        }\n        :host([error]) #label {\n          color: var(--simple-fields-error-color, #dd2c00);\n          transition: all 0.3s ease-in-out;\n        }\n        simple-toolbar {\n          width: 100%;\n          margin: var(--simple-fields-margin-small, 8px) 0;\n        }\n        #options {\n          margin: 0 auto;\n        }\n        #uploads {\n          clear: both;\n          padding: 0 var(--simple-fields-margin-small, 8px)\n            var(--simple-fields-margin, 16px);\n        }\n        vaadin-upload {\n          padding: 0;\n          margin: 0 calc(0px - var(--lumo-space-s)) 0 0;\n        }\n        simple-camera-snap {\n          --simple-camera-snap-button-container-bottom: 2px;\n          --simple-camera-snap-button-container-z-index: 5;\n          --simple-camera-snap-button-border-radius: 100%;\n          --simple-camera-snap-button-opacity: 0.7;\n        }\n      ",
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
  (function (_SimpleColors) {
    _inherits(SimpleFieldsUpload, _SimpleColors);

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
      _this.label = null;
      _this.noCamera = false;
      _this.options = []; // @todo leave this off until we can do more testing
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
          key: "render",
          value: function render() {
            var _this2 = this;

            return (0, _litElement.html)(
              _templateObject2(),
              !this.label,
              this.label,
              !this.options || !this.options.map
                ? ""
                : this.options.map(function (option) {
                    return !option[0]
                      ? ""
                      : (0, _litElement.html)(
                          _templateObject3(),
                          option[0].icon,
                          option[0].alt,
                          _this2.option == option[0].value ? "true" : "false",
                          function (e) {
                            return _this2.optionChanged(option[0].value, e);
                          },
                          option[0].value,
                          _this2.option == option[0].value
                            ? "option-icon-selected"
                            : "option-icon"
                        );
                  }),
              this.option !== "url",
              this.value || "",
              this.valueChanged,
              this.option !== "fileupload",
              this._fileAboutToUpload,
              this._fileUploadResponse,
              this.option !== "selfie",
              this.option !== "audio",
              !this.description,
              this.description
            );
          },
        },
        {
          key: "optionChanged",
          value: function optionChanged(option, e) {
            this.option = option; // make sure there's not null here, possible when dynamically  built

            if (!option) {
              if (
                this.options &&
                this.options[0] &&
                this.options[0][0] &&
                this.options[0][0].value
              ) {
                this.option = this.options[0][0].value;
              }
            }

            if (option === "selfie") this._takeSelfie(e);
            if (option === "audio") this._voiceRecorder(e);
          },
        },
        {
          key: "valueChanged",
          value: function valueChanged(e) {
            this.value = e.detail.value;
          },
          /**
           * LitElement life cycle - properties changed callback
           */
        },
        {
          key: "updated",
          value: function updated(changedProperties) {
            var _this3 = this;

            if (
              _get(
                _getPrototypeOf(SimpleFieldsUpload.prototype),
                "updated",
                this
              )
            ) {
              _get(
                _getPrototypeOf(SimpleFieldsUpload.prototype),
                "updated",
                this
              ).call(this, changedProperties);
            }

            changedProperties.forEach(function (oldValue, propName) {
              // notify
              if (propName == "value") {
                _this3.dispatchEvent(
                  new CustomEvent("value-changed", {
                    detail: {
                      value: _this3[propName],
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
           * Set the input options as far as url, upload, or webcam input
           */
        },
        {
          key: "_setInputOptions",
          value: function _setInputOptions() {
            // hide the button if this environment can't support it anyway
            var options = [
              [
                {
                  alt: "Upload",
                  icon: "icons:file-upload",
                  value: "fileupload",
                },
              ],
              [
                {
                  alt: "URL",
                  icon: "icons:link",
                  value: "url",
                },
              ],
            ];

            if (!navigator.mediaDevices || this.noCamera) {
              this.shadowRoot.querySelector("#camerahole").style.display =
                "none";
            } else {
              options.push([
                {
                  alt: "Camera",
                  icon: "image:photo-camera",
                  value: "selfie",
                },
              ]);
            }

            if (!navigator.mediaDevices || this.noVoiceRecord) {
              this.shadowRoot.querySelector("#voicerecorder").style.display =
                "none";
            } else {
              /*options.push([
          {
            alt: "Audio",
            icon: "hardware:keyboard-voice",
            value: "audio"
          }
        ]);*/
            }

            return options;
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

            this.options = _toConsumableArray(this._setInputOptions()); // default to URL if we have a value of any kind

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
      ],
      [
        {
          key: "properties",
          get: function get() {
            return {
              label: {
                type: String,
              },
              description: {
                type: String,
              },
              value: {
                type: String,
              },
              option: {
                type: String,
              },
              options: {
                type: Array,
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
            };
          },
        },
      ]
    );

    return SimpleFieldsUpload;
  })(_simpleColors.SimpleColors);

exports.SimpleFieldsUpload = SimpleFieldsUpload;
window.customElements.define(SimpleFieldsUpload.tag, SimpleFieldsUpload);
