define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.MtzFileDownloadBehavior = void 0;
  function _templateObject_e36d86a0d7f711e8aaacafce7836bad3() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_e36d86a0d7f711e8aaacafce7836bad3 = function() {
      return data;
    };
    return data;
  }
  var MtzFileDownloadBehavior = (function(_PolymerElement) {
    babelHelpers.inherits(MtzFileDownloadBehavior, _PolymerElement);
    function MtzFileDownloadBehavior() {
      babelHelpers.classCallCheck(this, MtzFileDownloadBehavior);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          MtzFileDownloadBehavior.__proto__ ||
          Object.getPrototypeOf(MtzFileDownloadBehavior)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      MtzFileDownloadBehavior,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                MtzFileDownloadBehavior.prototype.__proto__ ||
                  Object.getPrototypeOf(MtzFileDownloadBehavior.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              MtzFileDownloadBehavior.haxProperties,
              MtzFileDownloadBehavior.tag,
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
              _templateObject_e36d86a0d7f711e8aaacafce7836bad3()
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
                title: "Mtz file-download-behavior",
                description: "Start of mtz-file-download-behavior fork",
                icon: "icons:android",
                color: "green",
                groups: ["File"],
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
            return "mtz-file-download-behavior";
          }
        }
      ]
    );
    return MtzFileDownloadBehavior;
  })(_polymerElement.PolymerElement);
  _exports.MtzFileDownloadBehavior = MtzFileDownloadBehavior;
  window.customElements.define(
    MtzFileDownloadBehavior.tag,
    MtzFileDownloadBehavior
  );
});
