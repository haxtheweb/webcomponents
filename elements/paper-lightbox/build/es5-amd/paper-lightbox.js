define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.PaperLightbox = void 0;
  function _templateObject_246cb2d0d70211e888e4918ee31929c8() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_246cb2d0d70211e888e4918ee31929c8 = function() {
      return data;
    };
    return data;
  }
  var PaperLightbox = (function(_PolymerElement) {
    babelHelpers.inherits(PaperLightbox, _PolymerElement);
    function PaperLightbox() {
      babelHelpers.classCallCheck(this, PaperLightbox);
      return babelHelpers.possibleConstructorReturn(
        this,
        (PaperLightbox.__proto__ || Object.getPrototypeOf(PaperLightbox)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      PaperLightbox,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                PaperLightbox.prototype.__proto__ ||
                  Object.getPrototypeOf(PaperLightbox.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              PaperLightbox.haxProperties,
              PaperLightbox.tag,
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
              _templateObject_246cb2d0d70211e888e4918ee31929c8()
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
                title: "Paper lightbox",
                description: "Automated conversion of paper-lightbox/",
                icon: "icons:android",
                color: "green",
                groups: ["Lightbox"],
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
            return "paper-lightbox";
          }
        }
      ]
    );
    return PaperLightbox;
  })(_polymerElement.PolymerElement);
  _exports.PaperLightbox = PaperLightbox;
  window.customElements.define(PaperLightbox.tag, PaperLightbox);
});
