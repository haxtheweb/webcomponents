define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.BeakerBroker = void 0;
  function _templateObject_d3da0010cbc711e8bb5eb9c99afa7b8f() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_d3da0010cbc711e8bb5eb9c99afa7b8f = function() {
      return data;
    };
    return data;
  }
  var BeakerBroker = (function(_PolymerElement) {
    babelHelpers.inherits(BeakerBroker, _PolymerElement);
    function BeakerBroker() {
      babelHelpers.classCallCheck(this, BeakerBroker);
      return babelHelpers.possibleConstructorReturn(
        this,
        (BeakerBroker.__proto__ || Object.getPrototypeOf(BeakerBroker)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      BeakerBroker,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                BeakerBroker.prototype.__proto__ ||
                  Object.getPrototypeOf(BeakerBroker.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              BeakerBroker.haxProperties,
              BeakerBroker.tag,
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
              _templateObject_d3da0010cbc711e8bb5eb9c99afa7b8f()
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
                title: "Beaker broker",
                description: "Automated conversion of beaker-broker",
                icon: "icons:android",
                color: "green",
                groups: ["Broker"],
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
            return "beaker-broker";
          }
        }
      ]
    );
    return BeakerBroker;
  })(_polymerElement.PolymerElement);
  _exports.BeakerBroker = BeakerBroker;
  window.customElements.define(BeakerBroker.tag, BeakerBroker);
});
