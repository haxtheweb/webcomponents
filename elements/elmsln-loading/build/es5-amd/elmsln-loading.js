define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.ElmslnLoading = void 0;
  function _templateObject_2906cf00d6ef11e8966f7d1a00a811f9() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_2906cf00d6ef11e8966f7d1a00a811f9 = function() {
      return data;
    };
    return data;
  }
  var ElmslnLoading = (function(_PolymerElement) {
    babelHelpers.inherits(ElmslnLoading, _PolymerElement);
    function ElmslnLoading() {
      babelHelpers.classCallCheck(this, ElmslnLoading);
      return babelHelpers.possibleConstructorReturn(
        this,
        (ElmslnLoading.__proto__ || Object.getPrototypeOf(ElmslnLoading)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      ElmslnLoading,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                ElmslnLoading.prototype.__proto__ ||
                  Object.getPrototypeOf(ElmslnLoading.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              ElmslnLoading.haxProperties,
              ElmslnLoading.tag,
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
              _templateObject_2906cf00d6ef11e8966f7d1a00a811f9()
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
                title: "Elmsln loading",
                description: "Automated conversion of elmsln-loading/",
                icon: "icons:android",
                color: "green",
                groups: ["Loading"],
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
            return "elmsln-loading";
          }
        }
      ]
    );
    return ElmslnLoading;
  })(_polymerElement.PolymerElement);
  _exports.ElmslnLoading = ElmslnLoading;
  window.customElements.define(ElmslnLoading.tag, ElmslnLoading);
});
