define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.ImageCompareSlider = void 0;
  function _templateObject_3cf0bdc0d6f211e8a3bbfd02edc05d84() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_3cf0bdc0d6f211e8a3bbfd02edc05d84 = function() {
      return data;
    };
    return data;
  }
  var ImageCompareSlider = (function(_PolymerElement) {
    babelHelpers.inherits(ImageCompareSlider, _PolymerElement);
    function ImageCompareSlider() {
      babelHelpers.classCallCheck(this, ImageCompareSlider);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          ImageCompareSlider.__proto__ ||
          Object.getPrototypeOf(ImageCompareSlider)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      ImageCompareSlider,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                ImageCompareSlider.prototype.__proto__ ||
                  Object.getPrototypeOf(ImageCompareSlider.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              ImageCompareSlider.haxProperties,
              ImageCompareSlider.tag,
              this
            );
          }
        }
      ],
      [
        {
          key: "template",
          get: function get() {
            return (0, _polymerElement.html)(
              _templateObject_3cf0bdc0d6f211e8a3bbfd02edc05d84()
            );
          }
        },
        {
          key: "haxProperties",
          get: function get() {
            return {
              canScale: !0,
              canPosition: !0,
              canEditSource: !1,
              gizmo: {
                title: "Image compare-slider",
                description: "Automated conversion of image-compare-slider/",
                icon: "icons:android",
                color: "green",
                groups: ["Compare"],
                handles: [{ type: "todo:read-the-docs-for-usage" }],
                meta: {
                  author: "btopro",
                  owner: "The Pennsylvania State University"
                }
              },
              settings: { quick: [], configure: [], advanced: [] }
            };
          }
        },
        {
          key: "properties",
          get: function get() {
            return {};
          }
        },
        {
          key: "tag",
          get: function get() {
            return "image-compare-slider";
          }
        }
      ]
    );
    return ImageCompareSlider;
  })(_polymerElement.PolymerElement);
  _exports.ImageCompareSlider = ImageCompareSlider;
  window.customElements.define(ImageCompareSlider.tag, ImageCompareSlider);
});
