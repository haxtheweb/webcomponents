define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.SimpleDatetime = void 0;
  function _templateObject_fbe72d00d70511e88d41d7a001847683() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_fbe72d00d70511e88d41d7a001847683 = function() {
      return data;
    };
    return data;
  }
  var SimpleDatetime = (function(_PolymerElement) {
    babelHelpers.inherits(SimpleDatetime, _PolymerElement);
    function SimpleDatetime() {
      babelHelpers.classCallCheck(this, SimpleDatetime);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          SimpleDatetime.__proto__ || Object.getPrototypeOf(SimpleDatetime)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      SimpleDatetime,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                SimpleDatetime.prototype.__proto__ ||
                  Object.getPrototypeOf(SimpleDatetime.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              SimpleDatetime.haxProperties,
              SimpleDatetime.tag,
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
              _templateObject_fbe72d00d70511e88d41d7a001847683()
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
                title: "Simple datetime",
                description: "Automated conversion of simple-datetime/",
                icon: "icons:android",
                color: "green",
                groups: ["Datetime"],
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
            return "simple-datetime";
          }
        }
      ]
    );
    return SimpleDatetime;
  })(_polymerElement.PolymerElement);
  _exports.SimpleDatetime = SimpleDatetime;
  window.customElements.define(SimpleDatetime.tag, SimpleDatetime);
});
