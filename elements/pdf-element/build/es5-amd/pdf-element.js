define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.PdfElement = void 0;
  function _templateObject_ae4a9530d70211e8a969cf49350be64d() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_ae4a9530d70211e8a969cf49350be64d = function() {
      return data;
    };
    return data;
  }
  var PdfElement = (function(_PolymerElement) {
    babelHelpers.inherits(PdfElement, _PolymerElement);
    function PdfElement() {
      babelHelpers.classCallCheck(this, PdfElement);
      return babelHelpers.possibleConstructorReturn(
        this,
        (PdfElement.__proto__ || Object.getPrototypeOf(PdfElement)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      PdfElement,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                PdfElement.prototype.__proto__ ||
                  Object.getPrototypeOf(PdfElement.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              PdfElement.haxProperties,
              PdfElement.tag,
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
              _templateObject_ae4a9530d70211e8a969cf49350be64d()
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
                title: "Pdf element",
                description: "Automated conversion of pdf-element/",
                icon: "icons:android",
                color: "green",
                groups: ["Element"],
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
            return "pdf-element";
          }
        }
      ]
    );
    return PdfElement;
  })(_polymerElement.PolymerElement);
  _exports.PdfElement = PdfElement;
  window.customElements.define(PdfElement.tag, PdfElement);
});
