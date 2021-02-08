"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.RichTextEditorImage = void 0;

var _litElement = require("lit-element/lit-element.js");

var _richTextEditorPromptButton = require("./rich-text-editor-prompt-button.js");

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

/**
 * `rich-text-editor-image`
 * an inline image button for rich text editor
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @extends RichTextEditorPromptButtonBehaviors
 * @extends LitElement
 * @element rich-text-editor-image
 * @demo ./demo/buttons.html
 */
var RichTextEditorImage =
  /*#__PURE__*/
  (function (_RichTextEditorPrompt) {
    _inherits(RichTextEditorImage, _RichTextEditorPrompt);

    _createClass(
      RichTextEditorImage,
      [
        {
          key: "render",
          // render function for template
          value: function render() {
            return _get(
              _getPrototypeOf(RichTextEditorImage.prototype),
              "render",
              this
            ).call(this);
          }, // properties available to the custom element for data binding
        },
      ],
      [
        {
          key: "tag",

          /**
           * Store the tag name to make it easier to obtain directly.
           */
          get: function get() {
            return "rich-text-editor-image";
          },
        },
        {
          key: "properties",
          get: function get() {
            return _objectSpread(
              {},
              _get(_getPrototypeOf(RichTextEditorImage), "properties", this)
            );
          },
        },
      ]
    );

    function RichTextEditorImage() {
      var _this;

      _classCallCheck(this, RichTextEditorImage);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(RichTextEditorImage).call(this)
      );
      _this.fields = [
        {
          property: "src",
          title: "Image URL",
          description: "The image URL. (Leave blank to remove.)",
          inputMethod: "textfield",
        },
        {
          property: "alt",
          title: "Alt Text",
          inputMethod: "textfield",
        },
        {
          property: "width",
          title: "Width",
          inputMethod: "textfield",
          inline: true,
        },
        {
          property: "height",
          title: "Height",
          inputMethod: "textfield",
          inline: true,
        },
      ];
      _this.command = "insertHTML";
      _this.label = "Insert Inline Image";
      _this.icon = "editor:insert-photo";
      _this.tagsList = "img";
      _this.value = {};
      return _this;
    }
    /**
     * overrides RichTextEditorPromptButtonBehaviors
     * so that isToggled is based on toggled property
     *
     * @readonly
     * @memberof RichTextEditorImage
     */

    _createClass(RichTextEditorImage, [
      {
        key: "getValue",

        /**
         * overrides RichTextEditorPromptButtonBehaviors
         * to customize for getting selected image properties
         *
         * @param {object} node selected node
         * @memberof RichTextEditorImage
         */
        value: function getValue(node) {
          var img = node || this.rangeQuery();
          return !img
            ? undefined
            : {
                alt: !img ? undefined : img.getAttribute("alt"),
                src: !img ? undefined : img.getAttribute("src"),
                width: !img ? undefined : img.getAttribute("width"),
                height: !img ? undefined : img.getAttribute("height"),
              };
        },
        /**
         * overrides RichTextEditorPickerBehaviors
         * sets toggle based on whether an image is selected
         *
         * @memberof RichTextEditorLink
         */
      },
      {
        key: "setToggled",
        value: function setToggled() {
          this.toggled = !!this.value;
        },
      },
      {
        key: "isToggled",
        get: function get() {
          return this.toggled;
        },
        /**
         * overrides RichTextEditorPromptButtonBehaviors
         * to customize for setting image properties
         *
         * @param {object} node selected node
         * @memberof RichTextEditorImage
         */
      },
      {
        key: "promptCommandVal",
        get: function get() {
          var alt = this.getPropValue("alt"),
            src = this.getPropValue("src"),
            width = this.getPropValue("width"),
            height = this.getPropValue("height");
          return !src
            ? ""
            : '<img src="'
                .concat(src, '"')
                .concat(!alt ? "" : ' alt="'.concat(alt, '"'))
                .concat(!width ? "" : ' width="'.concat(width, '"'))
                .concat(!height ? "" : ' width="'.concat(height, '"'), ">");
        },
      },
    ]);

    return RichTextEditorImage;
  })(
    (0, _richTextEditorPromptButton.RichTextEditorPromptButtonBehaviors)(
      _litElement.LitElement
    )
  );

exports.RichTextEditorImage = RichTextEditorImage;
window.customElements.define(RichTextEditorImage.tag, RichTextEditorImage);
