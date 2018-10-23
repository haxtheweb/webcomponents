define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.PaperFabTransitions = void 0;
  function _templateObject_3af4a1d0d70111e89b8211aecc6a2d1a() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_3af4a1d0d70111e89b8211aecc6a2d1a = function() {
      return data;
    };
    return data;
  }
  var PaperFabTransitions = (function(_PolymerElement) {
    babelHelpers.inherits(PaperFabTransitions, _PolymerElement);
    function PaperFabTransitions() {
      babelHelpers.classCallCheck(this, PaperFabTransitions);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          PaperFabTransitions.__proto__ ||
          Object.getPrototypeOf(PaperFabTransitions)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      PaperFabTransitions,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                PaperFabTransitions.prototype.__proto__ ||
                  Object.getPrototypeOf(PaperFabTransitions.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              PaperFabTransitions.haxProperties,
              PaperFabTransitions.tag,
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
              _templateObject_3af4a1d0d70111e89b8211aecc6a2d1a()
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
                title: "Paper fab-transitions",
                description: "Automated conversion of paper-fab-transitions/",
                icon: "icons:android",
                color: "green",
                groups: ["Fab"],
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
            return "paper-fab-transitions";
          }
        }
      ]
    );
    return PaperFabTransitions;
  })(_polymerElement.PolymerElement);
  _exports.PaperFabTransitions = PaperFabTransitions;
  window.customElements.define(PaperFabTransitions.tag, PaperFabTransitions);
});
