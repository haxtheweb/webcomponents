define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.JwtLogin = void 0;
  function _templateObject_eb1212a0d6f211e8a043adab82696c0e() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_eb1212a0d6f211e8a043adab82696c0e = function() {
      return data;
    };
    return data;
  }
  var JwtLogin = (function(_PolymerElement) {
    babelHelpers.inherits(JwtLogin, _PolymerElement);
    function JwtLogin() {
      babelHelpers.classCallCheck(this, JwtLogin);
      return babelHelpers.possibleConstructorReturn(
        this,
        (JwtLogin.__proto__ || Object.getPrototypeOf(JwtLogin)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      JwtLogin,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                JwtLogin.prototype.__proto__ ||
                  Object.getPrototypeOf(JwtLogin.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              JwtLogin.haxProperties,
              JwtLogin.tag,
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
              _templateObject_eb1212a0d6f211e8a043adab82696c0e()
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
                title: "Jwt login",
                description: "Automated conversion of jwt-login/",
                icon: "icons:android",
                color: "green",
                groups: ["Login"],
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
            return "jwt-login";
          }
        }
      ]
    );
    return JwtLogin;
  })(_polymerElement.PolymerElement);
  _exports.JwtLogin = JwtLogin;
  window.customElements.define(JwtLogin.tag, JwtLogin);
});
