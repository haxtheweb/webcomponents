define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrnappGalleryGrid = void 0;
  function _templateObject_ade90020d6f511e8ab12cd861f9bc5ce() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_ade90020d6f511e8ab12cd861f9bc5ce = function() {
      return data;
    };
    return data;
  }
  var LrnappGalleryGrid = (function(_PolymerElement) {
    babelHelpers.inherits(LrnappGalleryGrid, _PolymerElement);
    function LrnappGalleryGrid() {
      babelHelpers.classCallCheck(this, LrnappGalleryGrid);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          LrnappGalleryGrid.__proto__ ||
          Object.getPrototypeOf(LrnappGalleryGrid)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      LrnappGalleryGrid,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrnappGalleryGrid.prototype.__proto__ ||
                  Object.getPrototypeOf(LrnappGalleryGrid.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrnappGalleryGrid.haxProperties,
              LrnappGalleryGrid.tag,
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
              _templateObject_ade90020d6f511e8ab12cd861f9bc5ce()
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
                title: "Lrnapp gallery-grid",
                description: "Automated conversion of lrnapp-gallery-grid/",
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
            return "lrnapp-gallery-grid";
          }
        }
      ]
    );
    return LrnappGalleryGrid;
  })(_polymerElement.PolymerElement);
  _exports.LrnappGalleryGrid = LrnappGalleryGrid;
  window.customElements.define(LrnappGalleryGrid.tag, LrnappGalleryGrid);
});
