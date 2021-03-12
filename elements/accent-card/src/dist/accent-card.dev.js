"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.AccentCard = void 0;

var _litElement = require("lit-element/lit-element.js");

var _simpleColors = require("@lrnwebcomponents/simple-colors/simple-colors.js");

var _IntersectionObserverMixin = require("@lrnwebcomponents/intersection-element/lib/IntersectionObserverMixin.js");

var _HAXLayouts = require("@lrnwebcomponents/hax-body-behaviors/lib/HAXLayouts.js");

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

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n        :host {\n          display: block;\n          border-radius: 2px;\n          margin: 0 0 15px;\n          box-shadow: var(\n            --accent-card-box-shadow,\n            0 2px 2px 0 rgba(0, 0, 0, 0.14),\n            0 1px 5px 0 rgba(0, 0, 0, 0.12),\n            0 3px 1px -2px rgba(0, 0, 0, 0.2)\n          );\n          color: var(\n            --accent-card-color,\n            var(--simple-colors-default-theme-grey-9, #222)\n          );\n          background-color: var(\n            --accent-card-background-color,\n            var(--simple-colors-default-theme-grey-1, #fff)\n          );\n        }\n        :host([dark]) {\n          color: var(\n            --accent-card-color,\n            var(--simple-colors-default-theme-grey-12, #fff)\n          );\n        }\n        :host([accent-background]) {\n          background-color: var(\n            --accent-card-background-color,\n            var(--simple-colors-default-theme-accent-1, #fff)\n          );\n        }\n        article {\n          position: relative;\n          width: 100%;\n          box-sizing: border-box;\n        }\n        article,\n        .body {\n          display: flex;\n          flex: 1 1 auto;\n          flex-direction: column;\n        }\n        :host([horizontal]) article {\n          display: flex;\n          justify-content: space-between;\n          align-items: stretch;\n          flex-direction: row;\n        }\n        :host([flat]) {\n          box-shadow: none;\n        }\n        :host([flat]:not([accent-background])) {\n          border-width: 1px;\n          border-style: solid;\n          border-color: var(--accent-card-footer-border-color);\n        }\n        :host([dark][flat]:not([accent-background])) {\n          border-color: var(\n            --accent-card-footer-border-color,\n            var(--simple-colors-default-theme-grey-6, #666)\n          );\n        }\n        :host(:not([horizontal]):not([no-border])) article {\n          border-top-width: 4px;\n          border-top-style: solid;\n          border-top-color: var(\n            --accent-card-border-color,\n            var(--simple-colors-default-theme-accent-6, #ddd)\n          );\n        }\n        :host([horizontal]:not([no-border])) article {\n          border-left-width: 4px;\n          border-left-style: solid;\n          border-left-color: var(\n            --accent-card-border-color,\n            var(--simple-colors-default-theme-accent-6, #ddd)\n          );\n        }\n        :host([dark]:not([horizontal]):not([no-border])) article {\n          border-top-color: var(\n            --accent-card-border-color,\n            var(--simple-colors-default-theme-accent-7, #fff)\n          );\n        }\n        :host([dark][horizontal]:not([no-border])) article {\n          border-left-color: var(\n            --accent-card-border-color,\n            var(--simple-colors-default-theme-accent-7, #fff)\n          );\n        }\n        .image-outer {\n          box-sizing: border-box;\n          position: relative;\n          overflow: visible;\n        }\n        :host([horizontal]) .image-outer {\n          height: auto;\n          width: var(--accent-card-image-width, 30%);\n          flex: 0 0 auto;\n        }\n        :host(:not([horizontal])) .image-outer {\n          height: auto;\n          width: 100%;\n          min-height: var(--accent-card-heading-min-height);\n        }\n        .image {\n          height: 100%;\n          width: 100%;\n          background-size: cover;\n          background-position-x: var(--accent-card-image-x, center);\n          background-position-y: var(--accent-card-image-y, center);\n        }\n        :host([image-align="left"]) .image {\n          background-position-x: left;\n        }\n        :host([image-align="center"]) .image {\n          background-position-x: center;\n        }\n        :host([image-align="right"]) .image {\n          background-position-x: right;\n        }\n        :host([image-valign="top"]) .image {\n          background-position-y: top;\n        }\n        :host([image-valign="center"]) .image {\n          background-position-y: center;\n        }\n        :host([image-valign="bottom"]) .image {\n          background-position-y: bottom;\n        }\n        :host(:not([horizontal])) .image {\n          height: 0;\n          padding-top: var(--accent-card-image-height, 10%);\n        }\n        #imagecorner {\n          position: absolute;\n          bottom: 0;\n          left: 0;\n          right: 0;\n          padding-top: var(--accent-card-image-padding-top, 0);\n          padding-bottom: var(\n            --accent-card-image-padding-bottom,\n            var(--accent-card-padding, 20px)\n          );\n          padding-left: var(\n            --accent-card-image-padding-left,\n            var(--accent-card-padding, 20px)\n          );\n          padding-right: var(\n            --accent-card-image-padding-right,\n            var(--accent-card-padding, 20px)\n          );\n        }\n        ::slotted([slot="image-corner"]) {\n          text-align: right;\n          color: var(\n            --accent-card-background-color,\n            var(--simple-colors-default-theme-grey-1, #fff)\n          );\n        }\n        .body {\n          flex-grow: 1;\n          overflow: visible;\n        }\n        #heading {\n          flex: 0 0 auto;\n          display: flex;\n          justify-content: space-between;\n          align-items: var(--accent-card-heading-align, unset);\n          padding-left: var(\n            --accent-card-heading-padding-left,\n            var(--accent-card-padding, 20px)\n          );\n          padding-right: var(\n            --accent-card-heading-padding-right,\n            var(--accent-card-padding, 20px)\n          );\n          padding-bottom: var(--accent-card-heading-padding-bottom, 0px);\n          margin: 0;\n        }\n        :host > #card #heading ::slotted(*[slot="heading"]) {\n          padding-top: var(\n            --accent-card-heading-padding-top,\n            var(--accent-card-padding, 20px)\n          );\n          font-size: 26px;\n          font-weight:bold;\n        }\n        #heading h1 {\n          margin: 0;\n          flex: 1 1 auto;\n        }\n        #heading div {\n          flex: 0 0 auto;\n        }\n        :host([accent-heading][accent-color]) #heading ::slotted(*) {\n          color: var(\n            --accent-card-heading-color,\n            var(--simple-colors-default-theme-accent-7, #000) !important\n          );\n        }\n        #subheading {\n          flex: 0 0 auto;\n          font-size: 90%;\n          font-style: italic;\n          padding-top: var(--accent-card-subheading-padding-top, unset);\n          padding-left: var(\n            --accent-card-subheading-padding-left,\n            var(--accent-card-padding, 20px)\n          );\n          padding-right: var(\n            --accent-card-subheading-padding-right,\n            var(--accent-card-padding, 20px)\n          );\n          padding-bottom: var(--accent-card-subheading-padding-bottom, unset);\n        }\n        #content {\n          font-size: 100%;\n          padding-top: var(\n            --accent-card-content-padding-top,\n            var(--accent-card-padding, 20px)\n          );\n          padding-left: var(\n            --accent-card-content-padding-left,\n            var(--accent-card-padding, 20px)\n          );\n          padding-right: var(\n            --accent-card-content-padding-right,\n            var(--accent-card-padding, 20px)\n          );\n          padding-bottom: var(\n            --accent-card-content-padding-bottom,\n            var(--accent-card-padding, 20px)\n          );\n          flex: 1 1 auto;\n        }\n        ::slotted(*[slot="content"]:last-ot-type) {\n          margin-bottom: 0;\n          margin-block-end: 0;\n        }\n        #footer {\n          flex: 0 0 auto;\n          border-top-width: 1px;\n          border-top-style: solid;\n          border-top-color: var(\n            --accent-card-footer-border-color,\n            var(--simple-colors-default-theme-grey-3, #ddd)\n          );\n          padding-top: var(--accent-card-footer-padding-top, unset);\n          padding-left: var(\n            --accent-card-footer-padding-left,\n            var(--accent-card-padding, 20px)\n          );\n          padding-right: var(\n            --accent-card-footer-padding-right,\n            var(--accent-card-padding, 20px)\n          );\n          padding-bottom: var(--accent-card-footer-padding-bottom, unset);\n        }\n        :host([dark]) #footer {\n          border-top-color: var(\n            --accent-card-footer-border-color,\n            var(--simple-colors-default-theme-grey-6, #666)\n          );\n        }\n      ',
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
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

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n      <article id="card">\n        <div\n          class="image-outer"\n          ?hidden="',
    '"\n        >\n          <div\n            class="image"\n            .style="',
    '"\n          ></div>\n          <div id="imagecorner"><slot name="image-corner"></slot></div>\n        </div>\n        <div class="body">\n          <div id="heading">\n            <div \n              data-label="Heading"\n              data-layout-order="1"\n              data-layout-slotname="heading">\n              <slot name="heading"></slot>\n            </div>\n            <div\n              data-label="Corner"\n              data-layout-order="2"\n              data-layout-slotname="Corner">\n              <slot name="corner"></slot>\n            </div>\n          </div>\n          <div id="subheading"\n            data-label="Subheading"\n            data-layout-order="3"\n            data-layout-slotname="subheading">\n            <slot name="subheading"></slot>\n          </div>\n          <div id="content"\n            data-label="Content"\n            data-layout-order="4"\n            data-layout-slotname="content">\n            <slot name="content"></slot>\n          </div>\n          <div id="footer"\n            data-label="Footer"\n            data-layout-order="5"\n            data-layout-slotname="footer">\n            <slot name="footer"></slot>\n          </div>\n        </div>\n      </article>\n    ',
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
 * `accent-card`
 * @element accent-card
 * a card with optional accent stylings.
 * 
### Styling

`<accent-card>` provides following custom properties and mixins
for styling:

#### Defaults
Custom property | Description | Default
----------------|-------------|----------
`--accent-card-image-width` | Width of image when card is horizontal. | 30%
`--accent-card-image-height` | Height of image when card is vertical. | 10%
`--accent-card-padding` | Sets padding inside accent card. | 20px
`--accent-card-footer-border-color` | Card footer's border color.* | `--simple-colors-default-theme-grey-3`
`--accent-card-box-shadow` | Card footer's box-shadow. | 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)
`--accent-card-heading-align` | Corner and heading align-items | unset

#### Overriding Default Padding
Custom property | Description | Default
----------------|-------------|----------
`--accent-card-image-padding-top` | Overrides top padding of image. | 0
`--accent-card-image-padding-left` | Overrides left padding of image. | `--accent-card-padding`
`--accent-card-image-padding-right` | Overrides right padding of image. | `--accent-card-padding`
`--accent-card-image-padding-bottom` | Overrides bottom padding of image. | `--accent-card-padding`
`--accent-card-heading-padding-top` | Overrides top padding of heading. | `--accent-card-padding`
`--accent-card-heading-padding-left` | Overrides left padding of heading. | `--accent-card-padding`
`--accent-card-heading-padding-right` | Overrides right padding of heading. | `--accent-card-padding`
`--accent-card-heading-padding-bottom` | Overrides bottom padding of heading. | 0
`--accent-card-subheading-padding-top` | Overrides top padding of subheading. | unset
`--accent-card-subheading-padding-left` | Overrides left padding of subheading. | `--accent-card-padding`
`--accent-card-subheading-padding-right` | Overrides right padding of subheading. | `--accent-card-padding`
`--accent-card-subheading-padding-bottom` | Overrides bottom padding of subheading. | unset
`--accent-card-content-padding-top` | Overrides top padding of content. | `--accent-card-padding`
`--accent-card-content-padding-left` | Overrides left padding of content. | `--accent-card-padding`
`--accent-card-content-padding-right` | Overrides right padding of content. | `--accent-card-padding`
`--accent-card-content-padding-bottom` | Overrides bottom padding of content. | --accent-card-padding`
`--accent-card-footer-padding-top` | Overrides top padding of footer. | unset
`--accent-card-footer-padding-left` | Overrides left padding of footer. | `--accent-card-padding`
`--accent-card-footer-padding-right` | Overrides right padding of footer. | `--accent-card-padding`
`--accent-card-footer-padding-bottom` | Overrides bottom padding of footer. | unset

#### Overriding Default Colors
Custom property | Description | Default
----------------|-------------|----------
`--accent-card-color`	| Card's text color.* | `--simple-colors-default-theme-grey-9`
`--accent-card-background-color` | Card's background color.* | varies based on attributes
`--accent-card-border-color` | Card's border color.* | varies based on attributes
`--accent-card-heading-color` | Card's heading color.* | varies based on attributes
 *
 * @extends SimpleColors

 * @demo ./demo/index.html demo
 * @demo ./demo/colors.html colors
 * @demo ./demo/orientation.html card orientation
 * @demo ./demo/borders.html borders and shadow
 * @demo ./demo/images.html image aligmnent
 * @demo ./demo/variables.html css variables
 */
var AccentCard =
  /*#__PURE__*/
  (function (_HaxLayoutBehaviors) {
    _inherits(AccentCard, _HaxLayoutBehaviors);

    _createClass(
      AccentCard,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              !this.elementVisible || !this.imageSrc,
              this.elementVisible && this.imageSrc
                ? "background-image: url(".concat(this.imageSrc, ");")
                : ""
            );
          }, // haxProperty definition
        },
      ],
      [
        {
          key: "tag",

          /**
           * Store tag name to make it easier to obtain directly.
           * @notice function name must be here for tooling to operate correctly
           */
          get: function get() {
            return "accent-card";
          }, // render function
        },
        {
          key: "styles",
          get: function get() {
            return [].concat(
              _toConsumableArray(
                _get(_getPrototypeOf(AccentCard), "styles", this)
              ),
              [(0, _litElement.css)(_templateObject2())]
            );
          },
        },
        {
          key: "haxProperties",
          get: function get() {
            return _objectSpread(
              {},
              _get(_getPrototypeOf(AccentCard), "haxProperties", this) || {},
              {
                canScale: true,
                canPosition: true,
                canEditSource: true,
                contentEditable: true,
                gizmo: {
                  title: "Accent Card",
                  description: "A card with optional accent styling.",
                  icon: "chrome-reader-mode",
                  color: "light-blue",
                  groups: ["Media", "Content", "Image", "Presentation"],
                  handles: [
                    {
                      type: "media",
                      url: "source",
                    },
                    {
                      type: "image",
                    },
                    {
                      type: "text",
                      url: "source",
                    },
                  ],
                  meta: {
                    author: "nikkimk",
                    owner: "The Pennsylvania State University",
                  },
                },
                settings: {
                  configure: [
                    {
                      slot: "heading",
                      title: "Heading",
                      description: "A heading for card.",
                      inputMethod: "textfield",
                      slotWrapper: "h1",
                    },
                    {
                      slot: "subheading",
                      title: "Subheading",
                      description: "An optional subheading for card.",
                      inputMethod: "textfield",
                      slotWrapper: "p",
                    },
                    {
                      slot: "content",
                      title: "Content",
                      description: "Content for card.",
                      inputMethod: "textfield",
                      slotWrapper: "p",
                    },
                    {
                      slot: "footer",
                      title: "Footer",
                      description: "An optional footer for card.",
                      inputMethod: "textfield",
                      slotWrapper: "p",
                    },
                    {
                      property: "imageSrc",
                      title: "Image",
                      description: "Optional image",
                      inputMethod: "haxupload",
                      icon: "editor:insert-photo",
                    },
                    {
                      property: "imageAlign",
                      title: "imageAlign",
                      description: "Image Horizontal Alignment",
                      inputMethod: "select",
                      options: {
                        left: "left",
                        center: "center",
                        right: "right",
                      },
                    },
                    {
                      property: "imageValign",
                      title: "imageValign",
                      description: "Image Vertical Alignment",
                      inputMethod: "select",
                      options: {
                        top: "top",
                        center: "center",
                        bottom: "bottom",
                      },
                    },
                    {
                      property: "accentColor",
                      title: "Accent Color",
                      description: "An optional accent color.",
                      inputMethod: "colorpicker",
                      icon: "editor:format-color-fill",
                    },
                    {
                      property: "dark",
                      title: "Dark Theme",
                      description: "Enable Dark Theme",
                      inputMethod: "boolean",
                      icon: "icons:invert-colors",
                    },
                    {
                      property: "horizontal",
                      title: "Horizontal",
                      description: "Horizontal orientation?",
                      inputMethod: "boolean",
                    },
                    {
                      property: "accentHeading",
                      title: "Heading Accent",
                      description: "Apply accent color to heading?",
                      inputMethod: "boolean",
                    },
                    {
                      property: "accentBackground",
                      title: "Background Accent",
                      description: "Apply accent color to card background?",
                      inputMethod: "boolean",
                    },
                    {
                      property: "noBorder",
                      title: "No Border Accent",
                      description: "Remove border accent?",
                      inputMethod: "boolean",
                    },
                    {
                      property: "flat",
                      title: "Flat",
                      description: "Remove box shadow?",
                      inputMethod: "boolean",
                    },
                  ],
                  advanced: [
                    {
                      slot: "corner",
                      title: "Corner",
                      description: "Content for card corner.",
                      inputMethod: "textfield",
                      slotWrapper: "div",
                    },
                  ],
                },
                demoSchema: [
                  {
                    tag: "accent-card",
                    properties: {
                      style: "maxWidth:600px;width:100%;",
                      accentColor: "cyan",
                      dark: true,
                      imageSrc: "http://placekitten.com/200/600",
                    },
                    content:
                      '<div slot="heading">Card Heading</div>\n<p slot="content">This is the body of the card.</p>',
                  },
                ],
                saveOptions: {
                  unsetAttributes: ["colors", "element-visible"],
                },
              }
            );
          },
        },
      ]
    );

    function AccentCard() {
      var _this;

      _classCallCheck(this, AccentCard);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(AccentCard).call(this)
      );
      _this.accentBackground = false;
      _this.accentHeading = false;
      _this.flat = false;
      _this.horizontal = false;
      _this.imageAlign = null;
      _this.imageSrc = null;
      _this.imageValign = null;
      _this.noBorder = false;
      return _this;
    } // properties available to custom element for data binding

    _createClass(AccentCard, null, [
      {
        key: "properties",
        get: function get() {
          return _objectSpread(
            {},
            _get(_getPrototypeOf(AccentCard), "properties", this),
            {
              /**
               * Apply accent color to card background
               */
              accentBackground: {
                type: Boolean,
                attribute: "accent-background",
                reflect: true,
              },

              /**
               * Apply accent color to heading
               */
              accentHeading: {
                type: Boolean,
                attribute: "accent-heading",
                reflect: true,
              },

              /**
               * Display card as flat (no box shadow);
               */
              flat: {
                type: Boolean,
                reflect: true,
              },

              /**
               * Display card as a horizontal layout? Default is vertical.
               */
              horizontal: {
                type: Boolean,
                reflect: true,
              },

              /**
               * "Optional": Horizontal alignment of image, so that:
               * - "left" will align left edge of image.
               * - "right" will align right edge of image.
               * - "center" will align center of image
               * - A null will allow temporary support to deprecated CSS variables
               */
              imageAlign: {
                type: String,
                attribute: "image-align",
                reflect: true,
              },

              /**
               * "Optional": source for an image on card
               */
              imageSrc: {
                type: String,
                attribute: "image-src",
              },

              /**
               * "Optional": vertical alignment of image, so that:
               * - "top" will align top of edge of image.
               * - "bottom" will align bottom edge of image.
               * - "center" will align middle of image.
               * - A null will allow temporary support to deprecated CSS variables
               */
              imageValign: {
                type: String,
                attribute: "image-valign",
                reflect: true,
              },

              /**
               * Removes think accent border
               */
              noBorder: {
                type: Boolean,
                attribute: "no-border",
                reflect: true,
              },
            }
          );
        },
      },
    ]);

    return AccentCard;
  })(
    (0, _HAXLayouts.HaxLayoutBehaviors)(
      (0, _IntersectionObserverMixin.IntersectionObserverMixin)(
        _simpleColors.SimpleColors
      )
    )
  );

exports.AccentCard = AccentCard;
window.customElements.define(AccentCard.tag, AccentCard);
