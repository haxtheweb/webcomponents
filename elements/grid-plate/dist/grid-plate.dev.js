"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.GridPlate = void 0;

var _litElement = require("lit-element/lit-element.js");

require("@lrnwebcomponents/responsive-utility/responsive-utility.js");

var _utils = require("@lrnwebcomponents/utils/utils.js");

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

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '\n            <div\n              class="column ',
    '"\n              id="col',
    '"\n              data-label="column ',
    '"\n              data-layout-slotname="col-',
    '"\n              part="layout-container"\n              .style="',
    '"\n            >\n              <slot name="col-',
    '"></slot>\n            </div>\n          ',
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n      <div class="row">\n        ',
    "\n      </div>\n    ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n        :host {\n          display: block;\n          --hax-layout-container-outline-width: 1px;\n          --hax-layout-container-hover-outline-width: 1px;\n        }\n        :host .row {\n          width: 100%;\n          overflow-wrap: break-word;\n          display: flex;\n          flex-wrap: wrap;\n          justify-content: space-between;\n          align-items: stretch;\n          margin: var(--grid-plate-row-margin, 0px);\n          padding: var(--grid-plate-row-padding, 0px);\n        }\n        :host([disable-responsive]) .column {\n          overflow: hidden;\n        }\n        :host .column {\n          width: 100%;\n          flex: 0 0 auto;\n          min-height: 50px;\n        }\n        /* make sure that animation for nothing to 2 col doesn\'t jar layout */\n        :host([layout="1-1"]) #col1 {\n          width: 50%;\n        }\n        :host([layout="1-1-1"]) #col1 {\n          width: 33.33%;\n        }\n        :host([layout="1-1-1-1"]) #col1 {\n          width: 25%;\n        }\n        :host([layout="1-1-1-1-1"]) #col1 {\n          width: 20%;\n        }\n        :host([layout="1-1-1-1-1-1"]) #col1 {\n          width: 16.66%;\n        }\n        .column.not-shown {\n          min-height: unset;\n        }\n        :host .column ::slotted(*) {\n          margin: var(--grid-plate-item-margin, 15px);\n          padding: var(--grid-plate-item-padding, 15px);\n          max-width: calc(100% - 60px);\n          max-width: -webkit-fill-available;\n        }\n        :host([ready]) [data-layout-slotname] {\n          transition: var(\n            --hax-layout-container-transition,\n            0.5s width ease-in-out,\n            0.5s padding ease-in-out,\n            0.5s margin ease-in-out\n          );\n        }\n        :host([data-hax-ray]) [data-layout-slotname].not-shown {\n          display: block;\n          opacity: 0.4;\n          width: 0;\n        }\n        :host([data-hax-ray]) [data-layout-slotname].not-shown.has-nodes {\n          width: 100%;\n          transition: none;\n        }\n        :host([data-hax-ray]) .not-shown:hover {\n          opacity: 1;\n        }\n        :host([data-hax-ray]) .not-shown:hover::before {\n          content: "Hidden bylayout";\n          position: sticky;\n          display: inline-flex;\n          background-color: black;\n          color: white;\n          padding: 0px 8px;\n          font-size: 12px;\n          line-height: 16px;\n          margin: 12px 13px;\n          float: right;\n          width: 124px;\n        }\n        /** this implies hax editing state is available **/\n        :host([data-hax-ray]) ::slotted(*) {\n          outline: var(--hax-layout-slotted-outline-width, 0px)\n            var(--hax-layout-slotted-outline-style, solid)\n            var(\n              --hax-layout-slotted-outline-color,\n              var(--hax-layout-slotted-faded-color, #eeeeee)\n            );\n          outline-offset: var(--hax-layout-slotted-outline-offset, 0px);\n        }\n        :host([data-hax-ray]) ::slotted(*:hover) {\n          outline: var(--hax-layout-slotted-hover-outline-width, 0px)\n            var(--hax-layout-slotted-hover-outline-style, solid)\n            var(\n              --hax-layout-slotted-hover-outline-color,\n              var(--hax-layout-accent-color, #009dc7)\n            );\n        }\n        :host([data-hax-ray]) ::slotted(.hax-active) {\n          outline: var(--hax-layout-slotted-active-outline-width, 1px)\n            var(--hax-layout-slotted-active-outline-style, solid)\n            var(\n              --hax-layout-slotted-active-outline-color,\n              var(--hax-layout-slotted-faded-color, #eeeeee)\n            );\n        }\n        :host([data-hax-ray]) [data-layout-slotname] {\n          outline: var(--hax-layout-container-outline-width, 0px)\n            var(--hax-layout-container-outline-style, solid)\n            var(\n              --hax-layout-container-outline-color,\n              var(--hax-layout-slotted-faded-color, #eeeeee)\n            );\n          outline-offset: var(--hax-layout-container-outline-offset, 2px);\n        }\n        :host([data-hax-ray]) [data-layout-slotname]:hover {\n          outline: var(--hax-layout-container-hover-outline-width, 0px)\n            var(--hax-layout-container-hover-outline-style, solid)\n            var(\n              --hax-layout-container-hover-outline-color,\n              var(--hax-layout-slotted-faded-color, #eeeeee)\n            );\n        }\n        :host([data-hax-ray]) ::slotted(*.active):before {\n          outline: var(--hax-layout-slotted-active-outline-width, 1px)\n            var(--hax-layout-slotted-active-outline-style, solid)\n            var(\n              --hax-layout-slotted-active-outline-color,\n              var(--hax-layout-slotted-faded-color, #eeeeee)\n            );\n          background-color: inherit;\n          content: " ";\n          width: 100%;\n          display: block;\n          position: relative;\n          margin: -10px 0 0 0;\n          z-index: 2;\n          height: 10px;\n        }\n        :host([data-hax-ray]) ::slotted(img.active),\n        :host([data-hax-ray]) ::slotted(*.active):before {\n          background-color: var(\n            --hax-layout-slotted-active-outline-color,\n            var(--hax-layout-accent-color, #009dc7)\n          ) !important;\n          outline: var(--hax-layout-slotted-active-outline-width, 1px)\n            var(--hax-layout-slotted-active-outline-style, solid)\n            var(\n              --hax-layout-slotted-active-outline-color,\n              var(--hax-layout-accent-color, #009dc7)\n            );\n        }\n\n        @media screen and (min-color-index: 0) and(-webkit-min-device-pixel-ratio:0) {\n          :host([data-hax-ray]) ::slotted(*.active) {\n            background-color: var(\n              --hax-layout-slotted-active-outline-color,\n              var(--hax-layout-accent-color, #009dc7)\n            ) !important;\n            outline: var(--hax-layout-slotted-active-outline-width, 1px)\n              var(--hax-layout-slotted-active-outline-style, solid)\n              var(\n                --hax-layout-slotted-active-outline-color,\n                var(--hax-layout-accent-color, #009dc7)\n              );\n          }\n        }\n      ',
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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

// need to make this an object so that HAX can listen for it correctly
var GridPlateLayoutOptions = function GridPlateLayoutOptions() {
  _classCallCheck(this, GridPlateLayoutOptions);

  this.resizeTimer = null;
  this.layouts = {
    1: {
      columnLayout: "1: full width",
      xs: ["100%"],
      sm: ["100%"],
      md: ["100%"],
      lg: ["100%"],
      xl: ["100%"],
    },
    "1-1": {
      columnLayout: "2: equal width",
      xs: ["100%", "100%"],
      sm: ["50%", "50%"],
      md: ["50%", "50%"],
      lg: ["50%", "50%"],
      xl: ["50%", "50%"],
    },
    "2-1": {
      columnLayout: "2: wide & narrow",
      xs: ["100%", "100%"],
      sm: ["50%", "50%"],
      md: ["66.6666667%", "33.3333337%"],
      lg: ["66.6666667%", "33.3333337%"],
      xl: ["66.6666667%", "33.3333337%"],
    },
    "1-2": {
      columnLayout: "2: narrow & wide",
      xs: ["100%", "100%"],
      sm: ["50%", "50%"],
      md: ["33.3333333%", "66.6666667%"],
      lg: ["33.3333333%", "66.6666667%"],
      xl: ["33.3333333%", "66.6666667%"],
    },
    "3-1": {
      columnLayout: "2: wider & narrower",
      xs: ["100%", "100%"],
      sm: ["50%", "50%"],
      md: ["75%", "25%"],
      lg: ["75%", "25%"],
      xl: ["75%", "25%"],
    },
    "1-3": {
      columnLayout: "2: narrower & wider",
      xs: ["100%", "100%"],
      sm: ["50%", "50%"],
      md: ["25%", "75%"],
      lg: ["25%", "75%"],
      xl: ["25%", "75%"],
    },
    "1-1-1": {
      columnLayout: "3: equal width",
      xs: ["100%", "100%", "100%"],
      sm: ["100%", "100%", "100%"],
      md: ["33.3333333%", "33.3333333%", "33.3333333%"],
      lg: ["33.3333333%", "33.3333333%", "33.3333333%"],
      xl: ["33.3333333%", "33.3333333%", "33.3333333%"],
    },
    "2-1-1": {
      columnLayout: "3: wide, narrow, and narrow",
      xs: ["100%", "100%", "100%"],
      sm: ["100%", "50%", "50%"],
      md: ["50%", "25%", "25%"],
      lg: ["50%", "25%", "25%"],
      xl: ["50%", "25%", "25%"],
    },
    "1-2-1": {
      columnLayout: "3: narrow, wide, and narrow",
      xs: ["100%", "100%", "100%"],
      sm: ["100%", "100%", "100%"],
      md: ["25%", "50%", "25%"],
      lg: ["25%", "50%", "25%"],
      xl: ["25%", "50%", "25%"],
    },
    "1-1-2": {
      columnLayout: "3: narrow, narrow, and wide",
      xs: ["100%", "100%", "100%"],
      sm: ["50%", "50%", "100%"],
      md: ["25%", "25%", "50%"],
      lg: ["25%", "25%", "50%"],
      xl: ["25%", "25%", "50%"],
    },
    "1-1-1-1": {
      columnLayout: "4: equal width",
      xs: ["100%", "100%", "100%", "100%"],
      sm: ["50%", "50%", "50%", "50%"],
      md: ["25%", "25%", "25%", "25%"],
      lg: ["25%", "25%", "25%", "25%"],
      xl: ["25%", "25%", "25%", "25%"],
    },
    "1-1-1-1-1": {
      columnLayout: "5: equal width",
      xs: ["100%", "100%", "100%", "100%", "100%"],
      sm: ["50%", "50%", "50%", "50%", "50%"],
      md: ["20%", "20%", "20%", "20%", "20%"],
      lg: ["20%", "20%", "20%", "20%", "20%"],
      xl: ["20%", "20%", "20%", "20%", "20%"],
    },
    "1-1-1-1-1-1": {
      columnLayout: "6: equal width",
      xs: ["100%", "100%", "100%", "100%", "100%", "100%"],
      sm: ["50%", "50%", "50%", "50%", "50%", "50%"],
      md: [
        "33.3333333%",
        "33.3333333%",
        "33.3333333%",
        "33.3333333%",
        "33.3333333%",
        "33.3333333%",
      ],
      lg: [
        "16.6666667%",
        "16.6666667%",
        "16.6666667%",
        "16.6666667%",
        "16.6666667%",
        "16.6666667%",
      ],
      xl: [
        "16.6666667%",
        "16.6666667%",
        "16.6666667%",
        "16.6666667%",
        "16.6666667%",
        "16.6666667%",
      ],
    },
  };
  this.options = {};
  var layoutFlip = Object.keys(this.layouts); // loop through all the supplied layouts to get the HAX layout options & descriptions

  for (var i = 1; i < layoutFlip.length; i++) {
    this.options[layoutFlip[i]] = this.layouts[layoutFlip[i]].columnLayout;
  }
};
/**
 * `grid-plate`
 * `A grid plate based on a layout that manipulates it.`
 * @demo demo/index.html
 * @element grid-plate
 */

var GridPlate =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(GridPlate, _LitElement);

    _createClass(GridPlate, null, [
      {
        key: "styles",

        /**
         * LitElement render styles
         */
        get: function get() {
          return [(0, _litElement.css)(_templateObject())];
        },
      },
    ]);

    function GridPlate() {
      var _this;

      _classCallCheck(this, GridPlate);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(GridPlate).call(this)
      );
      _this.ready = false;
      _this.breakpointSm = 900;
      _this.breakpointMd = 1200;
      _this.breakpointLg = 1500;
      _this.breakpointXl = 1800;
      _this.columns = 6;
      _this.disableResponsive = false;
      _this.layout = "1-1";
      _this.layouts = new GridPlateLayoutOptions().layouts;
      _this.responsiveSize = "xs";
      window.ResponsiveUtility.requestAvailability();
      return _this;
    }
    /**
     * LitElement render
     */

    _createClass(
      GridPlate,
      [
        {
          key: "render",
          value: function render() {
            var _this2 = this;

            return (0, _litElement.html)(
              _templateObject2(),
              [1, 2, 3, 4, 5, 6].map(function (num) {
                return (0,
                _litElement.html)(_templateObject3(), _this2.columns < num ? "not-shown" : "drag-enabled", num, num, num, _this2._getColumnWidth(num - 1, _this2.__columnWidths), num);
              })
            );
          },
        },
        {
          key: "firstUpdated",

          /**
           * life cycle
           */
          value: function firstUpdated(changedProperties) {
            var _this3 = this;

            if (
              _get(_getPrototypeOf(GridPlate.prototype), "firstUpdated", this)
            )
              _get(
                _getPrototypeOf(GridPlate.prototype),
                "firstUpdated",
                this
              ).call(this, changedProperties);
            setTimeout(function () {
              _this3.ready = true;
            }, 100);
            this.resize();
            window.dispatchEvent(
              new CustomEvent("responsive-element", {
                detail: {
                  element: this,
                  attribute: "responsive-size",
                  relativeToParent: false,
                  sm: this.breakpointSm,
                  md: this.breakpointMd,
                  lg: this.breakpointLg,
                  xl: this.breakpointXl,
                },
              })
            );
            this.__columnWidths = this._getColumnWidths(
              this.responsiveSize,
              this.layout,
              this.layouts,
              this.disableResponsive
            );
          },
          /**
           * Wire to HAX
           */
        },
        {
          key: "updated",
          value: function updated(changedProperties) {
            var _this4 = this;

            if (_get(_getPrototypeOf(GridPlate.prototype), "updated", this))
              _get(_getPrototypeOf(GridPlate.prototype), "updated", this).call(
                this,
                changedProperties
              );
            changedProperties.forEach(function (oldValue, propName) {
              // if any of these changed, update col widths
              if (
                [
                  "responsiveSize",
                  "layout",
                  "layouts",
                  "disableResponsive",
                ].includes(propName)
              ) {
                clearTimeout(_this4.__calcWidthLock);
                _this4.__calcWidthLock = setTimeout(function () {
                  _this4.__columnWidths = _this4._getColumnWidths(
                    _this4.responsiveSize,
                    _this4.layout,
                    _this4.layouts,
                    _this4.disableResponsive
                  );
                }, 0);
              }

              switch (propName) {
                // observer, ensure we are sized correctly after widths change
                case "__columnWidths":
                  // widths changed because of layout somehow, wait for the resize transition
                  // to have processed, then fire a resize event which we are listening
                  _this4.resize();

                  break;

                case "disableResponsive":
                  // fire an event that this is a core piece of the system
                  _this4.dispatchEvent(
                    new CustomEvent("disable-responsive-changed", {
                      detail: _this4[propName],
                    })
                  );

                  break;
              }
            });
          },
        },
        {
          key: "resize",
          value: function resize() {
            window.dispatchEvent(new Event("resize"));
          },
          /**
           * gets the column widths based on selected layout and current responsive width
           *
           * @param {string} a string that describes the current responsive width
           * @param {string} the name of selected layout
           * @param {object} predefined layouts of column sizes and various responsive widths
           * @param {boolean} disable responsive sizing?
           * @returns {object} an object with a layout's column sizes at the current responsive width
           */
        },
        {
          key: "_getColumnWidths",
          value: function _getColumnWidths() {
            var responsiveSize =
              arguments.length > 0 && arguments[0] !== undefined
                ? arguments[0]
                : "sm";
            var layout =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : "1-1";
            var layouts = arguments.length > 2 ? arguments[2] : undefined;
            var disableResponsive =
              arguments.length > 3 ? arguments[3] : undefined;

            if (layouts) {
              var newl = layouts[layout],
                //how old layout names map to the new ones
                oldLayouts = {
                  12: "1",
                  "8/4": "2-1",
                  "6/6": "1-1",
                  "4/8": "1-2",
                  "4/4/4": "1-1-1",
                  "3/3/3/3": "1-1-1-1",
                },
                size = disableResponsive !== false ? "xl" : responsiveSize;
              var oldl = oldLayouts[layout];

              if (newl !== undefined && newl[size] !== undefined) {
                //return the layout
                return layouts[layout][size];
              } else if (
                layouts[oldl] !== undefined &&
                layouts[oldl][size] !== undefined
              ) {
                //return new layout that maps to old one
                return layouts[oldl][size];
              } else if (
                _typeof(layouts["1-1"]) !==
                (typeof undefined === "undefined"
                  ? "undefined"
                  : _typeof(undefined))
              ) {
                //return 2-column layout
                return layouts["1-1"][size];
              }
            }
          },
          /**
           * gets a given column's current width based on layout and current responsive width
           *
           * @param {number} the index of the column
           * @param {object} an object with a layout's column sizes at the current responsive width
           * @returns {string} a given column's current width based on layout and current responsive width
           */
        },
        {
          key: "_getColumnWidth",
          value: function _getColumnWidth(column, __columnWidths) {
            return __columnWidths !== undefined &&
              __columnWidths[column] !== undefined
              ? "width:" + __columnWidths[column]
              : "min-height: unset";
          },
          /**
           * gets a given column's current width based on layout and current responsive width
           *
           * @param {string} the name of selected layout
           * @returns {number} the number of columns in this layout
           */
        },
        {
          key: "_getColumns",
          value: function _getColumns(__columnWidths) {
            return __columnWidths.length;
          },
        },
        {
          key: "haxactiveElementChanged",
          value: function haxactiveElementChanged(el, val) {},
        },
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "grid-plate";
          },
        },
        {
          key: "haxProperties",
          get: function get() {
            return {
              type: "grid",
              canScale: true,
              canPosition: true,
              canEditSource: true,
              contentEditable: undefined,
              gizmo: {
                title: "Grid layout",
                description: "Simple card in a cool retro design",
                icon: "hax:3-3-3-3",
                color: "grey",
                groups: ["Layout"],
                handles: [],
                meta: {
                  author: "ELMS:LN",
                  owner: "The Pennsylvania State University",
                },
              },
              settings: {
                configure: [
                  {
                    property: "layout",
                    title: "Column Layout",
                    description:
                      "Style to present these items (may change for small screens)",
                    inputMethod: "select",
                    options: new GridPlateLayoutOptions().options,
                  },
                  {
                    property: "disableResponsive",
                    title: "Disable responsive",
                    description:
                      "Check box to force layout to stick regardless of screen breakpoins",
                    inputMethod: "boolean",
                  },
                ],
                advanced: [
                  {
                    property: "breakpointSm",
                    title: "Small Breakpoint",
                    description:
                      "Anything less than this number (in pixels) will render with the smallest version of this layout",
                    inputMethod: "textfield",
                    validationType: "number",
                  },
                  {
                    property: "breakpointMd",
                    title: "Medium Breakpoint",
                    description:
                      "Anything less than this number (in pixels) will render with the small version of this layout",
                    inputMethod: "textfield",
                    validationType: "number",
                  },
                  {
                    property: "breakpointLg",
                    title: "Large Breakpoint",
                    description:
                      "Anything less than this number (in pixels) will render with the medium version of this layout.",
                    inputMethod: "textfield",
                    validationType: "number",
                  },
                  {
                    property: "breakpointXl",
                    title: "Extra-Large Breakpoint",
                    description:
                      "Anything less than this number (in pixels) will render with the large version of this layout. Anything greater than or equal to this number will display with the maximum number of columns for this layout.",
                    inputMethod: "textfield",
                    validationType: "number",
                  },
                ],
              },
              saveOptions: {
                unsetAttributes: [
                  "ready",
                  "layouts",
                  "columns",
                  "options",
                  "responsive-width",
                ],
              },
            };
          },
        },
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * Custom small breakpoint for the layouts; only updated on attached
               */
              breakpointSm: {
                type: Number,
                attribute: "breakpoint-sm",
              },

              /**
               * Custom medium breakpoint for the layouts; only updated on attached
               */
              breakpointMd: {
                type: Number,
                attribute: "breakpoint-md",
              },

              /**
               * Custom large breakpoint for the layouts; only updated on attached
               */
              breakpointLg: {
                type: Number,
                attribute: "breakpoint-lg",
              },

              /**
               * Custom extra-large breakpoint for the layouts; only updated on attached
               */
              breakpointXl: {
                type: Number,
                attribute: "breakpoint-xl",
              },

              /**
               * number of columns at this layout / responsive size
               */
              columns: {
                type: Number,
                reflect: true,
              },

              /**
               * disables responsive layouts
               */
              disableResponsive: {
                type: Boolean,
                attribute: "disable-responsive",
              },

              /**
               * an object with a layout's column sizes
               * at the current responsive width
               */
              layout: {
                type: String,
                reflect: true,
              },

              /**
         * Predefined layouts of column sizes and various responsive widths. 
         * For example:```
        {
        "1-1-1-1": {                         //the name of the layout
        "xs": ["100%","100%","100%","100%] //the responsive width of each column when the grid is extra small
        "sm": ["50%","50%","50%","50%"]    //the responsive width of each column when the grid is small
        "md": ["50%","50%","50%","50%"]    //the responsive width of each column when the grid is medium
        "lg": ["25%","25%","25%","25%"]    //the responsive width of each column when the grid is large
        "xl": ["25%","25%","25%","25%"]    //the responsive width of each column when the grid is extra large
        },
        {...}
        }```
        */
              layouts: {
                type: Object,
              },
              ready: {
                type: Boolean,
                reflect: true,
              },

              /**
               * Responsive size as `xs`, `sm`, `md`, `lg`, or `xl`
               */
              responsiveSize: {
                type: String,
                reflect: true,
                attribute: "responsive-size",
              },

              /**
               * name of selected layout
               */
              __columnWidths: {
                type: String,
              },
            };
          },
        },
      ]
    );

    return GridPlate;
  })(_litElement.LitElement);

exports.GridPlate = GridPlate;
window.customElements.define(GridPlate.tag, GridPlate);
