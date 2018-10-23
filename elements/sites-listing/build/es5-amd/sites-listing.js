define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.SitesListing = void 0;
  function _templateObject_b15fc7a0d70611e8bed53381ebbc6fd2() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_b15fc7a0d70611e8bed53381ebbc6fd2 = function() {
      return data;
    };
    return data;
  }
  var SitesListing = (function(_PolymerElement) {
    babelHelpers.inherits(SitesListing, _PolymerElement);
    function SitesListing() {
      babelHelpers.classCallCheck(this, SitesListing);
      return babelHelpers.possibleConstructorReturn(
        this,
        (SitesListing.__proto__ || Object.getPrototypeOf(SitesListing)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      SitesListing,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                SitesListing.prototype.__proto__ ||
                  Object.getPrototypeOf(SitesListing.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              SitesListing.haxProperties,
              SitesListing.tag,
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
              _templateObject_b15fc7a0d70611e8bed53381ebbc6fd2()
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
                title: "Sites listing",
                description: "Automated conversion of sites-listing/",
                icon: "icons:android",
                color: "green",
                groups: ["Listing"],
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
            return "sites-listing";
          }
        }
      ]
    );
    return SitesListing;
  })(_polymerElement.PolymerElement);
  _exports.SitesListing = SitesListing;
  window.customElements.define(SitesListing.tag, SitesListing);
});
