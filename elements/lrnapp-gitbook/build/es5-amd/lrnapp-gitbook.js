define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrnappGitbook = void 0;
  function _templateObject_c8a5f0d0d6f511e8879fc7e958a46a85() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_c8a5f0d0d6f511e8879fc7e958a46a85 = function() {
      return data;
    };
    return data;
  }
  var LrnappGitbook = (function(_PolymerElement) {
    babelHelpers.inherits(LrnappGitbook, _PolymerElement);
    function LrnappGitbook() {
      babelHelpers.classCallCheck(this, LrnappGitbook);
      return babelHelpers.possibleConstructorReturn(
        this,
        (LrnappGitbook.__proto__ || Object.getPrototypeOf(LrnappGitbook)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      LrnappGitbook,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrnappGitbook.prototype.__proto__ ||
                  Object.getPrototypeOf(LrnappGitbook.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrnappGitbook.haxProperties,
              LrnappGitbook.tag,
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
              _templateObject_c8a5f0d0d6f511e8879fc7e958a46a85()
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
                title: "Lrnapp gitbook",
                description: "Automated conversion of lrnapp-gitbook/",
                icon: "icons:android",
                color: "green",
                groups: ["Gitbook"],
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
            return "lrnapp-gitbook";
          }
        }
      ]
    );
    return LrnappGitbook;
  })(_polymerElement.PolymerElement);
  _exports.LrnappGitbook = LrnappGitbook;
  window.customElements.define(LrnappGitbook.tag, LrnappGitbook);
});
