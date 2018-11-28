define(["../node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_fef299f0f32d11e8a9d5f75006fb4cf1() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: none;\n      }\n    </style>\n"
    ]);
    _templateObject_fef299f0f32d11e8a9d5f75006fb4cf1 = function _templateObject_fef299f0f32d11e8a9d5f75006fb4cf1() {
      return data;
    };
    return data;
  }
  window.RelativeHeadingManager = {};
  window.RelativeHeadingManager.instance = null;
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_fef299f0f32d11e8a9d5f75006fb4cf1()
    ),
    is: "relative-heading-manager",
    properties: {},
    created: function created() {
      var root = this;
      if (!window.RelativeHeadingManager.instance) {
        window.RelativeHeadingManager.instance = root;
      }
      document.body.addEventListener("heading-created", function(e) {
        var el = e.detail,
          pid = el.getAttribute("subtopic-of"),
          parent = document.getElementById(pid);
        if (parent !== el.parentHeading) {
          el._setParent(parent);
        }
      });
    }
  });
  window.RelativeHeadingManager.requestAvailability = function() {
    if (!window.RelativeHeadingManager.instance) {
      window.RelativeHeadingManager.instance = document.createElement(
        "relative-heading-manager"
      );
    }
    document.body.appendChild(window.RelativeHeadingManager.instance);
  };
});
