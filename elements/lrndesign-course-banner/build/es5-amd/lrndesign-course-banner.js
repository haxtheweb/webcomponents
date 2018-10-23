define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrndesignCourseBanner = void 0;
  function _templateObject_425e2620d6f811e8a86697a73bee0054() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_425e2620d6f811e8a86697a73bee0054 = function() {
      return data;
    };
    return data;
  }
  var LrndesignCourseBanner = (function(_PolymerElement) {
    babelHelpers.inherits(LrndesignCourseBanner, _PolymerElement);
    function LrndesignCourseBanner() {
      babelHelpers.classCallCheck(this, LrndesignCourseBanner);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          LrndesignCourseBanner.__proto__ ||
          Object.getPrototypeOf(LrndesignCourseBanner)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      LrndesignCourseBanner,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrndesignCourseBanner.prototype.__proto__ ||
                  Object.getPrototypeOf(LrndesignCourseBanner.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrndesignCourseBanner.haxProperties,
              LrndesignCourseBanner.tag,
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
              _templateObject_425e2620d6f811e8a86697a73bee0054()
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
                title: "Lrndesign course-banner",
                description: "Automated conversion of lrndesign-course-banner/",
                icon: "icons:android",
                color: "green",
                groups: ["Course"],
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
            return "lrndesign-course-banner";
          }
        }
      ]
    );
    return LrndesignCourseBanner;
  })(_polymerElement.PolymerElement);
  _exports.LrndesignCourseBanner = LrndesignCourseBanner;
  window.customElements.define(
    LrndesignCourseBanner.tag,
    LrndesignCourseBanner
  );
});
