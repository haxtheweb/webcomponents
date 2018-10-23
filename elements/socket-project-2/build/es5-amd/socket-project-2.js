define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.SocketProject2 = void 0;
  function _templateObject_a0dd90c0d70a11e8930e51d085aea2a1() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_a0dd90c0d70a11e8930e51d085aea2a1 = function() {
      return data;
    };
    return data;
  }
  var SocketProject2 = (function(_PolymerElement) {
    babelHelpers.inherits(SocketProject2, _PolymerElement);
    function SocketProject2() {
      babelHelpers.classCallCheck(this, SocketProject2);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          SocketProject2.__proto__ || Object.getPrototypeOf(SocketProject2)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      SocketProject2,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                SocketProject2.prototype.__proto__ ||
                  Object.getPrototypeOf(SocketProject2.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              SocketProject2.haxProperties,
              SocketProject2.tag,
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
              _templateObject_a0dd90c0d70a11e8930e51d085aea2a1()
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
                title: "Socket project-2",
                description: "Automated conversion of socket-project2/",
                icon: "icons:android",
                color: "green",
                groups: ["Project"],
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
            return "socket-project-2";
          }
        }
      ]
    );
    return SocketProject2;
  })(_polymerElement.PolymerElement);
  _exports.SocketProject2 = SocketProject2;
  window.customElements.define(SocketProject2.tag, SocketProject2);
});
