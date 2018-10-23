define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrnsysRandomimage = void 0;
  function _templateObject_fb3f1c40d6fc11e88d24892013b3d182() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_fb3f1c40d6fc11e88d24892013b3d182 = function() {
      return data;
    };
    return data;
  }
  var LrnsysRandomimage = (function(_PolymerElement) {
    babelHelpers.inherits(LrnsysRandomimage, _PolymerElement);
    function LrnsysRandomimage() {
      babelHelpers.classCallCheck(this, LrnsysRandomimage);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          LrnsysRandomimage.__proto__ ||
          Object.getPrototypeOf(LrnsysRandomimage)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      LrnsysRandomimage,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrnsysRandomimage.prototype.__proto__ ||
                  Object.getPrototypeOf(LrnsysRandomimage.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrnsysRandomimage.haxProperties,
              LrnsysRandomimage.tag,
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
              _templateObject_fb3f1c40d6fc11e88d24892013b3d182()
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
                title: "Lrnsys randomimage",
                description: "Automated conversion of lrnsys-randomimage/",
                icon: "icons:android",
                color: "green",
                groups: ["Randomimage"],
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
            return "lrnsys-randomimage";
          }
        }
      ]
    );
    return LrnsysRandomimage;
  })(_polymerElement.PolymerElement);
  _exports.LrnsysRandomimage = LrnsysRandomimage;
  window.customElements.define(LrnsysRandomimage.tag, LrnsysRandomimage);
});
