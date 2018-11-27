define(["../node_modules/@polymer/polymer/polymer-legacy.js"], function(
  _polymerLegacy
) {
  "use strict";
  function _templateObject_d9387200f1e511e8b6e5fb3c2927ae57() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: none;\n      }\n    </style>\n"
    ]);
    _templateObject_d9387200f1e511e8b6e5fb3c2927ae57 = function _templateObject_d9387200f1e511e8b6e5fb3c2927ae57() {
      return data;
    };
    return data;
  }
  window.RelativeHeadingManager = {};
  window.RelativeHeadingManager.instance = null;
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_d9387200f1e511e8b6e5fb3c2927ae57()
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
