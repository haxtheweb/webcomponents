define([
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/polymer/lib/utils/async.js",
  "./node_modules/@polymer/iron-resizable-behavior/iron-resizable-behavior.js"
], function(_polymerLegacy, async, _ironResizableBehavior) {
  "use strict";
  async = babelHelpers.interopRequireWildcard(async);
  function _templateObject_b2a812d0dbab11e8a79519efe287808b() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n    <style>\n      :host {\n        display: inline;\n      }\n    </style>\n    <slot></slot>\n"
    ]);
    _templateObject_b2a812d0dbab11e8a79519efe287808b = function() {
      return data;
    };
    return data;
  }
  window.ResponsiveUtility = {};
  window.ResponsiveUtility.instance = null;
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_b2a812d0dbab11e8a79519efe287808b()
    ),
    is: "responsive-utility",
    behaviors: [_ironResizableBehavior.IronResizableBehavior],
    listeners: { "iron-resize": "_onIronResize" },
    properties: { targets: { type: Array, value: [] } },
    created: function created() {
      var root = this;
      if (null == window.ResponsiveUtility.instance) {
        window.ResponsiveUtility.instance = root;
      }
      document.body.addEventListener("responsive-element", function(e) {
        var relative =
          e.detail.relativeToParent !== void 0 &&
          null !== e.detail.relativeToParent
            ? e.detail.relativeToParent
            : !0;
        if ("ResizeObserver" in window && !0 === relative.relativeToParent) {
          var parent = e.detail.element.parentNode,
            resize = new ResizeObserver(function() {
              window.ResponsiveUtility.setSize(e.detail);
            });
          if (parent.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
            parent = parent.host;
          }
          resize.observe(parent);
        }
        root.push("targets", e.detail);
        window.ResponsiveUtility.setSize(e.detail);
      });
      document.body.addEventListener("delete-responsive-element", function(e) {
        for (var i = 0; i < this.targets.length; i++) {
          if (e.detail === target[i]) root.splice("targets", i, 1);
        }
      });
    },
    _onIronResize: function _onIronResize() {
      for (var i = 0; i < this.targets.length; i++) {
        window.ResponsiveUtility.setSize(this.targets[i]);
      }
    }
  });
  window.ResponsiveUtility.requestAvailability = function() {
    if (null == window.ResponsiveUtility.instance) {
      window.ResponsiveUtility.instance = document.createElement(
        "responsive-utility"
      );
    }
    document.body.appendChild(window.ResponsiveUtility.instance);
  };
  window.ResponsiveUtility.setSize = function(target) {
    var element = target.element,
      attribute =
        target.attribute !== void 0 && null !== target.attribute
          ? target.attribute
          : "responsive-size",
      size = window.ResponsiveUtility.getSize(target);
    if (
      element.getAttribute(attribute) === void 0 ||
      size !== element.getAttribute(attribute)
    ) {
      element.setAttribute(attribute, size);
    }
  };
  window.ResponsiveUtility.getSize = function(target) {
    var relative =
        target.relativeToParent !== void 0 && null !== target.relativeToParent
          ? target.relativeToParent
          : !0,
      testBreakpoint = function(width, breakpoint, def) {
        var val =
          breakpoint !== void 0 && null !== breakpoint ? breakpoint : def;
        return width < val;
      },
      size,
      width = (function getWidth() {
        if (null !== target.element.parentNode && !0 === relative) {
          if (
            target.element.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE
          ) {
            return target.element.parentNode.host.offsetWidth;
          }
          return target.element.parentNode.offsetWidth;
        }
        return window.outerWidth;
      })();
    if (testBreakpoint(width, target.sm, 600)) {
      size = "xs";
    } else if (testBreakpoint(width, target.md, 900)) {
      size = "sm";
    } else if (testBreakpoint(width, target.lg, 1200)) {
      size = "md";
    } else if (testBreakpoint(width, target.xl, 1200)) {
      size = "lg";
    } else {
      size = "xl";
    }
    return size;
  };
});
