define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.MediaGallery = void 0;
  function _templateObject_382937b0d6ff11e88222ff1835be4615() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_382937b0d6ff11e88222ff1835be4615 = function() {
      return data;
    };
    return data;
  }
  var MediaGallery = (function(_PolymerElement) {
    babelHelpers.inherits(MediaGallery, _PolymerElement);
    function MediaGallery() {
      babelHelpers.classCallCheck(this, MediaGallery);
      return babelHelpers.possibleConstructorReturn(
        this,
        (MediaGallery.__proto__ || Object.getPrototypeOf(MediaGallery)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      MediaGallery,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                MediaGallery.prototype.__proto__ ||
                  Object.getPrototypeOf(MediaGallery.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              MediaGallery.haxProperties,
              MediaGallery.tag,
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
              _templateObject_382937b0d6ff11e88222ff1835be4615()
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
                title: "Media gallery",
                description: "Automated conversion of media-gallery/",
                icon: "icons:android",
                color: "green",
                groups: ["Gallery"],
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
            return "media-gallery";
          }
        }
      ]
    );
    return MediaGallery;
  })(_polymerElement.PolymerElement);
  _exports.MediaGallery = MediaGallery;
  window.customElements.define(MediaGallery.tag, MediaGallery);
});
