define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./lib/lrndesign-stepper-button.js"
], function(_exports, _polymerLegacy, _lrndesignStepperButton) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrndesignStepper = void 0;
  function _templateObject_30e7fa60f32c11e8ad6dd1b2f44d5578() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n       :host {\n        display: block;\n      }\n    </style>\n\n    <div class="buttons">\n      <slot id="stepper-children">\n      </slot>\n    </div>\n'
    ]);
    _templateObject_30e7fa60f32c11e8ad6dd1b2f44d5578 = function _templateObject_30e7fa60f32c11e8ad6dd1b2f44d5578() {
      return data;
    };
    return data;
  }
  var LrndesignStepper = (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_30e7fa60f32c11e8ad6dd1b2f44d5578()
    ),
    is: "lrndesign-stepper",
    properties: {},
    ready: function ready() {
      var root = this,
        children = root.getContentChildren("#stepper-children");
      if (1 < children.length) {
        children.forEach(function(child, index) {
          if (0 === index) {
            child.setAttribute("location", "start");
          } else if (index === children.length - 1) {
            child.setAttribute("location", "end");
          } else {
            child.setAttribute("location", "middle");
          }
          console.log(child, index);
        });
      }
    }
  });
  _exports.LrndesignStepper = LrndesignStepper;
});
