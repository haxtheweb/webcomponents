define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.PageScrollPosition = void 0;
  function _templateObject_b5c10da0d70011e8ae85f364eccec91b() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_b5c10da0d70011e8ae85f364eccec91b = function() {
      return data;
    };
    return data;
  }
  var PageScrollPosition = (function(_PolymerElement) {
    babelHelpers.inherits(PageScrollPosition, _PolymerElement);
    function PageScrollPosition() {
      babelHelpers.classCallCheck(this, PageScrollPosition);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          PageScrollPosition.__proto__ ||
          Object.getPrototypeOf(PageScrollPosition)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      PageScrollPosition,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                PageScrollPosition.prototype.__proto__ ||
                  Object.getPrototypeOf(PageScrollPosition.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              PageScrollPosition.haxProperties,
              PageScrollPosition.tag,
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
              _templateObject_b5c10da0d70011e8ae85f364eccec91b()
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
                title: "Page scroll-position",
                description: "Automated conversion of page-scroll-position/",
                icon: "icons:android",
                color: "green",
                groups: ["Scroll"],
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
            return "page-scroll-position";
          }
        }
      ]
    );
    return PageScrollPosition;
  })(_polymerElement.PolymerElement);
  _exports.PageScrollPosition = PageScrollPosition;
  window.customElements.define(PageScrollPosition.tag, PageScrollPosition);
});
